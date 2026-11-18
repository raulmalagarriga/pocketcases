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
- [ ] **Menú Lateral (`AdminSidebar.tsx`) sin vistas reales**: Los 7 módulos del sidebar (`Dashboard Overview`, `Product Catalog`, `Inventory & Stock`, `Orders`, `Customers`, `Analytics`, `Store Settings`) solo cambian un estado local sin renderizar sus vistas correspondientes.
- [ ] **Paginación de la tabla estática**: El selector `10 / 25 / 50 per page` y los botones de página `1, 2, 3, <, >` son HTML estático y no paginan los productos.
- [ ] **Acciones por lote (Batch Operations) sin persistencia en Supabase**: `Change Status`, `Apply Discount (-15%)` y `Set Out of Stock` solo mutaban el estado en memoria de React sin hacer `UPDATE` en la tabla `products` de Supabase.
- [ ] **Sincronización incompleta en `ProductFormDrawer.tsx`**:
  - Al guardar un producto, no se sincronizaba la tabla intermedia `product_phone_models` en Supabase.
  - Los swatches de color (`Color Variant Manager`) no permitían editar inline las unidades de stock (`stock_units`) de un color existente sin borrarlo y crearlo de nuevo.
- [ ] **Campana de notificaciones en `AdminHeader.tsx`**: El botón de notificaciones no abre ningún panel con las alertas reales de stock agotado / stock bajo / órdenes pendientes.

### 3. Animaciones On-Scroll y Smooth Scroll
- [ ] **Falta de animaciones de entrada (On-Scroll Reveal)**: Las secciones (`HeroSection`, `TrustMetricsBar`, `ProductCatalog`, `SocialProofReel`, `FaqSection`, `Footer`) aparecen estáticas sin transiciones progresivas al hacer scroll.
- [ ] **Smooth Scroll con compensación de Header Sticky**: Navegar a secciones ancla (`#product-catalog`, `#social-proof`, `#faq-section`) necesita `scroll-mt-24` y transiciones suaves acordes al estilo `Retro Pastel Pop`.

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
- **Estado**: `PENDIENTE`
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
- **Estado**: `PENDIENTE`
- **Alcance**:
  Implementar las vistas interactivas conectadas a Supabase para cada sección de `AdminSidebar.tsx`:
  1. `Dashboard Overview` (`src/components/cms/views/OverviewView.tsx`): KPIs globales, resumen de ingresos, órdenes recientes, alertas rápidas de inventario y tasa BCV activa.
  2. `Inventory & Stock` (`src/components/cms/views/InventoryMatrixView.tsx`): Control rápido de stock por producto y por variante de color (`+1`, `-1`, `+10`, input directo) con guardado instantáneo en Supabase.
  3. `Orders` (`src/components/cms/views/OrdersView.tsx`): Listado en vivo de la tabla `orders` de Supabase, filtro por estado (`pending`, `confirmed`, `shipped`, `cancelled`), cambio de estado en 1 clic, detalle de ítems/referencia Pago Móvil o Zelle y botón de contacto directo al WhatsApp del cliente.
  4. `Customers & Waitlist` (`src/components/cms/views/CustomersView.tsx`): Listado de clientes (desde `orders`) y suscriptores de lista de espera (`waitlist_subscriptions`) con botón para avisar por WhatsApp cuando llega mercancía.
  5. `Analytics` (`src/components/cms/views/AnalyticsView.tsx`): Valorización de inventario (Costo vs Retail en USD y Bs.), margen bruto promedio por categoría y distribución de stock.
  6. `Store Settings` (`src/components/cms/views/StoreSettingsView.tsx`): Formulario conectado a `public.store_settings` en Supabase para actualizar en vivo la **Tasa BCV (`bcv_exchange_rate`)**, número de WhatsApp de la tienda, monto de envío gratis (`$35`), datos de **Pago Móvil** y datos de **Zelle**.

### FASE R4: Animaciones On-Scroll (`ScrollReveal`) y Smooth Scroll
- **Estado**: `PENDIENTE`
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

---

## Registro de Progreso y Commits

| Fase | Estado | Subagente / Ejecución | Revisión TypeScript | Commit Hash |
| :--- | :--- | :--- | :--- | :--- |
| **FASE R1** | ✅ Completada | Subagente `7a4313fd` | `tsc --noEmit` OK (0 errores) | Commit Fase R1 |
| **FASE R2** | ⏳ Pendiente | — | — | — |
| **FASE R3** | ⏳ Pendiente | — | — | — |
| **FASE R4** | ⏳ Pendiente | — | — | — |
