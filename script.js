(() => {
  'use strict';

  // Personalize the greeting by changing the name below, or opening the link with ?name=Name.
  const params = new URLSearchParams(window.location.search);
  const recipient = (params.get('name') || 'you').trim().slice(0, 32) || 'you';
  document.getElementById('recipient-name').textContent = recipient;
  document.title = recipient.toLowerCase() === 'you' ? 'A Little Celebration ✨' : `A Little Celebration for ${recipient} ✨`;

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

  // Optional, generated celebration notes: no audio files or external music needed.
  let audioContext = null;
  let soundOn = false;
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
        gain.gain.exponentialRampToValueAtTime(.075, now + index * .095 + .025);
        gain.gain.exponentialRampToValueAtTime(.0001, now + index * .095 + .42);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start(now + index * .095);
        oscillator.stop(now + index * .095 + .45);
      });
    } catch (_) { /* Sound is an optional enhancement; the app works without it. */ }
  }

  document.getElementById('sound-toggle').addEventListener('click', (event) => {
    soundOn = !soundOn;
    event.currentTarget.setAttribute('aria-pressed', String(soundOn));
    event.currentTarget.setAttribute('aria-label', soundOn ? 'Turn celebration sounds off' : 'Turn celebration sounds on');
    showToast(soundOn ? 'Tiny celebration sounds are on ✨' : 'Sounds turned off');
    if (soundOn) playChime();
  });

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
      if (heartsUnlocked === 5) showToast('Five happy thoughts unlocked. Keep going!');
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
      result.textContent = 'Wish sent to the universe. ✨';
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
      text: 'A tiny corner of the internet filled with birthday wishes and good vibes. ✨',
      url: window.location.href
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Birthday link copied. Send the good vibes! ✨');
      } else {
        const input = document.createElement('textarea');
        input.value = window.location.href;
        input.style.position = 'fixed'; input.style.opacity = '0';
        document.body.appendChild(input); input.select();
        document.execCommand('copy'); input.remove();
        showToast('Birthday link copied. Send the good vibes! ✨');
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
