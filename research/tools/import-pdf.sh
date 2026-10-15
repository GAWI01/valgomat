#!/usr/bin/env bash
# Tar inn et dokument som er lastet ned manuelt (f.eks. fra regjeringen.no, som stenger ute automatiske
# nedlastinger med en Cloudflare-sjekk) og gjør det søkbart med research/tools/sok.py.
#
#   research/tools/import-pdf.sh ~/Downloads/prop-1-ls-2026-2027.pdf prop1ls_2027 "https://www.regjeringen.no/no/dokumenter/prop.-1-ls-20262027/id…/"
#
# Lager research/cache/<navn>.pdf og .txt (sider skilt med \f) og skriver en ferdig oppføring til
# research/sources.json på skjermen (lim den inn, og bruk så «src:<navn>@side» i kodefilene).
set -euo pipefail
cd "$(dirname "$0")/../.."
[ $# -ge 2 ] || { echo "Bruk: $0 <fil.pdf> <navn> [url]"; exit 1; }
src="$1"; name="$2"; url="${3:-}"
file "$src" | grep -q PDF || { echo "✗ $src er ikke en PDF (lastet du ned en «Vent litt»-side?)"; exit 1; }
mkdir -p research/cache
cp "$src" "research/cache/$name.pdf"
pdftotext "research/cache/$name.pdf" "research/cache/$name.txt" 2>/dev/null
sha=$(sha256sum "research/cache/$name.pdf" | cut -d' ' -f1)
pages=$(pdfinfo "research/cache/$name.pdf" 2>/dev/null | awk '/^Pages:/{print $2}')
title=$(pdfinfo "research/cache/$name.pdf" 2>/dev/null | sed -n 's/^Title: *//p')
echo "✓ research/cache/$name.txt ($pages sider). Søk: python3 research/tools/sok.py 'eiendomsskatt' $name"
cat <<JSON
Oppføring til research/sources.json:
  {
    "id": "$name",
    "party": "Ap",
    "type": "regjeringsdokument",
    "title": "${title:-<tittel>}",
    "url": "${url:-<lenke på regjeringen.no>}",
    "adopted": "<dato lagt fram>",
    "accessed": "$(date +%F)",
    "pages": $pages,
    "sha256": "$sha",
    "note": "Lastet ned manuelt i nettleser og importert med research/tools/import-pdf.sh. Regjeringens forslag gir høyst MEDIUM confidence for Ap."
  }
JSON
