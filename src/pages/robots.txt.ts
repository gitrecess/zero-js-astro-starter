import type { APIRoute } from 'astro';
import { SITE_URL, SITE_NOINDEX } from '../consts';

/*
 * Generated rather than kept as a static file in public/, so it can never drift
 * out of step with SITE_NOINDEX — one flag drives both this and the per-page
 * meta robots tag.
 *
 * Note that crawling stays *allowed* even while the site is hidden. Adding
 * "Disallow: /" would be counterproductive: it stops crawlers fetching the page
 * at all, so they never see the noindex directive, and a URL can stay in the
 * index (title only, no content) on the strength of inbound links. Letting them
 * in to read the noindex is what actually keeps the site out of search results.
 */
export const GET: APIRoute = () => {
  const body = SITE_NOINDEX
    ? [
        'User-agent: *',
        'Allow: /',
        '',
        '# Pre-launch: every page carries <meta name="robots" content="noindex, nofollow">.',
        '# Crawling is deliberately permitted so crawlers can read that directive.',
        '# No sitemap is advertised until launch.',
        '',
      ].join('\n')
    : [
        'User-agent: *',
        'Allow: /',
        '',
        `Sitemap: ${new URL('/sitemap-index.xml', SITE_URL).href}`,
        '',
      ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
