/* =========================================================================
   ACC 6 BOLD — Noticias (noticias.html)
   Datos: js/noticias-data.js (window.ACC_NEWS). Va ANTES de caso.js, que pone
   Lenis, nav, franja y el reveal ([data-reveal]) sobre lo que se pinta aquí.
   · Destacada: la primera (o la que lleve featured: true)
   · Dos filas: las 6 siguientes (3 por fila)
   · Listado: el resto, de PAGE en PAGE con «Cargar más». Todas las filas se
     pintan al cargar y las pendientes van ocultas: así caso.js ya las observa
     y entran con su reveal al mostrarse
   ========================================================================= */
(() => {
  'use strict';

  const NEWS = window.ACC_NEWS;
  if (!NEWS) return;
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const GRID = 6;   // dos filas de 3
  const PAGE = 5;   // filas del listado por carga

  const items = NEWS.items.slice();
  const fi = Math.max(0, items.findIndex(n => n.featured));
  const featured = items.splice(fi, 1)[0];
  const grid = items.slice(0, GRID);
  const list = items.slice(GRID);

  /* Destacada ------------------------------------------------------------- */
  const featEl = $('[data-news-feature]');
  if (featEl && featured) {
    featEl.innerHTML = `
      <a class="card news-feature" href="${NEWS.href(featured)}" data-reveal>
        <div class="card__media"><img src="${featured.image}" alt="${esc(featured.alt || '')}" decoding="async" /></div>
        <div class="news-feature__body">
          <p class="news-feature__tag">${esc(NEWS.catName(featured))}</p>
          <h2 class="news-feature__title">${esc(featured.title)}</h2>
          <p class="news-feature__lead">${esc(featured.lead)}</p>
          <span class="svc__more"><span class="svc__more-label">Leer noticia</span><span class="msi" aria-hidden="true">arrow_forward</span></span>
        </div>
      </a>`;
  }

  /* Dos filas: la tarjeta de noticia de la home ----------------------------- */
  const gridEl = $('[data-news-grid]');
  if (gridEl) {
    gridEl.innerHTML = grid.map(n => `
      <a class="card" href="${NEWS.href(n)}" data-reveal>
        <div class="card__media"><img src="${n.image}" alt="" loading="lazy" decoding="async" /></div>
        <div class="card__meta">
          <h2 class="card__title">${esc(n.title)}</h2>
          <p class="card__tag">${esc(NEWS.catName(n))}</p>
        </div>
      </a>`).join('');
  }

  /* Listado + Cargar más ------------------------------------------------------ */
  const listEl = $('[data-news-list]');
  const more = $('[data-news-more]');
  const status = $('[data-news-status]');
  if (!listEl) return;

  listEl.innerHTML = list.map((n, i) => `
    <li data-reveal${i >= PAGE ? ' hidden' : ''}>
      <a class="news-row" href="${NEWS.href(n)}">
        <h3 class="news-row__title">${esc(n.title)}</h3>
        <p class="news-row__tag">${esc(NEWS.catName(n))}</p>
        <div class="news-row__media"><img src="${n.image}" alt="" loading="lazy" decoding="async" /></div>
      </a>
    </li>`).join('');

  const pending = () => [...listEl.querySelectorAll('li[hidden]')];
  const sync = () => { if (more) more.hidden = pending().length === 0; };
  sync();

  more?.addEventListener('click', () => {
    const next = pending().slice(0, PAGE);
    next.forEach((li, k) => {
      li.hidden = false;
      // Entrada escalonada (70 ms, el paso del menú); se limpia al terminar
      li.style.transitionDelay = `${k * 70}ms`;
      li.addEventListener('transitionend', () => li.style.removeProperty('transition-delay'), { once: true });
    });
    sync();
    if (status) status.textContent = `${next.length} noticias más cargadas.`;
    // El foco pasa a la primera noticia nueva (si el botón desaparece, no se pierde)
    next[0]?.querySelector('a')?.focus({ preventScroll: true });
    window.accLenis?.resize?.();
  });
})();
