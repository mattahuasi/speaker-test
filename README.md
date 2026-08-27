# Speaker Test

Speaker Test is a simple web application to test the left, right, or both audio channels independently. It is designed to verify speakers, headphones, or sound systems from the browser without installing anything.

## Live site

You can visit the published version here:

https://audio-speaker-test.vercel.app/

## Features

- Left channel test
- Right channel test
- Both channels playback
- Light and dark theme toggle
- Sequential auto-test of channels
- Responsive design for mobile and desktop
- Support for installation as a PWA

## Project structure

```text
speaker-test/
├── index.html
├── favicon.ico
├── icon.svg
├── apple-touch-icon.png
├── og-image.png
├── site.webmanifest
├── css/
│   └── style.css
└── js/
    └── app.js
```

## Usage

1. Open `index.html` in your browser.
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
