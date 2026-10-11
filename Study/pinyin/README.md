# 拼音侦探 · 完整六周课程

面向 11 岁、中文听说读流利、在海外长大的孩子。以已有中文声音认识拼音，逐步脱离汉字提示，再用真实电脑输入法表达想法。总纲见 [plan.md](plan.md)。

## 打开应用

Study 根目录双击 `start.command`（macOS）或 `start.bat`（Windows），从首页进入「拼音侦探」：<http://localhost:3456/pinyin>。

```sh
corepack pnpm dev
# Study 集成应用
corepack pnpm --filter @study/pinyin-web dev
# 独立开发 http://localhost:3459/pinyin
```

Node.js / pnpm 工作区、React 19、TypeScript、Vite。课程 Markdown、题库 JSON、中文音频随应用打包，无账号、数据库或运行时外部语音依赖。

## 课程范围

| 阶段    | 课程  | 学会做什么                                   |
| ------- | ----- | -------------------------------------------- |
| 第 1 周 | 01–04 | 声音地图、基本韵母、声调、第一组声母         |
| 第 2 周 | 05–08 | 其余声母、平翘舌、整体认读、字母键入         |
| 第 3 周 | 09–12 | 复韵母、前后鼻韵母、词语解码                 |
| 第 4 周 | 13–16 | 介音组合、省写、ü、y/w、隔音符号、标调与连读 |
| 第 5 周 | 17–20 | 系统 IME、词组、候选字语境、句子与中文标点   |
| 第 6 周 | 21–24 | 原创短文解码、纠错、60–100 字表达、综合使用  |

- 全部 24 课开放，380 道课程题。原有 01–04 课保留；新增 05–24 课每课 4 道旧知识回顾、4 道跟练、8 道独立挑战，至少两道迁移题。
- 每课 Markdown 微课卡片；汉字、拼音可分别隐藏，中文示范音可慢速播放。第 13 课明确补齐 ia/iao/ian/iang/iong/ua/uo/uai/uan/uang/üe/üan，避免只背常用韵母表。
- 七类练习：听音选拼音、拼音找读音、音节拆拼、易混音对比、独立朗读、ASCII 全拼、真实中文 IME 输入。键盘实验室另有 7 道预览题，结果不计课程通关。
- 7 个检查点：入门诊断、每周挑战、第四周认读检查、第五周消息输入、毕业综合测评。音节组逐项记录读对/需练，短文按对应音节数量记录；汉字与音频在尝试朗读后才揭示。
- 毕业分别要求：30 个音节读对至少 26 个；12 个词 ≥85%；40–60 字对应短文 ≥85%；四项真实输入操作全部完成；60–100 字输入准确率 ≥90%，标点正确。任何维度不能由其他项目抵消。完成并全部达标后显示能力图、可下载 SVG 证书。
- 长文本用汉字编辑距离检查替换、遗漏、多字，单独检查标点。原创段落由学生/家长核对内容、错字与标点，App 仅自动检查字数和未转换字母。
- 朗读明确记录学生自评/家长确认，不使用麦克风、自动语音识别或机器语义评分。真实 IME 由操作系统负责；App 检查提交的最终汉字，不能证明完整按键轨迹，独立使用情况需人工确认。
- 错题当天可复习；正确回顾按 1、3、7 天推进，同一天重复作答不加速升级。复习不覆盖独立挑战成绩。
- 独立挑战 ≥85%，且同一知识点没有连续两次错误时标记课程已掌握。课程准备完成与毕业测评达标分别记录。
- 当前环节、微课、题目位置、答案、时间、来源、复习日期、家长备注在浏览器保存，可导出 JSON。沿用 v1 存储格式，保留原四课的进度。重练仅重置当前课/测评的一轮结果，历史回答保留。

## 建议验收

1. 第 05 课：热身 → 微课 → 跟练 → 独立挑战；暂停、刷新、继续。
2. 第 13–16 课：组合地图、ü 省略、`xi'an`、书面标调与自然变调。
3. 第四周认读检查：先只看拼音，核对后逐条记录或填写短文读对数量。
4. 第 17–20 课：在孩子实际使用的电脑上，用系统输入法完成词语、候选字纠错与问句；选词组合期间按 Enter 不提前评分。
5. 第 21、23 课：只看拼音读原创科技故事；输入长段落，并自行写 60–100 字介绍。原创答案须勾选内容核对。
6. 综合挑战：中途暂停并恢复；故意让某一项未达标，确认不能获得证书；各项达标后查看能力图、下载证书。

不同 Windows / macOS 原生候选窗需在实际电脑上验收。长段落支持 Enter 换行，点击「检查答案」或 Ctrl/⌘+Enter 提交。

## 内容维护

```text
curriculum/roadmap.json                 24 课元数据、先修知识、检查点
curriculum/lessons/01-*.md              每个二级标题是一张微课卡片
curriculum/exercises/lesson-01.json     review / guided / challenge 题库
curriculum/exercises/lab.json           键盘预览题
curriculum/assessments/catalog.json     测评元数据与分组门槛
curriculum/assessments/A00.json         测评题库（A00–A06）
curriculum/lexicon/vocabulary.json      汉字、带调拼音、指定键入串、音频 ID
curriculum/lexicon/skills.json          知识点、维度、首次教授课次
curriculum/lexicon/audio-manifest.json  音频文本、来源、语境
curriculum/lexicon/audio-generated.json 音频制作指纹，用于增量生成
apps/web/src/audio/*.wav               228 条本地中文示范音
scripts/extend-curriculum.py           05–24 课、词汇与测评的手工编写内容源
```

题库和 Markdown 通过 Vite glob 自动发现。修改现有 05–24 课题库/词汇时，同步修改 `extend-curriculum.py`；重新运行该脚本会重写这些 JSON（不会重写 01–04 课题库或 Markdown）。脚本中的例词、拼音和按键串均显式编写，未靠随机音节生成课程。

**音频来源**：228 条示范由 macOS `Tingting`（zh-CN）离线合成并转 WAV。合成中文词，不直接合成拉丁拼音字母。多音字按指定词语语境制作；听音题注明关注第几个音节。「发、乐」使用「发出、快乐」；轻声「吗」用「好吗？」。`o` 用「波」的韵母作参照，并说明完整音节含 b。可同名替换为教师录音。

```sh
python3 pinyin/scripts/extend-curriculum.py
python3 pinyin/scripts/generate-audio.py
# 默认仅生成缺失/语音参数变化的音频；--overwrite 强制重做
```

Windows 直接播放打包音频，不需要上述制作工具。

内容参考：[教育部《汉语拼音方案》](https://www.moe.gov.cn/jyb_sjzl/ziliao/A19/195802/t19580201_186000.html)、[汉语拼音教学特色](https://www.moe.gov.cn/s78/A18/A18_ztzl/jnhypyfa/201805/t20180517_336341.html)、[Microsoft 中文 IME](https://learn.microsoft.com/en-us/globalization/input/simplified-chinese-ime)。

## 检查

```sh
corepack pnpm --filter @study/pinyin-web typecheck
corepack pnpm --filter @study/pinyin-web test
corepack pnpm --filter @study/pinyin-web build
corepack pnpm --filter @study/hub build
```

测试覆盖 24 课与音频引用、先教后练、迁移任务、七类题型、精确拼音、ü/v、中文标点、长文本编辑距离、IME 组合提交、答案隐藏、朗读数量边界、毕业独立门槛、证书条件、原创核对、测评暂停恢复、旧进度兼容与间隔复习。

一份进度对应一个浏览器。JSON 导出用于查看与备份，尚无导入、跨设备同步或多人账号。存储异常显示提示，损坏的原始记录不会自动覆盖。
