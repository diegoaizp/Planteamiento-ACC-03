/* =========================================================================
   ACC 6 BOLD — Home interactions
   Dependencia única: Lenis (smooth scroll, CDN). Sin Lenis todo sigue funcionando.
   ========================================================================= */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const cssPx = name => parseFloat(getComputedStyle(root).getPropertyValue(name)) || 0;

  // cubic-bezier(x1,y1,x2,y2) → función de easing t∈[0,1]
  const bezier = (x1, y1, x2, y2) => {
    const A = (a, b) => 1 - 3 * b + 3 * a, B = (a, b) => 3 * b - 6 * a, C = a => 3 * a;
    const calc = (t, a, b) => ((A(a, b) * t + B(a, b)) * t + C(a)) * t;
    const slope = (t, a, b) => 3 * A(a, b) * t * t + 2 * B(a, b) * t + C(a);
    return x => {
      if (x <= 0 || x >= 1) return clamp(x, 0, 1);
      let t = x;
      for (let i = 0; i < 8; i++) { const s = slope(t, x1, x2); if (!s) break; t -= (calc(t, x1, x2) - x) / s; }
      return calc(t, y1, y2);
    };
  };

  /* -----------------------------------------------------------------------
     LENIS — scroll suavizado en toda la página
     ----------------------------------------------------------------------- */
  const lenis = (!reduced && window.Lenis)
    ? new window.Lenis({ lerp: 0.09, anchors: true })
    : null;
  window.accLenis = lenis;   // js/menu.js lo para mientras el menú está abierto

  /* -----------------------------------------------------------------------
     REFERENCIAS
     ----------------------------------------------------------------------- */
  const nav = document.querySelector('[data-nav]');
  const navLogo = nav.querySelector('.nav__logo');
  const navItems = [...document.querySelectorAll('[data-nav-item]')];
  const stage = document.querySelector('[data-stage]');
  const heroSection = document.querySelector('[data-hero]');
  const heroVideo = document.querySelector('[data-hero-video]');
  const claim = document.querySelector('[data-claim]');
  const statementText = document.querySelector('[data-statement-text]');

  /* -----------------------------------------------------------------------
     NAV — tema según la sección bajo la barra (solo cambia el color del logo
     y el contorno de los botones, que siempre son blancos)
     ----------------------------------------------------------------------- */
  const themed = [...document.querySelectorAll('[data-theme]:not([data-nav])')];
  const updateNavTheme = () => {
    const y = parseFloat(getComputedStyle(nav).paddingTop) + 23;
    for (const s of themed) {
      const r = s.getBoundingClientRect();
      if (r.top <= y && r.bottom > y) { nav.dataset.theme = s.dataset.theme; break; }
    }
  };

  /* -----------------------------------------------------------------------
     LOGO — en el hero: alineado a la izquierda y centrado
     en vertical con la frase; con el scroll se reduce hasta la nav.
     introX = desplazamiento lateral del loader.
     ----------------------------------------------------------------------- */
  let logoBase = null;
  let introX = 0;
  const measureLogo = () => {
    navLogo.style.transform = 'none';
    const r = navLogo.getBoundingClientRect();
    logoBase = { left: r.left, top: r.top, w: r.width, h: r.height };
  };
  const updateLogo = () => {
    if (!logoBase) return;
    const vw = innerWidth, vh = innerHeight;
    const bigW = vw < 768 ? clamp(vw * 0.5, 160, 260) : clamp(vw * 0.28, 300, 520);
    const s = bigW / logoBase.w;
    const bigH = logoBase.h * s;
    const pad = cssPx('--pad');
    // ≥1200: logo y frase en la misma fila, centrados en vertical. <1200: logo encima de la frase
    const targetTop = vw >= 1200 ? (vh - bigH) / 2 : vh / 2 - bigH - 16;
    const dx = pad - logoBase.left;
    const dy = targetTop - logoBase.top;
    const p = clamp(scrollY / (vh * 0.75), 0, 1);
    const e = 1 - p;
    navLogo.style.transform =
      `translate(${(dx * e + introX).toFixed(2)}px, ${(dy * e).toFixed(2)}px) scale(${(1 + (s - 1) * e).toFixed(4)})`;
  };
  measureLogo();
  updateLogo();
  addEventListener('resize', () => { measureLogo(); updateLogo(); });

  /* -----------------------------------------------------------------------
     MARQUEES — franjas de logos y newsletter
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
     CLAIM — carrusel vertical por palabras. Entra desde abajo (sin desenfoque);
     al cambiar, la frase sube y desaparece y la nueva sube desde abajo.
     ----------------------------------------------------------------------- */
  const CLAIMS = [
    ['Cambian', 'las tecnologías.'],
    ['Cambian', 'los canales.'],
    ['Cambian', 'los comportamientos.'],
    ['Cambian', 'las reglas.'],
    ['¿Por qué seguir', 'haciendo lo mismo?'],
  ];
  /* Cuerpo del claim (desktop): el mayor con el que la frase más larga del carrusel
     («Cambian los comportamientos.») cabe en la mitad derecha, de 50vw al margen. A partir
     de ahí, la frase de cierre salta a dos líneas (CSS). Se mide con la fuente real. */
  const fitClaim = () => {
    if (!claim) return;
    if (innerWidth < 1200) { claim.style.removeProperty('--claim-fs'); return; }
    const cs = getComputedStyle(claim);
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.font = `${cs.fontWeight} 100px ${cs.fontFamily}`;
    const longest = CLAIMS.slice(0, -1).map(p => p.join(' ')).sort((a, b) => b.length - a.length)[0];
    const w100 = ctx.measureText(longest).width - longest.length * 1;   // letter-spacing −0.01em
    const avail = innerWidth / 2 - parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pad'));
    const max = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--t-claim')) || 60;
    claim.style.setProperty('--claim-fs', Math.min(max, avail / w100 * 100 * 0.985).toFixed(2) + 'px');
  };
  fitClaim();
  addEventListener('resize', fitClaim);
  if (document.fonts) document.fonts.ready.then(fitClaim);

  const WORD_STAGGER = 30;   // desfase entre palabras
  const SWAP_MS = 520;       // duración de cada cambio (debe coincidir con --claim-dur)
  const HOLD = 260;               // pausa mínima al llegar: casi continuo
  const HOLD_BEFORE_CLOSE = 600;  // pausa en «Cambian las reglas.»: solo algo más que las demás
  const CLOSE_GAP = 60;           // respiro mínimo entre la salida completa y la entrada del cierre
  const HOLD_CLOSE = 3500;        // la pregunta final se queda en pantalla para digerirla
  const lines = [...document.querySelectorAll('[data-claim-line]')];
  const makeSlot = (text, cls = '') => {
    const s = document.createElement('span');
    s.className = 'claim__slot ' + cls;
    s.dataset.text = text;
    s.innerHTML = text.split(' ').map(w => `<span class="claim__w">${w}</span>`).join(' ');
    return s;
  };
  const stagger = (slot, offset = 0) => [...slot.children].forEach((w, i) => { w.style.transitionDelay = offset + i * WORD_STAGGER + 'ms'; });
  const setH = line => line.style.setProperty('--h', line.offsetHeight + 'px');

  const swapLine = (line, text) => new Promise(resolve => {
    const old = line.lastElementChild;
    if (old && old.dataset.text === text) return resolve();
    const next = makeSlot(text, 'is-below');
    line.appendChild(next);
    setH(line);
    stagger(old); stagger(next);
    next.offsetWidth; // reflow: fija el estado inicial antes de animar
    old.classList.add('is-above');
    next.classList.remove('is-below');
    const n = Math.max(old.children.length, next.children.length);
    setTimeout(() => { old.remove(); resolve(); }, SWAP_MS + n * WORD_STAGGER);
  });

  // Cambio secuencial (entrada y salida de la frase de cierre): primero sale por completo la
  // frase actual, respiro, y después entra la nueva. La saliente se retira del DOM justo antes
  // de añadir la entrante (en el mismo frame, cuando ya es invisible): así el ancho de cada
  // línea se ajusta sin que se vea un salto horizontal.
  const sequentialSwap = async texts => {
    const olds = lines.map(l => l.lastElementChild);
    olds.forEach(o => { stagger(o); o.classList.add('is-above'); });
    const nOut = Math.max(...olds.map(o => o.children.length));
    await wait(SWAP_MS + nOut * WORD_STAGGER + CLOSE_GAP);
    let longest = 0;
    lines.forEach((l, li) => {
      olds[li].remove();
      const s = makeSlot(texts[li], 'is-below');
      l.appendChild(s);
      setH(l);
      const offset = li * 2 * WORD_STAGGER;
      stagger(s, offset);
      s.offsetWidth;
      s.classList.remove('is-below');
      longest = Math.max(longest, offset + s.children.length * WORD_STAGGER);
    });
    await wait(SWAP_MS + longest);
  };

  let claimIdx = 0;
  const CLOSE_IDX = CLAIMS.length - 1;
  const rotateClaim = async () => {
    const next = (claimIdx + 1) % CLAIMS.length;
    if (reduced) lines.forEach((l, i) => l.replaceChildren(makeSlot(CLAIMS[next][i])));
    // Hacia el cierre y de vuelta al principio la primera línea cambia de ancho
    // («Cambian» ↔ «¿Por qué seguir»): salida completa y luego entrada, sin cruce
    else if (next === CLOSE_IDX || claimIdx === CLOSE_IDX) await sequentialSwap(CLAIMS[next]);
    else await Promise.all(lines.map((l, i) => swapLine(l, CLAIMS[next][i])));
    claimIdx = next;
    const hold = claimIdx === CLOSE_IDX ? HOLD_CLOSE
      : claimIdx === CLOSE_IDX - 1 ? HOLD_BEFORE_CLOSE
      : HOLD;
    setTimeout(rotateClaim, hold);
  };
  // Estado inicial: palabras abajo (ocultas) hasta que se revela la frase
  lines.forEach((l, i) => l.appendChild(makeSlot(CLAIMS[0][i], 'is-below')));
  const revealClaim = () => {
    lines.forEach((l, li) => {
      setH(l);
      const slot = l.lastElementChild;
      stagger(slot, li * 2 * WORD_STAGGER);
      slot.offsetWidth;
      slot.classList.remove('is-below');
    });
    setTimeout(rotateClaim, SWAP_MS + 900);
  };

  /* -----------------------------------------------------------------------
     LOADER:
     1) negro + trazos A–C–C dibujando el logo (desplazado a la derecha)
     2) el logo se desliza a su sitio; el reel aparece desde un gran desenfoque;
        los botones entran escalonados; la frase sube desde abajo
     ----------------------------------------------------------------------- */
  const endLoader = () => {
    clearTimeout(window.accLoaderSafety);
    root.classList.remove('is-loading');
    if (lenis) lenis.start();
  };

  const runIntro = async () => {
    const shape = navLogo.querySelector('.logo-shape');
    const strokes = [...navLogo.querySelectorAll('.logo-stroke')];

    if (!root.classList.contains('is-loading') || reduced || !strokes.length) {
      endLoader();
      if (heroVideo && !reduced) heroVideo.play().catch(() => {});
      revealClaim();
      return;
    }

    scrollTo(0, 0);
    if (lenis) { lenis.scrollTo(0, { immediate: true, force: true }); lenis.stop(); }

    strokes.forEach(el => { const len = el.getTotalLength(); el.style.strokeDasharray = len; el.style.strokeDashoffset = len; });
    shape.style.opacity = '1';
    const shiftX = clamp(innerWidth * 0.1, 40, 200);
    introX = shiftX;

    await wait(150); // un instante de negro
    await Promise.all(strokes.map((el, i) => {
      const len = el.getTotalLength();
      const a = el.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
        { duration: 520, delay: i * 80, easing: 'cubic-bezier(.33,0,.1,1)', fill: 'forwards' });
      return a.finished.then(() => { el.style.strokeDashoffset = '0'; a.cancel(); });
    }));
    shape.style.mask = 'none';

    // El reel necesita imagen antes de revelarse (máx. 0,8 s)
    if (heroVideo && heroVideo.readyState < 2) {
      await Promise.race([new Promise(r => heroVideo.addEventListener('loadeddata', r, { once: true })), wait(800)]);
    }
    if (heroVideo) heroVideo.play().catch(() => {});

    const SETTLE_MS = 1000, FOCUS_MS = 1500;
    // Logo: desplazamiento lateral → 0
    const settleEase = bezier(0.65, 0, 0.15, 1);
    const t0 = performance.now();
    const settle = new Promise(res => {
      const step = now => {
        const t = clamp((now - t0) / SETTLE_MS, 0, 1);
        introX = shiftX * (1 - settleEase(t));
        if (t < 1) requestAnimationFrame(step); else res();
      };
      requestAnimationFrame(step);
    });

    const anims = [];
    if (heroVideo) {
      anims.push(
        heroVideo.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 750, easing: 'cubic-bezier(0.33, 0, 0.2, 1)', fill: 'forwards' }),
        heroVideo.animate(
          [{ filter: 'blur(48px) brightness(0.55)', scale: '1.14' }, { filter: 'blur(0px) brightness(0.82)', scale: '1' }],
          { duration: FOCUS_MS, easing: 'cubic-bezier(0.5, 0, 0.15, 1)', fill: 'forwards' }
        )
      );
    }
    navItems.forEach((el, i) => {
      anims.push(el.animate(
        [{ opacity: 0, transform: 'translateY(14px)', filter: 'blur(8px)' }, { opacity: 1, transform: 'none', filter: 'blur(0px)' }],
        { duration: 750, delay: 300 + i * 55, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' }
      ));
    });
    setTimeout(revealClaim, 420);

    await Promise.all([settle, ...anims.map(a => a.finished)]);
    endLoader();
    anims.forEach(a => a.cancel());
    shape.style.removeProperty('opacity');
    shape.style.removeProperty('mask');
  };

  /* -----------------------------------------------------------------------
     ESCENARIO — el reel y la frase se quedan fijos: el desenfoque crece con el
     scroll y, cuando el manifiesto entra (55% del viewport), el vídeo se apaga
     ----------------------------------------------------------------------- */
  const FADE_AT = 0.55;
  const updateStage = () => {
    if (!stage || !statementText) return;
    const vh = innerHeight, y = scrollY;
    const textTop = statementText.getBoundingClientRect().top;
    const range = Math.max(1, textTop + y - vh * FADE_AT);
    const blurP = reduced ? 0 : clamp(y / range, 0, 1);
    const fade = textTop <= vh * FADE_AT ? 1 : 0;
    stage.style.setProperty('--hero-blur', (blurP * 28).toFixed(2) + 'px');
    stage.style.setProperty('--fade', String(fade));
    if (claim) {
      claim.style.setProperty('--claim-blur', (blurP * 12).toFixed(2) + 'px');
      claim.style.setProperty('--claim-o', (1 - blurP * 0.6).toFixed(3));
    }
    if (heroVideo && !reduced) heroVideo.style.transform = `scale(${(1 + clamp(y / vh, 0, 1) * 0.2).toFixed(4)})`;
    if (heroSection) heroSection.dataset.theme = fade ? 'light' : 'dark';
    // Botones del header: blancos mientras se ve el hero (vídeo encendido), negros al salir
    nav.dataset.zone = fade ? 'page' : 'hero';
  };

  /* -----------------------------------------------------------------------
     MANIFIESTO — hover sobre la palabra subrayada: aparece su gif encima
     (vídeo en bucle, o imágenes en ciclo rápido de 280 ms). En táctil se
     activa al tocar.
     ----------------------------------------------------------------------- */
  // El color se aplica a toda la página (--page-tint en <html>): body y secciones blancas
  const setStatementBg = bg => {
    if (bg) root.style.setProperty('--page-tint', bg);
    else root.style.removeProperty('--page-tint');
  };
  document.querySelectorAll('[data-gif]').forEach(word => {
    const imgs = [...word.querySelectorAll('img')];
    const video = word.querySelector('video');
    let j = 0, timer = null;
    const start = () => {
      setStatementBg(word.dataset.bg);
      if (video) { if (!reduced) video.play().catch(() => {}); return; }
      if (timer || reduced || imgs.length < 2) return;
      timer = setInterval(() => {
        imgs[j].classList.remove('is-active');
        j = (j + 1) % imgs.length;
        imgs[j].classList.add('is-active');
      }, 280);
    };
    const stop = () => { clearInterval(timer); timer = null; video?.pause(); setStatementBg(null); };
    word.addEventListener('mouseenter', start);
    word.addEventListener('mouseleave', stop);
    word.addEventListener('focus', start);
    word.addEventListener('blur', () => { stop(); word.classList.remove('is-on'); });
    if (!canHover) {
      word.addEventListener('click', () => {
        const on = !word.classList.contains('is-on');
        document.querySelectorAll('[data-gif].is-on').forEach(w => w !== word && w.classList.remove('is-on'));
        word.classList.toggle('is-on', on);
        on ? start() : stop();
      });
    }
  });

  /* -----------------------------------------------------------------------
     SECTORES — lista + tarjeta. Hover / foco en un sector: la sección toma su
     tono claro, el resto de la lista pasa al 50% y la tarjeta muestra sus
     logos (fondo profundo + logos en tono claro). En reposo muestra todas
     las marcas en gris sobre fondo gris claro.
     ----------------------------------------------------------------------- */
  const sectors = document.querySelector('[data-sectors]');
  if (sectors) {
    const items = [...sectors.querySelectorAll('[data-logos]')];
    const grid = sectors.querySelector('.sectors__grid');
    const card = sectors.querySelector('[data-sectors-card]');
    const stage = sectors.querySelector('[data-sectors-stage]');
    const nameEl = sectors.querySelector('[data-sectors-name]');
    // logos.js los trae embebidos (data URI) para que la máscara funcione también en file://
    const logoUrl = name => (window.ACC_LOGOS && window.ACC_LOGOS[name])
      || new URL(`assets/clients/${name}.svg`, document.baseURI).href;
    // Par de la paleta: tinte de sección (claro) · tarjeta (profundo) · logos (claro).
    // Yellow y stone no tienen contraste entre sus dos tonos: logos en negro
    const INK_BLACK = new Set(['yellow', 'stone']);
    const pair = c => ({
      tint: c === 'stone' ? 'var(--c-stone-deep)' : `var(--c-${c})`, // en stone el «profundo» es el más claro
      card: c === 'stone' ? 'var(--c-stone)' : `var(--c-${c}-deep)`,
      ink: INK_BLACK.has(c) ? 'var(--c-black)' : `var(--c-${c})`
    });

    // Una capa de logos por sector, montada una vez
    const layers = items.map(a => {
      const logos = a.dataset.logos.split(',');
      const el = document.createElement('span');
      el.className = 'sectors__logos';
      el.dataset.n = logos.length;
      el.innerHTML = logos.map((l, i) =>
        `<span class="sectors__logo" style="--i:${i};--logo:url('${logoUrl(l)}')"></span>`).join('');
      stage.appendChild(el);
      return el;
    });

    // Composición de reposo con todas las marcas, sin duplicados.
    const allLogos = [...new Set(items.flatMap(a => a.dataset.logos.split(',')))];
    const idle = document.createElement('span');
    idle.className = 'sectors__logos sectors__logos--all';
    idle.innerHTML = allLogos.map(l =>
      `<span class="sectors__logo" style="--logo:url('${logoUrl(l)}')"></span>`).join('');
    stage.appendChild(idle);

    let shown = null;
    const mark = k => {
      if (k === shown) return;
      shown = k;
      items.forEach((x, i) => x.classList.toggle('is-active', i === k));
      layers.forEach((l, i) => l.classList.toggle('is-in', i === k));
      idle.classList.toggle('is-in', k < 0);
      sectors.classList.toggle('is-active', k >= 0);
      card.classList.toggle('is-idle', k < 0);
      if (k < 0) {
        sectors.style.removeProperty('--sector-card');
        sectors.style.removeProperty('--sector-ink');
        root.style.removeProperty('--page-tint');
        card.removeAttribute('href');
        nameEl.textContent = '';
        return;
      }
      const a = items[k], p = pair(a.dataset.color);
      sectors.style.setProperty('--sector-card', p.card);
      sectors.style.setProperty('--sector-ink', p.ink);
      root.style.setProperty('--page-tint', p.tint);
      card.href = a.href;
      nameEl.textContent = a.textContent;
    };

    mark(-1);
    items.forEach((a, k) => {
      if (canHover) a.addEventListener('mouseenter', () => mark(k));
      a.addEventListener('focus', () => mark(k));
    });
    // Mantiene el sector al pasar de su enlace a la tarjeta.
    grid.addEventListener('mouseleave', () => {
      const focused = items.indexOf(document.activeElement);
      mark(focused);
    });
    sectors.addEventListener('focusout', e => {
      if (!sectors.contains(e.relatedTarget)) mark(-1);
    });
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
      if (e.isIntersecting) { if (v.preload === 'none') v.preload = 'auto'; v.play().catch(() => {}); }
      else v.pause();
    });
  }, { rootMargin: '200px 0px' });
  document.querySelectorAll('[data-lazy-video]').forEach(v => videoIO.observe(v));

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
    updateStage();
    updateLogo();
    updateNavTheme();
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  runIntro();
})();
