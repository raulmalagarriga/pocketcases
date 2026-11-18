# Plan Maestro de Corrección, Completitud del CMS y Animaciones (`REFACTOR_PLAN.md`)

> **Modo de Trabajo**: Orquestación Multi-Agente por Fases.  
> **Rol del Agente Principal (Orquestador)**: Mantener el contexto limpio, delegar cada fase a un subagente especializado con instrucciones acotadas, auditar el código resultante (`git diff` + `tsc --noEmit`), actualizar el estado en este documento y realizar el `git commit` + `git push` de cada fase.

---

## Diagnóstico de Problemas Detectados

### 1. Storefront (`(storefront)`)
- [x] **Carrito abierto por defecto**: En `src/store/useCartStore.ts`, `isOpen` inicia en `false`, con un backdrop que permite cerrarlo al hacer clic fuera o presionar `Escape`.
- [x] **Ítems pre-cargados en el carrito**: El carrito inicia vacío (`[]`) para visitantes nuevos (`pocket-cases-cart-v2`).
- [x] **Modelos de teléfono estáticos en `ProductCard`**: El `<select>` de modelos en la tarjeta usa `product.supported_models` proveniente de Supabase (con fallback seguro).
- [x] **Enlaces de navegación y Footer**: Los enlaces del Footer (`Serie iPhone 16`, `Grips MagSafe`, etc.) y las tarjetas del mosaico del Hero filtran activamente el catálogo al hacer scroll hacia `#product-catalog`.

### 2. Panel Administrativo CMS (`(cms)/admin`) — Opciones sin funcionalidad
- [x] **Menú Lateral (`AdminSidebar.tsx`) con vistas reales**: Los 7 módulos del sidebar (`Dashboard Overview`, `Product Catalog`, `Inventory & Stock`, `Orders`, `Customers`, `Analytics`, `Store Settings`) renderizan sus vistas completas conectadas a Supabase.
- [x] **Paginación de la tabla estática**: El selector `10 / 25 / 50 per page` y los botones de página `1, 2, 3, <, >` paginan dinámicamente los productos.
- [x] **Acciones por lote (Batch Operations) con persistencia en Supabase**: `Change Status`, `Apply Discount (-15%)`, `Set Out of Stock` y `Delete Selected` persisten directamente en la tabla `products` de Supabase.
- [x] **Sincronización completa en `ProductFormDrawer.tsx`**:
  - Al guardar un producto, se sincroniza la tabla intermedia `product_phone_models` en Supabase.
  - Los swatches de color (`Color Variant Manager`) permiten editar inline las unidades de stock (`stock_units`) y el nombre de cada color existente.
- [x] **Campana de notificaciones en `AdminHeader.tsx`**: El botón de notificaciones abre un popover interactivo con las alertas reales de stock agotado, stock bajo y borradores.

### 3. Animaciones On-Scroll y Smooth Scroll
- [x] **Animaciones de entrada (On-Scroll Reveal)**: Las secciones (`HeroSection`, `TrustMetricsBar`, `ProductCatalog`, `SocialProofReel`, `FaqSection`, `Footer`) cuentan con transiciones progresivas escalonadas (`ScrollReveal`) al hacer scroll.
- [x] **Smooth Scroll con compensación de Header Sticky**: Navegar a secciones ancla (`#product-catalog`, `#social-proof`, `#faq-section`) usa `scroll-mt-24`, `scroll-padding-top: 5.5rem` y `smoothScrollTo`.

---

## Fases de Ejecución y Prompts para Subagentes

### FASE R1: Corrección de UX e Interactividad del Storefront
- **Estado**: `COMPLETADA ✅`
- **Alcance**:
  1. En `src/store/useCartStore.ts`: Cambiar `isOpen: false` por defecto e iniciar `items: []` (bumpear key de storage a `pocket-cases-cart-v2`).
  2. En `src/components/storefront/CartDrawer.tsx`: Agregar backdrop oscuro con `backdrop-blur-[2px]` cuando `isOpen === true` para cerrar al hacer clic fuera o con tecla `Escape`.
  3. En `src/components/storefront/ProductCard.tsx`: Usar `product.supported_models` en el `<select>` de modelos (con fallback a `DEFAULT_CARD_MODELS`), y permitir cambiar la imagen o borde activo al seleccionar swatches.
  4. En `src/components/storefront/HeroSection.tsx` y `src/components/storefront/Footer.tsx`: Conectar enlaces de categorías (`Serie iPhone 16`, `Grips MagSafe`, etc.) con `setActiveCategory(...)` + scroll suave a `#product-catalog`.

### FASE R2: Completitud del Tabla de Productos, Drawer CRUD y Persistencia Supabase en CMS
- **Estado**: `COMPLETADA ✅`
- **Alcance**:
  1. En `src/lib/queries/cms.ts`:
     - Sincronizar `product_phone_models` en Supabase al guardar un producto en `saveProductToSupabase`.
     - Crear funciones reales de persistencia en Supabase para acciones por lote (`batchUpdateProductsSupabase`, `deleteProductSupabase`).
  2. En `src/components/cms/ProductFormDrawer.tsx`:
     - Permitir editar inline el stock (`stock_units`) y nombre de cada variante de color existente, recalculando automáticamente `total_stock`.
     - Agregar campo editable para `subtitle` y `promo_tag` (`BESTSELLER`, `HOT DROP`, `WAITLIST`, `NINGUNO`).
  3. En `src/components/cms/CmsProductManager.tsx`:
     - Implementar paginación real funcional (`pageSize`: 10, 25, 50; `currentPage`; botones `chevron_left`, números de página dinámicos y `chevron_right`).
     - Conectar todas las acciones por lote (`Change Status`, `Apply Discount -15%`, `Set Out of Stock`, `Delete Selected`) y el botón de eliminar individual a Supabase con feedback visual (toast/banner).
     - Hacer funcional la campana de notificaciones en `AdminHeader.tsx` (popover con alertas de productos agotados y de bajo stock que al hacer clic filtran o abren el producto).

### FASE R3: Implementación de los Módulos Faltantes del CMS (Overview, Inventory Matrix, Orders, Customers/Waitlist, Analytics y Store Settings)
- **Estado**: `COMPLETADA ✅`
- **Alcance**:
  Implementar las vistas interactivas conectadas a Supabase para cada sección de `AdminSidebar.tsx`:
  1. `Dashboard Overview` (`src/components/cms/views/OverviewView.tsx`): KPIs globales, resumen de ingresos, órdenes recientes, alertas rápidas de inventario y tasa BCV activa.
  2. `Inventory & Stock` (`src/components/cms/views/InventoryMatrixView.tsx`): Control rápido de stock por producto y por variante de color (`+1`, `-1`, `+10`, input directo) con guardado instantáneo en Supabase.
  3. `Orders` (`src/components/cms/views/OrdersView.tsx`): Listado en vivo de la tabla `orders` de Supabase, filtro por estado (`pending`, `confirmed`, `shipped`, `cancelled`), cambio de estado en 1 clic, detalle de ítems/referencia Pago Móvil o Zelle y botón de contacto directo al WhatsApp del cliente.
  4. `Customers & Waitlist` (`src/components/cms/views/CustomersView.tsx`): Listado de clientes (desde `orders`) y suscriptores de lista de espera (`waitlist_subscriptions`) con botón para avisar por WhatsApp cuando llega mercancía.
  5. `Analytics` (`src/components/cms/views/AnalyticsView.tsx`): Valorización de inventario (Costo vs Retail en USD y Bs.), margen bruto promedio por categoría y distribución de stock.
  6. `Store Settings` (`src/components/cms/views/StoreSettingsView.tsx`): Formulario conectado a `public.store_settings` en Supabase para actualizar en vivo la **Tasa BCV (`bcv_exchange_rate`)**, número de WhatsApp de la tienda, monto de envío gratis (`$35`), datos de **Pago Móvil** y datos de **Zelle**.

### FASE R4: Animaciones On-Scroll (`ScrollReveal`) y Smooth Scroll
- **Estado**: `COMPLETADA ✅`
- **Alcance**:
  1. Crear componente reutilizable `src/components/ui/ScrollReveal.tsx` basado en `IntersectionObserver` (con soporte de `delay`, `direction`: `'up' | 'left' | 'right' | 'scale'`, y respeto a `prefers-reduced-motion`).
  2. Configurar `scroll-margin-top` (`scroll-mt-24`) en las secciones ancla del Storefront y navegación fluida.
  3. Aplicar animaciones on-scroll progresivas (staggered reveal) en:
     - `HeroSection` (columna editorial + collage 2x2 + sello rotatorio Y2K).
     - `TrustMetricsBar` (4 tarjetas con entrada escalonada).
     - `ProductCatalog` (encabezado, barra de filtros y aparición escalonada de cada `ProductCard`).
     - `SocialProofReel` (4 tarjetas de comunidad VE).
     - `FaqSection` (transición suave de apertura/cierre de acordeones y entrada on-scroll).
     - `Footer` (reveal suave del bloque Pocket Club y métodos de pago).

### FASE R5: Logo Oficial Configurable (Sin Texto Redundante) y Editor del Banner Principal (`HeroSection`) en el CMS
- **Estado**: `COMPLETADA ✅`

### FASE R6: Fix Visibilidad del Logo en Header, Buscador Predictivo con Foto, Vista de Detalle de Producto (`/products/[slug]`) y Configuración de Delivery Gratis en Carrito
- **Estado**: `COMPLETADA ✅`
- **Alcance**:
  1. **Visibilidad del Logo en `Navbar.tsx`**:
     - Agregar `shrink-0` al contenedor `<a>` / `<Link>` del logo y dimensiones explícitas (`h-12 w-auto min-w-[100px] shrink-0`) para evitar que Flexbox colapse el ancho del logo a `0px` frente a los demás elementos de la barra superior.
  2. **Buscador en Vivo con Dropdown de Resultados (con Foto) en `Navbar.tsx`**:
     - Al escribir en el buscador del Header, mostrar un popover flotante debajo del input con los productos coincidentes (miniatura con foto, nombre, categoría, estado de stock y precio en USD/Bs.).
     - Al hacer clic en un resultado del buscador (o en la foto/título de cualquier `ProductCard`), navegar a la **Vista de Detalle del Producto (`/products/[slug]`)**.
  3. **Vista de Detalle del Producto (`src/app/(storefront)/products/[slug]/page.tsx` y `src/components/storefront/ProductDetailView.tsx`)**:
     - Galería interactiva con imagen principal + miniaturas (`gallery_urls`), selector de color (swatches con nombre y stock por color), selector de modelo de teléfono (`supported_models`), selector de acabado (`Grip Mate` / `Brillo Jelly`), selector de cantidad, botón de agregar al carrito, botón de compra directa por WhatsApp y sección de productos relacionados.
  4. **Configuración Completa de la Barra de Delivery Gratis y Regalo en el Carrito (`CartDrawer.tsx` y `StoreSettingsView.tsx`)**:
     - Permitir activar/desactivar (`enable_free_shipping_bar`) o personalizar los textos (`free_shipping_locked_text`, `free_shipping_unlocked_text`), monto mínimo (`free_shipping_threshold_usd`) y tarifa plana (`shipping_flat_rate_usd`) de la barra de delivery gratis del carrito, así como activar/desactivar o editar el banner de regalo (`enable_free_gift_banner`, `free_gift_text`).

### FASE R7: Landing con Carrusel de Destacados, Página `/catalog` Independiente, Imagen Propia por Variante de Color, Social Proof y FAQs Configurables (Cerradas por Defecto)
- **Estado**: `COMPLETADA ✅`
- **Alcance**:
  1. **Imagen Distinta por Variante de Color (`image_url` en `ProductColorVariant`)**:
     - Añadir `image_url: string` a `ProductColorVariant` y migración SQL `supabase/migrations/0004_variants_images_and_landing_configs.sql`.
     - Al seleccionar un swatch de color en cualquier tarjeta o detalle de producto, cambiar inmediatamente la foto mostrada por `selectedColor.image_url` y guardarla en el carrito.
  2. **Landing Principal con Más Respiro (`FeaturedProductsCarousel.tsx`) + Nueva Página `/catalog`**:
     - En la Landing (`/`), mostrar únicamente un carrusel horizontal de productos destacados con controles Anterior/Siguiente y CTA hacia `/catalog`.
     - Mover el catálogo completo con filtros y ordenamiento a su propia página dedicada `/catalog`.
  3. **Preguntas Frecuentes (FAQ) Cerradas por Defecto y Configurables (`faq_config`)**:
     - Iniciar los acordeones cerrados por defecto (`openIds = []`) y conectarlos a `settings.faq_config`.
  4. **Sección `#POCKETCASESENLACALLE` (`SocialProofReel.tsx`) Configurable (`social_proof_config`)**:
     - Conectar `SocialProofReel.tsx` a `settings.social_proof_config`.

### FASE R8: Rediseño Visual Limpio del Admin CMS (Alineación de Inputs, Drawer con Imagen por Variante y Editor de Social Proof + FAQs)
- **Estado**: `COMPLETADA ✅`
- **Alcance**:
  1. **Limpieza Visual y Alineación Estricta en el CMS**:
     - Sistema uniforme de inputs (`h-10`, bordes limpios `border-slate-200`, etiquetas alineadas, eliminación de sombras pesadas en inputs internos) y ocultación de la barra de acciones por lote cuando no hay filas seleccionadas (`selectedIds = []` por defecto).
  2. **Rediseño de `ProductFormDrawer.tsx` en 3 Pestañas Limpias + Subida de Imagen por Variante de Color**:
     - Pestañas: `1. Información y Precios`, `2. Variantes de Color e Imágenes` (con foto individual subible por cada variante de color) y `3. Modelos e Inventario`.
  3. **Rediseño de `StoreSettingsView.tsx` en 4 Pestañas Limpias**:
     - `1. Marca, Moneda BCV y Pagos`, `2. Envíos y Carrito`, `3. Banner Principal (Hero)` y `4. Social Proof (#EnLaCalle) y FAQs`.

---

## Registro de Progreso y Commits

| Fase | Estado | Subagente / Ejecución | Revisión TypeScript | Commit Hash |
| :--- | :--- | :--- | :--- | :--- |
| **FASE R1** | ✅ Completada | Subagente `7a4313fd` | `tsc --noEmit` OK (0 errores) | `b434c14` |
| **FASE R2** | ✅ Completada | Subagente `df8880fd` | `tsc --noEmit` OK (0 errores) | `6455a47` |
| **FASE R3** | ✅ Completada | Subagente `bbacad8b` | `tsc --noEmit` OK (0 errores) | `0b63f34` |
| **FASE R4** | ✅ Completada | Subagente `e725b326` | `tsc --noEmit` OK (0 errores) | `f945274` |
| **FASE R5** | ✅ Completada | Subagente `68bc5611` | `tsc --noEmit` OK (0 errores) | `1398207` |
| **FASE R6** | ✅ Completada | Subagente `639bd27b` | `tsc --noEmit` OK (0 errores) | `9468b62` |
| **FASE R7** | ✅ Completada | Subagente `00f8909b` | `tsc --noEmit` OK (0 errores) | `95fa927` |
| **FASE R8** | ✅ Completada | Subagente `162b1986` | `tsc --noEmit` OK (0 errores) | `56e5fcb` |
