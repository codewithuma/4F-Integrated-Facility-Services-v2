document.addEventListener('DOMContentLoaded', async () => {
  // Check if this is a subpage (e.g. inside services/ directory)
  const isSubpage = document.body.getAttribute('data-is-subpage') === 'true' || window.location.pathname.includes('/services/');
  const prefix = isSubpage ? '../' : '';

  /**
   * Parallel Layout AJAX Components Injection
   */
  const loadPartials = async () => {
    // Local fallback HTML templates for CORS/Offline browsing resilience
    const templates = {
      'components/header.html': `<div class="container" id="site-header-container">
  <a class="logo" href="index.html" id="logo-link">
    <div class="logo-icon" id="logo-icon-4f">4F</div>
    <div class="logo-text" id="logo-text-block">
      <div class="logo-title" id="logo-title-text">4F Integrated</div>
      <div class="logo-sub" id="logo-sub-text">Facility Services</div>
    </div>
  </a>

  <nav class="nav-menu" id="nav-menu-desktop">
    <a class="nav-link" href="index.html" id="link-nav-home">Home</a>
    
    <div class="dropdown-container" id="dropdown-services-container">
      <button class="dropdown-toggle" id="btn-dropdown-services" aria-haspopup="true" aria-expanded="false">
        Services <i class="fa-solid fa-chevron-down" style="font-size: 10px; margin-left: 2px;"></i>
      </button>
      <div class="dropdown-menu" id="dropdown-services-menu" role="menu">
        <a href="services/fire-extinguishers.html" class="dropdown-item" id="link-dropdown-extinguishers" role="menuitem">Fire Extinguishers</a>
        <a href="services/fire-amc.html" class="dropdown-item" id="link-dropdown-amc" role="menuitem">Fire AMC</a>
        <a href="services/fire-noc.html" class="dropdown-item" id="link-dropdown-noc" role="menuitem">Fire NOC Consulting</a>
        <a href="services/housekeeping.html" class="dropdown-item" id="link-dropdown-housekeeping" role="menuitem">Housekeeping</a>
        <a href="services/deep-cleaning.html" class="dropdown-item" id="link-dropdown-cleaning" role="menuitem">Deep Cleaning</a>
        <a href="services/security.html" class="dropdown-item" id="link-dropdown-security" role="menuitem">Security</a>
        <a href="services/pest-control.html" class="dropdown-item" id="link-dropdown-pest" role="menuitem">Pest Control</a>
      </div>
    </div>

    <a href="about.html" class="nav-link" id="link-nav-about">About</a>
    <a href="index.html#why" class="nav-link" id="link-nav-why">Why Choose Us</a>
  </nav>

  <div class="header-actions" id="header-actions-block">
    <a href="contact.html" class="btn btn-primary btn-sm" id="btn-header-contact">Contact Us</a>
    <button class="nav-toggle" id="mobile-nav-toggle" aria-label="Toggle Navigation menu" aria-controls="site-mobile-nav">
      <i class="fa-solid fa-bars" id="icon-mobile-toggle"></i>
    </button>
  </div>
</div>`,

      'components/mobile-nav.html': `<!-- Offcanvas mobile navigation backdrop overlay -->
<div class="offcanvas-backdrop" id="mobile-nav-backdrop"></div>

<!-- Offcanvas mobile navigation panel drawer -->
<div class="offcanvas-menu" id="mobile-nav-menu" role="dialog" aria-modal="true" aria-label="Mobile Navigation Menu">
  <div class="offcanvas-header" id="mobile-nav-header-block">
    <a class="logo" href="index.html" id="mobile-logo-link">
      <div class="logo-icon" id="mobile-logo-icon">4F</div>
      <div class="logo-text" id="mobile-logo-text-block">
        <div class="logo-title" id="mobile-logo-title-text">4F Integrated</div>
        <div class="logo-sub" id="mobile-logo-sub-text">Facility Services</div>
      </div>
    </a>
    <button class="offcanvas-close" id="mobile-nav-close" aria-label="Close menu">
      <i class="fa-solid fa-xmark" id="icon-mobile-close"></i>
    </button>
  </div>

  <div class="offcanvas-body" id="mobile-nav-body-block">
    <nav class="offcanvas-nav" id="mobile-nav-links-block">
      <a class="offcanvas-link" href="index.html" id="mobile-link-home">Home</a>
      
      <div class="offcanvas-submenu-container" id="mobile-services-submenu-container">
        <button class="offcanvas-submenu-toggle" id="mobile-btn-submenu-toggle">
          Services <i class="fa-solid fa-chevron-down" style="font-size: 11px;"></i>
        </button>
        <div class="offcanvas-submenu" id="mobile-services-submenu">
          <a href="services/fire-extinguishers.html" class="offcanvas-submenu-link" id="mobile-link-extinguishers">Fire Extinguishers</a>
          <a href="services/fire-amc.html" class="offcanvas-submenu-link" id="mobile-link-amc">Fire AMC</a>
          <a href="services/fire-noc.html" class="offcanvas-submenu-link" id="mobile-link-noc">Fire NOC Consulting</a>
          <a href="services/housekeeping.html" class="offcanvas-submenu-link" id="mobile-link-housekeeping">Housekeeping</a>
          <a href="services/deep-cleaning.html" class="offcanvas-submenu-link" id="mobile-link-cleaning">Deep Cleaning</a>
          <a href="services/security.html" class="offcanvas-submenu-link" id="mobile-link-security">Security</a>
          <a href="services/pest-control.html" class="offcanvas-submenu-link" id="mobile-link-pest">Pest Control</a>
        </div>
      </div>

      <a href="about.html" class="offcanvas-link" id="mobile-link-about">About</a>
      <a href="index.html#why" class="offcanvas-link" id="mobile-link-why">Why Choose Us</a>
    </nav>

    <div class="offcanvas-contacts" id="mobile-nav-contacts-block">
      <div class="offcanvas-contact-item" id="mobile-contact-phone">
        <i class="fa-solid fa-phone" id="icon-mobile-contact-phone"></i>
        <a href="tel:+910000000000" id="link-mobile-phone-call">+91 00000 00000</a>
      </div>
      <div class="offcanvas-contact-item" id="mobile-contact-email">
        <i class="fa-solid fa-envelope" id="icon-mobile-contact-email"></i>
        <a href="mailto:hello@4fservices.in" id="link-mobile-email-send">hello@4fservices.in</a>
      </div>
      <div class="offcanvas-actions" id="mobile-nav-actions-block">
        <a href="contact.html" class="btn btn-primary" id="btn-mobile-contact">Get a Quote</a>
      </div>
    </div>
  </div>
</div>`,

      'components/footer.html': `<div class="container" id="site-footer-container">
  <div class="grid grid-4" id="footer-grid-block">
    <!-- Brand identity column -->
    <div class="footer-brand" id="footer-brand-column">
      <a class="logo" href="index.html" id="footer-logo-link">
        <div class="logo-icon" id="footer-logo-icon">4F</div>
        <div class="logo-text" id="footer-logo-text-block">
          <div class="logo-title" id="footer-logo-title-text">4F Integrated</div>
          <div class="logo-sub" id="footer-logo-sub-text">Facility Services</div>
        </div>
      </a>
      <p class="brand-desc" id="footer-brand-desc-text">
        Your trusted partner in integrated facility management. We combine operational excellence with a commitment to quality to bring you absolute peace of mind.
      </p>
    </div>

    <!-- Services list column -->
    <div class="footer-services-links" id="footer-services-column">
      <h4 class="footer-title" id="footer-services-title">Services</h4>
      <ul class="footer-links" id="footer-services-links-list">
        <li class="footer-link-item"><a href="services/fire-extinguishers.html" id="footer-link-extinguishers">Fire Extinguishers</a></li>
        <li class="footer-link-item"><a href="services/fire-amc.html" id="footer-link-amc">Fire AMC</a></li>
        <li class="footer-link-item"><a href="services/fire-noc.html" id="footer-link-noc">Fire NOC Consulting</a></li>
        <li class="footer-link-item"><a href="services/housekeeping.html" id="footer-link-housekeeping">Housekeeping</a></li>
        <li class="footer-link-item"><a href="services/deep-cleaning.html" id="footer-link-cleaning">Deep Cleaning</a></li>
        <li class="footer-link-item"><a href="services/security.html" id="footer-link-security">Security</a></li>
        <li class="footer-link-item"><a href="services/pest-control.html" id="footer-link-pest">Pest Control</a></li>
      </ul>
    </div>

    <!-- Company & Contact column -->
    <div class="footer-company-links" id="footer-company-column">
      <h4 class="footer-title" id="footer-company-title">Company</h4>
      <ul class="footer-links" id="footer-company-links-list" style="margin-bottom: var(--space-lg);">
        <li class="footer-link-item"><a href="about.html" id="footer-link-about">About Us</a></li>
        <li class="footer-link-item"><a href="contact.html" id="footer-link-contact">Contact</a></li>
      </ul>

      <h4 class="footer-title" id="footer-contact-title">Get in Touch</h4>
      <div class="footer-contact" id="footer-contact-block">
        <div class="footer-contact-item" id="footer-contact-phone">
          <i class="fa-solid fa-phone" id="icon-footer-contact-phone"></i>
          <span id="footer-phone-text"><a href="tel:+910000000000" id="link-footer-phone-call">+91 00000 00000</a></span>
        </div>
        <div class="footer-contact-item" id="footer-contact-email">
          <i class="fa-solid fa-envelope" id="icon-footer-contact-email"></i>
          <span id="footer-email-text"><a href="mailto:hello@4fservices.in" id="link-footer-email-send">hello@4fservices.in</a></span>
        </div>
        <div class="footer-contact-item" id="footer-contact-address">
          <i class="fa-solid fa-map-pin" id="icon-footer-contact-address"></i>
          <span id="footer-address-text">Corporate HQ, India</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Copyright and operational message footer bottom -->
  <div class="footer-bottom" id="footer-bottom-block">
    <p id="copyright-text">© 2026 4F Integrated Facility Services. All rights reserved.</p>
    <p id="operational-motto-text">Operational excellence. Absolute peace of mind.</p>
  </div>
</div>`,

      'components/page-hero.html': `<div class="page-hero-overlay" id="page-hero-mask"></div>
<div class="container" id="page-hero-content-block">
  <a class="page-hero-back" id="btn-hero-back-link" href="index.html">
    <i class="fa-solid fa-arrow-left" id="icon-hero-back"></i> Back to Home
  </a>
  <div class="page-hero-breadcrumbs" id="page-hero-breadcrumbs-div"></div>
  <div class="page-hero-tag" id="page-hero-tag-text"></div>
  <h1 class="page-hero-title" data-aos="fade-up" id="page-hero-heading-text"></h1>
  <p class="page-hero-desc" data-aos="fade-up" data-aos-delay="100" id="page-hero-desc-text"></p>
</div>`
    };

    const getTemplateKey = (url) => {
      if (url.includes('header.html')) return 'components/header.html';
      if (url.includes('mobile-nav.html')) return 'components/mobile-nav.html';
      if (url.includes('footer.html')) return 'components/footer.html';
      if (url.includes('page-hero.html')) return 'components/page-hero.html';
      return '';
    };

    const fetchAndInject = async (selector, url) => {
      const container = document.querySelector(selector);
      if (!container) return;
      try {
        const response = await fetch(url);
        if (response.ok) {
          container.innerHTML = await response.text();
        } else {
          console.warn(`Failed to fetch component from server: ${url}. Using local fallback.`);
          const key = getTemplateKey(url);
          if (templates[key]) {
            container.innerHTML = templates[key];
          }
        }
      } catch (err) {
        console.warn(`CORS/Fetch error for ${url}. Running offline fallback injection.`, err);
        const key = getTemplateKey(url);
        if (templates[key]) {
          container.innerHTML = templates[key];
        }
      }
    };

    // Load page hero component placeholder if it exists on page
    const pageHeroContainer = document.querySelector('#site-page-hero');
    const heroPromise = pageHeroContainer
      ? (async () => {
          await fetchAndInject('#site-page-hero', prefix + 'components/page-hero.html');
          
          // Inject dynamic breadcrumbs and texts from attributes
          const title = pageHeroContainer.getAttribute('data-title') || '';
          const desc = pageHeroContainer.getAttribute('data-desc') || '';
          const tag = pageHeroContainer.getAttribute('data-tag') || '';
          const breadcrumb = pageHeroContainer.getAttribute('data-breadcrumb') || '';
          const parentLink = pageHeroContainer.getAttribute('data-parent-link') || '';
          const parentTitle = pageHeroContainer.getAttribute('data-parent-title') || '';

          const heroTitle = pageHeroContainer.querySelector('#page-hero-heading-text');
          if (heroTitle) heroTitle.textContent = title;

          const heroDesc = pageHeroContainer.querySelector('#page-hero-desc-text');
          if (heroDesc) heroDesc.textContent = desc;

          const heroTag = pageHeroContainer.querySelector('#page-hero-tag-text');
          if (heroTag) heroTag.textContent = tag;

          const breadcrumbsDiv = pageHeroContainer.querySelector('#page-hero-breadcrumbs-div');
          if (breadcrumbsDiv) {
            let breadcrumbsHTML = `<a href="${prefix}index.html">Home</a> <span>/</span> `;
            if (parentLink && parentTitle) {
              breadcrumbsHTML += `<a href="${prefix}${parentLink}">${parentTitle}</a> <span>/</span> `;
            }
            breadcrumbsHTML += `<span>${breadcrumb}</span>`;
            breadcrumbsDiv.innerHTML = breadcrumbsHTML;
          }

          // Adjust back button path
          const backBtn = pageHeroContainer.querySelector('#btn-hero-back-link');
          if (backBtn) {
            backBtn.setAttribute('href', prefix + 'index.html');
          }
        })()
      : Promise.resolve();

    // Parallel fetch components
    await Promise.all([
      fetchAndInject('#site-header', prefix + 'components/header.html'),
      fetchAndInject('#site-mobile-nav', prefix + 'components/mobile-nav.html'),
      fetchAndInject('#site-footer', prefix + 'components/footer.html'),
      heroPromise
    ]);

    // Perform relative link resolutions for static browsability
    resolveRelativeLinks();

    // Initialize DOM element event listeners after components are loaded completely
    initHeaderEvents();
    initMobileNavEvents();
    applyActiveNavigation();
  };

  /**
   * Relative link prefix adjuster for subpages
   */
  const resolveRelativeLinks = () => {
    const containers = document.querySelectorAll('#site-header, #site-mobile-nav, #site-footer');
    
    containers.forEach(container => {
      const links = container.querySelectorAll('a');
      links.forEach(link => {
        const href = link.getAttribute('href');
        
        // Skip links that are already absolute or are external protocols
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) {
          return;
        }

        // Adjust React/Lovable style absolute routing leads into local relative layouts
        let adjustedHref = href;
        if (href.startsWith('/')) {
          if (href === '/') {
            adjustedHref = 'index.html';
          } else if (href.startsWith('/services/')) {
            adjustedHref = 'services/' + href.substring(10) + '.html';
          } else {
            adjustedHref = href.substring(1) + '.html';
          }
        }

        // Prepend prefix to adjust paths correctly
        link.setAttribute('href', prefix + adjustedHref);
      });
    });
  };

  /**
   * Header events (Sticky scrolling and dropdown toggling)
   */
  const initHeaderEvents = () => {
    const header = document.querySelector('#site-header');
    if (header) {
      const checkScroll = () => {
        if (window.scrollY > 20) {
          header.classList.add('sticky-scrolled');
        } else {
          header.classList.remove('sticky-scrolled');
        }
      };

      // Trigger scroll checks
      window.addEventListener('scroll', checkScroll);
      checkScroll();
    }

    // Toggle dropdown on accessibility click events
    const dropdownToggle = document.querySelector('#btn-dropdown-services');
    const dropdownMenu = document.querySelector('#dropdown-services-menu');
    
    if (dropdownToggle && dropdownMenu) {
      dropdownToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
        dropdownToggle.setAttribute('aria-expanded', !expanded);
        dropdownMenu.classList.toggle('active');
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        dropdownToggle.setAttribute('aria-expanded', 'false');
        dropdownMenu.classList.remove('active');
      });
    }
  };

  /**
   * Mobile navigation sliding offcanvas toggles
   */
  const initMobileNavEvents = () => {
    const toggleBtn = document.querySelector('#mobile-nav-toggle');
    const closeBtn = document.querySelector('#mobile-nav-close');
    const backdrop = document.querySelector('#mobile-nav-backdrop');
    const drawer = document.querySelector('#mobile-nav-menu');

    if (toggleBtn && drawer && backdrop) {
      const openDrawer = () => {
        drawer.classList.add('active');
        backdrop.classList.add('active');
        document.body.classList.add('overflow-hidden');
      };

      const closeDrawer = () => {
        drawer.classList.remove('active');
        backdrop.classList.remove('active');
        document.body.classList.remove('overflow-hidden');
      };

      toggleBtn.addEventListener('click', openDrawer);
      if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
      backdrop.addEventListener('click', closeDrawer);
    }

    // Collapsible submenus toggler inside mobile menu
    const submenuToggle = document.querySelector('#mobile-btn-submenu-toggle');
    const submenu = document.querySelector('#mobile-services-submenu');

    if (submenuToggle && submenu) {
      submenuToggle.addEventListener('click', () => {
        const icon = submenuToggle.querySelector('i');
        submenu.classList.toggle('active');
        
        if (submenu.classList.contains('active')) {
          if (icon) icon.className = 'fa-solid fa-chevron-up';
        } else {
          if (icon) icon.className = 'fa-solid fa-chevron-down';
        }
      });
    }
  };

  /**
   * Highlights the active page navigation items
   */
  const applyActiveNavigation = () => {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
    
    // Select links in both header nav and offcanvas mobile menu
    const menuLinks = document.querySelectorAll('#nav-menu-desktop a, #mobile-nav-links-block a');
    
    menuLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkPage = href.substring(href.lastIndexOf('/') + 1);
      
      // Strict equality comparison for matching active routes
      if (linkPage === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  // Run Asynchronous Component Loader
  await loadPartials();

  // Handle WhatsApp floating interaction actions
  const whatsappFloat = document.querySelector('.whatsapp-float');
  if (whatsappFloat) {
    whatsappFloat.addEventListener('click', (e) => {
      e.preventDefault();
      // Open WhatsApp chat in a new tab safely with mock phone details
      window.open('https://wa.me/910000000000', '_blank', 'noopener,noreferrer');
    });
  }

  // Safe programmatic initialization of AOS Animations
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out',
      delay: 50
    });
  }
});
