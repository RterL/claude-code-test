"""Rendert titel + eerste 5 zinnen van het verhaal met elke opgegeven Piper-stem (normale snelheid)
en meet toonhoogte (F0) als objectieve check op 'mannelijk' en 'diep'. Intonatie/natuurlijkheid blijft een luisteroordeel.

Gebruik: python sample.py nl_NL-pim-medium nl_NL-ronnie-medium ...   -> samples/raw/<stem>.wav + tabel
"""
import re
import sys
import wave

import numpy as np
import parselmouth
from piper import PiperVoice, SynthesisConfig

from common import ROOT, load_story
from piper_render import spoken

RAW = ROOT / "samples" / "raw"
GAP_TITLE_S = 1.5


def excerpt():
    """(titel, eerste vijf zinnen van de eerste alinea) uit verhaal.txt, ongewijzigd."""
    title, items = load_story()
    sentences = re.split(r"(?<=[.!?])\s+", items[1]["text"])
    return title, " ".join(sentences[:5])


def render(name, path, length_scale=1.0):
    voice = PiperVoice.load(ROOT / "models" / f"{name}.onnx", config_path=ROOT / "models" / f"{name}.onnx.json")
    sr = voice.config.sample_rate
    title, body = excerpt()
    chunks = []
    for text in (title, body):
        tmp = path.with_suffix(".part.wav")
        with wave.open(str(tmp), "wb") as w:
            voice.synthesize_wav(spoken(text), w, syn_config=SynthesisConfig(length_scale=length_scale))
        with wave.open(str(tmp), "rb") as w:
            chunks.append(np.frombuffer(w.readframes(w.getnframes()), dtype=np.int16))
        tmp.unlink()
    gap = np.zeros(int(sr * GAP_TITLE_S), dtype=np.int16)
    audio = np.concatenate([chunks[0], gap, chunks[1]])
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1), w.setsampwidth(2), w.setframerate(sr)
        w.writeframes(audio.tobytes())
    return sr, len(chunks[1]) / sr


def f0_stats(path):
    snd = parselmouth.Sound(str(path))
    f0 = snd.to_pitch(pitch_floor=60, pitch_ceiling=300).selected_array["frequency"]
    voiced = f0[f0 > 0]
    p10, p50, p90 = np.percentile(voiced, [10, 50, 90])
    return {"f0_median_hz": round(float(p50)), "f0_p10_hz": round(float(p10)), "f0_p90_hz": round(float(p90)),
            "range_semitones": round(12 * float(np.log2(p90 / p10)), 1), "voiced_pct": round(100 * len(voiced) / len(f0))}


def main(names):
    RAW.mkdir(parents=True, exist_ok=True)
    _, body = excerpt()
    words = len(body.split())
    print(f"{'stem':24} {'F0 mediaan':>10} {'P10-P90 Hz':>11} {'bereik st':>9} {'w/min':>6}")
    for n in names:
        path = RAW / f"{n}.wav"
        sr, body_s = render(n, path)
        s = f0_stats(path)
        print(f"{n:24} {s['f0_median_hz']:>8} Hz {s['f0_p10_hz']:>4}-{s['f0_p90_hz']:<5} {s['range_semitones']:>9} {words / body_s * 60:>6.0f}")


if __name__ == "__main__":
    main(sys.argv[1:])
