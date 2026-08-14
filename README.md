# RNV-TECH LLC — Website

Static marketing site for RNV-TECH LLC and MySecretary™, built as plain HTML/CSS/JS
so it can be dropped into WordPress.

**Tagline:** Executive software for faster execution.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Home — hero, about, MySecretary™ teaser, founder story, Kickstarter CTA |
| `mysecretary.html` | Flagship app — features, audience, privacy-first, MySuite™ roadmap |
| `privacy-terms.html` | Privacy Policy + Terms of Service |
| `contact.html` | Launch list signup + contact form |

Shared assets: `css/style.css`, `js/main.js`, `images/`.

## Brand

- Matte black `#000000`, metallic gold `#D4AF37`, white `#FFFFFF`
- Playfair Display (headings) + Inter (body)
- Product names always carry the trademark symbol: **MySecretary™**, **MySuite™**

## Before this goes live

### 1. Wire up the forms (required — they do not work yet)

Both forms are inert until Formspree is configured. Until then they show
"Form not configured yet" and log an explanation to the browser console.

1. Create two forms at [formspree.io](https://formspree.io), both delivering to
   `support@rnv-tech.com` — one for the launch list, one for contact messages.
2. Copy each form ID into the top of `js/main.js`:
   ```js
   const FORMSPREE_SIGNUP  = 'xxxxxxxx';
   const FORMSPREE_CONTACT = 'xxxxxxxx';
   ```

Both forms include a hidden `_gotcha` honeypot field, which Formspree uses to
silently drop bot submissions.

### 2. Set security headers on the server

The pages ship a `Content-Security-Policy` in a `<meta>` tag, but several headers
**cannot** be set from HTML and must be configured in WordPress (via a security
plugin) or in the web server config:

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

`X-Frame-Options` / CSP `frame-ancestors` is the clickjacking protection — a
`<meta>` CSP is ignored for that directive, so it has to come from the server.

### 3. Have an attorney review the legal pages

`privacy-terms.html` was drafted from the app's actual data flows, but it has not
been reviewed by counsel. There is a note to this effect at the bottom of the page —
remove it once a lawyer has signed off.

## Notes

- The CSP allows scripts only from `'self'`, so **do not add inline `<script>` blocks
  or `onclick=` attributes** — they will be silently blocked. Put JS in `js/main.js`.
- Images are pre-compressed for web (~400KB total). If you replace one, resize it
  first — the originals were 4.6MB combined.
