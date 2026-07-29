# 🎂 Ani's 21st Birthday — Digital Scrapbook Invitation

A handmade digital birthday invitation website created for Ani's 21st birthday celebration.

The project recreates the feeling of a physical scrapbook invitation through
animated paper elements, handwritten-style typography, photo memories,
a vintage mixtape experience, and interactive guest features.

Built from scratch using vanilla HTML, CSS, and JavaScript with no frameworks
or build tools.

## ✨ Features

## 🎀 Invitation Experience

- 🎞️ Scrapbook-inspired landing page
- ✉️ Interactive envelope opening animation
- 🎉 Canvas-based confetti celebration effect
- ⏳ Live countdown timer until the birthday event
- 🎵 Vintage mixtape-style music section
- 💌 RSVP invitation form
- ✨ Handmade paper decorations and visual effects
- 📱 Fully responsive design for desktop and mobile devices
- 🎨 Custom typography, shadows, textures, and animations

## 👥 Guest Management System (Optional)

The project includes an optional guest management system powered by Google
Apps Script and Google Sheets.

Features:

- 🔗 Personalized guest invitation links
- 📝 RSVP status synchronization
- 📋 Guest list management
- 📊 Private admin dashboard
- 👤 Guest information tracking
- ✅ Event attendance management

---

# 🛠 Built With

## Frontend

- HTML5
- CSS3
- Vanilla JavaScript

## Browser APIs

- Canvas API — confetti animation
- Intersection Observer API — scroll reveal animations
- DOM API — interactive components and UI behavior

## Backend (Optional)

- Google Apps Script — serverless backend API
- Google Sheets — lightweight guest database

---

# 📁 Project Structure

```text
BIRTHDAY-INVITE/
├── admin/
│   ├── index.html
│   └── admin.js
│
├── apps-script/
│   └── Code.gs
│
├── assets/
│   ├── audio/
│   │   ├── ABBA - Dancing Queen.mp3
│   │   ├── Coldplay - Adventure Of A Lifetime.mp3
│   │   └── Taylor Swift - All Too Well.mp3
│   │
│   ├── components/
│   │   └── decorations.js
│   │
│   ├── css/
│   │   └── style.css
│   │
│   ├── images/
│   │   └── Birthday-Party-Invitation.png
│   │
│   └── js/
│       ├── api.js
│       ├── config.js
│       └── script.js
│
├── index.html
└── README.md
```

---

# 🚀 Getting Started

The invitation website works without any setup.

No installation is required.

Simply open:

```text
index.html
```

in any modern browser.

The main invitation experience, animations, countdown,
gallery, and visual elements work immediately.

---

# ⚙️ Configuration

Optional backend features require additional setup.

## Google Sheets Guest Database

Create a Google Sheet with the following structure:

| GuestID | Name | RSVP | Guests | CheckedIn | CheckedInTime |
| ------- | ---- | ---- | ------ | --------- | ------------- |

Example:

| GuestID | Name | RSVP    | Guests |
| ------- | ---- | ------- | ------ |
| G001    | Nino | Pending | 1      |
| G002    | Luka | Pending | 2      |

---

## Google Apps Script Setup

1. Open the Google Sheet.

2. Go to:

```text
Extensions → Apps Script
```

3. Replace the default code with:

```text
apps-script/Code.gs
```

4. Configure your admin key:

```javascript
var ADMIN_KEY = "CHANGE_ME_SECRET";
```

5. Deploy as a Web App.

Configuration:

```text
Execute as:
Me

Who has access:
Anyone
```

---

## Frontend Configuration

Update:

```text
assets/js/config.js
```

with your settings:

```javascript
window.SCRAPBOOK_CONFIG = {
  APPS_SCRIPT_URL: "YOUR_WEB_APP_URL",
  ADMIN_KEY: "YOUR_SECRET_KEY",
  SITE_URL: "YOUR_WEBSITE_URL",
};
```

---

## 🎵 Music Section

The invitation includes a vintage mixtape-style playlist experience.

Audio files are stored inside:

```text
assets/audio/
```

The playlist interface can be connected to real audio playback through:

```text
assets/js/script.js
```

## 🎀 Design Concept

The website follows a vintage scrapbook aesthetic inspired by:

- physical birthday cards
- photo albums
- handwritten memories
- nostalgic cassette tapes

The goal was to create an invitation that feels personal and emotional
rather than a traditional event website.

Every section was designed to feel like a handmade birthday card brought
to life through web technologies and animations.

## 💌 Created For

**Ani's 21st Birthday Celebration**

📅 August 3, 2026
