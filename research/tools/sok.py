#!/usr/bin/env python3
# usage: g.py REGEX [parties] [ctx]  -> prints party, page, paragraph-ish context
import sys,re
pat=re.compile(sys.argv[1],re.I)
parties=sys.argv[2].split(',') if len(sys.argv)>2 and sys.argv[2] else 'Ap H FrP Sp SV R V KrF MDG'.split()
ctx=int(sys.argv[3]) if len(sys.argv)>3 else 220
for p in parties:
    t=open(f'research/cache/{p}.txt').read()
    pages=t.split('\f'); n=0
    for i,pg in enumerate(pages):
        s=re.sub(r'\s+',' ',pg); s=re.sub(r'(\w)[-\xad] (?=[a-zæøå])',r'\1',s)
        for m in pat.finditer(s):
            n+=1
            if n>12: break
            a=max(0,m.start()-ctx); b=min(len(s),m.end()+ctx)
            print(f'[{p} s.{i+1}] …{s[a:b]}…')
    if n==0: print(f'[{p}] -- ingen treff')
    print()
