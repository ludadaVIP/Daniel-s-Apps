# Vocab Apps 设计文档

这个文档给后续继续扩展单词类 App 使用。当前已经实现的是 `Esp Vocab`，后续 `French Vocab`、`English Vocab`、`German Vocab` 应该复用同一套结构，而不是重新写一套页面。

## 当前结构

核心思想：每个语言 App 只负责自己的配置、颜色、数据目录和后端路由；单词学习页面、分组逻辑、朗读队列、已学会状态都放在 shared 层。

当前 Esp Vocab 规模：

- A1：8 个 group，每组 100 词，共 800 个基础词/短语。
- A2-B2：每个 level 10 个 group，每组 100 词，共 3000 个 DELE A2-B2 备考词/短语。
- C1-C2：暂时保留初始 group，各 22 词，未继续扩展。
- 全库：3844 个 lemma，`vocab-master.csv` 从实际 JSON 重建并保持全局唯一。

前端核心文件：

- `frontend/src/shared/VocabApp.jsx`：通用词汇学习界面。
- `frontend/src/shared/vocabApi.js`：通用 API client factory。
- `frontend/src/apps/esp_vocab/App.jsx`：Esp Vocab 的配置入口。
- `frontend/src/apps/esp_vocab/styles.css`：Esp Vocab 的主题颜色和视觉样式。

后端核心文件：

- `backend/shared/vocab.py`：读取 levels、groups，并按词性分组。
- `backend/apps/esp_vocab/routes.py`：Esp Vocab 的 Flask blueprint 和 Edge TTS。
- `backend/data/EspVocab/`：Esp Vocab 的数据目录。

## 数据目录

Esp Vocab 当前数据目录：

```text
backend/data/EspVocab/
├── levels.json
└── levels/
    ├── a1/
    │   ├── index.json
    │   ├── group-1.json
    │   └── group-2.json
    ├── a2/
    │   ├── index.json
    │   └── group-1.json
    └── ...
```

`levels.json` 是总入口，列出 A1-C2：

```json
{
  "id": "esp-vocab",
  "title": "Esp Vocab",
  "subtitle": "西语词汇 · CEFR A1 → C2 · 100词为一组",
  "description": "Spanish vocabulary organised by CEFR level.",
  "levels": [
    {
      "id": "a1",
      "title": "A1 · Principiante",
      "subtitle": "Survival vocab — greetings, family, basic verbs."
    }
  ]
}
```

每个 level 下面有一个 `index.json`，列出这一层的 group：

```json
{
  "id": "a1",
  "title": "A1 · Principiante",
  "subtitle": "Survival vocab.",
  "focus": "First useful words.",
  "groups": [
    {
      "id": "group-1",
      "title": "Empezar · First survival words",
      "focus": "Greetings, family, common verbs.",
      "count": 100
    }
  ]
}
```

每个 `group-N.json` 存一组单词。建议每组约 100 个词，但不是硬性限制。

```json
{
  "id": "group-1",
  "title": "Empezar · First survival words",
  "focus": "Greetings, family, common verbs, everyday objects.",
  "words": [
    {
      "lemma": "casa",
      "ipa": "ˈka.sa",
      "pos": "noun",
      "gender": "f",
      "translation_en": "house, home",
      "example": "Mi casa está cerca del parque.",
      "example_en": "My house is near the park.",
      "tag": "Home"
    }
  ]
}
```

## 单词字段

推荐字段：

- `lemma`：目标语言单词或短语，必填。
- `ipa`：发音提示，可选。
- `pos`：词性，推荐使用 `noun`、`verb`、`adj`、`adv`、`phrase`、`other`。
- `gender`：名词性别，可选，例如西语/法语里的 `m`、`f`、`mf`。
- `translation_en`：英文释义，必填。
- `example`：目标语言例句，强烈建议填写。
- `example_en`：例句英文翻译，强烈建议填写。
- `tag`：主题标签，例如 `Home`、`Food & drink`、`School`。

后端会在读取时自动补 `id` 和 `number`，所以新数据可以不手写 `id`。如果手写，也要保证唯一。

## 数据硬规则

这些规则是 Esp Vocab 以及后续 French/English/German Vocab 的硬标准。以后新增或精修任何 group，都必须先按这里检查。

1. 这是背单词 App，不是短语堆叠 App。
   数据按 `level` 区分，每个 `level` 下分多个 `group`，每个 `group` 用一个 JSON 文件保存。一个 group 内按词性展示，推荐词性为 `noun`、`verb`、`adj`、`adv`、`phrase`。

2. 每个 group 的 `phrase` 比例必须低于 15%。
   如果一组 100 条，`pos: "phrase"` 最多 14 条，建议 8-12 条。其余词性必须是真正的单个词。

3. 除了 `phrase`，所有 `lemma` 都必须是单个词。
   `noun`、`verb`、`adj`、`adv` 不能写成 `acceso a la educación`、`apoyo para...`、`cambio climático` 这类多词组合。动词搭配可以在例句里体现，例如用例句教 `depender de`、`contar con`、`pensar en`，但如果 `pos` 是 `verb`，`lemma` 仍然写单个动词，如 `depender`。

4. `phrase` 只能放真实有用的表达。
   `phrase` 应该是常用词组、固定搭配、idiomatic expressions、口语/写作中高频表达，例如 `tener en cuenta`、`darse cuenta de que`、`hacer la vista gorda`、`poner en duda`。不要把随机的“动词 + 名词”“名词 + 介词短语”当作 phrase。

5. 每个 lemma 必须全库唯一。
   新增任何词之前，都必须用 `backend/data/EspVocab/vocab-master.csv` 查重。不能重复，不能重复，不能重复。

```bash
grep ',nuevo_lemma$' backend/data/EspVocab/vocab-master.csv
```

如果 grep 有输出，说明已经收录过，不要再加入任何 group。对于带重音、大小写、复数或可能有正则字符的词，还要人工确认 CSV 第三列。

6. 每个词条必须包含四个核心学习信息。
   必须有 `lemma`、`translation_en`、`example`、`example_en`。`translation_en` 是单词翻译，不允许复制西语原词；`example` 必须是真实、自然、能体现这个词用法的西语句子；`example_en` 必须忠实翻译例句。

7. 例句质量比数量更重要。
   例句要适合真实口语、写作、考试表达和听力循环播放。不要使用模板句、假语境、空泛句，例如 `X es importante en este contexto.`、`Tengo una X en casa.`、`Este tema es X.`。每个例句都应该让学习者知道这个词在什么场景下怎么用。

8. 西语搭配和介词要在例句中自然体现。
   很多词的难点不是中文/英文意思，而是后面的介词和搭配。例句要主动覆盖 `depender de`、`contar con`、`insistir en`、`tratar de`、`influir en`、`carecer de` 这类 régimen 或常见搭配。

9. 精修时以 group 为单位。
   不要一次性批量生成很多组然后留下模板垃圾。每次精修一个 group：先查重，再写词条，再运行质量审查，再抽样朗读和人工检查。

## 朗读功能

通用页面支持三层朗读：

- 单词卡片第一个按钮：读 `lemma`。
- 单词卡片第二个按钮：读 `lemma`、英文释义、例句。
- section/group 顶部按钮：按顺序播放当前词性或当前组。

对 Esp Vocab：

- `lemma` 和 `example` 用西语 voice。
- `translation_en` 用英语 voice。
- 音频由 Edge TTS 生成，并缓存到 `backend/data/EspVocab/audio/edge-tts/`。

## 已学会状态

单词卡片右侧第三个按钮是“已学会/恢复”按钮。

- 点击后，单词不会从 JSON 删除。
- 它的 id 会存进浏览器 `localStorage`。
- 卡片会变成淡灰色，并显示 `Aprendida`。
- 以后播放整个 group 或 section 时会跳过它。
- 再次点击可以恢复，它会重新进入朗读队列。
- 单个卡片上的两个朗读按钮仍然可用，方便临时复听。

当前 Esp Vocab 的 localStorage key：

```text
esp-vocab:last
esp-vocab:last:learned
```

这类本地学习状态不要提交到 GitHub；它只存在于当前电脑/浏览器。

## 如何增加更多西语单词

1. 选择 level，例如 `backend/data/EspVocab/levels/a1/`。
2. 新增一个文件，例如 `group-3.json`。
3. 按上面的 group JSON 格式写入 `words`。
4. 在同目录 `index.json` 的 `groups` 数组里增加：

```json
{
  "id": "group-3",
  "title": "Daily routines · Morning and evening",
  "focus": "Useful verbs and phrases for daily routines.",
  "count": 100
}
```

5. 重启或刷新页面即可读取新组。

注意：

- 每加一个新 lemma 前，必须先查 `backend/data/EspVocab/vocab-master.csv`，避免重复做无用功。
- 推荐用精确行尾检查：

```bash
grep ',nuevo_lemma$' backend/data/EspVocab/vocab-master.csv
```

- 如果 grep 有输出，说明这个 lemma 已经收录过，不要再加入任何 group。
- 如果 lemma 里有正则特殊字符，建议额外人工确认，或者用脚本按 CSV 第三列做精确匹配。
- 新词写入 JSON 后，也要把 `level,group,lemma` 追加或重建到 `vocab-master.csv`。
- `count` 要和 `words.length` 尽量一致，左栏显示会用到。
- 每组最好词性均衡，不要 100 个全是名词。
- 每组 `phrase` 必须低于 15%，并优先写真正的常用表达或惯用语，例如 `tener en cuenta`、`darse cuenta de que`、`hacer la vista gorda`，不要把普通“动词 + 名词”排列组合当作 phrase。
- 除了 `phrase`，所有 `lemma` 必须是单个词；西语动词搭配要写在例句里，例如 `depender de`、`contar con`、`pensar en`、`insistir en`、`tratar de`。
- 例句要短、自然、可朗读，避免硬翻译。
- 禁止使用空泛模板例句，例如 `X es una expresión útil para organizar tus ideas.`；例句必须体现具体语境。
- `translation_en` 和 `example_en` 不要写中文，Esp Vocab 当前是西英对照。
- 新增或大批量修改后，运行质量审查：

```bash
node backend/scripts/audit_esp_vocab_quality.js
```

## 如何做其他语言 Vocab App

推荐复制 Esp Vocab 的模式，但复用 shared 文件。

以前端 French Vocab 为例：

1. 新建目录：

```text
frontend/src/apps/french_vocab/
├── App.jsx
├── styles.css
└── services/api.js
```

2. `services/api.js` 只需要：

```js
import { createVocabApi } from "../../../shared/vocabApi";

export const { fetchLevels, fetchLevel, fetchGroup, requestTts } =
  createVocabApi("/api/french-vocab");
```

3. `App.jsx` 复用 `VocabApp`，只改配置：

```js
import "./styles.css";

import { VocabApp } from "../../shared/VocabApp";
import { fetchGroup, fetchLevel, fetchLevels, requestTts } from "./services/api";

const api = { fetchLevels, fetchLevel, fetchGroup, requestTts };

const config = {
  appName: "French Vocab",
  prefix: "frv",
  storageKey: "french-vocab:last",
  brandSubtitle: "Vocabulaire français · A1 → C2",
  heroKicker: "Écoute, répète, retiens",
  targetLang: "fr",
  text: {
    primaryButton: "Reproducir solo en francés",
    allButton: "Reproducir francés + inglés"
  }
};

export default function FrenchVocabApp() {
  return <VocabApp api={api} config={config} />;
}
```

4. 复制一份 `styles.css`，把 `@scope (.esv-shell)` 改成 `@scope (.frv-shell)`，所有 `.esv-` class 改成 `.frv-`，然后换颜色。

5. 在 `frontend/src/App.jsx` 添加 lazy import 和 route。

6. 在 `frontend/src/Hub.jsx` 添加卡片。

后端也按 Esp Vocab 复制：

1. 新建 `backend/apps/french_vocab/routes.py`。
2. `DEFAULT_DATA_DIR` 改为 `backend/data/FrenchVocab`。
3. URL prefix 在 `backend/app.py` 注册为 `/api/french-vocab`。
4. 音频目录注册为 `/audio/french-vocab/<path:filename>`。
5. `LANGUAGE_CONFIG` 里把目标语言改成对应语言：

```python
LANGUAGE_CONFIG = {
    "fr": {
        "language": "fr-FR",
        "voice": default_voice_for_language("fr"),
        "voices": {voice["id"] for voice in voices_for_language("fr")},
    },
    "en": {
        "language": "en-US",
        "voice": default_voice_for_language("en"),
        "voices": {voice["id"] for voice in voices_for_language("en")},
    },
}
```

同时要让 `normalise_tts_language()` 接受 `fr`，并让前端 `targetLang` 使用 `fr`。

## 内容质量建议

一个高质量 vocab group 不只是堆词表，应该做到：

- 按真实生活场景组织，而不是机械按字母排序。
- 每个词都有自然例句。
- 例句适合听力循环播放，长度不要太长。
- 同组里包含名词、动词、形容词、副词、短语。
- A1-A2 注重生活和生存表达。
- B1-B2 注重叙述、观点、学习、工作、旅行、健康、社交。
- C1-C2 注重抽象概念、学术表达、语域差异、精细语义。

避免：

- 重复模板句。
- 生僻但现实中很少用的词塞太多。
- 例句只有 “This is a word.” 这种空句。
- 机器翻译味很重的英文释义。
- 一组里全是同一类词。
- `translation_en` 和 `lemma` 一样，或者只是把西语原词原样复制过去。
- 非 `phrase` 类别里出现多词 lemma。
- 把同一个动词套进一串不同名词，或者把同一个名词套进一串不同动词。

## 精修检查清单

每精修完一个 group，至少做这几步：

1. 确认 `words.length` 和 `index.json` 里的 `count` 一致。
2. 确认 `phrase` 数量低于 group 总数的 15%。
3. 确认 `noun`、`verb`、`adj`、`adv` 的 `lemma` 都是单个词。
4. 对新增 lemma 用 `vocab-master.csv` 查重。
5. 确认每条都有 `lemma`、`translation_en`、`example`、`example_en`。
6. 抽样检查例句：是否真实、可朗读、能体现词义和搭配。
7. 运行审查脚本：

```bash
node backend/scripts/audit_esp_vocab_quality.js
```

## Git 与本地缓存

应该提交到 GitHub：

- JSON 词库。
- 前后端源码。
- 文档。

不应该提交：

- `backend/data/*/audio/`
- `manifest.json`
- 浏览器 localStorage 里的学习记录。
- 任何设备本地生成的 progress/cache。

音频缓存是设备本地资产，换电脑后可以重新生成。
