# deepayansinha.com

Personal portfolio site for Deepayan Sinha — MBA (William & Mary, 2026), six years of AI/ML
product engineering, and a habit of shipping the tools himself.

**Status: live** at [deepayansinha.com](https://deepayansinha.com/) since 2026-09-24. The homepage,
three case studies and a resume (web page and PDF) are built and deployed; later work is tracked
in Linear — see [docs/linear.md](docs/linear.md).

## Stack

- [Astro 5](https://astro.build) with [Tailwind CSS 4](https://tailwindcss.com), static output
- Deployed on Cloudflare Workers static assets, apex canonical
- No server, no database, no third-party scripts — which is what lets the Content Security
  Policy stay on `'self'`

## Getting started

```bash
npm install
npm run dev      # astro dev on :4321
npm run build    # astro check, static build, then the CSP-header and dist guards
npm run preview  # wrangler dev over dist/, with the real security headers applied
```

Pushing to `main` deploys to production through Cloudflare's Git integration.

## Documentation

- [docs/README.md](docs/README.md) — documentation index
- [docs/wiki/](docs/wiki/index.md) — the content and design reference
- [docs/linear.md](docs/linear.md) — planned work and its status

Planning happens in Linear; this repository records what happened and why.

## License

The code in this repository is available under the MIT license. The written content, the
résumé, the case studies and the brand assets are not — they are personal material and are
reserved.
