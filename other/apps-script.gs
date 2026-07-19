/**
 * Paste this into a Google Sheet's Extensions > Apps Script editor.
 * It turns the sheet into a tiny API that appends one row per RSVP.
 *
 * Setup:
 * 1. Create a new Google Sheet. Add header row: Timestamp | Name | Attendance | Comment
 * 2. Extensions > Apps Script, delete the sample code, paste this in.
 * 3. Deploy > New deployment > type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the deployment URL and paste it into js/config.js as rsvpEndpoint.
 * 5. Re-deploy (Deploy > Manage deployments > edit > new version) any time
 *    you change this script.
 */
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var params = e.parameter;
  sheet.appendRow([
    new Date(),
    params.name || "",
    params.attendance || "",
    params.comment || ""
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Powers the site's public "who's coming" guestbook panel. Returns
 * every submitted RSVP as JSON. Only the four columns guests already
 * see are exposed (timestamp, name, attendance, comment) — nothing
 * else from the sheet is read.
 *
 * If you don't want RSVPs visible to site visitors at all, either set
 * guestbook.enabled to false in js/config.js, or delete this function
 * so the endpoint only ever accepts submissions, never reads them back.
 */
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var values = sheet.getDataRange().getValues();
  var rows = values.slice(1); // drop header row
  var entries = rows
    .filter(function (r) { return r[1]; }) // skip blank rows
    .map(function (r) {
      return { timestamp: r[0], name: r[1], attendance: r[2], comment: r[3] };
    })
    .reverse(); // newest first

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, entries: entries }))
    .setMimeType(ContentService.MimeType.JSON);
}
