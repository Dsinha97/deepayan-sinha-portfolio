// Social cards (DSI-104), rendered at build time: satori lays the card out
// with the site's own faces and emits an SVG whose text is already glyph
// outlines; sharp rasterises that to PNG. Because the text is outlines, no
// system font is ever consulted — the card renders the same on this machine
// and on the Linux build host.
//
// Colours are read out of src/styles/global.css rather than restated here, so
// a token change reaches the cards on the next build and the two cannot drift.
// The light-mode values are the first declaration of each name in that file.
// See docs/wiki/seo-and-metadata.md.
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import type { CardContent } from './og-cards';

// From the project root, not import.meta.url: Astro bundles this file into a
// chunk under dist/, so a path relative to the module would point there.
const fromRoot = (...parts: string[]) => join(process.cwd(), ...parts);

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;


const fontFile = (pkg: string, file: string) =>
  readFile(fromRoot('node_modules', pkg, 'files', file));

async function tokens() {
  const css = await readFile(fromRoot('src/styles/global.css'), 'utf8');
  const pick = (name: string) => {
    const m = css.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{3,8})`));
    if (!m) throw new Error(`og-card: token --${name} not found in global.css`);
    return m[1];
  };
  return {
    bg: pick('bg'),
    fg: pick('fg'),
    fg2: pick('fg-2'),
    accent: pick('accent-fill'),
    seam: pick('seam'),
    gold: pick('gold'),
    letters: pick('mark-letters'),
    arrow: pick('mark-arrow'),
  };
}

// Loaded once per build, not once per card.
let assets: Promise<{
  fonts: Parameters<typeof satori>[1]['fonts'];
  t: Awaited<ReturnType<typeof tokens>>;
  mark: string;
}> | undefined;

function load() {
  assets ??= (async () => {
    const t = await tokens();
    const [serif, inter400, inter600, markSvg] = await Promise.all([
      fontFile('@fontsource/instrument-serif', 'instrument-serif-latin-400-normal.woff'),
      fontFile('@fontsource/inter', 'inter-latin-400-normal.woff'),
      fontFile('@fontsource/inter', 'inter-latin-600-normal.woff'),
      readFile(fromRoot('public/logo-mark.svg'), 'utf8'),
    ]);
    // The mark carries a prefers-color-scheme block for its dark variant; a
    // card is one fixed image, so strip it and pin the light colours from the
    // tokens. Rasterised up front — a nested SVG with clip paths and a <style>
    // is exactly the kind of input a second renderer disagrees about.
    const lightMark = markSvg
      .replace(/@media[^{]*\{[^}]*\}[^}]*\}/, '')
      .replace(/\.l\{fill:#[0-9A-Fa-f]+\}/, `.l{fill:${t.letters}}`)
      .replace(/\.a\{fill:#[0-9A-Fa-f]+\}/, `.a{fill:${t.arrow}}`)
      .replace(/stroke:#[0-9A-Fa-f]+/, `stroke:${t.seam}`);
    const png = await sharp(Buffer.from(lightMark), { density: 600 })
      .resize({ width: 240 })
      .png()
      .toBuffer();
    return {
      t,
      mark: `data:image/png;base64,${png.toString('base64')}`,
      fonts: [
        { name: 'Instrument Serif', data: serif, weight: 400, style: 'normal' },
        { name: 'Inter', data: inter400, weight: 400, style: 'normal' },
        { name: 'Inter', data: inter600, weight: 600, style: 'normal' },
      ],
    };
  })();
  return assets;
}

// satori takes React-element-shaped objects; this saves pulling in React to
// write four boxes.
type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

export async function renderCard({ eyebrow, title, body }: CardContent): Promise<Buffer> {
  const { t, mark, fonts } = await load();
  // Long titles step down rather than wrap to a third line.
  const titleSize = title.length > 40 ? 64 : title.length > 24 ? 76 : 92;

  const card = el(
    'div',
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: t.bg,
      padding: '64px 80px 56px',
      fontFamily: 'Inter',
      color: t.fg,
    },
    [
      el('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between' }, [
        el('img', { width: 120, height: 67 }, undefined, { src: mark, width: 120, height: 67 }),
        el('div', { fontSize: 22, fontWeight: 600, color: t.accent }, 'deepayansinha.com'),
      ]),
      el('div', { display: 'flex', flexDirection: 'column' }, [
        el(
          'div',
          { fontSize: 20, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: t.gold },
          eyebrow,
        ),
        el(
          'div',
          {
            marginTop: 16,
            fontFamily: 'Instrument Serif',
            fontSize: titleSize,
            lineHeight: 1.05,
            color: t.fg,
            display: 'block',
            lineClamp: 2,
          },
          title,
        ),
        el(
          'div',
          // satori only honours lineClamp on a block box.
          { display: 'block', marginTop: 24, fontSize: 28, lineHeight: 1.4, color: t.fg2, lineClamp: 3, maxWidth: 1000 },
          body,
        ),
      ]),
      // The kintsugi seam, as a plain rule — the one gold line on the card.
      el('div', { display: 'flex', height: 4, width: 160, backgroundColor: t.seam, borderRadius: 2 }),
    ],
  );

  const svg = await satori(card as never, { width: OG_WIDTH, height: OG_HEIGHT, fonts });
  return sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
}
