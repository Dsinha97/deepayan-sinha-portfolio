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
} as const;

export const nav = [
  { label: 'Work', href: '#work' },
  { label: 'Experience', href: '#experience' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
] as const;
