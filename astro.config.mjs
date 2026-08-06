// @ts-check
import { readFileSync } from 'node:fs';

import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

// Astro evaluates this file in Node before Vite loads anything, so a .env file
// is not visible here by default — while src/consts.ts, which reads the same
// variable through import.meta.env, does see it. Left alone that splits the
// origin in half, with exit 0 and no warning. Loading .env explicitly keeps the
// two reads in step. Do not delete this call.
//
// MEASURE THE SPLIT BEFORE BELIEVING ANY DESCRIPTION OF IT, INCLUDING THIS ONE.
// Only ONE thing is driven from this file: the sitemap XML's <loc> entries.
// robots.txt is a generated route that imports SITE_URL from src/consts.ts, so
// it moves with canonical rather than with the sitemap. Measured 2026-08-06 by
// putting PUBLIC_SITE_URL where this call cannot see it:
//
//   canonical / og: / form redirect  -> the new origin
//   robots.txt's `Sitemap:` line     -> the new origin
//   sitemap-0.xml's <loc> entries    -> STILL THE OLD ONE   <- the only one left
//
// That is what makes it dangerous rather than merely untidy: robots.txt then
// advertises a sitemap at the new origin whose entries are all on the old one,
// and a cross-origin sitemap is rejected outright.
//
// So do not check robots.txt to decide whether this call is doing anything: it
// shows the new origin either way, which reads as everything working. The
// sitemap XML is the only surface that can tell you, and it is the one nobody
// opens.
//
// It is invisible while SITE_NOINDEX is true — that branch emits no `Sitemap:`
// line at all — so it arrives when you set your own domain and go live, not
// while you are still evaluating the template.
//
// Host environment variables still win — loadEnvFile fills gaps rather than
// overriding, the same precedence Vite applies on the other side, so a build on
// your host is unaffected by a stray local .env. Set deploy origins on the host
// rather than in a file.
//
// The URL argument is load-bearing: loadEnvFile() resolves a bare `.env`
// against the process's CWD, not against this file, so `astro build --root
// <this repo>` from anywhere else loaded nothing at all and the catch below hid
// it. Vite resolves .env against the Astro root, so the two reads disagreed
// again, and again at exit 0.
try {
  process.loadEnvFile(new URL('.env', import.meta.url));
} catch {
  // No .env is the ordinary case — there is nothing to load.
}

// The call above reads `.env` and nothing else, while Vite — and so
// src/consts.ts — also reads `.env.local`, `.env.production` and
// `.env.production.local`. PUBLIC_SITE_URL in any of those three re-creates the
// whole split above with this call present and working; measured 2026-08-06.
//
// Both files already say to set deploy origins on the host rather than in a
// file, so a mode file naming this variable is an unsupported configuration.
// Fail rather than shipping two origins at exit 0. This runs on every Astro
// command, not only `build` — failing `dev` early is the cheaper place to find
// it.
//
// PUBLIC_SITE_NOINDEX is deliberately NOT checked: src/consts.ts is the only
// thing that reads it, so there is no second read for it to disagree with. Add
// a name here only when a variable is read in BOTH files.
for (const name of ['.env.production.local', '.env.local', '.env.production']) {
  let body;
  try {
    body = readFileSync(new URL(name, import.meta.url), 'utf8');
  } catch (err) {
    // Absent is the ordinary case. Anything else — a permissions error, a
    // directory of that name — is not, and must not read as "nothing to check".
    if (err.code !== 'ENOENT') throw err;
    continue;
  }
  if (/^\s*(?:export\s+)?PUBLIC_SITE_URL\s*=/m.test(body)) {
    throw new Error(
      `${name} sets PUBLIC_SITE_URL, which this config cannot read. The ` +
        `canonical URLs and robots.txt would move to it and the sitemap would ` +
        `not. Set the origin in your host's environment variables, or move it ` +
        `to .env.`,
    );
  }
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
