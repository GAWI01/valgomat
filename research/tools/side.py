#!/usr/bin/env python3
# p.py PARTY FROM TO  -> print pages (pdf index, 1-based)
import sys,re
p,a,b=sys.argv[1],int(sys.argv[2]),int(sys.argv[3])
pages=open(f'research/cache/{p}.txt').read().split('\f')
for i in range(a-1,min(b,len(pages))):
    s=re.sub(r'[ \t]+',' ',pages[i]); s=re.sub(r'\n(?!•|[-–] |\d+\.|[a-zæøå]\) )',' ',s); s=re.sub(r'(\w)[-\xad] (?=[a-zæøå])',r'\1',s)
    print(f'===== {p} s.{i+1}\n{s}')
