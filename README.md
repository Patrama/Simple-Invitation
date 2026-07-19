# Online Invitation

A static, single-page, no-scroll invitation with countdown, map, RSVP,
gift boxes, background music, dark/light theme, and cursor/gyroscope
parallax — ready to deploy on GitHub Pages.

**Start here → [`other/README.md`](other/README.md)** for full setup and
deployment steps. Day-to-day editing happens in **`js/config.js`**.

## Structure
```
index.html         entry point (must stay at repo root for GitHub Pages)
css/style.css       design system + layout
js/config.js        ← edit this: names, date, location, gifts, music…
js/main.js          behavior: theme, countdown, parallax, paging, RSVP
img/                photos, video, QR code, illustrations
font/               (fonts load from CDN by default — see font/README.md)
page/               reserved for any extra standalone pages
other/              setup guide + Google Apps Script for RSVP → Sheet
```
