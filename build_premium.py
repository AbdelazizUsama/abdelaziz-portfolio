#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_premium.py - builds the portfolio as ONE self-contained HTML file.

    python -m pip install -r requirements.txt     (once: pandas + openpyxl)
    python build_premium.py                       -> portfolio_abdelaziz_premium.html
    python build_premium.py --github              -> also creates github-upload/ (ready for GitHub Pages)

Run it from the project folder. It reads, relative to this file:
    public/assets/*.jpg|png    dashboard screenshots + profile photo (embedded as base64)
    public/assets/*.xlsx       the four workbooks; every number on the page is computed from them

All edits made in the final portfolio are contained in TEMPLATE below:
  * Accountant & Junior Data Analyst title/bio, name spelling "Usama" / "اسامه"
  * Work experience, education, certifications (from the resume), contact details (one phone number)
  * Corrected metrics (Steam 22,521 titles, 86.0% / 14.0% reviews; production = units; MISUO = 126 order lines)
  * 4th project (Overall Sales Analysis 2026), case studies, accessibility, EN/AR with correct RTL/LTR
  * Honest contact form (mailto draft or a configurable endpoint), downloads that point to real files
  * Privacy: MISUO + sales workbooks are NOT offered for download ("available on request")

To change links, files or the contact form: edit the SITE_CONFIG block inside TEMPLATE and re-run.
"""
import argparse
import base64
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
ASSETS = ROOT / "public" / "assets"
OUTPUT_HTML = ROOT / "portfolio_abdelaziz_premium.html"
GITHUB_DIR = ROOT / "github-upload"

PAGE_TITLES = {
    "en": "Abdelaziz Usama Mahmoud | Accountant & Junior Data Analyst",
    "ar": "عبدالعزيز اسامه محمود | محاسب ومحلل بيانات مبتدئ",
}

# token in TEMPLATE -> candidate file names (first one found wins)
IMAGES = {
    "__PROFILE_B64__": ["profile.jpg"],
    "__STEAM_B64__": ["dashboard_steam.jpg"],
    "__COST_B64__": ["dashboard_cost.jpg"],
    "__MISUO_B64__": ["dashboard_misuo.jpg"],
    "__SALES_B64__": ["dashboard_logistics.png"],
}
WORKBOOKS = {
    "steam": ["Database.xlsx"],
    "cost": ["Production_Order_Visual_Report.xlsx", "Production Order Visual Report.xlsx"],
    "misuo": ["MISUO_Abdelaziz_Usama_Mahmoud.xlsx", "MISUO - Abdelaziz Usama Mahmoud.xlsx"],
    "sales": ["Overall Dashboard Sales Analysis 2026.xlsx", "Overall_Dashboard_Sales_Analysis_2026.xlsx"],
}
RESUME = ["Abdelaziz_Resume.pdf", "Abdelaziz Usama Mahmoud Abdelaziz Resume.pdf"]
MIME = {".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png"}


def find_file(candidates, label):
    """Look in public/assets, then next to this script. Fail loudly (never embed an empty image)."""
    for folder in (ASSETS, ROOT):
        for name in candidates:
            if (folder / name).is_file():
                return folder / name
    sys.exit("ERROR: could not find %s. Looked for %s in %s and %s" % (label, candidates, ASSETS, ROOT))


def data_uri(path):
    mime = MIME[path.suffix.lower()]
    return "data:%s;base64,%s" % (mime, base64.b64encode(path.read_bytes()).decode("ascii"))


# ----------------------------------------------------------------------------
# DATA: computed from the workbooks so text, KPI tiles and charts always agree
# ----------------------------------------------------------------------------
def build_data():
    import openpyxl
    import pandas as pd

    clean = lambda s: re.sub(r"\s+", " ", re.sub(r"^\s*1\s*-\s*", "", str(s))).strip()

    # ---- Steam: 3 non-title rows (blank + 2 summary rows) at the bottom of the sheet are excluded ----
    df = pd.read_excel(find_file(WORKBOOKS["steam"], "Database.xlsx"), sheet_name="extended_steam_games")
    real = df[df.name.notna() & df.appid.notna()]
    pos, neg = int(real.positive.sum()), int(real.negative.sum())
    steam = dict(
        total_games=len(real),
        total_ccu=int(real.ccu.sum()),
        avg_ccu=round(real.ccu.sum() / len(real), 1),
        total_positive=pos,
        total_negative=neg,
        pos_ratio=round(pos / (pos + neg) * 100, 1),
        neg_ratio=round(neg / (pos + neg) * 100, 1),
        platforms=dict(
            windows=int(real.platforms_windows.sum()),
            mac=int(real.platforms_mac.sum()),
            linux=int(real.platforms_linux.sum()),
        ),
        free_count=int(real.is_free.sum()),
        paid_count=len(real) - int(real.is_free.sum()),
        release_min=str(real.release_date.min().date()),
        release_max=str(real.release_date.max().date()),
        top_ccu=[
            dict(name=r["name"], ccu=int(r.ccu))
            for _, r in real.sort_values("ccu", ascending=False, kind="stable").head(10).iterrows()
        ],
    )

    # ---- Production: "Quantity Produced" is UNITS (not revenue); variance = required - produced ----
    wb = openpyxl.load_workbook(find_file(WORKBOOKS["cost"], "Production_Order_Visual_Report.xlsx"), read_only=True, data_only=True)
    rows = [r for r in wb["Aug"].iter_rows(values_only=True, max_row=5000) if any(v is not None for v in r)]
    c = pd.DataFrame(rows[1:], columns=[str(x) for x in rows[0]]).iloc[:, :9]
    c = c[c["Company Name"].notna()].copy()
    c["Product Name"] = c["Product Name"].map(clean)
    c["co"] = c["Company Name"].str.strip().str.lower()
    disp = c.groupby("co")["Company Name"].agg(
        lambda s: s.iloc[0].strip().capitalize() if s.iloc[0].islower() else s.iloc[0].strip()
    )
    companies = sorted(c.groupby("co").size().items(), key=lambda kv: (-kv[1], kv[0]))  # deterministic ties
    cost = dict(
        summary=dict(
            units_produced=int(c["Quantity Produced"].sum()),
            units_required=int(c["Quantity Required"].sum()),
            variance_quantity=int(c["Variance Quantity"].sum()),
            order_lines=len(c),
            companies_count=len(companies),
            period_start=str(c.Date.min().date()),
            period_end=str(c.Date.max().date()),
        ),
        top_variance_products=[
            dict(name=k, variance=int(v))
            for k, v in c.groupby("Product Name")["Variance Quantity"].sum().sort_values(ascending=False, kind="stable").head(10).items()
        ],
        top_produced_products=[
            dict(name=k, produced=int(v))
            for k, v in c.groupby("Product Name")["Quantity Produced"].sum().sort_values(ascending=False, kind="stable").head(10).items()
        ],
        company_orders=[dict(company=disp[k], orders=int(v)) for k, v in companies],
    )

    # ---- MISUO: 152 = items sold across 126 order lines; delivery % = share of order lines ----
    wb = openpyxl.load_workbook(find_file(WORKBOOKS["misuo"], "MISUO workbook"), read_only=True, data_only=True)
    rows = [r for r in wb["البيانات"].iter_rows(values_only=True) if any(v is not None for v in r)]
    m = pd.DataFrame(rows[1:], columns=[str(x).strip() for x in rows[0]])
    status = m["الحالة"].str.strip().value_counts()
    platform = m.assign(p=m["منصة البيع"].str.strip()).groupby("p")["كمية"].sum().sort_values(ascending=False, kind="stable")
    governorate = m["المحافظة"].dropna().str.strip().value_counts()
    dates = pd.to_datetime(m["ميعاد الطلب"])
    misuo = dict(
        summary=dict(
            total_sales=int(round(m["سعر البيع"].sum())),
            items_sold=int(m["كمية"].sum()),
            order_lines=len(m),
            avg_selling_price=int(round(m["سعر البيع"].mean())),
            order_date_start=str(dates.min().date()),
            order_date_end=str(dates.max().date()),
            lines_without_governorate=int(m["المحافظة"].isna().sum()),
        ),
        delivery_status=[
            dict(status=k, lines=int(status[k]), pct=int(round(status[k] / len(m) * 100)))
            for k in ["تم التسليم", "مرتجع", "مرفوض"]
        ],
        sales_by_platform=[dict(platform=k, units=int(v)) for k, v in platform.items()],
        orders_by_area=[dict(city=k, orders=int(v)) for k, v in governorate.items()],
    )

    # ---- Sales analysis: "Total" is the invoice total INCLUDING 15% tax; currency not stated in the file ----
    wb = openpyxl.load_workbook(find_file(WORKBOOKS["sales"], "Sales analysis workbook"), read_only=True, data_only=True)
    rows = [r for r in wb["Query Report"].iter_rows(values_only=True) if any(v is not None for v in r)]
    s = pd.DataFrame(rows[1:], columns=rows[0])
    s["d"] = pd.to_datetime(s["تاريخ القيد"])
    total = s["الإجمالي"].sum()
    by_customer = s.groupby("اسم العميل")["الإجمالي"].sum().sort_values(ascending=False, kind="stable")
    sales = dict(
        summary=dict(
            total=round(total, 2),
            net=round(s["مبلغ"].sum(), 2),
            tax=round(s["مجموع الضرائب"].sum(), 2),
            tax_rate=15,
            invoice_lines=len(s),
            invoices=int(s["فاتورة"].nunique()),
            customers=int(s["اسم العميل"].nunique()),
            period_start=str(s.d.min().date()),
            period_end=str(s.d.max().date()),
            top_customer_share=round(by_customer.iloc[0] / total * 100, 1),
            top3_customer_share=round(by_customer.head(3).sum() / total * 100, 1),
        ),
        by_month=[round(float(v), 2) for v in s.groupby(s.d.dt.month)["الإجمالي"].sum().values],
        by_customer_group=[
            dict(name=k.strip(), total=round(float(v), 2))
            for k, v in s.groupby("مجموعة العملاء")["الإجمالي"].sum().sort_values(ascending=False, kind="stable").items()
        ],
        by_region=[
            dict(name=k.strip(), total=round(float(v), 2))
            for k, v in s.groupby("الإقليم")["الإجمالي"].sum().sort_values(ascending=False, kind="stable").items()
        ],
    )
    return dict(steam=steam, cost=cost, misuo=misuo, sales=sales)


# ----------------------------------------------------------------------------
# RENDER
# ----------------------------------------------------------------------------
def render_html(default_lang="en"):
    """Return the complete HTML. default_lang: 'en' (premium) or 'ar' (Arabic-first standalone)."""
    if default_lang not in PAGE_TITLES:
        raise ValueError("default_lang must be 'en' or 'ar'")
    data = build_data()
    html = TEMPLATE
    for token, names in IMAGES.items():
        html = html.replace(token, data_uri(find_file(names, token)))
    for key in ("steam", "cost", "misuo", "sales"):
        html = html.replace("__%s_DATA__" % key.upper(), json.dumps(data[key], ensure_ascii=False))
    html = html.replace("__DEFAULT_LANG__", default_lang)
    html = html.replace("__DEFAULT_DIR__", "rtl" if default_lang == "ar" else "ltr")
    html = html.replace("__PAGE_TITLE__", PAGE_TITLES[default_lang])
    leftover = sorted(set(re.findall(r"__[A-Z_0-9]+__", re.sub(r"data:image/[a-z]+;base64,[A-Za-z0-9+/=]+", "", html))))
    if leftover:
        sys.exit("ERROR: unreplaced template tokens: %s" % leftover)
    return html


def write_html(path, html):
    Path(path).write_text(html, encoding="utf-8", newline="\n")
    return Path(path)


GITHUB_GITIGNORE = """# Never commit these
node_modules/
.env
.DS_Store
Thumbs.db
*.log
# Withheld on purpose: contain customers' personal data / confidential business data
assets/MISUO_Abdelaziz_Usama_Mahmoud.xlsx
assets/Overall_Dashboard_Sales_Analysis_2026.xlsx
"""

GITHUB_README = """# Abdelaziz Usama Mahmoud: Portfolio

Accountant & Junior Data Analyst. Bilingual (English / Arabic) portfolio with dark/light themes,
case studies and downloadable datasets.

**Live site:** https://YOUR-USERNAME.github.io/REPO-NAME/  (replace after publishing)

## Files
- `index.html`: the whole site (single file; React/Tailwind/Chart.js load from CDNs)
- `assets/`: resume PDF and the two datasets linked from the page

## Editing
Open `index.html`, find `SITE_CONFIG` near the top of the script. It controls the contact form,
download links, project links (dashboard / repository / samples) and whether placeholders are shown.

## Privacy
The MISUO order file (customer names and addresses) and the 2026 sales invoice export (named customers)
are intentionally **not** in this repository.
"""


def write_github_package(html, out_dir=GITHUB_DIR):
    """Folder that can be dragged straight into a GitHub repository (public-safe files only)."""
    out_dir = Path(out_dir)
    if out_dir.exists():
        shutil.rmtree(out_dir)
    (out_dir / "assets").mkdir(parents=True)
    write_html(out_dir / "index.html", html)
    shutil.copyfile(find_file(RESUME, "resume PDF"), out_dir / "assets" / "Abdelaziz_Resume.pdf")
    shutil.copyfile(find_file(WORKBOOKS["steam"], "Database.xlsx"), out_dir / "assets" / "Database.xlsx")
    shutil.copyfile(find_file(WORKBOOKS["cost"], "Production report"), out_dir / "assets" / "Production_Order_Visual_Report.xlsx")
    (out_dir / ".nojekyll").write_text("", encoding="utf-8")
    (out_dir / ".gitignore").write_text(GITHUB_GITIGNORE, encoding="utf-8", newline="\n")
    (out_dir / "README.md").write_text(GITHUB_README, encoding="utf-8", newline="\n")
    return out_dir


def main():
    ap = argparse.ArgumentParser(description="Build portfolio_abdelaziz_premium.html")
    ap.add_argument("--github", action="store_true", help="also create github-upload/ (index.html + assets)")
    args = ap.parse_args()
    html = render_html("en")
    out = write_html(OUTPUT_HTML, html)
    print("Built %s (%.1f MB)" % (out.name, out.stat().st_size / 1e6))
    if args.github:
        print("GitHub package: %s" % write_github_package(html))


# ----------------------------------------------------------------------------
# TEMPLATE: the final portfolio (placeholders __LIKE_THIS__ are filled in by render_html)
# ----------------------------------------------------------------------------
TEMPLATE = r"""<!DOCTYPE html>
<html lang="__DEFAULT_LANG__" dir="__DEFAULT_DIR__" data-theme="dark" class="dark scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Portfolio of Abdelaziz Usama Mahmoud: cost accounting, operations and e-commerce analytics, Excel dashboards, and case studies." />
  <title>__PAGE_TITLE__</title>

  <!-- Anti-flicker script for Theme Persistence -->
  <script>
    (function() {
      try {
        var savedTheme = localStorage.getItem('portfolio_theme');
        if (savedTheme === 'light') {
          document.documentElement.setAttribute('data-theme', 'light');
          document.documentElement.classList.remove('dark');
        } else {
          document.documentElement.setAttribute('data-theme', 'dark');
          document.documentElement.classList.add('dark');
        }
      } catch (e) {}
    })();
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            cairo: ['Cairo', 'sans-serif'],
            sans: ['Plus Jakarta Sans', 'sans-serif']
          }
        }
      }
    }
  </script>

  <!-- React & ReactDOM CDN -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js" crossorigin></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <style>
    /* CSS Variables for Modern Electric Blue & Navy Dual Theme System */
    :root, [data-theme="dark"], html.dark {
      --bg-main: #071225;
      --bg-secondary: #0B1730;
      --bg-nav: #081329;
      --bg-card: #101F3B;
      --bg-elevated: #152747;
      --border-muted: #233B61;
      --text-primary: #F5F8FF;
      --text-secondary: #B8C7DF;
      --text-muted: #8FA4C4;
      --accent-primary: #3B82F6;
      --accent-bright: #60A5FA;
      --accent-hover: #1D4ED8;
      --accent-light: rgba(59, 130, 246, 0.16);
      --accent-solid: #2563EB;   /* button background: white text = 5.2:1 */
      --accent-text: #60A5FA;    /* accent-coloured text on dark surfaces */
      --bright-text: #93C5FD;
      --focus-ring: #93C5FD;
      --accent-contrast: #FFFFFF;
      --bg-hover: #182C52;
      --shadow-color: rgba(0, 0, 0, 0.45);
      --glow-shadow: 0 0 20px rgba(59, 130, 246, 0.25);
    }

    [data-theme="light"], html:not(.dark)[data-theme="light"] {
      --bg-main: #F5F8FF;
      --bg-secondary: #EAF1FF;
      --bg-nav: #FFFFFF;
      --bg-card: #FFFFFF;
      --bg-elevated: #F0F5FF;
      --border-muted: #D8E3F5;
      --text-primary: #14213D;
      --text-secondary: #475569;
      --text-muted: #55657A;
      --accent-primary: #2563EB;
      --accent-bright: #3B82F6;
      --accent-hover: #1D4ED8;
      --accent-light: rgba(59, 130, 246, 0.08);
      --accent-solid: #2563EB;
      --accent-text: #1D4ED8;    /* >= 5.9:1 on every light surface */
      --bright-text: #2563EB;
      --focus-ring: #1D4ED8;
      --accent-contrast: #FFFFFF;
      --bg-hover: #E2ECFE;
      --shadow-color: rgba(20, 33, 61, 0.08);
      --glow-shadow: 0 0 15px rgba(37, 99, 235, 0.15);
    }

    * {
      transition: background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
    }

    body {
      background-color: var(--bg-main);
      color: var(--text-primary);
      margin: 0;
      padding: 0;
    }

    /* Core Theme Helper Classes */
    .theme-bg-main { background-color: var(--bg-main); }
    .theme-bg-secondary { background-color: var(--bg-secondary); }
    .theme-bg-nav { background-color: var(--bg-nav); }
    .theme-bg-card { background-color: var(--bg-card); }
    .theme-bg-elevated { background-color: var(--bg-elevated); }
    .theme-border { border-color: var(--border-muted); }
    
    .theme-text-primary { color: var(--text-primary); }
    .theme-text-secondary { color: var(--text-secondary); }
    .theme-text-muted { color: var(--text-muted); }
    .theme-text-accent { color: var(--accent-text); }
    .theme-text-bright { color: var(--bright-text); }

    .theme-bg-accent { background-color: var(--accent-solid); color: var(--accent-contrast); }
    .theme-bg-accent:hover { background-color: var(--accent-hover); }
    .theme-bg-accent-light { background-color: var(--accent-light); }

    .theme-hover-bg:hover { background-color: var(--bg-hover); }
    .theme-glow { box-shadow: var(--glow-shadow); }

    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-main); }
    ::-webkit-scrollbar-thumb { background: var(--border-muted); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: var(--accent-primary); }

    /* ---------- Accessibility & usability additions ---------- */
    :focus-visible { outline: 3px solid var(--focus-ring) !important; outline-offset: 2px; }
    input:focus-visible, textarea:focus-visible { border-color: var(--focus-ring); }

    .skip-link {
      position: absolute; inset-inline-start: 12px; top: -80px; z-index: 100;
      padding: 10px 16px; border-radius: 10px; font-weight: 700; font-size: 14px;
      background: var(--accent-solid); color: #fff; text-decoration: none;
    }
    .skip-link:focus { top: 12px; }
    main:focus { outline: none; }

    /* Hover states (the original hover:theme-* classes were not real Tailwind utilities and did nothing) */
    .link-hover:hover { color: var(--accent-text); }
    .link-underline { text-decoration: underline; text-underline-offset: 3px; }
    .link-underline:hover { color: var(--bright-text); }
    .accent-edge { border-inline-start-color: var(--accent-primary); }

    /* [Bracketed placeholders]: visible, but clearly marked as "still to fill in" */
    .ph {
      display: inline-block; padding: 0 6px; border-radius: 6px; font-style: italic;
      border: 1px dashed var(--border-muted); background: var(--accent-light); color: var(--text-secondary);
    }

    section[id] { scroll-margin-top: 8rem; }
    @media (min-width: 1024px) { section[id] { scroll-margin-top: 6rem; } }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto !important; }
      *, *::before, *::after { animation: none !important; transition: none !important; }
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect, useRef } = React;

    const profileImg = "__PROFILE_B64__";
    const steamImg = "__STEAM_B64__";
    const costImg = "__COST_B64__";
    const misuoImg = "__MISUO_B64__";
    const salesImg = "__SALES_B64__";

    // Generated from the uploaded workbooks (Database.xlsx, Production_Order_Visual_Report.xlsx,
    // MISUO_Abdelaziz_Usama_Mahmoud.xlsx, Overall_Dashboard_Sales_Analysis_2026.xlsx). Every figure on the page derives from these.
    const steamData = __STEAM_DATA__;
    const costData = __COST_DATA__;
    const misuoData = __MISUO_DATA__;
    const salesData = __SALES_DATA__;

    const fmt = (n) => Number(n).toLocaleString('en-US');
    const pctOf = (a, b, digits = 0) => ((a / b) * 100).toFixed(digits);
    const fmtDate = (iso, ar) => new Date(iso + 'T00:00:00Z').toLocaleDateString(ar ? 'ar-EG-u-nu-latn' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });

    /* ======================================================================
       DATA NOTES (verified against the uploaded workbooks)
       • Steam: the sheet has 3 non-title rows at the bottom (one blank, two summary rows).
         Excluding them gives 22,521 titles and 124,208,890 positive vs 20,183,614 negative reviews
         = 86.0% / 14.0%, exactly what the workbook's own PivotTable shows. (Summing the raw column
         instead gives the wrong 90.7% / 9.3%.)
       • Production: "Quantity Produced" is UNITS, not revenue, so no currency is shown for it.
         Variance = quantity required minus quantity produced.
       • MISUO: "152" is the sum of quantity (items sold) across 126 order lines.
       • Sales analysis: "Total" is the invoice total INCLUDING 15% tax. Currency is not stated in the file.
       ====================================================================== */

    /* ======================================================================
       SITE CONFIG: the one place to edit links, files and the contact form
       ====================================================================== */
    const SITE_CONFIG = {
      /* CONTACT FORM
         • Leave "" (default): the form builds a prefilled email draft (mailto:) and opens the visitor's
           email app. The page says plainly that nothing is sent until they press Send there.
         • Or paste a form-backend endpoint, e.g. Formspree: "https://formspree.io/f/xxxxxxxx".
           The form then POSTs JSON {name, email, subject, message} and shows success ONLY on an OK response. */
      contactFormEndpoint: "",

      /* PLACEHOLDERS
         false (default, for the live site): unfilled "[Add ...]" prompts are hidden, and case-study rows
         that have nothing to show yet (business question, outcome, links) are left out.
         true: show every placeholder so you can see what is still to be filled in. */
      showPlaceholders: false,

      /* DOWNLOADABLE FILES (stored in the assets/ folder next to this HTML)
         ready:true      -> real download link.
         ready:false + onRequest:true -> shows "Dataset on request" (links to the contact form).
         The MISUO workbook contains individual customers' names and home addresses, and the sales-analysis
         export lists 781 named customers with invoice-level revenue, so both are withheld on purpose.
         Publish them only after anonymising (or with permission), then set ready:true and copy the file into assets/. */
      files: {
        resume:            { href: "assets/Abdelaziz_Resume.pdf",                      ready: true },
        "steam-analytics": { href: "assets/Database.xlsx",                             ready: true },
        "cost-variance":   { href: "assets/Production_Order_Visual_Report.xlsx",       ready: true },
        "misuo-ecommerce": { href: "assets/MISUO_Abdelaziz_Usama_Mahmoud.xlsx",        ready: false, onRequest: true },
        "sales-analysis":  { href: "assets/Overall_Dashboard_Sales_Analysis_2026.xlsx", ready: false, onRequest: true }
      },

      /* PROJECT LINKS: add a URL to replace the "[Add ... link]" placeholder in each case study */
      projectLinks: {
        "steam-analytics": { dashboard: "", repository: "", samples: "" },
        "cost-variance":   { dashboard: "", repository: "", samples: "" },
        "misuo-ecommerce": { dashboard: "", repository: "", samples: "" },
        "sales-analysis":  { dashboard: "", repository: "", samples: "" }
      }
    };

    /* English labels for Arabic source data (used by the charts) */
    const GOVERNORATE_EN = {
      "القاهرة": "Cairo", "الجيزة": "Giza", "القليوبية": "Qalyubia", "السويس": "Suez",
      "الإسكندرية": "Alexandria", "البحر الأحمر": "Red Sea", "مطروح": "Matrouh", "أسيوط": "Asyut"
    };
    const CUSTOMER_GROUP_EN = {
      "عملاء اللوجيستي": "Logistics customers", "عملاء التصنيع الخارجي": "External manufacturing customers",
      "عملاء فرع القطيف": "Qatif branch customers", "عملاء فرع عنك": "Anak branch customers",
      "عملاء التصنيع": "Manufacturing customers", "تجاري": "Commercial", "عملاء فرع الدوحه": "Doha branch customers"
    };
    const REGION_EN = { "المنطقة الوسطي": "Central Region", "الدمام - الخبر": "Dammam - Khobar", "المنطقة الغربية": "Western Region" };
    const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const MONTHS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
    // English translations of the Arabic product names in the production workbook (please double-check wording).
    const PRODUCT_EN = {
      "هير واكس أسود , 100 جم(Honey wax&Vitamin E) ,سنيور": "Senor Black Hair Wax 100g (Honey wax & Vitamin E)",
      "سنيور كريم زبدة شيا 225 جم": "Senor Shea Butter Cream 225g",
      "جل شفاف سنيور 250 جم (Senor mega hard styling gel)": "Senor Clear Gel 250g",
      "سنيور كريم لتصفيف الشعر بزيت الجرجير , 200 مل": "Senor Hair Styling Cream, Arugula Oil 200ml",
      "سنيور كريم جل225 جم": "Senor Cream Gel 225g",
      "جل أسود سنيور 250 جم (Senor mega hard styling gel)": "Senor Black Gel 250g",
      "سنيور هارد هير واكس(أحمر) , 100 جم (Rock Wax)": "Senor Hard Hair Wax (Red) 100g (Rock Wax)",
      "سنيور كريم للشعر بزيت الأرجان وجوز الهند وزبدة الشيا 250 جم ( كريم بامب)": "Senor Hair Cream, Argan, Coconut & Shea Butter 250g (Bomb Cream)",
      "سنيور كريم لتصفيف الشعر بعسل النحل الطبيعي, 200 مل": "Senor Hair Styling Cream, Natural Bee Honey 200ml",
      "هيرلايف جل 275 مل * 24 قطعة": "Hairlife Gel 275ml x 24 pcs"
    };

    const portfolioContent = {
      en: {
        ui: {
          meta: {
            title: "Abdelaziz Usama Mahmoud | Accountant & Junior Data Analyst",
            description: "Portfolio of Abdelaziz Usama Mahmoud: cost accounting, operations and sales analytics, Excel dashboards, and case studies."
          },
          skip: "Skip to main content",
          navAria: "Main navigation",
          nav: { skills: "Skills", experience: "Experience", education: "Education", certifications: "Certifications", projects: "Projects", contact: "Contact" },
          themeToLight: "Switch to light mode", themeToDark: "Switch to dark mode", lightLabel: "Light Mode", darkLabel: "Dark Mode",
          langAria: "Switch language to Arabic", langLabel: "العربيّة", langFlag: "🇪🇬", langAttr: "ar",
          resumeNav: "Download Resume", resumeHero: "Download CV (PDF)",
          filePending: "[file to be added]",
          exploreCases: "Explore Case Studies",
          available: "Open to Junior Data Analyst & Accounting Roles",
          experienceLabel: "Experience", experienceValue: "3+ years in accounting",
          specLabel: "Specialization", specValue: "Cost & Ops Analytics",
          profileAlt: "Portrait of Abdelaziz Usama Mahmoud",
          social: { linkedin: "LinkedIn", github: "GitHub", email: "Email" },
          socialAria: "Contact links",
          newTab: "opens in a new tab",
          statsAria: "Key figures from the case studies",
          sections: {
            skills: { pill: "Core Capabilities", title: "Technical & Domain Expertise", sub: "Integrating data analytics, manufacturing cost accounting, and supply chain logistics." },
            experience: { pill: "Career", title: "Work Experience", sub: "Professional roles and measurable achievements." },
            education: { pill: "Academic Background", title: "Education", sub: "Degrees and academic qualifications." },
            certifications: { pill: "Credentials", title: "Certifications", sub: "Professional certifications and accredited courses." },
            projects: { pill: "Portfolio Showcase", title: "Dashboards & Case Studies", sub: "" }
          },
          credentialLink: "View credential",
          filterAria: "Filter projects by category",
          filters: { all: "All Projects", gaming: "Gaming & Market", cost: "Cost & Production", ecommerce: "E-Commerce BI", sales: "Sales Analytics" },
          showing: (n, total) => `Showing ${n} of ${total} projects`,
          card: { keyInsights: "Key Insights", viewCase: "View Case Study & Charts", dataset: "Download Dataset (Excel)", datasetRequest: "Dataset available on request" },
          modal: {
            close: "Close dialog",
            kpiAria: "Key figures", chartsHeading: "Dashboard charts", chartData: "Chart data",
            chartUnavailable: "The chart library could not be loaded, so the data is shown as a table.",
            caseStudy: "Case study",
            problem: "Business question", dataSource: "Data source", period: "Time period", tools: "Tools used",
            methods: "Methods", findings: "Key findings", outcome: "Outcome / recommendation", links: "Links",
            dashboard: "Dashboard", repository: "Repository", samples: "Sample files",
            pendDashboard: "[Add dashboard link]", pendRepository: "[Add repository link]", pendSamples: "[Add sample files link]",
            datasetPending: "[file to be added]"
          },
          contact: {
            labels: { email: "Email", phone: "Phone", linkedin: "LinkedIn", github: "GitHub", location: "Location" },
            title: "Contact Information",
            subtitle: "I'm actively looking for opportunities to apply my accounting and data analytics skills. Feel free to reach out with any questions or collaboration opportunities.",
            formName: "Your Name", formEmail: "Your Email", formSubject: "Subject", formMessage: "Message",
            placeholderName: "John Doe", placeholderEmail: "john@example.com",
            placeholderSubject: "Job Opportunity / Project Inquiry", placeholderMessage: "Tell me about your project or opportunity...",
            sendBtn: "Send Message", draftBtn: "Open Email Draft", sendingBtn: "Sending…",
            mailtoNote: "This form opens a draft in your email app. It does not send anything by itself.",
            statusSent: "Thank you. Your message was submitted successfully.",
            statusDraft: (email) => `Your email app should now open with a draft addressed to ${email}. Nothing has been sent yet: please review the draft and press Send in your email app. If nothing opened, email me directly at ${email}.`,
            statusError: (email) => `Sorry, your message could not be sent. Please try again, or email me directly at ${email}.`
          },
          footer: { rights: "All Rights Reserved.", credit: "Designed with Modern Electric Blue & Navy Architecture." }
        },
        personal: {
          name: "Abdelaziz Usama Mahmoud",
          title: "Accountant & Junior Data Analyst",
          subtitle: "Cost Accountant | Operations & Sales Analytics",
          tagline: "Transforming complex operational & financial data into executive strategic dashboards and profitable business decisions.",
          bio: "Accountant with 3+ years of experience in cost accounting, general accounting and inventory control, now growing as a junior data analyst. I turn production, sales and market data into Excel dashboards (PivotTables, slicers, Power Query), including quantity variance analysis, delivery-status analysis and a Steam game-market study.",
          // Contact details below come from the résumé PDF (the old ones were placeholders).
          email: "Abdelazizusama0@gmail.com",
          phones: [{ tel: "+201275847057", display: "+20 127 584 7057" }],
          location: "Alexandria, Egypt",
          linkedin: "https://www.linkedin.com/in/abdelaziz-usama-42867a163",
          linkedinDisplay: "linkedin.com/in/abdelaziz-usama-42867a163",
          // TODO (owner): this GitHub URL was already in the original file but is NOT in your résumé. Please confirm it exists.
          github: "https://github.com/abdelaziz-data",
          githubDisplay: "github.com/abdelaziz-data"
        },
        stats: [
          { label: "Data Records Analyzed", value: fmt(steamData.total_games), suffix: "Titles" },
          { label: "Steam Concurrent Players", value: "5.7M+", suffix: "CCU" },
          { label: "Sales Analyzed (2026 ERP export)", value: "12.5M", suffix: "Total incl. tax" },
          { label: "Units Produced (Aug 2026)", value: "465K+", suffix: "Units" }
        ],
        skills: [
          { category: "Business Intelligence & Data Analytics", items: ["Power BI & DAX Modeling", "Power Query & ETL Pipelines", "Data Architecture", "Python (Pandas, NumPy)", "SQL Database Querying", "Dashboard Design"] },
          { category: "Financial & Cost Accounting", items: ["Quantity Variance Analysis", "Product Cost Allocation", "Financial Modeling & Pricing", "Budgeting & Forecasting", "Managerial Reporting", "Excel Visual Reports & VBA"] },
          { category: "Operations & E-Commerce Logistics BI", items: ["On-Time Delivery (SLA)", "Sales Channel Distribution", "Inventory & Storage Analytics", "Regional Demand Mapping", "Order Cancellation Analysis", "Supply Chain Optimization"] },
          { category: "Accounting Operations, ERP & Compliance", items: ["Oracle ERP, QuickBooks, Peachtree, Daftra", "General Ledger & Journal Entries", "Bank Reconciliations", "Inventory Control (WIP & Finished Goods)", "Tax Reporting & E-Invoicing", "Advanced Excel"] }
        ],
        // From the résumé PDF. Add more roles by copying an entry (fill BOTH the en and ar versions).
        experience: [
          {
            role: "Cost Accountant", org: "Leven pharma", dates: "2026 – Present", location: "Alexandria, Egypt",
            bullets: [
              "Direct end-to-end cost accounting processes, ensuring accurate product costing and supporting strategic pricing models.",
              "Manage comprehensive WIP and finished goods inventory, implementing controls to ensure stock valuation accuracy.",
              "Analyze production variances and spearhead operational reporting, delivering actionable insights to management.",
              "Consistently optimize cost-tracking mechanisms, resulting in improved visibility of manufacturing efficiency.",
              "Reconcile and validate complex manufacturing data to ensure 100% accuracy in financial reporting and production metrics."
            ]
          },
          {
            role: "General Accountant", org: "R&E Petroleum Services", dates: "2025", location: "Alexandria, Egypt",
            bullets: [
              "Ensured 100% tax compliance by managing e-invoicing systems and collaborating with legal teams on regulatory requirements.",
              "Streamlined financial operations by managing aging reports, reviewing vendor invoices, and executing daily bank reconciliations.",
              "Orchestrated end-to-end supply chain documentation, including import/export processes, carrier selection, and customs clearance coordination."
            ]
          },
          {
            role: "General Accountant", org: "Oliver outlet for perfumes", dates: "2024 – 2025", location: "Alexandria, Egypt",
            bullets: [
              "Streamlined high-volume customer payment processing, maintaining meticulous ledger records to ensure continuous audit readiness.",
              "Executed recurring bank reconciliations and analyzed accounts receivable aging reports to optimize working capital and cash flow.",
              "Successfully processed and reconciled an average of 400+ retail and B2B payment transactions monthly with 100% data accuracy."
            ]
          },
          {
            role: "General Accountant", org: "3alrakia for Food & Beverage Company", dates: "2024 – 2025", location: "Alexandria, Egypt",
            bullets: [
              "Monitored daily cash flows and maintained strict financial oversight across multiple corporate bank accounts to safeguard company liquidity.",
              "Executed complex invoice reviews and reconciled vendor payment records to ensure absolute financial integrity and eliminate overpayments.",
              "Audited and processed over 150+ supplier and vendor invoices monthly, ensuring accurate cost allocation across multiple branches."
            ]
          },
          {
            role: "Cost Accountant", org: "leeloudi patisserie company", dates: "2023 – 2024", location: "Alexandria, Egypt",
            bullets: [
              "Calculated precise product costs for over 80+ menu items and seasonal pastries, providing data-driven insights to support profitable pricing strategies.",
              "Managed comprehensive WIP and finished goods inventory across 3 storage areas, reducing variance discrepancies by 12% through tighter stock controls.",
              "Delivered weekly operational reports to management, identifying waste issues and recommending solutions that saved 4% in raw material costs."
            ]
          },
          {
            role: "General Accountant Trainee", org: "Alexandria water company", dates: "2020", location: "Alexandria, Egypt",
            bullets: [
              "Processed 100+ billing records daily with a focus on data accuracy and deadline management.",
              "Gained hands-on experience in accounting operations and documentation."
            ]
          }
        ],
        education: [
          { degree: "Bachelor of Commerce (English Section), Accounting Major", institution: "Alexandria University", dates: "2017 – 2021", details: "Alexandria, Egypt" }
        ],
        // From the résumé. The résumé gives no dates or credential links; add them with date / credentialUrl.
        certifications: [
          { name: "English, Level 12", issuer: "MODLI Alex", date: "", details: "IELTS preparation in progress.", credentialUrl: "" },
          { name: "ICDL", issuer: "Alexandria University", date: "", details: "", credentialUrl: "" },
          { name: "HSBC Banking, online internship", issuer: "HSBC", date: "", details: "Gained knowledge in loans, customer service, and banking processes.", credentialUrl: "" },
          { name: "Digital Marketing", issuer: "Google", date: "", details: "", credentialUrl: "" },
          { name: "Integrated Logistics", issuer: "Mr. Logistics co.", date: "", details: "", credentialUrl: "" }
        ],
        projects: [
          {
            id: "steam-analytics",
            filterKey: "gaming",
            title: "Steam Gaming Industry Market Intelligence & Player Engagement Analysis",
            category: "Big Data & Market Analytics",
            badge: "Excel Dashboard",
            image: steamImg,
            imageAlt: "Excel dashboard screenshot for the Steam analysis: positive and negative review ratio, platform support pie charts, free games share, and top 10 games by concurrent players, positive feedback and negative feedback.",
            modalEyebrow: "Steam Gaming Intelligence",
            modalTitle: "Steam Gaming Market Analytics",
            datasetNote: `${fmt(steamData.total_games)} titles with pricing, release date, genres and platform support.`,
            description: `Comprehensive analytical study of ${fmt(steamData.total_games)} game titles on Steam, tracking 5.7M+ concurrent users (CCU), sentiment breakdown, platform OS distribution (Windows, Mac, Linux), and free vs paid monetization models.`,
            highlights: [
              `Monitored ${fmt(steamData.total_ccu)} concurrent players (CCU) across ${fmt(steamData.total_games)} Steam titles, about ${Math.round(steamData.avg_ccu)} per title on average.`,
              `${steamData.pos_ratio.toFixed(1)}% positive vs ${steamData.neg_ratio.toFixed(1)}% negative review sentiment across the dataset.`,
              `Platform support by share of titles: Windows ≈${Math.round(steamData.platforms.windows / steamData.total_games * 100)}% (${fmt(steamData.platforms.windows)}), Mac ${pctOf(steamData.platforms.mac, steamData.total_games)}% (${fmt(steamData.platforms.mac)}), Linux ${pctOf(steamData.platforms.linux, steamData.total_games)}% (${fmt(steamData.platforms.linux)}).`,
              `Free vs paid: ${fmt(steamData.free_count)} free titles (${pctOf(steamData.free_count, steamData.total_games)}%) vs ${fmt(steamData.paid_count)} paid (${pctOf(steamData.paid_count, steamData.total_games)}%).`,
              `Top titles by concurrent players: ${steamData.top_ccu.slice(0, 4).map(g => `${g.name} (${fmt(g.ccu)})`).join(", ")}.`
            ],
            caseStudy: {
              problem: "[Add the business question or problem this analysis answered]",
              dataSource: `Steam games dataset (Database.xlsx, sheet “extended_steam_games”): ${fmt(steamData.total_games)} titles with reviews, concurrent players (CCU), price, release date, age rating, genres and platform support.`,
              period: `Titles released ${fmtDate(steamData.release_min)} to ${fmtDate(steamData.release_max)}. [Add the snapshot date of the CCU and review counts]`,
              tools: "Excel dashboard built with PivotTables, slicers and charts, using Power Query. [Add any other tools used]",
              methods: `Positive review ratio = positive ÷ (positive + negative) reviews. ${fmt(steamData.total_games)} titles counted; the 3 blank/summary rows at the bottom of the sheet are excluded. [Add data-cleaning steps and other methods]`,
              outcome: "[Add the measurable outcome or recommendation]"
            }
          },
          {
            id: "cost-variance",
            filterKey: "cost",
            title: "Manufacturing Production Output & Quantity Variance Analysis",
            category: "Cost Accounting & Operations",
            badge: "Production Order Visual Report",
            image: costImg,
            imageAlt: "Excel dashboard screenshot for the production analysis: quantity produced by day, total quantity variance, top 10 products by quantity variance, production orders by company, and top 10 products by quantity produced.",
            modalEyebrow: "Manufacturing Cost BI",
            modalTitle: "Manufacturing Quantity Variance Dashboard",
            datasetNote: `Production orders for ${fmtDate(costData.summary.period_start)} to ${fmtDate(costData.summary.period_end)}: ${fmt(costData.summary.order_lines)} order lines.`,
            description: `Cost accounting dashboard for August 2026 production: ${fmt(costData.summary.units_produced)} units produced across cosmetics & personal care brands, with quantity variance analysis (${fmt(costData.summary.variance_quantity)} units) and the top-producing products.`,
            highlights: [
              `Tracked ${fmt(costData.summary.units_produced)} units produced against ${fmt(costData.summary.units_required)} required (${pctOf(costData.summary.units_produced, costData.summary.units_required, 1)}%) across ${fmt(costData.summary.order_lines)} production-order lines in August 2026.`,
              `Isolated a ${fmt(costData.summary.variance_quantity)}-unit quantity shortfall (required minus produced) and ranked the top 10 products driving it, led by two Senor 250g gels (${costData.top_variance_products[0].variance} and ${costData.top_variance_products[1].variance} units).`,
              `Ranked the top 10 products by quantity produced, led by Senor Black Hair Wax 100g (${fmt(costData.top_produced_products[0].produced)} units).`,
              `Mapped production orders across ${costData.summary.companies_count} companies (${costData.company_orders[0].company} leading with ${costData.company_orders[0].orders} order lines, ${costData.company_orders[1].company} with ${costData.company_orders[1].orders}).`
            ],
            caseStudy: {
              problem: "[Add the business question or problem this dashboard addressed]",
              dataSource: `Production order sheet “Aug” (Production_Order_Visual_Report.xlsx): ${fmt(costData.summary.order_lines)} order lines with company, date, order code, product, quantity required, quantity produced and variance.`,
              period: `${fmtDate(costData.summary.period_start)} to ${fmtDate(costData.summary.period_end)}.`,
              tools: "Excel dashboard built with PivotTables, slicers (date and company) and charts. [Add any other tools used]",
              methods: `Variance quantity = quantity required − quantity produced (${fmt(costData.summary.variance_quantity)} units, ${pctOf(costData.summary.variance_quantity, costData.summary.units_required, 1)}% of the ${fmt(costData.summary.units_required)} units required). [Add data-cleaning steps and other methods]`,
              outcome: "[Add the measurable outcome or recommendation]"
            }
          },
          {
            id: "misuo-ecommerce",
            filterKey: "ecommerce",
            title: "MISUO E-Commerce Sales & Delivery Status BI",
            category: "E-Commerce & Supply Chain BI",
            badge: "MISUO Dashboard",
            image: misuoImg,
            imageAlt: "Excel dashboard screenshot for MISUO: total sales, total orders, average selling price, sales by platform, best seller, delivery status breakdown and orders by governorate.",
            modalEyebrow: "E-Commerce Supply Chain BI",
            modalTitle: "MISUO Sales & Delivery Analytics",
            datasetNote: "Order file withheld to protect customers' personal data.",
            description: `Sales and delivery dashboard built from ${misuoData.summary.order_lines} order lines (${misuoData.summary.items_sold} items, ${fmt(misuoData.summary.total_sales)} EGP) between July and December 2024. Evaluates regional governorate demand, sales channels, best sellers and delivery status outcomes.`,
            highlights: [
              `Analyzed ${fmt(misuoData.summary.total_sales)} EGP in sales across ${misuoData.summary.order_lines} order lines (${misuoData.summary.items_sold} items), with an average selling price of ${fmt(misuoData.summary.avg_selling_price)} EGP per order line.`,
              `Cairo governorate led regional demand with ${misuoData.orders_by_area[0].orders} order lines, followed by Giza (${misuoData.orders_by_area[1].orders}) and Qalyubia (${misuoData.orders_by_area[2].orders}).`,
              `Sales channel breakdown: HomeMart platform led with ${misuoData.sales_by_platform[0].units} items sold.`,
              `Delivery status across order lines: ${misuoData.delivery_status[0].pct}% delivered, ${misuoData.delivery_status[2].pct}% rejected, ${misuoData.delivery_status[1].pct}% returned.`
            ],
            caseStudy: {
              problem: "Identify the highest- and lowest-selling products (the goal set out in the workbook's instructions sheet).",
              dataSource: `MISUO order file (MISUO_Abdelaziz_Usama_Mahmoud.xlsx, sheet “البيانات”): ${misuoData.summary.order_lines} order lines with customer type, governorate, sales platform, product, quantity, price and delivery status.`,
              period: `Orders dated ${fmtDate(misuoData.summary.order_date_start)} to ${fmtDate(misuoData.summary.order_date_end)}.`,
              tools: "Excel dashboard built with PivotTables, slicers and charts, using Power Query. [Add any other tools used]",
              methods: `Delivery status share = order lines per status ÷ all ${misuoData.summary.order_lines} lines. Average selling price = mean selling price per order line. [Add data-cleaning steps and other methods]`,
              outcome: "[Add the measurable outcome or recommendation]"
            }
          },
          {
            id: "sales-analysis",
            filterKey: "sales",
            title: "Overall Sales Analysis 2026: Revenue Mix, Customer Concentration & Monthly Trend",
            category: "Sales Analytics & Revenue Mix",
            badge: "Excel Dashboard",
            image: salesImg,
            imageAlt: "Excel dashboard screenshot of the 2026 sales analysis: best selling product, total sales, best revenue category, top 10 products and customers, sales by area and total sales by month.",
            modalEyebrow: "Sales Analytics",
            modalTitle: "Overall Sales Analysis 2026",
            datasetNote: "Invoice-level export withheld to protect customer confidentiality.",
            description: `Sales analysis dashboard built on a 2026 ERP invoice export: ${(salesData.summary.total / 1e6).toFixed(1)}M in total sales across ${fmt(salesData.summary.invoices)} invoices and ${fmt(salesData.summary.customers)} customers, broken down by customer category, revenue account, region and month.`,
            highlights: [
              `Analyzed ${fmt(Math.round(salesData.summary.total))} in total sales (including ${salesData.summary.tax_rate}% tax) across ${fmt(salesData.summary.invoices)} invoices and ${fmt(salesData.summary.customers)} customers, ${fmtDate(salesData.summary.period_start)} to ${fmtDate(salesData.summary.period_end)}.`,
              `Customer concentration: the top customer alone represents ${salesData.summary.top_customer_share}% of sales (top 3: ${salesData.summary.top3_customer_share}%), all from the logistics revenue account.`,
              `Monthly sales peaked in February (${fmt(Math.round(salesData.by_month[1]))}) and were lowest in October (${fmt(Math.round(salesData.by_month[9]))}).`,
              `Sales by region: ${salesData.by_region.map(r => `${REGION_EN[r.name] || r.name} ${fmt(Math.round(r.total))}`).join(", ")}.`
            ],
            caseStudy: {
              problem: "[Add the business question or problem this analysis answered]",
              dataSource: `ERP sales-invoice export (Overall_Dashboard_Sales_Analysis_2026.xlsx, sheet “Query Report”): ${fmt(salesData.summary.invoice_lines)} invoice lines with item, customer group, region, revenue account, amount, tax and total. Currency is not stated in the file. [Add currency]`,
              period: `${fmtDate(salesData.summary.period_start)} to ${fmtDate(salesData.summary.period_end)}.`,
              tools: "Excel dashboard built with PivotTables, slicers and charts. [Add any other tools used]",
              methods: `Total sales = invoice total including ${salesData.summary.tax_rate}% tax (net ${fmt(Math.round(salesData.summary.net))} + tax ${fmt(Math.round(salesData.summary.tax))}). [Add data-cleaning steps and other methods]`,
              outcome: "[Add the measurable outcome or recommendation]"
            }
          }
        ]
      },
      ar: {
        ui: {
          meta: {
            title: "عبدالعزيز اسامه محمود | محاسب ومحلل بيانات مبتدئ",
            description: "معرض أعمال عبدالعزيز اسامه محمود: محاسبة التكاليف وتحليلات العمليات والمبيعات، لوحات إكسيل، ودراسات الحالة."
          },
          skip: "تخطَّ إلى المحتوى الرئيسي",
          navAria: "التنقل الرئيسي",
          nav: { skills: "المهارات", experience: "الخبرات", education: "التعليم", certifications: "الشهادات", projects: "المشاريع", contact: "تواصل معي" },
          themeToLight: "التبديل إلى الوضع الفاتح", themeToDark: "التبديل إلى الوضع الداكن", lightLabel: "الوضع الفاتح", darkLabel: "الوضع الداكن",
          langAria: "التبديل إلى اللغة الإنجليزية", langLabel: "English", langFlag: "🇬🇧", langAttr: "en",
          resumeNav: "تحميل السي في (PDF)", resumeHero: "تحميل السيرة الذاتية",
          filePending: "[أضف الملف]",
          exploreCases: "استكشف لوحات القيادة",
          available: "متاح لوظائف محلل بيانات مبتدئ والمحاسبة",
          experienceLabel: "الخبرة", experienceValue: "أكثر من 3 سنوات في المحاسبة",
          specLabel: "التخصص", specValue: "تحليلات التكاليف والعمليات",
          profileAlt: "صورة شخصية لعبدالعزيز اسامه محمود",
          social: { linkedin: "لينكدإن", github: "جيت هاب", email: "البريد الإلكتروني" },
          socialAria: "روابط التواصل",
          newTab: "يفتح في علامة تبويب جديدة",
          statsAria: "أرقام رئيسية من دراسات الحالة",
          sections: {
            skills: { pill: "القدرات والمهارات الفنية", title: "الخبرات والأدوات التخصصية", sub: "دمج متقدم بين تحليلات البيانات، التكاليف الصناعية، وإدارة سلاسل التوريد." },
            experience: { pill: "المسار المهني", title: "الخبرات العملية", sub: "المناصب الوظيفية والإنجازات القابلة للقياس." },
            education: { pill: "الخلفية الأكاديمية", title: "التعليم", sub: "الدرجات العلمية والمؤهلات الأكاديمية." },
            certifications: { pill: "الاعتمادات", title: "الشهادات", sub: "الشهادات المهنية والدورات المعتمدة." },
            projects: { pill: "المشاريع التطبيقية", title: "معرض لوحات القيادة والتطبيقات المباشرة", sub: "" }
          },
          credentialLink: "عرض الشهادة",
          filterAria: "تصفية المشاريع حسب الفئة",
          filters: { all: "الكل", gaming: "الألعاب والبيانات", cost: "التكاليف والإنتاج", ecommerce: "التجارة الإلكترونية", sales: "تحليلات المبيعات" },
          showing: (n, total) => `يتم عرض ${n} من ${total} مشاريع`,
          card: { keyInsights: "أبرز النتائج", viewCase: "عرض دراسة الحالة والرسوم البيانية", dataset: "تحميل تقرير إكسيل المصدري", datasetRequest: "ملف البيانات متاح عند الطلب" },
          modal: {
            close: "إغلاق النافذة",
            kpiAria: "أرقام رئيسية", chartsHeading: "رسوم لوحة القيادة", chartData: "بيانات الرسم البياني",
            chartUnavailable: "تعذّر تحميل مكتبة الرسوم البيانية، لذلك تظهر البيانات في جدول.",
            caseStudy: "دراسة الحالة",
            problem: "السؤال التجاري أو المشكلة", dataSource: "مصدر البيانات", period: "الفترة الزمنية", tools: "الأدوات المستخدمة",
            methods: "المنهجية", findings: "أبرز النتائج", outcome: "النتيجة / التوصية", links: "الروابط",
            dashboard: "لوحة القيادة", repository: "المستودع (Repository)", samples: "ملفات نموذجية",
            pendDashboard: "[أضف رابط لوحة القيادة]", pendRepository: "[أضف رابط المستودع]", pendSamples: "[أضف رابط الملفات النموذجية]",
            datasetPending: "[أضف الملف]"
          },
          contact: {
            labels: { email: "البريد الإلكتروني", phone: "الهاتف", linkedin: "لينكدإن", github: "جيت هاب", location: "الموقع" },
            title: "معلومات التواصل",
            subtitle: "أبحث بنشاط عن فرص متميزة لتطبيق خبراتي في تحليل البيانات والذكاء التجاري ومحاسبة التكاليف. يسعدني تواصلك لأي استفسارات أو فرص عمل أو مشاريع مشتركة.",
            formName: "الاسم الكامل", formEmail: "البريد الإلكتروني", formSubject: "عنوان الرسالة / الموضوع", formMessage: "تفاصيل الرسالة",
            placeholderName: "أحمد محمود...", placeholderEmail: "ahmed@example.com",
            placeholderSubject: "فرصة عمل / استفسار عن مشروع", placeholderMessage: "اكتب تفاصيل المشروع أو الاستفسار هنا...",
            sendBtn: "إرسال الرسالة", draftBtn: "فتح مسودة البريد", sendingBtn: "جارٍ الإرسال…",
            mailtoNote: "يفتح هذا النموذج مسودة رسالة في تطبيق البريد لديك، ولا يرسل أي شيء من تلقاء نفسه.",
            statusSent: "شكراً لك. تم إرسال رسالتك بنجاح.",
            statusDraft: (email) => `من المفترض أن يفتح تطبيق البريد لديك الآن بمسودة موجّهة إلى ${email}. لم يتم إرسال أي شيء بعد: يرجى مراجعة المسودة ثم الضغط على «إرسال» في تطبيق البريد. إذا لم يُفتح شيء، راسلني مباشرة على ${email}.`,
            statusError: (email) => `عذراً، تعذّر إرسال رسالتك. يرجى المحاولة مرة أخرى، أو مراسلتي مباشرة على ${email}.`
          },
          footer: { rights: "جميع الحقوق محفوظة.", credit: "تصميم بهوية الأزرق الكهربائي والكحلي." }
        },
        personal: {
          name: "عبدالعزيز اسامه محمود",
          title: "محاسب ومحلل بيانات مبتدئ (Junior Data Analyst)",
          subtitle: "محاسب تكاليف | تحليلات العمليات والمبيعات",
          tagline: "تحويل البيانات المبعثرة والمعقدة إلى قرارات استراتيجية مربحة ولوحات قيادة تفاعلية مذهلة.",
          bio: "محاسب بخبرة تزيد على 3 سنوات في محاسبة التكاليف والمحاسبة العامة والرقابة على المخزون، ومحلل بيانات مبتدئ. أحوّل بيانات الإنتاج والمبيعات والسوق إلى لوحات إكسيل (جداول محورية وفلاتر تفاعلية وPower Query)، تشمل تحليل انحراف الكميات وتحليل حالة التوصيل ودراسة لسوق ألعاب Steam.",
          email: "Abdelazizusama0@gmail.com",
          phones: [{ tel: "+201275847057", display: "+20 127 584 7057" }],
          location: "الإسكندرية، مصر",
          linkedin: "https://www.linkedin.com/in/abdelaziz-usama-42867a163",
          linkedinDisplay: "linkedin.com/in/abdelaziz-usama-42867a163",
          github: "https://github.com/abdelaziz-data",
          githubDisplay: "github.com/abdelaziz-data"
        },
        stats: [
          { label: "سجلات تم تحليلها", value: fmt(steamData.total_games), suffix: "لعبة" },
          { label: "لاعبين متزامنين (Steam CCU)", value: "5.7M+", suffix: "لاعب" },
          { label: "مبيعات تم تحليلها (تصدير ERP لعام 2026)", value: "12.5M", suffix: "الإجمالي شاملاً الضريبة" },
          { label: "وحدات منتجة (أغسطس 2026)", value: "465K+", suffix: "وحدة" }
        ],
        skills: [
          { category: "أدوات تحليل البيانات والذكاء التجاري", items: ["Power BI & DAX Modeling", "Power Query & ETL", "نمذجة البيانات (Data Modeling)", "Python (Pandas, NumPy)", "SQL Databases", "تصميم لوحات القيادة (Dashboards)"] },
          { category: "المحاسبة المالية والتكاليف الصناعية", items: ["تحليل انحراف الكميات (Variance Analysis)", "توزيع وتخصيص التكاليف", "النمذجة المالية والتسعير", "إعداد الموازنات والتنبؤ", "التقارير الإدارية التنفيذية", "تقارير إكسيل البصرية و VBA"] },
          { category: "إدارة العمليات والتجارة الإلكترونية", items: ["مؤشرات أداء التوصيل (On-Time Delivery)", "تحليل قنوات البيع", "إدارة المخزون والتخزين", "التوزيع الجغرافي للمبيعات", "تحليل معدلات الإلغاء والمرتجعات", "تحسين سلاسل التوريد"] },
          { category: "العمليات المحاسبية وأنظمة ERP والامتثال", items: ["Oracle ERP و QuickBooks و Peachtree و Daftra", "دفتر الأستاذ وقيود اليومية", "التسويات البنكية", "الرقابة على المخزون (الإنتاج تحت التشغيل والتام)", "الإقرارات الضريبية والفاتورة الإلكترونية", "إكسيل المتقدم (Advanced Excel)"] }
        ],
        experience: [
          {
            role: "محاسب تكاليف", org: "Leven pharma", dates: "2026 – الآن", location: "الإسكندرية، مصر",
            bullets: [
              "إدارة عمليات محاسبة التكاليف من البداية إلى النهاية لضمان دقة تكلفة المنتجات ودعم نماذج التسعير الاستراتيجية.",
              "إدارة مخزون الإنتاج تحت التشغيل (WIP) والمنتج التام بالكامل، مع تطبيق ضوابط تضمن دقة تقييم المخزون.",
              "تحليل انحرافات الإنتاج وقيادة التقارير التشغيلية، وتقديم رؤى قابلة للتنفيذ للإدارة.",
              "تحسين آليات تتبع التكاليف باستمرار، مما أدى إلى وضوح أفضل لكفاءة التصنيع.",
              "مطابقة بيانات التصنيع المعقدة والتحقق منها لضمان دقة 100% في التقارير المالية ومؤشرات الإنتاج."
            ]
          },
          {
            role: "محاسب عام", org: "R&E Petroleum Services", dates: "2025", location: "الإسكندرية، مصر",
            bullets: [
              "ضمان الامتثال الضريبي بنسبة 100% عبر إدارة أنظمة الفاتورة الإلكترونية والتعاون مع الفريق القانوني في المتطلبات التنظيمية.",
              "تبسيط العمليات المالية عبر إدارة تقارير أعمار الديون ومراجعة فواتير الموردين وتنفيذ التسويات البنكية اليومية.",
              "تنظيم مستندات سلسلة التوريد من البداية إلى النهاية، بما في ذلك عمليات الاستيراد والتصدير واختيار شركات الشحن وتنسيق التخليص الجمركي."
            ]
          },
          {
            role: "محاسب عام", org: "Oliver outlet for perfumes", dates: "2024 – 2025", location: "الإسكندرية، مصر",
            bullets: [
              "تبسيط معالجة مدفوعات العملاء ذات الحجم الكبير مع الحفاظ على سجلات دقيقة لضمان الجاهزية المستمرة للمراجعة.",
              "تنفيذ تسويات بنكية دورية وتحليل تقارير أعمار الذمم المدينة لتحسين رأس المال العامل والتدفق النقدي.",
              "معالجة ومطابقة ما متوسطه أكثر من 400 معاملة دفع شهرياً (تجزئة وشركات) بدقة بيانات 100%."
            ]
          },
          {
            role: "محاسب عام", org: "3alrakia for Food & Beverage Company", dates: "2024 – 2025", location: "الإسكندرية، مصر",
            bullets: [
              "متابعة التدفقات النقدية اليومية والإشراف المالي الصارم على عدة حسابات بنكية للشركة لحماية السيولة.",
              "تنفيذ مراجعات معقدة للفواتير ومطابقة سجلات مدفوعات الموردين لضمان النزاهة المالية ومنع الدفع الزائد.",
              "مراجعة ومعالجة أكثر من 150 فاتورة موردين شهرياً لضمان التوزيع الدقيق للتكاليف عبر عدة فروع."
            ]
          },
          {
            role: "محاسب تكاليف", org: "leeloudi patisserie company", dates: "2023 – 2024", location: "الإسكندرية، مصر",
            bullets: [
              "حساب التكلفة الدقيقة لأكثر من 80 صنفاً من قائمة الطعام والحلويات الموسمية، وتقديم رؤى مبنية على البيانات لدعم استراتيجيات التسعير المربحة.",
              "إدارة مخزون الإنتاج تحت التشغيل والمنتج التام عبر 3 مناطق تخزين، وخفض فروقات الانحراف بنسبة 12% من خلال ضوابط أدق للمخزون.",
              "إعداد تقارير تشغيلية أسبوعية للإدارة لرصد مشكلات الهدر واقتراح حلول وفّرت 4% من تكاليف المواد الخام."
            ]
          },
          {
            role: "محاسب عام متدرب", org: "Alexandria water company", dates: "2020", location: "الإسكندرية، مصر",
            bullets: [
              "معالجة أكثر من 100 سجل فوترة يومياً مع التركيز على دقة البيانات والالتزام بالمواعيد النهائية.",
              "اكتساب خبرة عملية في العمليات المحاسبية والتوثيق."
            ]
          }
        ],
        education: [
          { degree: "بكالوريوس التجارة (القسم الإنجليزي)، تخصص المحاسبة", institution: "جامعة الإسكندرية", dates: "2017 – 2021", details: "الإسكندرية، مصر" }
        ],
        certifications: [
          { name: "اللغة الإنجليزية، المستوى 12", issuer: "MODLI Alex", date: "", details: "الاستعداد لاختبار IELTS قيد التنفيذ.", credentialUrl: "" },
          { name: "ICDL", issuer: "جامعة الإسكندرية", date: "", details: "", credentialUrl: "" },
          { name: "تدريب HSBC المصرفي عن بُعد", issuer: "HSBC", date: "", details: "اكتساب معرفة بالقروض وخدمة العملاء والعمليات المصرفية.", credentialUrl: "" },
          { name: "التسويق الرقمي", issuer: "Google", date: "", details: "", credentialUrl: "" },
          { name: "الخدمات اللوجستية المتكاملة", issuer: "Mr. Logistics co.", date: "", details: "", credentialUrl: "" }
        ],
        projects: [
          {
            id: "steam-analytics",
            filterKey: "gaming",
            title: "دراسة وتصنيف سوق الألعاب العالمي (Steam Market Intelligence)",
            category: "تحليل البيانات الضخمة والألعاب",
            badge: "لوحة إكسيل",
            image: steamImg,
            imageAlt: "لقطة شاشة للوحة إكسيل لتحليل Steam: نسبة التقييمات الإيجابية والسلبية، ودعم أنظمة التشغيل، ونسبة الألعاب المجانية، وأعلى 10 ألعاب من حيث اللاعبين المتزامنين والتقييمات الإيجابية والسلبية.",
            modalEyebrow: "ذكاء سوق ألعاب Steam",
            modalTitle: "تحليل سوق الألعاب العالمي على منصة Steam",
            datasetNote: `${fmt(steamData.total_games)} لعبة مع الأسعار وتاريخ الإصدار والتصنيفات ودعم أنظمة التشغيل.`,
            description: `مشروع تحليل شامل لأكثر من 22,500 لعبة على منصة Steam، بتتبع أكثر من 5.7 مليون لاعب متزامن (CCU)، وتحليل نسب التقييمات الإيجابية والسلبية، وتوافق أنظمة التشغيل (Windows, Mac, Linux)، والنموذج المجاني مقابل المدفوع.`,
            highlights: [
              `تتبع ${fmt(steamData.total_ccu)} لاعب متزامن (CCU) عبر ${fmt(steamData.total_games)} لعبة على Steam، بمتوسط نحو ${Math.round(steamData.avg_ccu)} لاعب لكل لعبة.`,
              `نسبة التقييم الإيجابي ${steamData.pos_ratio.toFixed(1)}% مقابل ${steamData.neg_ratio.toFixed(1)}% تقييمات سلبية في قاعدة البيانات.`,
              `دعم أنظمة التشغيل حسب نسبة الألعاب: Windows ≈${Math.round(steamData.platforms.windows / steamData.total_games * 100)}% (${fmt(steamData.platforms.windows)})، وMac ${pctOf(steamData.platforms.mac, steamData.total_games)}% (${fmt(steamData.platforms.mac)})، وLinux ${pctOf(steamData.platforms.linux, steamData.total_games)}% (${fmt(steamData.platforms.linux)}).`,
              `المجاني مقابل المدفوع: ${fmt(steamData.free_count)} لعبة مجانية (${pctOf(steamData.free_count, steamData.total_games)}%) مقابل ${fmt(steamData.paid_count)} مدفوعة (${pctOf(steamData.paid_count, steamData.total_games)}%).`,
              `أعلى الألعاب من حيث اللاعبين المتزامنين: ${steamData.top_ccu.slice(0, 4).map(g => `${g.name} (${fmt(g.ccu)})`).join("، ")}.`
            ],
            caseStudy: {
              problem: "[أضف السؤال التجاري أو المشكلة التي أجاب عنها هذا التحليل]",
              dataSource: `قاعدة بيانات ألعاب Steam (Database.xlsx، ورقة “extended_steam_games”): ${fmt(steamData.total_games)} لعبة تتضمن التقييمات واللاعبين المتزامنين (CCU) والسعر وتاريخ الإصدار والتصنيف العمري والأنواع ودعم أنظمة التشغيل.`,
              period: `ألعاب صدرت من ${fmtDate(steamData.release_min, true)} إلى ${fmtDate(steamData.release_max, true)}. [أضف تاريخ لقطة بيانات اللاعبين المتزامنين والتقييمات]`,
              tools: "لوحة إكسيل مبنية بالجداول المحورية (PivotTables) والفلاتر التفاعلية (Slicers) والرسوم البيانية، مع Power Query. [أضف أي أدوات أخرى مستخدمة]",
              methods: `نسبة التقييم الإيجابي = التقييمات الإيجابية ÷ (الإيجابية + السلبية). تم احتساب ${fmt(steamData.total_games)} لعبة، مع استبعاد 3 صفوف فارغة أو ملخصة في أسفل الورقة. [أضف خطوات تنظيف البيانات وأي منهجيات أخرى]`,
              outcome: "[أضف النتيجة القابلة للقياس أو التوصية]"
            }
          },
          {
            id: "cost-variance",
            filterKey: "cost",
            title: "لوحة تحليل مخرجات الإنتاج وانحراف الكميات (Manufacturing Cost Variance)",
            category: "محاسبة التكاليف والإنتاج",
            badge: "Production Order Visual Report",
            image: costImg,
            imageAlt: "لقطة شاشة للوحة إكسيل لتحليل الإنتاج: الكمية المنتجة يومياً، وإجمالي انحراف الكميات، وأعلى 10 منتجات انحرافاً، وأوامر الإنتاج حسب الشركة، وأعلى 10 منتجات من حيث الكمية المنتجة.",
            modalEyebrow: "ذكاء الأعمال لتكاليف التصنيع",
            modalTitle: "داشبورد انحراف الكميات والتكاليف الصناعية",
            datasetNote: `أوامر الإنتاج من ${fmtDate(costData.summary.period_start, true)} إلى ${fmtDate(costData.summary.period_end, true)}: ${fmt(costData.summary.order_lines)} سطر أمر إنتاج.`,
            description: `داشبورد لمحاسبة التكاليف الصناعية لإنتاج شهر أغسطس 2026: ${fmt(costData.summary.units_produced)} وحدة منتجة لمجموعة منتجات التجميل والعناية الشخصية، مع تحليل انحراف الكميات (${fmt(costData.summary.variance_quantity)} وحدة) وأعلى المنتجات إنتاجاً.`,
            highlights: [
              `تتبع إنتاج ${fmt(costData.summary.units_produced)} وحدة مقابل ${fmt(costData.summary.units_required)} وحدة مطلوبة (${pctOf(costData.summary.units_produced, costData.summary.units_required, 1)}%) عبر ${fmt(costData.summary.order_lines)} سطر أمر إنتاج في أغسطس 2026.`,
              `كشف عجز في الكميات بلغ ${fmt(costData.summary.variance_quantity)} وحدة (المطلوب ناقص المنتج) وترتيب أعلى 10 منتجات مسببة له، بقيادة جلين من Senor وزن 250 جم (${costData.top_variance_products[0].variance} و${costData.top_variance_products[1].variance} وحدة).`,
              `ترتيب أعلى 10 منتجات من حيث الكمية المنتجة، بقيادة هير واكس أسود Senor وزن 100 جم (${fmt(costData.top_produced_products[0].produced)} وحدة).`,
              `رصد أوامر الإنتاج عبر ${costData.summary.companies_count} شركة (${costData.company_orders[0].company} بقيادة ${costData.company_orders[0].orders} سطراً، يليها ${costData.company_orders[1].company} بـ ${costData.company_orders[1].orders} سطراً).`
            ],
            caseStudy: {
              problem: "[أضف السؤال التجاري أو المشكلة التي عالجتها هذه اللوحة]",
              dataSource: `ورقة أوامر الإنتاج “Aug” (Production_Order_Visual_Report.xlsx): ${fmt(costData.summary.order_lines)} سطر يتضمن الشركة والتاريخ ورقم أمر الإنتاج والمنتج والكمية المطلوبة والكمية المنتجة والانحراف.`,
              period: `من ${fmtDate(costData.summary.period_start, true)} إلى ${fmtDate(costData.summary.period_end, true)}.`,
              tools: "لوحة إكسيل مبنية بالجداول المحورية (PivotTables) والفلاتر التفاعلية (Slicers: التاريخ والشركة) والرسوم البيانية. [أضف أي أدوات أخرى مستخدمة]",
              methods: `انحراف الكمية = الكمية المطلوبة − الكمية المنتجة (${fmt(costData.summary.variance_quantity)} وحدة، أي ${pctOf(costData.summary.variance_quantity, costData.summary.units_required, 1)}% من ${fmt(costData.summary.units_required)} وحدة مطلوبة). [أضف خطوات تنظيف البيانات وأي منهجيات أخرى]`,
              outcome: "[أضف النتيجة القابلة للقياس أو التوصية]"
            }
          },
          {
            id: "misuo-ecommerce",
            filterKey: "ecommerce",
            title: "داشبورد تحليلات مبيعات وحالة توصيل شركة MISUO للتجارة الإلكترونية",
            category: "تحليلات التجارة الإلكترونية وسلاسل الإمداد",
            badge: "MISUO Dashboard",
            image: misuoImg,
            imageAlt: "لقطة شاشة للوحة إكسيل لشركة MISUO: إجمالي المبيعات، وعدد الطلبات، ومتوسط سعر البيع، والمبيعات حسب المنصة، والمنتج الأكثر مبيعاً، وحالة التوصيل، والطلبات حسب المحافظة.",
            modalEyebrow: "ذكاء أعمال التجارة الإلكترونية وسلاسل الإمداد",
            modalTitle: "داشبورد مبيعات وشحن شركة MISUO",
            datasetNote: "ملف الطلبات غير منشور لحماية البيانات الشخصية للعملاء.",
            description: `داشبورد للمبيعات والتوصيل مبني على ${misuoData.summary.order_lines} سطر طلب (${misuoData.summary.items_sold} قطعة، بإجمالي ${fmt(misuoData.summary.total_sales)} جنيه) بين يوليو وديسمبر 2024، مع تتبع التوزيع الجغرافي للمحافظات وقنوات البيع والمنتجات الأعلى مبيعاً وحالة التوصيل.`,
            highlights: [
              `تحليل مبيعات بلغت ${fmt(misuoData.summary.total_sales)} جنيه عبر ${misuoData.summary.order_lines} سطر طلب (${misuoData.summary.items_sold} قطعة)، بمتوسط سعر بيع ${fmt(misuoData.summary.avg_selling_price)} جنيه لكل سطر.`,
              `تصدر محافظة القاهرة للطلب بـ ${misuoData.orders_by_area[0].orders} سطراً، تليها الجيزة بـ ${misuoData.orders_by_area[1].orders} ثم القليوبية بـ ${misuoData.orders_by_area[2].orders}.`,
              `تفوق منصة HomeMart كأعلى قناة بيع بـ ${misuoData.sales_by_platform[0].units} قطعة مباعة.`,
              `حالة التوصيل عبر أسطر الطلبات: ${misuoData.delivery_status[0].pct}% تم تسليمها، و${misuoData.delivery_status[2].pct}% مرفوضة، و${misuoData.delivery_status[1].pct}% مرتجعة.`
            ],
            caseStudy: {
              problem: "تحديد المنتجات الأعلى والأقل مبيعاً (الهدف المذكور في ورقة التعليمات داخل الملف).",
              dataSource: `ملف طلبات MISUO (MISUO_Abdelaziz_Usama_Mahmoud.xlsx، ورقة “البيانات”): ${misuoData.summary.order_lines} سطر طلب يتضمن نوع العميل والمحافظة ومنصة البيع والمنتج والكمية والسعر وحالة التوصيل.`,
              period: `طلبات بتاريخ من ${fmtDate(misuoData.summary.order_date_start, true)} إلى ${fmtDate(misuoData.summary.order_date_end, true)}.`,
              tools: "لوحة إكسيل مبنية بالجداول المحورية (PivotTables) والفلاتر التفاعلية (Slicers) والرسوم البيانية، مع Power Query. [أضف أي أدوات أخرى مستخدمة]",
              methods: `نسبة حالة التوصيل = عدد أسطر كل حالة ÷ إجمالي ${misuoData.summary.order_lines} سطر. متوسط سعر البيع = متوسط سعر البيع لكل سطر طلب. [أضف خطوات تنظيف البيانات وأي منهجيات أخرى]`,
              outcome: "[أضف النتيجة القابلة للقياس أو التوصية]"
            }
          },
          {
            id: "sales-analysis",
            filterKey: "sales",
            title: "تحليل المبيعات الإجمالي 2026: هيكل الإيرادات وتركّز العملاء والاتجاه الشهري",
            category: "تحليلات المبيعات وهيكل الإيرادات",
            badge: "لوحة إكسيل",
            image: salesImg,
            imageAlt: "لقطة شاشة للوحة إكسيل لتحليل المبيعات 2026: المنتج الأكثر مبيعاً، وإجمالي المبيعات، وأفضل فئة إيرادات، وأعلى 10 منتجات وعملاء، والمبيعات حسب المنطقة وحسب الشهر.",
            modalEyebrow: "تحليلات المبيعات",
            modalTitle: "تحليل المبيعات الإجمالي 2026",
            datasetNote: "ملف الفواتير غير منشور حفاظاً على سرية العملاء.",
            description: `داشبورد لتحليل المبيعات مبني على تصدير فواتير من نظام ERP لعام 2026: ${(salesData.summary.total / 1e6).toFixed(1)} مليون إجمالي مبيعات عبر ${fmt(salesData.summary.invoices)} فاتورة و${fmt(salesData.summary.customers)} عميل، موزعة حسب فئة العملاء وحساب الإيرادات والمنطقة والشهر.`,
            highlights: [
              `تحليل إجمالي مبيعات بلغ ${fmt(Math.round(salesData.summary.total))} (شاملاً ضريبة ${salesData.summary.tax_rate}%) عبر ${fmt(salesData.summary.invoices)} فاتورة و${fmt(salesData.summary.customers)} عميل، من ${fmtDate(salesData.summary.period_start, true)} إلى ${fmtDate(salesData.summary.period_end, true)}.`,
              `تركّز العملاء: أكبر عميل يمثل وحده ${salesData.summary.top_customer_share}% من المبيعات (أكبر 3 عملاء: ${salesData.summary.top3_customer_share}%)، وجميعها من حساب إيرادات اللوجستيات.`,
              `بلغت المبيعات الشهرية ذروتها في فبراير (${fmt(Math.round(salesData.by_month[1]))}) وكانت الأدنى في أكتوبر (${fmt(Math.round(salesData.by_month[9]))}).`,
              `المبيعات حسب المنطقة: ${salesData.by_region.map(r => `${r.name} ${fmt(Math.round(r.total))}`).join("، ")}.`
            ],
            caseStudy: {
              problem: "[أضف السؤال التجاري أو المشكلة التي أجاب عنها هذا التحليل]",
              dataSource: `تصدير فواتير مبيعات من نظام ERP (Overall_Dashboard_Sales_Analysis_2026.xlsx، ورقة “Query Report”): ${fmt(salesData.summary.invoice_lines)} سطر فاتورة يتضمن الصنف ومجموعة العملاء والإقليم وحساب الإيرادات والمبلغ والضريبة والإجمالي. العملة غير مذكورة في الملف. [أضف العملة]`,
              period: `من ${fmtDate(salesData.summary.period_start, true)} إلى ${fmtDate(salesData.summary.period_end, true)}.`,
              tools: "لوحة إكسيل مبنية بالجداول المحورية (PivotTables) والفلاتر التفاعلية (Slicers) والرسوم البيانية. [أضف أي أدوات أخرى مستخدمة]",
              methods: `إجمالي المبيعات = إجمالي الفاتورة شاملاً ضريبة ${salesData.summary.tax_rate}% (الصافي ${fmt(Math.round(salesData.summary.net))} + الضريبة ${fmt(Math.round(salesData.summary.tax))}). [أضف خطوات تنظيف البيانات وأي منهجيات أخرى]`,
              outcome: "[أضف النتيجة القابلة للقياس أو التوصية]"
            }
          }
        ]
      }
    };

    /* ======================================================================
       CHART & KPI SPECS: every value comes from the data objects above,
       so the descriptions, KPI tiles and charts always agree.
       ====================================================================== */
    const BLUES = ["accent", "#60A5FA", "#93C5FD", "#BFDBFE", "#1D4ED8", "#1E40AF", "#38BDF8", "#0EA5E9", "#6366F1", "#A5B4FC"];

    function getProjectViz(id, lang) {
      const ar = lang === 'ar';
      if (id === 'steam-analytics') {
        return {
          kpis: [
            { label: ar ? "ألعاب مُحلَّلة" : "Titles analyzed", value: fmt(steamData.total_games) },
            { label: ar ? "لاعبون متزامنون (CCU)" : "Concurrent players (CCU)", value: fmt(steamData.total_ccu) },
            { label: ar ? "تقييمات إيجابية" : "Positive reviews", value: `${steamData.pos_ratio.toFixed(1)}%` },
            { label: ar ? "تقييمات سلبية" : "Negative reviews", value: `${steamData.neg_ratio.toFixed(1)}%` }
          ],
          charts: [
            {
              key: 'sentiment', type: 'doughnut', unit: '%',
              title: ar ? "نسبة التقييمات الإيجابية مقابل السلبية" : "Positive vs Negative Review Ratio",
              datasetLabel: ar ? "نسبة التقييمات (%)" : "Share of reviews (%)",
              labels: ar ? ["تقييم إيجابي", "تقييم سلبي"] : ["Positive reviews", "Negative reviews"],
              values: [steamData.pos_ratio, steamData.neg_ratio],
              colors: ["accent", "#EF4444"]
            },
            {
              key: 'ccu', type: 'bar', horizontal: true,
              title: ar ? "أعلى 10 ألعاب من حيث اللاعبين المتزامنين (CCU)" : "Top 10 Games by Concurrent Players (CCU)",
              datasetLabel: ar ? "لاعبون متزامنون (CCU)" : "Concurrent players (CCU)",
              labels: steamData.top_ccu.map(g => g.name),
              values: steamData.top_ccu.map(g => g.ccu)
            }
          ]
        };
      }
      if (id === 'cost-variance') {
        const s = costData.summary;
        return {
          kpis: [
            { label: ar ? "وحدات منتجة" : "Units produced", value: fmt(s.units_produced) },
            { label: ar ? "انحراف الكميات (وحدة)" : "Quantity variance (units)", value: fmt(s.variance_quantity) },
            { label: ar ? "أسطر أوامر الإنتاج" : "Production-order lines", value: fmt(s.order_lines) },
            { label: ar ? "الشركات" : "Companies", value: String(s.companies_count) }
          ],
          charts: [
            {
              key: 'produced', type: 'bar', horizontal: true, tall: true,
              title: ar ? "أعلى 10 منتجات من حيث الكمية المنتجة (وحدة)" : "Top 10 Products by Quantity Produced (units)",
              datasetLabel: ar ? "الكمية المنتجة (وحدة)" : "Quantity produced (units)",
              labels: costData.top_produced_products.map(p => ar ? p.name : (PRODUCT_EN[p.name] || p.name)),
              values: costData.top_produced_products.map(p => p.produced)
            },
            {
              key: 'companies', type: 'doughnut',
              title: ar ? `أسطر أوامر الإنتاج حسب الشركة (أعلى 10 من ${s.companies_count})` : `Production-Order Lines by Company (top 10 of ${s.companies_count})`,
              datasetLabel: ar ? "أسطر أوامر الإنتاج" : "Production-order lines",
              labels: costData.company_orders.slice(0, 10).map(c => c.company),
              values: costData.company_orders.slice(0, 10).map(c => c.orders),
              colors: BLUES
            }
          ]
        };
      }
      if (id === 'sales-analysis') {
        const s = salesData.summary;
        const months = ar ? MONTHS_AR : MONTHS_EN;
        return {
          kpis: [
            { label: ar ? "إجمالي المبيعات (شاملاً الضريبة)" : "Total sales (incl. tax)", value: fmt(Math.round(s.total)) },
            { label: ar ? "الفواتير" : "Invoices", value: fmt(s.invoices) },
            { label: ar ? "العملاء" : "Customers", value: fmt(s.customers) },
            { label: ar ? "حصة أكبر عميل" : "Top customer share", value: `${s.top_customer_share}%` }
          ],
          charts: [
            {
              key: 'monthly', type: 'line',
              title: ar ? "إجمالي المبيعات الشهرية 2026" : "Total Sales by Month, 2026",
              datasetLabel: ar ? "إجمالي المبيعات" : "Total sales",
              labels: salesData.by_month.map((_, i) => months[i]),
              values: salesData.by_month.map(v => Math.round(v))
            },
            {
              key: 'groups', type: 'bar', horizontal: true,
              title: ar ? "المبيعات حسب فئة العملاء" : "Sales by Customer Category",
              datasetLabel: ar ? "إجمالي المبيعات" : "Total sales",
              labels: salesData.by_customer_group.map(g => ar ? g.name : (CUSTOMER_GROUP_EN[g.name] || g.name)),
              values: salesData.by_customer_group.map(g => Math.round(g.total))
            }
          ]
        };
      }
      // misuo-ecommerce
      const d = misuoData.delivery_status;
      return {
        kpis: [
          { label: ar ? "إجمالي المبيعات (جنيه)" : "Total sales (EGP)", value: fmt(misuoData.summary.total_sales) },
          { label: ar ? "أسطر الطلبات" : "Order lines", value: fmt(misuoData.summary.order_lines) },
          { label: ar ? "قطع مباعة" : "Items sold", value: fmt(misuoData.summary.items_sold) },
          { label: ar ? "متوسط سعر البيع (جنيه)" : "Average selling price (EGP)", value: fmt(misuoData.summary.avg_selling_price) }
        ],
        charts: [
          {
            key: 'delivery', type: 'doughnut', unit: '%',
            title: ar ? "توزيع حالة التوصيل (% من أسطر الطلبات)" : "Delivery Status Breakdown (% of order lines)",
            datasetLabel: ar ? "نسبة أسطر الطلبات (%)" : "Share of order lines (%)",
            labels: ar ? ["تم التسليم", "مرتجع", "مرفوض"] : ["Delivered", "Returned", "Rejected"],
            values: d.map(x => x.pct),
            colors: ["accent", "#F59E0B", "#EF4444"]
          },
          {
            key: 'governorates', type: 'bar', horizontal: true,
            title: ar ? "أسطر الطلبات حسب المحافظة" : "Order Lines by Governorate",
            datasetLabel: ar ? "أسطر الطلبات" : "Order lines",
            labels: misuoData.orders_by_area.map(a => ar ? a.city : (GOVERNORATE_EN[a.city] || a.city)),
            values: misuoData.orders_by_area.map(a => a.orders)
          }
        ]
      };
    }
    /* ======================================================================
       SMALL SHARED COMPONENTS
       ====================================================================== */
    const safeGet = (k, fallback) => { try { return localStorage.getItem(k) || fallback; } catch (e) { return fallback; } };
    const safeSet = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };

    // Renders text, highlighting any [bracketed placeholder] so it is obvious what still needs filling in.
    const hasRealText = (s) => String(s || '').replace(/\[[^\]]*\]/g, '').replace(/[\s.،:;,\-–]+/g, '') !== '';
    const showRow = (s) => SITE_CONFIG.showPlaceholders || hasRealText(s);
    function Ph({ text }) {
      if (!text) return null;
      if (!SITE_CONFIG.showPlaceholders) return String(text).replace(/\s*\[[^\]]*\]/g, '').trim() || null;
      return String(text).split(/(\[[^\]]*\])/g).map((part, i) =>
        /^\[[^\]]*\]$/.test(part)
          ? <span key={i} className="ph">{part}</span>
          : <React.Fragment key={i}>{part}</React.Fragment>
      );
    }

    // Downloadable file: a real link only when the file has been marked ready in SITE_CONFIG.
    function FileLink({ file, pendingText, requestText, onRequestClick, className, pendingClassName, children }) {
      if (file && file.ready && file.href) {
        return <a href={encodeURI(file.href)} download className={className}>{children}</a>;
      }
      // Withheld on purpose (personal / confidential data): point visitors to the contact form instead.
      if (file && file.onRequest) {
        return (
          <a href="#contact" onClick={onRequestClick} className={pendingClassName || className} data-file-onrequest="true">
            <span aria-hidden="true">🔒</span> <span>{requestText}</span>
          </a>
        );
      }
      return (
        <span className={pendingClassName || className} data-file-pending="true">
          {children} <span className="ph">{pendingText}</span>
        </span>
      );
    }

    function ExtLink({ href, className, newTabText, children }) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {children}<span className="sr-only"> ({newTabText})</span>
        </a>
      );
    }

    function GitHubIcon() {
      return (
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      );
    }

    function SectionHeader({ id, pill, title, sub }) {
      return (
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="inline-block px-3.5 py-1 rounded-full theme-bg-accent-light theme-text-accent font-bold text-xs">{pill}</span>
          <h2 id={id} className="text-2xl sm:text-3xl font-black theme-text-primary">{title}</h2>
          {sub ? <p className="text-sm theme-text-secondary">{sub}</p> : null}
        </div>
      );
    }

    // Chart.js wrapper: draws the chart, cleans it up, and always exposes the data as text for screen readers.
    function ChartCard({ spec, theme, lang, ui }) {
      const canvasRef = useRef(null);
      const chartReady = typeof Chart !== 'undefined';
      const dep = JSON.stringify([spec.labels, spec.values, spec.type, theme, lang]);

      useEffect(() => {
        if (!chartReady || !canvasRef.current) return undefined;
        const textColor = theme === 'dark' ? '#F5F8FF' : '#14213D';
        const gridColor = theme === 'dark' ? '#233B61' : '#D8E3F5';
        const accent = theme === 'dark' ? '#3B82F6' : '#2563EB';
        const resolve = (c) => (c === 'accent' ? accent : c);
        const circular = spec.type === 'doughnut' || spec.type === 'pie';
        const isLine = spec.type === 'line';
        const compact = (v) => new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(v);
        const shortLabel = function (value) { const l = this.getLabelForValue(value); return l.length > 34 ? l.slice(0, 32) + '…' : l; };
        const bg = circular ? (spec.colors || BLUES).slice(0, spec.values.length).map(resolve) : accent;
        const isAr = lang === 'ar';

        const options = {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: spec.horizontal ? 'y' : 'x',
          plugins: {
            legend: circular
              ? { rtl: isAr, textDirection: isAr ? 'rtl' : 'ltr', position: 'bottom', labels: { color: textColor, font: { size: 11 }, boxWidth: 12 } }
              : { display: false },
            tooltip: {
              rtl: isAr,
              callbacks: {
                label: (ctx) => {
                  const p = ctx.parsed;
                  const v = typeof p === 'object' ? (spec.horizontal ? p.x : p.y) : p;
                  return `${ctx.label}: ${fmt(v)}${spec.unit || ''}`;
                }
              }
            }
          }
        };
        if (!circular) {
          const catTicks = { color: textColor, font: { size: 11 } };
          const numTicks = { color: textColor, font: { size: 11 }, callback: (v) => compact(v) };
          options.scales = spec.horizontal
            ? { x: { ticks: numTicks, grid: { color: gridColor } }, y: { ticks: { ...catTicks, callback: shortLabel }, grid: { color: gridColor } } }
            : { x: { ticks: catTicks, grid: { color: gridColor } }, y: { ticks: numTicks, grid: { color: gridColor } } };
        }

        const chart = new Chart(canvasRef.current.getContext('2d'), {
          type: spec.type,
          data: {
            labels: spec.labels,
            datasets: [{
              label: spec.datasetLabel,
              data: spec.values,
              backgroundColor: bg,
              borderWidth: circular ? 0 : (isLine ? 2 : undefined),
              borderRadius: (circular || isLine) ? undefined : 6,
              ...(isLine ? { borderColor: accent, tension: 0.3, pointRadius: 3, fill: false } : {})
            }]
          },
          options
        });
        return () => chart.destroy();
      }, [dep]);

      const summary = `${spec.title}. ` + spec.labels.map((l, i) => `${l}: ${fmt(spec.values[i])}${spec.unit || ''}`).join('; ');

      return (
        <div className="p-4 rounded-2xl theme-bg-elevated border theme-border space-y-2">
          <h4 className="text-sm font-bold theme-text-accent">{spec.title}</h4>
          {chartReady ? (
            <div className={`relative ${spec.tall ? 'h-96' : 'h-64'}`}>
              <canvas ref={canvasRef} role="img" aria-label={summary}></canvas>
            </div>
          ) : (
            <p className="text-xs theme-text-secondary">{ui.modal.chartUnavailable}</p>
          )}
          <table className={chartReady ? "sr-only" : "w-full text-xs theme-text-primary"}>
            <caption className={chartReady ? "" : "sr-only"}>{ui.modal.chartData}: {spec.title}</caption>
            <tbody>
              {spec.labels.map((l, i) => (
                <tr key={i}>
                  <th scope="row" className="text-start font-semibold py-0.5">{l}</th>
                  <td className="py-0.5">{fmt(spec.values[i])}{spec.unit || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    function CaseStudyItem({ label, full, children }) {
      return (
        <div className={`p-4 rounded-2xl theme-bg-elevated border theme-border space-y-1.5 ${full ? 'md:col-span-2' : ''}`}>
          <dt className="text-xs font-extrabold theme-text-bright">{label}</dt>
          <dd className="text-sm theme-text-primary leading-relaxed">{children}</dd>
        </div>
      );
    }

    function ProjectModal({ project, lang, theme, ui, onClose }) {
      const dialogRef = useRef(null);
      const closeRef = useRef(null);
      const onCloseRef = useRef(onClose);
      onCloseRef.current = onClose;
      const viz = getProjectViz(project.id, lang);
      const links = SITE_CONFIG.projectLinks[project.id] || {};
      const file = SITE_CONFIG.files[project.id];
      const titleId = `modal-title-${project.id}`;

      // Keyboard access: focus the dialog, trap Tab inside it, close on Escape, and restore focus afterwards.
      useEffect(() => {
        const previouslyFocused = document.activeElement;
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        if (closeRef.current) closeRef.current.focus();

        const onKey = (e) => {
          if (e.key === 'Escape') { e.preventDefault(); onCloseRef.current(); return; }
          if (e.key !== 'Tab' || !dialogRef.current) return;
          const focusable = dialogRef.current.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])');
          if (!focusable.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        };
        document.addEventListener('keydown', onKey);
        return () => {
          document.removeEventListener('keydown', onKey);
          document.body.style.overflow = prevOverflow;
          if (previouslyFocused && previouslyFocused.focus) previouslyFocused.focus();
        };
      }, []);

      const cs = project.caseStudy;
      const hasAnyLink = SITE_CONFIG.showPlaceholders || !!(links.dashboard || links.repository || links.samples);
      const linkItem = (href, label, pending) => (!href && !SITE_CONFIG.showPlaceholders) ? null : (
        <li>
          {href
            ? <ExtLink href={href} newTabText={ui.newTab} className="font-semibold theme-text-accent link-underline">{label}</ExtLink>
            : <span><span className="font-semibold theme-text-primary">{label}: </span><span className="ph">{pending}</span></span>}
        </li>
      );

      return (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto"
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative w-full max-w-4xl theme-bg-card border theme-border rounded-3xl p-5 sm:p-6 space-y-6 shadow-2xl my-8"
          >
            <div className="flex justify-between items-start gap-4 border-b theme-border pb-4">
              <div>
                <p className="text-xs font-bold theme-text-accent">{project.modalEyebrow}</p>
                <h2 id={titleId} className="text-lg sm:text-xl font-extrabold theme-text-primary">{project.modalTitle}</h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={ui.modal.close}
                className="shrink-0 w-10 h-10 rounded-full theme-bg-elevated border theme-border theme-text-secondary link-hover font-bold"
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>

            <ul aria-label={ui.modal.kpiAria} className={`grid grid-cols-2 gap-3 ${viz.kpis.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4'}`}>
              {viz.kpis.map((k, i) => (
                <li key={i} className="p-3 rounded-2xl theme-bg-elevated border theme-border text-center">
                  <span className="block text-xl font-black theme-text-accent">{k.value}</span>
                  <span className="block text-xs theme-text-secondary">{k.label}</span>
                </li>
              ))}
            </ul>

            <section aria-labelledby={`${titleId}-charts`} className="space-y-3">
              <h3 id={`${titleId}-charts`} className="sr-only">{ui.modal.chartsHeading}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {viz.charts.map((spec) => <ChartCard key={spec.key} spec={spec} theme={theme} lang={lang} ui={ui} />)}
              </div>
            </section>

            <section aria-labelledby={`${titleId}-cs`} className="space-y-3">
              <h3 id={`${titleId}-cs`} className="text-base font-extrabold theme-text-primary">{ui.modal.caseStudy}</h3>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {showRow(cs.problem) && <CaseStudyItem label={ui.modal.problem} full><Ph text={cs.problem} /></CaseStudyItem>}
                {showRow(cs.dataSource) && <CaseStudyItem label={ui.modal.dataSource}><Ph text={cs.dataSource} /></CaseStudyItem>}
                {showRow(cs.period) && <CaseStudyItem label={ui.modal.period}><Ph text={cs.period} /></CaseStudyItem>}
                {showRow(cs.tools) && <CaseStudyItem label={ui.modal.tools}><Ph text={cs.tools} /></CaseStudyItem>}
                {showRow(cs.methods) && <CaseStudyItem label={ui.modal.methods}><Ph text={cs.methods} /></CaseStudyItem>}
                <CaseStudyItem label={ui.modal.findings} full>
                  <ul className="space-y-1.5">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span aria-hidden="true" className="theme-text-accent font-bold">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </CaseStudyItem>
                {showRow(cs.outcome) && <CaseStudyItem label={ui.modal.outcome} full><Ph text={cs.outcome} /></CaseStudyItem>}
                {hasAnyLink && <CaseStudyItem label={ui.modal.links} full>
                  <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {linkItem(links.dashboard, ui.modal.dashboard, ui.modal.pendDashboard)}
                    {linkItem(links.repository, ui.modal.repository, ui.modal.pendRepository)}
                    {linkItem(links.samples, ui.modal.samples, ui.modal.pendSamples)}
                  </ul>
                </CaseStudyItem>}
              </dl>
            </section>

            <div className="p-4 rounded-2xl theme-bg-elevated border theme-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm theme-text-secondary">{project.datasetNote}</p>
              <FileLink
                file={file}
                pendingText={ui.modal.datasetPending}
                requestText={ui.card.datasetRequest}
                onRequestClick={onClose}
                className="px-4 py-2.5 rounded-xl theme-bg-accent text-xs font-bold transition-all inline-flex items-center gap-2"
                pendingClassName="px-4 py-2.5 rounded-xl border border-dashed theme-border theme-text-secondary text-xs font-bold inline-flex items-center gap-2 flex-wrap justify-center"
              >
                <span aria-hidden="true">📥</span>
                <span>{ui.card.dataset}</span>
              </FileLink>
            </div>
          </div>
        </div>
      );
    }

    /* ======================================================================
       APP
       ====================================================================== */
    function App() {
      const [lang, setLang] = useState('__DEFAULT_LANG__');
      const [theme, setTheme] = useState(() => safeGet('portfolio_theme', 'dark'));
      const [activeModal, setActiveModal] = useState(null);
      const [filterCategory, setFilterCategory] = useState('all');

      const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '', website: '' });
      // idle | sending | draft | sent | error
      const [formStatus, setFormStatus] = useState('idle');

      const data = portfolioContent[lang];
      const ui = data.ui;
      const isAr = lang === 'ar';
      const endpoint = (SITE_CONFIG.contactFormEndpoint || '').trim();
      const phones = data.personal.phones || [];

      // Theme
      useEffect(() => {
        const rootElem = document.documentElement;
        rootElem.setAttribute('data-theme', theme);
        rootElem.classList.toggle('dark', theme === 'dark');
        safeSet('portfolio_theme', theme);
      }, [theme]);

      // Language: keep <html lang>, <html dir>, title and description in sync with the selected language
      useEffect(() => {
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.title = ui.meta.title;
        const meta = document.querySelector('meta[name="description"]');
        if (meta) meta.setAttribute('content', ui.meta.description);
      }, [lang]);

      const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
      const toggleLang = () => { setLang(prev => (prev === 'en' ? 'ar' : 'en')); setFormStatus('idle'); };

      const filteredProjects = data.projects.filter(p => filterCategory === 'all' || p.filterKey === filterCategory);
      const activeProject = data.projects.find(p => p.id === activeModal);

      const setField = (field) => (e) => setFormState(prev => ({ ...prev, [field]: e.target.value }));

      const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (formState.website) return; // honeypot field: real visitors never see or fill it
        const { name, email, subject, message } = formState;

        if (endpoint) {
          setFormStatus('sending');
          try {
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify({ name, email, subject, message })
            });
            if (res.ok) {
              setFormStatus('sent');
              setFormState({ name: '', email: '', subject: '', message: '', website: '' });
            } else {
              setFormStatus('error');
            }
          } catch (err) {
            setFormStatus('error');
          }
          return;
        }

        // No endpoint configured: open a prefilled email draft. We cannot know if it is ever sent, so we never say it was.
        const body = `${message}\n\n--\n${name}\n${email}`;
        window.location.href = `mailto:${data.personal.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        setFormStatus('draft');
      };

      const statusText = formStatus === 'sent' ? ui.contact.statusSent
        : formStatus === 'draft' ? ui.contact.statusDraft(data.personal.email)
        : formStatus === 'error' ? ui.contact.statusError(data.personal.email)
        : formStatus === 'sending' ? ui.contact.sendingBtn : '';

      const navItems = [
        ['skills', ui.nav.skills], ['experience', ui.nav.experience], ['education', ui.nav.education],
        ['certifications', ui.nav.certifications], ['projects', ui.nav.projects], ['contact', ui.nav.contact]
      ];

      const inputClass = "w-full px-4 py-3 rounded-xl theme-bg-elevated border theme-border text-sm theme-text-primary transition-colors";

      const contactCards = [
        { key: 'email', icon: '✉️', label: ui.contact.labels.email,
          node: <a href={`mailto:${data.personal.email}`} className="text-sm font-bold theme-text-primary link-hover block truncate"><bdi>{data.personal.email}</bdi></a> },
        phones.length > 0 && { key: 'phone', icon: '📞', label: ui.contact.labels.phone,
          node: <div>{phones.map((p) => (
            <a key={p.tel} href={`tel:${p.tel}`} className="text-sm font-bold theme-text-primary link-hover block"><bdi>{p.display}</bdi></a>
          ))}</div> },
        { key: 'linkedin', icon: 'in', label: ui.contact.labels.linkedin,
          node: <ExtLink href={data.personal.linkedin} newTabText={ui.newTab} className="text-sm font-bold theme-text-primary link-hover block truncate"><bdi>{data.personal.linkedinDisplay}</bdi></ExtLink> },
        { key: 'github', icon: <GitHubIcon />, label: ui.contact.labels.github,
          node: <ExtLink href={data.personal.github} newTabText={ui.newTab} className="text-sm font-bold theme-text-primary link-hover block truncate"><bdi>{data.personal.githubDisplay}</bdi></ExtLink> },
        { key: 'location', icon: '📍', label: ui.contact.labels.location,
          node: <span className="text-sm font-bold theme-text-primary block">{data.personal.location}</span> }
      ].filter(Boolean);

      return (
        <div className={`min-h-screen theme-bg-main theme-text-primary ${isAr ? 'font-cairo' : 'font-sans'}`}>

          <a href="#main-content" className="skip-link">{ui.skip}</a>

          {/* Header / Navigation Bar */}
          <header className="sticky top-0 z-40 theme-bg-nav border-b theme-border shadow-md backdrop-blur-md">
            <nav aria-label={ui.navAria}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 sm:h-20 gap-3">

                  {/* Brand Logo */}
                  <a href="#main-content" className="flex items-center gap-3 min-w-0">
                    <span aria-hidden="true" className="w-10 h-10 shrink-0 rounded-xl theme-bg-accent flex items-center justify-center font-black text-white text-lg shadow-md theme-glow">AO</span>
                    <span className="min-w-0">
                      <span className="block font-extrabold text-sm sm:text-base leading-snug theme-text-primary tracking-tight truncate">{data.personal.name}</span>
                      <span className="text-xs theme-text-accent font-semibold hidden sm:block truncate">{data.personal.title}</span>
                    </span>
                  </a>

                  {/* Nav Links (large screens) */}
                  <ul className="hidden lg:flex items-center gap-6 text-sm font-semibold theme-text-secondary">
                    {navItems.map(([id, label]) => (
                      <li key={id}><a href={`#${id}`} className="link-hover py-2 inline-block">{label}</a></li>
                    ))}
                  </ul>

                  {/* Right Actions & Controls */}
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={toggleTheme}
                      aria-label={theme === 'dark' ? ui.themeToLight : ui.themeToDark}
                      className="px-3 py-2.5 rounded-xl theme-bg-elevated border theme-border theme-text-primary theme-hover-bg flex items-center gap-1.5 text-xs font-bold shadow-sm"
                    >
                      <span aria-hidden="true" className="text-sm">{theme === 'dark' ? '☀️' : '🌙'}</span>
                      <span className="hidden sm:inline">{theme === 'dark' ? ui.lightLabel : ui.darkLabel}</span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleLang}
                      aria-label={ui.langAria}
                      className="px-3.5 py-2.5 rounded-xl theme-bg-elevated border theme-border theme-text-primary theme-hover-bg text-xs font-bold shadow-sm"
                    >
                      <span aria-hidden="true">{ui.langFlag} </span><span lang={ui.langAttr}>{ui.langLabel}</span>
                    </button>

                    {SITE_CONFIG.files.resume.ready && (
                      <a
                        href={encodeURI(SITE_CONFIG.files.resume.href)}
                        download
                        className="hidden xl:inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl theme-bg-accent font-bold text-xs shadow-lg theme-glow"
                      >
                        <span aria-hidden="true">📄</span><span>{ui.resumeNav}</span>
                      </a>
                    )}

                    <a
                      href="#contact"
                      className="hidden sm:inline-flex px-4 py-2.5 rounded-xl theme-bg-elevated border theme-border theme-text-accent theme-hover-bg text-xs font-bold shadow-sm items-center gap-1.5"
                    >
                      <span aria-hidden="true">✉️</span><span>{ui.nav.contact}</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Section links for small screens (scrolls sideways instead of wrapping) */}
              <ul className="lg:hidden flex gap-5 overflow-x-auto px-4 sm:px-6 py-1 border-t theme-border text-sm font-semibold theme-text-secondary whitespace-nowrap">
                {navItems.map(([id, label]) => (
                  <li key={id}><a href={`#${id}`} className="link-hover py-2.5 inline-block">{label}</a></li>
                ))}
              </ul>
            </nav>
          </header>

          <main id="main-content" tabIndex={-1}>

            {/* Hero Section */}
            <section aria-labelledby="hero-heading" className="relative py-12 lg:py-20 overflow-hidden border-b theme-border theme-bg-secondary">
              <div aria-hidden="true" className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                  <div className="lg:col-span-7 space-y-6">
                    <p className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full theme-bg-elevated border theme-border theme-text-accent text-xs font-bold shadow-sm">
                      <span aria-hidden="true" className="w-2.5 h-2.5 rounded-full theme-bg-accent animate-pulse"></span>
                      <span>{ui.available}</span>
                    </p>

                    <h1 id="hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-black theme-text-primary tracking-tight leading-tight">
                      {data.personal.name}
                    </h1>

                    <p className="text-lg sm:text-xl font-bold theme-text-bright">{data.personal.title}</p>

                    <p className="text-sm sm:text-base theme-text-secondary leading-relaxed max-w-2xl">{data.personal.bio}</p>

                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a href="#projects" className="px-5 py-3 rounded-xl theme-bg-accent font-bold text-sm shadow-lg theme-glow flex items-center gap-2">
                        <span aria-hidden="true">📊</span><span>{ui.exploreCases}</span>
                      </a>
                      <FileLink
                        file={SITE_CONFIG.files.resume}
                        pendingText={ui.filePending}
                        className="px-5 py-3 rounded-xl theme-bg-elevated border theme-border theme-text-primary theme-hover-bg font-bold text-sm shadow-sm flex items-center gap-2"
                        pendingClassName="px-5 py-3 rounded-xl border border-dashed theme-border theme-text-secondary font-bold text-sm flex items-center gap-2 flex-wrap"
                      >
                        <span aria-hidden="true">📥</span><span>{ui.resumeHero}</span>
                      </FileLink>
                    </div>

                    {/* Contact / profile links: LinkedIn, GitHub and email together */}
                    <ul aria-label={ui.socialAria} className="flex flex-wrap items-center gap-3">
                      <li>
                        <ExtLink href={data.personal.linkedin} newTabText={ui.newTab} className="px-4 py-2.5 rounded-xl theme-bg-card border theme-border theme-text-primary theme-hover-bg font-semibold text-sm inline-flex items-center gap-2">
                          <span aria-hidden="true" className="font-black theme-text-accent">in</span><span>{ui.social.linkedin}</span>
                        </ExtLink>
                      </li>
                      <li>
                        <ExtLink href={data.personal.github} newTabText={ui.newTab} className="px-4 py-2.5 rounded-xl theme-bg-card border theme-border theme-text-primary theme-hover-bg font-semibold text-sm inline-flex items-center gap-2">
                          <span className="theme-text-accent"><GitHubIcon /></span><span>{ui.social.github}</span>
                        </ExtLink>
                      </li>
                      <li>
                        <a href={`mailto:${data.personal.email}`} className="px-4 py-2.5 rounded-xl theme-bg-card border theme-border theme-text-primary theme-hover-bg font-semibold text-sm inline-flex items-center gap-2">
                          <span aria-hidden="true">✉️</span><span>{ui.social.email}</span>
                        </a>
                      </li>
                    </ul>
                  </div>

                  {/* Profile Card & Avatar */}
                  <div className="lg:col-span-5 flex justify-center">
                    <div className="relative w-full max-w-sm rounded-3xl theme-bg-card border theme-border p-6 shadow-2xl space-y-5 theme-glow">
                      <div className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-2 theme-border shadow-md">
                        <img src={profileImg} alt={ui.profileAlt} width="894" height="1200" className="w-full h-full object-cover object-top" />
                      </div>

                      <div className="text-center space-y-1">
                        <p className="font-extrabold text-base theme-text-primary">{data.personal.name}</p>
                        <p className="text-sm theme-text-secondary font-medium">{data.personal.subtitle}</p>
                        <p className="text-sm theme-text-accent font-semibold pt-1"><span aria-hidden="true">📍</span> {data.personal.location}</p>
                      </div>

                      <div className="pt-2 border-t theme-border grid grid-cols-2 gap-2 text-center text-xs">
                        <div className="p-2.5 rounded-xl theme-bg-elevated border theme-border">
                          <span className="block text-xs theme-text-muted">{ui.experienceLabel}</span>
                          <span className="font-extrabold theme-text-primary">{ui.experienceValue}</span>
                        </div>
                        <div className="p-2.5 rounded-xl theme-bg-elevated border theme-border">
                          <span className="block text-xs theme-text-muted">{ui.specLabel}</span>
                          <span className="font-extrabold theme-text-accent">{ui.specValue}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>

            {/* Key Executive Metrics */}
            <section aria-label={ui.statsAria} className="py-12 border-b theme-border theme-bg-main">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {data.stats.map((stat, idx) => (
                    <li key={idx} className="p-5 rounded-2xl theme-bg-card border theme-border shadow-md text-center space-y-1 hover:border-blue-500/50">
                      <span className="text-2xl sm:text-3xl font-black theme-text-accent block tracking-tight">{stat.value}</span>
                      <span className="text-xs font-bold theme-text-primary block">{stat.label}</span>
                      <span className="text-xs theme-text-muted block">{stat.suffix}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Skills & Expertise */}
            <section id="skills" aria-labelledby="skills-heading" className="py-16 border-b theme-border theme-bg-secondary">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <SectionHeader id="skills-heading" {...ui.sections.skills} />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data.skills.map((skillGroup, idx) => (
                    <div key={idx} className="p-6 rounded-2xl theme-bg-card border theme-border shadow-md space-y-4 hover:border-blue-500/40">
                      <h3 className="font-extrabold text-sm sm:text-base theme-text-bright border-b theme-border pb-3">{skillGroup.category}</h3>
                      <ul className="space-y-2.5">
                        {skillGroup.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-center gap-2.5 text-sm theme-text-primary font-medium">
                            <span aria-hidden="true" className="w-1.5 h-1.5 shrink-0 rounded-full theme-bg-accent"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Work Experience */}
            <section id="experience" aria-labelledby="experience-heading" className="py-16 border-b theme-border theme-bg-main">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <SectionHeader id="experience-heading" {...ui.sections.experience} />
                <ul className="space-y-5">
                  {data.experience.map((job, i) => (
                    <li key={i} className="p-6 rounded-2xl theme-bg-card border theme-border shadow-md border-s-4 accent-edge space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                        <div>
                          <h3 className="font-extrabold text-base theme-text-primary"><Ph text={job.role} /></h3>
                          <p className="text-sm font-semibold theme-text-bright"><Ph text={job.org} /></p>
                        </div>
                        <p className="text-sm theme-text-secondary sm:text-end">
                          <Ph text={job.dates} />
                          {job.location ? <><br /><Ph text={job.location} /></> : null}
                        </p>
                      </div>
                      <ul className="space-y-1.5">
                        {job.bullets.map((b, bi) => (
                          <li key={bi} className="text-sm theme-text-secondary flex items-start gap-2">
                            <span aria-hidden="true" className="theme-text-accent font-bold">✓</span><span><Ph text={b} /></span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Education */}
            <section id="education" aria-labelledby="education-heading" className="py-16 border-b theme-border theme-bg-secondary">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <SectionHeader id="education-heading" {...ui.sections.education} />
                <ul className="space-y-5">
                  {data.education.map((ed, i) => (
                    <li key={i} className="p-6 rounded-2xl theme-bg-card border theme-border shadow-md border-s-4 accent-edge space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                        <div>
                          <h3 className="font-extrabold text-base theme-text-primary"><Ph text={ed.degree} /></h3>
                          <p className="text-sm font-semibold theme-text-bright"><Ph text={ed.institution} /></p>
                        </div>
                        <p className="text-sm theme-text-secondary sm:text-end"><Ph text={ed.dates} /></p>
                      </div>
                      {ed.details ? <p className="text-sm theme-text-secondary"><Ph text={ed.details} /></p> : null}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Certifications */}
            <section id="certifications" aria-labelledby="certifications-heading" className="py-16 border-b theme-border theme-bg-main">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <SectionHeader id="certifications-heading" {...ui.sections.certifications} />
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {data.certifications.map((c, i) => (
                    <li key={i} className="p-6 rounded-2xl theme-bg-card border theme-border shadow-md space-y-2">
                      <h3 className="font-extrabold text-base theme-text-primary"><Ph text={c.name} /></h3>
                      <p className="text-sm font-semibold theme-text-bright"><Ph text={c.issuer} /></p>
                      {c.date ? <p className="text-sm theme-text-secondary"><Ph text={c.date} /></p> : null}
                      {c.details ? <p className="text-sm theme-text-secondary"><Ph text={c.details} /></p> : null}
                      {c.credentialUrl
                        ? <p className="text-sm"><ExtLink href={c.credentialUrl} newTabText={ui.newTab} className="font-semibold theme-text-accent link-underline">{ui.credentialLink}: {c.name}</ExtLink></p>
                        : null}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Projects & Case Studies */}
            <section id="projects" aria-labelledby="projects-heading" className="py-16 border-b theme-border theme-bg-secondary">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                  <div className="space-y-2">
                    <span className="inline-block px-3.5 py-1 rounded-full theme-bg-accent-light theme-text-accent font-bold text-xs">{ui.sections.projects.pill}</span>
                    <h2 id="projects-heading" className="text-2xl sm:text-3xl font-black theme-text-primary">{ui.sections.projects.title}</h2>
                  </div>

                  <div role="group" aria-label={ui.filterAria} className="flex flex-wrap gap-2 p-1.5 rounded-2xl theme-bg-elevated border theme-border">
                    {['all', 'gaming', 'cost', 'ecommerce', 'sales'].map((key) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFilterCategory(key)}
                        aria-pressed={filterCategory === key}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold ${filterCategory === key ? 'theme-bg-accent shadow-md' : 'theme-text-secondary link-hover'}`}
                      >
                        {ui.filters[key]}
                      </button>
                    ))}
                  </div>
                </div>

                <p className="sr-only" role="status" aria-live="polite">{ui.showing(filteredProjects.length, data.projects.length)}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-8">
                  {filteredProjects.map((project) => (
                    <article key={project.id} className="group rounded-3xl theme-bg-card border theme-border overflow-hidden shadow-xl hover:shadow-2xl hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="relative h-48 sm:h-52 overflow-hidden theme-bg-elevated border-b theme-border">
                          <img
                            src={project.image}
                            alt={project.imageAlt}
                            loading="lazy"
                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                          />
                          <span className="absolute top-3 end-3 px-3 py-1 rounded-full theme-bg-card border theme-border theme-text-accent text-xs font-bold shadow-md">{project.badge}</span>
                        </div>

                        <div className="p-6 space-y-4">
                          <p className="text-xs font-extrabold theme-text-bright">{project.category}</p>
                          <h3 className="font-extrabold text-base theme-text-primary leading-snug">{project.title}</h3>
                          <p className="text-sm theme-text-secondary leading-relaxed">{project.description}</p>

                          <div className="space-y-2 pt-2 border-t theme-border">
                            <p className="text-xs font-bold theme-text-primary">{ui.card.keyInsights}</p>
                            <ul className="space-y-1.5">
                              {project.highlights.slice(0, 2).map((h, hIdx) => (
                                <li key={hIdx} className="text-xs theme-text-secondary flex items-start gap-1.5">
                                  <span aria-hidden="true" className="theme-text-accent font-bold">✓</span>
                                  <span>{h}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 pt-0 space-y-2">
                        <button
                          type="button"
                          onClick={() => setActiveModal(project.id)}
                          aria-haspopup="dialog"
                          className="w-full py-3 rounded-xl theme-bg-accent font-bold text-sm shadow-md flex items-center justify-center gap-2"
                        >
                          <span aria-hidden="true">📈</span>
                          <span>{ui.card.viewCase}<span className="sr-only">: {project.title}</span></span>
                        </button>

                        <FileLink
                          file={SITE_CONFIG.files[project.id]}
                          pendingText={ui.filePending}
                          requestText={ui.card.datasetRequest}
                          className="w-full py-2.5 rounded-xl theme-bg-elevated border theme-border theme-text-primary theme-hover-bg font-semibold text-xs flex items-center justify-center gap-1.5"
                          pendingClassName="w-full py-2.5 rounded-xl border border-dashed theme-border theme-text-secondary font-semibold text-xs flex items-center justify-center gap-1.5 flex-wrap"
                        >
                          <span aria-hidden="true">📊</span><span>{ui.card.dataset}</span>
                        </FileLink>
                      </div>
                    </article>
                  ))}
                </div>

              </div>
            </section>

            {/* Contact */}
            <section id="contact" aria-labelledby="contact-heading" className="py-20 border-b theme-border theme-bg-main relative overflow-hidden">
              <div aria-hidden="true" className="absolute top-1/2 right-10 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

                  <div className="lg:col-span-5 space-y-6">
                    <div>
                      <h2 id="contact-heading" className="text-3xl font-black theme-text-primary tracking-tight mb-3">{ui.contact.title}</h2>
                      <p className="text-sm theme-text-secondary leading-relaxed">{ui.contact.subtitle}</p>
                    </div>

                    <ul className="space-y-4 pt-2">
                      {contactCards.map((card) => (
                        <li key={card.key} className="p-4 rounded-2xl theme-bg-card border theme-border shadow-md flex items-center gap-4 hover:border-blue-500/50">
                          <span aria-hidden="true" className="w-12 h-12 shrink-0 rounded-xl theme-bg-accent-light border theme-border flex items-center justify-center text-xl theme-text-accent font-bold">{card.icon}</span>
                          <div className="space-y-0.5 overflow-hidden min-w-0">
                            <span className="text-xs font-extrabold theme-text-muted block">{card.label}</span>
                            {card.node}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="lg:col-span-7">
                    <div className="p-6 sm:p-8 rounded-3xl theme-bg-card border theme-border shadow-2xl theme-glow">
                      <form onSubmit={handleFormSubmit} className="space-y-5">

                        <div className="space-y-2">
                          <label htmlFor="contact-name" className="text-sm font-bold theme-text-primary block">{ui.contact.formName}</label>
                          <input id="contact-name" name="name" type="text" required autoComplete="name" dir="auto"
                            value={formState.name} onChange={setField('name')} placeholder={ui.contact.placeholderName} className={inputClass} />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="contact-email" className="text-sm font-bold theme-text-primary block">{ui.contact.formEmail}</label>
                          <input id="contact-email" name="email" type="email" required autoComplete="email" dir="ltr"
                            value={formState.email} onChange={setField('email')} placeholder={ui.contact.placeholderEmail} className={inputClass} />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="contact-subject" className="text-sm font-bold theme-text-primary block">{ui.contact.formSubject}</label>
                          <input id="contact-subject" name="subject" type="text" required dir="auto"
                            value={formState.subject} onChange={setField('subject')} placeholder={ui.contact.placeholderSubject} className={inputClass} />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="contact-message" className="text-sm font-bold theme-text-primary block">{ui.contact.formMessage}</label>
                          <textarea id="contact-message" name="message" rows={5} required dir="auto"
                            value={formState.message} onChange={setField('message')} placeholder={ui.contact.placeholderMessage} className={`${inputClass} resize-y`}></textarea>
                        </div>

                        {/* Honeypot (spam trap): hidden from people and assistive tech */}
                        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
                          <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" value={formState.website} onChange={setField('website')} /></label>
                        </div>

                        {!endpoint && <p className="text-xs theme-text-secondary">{ui.contact.mailtoNote}</p>}

                        <button
                          type="submit"
                          disabled={formStatus === 'sending'}
                          aria-busy={formStatus === 'sending'}
                          className="w-full py-3.5 rounded-xl theme-bg-accent text-white font-extrabold text-sm shadow-lg theme-glow flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                          <span aria-hidden="true">{endpoint ? '✈️' : '✉️'}</span>
                          <span>{formStatus === 'sending' ? ui.contact.sendingBtn : (endpoint ? ui.contact.sendBtn : ui.contact.draftBtn)}</span>
                        </button>

                        {/* Accurate, announced result message */}
                        <div role="status" aria-live="polite" id="form-status" data-status={formStatus}
                          className={`text-sm leading-relaxed ${formStatus === 'error' ? 'text-red-500 font-semibold' : 'theme-text-primary'} ${statusText ? 'p-4 rounded-xl theme-bg-elevated border theme-border' : ''}`}>
                          {statusText}
                        </div>

                      </form>
                    </div>
                  </div>

                </div>
              </div>
            </section>

          </main>

          {/* Footer */}
          <footer className="py-10 theme-bg-card border-t theme-border text-center space-y-4">
            <div className="max-w-7xl mx-auto px-4 space-y-3">
              <p className="font-extrabold text-sm theme-text-primary">{data.personal.name}</p>
              <p className="text-sm theme-text-secondary">{data.personal.title}</p>
              <ul aria-label={ui.socialAria} className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-semibold">
                <li><ExtLink href={data.personal.linkedin} newTabText={ui.newTab} className="theme-text-accent link-underline inline-block py-2">{ui.social.linkedin}</ExtLink></li>
                <li><ExtLink href={data.personal.github} newTabText={ui.newTab} className="theme-text-accent link-underline inline-block py-2">{ui.social.github}</ExtLink></li>
                <li><a href={`mailto:${data.personal.email}`} className="theme-text-accent link-underline inline-block py-2">{ui.social.email}</a></li>
              </ul>
              <p className="text-xs theme-text-muted pt-2">
                © 2026 {data.personal.name}. {ui.footer.rights} {ui.footer.credit}
              </p>
            </div>
          </footer>

          {activeProject && (
            <ProjectModal project={activeProject} lang={lang} theme={theme} ui={ui} onClose={() => setActiveModal(null)} />
          )}

        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>
"""

if __name__ == "__main__":
    main()
