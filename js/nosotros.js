/* =========================================================================
   ACC 6 BOLD — Nosotros
   Va después de caso.js, que ya pone Lenis, nav, menú, franjas, galería
   «Arrastra», tinte de la cita, reveal y vídeos perezosos. Aquí solo:
   1. Palabras subrayadas de la intro (gif + tinte de página, como el manifiesto)
   1b. Empresas del grupo: el módulo de Sectores (lista + tarjeta con el logo)
   2. Valores: el que cruza el centro de la pantalla queda activo y cambia la foto
   ========================================================================= */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover)').matches;

  /* -----------------------------------------------------------------------
     1. PALABRAS — hover: aparece su gif (ciclo de 280 ms) y toda la página
     toma el color claro (--page-tint). En táctil se activa al tocar.
     Mismo comportamiento que el manifiesto de la home (main.js)
     ----------------------------------------------------------------------- */
  // Tinte de página: el hover (palabras / empresas del grupo) manda sobre el azul de Valores,
  // así si Valores ya está en pantalla también cambia de color
  const VALORES_TINT = 'var(--c-sky)';
  let hoverTint = null, valoresOn = false, ours = false;
  const applyTint = () => {
    const want = hoverTint || (valoresOn ? VALORES_TINT : null);
    if (want) { root.style.setProperty('--page-tint', want); ours = true; }
    else if (ours) { root.style.removeProperty('--page-tint'); ours = false; }
  };
  const setTint = bg => { hoverTint = bg || null; applyTint(); };
  document.querySelectorAll('[data-gif]').forEach(word => {
    const imgs = [...word.querySelectorAll('img')];
    const video = word.querySelector('video');
    let j = 0, timer = null;
    const start = () => {
      setTint(word.dataset.bg);
      if (video) {
        if (!reduced) {
          if (video.hasAttribute('data-restart-on-hover') && video.paused) video.currentTime = 0;
          video.playbackRate = Number(video.dataset.playbackRate) || 1;
          video.play().catch(() => {});
        }
        return;
      }
      if (timer || reduced) return;
      timer = setInterval(() => {
        imgs[j].classList.remove('is-active');
        j = (j + 1) % imgs.length;
        imgs[j].classList.add('is-active');
      }, 280);
    };
    const stop = () => { clearInterval(timer); timer = null; video?.pause(); setTint(null); };
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
     1b. EMPRESAS DEL GRUPO — el módulo de Sectores de la home. Hover / foco en
     una empresa: la tarjeta toma el color de su marca y su logo, la página un
     tono claro de ese color (--page-tint, como las palabras) y el resto de la
     lista pasa al 50%. Al salir, vuelve la tarjeta de Grupo ACC. En táctil,
     las empresas rotan solas mientras el módulo está en pantalla.
     ----------------------------------------------------------------------- */
  const group = document.querySelector('[data-group]');
  if (group) {
    const links = [...group.querySelectorAll('[data-brand]')];
    const card = group.querySelector('[data-group-card]');
    const layers = [...group.querySelectorAll('[data-brand-layer]')];
    const nameEl = group.querySelector('[data-group-name]');
    const iconEl = group.querySelector('[data-group-icon]');
    const rest = { card: 'var(--c-black)', ink: 'white', name: 'Grupo ACC' };
    card.dataset.ink = rest.ink;

    let current = -1;
    const mark = k => {
      if (k === current) return;
      current = k;
      const a = links[k];
      links.forEach((x, i) => x.classList.toggle('is-active', i === k));
      group.classList.toggle('is-active', !!a);
      layers.forEach(l => l.classList.toggle('is-in', l.dataset.brandLayer === (a ? String(k) : 'rest')));
      group.style.setProperty('--group-card', a ? a.dataset.brandBg : rest.card);
      group.style.setProperty('--group-ink', a ? `var(--c-${a.dataset.brandInk})` : 'var(--c-white)');
      card.dataset.ink = a ? a.dataset.brandInk : rest.ink;
      nameEl.textContent = a ? a.textContent : rest.name;
      iconEl.textContent = a ? a.dataset.brandIcon : '';
      iconEl.dataset.icon = a ? a.dataset.brandIcon : '';
      if (a) {
        card.href = a.href;
        if (a.target) { card.target = a.target; card.rel = a.rel; }
        else { card.removeAttribute('target'); card.removeAttribute('rel'); }
      } else {
        card.removeAttribute('href'); card.removeAttribute('target'); card.removeAttribute('rel');
      }
      setTint(a ? `color-mix(in srgb, ${a.dataset.brandBg} 30%, var(--c-white))` : null);
    };

    if (canHover) {
      links.forEach((a, k) => {
        a.addEventListener('mouseenter', () => mark(k));
        a.addEventListener('focus', () => mark(k));
      });
      // Lista y tarjeta son una sola zona: se puede ir del nombre a la tarjeta sin perderlo
      group.addEventListener('mouseleave', () => mark(-1));
      group.addEventListener('focusout', e => { if (!group.contains(e.relatedTarget)) mark(-1); });
    } else if (!reduced) {
      let timer = null;
      new IntersectionObserver(([e]) => {
        clearInterval(timer);
        if (e.isIntersecting) {
          const step = () => mark((current + 1) % links.length);
          step(); timer = setInterval(step, 1800);
        } else mark(-1);
      }, { threshold: 0.4 }).observe(group);
    }
  }

  /* -----------------------------------------------------------------------
     2. VALORES — activo: el último cuyo inicio ha pasado el centro de la
     pantalla. Mientras la lista ocupa el centro, el resto va al 50%
     ----------------------------------------------------------------------- */
  const values = document.querySelector('[data-values]');
  if (values) {
    const items = [...values.querySelectorAll('[data-value]')];
    const photos = [...values.querySelectorAll('[data-values-media] img')];
    const bg = values.closest('.about-valores-bg');
    let current = -1;
    const update = () => {
      const mid = innerHeight * 0.5;
      const list = values.getBoundingClientRect();
      values.classList.toggle('is-active', list.top < mid && list.bottom > mid);
      if (bg) {
        const r = bg.getBoundingClientRect();
        const on = r.top < mid && r.bottom > mid;
        if (on !== valoresOn) valoresOn = on;
        applyTint();
      }
      let idx = 0;
      items.forEach((li, i) => { if (li.getBoundingClientRect().top < mid) idx = i; });
      if (idx === current) return;
      current = idx;
      items.forEach((li, i) => li.classList.toggle('is-active', i === idx));
      photos.forEach((img, i) => img.classList.toggle('is-active', i === idx));
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    update();
  }
  /* -----------------------------------------------------------------------
     3. PERSONAS (prueba) — foto flotante que sigue al cursor sobre la lista
     ----------------------------------------------------------------------- */
  const team = document.querySelector('.about-team');
  if (team && matchMedia('(hover: hover)').matches) {
    const peek = document.createElement('div');
    peek.className = 'about-peek';
    peek.setAttribute('aria-hidden', 'true');
    const pimg = document.createElement('img');
    pimg.alt = '';
    peek.appendChild(pimg);
    document.body.appendChild(peek);
    const W = 220, H = 293;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0, shown = false;
    const tick = () => {
      x += (tx - x) * (reduced ? 1 : 0.18);
      y += (ty - y) * (reduced ? 1 : 0.18);
      peek.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };
    const target = (e) => {
      tx = Math.min(e.clientX + 28, innerWidth - W - 16);
      ty = Math.max(16, Math.min(e.clientY - H / 2, innerHeight - H - 16));
      if (!shown) { x = tx; y = ty; }
      if (!raf) raf = requestAnimationFrame(tick);
    };
    team.querySelectorAll('.about-member').forEach((li) => {
      const src = li.querySelector('img')?.getAttribute('src');
      li.addEventListener('mouseenter', (e) => {
        if (src) pimg.src = src;
        li.classList.add('is-active');
        team.classList.add('is-hovering');
        target(e);
        shown = true;
        peek.classList.add('is-on');
      });
      li.addEventListener('mousemove', target);
      li.addEventListener('mouseleave', () => {
        li.classList.remove('is-active');
        team.classList.remove('is-hovering');
        peek.classList.remove('is-on');
        shown = false;
      });
    });
  }
})();
