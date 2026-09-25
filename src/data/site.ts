// Single source of truth for identity, contact and nav. Components read from
// here; nothing below is hardcoded inline elsewhere. See
// docs/wiki/site-architecture.md.

export const site = {
  name: 'Deepayan Sinha',
  headline: 'Building products with an analytical approach',
  subline: "Not afraid to get my hands dirty.",
  /*
   * The meta description every page falls back to. It lives here rather than
   * as a literal in Head.astro because it did, once: the headline was changed
   * in this file and the description kept the old wording for a full deploy,
   * so search results advertised a positioning line that had been rejected.
   * One home for the sentence, one place to change it.
   */
  description:
    'Building products with an analytical approach — six years of AI/ML product engineering, an MBA in business analytics and supply chain, and shipped production work.',
  url: 'https://deepayansinha.com',
  email: 'contact@deepayansinha.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/dsinha97/',
    github: 'https://github.com/Dsinha97',
  },
  resumePath: '/resume/',
  /*
   * Cloudflare Web Analytics site token (DSI-111). Public by design — it ships
   * in every page's source — so it is not a secret and belongs here. The
   * beacon's two origins are allowed in headers.template; change one without
   * the other and the beacon is blocked silently.
   */
  cloudflareAnalyticsToken: '88a11f334b424bce94ef2b412c5332fb',
} as const;

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Credentials', href: '#education' },
  { label: 'Contact', href: '#contact' },
] as const;
