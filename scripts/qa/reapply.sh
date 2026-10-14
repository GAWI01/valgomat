#!/bin/sh
# Bygger research/coding på nytt fra versjonen før red-team-gjennomgangen (8196979) + endringslisten.
set -e
git checkout 8196979 -- research/coding
python3 scripts/qa/apply-changes.py research/qa/changes_2026-10-14.txt > research/qa/changes_log.tsv
sed -i 's/«Barnetrygden bør økes og gjøres skattepliktig, slik at familier med lave inntekter får mest igjen.»/«Barnetrygden bør gjøres skattepliktig og samtidig økes, slik at familier med lave inntekter får mest igjen.»/' research/coding/11_familie_verdier.txt
sed -i '1s/.*/# --- work_sickpay: «Sykelønnen bør reduseres noe ved lange sykemeldinger, for eksempel fra 100 til 80 prosent etter seks måneder.»/' research/coding/02_arbeid.txt
node scripts/build-data.mjs
