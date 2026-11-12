/* =========================================================================
   ACC 6 BOLD — Menú (todas las páginas)
   · Abrir / cerrar con la hamburguesa ([data-menu-open]), Esc o cualquier enlace
     del menú. Bloquea el scroll de la página (y Lenis: window.accLenis) y guarda
     en --sbw el ancho de la barra de scroll para que la nav no salte.
   · Pila sticky: z-index, retardos de entrada y desactivar el sticky si alguna
     sección no cabe en pantalla (si no, su final quedaría oculto).
   · Scroll suavizado propio (Lenis sobre el overlay, sutil).
   · Al llegar al final, forzar el scroll cierra el menú.
   ========================================================================= */
(() => {
  const menu = document.querySelector('[data-menu]');
  const btn = document.querySelector('[data-menu-open]');
  if (!menu || !btn) return;
  const root = document.documentElement;
  const isOpen = () => menu.classList.contains('is-open');

  const top = menu.querySelector('.menu__top');
  const secs = [...menu.querySelectorAll('.menu__sec')];
  const STEP = 70;   // ms entre secciones

  secs.forEach((sec, i) => {
    sec.style.setProperty('--z', i + 1);
    sec.style.setProperty('--d', `${i * STEP}ms`);
    const title = sec.querySelector('.menu__title .menu__mask > *');
    if (title) title.style.setProperty('--d', `${80 + i * STEP}ms`);
    sec.querySelectorAll('.menu__body .menu__mask > *, .menu__body [data-menu-fade]').forEach((el, k) => {
      el.style.setProperty('--d', `${260 + i * STEP + Math.min(k, 30) * 12}ms`);
    });
  });

  /* Sticky solo si todas las secciones (menos la última) caben bajo la barra superior */
  const fit = () => {
    const avail = innerHeight - top.offsetHeight;
    menu.classList.toggle('is-flat', secs.slice(0, -1).some(s => s.offsetHeight > avail));
  };
  addEventListener('resize', fit);

  /* Scroll suavizado propio del menú: Lenis sobre el overlay, sutil (lerp 0.14,
     más ágil que el 0.09 de la página). El data-lenis-prevent del menú solo
     excluye al Lenis de la página: el propio contenedor no cuenta para este. */
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menuLenis = (!reduced && window.Lenis)
    ? new window.Lenis({ wrapper: menu, content: menu.querySelector('.menu__stack'), lerp: 0.14, autoRaf: true })
    : null;

  /* -----------------------------------------------------------------------
     CERRAR FORZANDO EL SCROLL EN EL TOPE
     Al llegar al final (Contacto arriba), seguir empujando sube y apaga la pila
     (--pull) y, pasado el umbral, cierra el menú. Para que la inercia del
     trackpad al llegar no lo cierre, solo cuenta un gesto nuevo: una pausa
     ≥180 ms sin rueda ya en el final. Si se suelta antes, vuelve a su sitio.
     ----------------------------------------------------------------------- */
  const stack = menu.querySelector('.menu__stack');
  const WHEEL_CLOSE = 260;   // px de rueda acumulados
  const TOUCH_CLOSE = 140;   // px de arrastre en táctil
  const atEnd = () => menu.scrollTop >= menu.scrollHeight - menu.clientHeight - 2;
  let pull = 0, armed = false, lastWheel = 0, relax = 0, touchY = null;

  const setPull = v => {
    pull = Math.max(0, v);
    const k = Math.min(pull / WHEEL_CLOSE, 1);
    stack.style.translate = k ? `0 ${(-k * 60).toFixed(1)}px` : '';
    stack.style.opacity = k ? String(1 - k * 0.4) : '';
  };
  const closeMenu = () => {
    armed = false; setPull(0);
    setMenu(false);
  };

  menu.addEventListener('wheel', e => {
    const now = performance.now();
    const gap = now - lastWheel;
    lastWheel = now;
    if (!atEnd() || e.deltaY <= 0) { armed = false; setPull(0); return; }
    if (!armed && gap > 180) armed = true;   // gesto nuevo ya en el final
    if (!armed) return;
    setPull(pull + e.deltaY * (e.deltaMode === 1 ? 16 : 1));
    if (pull >= WHEEL_CLOSE) { closeMenu(); return; }
    clearTimeout(relax);
    relax = setTimeout(() => setPull(0), 220);
  }, { passive: true });

  menu.addEventListener('touchstart', e => { touchY = atEnd() ? e.touches[0].clientY : null; }, { passive: true });
  menu.addEventListener('touchmove', e => {
    const y = e.touches[0].clientY;
    if (touchY === null) { if (atEnd()) touchY = y; return; }
    setPull((touchY - y) * WHEEL_CLOSE / TOUCH_CLOSE);
  }, { passive: true });
  const touchEnd = () => {
    if (touchY !== null && pull >= WHEEL_CLOSE) closeMenu(); else setPull(0);
    touchY = null;
  };
  menu.addEventListener('touchend', touchEnd);
  menu.addEventListener('touchcancel', touchEnd);

  /* -----------------------------------------------------------------------
     ABRIR / CERRAR
     ----------------------------------------------------------------------- */
  function setMenu(open) {
    if (open === isOpen()) return;
    if (open) root.style.setProperty('--sbw', `${innerWidth - root.clientWidth}px`);   // antes de ocultar la barra
    else root.style.removeProperty('--sbw');
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    root.style.overflow = open ? 'hidden' : '';
    const lenis = window.accLenis;
    if (lenis && !root.classList.contains('is-loading')) open ? lenis.stop() : lenis.start();
    if (open) {
      fit();
      if (menuLenis) { menuLenis.resize(); menuLenis.scrollTo(0, { immediate: true, force: true }); }
      else menu.scrollTop = 0;
    }
    armed = false; clearTimeout(relax); setPull(0);
  }

  btn.addEventListener('click', () => setMenu(!isOpen()));
  menu.querySelectorAll('[data-menu-link]').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen()) setMenu(false); });
})();
