"""
Render page 1 of each publishable certificate PDF to a WebP under src/assets/certs/.

A developer tool, not part of the build -- like trace-logo.py. The PDFs live in private/ and are
never committed; only the rendered images ship, and only these six, which the owner cleared for
publication. Transcripts, marksheets and degree certificates stay private and are not listed here.

Every output is reviewed by eye before it is committed: a certificate can carry a candidate ID,
an address or a phone number, and the dist guard does not scan images.

Needs: pip install pymupdf pillow
Run:   python scripts/render-certs.py
"""

from io import BytesIO
from pathlib import Path

import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "assets" / "certs"

# output stem -> source PDF, relative to private/
SOURCES = {
    "lssgb": "Certificates/lss-green-belt-deepayan.pdf",
    "aha-pmp": "Certificates/CertificateOfCompletion_Aha Product Management Professional Certificate.pdf",
    "claude-code-101": "Certificates/Claude code 101.pdf",
    "ai-fluency": "Certificates/AI Fluency Foundation and Frameworks.pdf",
    "ai-capabilities": "Certificates/AI Capabilities and Limitations.pdf",
    "bgs": "Achievements/bgs-award.pdf",
}

# Long edge of the committed master. astro:assets derives every smaller size from it.
LONG_EDGE = 2000


def render(src: Path, dest: Path) -> tuple[int, int]:
    page = pymupdf.open(src)[0]
    zoom = LONG_EDGE / max(page.rect.width, page.rect.height)
    pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
    img = Image.open(BytesIO(pix.tobytes("png")))
    img.save(dest, "WEBP", quality=88, method=6)
    return img.size


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for stem, rel in SOURCES.items():
        w, h = render(ROOT / "private" / rel, OUT / f"{stem}.webp")
        print(f"{stem}.webp  {w}x{h}")


if __name__ == "__main__":
    main()
