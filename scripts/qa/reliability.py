#!/usr/bin/env python3
"""Interkoder-reliabilitet: sammenligner en blind andregangskoding med valgomatens koding.

  python3 scripts/qa/reliability.py <nøkkel.json> <blindkoding.txt> > research/qa/reliabilitet.md

nøkkel.json: {"B001": [qid, parti, gruppe], ...}
blindkoding.txt: id|verdi(-3..3|U)|conf|sider|begrunnelse
Måler (for alle og per gruppe): andel eksakt lik verdi, andel innen ±1, samme fortegn, enighet om
kjent/ukjent, og Cohens vektede kappa (kvadratiske vekter) på parene der begge har kodet.
"""
import json, sys, collections

key = json.load(open(sys.argv[1]))
blind = {}
for ln in open(sys.argv[2], encoding='utf-8'):
    ln = ln.strip()
    if not ln or ln.startswith('#'):
        continue
    parts = ln.split('|', 4)
    blind[parts[0]] = (parts[1].strip(), parts[2].strip(), parts[4] if len(parts) > 4 else '')
data = json.load(open('src/data/data.json'))
pos = {(p['question'], p['party']): p for p in data['positions']}


def val(v):
    return None if v in ('U', 'null', None) else int(v)


def wkappa(pairs):
    cats = list(range(-3, 4))
    n = len(pairs)
    if n < 2:
        return float('nan')
    obs = collections.Counter(pairs)
    ra = collections.Counter(a for a, _ in pairs)
    rb = collections.Counter(b for _, b in pairs)
    w = lambda i, j: (i - j) ** 2 / 36
    po = sum(w(i, j) * obs[(i, j)] for i in cats for j in cats) / n
    pe = sum(w(i, j) * ra[i] * rb[j] for i in cats for j in cats) / n / n
    return 1 - po / pe if pe else float('nan')


rows = []
for bid, (qid, party, grp) in key.items():
    ours = pos[(qid, party)]
    b = blind.get(bid)
    if b is None:
        continue
    rows.append(dict(id=bid, qid=qid, party=party, grp=grp, ours=ours['position'], oc=ours['confidence'], theirs=val(b[0]), tc=b[1], why=b[2]))


def stats(rs):
    both = [r for r in rs if r['ours'] is not None and r['theirs'] is not None]
    known_agree = sum((r['ours'] is None) == (r['theirs'] is None) for r in rs)
    s = dict(n=len(rs), both=len(both), known_agree=known_agree / len(rs) if rs else 0)
    if both:
        s['exact'] = sum(r['ours'] == r['theirs'] for r in both) / len(both)
        s['within1'] = sum(abs(r['ours'] - r['theirs']) <= 1 for r in both) / len(both)
        s['sign'] = sum((r['ours'] > 0) == (r['theirs'] > 0) and (r['ours'] < 0) == (r['theirs'] < 0) for r in both) / len(both)
        s['kappa'] = wkappa([(r['ours'], r['theirs']) for r in both])
    return s


pct = lambda x: f"{x * 100:.0f} %"
out = ['# Interkoder-reliabilitet (blind andregangskoding)', '',
       'En uavhengig koder fikk bare påstanden og partiprogrammene, ikke valgomatens koding, og kodet et utvalg på nytt etter samme kodebok. Utvalget består av alle kodinger med lav sikkerhet som bygger på programmet, alle omstridte kodinger, 60 tilfeldige av de øvrige og 20 tilfeldige ukjente.', '',
       '| Gruppe | Antall | Begge kodet | Enige om kjent/ukjent | Eksakt lik verdi | Innen ±1 | Samme retning | Vektet kappa |', '|---|---:|---:|---:|---:|---:|---:|---:|']
groups = ['TILFELDIG', 'LOW', 'OMSTRIDT', 'UKJENT']
for g in groups + ['ALLE']:
    rs = rows if g == 'ALLE' else [r for r in rows if r['grp'] == g]
    s = stats(rs)
    f = lambda k: pct(s[k]) if k in s else '–'
    kap = f"{s['kappa']:.2f}" if 'kappa' in s and s['kappa'] == s['kappa'] else '–'
    out.append(f"| {g.capitalize()} | {s['n']} | {s['both']} | {pct(s['known_agree'])} | {f('exact')} | {f('within1')} | {f('sign')} | {kap} |")
out += ['', 'Kappa tolkes vanligvis slik: over 0,8 er svært godt samsvar, 0,6–0,8 er godt, og 0,4–0,6 er moderat.', '',
        '## Uenigheter som må avgjøres', '',
        'Med uenighet menes enten at den ene koderen har kodet og den andre har satt «ukjent», at fortegnet er ulikt, eller at verdiene skiller seg med mer enn ett steg.', '',
        '| id | Spørsmål | Parti | Gruppe | Valgomaten | Blindkoder | Blindkoderens begrunnelse |', '|---|---|---|---|---|---|---|']
for r in sorted(rows, key=lambda r: (r['grp'], r['qid'])):
    o, t = r['ours'], r['theirs']
    disagree = (o is None) != (t is None) or (o is not None and (abs(o - t) >= 2 or (o > 0) != (t > 0) and o != 0 and t != 0))
    if disagree:
        fmt = lambda v, c: 'U' if v is None else f"{v:+d} {c}"
        out.append(f"| {r['id']} | `{r['qid']}` | {r['party']} | {r['grp']} | {fmt(o, r['oc'])} | {fmt(t, r['tc'])} | {r['why'].replace('|', '/')[:220]} |")
print('\n'.join(out))
