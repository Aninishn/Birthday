/* ==============================================================
   ADMIN.JS — Guest List Dashboard
   --------------------------------------------------------------
   Handles:
   - Admin key gate (client-side UI hide; real auth is in Code.gs)
   - Guest card rendering with RSVP badges
   - Filter buttons (All / Accepted / Declined / Pending)
   - Summary stat cards
   - QR code generation per guest (uses qrcode.js from CDN)

   Depends on:
   - window.SCRAPBOOK_CONFIG  (../assets/js/config.js)
   - window.ScrapbookAPI      (../assets/js/api.js)
   - window.QRCode            (CDN — qrcode.min.js)
   ============================================================== */
(function () {
  /* ---- DOM references ---- */
  const gateEl = document.getElementById("adminGate");
  const dashboard = document.getElementById("adminDashboard");
  const keyInput = document.getElementById("adminKeyInput");
  const gateBtn = document.getElementById("adminGateBtn");
  const gateError = document.getElementById("adminGateError");
  const summaryEl = document.getElementById("adminSummary");
  const guestListEl = document.getElementById("guestList");
  const qrGrid = document.getElementById("qrGrid");

  const cfg = window.SCRAPBOOK_CONFIG || {};

  /** All guests loaded from the API (kept in memory for filtering). */
  let allGuests = [];

  /* ============================================================
     RENDERING — Summary stats
     ============================================================ */

  /**
   * Build a single summary stat card.
   * @param {number|string} num   The stat value.
   * @param {string}        label The stat label.
   * @returns {string} HTML string.
   */
  function summaryCard(num, label) {
    return `
      <div class="admin-summary__card">
        <span class="admin-summary__num">${num}</span>
        <span class="admin-summary__label">${label}</span>
      </div>`;
  }

  /** Render all summary cards from the full guest list. */
  function renderSummary(guests) {
    const total = guests.length;
    const accepted = guests.filter((g) => g.RSVP === "Accepted").length;
    const declined = guests.filter((g) => g.RSVP === "Declined").length;
    const pending = guests.filter(
      (g) => !g.RSVP || g.RSVP === "Pending",
    ).length;
    const checkedIn = guests.filter(
      (g) => String(g.CheckedIn).toUpperCase() === "TRUE",
    ).length;

    summaryEl.innerHTML =
      summaryCard(total, "invited") +
      summaryCard(accepted, "accepted") +
      summaryCard(declined, "declined") +
      summaryCard(pending, "pending") +
      summaryCard(checkedIn, "checked in");
  }

  /* ============================================================
     RENDERING — Guest cards
     ============================================================ */

  /**
   * Build the HTML for a single guest card.
   * @param {Object} guest - Guest record from the Sheet.
   * @returns {string} HTML string.
   */
  function renderGuestCard(guest) {
    const rsvp = (guest.RSVP || "Pending").toLowerCase();
    const checkedIn = String(guest.CheckedIn).toUpperCase() === "TRUE";
    const checkTime = guest.CheckedInTime || "";

    return `
      <article class="guest-card" data-rsvp="${rsvp}"
               ${checkedIn ? `title="Checked in at ${checkTime}"` : ""}>
        <div>
          <div class="guest-card__name">${guest.Name || guest.GuestID}</div>
          <div class="guest-card__meta">${guest.GuestID} · party of ${guest.Guests || 1}</div>
        </div>
        <div class="checkin-status checkin-status--${rsvp}" aria-label="RSVP: ${guest.RSVP || "Pending"}">
          ${guest.RSVP || "Pending"}
        </div>
        <div class="guest-card__checkedin" aria-label="${checkedIn ? "Checked in at " + checkTime : "Not yet checked in"}">
          ${checkedIn ? "✓ " + checkTime : "—"}
        </div>
      </article>`;
  }

  /** Render the visible guest list, respecting the active filter. */
  function renderGuestList(filter) {
    const visible =
      filter && filter !== "all"
        ? allGuests.filter(
            (g) => (g.RSVP || "Pending").toLowerCase() === filter,
          )
        : allGuests;

    guestListEl.innerHTML = visible.length
      ? visible.map(renderGuestCard).join("")
      : '<p style="font-family:var(--font-hand);color:var(--brown);text-align:center;padding:1rem;">no guests in this category</p>';
  }

  /* ============================================================
     RENDERING — QR codes
     ============================================================ */

  /**
   * Build a QR card DOM node for a guest.
   * Check-in links now point to /checkin/ (index.html served from directory).
   * @param {Object} guest - Guest record from the Sheet.
   * @returns {HTMLElement}
   */
  function renderQrCard(guest) {
    const link = `${cfg.SITE_URL || ""}/checkin/?guest=${encodeURIComponent(guest.GuestID)}`;
    const rsvp = (guest.RSVP || "Pending").toLowerCase();

    const wrap = document.createElement("article");
    wrap.className = "qr-card";
    wrap.setAttribute(
      "aria-label",
      `QR code for ${guest.Name || guest.GuestID}`,
    );

    const canvas = document.createElement("canvas");
    wrap.appendChild(canvas);

    const nameEl = document.createElement("p");
    nameEl.className = "qr-card__name";
    nameEl.textContent = guest.Name || guest.GuestID;
    wrap.appendChild(nameEl);

    const badgeEl = document.createElement("p");
    badgeEl.className = "qr-card__rsvp";
    badgeEl.innerHTML = `<span class="checkin-status checkin-status--${rsvp}">${guest.RSVP || "Pending"}</span>`;
    wrap.appendChild(badgeEl);

    const linkEl = document.createElement("p");
    linkEl.className = "qr-card__link";
    linkEl.textContent = link;
    wrap.appendChild(linkEl);

    if (window.QRCode) {
      QRCode.toCanvas(canvas, link, {
        width: 130,
        margin: 1,
        color: { dark: "#2A2320", light: "#FBF6EC" },
      });
    }

    return wrap;
  }

  /* ============================================================
     FILTER BUTTONS
     ============================================================ */

  function setupFilters() {
    const btns = document.querySelectorAll(".filter-btn");
    btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        btns.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-pressed", "true");
        renderGuestList(btn.dataset.filter);
      });
    });
  }

  /* ============================================================
     DASHBOARD LOAD
     ============================================================ */

  async function loadDashboard() {
    try {
      const guests = await ScrapbookAPI.listGuests(keyInput.value);

      if (!Array.isArray(guests)) {
        throw new Error(
          (guests && guests.error) || "Could not load guest list",
        );
      }

      allGuests = guests;

      renderSummary(guests);
      renderGuestList("all");
      setupFilters();

      // Build QR cards
      qrGrid.innerHTML = "";
      guests.forEach((g) => qrGrid.appendChild(renderQrCard(g)));

      // Hide gate, show dashboard
      gateEl.style.display = "none";
      dashboard.style.display = "block";

      // Persist key for this browser session
      sessionStorage.setItem("scrapbookAdminKey", keyInput.value);
    } catch (err) {
      gateError.textContent = err.message;
      gateError.style.display = "block";
    }
  }

  /* ============================================================
     GATE / UNLOCK
     ============================================================ */

  /**
   * Validate local config then attempt to load the dashboard.
   * The real key check happens server-side in Code.gs — this
   * client-side check only catches a missing config.js setup.
   */
  function tryUnlock() {
    if (!cfg.APPS_SCRIPT_URL || cfg.APPS_SCRIPT_URL.startsWith("PASTE_")) {
      gateError.textContent =
        "Set APPS_SCRIPT_URL in assets/js/config.js first — see README.md.";
      gateError.style.display = "block";
      return;
    }

    // Inject the typed key so ScrapbookAPI.listGuests() sends it
    cfg.ADMIN_KEY = keyInput.value;
    loadDashboard();
  }

  gateBtn.addEventListener("click", tryUnlock);
  keyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryUnlock();
  });

  // Convenience: re-use a previously entered key for this browser session
  const remembered = sessionStorage.getItem("scrapbookAdminKey");
  if (remembered) {
    keyInput.value = remembered;
  }
})();
