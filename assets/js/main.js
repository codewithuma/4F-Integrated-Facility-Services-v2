document.addEventListener('DOMContentLoaded', async () => {
  // Check if this is a subpage (e.g. inside services/ directory)
  const isSubpage = document.body.getAttribute('data-is-subpage') === 'true' || window.location.pathname.includes('/services/');
  const prefix = isSubpage ? '../' : '';

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
      let previouslyFocusedElement = null;

      const openDrawer = () => {
        previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        drawer.classList.add('active');
        backdrop.classList.add('active');
        drawer.setAttribute('aria-hidden', 'false');
        backdrop.setAttribute('aria-hidden', 'false');
        toggleBtn.setAttribute('aria-expanded', 'true');
        document.body.classList.add('overflow-hidden');

        const firstFocusable = drawer.querySelector('button, a, [tabindex]:not([tabindex="-1"])');
        window.setTimeout(() => {
          (closeBtn || firstFocusable)?.focus();
        }, 0);
      };

      const closeDrawer = (returnFocus = true) => {
        drawer.classList.remove('active');
        backdrop.classList.remove('active');
        drawer.setAttribute('aria-hidden', 'true');
        backdrop.setAttribute('aria-hidden', 'true');
        toggleBtn.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('overflow-hidden');
        const scrollingElement = document.scrollingElement || document.documentElement;
        scrollingElement.scrollLeft = 0;
        document.body.scrollLeft = 0;

        if (returnFocus && previouslyFocusedElement) {
          previouslyFocusedElement.focus();
        }
      };

      toggleBtn.addEventListener('click', () => {
        if (drawer.classList.contains('active')) {
          closeDrawer();
        } else {
          openDrawer();
        }
      });
      if (closeBtn) closeBtn.addEventListener('click', () => closeDrawer());
      backdrop.addEventListener('click', () => closeDrawer());

      drawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => closeDrawer(false));
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && drawer.classList.contains('active')) {
          closeDrawer();
        }
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
