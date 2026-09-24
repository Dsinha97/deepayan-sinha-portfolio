/*
 * "Recent updates" for the FPL Decision case study, synced at build time from
 * the project's own timeline — docs/wiki/timeline.md in the public
 * Dsinha97/fpl-app repository — so every deploy picks up what has shipped
 * since the last one with no edit here.
 *
 * Build-time only. Nothing is fetched in the browser, so the CSP needs no new
 * `connect-src`, and the page is static HTML like every other page.
 *
 * Offline or failed fetch: falls back to src/data/fpl-updates.snapshot.json,
 * which is committed. `SYNC_FPL_SNAPSHOT=1 npm run build` rewrites that file
 * from a successful fetch, so the fallback can be refreshed deliberately.
 *
 * The timeline is written for engineers. Each row is reduced to a title (its
 * first clause) and a one-sentence detail, markdown stripped, and — a copy
 * rule for this site — internal tracker ids like DSI-123 removed, because issue
 * numbers never appear in text a visitor can read.
 */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import snapshot from '../data/fpl-updates.snapshot.json';

export type FplUpdate = { date: string; title: string; detail: string };

export const FPL_TIMELINE_SOURCE =
  'https://github.com/Dsinha97/fpl-app/blob/main/docs/wiki/timeline.md';
/* Overridable only so the snapshot fallback can be exercised: point it at a dead URL and build. */
const RAW_URL =
  process.env.FPL_TIMELINE_URL ??
  'https://raw.githubusercontent.com/Dsinha97/fpl-app/main/docs/wiki/timeline.md';
/*
 * The snapshot is imported, not read from disk: at build time this module runs
 * from a bundled chunk, so a path relative to import.meta.url points nowhere.
 * Only the deliberate refresh writes it, relative to the project root.
 */
const SNAPSHOT_PATH = join(process.cwd(), 'src/data/fpl-updates.snapshot.json');
const LIMIT = 6;

/** Markdown to plain text: links to their text, emphasis and code unwrapped. */
function plain(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__)(.+?)\1/g, '$2')
    .replace(/(\*|_)(.+?)\1/g, '$2')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Remove tracker ids and the punctuation they leave behind. */
function scrubIds(text: string): string {
  return text
    .replace(/\(\s*DSI-\d+(?:\s*(?:,|and|\/)\s*DSI-\d+)*\s*\)/g, '')
    .replace(/\bDSI-\d+(?:\s*\([^)]*\))?\s*(?:—|-|:)\s*/g, '')
    .replace(/\bDSI-\d+\b/g, 'an issue')
    .replace(/\s+([,.;:])/g, '$1')
    .replace(/\(\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/*
 * Sentence boundaries: terminal punctuation followed by a space and a capital.
 * A bare split on "." would cut "−0.589" in half — the timeline is full of
 * decimals.
 */
function sentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z"“(])/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:—-]\s*$/, '')}…`;
}

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
const lowerFirst = (text: string) => (/^[A-Z][a-z]/.test(text) ? text.charAt(0).toLowerCase() + text.slice(1) : text);
const hasId = (text: string) => /\bDSI-\d+/.test(text);

/** One `| YYYY-MM-DD | What | Detail |` row to a display entry. */
function toUpdate(date: string, what: string): FplUpdate {
  const text = plain(what);
  // "Sprint 40: latency. The plan…" / "Sprint 38 — the player profile, …" / "The GW5 check-in. …"
  const split = text.match(/^(.{3,80}?)(?:\s+—\s+|:\s+|\.\s+)(.*)$/);
  let head = (split ? split[1] : text).replace(/\s*\([^)]*\)/g, '').replace(/[.;:]$/, '').trim();
  let rest = sentences(split ? split[2] : '');

  // A bare "Sprint 40" says nothing; borrow its first clause as the subject.
  if (/^(Sprint|M)\s?[\d.]+[a-z]?$/i.test(head) && rest[0] && rest[0].length <= 70) {
    head = `${head}: ${lowerFirst(rest[0].replace(/[.!?]$/, ''))}`;
    rest = rest.slice(1);
  }

  // Prefer a sentence that never mentions a tracker id over one scrubbed of it:
  // "DSI-53 (refit …) canceled" reads badly with the id cut out.
  const detail = rest.find((sentence) => !hasId(sentence)) ?? rest[0] ?? '';

  return {
    date,
    title: clip(scrubIds(head), 90),
    detail: detail ? clip(capitalise(scrubIds(detail)), 200) : '',
  };
}

export function parseTimeline(markdown: string): FplUpdate[] {
  const rows = [...markdown.matchAll(/^\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(.+?)\s*\|.*\|\s*$/gm)];
  return rows
    .map(([, date, what], index) => ({ index, update: toUpdate(date, what) }))
    .filter(({ update }) => update.title.length > 0)
    // Newest first; within a day, the row written last is the latest.
    .sort((a, b) => b.update.date.localeCompare(a.update.date) || b.index - a.index)
    .slice(0, LIMIT)
    .map(({ update }) => update);
}

let cached: Promise<{ updates: FplUpdate[]; live: boolean }> | undefined;

/** Fetched once per build, however many pages ask. */
export function getFplUpdates(): Promise<{ updates: FplUpdate[]; live: boolean }> {
  cached ??= (async () => {
    try {
      const res = await fetch(RAW_URL, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const updates = parseTimeline(await res.text());
      if (updates.length === 0) throw new Error('no dated rows found');
      if (process.env.SYNC_FPL_SNAPSHOT === '1') {
        await writeFile(SNAPSHOT_PATH,`${JSON.stringify(updates, null, 2)}\n`);
      }
      return { updates, live: true };
    } catch (error) {
      console.warn(`[fpl-updates] using the committed snapshot: ${(error as Error).message}`);
      return { updates: snapshot as FplUpdate[], live: false };
    }
  })();
  return cached;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** 2026-09-24 → "24 Sep 2026". Formatted by hand: en-GB now prints "Sept". */
export function formatUpdateDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}
