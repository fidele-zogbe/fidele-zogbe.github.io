"""Builds the English and French CVs (public/Fidele-ZOGBE-CV.pdf and -FR.pdf) from scripts/cv/cv.html and cv.fr.html (one A4 page, real text, clickable links).

Run from the project root:
    pip install playwright && playwright install chromium
    python scripts/make_cv.py

To change the CV, edit scripts/cv/cv.html / cv.fr.html (text) or replace scripts/cv/photo.jpg.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
JOBS = [
    (ROOT / "scripts" / "cv" / "cv.html", ROOT / "public" / "Fidele-ZOGBE-CV.pdf"),        # English
    (ROOT / "scripts" / "cv" / "cv.fr.html", ROOT / "public" / "Fidele-ZOGBE-CV-FR.pdf"),  # Français
]

with sync_playwright() as p:
    browser = p.chromium.launch()
    for src, out in JOBS:
        page = browser.new_page()
        page.goto(src.as_uri())
        page.evaluate("document.fonts.ready")
        page.pdf(path=str(out), format="A4", print_background=True, prefer_css_page_size=True)
        page.close()
        print("written", out)
    browser.close()
