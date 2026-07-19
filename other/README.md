# Online Invitation — Setup Guide

A static, single-page invitation. Six full-screen sections you page through
with a swipe, scroll, arrow keys, or the dots on the right — nothing ever
scrolls within a section. Built to be edited by non-developers: almost
everything lives in one file, `js/config.js`.

## 1. Edit your content

Open `js/config.js` and fill in:

- `mode`: `"single"` for one name, `"double"` for two
- `names`, `tagline`, `dateTimeISO`, `dateLabel`, `timeLabel`
- `location.mapEmbedSrc` — in Google Maps, search your venue → Share →
  Embed a map → copy the `src="..."` URL from the `<iframe>` it gives you
- `gifts` — 1 to 4 entries; the layout adjusts to however many you list
- `feature` — set `kind` to `"video"` or `"image"` and `src` to your file
  in `/img` (this replaces the illustrated placeholder on the cover)
- `music.src` — path to a short, loop-friendly audio file you have the
  rights to use

## 2. Connect RSVP to a Google Sheet

Static sites can't run their own backend, so RSVPs are sent to a small
Google Apps Script that writes them into a Sheet — and, if you enable the
guestbook panel, reads them back out again.

1. Create a new Google Sheet. Add a header row: `Timestamp | Name | Attendance | Comment`
2. In the Sheet: **Extensions → Apps Script**, delete the placeholder code,
   and paste in the contents of `other/apps-script.gs`.
3. **Deploy → New deployment → Web app**. Set "Execute as" to **Me** and
   "Who has access" to **Anyone**. Deploy and authorize it.
4. Copy the web app URL it gives you and paste it into `js/config.js` as
   `rsvpEndpoint`.
5. Every RSVP submitted on the site now appears as a new row in the Sheet.
6. If you edit `apps-script.gs` again later (e.g. to remove the guest
   list's `doGet`), you must **Deploy → Manage deployments → edit →
   new version** — saving the script alone doesn't update the live URL.

### Guest list visibility

The "who's coming" panel shows everyone's name, attendance, and comment —
it reads from the same Sheet via the script's `doGet`. Three ways to
control it:

- **Turn it off entirely**: set `guestbook.enabled: false` in
  `js/config.js`. The panel is removed from the site and the sheet is
  never read back over the web.
- **Keep it, but closed until a guest asks for it** (the default): guests
  see a "Show guest list" button; nothing is fetched until they tap it.
  Set `guestbook.openByDefault: true` to show it immediately instead.
- **Keep RSVPs private, but still collect them**: leave `doPost` in the
  Apps Script in place and simply delete the `doGet` function (or set
  `guestbook.enabled: false`) — you'll still get every response in your
  Sheet, guests just won't be able to read each other's.

Since anyone with the invitation link could otherwise view every guest's
comment, treat `guestbook.enabled` as an actual privacy decision, not just
a display preference.

## 3. Add your own images/video/audio

Drop files into `/img` (audio can go there too, or a new `/audio` folder —
just update the path in `config.js` to match) and point `config.js` at them.
Keep the feature photo/video reasonably compressed — it loads on the very
first screen.

## 4. Deploy to GitHub Pages

1. Push this whole folder to a GitHub repository. `index.html` **must
   stay at the repository root** — that's a GitHub Pages requirement, so
   it's the one file not tucked into a subfolder.
2. In the repo: **Settings → Pages → Source → Deploy from a branch**,
   choose `main` and `/ (root)`.
3. Your invitation will be live at `https://<username>.github.io/<repo>/`
   within a minute or two.

## Notes

- **Theme**: follows the guest's device setting on first visit; the toggle
  in the top-right remembers their manual choice after that.
- **Parallax**: tracks the cursor on desktop. On phones it uses the
  gyroscope, which iOS only allows after a tap — that's what the "Open
  Invitation" button on the cover is for (it also starts the music, since
  browsers block audio from playing before a user gesture).
- **Reduced motion**: if a guest has "reduce motion" enabled on their
  device, the parallax effect turns itself off automatically.
- **Parallax strength**: each decorative layer's `data-depth` attribute
  in `index.html` is its max drift in pixels — raise or lower those
  numbers (currently 14–48) if you want the effect more subtle or more
  pronounced.
