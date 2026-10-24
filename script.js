document.addEventListener('DOMContentLoaded', () => {
  const config = window.companyConfig || {};

  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node && value) node.textContent = value;
  };

  setText('[data-config="company-name"]', config.companyName || 'SIGN PRO KENYA LIMITED');
  setText('[data-config="company-tagline"]', config.tagline || 'Professional Signage, Printing & Branding Solutions');
  setText('[data-config="phone"]', config.phone || '+254 799 423262');
  setText('[data-config="email"]', config.email || 'hello@signprokenya.co.ke');
  setText('[data-config="address"]', config.address || 'Nairobi, Kenya');
  setText('[data-config="hours"]', config.hours || 'Mon - Sat: 8:00 AM - 6:00 PM');

  const whatsappNumber = config.whatsappNumber || '254799423262';
  const whatsappMessage = encodeURIComponent(config.whatsappMessage || 'Hello Sign Pro Kenya Limited, I would like to request a quotation.');

  document.querySelectorAll('[data-whatsapp]').forEach((link) => {
    link.href = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });

  document.querySelectorAll('[data-phone-link]').forEach((link) => {
    link.href = `tel:${config.phone.replace(/\s/g, '')}`;
  });

  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.classList.toggle('is-open', isOpen);
    });

    navMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.classList.remove('is-open');
      });
    });
  }

  const quoteForm = document.querySelector('#quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(quoteForm);
      const name = (formData.get('name') || 'Client').toString();
      const service = (formData.get('service') || 'signage').toString();
      const text = `Hello Sign Pro Kenya Limited, my name is ${name}. I would like a quote for ${service}.`;
      const encoded = encodeURIComponent(text);

      const success = document.querySelector('.form-status');
      if (success) {
        success.textContent = 'Thank you! Your request has been prepared and will be sent via WhatsApp.';
        success.classList.add('show');
      }

      window.open(`https://wa.me/${whatsappNumber}?text=${encoded}`, '_blank', 'noopener,noreferrer');
      quoteForm.reset();
    });
  }

  const currentPage = document.body.dataset.page;
  document.querySelectorAll('.nav-menu a').forEach((link) => {
    const href = link.getAttribute('href');
    if (currentPage && href && href.includes(currentPage)) {
      link.classList.add('active');
    }
  });

  const yearTarget = document.querySelector('[data-current-year]');
  if (yearTarget) yearTarget.textContent = new Date().getFullYear();
});
