/* ==================================================================
   AERA MAGAZINE — shared behaviour + page rendering
================================================================== */
(() => {
  const D = window.AERA;
  const page = document.body.dataset.page;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const NS = 'http://www.w3.org/2000/svg';
  const staffById = Object.fromEntries(D.staff.map(s => [s.id, s]));

  // seeded random so hand-drawn shapes look the same on every load
  function rng(seed) {
    return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  // smooth path through points (quadratic midpoints)
  function smooth(pts, close = false) {
    if (pts.length < 3) return '';
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
      d += ` Q${pts[i][0].toFixed(1)},${pts[i][1].toFixed(1)} ${mx.toFixed(1)},${my.toFixed(1)}`;
    }
    const l = pts[pts.length - 1];
    d += ` L${l[0].toFixed(1)},${l[1].toFixed(1)}`;
    return close ? d + ' Z' : d;
  }
  function addPath(parent, d) {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    parent.appendChild(p);
    return p;
  }

  /* ---------------- header + footer ---------------- */
  const links = [['home', 'index.html'], ['about', 'about.html'], ['stories', 'stories.html'], ['gallery', 'gallery.html'], ['staff', 'staff.html'], ['archive', 'archive.html'], ['join us', 'join.html']];
  const pageOf = { home: 'home', about: 'about', stories: 'stories', story: 'stories', gallery: 'gallery', staff: 'staff', archive: 'archive', join: 'join us' };
  const MENU_COLORS = ['#E7B6D1', '#E9EBC8', '#8FA0FF', '#F0611E', '#E7B6D1', '#E7A71C', '#D5F45A'];
  const MENU_NOTES = ['back to the start', 'mission & sections', 'culture · politics · environment', 'fit checks & shoots', 'meet the team', 'every issue', 'thursdays @ lunch'];
  const header = $('#site-header');
  if (header) {
    header.outerHTML = `
    <header class="site-nav">
      <a class="nav-logo" href="index.html" aria-label="Aera Magazine home">aera</a>
      <nav class="nav-links" aria-label="Main">
        ${links.map(([l, h]) => `<a href="${h}" ${pageOf[page] === l ? 'aria-current="page"' : ''}>${l}</a>`).join('')}
      </nav>
      <div class="nav-right">
        <a class="nav-ig" href="${D.instagram}" target="_blank" rel="noopener">instagram ↗</a>
        <button class="nav-toggle" aria-expanded="false" aria-controls="mobile-menu">menu</button>
      </div>
    </header>
    <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
      <div class="menu-top"><span class="menu-logo">aera</span><button class="close">close ✕</button></div>
      <nav class="menu-links" aria-label="Menu">
        ${links.map(([l, h], i) => `<a href="${h}" style="--hc:${MENU_COLORS[i]}" ${pageOf[page] === l ? 'aria-current="page"' : ''}><small>${String(i + 1).padStart(2, '0')}</small><span>${l}</span><em>${MENU_NOTES[i]}</em></a>`).join('')}
      </nav>
      <aside class="menu-info mono">
        <p>a student fashion magazine<br>palo alto high school</p>
        <p>meetings<br>thursdays @ lunch · room 310</p>
        <p><a href="${D.instagram}" target="_blank" rel="noopener">${D.handle}</a><br><a href="mailto:${D.email}">${D.email}</a></p>
      </aside>
    </div>`;
    const menu = $('#mobile-menu'), tog = $('.nav-toggle');
    const setMenu = open => {
      menu.classList.toggle('open', open); menu.setAttribute('aria-hidden', !open); tog.setAttribute('aria-expanded', open);
      document.documentElement.style.overflow = open ? 'hidden' : '';
      if (open) setTimeout(() => $('.close', menu).focus(), 300); else tog.focus();
    };
    tog.addEventListener('click', () => setMenu(true));
    $('.close', menu).addEventListener('click', () => setMenu(false));
    addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));
  }

  const footer = $('#site-footer');
  if (footer) {
    footer.outerHTML = `
    <footer class="site-footer">
      <div>
        <div class="big">AERA</div>
        <p class="mono muted" style="margin:8px 0 0">a student fashion publication of ${D.school}</p>
        <form class="newsletter" onsubmit="event.preventDefault(); this.querySelector('button').textContent='thank you ♥';">
          <label class="sr-only" for="nl">Email</label>
          <input id="nl" type="email" placeholder="get each issue in your inbox" required>
          <button>subscribe →</button>
        </form>
      </div>
      <ul class="mono">
        ${links.map(([l, h]) => `<li><a href="${h}">${l}</a></li>`).join('')}
      </ul>
      <ul class="mono">
        <li><a href="${D.instagram}" target="_blank" rel="noopener">${D.handle}</a></li>
        <li><a href="mailto:${D.email}">${D.email}</a></li>
        <li><a href="join.html#submit">submit your work</a></li>
        <li><a href="join.html#policies">policies</a></li>
      </ul>
      <div class="footer-base mono muted">
        <span>© ${new Date().getFullYear()} aera magazine</span>
      </div>
    </footer>`;
  }

  // breadcrumb on inner pages: "home / staff"
  const ph = $('.page-head');
  if (ph && page !== 'home') ph.insertAdjacentHTML('afterbegin', `<div class="crumbs mono"><a href="index.html">home</a><span>/</span><span>${pageOf[page]}</span></div>`);

  /* ---------------- custom cursor ---------------- */
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const c = document.createElement('div');
    c.className = 'cursor'; c.innerHTML = '<span>view →</span>';
    document.body.appendChild(c);
    let mx = innerWidth / 2, my = innerHeight / 2, cx = mx, cy = my;
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; });
    const VIEW = '.book, .card, .cutout, .story-card, .poster-block, .issue-card, .ig-grid a, .masonry button, .story-row a, .polaroid, [data-view]';
    document.addEventListener('pointerover', e => {
      const t = e.target.closest(VIEW);
      c.classList.toggle('view', !!t);
      if (t) c.firstChild.textContent = t.dataset.view || 'view →';
    });
    (function loop() { cx += (mx - cx) * .22; cy += (my - cy) * .22; c.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); })();
  }

  /* ---------------- hand-drawn ornament ---------------- */
  function buildOrnament(svg, mirror) {
    const W = 600, H = 150, r = rng(7);
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const g = document.createElementNS(NS, 'g');
    if (mirror) g.setAttribute('transform', `translate(${W},0) scale(-1,1)`);
    svg.appendChild(g);
    const cx = 512, cy = 76;
    // spiral
    const sp = [];
    for (let th = 0; th < Math.PI * 9.4; th += .14) {
      const rad = 3 + th * 2.05 + Math.sin(th * 5) * 1.1 + (r() - .5) * .6;
      sp.push([cx + Math.cos(th) * rad, cy + Math.sin(th) * rad * .92]);
    }
    addPath(g, smooth(sp));
    // second, looser spiral ring
    const sp2 = [];
    for (let th = Math.PI * 5.5; th < Math.PI * 9.6; th += .16) {
      const rad = 10 + th * 2.05 + (r() - .5) * 1.4;
      sp2.push([cx + Math.cos(th) * rad, cy + Math.sin(th) * rad * .92]);
    }
    addPath(g, smooth(sp2));
    // flames streaming left
    for (let k = 0; k < 6; k++) {
      const sx = cx - 50 - k * 4 + r() * 6, sy = cy + (k - 2.5) * 15 + (r() - .5) * 6;
      const tx = 10 + k * 34 + r() * 50, ty = cy + (k - 2.5) * 16 + (r() - .5) * 18;
      const w = 30 - k * 2.6, ph = r() * 6, freq = 1.4 + r() * 1.6;
      const top = [], bot = [];
      for (let i = 0; i <= 30; i++) {
        const t = i / 30;
        const bx = sx + (tx - sx) * t, by = sy + (ty - sy) * t;
        const wave = Math.sin(t * Math.PI * freq + ph) * 12 * (1 - t * .5);
        const off = w * Math.pow(Math.sin(Math.PI * Math.min(1, t * 1.05)), .55) * (1 + Math.sin(t * 19 + ph) * .18);
        top.push([bx, by - off + wave + (r() - .5) * 1.2]);
        bot.push([bx, by + off * .8 + wave + (r() - .5) * 1.2]);
      }
      addPath(g, smooth([...top, ...bot.reverse()], true));
      // vein
      if (k % 2 === 0) {
        const v = [];
        for (let i = 2; i <= 22; i++) { const t = i / 30; v.push([sx + (tx - sx) * t, sy + (ty - sy) * t + Math.sin(t * Math.PI * freq + ph) * 12 * (1 - t * .5) + Math.sin(t * 30) * 2]); }
        addPath(g, smooth(v));
      }
    }
    // little curls
    for (let k = 0; k < 4; k++) {
      const x0 = 80 + r() * 300, y0 = 22 + r() * 106, c = [];
      for (let th = 0; th < Math.PI * 3.4; th += .25) { const rad = 1 + th * 2.2; c.push([x0 + Math.cos(th) * rad, y0 + Math.sin(th) * rad]); }
      addPath(g, smooth(c));
    }
    return $$('path', svg);
  }
  function drawIn(paths, dur = 2.4, stagger = .12) {
    paths.forEach((p, i) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = reduced ? 0 : len;
      if (!reduced) {
        p.getBoundingClientRect();
        p.style.transition = `stroke-dashoffset ${dur}s cubic-bezier(.6,.1,.2,1) ${i * stagger}s`;
        requestAnimationFrame(() => p.style.strokeDashoffset = 0);
      }
    });
  }
  const orns = $$('.ornament');
  if (orns.length) {
    orns.forEach((svg, i) => drawIn(buildOrnament(svg, i === 1)));
    if (!reduced) addEventListener('scroll', () => {
      const y = Math.min(scrollY, 600);
      orns[0].style.transform = `translateX(${-y * .25}px)`;
      orns[1] && (orns[1].style.transform = `translateX(${y * .25}px)`);
      orns.forEach(o => o.style.opacity = 1 - y / 420);
    }, { passive: true });
  }

  /* ---------------- AERA wordmark: letters light up as a finger slides over them ---------------- */
  const wm = $('.wordmark');
  if (wm) wm.addEventListener('touchmove', e => {
    const t = e.touches[0], el = document.elementFromPoint(t.clientX, t.clientY);
    if (!el || el.parentElement !== wm) return;
    el.classList.add('lit');
    clearTimeout(el._lit); el._lit = setTimeout(() => el.classList.remove('lit'), 700);
  }, { passive: true });

  /* ---------------- reveal on scroll ---------------- */
  function initReveal() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    $$('.reveal:not(.in)').forEach(el => io.observe(el));
  }

  /* ---------------- shared bits ---------------- */
  const issueOf = no => D.issues.find(i => i.no === no);
  const storyUrl = s => `story.html?id=${s.id}`;

  // books for the shelf: issues + stories + sections
  window.AERA_BOOKS = function (only) {
    const fonts = ['f-cond', 'f-didone', 'f-mono', 'f-script', 'f-dot', 'f-spaced'];
    const r = rng(42);
    const issueBooks = D.issues.map((is, i) => ({
      title: is.title, sub: `issue ${is.no}`, c: is.color, t: is.ink, font: ['f-didone', 'f-cond', 'f-spaced', 'f-dot', 'f-cond', 'f-script'][i],
      sw: 48 + Math.round(r() * 26), h: 230 + Math.round(r() * 50), href: `archive.html#${is.id}`, img: is.img,
      cap: `issue ${is.no} — “${is.title}” — ${is.season}`, dot: is.current, coverText: is.img ? '' : `issue ${is.no}<br>coming soon`
    }));
    if (only === 'issues') return issueBooks;
    const storyBooks = D.stories.map((s, i) => ({
      title: s.title.replace(/[:?()]/g, '').split(' ').slice(0, 3).join(' '), sub: s.tag, c: s.color,
      t: ['#F4E21A', '#F2A7C3', '#E7D3DF', '#EDE6D6'].includes(s.color) ? '#0B0B0B' : '#FFFFFF',
      font: fonts[(i + 2) % fonts.length], sw: 30 + Math.round(r() * 26), h: 180 + Math.round(r() * 80),
      href: storyUrl(s), img: (s.img || '').replace('1400/1000', '520/720'), cap: `${s.tag} — “${s.title}”`, dot: i % 3 === 0
    }));
    const pic = shoot => (D.gallery.find(g => g.shoot === shoot) || D.gallery[0] || {}).src || '';
    const deskBooks = [
      { title: 'fashion & culture', sub: 'desk', c: '#700745', t: '#FFFFFF', font: 'f-didone', sw: 40, h: 252, href: 'stories.html', img: '', coverText: 'fashion &amp; culture<br>stories coming soon', cap: 'fashion & culture desk — stories coming soon' },
      { title: 'fashion & politics', sub: 'desk', c: '#E5231B', t: '#FFFFFF', font: 'f-cond', sw: 46, h: 236, href: 'stories.html', img: '', coverText: 'fashion &amp; politics<br>stories coming soon', cap: 'fashion & politics desk — stories coming soon', dot: true },
      { title: 'fashion & environment', sub: 'desk', c: '#1F6B3A', t: '#FFFFFF', font: 'f-mono', sw: 30, h: 266, href: 'stories.html', img: '', coverText: 'fashion &amp; environment<br>stories coming soon', cap: 'fashion & environment desk — stories coming soon' },
      { title: 'fit checks', sub: 'gallery', c: '#F4E21A', t: '#0B0B0B', font: 'f-spaced', sw: 42, h: 214, href: 'gallery.html', img: pic('fit checks'), cap: 'fit checks — in the gallery' },
      { title: 'in the magazine', sub: 'gallery', c: '#2433E8', t: '#FFFFFF', font: 'f-script', sw: 38, h: 246, href: 'gallery.html', img: pic('in the magazine'), cap: 'in the magazine — in the gallery' }
    ];
    const sectionBooks = [
      { title: 'the gallery', sub: 'photography', c: '#F0611E', t: '#0B0B0B', font: 'f-cond', sw: 44, h: 250, href: 'gallery.html', img: (D.gallery[0] || {}).src || '', cap: 'the gallery — every shoot, every photo' },
      { title: 'masthead', sub: 'staff', c: '#EDE6D6', t: '#0B0B0B', font: 'f-mono', sw: 26, h: 270, href: 'staff.html', img: D.staff[0].alt, cap: 'meet the staff' },
      { title: 'Join Us', sub: 'open to all', c: '#D5F45A', t: '#0B0B0B', font: 'f-script', sw: 40, h: 200, href: 'join.html', img: '', coverText: 'join us<br>open to all', cap: 'join aera — open all year' },
      { title: 'our mission', sub: 'about', c: '#6E1E2B', t: '#E7D3DF', font: 'f-didone', sw: 36, h: 240, href: 'about.html', img: '', coverText: 'fashion within its era', cap: 'about aera magazine' },
      { title: 'ROOM 310', sub: 'thursdays @ lunch', c: '#E9EBC8', t: '#2433E8', font: 'f-spaced', sw: 46, h: 265, href: 'join.html', img: '', coverText: 'room 310<br>thursdays @ lunch', cap: 'come to a meeting — room 310, thursdays at lunch' }
    ];
    // interleave so colours mix nicely
    const all = [], pools = [issueBooks, deskBooks, storyBooks, sectionBooks], total = pools.reduce((n, p) => n + p.length, 0);
    for (let i = 0; all.length < total; i++) pools.forEach(p => p[i] && all.push(p[i]));
    all.forEach((b, i) => { b.lean = i % 7 === 4; b.cw = Math.round(b.h * .72); });
    return all;
  };

  // shown wherever stories would be, until the first real ones are added in data.js
  function comingSoon(full) {
    const desks = [['fashion & culture', 'var(--magenta)', 'Art, music, identity and the way we live.'],
                   ['fashion & politics', 'var(--cherry)', 'How clothing carries power, protest and the issues of our time.'],
                   ['fashion & environment', 'var(--forest)', 'Where our clothes come from, and how fashion can do better.']];
    return `<div class="soon reveal${full ? ' soon-full' : ''}">
      <p class="soon-lead">Our first stories are <em>in the works.</em></p>
      <div class="soon-desks">${desks.map(([n, c, d]) => `<div class="soon-desk" style="--dc:${c}"><span class="mono">${n}</span><p>${d}</p><span class="mono muted">coming soon</span></div>`).join('')}</div>
      <p class="mono soon-cta"><a href="join.html#submit">have an idea? pitch a story →</a> &nbsp; · &nbsp; <a href="${D.instagram}" target="_blank" rel="noopener">follow ${D.handle} for updates ↗</a></p>
    </div>`;
  }

  /* ---------------- page: home ---------------- */
  if (page === 'home') {
    $('#latest').innerHTML = !D.stories.length ? `<li>${comingSoon()}</li>` : D.stories.slice(0, 6).map((s, i) => `
      <li class="story-row reveal"><a href="${storyUrl(s)}" style="--row-c:${s.color === '#0B0B0B' ? 'var(--magenta)' : s.color}">
        <span class="n mono">${String(i + 1).padStart(2, '0')}</span>
        <span class="mono muted">${s.tag}</span>
        <span class="t">${s.title}</span>
        <span class="mono">by ${staffById[s.author].name.toLowerCase()}</span>
        <span class="mono muted">${s.date.toLowerCase()}</span>
        <img class="thumb" src="${s.img.replace('1400/1000', '300/400')}" alt="" loading="lazy">
      </a></li>`).join('');

    const f = D.stories[0];
    $('#feature').innerHTML = f ? `
      <a class="poster-block reveal" href="${storyUrl(f)}" style="--pc:${f.color}; --img:url('${f.img}')" data-view="read →">
        <h2 class="photo-type">${(f.poster || [f.title]).map(l => `<span>${l}</span>`).join('')}</h2>
        <div class="poster-meta mono"><span>${f.tag} — issue ${f.issue}</span><span>${f.title.toLowerCase()} →</span></div>
      </a>` : `
      <a class="poster-block reveal" href="join.html#submit" style="--pc:var(--magenta); --img:url('${(D.gallery[2] || {}).src || ''}')" data-view="pitch →">
        <h2 class="photo-type"><span>STORIES</span><span>COMING</span><span>SOON</span></h2>
        <div class="poster-meta mono"><span>issue 01 — in the works</span><span>have an idea? pitch a story →</span></div>
      </a>`;

    const r = rng(9);
    const cut = D.gallery.slice(0, 11).map(g => {
      const w = 90 + Math.round(r() * 110), h = Math.round(w * g.h / g.w), y = Math.round((r() - .5) * 90);
      return `<a class="cutout" href="gallery.html" style="width:${w}px;height:${h}px;transform:translateY(${y}px)">
        <img src="${g.src}" alt="Photo from the ${g.shoot} shoot" loading="lazy"><span class="cap mono">${g.shoot} — ph. ${g.photographer.toLowerCase()}</span></a>`;
    }).join('');
    $('#marquee').innerHTML = cut + cut.replace(/<a /g, '<a aria-hidden="true" tabindex="-1" ');

    const posts = D.instagramPosts && D.instagramPosts.length
      ? D.instagramPosts.slice(0, 6)
      : D.gallery.slice(6, 12).map(g => ({ img: g.src, url: D.instagram }));
    $('#ig-grid').innerHTML = posts.map(p => `<a href="${p.url || D.instagram}" target="_blank" rel="noopener" data-view="open ↗"><img src="${p.img}" alt="Instagram post from ${D.handle}" loading="lazy"></a>`).join('');
  }

  /* ---------------- page: stories index ---------------- */
  if (page === 'stories' && !D.stories.length) {
    $('#filters').remove();
    $('#story-grid').outerHTML = comingSoon(true);
  } else if (page === 'stories') {
    const tags = ['all', ...new Set(D.stories.map(s => s.tag))];
    const fl = $('#filters');
    fl.innerHTML = tags.map(t => `<button class="chip" aria-pressed="${t === 'all'}" data-tag="${t}">${t}</button>`).join('');
    $('#story-grid').innerHTML = D.stories.map(s => `
      <a class="story-card reveal" href="${storyUrl(s)}" data-tag="${s.tag}" style="--c:${s.color}" data-view="read →">
        <div class="img"><img src="${(s.img || '').replace('1400/1000', '700/875')}" alt="" loading="lazy"><span class="big-letter" aria-hidden="true">${s.title[0]}</span></div>
        <div class="meta mono"><span>${s.tag}</span><span class="muted">${s.date.toLowerCase()} · ${s.read} min</span></div>
        <h3>${s.title}</h3>
        <p>${s.dek}</p>
        <div class="mono" style="margin-top:8px">by ${staffById[s.author].name.toLowerCase()}</div>
      </a>`).join('');
    fl.addEventListener('click', e => {
      const b = e.target.closest('.chip'); if (!b) return;
      $$('.chip', fl).forEach(c => c.setAttribute('aria-pressed', c === b));
      $$('.story-card').forEach(c => c.classList.toggle('hide', b.dataset.tag !== 'all' && c.dataset.tag !== b.dataset.tag));
    });
  }

  /* ---------------- page: single story ---------------- */
  if (page === 'story' && !D.stories.some(s => s.id === new URLSearchParams(location.search).get('id'))) {
    document.title = 'Coming soon — Aera Magazine';
    $('#article').innerHTML = `<header class="page-head"><span class="kicker mono">stories</span><h1 class="page-title">Coming <em>soon</em></h1></header><div class="wrap">${comingSoon(true)}</div>`;
  } else if (page === 'story') {
    const id = new URLSearchParams(location.search).get('id');
    const idx = Math.max(0, D.stories.findIndex(s => s.id === id));
    const s = D.stories[idx], next = D.stories[(idx + 1) % D.stories.length];
    const au = staffById[s.author];
    document.title = `${s.title} — Aera Magazine`;
    document.documentElement.style.setProperty('--pc', s.color === '#0B0B0B' ? 'var(--magenta)' : s.color);
    const accent = ['#F4E21A', '#F2A7C3', '#E7D3DF'].includes(s.color) ? 'var(--magenta)' : s.color;

    let hero = '';
    if (s.layout === 'poster') {
      hero = `<div class="hero-poster" style="--pc:${s.color}; --img:url('${s.img}')">
        <div class="meta-row mono"><span>${s.tag}</span><span>issue ${s.issue} — ${issueOf(s.issue)?.title}</span></div>
        <h1 class="photo-type" aria-label="${s.title}">${s.poster.map(l => `<span aria-hidden="true">${l}</span>`).join('')}</h1>
        <div class="meta-row mono"><span>${s.title.toLowerCase()}</span><span>${s.read} min read</span></div>
      </div>`;
    } else if (s.layout === 'spread') {
      hero = `<div class="hero-spread" style="--pc:${s.color}">
        <div class="left"><img src="${s.img}" alt=""></div>
        <div class="right">
          <span class="giant-letter" aria-hidden="true">${s.title[0]}</span>
          <span class="mono" style="position:relative">${s.tag} — issue ${s.issue}</span>
          <div><h1>${s.title}</h1><p class="dek">${s.dek}</p></div>
        </div></div>`;
    } else {
      const tints = ['#E5231B', '#F4E21A', '#2433E8', '#700745', '#E7D3DF', '#1F6B3A', '#F0611E', '#9EE6F0', '#D5F45A'];
      const r = rng(idx + 5);
      const letters = s.title.replace(/[^a-z]/gi, '').slice(0, 9).split('').map(ch =>
        `<span style="left:${Math.round(r() * 90)}%;top:${Math.round(r() * 80)}%;font-size:${60 + Math.round(r() * 160)}px;transform:rotate(${Math.round((r() - .5) * 30)}deg)">${ch}</span>`).join('');
      hero = `<div class="hero-collage">
        <div class="scatter" aria-hidden="true">${letters}</div>
        <div class="pop-grid" style="--img:url('${s.img.replace('1400/1000', '900/900')}')">
          ${tints.map((t, i) => `<div style="background-color:${t};background-position:${(i % 3) * 50}% ${Math.floor(i / 3) * 50}%"></div>`).join('')}
          <span class="star" style="left:-24px;top:-24px"></span><span class="star" style="right:-20px;bottom:-26px;background:var(--magenta)"></span>
        </div>
        <h1>${s.title}</h1>
        <p class="dek">${s.dek}</p></div>`;
    }

    // each story can have its own `body` (list of paragraphs), `photo2` and `credits`;
    // anything missing falls back to placeholder text
    const body = s.body && s.body.length ? s.body : D.body;
    const split = Math.ceil(body.length * .6);
    const paras = list => list.map(p => `<p>${p}</p>`).join('');
    const cr = Object.assign({ photography: '', styling: '', models: '', mua: '' }, s.credits);
    $('#article').innerHTML = `
      ${hero}
      <div class="article-meta mono">
        <span>words by <a href="staff.html#${au.id}">${au.name.toLowerCase()}</a></span>
        ${cr.photography ? `<span>photos by ${cr.photography.toLowerCase()}</span>` : ''}
        <span>${s.date.toLowerCase()}</span>
        <span>${s.read} min read</span>
      </div>
      <div class="article-body reveal"><div class="cols">${paras(body.slice(0, split))}</div></div>
      <div class="pull reveal"><blockquote>“${s.quote}”</blockquote></div>
      <figure class="full-bleed reveal" style="margin-inline:0">
        <img src="${s.photo2 || s.img.replace('1400/1000', '1600/1000').replace('aera-s', 'aera-x')}" alt="${s.photo2Alt || ''}" loading="lazy">
        <span class="side-text mono">aera — issue ${s.issue}</span>
      </figure>
      <div class="credits mono muted">${['photography', 'styling', 'models', 'mua'].filter(k => cr[k]).map(k => `<span>${k}: ${cr[k].toLowerCase()}</span>`).join('')}</div>
      ${body.length > split ? `<div class="article-body reveal"><div class="cols">${paras(body.slice(split))}</div></div>` : ''}
      <a class="next-story" href="${storyUrl(next)}" data-view="next →">
        <span class="mono muted">next story</span>
        <span class="t" style="--pc:${accent}">${next.title} →</span>
      </a>`;
  }

  /* ---------------- page: staff ---------------- */
  if (page === 'staff') {
    const groups = [...new Set(D.staff.map(s => s.group))];
    const r = rng(3), tapes = ['#E7D3DF', '#E9EBC8', '#9EE6F0', '#D5F45A', '#F4E21A'];
    $('#masthead').innerHTML = groups.map(g => `
      <section class="masthead-group">
        <div class="section-label"><h2>${g}</h2><span class="mono muted">${D.staff.filter(s => s.group === g).length}</span></div>
        <div class="board">
          ${D.staff.filter(s => s.group === g).map(s => `
            <article class="polaroid reveal" id="${s.id}" style="--r:${((r() - .5) * 7).toFixed(1)}deg; --tape:${tapes[Math.floor(r() * tapes.length)]}" data-view="hi!">
              <div class="ph"><img src="${s.img}" alt="Portrait of ${s.name}" loading="lazy"><img class="alt" src="${s.alt}" alt="" loading="lazy"></div>
              <h3>${s.name}</h3>
              <div class="role mono">${s.role} · ${s.year.toLowerCase()}</div>
              <p>${s.bio}</p>
              <div class="fave">${s.fave}</div>
              ${s.ig ? `<a class="ig mono" href="${D.instagram}" target="_blank" rel="noopener">${s.ig}</a>` : ''}
            </article>`).join('')}
        </div>
      </section>`).join('');
  }

  /* ---------------- page: archive ---------------- */
  if (page === 'archive') {
    $('#issues').innerHTML = D.issues.map(is => `
      <a class="issue-card reveal" id="${is.id}" href="#${is.id}" style="--c:${is.color};--t:${is.ink || "#0B0B0B"}" data-view="${is.img ? 'read →' : 'soon'}">
        <div class="cv">${is.img ? `<img src="${is.img}" alt="Cover of issue ${is.no}" loading="lazy">` : `<span class="cv-soon mono">issue ${is.no}<br>coming soon</span>`}<span class="mast">AERA</span></div>
        <div class="mono muted" style="margin-top:12px">issue ${is.no} · ${is.season}${is.current ? ' · <span style="color:var(--magenta)">current</span>' : ''}</div>
        <h3>${is.title}</h3><p>${is.blurb}</p>
      </a>`).join('');
  }

  /* ---------------- page: join ---------------- */
  if (page === 'join') {
    $('#events').innerHTML = D.events.map(e => `
      <div class="event reveal"><span class="d">${e.date}</span>
        <div><h3>${e.title}</h3><p>${e.where} — ${e.note}</p></div>
        <a class="btn ghost" href="#">rsvp</a></div>`).join('');
    $$('form.form').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); f.querySelector('button').textContent = 'received — thank you! (preview)'; }));
  }

  /* ---------------- fabric / mosaic textures (about page) ----------------
     Rendered pixel-by-pixel with layered noise so they read like real
     materials. To use a real photo instead, add data-src="assets/img/..."
     to the <canvas> in about.html.                                        */
  function makeNoise(seed) {
    const r = rng(seed), perm = [...Array(256).keys()];
    for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
    const P = new Uint8Array(512).map((_, i) => perm[i & 255]), G = Float32Array.from({ length: 256 }, r);
    const h = (x, y) => G[P[(x & 255) + P[y & 255]]];
    const n2 = (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
      const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
      const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };
    const fbm = (x, y, o = 4) => { let s = 0, a = .5, f = 1, t = 0; for (let i = 0; i < o; i++) { s += a * n2(x * f, y * f); t += a; f *= 2.03; a *= .5; } return s / t; };
    return { n2, fbm, h };
  }
  const clamp = (v, a = 0, b = 1) => v < a ? a : v > b ? b : v;
  const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const ramp = (stops, t) => { t = clamp(t); for (let i = 1; i < stops.length; i++) if (t <= stops[i][0]) { const [t0, c0] = stops[i - 1], [t1, c1] = stops[i]; return mix(c0, c1, (t - t0) / (t1 - t0)); } return stops[stops.length - 1][1]; };

  const TEXTURES = {
    // crushed-velvet tiger: red body, powder-blue flanks, olive stripes with an orange bleed
    tiger(W, H, N) {
      const RED = [222, 22, 40], BLUE = [146, 186, 203], ORANGE = [240, 112, 58], OLIVE = [132, 124, 96];
      return (x, y) => {
        const cx = W / 2 + (N.fbm(y * .008, 3.3) - .5) * W * .08;
        const adx = Math.abs(x - cx) / (W / 2);
        // red body with ragged edges
        const half = .74 + (N.fbm(y * .018, 7.1) - .5) * .36;
        const edgeN = (N.fbm(x * .06, y * .06) - .5) * .16;
        const body = 1 - sstep(half - .05, half + .05, adx + edgeN);
        // chevron stripes, domain-warped so they wobble, taper and break
        const period = 21;
        let s = (y + adx * W * .3) / period + (N.fbm(x * .011, y * .011) - .5) * 2.4;
        const t = s - Math.floor(s), dist = Math.abs(t - .5);
        const w = (.05 + .17 * N.fbm(x * .02 + 5, y * .02)) * (1 - adx * .55) * (.55 + .45 * sstep(.05, .35, adx + .1));
        const breakup = sstep(.32, .5, N.fbm(x * .018 + 11, y * .05));
        const fuzz = (N.n2(x * .5, y * .5) - .5) * .05;
        const stripe = (1 - sstep(w - .02, w + .03, dist + fuzz)) * breakup;
        const halo = (1 - sstep(w, w + .08, dist + fuzz)) * breakup;
        const border = sstep(.15, .5, body) * (1 - sstep(.5, .9, body));
        let c = mix(BLUE, RED, body);
        c = mix(c, ORANGE, clamp(border * 1.3 + halo * body * .55));
        c = mix(c, mix(OLIVE, [118, 128, 112], 1 - body), stripe);
        // velvet: broad crushed sheen + fine vertical pile
        const sheen = .78 + .42 * N.fbm(x * .006 + 40, y * .009);
        const crush = (N.fbm(x * .035 + 9, y * .05) - .5) * .22;
        const pile = (N.n2(x * 1.4, y * .3) - .5) * .16 + (N.h(x | 0, y | 0) - .5) * .07;
        const k = sheen + crush + pile;
        return [c[0] * k, c[1] * k, c[2] * k];
      };
    },
    // woven jacquard: rounded threads over a blurry photographic colour field
    woven(W, H, N) {
      const field = [[0, [52, 14, 44]], [.2, [128, 28, 96]], [.38, [184, 52, 136]], [.52, [214, 104, 170]], [.62, [236, 168, 204]], [.72, [214, 150, 120]], [.82, [208, 150, 70]], [.91, [176, 44, 58]], [1, [84, 18, 40]]];
      const cs = 4.2;
      return (x, y) => {
        const ix = Math.floor(x / cs), iy = Math.floor(y / cs), u = x / cs - ix, v = y / cs - iy;
        const weftOnTop = (ix + iy) % 2 === 0;
        // the "photo" seen through the weave — warped low-frequency colour
        const wx = x + (N.fbm(x * .004, y * .004) - .5) * 160, wy = y + (N.fbm(x * .004 + 7, y * .004) - .5) * 160;
        const g = N.fbm(wx * .0045, wy * .0045, 5);
        let c = ramp(field, (g - .3) * 1.55);
        // weft and warp carry slightly different yarn colours
        const yarn = weftOnTop ? N.h(iy, 17) : N.h(ix, 91);
        c = mix(c, weftOnTop ? [236, 170, 210] : [110, 24, 78], (yarn - .5) * .4 + .1);
        c = c.map(ch => ch * (.9 + (N.n2(x * .08, iy * 1.7) - .5) * .25));
        // jacquard diamonds in a few patches
        const patch = sstep(.58, .64, N.fbm(x * .009 + 30, y * .009));
        const di = Math.abs((ix % 14) - 7) + Math.abs((iy % 14) - 7);
        if (patch > 0 && (di === 6 || di === 3)) c = mix(c, [34, 12, 28], patch * .9);
        // rounded yarn profile + shadow where threads dive under
        const across = weftOnTop ? v : u, along = weftOnTop ? u : v;
        const prof = Math.pow(Math.sin(across * Math.PI), .55);
        const dive = .78 + .22 * Math.sin(along * Math.PI);
        const lit = (.42 + .7 * prof) * dive + (weftOnTop ? .04 : -.04);
        const spec = Math.pow(prof, 9) * .25;
        return [c[0] * lit + 255 * spec, c[1] * lit + 255 * spec, c[2] * lit + 255 * spec];
      };
    },
    // glass mosaic: slightly irregular tiles, bevels, reflections, iridescence
    mosaic(W, H, N) {
      const field = [[0, [104, 108, 34]], [.25, [158, 156, 52]], [.42, [206, 160, 60]], [.55, [214, 132, 42]], [.68, [226, 104, 66]], [.82, [232, 138, 150]], [1, [244, 186, 196]]];
      const ts = 12;
      return (x, y) => {
        const i = Math.floor(x / ts), j = Math.floor(y / ts);
        const jx = (N.h(i, j) - .5) * 1.6, jy = (N.h(j + 50, i) - .5) * 1.6;
        const u = (x - i * ts - jx) / ts, v = (y - j * ts - jy) / ts;
        const gap = .045 + N.h(i + 7, j + 3) * .035 + (N.n2(x * .5, y * .5) - .5) * .03;
        const e = Math.min(u, v, 1 - u, 1 - v);
        if (e < gap) { const gr = 52 + (N.n2(x * .3, y * .3) - .5) * 30; return [gr, gr * .88, gr * .6]; }   // grout
        const zone = N.fbm(i * .07 + 3, j * .07, 3) + (N.h(i, j + 9) - .5) * .18;
        let c = ramp(field, (zone - .28) * 2.1);
        c = c.map(ch => ch * (.86 + N.h(i + 31, j) * .3));
        // iridescent sheen on some tiles
        const iri = N.h(i + 3, j + 77) > .6 ? .5 + .5 * Math.sin((u * 1.1 - v * .8) * 3.2 + N.h(i, j) * 6) : 0;
        c = [c[0] + iri * 14, c[1] - iri * 3, c[2] + iri * 22];
        // glass body: light from top-left, darker bevel, bubbles, highlight
        const bevel = .86 + .14 * sstep(gap, gap + .1, e);
        const light = 1.06 - .14 * (u * .6 + v * .4);
        const glass = .9 + .22 * N.fbm(x * .12 + i * 3.1, y * .12 + j * 1.7, 3);   // translucent swirl inside each tile
        const bubbles = 1 + (N.n2(x * .9 + i * 13, y * .9) - .5) * .12;
        const k = bevel * light * bubbles * glass;
        const spec = Math.exp(-((u - .25 - N.h(i, j + 4) * .2) ** 2 + (v - .22) ** 2) * 40) * N.h(i + 9, j + 9) ** 2 * .45;
        return [c[0] * k + 255 * spec, c[1] * k + 245 * spec, c[2] * k + 235 * spec];
      };
    }
  };
  function drawTextures() {
    $$('canvas[data-texture]').forEach((cv, idx) => {
      const W = cv.clientWidth, H = cv.clientHeight, dpr = Math.min(2, devicePixelRatio || 1);
      if (!W || !H) return;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      const ctx = cv.getContext('2d');
      if (cv.dataset.src) {        // real photo override
        const im = new Image();
        im.onload = () => { const s = Math.max(cv.width / im.width, cv.height / im.height); ctx.drawImage(im, (cv.width - im.width * s) / 2, (cv.height - im.height * s) / 2, im.width * s, im.height * s); };
        im.src = cv.dataset.src; return;
      }
      const shade = TEXTURES[cv.dataset.texture]?.(W, H, makeNoise(200 + idx));
      if (!shade) return;
      const img = ctx.createImageData(cv.width, cv.height), d = img.data;
      for (let py = 0, k = 0; py < cv.height; py++) for (let px = 0; px < cv.width; px++, k += 4) {
        const c = shade(px / dpr, py / dpr);
        d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    });
  }
  if ($('canvas[data-texture]')) {
    requestAnimationFrame(drawTextures);
    let rt, lastW = innerWidth;
    addEventListener('resize', () => { if (innerWidth === lastW) return; lastW = innerWidth; clearTimeout(rt); rt = setTimeout(drawTextures, 250); });
  }

  initReveal();
})();
