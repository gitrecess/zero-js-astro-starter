// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: Change this to your own domain. Drives canonical URLs, Open Graph
  // URLs and the sitemap, and must match the custom domain configured at your
  // host. No trailing slash. Keep it in sync with SITE_URL in src/consts.ts.
  site: 'https://example.com',

  // Static output — plain HTML for Cloudflare Pages. No adapter required.
  output: 'static',

  integrations: [
    sitemap({
      // /thanks is only a form-submission landing page, so keep it out of the
      // sitemap. It also carries a noindex tag of its own.
      filter: (page) => !page.includes('/thanks'),
    }),
  ],
});
