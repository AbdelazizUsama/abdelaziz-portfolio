#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
create_project_archive.py - rebuilds the site and creates two archives in ./archives/

    python create_project_archive.py

  1) abdelaziz_portfolio_github.zip          PUBLIC. Safe to upload to GitHub:
        index.html + assets/ (resume, Steam dataset, production report) + README/.gitignore/.nojekyll
  2) abdelaziz_portfolio_PRIVATE_backup.zip  PRIVATE. Your own backup. Includes the MISUO and sales workbooks
        (customer names/addresses, named customers), so NEVER upload or share this one.

node_modules/, dist/, .git/ and archives/ are always excluded (node_modules is rebuilt with `npm install`).
(The old script copied the .zip to a .rar. That was only a renamed zip, not a real RAR, so it was removed.)
"""
import zipfile
from pathlib import Path

from build_premium import OUTPUT_HTML, ROOT, render_html, write_github_package, write_html

ARCHIVES = ROOT / "archives"
EXCLUDE_DIRS = {"node_modules", "dist", ".git", "archives", "github-upload", "__pycache__"}
EXCLUDE_SUFFIX = {".pyc"}


def add_tree(zf, folder, prefix):
    n = 0
    for path in sorted(Path(folder).rglob("*")):
        rel = path.relative_to(folder)
        if path.is_dir() or EXCLUDE_DIRS & set(rel.parts) or path.suffix in EXCLUDE_SUFFIX:
            continue
        zf.write(path, (Path(prefix) / rel).as_posix())
        n += 1
    return n


def main():
    ARCHIVES.mkdir(exist_ok=True)

    # 1) fresh build (so the archives can never contain an outdated page)
    html = render_html("en")
    write_html(OUTPUT_HTML, html)
    print("Built", OUTPUT_HTML.name)

    # 2) PUBLIC package for GitHub
    pkg = write_github_package(html)
    public_zip = ARCHIVES / "abdelaziz_portfolio_github.zip"
    with zipfile.ZipFile(public_zip, "w", zipfile.ZIP_DEFLATED) as zf:
        count = add_tree(zf, pkg, "abdelaziz-portfolio")
    print("PUBLIC  %s  (%d files)" % (public_zip.name, count))

    # 3) PRIVATE full backup (sources + every workbook)
    private_zip = ARCHIVES / "abdelaziz_portfolio_PRIVATE_backup.zip"
    with zipfile.ZipFile(private_zip, "w", zipfile.ZIP_DEFLATED) as zf:
        count = add_tree(zf, ROOT, "abdelaziz-portfolio")
    print("PRIVATE %s  (%d files)  <- do NOT upload this one" % (private_zip.name, count))


if __name__ == "__main__":
    main()
