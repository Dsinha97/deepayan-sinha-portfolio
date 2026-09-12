// Single source of truth for identity, contact and nav. Components read from
// here; nothing below is hardcoded inline elsewhere. See
// docs/wiki/site-architecture.md.

export const site = {
  name: 'Deepayan Sinha',
  headline: 'Building products with an analytical approach',
  subline: "Not afraid to get my hands dirty.",
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
