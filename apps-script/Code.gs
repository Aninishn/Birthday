/**
 * BIRTHDAY GUEST BACKEND — Google Apps Script
 * ------------------------------------------------------------
 * Setup:
 * 1. Create a Google Sheet with one tab named exactly "Guests"
 *    and this header row (row 1):
 *      GuestID | Name | RSVP | Guests | CheckedIn | CheckedInTime
 *
 *    Fill in one row per guest, e.g.:
 *      G001 | Nino  | Pending  | 1 |       |
 *      G002 | Luka  | Accepted | 2 |       |
 *
 *    RSVP starts as "Pending" and becomes "Accepted"/"Declined"
 *    when the guest responds. "Guests" is how many people that
 *    invite covers (the guest + any +1s). Leave CheckedIn and
 *    CheckedInTime blank — the script fills those in.
 *
 * 2. In the Sheet: Extensions > Apps Script. Delete the
 *    placeholder code and paste this whole file in.
 *
 * 3. Change ADMIN_KEY below to your own secret.
 *
 * 4. Deploy > New deployment > type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Deploy, authorize when prompted, then copy the Web App URL.
 *
 * 5. Paste that URL into config.js as APPS_SCRIPT_URL, and the
 *    same ADMIN_KEY value into config.js too.
 *
 * Every guest's personal RSVP link is:
 *   yoursite.com/index.html?guest=G001
 * Every guest's check-in QR link is:
 *   yoursite.com/checkin.html?guest=G001
 * (the admin page generates these + the QR images for you)
 */

var ADMIN_KEY = 'AniBirthday2026';
var SHEET_NAME = 'Guests';

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var action = e.parameter.action;

  if (action === 'get') {
    return jsonOut(findGuest_(sheet, e.parameter.guest) || { error: 'Guest not found' });
  }

  if (action === 'list') {
    if (e.parameter.key !== ADMIN_KEY) return jsonOut({ error: 'Unauthorized' });
    return jsonOut(allGuests_(sheet));
  }

  if (action === 'rsvp') {
    var value = e.parameter.value;
    if (['Accepted', 'Declined', 'Pending'].indexOf(value) === -1) {
      return jsonOut({ error: 'Invalid RSVP value' });
    }
    return jsonOut(updateGuest_(sheet, e.parameter.guest, { RSVP: value }));
  }

  if (action === 'checkin') {
    return jsonOut(updateGuest_(sheet, e.parameter.guest, {
      CheckedIn: 'TRUE',
      CheckedInTime: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'MMM d, h:mm a')
    }));
  }

  return jsonOut({ error: 'Unknown action' });
}

/* ---------- helpers ---------- */

function readAll_(sheet) {
  var values = sheet.getDataRange().getValues();
  var headers = values[0];
  return { headers: headers, rows: values.slice(1) };
}

function rowToObject_(headers, row) {
  var obj = {};
  headers.forEach(function (h, i) { obj[h] = row[i]; });
  return obj;
}

function allGuests_(sheet) {
  var data = readAll_(sheet);
  return data.rows.map(function (row) { return rowToObject_(data.headers, row); });
}

function findGuest_(sheet, guestId) {
  var data = readAll_(sheet);
  var idIndex = data.headers.indexOf('GuestID');
  for (var i = 0; i < data.rows.length; i++) {
    if (String(data.rows[i][idIndex]) === String(guestId)) {
      return rowToObject_(data.headers, data.rows[i]);
    }
  }
  return null;
}

function updateGuest_(sheet, guestId, fields) {
  var data = readAll_(sheet);
  var idIndex = data.headers.indexOf('GuestID');

  for (var i = 0; i < data.rows.length; i++) {
    if (String(data.rows[i][idIndex]) === String(guestId)) {
      var sheetRow = i + 2; // +1 for header, +1 for 1-based index
      Object.keys(fields).forEach(function (key) {
        var colIndex = data.headers.indexOf(key);
        if (colIndex !== -1) {
          sheet.getRange(sheetRow, colIndex + 1).setValue(fields[key]);
        }
      });
      return findGuest_(sheet, guestId);
    }
  }
  return { error: 'Guest not found' };
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
