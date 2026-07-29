/* ==============================================================
   CONFIG
   --------------------------------------------------------------
   1. Deploy apps-script/Code.gs against your Google Sheet
      (see README.md for exact steps).
   2. Paste the Web App URL you get from that deployment below.
   3. Set ADMIN_KEY to the same secret you put at the top of
      Code.gs — it gates the /admin.html dashboard. This is a
      simple shared-secret, not real authentication; fine for a
      private one-day event, not for anything sensitive.
   ============================================================== */
window.SCRAPBOOK_CONFIG = {
  APPS_SCRIPT_URL: "PASTE_YOUR_DEPLOYED_WEB_APP_URL_HERE",
  ADMIN_KEY: "PASTE_THE_SAME_SECRET_FROM_CODE.GS_HERE",
  // Base URL where this site will be hosted (used to build the
  // check-in QR links shown on the admin page). No trailing slash.
  SITE_URL: "https://your-site.example.com"
};
