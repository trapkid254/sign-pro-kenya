document.addEventListener('DOMContentLoaded', () => {
  const config = window.companyConfig || {};
  const heroTrack = document.querySelector('.hero-carousel-track');
  const themeToggle = document.querySelector('.theme-toggle');

  const updateThemeToggle = () => {
    const isLight = document.documentElement.dataset.theme === 'light';
    const action = isLight ? 'Switch to black theme' : 'Switch to light theme';
    if (themeToggle) {
      themeToggle.textContent = isLight ? '☾' : '☀';
      themeToggle.setAttribute('aria-label', action);
      themeToggle.title = action;
    }
  };

  updateThemeToggle();
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.documentElement.dataset.theme =
        document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('site-theme', document.documentElement.dataset.theme);
      updateThemeToggle();
    });
  }

  if (heroTrack && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const slides = Array.from(heroTrack.children);
    const slideCount = slides.length;
    const slideWidth = 100 / (slideCount * 2);
    let currentSlide = 0;
    let carouselTimer;

    slides.forEach((slide) => heroTrack.appendChild(slide.cloneNode(true)));
    heroTrack.style.width = `${slideCount * 200}%`;
    heroTrack.querySelectorAll('img').forEach((slide) => {
      slide.style.flexBasis = `${slideWidth}%`;
      slide.style.width = `${slideWidth}%`;
    });

    const scheduleNextSlide = () => {
      carouselTimer = window.setTimeout(() => {
        currentSlide += 1;
        heroTrack.style.transform = `translateX(-${currentSlide * slideWidth}%)`;

        carouselTimer = window.setTimeout(() => {
          if (currentSlide === slideCount) {
            heroTrack.style.transition = 'none';
            currentSlide = 0;
            heroTrack.style.transform = 'translateX(0)';
            heroTrack.getBoundingClientRect();
            heroTrack.style.transition = '';
          }
          scheduleNextSlide();
        }, 1000);
      }, 7000);
    };

    if (slideCount > 1) scheduleNextSlide();
  }

  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node && value) node.textContent = value;
  };

  const setHref = (selector, value) => {
    const node = document.querySelector(selector);
    if (node && value) node.href = value;
  };

  const companyName = config.companyName || 'Sign Pro Kenya Limited';
  const phone = config.phone || '+254 799 423262';
  const email = config.email || 'hello@signprokenya.co.ke';
  const address = config.address || 'Nairobi, Kenya';
  const hours = config.hours || 'Mon - Sat: 8:00 AM - 6:00 PM';
  const whatsappNumber = config.whatsappNumber || '254799423262';
  const whatsappMessage = encodeURIComponent(config.whatsappMessage || 'Hello Sign Pro Kenya Limited, I would like to request a quotation.');

  setText('[data-config="company-name"]', companyName);
  setText('[data-config="company-tagline"]', config.tagline || 'Professional Signage, Printing & Branding Solutions');
  setText('[data-config="phone"]', phone);
  setText('[data-config="email"]', email);
  setText('[data-config="address"]', address);
  setText('[data-config="hours"]', hours);
  setText('[data-config="company-copy"]', companyName);

  document.querySelectorAll('[data-phone-link]').forEach((link) => {
    link.href = `tel:${phone.replace(/\s+/g, '')}`;
  });

  document.querySelectorAll('[data-email-link]').forEach((link) => {
    link.href = `mailto:${email}`;
  });

  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.href = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  document.querySelectorAll('[data-map-link]').forEach((link) => {
    link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => { navMenu.classList.remove('is-open'); navToggle.setAttribute('aria-expanded', 'false'); });
    });
  }

  const currentPage = document.body.dataset.page;
  document.querySelectorAll('.nav-menu a').forEach((link) => {
    const href = link.getAttribute('href');
    if (currentPage && href && href.includes(currentPage)) {
      link.classList.add('active');
    }
  });

  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const emptyState = document.querySelector('.empty-state');

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        filterButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
        let visibleCount = 0;

        projectCards.forEach((card) => {
          const matches = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('hidden', !matches);
          if (matches) visibleCount += 1;
        });

        if (emptyState) emptyState.classList.toggle('show', visibleCount === 0);
      });
    });
  }

  const lightbox = document.querySelector('.lightbox');
  const lightboxImage = document.querySelector('.lightbox-image');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxText = document.querySelector('.lightbox-text');
  const closeLightbox = document.querySelector('.lightbox-close');

  document.querySelectorAll('[data-project-open]').forEach((button) => {
    button.addEventListener('click', () => {
      const title = button.dataset.projectTitle || 'Project';
      const text = button.dataset.projectText || 'Project information';
      const image = button.dataset.projectImage || '';
      if (lightbox && lightboxImage) {
        lightboxImage.src = image;
        lightboxImage.alt = title;
      }
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxText) lightboxText.textContent = text;
      if (lightbox) lightbox.classList.add('open');
    });
  });

  const closeModal = () => { if (lightbox) lightbox.classList.remove('open'); };
  if (closeLightbox) closeLightbox.addEventListener('click', closeModal);
  if (lightbox) lightbox.addEventListener('click', (event) => { if (event.target === lightbox) closeModal(); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && lightbox) closeModal(); });

  const quoteForm = document.querySelector('#quote-form');
  if (quoteForm) {
    const status = quoteForm.querySelector('.form-status');
    const submitButton = quoteForm.querySelector('button[type="submit"]');

    const showFieldError = (fieldName, message) => {
      const field = quoteForm.querySelector(`[data-error-for="${fieldName}"]`);
      if (field) field.textContent = message || '';
    };

    const clearErrors = () => {
      quoteForm.querySelectorAll('.field-error').forEach((el) => { el.textContent = ''; });
      if (status) { status.textContent = ''; status.classList.remove('show', 'error'); }
    };

    const setLoading = (isLoading) => {
      if (submitButton) {
        submitButton.disabled = isLoading;
        submitButton.textContent = isLoading ? 'Submitting...' : 'Send Request';
      }
    };

    quoteForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      clearErrors();

      const formData = new FormData(quoteForm);
      const payload = {
        name: String(formData.get('name') || '').trim(),
        businessName: String(formData.get('businessName') || '').trim(),
        phone: String(formData.get('phone') || '').trim(),
        email: String(formData.get('email') || '').trim(),
        service: String(formData.get('service') || '').trim(),
        projectDescription: String(formData.get('projectDescription') || '').trim(),
        dimensions: String(formData.get('dimensions') || '').trim(),
        quantity: String(formData.get('quantity') || '').trim(),
        location: String(formData.get('location') || '').trim(),
        preferredDate: String(formData.get('preferredDate') || '').trim(),
        contactMethod: String(formData.get('contactMethod') || '').trim()
      };

      const errorMap = {};
      if (!payload.name) errorMap.name = 'Full name is required.';
      if (!payload.phone) errorMap.phone = 'Phone number is required.';
      if (!payload.service) errorMap.service = 'Please select a service.';
      if (!payload.projectDescription) errorMap.projectDescription = 'Project description is required.';
      if (payload.phone && !/^[+()\d\s-]{7,20}$/.test(payload.phone)) errorMap.phone = 'Enter a valid phone number.';
      if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) errorMap.email = 'Enter a valid email address.';

      Object.entries(errorMap).forEach(([key, value]) => showFieldError(key, value));
      if (Object.keys(errorMap).length) {
        if (status) { status.textContent = 'Please correct the highlighted fields and try again.'; status.classList.add('show', 'error'); }
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/api/enquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          const errors = result.errors || {};
          Object.entries(errors).forEach(([key, value]) => showFieldError(key, value));
          if (status) {
            status.textContent = result.message || 'There was a problem sending your request.';
            status.classList.add('show', 'error');
          }
          return;
        }

        if (status) {
          status.textContent = result.message || 'Your enquiry was sent successfully.';
          status.classList.remove('error');
          status.classList.add('show');
        }
        quoteForm.reset();
      } catch (error) {
        if (status) {
          status.textContent = 'The enquiry could not be sent. Please try again or use WhatsApp.';
          status.classList.add('show', 'error');
        }
      } finally {
        setLoading(false);
      }
    });
  }

  const yearTarget = document.querySelector('[data-current-year]');
  if (yearTarget) yearTarget.textContent = new Date().getFullYear();

  const pageTitle = document.title || `${companyName} | Signage & Branding`;
  document.title = pageTitle;
});
