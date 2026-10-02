"""Plakt PCM-chunks aan elkaar (zonder herencoderen), 1 s stilte voor, 3 s achter, fade-out 2 s; exporteert wav/mp3/m4a."""
import json
import subprocess

from common import CHUNK_DIR, OUT, SAMPLE_RATE, pcm_seconds


def silence(ms):
    return b"\x00\x00" * (SAMPLE_RATE * ms // 1000)


def ff(*args):
    subprocess.run(["ffmpeg", "-y", "-v", "error", *args], check=True)


def main():
    manifest = json.loads((OUT / "manifest.json").read_text())["chunks"]
    data = bytearray(silence(1000))
    for m in manifest:
        data += (CHUNK_DIR / f'{m["name"]}.pcm').read_bytes()
        data += silence(m["gap_after_ms"])
    data += silence(3000)
    raw = OUT / "master_raw.pcm"
    raw.write_bytes(bytes(data))
    total = pcm_seconds(raw)
    wav = OUT / "verhaal.wav"
    ff("-f", "s16le", "-ar", str(SAMPLE_RATE), "-ac", "1", "-i", str(raw),
       "-af", f"afade=t=out:st={total - 2:.3f}:d=2", "-c:a", "pcm_s16le", str(wav))
    raw.unlink()
    ff("-i", str(wav), "-c:a", "libmp3lame", "-b:a", "192k", str(OUT / "verhaal.mp3"))
    ff("-i", str(wav), "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", str(OUT / "verhaal.m4a"))
    print(f"Klaar: {total:.1f}s")


if __name__ == "__main__":
    main()
