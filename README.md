# Ani's Birthday — Scrapbook Invitation

A handmade-feeling, vanilla HTML/CSS/JS birthday invitation site: hero collage,
opening envelope with confetti, countdown, photo memories, a mixtape-style
playlist, RSVP, and (optionally) a Google-Sheet-backed guest check-in system
for the door.

**No build step. No framework. No `npm install`.** Open `index.html` or serve
the folder anywhere static.

---

## Project Structure

```
/
├── index.html                     ← Public invitation (guests see this)
│
├── admin/
│   ├── index.html                 ← Private guest-list dashboard
│   └── admin.js                   ← Dashboard logic (filter, QR, stats)
│
├── checkin/
│   ├── index.html                 ← QR code scan destination (at the door)
│   └── checkin.js                 ← Check-in flow logic
│
├── assets/
│   ├── css/
│   │   └── style.css              ← All shared styling (used by every page)
│   │
│   ├── js/
│   │   ├── config.js              ← ⚙️  YOUR SETTINGS GO HERE
│   │   ├── api.js                 ← Fetch wrapper around the Apps Script API
│   │   └── script.js              ← Invitation page interactions
│   │
│   ├── components/
│   │   └── decorations.js         ← Reusable scrapbook decoration factory
│   │
│   ├── images/
│   │   └── Birthday-Party-Invitation.png   ← Primary visual identity asset
│   │
│   └── music/                     ← Drop audio files here for real playback
│
├── apps-script/
│   └── Code.gs                    ← Google Apps Script backend (paste into GAS)
│
└── README.md
```

---

## Folder Purpose

| Folder / File | Purpose |
|---|---|
| `index.html` | The invitation guests receive. Works with zero configuration. |
| `admin/` | Private dashboard for RSVP summary, guest cards, and QR codes. |
| `checkin/` | The page a QR code opens at the door. Marks a guest as checked in. |
| `assets/css/style.css` | Shared stylesheet — every page loads this. |
| `assets/js/config.js` | Your API URL, admin key, and site URL. Edit this first. |
| `assets/js/api.js` | Thin fetch wrapper. Don't edit unless the Sheet schema changes. |
| `assets/js/script.js` | Invitation page JS: ransom headline, envelope, countdown, RSVP, etc. |
| `assets/components/decorations.js` | Returns DOM nodes for tape, stamps, doodles, etc. Used by admin + check-in. |
| `assets/images/` | Place approved photos and graphics here. |
| `assets/music/` | Place audio files here if you want real playlist playback. |
| `apps-script/Code.gs` | Backend only — paste into Google Apps Script. Never edit via this repo. |

---

## Editing Assets

### Change the invitation image
Replace `assets/images/Birthday-Party-Invitation.png` with your updated file,
keeping the same filename. The image is referenced in `index.html`'s
`.portrait-frame__inner img` element.

### Add memory photos
In `index.html`, locate the `.memories-collage` section. Replace each
`<span>+ add photo</span>` placeholder inside a `.polaroid__pic` or
`.frame__pic` with an `<img>` tag:

```html
<div class="polaroid__pic">
  <img src="assets/images/your-photo.jpg" alt="Description of photo">
</div>
```

### Add music files
Drop audio files into `assets/music/` and add `<audio>` elements to
`index.html`. Wire them up in `assets/js/script.js` — the playlist section
is marked with a comment explaining where to connect real playback.

### Change the party details
Everything is in `index.html` directly — date, time, location, dress code, and
the countdown target date (also in `assets/js/script.js` as `TARGET_DATE`).

---

## Where Shared Code Lives

| Concern | File |
|---|---|
| Design tokens (colours, fonts, shadows) | `assets/css/style.css` — `:root` block |
| API communication | `assets/js/api.js` |
| Configuration | `assets/js/config.js` |
| Scrapbook decoration utilities | `assets/components/decorations.js` |

---

## Where Feature-Specific Code Lives

| Feature | HTML | JS |
|---|---|---|
| Invitation page | `index.html` | `assets/js/script.js` |
| Admin dashboard | `admin/index.html` | `admin/admin.js` |
| Guest check-in | `checkin/index.html` | `checkin/checkin.js` |
| Backend (Sheet) | — | `apps-script/Code.gs` |

---

## Part 1 — The Invitation (works with zero setup)

Open `index.html` in a browser. The hero, envelope, countdown, memories,
playlist, and RSVP form all work with no configuration. RSVP without a
`?guest=` link is local-only (shows a confirmation, doesn't save anywhere).

---

## Part 2 — Guest List Backend (needed for RSVP-sync + QR check-in)

This uses a Google Sheet as the database and Google Apps Script as the API.
No server to host. No npm packages.

### 1. Create the Sheet

Make a new Google Sheet. Rename the first tab to exactly `Guests`. Row 1
must have exactly these headers:

```
GuestID | Name | RSVP | Guests | CheckedIn | CheckedInTime
```

One row per guest:

```
G001 | Nino  | Pending | 1 |  |
G002 | Luka  | Pending | 2 |  |
```

- **GuestID** — anything unique and short. Goes in each guest's personal URL.
- **RSVP** — starts as `Pending`; becomes `Accepted` or `Declined` when they respond.
- **Guests** — how many people the invite covers (them + any +1s).
- **CheckedIn / CheckedInTime** — leave blank; the script fills these at the door.

### 2. Add the backend

In the Sheet: **Extensions → Apps Script**. Delete the placeholder code, paste
the entire contents of `apps-script/Code.gs`.

Change the admin key at the top:

```js
var ADMIN_KEY = 'CHANGE_ME_SECRET';
```

### 3. Deploy

**Deploy → New deployment → type: Web app.**
- Execute as: **Me**
- Who has access: **Anyone**

Authorize when asked, then copy the **Web App URL**.

### 4. Configure

Open `assets/js/config.js` and fill in:

```js
window.SCRAPBOOK_CONFIG = {
  APPS_SCRIPT_URL: "<the Web App URL>",
  ADMIN_KEY:       "<the same secret from Code.gs>",
  SITE_URL:        "<where you host this folder, no trailing slash>"
};
```

### 5. Host

Any static host — GitHub Pages, Netlify, Vercel, etc. QR codes must point at
a real public URL, so `SITE_URL` must match where you deploy.

---

## Part 3 — Personalized Guest Links

- **RSVP link** to send each guest: `yoursite.com/?guest=G001`
  — prefills their name and syncs their RSVP to the Sheet.
- **Check-in QR**: generated automatically on `/admin/`, points at
  `yoursite.com/checkin/?guest=G001`.

---

## Part 4 — At the Door

Open `/admin/` on your phone, unlock with your admin key. Scroll to "Check-in
QR codes" and either print them ahead of time or let guests scan straight off
your screen. Scanning opens `/checkin/`, which shows their name + RSVP + party
size and a **Check In** button. Tapping it updates the Sheet instantly.

---

## Honest Limits

- **The admin key is not real security.** It's checked in Apps Script, but the
  key lives in `assets/js/config.js`, a public file on your hosted site. Fine
  for a private one-day event; don't use for anything sensitive.
- **No personal data goes in the QR code** — it only encodes the `GuestID`.
  All actual guest info stays in the Sheet.
- **Google Apps Script has light rate limits** and can be briefly slow on the
  first request of the day — totally fine for a private party, not for scale.
