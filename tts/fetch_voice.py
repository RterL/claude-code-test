"""Haalt gratis Piper-stemmen (via sherpa-onnx GitHub-releases) op naar models/<naam>.onnx(.json).

Gebruik: python fetch_voice.py nl_NL-pim-medium nl_NL-ronnie-medium ...
"""
import shutil
import sys
import tarfile
import urllib.request
from pathlib import Path

from common import ROOT

BASE = "https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-{name}.tar.bz2"
MODEL_DIR = ROOT / "models"


def fetch(name):
    onnx, cfg = MODEL_DIR / f"{name}.onnx", MODEL_DIR / f"{name}.onnx.json"
    if onnx.exists() and cfg.exists():
        return
    MODEL_DIR.mkdir(exist_ok=True)
    archive = MODEL_DIR / f"{name}.tar.bz2"
    urllib.request.urlretrieve(BASE.format(name=name), archive)
    with tarfile.open(archive) as t:
        for m in t.getmembers():
            if m.name.endswith((f"{name}.onnx", f"{name}.onnx.json", "README.md", "MODEL_CARD")):
                m.name = Path(m.name).name if m.name.endswith(".onnx") or m.name.endswith(".json") \
                    else f"{name}.{Path(m.name).name}"
                t.extract(m, MODEL_DIR)
    archive.unlink()
    print(f"{name}: {onnx.stat().st_size / 1e6:.0f} MB")


if __name__ == "__main__":
    for n in sys.argv[1:]:
        fetch(n)
