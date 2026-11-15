/* ==================================================================
   THE RING — gallery
   A big circle of photos that rises into view as you scroll, then turns
   slowly. Drag (or use the arrow keys) to spin it, hover to lift a photo,
   click one to open it. Coloured cards enter a shoot. Grid view = fallback
   for people with reduced motion.
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
    const stage = $('#stage'), rise = $('#ring-rise'), view = $('#ring-view');
    const COLORS = { 'fit checks': ['#FFF8E7', '#0B0B0B'], 'in the magazine': ['#7F1239', '#fff'] };   // add a line per section
    // order of the shoots follows COLORS, then any other sections in the order they appear
    const SHOOTS = [...new Set([...Object.keys(COLORS).filter(k => G.some(g => g.shoot === k)), ...G.map(g => g.shoot)])];
    const fallback = [['#7F1239', '#fff'], ['#330B13', '#fff'], ['#7F1239', '#FFF8E7'], ['#330B13', '#FFF8E7']];
    const colorOf = (sh, i) => COLORS[sh] || fallback[i % fallback.length];
    const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
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

    const cards = deck.map(d => {
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
      stage.appendChild(el);
      const ar = d.g ? clamp(d.g.h / d.g.w, .75, 1.6) : 1.25;
      return { el, d, ar, cur: { x: 0, y: 60, s: 1.4, o: 0 }, tgt: { x: 0, y: 60, s: 1.4, o: 0 }, z: 0 };
    });

    /* which cards are in the ring: everything, or one shoot */
    let filter = 'all', active = [], slot = new Map();
    const isActive = c => filter === 'all' ? !c.d.back : (c.d.back || (c.d.g && c.d.g.shoot === filter));
    function applyFilter() { active = cards.filter(isActive); slot = new Map(active.map((c, i) => [c, i])); }
    function setFilter(f) { if (f === filter) return; filter = f; applyFilter(); ringStart = (performance.now() - t0) / 1000; angle -= Math.PI * .5; }   // a little whirl as the ring re-forms

    function sizeCards() {
      const W = stage.clientWidth, H = stage.clientHeight;
      const base = Math.min(W * .4, H * .27);
      cards.forEach(c => { c.el.style.setProperty('--cw', base + 'px'); c.el.style.setProperty('--ch', base * c.ar + 'px'); });
    }
    sizeCards(); addEventListener('resize', sizeCards);

    const sstep = (a, b, x) => clamp((x - a) / (b - a), 0, 1);
    const t0 = performance.now();
    let angle = -Math.PI * .35, spin = 0, clock = 0, hover = null, started = false, ringStart = 0, progress = 0;
    applyFilter();

    function ringTarget(c) {
      if (!slot.has(c)) return { x: 0, y: 0, s: .15, o: 0, z: 0 };            // filtered out: fold into the centre
      const W = stage.clientWidth, H = stage.clientHeight, m = active.length;
      const R = Math.min(W * .36, H * .35) * (m < 8 ? .85 : 1);
      const a = angle + slot.get(c) / m * Math.PI * 2;
      const depth = (Math.cos(a) + 1) / 2;                                    // 1 = front of the ring
      const few = sstep(16, 6, m);                                            // small shoots: bigger, flatter ring
      let s = (.34 + few * .3) + depth * (.7 - few * .15) * (1 + few * .3);
      if (c === hover) s *= 1.22;
      return { x: Math.cos(a) * R * 1.12, y: Math.sin(a) * R, s, o: c === hover ? 1 : .45 + few * .3 + depth * (.55 - few * .3), z: c === hover ? 999 : Math.round(depth * 400) + 1 };
    }

    /* the ring rises from below as the page scrolls up to it */
    function updateProgress() {
      const r = view.getBoundingClientRect(), vh = innerHeight;
      progress = clamp(1 - r.top / (vh * .75), 0, 1);
      const e = 1 - Math.pow(1 - progress, 3);
      rise.style.transform = `translateY(${((1 - e) * stage.clientHeight * .85).toFixed(1)}px)`;
      if (!started && progress > .25) { started = true; ringStart = (performance.now() - t0) / 1000; }
    }
    addEventListener('scroll', updateProgress, { passive: true }); addEventListener('resize', updateProgress); updateProgress();

    let last = t0;
    function frame(now) {
      const k = Math.min(3, (now - last) / 16.67); last = now;
      const t = (now - t0) / 1000; clock += k / 60;
      if (started) {
        spin += ((.0032 * (1 + .6 * Math.sin(clock * 1.7) * 1.2)) - spin) * .05 * k;
        if (!dragging) angle += spin * k;
        cards.forEach(c => { const rt = ringTarget(c); c.tgt = rt; c.z = rt.z; });
      }
      cards.forEach(c => {
        const order = slot.has(c) ? slot.get(c) : 0;
        const delay = clamp((t - ringStart - order * .03) * 1.6, 0, 1);
        const rate = .09 * Math.max(delay, slot.has(c) ? 0 : 1) * k;
        for (const p of ['x', 'y', 's', 'o']) c.cur[p] += (c.tgt[p] - c.cur[p]) * Math.min(1, rate);
        c.el.style.transform = `translate(-50%,-50%) translate(${c.cur.x.toFixed(1)}px,${c.cur.y.toFixed(1)}px) scale(${c.cur.s.toFixed(3)})`;
        c.el.style.opacity = c.cur.o.toFixed(3);
        c.el.style.zIndex = c.z;
        c.el.style.pointerEvents = slot.has(c) ? '' : 'none';
        if (c.el.tagName === 'BUTTON' || c.el.getAttribute('role') === 'button') c.el.tabIndex = slot.has(c) ? 0 : -1;
      });
      if (stage.scrollLeft) stage.scrollLeft = 0;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    /* interaction */
    function activate(c) {
      if (c.d.section) setFilter(c.d.section);
      else if (c.d.back) setFilter('all');
      else { const photos = active.filter(x => x.d.g); openLB(photos.indexOf(c), photos.map(x => x.d.g)); }
    }
    let dragging = false, lastX = 0, moved = 0;
    stage.addEventListener('pointerdown', e => { if (e.button) return; dragging = true; lastX = e.clientX; moved = 0; });
    addEventListener('pointermove', e => {
      if (dragging) { const dx = e.clientX - lastX; lastX = e.clientX; moved += Math.abs(dx); angle += dx * .006; spin = dx * .002; }
      const el = e.target.closest && e.target.closest('.ring-card');
      hover = el && !dragging ? cards.find(c => c.el === el) : null;
    });
    stage.addEventListener('pointerleave', () => { hover = null; });
    addEventListener('pointerup', e => {
      if (!dragging) return; dragging = false;
      if (moved < 6) {
        const el = e.target.closest && e.target.closest('.ring-card');
        const c = el && cards.find(x => x.el === el);
        if (c) activate(c);
      }
    });
    addEventListener('pointercancel', () => { dragging = false; });
    stage.addEventListener('wheel', e => {      // sideways trackpad swipe turns the ring; up/down keeps scrolling the page
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault(); angle += e.deltaX * .004; spin = e.deltaX * .0008;
    }, { passive: false });
    stage.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); angle += (e.key === 'ArrowRight' ? -1 : 1) * Math.PI * 2 / Math.max(1, active.length); return; }
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const el = e.target.closest('.ring-card'), c = el && cards.find(x => x.el === el);
      if (c) { e.preventDefault(); activate(c); }
    });
  }
})();
