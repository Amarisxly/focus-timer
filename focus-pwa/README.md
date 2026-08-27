# Focus — installable PWA

Plain HTML/CSS/JS, no build step. Files:

- `index.html` — app shell
- `styles.css` — pure-black monochrome design
- `app.js` — all app logic (clock, timer, labels, swipeable queue)
- `manifest.webmanifest` — install metadata
- `sw.js` — offline app-shell caching
- `icons/` — app icons (192, 512, maskable, apple-touch, favicon)

## Try it locally

Service workers require `http://localhost` or `https://` — opening `index.html`
directly via `file://` will run the app but skip offline caching and install.

```bash
cd focus-pwa
python3 -m http.server 8080
# open http://localhost:8080
```

## Deploy

Upload the whole folder as-is to any static host (GitHub Pages, Netlify,
Vercel, Cloudflare Pages, S3, etc.) — no build step needed. Once it's served
over HTTPS:

- **iOS**: open in Safari → Share → *Add to Home Screen*.
- **Android/desktop Chrome**: an *Install* prompt appears in the address bar,
  or use the browser menu → *Install app*.

## Notes

- Icons are generated PNGs with a simple ring mark. Swap the files in
  `icons/` (keeping the same names/sizes) to use your own artwork.
- `sw.js` caches the app shell on first load so the timer keeps working
  offline; bump `CACHE` (e.g. `focus-cache-v2`) whenever you ship changes so
  returning visitors pick up the new files.
