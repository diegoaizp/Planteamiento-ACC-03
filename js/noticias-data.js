/* =========================================================================
   ACC 6 BOLD — Noticias · datos
   Lo usan noticias.html (js/noticias.js) y noticia.html (js/noticia.js).
   CONTENIDO DE MUESTRA: textos e imágenes provisionales.

   · Orden: de la más reciente a la más antigua. La primera es la destacada,
     salvo que otra lleve featured: true.
   · Cada noticia: slug (noticia.html?slug=…), title, cat (clave de CATS), date,
     read, image + alt (cuadradas), ar opcional (proporción de la imagen en la
     noticia, 1 / 1 por defecto), lead (entradilla), body (párrafos; { h2 } y { ul } para
     secciones y listas) y quote opcional: el final literal del texto,
     compuesto como la cita de la ficha. hl = la parte subrayada.
   · CATS: nombre y color de cada categoría. El color (tono claro de la
     paleta) solo tiñe la página mientras la cita cruza el centro.
   ========================================================================= */
window.ACC_NEWS = {
  cats: {
    'dentro-de-acc':        { name: 'Dentro de ACC',        tint: 'var(--c-acc-pink)' },
    'experience-eventos':   { name: 'Experience & Eventos', tint: 'var(--c-pink)' },
    'equipo-formacion':     { name: 'Equipo & Formación',   tint: 'var(--c-lilac)' },
    'tendencias-cultura':   { name: 'Tendencias & Cultura', tint: 'var(--c-peach)' },
    'ia-tecnologia':        { name: 'IA & Tecnología',      tint: 'var(--c-sky)' },
    'marcas-proyectos':     { name: 'Marcas & Proyectos',   tint: 'var(--c-yellow)' },
  },

  items: [
    {
      slug: 'acc-nueva-etapa',
      title: 'ACC estrena una nueva forma de contar lo que viene',
      cat: 'dentro-de-acc', date: '2026-10-28', read: 3,
      image: './assets/news/nueva-etapa.webp',
      alt: 'Botella de cristal con etiqueta azul flotando sobre un cielo despejado',
      lead: 'ACC abre una nueva etapa con una identidad que pone en primer plano su manera de trabajar: conectar estrategia, creatividad y tecnología para dar respuesta a los retos de las marcas.',
      body: [
        'Un sistema visual más flexible y una web más editorial permiten mostrar tanto los proyectos como las ideas que los hacen posibles. La evolución parte de una premisa clara: las marcas ya no viven en soportes aislados, sino en ecosistemas vivos donde cada punto de contacto cuenta.',
        'La nueva expresión de marca nace de una pregunta compartida: cómo seguir evolucionando sin perder lo que nos mueve. La respuesta se traduce en un lenguaje directo, una mirada curiosa y más espacio para enseñar el proceso detrás de cada decisión estratégica y creativa.',
      ],
      quote: { text: 'Seguimos entendiendo cada proyecto como una oportunidad para cuestionar lo aprendido y encontrar la respuesta adecuada.', hl: 'Nunca la de siempre.' },
    },
    {
      slug: 'acc-timac-agro-fruit-attraction',
      title: 'Diseño y producción del stand de TIMAC AGRO en Fruit Attraction',
      cat: 'experience-eventos', date: '2026-10-14', read: 4,
      image: './assets/news/timac-agro.webp',
      alt: 'Retícula de vacas en miniatura sobre fondo verde, una de ellas con textura de colores',
      lead: 'Acompañamos a TIMAC AGRO España en Fruit Attraction (IFEMA Madrid) con el diseño integral, la producción y la coordinación de su espacio ferial.',
      body: [
        'TIMAC AGRO es un referente en nutrición vegetal y animal, con una apuesta constante por la innovación aplicada al sector agroalimentario. En ACC llevamos más de tres años trabajando junto a ellos, dándoles soporte continuo en diferentes ámbitos de la comunicación corporativa y de producto.',
        'Esta vez, nuestra colaboración con TIMAC AGRO España nos ha llevado hasta Fruit Attraction (IFEMA MADRID), donde nos hemos encargado del diseño y producción de su stand: un espacio pensado para presentar sus iniciativas, dar a conocer sus soluciones biotecnológicas y reunir a los agentes clave de la agroindustria.',
        'Además del diseño espacial y gráfico, hemos coordinado y supervisado su presencia durante toda la feria, contribuyendo al buen desarrollo de las activaciones previstas y trabajando codo con codo junto a su equipo.',
      ],
    },
    {
      slug: 'acc-formacion-equipo',
      title: 'Dedicamos tiempo a aprender y seguir creciendo como equipo',
      cat: 'equipo-formacion', date: '2026-09-30', read: 3,
      image: './assets/news/formacion.webp',
      alt: 'Mano sujetando un móvil con una interfaz de puntuación en colores',
      lead: 'Celebramos tres nuevas sesiones internas sobre Seguridad de la Información, Generación Z y evolución de las Redes Sociales impartidas por especialistas de nuestro propio equipo.',
      body: [
        'La semana pasada dedicamos tiempo a parar, compartir y seguir creciendo como equipo. En ACC hemos impartido tres sesiones de formación —sobre Seguridad de la Información, Generación Z y Redes Sociales— con contenidos dirigidos a reforzar nuestros conocimientos y perfeccionar nuestro trabajo y procesos diarios.',
        'Entre los temas tratados hemos profundizado en la concienciación en Seguridad de la Información tras obtener la certificación ISO 27001 para mantener las buenas prácticas en nuestro día a día; en la Generación Z para entender sus códigos, hábitos y formas de consumo; y en la evolución, tendencias, nuevos formatos y claves de las Redes Sociales para comunicar mejor.',
        'Además, las sesiones de Generación Z y Redes Sociales han sido impartidas por compañeras de los departamentos de Estrategia y Social, compartiendo así aprendizajes reales y criterio aplicado con el resto de la agencia.',
      ],
    },
    {
      slug: 'acc-radar',
      title: 'Radar ACC: señales de hoy para imaginar las marcas de mañana',
      cat: 'tendencias-cultura', date: '2026-09-17', read: 5,
      image: './assets/news/radar.webp',
      alt: 'Joystick naranja iluminado sobre fondo azul oscuro',
      lead: 'Presentamos una nueva edición de Radar ACC, nuestro observatorio mensual para detectar los cambios que están transformando la comunicación, el diseño y los negocios digitales.',
      body: [
        'Radar ACC nace como una selección editorial que conecta señales culturales, comportamientos emergentes y nuevas posibilidades tecnológicas. No buscamos recopilar titulares efímeros, sino leer las corrientes de fondo que afectan a cómo las personas eligen y se relacionan con las marcas.',
        'Esta entrega explora la búsqueda de experiencias más humanas en un entorno cada vez más automatizado: desde el nuevo valor de lo tangible y lo presencial hasta las comunidades que se construyen alrededor de intereses compartidos fuera de los grandes algoritmos.',
        'Cada señal se acompaña de una pregunta accionable para las marcas. El objetivo es abrir conversaciones útiles con nuestros clientes y encontrar nuevos puntos de partida estratégicos.',
      ],
    },
    {
      slug: 'geo-visibilidad-buscadores-ia',
      title: 'De SEO a GEO: cómo posicionar tu marca en las respuestas de la IA generativa',
      cat: 'ia-tecnologia', date: '2026-09-03', read: 4,
      image: './assets/news/geo-ia.webp',
      alt: 'Letras «Ai» formadas por píxeles de colores sobre fondo negro',
      lead: 'La búsqueda tradicional convive ya con motores conversacionales que sintetizan respuestas. Analizamos cómo estructurar contenidos y autoridad semántica para que las marcas sean citadas.',
      body: [
        'El comportamiento de búsqueda está viviendo su mayor transformación en dos décadas. Los usuarios ya no solo consultan listados de enlaces: formulan preguntas complejas a asistentes generativos que comparan opciones, resumen argumentos y recomiendan marcas directamente.',
        'En ACC abordamos el Generative Engine Optimization (GEO) como una evolución natural del SEO técnico y de contenidos: trabajar la claridad de entidades, los datos estructurados, la autoridad en fuentes de terceros y la profundidad temática que los modelos priorizan al construir una respuesta.',
      ],
      quote: { text: 'No se trata de escribir para máquinas, sino de construir activos digitales con', hl: 'criterio experto', after: ', fuentes verificables y una arquitectura de información impecable.' },
    },
    {
      slug: 'sistemas-identidad-vivos-rebranding',
      title: 'Sistemas visuales vivos: por qué un manual de marca ya no cabe en un PDF estático',
      cat: 'marcas-proyectos', date: '2026-08-20', read: 4,
      image: './assets/news/identidad.webp',
      alt: 'Ilustración de manos de colores que sostienen un lápiz y un cubo',
      lead: 'Las identidades contemporáneas necesitan adaptarse en tiempo real a entornos digitales, movimiento, espacio físico y generación asistida de activos sin perder coherencia.',
      body: [
        'Durante años, el entregable final de un proyecto de branding fue un documento cerrado pensado para vigilar el uso correcto de un logotipo. Hoy los equipos de marketing trabajan a una velocidad que exige herramientas vivas, accesibles y modulares.',
        'En nuestros proyectos de identidad diseñamos sistemas tipográficos, cromáticos y de layout que funcionan como un lenguaje compartido: desde tokens de diseño para producto digital hasta pautas de movimiento y Brand Centers interactivos.',
      ],
      quote: { text: 'Cuando las reglas están bien pensadas desde la estrategia, la flexibilidad no diluye la marca:', hl: 'multiplica su capacidad de expresarse', after: ' con voz propia en cada canal.' },
    },
    {
      slug: 'radar-acc-comunidades-microculturas',
      title: 'Radar ACC #08: el retorno de lo táctil y las microcomunidades frente al ruido algorítmico',
      cat: 'tendencias-cultura', date: '2026-07-22', read: 5,
      image: './assets/news/comunidades.webp',
      alt: 'Ilustración de una figura diminuta entre grandes flores rojas y naranjas',
      lead: 'Analizamos por qué las audiencias más jóvenes están premiando los formatos lentos, los clubes presenciales y las publicaciones impresas como espacios de pertenencia.',
      body: [
        'Cuanto más inmediata y sintética se vuelve la producción de contenidos digitales, mayor valor adquiere todo aquello que demuestra cuidado, tiempo y presencia física. Lo vemos en el auge de los clubes de lectura y running, las ediciones cuidadas en papel y los eventos de pequeño formato.',
        'Para las marcas, esta señal plantea un cambio de enfoque importante: pasar de interrumpir audiencias masivas a facilitar espacios de encuentro genuinos donde aportar utilidad o cultura compartida.',
        'En este número del Radar ACC repasamos cinco casos internacionales que están convirtiendo la cercanía y el oficio editorial en su principal ventaja competitiva.',
      ],
    },
    {
      slug: 'ecommerce-b2b-conversion-cro',
      title: 'Arquitectura e-commerce y CRO: pequeñas fricciones que deciden grandes resultados de negocio',
      cat: 'marcas-proyectos', date: '2026-07-08', read: 4,
      image: './assets/news/ecommerce.webp',
      alt: 'Monitor sobre un escritorio con una plataforma web abierta',
      lead: 'Más tráfico no siempre significa más ventas. Revisamos nuestra metodología de optimización continua para plataformas de venta B2C y B2B.',
      body: [
        'En muchas tiendas online, el crecimiento sostenido no depende de duplicar la inversión publicitaria, sino de eliminar los obstáculos invisibles que frenan al usuario entre el descubrimiento de un producto y la confirmación del pedido.',
        'Combinando analítica cuantitativa, mapas de comportamiento, velocidad de carga e integración limpia con ERP y CRM, nuestros equipos de E-commerce y CRO diseñan mejoras iterativas que impactan directamente en la tasa de conversión y el ticket medio.',
      ],
      quote: { text: 'La experiencia de compra es hoy una de las expresiones más directas de', hl: 'la promesa de una marca', after: '.' },
    },
    {
      slug: 'produccion-audiovisual-ia-direccion-arte',
      title: 'Producción audiovisual con IA: cuando el criterio creativo dirige a la herramienta',
      cat: 'ia-tecnologia', date: '2026-06-24', read: 4,
      image: './assets/news/ia-direccion-arte.webp',
      alt: 'Ilustración de una mano que señala un mapa de colores',
      lead: 'Cómo integramos flujos generativos en la conceptualización, el desarrollo visual y la adaptación de campañas manteniendo una dirección de arte rigurosa.',
      body: [
        'Las herramientas de generación de imagen y vídeo avanzan cada semana, pero la diferencia entre un resultado genérico y una pieza memorable sigue estando en el mismo lugar de siempre: la idea, la sensibilidad estética y la dirección de arte.',
        'En ACC utilizamos flujos híbridos que combinan fotografía, diseño gráfico tradicional, edición y modelos generativos controlados para prototipar universos visuales, producir activos a medida y escalar campañas multiformato con agilidad.',
      ],
      quote: { text: 'La tecnología amplía el abanico de lo posible;', hl: 'el criterio humano', after: ' decide qué merece ser contado y cómo debe sentirse.' },
    },
    {
      slug: 'stands-ferias-experiencia-marca',
      title: 'Del metro cuadrado al recuerdo de marca: claves para diseñar espacios efímeros que conectan',
      cat: 'experience-eventos', date: '2026-06-10', read: 3,
      image: './assets/news/eventos.webp',
      alt: 'Auditorio a oscuras con el público frente a una gran pantalla',
      lead: 'Un stand o un evento corporativo es una historia caminable. Compartimos cómo abordamos el diseño espacial y la producción integral desde nuestro equipo de Experience.',
      body: [
        'En un pabellón ferial lleno de estímulos visuales, captar la atención en los primeros tres segundos es tan importante como ofrecer un recorrido cómodo y memorable para quien decide entrar a conversar.',
        'Desde la arquitectura efímera, la iluminación y los materiales hasta los contenidos audiovisuales interactivos y la hospitalidad en directo, concebimos cada espacio como una extensión física de la identidad de la marca.',
        'Controlar todo el proceso —desde el concepto creativo hasta el montaje y la coordinación en feria— nos permite cuidar cada detalle sin sorpresas de última hora.',
      ],
    },
    {
      slug: 'certificacion-iso-27001-seguridad',
      title: 'Renovamos nuestro compromiso con la seguridad de la información bajo el estándar ISO 27001',
      cat: 'equipo-formacion', date: '2026-05-27', read: 3,
      image: './assets/news/iso-27001.webp',
      alt: 'Texto «Bravery is earned» en azul sobre fondo negro',
      lead: 'Junto a Solidkey dentro de Grupo ACC, consolidamos nuestros protocolos de confidencialidad, protección de activos digitales y cultura de ciberseguridad.',
      body: [
        'Trabajar con marcas líderes en industria, alimentación, retail, deporte e instituciones exige mucho más que talento creativo y capacidad técnica: requiere una confianza absoluta en cómo gestionamos la información y los sistemas de cada proyecto.',
        'La certificación ISO 27001 respalda un sistema de gestión de seguridad de la información auditado y presente en cada fase de nuestro trabajo diario, desde el desarrollo web y e-commerce hasta la gestión de datos y campañas.',
        'Contar además con Solidkey como firma hermana especializada en ciberseguridad dentro de Grupo ACC refuerza nuestra solidez técnica en cada entrega.',
      ],
    },
    {
      slug: 'social-media-creadores-marcas',
      title: 'Más allá del alcance: construir relevancia cultural en redes sociales desde la estrategia',
      cat: 'tendencias-cultura', date: '2026-05-13', read: 4,
      image: './assets/news/redes-sociales.webp',
      alt: 'Ilustración de un hombre con bigote sobre fondo turquesa',
      lead: 'Por qué las marcas que mejor conectan en social media no son las que persiguen cada audio viral, sino las que construyen un territorio propio y reconocible.',
      body: [
        'El feed nunca había estado tan saturado de estímulos ni los usuarios habían desarrollado un radar tan fino para detectar cuándo una marca intenta forzar un código que no le pertenece.',
        'Nuestro equipo de RRSS y creación de contenidos trabaja sobre pilares narrativos claros, formatos nativos pensados para cada plataforma y colaboraciones con creadores que comparten valores reales con la marca.',
        'Medir la conversación cualitativa mediante social listening nos permite ajustar el rumbo en tiempo real y transformar la atención en comunidad.',
      ],
    },
    {
      slug: 'nuevas-incorporaciones-equipo-donostia',
      title: 'Sumamos cuatro nuevos perfiles en estrategia digital, diseño e ingeniería web en Donostia',
      cat: 'equipo-formacion', date: '2026-04-22', read: 3,
      image: './assets/news/equipo.webp',
      alt: 'Cuatro personas trabajan juntas alrededor de una mesa',
      lead: 'Seguimos reforzando un equipo multidisciplinar de más de 50 profesionales donde conviven visión estratégica, oficio creativo y desarrollo tecnológico.',
      body: [
        'Creemos firmemente que las mejores soluciones nacen cuando perfiles muy distintos piensan juntos sobre un mismo reto. Este trimestre damos la bienvenida en nuestras oficinas de Portuetxe (Donostia–San Sebastián) a cuatro nuevas incorporaciones.',
        'Los nuevos perfiles refuerzan las áreas de consultoría digital, dirección de arte, desarrollo front-end y planificación de medios digitales, acompañando el crecimiento de nuestros proyectos nacionales e internacionales.',
        'En ACC entendemos la agencia como un proyecto compartido en evolución continua donde cada persona suma su mirada.',
      ],
    },
    {
      slug: 'campanas-integradas-media-creatividad',
      title: 'Cuando media y creatividad se sientan en la misma mesa desde el primer día del briefing',
      cat: 'marcas-proyectos', date: '2026-04-08', read: 4,
      image: './assets/news/campanas.webp',
      alt: 'Retrato de una mujer sobre fondo ocre con el texto «Communication Arts»',
      lead: 'Separar la idea creativa de la estrategia de medios resta eficacia a ambas. Así trabajamos las campañas integradas de branding y performance en ACC.',
      body: [
        'Una gran pieza creativa pierde fuerza si no está pensada para el contexto, el momento y la señal de intención en la que la persona la va a encontrar. Y la planificación de medios más precisa se vuelve invisible si el mensaje no despierta nada.',
        'Al integrar nuestros equipos de Dirección Creativa, Media, Programática, SEM y Social Ads desde el arranque del proyecto, diseñamos campañas donde las creatividades aprenden de los datos y la inversión se optimiza hacia resultados reales.',
        'Conectar notoriedad de marca a largo plazo y conversión a corto plazo deja de ser un dilema cuando ambos equipos comparten objetivos.',
      ],
    },
    {
      slug: 'treinta-y-cinco-anos-wip-grupo-acc',
      title: 'WIP desde 1990: cómo mantener intacta la curiosidad después de tres décadas acompañando marcas',
      cat: 'dentro-de-acc', date: '2026-03-18', read: 4,
      image: './assets/news/wip.webp',
      alt: 'Escalera rosa iluminada por un haz de luz',
      lead: 'Más de 35 años de trayectoria nos han enseñado que en comunicación y marketing digital nada está terminado para siempre: todo es Work In Progress.',
      body: [
        'Desde nuestros inicios en 1990 en Donostia–San Sebastián hemos vivido de primera mano el paso del diseño editorial analógico a la primera web comercial, la eclosión de las redes sociales, el comercio electrónico y hoy la revolución de la inteligencia artificial.',
        'Lo que nos ha permitido acompañar a marcas líderes década tras década no ha sido aferrarnos a una fórmula, sino cuestionar siempre el «siempre lo hemos hecho así» con rigor, honestidad y respeto por el oficio.',
      ],
      quote: { text: 'Hoy, como parte de Grupo ACC junto a Lurnova y Solidkey, miramos lo que viene', hl: 'con la misma energía del primer día', after: '.' },
    },
    {
      slug: 'acc-google-partner-premier-2025',
      title: 'ACC, primera agencia en Gipuzkoa con el reconocimiento Google Partner Premier 2025',
      cat: 'dentro-de-acc', date: '2025-03-12', read: 3,
      image: './assets/news/google-partner-premier.webp',
      alt: 'Trofeo de cristal sobre una mesa',
      lead: 'Nos hemos convertido en Google Partner Premier, la máxima distinción que Google otorga a las agencias con mejor rendimiento en la gestión de campañas publicitarias.',
      body: [
        { h2: 'Un reconocimiento reservado a la élite del marketing digital' },
        'Este reconocimiento nos sitúa en la élite del marketing digital, ya que solo el 3 % de los partners de Google con mejores resultados del mundo obtiene esta distinción.',
        'En esta misma línea, estamos muy orgullosos de ser una de las pocas agencias en España —solo 77 en total— que han completado con éxito las cinco certificaciones oficiales de Google Ads: Búsqueda, Shopping, Display, Video y Apps. Esto nos acredita como expertos en todas las áreas clave de publicidad digital dentro del ecosistema de Google.',
        { h2: '¿Qué significa ser Google Partner Premier?' },
        'Este distintivo es una garantía de calidad y excelencia para nuestros clientes. Como Google Partner Premier, accedemos a ventajas exclusivas que nos permiten llevar nuestras estrategias digitales a un nuevo nivel:',
        { ul: [
          'Acceso exclusivo a herramientas avanzadas y soporte especializado directo de Google para optimizar campañas y tomar decisiones basadas en datos de alto valor.',
          'Estrategias publicitarias más efectivas y optimizadas con el mejor retorno de inversión.',
          'Formación continua y certificaciones actualizadas alineadas con las mejores prácticas del ecosistema publicitario de Google.',
          'Mayor competitividad y diferenciación en el mercado.',
        ] },
        'Ser Google Partner Premier refuerza nuestra posición como referentes en el marketing digital y nos motiva a seguir creciendo junto a nuestros clientes, ofreciéndoles soluciones estratégicas y personalizadas dentro del ecosistema de Google Ads.',
      ],
    },
  ],
};

/* Utilidades compartidas: ruta de la noticia, categoría y fecha («28 de octubre de 2026») */
window.ACC_NEWS.href = n => `./noticia.html?slug=${encodeURIComponent(n.slug)}`;
window.ACC_NEWS.catName = n => (window.ACC_NEWS.cats[n.cat] || {}).name || '';
window.ACC_NEWS.dateLabel = n => new Date(`${n.date}T12:00:00`)
  .toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
