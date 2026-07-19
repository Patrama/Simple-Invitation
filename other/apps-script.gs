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
