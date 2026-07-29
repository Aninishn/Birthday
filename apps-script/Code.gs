var ADMIN_KEY = "AniBirthday2026";
var SHEET_NAME = "Guests";

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

  var action = e.parameter.action;

  // ADMIN LIST
  if (action === "list") {
    if (e.parameter.key !== ADMIN_KEY) {
      return jsonOut({
        error: "Unauthorized",
      });
    }

    return jsonOut(allGuests_(sheet));
  }

  // PUBLIC RSVP SUBMIT
  if (action === "rsvp") {
    var name = e.parameter.name;
    var rsvp = e.parameter.value;

    if (!name || !rsvp) {
      return jsonOut({
        error: "Missing data",
      });
    }

    var id = "G" + new Date().getTime();

    sheet.appendRow([id, name, rsvp, 1, "", ""]);

    return jsonOut({
      success: true,
      id: id,
    });
  }

  return jsonOut({
    error: "Unknown action",
  });
}

function allGuests_(sheet) {
  var values = sheet.getDataRange().getValues();

  var headers = values[0];

  return values.slice(1).map(function (row) {
    var obj = {};

    headers.forEach(function (header, index) {
      obj[header] = row[index];
    });

    return obj;
  });
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
