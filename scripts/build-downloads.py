"""Build one deterministic original-image ZIP and publish it in asset-sized chunks."""
import hashlib,json,shutil,tempfile,zipfile
from pathlib import Path
root=Path(__file__).resolve().parent.parent
rows=json.loads((root/'dist/data.json').read_text())
assert len(rows)==60 and len({x['id'] for x in rows})==60
out=root/'dist/downloads';parts_dir=out/'parts';parts_dir.mkdir(parents=True,exist_ok=True)
with tempfile.TemporaryDirectory(prefix='sound-in-sight-') as tmp:
 archive=Path(tmp)/'all-photos.zip'
 with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_STORED) as z:
  for b in rows:
   image=root/'dist/assets'/f"{b['id']}.png"
   info=zipfile.ZipInfo(f"{b['id']}-{b['name']}.png",date_time=(1980,1,1,0,0,0));info.compress_type=zipfile.ZIP_STORED;info.external_attr=0o644<<16
   with image.open('rb') as src,z.open(info,'w') as dest:shutil.copyfileobj(src,dest)
 with zipfile.ZipFile(archive) as z:assert z.testzip() is None and len(z.infolist())==len(rows)
 h=hashlib.file_digest(archive.open('rb'),'sha256').hexdigest();parts=[]
 with archive.open('rb') as f:
  while chunk:=f.read(20*1024*1024):
   name=f'{h[:12]}-{len(parts)+1:03d}.bin';(parts_dir/name).write_bytes(chunk);parts.append({'path':'downloads/parts/'+name,'size':len(chunk)})
 manifest={'formatVersion':1,'count':len(rows),'filename':'sound-in-sight-60-photos.zip','totalBytes':archive.stat().st_size,'sha256':h,'parts':parts}
 (out/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
 keep={Path(x['path']).name for x in parts}
 for old in parts_dir.glob('*.bin'):
  if old.name not in keep:old.unlink()
 print(f"Archive verified: {len(rows)} PNGs, {manifest['totalBytes']/1024/1024:.1f} MB, {len(parts)} chunks; SHA256 {h}")
