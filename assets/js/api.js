/* ==============================================================
   API — talks to the Google Apps Script web app that sits in
   front of the guest Google Sheet.

   Everything is a GET request with query params — including
   "write" operations like RSVP and check-in. Apps Script's CORS
   behaviour is unreliable for POST/preflight; GET sidesteps that
   entirely and is plenty for this scale.

   Exposed as: window.ScrapbookAPI
   Depends on: window.SCRAPBOOK_CONFIG (assets/js/config.js)
   ============================================================== */
(function (global) {
  const cfg = global.SCRAPBOOK_CONFIG || {};

  /**
   * Core fetch helper. Appends params to the Apps Script URL,
   * fetches, parses JSON, and throws on HTTP or API errors.
   * @param {Object} params - Query parameter key/value pairs.
   * @returns {Promise<any>}
   */
  async function call(params) {
    if (!cfg.APPS_SCRIPT_URL || cfg.APPS_SCRIPT_URL.startsWith('PASTE_')) {
      throw new Error('Set APPS_SCRIPT_URL in assets/js/config.js first — see README.md.');
    }

    const url = new URL(cfg.APPS_SCRIPT_URL);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Request failed: ' + res.status);

    const data = await res.json();
    if (data && data.error) throw new Error(data.error);
    return data;
  }

  /** Public API surface */
  global.ScrapbookAPI = {
    /** Fetch a single guest record by GuestID. */
    getGuest(guestId) {
      return call({ action: 'get', guest: guestId });
    },

    /** List all guests — requires a valid admin key. */
    listGuests() {
      return call({ action: 'list', key: cfg.ADMIN_KEY });
    },

    /** Update a guest's RSVP status (Accepted / Declined / Pending). */
    setRsvp(guestId, value) {
      return call({ action: 'rsvp', guest: guestId, value });
    },

    /** Mark a guest as checked-in and timestamp the event. */
    checkIn(guestId) {
      return call({ action: 'checkin', guest: guestId });
    }
  };
})(window);
