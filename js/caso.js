/* =========================================================================
   ACC 6 BOLD — Ficha de caso (también lo usa nosotros.html, sin data-case)
   Datos: js/proyectos-data.js (window.ACC_PROJECTS) para «Siguiente proyecto»
   y «Más proyectos». El caso actual se indica en <body data-case="…">.
   Dependencia opcional: Lenis. Sin js la página se lee entera.
   ========================================================================= */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fineHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const $ = s => document.querySelector(s);

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
      if (s.hidden) continue;
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
     CABECERA — la marca (tamaño en CSS) alineada a la tinta y con sus letras
     subiendo desde abajo al cargar
     ----------------------------------------------------------------------- */
  const fitEl = $('[data-fit]');
  if (fitEl) {
    const text = fitEl.textContent.trim();
    fitEl.setAttribute('aria-label', text);
    fitEl.innerHTML = `<span class="ch-line" aria-hidden="true">${[...text].map((c, i) =>
      `<span class="ch" style="--i:${i}">${c === ' ' ? '&nbsp;' : esc(c)}</span>`).join('')}</span>`;

    // El aire lateral de la primera letra (~4,5% del cuerpo) se compensa con un
    // margen negativo: la tinta queda alineada al margen de la página, como el resto
    const ctx = document.createElement('canvas').getContext('2d');
    const fit = () => {
      fitEl.style.marginLeft = '0px';
      const cs = getComputedStyle(fitEl);
      ctx.font = `${cs.fontWeight} 100px ${cs.fontFamily}`;
      const bearing = Math.max(0, -ctx.measureText(text.toLocaleUpperCase('es')).actualBoundingBoxLeft || 0);
      fitEl.style.marginLeft = (-bearing * parseFloat(cs.fontSize) / 100).toFixed(2) + 'px';
    };
    fit();
    addEventListener('resize', fit);
    if (document.fonts) document.fonts.ready.then(fit);

    if (!reduced) {
      fitEl.classList.add('is-pre');
      requestAnimationFrame(() => requestAnimationFrame(() => fitEl.classList.remove('is-pre')));
    }
  }

  /* -----------------------------------------------------------------------
     DATOS — siguiente proyecto y más proyectos
     ----------------------------------------------------------------------- */
  const DATA = window.ACC_PROJECTS;
  const currentId = document.body.dataset.case;
  if (DATA && currentId) {
    const CASES = DATA.cases;
    const cur = CASES.find(c => c.id === currentId);
    const mediaHTML = (c, attrs = '') => c.video
      ? `<video src="${c.video}" poster="${c.image}" muted loop playsinline preload="none" ${attrs}></video>`
      : `<img src="${c.image}" alt="" loading="lazy" decoding="async" />`;

    // Siguiente: el próximo caso con ficha publicada, en el orden del catálogo
    const next = $('[data-next]');
    const idx = CASES.indexOf(cur);
    const withUrl = c => c.access === 'public' && c.url && c.id !== currentId;
    const nextCase = CASES.slice(idx + 1).find(withUrl) || CASES.slice(0, Math.max(0, idx)).find(withUrl);
    if (next && nextCase) {
      next.href = nextCase.url;
      next.querySelector('[data-next-client]').textContent = nextCase.client;
      next.querySelector('[data-next-project]').textContent = nextCase.project;
      next.querySelector('[data-next-media]').innerHTML = mediaHTML(nextCase, 'data-lazy-video');
      next.setAttribute('aria-label', `Siguiente proyecto: ${nextCase.client} — ${nextCase.project}`);
      next.hidden = false;
    }

    // Más proyectos: mismo sector y servicio primero; casos con ficha antes; sin repetir cliente
    const related = $('[data-related]');
    if (related && cur) {
      const score = c => (c.sector === cur.sector ? 2 : 0)
        + (c.categories.some(k => cur.categories.includes(k)) ? 1 : 0)
        + (c.url ? 0.5 : 0);
      const pool = CASES
        .filter(c => c.id !== currentId && c.access === 'public' && c.id !== nextCase?.id)
        .map((c, i) => ({ c, s: score(c), i }))
        .sort((a, b) => b.s - a.s || a.i - b.i);
      const picked = [], clients = new Set([cur.client]);
      for (const { c } of pool) {
        if (clients.has(c.client)) continue;
        picked.push(c); clients.add(c.client);
        if (picked.length === 4) break;
      }
      // 4 tarjetas iguales: 3 columnas cada una, imagen en 4:3
      related.innerHTML = picked.map(c => {
        const href = c.url || `./proyectos.html?vista=index#sector-${c.sector}`;
        const label = `${c.client} — ${c.project}`;
        const media = c.video
          ? `<video src="${c.video}" poster="${c.image}" muted loop playsinline preload="none" data-lazy-video aria-label="${esc(label)}"></video>`
          : `<img src="${c.image}" alt="${esc(label)}" loading="lazy" decoding="async" />`;
        return `<a class="card" href="${href}" data-reveal style="--span:3;--ratio:4 / 3">
          <div class="card__media">${media}</div>
          <div class="card__meta">
            <h3 class="card__title">${esc(c.client.toLocaleUpperCase('es'))}</h3>
            <p class="card__project">${esc(c.project)}</p>
          </div>
        </a>`;
      }).join('');
    }
  }

  /* -----------------------------------------------------------------------
     REVEAL + vídeos perezosos
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

  /* -----------------------------------------------------------------------
     TINTE — mientras la cita cruza el centro de la pantalla, la página entera
     toma el color claro del sector (como el hover del manifiesto en la home).
     data-tint-until="<selector>": el tramo se alarga hasta que el inicio de ese
     bloque llega al centro (Nosotros: de «Cambiar es…» a Grupo ACC)
     ----------------------------------------------------------------------- */
  const tintEls = [...document.querySelectorAll('[data-tint]')].map(el => ({
    el, until: el.dataset.tintUntil ? document.querySelector(el.dataset.tintUntil) : null
  }));
  const caseColor = getComputedStyle(document.body).getPropertyValue('--case-c').trim();
  let tintOn = null;
  const updateTint = () => {
    const mid = innerHeight * 0.5;
    const on = tintEls.some(({ el, until }) => {
      const top = el.getBoundingClientRect().top;
      const bottom = until ? until.getBoundingClientRect().top : el.getBoundingClientRect().bottom;
      return top < mid && bottom > mid;
    });
    if (on === tintOn) return;
    tintOn = on;
    if (on && caseColor) root.style.setProperty('--page-tint', caseColor);
    else root.style.removeProperty('--page-tint');
  };

  /* -----------------------------------------------------------------------
     IMAGEN PRINCIPAL — se asienta (scale 1.12 → 1) al entrar en pantalla
     PARALLAX — cada columna a su velocidad (data-par = amplitud en px)
     ----------------------------------------------------------------------- */
  const settle = [...document.querySelectorAll('[data-settle]')];
  const par = [...document.querySelectorAll('[data-par]')];
  const updateMotion = () => {
    if (reduced) return;
    const vh = innerHeight;
    settle.forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      const p = clamp((vh - r.top) / (vh * 0.9), 0, 1);
      img.style.scale = (1 + 0.12 * (1 - p)).toFixed(4);
    });
    const on = innerWidth >= 810;
    par.forEach(el => {
      const a = +el.dataset.par || 0;
      if (!on || !a) { el.style.removeProperty('--py'); return; }
      const r = el.getBoundingClientRect();
      const c = clamp((r.top + r.height / 2 - vh / 2) / vh, -1, 1);
      el.style.setProperty('--py', (c * a).toFixed(1) + 'px');
    });
  };

  /* -----------------------------------------------------------------------
     GALERÍA — carrusel infinito: avanza solo, se arrastra con inercia,
     flechas del teclado, y cursor coral «Arrastra» que sigue al puntero
     ----------------------------------------------------------------------- */
  const reel = $('[data-reel]');
  let reelStep = () => {};
  if (reel) {
    const track = reel.querySelector('[data-reel-track]');
    const cursor = reel.querySelector('[data-reel-cursor]');
    const originals = [...track.children];
    let unit = 0;
    const measure = () => {
      // Repite el grupo original hasta cubrir el ancho + un grupo (bucle sin costura)
      [...track.children].slice(originals.length).forEach(n => n.remove());
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      unit = originals.reduce((s, el) => s + el.getBoundingClientRect().width + gap, 0);
      if (!unit) return;
      let guard = 0;
      while (track.scrollWidth < innerWidth * 2 + unit && guard++ < 10) {
        originals.forEach(el => {
          const c = el.cloneNode(true);
          c.setAttribute('aria-hidden', 'true');
          c.querySelector('img').alt = '';
          track.appendChild(c);
        });
      }
    };
    measure();
    addEventListener('load', measure);
    addEventListener('resize', measure);
    track.querySelectorAll('img').forEach(img => img.complete || img.addEventListener('load', measure, { once: true }));

    const AUTO = reduced ? 0 : 36;  // px/s
    // data-reel-scroll (Nosotros): el scroll de la página empuja la galería; al subir, invierte el sentido
    const scrollLinked = reel.hasAttribute('data-reel-scroll') && !reduced;
    let lastSY = scrollY;
    let x = 0, vel = 0, dragging = false, lastX = 0, lastT = 0, hover = false;
    let cx = 0, cy = 0, tx = 0, ty = 0;

    reel.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      dragging = true; lastX = e.clientX; lastT = performance.now(); vel = 0;
      reel.setPointerCapture(e.pointerId);
      reel.classList.add('is-dragging');
    });
    reel.addEventListener('pointermove', e => {
      const r = reel.getBoundingClientRect();
      tx = e.clientX - r.left; ty = e.clientY - r.top;
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      x -= dx;
      vel = -dx / Math.max(1, now - lastT) * 1000;
      lastX = e.clientX; lastT = now;
    });
    const release = () => { dragging = false; reel.classList.remove('is-dragging'); };
    reel.addEventListener('pointerup', release);
    reel.addEventListener('pointercancel', release);
    if (fineHover) {
      reel.addEventListener('pointerenter', e => {
        const r = reel.getBoundingClientRect();
        cx = tx = e.clientX - r.left; cy = ty = e.clientY - r.top;
        hover = true; reel.classList.add('is-hover');
      });
      reel.addEventListener('pointerleave', () => { hover = false; reel.classList.remove('is-hover'); });
    }
    reel.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { vel = 1600; e.preventDefault(); }
      if (e.key === 'ArrowLeft') { vel = -1600; e.preventDefault(); }
    });

    reelStep = dt => {
      if (scrollLinked) {
        const sy = scrollY;
        if (!dragging) x += (sy - lastSY) * 0.6;
        lastSY = sy;
      }
      if (!dragging) {
        x += (AUTO + vel) * dt;
        vel *= Math.pow(0.04, dt); // inercia: cae a ~4% en 1 s
        if (Math.abs(vel) < 1) vel = 0;
      }
      if (unit) track.style.transform = `translate3d(${(-(((x % unit) + unit) % unit)).toFixed(2)}px,0,0)`;
      if (hover) {
        cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
        cursor.style.translate = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
      }
    };
  }

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
        m.x = ((m.x + m.speed * dt) % u + u) % u; // speed negativo: la fila va hacia la derecha
        m.track.style.transform = `translate3d(${-m.x}px,0,0)`;
      }
    }
    reelStep(dt);
    updateMotion();
    updateTint();
    updateNavTheme();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();
