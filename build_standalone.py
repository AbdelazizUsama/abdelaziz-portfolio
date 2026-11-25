#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_standalone.py - Arabic-first edition of the SAME final portfolio.

    python build_standalone.py   ->  portfolio_abdelaziz.html

It reuses the template in build_premium.py, so it always contains every edit (title, experience,
education, certifications, corrected metrics, 4 projects, accessibility, honest contact form).
The only difference: the page opens in Arabic (lang="ar" dir="rtl"); the visitor can still switch to English.
"""
from build_premium import ROOT, render_html, write_html

OUTPUT = ROOT / "portfolio_abdelaziz.html"

if __name__ == "__main__":
    path = write_html(OUTPUT, render_html("ar"))
    print("Built %s (Arabic-first, %.1f MB)" % (path.name, path.stat().st_size / 1e6))
