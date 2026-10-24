# Sign Pro Kenya Limited Website

A responsive, multi-page business website for a signage, printing and branding company.

## Local setup

1. Install dependencies:
   npm install
2. Copy `.env.example` to `.env` and update values as needed.
3. Start the server:
   npm start
4. Visit http://localhost:3000

## Notes

- Contact details are managed centrally via environment variables and the frontend `config.js` file.
- The form submits to `/api/enquiries` and stores a record in memory for demo purposes.
- If SMTP credentials are configured, enquiries are delivered via email. Otherwise, the request is logged to the server console.
- Replace placeholders with verified business information when available.
