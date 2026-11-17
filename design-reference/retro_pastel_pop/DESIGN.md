---
name: Retro Pastel Pop
colors:
  surface: '#f3fbfe'
  surface-dim: '#d3dbdf'
  surface-bright: '#f3fbfe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#edf5f9'
  surface-container: '#e7eff3'
  surface-container-high: '#e1e9ed'
  surface-container-highest: '#dce4e7'
  on-surface: '#151d20'
  on-surface-variant: '#574146'
  inverse-surface: '#2a3235'
  inverse-on-surface: '#eaf2f6'
  outline: '#8a7176'
  outline-variant: '#ddbfc5'
  surface-tint: '#ab2c5d'
  primary: '#ab2c5d'
  on-primary: '#ffffff'
  primary-container: '#f06292'
  on-primary-container: '#5e002b'
  inverse-primary: '#ffb1c5'
  secondary: '#4a654e'
  on-secondary: '#ffffff'
  secondary-container: '#c9e7ca'
  on-secondary-container: '#4e6952'
  tertiary: '#286b33'
  on-tertiary: '#ffffff'
  tertiary-container: '#5fa364'
  on-tertiary-container: '#00350f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9e1'
  primary-fixed-dim: '#ffb1c5'
  on-primary-fixed: '#3f001b'
  on-primary-fixed-variant: '#8b0e45'
  secondary-fixed: '#cceacd'
  secondary-fixed-dim: '#b1ceb2'
  on-secondary-fixed: '#07200e'
  on-secondary-fixed-variant: '#334d37'
  tertiary-fixed: '#abf4ac'
  tertiary-fixed-dim: '#90d792'
  on-tertiary-fixed: '#002107'
  on-tertiary-fixed-variant: '#07521d'
  background: '#f3fbfe'
  on-background: '#151d20'
  surface-variant: '#dce4e7'
typography:
  display-hero:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 18px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-badge:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.06em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.75rem
  margin: 1rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
  space-2xl: 4rem
---

## Brand & Style

This design system channels early-2000s candy nostalgia re-engineered through a contemporary, high-converting digital lens. Designed for Gen Z and trend-forward smartphone users, the atmosphere is tactile, unapologetically expressive, and joyful.

The aesthetic fuses Y2K retro-chic with modern neo-brutalist softness:
- **Playful Pastel Contrast**: Gentle pistachio and mint milk tones act as structural foundations, supercharged by punchy bubblegum pink accents and deep berry typography.
- **Dimensional Soft-Pop**: Offset drop shadows ("sticker effect"), pillowy pill shapes, and subtle extrusion shadows reminiscent of retro enamel pins and chunky plastic accessories.
- **Dual Personality**: The consumer storefront prioritizes tactile delight, micro-delights, and impulse-friendly visual merchandising. The back-office CMS maintains this brand personality via soft rounded accents and iconic tinting, but shifts into higher information density, tabular clarity, and neutral, low-fatigue chrome.

## Colors

The palette directly builds upon the iconic mint-and-bubblegum identity:

- **Primary (`#F06292`)**: High-energy bubblegum pink. Reserved for primary calls to action, badges, promotional stickers, active selection states, and hero headlines.
- **Secondary (`#C8E6C9`)**: Pistachio milk cream. Serves as ambient background fills, card containers, and header tinting on consumer touchpoints.
- **Tertiary (`#81C784`)**: Deeper botanical mint. Used for positive inventory flags ("In Stock"), toggle confirmations, success toasts, and secondary pills.
- **Neutral (`#2C3437`)**: Deep slate graphite. Replaces harsh true black to preserve warmth while guaranteeing AAA accessibility for continuous body reading on both pastel mint and crisp white backgrounds.

### Complementary Neutrals & Functional Roles
- **Canvas Base**: `#FBFDF9` (Milk White) for high-contrast product staging and CMS data tables.
- **Surface Tint**: `#DDF2E1` (Soft Glaze Mint) for alternating card decks and dashboard filter ribbons.
- **Muted Gray**: `#718089` for metadata, SKU numbers, timestamp labels, and input placeholders.
- **Borders & Dividers**: `#B2D8B6` for mint surfaces and `#E2E8F0` for neutral administrative tables.
- **Warning / Alert**: `#FFB74D` (Peach Sun) for low-stock triggers; `#E57373` (Soft Cherry) for errors and cancellations.

## Typography

The typographic hierarchy pairs friendly geometric curves with tech-forward retro metadata:

- **Display & Headlines (`Plus Jakarta Sans`)**: Organic rounded terminals echoing the bubbly personality of the brand logo while maintaining clean structure. Heavy weights (`700` and `800`) are used for product titles, value props, and hero banners.
- **Body & Content (`Plus Jakarta Sans`)**: Tuned at medium weights (`500`) to retain smooth readability on small mobile viewports and within high-density CMS product inventory matrices.
- **Labels, Badges & Numbers (`Space Grotesk`)**: Provides sharp retro-techno contrast for prices, device selector tags, inventory counts, SKUs, and administrative filters.

## Layout & Spacing

### Storefront Layout (E-Commerce)
- **Grid Architecture**: 4 columns on mobile (`360px-639px`), 8 columns on tablet (`640px-1023px`), and 12 columns on desktop (`1024px+`, capped at `1320px` max-width).
- **Product Tiles**: Mobile renders a 2-column stacked card feed; desktop transitions to 3 or 4 columns with asymmetrical editorial callout blocks interspersed.
- **Rhythm**: Relaxed and breathable (`space-xl` to `space-2xl`) between curated drops, banners, and lookbooks.

### CMS Admin Dashboard
- **Layout Model**: Fluid fixed-rail layout. Left persistent navigation rail (64px collapsed, 240px expanded) paired with a responsive multi-column data canvas.
- **Information Density**: Compact rhythm (`space-xs` to `space-md`), minimizing vertical footprint with standardized 44px table rows and 36px form control fields.

## Elevation & Depth

Visual depth combines Y2K graphic sticker cutouts with soft ambient diffusion:

- **The Retro Sticker Shadow (Storefront Signature)**: Applied to product cards, badges, and action buttons. Features an offset, hard-tinted drop shadow with zero-to-minimal blur: `box-shadow: 3px 3px 0px 0px #F06292` or `box-shadow: 4px 4px 0px 0px #2C3437`.
- **Soft Ambient Pillows (Interactive Modals & Floats)**: High-blur, low-opacity pastel shadows for floating cart trays and sticky bottom purchase bars: `box-shadow: 0 16px 32px -8px rgba(240, 98, 146, 0.22)`.
- **CMS Depth Model**: Flat, low-contrast system surfaces. Employs soft single-pixel borders (`1px solid #E2E8F0`) with subtle elevation on hovering rows (`0 2px 8px rgba(44, 52, 55, 0.05)`).
- **Surface Tiers**:
  - `Base`: Canvas background (`#C8E6C9` or `#FBFDF9`).
  - `Layer 1`: Crisp white milk containers (`#FFFFFF`) framed by pastel borders.
  - `Layer 2`: Nested inner wells (`#F4FBF5`) for specification tables and SKU attributes.

## Shapes

The design system adopts a hyper-tactile, pill-forward language (Level 3):

- **Buttons & Action Tags**: Complete pill radius (`9999px`) for full tactile feedback that invites tap interaction.
- **Card Containers**: Chunky softened corners (`1.5rem` / `24px` on desktop; `1.25rem` / `20px` on mobile) simulating smooth molded silicone and plastic phone cases.
- **Stickers & Device Badges**: Freeform rotated pill tags (`-2deg` to `+3deg` slight tilt) on new arrivals and limited-edition product thumbnails.
- **CMS Administrative Elements**: Scaled-down soft capsules (`8px` to `12px`) for data grids, search bars, and tabular controls to maintain professional balance without sacrificing the system's character.

## Components

### 1. Buttons & Triggers
- **Primary ("Add to Bag" / "Publish")**: Vibrant `#F06292` solid fill, `#FFFFFF` text in `label-lg`, fully rounded pill shape (`9999px`). Features a subtle offset border shadow (`2px 2px 0px #2C3437`). On active press, the button shifts down-right (`translate(2px, 2px)`) with shadow flattening.
- **Secondary ("Quick View" / "Export")**: Crisp `#FFFFFF` surface, `1.5px solid #F06292`, `#F06292` bold text, animated mint fill (`#D1F2D9`) on hover.
- **Ghost / Tertiary**: Transparent base, `#2C3437` text with an underline accent on hover.

### 2. Product Cards (Storefront)
- Encased in milk-white (`#FFFFFF`) shells with `1.5rem` radius and a `1.5px` outer rim in `#DDF2E1`.
- Product imagery sits on alternating pastel mint (`#EAF8EC`) or soft blush (`#FCE4EC`) circular podium backgrounds.
- Hover interaction triggers an image swap to lifestyle context alongside an elevated offset drop shadow.
- Built-in floating stock badges at the top-left; wishlist heart icon in a circular pill well at the top-right.

### 3. Badges & Chips
- **Low Stock Badge**: Deep peach-pink text on a `#FFE0B2` pill; displays retro blinking dot indicator.
- **Device Filter Chips**: Pill-shaped capsules in `Space Grotesk`. Unselected state: white background with `#C8E6C9` border. Selected state: `#2C3437` fill with stark white text.
- **Inventory Status Pills (CMS)**:
  - Active: `#E8F5E9` background with `#2E7D32` bold label.
  - Draft / Out of Stock: `#FBE9E7` background with `#C62828` label.

### 4. Form Fields & Search Inputs
- **Consumer Search**: Pill-shaped search bar with milk-white background, inset pastel border, pink magnifying glass icon, and `Plus Jakarta Sans` placeholder styling.
- **CMS Inputs**: Rectangular with softened `8px` corners, white background, `1px solid #CBD5E1`. Focused state glows with a 2px `#F06292` halo ring without shifting layout bounds.

### 5. Selection Controls (Checkboxes & Radios)
- Custom rounded squares (`6px` for checkboxes) and circles (radios) filled with `#FFFFFF` and bounded by a `2px solid #F06292` border.
- Selected state fills in solid `#F06292` with a milk-white checkmark icon.

### 6. CMS Data Tables & Control Strips
- Borderless table headers wrapped in soft mint (`#DDF2E1`) with uppercase `label-badge` text in `#2C3437`.
- Hovering table rows reveal quick-action iconography (Edit, Duplicate, Trash) shaded in brand pink.
- Inline status switches styled as micro pill toggles (`w-10 h-6`) that glide smoothly between soft slate and vibrant mint green.