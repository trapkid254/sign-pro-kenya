(() => {
  const footerMarkup = `
    <div class="container footer-grid">
      <div class="footer-brand">
        <h3 data-config="company-name">Sign Pro Kenya Limited</h3>
        <p>Professional design and production for brands that want to stand out with confidence.</p>
      </div>

      <div>
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/services">Services</a></li>
          <li><a href="/projects">Projects</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>

      <div>
        <h4>Legal</h4>
        <ul>
          <li><a href="/privacy-policy">Privacy Policy</a></li>
          <li><a href="/terms-of-service">Terms of Service</a></li>
          <li><a href="/refund-policy">Refund Policy</a></li>
          <li><a href="/cookies-policy">Cookies Policy</a></li>
        </ul>
      </div>

      <div>
        <h4>Contact</h4>
        <ul>
          <li><a href="tel:+254799423262" data-phone-link><span data-config="phone">+254 799 423262</span></a></li>
          <li><a href="tel:+254740194496" data-phone-link><span data-config="phone2">+254 740 194 496</span></a></li>
          <li><a href="mailto:hello@signprokenya.co.ke" data-email-link><span data-config="email">hello@signprokenya.co.ke</span></a></li>
          <li>
            <a href="https://maps.app.goo.gl/P3YEELvt92W27W2YA?g_st=awb" target="_blank" rel="noopener noreferrer" data-map-link aria-label="Find Sign Pro Kenya Limited on Google Maps">
              <span data-config="address">Nairobi, Kenya</span>
              <span class="map-link-label">View on Google Maps ↗</span>
            </a>
          </li>
        </ul>
      </div>

      <div>
        <h4>Business Hours</h4>
        <ul>
          <li><span data-config="hours">Mon - Sat: 8:00 AM - 6:00 PM</span></li>
          <li><a data-whatsapp href="https://wa.me/254799423262?text=Hello%20Sign%20Pro%20Kenya" target="_blank" rel="noopener noreferrer">WhatsApp Enquiries</a></li>
        </ul>
      </div>

      <div class="footer-social">
        <h4>Follow Us</h4>
        <div class="social-icons">
          <a href="https://wa.me/254799423262" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.52 3.48A11.8 11.8 0 0 0 12.08 0C5.55 0 .23 5.3.23 11.83c0 2.08.55 4.12 1.6 5.91L.14 24l6.42-1.68a11.8 11.8 0 0 0 5.52 1.4h.01c6.53 0 11.84-5.31 11.84-11.84 0-3.16-1.23-6.13-3.41-8.4ZM12.09 21.7a9.8 9.8 0 0 1-4.99-1.36l-.36-.21-3.81 1 1.02-3.71-.24-.38a9.82 9.82 0 1 1 8.38 4.66Zm5.39-7.35c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.41-1.49-.89-.79-1.49-1.77-1.67-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.68-1.64-.93-2.24-.24-.59-.49-.51-.68-.52h-.58c-.2 0-.53.07-.8.38-.28.3-1.05 1.03-1.05 2.52s1.08 2.92 1.23 3.12c.15.2 2.13 3.25 5.16 4.56.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.78-.73 2.03-1.44.25-.71.25-1.32.18-1.44-.08-.13-.28-.2-.58-.35Z"/></svg>
          </a>
          <a href="https://www.instagram.com/sign.prokenya?rpxt=MTZxZWExd2Z4Mjl2Zw==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.5-3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/></svg>
          </a>
          <a href="https://vm.tiktok.com/ZS9y7jHRpfhar-hcFBy/" target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.6 6.2a5.3 5.3 0 0 1-3.3-3.1A5.5 5.5 0 0 1 16 1h-4v14.3a2.6 2.6 0 1 1-2.6-2.6c.3 0 .6.05.9.15V8.7a7 7 0 1 0 5.7 6.9V8.3a9.3 9.3 0 0 0 5 1.5V5.9a5.4 5.4 0 0 1-1.4.3Z"/></svg>
          </a>
          <a href="https://www.facebook.com/profile.php?id=100095260093062" target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1v-2c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.3V13h2.8v8h3.4Z"/></svg>
          </a>
          <a href="https://x.com/signprokenya/status/2122283162692706325?a=WOO5UN5YjPFvoJR50NE&s=19" target="_blank" rel="noopener noreferrer" aria-label="Sign Pro Kenya on X" title="X">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-7.4L5.5 22H2.4l7.3-8.4L1.9 2h6.5l4.4 6.9L18.9 2Zm-1.1 18h1.7L7.3 3.9H5.5L17.8 20Z"/></svg>
          </a>
          <a href="https://youtube.com/@signprokenyalimited?si=FhmCbn22Findf-3v" target="_blank" rel="noopener noreferrer" aria-label="Sign Pro Kenya on YouTube" title="YouTube">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 16 24 12 24 12s0-4-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z"/></svg>
          </a>
        </div>
      </div>
    </div>

    <div class="container footer-bottom">
      <span>© <span data-current-year></span> <span data-config="company-name">Sign Pro Kenya Limited</span>. All rights reserved.</span>
    </div>
  `;

  document.querySelectorAll('.footer').forEach((footer) => {
    footer.innerHTML = footerMarkup;
  });
})();
