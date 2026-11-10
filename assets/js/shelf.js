/* ==================================================================
   THE AERA BOOKSHELF
   Endless row of spines. One book at a time turns to show its cover.
   Drag / swipe / scroll to push the shelf. Hover (or tap) a spine to
   open it, click an open cover to visit it.
================================================================== */
window.initShelf = function (el, books) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const GAP = 7, EDGE = 260;

  // repeat the set until the row is comfortably wider than any screen
  const setW = books.reduce((a, b) => a + b.sw + GAP, 0);
  const reps = Math.max(2, Math.ceil((Math.max(innerWidth, 1600) + EDGE * 2 + 600) / setW));
  const list = [];
  for (let r = 0; r < reps; r++) books.forEach(b => list.push({ b, dup: r > 0 }));

  const items = list.map(({ b, dup }) => {
    const a = document.createElement('a');
    a.className = `book ${b.font}${b.lean ? ' lean' : ''}`;
    a.href = b.href;
    a.draggable = false;
    a.style.cssText = `--h:${b.h}px;--sw:${b.sw}px;--cw:${b.cw}px;--c:${b.c};--t:${b.t};width:${b.sw}px`;
    a.setAttribute('aria-label', b.cap);
    if (dup) { a.tabIndex = -1; a.setAttribute('aria-hidden', 'true'); }
    a.innerHTML = `
      <div class="book-3d">
        <div class="spine">${b.dot ? '<span class="dotmark"></span>' : '<span></span>'}<span class="spine-title">${b.title}</span><span class="spine-sub">${b.sub}</span></div>
        <div class="cover">${b.img ? `<img src="${b.img}" alt="" loading="lazy" draggable="false">` : `<span class="cover-blank">${b.coverText || 'coming soon'}</span>`}<span class="mast">AERA</span><span class="cap">${b.cap}</span></div>
      </div>`;
    el.appendChild(a);
    return { el: a, b, w: b.sw, target: b.sw, x: 0 };
  });
  const n = items.length;

  // shrink each spine title until it fits the spine
  const fit = () => items.forEach(it => {
    const t = it.el.querySelector('.spine-title'), sub = it.el.querySelector('.spine-sub');
    t.style.fontSize = '';
    let fs = parseFloat(getComputedStyle(t).fontSize);
    const avail = it.b.h - sub.offsetHeight - 34;
    while (t.offsetHeight > avail && fs > 8) { fs -= 1; t.style.fontSize = fs + 'px'; }
  });
  document.fonts.ready.then(fit);

  let first = 0, xFirst = 0, v = 0, current = null, hovering = false;
  const AUTO = reduced ? 0 : -0.55;

  function setOpen(it) {
    if (current === it) return;
    if (current) { current.target = current.b.sw; current.el.classList.remove('open'); }
    current = it;
    if (it) { it.target = it.b.cw; it.el.classList.add('open'); }
  }

  /* ---- frame loop ---- */
  let last = performance.now();
  function frame(now) {
    const k = Math.min(3, (now - last) / 16.67); last = now;
    if (!dragging) {
      const goal = hovering ? 0 : AUTO;
      v += (goal - v) * .04 * k;
      xFirst += v * k;
    }
    // grow/shrink books, but keep the opening book in place so the row doesn't jump
    const anchor = current && current.x > -EDGE && current.x < el.clientWidth ? current : null;
    let shift = 0;
    for (let j = 0; j < n; j++) {
      const it = items[(first + j) % n];
      if (it === anchor) break;
      if (Math.abs(it.target - it.w) > .3) {
        const nw = it.w + (it.target - it.w) * Math.min(1, .1 * k);
        shift += nw - it.w;
      }
    }
    for (const it of items) {
      if (Math.abs(it.target - it.w) > .3) { it.w += (it.target - it.w) * Math.min(1, .1 * k); it.el.style.width = it.w + 'px'; }
      else if (it.w !== it.target) { it.w = it.target; it.el.style.width = it.w + 'px'; }
    }
    xFirst -= shift;
    while (xFirst + items[first].w + GAP < -EDGE) { xFirst += items[first].w + GAP; first = (first + 1) % n; }
    while (xFirst > -EDGE) { first = (first - 1 + n) % n; xFirst -= items[first].w + GAP; }
    let x = xFirst;
    for (let j = 0; j < n; j++) {
      const it = items[(first + j) % n];
      it.x = x;
      it.el.style.transform = `translate3d(${x.toFixed(1)}px,0,0)`;
      x += it.w + GAP;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---- auto-feature: a book near the centre turns to face you ---- */
  function feature() {
    if (hovering || dragging) return;
    const W = el.clientWidth, mid = W * .56;
    let best = null, bd = Infinity;
    for (const it of items) {
      const c = it.x + it.b.sw / 2;
      if (c < W * .3 || c > W * .82 || it === current) continue;
      const d = Math.abs(c - mid);
      if (d < bd) { bd = d; best = it; }
    }
    if (best) setOpen(best);
  }
  setTimeout(feature, 900);
  if (!reduced) setInterval(feature, 3200);

  /* ---- hover / focus / tap ---- */
  let lastPointer = 'mouse', hoverT = 0;
  items.forEach(it => {
    it.el.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' || dragging || current === it) return;
      hovering = true;
      clearTimeout(hoverT); hoverT = setTimeout(() => setOpen(it), 120);
    });
    it.el.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') { hovering = false; clearTimeout(hoverT); } });
    it.el.addEventListener('focus', () => { hovering = true; setOpen(it); });
    it.el.addEventListener('blur', () => { hovering = false; });
    it.el.addEventListener('click', e => {
      if (lastPointer !== 'mouse' && current !== it) { e.preventDefault(); setOpen(it); }
    });
  });

  /* ---- drag / swipe ---- */
  let dragging = false, lastX = 0, moved = 0, dragV = 0;
  el.addEventListener('pointerdown', e => {
    lastPointer = e.pointerType;
    dragging = true; lastX = e.clientX; moved = 0; dragV = 0;
  });
  addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - lastX; lastX = e.clientX;
    moved += Math.abs(dx); xFirst += dx; dragV = dx;
  });
  addEventListener('pointerup', () => { if (dragging) { dragging = false; v = Math.max(-30, Math.min(30, dragV)); } });
  addEventListener('pointercancel', () => { dragging = false; });
  el.addEventListener('click', e => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
  el.addEventListener('dragstart', e => e.preventDefault());

  /* ---- page scroll pushes the shelf (down = faster, up = reverse) ---- */
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const dy = scrollY - lastY; lastY = scrollY;
    if (!reduced) v = Math.max(-12, Math.min(12, v - Math.max(-60, Math.min(60, dy)) * .04));
  }, { passive: true });
};
