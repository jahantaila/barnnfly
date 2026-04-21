# Bark & Fly × Derby Digital — Brand Survey

Multi-step founder survey for **Bark & Fly Pet Resort**, built in the bold
Derby Digital style with 3D animations, Framer Motion transitions, and a
logo-voting step. Co-branded throughout so partners immediately see the
Derby Digital stamp.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4** (inline theme tokens)
- **React Three Fiber + Drei** — 3D hero canvas (distorted orb, torus knot, capsule)
- **Framer Motion** — step transitions
- **TypeScript**

## Run it

```bash
bun install
bun run dev     # http://localhost:3000 (or set PORT)
bun run build   # production build
```

## Survey flow (9 steps)

1. **Intro** — 3D hero, Derby badge, "Start the survey"
2. **About you** — name, email, role, phone
3. **Vision** — stage, location, services, unique value
4. **Dream customer** — audience, pets served, price tier
5. **Personality** — brand vibe chips (pick 2+)
6. **Logo direction** — styles + imagery + inspiration
7. **Palette** — six palette options (including a Derby Signature)
8. **Logo vote** — rate 6 concepts + mark favorite
9. **Voice** — tagline, tones
10. **Review & submit** — summary + `POST /api/submit`

State auto-saves to `localStorage` while filling, and clears on submit.

## Adding logo concept images for voting

Drop your concept images into `public/logos/` as:

```
public/logos/concept-1.png
public/logos/concept-2.png
…
public/logos/concept-6.png
```

Cards that don't have an image yet show a placeholder with the expected path.

## Submissions

In development, `POST /api/submit` appends each response to
`submissions/responses.jsonl` (gitignored) and `console.log`s it.

Replace the handler in `app/api/submit/route.ts` with your real destination
(Airtable, HubSpot, Resend email, Slack webhook, DB…) before going to prod.

## Branding

- Derby Digital logo: `public/derby-logo.svg` — shown in the header, footer, and a "Powered by" inline badge
- Bark & Fly wordmark: `public/barknfly-wordmark.svg`
- Derby accent color: `#1F4DFF`
- Display font: Archivo Black · Body font: Inter

---

A [Derby Digital](https://derbydigital.com) project.
