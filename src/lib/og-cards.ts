// What each social card says, and the URL it is served at (DSI-104). Kept apart
// from og-card.ts, which renders, so pages can ask for a card's URL without
// pulling satori and sharp into their build.
//
// The URL carries `?v=` — a hash of the card's text, the renderer's source and
// the stylesheet its colours come from. Link-preview services cache the
// processed image by URL: LinkedIn kept a blurry 160px thumbnail for three of
// the five cards on its first scrape, and re-inspecting the page reused it.
// A changed card must therefore mean a changed URL, and deriving the version
// from the inputs means nobody has to remember to bump it. The query is
// ignored when the file is served; the endpoint writes the same path.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { CollectionEntry } from 'astro:content';
import { site } from '../data/site';

export type CardContent = {
  /* Small uppercase line above the title — "Case study · Solo build". */
  eyebrow: string;
  title: string;
  body: string;
};

export const defaultCard = (): CardContent => ({
  eyebrow: 'Portfolio',
  title: site.name,
  body: site.headline,
});

export const workCard = (entry: CollectionEntry<'work'>): CardContent => ({
  eyebrow: `Case study · ${entry.data.kicker}`,
  title: entry.data.title,
  body: entry.data.tagline,
});

// Read once per build. process.cwd(), not import.meta.url, for the reason
// given in og-card.ts.
let design: string | undefined;
const designInputs = () =>
  (design ??= ['src/lib/og-card.ts', 'src/styles/global.css']
    .map((f) => readFileSync(join(process.cwd(), f), 'utf8'))
    .join('\n'));

/** Root-relative, versioned URL of the card at `/og/<path>.png`. */
export function cardUrl(path: string, content: CardContent): string {
  const v = createHash('sha256')
    .update(designInputs())
    .update(JSON.stringify(content))
    .digest('hex')
    .slice(0, 10);
  return `/og/${path}.png?v=${v}`;
}
