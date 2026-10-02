"""Slaap-afwerking van een ruwe stem-wav: iets lager (formant behouden), warmer, zachter in de hoge tonen en gelijkmatig.

Gebruik: python finish.py <in.wav> <uit.mp3> [halve_tonen_omlaag]   (standaard 1.5)
Bewust geen tempo-wijziging: dit blijft de normale snelheid van de stem.
"""
import subprocess
import sys

SEMITONES = 1.5


def chain(semitones):
    ratio = 2 ** (-semitones / 12)
    return ",".join([
        "highpass=f=60",
        f"rubberband=pitch={ratio:.4f}:formant=preserved:pitchq=quality",
        "bass=g=3:f=140:w=0.7",          # warmte
        "treble=g=-3:f=5000",           # zachtere s-klanken en lucht
        "lowpass=f=10000",
        "acompressor=threshold=-26dB:ratio=2:attack=20:release=250:makeup=2",
        "loudnorm=I=-23:LRA=7:TP=-2",   # gelijke luidheid om stemmen eerlijk te vergelijken
        "adelay=500:all=1",
        "apad=pad_dur=1",
        "aresample=48000",
    ])


def finish(src, dst, semitones=SEMITONES):
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-af", chain(semitones),
                    "-ac", "1", "-c:a", "libmp3lame", "-b:a", "192k", str(dst)], check=True)


if __name__ == "__main__":
    finish(sys.argv[1], sys.argv[2], float(sys.argv[3]) if len(sys.argv) > 3 else SEMITONES)
