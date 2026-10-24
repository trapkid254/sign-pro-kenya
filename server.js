const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const inquiries = [];

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

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
  const required = ['name', 'phone', 'service', 'projectDescription'];

  required.forEach((field) => {
    const value = String(payload[field] || '').trim();
    if (!value) {
      errors[field] = 'This field is required.';
    }
  });

  if (payload.phone && !/^[+()\d\s-]{7,20}$/.test(payload.phone)) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (payload.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (payload.service && !['Signage', 'Printing', 'Vehicle Branding', 'Office Branding', 'Graphic Design', 'Large-Format Printing'].includes(payload.service)) {
    errors.service = 'Please choose a valid service.';
  }

  return Object.keys(errors).length ? errors : null;
}

async function sendEnquiryEmail(payload) {
  const smtpHost = process.env.SMTP_HOST;
  if (!smtpHost) {
    console.log('Email delivery skipped: SMTP_HOST not configured.');
    return { success: true, mode: 'console' };
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || config.email,
    to: config.email,
    replyTo: payload.email || payload.phone,
    subject: `New enquiry: ${payload.service}`,
    text: `Name: ${payload.name}\nBusiness: ${payload.businessName || 'N/A'}\nPhone: ${payload.phone}\nEmail: ${payload.email || 'N/A'}\nService: ${payload.service}\nProject Description: ${payload.projectDescription}\nApproximate Dimensions: ${payload.dimensions || 'N/A'}\nQuantity: ${payload.quantity || 'N/A'}\nInstallation Location: ${payload.location || 'N/A'}\nPreferred Completion Date: ${payload.preferredDate || 'N/A'}\nPreferred Contact Method: ${payload.contactMethod || 'N/A'}`,
    html: `<h3>New enquiry for ${escapeHtml(payload.service)}</h3><ul><li><strong>Name:</strong> ${escapeHtml(payload.name)}</li><li><strong>Business:</strong> ${escapeHtml(payload.businessName || 'N/A')}</li><li><strong>Phone:</strong> ${escapeHtml(payload.phone)}</li><li><strong>Email:</strong> ${escapeHtml(payload.email || 'N/A')}</li><li><strong>Service:</strong> ${escapeHtml(payload.service)}</li><li><strong>Project Description:</strong> ${escapeHtml(payload.projectDescription)}</li><li><strong>Approximate Dimensions:</strong> ${escapeHtml(payload.dimensions || 'N/A')}</li><li><strong>Quantity:</strong> ${escapeHtml(payload.quantity || 'N/A')}</li><li><strong>Installation Location:</strong> ${escapeHtml(payload.location || 'N/A')}</li><li><strong>Preferred Completion Date:</strong> ${escapeHtml(payload.preferredDate || 'N/A')}</li><li><strong>Preferred Contact Method:</strong> ${escapeHtml(payload.contactMethod || 'N/A')}</li></ul>`
  });

  return { success: true, mode: 'smtp' };
}

app.get('/api/config', (_req, res) => {
  res.json(config);
});

app.post('/api/enquiries', async (req, res) => {
  const payload = {
    name: String(req.body.name || '').trim(),
    businessName: String(req.body.businessName || '').trim(),
    phone: String(req.body.phone || '').trim(),
    email: String(req.body.email || '').trim(),
    service: String(req.body.service || '').trim(),
    projectDescription: String(req.body.projectDescription || '').trim(),
    dimensions: String(req.body.dimensions || '').trim(),
    quantity: String(req.body.quantity || '').trim(),
    location: String(req.body.location || '').trim(),
    preferredDate: String(req.body.preferredDate || '').trim(),
    contactMethod: String(req.body.contactMethod || '').trim()
  };

  const errors = validateEnquiry(payload);
  if (errors) {
    return res.status(400).json({ success: false, errors });
  }

  const entry = {
    ...payload,
    createdAt: new Date().toISOString()
  };
  inquiries.push(entry);

  try {
    const result = await sendEnquiryEmail(payload);
    console.log('New enquiry received:', result);
    return res.status(200).json({ success: true, message: 'Your enquiry has been submitted successfully. We will get back to you soon.' });
  } catch (error) {
    console.error('Error sending enquiry:', error);
    return res.status(500).json({ success: false, message: 'The enquiry could not be delivered. Please try again or send a WhatsApp message.' });
  }
});

app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/robots.txt', (_req, res) => {
  res.type('txt').send(`User-agent: *\nAllow: /\nSitemap: ${process.env.SITE_URL || 'http://localhost:3000'}/sitemap.xml\n`);
});

app.get('/sitemap.xml', (_req, res) => {
  const baseUrl = process.env.SITE_URL || 'http://localhost:3000';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url><loc>${baseUrl}/</loc></url>
    <url><loc>${baseUrl}/services</loc></url>
    <url><loc>${baseUrl}/projects</loc></url>
    <url><loc>${baseUrl}/about</loc></url>
    <url><loc>${baseUrl}/contact</loc></url>
  </urlset>`;
  res.type('xml').send(xml);
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
