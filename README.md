# A Little Celebration ♡

A premium-feel, mobile-first birthday microsite. It is a static website: no backend, login, database, build step, paid service, or API key is required.

## Preview locally

Open `index.html` in a browser, or run a local server from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Add your background music

Place your music file in either of these locations (the website checks both):

```text
audio.mp3
```

or

```text
assets/audio.mp3
```

The page attempts to autoplay the track on load and keeps it looping. Modern mobile browsers often block audible autoplay until the visitor taps the page; the compact vinyl-style player stays pinned at the top and the first-tap fallback starts playback as soon as browser policy allows. The record rotates while music is playing. The player also shows playback progress and elapsed/total time, and the visitor can pause or resume with its play button.

Use an MP3 file you have permission to share. For reliable playback on mobile, keep the file reasonably compressed (for example, 128–192 kbps).

## Personalize the greeting

The default greeting says “you”. Add the recipient's first name with a URL parameter:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/?name=Ananya
```

Or change the fallback name in `script.js`:

```js
const recipient = (params.get('name') || 'you').trim().slice(0, 32) || 'you';
```

The page uses warm, affectionate birthday wording without an overt romantic confession. Edit the birthday note and heart messages in `index.html` to make it more personal.

## Easy updates with GitHub Desktop (recommended)

You do not need to delete files from GitHub or upload the entire project again for every change.

1. Install [GitHub Desktop](https://desktop.github.com/) and sign in.
2. In GitHub Desktop, choose **File → Clone repository**, select this birthday repository, and choose a folder on your computer.
3. Extract the contents of each future update ZIP directly into that cloned repository folder. Allow Windows to **Replace the files in the destination** when asked. Do not put the contents inside an extra nested folder. Keep your `audio.mp3` in the repository root or `assets/` folder.
4. Open GitHub Desktop. It will list the modified files automatically.
5. Enter a summary such as `Update birthday player`, click **Commit to main**, then click **Push origin**.

That's it. Future updates are just: extract over the same local folder → Commit → Push. No manual deletion or re-uploading on the GitHub website. GitHub Desktop's official guide: https://docs.github.com/en/desktop/overview/creating-your-first-repository-using-github-desktop

## Publish with GitHub Pages

1. Create a new GitHub repository (for example, `birthday-surprise`).
2. Upload the contents of this folder to the repository root. `index.html` must be at the root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/(root)`, then save.
5. Wait for GitHub Pages to publish and open the URL shown on that settings page.
6. Append `?name=HerName` to personalize the greeting link.

## Included interactions

- Surprise note reveal and confetti
- Tap-to-unlock happy thoughts
- Birthday forecast message
- Interactive cake candle / wish moment
- Background music with autoplay attempt, first-interaction fallback, loop, pause and resume (add `audio.mp3`)
- Tiny synthesized chimes accompany interactions while background music is playing
- Native share sheet or copy-link fallback
- Installable/offline-friendly PWA shell
- Responsive layout and reduced-motion support

## Notes

- Google Fonts are loaded over the internet; system font fallbacks are included.
- Confetti, animations and chimes are generated locally in the browser.
- No visitor information is collected or sent to a server.
