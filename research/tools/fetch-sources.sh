#!/usr/bin/env bash
# Laster ned partiprogrammene i research/sources.json til research/cache/ og trekker ut tekst per side.
# Krever curl, pdftotext (poppler-utils) og python3. Sjekk SHA-256 mot sources.json etter nedlasting:
# avvik betyr at partiet har publisert en ny versjon og at sidehenvisningene må kontrolleres.
set -euo pipefail
cd "$(dirname "$0")/../.."
mkdir -p research/cache
UA="Mozilla/5.0 (X11; Linux x86_64) Valgomat2027-research"
python3 - <<'PY' | while IFS='|' read -r party url mirror sha; do
import json
m={'Ap':'Ap','H':'H','FrP':'FrP','Sp':'Sp','SV':'SV','R':'R','V':'V','KrF':'KrF','MDG':'MDG'}
for s in json.load(open('research/sources.json')):
    if s['type']=='partiprogram':
        print(f"{s['party']}|{s['url']}|{s.get('mirror','')}|{s.get('sha256','')}")
PY
  out="research/cache/$party.pdf"
  curl -sSL -A "$UA" --max-time 180 -o "$out" "$url" || true
  if ! file "$out" | grep -q PDF && [ -n "$mirror" ]; then curl -sSL -A "$UA" --max-time 180 -o "$out" "$mirror"; fi
  got=$(sha256sum "$out" | cut -d' ' -f1)
  [ "$got" = "$sha" ] && echo "✓ $party uendret" || echo "! $party har ENDRET seg ($got) – kontroller sidehenvisningene"
  pdftotext "$out" "research/cache/$party.txt"
done
echo "Søk: python3 research/tools/sok.py 'formuesskatt|arveavgift'   ·   Les side: python3 research/tools/side.py H 31 32"
