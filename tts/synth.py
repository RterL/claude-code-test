"""Plant chunks, schrijft SSML per chunk en synthetiseert naar 48 kHz 16-bit mono PCM. Hervat bij ontbrekende chunks."""
import hashlib
import json
import os
import shutil
import time

import azure.cognitiveservices.speech as speechsdk

from common import (CHUNK_DIR, MAX_CHUNK_S, OUT, RATE, SSML_DIR, TARGET_CHUNK_S, VOICE, build_ssml,
                    load_story, pcm_seconds, plan_chunks, ssml_to_text)
from common import need_env

MAX_TRIES = 5


def voice_wpm():
    try:
        v = next(v for v in json.loads((OUT / "voices_nl-NL.json").read_text()) if v["ShortName"] == VOICE)
        return float(v["WordsPerMinute"])
    except (FileNotFoundError, StopIteration, KeyError, ValueError):
        print("WAARSCHUWING: geen WordsPerMinute beschikbaar, aanname 150.")
        return 150.0


def make_synth(key, region):
    endpoint = os.environ.get("ENDPOINT")
    cfg = speechsdk.SpeechConfig(endpoint=endpoint, subscription=key) if endpoint \
        else speechsdk.SpeechConfig(subscription=key, region=region)
    cfg.set_speech_synthesis_output_format(speechsdk.SpeechSynthesisOutputFormat.Raw48Khz16BitMonoPcm)
    return speechsdk.SpeechSynthesizer(speech_config=cfg, audio_config=None)


def synth_one(synth, ssml, label):
    for attempt in range(1, MAX_TRIES + 1):
        result = synth.speak_ssml_async(ssml).get()
        if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted and result.audio_data:
            return result.audio_data
        if result.reason == speechsdk.ResultReason.Canceled:
            d = result.cancellation_details
            print(f"[{label}] Canceled: reason={d.reason} code={d.error_code} details={d.error_details}")
            throttled = "429" in str(d.error_details) or d.error_code == speechsdk.CancellationErrorCode.TooManyRequests
            if throttled and attempt < MAX_TRIES:
                wait = 2 ** attempt * 2
                print(f"[{label}] 429, poging {attempt}/{MAX_TRIES}, wacht {wait}s")
                time.sleep(wait)
                continue
        else:
            print(f"[{label}] Onverwachte reason: {result.reason}")
        raise SystemExit(f"Synthese van {label} mislukt.")
    raise SystemExit(f"Synthese van {label} mislukt na {MAX_TRIES} pogingen.")


def run(target_s):
    _, items = load_story()
    chunks = plan_chunks(items, voice_wpm(), target_s)
    key, region = need_env("SPEECH_KEY", "SPEECH_REGION")
    synth = make_synth(key, region)
    SSML_DIR.mkdir(parents=True, exist_ok=True)
    CHUNK_DIR.mkdir(parents=True, exist_ok=True)
    manifest = []
    for n, chunk in enumerate(chunks, 1):
        ssml = build_ssml(chunk)
        sha = hashlib.sha256(ssml.encode()).hexdigest()
        name = f"chunk_{n:02d}"
        (SSML_DIR / f"{name}.ssml").write_text(ssml, encoding="utf-8")
        pcm, shafile = CHUNK_DIR / f"{name}.pcm", CHUNK_DIR / f"{name}.sha"
        if pcm.exists() and shafile.exists() and shafile.read_text() == sha:
            print(f"{name}: bestaat al, overgeslagen")
        else:
            print(f"{name}: synthese ({len(ssml_to_text(ssml))} tekens, {len(ssml)} SSML-tekens)")
            pcm.write_bytes(synth_one(synth, ssml, name))
            shafile.write_text(sha)
        nxt = chunks[n] if n < len(chunks) else None
        manifest.append({
            "name": name, "paragraphs": len(chunk), "plain_chars": len(ssml_to_text(ssml)),
            "ssml_chars": len(ssml), "seconds": round(pcm_seconds(pcm), 2),
            "gap_after_ms": nxt[0]["pause_before_ms"] if nxt else 0,
            "starts_with": chunk[0]["text"][:60], "ends_with": chunk[-1]["text"][-60:],
        })
    return manifest


def main():
    target = TARGET_CHUNK_S
    for _ in range(3):
        manifest = run(target)
        longest = max(m["seconds"] for m in manifest)
        for m in manifest:
            print(f'{m["name"]}: {m["seconds"]:.1f}s')
        if longest <= MAX_CHUNK_S:
            break
        print(f"Chunk van {longest:.0f}s > {MAX_CHUNK_S:.0f}s, opnieuw splitsen met kleiner doel.")
        shutil.rmtree(CHUNK_DIR)
        target *= 0.6
    else:
        raise SystemExit("Chunks blijven te lang.")
    (OUT / "manifest.json").write_text(json.dumps(
        {"voice": VOICE, "region": os.environ["SPEECH_REGION"], "format": "raw-48khz-16bit-mono-pcm",
         "rate": RATE, "target_chunk_s": target, "chunks": manifest}, indent=1, ensure_ascii=False))


if __name__ == "__main__":
    main()
