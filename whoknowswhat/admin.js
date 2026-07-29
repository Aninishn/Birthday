(function(){
  const gate = document.getElementById('adminGate');
  const dashboard = document.getElementById('adminDashboard');
  const keyInput = document.getElementById('adminKeyInput');
  const gateBtn = document.getElementById('adminGateBtn');
  const gateError = document.getElementById('adminGateError');
  const summary = document.getElementById('adminSummary');
  const guestListEl = document.getElementById('guestList');
  const qrGrid = document.getElementById('qrGrid');

  const cfg = window.SCRAPBOOK_CONFIG || {};

  function summaryCard(num, label){
    return `<div class="admin-summary__card"><span class="admin-summary__num">${num}</span><span class="admin-summary__label">${label}</span></div>`;
  }

  function renderGuestCard(guest){
    const rsvp = (guest.RSVP || 'Pending').toLowerCase();
    const checkedIn = String(guest.CheckedIn).toUpperCase() === 'TRUE';
    return `
      <div class="guest-card" data-rsvp="${rsvp}">
        <div>
          <div class="guest-card__name">${guest.Name || guest.GuestID}</div>
          <div class="guest-card__meta">${guest.GuestID} · party of ${guest.Guests || 1}</div>
        </div>
        <div class="checkin-status checkin-status--${rsvp}">${guest.RSVP || 'Pending'}</div>
        <div class="guest-card__checkedin">${checkedIn ? '✓ ' + (guest.CheckedInTime || 'checked in') : '—'}</div>
      </div>
    `;
  }

  function renderQrCard(guest){
    const wrap = document.createElement('div');
    wrap.className = 'qr-card';
    const link = `${cfg.SITE_URL || ''}/checkin.html?guest=${encodeURIComponent(guest.GuestID)}`;

    const canvas = document.createElement('canvas');
    wrap.appendChild(canvas);

    const name = document.createElement('p');
    name.className = 'qr-card__name';
    name.textContent = guest.Name || guest.GuestID;
    wrap.appendChild(name);

    const linkText = document.createElement('p');
    linkText.className = 'qr-card__link';
    linkText.textContent = link;
    wrap.appendChild(linkText);

    if (window.QRCode){
      QRCode.toCanvas(canvas, link, { width: 130, margin: 1, color: { dark: '#2A2320', light: '#FBF6EC' } });
    }
    return wrap;
  }

  async function loadDashboard(){
    try {
      const guests = await ScrapbookAPI.listGuests();
      if (!Array.isArray(guests)){
        throw new Error((guests && guests.error) || 'Could not load guest list');
      }

      const accepted = guests.filter(g => g.RSVP === 'Accepted').length;
      const declined = guests.filter(g => g.RSVP === 'Declined').length;
      const pending = guests.filter(g => (g.RSVP || 'Pending') === 'Pending').length;
      const checkedIn = guests.filter(g => String(g.CheckedIn).toUpperCase() === 'TRUE').length;

      summary.innerHTML =
        summaryCard(guests.length, 'invited') +
        summaryCard(accepted, 'accepted') +
        summaryCard(declined, 'declined') +
        summaryCard(pending, 'pending') +
        summaryCard(checkedIn, 'checked in');

      guestListEl.innerHTML = guests.map(renderGuestCard).join('');

      qrGrid.innerHTML = '';
      guests.forEach(g => qrGrid.appendChild(renderQrCard(g)));

      gate.style.display = 'none';
      dashboard.style.display = 'block';
      sessionStorage.setItem('scrapbookAdminKey', keyInput.value);
    } catch (err){
      gateError.textContent = err.message;
      gateError.style.display = 'block';
    }
  }

  function tryUnlock(){
    // The key is checked for real on the server (Code.gs) — this
    // client-side gate only hides the page from casual visitors.
    // Anyone who inspects this site's source can read config.js,
    // so don't rely on this for anything truly sensitive.
    if (!cfg.APPS_SCRIPT_URL || cfg.APPS_SCRIPT_URL.startsWith('PASTE_')){
      gateError.textContent = 'Set APPS_SCRIPT_URL in config.js first — see README.md.';
      gateError.style.display = 'block';
      return;
    }
    cfg.ADMIN_KEY = keyInput.value; // use whatever was typed for the actual API call
    loadDashboard();
  }

  gateBtn.addEventListener('click', tryUnlock);
  keyInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });

  // convenience: remember the key for this browser tab session
  const remembered = sessionStorage.getItem('scrapbookAdminKey');
  if (remembered){
    keyInput.value = remembered;
  }
})();
