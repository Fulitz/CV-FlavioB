# 📁 Estructura del Repositorio - Portafolio Flavio Bravo Oyola

## 🗂️ Organización de Archivos

```
CV-FlavioB/
├── .gitignore              # Archivos excluidos de Git
├── README.md               # Documentación principal
├── MEJORAS_IMPLEMENTADAS.md # Historial de mejoras
├── index.html              # Estructura HTML principal
├── script.js               # Lógica JavaScript y seguridad
├── style.css               # Estilos CSS y responsive
│
└── assets/                 # Recursos estáticos organizados
    ├── docs/               # Documentos (CV, certificados, etc.)
    │   └── (vacío - listo para documentos futuros)
    │
    └── images/             # Todas las imágenes organizadas
        ├── profile/        # Imágenes de perfil
        │   └── foto.jpg    # Foto principal del perfil
        │
        ├── projects/       # Capturas de proyectos del portafolio
        │   ├── stroma_suite.png           # Dashboard STROMA Suite
        │   ├── stroma_landing.png         # Landing page STROMA
        │   ├── stroma_dashboard.png       # Dashboard completo
        │   ├── inoc_suite.png             # INOC Suite ShiftGuard
        │   └── sustainability_dashboard.png # Dashboard Power BI
        │
        └── logos/          # Logotipos de empresas/clientes
            └── (vacío - listo para logos futuros)
```

## 📋 Descripción de Carpetas

### `assets/images/profile/`
Contiene imágenes personales y de perfil.
- **foto.jpg**: Fotografía profesional para el avatar y favicon

### `assets/images/projects/`
Capturas de pantalla de proyectos del portafolio.
- **stroma_suite.png**: Dashboard principal de STROMA Suite SSOMA
- **stroma_landing.png**: Landing page del sistema STROMA
- **stroma_dashboard.png**: Vista completa del dashboard
- **inoc_suite.png**: Sistema INOC Suite ShiftGuard
- **sustainability_dashboard.png**: Dashboard ejecutivo en Power BI

### `assets/images/logos/`
Espacio reservado para logotipos de:
- Empresas donde se ha trabajado
- Clientes de consultoría
- Certificaciones y organizaciones
- Tecnologías y herramientas

### `assets/docs/`
Documentación adicional:
- CV en PDF
- Certificados y diplomas
- Cartas de recomendación
- Portafolio técnico detallado

## 🔒 Seguridad Implementada

### Protección de Imágenes
1. **Click derecho deshabilitado** en imágenes
2. **Arrastre bloqueado** para evitar descarga directa
3. **Marca de agua dinámica** en canvas de fondo
4. **Rutas organizadas** que dificultan hotlinking

### Protección de Datos
1. **Email ofuscado** contra scraping de bots
2. **Enlaces externos seguros** con `rel="noopener noreferrer"`
3. **SRI (Subresource Integrity)** para recursos CDN
4. **Meta tags de seguridad** configurados

## ⚡ Optimizaciones

### Rendimiento
- **Lazy loading** nativo en todas las imágenes
- **Preload** de recursos críticos (foto de perfil, CSS, JS)
- **Estructura organizada** para mejor caché del navegador

### SEO
- **Meta tags completos** (Open Graph, Twitter Cards)
- **Canonical URL** configurada
- **Keywords estratégicas** para el mercado peruano
- **Descripciones optimizadas** para motores de búsqueda

### Accesibilidad
- **Alt text descriptivo** en todas las imágenes
- **ARIA labels** en elementos interactivos
- **Navegación semántica** con landmarks
- **Contraste de colores** verificado

## 🔄 Flujo de Trabajo Recomendado

### Agregar Nueva Imagen de Proyecto
1. Guardar imagen en `assets/images/projects/`
2. Usar nombre descriptivo: `nombre_proyecto.png`
3. Optimizar tamaño (máx. 500KB recomendado)
4. Actualizar `index.html` con la nueva ruta
5. Agregar alt text descriptivo

### Agregar Documento
1. Guardar PDF en `assets/docs/`
2. Usar nombre claro: `cv_flavio_bravo_2026.pdf`
3. Actualizar enlaces en `index.html`
4. Verificar permisos de acceso

### Actualizar Logo
1. Guardar logo en `assets/images/logos/`
2. Preferir formato SVG o PNG transparente
3. Mantener consistencia de tamaño
4. Actualizar referencias en HTML

## 📊 Estadísticas del Repositorio

| Tipo | Cantidad | Tamaño Total |
|------|----------|--------------|
| Imágenes de Perfil | 1 | ~426 KB |
| Imágenes de Proyectos | 5 | ~1.6 MB |
| Logotipos | 0 | 0 KB |
| Documentos | 0 | 0 KB |
| **Total** | **6** | **~2 MB** |

## 🎯 Próximas Mejoras Sugeridas

1. **Optimizar imágenes**: Convertir a WebP/AVIF para mejor rendimiento
2. **Agregar manifest.json**: Para convertir en PWA instalable
3. **Service Worker**: Para caché offline
4. **sitemap.xml**: Para mejor indexación en buscadores
5. **Google Analytics 4**: Para métricas de visitantes
6. **Configurar CSP**: Content Security Policy headers

---

**Última actualización**: Julio 2026  
**Versión de estructura**: 2.0  
**Mantenido por**: Flavio Bravo Oyola
