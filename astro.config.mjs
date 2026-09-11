import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// Static build for Cloudflare Workers static assets — see
// docs/wiki/deployment-domain.md. `site` is hardcoded to the apex, not
// env-driven: this is a single-host deploy and nothing here should be able to
// point the sitemap or canonical URLs at a preview host by accident.
export default defineConfig({
  site: 'https://deepayansinha.com',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Load-bearing for the CSP, not a preference — see docs/wiki/security-headers.md.
    // Without this, Astro inlines small <script>/<style> blocks straight into the
    // HTML, which a `script-src 'self'` / `style-src 'self'` policy then rejects.
    inlineStylesheets: 'never',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Same reasoning as build.inlineStylesheets: keeps every asset a real
      // file so the CSP never has to allow data: URIs for scripts or styles.
      assetsInlineLimit: 0,
    },
  },
  integrations: [sitemap()],
});
