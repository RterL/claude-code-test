# NL slaapverhaal-stemmen (gratis, lokaal)

Alle stemmen draaien lokaal met Piper (geen account, geen betaalde dienst). Modellen komen van de sherpa-onnx GitHub-releases.

```bash
cd tts
../.venv/bin/python fetch_voice.py nl_NL-ronnie-medium nl_NL-pim-medium nl_BE-rdh-medium   # modellen -> models/
../.venv/bin/python sample.py nl_NL-ronnie-medium nl_NL-pim-medium nl_BE-rdh-medium        # titel + 5 zinnen + F0-meting
../.venv/bin/python finish.py ../samples/raw/nl_NL-ronnie-medium.wav ../deliver/stem.mp3  # slaap-afwerking
PIPER_VOICE=nl_NL-ronnie-medium ../.venv/bin/python piper_render.py                         # heel verhaal
```

Gemeten (normale snelheid, F0 = mediane toonhoogte): ronnie 120 Hz, pim 125 Hz, rdh (Vlaams) 110 Hz, miro 106 Hz (snel, 209 w/min),
dii 212 Hz (vrouw). Natuurlijkheid van intonatie is een luisteroordeel en niet gemeten.

Licenties: controleer per stem de `*.MODEL_CARD`/`README.md` naast het model; Miro en Dii zijn niet-commercieel.
