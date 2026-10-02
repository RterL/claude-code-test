"""Toont de nl-NL stemmen en controleert of VOICE bestaat, Male en gratis (Neural) is."""
import json
import os
import urllib.request

from common import LOCALE, OUT, VOICE, need_env


def fetch_voices():
    key, region = need_env("SPEECH_KEY", "SPEECH_REGION")
    url = f"https://{region}.tts.speech.microsoft.com/cognitiveservices/voices/list"
    req = urllib.request.Request(url, headers={"Ocp-Apim-Subscription-Key": key})
    with urllib.request.urlopen(req, timeout=30) as r:
        return [v for v in json.load(r) if v.get("Locale") == LOCALE]


def main():
    voices = fetch_voices()
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "voices_nl-NL.json").write_text(json.dumps(voices, indent=1, ensure_ascii=False))
    cols = ["ShortName", "Gender", "VoiceType", "Status", "SampleRateHertz", "WordsPerMinute", "StyleList"]
    print(" | ".join(cols))
    for v in voices:
        print(" | ".join(str(v.get(c, "")) for c in cols))
    match = next((v for v in voices if v["ShortName"] == VOICE), None)
    if not match:
        raise SystemExit(f"Stem {VOICE} niet gevonden in deze regio. Kies uit de lijst hierboven.")
    if match.get("Gender") != "Male":
        print(f"LET OP: {VOICE} is niet Male ({match.get('Gender')}).")
    if match.get("VoiceType") != "Neural" and os.environ.get("ALLOW_PAID") != "1":
        raise SystemExit(f"{VOICE} is VoiceType={match.get('VoiceType')}, niet standaard Neural. "
                         "Eerst kosten checken en bevestigen (ALLOW_PAID=1).")
    print(f"\nGekozen stem: {VOICE} (WordsPerMinute={match.get('WordsPerMinute')})")


if __name__ == "__main__":
    main()
