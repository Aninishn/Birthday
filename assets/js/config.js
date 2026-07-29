/* ==============================================================
   CONFIG
   --------------------------------------------------------------
   1. Deploy apps-script/Code.gs against your Google Sheet
      (see README.md for exact steps).
   2. Paste the Web App URL from that deployment below.
   3. Set ADMIN_KEY to the same secret you put at the top of
      Code.gs — it gates the /admin/ dashboard.

   Note: ADMIN_KEY lives in this public file. It provides a
   light access-control layer, not real security. Fine for a
   private one-day event; don't use for anything sensitive.
   ============================================================== */
window.SCRAPBOOK_CONFIG = {
  APPS_SCRIPT_URL:
    "https://script.google.com/macros/s/AKfycbxcI_HC77LtO1299C3X8CrwwIVd7bMaDhCVHbLwLWpHAfP4n5MEneESEdyXarQW1vmY/exec",
  ADMIN_KEY: "AniBirthday2026",

  // Base URL where this site is hosted — used to build the
  // check-in QR links shown on the admin page. No trailing slash.
  SITE_URL: "https://aninishn.github.io/Birthday",
};
