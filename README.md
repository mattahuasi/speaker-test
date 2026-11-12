# Speaker Test

Speaker Test is a simple web application to test the left, right, or both audio channels independently. It is designed to verify speakers, headphones, or sound systems from the browser without installing anything.

## Live site

You can visit the published version here:

https://audio-speaker-test.vercel.app/

The root URL detects the browser language and redirects to the matching version.

English version: https://audio-speaker-test.vercel.app/en

Spanish version: https://audio-speaker-test.vercel.app/es

## Features

- Left channel test
- Right channel test
- Both channels playback
- Light and dark theme toggle
- Sequential auto-test of channels
- English and Spanish interfaces and troubleshooting guides
- Responsive design for mobile and desktop
- Support for installation as a PWA

## Project structure

```text
speaker-test/
├── index.html
├── en/
│   └── index.html
├── es/
│   └── index.html
├── favicon.ico
├── icon.svg
├── apple-touch-icon.png
├── og-image.png
├── site.webmanifest
├── css/
│   └── style.css
├── js/
│   └── app.js
└── scripts/
    ├── generate-voices.py
    └── serve.py
```

## Usage

1. Run `python scripts/serve.py` (or `python scripts/serve.py 3000`) and open `http://localhost:8000/`. This local server keeps clean URLs such as `/en` and `/es`; plain `python -m http.server` redirects directories to `/en/` and `/es/`. Shared assets use root-relative URLs, so opening the HTML as a local file is not supported. If you previously used `python -m http.server`, clear the cached 301 redirect or use a different port before testing again.
2. Click **Left**, **Right**, or **Both channels** to play the audio.
3. Use **Auto-test all channels** to listen to the channels sequentially.
4. Switch between light and dark themes with the top button.

## Resource files

- `favicon.ico`: site icon for browser tabs.
- `icon.svg`: main vector icon.
- `apple-touch-icon.png`: icon for Apple devices.
- `og-image.png`: image for sharing on social media.
- `site.webmanifest`: configuration for PWA installation.

## Notes

- The project is built with pure HTML, CSS, and JavaScript.
- No external dependencies are required.
- For the best experience, test with headphones or stereo speakers.
- Female voice clips match the page language: Aria (US English) says Left/Right/Both, and Dalia (Mexican Spanish) says Izquierda/Derecha/Ambos.
- Audio files are served locally from `audio/en/` and `audio/es/`. Playback does not call a speech service or require microphone permissions.

## Regenerating voice clips

The six mono WAV files are committed as static assets; no Python dependencies are needed to serve the app. To regenerate them with an internet connection:

```sh
python -m pip install edge-tts==7.3.1 miniaudio==1.71
python scripts/generate-voices.py
```

The generator uses `en-US-AriaNeural` and `es-MX-DaliaNeural` at a slightly slower rate, normalizes active-speech volume with peak headroom, and saves 24 kHz mono PCM audio. Web Audio routes each file explicitly to the left, right or both output channels. Failed downloads can be retried by clicking again.

## SEO and publishing

- `/` redirects to `/en` or `/es` based on the browser's `Accept-Language` header. The static `index.html` provides the same redirect for local servers.
- `/en` is the English page and `/es` is the Spanish page. Both contain crawlable HTML, a self-referencing canonical, reciprocal language alternates and localized application metadata.
- `sitemap.xml` lists both pages. `robots.txt` points to the sitemap.
- `vercel.json` enables clean URLs without trailing slashes, so the pages use `/en` and `/es`.
- After deploying, submit `https://audio-speaker-test.vercel.app/sitemap.xml` in the existing Search Console property. Inspect `/en` and `/es`, run the live URL test and request indexing for each page.
- Search Console registration does not guarantee indexing or ranking. Review the indexing status and search performance after Google recrawls the pages.
- If the production domain changes, update the absolute URLs in both HTML pages, `sitemap.xml`, `robots.txt` and this README, and permanently redirect the old domain to the new one.
