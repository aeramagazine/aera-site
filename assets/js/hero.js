/* ==================================================================
   Home page hero: a magazine that opens and turns its pages.
   Pictures + order come from the data- attributes on #mag in index.html.
   cover (one page) -> page turn -> spread 1 -> turn -> spread 2 -> ... -> cut back to the cover.
   Click, tap or press Enter/Space to turn the page yourself.
================================================================== */
(function () {
  const mag = document.getElementById('mag');
  if (!mag) return;
  const cover = (mag.dataset.cover || '').trim();
  const spreads = (mag.dataset.spreads || '').split(',').map(s => s.trim()).filter(Boolean);
  if (!cover || !spreads.length) return;

  const pages = [cover, ...spreads];                 // 0 = closed cover, 1… = open spreads
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const HOLD_COVER = 1900, HOLD_SPREAD = 2700, FLIP = 1100;   // milliseconds
  mag.style.setProperty('--mag-flip-ms', FLIP + 'ms');

  const book = mag.querySelector('.mag-book');
  const L = mag.querySelector('.mag-pg-l'), R = mag.querySelector('.mag-pg-r');
  const flip = mag.querySelector('.mag-flip');
  const front = flip.querySelector('.mag-front'), back = flip.querySelector('.mag-back');

  // kind: 'l' = left half of a spread picture, 'r' = right half, 'c' = a single page; no src = empty
  function paint(el, src, kind) {
    el.style.backgroundImage = src ? 'url("' + src + '")' : 'none';
    el.style.visibility = src || el.classList.contains('mag-face') ? 'visible' : 'hidden';
    el.dataset.magKind = kind;
  }
  function show(i) {
    if (i === 0) { paint(L, null, 'l'); paint(R, cover, 'c'); }
    else { paint(L, pages[i], 'l'); paint(R, pages[i], 'r'); }
    mag.classList.toggle('is-closed', i === 0);
  }

  let cur = 0, busy = false, timer = null, inView = true;

  function schedule() {
    clearTimeout(timer);
    if (reduce || document.hidden || !inView) return;
    timer = setTimeout(turn, cur === 0 ? HOLD_COVER : HOLD_SPREAD);
  }

  function turn() {
    if (busy) return;
    const i = cur, j = (cur + 1) % pages.length;
    // last spread -> cover (and reduced motion): a straight cut, the book sits in the same spot
    if (j === 0 || reduce) { cur = j; show(j); schedule(); return; }

    busy = true;
    paint(L, i === 0 ? null : pages[i], 'l');                 // left page stays put
    paint(R, pages[j], 'r');                                  // the next right page waits underneath
    paint(front, pages[i], i === 0 ? 'c' : 'r');              // the page being turned: its front…
    paint(back, pages[j], 'l');                               // …and its back (the next left page)
    flip.style.transition = 'none';
    flip.style.transform = 'rotateY(0deg)';
    flip.style.display = 'block';
    void flip.offsetWidth;                                    // let the browser register the start position
    book.classList.add('is-sliding');
    mag.classList.remove('is-closed');                           // opening from the cover slides the book to the middle
    flip.style.transition = 'transform ' + FLIP + 'ms cubic-bezier(.65,.05,.3,1)';
    flip.style.transform = 'rotateY(-180deg)';
    setTimeout(function () {
      cur = j; show(j);
      flip.style.display = 'none';
      book.classList.remove('is-sliding');
      busy = false; schedule();
    }, FLIP + 40);
  }

  mag.addEventListener('click', function () { clearTimeout(timer); turn(); });
  mag.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); clearTimeout(timer); turn(); }
  });
  document.addEventListener('visibilitychange', schedule);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { inView = es[0].isIntersecting; if (inView && !busy) schedule(); else if (!inView) clearTimeout(timer); }, { threshold: .15 }).observe(mag);
  }

  // wait for the pictures so the first turn is smooth, then fade the book in
  Promise.all(pages.map(function (src) {
    return new Promise(function (res) { const im = new Image(); im.onload = im.onerror = res; im.src = src; });
  })).then(function () { show(0); mag.classList.add('is-ready'); schedule(); });
})();
