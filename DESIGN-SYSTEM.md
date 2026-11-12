# ACC 6 BOLD — Sistema de diseño

Sistema de diseño de ACC 6 BOLD: tipografía Scto Grotesk A, el loader y el hero de ACC, y los colores de marca de ACC.

Todos los valores están en `css/tokens.css`. Esta guía explica qué significan.

---

## 1. Color

**Base.** Negro `#000` y blanco `#fff`.

**Paleta en pares** (claro = logos y formas · profundo = fondo en hover):

| Token | Claro | Profundo |
|---|---|---|
| yellow | `#ffd650` | `#ffb900` |
| lilac | `#ca9df1` | `#81649a` |
| sky | `#93d4f2` | `#295c93` |
| green | `#0daa75` | `#2f6855` |
| peach | `#f3c6b1` | `#af3540` |
| pink | `#f08fc7` | `#a92571` |
| stone | `#aeaeb2` | `#c7c7cc` |

**Marca ACC:**
- `--c-acc-coral` `#ff5850`: CTA «Más proyectos» y franja de la newsletter (prefooter).
- `--c-acc-mint-light` `#dae8e4`: fondo de Noticias.
- `--c-acc-mint` `#b9d7cf`: CTA «Todas las noticias».
- `--c-acc-pink` `#fbc2f2`: tinte de página de Nosotros (cita «desde 1990»).

**Funcionales:**
- Metadatos y nombre de proyecto: `#666`.
- Ítems inactivos de una lista en hover: `rgba(0,0,0,.5)`.

## 2. Tipografía — Scto Grotesk A (pesos 400/500/600/700/900)

| Rol | Desktop | Tablet | Móvil | Peso | Interlineado |
|---|---|---|---|---|---|
| Título de sección (MAYÚSCULAS) | 108 | 72 | 40 | 700 | 1.1 |
| Statement / manifiesto | 64 | 64 | 36 | 600 | 1.2 (1.3 en móvil) |
| Claim del hero | ≤60 (ajustado) | 52 (máx. 9.5vw) | 48 (máx. 9.5vw) | 600 | 1.2 |
| Lista (sectores) | 52 | 42 | 24 | 500 (600 en móvil) | 1.2 |
| Subtítulo | 38 | 38 | 20 | 500 | 1.2 |
| Marca + título de proyecto (`--w-project`) | 24 | 20 | 16 | 600 | 1.2 |
| Título de noticia / CTA | 24 | 20 | 16 | 500 | 1.2 |
| Nav | 16 | 16 | 16 | 500 · −0.02em · MAYÚSCULAS | 1.4 |
| Cuerpo / tags | 16 | 16 | 14 | 400 | 1.6 |
| Franja newsletter | 20 | 20 | 17 | 400 | 1 |

**Breakpoints:** desktop ≥1200, tablet 810–1199, móvil <810. La nav es igual en todos los tamaños: Proyectos, Contacto y hamburguesa.

## 3. Espacio y retícula
- **Margen lateral:** 40 px (16 px en móvil).
- **Separación vertical:** 200 px de padding en las secciones de contenido y 160 px entre el título y el contenido.
- **Grid de casos.** 12 columnas con 3 tarjetas por fila, cada una con su propio ancho y proporción. Ningún caso ocupa todo el ancho.
  - Fila 1: 5 columnas (639:556), 4 columnas (4:5) y 3 columnas (3:4).
  - Fila 2: 3 columnas (1:1), 5 columnas (694:493) y 4 columnas (503:437).
  - 40 px entre columnas y 120 px entre filas.

## 4. Componentes

### Loader
Sobre negro, los trazos A–C–C revelan el logo con una máscara: 760 ms por trazo, 120 ms de desfase entre ellos. Durante el dibujo, el logo está desplazado `clamp(10vw, 40px, 200px)` a la derecha.

Al terminar el dibujo ocurre todo a la vez:
- El logo se desliza a su sitio en 1500 ms (`cubic-bezier(.65,0,.15,1)`).
- El reel aparece desde negro: pasa de `blur(48px) brightness(.55) scale(1.14)` al foco en 2300 ms.
- Los botones entran escalonados (opacidad + 14 px + `blur(8px)`, 80 ms entre cada uno).
- La frase sube desde abajo, sin desenfoque.

El scroll queda bloqueado mientras dura la intro. No hay intro si el usuario tiene activado «reducir movimiento» o si la URL lleva un ancla.

### Nav
- **Logo · Proyectos · Contacto · hamburguesa**, igual en todos los tamaños. Proyectos y Contacto son píldoras pegadas entre sí; la hamburguesa es un círculo con el icono `menu` (Material Symbols). En móvil, botones de 40 px y texto a 14.
- **Blancos con texto negro sobre el hero; negros con texto blanco al salir de él.** El cambio se produce cuando se apaga el vídeo (`nav[data-zone]`) y dura 0,45 s.
- Fuera del hero, sobre secciones negras (footer), llevan un contorno blanco de 1 px para que se sigan viendo.
- El logo es blanco sobre fondos oscuros y negro sobre fondos claros.
- **Al abrir el menú:**
  - La hamburguesa no se mueve y se transforma en «cerrar»: de círculo blanco a **cuadrado negro**, con el radio animado del 50% a 0 (0,45 s). Los iconos `menu` y `close` se cruzan con un fundido y un giro de 90°.
  - Proyectos y Contacto se retiran hacia la hamburguesa (opacidad, 14 px y `blur(8px)`), y el logo de la nav cede el sitio al del menú.
  - El scroll de la página se bloquea. El ancho de la barra de scroll que desaparece se compensa (`--sbw`) para que la nav no salte.

### Menú
Overlay a pantalla completa en **coral ACC (`#FF5850`) con texto negro**.  Código: `css/menu.css` y `js/menu.js`, compartidos por todas las páginas.
- **Pila de secciones** a todo el ancho, separadas por líneas negras al 30%: Proyectos, Nosotros, Servicios, Noticias, Talento y Contacto. Al hacer scroll, cada sección se queda fija bajo la nav (sticky) y la siguiente se monta encima, hasta Contacto, que ocupa la pantalla y tapa a todas.
  - Si alguna sección no cabe en altura, el sticky se desactiva y el menú hace scroll normal.
  - En móvil no hay sticky.
- **Título** a la izquierda (columnas 1–4), en MAYÚSCULAS a 700: `clamp(40px, 4.6vw, 68px)`, 40 en móvil. **Contenido** a la derecha (columnas 5–12):
  - **Servicios:** las 8 áreas a 24/500 (20 entre 1200 y 1399), cada una con sus subservicios a 18/500 (16 entre 1200 y 1399) en negro al 62%. Son 4 columnas en desktop y 2 en tablet. En móvil solo se ven las áreas.
  - **Noticias:** 3 tarjetas (2 en tablet, 1 en móvil) con la imagen en 3:2. Titular y etiqueta con el mismo cuerpo que las áreas (24/500, 20 por debajo de 1400); la etiqueta, en negro al 62%.
  - **Talento:** «Trabaja con nosotros» y «Posiciones abiertas».
  - **Contacto:** email y teléfono a 24/500, más la dirección y las redes.
- **Página actual:** su título subrayado (grosor 0,06em, separación 0,1em), sin cambiar de color.
- **Entrada:** el texto sube desde abajo con máscara y las líneas se dibujan de izquierda a derecha (0,9 s), escalonado 70 ms por sección.
- **Hovers del sistema:**
  - Títulos y áreas: el gesto de Sectores, el resto pasa al 45%.
  - Subservicios: de atenuados a negro, como la ficha de caso.
  - Noticias: zoom 1.05 de la imagen.
  - Email y teléfono: subrayado.
- **Scroll:** suavizado propio y sutil (Lenis con `lerp` 0.14), sin rebote elástico al llegar al final.
- **Cierre:** con la hamburguesa, con Esc o con cualquier enlace. También **forzando el scroll al final**: la pila sube hasta 60 px y se apaga, y al pasar 260 px de rueda (o 140 px de arrastre en táctil) el menú se cierra. Solo cuenta un gesto nuevo ya en el final, tras una pausa de 180 ms o más, para que la inercia del trackpad al llegar no lo cierre.

### Hero
**Logo:**
- Tamaño inicial: `clamp(28vw, 300px, 520px)` en desktop (≈400 px a 1440) y `clamp(50vw, 160px, 260px)` en móvil.
- Alineado a la izquierda y centrado en vertical.
- Con el scroll se reduce hasta la nav; el recorrido termina al 75% del alto de pantalla.

**Frase:**
- En desktop, la frase va centrada en vertical y alineada a la izquierda, con su **borde izquierdo en el centro de la página** (50vw) y confinada a la mitad derecha.
- El cuerpo en desktop (peso 600) lo calcula `js/main.js` (`--claim-fs`): es el mayor con el que «Cambian los comportamientos.», la frase más larga del carrusel, cabe en una línea en esa mitad (tope `--t-claim`, 60 px). Se mide con la fuente real y se recalcula al redimensionar.
- La frase de cierre es más larga, así que salta a **dos líneas** («¿Por qué seguir» / «haciendo lo mismo?»); cada parte es indivisible y el conjunto sigue centrado en vertical.
- Por debajo de 1200 px va bajo el logo, en dos líneas.
- Funciona como un carrusel **continuo por palabras**: la frase sube y desaparece y la nueva sube desde abajo, con estos tiempos:
  - Cada cambio dura 520 ms con `cubic-bezier(.76,0,.24,1)`: acelera al salir y frena con ease al llegar.
  - Hay 30 ms de desfase entre palabras.
  - La pausa entre cambios es de solo 260 ms, para dar sensación de continuidad.
- **Cierre:**
  - «Cambian las reglas.» se queda 600 ms, solo algo más que las demás frases.
  - Después sale **por completo** (también «Cambian»). En cuanto termina de salir, tras 60 ms de respiro, sube «¿Por qué seguir haciendo lo mismo?»; en este paso no hay cruce de carrusel.
  - La frase de cierre se queda 3,5 s en pantalla, para digerirla.
  - La vuelta a «Cambian las tecnologías.» también es secuencial: sale la frase completa y después entra la nueva.
  - En los pasos secuenciales, la frase saliente se retira justo antes de añadir la entrante, cuando ya no se ve. Así no hay salto horizontal cuando la primera línea cambia de ancho («Cambian» ↔ «¿Por qué seguir»).

**Reel de fondo + scroll:**
- El vídeo y la frase son *sticky*.
- El desenfoque crece con el scroll: hasta 28 px en el vídeo y 12 px en la frase, que además pierde opacidad.
- El vídeo hace un zoom de 1 a 1,2.
- Cuando el texto del manifiesto llega al 55% del viewport, el vídeo se apaga (`--fade`, 550 ms) y el manifiesto pasa de blanco a negro.
- **Entrada temprana del manifiesto:** el espaciador del hero mide 75% del alto en desktop/tablet. Así el texto del manifiesto empieza a asomar sobre el reel con el primer scroll (~70 px), sin verse al cargar. En móvil el hero mantiene el 100% y el manifiesto pierde su alto mínimo y casi todo el margen superior (48 px), de modo que entra a ~50 px de scroll. El desenfoque y el apagado se calculan sobre la posición del texto, así que se adelantan con él.

### Manifiesto
- `text-wrap: balance`.
- «estrategia», «creatividad» y «tecnología» van subrayadas.
- Al hacer hover sobre una de ellas aparece encima su propio gif: un ciclo de imágenes cada 280 ms, de 3.4em en formato 3:2. En pantallas táctiles se activa al tocar la palabra.
- Ese mismo hover pinta **el fondo de toda la página** con un color de la paleta, en tono claro para que el texto negro siga leyéndose: estrategia → yellow `#ffd650`, creatividad → lilac `#ca9df1`, tecnología → sky `#93d4f2`. La transición dura 0,45 s.
- El color se guarda en `--page-tint` (en `<html>`) y lo usan el body y todas las secciones blancas (Proyectos, Sectores). Así, si asoma la sección siguiente, no se nota el corte.

### Proyectos · capas
El titular «Proyectos» es *sticky* (z-index 3) y pasa por encima de las tarjetas. El botón «Más proyectos» (z-index 4) queda por encima del titular cuando se cruzan.

### Tarjeta de proyecto
- Cliente (negro) y proyecto (`#666`) al **mismo tamaño y peso**, 24/600 (`--w-project`). Sin etiqueta de categoría.
- Hover: zoom suave de la imagen (`scale(1.05)`, 0,9 s). Sin formas y sin giro.

### Tarjeta de noticia
La misma tarjeta, más una línea de categoría en 16/400.

### Otros componentes
- **CTA circular:** círculo de 220 px (180 px en móvil) con el texto en 24/500 subrayado. En hover crece un 8%. Es coral en Proyectos y `#b9d7cf` en Noticias; ahí coincide con el fondo y el círculo no se distingue.
- **Sectores** (home): lista + tarjeta en el eje central, con la ocupación de Servicios.
  - Titular «SECTORES» a 108/700 con `.page-head`, como Proyectos y Noticias (hueco de 160 / 160 / 80 px). Sin padding superior: va pegada a Proyectos, que ya deja sus 200 px.
  - Lista a la izquierda, en las columnas 2–6, con la tipografía de lista (52/42/24, `--w-list`). Tarjeta cuadrada (1:1, dentro del margen) en las columnas 7–11: una columna libre a cada lado. En tablet, 1–6 / 7–12. En móvil, una columna: lista y debajo la tarjeta.
  - **Tarjeta:** fondo en el tono profundo y logos del sector en el tono claro (el par de la paleta; el hover a sangre de antes, ahora enmarcado). Yellow y stone llevan los logos en negro, porque sus dos tonos no tienen contraste (en stone, el «profundo» es el más claro: la tarjeta va en `#aeaeb2` y el tinte en `#c7c7cc`). Logos en rejilla según cuántos haya: 1, 2 en fila o 4 en 2×2. Al pie, el sector a 24/500 y `arrow_forward`, que avanza 6 px en hover. La tarjeta enlaza al sector activo (para el ratón; fuera del orden de tabulación).
  - **Hover / foco en un sector:** toda la página toma el tono claro (`--page-tint`, el mecanismo del manifiesto; Proyectos se tiñe con ella y no se ve el corte), el resto de la lista pasa a `rgba(0,0,0,.5)` y la tarjeta muestra ese sector. La lista y la tarjeta forman una sola zona: se puede ir del nombre a la tarjeta sin perder el sector.
  - **Cambio de sector:** el color cruza en 0,45 s y los logos entran con el gesto de los botones del hero (opacidad + 14 px + `blur(8px)`, 60 ms entre logos).
  - **En reposo:** página en blanco y lista en negro; la tarjeta rota sola cada 2,4 s mientras se ve. En táctil rota cada 1,8 s con lista y tinte. Con «reducir movimiento», no rota.
- **Franjas marquee:**
  - Logos: franja negra de 52 px. Ya no está en la home (se quitó la de antes y la de después de Sectores); la usa Clientes en Nosotros.
  - Newsletter (prefooter): franja coral `#ff5850` de 48 px con el texto «Inscríbete a nuestra newsletter — **El radar creativo**» y círculos blancos de 30 px.
- **Footer:** compacto, con etiquetas en píldora con contorno y enlaces subrayados.
- **Scroll:** Lenis (`lerp 0.09`) en toda la página.

### Iconos
Siempre de **Material Symbols Outlined** ([fonts.google.com/icons](https://fonts.google.com/icons)), nunca glifos de texto (→ ←) ni SVG sueltos.
- Se cargan desde Google Fonts solo los iconos que usa cada página, con `&icon_names=` en orden alfabético.
- Se escriben como `<span class="msi" aria-hidden="true">arrow_forward</span>`. La clase `.msi` está en `css/caso.css`, con relleno 0, peso 400 y `opsz` 48.
- En uso: `arrow_back` («← Proyectos»), `arrow_forward` («Arrastra», «Siguiente proyecto» y enlaces internos de la lista de empresas de Nosotros) y `arrow_outward` (enlaces externos de esa lista).

## 5. Sectores · paleta y logos
Los logos están en `assets/clients/`. También van embebidos en `js/logos.js` para que la máscara funcione abriendo el HTML en local (file://). **Si se añade o cambia un logo, hay que regenerar `js/logos.js`.**

| Sector | Paleta | Logos |
|---|---|---|
| Alimentación | yellow | San Miguel, Palacios, Pernod Ricard, Revolu Green |
| Retail | lilac | San Martín, BM |
| Deporte | sky | SD Eibar, Athletic Club |
| Educación | green | Elaienea, UPV/EHU |
| Cultura | peach | Euskadiko Orkestra |
| Moda | pink | Tuc Tuc |
| Industria | stone | GH Cranes, Timac |
| Turismo | yellow | Donostia San Sebastián |
| Ciencia y tecnología | lilac | Ikerbasque |

## 5b. Página de Proyectos (`proyectos.html`)
Los componentes son los de este sistema.

- **Nav:** sin hero, así que los botones son negros desde el principio. La página actual va en coral (`aria-current="page"`) y, en el menú, su título va subrayado.
- **Titular:** «PROYECTOS» a 108/700 dentro de `.page-head` (style.css): *sticky* en su propia posición (top = padding superior, 200 / 120 px en móvil) y la barra de filtros, 120 px más abajo (56 en móvil), lo arrastra hacia arriba al alcanzarlo. La barra no tiene margen superior: el hueco es el `::after` de `.page-head` (`--page-head-gap`). Igual en las dos vistas.
- **Barra:** categorías a la izquierda y «Cuadrícula / Listado» a la derecha, a 20/500 (18 en tablet, 16 en móvil). Sin números y sin línea separadora. Inactivo en `rgba(0,0,0,.5)` y activo en negro subrayado. En móvil, las categorías van en una fila con scroll lateral.
- **Cuadrícula:** la `.work__grid` de la home (12 columnas, 40/120). Las filas repiten el vocabulario 5·4·3 con sus proporciones; las dos primeras son exactamente las de la home. Tiene un parallax suave por columna (amplitud máxima de 40 px, así que las filas no se pisan) y la primera fila arranca alineada.
- **Listado:** agrupado por sectores, en el mismo orden que la lista de Sectores de la home.
  - El nombre del sector usa la tipografía de esa lista: 52/42/24, peso 500.
  - Las filas son como el pie de tarjeta: cliente en negro y proyecto en `#666`, 24/600 (`--w-project`), en las columnas 1–4 y 5–9. Sin líneas ni iconos; solo el candado en los casos protegidos.
  - **Hover** (el mismo gesto que el manifiesto y Sectores): toda la página se tiñe con el color claro del sector (`--page-tint`). Las demás filas y sectores pasan a `rgba(0,0,0,.5)`. Aparece la imagen del proyecto en 4:5, en las 3 últimas columnas, con la entrada de los gifs del manifiesto (escala .6 → 1). Sigue al cursor en vertical, con suavizado.
  - Si la fila tiene ficha, el proyecto se subraya.
  - En táctil y en móvil no hay imagen; las filas se apilan (cliente encima del proyecto).
  - Una banda del color de la página, bajo la nav, tapa el texto que pasa por debajo.
- **Casos protegidos:** un diálogo negro con un input subrayado y el botón en coral.
- **Datos:** `js/proyectos-data.js`. Estado en la URL: `?categoria=branding&vista=index#sector-cultura`. Los enlaces de Sectores de la home abren el Listado en su sector.

## 5c. Ficha de caso (`brutus.html`)
Componentes de este sistema. Archivos: `css/caso.css` y `js/caso.js`. Las imágenes están en `assets/case-<cliente>/`.

- **Color del caso:** `--case-c` y `--case-c-deep` en el `<body>`, con el par de la paleta del sector (Alimentación → yellow). Solo se usan en el tinte de la cita.
- **Cabecera:**
  - «← Proyectos» en el estilo de la nav, en `#666`.
  - La marca va en MAYÚSCULAS 900 a `clamp(64px, 14vw, 240px)` (≈200 px a 1440), alineada a la izquierda. `data-fit` compensa el aire lateral de la primera letra para que la tinta quede en el margen. Las letras suben desde abajo al cargar (900 ms, la curva del claim, 45 ms de desfase).
  - Debajo hay dos columnas. A la izquierda (columnas 1–6): el titular a 64/500 con interlineado 1.1, alineado a la izquierda y sin sangría (48 en tablet, 32 en móvil). A la derecha (columnas 7–12): la ficha (Servicios / Sector) como texto, sin píldoras, a 24/500 (22 en tablet, 18 en móvil). Las etiquetas «Servicios» y «Sector» van en negro y en tipo frase; los valores (Branding, Comunicación, Alimentación), en gris `#666`, y pasan a negro en hover.
- **Contenido:** literal del documento del caso . No se añaden textos que no estén en él.
- **Imagen principal:** dentro del margen. Se asienta con el scroll (`scale` 1.12 → 1).
- **Bloques narrativos:**
  - Sin líneas separadoras. Arriba, el índice en una píldora negra de 46 px con el número a 16/500, y a su lado el eyebrow en MAYÚSCULAS a 24/500 (20 en tablet, 16 en móvil).
  - Título a 52/500 en las columnas 1–6 (42 en tablet, 28 en móvil) y cuerpo a 24/500 con interlineado 1.4 desde la columna 7 (22 en tablet, 18 en móvil).
  - 200 px entre bloques y 120 px entre un bloque y su imagen (160/96 en tablet y 112/56 en móvil).
- **Cita / plataforma:** el final literal del párrafo de «La solución», compuesto como statement a 64/500 y centrado. Mientras cruza el centro de la pantalla, toda la página toma `--case-c` a través de `--page-tint` (el mismo mecanismo que el manifiesto).
- **Imágenes en retícula:**
  - El par 6+6 va en 4:5 y la columna derecha empieza 160 px más abajo.
  - El trío 4+4+4 va en 3:4.
  - Cada columna lleva su parallax (`data-par` = amplitud en px). Solo en desktop y tablet.
- **Galería digital:** carrusel a sangre que avanza solo a 36 px/s. Se arrastra con inercia y responde a las flechas del teclado. Con ratón, el cursor es un círculo coral de 120 px con «Arrastra» (el lenguaje del CTA circular).
- **Siguiente proyecto:** franja negra, todo en tipo frase (sin mayúsculas forzadas). La etiqueta «Siguiente proyecto» va al cuerpo del copy (24/500) al 50% de blanco. El cliente va a 64/500 en blanco y el proyecto a 64/500 al 50% de blanco (48 en tablet y 32 en móvil), con interlineado 1. Los dos forman un solo bloque, centrado en vertical con la flecha. La flecha es `arrow_forward` a 200 px (140 en tablet, 72 en móvil), con la punta en el margen. En hover asoma la imagen del caso, oscurecida, y la flecha avanza; los tamaños no cambian. Enlaza al siguiente caso **con ficha** (`url`) de `js/proyectos-data.js`.
- **Más proyectos:** la `.work` de la home con el titular de `.page-head` (quieto en su posición; las tarjetas lo empujan hacia arriba, como «Nosotros» con su frase; hueco 160 / 80 px) y 4 tarjetas iguales de 3 columnas e imagen en 4:3 (2 por fila en tablet y 1 en móvil). Prioriza el mismo sector y el mismo servicio, pone primero los casos con ficha y no repite cliente.
- **Nueva ficha:** copiar `brutus.html` y cambiar `data-case` y `--case-c` en el `<body>`, los textos y las imágenes. El caso debe tener `url` en `js/proyectos-data.js`.

## 5d. Nosotros (`nosotros.html`)
Componentes de este sistema. Carga `css/caso.css` + `js/caso.js` (bloques, cita con tinte, galería, reveal, vídeos perezosos) y añade `css/nosotros.css` + `js/nosotros.js`. Fotos en `assets/nosotros/` y `assets/team/`, logos del grupo en `assets/brand/group/`, vídeo en `assets/video/grupo-acc-montaje.*`.

- **Nav:** «Nosotros» no tiene botón en la nav; en el menú, su título va subrayado (`aria-current="page"`).
- **Intro:**
  - «NOSOTROS» a 108/700, centrado, con el mismo `.page-head` que «PROYECTOS»: quieto en su posición hasta que la frase (160 / 120 / 80 px más abajo) lo arrastra.
  - Frase al cuerpo del manifiesto (64/600, `.statement__text`). «comunicación», «estrategia de marca» y «marketing digital» van subrayadas, con gif de fotos del estudio y tinte de página: lilac, yellow y sky (estrategia siempre en yellow, como en la home).
  - Índice de anclas (Grupo ACC · Valores · Personas · Clientes) con la tipografía de la barra de Proyectos (20/18/16, peso 500), en negro y subrayado en hover.
- **La agencia:** la galería «Arrastra» de la ficha de caso con las fotos del estudio (verticales, `clamp(300px, 38vw, 560px)` de alto). Con `data-reel-scroll`, el scroll de la página empuja la galería y, al subir, invierte el sentido.
- **Desde 1990:** la cita de la ficha de caso, con «desde 1990» subrayado. Al cruzar el centro, la página se tiñe con `--case-c` = `--c-acc-pink`, y el tinte se mantiene durante el párrafo de continuación (columnas 7–12) hasta que Grupo ACC llega al centro (`data-tint-until="#grupo-acc"` en la cita; lo lee `js/caso.js`).
- **Secciones 01–04** (Grupo ACC, Valores, Personas, Clientes): bloques narrativos de la ficha (píldora + eyebrow, título 52/500 en las columnas 1–6, cuerpo 24/500 desde la 7). La parte secundaria del título y del cuerpo va en `#666` (el par negro/gris de las tarjetas).
- **Grupo ACC:** el bloque narrativo y, debajo, el módulo de Sectores de la home: lista + tarjeta cuadrada en las columnas 2–6 / 7–11 (1–6 / 7–12 en tablet, una columna en móvil).
  - Lista: «Empresas de Grupo ACC» a 24/500 en `#666` y, debajo, los nombres con la tipografía de lista (52/42/24, `--w-list`).
  - Tarjeta: en reposo es Grupo ACC (negro con el logo blanco), sin enlace hasta tener su URL. Con una empresa activa toma el color de su marca y su logo: negro sobre coral (ACC, ACC Experience, ACC Ecommerce) y blanco sobre lila (Lurnova) y azul (SolidKey). Al pie, el nombre y la flecha: `arrow_forward` para ACC y `arrow_outward` para las externas. Enlaza a la empresa activa.
  - Hover / foco: la página toma la marca al 30% sobre blanco (`--page-tint`), el resto de empresas pasa al 50% y el logo entra con el gesto de los botones del hero. Al salir, vuelve Grupo ACC. En táctil, las empresas rotan cada 1,8 s mientras el módulo está en pantalla.
  - La URL de ACC Experience está pendiente y Grupo ACC no se lista hasta tenerla.
- **Valores:** lista en las columnas 1–8, con el número en `#666` a 24/500, el título a 42/500 (`--t-value`: 42 en desktop y tablet, 24 en móvil; interlineado 1.15) y el texto a 24/500. 120 px entre valores (96/56).
  - El valor que cruza el centro de la pantalla queda en negro y el resto al 50%.
  - A la derecha, en las columnas 10–12, una foto sticky en 4:5 que cambia con el valor activo (fundido + `scale` 1.06 → 1).
  - En móvil no hay foto. Sin JS, todo se ve en negro.
- **Personas:** la tarjeta del sistema con foto 3:4 sobre `#f2f2f2`. Nombre en negro y cargo en `#666`, a 20/18/16 y peso 500.
  - 6 por fila en desktop, 4 en tablet y 2 en móvil; 64 px entre filas.
  - Hover: zoom 1.05 y el fondo de la foto (recortada) toma un color claro de la paleta, en ciclo: yellow, lilac, sky, green, peach y pink.
- **Clientes:** bloque narrativo, la franja negra de logos de la home a sangre y el CTA circular coral «¿Hablamos?», como en Proyectos.

## 5e. Servicios (`servicios.html`)
Contenido: la **opción de servicios aprobada** (sin Producción IA). E-commerce no tiene especialidades en esa opción: provisionalmente van unas de muestra. Carga `css/caso.css` + `js/caso.js` (píldora, cita, reveal, parallax, vídeos perezosos) y añade `css/servicios.css` + `js/servicios.js`. Vídeos en `assets/video/servicios-*` (placeholders de ACC 3 C).

- **Nav y menú:** sin botón propio en la nav; «Servicios» en coral en el menú. En esta página, el menú lista los servicios aprobados y enlaza a sus anclas.
- **Intro:** «SERVICIOS» a 108/700 con `.page-head` (hueco de 120 / 120 / 56 px). Debajo, índice de los 7 servicios con la tipografía de Sectores (52/42/24, `--w-list`), centrado, sin números ni líneas.
  - Hover / foco: el resto pasa a `rgba(0,0,0,.5)` (solo CSS). Sin tinte de página y sin imagen.
- **Color:** un solo color para todos los servicios, peach `#f3c6b1` (`data-svc-tint` en `.svc-page`). Cuando Branding llega al centro de la pantalla, toda la página toma ese color (`--page-tint`, el mecanismo de Valores) y lo mantiene hasta que Mkt. Digital sale del centro; antes y después, blanco.
- **Bloques de servicio:** contiguos (100 px de padding arriba y abajo = 200 px entre contenidos), así el color no se corta entre uno y otro.
  - Texto y vídeo agrupados en el eje central: el texto termina en el centro de la página y el vídeo arranca en él, con 2 columnas libres a cada lado (1 en tablet).
  - Texto en las columnas 3–6 (2–6 en tablet): píldora negra con el índice (01–07) en la misma línea que el nombre (64/500, `--t-statement`, lh 1.1; 24 px entre ambos). La píldora cuelga a la izquierda de la columna, de modo que el nombre se alinea con la lista; en móvil va en el flujo, a 12 px, especialidades a 24/500 con lh 1.4 (cuerpo de bloque) y 0.5em entre una y otra y el enlace «Ver proyectos de …» a 20/18/16, peso 500, con `arrow_forward`: en hover se subraya solo el texto (la flecha no) y la flecha avanza 6 px.
  - Cada especialidad es un enlace a `servicio-<servicio>.html#<especialidad>` (páginas pendientes; mismas anclas que el menú). En hover / foco, el resto de la lista pasa a `rgba(0,0,0,.5)`. Enlaza a `proyectos.html?categoria=<servicio>`.
  - Vídeo en las columnas 7–10 (7–11 en tablet) dentro de `.case-media__frame`, siempre en 4:5, con parallax de 40 px. Fondo de carga `rgba(0,0,0,.06)`.
  - Separaciones: 56 px nombre → lista → enlace (40 en tablet, 24 en móvil). En móvil, una columna: texto y después el vídeo.
- **Cierre:** la cita de la ficha (64/500, centrada) con la frase del texto de la home, «Nunca la de siempre» subrayado, sin tinte. Después, el CTA circular coral «¿Hablamos?», la franja y el footer.

## 5f. Especialidad de servicio (`servicio-estrategia-de-marca.html`)
Último nivel: Servicios → Branding → Estrategia de marca. Es la plantilla para el resto de especialidades (`servicio-<especialidad>.html`). No añade componentes: combina los de Servicios, Nosotros y la ficha. Carga:
- `caso.css` y `caso.js`.
- `servicios.css` y `servicios.js`: cabecera de bloque y tinte del tramo.
- `nosotros.js`: pase de fotos y tinte de la palabra subrayada.
- `css/subservicio.css`: solo la colocación.

Sin imágenes propias: no se cuenta con material por especialidad.

- **Copy provisional:** solo se dispone de los nombres; los textos son provisionales.
- **Intro (centrada, con el criterio de Servicios y Nosotros):**
  - El servicio padre y el titular van juntos y *sticky* dentro del `.page-head` (`.sub-head__stick`). Quedan quietos a 128 px (96 en móvil) hasta que la frase, 160 / 120 / 80 px más abajo, los alcanza y los arrastra.
  - **Servicio padre:** píldora con su índice en Servicios (01) + nombre a 24/500 (la cabecera de bloque). Enlaza a `servicios.html#branding`; en hover se subraya el nombre.
  - **Titular:** 108/700 con `text-wrap: balance`.
  - **Frase:** al cuerpo del manifiesto (64/600). «tu marca» va subrayado, sin partirse, con pase de fotos de proyectos de Branding y tinte yellow (estrategia siempre en yellow).
- **Fases (Cómo lo hacemos):** la ocupación de los bloques de Servicios.
  - Bloques contiguos (100 px de padding: 200 px entre contenidos), agrupados en el eje central con 2 columnas libres a cada lado (1 en tablet).
  - Píldora colgada (01–04) + título a 52/42/28 (título de bloque) en las columnas 3–6 (2–6 en tablet). La píldora va centrada en vertical con el título y este reparte sus líneas con `text-wrap: balance`. El título tiene una medida máxima de 10em, para que ocupe siempre 2 líneas o más.
  - Texto a 24/500, interlineado 1.4, en las columnas 7–10 (7–11 en tablet), donde Servicios pone el vídeo.
  - En móvil, una columna.
  - Mientras cruzan el centro, la página toma peach (`data-svc-tint` + `data-svc`, el mismo color que en Servicios).
- **Cierre:** la cita (64/500, centrada) con la segunda frase de la entradilla, sin tinte, y el CTA circular coral «¿Hablamos?», como el cierre de Servicios.
- **Siguiente especialidad:** la franja negra de «Siguiente proyecto». La especialidad va en blanco y el servicio al 50%. Lleva a la siguiente especialidad del mismo servicio (Naming, página pendiente).
- **Proyectos:** «Más proyectos» de la ficha, con titular sticky y 4 tarjetas del servicio (3 columnas, 4:3), más el círculo coral «Proyectos de Branding» → `proyectos.html?categoria=branding`.
- **Enlaces:** en Servicios y en los menús de todas las páginas, «Estrategia de marca» enlaza ya a esta página.

## 5g. Noticias (`noticias.html`)
La sección Noticias de la home a página completa. No añade componentes. Archivos: `css/noticias.css` (colocación), `js/noticias-data.js` (datos, compartidos con la noticia) y `js/noticias.js`. Además carga `caso.css`/`caso.js` (Lenis, reveal, `.msi`) y `servicios.css` (enlace con flecha).

- **Contenido provisional:** textos e imágenes de muestra, solo para la maqueta.
- **Fondo:** `.news` de la home (`#dae8e4`). La imagen carga sobre `rgba(0,0,0,.06)`, la etiqueta va al 60 % y el CTA en `#b9d7cf`.
- **Nav y menú:** sin botón propio en la nav. En el menú, «Noticias» va subrayado.
- **Titular:** «NOTICIAS» a 108/700 con `.page-head`, como Proyectos. Queda quieto hasta que la destacada lo arrastra (hueco de 120 px; 56 en móvil).
- **Destacada:** la primera noticia (o la que lleve `featured: true`).
  - Es una `.card`, con zoom 1.05 en hover.
  - Imagen 1:1 en las columnas 1–6. Desde la 7, alineado abajo como la lista de Grupo ACC, va el texto:
    - etiqueta a 24/500 al 60 %;
    - titular a 52/500 (`--t-case-title`);
    - entradilla a 24/500 con interlineado 1.4;
    - «Leer noticia» con `arrow_forward` (`.svc__more`). En hover se subraya el texto y la flecha avanza.
  - En móvil, una columna.
- **Dos filas:** las 6 siguientes con la tarjeta de noticia de la home (título 24/500 + etiqueta 16/400), 3 por fila (2 en tablet, 1 en móvil). La separación entre filas es `--row-gap`.
- **Listado:** el resto, con la lista de Ofertas activas de Talento a todo el ancho y líneas al 30 %.
  - Titular a 42/500 (`--t-value`) en las columnas 1–6.
  - Categoría a 24/500 al 60 % en las columnas 7–9.
  - Donde Talento pone la flecha, una imagen pequeña en 4:3 (columnas 11–12).
  - Hover: el titular se subraya, la imagen hace zoom y el resto de filas pasa al 50 %.
  - En móvil: titular y categoría apilados, con la imagen de 96 px a la derecha.
- **Cargar más:** CTA circular en `#b9d7cf`. Muestra 5 filas más cada vez, con el reveal del sistema escalonado 70 ms; se oculta cuando no quedan. El foco pasa a la primera fila nueva y se anuncia a lectores de pantalla.

## 5h. Noticia (`noticia.html?slug=…`)
Plantilla única: el contenido llega de `js/noticias-data.js` según el `slug` (`js/noticia.js`). Sin `slug` muestra la más reciente; con un `slug` desconocido vuelve a Noticias. Carga `caso.css`/`caso.js`, `talento.css` (`.job-list`) y `noticias.css`. Rellena el título, la descripción y los datos estructurados `NewsArticle`.

- **Cabecera:** la de la ficha de caso sin la marca.
  - «← Noticias».
  - Titular a 64/500 (`--t-case-head`) en las columnas 1–6.
  - Desde la columna 7, la ficha: «Categoría» y «Publicada», con la fecha y los minutos de lectura como dos valores (igual que «Servicios» en la ficha).
- **Cuerpo:** la foto sticky de Valores en las columnas 1–6 (1:1 por defecto, `ar` para cambiarla; se asienta con `data-settle`). Desde la columna 7:
  - entradilla a 42/500 (`--t-value`);
  - párrafos a 24/500 con interlineado 1.4 (cuerpo de bloque);
  - secciones (`{ h2 }`) a 42/500;
  - listas (`{ ul }`) con `.job-list`.
  - En móvil, una columna y la foto deja de ser sticky.
- **Cita (opcional, `quote`):** la cita de la ficha (64/500, centrada) con el final literal del texto y su parte subrayada. Mientras cruza el centro, la página toma el color de la categoría:

  | Categoría | Color |
  |---|---|
  | Dentro de ACC | acc-pink |
  | Experience & Eventos | pink |
  | Equipo & Formación | lilac (el de Talento) |
  | Tendencias & Cultura | peach (Cultura) |
  | IA & Tecnología | sky (tecnología) |
  | Marcas & Proyectos | yellow (estrategia) |

- **Siguiente noticia:** la franja negra de «Siguiente proyecto», con el titular en blanco y la categoría al 50 %. Sigue el orden del listado.
- **Más noticias:** la sección `.news` de la home, con el titular sticky («Más noticias», hueco de 160 / 80 px) y 4 tarjetas: primero las de la misma categoría y después las más recientes. Cierra con el círculo «Todas las noticias».
- **Nueva noticia:** añadir una entrada al principio de `items` en `js/noticias-data.js` con una imagen cuadrada en `assets/news/`.

