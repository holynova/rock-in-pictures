from pathlib import Path
import subprocess
base=Path(__file__).parent/'dist/assets'
for p in sorted(base.glob('*.png')):
 for suffix,width,q in [('.webp','640','84'),('-full.webp','1024','91')]:
  dest=p.with_name(p.stem+suffix)
  if not dest.exists():subprocess.run(['cwebp','-quiet','-q',q,'-resize',width,'0',str(p),'-o',str(dest)],check=True)
print('Optimized',len(list(base.glob('*.png'))),'photos')
