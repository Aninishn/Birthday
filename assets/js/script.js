/* ==============================================================
   SCRIPT.JS — Ani's Birthday Scrapbook Invitation
   --------------------------------------------------------------
   Sections
   1. Ransom-note headline builder
   2. Scroll-reveal (IntersectionObserver)
   3. Envelope open + confetti burst
   4. Countdown timer
   5. Cassette / playlist (visual-only player state)
   6. RSVP form
   7. Hero sticker parallax
   ============================================================== */

/* ==============================================================
   1. RANSOM-NOTE HEADLINE
   --------------------------------------------------------------
   Splits "You're Invited" into individual <span> elements, each
   given a random font style and a slight rotation, to produce the
   ransom-note cut-out effect. Runs once on page load.
   ============================================================== */
(function buildRansomTitle() {
  const el = document.getElementById("ransomTitle");
  if (!el) return;

  const text = "You're Invited";
  const styles = ["rletter--cut", "rletter--serif", "rletter--type"];
  const rotations = [-6, -3, -1, 2, 4, 6, -4, 3, -2, 5];

  text.split("").forEach((ch, i) => {
    const span = document.createElement("span");

    if (ch === " ") {
      span.className = "rletter rletter--space";
    } else {
      span.className =
        "rletter " + styles[Math.floor(Math.random() * styles.length)];
      span.style.setProperty("--r", rotations[i % rotations.length] + "deg");
      span.textContent = ch;
    }

    el.appendChild(span);
  });
})();

/* ==============================================================
   2. SCROLL REVEAL
   --------------------------------------------------------------
   Watches every .reveal element and adds .is-visible once it
   enters the viewport. Each element is unobserved after first
   trigger — no repeated animation.
   ============================================================== */
(function scrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  items.forEach((item) => observer.observe(item));
})();

/* ==============================================================
   3. ENVELOPE OPEN + CONFETTI
   --------------------------------------------------------------
   Clicking the envelope (or pressing Enter/Space on it) flips
   the flap, hides the wax seal, and slides the invitation card
   out. A confetti burst fires from the centre of the envelope.
   ============================================================== */
(function envelopeInteraction() {
  const envelope = document.getElementById("envelope");
  const seal = document.getElementById("envelopeSeal");
  const canvas = document.getElementById("confettiCanvas");
  if (!envelope || !canvas) return;

  const ctx = canvas.getContext("2d");
  let opened = false;
  let particles = [];
  let animFrame = null;

  /* Match canvas resolution to the viewport */
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas, { passive: true });
  resizeCanvas();

  /* Palette pulled from the site's design tokens */
  const CONFETTI_COLORS = [
    "#B0273B",
    "#E3AFC0",
    "#5A1B28",
    "#C9C9C6",
    "#7C6552",
  ];

  /** Spawn a burst of confetti particles from a screen point. */
  function spawnConfetti(originX, originY) {
    for (let i = 0; i < 90; i++) {
      particles.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 14,
        vy: Math.random() * -12 - 4,
        size: Math.random() * 7 + 4,
        color:
          CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        shape: Math.random() > 0.5 ? "rect" : "circle",
        life: 0,
      });
    }
    if (!animFrame) animateConfetti();
  }

  /** Animation loop — advances physics and paints each particle. */
  function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.vy += 0.35; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life++;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - p.life / 140);

      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    // Remove dead particles
    particles = particles.filter(
      (p) => p.life < 140 && p.y < canvas.height + 40,
    );

    if (particles.length > 0) {
      animFrame = requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animFrame = null;
    }
  }

  /** Open the envelope — idempotent (only runs once). */
  function openEnvelope() {
    opened = !opened;

    envelope.classList.toggle("is-open", opened);
    envelope.setAttribute("aria-pressed", String(opened));

    if (opened) {
      const rect = envelope.getBoundingClientRect();
      spawnConfetti(rect.left + rect.width / 2, rect.top + 40);
    }
  }

  envelope.addEventListener("click", openEnvelope);
  if (seal)
    seal.addEventListener("click", (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openEnvelope();
    }
  });
})();

/* ==============================================================
   4. COUNTDOWN TIMER
   --------------------------------------------------------------
   Updates four number elements every second until the target
   date. The target matches the invitation card details.
   ============================================================== */
(function countdown() {
  const TARGET_DATE = new Date(2026, 7, 3, 19, 0, 0);

  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMins = document.getElementById("cd-mins");
  const cdSecs = document.getElementById("cd-secs");

  if (!cdDays || !cdHours || !cdMins || !cdSecs) return;

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    let diff = Math.max(0, TARGET_DATE - new Date());

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    diff -= days * (1000 * 60 * 60 * 24);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    diff -= hours * (1000 * 60 * 60);
    const mins = Math.floor(diff / (1000 * 60));
    diff -= mins * (1000 * 60);
    const secs = Math.floor(diff / 1000);

    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent = pad(mins);
    cdSecs.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ==============================================================
   5. CASSETTE / PLAYLIST
   --------------------------------------------------------------
   Visual-only player — clicking a track's play button toggles it
   active and starts the cassette reel animation. Clicking it
   again (or another track) pauses.

   No actual audio is wired up. Swap .track elements' data-track
   values and add an <audio> element if you want real playback.
   ============================================================== */
(function playlist() {
  console.log("playlist loaded");
  const cassette = document.getElementById("cassette");
  const tracks = document.querySelectorAll(".track");
  if (!cassette || !tracks.length) return;

  let currentAudio = null;

  tracks.forEach((track) => {
    const btn = track.querySelector(".track__play");
    const audio = track.querySelector(".track__audio");

    if (!btn || !audio) return;

    btn.addEventListener("click", () => {
      const isPlaying = track.classList.contains("is-active");

      // Reset all tracks
      tracks.forEach((t) => {
        t.classList.remove("is-active");
        const b = t.querySelector(".track__play");
        const a = t.querySelector(".track__audio");
        if (b) b.textContent = "▶";
        if (b) b.setAttribute("aria-label", "Play");
        if (a) {
          a.pause();
          a.currentTime = 0;
        }
      });

      if (isPlaying) {
        // Toggle off — stop the cassette spin
        cassette.classList.remove("is-playing");
        currentAudio = null;
        return;
      }
      // Activate this track
      track.classList.add("is-active");
      btn.textContent = "❚❚";
      btn.setAttribute("aria-label", "Pause");

      audio.play();

      currentAudio = audio;

      cassette.classList.add("is-playing");

      audio.addEventListener("ended", () => {
        track.classList.remove("is-active");
        btn.textContent = "▶";
        cassette.classList.remove("is-playing");
      });
    });
  });
})();

/* ==============================================================
   6. RSVP FORM
   --------------------------------------------------------------
   Handles sticker-button selection, form submit, confirmation
   message reveal, and (optionally) Google Sheet sync via the
   ScrapbookAPI when a ?guest= ID is present in the URL.
   ============================================================== */
(function rsvp() {
  const form = document.getElementById("rsvpForm");
  const stickers = document.querySelectorAll(".rsvp-sticker");
  const hiddenAnswer = document.getElementById("rsvpAnswer");
  const nameInput = document.getElementById("rsvpName");
  const confirmEl = document.getElementById("rsvpConfirm");
  const confirmName = document.getElementById("confirmName");
  const confirmMsg = document.getElementById("confirmMsg");

  if (!form) return;

  /* Human-readable confirmation messages keyed by sticker value */
  const MESSAGES = {
    yes: "so glad you're coming ♡",
    no: "you'll be missed — let's celebrate soon",
    maybe: "hope you can make it!",
  };

  /* Maps UI values → Sheet column values, and back */
  const TO_SHEET_VALUE = { yes: "Accepted", no: "Declined", maybe: "Pending" };
  const FROM_SHEET_VALUE = {
    Accepted: "yes",
    Declined: "no",
    Pending: "maybe",
  };

  const guestId = new URLSearchParams(window.location.search).get("guest");

  /* ---- Sticker selection ---- */
  stickers.forEach((sticker) => {
    sticker.addEventListener("click", () => {
      stickers.forEach((s) => {
        s.classList.remove("is-selected");
        s.setAttribute("aria-pressed", "false");
      });
      sticker.classList.add("is-selected");
      sticker.setAttribute("aria-pressed", "true");
      if (hiddenAnswer) hiddenAnswer.value = sticker.dataset.value;
    });
  });

  /* ---- Pre-fill from Sheet if this is a personalised link ---- */
  if (guestId && window.ScrapbookAPI) {
    ScrapbookAPI.getGuest(guestId)
      .then((guest) => {
        if (!guest || guest.error) return;

        if (guest.Name && nameInput) {
          nameInput.value = guest.Name;
          nameInput.readOnly = true;
        }

        const preselect = FROM_SHEET_VALUE[guest.RSVP];
        if (preselect) {
          stickers.forEach((s) => {
            const match = s.dataset.value === preselect;
            s.classList.toggle("is-selected", match);
            s.setAttribute("aria-pressed", match ? "true" : "false");
          });
          if (hiddenAnswer) hiddenAnswer.value = preselect;
        }
      })
      .catch(() => {
        /* Network error — fall back to local-only form */
      });
  }

  /* ---- Form submit ---- */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() || "friend" : "friend";
    const answer = hiddenAnswer ? hiddenAnswer.value || "maybe" : "maybe";

    /* Show confirmation with animated checkmark */
    if (confirmEl) {
      if (confirmName) confirmName.textContent = name;
      if (confirmMsg) confirmMsg.textContent = MESSAGES[answer];
      confirmEl.classList.add("is-visible");
    }

    /* Sync to Sheet when a guest ID is present */
    if (guestId && window.ScrapbookAPI) {
      ScrapbookAPI.setRsvp(guestId, TO_SHEET_VALUE[answer]).catch(() => {
        if (confirmMsg) {
          confirmMsg.textContent +=
            " (couldn't reach the guest list — try again in a bit)";
        }
      });
    }
  });
})();

/* ==============================================================
   7. HERO STICKER PARALLAX
   --------------------------------------------------------------
   Applies a subtle depth shift to hero stickers on mousemove.
   Floating stickers (.sticker--float) receive their parallax
   through CSS custom properties (--px, --py) so the existing
   CSS keyframe animation isn't interrupted.
   Disabled when prefers-reduced-motion is set.
   ============================================================== */
(function heroParallax() {
  const hero = document.getElementById("hero");
  const stickers = hero ? hero.querySelectorAll(".sticker") : null;
  if (!hero || !stickers || !stickers.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  hero.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;

    stickers.forEach((s, i) => {
      const depth = 6 + (i % 3) * 4;
      const px = (x * depth).toFixed(2) + "px";
      const py = (y * depth).toFixed(2) + "px";

      if (s.classList.contains("sticker--float")) {
        // Floating stickers already animate via CSS; inject parallax via custom props
        s.style.setProperty("--px", px);
        s.style.setProperty("--py", py);
      } else {
        s.style.transform = `translate(${px}, ${py})`;
      }
    });
  });

  hero.addEventListener("mouseleave", () => {
    stickers.forEach((s) => {
      s.style.removeProperty("--px");
      s.style.removeProperty("--py");
      s.style.transform = "";
    });
  });
})();
