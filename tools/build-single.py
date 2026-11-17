#!/usr/bin/env python3
"""Build a single self-contained HTML file for easy sharing.

Inlines css/style.css and every <script src> from index.html (in the same
load order) into one file. The result works from file://, an email
attachment or any static host – nothing else needs to be shipped.

Usage:
    python3 tools/build-single.py [output]

Defaults to writing pcb23.html into the project root (gitignored).
The output is regenerated on demand; commit only the sources.
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "index.html"


def main() -> int:
    out = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "pcb23.html"
    html = SRC.read_text(encoding="utf-8")

    # Inline the stylesheet.
    css = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
    link = '<link rel="stylesheet" href="css/style.css">'
    if link not in html:
        print("error: stylesheet link tag not found in index.html")
        return 1
    html = html.replace(link, "<style>\n" + css + "\n</style>")

    # Inline every script, keeping the load order.
    inlined = []

    def inline(match: "re.Match[str]") -> str:
        src = match.group(1)
        code = (ROOT / src).read_text(encoding="utf-8")
        if "</script>" in code:
            raise SystemExit(f"error: {src} contains a literal </script>")
        inlined.append(src)
        return "<script>\n" + code + "\n</script>"

    html = re.sub(r'<script src="([^"]+)"></script>', inline, html)

    # Sanity checks: nothing external left, nothing double-loaded.
    leftovers = re.findall(r'(?:src|href)="(?:js|css|examples)/[^"]*"', html)
    if leftovers:
        print("error: external references remain:", leftovers)
        return 1
    if len(inlined) != len(set(inlined)):
        print("error: a script was inlined twice:", inlined)
        return 1

    out.write_text(html, encoding="utf-8")
    print(f"inlined {len(inlined)} scripts + 1 stylesheet -> {out}")
    print("scripts:", ", ".join(inlined))
    return 0


if __name__ == "__main__":
    sys.exit(main())
