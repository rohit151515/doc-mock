# Verification and launch review

The production build generated both localized pages, the appointment route, robots.txt and sitemap.xml. Sixteen Vitest cases passed using synthetic data and a mocked Resend client. They cover Bangla phone and age normalization, international numbers, field rejection, spam, malformed and oversized bodies, missing secrets, provider and network failure, HTML escaping and successful provider acceptance. No clinic emails were sent. The Bangla homepage was inspected in the in-app browser. The automated Chrome process aborted during startup on the build host, before its responsive and axe assertions ran. Lighthouse and field performance remain unmeasured.

## Failure review

| Failure | Prevention or recovery |
|---|---|
| Patient thinks an appointment is confirmed | The page describes a callback and shows success only after provider acceptance. Staff confirm the actual appointment. |
| Missing keys, invalid sender or wrong recipient | Missing configuration closes the form. Verify sender DNS, set secrets, rebuild and test receipt using a staging inbox. |
| Provider accepts mail but it bounces | Monitor Resend delivery events and the clinic inbox. Correct the recipient or sender configuration. Direct patients to phone while resolving the issue. |
| Double click or interrupted response | Disable submission while sending. Keep the same request ID and submission timestamp on retries with unchanged fields. This keeps the provider idempotency payload stable. |
| Invalid clinical details, price, schedule or map | Have the clinic sign off on every item and price range. Use its exact map pin and independently confirm the WhatsApp number before enabling links. |
| Invalid mobile numbers, malicious HTML, spam | Normalize Bengali digits, check on client and server, limit body size and escape HTML. Enable and test the host firewall rate limit. |
| Sensitive data in telemetry | Keep the endpoint free of form logging. Restrict access to the clinic inbox and provider account. Agree retention and deletion procedures with the clinic. |
| Broken mobile layout or translation | Test both languages on a real Android phone and with keyboard navigation. Have a fluent Bangla reviewer approve the final wording. |
| Staging content indexed or production blocked | Set SITE_URL only for production. Inspect canonical links, hreflang, sitemap and robots after deployment. |

## Before opening the site to patients

- Confirm qualifications, affiliation, address, opening hours, contact details, all procedures and fee ranges. Confirm permission to use the supplied portrait and logo. Obtain approval for any outcome statistics before adding them.
- Complete desktop/mobile browser and accessibility tests plus Lighthouse. Verify phone dialing and reading order on a physical device.
- Configure the domain, email delivery and firewall rule. Test delivery, provider rejection, duplicate submission and retry behavior end-to-end on staging. Confirm the staff callback workflow.
- Confirm privacy wording and clinic mailbox retention. Keep patient data out of analytics and monitoring.
- Validate production metadata and structured data. Complete Google Search Console and local business setup with the clinic owner.

## Corrections made during implementation

The first build exposed a CommonJS/ES module mismatch from npm's defaults. Switching the project to ES modules resolved it. The retry review identified a changing email timestamp that could conflict with a repeated idempotency key. The client now retains a single timestamp with each unchanged submission.
