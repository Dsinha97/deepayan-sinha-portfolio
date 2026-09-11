#!/usr/bin/env python3
"""Rebuild every logo asset — the Astro component and public/ — from images/logo.jpg.

DSI-89 and DSI-115.

This is a **one-off developer tool, not part of the build.** Nothing in
`npm run build` calls it and the site never needs it at runtime; the assets it
writes are committed. It lives here so the mark can be regenerated — a
different seam, a new size, a corrected colour — without redoing the trace by
hand, which is the part that took the time.

    py -3 scripts/trace-logo.py        # needs numpy, pillow, scipy, contourpy

Why a trace at all: `images/logo.jpg` is a 2390x1792 JPEG of the mark on a
white canvas, and no vector original survives. A JPEG cannot be recoloured for
dark mode, so it renders as a white box there; that made a vector mark a
blocking dependency for the shell rather than a polish item.

How it works, since "auto-traced" is doing a lot of work in that sentence:

1. Two colour masks are cut from the source — purple for the letterforms, teal
   for the arrow — by channel comparison rather than by nearest-colour, which
   keeps the antialiased edges out of the mask.
2. Each mask is blurred slightly and contoured at the half-level (marching
   squares, via contourpy). The blur is what turns a staircase of pixel edges
   into a smooth iso-line; without it the curves come out visibly polygonal.
3. Contours are simplified (Ramer-Douglas-Peucker, epsilon 1.5px at source
   resolution) and refitted as closed Catmull-Rom splines emitted as cubic
   Beziers. `fill-rule="evenodd"` then handles the counters of the D and S for
   free, so holes never need identifying separately.
4. The kintsugi seam is drawn over the result and clipped to the letterforms,
   so gold appears only where the break crosses a stroke.

The rasters are composited from the masks directly rather than from the SVG,
which avoids needing an SVG renderer in the toolchain.
"""

from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw
from contourpy import contour_generator
from scipy.ndimage import binary_dilation, gaussian_filter

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "images" / "logo.jpg"
PUBLIC = ROOT / "public"

# The source has three bands: the mark, then the wordmark, then the URL. Only
# the mark is wanted; the rows come from the ink profile of the file itself.
BAND = (476, 1000)

# Seam A: one break, top-left to bottom-right, with two hairline branches.
# Coordinates are in the mark's own 100-wide user space.
SEAM_MAIN = [(12, 2), (19, 13), (26, 19), (33, 30), (41, 36), (50, 41), (58, 47), (66, 54)]
SEAM_BRANCHES = [[(26, 19), (31, 12)], [(50, 41), (56, 36)]]

PURPLE = (0x3E, 0x2A, 0x68)  # on a ground we control
PURPLE_MID = (0x53, 0x3A, 0x80)  # on a ground we don't — survives light and dark tab bars
TEAL = (0x3A, 0x93, 0xA3)
GOLD = (0xC9, 0xA2, 0x27)
PAPER = (0xFA, 0xF7, 0xF2, 255)


def colour_masks(path, y0, y1):
    a = np.asarray(Image.open(path).convert("RGB")).astype(int)[y0:y1]
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    letters = (b > r + 25) & (b > g + 35) & (r < 150) & (g < 120)
    arrow = (g > r + 30) & (b > r + 30) & (g > 90) & (b > 90)
    return letters, arrow


def contours(mask, sigma=1.6, level=0.5):
    m = gaussian_filter(mask.astype(float), sigma)
    h, w = m.shape
    x, y = np.meshgrid(np.arange(w, dtype=float), np.arange(h, dtype=float))
    gen = contour_generator(x, y, m, name="serial", line_type="SeparateCode")
    return [np.asarray(s) for s in gen.lines(level)[0] if len(s) > 8]


def rdp(pts, eps):
    """Ramer-Douglas-Peucker, iterative so a 2700-point contour can't blow the stack."""
    if len(pts) < 3:
        return pts
    keep = np.zeros(len(pts), bool)
    keep[0] = keep[-1] = True
    stack = [(0, len(pts) - 1)]
    while stack:
        i, j = stack.pop()
        if j <= i + 1:
            continue
        p, q = pts[i], pts[j]
        d = q - p
        n = float(np.hypot(*d))
        v = pts[i + 1 : j] - p
        dist = np.hypot(*v.T) if n == 0 else np.abs(d[0] * v[:, 1] - d[1] * v[:, 0]) / n
        k = int(np.argmax(dist))
        if dist[k] > eps:
            k += i + 1
            keep[k] = True
            stack += [(i, k), (k, j)]
    return pts[keep]


def to_path(pts, scale, ox, oy, tension=0.5):
    """Closed Catmull-Rom through pts, emitted as cubic Beziers."""
    p = pts[:-1] if np.allclose(pts[0], pts[-1]) else pts
    n = len(p)
    f = lambda q: f"{(q[0] - ox) * scale:.2f} {(q[1] - oy) * scale:.2f}"
    out = [f"M{f(p[0])}"]
    for i in range(n):
        p0, p1, p2, p3 = p[(i - 1) % n], p[i], p[(i + 1) % n], p[(i + 2) % n]
        out.append(f"C{f(p1 + (p2 - p0) * (tension / 3))} {f(p2 - (p3 - p1) * (tension / 3))} {f(p2)}")
    return "".join(out) + "Z"


def main():
    letters, arrow = colour_masks(SOURCE, *BAND)
    cl, ca = contours(letters), contours(arrow)

    pts = np.vstack(cl + ca)
    x0, y0 = pts.min(0)
    x1, y1 = pts.max(0)
    scale = 100.0 / (x1 - x0)
    view_h = round((y1 - y0) * scale, 2)

    d_letters = " ".join(to_path(rdp(c, 1.5), scale, x0, y0) for c in cl)
    d_arrow = " ".join(to_path(rdp(c, 1.5), scale, x0, y0) for c in ca)
    seam_main = "M" + " L".join(f"{u} {v}" for u, v in SEAM_MAIN)
    seam_branch = " ".join("M" + " L".join(f"{u} {v}" for u, v in br) for br in SEAM_BRANCHES)

    # ---- src/components/LogoMark.astro ---------------------------------
    # The component is generated too, from scripts/logo-mark.astro.tpl, so the
    # inline mark and the standalone file cannot drift apart. Edit the
    # template, never the generated component; only the five placeholders are
    # substituted, so everything else in it is hand-written and preserved.
    template = (ROOT / "scripts" / "logo-mark.astro.tpl").read_text(encoding="utf-8")
    (ROOT / "src" / "components" / "LogoMark.astro").write_text(
        template.replace("__VH__", str(view_h))
        .replace("__L__", d_letters)
        .replace("__A__", d_arrow)
        .replace("__SM__", seam_main)
        .replace("__SB__", seam_branch),
        encoding="utf-8",
        newline="\n",
    )

    # ---- public/logo-mark.svg ------------------------------------------
    # Standalone copy for anywhere that needs a file rather than the Astro
    # component: social cards, a README, an email signature. Theme-aware on
    # its own, since an <img> gets no CSS from the page that embeds it.
    PUBLIC.joinpath("logo-mark.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 {view_h}" role="img" aria-label="Deepayan Sinha">\n'
        f"<title>Deepayan Sinha</title>\n<style>\n"
        f".l{{fill:#3E2A68}}.a{{fill:#3A93A3}}"
        f".s{{fill:none;stroke:#C9A227;stroke-linecap:round;stroke-linejoin:round}}\n"
        f"@media (prefers-color-scheme:dark){{.l{{fill:#B5A3D2}}.a{{fill:#5FB0BE}}.s{{stroke:#D9B44A}}}}\n"
        f'</style>\n<clipPath id="s"><path d="{d_letters}"/></clipPath>\n'
        f'<path class="l" fill-rule="evenodd" d="{d_letters}"/>\n'
        f'<path class="a" fill-rule="evenodd" d="{d_arrow}"/>\n'
        f'<g clip-path="url(#s)" class="s">\n'
        f'<path d="{seam_main}" stroke-width="1.5"/>\n'
        f'<path d="{seam_branch}" stroke-width="0.9" stroke-opacity=".6"/>\n'
        f"</g>\n</svg>\n",
        encoding="utf-8",
        newline="\n",
    )

    # ---- public/favicon.svg --------------------------------------------
    # Square, and deliberately not the same drawing: at 16-32px the script
    # strokes vanish and a 1.5-wide seam disappears entirely. The letterforms
    # get a stroke of their own colour to fatten them, the seam is thickened,
    # and the branches are dropped as noise at that size.
    #
    # 0.6 is the ceiling on that stroke. At 1.1 the mark still reads at 32px,
    # but some browser UI renders favicon.svg at 128px or larger, and there
    # the stroke closes the counters of the D and S and the letters collapse
    # into a blob. Checked at 16, 24, 32, 64 and 128 in both themes.
    pad = (100 - view_h) / 2
    PUBLIC.joinpath("favicon.svg").write_text(
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Deepayan Sinha">\n'
        f"<title>Deepayan Sinha</title>\n<style>\n"
        f".l{{fill:#3E2A68;stroke:#3E2A68;stroke-width:0.6}}"
        f".a{{fill:#3A93A3;stroke:#3A93A3;stroke-width:0.6}}\n"
        f".s{{fill:none;stroke:#C9A227;stroke-linecap:round;stroke-linejoin:round}}\n"
        f"@media (prefers-color-scheme:dark){{.l{{fill:#C4B5DE;stroke:#C4B5DE}}"
        f".a{{fill:#6FBECB;stroke:#6FBECB}}.s{{stroke:#E2BF5A}}}}\n"
        f'</style>\n<g transform="translate(0 {pad:.2f})">\n'
        f'<clipPath id="s"><path d="{d_letters}"/></clipPath>\n'
        f'<path class="l" fill-rule="evenodd" d="{d_letters}"/>\n'
        f'<path class="a" fill-rule="evenodd" d="{d_arrow}"/>\n'
        f'<g clip-path="url(#s)" class="s"><path d="{seam_main}" stroke-width="2.6"/></g>\n'
        f"</g>\n</svg>\n",
        encoding="utf-8",
        newline="\n",
    )

    # ---- rasters --------------------------------------------------------
    pad_px = 14
    cx0, cy0 = max(0, int(x0 - pad_px)), max(0, int(y0 - pad_px))
    cx1, cy1 = int(np.ceil(x1 + pad_px)), int(np.ceil(y1 + pad_px))
    L, A = letters[cy0:cy1, cx0:cx1], arrow[cy0:cy1, cx0:cx1]
    h, w = L.shape

    def to_px(u, v):
        return (u / scale + x0 - cx0, v / scale + y0 - cy0)

    def disk(r):
        yy, xx = np.ogrid[-r : r + 1, -r : r + 1]
        return xx * xx + yy * yy <= r * r

    def seam_layer(mask, width_units, branches):
        im = Image.new("L", (w, h), 0)
        d = ImageDraw.Draw(im)
        d.line([to_px(*p) for p in SEAM_MAIN], fill=255,
               width=max(2, round(width_units / scale)), joint="curve")
        if branches:
            for br in SEAM_BRANCHES:
                d.line([to_px(*p) for p in br], fill=153,
                       width=max(2, round(0.9 / scale)), joint="curve")
        return np.asarray(im).astype(float) / 255.0 * mask

    def compose(size, purple, dilate=0, seam_units=1.5, branches=True, bg=None, inset=0.0):
        cw, ch = size
        lm = binary_dilation(L, disk(dilate)) if dilate else L
        am = binary_dilation(A, disk(dilate)) if dilate else A
        sm = seam_layer(lm, seam_units, branches)
        s = min(cw * (1 - inset) / w, ch * (1 - inset) / h)
        tw, th = max(1, round(w * s)), max(1, round(h * s))
        canvas = Image.new("RGBA", (cw, ch), bg or (0, 0, 0, 0))
        for mask, colour in ((am, TEAL), (lm, purple), (sm, GOLD)):
            alpha = Image.fromarray((np.clip(mask, 0, 1) * 255).astype("uint8"))
            layer = Image.new("RGBA", (tw, th), colour + (0,))
            layer.putalpha(alpha.resize((tw, th), Image.LANCZOS))
            canvas.alpha_composite(layer, ((cw - tw) // 2, (ch - th) // 2))
        return canvas

    # Small and transparent: strokes dilated and the seam thickened, or the
    # mark reads as grey lint and the gold disappears. Mid purple, because
    # nothing here controls the ground it lands on.
    small = dict(purple=PURPLE_MID, dilate=10, seam_units=3.2, branches=False)
    compose((32, 32), **small).save(PUBLIC / "favicon-32.png")
    compose((256, 256), **small).save(PUBLIC / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    compose((192, 192), purple=PURPLE_MID, dilate=4).save(PUBLIC / "icon-192.png")
    compose((512, 512), purple=PURPLE_MID).save(PUBLIC / "icon-512.png")

    # Grounds we do control: full brand purple, paper behind it.
    compose((180, 180), purple=PURPLE, dilate=4, bg=PAPER, inset=0.22).save(
        PUBLIC / "apple-touch-icon.png")
    compose((1200, 630), purple=PURPLE, bg=PAPER, inset=0.42).save(PUBLIC / "og-default.png")

    print(f"mark viewBox 0 0 100 {view_h}")
    for f in sorted(PUBLIC.glob("*")):
        if f.suffix in {".svg", ".png", ".ico"}:
            print(f"  {f.name:24} {f.stat().st_size:>7,} bytes")


if __name__ == "__main__":
    main()
