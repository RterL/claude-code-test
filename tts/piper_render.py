"""Offline Piper-route: rendert verhaal.txt alinea voor alinea naar wav/mp3/m4a. Hervat bij ontbrekende alinea's.

Geen SSML bij Piper: pauzes worden als stilte ingevoegd, 'Sasha' wordt alleen in de spreektekst 'Sasja'
(verhaal.txt zelf blijft onaangeroerd) en het tempo gaat via length_scale.
"""
import json
import os
import re
import subprocess
import wave

from common import OUT, RATE, STORY, load_story, normalize
from verify import probe

ROOT = OUT.parent
MODEL_DIR = ROOT / "models"
PIPER_VOICE = os.environ.get("PIPER_VOICE", "nl_NL-pim-medium")
LENGTH_SCALE = float(os.environ.get("LENGTH_SCALE", 1 / (1 + float(RATE.rstrip("%")) / 100)))
PARA_DIR = OUT / "piper"


def spoken(text):
    return re.sub(r"\bSasha\b", "Sasja", text)


def load_voice():
    from piper import PiperVoice
    model = MODEL_DIR / f"{PIPER_VOICE}.onnx"
    if not model.exists():
        raise SystemExit(f"{model} ontbreekt. Download: python -m piper.download_voices {PIPER_VOICE} --download-dir {MODEL_DIR}")
    return PiperVoice.load(model)


def synth_item(voice, text, path):
    from piper import SynthesisConfig
    with wave.open(str(path), "wb") as w:
        voice.synthesize_wav(text, w, syn_config=SynthesisConfig(length_scale=LENGTH_SCALE))


def ff(*args):
    subprocess.run(["ffmpeg", "-y", "-v", "error", *args], check=True)


def main():
    _, items = load_story()
    PARA_DIR.mkdir(parents=True, exist_ok=True)
    voice = load_voice()
    sr = voice.config.sample_rate
    pcm = bytearray(b"\x00\x00" * sr)  # 1 s stilte vooraan
    durations = []
    for n, it in enumerate(items):
        path = PARA_DIR / f"{n:03d}.wav"
        if not (path.exists() and path.stat().st_size > 44):
            synth_item(voice, spoken(it["text"]), path)
        with wave.open(str(path), "rb") as w:
            assert w.getframerate() == sr and w.getnchannels() == 1 and w.getsampwidth() == 2
            frames = w.readframes(w.getnframes())
        if n:
            pcm += b"\x00\x00" * (sr * it["pause_before_ms"] // 1000)
        pcm += frames
        durations.append(len(frames) / 2 / sr)
        print(f"{n + 1}/{len(items)}", end="\r", flush=True)
    pcm += b"\x00\x00" * (sr * 3)  # 3 s stilte achteraan
    total = len(pcm) / 2 / sr
    raw = OUT / "master_raw.pcm"
    raw.write_bytes(bytes(pcm))
    wav = OUT / "verhaal.wav"
    ff("-f", "s16le", "-ar", str(sr), "-ac", "1", "-i", str(raw),
       "-af", f"aresample=48000,afade=t=out:st={total - 2:.3f}:d=2", "-c:a", "pcm_s16le", str(wav))
    raw.unlink()
    ff("-i", str(wav), "-c:a", "libmp3lame", "-b:a", "192k", str(OUT / "verhaal.mp3"))
    ff("-i", str(wav), "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", str(OUT / "verhaal.m4a"))

    # Integriteit: spreektekst terugvertalen (Sasja -> Sasha) moet de bron opleveren
    story = STORY.read_text(encoding="utf-8")
    back = normalize(" ".join(spoken(i["text"]).replace("Sasja", "Sasha") for i in items))
    ok = back == normalize(story) and "Sasja" not in story
    files = {n: probe(OUT / n) for n in ("verhaal.wav", "verhaal.mp3", "verhaal.m4a")}
    log = {"engine": "piper", "voice": PIPER_VOICE, "native_sample_rate": sr, "length_scale": LENGTH_SCALE,
           "text_integrity": "PASS" if ok else "FAIL", "chars_spoken": sum(len(spoken(i["text"])) for i in items),
           "paragraphs": len(items), "files": files}
    (OUT / "build-log.json").write_text(json.dumps(log, indent=1, ensure_ascii=False))
    print(f"\nTekstintegriteit: {log['text_integrity']}; stem {PIPER_VOICE}; native {sr} Hz -> 48 kHz")
    for n, p in files.items():
        print(n, p)
    raise SystemExit(0 if ok else 1)


if __name__ == "__main__":
    main()
