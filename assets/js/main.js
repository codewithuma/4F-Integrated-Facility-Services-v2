document.addEventListener('DOMContentLoaded', async () => {
  // Check if this is a subpage (e.g. inside services/ directory)
  const isSubpage = document.body.getAttribute('data-is-subpage') === 'true' || window.location.pathname.includes('/services/');
  const prefix = isSubpage ? '../' : '';

  /**
   * Inject favicons into head dynamically from a single place
   */
  const injectFavicons = () => {
    // Check if favicons/manifest are already present to prevent duplicate injection
    if (document.querySelector('link[rel="manifest"]') || document.querySelector('link[sizes="96x96"]')) {
      return;
    }
    const faviconHTML = `
      <link rel="icon" type="image/png" href="${prefix}assets/images/favicon/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/svg+xml" href="${prefix}assets/images/favicon/favicon.svg" />
      <link rel="shortcut icon" href="${prefix}assets/images/favicon/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="${prefix}assets/images/favicon/apple-touch-icon.png" />
      <link rel="manifest" href="${prefix}assets/images/favicon/site.webmanifest" />
    `;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = faviconHTML.trim();
    Array.from(tempDiv.childNodes).forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        document.head.appendChild(node);
      }
    });
  };

  // Run favicon injection
  injectFavicons();

  /**
   * Parallel Layout AJAX Components Injection
   */
  const loadPartials = async () => {
    const fetchAndInject = async (selector, url) => {
      const container = document.querySelector(selector);
      if (!container) return;
      try {
        const response = await fetch(url);
        if (response.ok) {
          container.innerHTML = await response.text();
        } else {
          console.warn(`Failed to fetch component from server: ${url}`);
        }
      } catch (err) {
        console.error(`CORS/Fetch error for ${url}`, err);
      }
    };

    // Load page hero component placeholder if it exists on page
    const pageHeroContainer = document.querySelector('#site-page-hero');
    const heroPromise = pageHeroContainer
      ? fetchAndInject('#site-page-hero', prefix + 'components/page-hero.html').then(() => {
          const attr = (name) => pageHeroContainer.getAttribute(name) || '';
          const setVal = (sel, val) => {
            const el = pageHeroContainer.querySelector(sel);
            if (el) el.textContent = val;
          };
          
          setVal('#page-hero-heading-text', attr('data-title'));
          setVal('#page-hero-desc-text', attr('data-desc'));
          setVal('#page-hero-tag-text', attr('data-tag'));

          const breadcrumbsDiv = pageHeroContainer.querySelector('#page-hero-breadcrumbs-div');
          if (breadcrumbsDiv) {
            let html = `<a href="${prefix || './'}">Home</a> <span>/</span> `;
            if (attr('data-parent-link') && attr('data-parent-title')) {
              html += `<a href="${prefix}${attr('data-parent-link')}">${attr('data-parent-title')}</a> <span>/</span> `;
            }
            html += `<span>${attr('data-breadcrumb')}</span>`;
            breadcrumbsDiv.innerHTML = html;
          }

          const backBtn = pageHeroContainer.querySelector('#btn-hero-back-link');
          if (backBtn) backBtn.setAttribute('href', prefix || './');
        })
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

        // Extremely simple: prepend the relative folder prefix ('../' for subpages, empty for root)
        link.setAttribute('href', prefix + href);
      });

      // Adjust image paths for nested subpages dynamically
      const imgs = container.querySelectorAll('img');
      imgs.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith('data:')) {
          img.setAttribute('src', prefix + src);
        }
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

      toggleBtn.addEventListener('click', () => {
        drawer.classList.contains('active') ? closeDrawer() : openDrawer();
      });
      if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
      backdrop.addEventListener('click', closeDrawer);

      drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeDrawer);
      });
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
    let currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';
    if (currentPage === '' || currentPage === '/') {
      currentPage = 'index.html';
    }
    
    const menuLinks = document.querySelectorAll('#nav-menu-desktop a, #mobile-nav-links-block a');
    
    menuLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;

      let linkPage = href.substring(href.lastIndexOf('/') + 1) || 'index.html';
      if (linkPage.includes('#')) {
        linkPage = linkPage.substring(0, linkPage.indexOf('#'));
      }
      if (linkPage === '' || linkPage === '.' || linkPage === './') {
        linkPage = 'index.html';
      }
      
      // Toggle active CSS class if link page matches the current active route
      if (linkPage === currentPage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  // Run Asynchronous Component Loader
  await loadPartials();

  // Inject and initialize WhatsApp Floating Button dynamically
  const injectWhatsappFloat = () => {
    if (document.querySelector('.whatsapp-float')) return;
    const a = document.createElement('a');
    a.href = '#';
    a.className = 'whatsapp-float';
    a.id = 'btn-whatsapp-floating';
    a.setAttribute('aria-label', 'Chat on WhatsApp');
    a.innerHTML = '<i class="fa-brands fa-whatsapp"></i>';
    document.body.appendChild(a);

    a.addEventListener('click', (e) => {
      e.preventDefault();
      const waMessage = encodeURIComponent("Hi 4F Integrated Facility Services, I would like to inquire about facility management services for my property.");
      window.open(`https://wa.me/918886320444?text=${waMessage}`, '_blank', 'noopener,noreferrer');
    });
  };
  injectWhatsappFloat();

  // Safe programmatic initialization of AOS Animations
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out',
      delay: 50
    });
  }

  // Testimonial Swiper Slider Carousel
  if (document.querySelector('.testimonial-swiper')) {
    new Swiper('.testimonial-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      grabCursor: true,
      autoplay: {
        delay: 5500,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true,
      },
      navigation: {
        nextEl: '.slider-btn-next',
        prevEl: '.slider-btn-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        }
      }
    });
  }
});
