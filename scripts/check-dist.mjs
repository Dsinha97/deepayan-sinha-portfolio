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
import { inflateSync } from 'node:zlib';
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
    //
    // This branch used to scan the raw latin1 bytes of the whole file, which
    // was wrong in both directions and measured as such against the real
    // resume:
    //
    //   - **False negative.** PDF text lives in FlateDecode streams. A phone
    //     number in normally-compressed text is simply not present in the raw
    //     bytes, so the scan could not see it. The resume carries four
    //     phone-shaped strings that only appear after inflating.
    //   - **False positive flood.** Binary image and font data matched the
    //     phone pattern 131 times on that same file. A guard that fails on
    //     every PDF with 131 unreadable hits does not tell anyone anything,
    //     and the one real hit would have been invisible among them.
    //
    // So: inflate each stream and scan the decoded text, and scan only the
    // *non-stream* portions raw, where an uncompressed text object would sit.
    // Binary stream payloads are never pattern-matched as bytes.
    const raw = await readFile(file, 'latin1');

    const scan = (text, where) => {
      for (const hit of text.match(PHONE) ?? []) {
        if (!PHONE_ALLOW.some((ok) => ok.test(hit))) fail(rel, 'phone-number', `${where}: ${hit}`);
      }
    };

    let outsideStreams = '';
    let cursor = 0;
    for (const match of raw.matchAll(/stream\r?\n?([\s\S]*?)endstream/g)) {
      outsideStreams += raw.slice(cursor, match.index);
      cursor = match.index + match[0].length;
      try {
        scan(inflateSync(Buffer.from(match[1], 'latin1')).toString('latin1'), 'compressed text');
      } catch {
        // Not a Flate stream (an image, or already raw). Its uncompressed
        // text, if any, is caught by the outside-streams scan below only when
        // it sits outside a stream — so scan short non-binary payloads here
        // rather than skipping them silently.
        const body = match[1];
        if (body.length < 100_000 && !/[\x00\x01\x02\x03\x04]/.test(body.slice(0, 512))) {
          scan(body, 'uncompressed stream');
        }
      }
    }
    /*
     * Strip the cross-reference table before scanning. Every xref entry is a
     * zero-padded 10-digit byte offset — `0000003694 00000 n ` — which matches
     * the bare-10-digit form of the phone pattern exactly. Leaving it in makes
     * every generated PDF fail on its own structure, which is how a guard
     * stops being read.
     *
     * This removes only the exact xref shape (10 digits, 5 digits, n or f), not
     * digits generally. A phone number cannot be laundered through it: no real
     * number is followed by " 00000 n ".
     */
    outsideStreams += raw.slice(cursor);
    scan(outsideStreams.replace(/^\d{10} \d{5} [nf] ?$/gm, ''), 'document structure');
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
