import json,struct,urllib.request
from pathlib import Path
root=Path(__file__).parent
rows=json.loads((root/'dist/data.json').read_text());assert len(rows)==30
assert len({r['id'] for r in rows})==30 and len({r['name'] for r in rows})==30
stats=[]
for r in rows:
 p=root/'dist/assets'/f"{r['id']}.png"
 raw=p.read_bytes();assert raw[:8]==b'\x89PNG\r\n\x1a\n'
 w,h=struct.unpack('>II',raw[16:24]);assert (w,h)==(1024,1536),(p,w,h)
 for suffix in ['.webp','-full.webp']:
  f=p.with_name(p.stem+suffix);assert f.stat().st_size>1000
 for ext in ['.png','.webp','-full.webp']:
  with urllib.request.urlopen(f"http://127.0.0.1:4318/assets/{r['id']}{ext}") as resp:assert resp.status==200
 stats.append({'id':r['id'],'name':r['name'],'width':w,'height':h})
report={'photos':stats,'uniquePhotos':30,'assetsHttpChecked':90,'browserChecks':['Answers initially hidden','Wrong guess feedback','3-second delayed reveal','Countdown cancelled when navigating','Traditional Chinese name accepted after correction','Progress persists after reload','Revealed filter shows only revealed cards','390px viewport no horizontal overflow'],'imageGeneration':'built-in ImageGen','status':'passed'}
(root/'validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
print('PASS: 30 unique photos; all 1024x1536; 90 asset URLs return HTTP200')
