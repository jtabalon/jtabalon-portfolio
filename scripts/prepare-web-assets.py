"""Regenerate committed web assets; normal export builds need no encoding tools.

Requirements: cwebp on PATH and Python's fonttools[woff] package.
Run from anywhere: python3 scripts/prepare-web-assets.py
"""

from pathlib import Path
import subprocess

from fontTools import subset
from fontTools.ttLib import TTFont


ROOT = Path(__file__).resolve().parent.parent
FONT_PACKAGES = ROOT / "node_modules" / "@expo-google-fonts"
PORTRAITS = ROOT / "public" / "portraits"
FONTS = ROOT / "public" / "fonts"

# Keep Latin, combining marks, punctuation, currency, arrows and
# the site's actual source characters, rather than subsetting only today's copy.
UNICODES = set()
for start, end in (
    (0x0000, 0x00FF),
    (0x0300, 0x036F),
    (0x2000, 0x206F),
    (0x20A0, 0x20CF),
    (0x2190, 0x21FF),
):
    UNICODES.update(range(start, end + 1))
UNICODES.update((0x0131, 0x0152, 0x0153, 0x02BB, 0x02BC, 0x02C6, 0x02DA, 0x02DC,
                 0x2122, 0x2212, 0x2215, 0xFEFF, 0xFFFD))
for source in (ROOT / "src").rglob("*"):
    if source.suffix in (".ts", ".tsx"):
        UNICODES.update(map(ord, source.read_text()))

PORTRAITS.mkdir(parents=True, exist_ok=True)
for width in (320, 640, 960):
    subprocess.run(
        [
            "cwebp", "-quiet", "-q", "88", "-m", "6", "-metadata", "none",
            "-resize", str(width), str(width),
            str(ROOT / "public" / "joseph-tabalon.png"),
            "-o", str(PORTRAITS / f"joseph-tabalon-{width}.webp"),
        ],
        check=True,
    )

FONTS.mkdir(parents=True, exist_ok=True)
for package, family, weights in (
    ("inter", "Inter", ((400, "Regular"), (500, "Medium"), (600, "SemiBold"))),
    ("jetbrains-mono", "JetBrainsMono", ((400, "Regular"), (500, "Medium"))),
):
    license_text = (FONT_PACKAGES / package / "LICENSE_FONT").read_text()
    (FONTS / f"{package}-OFL.txt").write_text(
        "\n".join(line.rstrip() for line in license_text.splitlines()) + "\n"
    )
    for weight, style in weights:
        source = FONT_PACKAGES / package / f"{weight}{style}" / f"{family}_{weight}{style}.ttf"
        font = TTFont(source, recalcTimestamp=False)
        options = subset.Options()
        options.flavor = "woff2"
        options.name_IDs = ["*"]
        options.name_legacy = True
        options.name_languages = ["*"]
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(unicodes=UNICODES)
        subsetter.subset(font)
        font.flavor = "woff2"
        font.save(FONTS / f"{package}-{weight}-latin.woff2")
