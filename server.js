const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const siteUrl = new URL(process.env.SITE_URL || 'https://signprokenyaltd.co.ke');
const trustedProxyHops = Number(
  process.env.TRUST_PROXY_HOPS === undefined
    ? (process.env.VERCEL === '1' ? 1 : 0)
    : process.env.TRUST_PROXY_HOPS
);

if (!Number.isInteger(trustedProxyHops) || trustedProxyHops < 0) {
  throw new Error('TRUST_PROXY_HOPS must be a non-negative integer.');
}

if (isProduction && siteUrl.protocol !== 'https:') {
  throw new Error('SITE_URL must use HTTPS in production.');
}

app.set('trust proxy', trustedProxyHops);

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      baseUri: ["'self'"],
      connectSrc: ["'self'", 'https://www.google-analytics.com'],
      defaultSrc: ["'self'"],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      frameSrc: ['https://www.google.com'],
      imgSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      scriptSrc: ["'self'", 'https://www.googletagmanager.com', 'https://www.google-analytics.com', "'sha256-q//MkFLzhqWEzbQ/tD/O/wtl2tDUpfVMyDtv/BeBXA8='"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      ...(isProduction ? { upgradeInsecureRequests: [] } : {})
    }
  },
  hsts: isProduction ? { maxAge: 15552000 } : false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

app.use((req, res, next) => {
  if (isProduction && !req.secure) {
    return res.redirect(308, `${siteUrl.origin}${req.originalUrl}`);
  }
  return next();
});

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: false, limit: '16kb' }));

const config = {
  companyName: process.env.COMPANY_NAME || 'Sign Pro Kenya Limited',
  phone: process.env.PHONE || '+254 799 423262',
  whatsappNumber: process.env.WHATSAPP_NUMBER || '254799423262',
  email: process.env.EMAIL || 'hello@signprokenya.co.ke',
  address: process.env.ADDRESS || 'Nairobi, Kenya',
  businessHours: process.env.BUSINESS_HOURS || 'Mon - Sat: 8:00 AM - 6:00 PM',
  whatsappMessage: process.env.WHATSAPP_MESSAGE || 'Hello Sign Pro Kenya Limited, I would like to request a quotation.'
};

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[char]));
}

function validateEnquiry(payload) {
  const errors = {};
  const fieldLimits = {
    name: 100,
    businessName: 150,
    phone: 20,
    email: 254,
    service: 50,
    projectDescription: 5000,
    dimensions: 100,
    quantity: 30,
    location: 150,
    preferredDate: 10,
    contactMethod: 20
  };
  const required = ['name', 'phone', 'service', 'projectDescription'];

  Object.entries(fieldLimits).forEach(([field, maxLength]) => {
    const value = payload[field];
    if (typeof value !== 'string') {
      if (required.includes(field) || value !== undefined && value !== null) {
        errors[field] = 'Enter a valid value.';
      }
    } else {
      payload[field] = value.trim();
      if (payload[field].length > maxLength) {
        errors[field] = `Must be ${maxLength} characters or fewer.`;
      }
      if (required.includes(field) && !payload[field]) {
        errors[field] = 'This field is required.';
      }
    }
  });

  if (payload.phone && !errors.phone && !/^[+()\d\s-]{7,20}$/.test(payload.phone)) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (payload.email && !errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (payload.service && !errors.service && !['Signage', 'Printing', 'Vehicle Branding', 'Office Branding', 'Graphic Design', 'Large-Format Printing'].includes(payload.service)) {
    errors.service = 'Please choose a valid service.';
  }

  if (payload.contactMethod && !errors.contactMethod && !['Phone', 'Email', 'WhatsApp'].includes(payload.contactMethod)) {
    errors.contactMethod = 'Please choose a valid contact method.';
  }

  if (payload.preferredDate && !errors.preferredDate) {
    const date = new Date(`${payload.preferredDate}T00:00:00.000Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(payload.preferredDate) || Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== payload.preferredDate) {
      errors.preferredDate = 'Enter a valid date.';
    }
  }

  if (payload.privacyConsent !== true) {
    errors.privacyConsent = 'You must agree to the Privacy Policy to submit this form.';
  }

  if (payload.marketingConsent !== undefined && typeof payload.marketingConsent !== 'boolean') {
    errors.marketingConsent = 'Enter a valid consent choice.';
  }

  return Object.keys(errors).length ? errors : null;
}

async function sendEnquiryEmail(payload) {
  const smtpHost = process.env.SMTP_HOST;
  if (!smtpHost) {
    throw new Error('SMTP_HOST is not configured.');
  }

  const smtpPort = Number(process.env.SMTP_PORT || 587);
  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    requireTLS: smtpPort !== 465,
    ...(process.env.SMTP_USER && process.env.SMTP_PASS ? {
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    } : {})
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || config.email,
    to: config.email,
    ...(payload.email ? { replyTo: payload.email } : {}),
    subject: `New enquiry: ${payload.service}`,
    text: `Name: ${payload.name}\nBusiness: ${payload.businessName || 'N/A'}\nPhone: ${payload.phone}\nEmail: ${payload.email || 'N/A'}\nService: ${payload.service}\nProject Description: ${payload.projectDescription}\nApproximate Dimensions: ${payload.dimensions || 'N/A'}\nQuantity: ${payload.quantity || 'N/A'}\nInstallation Location: ${payload.location || 'N/A'}\nPreferred Completion Date: ${payload.preferredDate || 'N/A'}\nPreferred Contact Method: ${payload.contactMethod || 'N/A'}`,
    html: `<h3>New enquiry for ${escapeHtml(payload.service)}</h3><ul><li><strong>Name:</strong> ${escapeHtml(payload.name)}</li><li><strong>Business:</strong> ${escapeHtml(payload.businessName || 'N/A')}</li><li><strong>Phone:</strong> ${escapeHtml(payload.phone)}</li><li><strong>Email:</strong> ${escapeHtml(payload.email || 'N/A')}</li><li><strong>Service:</strong> ${escapeHtml(payload.service)}</li><li><strong>Project Description:</strong> ${escapeHtml(payload.projectDescription)}</li><li><strong>Approximate Dimensions:</strong> ${escapeHtml(payload.dimensions || 'N/A')}</li><li><strong>Quantity:</strong> ${escapeHtml(payload.quantity || 'N/A')}</li><li><strong>Installation Location:</strong> ${escapeHtml(payload.location || 'N/A')}</li><li><strong>Preferred Completion Date:</strong> ${escapeHtml(payload.preferredDate || 'N/A')}</li><li><strong>Preferred Contact Method:</strong> ${escapeHtml(payload.contactMethod || 'N/A')}</li></ul>`
  });
}

const enquiryRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { success: false, message: 'Too many enquiries. Please try again later.' }
});

app.post('/api/enquiries', enquiryRateLimit, async (req, res) => {
  const origin = req.get('origin');
  if (origin) {
    let isSameOrigin = false;
    try {
      const requestOrigin = new URL(`${req.protocol}://${req.get('host')}`).origin;
      isSameOrigin = new URL(origin).origin === requestOrigin;
    } catch (_error) {
      isSameOrigin = false;
    }
    if (!isSameOrigin) {
      return res.status(403).json({ success: false, message: 'Cross-origin form submissions are not allowed.' });
    }
  } else if (req.get('sec-fetch-site') === 'cross-site') {
    return res.status(403).json({ success: false, message: 'Cross-origin form submissions are not allowed.' });
  }

  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ success: false, message: 'Submit a valid enquiry form.' });
  }

  const payload = {
    name: req.body.name,
    businessName: req.body.businessName,
    phone: req.body.phone,
    email: req.body.email,
    service: req.body.service,
    projectDescription: req.body.projectDescription,
    dimensions: req.body.dimensions,
    quantity: req.body.quantity,
    location: req.body.location,
    preferredDate: req.body.preferredDate,
    contactMethod: req.body.contactMethod,
    privacyConsent: req.body.privacyConsent,
    marketingConsent: req.body.marketingConsent
  };

  const errors = validateEnquiry(payload);
  if (errors) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    await sendEnquiryEmail(payload);
    return res.status(200).json({ success: true, message: 'Your enquiry has been submitted successfully. We will get back to you soon.' });
  } catch (error) {
    console.error('Error sending enquiry:', error);
    const status = error.message === 'SMTP_HOST is not configured.' ? 503 : 502;
    return res.status(status).json({ success: false, message: 'The enquiry could not be delivered. Please try again or send a WhatsApp message.' });
  }
});

app.get('/favicon.ico', (_req, res) => {
  res.redirect(308, '/favicon.svg');
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/services', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/projects', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});

app.get('/about', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.get('/privacy-policy', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy-policy.html'));
});

app.get('/terms-of-service', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terms-of-service.html'));
});

app.get('/refund-policy', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'refund-policy.html'));
});

app.get('/cookies-policy', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cookies-policy.html'));
});

app.get('/robots.txt', (_req, res) => {
  const baseUrl = siteUrl.origin;
  res.type('txt').send(`User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${baseUrl}/sitemap.xml\n`);
});

app.get('/sitemap.xml', (_req, res) => {
  const baseUrl = siteUrl.origin;
  const pages = [
    '/',
    '/services',
    '/projects',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/refund-policy',
    '/cookies-policy'
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>${baseUrl}${page}</loc></url>`).join('\n')}
</urlset>`;
  res.type('xml').send(xml);
});

app.use(express.static(path.join(__dirname, 'public')));

app.use((error, req, res, next) => {
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ success: false, message: 'The submitted form is too large.' });
  }
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Submit valid form data.' });
  }
  if (req.path.startsWith('/api/')) {
    console.error('Unhandled API request error:', error);
    return res.status(500).json({ success: false, message: 'The request could not be processed.' });
  }
  return next(error);
});

app.use((_req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

app.validateEnquiry = validateEnquiry;
module.exports = app;
