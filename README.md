# A Little Celebration ✨

A premium-feel, mobile-first birthday microsite. It is a static website: no backend, login, database, build step, paid service, or API key is required.

## Preview locally

Open `index.html` in a browser, or run a local server from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Personalize the greeting

The default greeting says “you”. Add the recipient's first name with a URL parameter:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/?name=Ananya
```

Or change the fallback name in `script.js`:

```js
const recipient = (params.get('name') || 'you').trim().slice(0, 32) || 'you';
```

The page intentionally avoids romantic wording. Edit the birthday note in `index.html` if you want to make it more personal.

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
- Optional tiny synthesized chimes (off by default)
- Native share sheet or copy-link fallback
- Installable/offline-friendly PWA shell
- Responsive layout and reduced-motion support

## Notes

- Google Fonts are loaded over the internet; system font fallbacks are included.
- Confetti, animations and chimes are generated locally in the browser.
- No visitor information is collected or sent to a server.
