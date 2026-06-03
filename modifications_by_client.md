# Client Modifications Log

This file tracks the design and content modifications requested by the client.

## June 2, 2026

### 1. Leadership Section Updates (`about.html`)
- **Requested Modification:** Comment out the image of Rajasekhar, make the leadership details content full-width, add one more person to the leadership section, and style them as side-by-side cards.
- **Actions Taken:**
  - Commented out the `leadership-image-wrap` blocks (and prepared fallback card banner styling) for both leaders in [about.html](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/about.html).
  - Restructured the section into a responsive grid (`.about-leaders-grid`) that renders as a single column on mobile and two equal columns (side-by-side cards) on larger screens.
  - Styled each leader in a modern, premium card (`.about-leader-card` in [about.css](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/assets/css/about.css)) featuring initials-based avatars ("R" and "K"), elegant quote symbols, italicized quote text, and subtle hover animations.
  - Added a second leader, **Kiran Kumar** (Operations Director), alongside **Rajasekhar** (Managing Partner) in this cards layout.

### 2. Homepage Services Section Updates (`index.html`)
- **Requested Modification:** Add matching service images to all cards under the "What we do" section, similar to the images shown on the services pages.
- **Actions Taken:**
  - Added [card-service-img] elements to all eight service cards in [index.html](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/index.html) referencing their corresponding high-quality site images (e.g., `service_fire_extinguishers.jpg`, `service_housekeeping.jpg`, etc.).
  - Added new `.card-service-img` styles to [service.css](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/assets/css/service.css) to handle proper aspect ratios, border radii, borders, margins, and smooth scale-up transitions on card hover (to match the styling conventions from the detail pages).

### 3. CSS Variable & Gradient Optimization (`style.css`)
- **Requested Modification:** Clean up the redundant variable mappings layer (e.g., mapping `--color-bg-light` to `var(--background)`) and avoid creating multiple unnecessary layers. Group linear gradients into variables to improve reuse, and ensure color scheme updates can be fully managed from a single base variable definition.
- **Actions Taken:**
  - Eliminated the entire `/* 2. Unified Semantic Color Mappings */` variable mapping block from [style.css](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/assets/css/style.css) to simplify root configurations.
  - Replaced all usages of mapped color variables (e.g., `var(--color-primary)`, `var(--color-bg-light)`, `var(--color-emerald)`) with direct base palette references (e.g., `var(--primary)`, `var(--background)`, `var(--emerald)`) across all CSS stylesheets, HTML files (`services/housekeeping.html` and `services/deep-cleaning.html`), and reference documentation (`CODING_STANDARDS.md`).
  - Implemented 100% dynamic color derivation in `:root` of [style.css](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/assets/css/style.css) using CSS `color-mix()`. Base color values are declared exactly once, and all related shades are calculated dynamically:
    - `--foreground`: Derived as a dark tint of `--primary` (`color-mix(in srgb, var(--primary) 60%, #000000)`).
    - `--background-dark`: Derived as a dark background shade of `--primary`.
    - `--primary-glow`: Derived as a lighter hover/glow tint of `--primary`.
    - `--primary-foreground`: Derived as a very soft, light tint of `--primary`.
    - `--border-dark`: Derived as a dark border tint of `--primary`.
    - `--emerald-soft` and `--emerald-dark`: Derived automatically from `--secondary`.
    - `--muted` and `--border`: Derived dynamically as soft gray tints of `--primary`.
    - `--muted-foreground`: Derived automatically as a faded version of `--foreground`.
  - Removed all redundant `--*-rgb` base variables (`--primary-rgb`, `--secondary-rgb`, `--accent-rgb`) and replaced all `rgba(var(--*-rgb), opacity)` references across all stylesheets with browser-evaluated `color-mix(in srgb, var(--*) opacity%, transparent)` rules.
  - Refactored all gradient variables under `:root` of [style.css](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/assets/css/style.css) (`--gradient-hero`, `--gradient-hero-overlay`, `--gradient-emerald`, `--gradient-soft`, `--gradient-accent`) to be fully derived from `--primary`, `--secondary`, and `--accent` using `color-mix()`, ensuring changing one base color updates all gradients site-wide.
  - Refactored `home.css`, `about.css`, `contact.css`, `header.css`, `page-hero.css`, and `service.css` to reference these unified gradient variables rather than declaring linear-gradient properties inline.

## June 3, 2026

### 1. Interactive Quote Stepper Form Wizard Integration (`contact.html`)
- **Requested Modification:** Bring the form from `quote.html` into the Contact Us page, replacing the legacy contact form with the Quote form.
- **Actions Taken:**
  - Integrated the stepper progress header indicators (`.stepper-progress`) and the multi-step form wizard (`#quote-wizard-form` inside `.quote-card`) into the left column (`#block-contact-form-col`) of the [contact.html](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/contact.html) page, expanding the services options list to cover all 8 specialized services from the homepage.
  - Removed all FontAwesome service icons from the titles in Step 1 checkbox cards inside [contact.html](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/contact.html).
  - Refactored `.checkbox-card` in [quote.css](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/assets/css/quote.css) to use a vertical flex layout (`flex-direction: column;`), wrapping the custom checkbox indicator and card title side-by-side inside a `.checkbox-card-header` wrapper, and placing the description paragraph (`.checkbox-card-desc`) below it to span the full width of the card. Restructured all cards in both Step 1 and Step 2 of [contact.html](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/contact.html) to match.
  - Configured the `.checkbox-grid` grid template columns in [quote.css](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/assets/css/quote.css) to display 3 cards per row on screen widths of 768px and wider (instead of 2 columns). This neatly formats Step 1's services into a 3x3 layout and Step 2's categories into a single row.
  - Linked the wizard stylesheet [quote.css](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/assets/css/quote.css) via `@import` in the master [style.css](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/assets/css/style.css).
  - Appended missing utility classes and success ticket container styles (`.success-frame`, `.success-icon-loop`, `.success-ticket-id`, `.init-hidden`, `.h-100px-no-resize`, and font size overrides) to [quote.css](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/assets/css/quote.css).
  - Configured all form feedback and indicator colors to use the dynamic variables theme (like `var(--primary)`, `var(--secondary)`, `var(--accent)`, `color-mix()`).
  - Restructured form input groups in Step 3 to follow the standard project convention (labels before inputs) ensuring adjacent-sibling CSS selectors (`.form-control.is-invalid + .invalid-feedback`) resolve validation error displays correctly.
  - Replaced the page-specific script at the bottom of [contact.html](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/contact.html) with [quote.js](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/assets/js/quote.js) to wire up step-by-step logic, slider changes, validations, and ticket reference generation.
  - Integrated the Google Sheets Web App endpoint inside [quote.js](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/assets/js/quote.js), submitting all completed quote form parameters asynchronously via a POST fetch request to automatically write submissions into the client's Google Sheet.

### 2. Centralised Dynamic Favicon Management (Site-wide)
- **Requested Modification:** Centralise the management of favicons into a single place.
- **Actions Taken:**
  - Implemented dynamic favicon injection logic (`injectFavicons`) inside [main.js](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/assets/js/main.js), which is loaded on every page of the website. The function dynamically appends the corrected relative path `<link>` tags (adjusted with `prefix` for subfolders) into the HTML `<head>`.
  - Removed all duplicated hardcoded favicon and manifest link tags from all HTML files ([index.html](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/index.html), [about.html](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/about.html), [contact.html](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/contact.html), and all service pages in `services/`), resolving them completely from a single central source of truth.
  - Updated [site.webmanifest](file:///c:/Users/ajaym/Documents/websites/client/Integrated%20Facility%20Management/assets/images/favicon/site.webmanifest) icon definitions to use relative paths (omitting the leading slash) so the browser can resolve web app manifests correctly regardless of site subfolder hosting.





