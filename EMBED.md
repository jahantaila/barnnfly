# Embedding the survey in WordPress

The survey is designed to drop into any WordPress page, post, or sidebar using
a single **Custom HTML** block — no plugin, no iframe-resizer library, no code
on your end.

## 1 · Deploy the app somewhere

Deploy this project (Vercel, Netlify, Fly.io, your own server — anywhere).
Once deployed, confirm these URLs work:

- `https://YOUR-DEPLOY-URL/embed` — the survey in embed mode
- `https://YOUR-DEPLOY-URL/embed.js` — the drop-in loader script

> The app ships permissive iframe + CORS headers scoped to `/embed*` only,
> so it can be embedded from any site while the rest of the app stays normal.
> To lock embedding down to specific WP domains, edit `frame-ancestors` in
> [next.config.ts](next.config.ts).

## 2 · Paste into WordPress

In the WP block editor, add a **Custom HTML** block (the Classic editor works
too — drop it into the HTML view) and paste:

```html
<!-- Bark & Fly brand survey -->
<div id="barknfly-survey"></div>
<script src="https://YOUR-DEPLOY-URL/embed.js" defer></script>
```

Publish. That's it. The iframe:

- Auto-resizes to fit content (no inner scrollbars)
- Is mobile-responsive (100% width, capped at 1100px)
- Loads lazily so it doesn't block your page's first paint
- Preserves Derby Digital branding top + bottom

## 3 · Options

Override defaults via `data-*` attributes on the script tag:

```html
<div id="my-custom-wrapper"></div>
<script
  src="https://YOUR-DEPLOY-URL/embed.js"
  data-target="#my-custom-wrapper"
  data-src="https://YOUR-DEPLOY-URL/embed"
  data-min-height="800"
  defer
></script>
```

| Attribute        | Default              | Purpose                                           |
| ---------------- | -------------------- | ------------------------------------------------- |
| `data-target`    | `#barknfly-survey`   | CSS selector for the container div                |
| `data-src`       | `/embed` on same host| Override the iframe source URL                    |
| `data-min-height`| `720`                | Minimum iframe height in pixels before it resizes |

## 4 · Preview before you go live

Open `/embed-preview` on your deployed app — it's a sample page that simulates
a WordPress post hosting the embed exactly as a partner would see it.

## 5 · Receiving submissions

The default handler at [app/api/submit/route.ts](app/api/submit/route.ts)
writes submissions to a local JSONL file and `console.log`s them. Before going
live, swap that for your real destination:

- Email (Resend, Postmark, SendGrid)
- Airtable / Google Sheets / Notion
- HubSpot / Salesforce
- Slack / Discord webhook
- Your own database

## 6 · Troubleshooting

**Iframe doesn't appear, or the survey shows an X-Frame-Options error**
The app's headers config scopes permissive iframe headers to `/embed*`. Make
sure the `data-src` points to a URL under `/embed`, not `/`.

**Iframe is cut off or too tall**
The resize script listens for a `barknfly:resize` postMessage from the iframe.
Check the browser console — if you see cross-origin message warnings, make
sure `data-src` is on the same origin as `embed.js` (usually it is, unless you
customized `data-src`).

**WordPress strips the `<script>` tag**
Some WP security plugins strip `<script>`s from posts. Either whitelist the
Custom HTML block, use a plugin like "Code Embed" or "Insert Headers and
Footers", or use the iframe-only fallback below.

## 7 · Iframe-only fallback (no script)

If you can't run JS, use a plain iframe with a fixed height. You lose
auto-resize (users will see an inner scrollbar or blank space), but everything
else works:

```html
<iframe
  src="https://YOUR-DEPLOY-URL/embed"
  style="width:100%; max-width:1100px; height:1400px; border:0; display:block; margin:0 auto;"
  title="Bark & Fly brand survey"
  loading="lazy"
></iframe>
```
