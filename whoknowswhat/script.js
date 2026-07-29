/* ==============================================================
   1. RANSOM-NOTE HEADLINE
   ============================================================== */
(function buildRansomTitle(){
  const text = "You're Invited";
  const el = document.getElementById('ransomTitle');
  const styles = ['rletter--cut', 'rletter--serif', 'rletter--type'];
  const rotations = [-6,-3,-1,2,4,6,-4,3,-2,5];

  text.split('').forEach((ch, i) => {
    const span = document.createElement('span');
    if (ch === ' '){
      span.className = 'rletter rletter--space';
    } else {
      const style = styles[Math.floor(Math.random()*styles.length)];
      span.className = 'rletter ' + style;
      span.style.setProperty('--r', rotations[i % rotations.length] + 'deg');
      span.textContent = ch;
    }
    el.appendChild(span);
  });
})();

/* ==============================================================
   2. SCROLL REVEAL (IntersectionObserver)
   ============================================================== */
(function scrollReveal(){
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(item => io.observe(item));
})();

/* ==============================================================
   3. ENVELOPE OPEN + CONFETTI
   ============================================================== */
(function envelopeInteraction(){
  const envelope = document.getElementById('envelope');
  const seal = document.getElementById('envelopeSeal');
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  let opened = false;
  let particles = [];
  let animFrame;

  function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const colors = ['#B0273B', '#E3AFC0', '#5A1B28', '#C9C9C6', '#7C6552'];

  function spawnConfetti(originX, originY){
    for (let i = 0; i < 90; i++){
      particles.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() * -12) - 4,
        size: Math.random() * 7 + 4,
        color: colors[Math.floor(Math.random()*colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
        life: 0
      });
    }
    if (!animFrame) animateConfetti();
  }

  function animateConfetti(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.vy += 0.35; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      p.life++;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - p.life / 140);
      if (p.shape === 'rect'){
        ctx.fillRect(-p.size/2, -p.size/4, p.size, p.size/2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size/2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    particles = particles.filter(p => p.life < 140 && p.y < canvas.height + 40);

    if (particles.length > 0){
      animFrame = requestAnimationFrame(animateConfetti);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      animFrame = null;
    }
  }

  function openEnvelope(){
    if (opened) return;
    opened = true;
    envelope.classList.add('is-open');
    const rect = envelope.getBoundingClientRect();
    spawnConfetti(rect.left + rect.width/2, rect.top + 40);
  }

  envelope.addEventListener('click', openEnvelope);
  seal.addEventListener('click', (e) => { e.stopPropagation(); openEnvelope(); });
  envelope.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openEnvelope(); }
  });
})();

/* ==============================================================
   4. COUNTDOWN TIMER
   ============================================================== */
(function countdown(){
  // Target date — matches the invitation card details above.
  const target = new Date('2026-09-20T19:00:00');

  const els = {
    days: document.getElementById('cd-days'),
    hours: document.getElementById('cd-hours'),
    mins: document.getElementById('cd-mins'),
    secs: document.getElementById('cd-secs'),
  };

  function pad(n){ return String(n).padStart(2, '0'); }

  function tick(){
    const now = new Date();
    let diff = Math.max(0, target - now);

    const days = Math.floor(diff / (1000*60*60*24));
    diff -= days * (1000*60*60*24);
    const hours = Math.floor(diff / (1000*60*60));
    diff -= hours * (1000*60*60);
    const mins = Math.floor(diff / (1000*60));
    diff -= mins * (1000*60);
    const secs = Math.floor(diff / 1000);

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.mins.textContent = pad(mins);
    els.secs.textContent = pad(secs);
  }

  tick();
  setInterval(tick, 1000);
})();

/* ==============================================================
   5. CASSETTE / PLAYLIST (visual-only player state)
   ============================================================== */
(function playlist(){
  const cassette = document.getElementById('cassette');
  const tracks = document.querySelectorAll('.track');
  let currentlyPlaying = null;

  tracks.forEach(track => {
    const btn = track.querySelector('.track__play');
    btn.addEventListener('click', () => {
      const isThisPlaying = track.classList.contains('is-active');

      tracks.forEach(t => { t.classList.remove('is-active'); t.querySelector('.track__play').textContent = '▶'; });

      if (isThisPlaying){
        currentlyPlaying = null;
        cassette.classList.remove('is-playing');
      } else {
        track.classList.add('is-active');
        btn.textContent = '❚❚';
        currentlyPlaying = track;
        cassette.classList.add('is-playing');
      }
    });
  });
})();

/* ==============================================================
   6. RSVP FORM
   ============================================================== */
(function rsvp(){
  const form = document.getElementById('rsvpForm');
  const stickers = document.querySelectorAll('.rsvp-sticker');
  const hiddenAnswer = document.getElementById('rsvpAnswer');
  const nameInput = document.getElementById('rsvpName');
  const confirm = document.getElementById('rsvpConfirm');
  const confirmName = document.getElementById('confirmName');
  const confirmMsg = document.getElementById('confirmMsg');

  const messages = {
    yes: "so glad you're coming ♡",
    no: "you'll be missed — let's celebrate soon",
    maybe: "hope you can make it!"
  };
  // Maps the sticker buttons' data-value (yes/no/maybe) to the
  // Sheet's RSVP column values (Accepted/Declined/Pending).
  const toSheetValue = { yes: 'Accepted', no: 'Declined', maybe: 'Pending' };
  const fromSheetValue = { Accepted: 'yes', Declined: 'no', Pending: 'maybe' };

  const guestId = new URLSearchParams(window.location.search).get('guest');

  stickers.forEach(sticker => {
    sticker.addEventListener('click', () => {
      stickers.forEach(s => s.classList.remove('is-selected'));
      sticker.classList.add('is-selected');
      hiddenAnswer.value = sticker.dataset.value;
    });
  });

  // If this is a personalized link (?guest=G001), prefill the
  // guest's name and their current RSVP status from the Sheet.
  if (guestId && window.ScrapbookAPI){
    ScrapbookAPI.getGuest(guestId).then(guest => {
      if (!guest || guest.error) return;
      if (guest.Name){
        nameInput.value = guest.Name;
        nameInput.readOnly = true;
      }
      const preselect = fromSheetValue[guest.RSVP];
      if (preselect){
        stickers.forEach(s => {
          s.classList.toggle('is-selected', s.dataset.value === preselect);
        });
        hiddenAnswer.value = preselect;
      }
    }).catch(() => { /* falls back to the local-only form below */ });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = nameInput.value.trim() || 'friend';
    const answer = hiddenAnswer.value || 'maybe';

    confirmName.textContent = name;
    confirmMsg.textContent = messages[answer];
    confirm.classList.add('is-visible');

    if (guestId && window.ScrapbookAPI){
      ScrapbookAPI.setRsvp(guestId, toSheetValue[answer]).catch(() => {
        confirmMsg.textContent += ' (couldn\'t reach the guest list — try again in a bit)';
      });
    }
  });
})();

/* ==============================================================
   7. SUBTLE PARALLAX ON HERO STICKERS
   ============================================================== */
(function heroParallax(){
  const hero = document.getElementById('hero');
  const stickers = hero.querySelectorAll('.sticker');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  hero.addEventListener('mousemove', (e) => {
    const { innerWidth: w, innerHeight: h } = window;
    const x = (e.clientX / w - 0.5) * 2;
    const y = (e.clientY / h - 0.5) * 2;

    stickers.forEach((s, i) => {
      const depth = 6 + (i % 3) * 4;
      const px = (x * depth).toFixed(2) + 'px';
      const py = (y * depth).toFixed(2) + 'px';
      if (s.classList.contains('sticker--float')){
        // floating stickers are already animated via CSS keyframes,
        // so parallax is passed in through custom properties instead
        // of a competing inline transform.
        s.style.setProperty('--px', px);
        s.style.setProperty('--py', py);
      } else {
        s.style.transform = `translate(${px}, ${py})`;
      }
    });
  });

  hero.addEventListener('mouseleave', () => {
    stickers.forEach(s => {
      s.style.removeProperty('--px');
      s.style.removeProperty('--py');
      s.style.transform = '';
    });
  });
})();
