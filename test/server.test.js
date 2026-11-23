const assert = require('node:assert/strict');
const test = require('node:test');
const app = require('../server');
const { validateEnquiry } = app;

const validPayload = () => ({
  name: '  Test Client  ',
  businessName: 'Test Business',
  phone: '+254 700 000 000',
  email: 'client@example.com',
  service: 'Signage',
  projectDescription: 'A new storefront sign',
  dimensions: '2m x 1m',
  quantity: '2',
  location: 'Nairobi',
  preferredDate: '2027-01-15',
  contactMethod: 'Email',
  privacyConsent: true,
  marketingConsent: false
});

test('accepts and normalizes a valid enquiry', () => {
  const payload = validPayload();

  assert.equal(validateEnquiry(payload), null);
  assert.equal(payload.name, 'Test Client');
});

test('rejects invalid fields, consent, and dates server-side', () => {
  const payload = validPayload();
  payload.phone = { number: '+254700000000' };
  payload.service = 'Unlisted service';
  payload.preferredDate = '2027-02-30';
  payload.privacyConsent = false;

  const errors = validateEnquiry(payload);

  assert.ok(errors.phone);
  assert.ok(errors.service);
  assert.ok(errors.preferredDate);
  assert.ok(errors.privacyConsent);
});

test('rejects overlong values rather than silently truncating them', () => {
  const payload = validPayload();
  payload.projectDescription = 'x'.repeat(5001);

  assert.match(validateEnquiry(payload).projectDescription, /5000 characters/);
});

test('rejects malformed optional field types', () => {
  const payload = validPayload();
  payload.quantity = 25;

  assert.ok(validateEnquiry(payload).quantity);
});

test('rejects invalid optional consent types', () => {
  const payload = validPayload();
  payload.marketingConsent = 'yes';

  assert.ok(validateEnquiry(payload).marketingConsent);
});

test('exports the Express app as a handler and redirects the ICO favicon alias', async (t) => {
  assert.equal(typeof app, 'function');

  const server = await new Promise((resolve) => {
    const listener = app.listen(0, '127.0.0.1', () => resolve(listener));
  });
  t.after(() => new Promise((resolve) => server.close(resolve)));

  const response = await fetch(`http://127.0.0.1:${server.address().port}/favicon.ico`, {
    redirect: 'manual'
  });

  assert.equal(response.status, 308);
  assert.equal(response.headers.get('location'), '/favicon.svg');
});
