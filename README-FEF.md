# FEF Landing Page v5

## Dónde agregar URLs de imágenes
- Logo claro/oscuro: `assets/img/fefLogo_ligth.png` y `assets/img/fefLogo_dark.png`.
- Favicon claro/oscuro: `assets/img/fefFavico_ligth.png` y `assets/img/fefFavico_dark.png`.
- Imagen principal del hero: editar `.hero-img` en `assets/styles.css` o reemplazar el bloque en `index.html`.
- Imagen de FEF Kid´s: editar `.kids-img` en `assets/styles.css`.
- Imágenes de categorías: editar cada `.category-card .card-img` en `index.html` o asignar fondos por CSS.
- Imágenes del megamenú: editar `assets/app.js`, objeto `menus`, propiedad `image` de cada sección.
- Card del menú hamburguesa: reemplazar `.panel-img` en `index.html` o agregar fondo desde CSS.

## Leads
Actualmente los datos se guardan en `localStorage` para prueba. Para enviarlos a WordPress, reemplazar el bloque `localStorage.setItem('fef_lead', ...)` en `assets/app.js` por `fetch()` al endpoint/API que se indique.
