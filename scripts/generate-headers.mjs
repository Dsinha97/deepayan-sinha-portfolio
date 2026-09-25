/*
 * Generate dist/_headers from headers.template, substituting the CSP hash of
 * the one inline script (DSI-87).
 *
 * Why generate rather than hand-maintain: a hardcoded hash goes stale the
 * first time someone edits the theme script, and the failure is completely
 * silent — the policy blocks the script, the theme stops applying, and nothing
 * in the build says a word. Deriving it every build makes that impossible.
 *
 * The hash is taken from the **built HTML**, not from the source file, because
 * the browser hashes the bytes it actually receives. It is then checked
 * against the hash of the source file: if Astro ever transforms the script on
 * its way into the page, those two disagree and the build stops here rather
 * than shipping a policy that blocks its own script.
 */
import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const TEMPLATE = join(ROOT, 'headers.template');
const SOURCE = join(ROOT, 'src/scripts/theme-init.js');

const sha256 = (buf) => `sha256-${createHash('sha256').update(buf).digest('base64')}`;

/**
 * Every inline <script>…</script> body in a page, without its tag. JSON-LD
 * blocks (DSI-103) are skipped: they are data, never executed, so script-src
 * does not govern them and they need no hash. check-dist.mjs checks they parse.
 */
const inlineScripts = (html) =>
  [...html.matchAll(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((m) => !/\btype="application\/ld\+json"/.test(m[1]))
    .map((m) => m[2]);

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

const pages = await htmlFiles(DIST);
if (pages.length === 0) {
  console.error('generate-headers: no HTML in dist/. Did the build run?');
  process.exit(1);
}

// Collect the inline scripts across every page. They must all be the same
// script — the theme init — or the policy would need a hash per page.
const found = new Map();
for (const page of pages) {
  for (const body of inlineScripts(await readFile(page, 'utf8'))) {
    const hash = sha256(Buffer.from(body, 'utf8'));
    if (!found.has(hash)) found.set(hash, { body, pages: [] });
    found.get(hash).pages.push(relative(DIST, page));
  }
}

if (found.size !== 1) {
  console.error(
    `generate-headers: expected exactly one distinct inline script across dist/, found ${found.size}.`
  );
  for (const [hash, info] of found) {
    console.error(`  ${hash}  in ${info.pages.join(', ')}`);
    console.error(`    ${info.body.trim().slice(0, 90)}…`);
  }
  process.exit(1);
}

const [hash, info] = [...found.entries()][0];
const sourceHash = sha256(await readFile(SOURCE));

if (hash !== sourceHash) {
  console.error('generate-headers: the inline script in dist/ is not byte-identical to the source.');
  console.error(`  dist/   ${hash}`);
  console.error(`  source  ${sourceHash}`);
  console.error('  Something transformed it on the way in — `is:inline` may have been dropped.');
  process.exit(1);
}

const template = await readFile(TEMPLATE, 'utf8');
if (!template.includes('{{THEME_HASH}}')) {
  console.error('generate-headers: headers.template has no {{THEME_HASH}} placeholder.');
  process.exit(1);
}

await writeFile(join(DIST, '_headers'), template.replaceAll('{{THEME_HASH}}', hash), 'utf8');
console.log(`generate-headers: wrote dist/_headers with ${hash} (${info.pages.length} page(s))`);
