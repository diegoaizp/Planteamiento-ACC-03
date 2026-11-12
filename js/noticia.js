/* =========================================================================
   ACC 6 BOLD — Noticia (noticia.html?slug=…)
   Datos: js/noticias-data.js (window.ACC_NEWS). Va ANTES de caso.js, que pone
   Lenis, nav, franja, reveal ([data-reveal]), asentado de la imagen
   ([data-settle]) y el tinte de la cita ([data-tint] + --case-c del <body>)
   sobre lo que se pinta aquí.
   · Sin slug: la noticia más reciente. Slug desconocido: vuelve a Noticias
   · Siguiente noticia: la siguiente en el orden del listado (la más antigua
     lleva a la más reciente)
   · Más noticias: 4, primero la misma categoría y después las más recientes
   ========================================================================= */
(() => {
  'use strict';

  const NEWS = window.ACC_NEWS;
  if (!NEWS) return;
  const $ = s => document.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const items = NEWS.items;
  const slug = new URLSearchParams(location.search).get('slug');
  const idx = slug ? items.findIndex(n => n.slug === slug) : 0;
  if (idx < 0) { location.replace('./noticias.html'); return; }
  const n = items[idx];
  const cat = NEWS.cats[n.cat] || {};

  /* SEO básico: título, descripción y datos estructurados ------------------- */
  document.title = `${n.title} — Noticias — ACC`;
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.content = n.lead;
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', `${n.title} — ACC`);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', n.lead);
  const ld = document.createElement('script');
  ld.type = 'application/ld+json';
  ld.textContent = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'NewsArticle',
    headline: n.title, description: n.lead, datePublished: n.date,
    image: new URL(n.image, location.href).href, articleSection: cat.name,
    publisher: { '@type': 'Organization', name: 'ACC' },
  });
  document.head.appendChild(ld);

  /* Color de la categoría: lo usa la cita para teñir la página (caso.js) ----- */
  if (cat.tint) document.body.style.setProperty('--case-c', cat.tint);

  /* Cabecera -------------------------------------------------------------- */
  $('[data-post-title]').textContent = n.title;
  $('[data-post-cat]').textContent = cat.name || '';
  const time = $('[data-post-date]');
  time.textContent = NEWS.dateLabel(n);
  time.dateTime = n.date;
  $('[data-post-read]').textContent = `${n.read} min de lectura`;

  /* Imagen y cuerpo ------------------------------------------------------- */
  const frame = $('[data-post-media]');
  frame.style.setProperty('--ar', n.ar || '1 / 1');
  frame.innerHTML = `<img src="${n.image}" alt="${esc(n.alt || '')}" decoding="async" data-settle />`;

  const block = b => {
    if (typeof b === 'string') return `<p data-reveal>${esc(b)}</p>`;
    if (b.h2) return `<h2 data-reveal>${esc(b.h2)}</h2>`;
    if (b.ul) return `<ul class="job-list">${b.ul.map(li => `<li data-reveal>${esc(li)}</li>`).join('')}</ul>`;
    return '';
  };
  $('[data-post-text]').innerHTML =
    `<p class="news-post__lead" data-reveal>${esc(n.lead)}</p>` + n.body.map(block).join('');

  /* Cita (opcional): el final literal del texto, con su parte subrayada ---- */
  const quote = $('[data-post-quote]');
  if (n.quote) {
    const q = n.quote;
    quote.querySelector('p').innerHTML =
      `${esc(q.text)} <span class="case-quote__hl">${esc(q.hl)}</span>${esc(q.after || '')}`;
    quote.hidden = false;
  } else {
    quote.remove();
  }

  /* Siguiente noticia: la franja negra de «Siguiente proyecto» -------------- */
  const nextN = items[(idx + 1) % items.length];
  const next = $('[data-next]');
  if (next && nextN && nextN !== n) {
    next.href = NEWS.href(nextN);
    next.querySelector('[data-next-client]').textContent = nextN.title;
    next.querySelector('[data-next-project]').textContent = NEWS.catName(nextN);
    next.querySelector('[data-next-media]').innerHTML = `<img src="${nextN.image}" alt="" loading="lazy" decoding="async" />`;
    next.setAttribute('aria-label', `Siguiente noticia: ${nextN.title}`);
    next.hidden = false;
  }

  /* Más noticias: la sección de la home, con 4 tarjetas -------------------- */
  const related = $('[data-news-related]');
  if (related) {
    const pool = items.filter(x => x !== n && x !== nextN);
    const picked = [...pool.filter(x => x.cat === n.cat), ...pool.filter(x => x.cat !== n.cat)].slice(0, 4);
    related.innerHTML = picked.map(x => `
      <a class="card" href="${NEWS.href(x)}" data-reveal>
        <div class="card__media"><img src="${x.image}" alt="" loading="lazy" decoding="async" /></div>
        <div class="card__meta">
          <h3 class="card__title">${esc(x.title)}</h3>
          <p class="card__tag">${esc(NEWS.catName(x))}</p>
        </div>
      </a>`).join('');
  }
})();
