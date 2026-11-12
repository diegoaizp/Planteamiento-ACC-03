/* =========================================================================
   ACC 6 BOLD — Página de Proyectos
   Datos: js/proyectos-data.js (window.ACC_PROJECTS). Dependencia opcional: Lenis.
   Estado en la URL: ?categoria=branding&vista=index#sector-cultura
   ========================================================================= */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const $ = s => document.querySelector(s);

  const { categories: CATS, sectors: SECTORS, cases: CASES } = window.ACC_PROJECTS;
  const byId = new Map(CASES.map(c => [c.id, c]));
  const sectorOf = new Map(SECTORS.map(s => [s.id, s]));

  /* -----------------------------------------------------------------------
     LENIS — mismo scroll que la home
     ----------------------------------------------------------------------- */
  const lenis = (!reduced && window.Lenis) ? new window.Lenis({ lerp: 0.09, anchors: true }) : null;
  window.accLenis = lenis;   // js/menu.js lo para mientras el menú está abierto

  /* -----------------------------------------------------------------------
     NAV — color del logo y contorno de los botones según la sección de debajo
     ----------------------------------------------------------------------- */
  const nav = $('[data-nav]');
  const themed = [...document.querySelectorAll('[data-theme]:not([data-nav])')];
  const updateNavTheme = () => {
    const y = parseFloat(getComputedStyle(nav).paddingTop) + 23;
    for (const s of themed) {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { nav.dataset.theme = s.dataset.theme; break; }
    }
  };

  /* -----------------------------------------------------------------------
     MARQUEE — franja newsletter
     ----------------------------------------------------------------------- */
  const marquees = [];
  document.querySelectorAll('[data-marquee]').forEach(track => {
    const group = track.firstElementChild;
    const fill = () => {
      if (!group.offsetWidth) return;
      let guard = 0;
      while (track.scrollWidth < innerWidth * 2 + group.offsetWidth && guard++ < 12) track.appendChild(group.cloneNode(true));
    };
    fill();
    addEventListener('load', fill);
    marquees.push({ track, speed: +track.dataset.speed || 50, x: 0, unit: () => group.offsetWidth });
  });

  /* -----------------------------------------------------------------------
     CASOS PROTEGIDOS — diálogo de contraseña
     ----------------------------------------------------------------------- */
  const dialog = $('[data-lock-dialog]');
  const lockTitle = $('[data-lock-title]');
  const lockInput = $('[data-lock-input]');
  const lockFeedback = $('[data-lock-feedback]');
  const openLock = item => {
    lockTitle.textContent = `${item.client} — ${item.project}`;
    lockInput.value = '';
    lockFeedback.hidden = true;
    dialog.showModal();
    if (lenis) lenis.stop();
  };
  dialog.addEventListener('close', () => { if (lenis) lenis.start(); });
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); }); // clic en el fondo
  $('[data-lock-close]').addEventListener('click', () => dialog.close());
  $('[data-lock-form]').addEventListener('submit', e => {
    e.preventDefault();
    lockFeedback.textContent = lockInput.value.trim()
      ? 'Contraseña incorrecta. Puedes pedirla en acc@acc.com.es.'
      : 'Introduce la contraseña.';
    lockFeedback.hidden = false;
    lockInput.focus();
    lockInput.select();
  });

  const LOCK_SVG = '<svg viewBox="0 0 14 16" fill="none" aria-hidden="true"><rect x="2" y="7" width="10" height="7.5" rx="1.5" stroke="currentColor" stroke-width="1.5"/><path d="M4.25 7V4.75a2.75 2.75 0 0 1 5.5 0V7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  /* -----------------------------------------------------------------------
     BARRA — una entrada por categoría (solo las que tienen proyectos)
     ----------------------------------------------------------------------- */
  const catList = $('[data-cats]');
  Object.entries(CATS).forEach(([key, label]) => {
    if (!CASES.some(c => c.categories.includes(key))) return;
    const li = document.createElement('li');
    li.innerHTML = `<button type="button" class="projects-bar__btn" data-category="${key}" aria-pressed="false">${esc(label)}</button>`;
    catList.appendChild(li);
  });

  /* -----------------------------------------------------------------------
     CUADRÍCULA — tarjetas de la home (.card). Las filas repiten el vocabulario
     de la home: 3 tarjetas que suman 12 columnas, cada una con su proporción.
     Las dos primeras filas son exactamente las de la home.
     ----------------------------------------------------------------------- */
  const ROWS = [
    [[5, '639 / 556'], [4, '4 / 5'], [3, '3 / 4']],
    [[3, '1 / 1'], [5, '694 / 493'], [4, '503 / 437']],
    [[4, '4 / 5'], [3, '1 / 1'], [5, '639 / 556']],
    [[5, '694 / 493'], [3, '3 / 4'], [4, '503 / 437']],
    [[3, '3 / 4'], [4, '503 / 437'], [5, '639 / 556']],
    [[4, '503 / 437'], [5, '694 / 493'], [3, '1 / 1']],
  ];
  // Amplitud del parallax por columna (px): cada tarjeta de la fila va a una velocidad.
  // Recorrido máximo 2× amplitud (80 px) < 120 px entre filas: nunca se pisan
  const PAR = [[0, 36, 18], [24, 0, 40], [36, 18, 0], [12, 40, 6]];

  const grid = $('[data-grid]');
  const cardEls = new Map();
  CASES.filter(c => c.access !== 'none').forEach((c, i) => {
    const locked = c.access === 'locked';
    const isLink = locked || !!c.url;
    const el = document.createElement(isLink ? 'a' : 'div');
    el.className = 'card' + (isLink ? '' : ' card--static');
    if (isLink) el.href = locked ? '#' : c.url;
    el.dataset.reveal = '';
    const label = `${c.client} — ${c.project}`;
    const media = c.video
      ? `<video src="${c.video}" poster="${c.image}" muted loop playsinline preload="none" data-lazy-video aria-label="${esc(label)}"></video>`
      : `<img src="${c.image}" alt="${esc(label)}" loading="${i < 6 ? 'eager' : 'lazy'}" decoding="async" />`;
    el.innerHTML = `
      <div class="card__media">${media}</div>
      <div class="card__meta">
        <h3 class="card__title">${esc(c.client.toLocaleUpperCase('es'))}</h3>
        <p class="card__project">${esc(c.project)}${locked ? `<span class="card__lock" title="Caso protegido">${LOCK_SVG}</span>` : ''}</p>
      </div>`;
    if (locked) el.addEventListener('click', e => { e.preventDefault(); openLock(c); });
    grid.appendChild(el);
    cardEls.set(c.id, el);
  });

  const layoutGrid = ids => {
    ids.forEach((id, i) => {
      const el = cardEls.get(id);
      const row = Math.floor(i / 3), col = i % 3;
      const [span, ratio] = ROWS[row % ROWS.length][col];
      el.style.setProperty('--span', span);
      el.style.setProperty('--ratio', ratio);
      el.dataset.par = PAR[row % PAR.length][col];
    });
  };

  /* -----------------------------------------------------------------------
     LISTADO — agrupado por sectores (orden y paleta de la home), alfabético
     dentro de cada sector. Hover (como el manifiesto y Sectores en la home):
     la página se tiñe con el color claro del sector, el resto de filas se
     apaga y aparece la imagen del proyecto, que sigue al cursor en vertical.
     ----------------------------------------------------------------------- */
  const canHover = matchMedia('(hover: hover)').matches;
  const indexEl = $('[data-index]');
  const indexList = $('[data-index-list]');
  const preview = $('[data-preview]');
  const rowEls = new Map();
  const sectorEls = new Map();

  SECTORS.forEach(s => {
    const items = CASES.filter(c => c.sector === s.id).sort((a, b) =>
      a.client.localeCompare(b.client, 'es', { sensitivity: 'base' }) ||
      a.project.localeCompare(b.project, 'es', { sensitivity: 'base' }));
    if (!items.length) return;

    const sec = document.createElement('section');
    sec.className = 'idx-sector';
    sec.id = `sector-${s.id}`;
    sec.innerHTML = `<h2 class="idx-sector__title">${esc(s.label)}</h2><ul class="idx-sector__list"></ul>`;
    const ul = sec.querySelector('ul');

    items.forEach(c => {
      const li = document.createElement('li');
      li.className = 'idx-item';
      li.dataset.id = c.id;
      const locked = c.access === 'locked';
      const inner = `<span class="idx-row__client">${esc(c.client)}</span><span class="idx-row__project">${esc(c.project)}${locked ? `<span class="card__lock" title="Caso protegido">${LOCK_SVG}</span>` : ''}</span>`;
      let row;
      if (locked) {
        row = document.createElement('button');
        row.type = 'button';
        row.addEventListener('click', () => openLock(c));
      } else if (c.url && c.access !== 'none') {
        row = document.createElement('a');
        row.href = c.url;
      } else {
        // Sin ficha publicada: consta en el listado y enseña su imagen, sin enlace
        row = document.createElement('div');
        row.tabIndex = 0;
      }
      row.innerHTML = inner;
      row.className = 'idx-row' + (row.tagName === 'DIV' ? ' idx-row--static' : '');
      row.dataset.row = c.id;
      if (canHover) row.addEventListener('mouseenter', () => activateRow(c.id));
      row.addEventListener('focus', () => {
        activateRow(c.id);
        const r = row.getBoundingClientRect();
        pointerY = r.top + r.height / 2;
      });
      li.appendChild(row);
      ul.appendChild(li);
      rowEls.set(c.id, row);
    });

    indexList.appendChild(sec);
    sectorEls.set(s.id, sec);
  });

  // Capas de la imagen: se crean al activarse por primera vez (no se cargan 59 imágenes de golpe)
  const layers = new Map();
  let activeRow = null;
  let pointerY = innerHeight / 2, previewY = null;
  const activateRow = id => {
    if (id === activeRow) return;
    const prevLayer = layers.get(activeRow);
    if (prevLayer) { prevLayer.classList.remove('is-active'); prevLayer.querySelector('video')?.pause(); }
    rowEls.get(activeRow)?.classList.remove('is-active');
    sectorEls.forEach(sec => sec.classList.remove('is-active'));
    activeRow = id;

    if (!id) {
      indexEl.classList.remove('is-active');
      preview.classList.remove('is-on');
      root.style.removeProperty('--page-tint');
      return;
    }
    const c = byId.get(id);
    let layer = layers.get(id);
    if (!layer) {
      layer = document.createElement('div');
      layer.className = 'idx-preview__layer';
      layer.innerHTML = c.video
        ? `<video src="${c.video}" poster="${c.image}" muted loop playsinline preload="auto"></video>`
        : `<img src="${c.image}" alt="" decoding="async" />`;
      preview.appendChild(layer);
      layers.set(id, layer);
    }
    layer.classList.add('is-active');
    if (!reduced) layer.querySelector('video')?.play().catch(() => {});
    rowEls.get(id).classList.add('is-active');
    sectorEls.get(c.sector)?.classList.add('is-active');
    indexEl.classList.add('is-active');
    root.style.setProperty('--page-tint', `var(--c-${sectorOf.get(c.sector)?.color || 'stone'})`);
    if (canHover && innerWidth >= 810) preview.classList.add('is-on');
  };

  if (canHover) {
    indexList.addEventListener('mousemove', e => { pointerY = e.clientY; });
    indexList.addEventListener('mouseleave', () => activateRow(null));
  }
  indexList.addEventListener('focusout', e => { if (!indexList.contains(e.relatedTarget)) activateRow(null); });

  // La imagen sigue al cursor en vertical (suavizado), sin salirse de la pantalla ni pisar la nav
  const updatePreview = () => {
    if (!preview.classList.contains('is-on')) { previewY = null; return; }
    const h = preview.offsetHeight;
    const minY = nav.offsetHeight + 24, maxY = innerHeight - h - 24;
    const target = clamp(pointerY - h / 2, minY, Math.max(minY, maxY));
    previewY = previewY === null || reduced ? target : previewY + (target - previewY) * 0.14;
    preview.style.translate = `0 ${previewY.toFixed(1)}px`;
  };

  /* -----------------------------------------------------------------------
     ESTADO — categoría + vista, sincronizado con la URL
     ----------------------------------------------------------------------- */
  const section = $('[data-projects]');
  const stage = $('[data-projects-stage]');
  const empty = $('[data-empty]');
  const VALID_CATS = new Set(['todos', ...Object.keys(CATS)]);
  const readState = () => {
    const p = new URLSearchParams(location.search);
    const cat = p.get('categoria') || p.get('servicio') || 'todos';
    const view = p.get('vista');
    return { cat: VALID_CATS.has(cat) ? cat : 'todos', view: view === 'index' ? 'index' : 'grid' };
  };
  let state = readState();

  const apply = () => {
    const { cat, view } = state;
    const match = c => cat === 'todos' || c.categories.includes(cat);

    section.dataset.view = view;
    grid.hidden = view !== 'grid';
    indexEl.hidden = view !== 'index';

    // Cuadrícula
    const ids = [];
    cardEls.forEach((el, id) => {
      const on = match(byId.get(id));
      el.hidden = !on;
      if (on) ids.push(id);
    });
    layoutGrid(ids);

    // Listado
    activateRow(null);
    let inIndex = 0;
    sectorEls.forEach(sec => {
      let n = 0;
      sec.querySelectorAll('.idx-item').forEach(li => {
        const on = match(byId.get(li.dataset.id));
        li.hidden = !on;
        if (on) n++;
      });
      sec.hidden = !n;
      inIndex += n;
    });

    const count = view === 'grid' ? ids.length : inIndex;
    empty.hidden = count > 0;
    if (!count) { grid.hidden = true; indexEl.hidden = true; }

    document.querySelectorAll('[data-category]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.category === cat && b.closest('[data-cats]') !== null)));
    document.querySelectorAll('[data-view-btn]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.viewBtn === view)));

    const p = new URLSearchParams(location.search);
    p.delete('servicio');
    cat === 'todos' ? p.delete('categoria') : p.set('categoria', cat);
    view === 'grid' ? p.delete('vista') : p.set('vista', view);
    const q = p.toString();
    history.replaceState(null, '', `${location.pathname}${q ? `?${q}` : ''}${location.hash}`);

    if (lenis) requestAnimationFrame(() => lenis.resize());
  };

  // Fundido corto, se recompone y, si la barra ya no se ve, vuelve arriba
  let busy = false;
  const change = async next => {
    const s = { ...state, ...next };
    if (busy || (s.cat === state.cat && s.view === state.view)) return;
    busy = true;
    stage.classList.add('is-swapping');
    await wait(reduced ? 0 : 230);
    state = s;
    apply();
    if ($('[data-projects-bar]').getBoundingClientRect().top < 0) {
      lenis ? lenis.scrollTo(0, { immediate: true, force: true }) : scrollTo(0, 0);
    }
    requestAnimationFrame(() => { stage.classList.remove('is-swapping'); busy = false; });
  };

  document.addEventListener('click', e => {
    const catBtn = e.target.closest('[data-category]');
    if (catBtn) {
      const key = catBtn.dataset.category;
      // Pulsar la categoría activa la desactiva
      change({ cat: key === state.cat ? 'todos' : key });
      return;
    }
    const viewBtn = e.target.closest('[data-view-btn]');
    if (viewBtn) change({ view: viewBtn.dataset.viewBtn });
  });

  /* -----------------------------------------------------------------------
     REVEAL + vídeos perezosos + parallax de la cuadrícula
     ----------------------------------------------------------------------- */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); revealIO.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -10% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => revealIO.observe(el));

  const videoIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting && !reduced) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); }
      else v.pause();
    });
  }, { rootMargin: '200px 0px' });
  document.querySelectorAll('[data-lazy-video]').forEach(v => videoIO.observe(v));

  const inView = new Set();
  const parIO = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting ? inView.add(e.target) : inView.delete(e.target));
  }, { rootMargin: '25% 0px' });
  cardEls.forEach(el => parIO.observe(el));

  const updateParallax = () => {
    if (reduced || state.view !== 'grid' || innerWidth < 810) return;
    const vh = innerHeight;
    for (const el of inView) {
      const r = el.getBoundingClientRect();
      const py = el._py || 0;
      // Posición sin el desplazamiento aplicado (si no, se realimenta)
      // k: posición respecto al centro de pantalla (−1…1); k0: la misma al cargar la página,
      // así la primera fila arranca alineada y el resto parte de 0 al entrar
      const top = r.top - py;
      const k = clamp((top + r.height / 2 - vh / 2) / vh, -1, 1);
      const k0 = clamp((top + scrollY + r.height / 2 - vh / 2) / vh, -1, 1);
      const next = (k0 - k) * (+el.dataset.par || 0);
      if (Math.abs(next - py) > 0.05) { el._py = next; el.style.setProperty('--py', next.toFixed(2) + 'px'); }
    }
  };

  /* -----------------------------------------------------------------------
     LOOP
     ----------------------------------------------------------------------- */
  let last = performance.now();
  const tick = now => {
    if (lenis) lenis.raf(now);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reduced) {
      for (const m of marquees) {
        const u = m.unit();
        if (!u) continue;
        m.x = (m.x + m.speed * dt) % u;
        m.track.style.transform = `translate3d(${-m.x}px,0,0)`;
      }
    }
    updateParallax();
    updatePreview();
    updateNavTheme();
    // Banda bajo la nav: solo en Listado y mientras la nav está sobre la sección
    nav.classList.toggle('has-band', state.view === 'index' && section.getBoundingClientRect().bottom > nav.offsetHeight + 24);
    requestAnimationFrame(tick);
  };

  /* -----------------------------------------------------------------------
     INICIO — aplica el estado de la URL y, si llega un ancla de sector
     (enlaces de Sectores en la home), baja hasta él
     ----------------------------------------------------------------------- */
  apply();
  requestAnimationFrame(tick);

  const target = location.hash.startsWith('#sector-') && document.getElementById(location.hash.slice(1));
  if (target) {
    if (state.view !== 'index') { state.view = 'index'; apply(); }
    const go = () => lenis
      ? lenis.scrollTo(target, { offset: -140, immediate: true, force: true })
      : target.scrollIntoView();
    requestAnimationFrame(go);
    addEventListener('load', go, { once: true });
  }
})();
