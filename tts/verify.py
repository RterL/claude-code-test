"""Tekstintegriteit (PASS/FAIL), tekenaantallen, eigenschappen van de uitvoerbestanden en build-log."""
import json
import subprocess

from common import OUT, SSML_DIR, STORY, normalize, ssml_to_text


def probe(path):
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries",
         "stream=codec_name,sample_rate,channels,bit_rate:format=duration,bit_rate", "-of", "json", str(path)],
        capture_output=True, text=True, check=True).stdout
    j = json.loads(out)
    s = j["streams"][0]
    return {"codec": s["codec_name"], "sample_rate": int(s["sample_rate"]), "channels": s["channels"],
            "bit_rate": int(s.get("bit_rate") or j["format"].get("bit_rate") or 0),
            "duration_s": round(float(j["format"]["duration"]), 2)}


def main():
    manifest = json.loads((OUT / "manifest.json").read_text())
    ssmls = sorted(SSML_DIR.glob("chunk_*.ssml"))
    assert len(ssmls) == len(manifest["chunks"]), "aantal SSML-bestanden komt niet overeen met manifest"
    joined = normalize(" ".join(ssml_to_text(p.read_text(encoding="utf-8")) for p in ssmls))
    expected = normalize(STORY.read_text(encoding="utf-8"))
    ok = joined == expected
    print(f"Tekstintegriteit: {'PASS' if ok else 'FAIL'}")
    if not ok:
        i = next((i for i, (a, b) in enumerate(zip(joined, expected)) if a != b), min(len(joined), len(expected)))
        print("Eerste verschil bij teken", i, repr(joined[i - 30:i + 30]), "<>", repr(expected[i - 30:i + 30]))
    files = {n: probe(OUT / n) for n in ("verhaal.wav", "verhaal.mp3", "verhaal.m4a")}
    for n, p in files.items():
        print(n, p)
    for m in manifest["chunks"]:
        print(f'{m["name"]}: {m["seconds"]:.0f}s, {m["plain_chars"]} tekens ({m["ssml_chars"]} incl. SSML); '
              f'eindigt: ...{m["ends_with"]}')
    plain = sum(m["plain_chars"] for m in manifest["chunks"])
    print(f"Totaal verhaal: {plain} tekens ({sum(m['ssml_chars'] for m in manifest['chunks'])} incl. SSML)")
    manifest.update({"text_integrity": "PASS" if ok else "FAIL", "files": files, "story_plain_chars": plain,
                     "sample_chars": 0})
    (OUT / "build-log.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False))
    raise SystemExit(0 if ok else 1)


if __name__ == "__main__":
    main()
