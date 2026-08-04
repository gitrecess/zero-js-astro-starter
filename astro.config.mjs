// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// Astro evaluates this file in Node before Vite loads anything, so a .env file
// is not visible here by default — while src/consts.ts, which reads the same
// variable through import.meta.env, does see it. Left alone that splits the
// origin in half: canonical and og: URLs move to the new host while the sitemap
// and robots.txt stay on the old one, with exit 0 and no warning. Loading .env
// explicitly keeps the two reads in step.
//
// Host environment variables still win — loadEnvFile fills gaps rather than
// overriding, the same precedence Vite applies on the other side, so a Pages
// build is unaffected by a stray .env. It reads `.env` only, not `.env.production`
// or `.env.local`; set deploy origins on the host rather than in a file.
try {
  process.loadEnvFile();
} catch {
  // No .env is the ordinary case — there is nothing to load.
}

// TODO: Change this to your own domain. Drives canonical URLs, Open Graph URLs
// and the sitemap, and must match the custom domain configured at your host. No
// trailing slash. Keep it in sync with SITE_URL in src/consts.ts.
//
// PUBLIC_SITE_URL overrides it at build time so one branch can deploy to more
// than one origin — a preview or staging deployment then emits its own canonical
// URLs instead of advertising the production ones. Leave it unset and this
// literal is what ships, so nothing has to be configured to use the template.
//
// `?.trim() ||` rather than `??`, to match src/consts.ts exactly. An env var set
// to an empty string is a real state — Cloudflare Pages allows it — and `??`
// would pass `''` to Astro's config schema, which rejects it with a bare
// "Invalid URL" naming neither this option nor the variable.
const site = process.env.PUBLIC_SITE_URL?.trim() || 'https://example.com';

// https://astro.build/config
export default defineConfig({
  site,

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
