/* =========================================================================
   ACC 6 BOLD — Servicios
   Va después de caso.js, que ya pone Lenis, nav, franja, parallax (data-par),
   reveal y vídeos perezosos. Aquí solo el tinte de página: mientras algún
   servicio cruza el centro de la pantalla, toda la página toma el color de
   data-svc-tint (un solo color para todo el tramo, como Valores en Nosotros).
   El hover del índice (el resto al 50%) es solo CSS. Sin js, todo en blanco.
   ========================================================================= */
(() => {
  'use strict';

  const root = document.documentElement;
  const wrap = document.querySelector('[data-svc-tint]');
  const sections = [...document.querySelectorAll('[data-svc]')];
  if (!wrap || !sections.length) return;
  const tint = wrap.dataset.svcTint;

  const update = () => {
    const mid = innerHeight * 0.5;
    // Bloques contiguos: basta con el primero y el último
    const top = sections[0].getBoundingClientRect().top;
    const bottom = sections[sections.length - 1].getBoundingClientRect().bottom;
    const on = top < mid && bottom > mid;
    const cur = root.style.getPropertyValue('--page-tint');
    if (on && cur !== tint) root.style.setProperty('--page-tint', tint);
    else if (!on && cur) root.style.removeProperty('--page-tint');
  };
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', update);
  // caso.js limpia --page-tint en su primer frame: se reaplica después
  requestAnimationFrame(() => requestAnimationFrame(update));
})();
