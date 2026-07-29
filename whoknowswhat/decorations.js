/* ==============================================================
   SCRAPBOOK DECORATION SYSTEM
   --------------------------------------------------------------
   A small factory of reusable "physical" scrapbook pieces —
   tape, torn paper, stamps, doodles, stains — so new pages
   (check-in, admin) can be dressed the same way the hero/
   envelope/countdown already are, without hand-rolling markup
   every time. Each function returns a DOM node you can append
   anywhere. Nothing here touches the existing invitation card.

   Usage:
     import via <script src="decorations.js"></script>
     Scrapbook.tape({ rotate: -8, tone: 'pink' })
     Scrapbook.tornEdge({ side: 'bottom' })
     Scrapbook.stamp({ text: 'CHECKED IN' })
     Scrapbook.doodle({ type: 'arrow', rotate: 12 })
     Scrapbook.stain()
     Scrapbook.sparkle()
     Scrapbook.bow()
     Scrapbook.paperclip()
   ============================================================== */
(function(global){
  function el(tag, className){
    const n = document.createElement(tag);
    if (className) n.className = className;
    return n;
  }

  function rand(min, max){ return Math.random() * (max - min) + min; }

  const Scrapbook = {};

  /* ---- masking tape strip ---- */
  Scrapbook.tape = function({ rotate = rand(-10,10), tone = 'pink', width = 90 } = {}){
    const node = el('div', `deco-tape deco-tape--${tone}`);
    node.style.setProperty('--rot', rotate + 'deg');
    node.style.width = width + 'px';
    return node;
  };

  /* ---- torn paper edge (place at top or bottom of a card) ---- */
  Scrapbook.tornEdge = function({ side = 'bottom' } = {}){
    const node = el('div', `deco-torn deco-torn--${side}`);
    return node;
  };

  /* ---- a small ink/rubber stamp with custom text ---- */
  Scrapbook.stamp = function({ text = 'STAMP', rotate = rand(-8,8), tone = 'cherry' } = {}){
    const node = el('div', `deco-stamp deco-stamp--${tone}`);
    node.style.setProperty('--rot', rotate + 'deg');
    node.textContent = text;
    return node;
  };

  /* ---- handwritten doodle: arrow / underline / circle ---- */
  Scrapbook.doodle = function({ type = 'arrow', rotate = 0 } = {}){
    const wrap = el('div', 'deco-doodle');
    wrap.style.setProperty('--rot', rotate + 'deg');
    const svgs = {
      arrow: '<svg viewBox="0 0 100 60" width="70" height="42"><path d="M4 40 C 30 10, 60 8, 92 24" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M78 14 L94 24 L80 34" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      underline: '<svg viewBox="0 0 120 20" width="90" height="16"><path d="M4 12 C 30 4, 90 4, 116 12" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
      circle: '<svg viewBox="0 0 100 60" width="80" height="50"><ellipse cx="50" cy="30" rx="42" ry="24" stroke="currentColor" stroke-width="3" fill="none"/></svg>'
    };
    wrap.innerHTML = svgs[type] || svgs.arrow;
    return wrap;
  };

  /* ---- coffee stain ring ---- */
  Scrapbook.stain = function({ size = 70 } = {}){
    const node = el('div', 'deco-stain');
    node.style.width = size + 'px';
    node.style.height = size + 'px';
    return node;
  };

  /* ---- tiny sparkle mark ---- */
  Scrapbook.sparkle = function({ rotate = rand(-20,20) } = {}){
    const node = el('div', 'deco-sparkle');
    node.style.setProperty('--rot', rotate + 'deg');
    node.textContent = '✦';
    return node;
  };

  /* ---- bow, reused from hero's SVG style but standalone ---- */
  Scrapbook.bow = function({ rotate = rand(-8,8) } = {}){
    const node = el('div', 'deco-bow');
    node.style.setProperty('--rot', rotate + 'deg');
    node.innerHTML = '<svg viewBox="0 0 120 80" width="52" height="34"><path d="M60 40 C40 10 5 15 5 40 C5 65 40 70 60 40Z" fill="#E3AFC0" stroke="#5A1B28" stroke-width="2.5"/><path d="M60 40 C80 10 115 15 115 40 C115 65 80 70 60 40Z" fill="#E3AFC0" stroke="#5A1B28" stroke-width="2.5"/><circle cx="60" cy="40" r="9" fill="#B0273B" stroke="#5A1B28" stroke-width="2"/></svg>';
    return node;
  };

  /* ---- paperclip, for "attaching" a note to a card ---- */
  Scrapbook.paperclip = function({ rotate = rand(-12,12) } = {}){
    const node = el('div', 'deco-clip');
    node.style.setProperty('--rot', rotate + 'deg');
    return node;
  };

  /* ---- a page-fold corner, to make flat cards feel physical ---- */
  Scrapbook.paperFold = function({ corner = 'br' } = {}){
    const node = el('div', `deco-fold deco-fold--${corner}`);
    return node;
  };

  global.Scrapbook = Scrapbook;
})(window);
