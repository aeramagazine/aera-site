/* ==================================================================
   THE RING — gallery
   You stand in the middle of a big ring of photos. The cards fly in around
   you, then the ring turns slowly. Drag (or use the arrow keys) to look
   around, hover to lift a photo, click one to open it. Coloured cards enter
   a shoot. Grid view = fallback for people with reduced motion.
================================================================== */
(() => {
  const D = window.AERA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const G = D.gallery;
  const sstep = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

  /* ---------------- lightbox ---------------- */
  const lb = $('#lightbox');
  let lbIdx = 0, lbList = G;
  function showLB(i) {
    lbIdx = (i + lbList.length) % lbList.length;
    const g = lbList[lbIdx];
    $('img', lb).src = g.src.replace(/\/(\d+)\/(\d+)$/, (m, w, h) => `/${w * 2}/${h * 2}`);
    $('img', lb).alt = `Photo from the ${g.shoot} shoot`;
    $('.lb-count', lb).textContent = `${String(lbIdx + 1).padStart(2, '0')} / ${String(lbList.length).padStart(2, '0')} — ${g.shoot}`;
    $('.lb-credits', lb).textContent = [['photographer', g.photographer], ['model', g.model], ['stylist', g.stylist], ['mua', g.mua]].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join(' · ').toLowerCase();
  }
  function openLB(i, list = G) { lbList = list; showLB(i); lb.hidden = false; $('.lb-close', lb).focus(); }
  const closeLB = () => { lb.hidden = true; };
  $('.lb-close', lb).addEventListener('click', closeLB);
  $('.lb-prev', lb).addEventListener('click', () => showLB(lbIdx - 1));
  $('.lb-next', lb).addEventListener('click', () => showLB(lbIdx + 1));
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') showLB(lbIdx - 1);
    if (e.key === 'ArrowRight') showLB(lbIdx + 1);
  });
  let tx0 = null;
  lb.addEventListener('touchstart', e => tx0 = e.touches[0].clientX, { passive: true });
  lb.addEventListener('touchend', e => { if (tx0 == null) return; const dx = e.changedTouches[0].clientX - tx0; if (Math.abs(dx) > 50) showLB(lbIdx + (dx < 0 ? 1 : -1)); tx0 = null; });

  /* ---------------- grid view ---------------- */
  const shoots = ['all', ...new Set(G.map(g => g.shoot))];
  $('#shoot-filters').innerHTML = shoots.map(s => `<button class="chip" aria-pressed="${s === 'all'}" data-shoot="${s}">${s}</button>`).join('');
  $('#masonry').innerHTML = G.map((g, i) => `
    <button data-i="${i}" data-shoot="${g.shoot}" aria-label="Open photo ${i + 1} from ${g.shoot}">
      <img src="${g.src}" width="${g.w}" height="${g.h}" alt="" loading="lazy"><span class="cap mono">${g.shoot}</span>
    </button>`).join('');
  $('#shoot-filters').addEventListener('click', e => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('#shoot-filters .chip').forEach(c => c.setAttribute('aria-pressed', c === b));
    $$('#masonry button').forEach(m => m.classList.toggle('hide', b.dataset.shoot !== 'all' && m.dataset.shoot !== b.dataset.shoot));
  });
  $('#masonry').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const visible = $$('#masonry button:not(.hide)');
    openLB(visible.indexOf(b), visible.map(v => G[+v.dataset.i]));
  });

  /* ---------------- one view: the ring (grid only for reduced motion) ---------------- */
  const ringView = $('#ring-view'), gridView = $('#grid-view');
  if (reduced) { ringView.hidden = true; gridView.hidden = false; return; }
  startRing();

  /* ---------------- the ring ---------------- */
  function startRing() {
    const stage = $('#stage'), world = $('#ring-world');
    const COLORS = { 'fit checks': ['#FFF8E7', '#0B0B0B'], 'in the magazine': ['#7F1239', '#fff'] };   // add a line per section
    // order of the shoots follows COLORS, then any other sections in the order they appear
    const SHOOTS = [...new Set([...Object.keys(COLORS).filter(k => G.some(g => g.shoot === k)), ...G.map(g => g.shoot)])];
    const fallback = [['#7F1239', '#fff'], ['#330B13', '#fff'], ['#7F1239', '#FFF8E7'], ['#330B13', '#FFF8E7']];
    const colorOf = (sh, i) => COLORS[sh] || fallback[i % fallback.length];

    const TAU = Math.PI * 2, LOCAL_H = 700, GAP = .12;      // LOCAL_H: card height inside the ring; GAP: space between cards (as a share of card height)
    const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
    const wrap = a => { a = (a + Math.PI) % TAU; if (a < 0) a += TAU; return a - Math.PI; };   // any angle -> -180°..180°
    const sharp = src => src.replace(/\/(\d+)\/(\d+)(\?.*)?$/, (m, w, h, q) => `/${w * 2}/${h * 2}${q || ''}`);   // ask placeholder photos for 2x size

    // deck = photos + one coloured "shoot" card per shoot + a back card (shown inside a shoot)
    const deck = [];
    let si = 0;
    G.forEach((g, i) => {
      deck.push({ g, i });
      if (i % 4 === 2 && si < SHOOTS.length) { deck.push({ section: SHOOTS[si], si }); si++; }
    });
    while (si < SHOOTS.length) { deck.push({ section: SHOOTS[si], si }); si++; }
    deck.push({ back: true });

    const cards = deck.map((d, idx) => {
      const el = document.createElement(d.g ? 'div' : 'button');
      if (d.g) {
        el.className = 'ring-card is-photo';
        el.innerHTML = `<div class="ring-card-in"><img src="${sharp(d.g.src)}" alt="" draggable="false" decoding="async"></div>`;
        el.setAttribute('role', 'button'); el.tabIndex = 0;
        el.setAttribute('aria-label', `Open photo ${d.i + 1} from the ${d.g.shoot} shoot`);
      } else if (d.section) {
        const [bg, fg] = colorOf(d.section, d.si);
        el.className = 'ring-card is-type is-section';
        el.innerHTML = `<div class="ring-card-in" style="background:${bg};color:${fg}"><span class="sec-name">${d.section}</span><span class="sec-count">${G.filter(g => g.shoot === d.section).length} photos →</span></div>`;
        el.setAttribute('aria-label', `Show only the ${d.section} shoot`);
      } else {
        el.className = 'ring-card is-type is-back';
        el.innerHTML = '<div class="ring-card-in"><span class="sec-name">← all</span><span class="sec-count">every shoot</span></div>';
        el.setAttribute('aria-label', 'Show every shoot again');
      }
      world.appendChild(el);
      const wr = d.g ? clamp(d.g.w / d.g.h, .66, 1.25) : .8;       // card width / card height
      return { el, d, wr, base: 0, y: Math.sin(idx * 2.1) * 34, cur: { a: 0, o: 0, k: 1.9 }, appearAt: 0 };
    });

    /* which cards are in the ring: everything, or one shoot */
    let filter = 'all', active = [], slot = new Map();
    const isActive = c => filter === 'all' ? !c.d.back : (c.d.back || (c.d.g && c.d.g.shoot === filter));
    function applyFilter() { active = cards.filter(isActive); slot = new Map(active.map((c, i) => [c, i])); }

    /* size and shape of the ring. The camera sits in the middle, P is how far it looks.
       The ring is sized so the cards touch edge to edge and the front card is about 62% of the screen high. */
    let L = { W: 1, H: 1, P: 1500, R: 3000 };
    function layout() {
      const W = stage.clientWidth, H = stage.clientHeight, n = active.length || 1;
      const wrs = active.map(c => c.wr), C = wrs.reduce((a, b) => a + b, 0) + n * GAP;
      const Ha = Math.min(H * .62, (W * .98) / Math.max(.8, ...wrs));          // how tall the front card looks on screen
      const P = Math.max(Ha * C / TAU, W * .8);                               // never so wide an angle that the sides stretch
      const R = LOCAL_H * P / Ha;
      let acc = 0;
      active.forEach(c => { const share = (c.wr + GAP) / C * TAU; c.base = acc + share / 2; acc += share; });
      L = { W, H, P, R };
      stage.style.perspective = P + 'px';
      cards.forEach(c => { c.el.style.setProperty('--cw', c.wr * LOCAL_H + 'px'); c.el.style.setProperty('--ch', LOCAL_H + 'px'); });
    }

    /* motion state */
    const T0 = performance.now();
    let angle = 0, spinV = 0, glide = 0, yaw = 0, pitch = 0, yawT = 0, pitchT = 0;
    let dragging = false, lastX = 0, moved = 0, hovered = false;

    function enter() {      // cards fly in towards you, one after another
      const t = (performance.now() - T0) / 1000;
      cards.forEach(c => { c.appearAt = t + .12 + (slot.has(c) ? slot.get(c) : 0) * .045; c.cur.o = 0; c.cur.k = 1.9; c.cur.a = c.base; });
      angle = active.length ? active[0].base - .35 : 0; glide = .35;
    }
    function setFilter(f) { if (f === filter) return; filter = f; applyFilter(); layout(); enter(); }
    function activate(c) {
      if (c.d.section) setFilter(c.d.section);
      else if (c.d.back) setFilter('all');
      else { const photos = active.filter(x => x.d.g); openLB(photos.indexOf(c), photos.map(x => x.d.g)); }
    }

    applyFilter(); layout(); enter();
    addEventListener('resize', layout);

    let last = T0;
    function frame(nowMs) {
      const k = Math.min(3, (nowMs - last) / 16.67); last = nowMs;
      const t = (nowMs - T0) / 1000;

      // turning: slow drift, slower while a photo is hovered; drag gives it a push that fades back to the drift
      if (dragging) spinV *= Math.pow(.7, k);
      else { spinV += ((hovered ? .00012 : .0008) - spinV) * .045 * k; angle += spinV * k; }
      const g = glide * Math.min(1, .12 * k); angle += g; glide -= g;       // glide: arrow keys / focus bring a card to the middle
      yaw += (yawT - yaw) * Math.min(1, .06 * k); pitch += (pitchT - pitch) * Math.min(1, .06 * k);   // the view leans a little towards the cursor
      world.style.transform = `translateZ(${L.P.toFixed(1)}px) rotateX(${pitch.toFixed(4)}rad) rotateY(${(angle + yaw).toFixed(4)}rad)`;

      cards.forEach(c => {
        const isIn = slot.has(c), live = isIn && t >= c.appearAt;
        if (isIn) c.cur.a += (c.base - c.cur.a) * Math.min(1, .1 * k);
        c.cur.o += ((live ? 1 : 0) - c.cur.o) * Math.min(1, (live ? .07 : .2) * k);
        c.cur.k += ((live ? 1 : isIn ? 1.9 : 1.5) - c.cur.k) * Math.min(1, .06 * k);
        const th = wrap(angle + yaw - c.cur.a);                              // where this card is relative to where you look
        const appW = c.wr * LOCAL_H * L.P / (L.R * c.cur.k);                 // how wide it looks on screen
        const show = c.cur.o > .02 && Math.abs(th) < 1.3 && Math.abs(Math.tan(th)) * L.P < L.W / 2 + appW * .75 + 80;
        if (show !== c.shown) { c.shown = show; c.el.style.visibility = show ? 'visible' : 'hidden'; }
        if (!show) return;
        c.el.style.transform = `rotateY(${(-c.cur.a).toFixed(4)}rad) translateZ(${(-L.R * c.cur.k).toFixed(1)}px) translateY(${c.y.toFixed(1)}px)`;
        c.el.style.opacity = c.cur.o.toFixed(3);
        c.el.style.pointerEvents = isIn ? '' : 'none';
        if (c.el.tabIndex !== (isIn ? 0 : -1)) c.el.tabIndex = isIn ? 0 : -1;
      });
      if (stage.scrollLeft || stage.parentElement.scrollLeft) { stage.scrollLeft = 0; stage.parentElement.scrollLeft = 0; }   // focus must never scroll the ring sideways
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    /* interaction */
    stage.addEventListener('pointerdown', e => { if (e.button) return; dragging = true; lastX = e.clientX; moved = 0; spinV = 0; });
    addEventListener('pointermove', e => {
      if (dragging) { const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); const d = -dx / L.P; angle += d; spinV = d; }
      const over = e.target.closest && e.target.closest('.ring-card');
      hovered = !!over && !dragging;
    });
    stage.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = stage.getBoundingClientRect();
      yawT = ((e.clientX - r.left) / r.width - .5) * .1; pitchT = -((e.clientY - r.top) / r.height - .5) * .06;
    });
    stage.addEventListener('pointerleave', () => { yawT = 0; pitchT = 0; hovered = false; });
    addEventListener('pointerup', e => {
      if (!dragging) return; dragging = false;
      if (moved < 6) {
        const el = e.target.closest && e.target.closest('.ring-card');
        const c = el && cards.find(x => x.el === el);
        if (c) activate(c);
      }
    });
    addEventListener('pointercancel', () => { dragging = false; });
    // trackpad: a sideways swipe turns the ring (up/down still scrolls the page down to the footer)
    stage.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault(); const d = e.deltaX / L.P * .8; angle += d; spinV = d;
    }, { passive: false });
    // keyboard: Tab moves between cards (the ring turns to bring the focused one to the middle), arrows turn the ring, Enter opens
    stage.addEventListener('focusin', e => {
      const el = e.target.closest('.ring-card'), c = el && cards.find(x => x.el === el);
      if (!c || !slot.has(c) || !e.target.matches(':focus-visible')) return;
      glide = wrap(c.base - angle); spinV = 0;
    });
    stage.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); glide += (e.key === 'ArrowRight' ? 1 : -1) * TAU / Math.max(1, active.length); return; }
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const el = e.target.closest('.ring-card'), c = el && cards.find(x => x.el === el);
      if (c) { e.preventDefault(); activate(c); }
    });
  }
})();
