// Social-card endpoint (DSI-104). Prerendered like every other route, so each
// card is a real PNG in dist/og/ — no runtime, nothing for the CSP to allow.
// One default card for the homepage and the resume, one per case study so a
// shared link shows the case study's own title. Head.astro points at these.
import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { renderCard } from '../../lib/og-card';
import { defaultCard, workCard, type CardContent } from '../../lib/og-cards';

export const getStaticPaths = (async () => {
  const work = await getCollection('work');
  return [
    {
      params: { card: 'default' },
      props: defaultCard(),
    },
    ...work.map((entry) => ({
      params: { card: `work/${entry.id}` },
      props: workCard(entry),
    })),
  ];
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await renderCard(props as CardContent)), {
    headers: { 'Content-Type': 'image/png' },
  });
