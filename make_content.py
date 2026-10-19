"""Export public band metadata from the authoritative creative content file."""
import json
from pathlib import Path
root=Path(__file__).parent
data=json.loads((root/'content.json').read_text())
assert len({b['id'] for b in data})==len(data)
(root/'dist/data.json').write_text(json.dumps([{k:v for k,v in b.items() if k!='scene'} for b in data],ensure_ascii=False))
print('Exported',len(data),'bands')
