Fonts are loaded from Google Fonts via CDN link in index.html
(Fraunces, Work Sans, Caveat) so no files are needed here.

To self-host instead (e.g. for full offline use or stricter privacy):
1. Download the three font families' .woff2 files.
2. Place them in this folder.
3. Replace the Google Fonts <link> tags in index.html with an
   @font-face block in css/style.css pointing at font/<file>.woff2.
