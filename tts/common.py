"""Gedeelde helpers: verhaal inlezen, SSML bouwen, SSML terug naar tekst, chunk-planning."""
import os
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent
STORY = ROOT / "verhaal.txt"
OUT = Path(os.environ.get("OUT_DIR", ROOT / "out"))
SSML_DIR = OUT / "ssml"
CHUNK_DIR = OUT / "chunks"

VOICE = os.environ.get("VOICE", "nl-NL-MaartenNeural")
RATE = os.environ.get("RATE", "-12%")
LOCALE = "nl-NL"
SAMPLE_RATE = 48000
PAUSE_TITLE_MS = 1500
PAUSE_NARRATION_MS = 900
PAUSE_DIALOGUE_MS = 450
TARGET_CHUNK_S = float(os.environ.get("TARGET_CHUNK_S", 300))
MAX_CHUNK_S = 8.5 * 60


def need_env(*names):
    missing = [n for n in names if not os.environ.get(n)]
    if missing:
        sys.exit("Ontbrekende omgevingsvariabelen: " + ", ".join(missing))
    return [os.environ[n] for n in names]


def load_story():
    """Geeft (titel, [paragraaf-dicts]). Regel 1 = titel, lege regels scheiden alinea's."""
    blocks = [b for b in re.split(r"\n\s*\n", STORY.read_text(encoding="utf-8").strip()) if b.strip()]
    title, paras = blocks[0].strip(), blocks[1:]
    items = [{"text": title, "kind": "title", "pause_before_ms": 0}]
    for p in paras:
        p = p.strip()
        dialogue = p.startswith('"')
        items.append({
            "text": p,
            "kind": "dialogue" if dialogue else "narration",
            "pause_before_ms": PAUSE_DIALOGUE_MS if dialogue else PAUSE_NARRATION_MS,
        })
    items[1]["pause_before_ms"] = PAUSE_TITLE_MS
    return title, items


def markup(text):
    """XML-escape en vervang elke 'Sasha' door een <sub>; de tekst zelf blijft ongewijzigd."""
    return re.sub(r"\bSasha\b", '<sub alias="Sasja">Sasha</sub>', escape(text))


def build_ssml(items):
    parts = []
    for i, it in enumerate(items):
        if i > 0:
            parts.append(f'<break time="{it["pause_before_ms"]}ms"/>')
        parts.append(markup(it["text"]))
    body = "\n".join(parts)
    return (
        f'<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="{LOCALE}">\n'
        f'<voice name="{VOICE}">\n<prosody rate="{RATE}">\n{body}\n</prosody>\n</voice>\n</speak>\n'
    )


def ssml_to_text(ssml):
    """Strip alle SSML; <sub> geeft zijn oorspronkelijke woord terug (alias zit in een attribuut)."""
    return "".join(ET.fromstring(ssml).itertext())


def normalize(s):
    return " ".join(s.split())


def rate_factor():
    return 1 + float(RATE.rstrip("%")) / 100


def estimate_seconds(item, wpm):
    words = len(item["text"].split())
    return words / (wpm * rate_factor()) * 60 + item["pause_before_ms"] / 1000


def plan_chunks(items, wpm, target_s):
    """Splits op alinea-grenzen. Liefst knippen vóór een vertelalinea (niet midden in een dialoog)."""
    chunks, cur, cur_s = [], [], 0.0
    for i, it in enumerate(items):
        cur.append(it)
        cur_s += estimate_seconds(it, wpm)
        nxt = items[i + 1] if i + 1 < len(items) else None
        if nxt is None:
            break
        if (cur_s >= 0.85 * target_s and nxt["kind"] == "narration") or cur_s >= 1.1 * target_s:
            chunks.append(cur)
            cur, cur_s = [], 0.0
    if cur:
        chunks.append(cur)
    return chunks


def pcm_seconds(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-f", "s16le", "-ar", str(SAMPLE_RATE), "-ac", "1",
         "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(path)],
        capture_output=True, text=True, check=True).stdout.strip()
    return float(out)
