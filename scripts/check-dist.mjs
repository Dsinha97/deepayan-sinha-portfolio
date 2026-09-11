/*
 * Fail the build on anything in dist/ that the Content Security Policy would
 * block, or that the content guardrails forbid (DSI-87).
 *
 * These are two different kinds of check sharing one pass:
 *
 * - The CSP checks exist because **an enforcing policy fails silently.** A
 *   blocked inline script or style does not error the build, does not warn,
 *   and often does not visibly break the page — it just quietly stops working
 *   for every visitor. Catching it here is the only place it is loud.
 * - The phone-number check is not a security control at all. It enforces
 *   docs/wiki/content-guardrails.md mechanically rather than by review,
 *   because a phone number on a public URL is permanent and scrapeable, and
 *   "we'll remember not to" is not a control.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');

/** Text formats worth scanning. PDFs are handled separately — see below. */
const TEXT = new Set(['.html', '.css', '.js', '.json', '.xml', '.txt', '.svg', '.webmanifest']);

const failures = [];
const fail = (file, rule, detail) => failures.push({ file, rule, detail });

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

/*
 * Deliberately permissive about formatting and strict about substance: matches
 * +1 (757) 555-0123, 757.555.0123, 7575550123 and friends. It will also match
 * some long numbers that are not phone numbers, which is the right way round —
 * a false positive costs one conversation, a false negative is permanent.
 */
const PHONE = /(?:\+?\d{1,3}[\s.\-]?)?\(?\d{3}\)?[\s.\-]?\d{3}[\s.\-]?\d{4}\b/g;

/* Numbers that are legitimately in the output and are not phone numbers. */
const PHONE_ALLOW = [
  /max-age=\d+/, // Cache-Control, HSTS
  /\b\d{4}-\d{2}-\d{2}\b/, // ISO dates in the sitemap
];

const files = await walk(DIST);

for (const file of files) {
  const rel = relative(DIST, file);
  const ext = extname(file);

  if (ext === '.pdf') {
    // The resume PDF ships to public/ with the phone number stripped (DSI-97).
    // Raw byte scan: enough to catch an uncompressed text object, and the real
    // guarantee is that the file is regenerated without the number. Flagged
    // here so a careless replacement is at least noisy.
    const raw = await readFile(file, 'latin1');
    for (const hit of raw.match(PHONE) ?? []) {
      if (!PHONE_ALLOW.some((ok) => ok.test(hit))) fail(rel, 'phone-number', hit);
    }
    continue;
  }

  if (!TEXT.has(ext)) continue;
  const text = await readFile(file, 'utf8');

  if (ext === '.html') {
    // Inline scripts. The theme init is expected and hashed; anything else
    // needs a hash of its own, which means it needs a decision, not a default.
    const inline = [...text.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)];
    for (const [, body] of inline) {
      if (!body.includes('localStorage.getItem("theme")')) {
        fail(rel, 'inline-script', body.trim().slice(0, 80));
      }
    }

    // style="" attributes. `style-src 'self'` blocks them, and Astro is
    // configured never to inline stylesheets, so one here means a component
    // grew a style attribute by hand.
    for (const [match] of text.matchAll(/\sstyle="[^"]*"/g)) {
      fail(rel, 'style-attribute', match.trim().slice(0, 80));
    }

    // <style> blocks. Same policy, same silent failure.
    if (/<style[\s>]/i.test(text)) fail(rel, 'inline-style-block', '<style> in HTML');
  }

  for (const hit of text.match(PHONE) ?? []) {
    if (!PHONE_ALLOW.some((ok) => ok.test(hit))) fail(rel, 'phone-number', hit);
  }
}

if (failures.length > 0) {
  console.error(`\ncheck-dist: ${failures.length} problem(s) in dist/\n`);
  for (const { file, rule, detail } of failures) {
    console.error(`  ${rule.padEnd(20)} ${file}\n      ${detail}`);
  }
  console.error('\nSee docs/wiki/security-headers.md and docs/wiki/content-guardrails.md.\n');
  process.exit(1);
}

console.log(`check-dist: ${files.length} file(s) clean`);
