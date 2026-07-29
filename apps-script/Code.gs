var ADMIN_KEY = "AniBirthday2026";
var SHEET_NAME = "Guests";

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  var action = e.parameter.action;

  if (action === "list") {
    if (e.parameter.key !== ADMIN_KEY) {
      return jsonOut({ error: "Unauthorized" });
    }
    return jsonOut(allGuests_(sheet));
  }

  return jsonOut({ error: "Unknown action" });
}
