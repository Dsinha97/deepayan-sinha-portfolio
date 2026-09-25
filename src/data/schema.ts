// JSON-LD builders (DSI-103). One `Person` node with a stable @id; the homepage
// wraps it in a ProfilePage and every case study's Article points at it **by
// id** rather than repeating it. That reference is what makes the pages one
// entity instead of several documents about someone with the same name. See
// docs/wiki/seo-and-metadata.md.
//
// Only facts already published on the site go in here. No jobTitle — he is
// looking for a role, and any title would be a claim the page doesn't make —
// and never aggregateRating or review: rating markup with nothing behind it is
// a structured-data penalty as well as a misrepresentation.
import { getCollection, type CollectionEntry } from 'astro:content';
import { getImage } from 'astro:assets';
import headshot from '../assets/headshot.jpg';
import { site } from './site';

export const PERSON_ID = `${site.url}/#person`;

const absolute = (path: string) => new URL(path, site.url).href;

async function personNode() {
  const schools = (await getCollection('education')).sort((a, b) => a.data.order - b.data.order);
  const photo = await getImage({ src: headshot, width: 512, format: 'jpg' });

  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: site.name,
    url: `${site.url}/`,
    description: site.description,
    email: `mailto:${site.email}`,
    image: absolute(photo.src),
    // Must match the profile URLs exactly — this is the field that ties the
    // site to them.
    sameAs: [site.links.linkedin, site.links.github],
    alumniOf: schools.map((s) => ({ '@type': 'CollegeOrUniversity', name: s.data.school })),
  };
}

export async function profilePage() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: `${site.url}/`,
    name: `${site.name} — ${site.headline}`,
    mainEntity: await personNode(),
  };
}

export async function caseStudyArticle(entry: CollectionEntry<'work'>, pageUrl: string) {
  const cover = await getImage({ src: entry.data.cover, width: 1200, format: 'jpg' });

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.data.title,
    description: entry.data.tagline,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    image: absolute(cover.src),
    // The @id is the reference; name and url are the minimum a consumer that
    // doesn't follow references (Google's Article checks) needs to see an
    // author at all. The full node lives on the homepage only.
    author: { '@type': 'Person', '@id': PERSON_ID, name: site.name, url: `${site.url}/` },
  };
}
