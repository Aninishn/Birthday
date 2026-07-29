/* ==============================================================
   CHECKIN.JS — Guest QR Check-in Page
   --------------------------------------------------------------
   Flow:
   1. Read the ?guest=GuestID param from the URL.
   2. Fetch guest details from the Sheet via ScrapbookAPI.
   3. Render the guest's name, RSVP status, and party size.
   4. Display a large "Check In" button (disabled if already in).
   5. On click: call ScrapbookAPI.checkIn(), then show a success
      animation with the check-in timestamp.

   Depends on:
   - window.ScrapbookAPI  (../assets/js/api.js)
   - window.Scrapbook     (../assets/components/decorations.js)
   ============================================================== */
(function () {
  const content  = document.getElementById('checkinContent');
  const card     = document.getElementById('checkinCard');
  const guestId  = new URLSearchParams(window.location.search).get('guest');

  /* ---- Decorate the card with a washi tape strip at the top ---- */
  const tapeStrip = Scrapbook.tape({ rotate: -6, tone: 'silver' });
  Object.assign(tapeStrip.style, {
    position: 'absolute',
    top: '-14px',
    left: 'calc(50% - 45px)'
  });
  card.appendChild(tapeStrip);


  /* ============================================================
     HELPERS
     ============================================================ */

  /**
   * Return an RSVP badge <span> for the given status string.
   * @param {string} rsvp - 'Accepted' | 'Declined' | 'Pending'
   * @returns {string} HTML string.
   */
  function statusBadge(rsvp) {
    const map = { Accepted: 'accepted', Declined: 'declined', Pending: 'pending' };
    const cls = map[rsvp] || 'pending';
    return `<span class="checkin-status checkin-status--${cls}">${rsvp || 'Pending'}</span>`;
  }

  /**
   * Build the "already checked in" confirmation block.
   * @param {string} time - Timestamp string from the Sheet, or ''.
   * @returns {string} HTML string.
   */
  function successBlock(time) {
    return `
      <div class="checkin-success" aria-live="assertive">
        <span class="checkin-success__mark" aria-hidden="true">✓</span>
        <p class="checkin-success__text">welcome to the party!</p>
        ${time ? `<p class="checkin-success__time">checked in at ${time}</p>` : ''}
      </div>`;
  }


  /* ============================================================
     RENDER
     ============================================================ */

  /**
   * Render the full guest check-in view.
   * @param {Object} guest - Guest record from the Sheet.
   */
  function render(guest) {
    const partySize = guest.Guests || 1;
    const alreadyIn = String(guest.CheckedIn).toUpperCase() === 'TRUE';

    content.innerHTML = `
      <p class="checkin-card__name">${guest.Name || 'Guest'}</p>

      <div class="checkin-row">
        <span class="checkin-row__label">RSVP</span>
        <span class="checkin-row__value">${statusBadge(guest.RSVP)}</span>
      </div>

      <div class="checkin-row">
        <span class="checkin-row__label">Party size</span>
        <span class="checkin-row__value">${partySize} ${partySize === 1 ? 'person' : 'people'}</span>
      </div>

      <button
        class="checkin-button"
        id="checkinBtn"
        ${alreadyIn ? 'disabled' : ''}
        aria-label="${alreadyIn ? 'Already checked in' : 'Check in ' + (guest.Name || 'guest')}"
      >
        ${alreadyIn ? 'Already checked in' : 'Check In'}
      </button>

      ${alreadyIn ? successBlock(guest.CheckedInTime || '') : ''}
    `;

    /* Wire up the button only when the guest has not checked in yet */
    if (!alreadyIn) {
      const btn = document.getElementById('checkinBtn');
      if (btn) btn.addEventListener('click', () => handleCheckIn(btn, guest));
    }
  }


  /* ============================================================
     CHECK-IN ACTION
     ============================================================ */

  /**
   * Attempt to check the guest in via the API.
   * Shows a loading state, then either re-renders with the
   * updated guest record (success) or shows an inline error.
   * @param {HTMLButtonElement} btn
   * @param {Object}            guest
   */
  async function handleCheckIn(btn, guest) {
    btn.disabled    = true;
    btn.textContent = 'Checking in…';
    btn.setAttribute('aria-label', 'Checking in, please wait');

    try {
      const updated = await ScrapbookAPI.checkIn(guestId);
      render(updated);
    } catch {
      // Restore the button so the user can try again
      btn.disabled    = false;
      btn.textContent = 'Check In';
      btn.setAttribute('aria-label', 'Check in ' + (guest.Name || 'guest'));

      const errEl       = document.createElement('p');
      errEl.className   = 'checkin-message';
      errEl.textContent = "couldn't reach the guest list — try again";
      content.appendChild(errEl);
    }
  }


  /* ============================================================
     INIT
     ============================================================ */

  async function init() {
    if (!guestId) {
      content.innerHTML = '<p class="checkin-error">no guest code found in this link</p>';
      return;
    }

    try {
      const guest = await ScrapbookAPI.getGuest(guestId);

      if (!guest || guest.error) {
        content.innerHTML = `<p class="checkin-error">${(guest && guest.error) || 'guest not found'}</p>`;
        return;
      }

      render(guest);

    } catch (err) {
      content.innerHTML = `<p class="checkin-error">${err.message}</p>`;
    }
  }

  init();
})();
