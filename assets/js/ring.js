/* ==================================================================
   THE RING — gallery
   Cards shuffle in a stack, then fan out into a slowly turning ring.
   Drag to spin, hover to bring forward, click to open the lightbox.
   Grid view = accessible fallback (auto on mobile / reduced motion).
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
    $('.lb-credits', lb).textContent = `photographer: ${g.photographer} · model: ${g.model} · stylist: ${g.stylist} · mua: ${g.mua}`.toLowerCase();
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
    const stage = $('#stage');
    const COLORS = { 'fit checks': ['#F4E21A', '#0B0B0B'], 'in the magazine': ['#700745', '#fff'] };   // add a line per section
    // tab order follows COLORS, then any other sections in the order they appear
    const SHOOTS = [...new Set([...Object.keys(COLORS).filter(k => G.some(g => g.shoot === k)), ...G.map(g => g.shoot)])];
    const fallback = [['#E5231B', '#fff'], ['#1F6B3A', '#fff'], ['#F0611E', '#0B0B0B'], ['#6E1E2B', '#F2A7C3']];
    const colorOf = (sh, i) => COLORS[sh] || fallback[i % fallback.length];

    // deck = photos + one "section" card per shoot + a back card
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
      if (d.g) { el.className = 'card'; el.innerHTML = `<img src="${d.g.src}" alt="" draggable="false">`; el.dataset.view = 'open →'; }
      else if (d.section) {
        const [bg, fg] = colorOf(d.section, d.si);
        el.className = 'card type t-section';
        el.style.cssText = `background:${bg};color:${fg}`;
        el.innerHTML = `<span class="sec-name">${d.section}</span><span class="sec-count">${G.filter(g => g.shoot === d.section).length} photos →</span>`;
        el.dataset.view = 'enter →';
        el.setAttribute('aria-label', `Show the ${d.section} shoot`);
      } else {
        el.className = 'card type t-back';
        el.innerHTML = '<span class="sec-name">← all</span><span class="sec-count">every shoot</span>';
        el.dataset.view = 'back ←';
        el.setAttribute('aria-label', 'Show all shoots');
      }
      el.style.opacity = 0;
      stage.appendChild(el);
      const ar = d.g ? d.g.h / d.g.w : 1.25;
      return { el, d, ar, idx, cur: { x: 0, y: 80, s: 1.5, r: 0, o: 0 }, tgt: { x: 0, y: 80, s: 1.5, r: 0, o: 0 }, z: idx, jit: [(Math.random() - .5) * 46, (Math.random() - .5) * 34, (Math.random() - .5) * 9] };
    });

    /* sections: tabs on the frame + section cards inside the ring */
    let filter = 'all', active = [], slot = new Map();
    const isActive = c => filter === 'all' ? !c.d.back : (c.d.back || (c.d.g && c.d.g.shoot === filter));
    function applyFilter() {
      active = cards.filter(isActive);
      slot = new Map(active.map((c, i) => [c, i]));
      const photos = active.filter(c => c.d.g).length;
      $('#ring-name').textContent = filter === 'all' ? 'All Shoots' : filter;
      $('#ring-count').textContent = `${photos} photos`;
      $('.panel-corners .shoot-label').textContent = filter === 'all' ? 'the gallery — every shoot' : `the gallery — ${filter}`;
      $$('#ring-sections button').forEach(b => b.setAttribute('aria-pressed', b.dataset.shoot === filter));
    }
    function setFilter(f) {
      if (f === filter) return;
      filter = f; applyFilter();
      if (phase !== 'ring') phase = 'ring';
      ringStart = (performance.now() - t0) / 1000;
      angle -= Math.PI * .5;                                  // a little whirl as the ring re-forms
    }
    $('#ring-sections').innerHTML = ['all', ...SHOOTS].map((s, i) => {
      const dot = s === 'all' ? '#0B0B0B' : colorOf(s, i - 1)[0];
      return `<button data-shoot="${s}" aria-pressed="${s === 'all'}"><i style="background:${dot}"></i>${s === 'all' ? 'all shoots' : s}</button>`;
    }).join('');
    $('#ring-sections').addEventListener('click', e => { const b = e.target.closest('button'); if (b) setFilter(b.dataset.shoot); });

    // controls
    let size = 1, push = .6, tilt = 0;
    const ctr = $('.ring-controls');
    $('#c-tilt', ctr).addEventListener('input', e => tilt = +e.target.value);
    $('#c-size', ctr).addEventListener('input', e => { size = +e.target.value; sizeCards(); });
    $('#c-push', ctr).addEventListener('input', e => push = 1 - +e.target.value);

    function sizeCards() {
      const base = Math.min(stage.clientWidth, stage.clientHeight) * .17 * size;
      cards.forEach(c => { c.el.style.setProperty('--cw', base + 'px'); c.el.style.setProperty('--ch', base * c.ar + 'px'); });
    }
    sizeCards();
    addEventListener('resize', sizeCards);

    // timeline
    const t0 = performance.now();
    const n = cards.length, APPEAR = .09, SHUFFLE_START = n * APPEAR + .3;
    let ringStart = SHUFFLE_START + 1.8;
    let phase = 'stack', topZ = n, lastShuffle = 0, angle = -Math.PI * .35, spin = 0, hover = null, clock = 0;
    applyFilter();

    function ringTarget(c) {
      if (!slot.has(c)) return { x: 0, y: 0, s: .15, r: 0, o: 0, z: 0 };   // filtered out: fold into the centre
      const W = stage.clientWidth, H = stage.clientHeight, m = active.length;
      const R = Math.min(W * .34, H * .36) * (m < 8 ? .85 : 1);
      const a = angle + slot.get(c) / m * Math.PI * 2;
      const depth = (Math.cos(a) + 1) / 2;
      const few = sstep(16, 6, m);                            // small shoots: bigger, flatter ring
      let s = (.28 + few * .32) + depth * (.9 - few * .2) * (1 + few * .35);
      if (c === hover) s *= 1.28;
      return { x: Math.cos(a) * R * 1.12, y: Math.sin(a) * R, s, r: c === hover ? 0 : c.jit[2] / 4.5 * tilt, o: c === hover ? 1 : .4 + few * .3 + depth * (.6 - few * .3), z: c === hover ? 999 : Math.round(depth * 400) + 1 };
    }

    let last = t0;
    function frame(now) {
      const k = Math.min(3, (now - last) / 16.67); last = now;
      const t = (now - t0) / 1000; clock += k / 60;

      if (phase === 'stack') {
        cards.forEach((c, i) => {
          if (t > i * APPEAR) c.tgt = isActive(c) ? { x: c.jit[0], y: c.jit[1], s: 1.55, r: c.jit[2], o: 1 } : { x: 0, y: 0, s: .2, r: 0, o: 0 };
        });
        if (t > SHUFFLE_START && t - lastShuffle > .13) {   // pull a card from below to the top
          lastShuffle = t;
          const under = active.reduce((a, b) => (b.z < a.z ? b : a));
          under.z = ++topZ; under.cur.x += 190 * (Math.random() > .5 ? 1 : -1); under.cur.r += 10;
        }
        if (t > ringStart) phase = 'ring';
      } else {
        spin += ((.0032 * (1 + push * Math.sin(clock * 1.7) * 1.2)) - spin) * .05 * k;
        if (!dragging) angle += spin * k;
        cards.forEach(c => { const rt = ringTarget(c); c.tgt = rt; c.z = rt.z; });
      }

      cards.forEach(c => {
        const order = slot.has(c) ? slot.get(c) : 0;
        const delay = phase === 'ring' ? Math.max(0, Math.min(1, (t - ringStart - order * .025) * 1.6)) : 1;
        const rate = (phase === 'ring' ? .09 : .16) * Math.max(delay, slot.has(c) ? 0 : 1) * k;
        for (const p of ['x', 'y', 's', 'r', 'o']) c.cur[p] += (c.tgt[p] - c.cur[p]) * Math.min(1, rate);
        c.el.style.transform = `translate(-50%,-50%) translate(${c.cur.x.toFixed(1)}px,${c.cur.y.toFixed(1)}px) rotate(${c.cur.r.toFixed(2)}deg) scale(${c.cur.s.toFixed(3)})`;
        c.el.style.opacity = c.cur.o.toFixed(3);
        c.el.style.zIndex = c.z;
        c.el.style.pointerEvents = slot.has(c) ? '' : 'none';
        if (c.el.tagName === 'BUTTON') c.el.tabIndex = slot.has(c) ? 0 : -1;
      });
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    // interaction
    function activate(c) {
      if (c.d.section) setFilter(c.d.section);
      else if (c.d.back) setFilter('all');
      else { const photos = active.filter(x => x.d.g); openLB(photos.indexOf(c), photos.map(x => x.d.g)); }
    }
    let dragging = false, lastX = 0, moved = 0;
    stage.addEventListener('pointerdown', e => { if (e.target.closest('.ring-controls')) return; dragging = true; lastX = e.clientX; moved = 0; });
    addEventListener('pointermove', e => {
      if (dragging && phase === 'ring') { const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); angle += dx * .006; spin = dx * .002; }
      const card = e.target.closest && e.target.closest('.card');
      hover = card && phase === 'ring' && !dragging ? cards.find(c => c.el === card) : null;
    });
    addEventListener('pointerup', e => {
      if (!dragging) return; dragging = false;
      if (moved < 6) {
        const card = e.target.closest && e.target.closest('.card');
        const c = card && cards.find(x => x.el === card);
        if (c) activate(c);
      }
    });
    // keyboard: section / back cards are buttons
    stage.addEventListener('keydown', e => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const c = cards.find(x => x.el === e.target);
      if (c) { e.preventDefault(); activate(c); }
    });
  }
})();
