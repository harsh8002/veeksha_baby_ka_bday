(() => {
  'use strict';

  // Personalize the greeting by changing the name below, or opening the link with ?name=Name.
  const params = new URLSearchParams(window.location.search);
  const recipient = (params.get('name') || 'you').trim().slice(0, 32) || 'you';
  document.getElementById('recipient-name').textContent = recipient;
  document.title = recipient.toLowerCase() === 'you' ? 'A Little Celebration ♡' : `A Little Celebration for ${recipient} ♡`;

  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function burstConfetti(amount = 85) {
    const layer = document.getElementById('confetti-layer');
    const colors = ['#ff8db5', '#ffd58a', '#c7a7ff', '#ffc1a5', '#fff1d4', '#a7d9ce'];
    for (let i = 0; i < amount; i++) {
      const piece = document.createElement('i');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.setProperty('--duration', `${2.2 + Math.random() * 2.2}s`);
      piece.style.setProperty('--drift', `${Math.round((Math.random() - .5) * 190)}px`);
      piece.style.animationDelay = `${Math.random() * .65}s`;
      if (Math.random() > .55) piece.style.borderRadius = '50%';
      layer.appendChild(piece);
      piece.addEventListener('animationend', () => piece.remove(), { once: true });
    }
  }

  // Background soundtrack: checks the repository root first, then ./assets/.
  // Audible autoplay may be blocked by mobile browsers until the first visitor gesture.
  const backgroundMusic = document.getElementById('birthday-audio');
  const musicButton = document.getElementById('sound-toggle');
  const musicLabel = document.getElementById('music-label');
  const musicPlayer = document.getElementById('mini-player');
  const musicStatus = document.getElementById('music-status');
  const musicTrack = document.getElementById('music-track');
  const musicControlIcon = document.getElementById('music-control-icon');
  const progressFill = document.getElementById('music-progress-fill');
  const currentTimeLabel = document.getElementById('music-current');
  const durationLabel = document.getElementById('music-duration');
  const musicSources = ['./audio.mp3', './assets/audio.mp3'];
  let musicSourceIndex = 0;
  let musicPlaying = false;
  let soundOn = false;
  let audioContext = null;
  let musicErrorShown = false;
  let visitorRequestedMusic = false;

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${remainingSeconds}`;
  }

  function refreshMusicProgress() {
    const duration = backgroundMusic.duration;
    const current = backgroundMusic.currentTime || 0;
    const percent = Number.isFinite(duration) && duration > 0 ? (current / duration) * 100 : 0;
    progressFill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
    currentTimeLabel.textContent = formatTime(current);
    durationLabel.textContent = formatTime(duration);
  }

  function updateMusicPlayer(playing) {
    musicPlaying = playing;
    soundOn = playing;
    musicPlayer.classList.toggle('is-playing', playing);
    musicPlayer.dataset.state = playing ? 'playing' : 'paused';
    musicButton.setAttribute('aria-pressed', String(playing));
    musicButton.setAttribute('aria-label', playing ? 'Pause birthday music' : 'Play birthday music');
    musicLabel.textContent = playing ? 'Pause birthday music' : 'Play birthday music';
    musicControlIcon.textContent = playing ? 'Ⅱ' : '▶';
    musicStatus.textContent = playing ? 'NOW PLAYING' : 'TAP TO PLAY';
    if (!playing) refreshMusicProgress();
  }

  function loadMusicSource(index) {
    musicSourceIndex = index;
    backgroundMusic.src = musicSources[index];
    backgroundMusic.load();
  }

  function playBackgroundMusic(fromUser = false) {
    if (fromUser) visitorRequestedMusic = true;
    const attempt = backgroundMusic.play();
    if (attempt && typeof attempt.then === 'function') {
      attempt.then(() => {
        updateMusicPlayer(true);
        if (fromUser) showToast('A little soundtrack for your day ♡');
      }).catch(() => {
        updateMusicPlayer(false);
        // Autoplay rejection is expected on many mobile browsers; first gesture retries.
      });
    }
  }

  backgroundMusic.addEventListener('error', () => {
    if (musicSourceIndex < musicSources.length - 1) {
      // If the root-level file is absent, transparently try assets/audio.mp3.
      loadMusicSource(musicSourceIndex + 1);
      playBackgroundMusic(visitorRequestedMusic);
    } else {
      updateMusicPlayer(false);
      musicStatus.textContent = 'ADD AUDIO.MP3';
      musicTrack.textContent = 'place it in root or assets/';
      if (!musicErrorShown) {
        musicErrorShown = true;
        if (musicButton.dataset.userTried === 'true') {
          showToast('Add audio.mp3 to the root folder or assets folder ♡');
        }
      }
    }
  });

  backgroundMusic.addEventListener('play', () => updateMusicPlayer(true));
  backgroundMusic.addEventListener('pause', () => updateMusicPlayer(false));
  backgroundMusic.addEventListener('timeupdate', refreshMusicProgress);
  backgroundMusic.addEventListener('loadedmetadata', refreshMusicProgress);
  backgroundMusic.addEventListener('durationchange', refreshMusicProgress);

  musicButton.addEventListener('click', () => {
    musicButton.dataset.userTried = 'true';
    if (musicPlaying) {
      backgroundMusic.pause();
      showToast('Music paused. Tap whenever you want it back ♡');
      return;
    }
    playBackgroundMusic(true);
  });

  // If autoplay was blocked, the first tap anywhere on the page unlocks the soundtrack.
  // The player button handles itself, so its click never toggles twice.
  function unlockMusicOnFirstGesture(event) {
    document.removeEventListener('pointerdown', unlockMusicOnFirstGesture);
    if (event.target.closest('#mini-player')) return;
    if (!musicPlaying) playBackgroundMusic(true);
  }
  document.addEventListener('pointerdown', unlockMusicOnFirstGesture, { passive: true });

  // Try audible autoplay as soon as the page loads. Browser policy may require a tap.
  loadMusicSource(0);
  playBackgroundMusic(false);

  // Optional tiny chimes accompany interactions whenever the soundtrack is enabled.
  function playChime() {
    if (!soundOn) return;
    try {
      audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
      if (audioContext.state === 'suspended') audioContext.resume();
      const now = audioContext.currentTime;
      [659.25, 783.99, 987.77].forEach((frequency, index) => {
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(.0001, now + index * .095);
        gain.gain.exponentialRampToValueAtTime(.045, now + index * .095 + .025);
        gain.gain.exponentialRampToValueAtTime(.0001, now + index * .095 + .42);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(now + index * .095);
        oscillator.stop(now + index * .095 + .45);
      });
    } catch (_) { /* Audio is optional; the page works without it. */ }
  }

  document.getElementById('open-surprise').addEventListener('click', () => {
    document.getElementById('surprise').scrollIntoView({ behavior: 'smooth' });
    burstConfetti(48);
    playChime();
  });

  const surpriseContent = document.getElementById('surprise-content');
  const surpriseNote = document.getElementById('surprise-note');
  document.getElementById('reveal-wish').addEventListener('click', () => {
    surpriseContent.hidden = true;
    surpriseNote.hidden = false;
    burstConfetti(34);
    playChime();
  });
  document.getElementById('close-wish').addEventListener('click', () => {
    surpriseNote.hidden = true;
    surpriseContent.hidden = false;
  });

  let heartsUnlocked = 0;
  const count = document.getElementById('heart-count');
  const thought = document.getElementById('thought-text');
  document.querySelectorAll('.heart-button').forEach((heart) => {
    heart.addEventListener('click', () => {
      thought.textContent = heart.dataset.message;
      heartsUnlocked += 1;
      count.textContent = heartsUnlocked;
      heart.classList.remove('heart-pop');
      // Restart a small pop animation without relying on a CSS class being present.
      heart.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.45) rotate(-12deg)' },
        { transform: 'scale(1)' }
      ], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)' });
      playChime();
      if (heartsUnlocked === 5) showToast('Five little reminders, all for you. ♡');
      if (heartsUnlocked % 5 === 0) burstConfetti(22);
    });
  });

  document.getElementById('forecast-button').addEventListener('click', () => {
    const forecasts = [
      'Forecast update: 100% chance of laughter, with cake showers later. ☀',
      'The stars say: good news, kind people and a very sweet year ahead. ✨',
      'Today’s outlook: main-character energy with zero chance of dull moments. ✿'
    ];
    showToast(forecasts[Math.floor(Math.random() * forecasts.length)]);
    playChime();
  });

  let wishMade = false;
  document.getElementById('wish-button').addEventListener('click', () => {
    const flame = document.getElementById('flame');
    const result = document.getElementById('wish-result');
    if (!wishMade) {
      flame.classList.add('out');
      result.textContent = 'A little wish, sent with a lot of warmth. ♡';
      document.getElementById('wish-button').querySelector('span:first-child').textContent = 'Light the candle again';
      burstConfetti(110);
      playChime();
      wishMade = true;
    } else {
      flame.classList.remove('out');
      result.textContent = 'A fresh little spark, just for you.';
      document.getElementById('wish-button').querySelector('span:first-child').textContent = 'Make another wish';
      playChime();
    }
  });

  document.getElementById('share-button').addEventListener('click', async () => {
    const shareData = {
      title: `A little celebration for ${recipient}`,
      text: 'A tiny birthday page made with warm wishes and a little extra affection. ♡',
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Birthday link copied. Send a little happiness! ♡');
      } else {
        const input = document.createElement('textarea');
        input.value = window.location.href;
        input.style.position = 'fixed'; input.style.opacity = '0';
        document.body.appendChild(input); input.select();
        document.execCommand('copy'); input.remove();
        showToast('Birthday link copied. Send a little happiness! ♡');
      }
    } catch (error) {
      if (error && error.name !== 'AbortError') showToast('Sharing is not available in this browser.');
    }
  });

  // Lightweight installable-app support. The page remains fully usable without it.
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  }
})();
