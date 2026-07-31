/**
 * Every piece of site-wide copy and configuration lives here, so changing the
 * wording later means editing one file rather than hunting through components.
 *
 * This is the first file to edit after using the template.
 */

/** TODO: Used in <title>, the header brand and Open Graph tags. */
export const SITE_TITLE = 'Your Name';

/** TODO: Meta description for the home page. Google truncates around 155 characters. */
export const SITE_DESCRIPTION =
  'Independent developer building and shipping web applications for small teams.';

/**
 * TODO: Canonical origin. Kept in sync with `site` in astro.config.mjs — the
 * config value drives the sitemap, this one drives canonical and og: URLs.
 * No trailing slash.
 */
export const SITE_URL = 'https://example.com';

/** TODO: The `lang` attribute on <html>. Add a region if you want one, e.g. 'en-GB'. */
export const SITE_LOCALE = 'en';

/**
 * Keep the whole site out of search engines.
 *
 * While true, every page emits `<meta name="robots" content="noindex, nofollow">`
 * and robots.txt stops advertising the sitemap.
 *
 * Set to false to be indexable. That is the only change needed — robots.txt and
 * every page's meta tag both read from here.
 *
 * Note this deliberately does NOT add `Disallow: /` to robots.txt. Blocking the
 * crawl would stop Google from ever *fetching* the page, and therefore from ever
 * seeing the noindex directive — which lets a URL stay indexed from inbound links
 * with no content. Letting crawlers in so they can read the noindex is what
 * actually keeps the site out of the index.
 */
export const SITE_NOINDEX = true;

/** TODO: Public contact address, shown in the footer and under the contact form. */
export const CONTACT_EMAIL = 'you@example.com';

/** TODO: Subject line Web3Forms puts on the notification email it sends you. */
export const CONTACT_SUBJECT = 'New enquiry from your website';

/**
 * Primary navigation. The targets are sections of the home page, so the hrefs
 * are root-relative ('/#about') rather than bare fragments ('#about'): the nav
 * renders on every page, and a bare fragment would resolve against whatever
 * document the visitor is on — dead links on /thanks and /404. On the home page
 * itself this is still a same-document navigation, so scrolling is unchanged.
 * Swap to real paths (e.g. '/services') if the site grows past one page.
 */
export const NAV_ITEMS = [
  { href: '/#services', label: 'Services' },
  { href: '/#about', label: 'About' },
  { href: '/#contact', label: 'Contact' },
] as const;

/**
 * TODO: External profiles rendered in the footer. Ships empty — a link to an
 * empty or abandoned profile reads worse than no link at all. Add entries once
 * there is something worth showing, e.g.
 *
 *   { href: 'https://github.com/you', label: 'GitHub' }
 */
export const SOCIAL_LINKS: { href: string; label: string }[] = [];
