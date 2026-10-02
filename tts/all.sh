#!/usr/bin/env bash
# Hele pijplijn: stemcontrole -> synthese -> assemblage -> verificatie. Vereist SPEECH_KEY en SPEECH_REGION.
set -euo pipefail
cd "$(dirname "$0")"
PY=../.venv/bin/python
$PY voices.py
$PY synth.py
$PY assemble.py
$PY verify.py
