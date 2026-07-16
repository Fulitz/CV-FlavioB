# CV interactivo y portafolio — Flavio Bravo Oyola

Sitio estático en HTML, CSS y JavaScript, diseñado para dos usos:

1. Presentación web profesional con experiencia, proyectos y resultados.
2. Exportación de un CV limpio y legible por ATS mediante la opción de impresión del navegador.

La versión web utiliza una dirección visual corporativa-editorial: tipografía serif de alto contraste, paleta marfil/verde/cobre, composición asimétrica, navegación reactiva y movimiento progresivo. Evita deliberadamente la estética de dashboard tecnológico o plantilla generada.

### Interacciones incluidas

- Progreso de lectura y navegación activa por sección.
- Cabecera inteligente que responde a la dirección del desplazamiento.
- Parallax y profundidad tridimensional moderada en la portada.
- Inclinación 3D y luz reactiva en tarjetas con puntero fino.
- Botones magnéticos, contadores animados y revelado progresivo.
- Galerías compactas y accesibles para recorrer las vistas de STROMA e INOC.
- Menú móvil, tema claro/oscuro y hora local de Lima.
- Soporte completo para `prefers-reduced-motion`.
- Imágenes WebP optimizadas para una carga rápida.

## Enlace público

**https://fulitz.github.io/CV-FlavioB/**

El repositorio remoto se llama `CV-FlavioB`; por eso la dirección anterior es la ruta correcta de GitHub Pages.

## Estrategia de postulación

La página pública presenta un **perfil integral único**. Está pensada como carta de presentación para reclutadores: muestra la trayectoria completa, los proyectos y el diferencial híbrido entre SSOMA, ambiente, datos y operaciones.

Para cada vacante se recomienda adjuntar, además del enlace web, un CV Word/PDF específico que adapte el título, resumen, palabras clave y orden de logros al puesto. Los resúmenes privados por enfoque se conservan en `resumen_completo_flavio_bravo.md`; no se muestran en la página pública.

## Exportar a PDF ATS

1. Abre `index.html` en Chrome, Edge o Firefox.
2. Pulsa **“Guardar CV en PDF”**.
3. En la ventana de impresión elige:
   - Destino: **Guardar como PDF**.
   - Papel: **A4**.
   - Escala: **Predeterminada / 100%**.
   - Encabezados y pies de página: **desactivados**.
   - Gráficos de fondo: pueden permanecer desactivados; la versión impresa no los necesita.

La hoja de estilos de impresión elimina la foto, controles, animaciones y elementos decorativos. Mantiene una sola columna de lectura para experiencia y competencias.

## Archivos principales

- `index.html`: contenido, estructura semántica, metadatos y accesibilidad.
- `style.css`: diseño responsive, temas claro/oscuro y formato de impresión.
- `script.js`: tema, copia de correo, navegación y contadores.
- `resumen_completo_flavio_bravo.md`: base estratégica para adaptar postulaciones y preparar entrevistas.

## Regla de credibilidad

Los resultados cuantificados deben poder explicarse en entrevista con contexto, periodo, método de cálculo y evidencia disponible. Los proyectos demostrativos se identifican como prototipos y no deben presentarse como implementaciones de clientes.
