import json
from pathlib import Path
p=Path('backend/data/ABookADay/yueqian-gudian/book.json')
data=json.loads(p.read_text(encoding='utf-8'))
n=data['sections']['narration']
n=n.replace('个人努力如果进入正确系统，\n才可能发生跃迁。', '个人努力如果进入正确系统，\n才可能发生跃迁。\n这就是全书最核心的成长判断。')
data['sections']['narration']=n
p.write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n', encoding='utf-8')
