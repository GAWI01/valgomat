#!/usr/bin/env python3
"""Bruker en endringsliste (research/qa/changes_*.txt) på research/coding/*.txt og skriver en logg (gammel → ny).
Bruk: python3 scripts/qa/apply-changes.py research/qa/changes_2026-10-14.txt > research/qa/changes_log.tsv"""
import sys, glob
changes = []
for ln in open(sys.argv[1], encoding='utf-8'):
    ln = ln.rstrip('\n')
    if not ln or ln.startswith('#'): continue
    q, p, v, c, ref, why, note = (ln.split('|') + [''] * 7)[:7]
    changes.append((q, p, v, c, ref, why, note))
idx = {}
files = {}
for f in sorted(glob.glob('research/coding/*.txt')):
    lines = open(f, encoding='utf-8').read().split('\n')
    files[f] = lines
    for i, l in enumerate(lines):
        if l and not l.startswith('#'):
            parts = l.split('|', 5)
            idx[(parts[0], parts[1])] = (f, i)
print('qid\tparti\tfør\tetter\tmerknad')
for q, p, v, c, ref, why, note in changes:
    if (q, p) not in idx: sys.exit(f'ukjent linje {q}|{p}')
    f, i = idx[(q, p)]
    old = files[f][i].split('|', 5)
    new = list(old)
    if v != '=': new[2] = v
    if c != '=': new[3] = c
    if ref != '=': new[4] = ref
    if why: new[5] = why
    if new[2] == 'U': new[3] = '-'
    files[f][i] = '|'.join(new)
    print(f"{q}\t{p}\t{old[2]} {old[3]} {old[4]}\t{new[2]} {new[3]} {new[4]}\t{note}")
for f, lines in files.items():
    open(f, 'w', encoding='utf-8').write('\n'.join(lines))
