# Rapid Restore AZ — Website

Conversion-focused marketing site for **Rapid Restore AZ**, a 24/7 damage restoration company
serving Phoenix and the greater Valley, Arizona.

- **Phone:** [(602) 573-8967](tel:+16025738967)
- **Email:** rachel@rapidrestoreaz.com
- **Service area:** Phoenix & the greater Valley, AZ

## Stack

Vanilla HTML, CSS and JavaScript — no build step, no dependencies, no external APIs.
Open `index.html` in a browser or serve the directory statically:

```bash
python3 -m http.server 8000
```

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Hero + quote form, services overview, process, reviews, FAQ, contact |
| `services.html` | Detailed breakdown of all six service lines |
| `about.html` | Story, values, process and service area |
| `faq.html` | Full FAQ grouped by topic (with FAQPage structured data) |
| `contact.html` | Contact details and the full quote/estimate form |

## Structure

```
index.html, services.html, about.html, faq.html, contact.html
assets/css/styles.css    global stylesheet (design tokens, layout, components, responsive)
assets/js/main.js        nav, sticky header, FAQ accordion, scroll reveal, form validation
assets/img/favicon.svg   favicon placeholder
robots.txt, sitemap.xml
```

## Features

- Click-to-call phone number in the top bar, header, hero, footer and a mobile sticky call bar
- Quote/estimate forms with client-side validation, honeypot spam field, and a `mailto:`
  handoff to `rachel@rapidrestoreaz.com` (no backend or third-party service required)
- Service links accept `?service=` to pre-select the dropdown on the contact form
- Accessible markup: skip link, landmarks, ARIA-wired accordion, labelled fields, focus styles
- Responsive from 320px up; respects `prefers-reduced-motion`
- SEO: per-page titles/descriptions, canonical tags, Open Graph/Twitter cards, JSON-LD
  (`HomeAndConstructionBusiness` and `FAQPage`)
