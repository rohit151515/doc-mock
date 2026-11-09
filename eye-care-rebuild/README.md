# Dr-Jahangir Eye Care

A Bangla-first clinic website for Sirajganj. The root redirects to /bn. Both /bn and /en render the full page on the server. Patients can review estimated fees, inspect the doctor's training, call the chamber, or request a callback once email is configured.

## Run locally

Use Node 24 and npm. From this directory run:

    npm ci
    cp .env.example .env.local
    npm run dev

Open http://localhost:3000. For a production preview, run npm run build followed by npm start. Rebuild after changing environment variables because the language pages are pre-rendered.

## Edit the site

| File | What it controls |
|---|---|
| lib/clinic.ts | Brand, chamber phone, address, hours, doctor profiles, training, fees and FAQs. Translation pairs are always Bangla first and English second. |
| public/logo.svg and public/doctor.png | Header logo and supplied portrait. Replace with assets approved by the clinic. |
| app/[lang]/page.tsx | Page sections, hero copy, profile display, localized metadata, clinic structured data, contact links and footer. |
| components/Nav.tsx | Navigation labels, anchors, language switcher and mobile menu. |
| components/Form.tsx | Bilingual field labels, local validation, sending state and patient feedback. |
| lib/validation.ts | Shared Zod schema, including Bangla digit conversion and Bangladesh mobile number validation. |
| app/api/appointment/route.ts | Server validation and plain-text/HTML email generation. |
| app/style.css | Brand colors, spacing, typography, components and narrow-screen layouts. |
| app/robots.ts and app/sitemap.ts | Production crawling and language URLs. |
| tests | Mocked endpoint suite and browser/accessibility checks. |

Add or remove prices in the tests or surgery arrays. Each entry has a Bangla and English name and either one price or a low/high estimate. Add doctors to doctors using a distinct stable ID, licensed photo and approved bilingual profile. The profile section and form dropdown use the same list. The hero uses the first profile; replace its content and portrait if removing the final doctor. Add testimonials in the footer only with written publication approval. Update holiday text alongside chamber hours when schedules change.

## Configure appointment email

1. In Resend, add a sending domain you control and complete its DNS verification. Create a sending API key.
2. Set RESEND_API_KEY on the server only; never put it in source code or a client-side variable. The example sender and notification address are prefilled in `.env.example`. For production, verify a sending domain in Resend and set EMAIL_FROM to an address on that domain. Use a controlled test mailbox in staging.
3. Rebuild. All three values must exist for the form to accept submissions. Without them visitors see the chamber phone number.
4. Use synthetic information for the first end-to-end test. Check provider acceptance, delivery events, inbox and spam folder. Confirm the clinic can call back. A provider acceptance only confirms submission.
5. To change the recipient, replace CLINIC_NOTIFICATION_EMAIL and redeploy. Never send test inquiries to patients.

The endpoint reads at most 8 KiB, validates the doctor's ID, phone, age, gender, name and brief concern, checks origin when available, rejects a populated spam trap, escapes HTML, and sends the message through Resend. Bangla numerals and local or international phone formats are accepted. A client submission lock and stable provider idempotency key protect double-clicks and network retries. Failed submissions preserve the form. No patient database, analytics or browser storage is used.

## Deploy to Vercel

1. Put this project in a private Git repository. Keep local environment files excluded. Import the repository into Vercel with the Next.js preset and this directory as its root.
2. Configure email secrets separately for preview and production. Use the production domain origin without a trailing slash for SITE_URL. Leave it empty in preview to suppress indexing and production URLs.
3. Configure a rate-limit rule for POST /api/appointment in the hosting firewall. Choose a threshold with the clinic and test the limit on staging. The form's spam trap alone is insufficient for a public launch.
4. Add the clinic's custom domain in Vercel, follow the provided DNS records and confirm HTTPS. Redeploy and verify both language pages, domain redirects, sitemap and robots.txt.
5. Set CLINIC_WHATSAPP only for a verified WhatsApp account, digits in international format. Set CLINIC_MAP_URL only after the clinic verifies the pin. Otherwise the website presents the supplied phone and street address.
6. Complete the checks in docs/QA.md and docs/GOOGLE_SEARCH_CONSOLE.md.

## Run checks

    npm test
    npm run build
    npm start -- -H 127.0.0.1 -p 3127

With that server running and Chrome installed, run node tests/browser.mjs. It checks both languages at 390px and 1440px, images, internal links, overflow, the menu, price lists, FAQ, language switching and axe accessibility results. Run the Lighthouse CLI on both language pages using mobile and desktop presets on the deployed test environment.
