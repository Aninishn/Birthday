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
  APPS_SCRIPT_URL: "PASTE_YOUR_DEPLOYED_WEB_APP_URL_HERE",
  ADMIN_KEY: "aniBirthday2026",

  // Base URL where this site is hosted — used to build the
  // check-in QR links shown on the admin page. No trailing slash.
  SITE_URL: "https://your-site.example.com",
};
