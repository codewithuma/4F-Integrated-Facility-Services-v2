# Coding Standards & Guidelines

This document outlines the coding standards, architectural structure, and design systems for the **4F Integrated Facility Services** web application framework. Follow these specifications precisely for all feature extensions, updates, or when scaffolding new projects to maintain visual and functional consistency.

---

## 1. Project Directory Architecture

Projects built with this framework must follow this modular directory hierarchy. Do not scatter page styles or script logic across arbitrary directories.

```
/
├── assets/
│   ├── css/
│   │   ├── about.css         # Page-specific styling for About page
│   │   ├── compliance.css    # Page-specific styling for Compliance page
│   │   ├── contact.css       # Page-specific styling for Contact page
│   │   ├── footer.css        # Styles for the shared footer component
│   │   ├── header.css        # Styles for the sticky glassmorphic header
│   │   ├── home.css          # Page-specific styling for Home page
│   │   ├── mobile-nav.css    # Styles for mobile slide-out navigation menu
│   │   ├── page-hero.css     # Styles for the shared inner-page heroes
│   │   ├── quote.css         # Page-specific styling for Quote page
│   │   ├── service.css       # Consolidated styles for services page & detail subpages
│   │   └── style.css         # Global Stylesheet (Tokens, resets, buttons, shared layout)
│   ├── images/               # Web-optimized assets (PNG, SVG, JPG, WebP)
│   ├── js/
│   │   ├── contact.js        # Contact page validation and submission logic
│   │   ├── main.js           # Core site logic, component loading, carousel, header triggers
│   │   └── quote.js          # Interactive Quote calculator and multi-step form logic
│   └── video/                # Compressed video backgrounds and media assets
├── components/               # Modular HTML components (fetched dynamically by main.js)
│   ├── footer.html           # Shared site footer block
│   ├── header.html           # Desktop navigation bar and logo block
│   ├── mobile-nav.html       # Offcanvas navigation sidebar drawer
│   └── page-hero.html        # Dynamic inner page header with auto breadcrumbs
├── BRD.md                    # Business Requirements Document
├── .cursorrules              # Cursor AI directory boundaries and core constraints
├── CODING_STANDARDS.md       # This guideline document
└── [page-name].html          # Clean semantic page structures (index.html, about.html, etc.)
```

---

## 2. HTML & Templating Standards

All HTML files must be structured as semantic, SEO-friendly documents using modern HTML5 elements.

### A. Boilerplate Layout
Every page must link `assets/css/style.css` in the `<head>` and list external resources in the following order:
1. Google Font Preconnects and Stylesheets.
2. Swiper CSS (v11 CDN) - *Required for carousels*.
3. FontAwesome (v6.4+ CDN) - *Required for system icons*.
4. AOS CSS (v2.3+ CDN) - *Required for animations*.
5. Main stylesheet `assets/css/style.css`.

At the end of the `<body>`, script files must be loaded in the following order:
1. AOS JS (CDN).
2. Swiper JS (CDN).
3. Main Application Script (`assets/js/main.js`).
4. Page-specific validation or calculator scripts.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="[Compelling, localized description detailing facility services - max 160 characters]">
  <title>[Page Name] | 4F Integrated Facility Services</title>
  
  <!-- Typography Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  
  <!-- Swiper Carousel -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css" />
  <!-- FontAwesome Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <!-- Animate On Scroll (AOS) -->
  <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
  
  <!-- Compiled Master Style Sheet -->
  <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
  
  <!-- Component Placeholders (Loaded dynamically by main.js) -->
  <header class="header dark-context" id="site-header"></header>
  <div id="site-mobile-nav"></div>
  
  <!-- Dynamic Inner-Page Hero Component Placeholder -->
  <!-- Set data-title, data-breadcrumb and optional parent attributes -->
  <div id="site-page-hero" 
       data-title="Service Detail" 
       data-breadcrumb="Service Detail" 
       data-parent-link="services.html" 
       data-parent-title="Services"></div>

  <!-- Main Content goes here inside semantic <main> or <section> elements -->
  
  <!-- Dynamic Footer Component Placeholder -->
  <footer class="footer" id="site-footer"></footer>
  
  <!-- JavaScript CDNs -->
  <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
  
  <!-- Core Javascript Logic -->
  <script src="assets/js/main.js"></script>
</body>
</html>
```

### B. Testing and Accessibility Compliance
- **Unique IDs**: Every interactive element (buttons, forms, anchors, inputs) **MUST** possess a unique, descriptive ID (e.g. `id="btn-hero-quote"`, `id="mobile-nav-toggle"`, `id="link-services"`) to enable automated end-to-end testing and styling hooks.
- **Form Controls**: Every form element must have a corresponding `<label>` tag or floating label structure. Inputs require validation elements containing `invalid-feedback` classes.

---

## 3. CSS & Style System Standards

No styling changes should be made using ad-hoc inline styles. All visual styles are declared inside structured stylesheets following the CSS separation design.

### A. CSS Architecture (Strict Separation of Concerns)
- **Global Stylesheet (`style.css`)**: Contains variables (`:root`), base HTML element overrides, structural container grids (`.container`, `.grid-2`, `.grid-3`, etc.), common typography classes (`.section-title`, `.section-tag`), input validations, success loops, and shared component classes (like `.btn`, `.btn-primary`, `.card`, `.card-glass`).
- **Natively Imported Files**: `style.css` must act as the primary imports registry. All other stylesheets are imported natively using `@import url("filename.css")` directives at the very top of `style.css` in dependency order:
  ```css
  @import url("header.css");
  @import url("mobile-nav.css");
  @import url("footer.css");
  @import url("page-hero.css");
  @import url("home.css");
  @import url("about.css");
  @import url("service.css");
  @import url("compliance.css");
  @import url("quote.css");
  @import url("contact.css");
  ```
- **Page-Specific Stylesheets**: Styles used on only **one** page must be housed in their respective page-specific stylesheet.
- **Consolidated Service Page Styles (`service.css`)**: Any styles used across the main hub `services.html` and individual subpages (`service-fire-safety.html`, `service-housekeeping.html`, `service-deep-cleaning.html`, `service-security.html`, `service-pest-control.html`) must remain consolidated inside `assets/css/service.css` to prevent duplicate code.

### B. Design Tokens (Define inside `:root`)
Maintain the following standard design tokens inside `assets/css/style.css` `:root`:

```css
:root {
  /* 1. Color Palette (HSL-based) */
  --primary-hue: 220;                   /* Navy Base */
  --secondary-hue: 205;                 /* Vibrant Electric Accent Blue */
  
  --color-primary: hsl(var(--primary-hue), 80%, 15%);
  --color-primary-light: hsl(var(--primary-hue), 75%, 28%);
  --color-primary-dark: hsl(var(--primary-hue), 90%, 8%);
  --color-primary-rgb: 8, 30, 68;
  
  --color-accent: hsl(var(--secondary-hue), 90%, 50%);
  --color-accent-hover: hsl(var(--secondary-hue), 95%, 42%);
  --color-accent-rgb: 13, 140, 242;
  
  --color-bg-light: #f8fafc;
  --color-bg-dark: #0a0f1d;
  --color-bg-card: #ffffff;
  --color-bg-card-dark: #121829;
  --color-text-dark: #0f172a;
  --color-text-muted: #64748b;
  --color-text-light: #f8fafc;
  --color-border: #e2e8f0;
  --color-border-dark: #1e293b;
  
  /* Glassmorphism Settings */
  --glass-bg: rgba(255, 255, 255, 0.75);
  --glass-bg-dark: rgba(10, 15, 29, 0.8);
  --glass-border: rgba(255, 255, 255, 0.4);
  --glass-border-dark: rgba(255, 255, 255, 0.08);
  --glass-blur: 16px;

  /* 2. Typography Rules */
  --font-family-headings: 'Outfit', sans-serif;
  --font-family-body: 'Inter', sans-serif;
  
  --weight-light: 300;
  --weight-regular: 400;
  --weight-medium: 500;
  --weight-semibold: 600;
  --weight-bold: 700;
  --weight-extrabold: 800;

  /* Responsive Font Sizing via fluid clamp() formulas */
  --font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --font-size-sm: clamp(0.875rem, 0.8rem + 0.3vw, 1rem);
  --font-size-base: clamp(1rem, 0.95rem + 0.2vw, 1.125rem);
  --font-size-lg: clamp(1.125rem, 1.05rem + 0.3vw, 1.25rem);
  --font-size-xl: clamp(1.25rem, 1.15rem + 0.4vw, 1.5rem);
  --font-size-2xl: clamp(1.5rem, 1.35rem + 0.6vw, 2rem);
  --font-size-3xl: clamp(2rem, 1.75rem + 1vw, 2.75rem);
  --font-size-4xl: clamp(2.5rem, 2.1rem + 1.6vw, 3.75rem);
  
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.7;

  /* 3. Spacing System */
  --space-xxs: 0.25rem;
  --space-xs: 0.5rem;
  --space-sm: 1rem;
  --space-md: 1.5rem;
  --space-lg: 2rem;
  --space-xl: 3rem;
  --space-xxl: 5rem;
  --section-padding: clamp(3rem, 2rem + 6vw, 6.5rem) 0;

  /* 4. Rounded Radii & Drop Shadows */
  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-xl: 30px;
  --radius-circle: 50%;
  
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(8, 30, 68, 0.08);
  --shadow-lg: 0 12px 32px rgba(8, 30, 68, 0.12);
  --shadow-xl: 0 24px 48px rgba(8, 30, 68, 0.18);
  --shadow-glass: 0 8px 32px 0 rgba(0, 0, 0, 0.06);
  --shadow-accent-glow: 0 8px 24px rgba(var(--color-accent-rgb), 0.25);

  /* 5. Transitions */
  --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### C. Contextual Styling Framework
- Use `.dark-context` to invert text styles on dark panels (e.g. inside the `.hero` or `.cta-banner`).
  ```css
  .dark-context {
    color: var(--color-text-light);
  }
  .dark-context h1, .dark-context h2, .dark-context h3 {
    color: var(--color-text-light);
  }
  .dark-context p {
    color: rgba(248, 250, 252, 0.7);
  }
  ```

### D. Component CSS Rules
1. **Interactive Service Cards (`.card-service`)**: Must follow a nested flexbox structure and support sliding hover transitions using absolute pseudo-elements (`::after`). On hover, text elements must transition smoothly to light colors.
2. **Buttons (`.btn`)**: Implement `.btn-primary` (accent color with shadow glow), `.btn-secondary` (dark corporate color), `.btn-outline` (transparent accent border), and `.btn-ghost-light` (white thin borders on dark contexts). Provide a standard scaling hover transition (`transform: translateY(-2px);`).
3. **Glassmorphism Components (`.card-glass`, `.card-glass-dark`)**: Implement standard background backdrops with `-webkit-backdrop-filter` and transparent overlay borders (`var(--glass-border)`).
4. **Equal Heights**: Grid layout cards must use `display: flex; flex-direction: column; height: 100%;` to align layout cards cleanly regardless of textual volume.

---

## 4. JavaScript Core Standards

Ensure all interactive and layout manipulation logic is encapsulated inside native vanilla scripts running under `DOMContentLoaded`. Avoid third-party JS plugins unless restricted to approved CDN libraries.

### A. Dynamic Layout Injection (Component Loader)
To keep layout templates DRY, partial blocks (`header.html`, `footer.html`, `mobile-nav.html`, and `page-hero.html`) must be fetched and injected asynchronously inside `main.js`. 
- Fetch files in parallel using `Promise.all()` to prevent layout rendering blocks.
- Ensure the partials load completely *before* triggering other element listeners.

```javascript
document.addEventListener('DOMContentLoaded', async () => {
  const loadPartials = async () => {
    const fetchAndInject = async (selector, url) => {
      const container = document.querySelector(selector);
      if (!container) return;
      try {
        const response = await fetch(url);
        if (response.ok) {
          container.innerHTML = await response.text();
        } else {
          console.error(`Failed to load component: ${url}`);
        }
      } catch (err) {
        console.error(`Error loading component: ${url}`, err);
      }
    };

    const pageHeroContainer = document.querySelector('#site-page-hero');
    const heroPromise = pageHeroContainer
      ? (async () => {
          await fetchAndInject('#site-page-hero', 'components/page-hero.html');
          
          // Inject dynamic texts from properties
          const title = pageHeroContainer.getAttribute('data-title') || '';
          const breadcrumb = pageHeroContainer.getAttribute('data-breadcrumb') || '';
          const parentLink = pageHeroContainer.getAttribute('data-parent-link') || '';
          const parentTitle = pageHeroContainer.getAttribute('data-parent-title') || '';

          const heroTitle = pageHeroContainer.querySelector('h1');
          if (heroTitle) heroTitle.textContent = title;

          const breadcrumbsDiv = pageHeroContainer.querySelector('.page-hero-breadcrumbs');
          if (breadcrumbsDiv) {
            let breadcrumbsHTML = `<a href="index.html">Home</a> <span>/</span> `;
            if (parentLink && parentTitle) {
              breadcrumbsHTML += `<a href="${parentLink}">${parentTitle}</a> <span>/</span> `;
            }
            breadcrumbsHTML += `<span>${breadcrumb}</span>`;
            breadcrumbsDiv.innerHTML = breadcrumbsHTML;
          }
        })()
      : Promise.resolve();

    // Parallel component fetching
    await Promise.all([
      fetchAndInject('#site-header', 'components/header.html'),
      fetchAndInject('#site-mobile-nav', 'components/mobile-nav.html'),
      fetchAndInject('#site-footer', 'components/footer.html'),
      heroPromise
    ]);

    // Apply Active Page Nav Highlights
    applyActiveNavigation();
  };

  await loadPartials();
  
  // Initialize other interactivity listeners below...
});
```

### B. Mobile Menu (Offcanvas Menu)
- Toggling the navigation trigger `.nav-toggle` must append `.active` classes to the mobile drawer panel (`.offcanvas-menu`) and backdrop wrapper (`.offcanvas-backdrop`).
- Toggle `body.overflow-hidden` to prevent window scrolling while the mobile menu is open.

### C. Testimonial Swiper Setup
The Swiper Carousel integration **must** enforce standard responsiveness breakpoints and visual structures:
- **Loop & Autoplay**: `loop: true`, `autoplay.delay: 5500`
- **Slide Gap Configurations**:
  - Desktop Viewports (`>= 1024px`): 3 slides, 30px gap.
  - Tablet Viewports (`>= 768px`): 2 slides, 24px gap.
  - Mobile Viewports (`< 768px`): 1 slide, 15px gap.
- **Control Toggles**: Floating arrows must be positioned outside the slider on desktop layouts and hidden entirely on viewports `< 1024px`.

---

## 5. Media & Asset Standards

- **Asset Naming**: Images, videos, and icons must follow a lowercase, underscore-delimited format (e.g., `hero_facility.png`, `fire_safety.png`).
- **File Optimization**: All images must be optimized and compressed for page speed. Use modern WebP format for large visuals, and vector SVGs for icons and simple graphics.
- **Placeholders**: Do not include raw placeholders or broken link frames in production. Use the image generator to provide clean, contextual visuals.

---

## 6. Project Checklist for Next Project Implementation
When initializing a new project following these standards, run through this verification checklist:

- [ ] Core directory structure established with separate `assets/css` and `assets/js` trees.
- [ ] `:root` variables in `style.css` populated with appropriate brand HSL colors.
- [ ] Nav layout components (`header.html`, `footer.html`, `mobile-nav.html`) detached to the `/components/` folder.
- [ ] HTML files contain placeholders with ids matching component target elements (`#site-header`, `#site-mobile-nav`, etc.).
- [ ] Global styling rules kept out of page stylesheets, imported via `@import` rules inside `style.css`.
- [ ] Every input field, submit button, and navigation item verified to possess unique, readable `id` tags.
- [ ] Dynamic breadcrumb mapping tested and functioning correctly across service routes.
- [ ] Carousel responsiveness configurations match Swiper JS breakpoint parameters.
