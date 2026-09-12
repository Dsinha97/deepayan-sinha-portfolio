/*
 * Generate dist/resume.pdf from src/pages/resume.md (DSI-97).
 *
 * Why this exists rather than a library: the resume has exactly one source of
 * truth, and a PDF committed by hand would drift from the page the first time
 * a line changed. Generating it in the build makes drift impossible. Doing it
 * without a dependency keeps a headless browser — and its ~200MB of Chromium —
 * out of a build that otherwise installs in 90 seconds.
 *
 * The output uses the base-14 Helvetica faces, so nothing is embedded and the
 * text stays real text: selectable, searchable, and readable by the applicant
 * tracking systems that will be the first thing to open it. That is a better
 * trade for a resume than matching the site's display typography.
 *
 * The phone number is not handled here at all. It cannot be: the markdown
 * never contains it, and check-dist.mjs scans this file after it is written
 * and fails the build on a phone-number pattern. See content-guardrails.md.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateSync } from 'node:zlib';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SOURCE = join(ROOT, 'src/pages/resume.md');
const OUT = join(ROOT, 'dist/resume.pdf');

/* ---------------------------------------------------------------- metrics */

/*
 * Advance widths for the base-14 Helvetica faces, in 1/1000 em, for the
 * characters this document actually uses. Without these there is no way to
 * wrap a line: the width of a string is the sum of its glyph advances, and
 * guessing produces either short lines or text past the margin.
 */
const W_REGULAR = {
  ' ': 278, '!': 278, '"': 355, '#': 556, $: 556, '%': 889, '&': 667, "'": 191,
  '(': 333, ')': 333, '*': 389, '+': 584, ',': 278, '-': 333, '.': 278, '/': 278,
  0: 556, 1: 556, 2: 556, 3: 556, 4: 556, 5: 556, 6: 556, 7: 556, 8: 556, 9: 556,
  ':': 278, ';': 278, '<': 584, '=': 584, '>': 584, '?': 556, '@': 1015,
  A: 667, B: 667, C: 722, D: 722, E: 667, F: 611, G: 778, H: 722, I: 278, J: 500,
  K: 667, L: 556, M: 833, N: 722, O: 778, P: 667, Q: 778, R: 722, S: 667, T: 611,
  U: 722, V: 667, W: 944, X: 667, Y: 667, Z: 611,
  '[': 278, '\\': 278, ']': 278, '^': 469, _: 556, '`': 333,
  a: 556, b: 556, c: 500, d: 556, e: 556, f: 278, g: 556, h: 556, i: 222, j: 222,
  k: 500, l: 222, m: 833, n: 556, o: 556, p: 556, q: 556, r: 333, s: 500, t: 278,
  u: 556, v: 500, w: 722, x: 500, y: 500, z: 500,
  '{': 334, '|': 260, '}': 334, '~': 584,
  '—': 1000, '–': 556, '·': 278, '’': 222, '‘': 222,
};

const W_BOLD = {
  ...W_REGULAR,
  '!': 333, '"': 474, '&': 722, "'": 238, ':': 333, ';': 333, '?': 611, '@': 975,
  A: 722, B: 722, E: 667, J: 556, K: 722, L: 611,
  '[': 333, ']': 333, '^': 584, '`': 333,
  b: 611, c: 556, d: 611, f: 333, g: 611, h: 611, i: 278, j: 278, k: 556, l: 278,
  m: 889, n: 611, o: 611, p: 611, q: 611, r: 389, t: 333, u: 611, v: 556, w: 778,
  x: 556, y: 556, z: 500, '{': 389, '|': 280, '}': 389,
  '’': 238, '‘': 238,
};

const widthsFor = (bold) => (bold ? W_BOLD : W_REGULAR);

function textWidth(str, size, bold) {
  const table = widthsFor(bold);
  let total = 0;
  for (const ch of str) total += table[ch] ?? 556;
  return (total * size) / 1000;
}

/* -------------------------------------------------------------- encoding */

/*
 * WinAnsiEncoding byte values for the few non-ASCII characters in the source.
 * A raw UTF-8 em dash in a PDF string renders as two wrong glyphs rather than
 * failing, which is the kind of bug that ships unnoticed.
 */
const WIN_ANSI = {
  '—': '\\227', // em dash
  '–': '\\226', // en dash
  '·': '\\267', // middle dot
  '’': '\\222', // right single quote
  '‘': '\\221',
  '“': '\\223',
  '”': '\\224',
};

function pdfString(str) {
  let out = '';
  for (const ch of str) {
    if (WIN_ANSI[ch]) out += WIN_ANSI[ch];
    else if (ch === '(' || ch === ')' || ch === '\\') out += `\\${ch}`;
    else if (ch.codePointAt(0) > 126) out += '?';
    else out += ch;
  }
  return out;
}

/* ---------------------------------------------------------------- parsing */

/*
 * A deliberately small markdown reader. It handles only what resume.md uses,
 * and it is in the same repository as the file it parses — so if the resume
 * grows a construct this does not understand, that is a build to fix, not a
 * general-purpose parser to write.
 */
function parse(markdown) {
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  const blocks = [];

  for (const raw of body.split(/\r?\n\r?\n/)) {
    const chunk = raw.trim();
    if (!chunk) continue;

    if (chunk.startsWith('# ')) {
      blocks.push({ type: 'h1', text: chunk.slice(2) });
    } else if (chunk.startsWith('## ')) {
      blocks.push({ type: 'h2', text: chunk.slice(3) });
    } else if (chunk.startsWith('### ')) {
      blocks.push({ type: 'h3', text: chunk.slice(4) });
    } else if (chunk.startsWith('- ')) {
      for (const item of chunk.split(/\r?\n(?=- )/)) {
        blocks.push({ type: 'li', text: inline(item.replace(/^- /, '')) });
      }
    } else {
      blocks.push({ type: 'p', text: inline(chunk) });
    }
  }
  return blocks;
}

/* Links become their visible text; emphasis markers are dropped. Bold is kept
 * only as a whole-line signal, which is the only way the resume uses it. */
function inline(str) {
  return str
    .replace(/\r?\n\s*/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .trim();
}


/* ----------------------------------------------------------------- layout */

const PAGE = { width: 612, height: 792 };
const MARGIN = { top: 54, bottom: 54, left: 54, right: 54 };
const CONTENT_WIDTH = PAGE.width - MARGIN.left - MARGIN.right;

const STYLE = {
  h1: { size: 20, bold: true, before: 0, after: 4, leading: 24 },
  contact: { size: 9, bold: false, before: 0, after: 14, leading: 12 },
  h2: { size: 11.5, bold: true, before: 14, after: 6, leading: 14, rule: true },
  h3: { size: 10, bold: true, before: 9, after: 2, leading: 12.5 },
  meta: { size: 8.5, bold: false, before: 0, after: 4, leading: 11 },
  p: { size: 9, bold: false, before: 0, after: 6, leading: 12 },
  li: { size: 9, bold: false, before: 0, after: 3, leading: 12, bullet: true },
};

function wrap(text, size, bold, width) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (textWidth(candidate, size, bold) > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function layout(blocks) {
  const pages = [];
  let ops = [];
  let y = PAGE.height - MARGIN.top;

  const newPage = () => {
    pages.push(ops);
    ops = [];
    y = PAGE.height - MARGIN.top;
  };

  blocks.forEach((block, index) => {
    /*
     * The line under a role heading is its dates and location, and the line
     * under the name is the contact row. Both are metadata rather than prose,
     * and both are identified by position because that is how the markdown
     * expresses them.
     */
    const previous = blocks[index - 1];
    let kind = block.type;
    if (block.type === 'p' && previous?.type === 'h1') kind = 'contact';
    else if (block.type === 'p' && previous?.type === 'h3') kind = 'meta';

    const style = STYLE[kind] ?? STYLE.p;
    const indent = style.bullet ? 12 : 0;
    const lines = wrap(block.text, style.size, style.bold, CONTENT_WIDTH - indent);
    const blockHeight = style.before + lines.length * style.leading + style.after;

    /*
     * Keep a heading with its first line of content. A section title alone at
     * the foot of a page is the classic generated-PDF tell.
     */
    const needed =
      kind === 'h2' || kind === 'h3' ? blockHeight + STYLE.p.leading * 2 : blockHeight;
    if (y - needed < MARGIN.bottom && ops.length > 0) newPage();

    y -= style.before;

    if (style.rule) {
      ops.push(
        `0.6 w 0.75 0.75 0.75 RG ${MARGIN.left} ${(y - style.size - 3).toFixed(2)} m ` +
          `${(PAGE.width - MARGIN.right).toFixed(2)} ${(y - style.size - 3).toFixed(2)} l S`
      );
    }

    lines.forEach((line, i) => {
      y -= style.leading;
      const x = MARGIN.left + indent;
      if (style.bullet && i === 0) {
        ops.push(
          `BT /F1 ${style.size} Tf 0.2 0.2 0.2 rg ${MARGIN.left + 2} ${y.toFixed(2)} Td (\\267) Tj ET`
        );
      }
      const font = style.bold ? '/F2' : '/F1';
      const grey = kind === 'meta' || kind === 'contact' ? '0.35 0.35 0.35' : '0.1 0.1 0.1';
      ops.push(
        `BT ${font} ${style.size} Tf ${grey} rg ${x} ${y.toFixed(2)} Td (${pdfString(line)}) Tj ET`
      );
    });

    y -= style.after;
  });

  pages.push(ops);
  return pages;
}

/* -------------------------------------------------------------- emission */

function buildPdf(pages, meta) {
  const objects = [];
  const add = (body) => {
    objects.push(body);
    return objects.length; // 1-based object number
  };

  const fontRegular = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const fontBold = add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');

  /*
   * Each page costs two objects (its content stream and the page itself), and
   * the Pages node follows them. Page objects have to name their parent before
   * that parent is written, so the number is predicted here and checked below
   * — a wrong /Parent produces a file that opens in some readers and not
   * others, which is the worst kind of wrong.
   */
  const pagesObjNumber = objects.length + pages.length * 2 + 1;
  const pageNumbers = [];

  for (const ops of pages) {
    const stream = deflateSync(Buffer.from(ops.join('\n'), 'latin1'));
    const contentNumber = add({
      dict: `<< /Length ${stream.length} /Filter /FlateDecode >>`,
      stream,
    });
    pageNumbers.push(
      add(
        `<< /Type /Page /Parent ${pagesObjNumber} 0 R /MediaBox [0 0 ${PAGE.width} ${PAGE.height}] ` +
          `/Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> ` +
          `/Contents ${contentNumber} 0 R >>`
      )
    );
  }

  const pagesNumber = add(
    `<< /Type /Pages /Kids [${pageNumbers.map((n) => `${n} 0 R`).join(' ')}] /Count ${pageNumbers.length} >>`
  );
  if (pagesNumber !== pagesObjNumber) {
    throw new Error(`Pages object number drifted: expected ${pagesObjNumber}, got ${pagesNumber}`);
  }

  const infoNumber = add(
    `<< /Title (${pdfString(meta.title)}) /Author (${pdfString(meta.author)}) /Creator (build-resume-pdf.mjs) >>`
  );
  const catalogNumber = add(`<< /Type /Catalog /Pages ${pagesNumber} 0 R >>`);

  const chunks = [];
  let offset = 0;
  const push = (buf) => {
    chunks.push(buf);
    offset += buf.length;
  };

  push(Buffer.from('%PDF-1.4\n%\xe2\xe3\xcf\xd3\n', 'latin1'));

  const offsets = [];
  objects.forEach((body, i) => {
    offsets.push(offset);
    const number = i + 1;
    if (typeof body === 'string') {
      push(Buffer.from(`${number} 0 obj\n${body}\nendobj\n`, 'latin1'));
    } else {
      push(Buffer.from(`${number} 0 obj\n${body.dict}\nstream\n`, 'latin1'));
      push(body.stream);
      push(Buffer.from('\nendstream\nendobj\n', 'latin1'));
    }
  });

  const xrefOffset = offset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const o of offsets) xref += `${String(o).padStart(10, '0')} 00000 n \n`;
  push(Buffer.from(xref, 'latin1'));
  push(
    Buffer.from(
      `trailer\n<< /Size ${objects.length + 1} /Root ${catalogNumber} 0 R /Info ${infoNumber} 0 R >>\n` +
        `startxref\n${xrefOffset}\n%%EOF\n`,
      'latin1'
    )
  );

  return Buffer.concat(chunks);
}

/* ------------------------------------------------------------------- run */

const markdown = await readFile(SOURCE, 'utf8');
const blocks = parse(markdown);

const pages = layout(blocks);
const pdf = buildPdf(pages, { title: 'Deepayan Sinha — Resume', author: 'Deepayan Sinha' });
await writeFile(OUT, pdf);

console.log(
  `build-resume-pdf: wrote dist/resume.pdf (${pages.length} page(s), ${(pdf.length / 1024).toFixed(1)} kB)`
);
