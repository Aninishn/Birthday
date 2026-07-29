/* ==============================================================
   API — talks to the Google Apps Script web app that sits in
   front of the guest Google Sheet. Everything is a GET request
   with query params (including "writes" like RSVP/check-in) —
   Apps Script's CORS behavior is unreliable for POST/preflight,
   GET sidesteps that entirely and is plenty for this scale.
   ============================================================== */
(function(global){
  const cfg = global.SCRAPBOOK_CONFIG || {};

  async function call(params){
    if (!cfg.APPS_SCRIPT_URL || cfg.APPS_SCRIPT_URL.startsWith('PASTE_')){
      throw new Error('Set APPS_SCRIPT_URL in config.js first — see README.md.');
    }
    const url = new URL(cfg.APPS_SCRIPT_URL);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Request failed: ' + res.status);
    const data = await res.json();
    if (data && data.error) throw new Error(data.error);
    return data;
  }

  global.ScrapbookAPI = {
    getGuest(guestId){
      return call({ action: 'get', guest: guestId });
    },
    listGuests(){
      return call({ action: 'list', key: cfg.ADMIN_KEY });
    },
    setRsvp(guestId, value){
      return call({ action: 'rsvp', guest: guestId, value });
    },
    checkIn(guestId){
      return call({ action: 'checkin', guest: guestId });
    }
  };
})(window);
