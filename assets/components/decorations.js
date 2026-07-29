/* ==============================================================
   SCRAPBOOK DECORATION SYSTEM
   --------------------------------------------------------------
   A small factory of reusable "physical" scrapbook pieces —
   tape, torn paper, stamps, doodles, stains, sparkles, bows,
   paperclips, and page-fold corners — so any page (check-in,
   admin) can be dressed the same way the hero/envelope/countdown
   already are, without hand-rolling markup every time.

   Each function returns a ready-to-append DOM node.
   Nothing here touches the invitation card HTML.

   Usage (after loading this script):
     Scrapbook.tape({ rotate: -8, tone: 'pink' })
     Scrapbook.tornEdge({ side: 'bottom' })
     Scrapbook.stamp({ text: 'CHECKED IN', tone: 'cherry' })
     Scrapbook.doodle({ type: 'arrow', rotate: 12 })
     Scrapbook.stain({ size: 60 })
     Scrapbook.sparkle()
     Scrapbook.bow()
     Scrapbook.paperclip()
     Scrapbook.paperFold({ corner: 'br' })

   Exposed as: window.Scrapbook
   ============================================================== */
(function (global) {

  /* ---- private helpers ---- */

  /** Create an element with an optional class string. */
  function el(tag, className) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  /** Return a random float between min and max. */
  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  /* ---- public factory object ---- */

  const Scrapbook = {};

  /**
   * A strip of washi/masking tape.
   * @param {Object} opts
   * @param {number}  [opts.rotate]  Rotation in degrees. Default: random ±10.
   * @param {string}  [opts.tone]    'pink' | 'silver' | 'cherry'. Default: 'pink'.
   * @param {number}  [opts.width]   Width in px. Default: 90.
   */
  Scrapbook.tape = function ({ rotate = rand(-10, 10), tone = 'pink', width = 90 } = {}) {
    const node = el('div', `deco-tape deco-tape--${tone}`);
    node.style.setProperty('--rot', rotate + 'deg');
    node.style.width = width + 'px';
    return node;
  };

  /**
   * A torn paper edge — place at the top or bottom of a card.
   * @param {Object} opts
   * @param {string} [opts.side] 'top' | 'bottom'. Default: 'bottom'.
   */
  Scrapbook.tornEdge = function ({ side = 'bottom' } = {}) {
    return el('div', `deco-torn deco-torn--${side}`);
  };

  /**
   * A small ink/rubber stamp with custom text.
   * @param {Object} opts
   * @param {string} [opts.text]    Stamp text. Default: 'STAMP'.
   * @param {number} [opts.rotate]  Rotation in degrees. Default: random ±8.
   * @param {string} [opts.tone]    'cherry' | 'ink' | 'brown'. Default: 'cherry'.
   */
  Scrapbook.stamp = function ({ text = 'STAMP', rotate = rand(-8, 8), tone = 'cherry' } = {}) {
    const node = el('div', `deco-stamp deco-stamp--${tone}`);
    node.style.setProperty('--rot', rotate + 'deg');
    node.textContent = text;
    return node;
  };

  /**
   * A handwritten SVG doodle (arrow, underline, or circle).
   * @param {Object} opts
   * @param {string} [opts.type]    'arrow' | 'underline' | 'circle'. Default: 'arrow'.
   * @param {number} [opts.rotate]  Rotation in degrees. Default: 0.
   */
  Scrapbook.doodle = function ({ type = 'arrow', rotate = 0 } = {}) {
    const wrap = el('div', 'deco-doodle');
    wrap.style.setProperty('--rot', rotate + 'deg');

    const svgs = {
      arrow:     '<svg viewBox="0 0 100 60" width="70" height="42"><path d="M4 40 C 30 10, 60 8, 92 24" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M78 14 L94 24 L80 34" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      underline: '<svg viewBox="0 0 120 20" width="90" height="16"><path d="M4 12 C 30 4, 90 4, 116 12" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
      circle:    '<svg viewBox="0 0 100 60" width="80" height="50"><ellipse cx="50" cy="30" rx="42" ry="24" stroke="currentColor" stroke-width="3" fill="none"/></svg>'
    };

    wrap.innerHTML = svgs[type] || svgs.arrow;
    return wrap;
  };

  /**
   * A coffee-stain ring.
   * @param {Object} opts
   * @param {number} [opts.size] Diameter in px. Default: 70.
   */
  Scrapbook.stain = function ({ size = 70 } = {}) {
    const node = el('div', 'deco-stain');
    node.style.width  = size + 'px';
    node.style.height = size + 'px';
    return node;
  };

  /**
   * A tiny sparkle mark (✦).
   * @param {Object} opts
   * @param {number} [opts.rotate] Rotation in degrees. Default: random ±20.
   */
  Scrapbook.sparkle = function ({ rotate = rand(-20, 20) } = {}) {
    const node = el('div', 'deco-sparkle');
    node.style.setProperty('--rot', rotate + 'deg');
    node.textContent = '✦';
    return node;
  };

  /**
   * A decorative bow (SVG, reuses the hero's visual language).
   * @param {Object} opts
   * @param {number} [opts.rotate] Rotation in degrees. Default: random ±8.
   */
  Scrapbook.bow = function ({ rotate = rand(-8, 8) } = {}) {
    const node = el('div', 'deco-bow');
    node.style.setProperty('--rot', rotate + 'deg');
    node.innerHTML = '<svg viewBox="0 0 120 80" width="52" height="34"><path d="M60 40 C40 10 5 15 5 40 C5 65 40 70 60 40Z" fill="#E3AFC0" stroke="#5A1B28" stroke-width="2.5"/><path d="M60 40 C80 10 115 15 115 40 C115 65 80 70 60 40Z" fill="#E3AFC0" stroke="#5A1B28" stroke-width="2.5"/><circle cx="60" cy="40" r="9" fill="#B0273B" stroke="#5A1B28" stroke-width="2"/></svg>';
    return node;
  };

  /**
   * A paperclip, for visually "attaching" a note to a card.
   * @param {Object} opts
   * @param {number} [opts.rotate] Rotation in degrees. Default: random ±12.
   */
  Scrapbook.paperclip = function ({ rotate = rand(-12, 12) } = {}) {
    const node = el('div', 'deco-clip');
    node.style.setProperty('--rot', rotate + 'deg');
    return node;
  };

  /**
   * A page-fold corner, making flat cards feel physical.
   * @param {Object} opts
   * @param {string} [opts.corner] 'br' | 'tr'. Default: 'br'.
   */
  Scrapbook.paperFold = function ({ corner = 'br' } = {}) {
    return el('div', `deco-fold deco-fold--${corner}`);
  };

  global.Scrapbook = Scrapbook;

})(window);
