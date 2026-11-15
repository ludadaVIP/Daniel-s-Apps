import type { Lesson } from '../schema';

export const molecularEnergyLessons: Lesson[] = [
  {
    id: 'L121',
    title: {
      zh: 'DNA复制',
      en: 'DNA Replication',
    },
    hook: {
      zh: '一条链必须向左、一条向右延伸，为什么两条新链仍都叫5′→3′？',
      en: 'One strand grows left and the other right. How can both new strands grow 5′→3′?',
    },
    minutes: 38,
    icon: '⌬',
    objectives: [
      {
        zh: '用半保留模型追踪旧链与新链。',
        en: 'Track old and new strands through semiconservative replication.',
      },
      {
        zh: '以复制叉为参照解释领导链与后随链。',
        en: 'Explain leading and lagging synthesis relative to a replication fork.',
      },
      {
        zh: '用轮数账本检验分子数与原始旧链数。',
        en: 'Test duplex and original-strand counts using a replication ledger.',
      },
    ],
    prediction: [
      {
        zh: '两条新链都5′→3′合成，但相对复制叉方向不同。',
        en: 'Both new strands grow 5′→3′ but differ relative to the fork.',
      },
      {
        zh: '后随链的聚合酶改为3′→5′合成。',
        en: 'Lagging-strand polymerase synthesizes 3′→5′.',
      },
      {
        zh: '每轮复制把原始旧链数翻倍。',
        en: 'Each round doubles the number of original strands.',
      },
    ],
    terms: [
      {
        word: {
          zh: '半保留复制',
          en: 'semiconservative replication',
        },
        meaning: {
          zh: '每个子代双链含一条亲代链和一条新链。',
          en: 'Each daughter duplex contains one parental and one new strand.',
        },
      },
      {
        word: {
          zh: '模板链',
          en: 'template strand',
        },
        meaning: {
          zh: '为互补新链提供碱基顺序的旧链。',
          en: 'An existing strand specifying a complementary new sequence.',
        },
      },
      {
        word: {
          zh: '反平行',
          en: 'antiparallel',
        },
        meaning: {
          zh: '配对两链的5′到3′方向相反。',
          en: 'Paired strands run in opposite 5′ to 3′ directions.',
        },
      },
      {
        word: {
          zh: '复制叉',
          en: 'replication fork',
        },
        meaning: {
          zh: '双链局部解开并合成新链的分叉区域。',
          en: 'A branching region where DNA unwinds and new strands are made.',
        },
      },
      {
        word: {
          zh: '领导链',
          en: 'leading strand',
        },
        meaning: {
          zh: '在给定复制叉持续向叉方向合成的新链。',
          en: 'The new strand synthesized continuously toward a given fork.',
        },
      },
      {
        word: {
          zh: '后随链',
          en: 'lagging strand',
        },
        meaning: {
          zh: '在给定复制叉以短片段远离叉合成的新链。',
          en: 'The new strand synthesized in fragments away from a given fork.',
        },
      },
      {
        word: {
          zh: 'DNA聚合酶',
          en: 'DNA polymerase',
        },
        meaning: {
          zh: '向已有链的3′端添加脱氧核苷酸的酶。',
          en: 'An enzyme adding deoxyribonucleotides to an existing 3′ end.',
        },
      },
      {
        word: {
          zh: '连接酶',
          en: 'ligase',
        },
        meaning: {
          zh: '连接DNA骨架缺口的酶。',
          en: 'An enzyme sealing gaps in the DNA backbone.',
        },
      },
    ],
    questions: [
      {
        id: 'L121-q1',
        skill: 'concept',
        prompt: {
          zh: '半保留复制完成一次后，每个双链是什么组合？',
          en: 'After one semiconservative round, what does each duplex contain?',
        },
        options: [
          {
            zh: '两条旧链',
            en: 'Two old strands',
          },
          {
            zh: '一旧一新',
            en: 'One old and one new',
          },
          {
            zh: '两条新链',
            en: 'Two new strands',
          },
        ],
        correct: 1,
        feedback: {
          zh: '每条旧链分别作模板；“两旧留一起”是保留复制模型，不符合本模型。',
          en: 'Each old strand templates a new partner; keeping both old strands together is the conservative alternative.',
        },
        revisit: {
          zh: '回到D01蓝旧链与金新链的配对及完整记录末句。',
          en: 'Return to D01 old/new strand pairing and the final static record.',
        },
      },
      {
        id: 'L121-q2',
        skill: 'concept',
        prompt: {
          zh: '后随链片段怎样延伸？',
          en: 'How does a lagging fragment extend?',
        },
        options: [
          {
            zh: '3′→5′，因为它向左',
            en: '3′→5′ because it moves left',
          },
          {
            zh: '5′→3′，以其自身端点判定',
            en: '5′→3′ according to its own ends',
          },
          {
            zh: '没有方向',
            en: 'Without direction',
          },
        ],
        correct: 1,
        feedback: {
          zh: '纸面左右不是分子方向；聚合酶仍向3′端添加，沿模板3′→5′读取。',
          en: 'Page direction is not molecular direction; polymerase adds to the 3′ end while reading template 3′→5′.',
        },
        revisit: {
          zh: '看I01帧3–4下方片段两端5′/3′。',
          en: 'Inspect I01 frames 3–4 and the lower fragment ends.',
        },
      },
      {
        id: 'L121-q3',
        skill: 'reasoning',
        prompt: {
          zh: '最初1个双链含2条标记旧链；完整复制3轮且无降解，原始旧链／双链分子各多少？',
          en: 'One duplex starts with two labelled original strands. After three complete rounds without loss, how many original strands/duplexes remain?',
        },
        options: [
          {
            zh: '8／8',
            en: '8 / 8',
          },
          {
            zh: '2／8',
            en: '2 / 8',
          },
          {
            zh: '2／3',
            en: '2 / 3',
          },
        ],
        correct: 1,
        feedback: {
          zh: '双链数1×2³=8，原始物质仍只有2条；增加的是新合成链，不是标记旧链。',
          en: 'Duplexes double to 1×2³=8; only two original strands exist. New synthesis does not multiply original labelled matter.',
        },
        revisit: {
          zh: '把I01轮数调到3，检查独立于动画的链数账本。',
          en: 'Set I01 rounds to 3 and inspect the separate strand ledger.',
        },
      },
      {
        id: 'L121-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'replication fork在本课指？',
          en: 'What does replication fork mean?',
        },
        options: [
          {
            zh: '两条新链拼成蛋白质处',
            en: 'Where new strands form protein',
          },
          {
            zh: 'DNA局部解开与合成的分叉区',
            en: 'A DNA unwinding and synthesis branch',
          },
          {
            zh: '细胞分裂出的两个细胞',
            en: 'Two daughter cells',
          },
        ],
        correct: 1,
        feedback: {
          zh: '复制叉是DNA上的动态结构，不是细胞分裂本身，更不是翻译地点。',
          en: 'A replication fork is a dynamic DNA structure, not cell division or a translation site.',
        },
        revisit: {
          zh: '看D01右侧分叉点。',
          en: 'Look at the branch on the right of D01.',
        },
      },
    ],
    mission: {
      zh: '画一个向左移动的复制叉，标四端及两种新链方向；用三轮账本说明半保留。',
      en: 'Draw a left-moving fork with strand ends and both synthesis directions; explain semiconservation using a three-round ledger.',
    },
    reference: {
      title: 'OpenStax Biology 2e · DNA replication',
      url: 'https://openstax.org/books/biology-2e/pages/14-4-dna-replication-in-prokaryotes',
    },
  },
  {
    id: 'L122',
    title: {
      zh: '转录：DNA到RNA',
      en: 'Transcription: DNA to RNA',
    },
    hook: {
      zh: '两条DNA链都在眼前，为什么不能任选一条按同方向抄成RNA？',
      en: 'Both DNA strands are present. Why can you not copy either one in the same direction?',
    },
    minutes: 38,
    icon: '⌬',
    objectives: [
      {
        zh: '按端点区分模板链和编码链。',
        en: 'Distinguish template and coding strands using end labels.',
      },
      {
        zh: '依据互补规则写出5′→3′RNA。',
        en: 'Write a 5′→3′ RNA sequence using complementarity.',
      },
      {
        zh: '在真核情景连接转录、加工和输出。',
        en: 'Connect transcription, processing and export in a eukaryotic example.',
      },
    ],
    prediction: [
      {
        zh: 'RNA与编码链同向近似相同，但以U替代T。',
        en: 'RNA resembles the same-direction coding strand with U replacing T.',
      },
      {
        zh: 'RNA与模板链字母完全相同且同向。',
        en: 'RNA has the same letters and direction as the template.',
      },
      {
        zh: 'DNA用完后变成RNA并离开核。',
        en: 'DNA is consumed, becomes RNA and leaves the nucleus.',
      },
    ],
    terms: [
      {
        word: {
          zh: '转录',
          en: 'transcription',
        },
        meaning: {
          zh: '以DNA模板合成RNA的过程。',
          en: 'RNA synthesis using a DNA template.',
        },
      },
      {
        word: {
          zh: '编码链',
          en: 'coding strand',
        },
        meaning: {
          zh: '与RNA同向序列对应、但T代U的DNA链。',
          en: 'DNA strand matching RNA in the same direction except T replaces U.',
        },
      },
      {
        word: {
          zh: '模板链',
          en: 'template strand',
        },
        meaning: {
          zh: '被RNA聚合酶沿3′→5′读取的DNA链。',
          en: 'DNA strand read 3′→5′ by RNA polymerase.',
        },
      },
      {
        word: {
          zh: 'RNA聚合酶',
          en: 'RNA polymerase',
        },
        meaning: {
          zh: '按模板合成5′→3′RNA的酶。',
          en: 'An enzyme synthesizing RNA 5′→3′ from a template.',
        },
      },
      {
        word: {
          zh: '尿嘧啶',
          en: 'uracil',
        },
        meaning: {
          zh: 'RNA中与A配对、用U表示的碱基。',
          en: 'The RNA base U that pairs with A.',
        },
      },
      {
        word: {
          zh: '启动子',
          en: 'promoter',
        },
        meaning: {
          zh: '帮助定位与启动转录的DNA区域。',
          en: 'A DNA region helping position and initiate transcription.',
        },
      },
      {
        word: {
          zh: 'RNA加工',
          en: 'RNA processing',
        },
        meaning: {
          zh: '使初始转录物形成适当功能产物的修改。',
          en: 'Modifications producing an appropriate functional RNA product.',
        },
      },
      {
        word: {
          zh: '核输出',
          en: 'nuclear export',
        },
        meaning: {
          zh: 'RNA等通过核孔离开细胞核的过程。',
          en: 'Movement of RNA and other cargo out through nuclear pores.',
        },
      },
    ],
    questions: [
      {
        id: 'L122-q1',
        skill: 'concept',
        prompt: {
          zh: '本例模板3′-TAC-5′生成的RNA是？',
          en: 'What RNA is made from template 3′-TAC-5′?',
        },
        options: [
          {
            zh: '5′-AUG-3′',
            en: '5′-AUG-3′',
          },
          {
            zh: '5′-TAC-3′',
            en: '5′-TAC-3′',
          },
          {
            zh: '3′-AUG-5′',
            en: '3′-AUG-5′',
          },
        ],
        correct: 0,
        feedback: {
          zh: '反平行互补得到5′-AUG-3′。直接抄模板忽略互补；倒写端点则忽略方向。',
          en: 'Antiparallel pairing gives 5′-AUG-3′. Copying template letters ignores complementarity; reversed labels ignore direction.',
        },
        revisit: {
          zh: '回I01首个RNA三联体与模板两端。',
          en: 'Return to the first I01 RNA triplet and template ends.',
        },
      },
      {
        id: 'L122-q2',
        skill: 'concept',
        prompt: {
          zh: '本课典型真核蛋白编码基因的后续步骤是？',
          en: 'What follows transcription for this typical eukaryotic protein-coding gene?',
        },
        options: [
          {
            zh: 'DNA离核变蛋白',
            en: 'DNA leaves the nucleus and becomes protein',
          },
          {
            zh: 'RNA加工后可输出供翻译',
            en: 'RNA can be processed and exported for translation',
          },
          {
            zh: '所有RNA必须成为蛋白',
            en: 'All RNA must become protein',
          },
        ],
        correct: 1,
        feedback: {
          zh: '加工和核输出连接核内转录与核外翻译；功能RNA可不翻译，DNA仍保留。',
          en: 'Processing/export link nuclear transcription to translation; functional RNAs need not be translated and DNA remains.',
        },
        revisit: {
          zh: '看D01核边界和下方后续路线。',
          en: 'Inspect the D01 nuclear boundary and later route.',
        },
      },
      {
        id: 'L122-q3',
        skill: 'reasoning',
        prompt: {
          zh: '编码链5′-ATGGCT-3′的第二密码子由GCT改为GCC。RNA第二三联体怎样改变？',
          en: 'Coding DNA second triplet changes GCT→GCC in a 5′-ATG…-3′ segment. How does the second RNA triplet change?',
        },
        options: [
          {
            zh: 'CGA→CGG',
            en: 'CGA→CGG',
          },
          {
            zh: 'GCU→GCC',
            en: 'GCU→GCC',
          },
          {
            zh: 'GCT→GCC，RNA仍用T',
            en: 'GCT→GCC, retaining T in RNA',
          },
        ],
        correct: 1,
        feedback: {
          zh: '同向RNA对应编码链并以U代T；CGA/CGG是模板对应片段，不能混用链角色。',
          en: 'Same-direction RNA matches coding DNA with U for T; CGA/CGG are template segments, a different strand role.',
        },
        revisit: {
          zh: '切换I01 GCU/GCC，对照三行而非只看一行。',
          en: 'Toggle I01 GCU/GCC and compare all three rows.',
        },
      },
      {
        id: 'L122-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'promoter是什么？',
          en: 'What is a promoter?',
        },
        options: [
          {
            zh: '帮助启动转录的DNA区域',
            en: 'A DNA region helping initiate transcription',
          },
          {
            zh: '携带氨基酸的tRNA',
            en: 'An amino-acid-carrying tRNA',
          },
          {
            zh: '终止密码子',
            en: 'A stop codon',
          },
        ],
        correct: 0,
        feedback: {
          zh: '启动子帮助聚合酶定位，不是氨基酸运输分子，也不是翻译终止信号。',
          en: 'A promoter positions transcription machinery; it is neither an amino acid carrier nor a translation stop.',
        },
        revisit: {
          zh: '回完整记录的DNA模板和Explain启动定位段。',
          en: 'Revisit the DNA template record and the Explain initiation discussion.',
        },
      },
    ],
    mission: {
      zh: '给虚构短序列画三行带端点的转录证据卡，补上真核RNA加工与输出。',
      en: 'Make a three-row transcription evidence card with strand ends, plus eukaryotic processing and export.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Eukaryotic transcription',
      url: 'https://openstax.org/books/biology-2e/pages/15-3-eukaryotic-transcription',
    },
  },
  {
    id: 'L123',
    title: {
      zh: '翻译：RNA到蛋白质',
      en: 'Translation: RNA to Protein',
    },
    hook: {
      zh: 'GCU改为GCC，为什么RNA变了，氨基酸链却可不变？',
      en: 'Why can GCU→GCC change RNA without changing the amino acid chain?',
    },
    minutes: 38,
    icon: '⌬',
    objectives: [
      {
        zh: '按5′→3′阅读框逐密码子装配短链。',
        en: 'Assemble a short chain by reading codons 5′→3′.',
      },
      {
        zh: '区分密码子、反密码子与终止信号。',
        en: 'Distinguish codons, anticodons and stop signals.',
      },
      {
        zh: '用序列证据解释简并及其边界。',
        en: 'Explain code degeneracy and its limits using sequence evidence.',
      },
    ],
    prediction: [
      {
        zh: '某些不同密码子指定同一氨基酸。',
        en: 'Some different codons specify the same amino acid.',
      },
      {
        zh: '每个终止密码子也加入一种氨基酸。',
        en: 'Every stop codon adds an amino acid.',
      },
      {
        zh: '翻译把mRNA材料直接变成蛋白质。',
        en: 'Translation physically converts mRNA into protein.',
      },
    ],
    terms: [
      {
        word: {
          zh: '翻译',
          en: 'translation',
        },
        meaning: {
          zh: '核糖体依据mRNA装配氨基酸链。',
          en: 'Ribosomal assembly of an amino acid chain using mRNA.',
        },
      },
      {
        word: {
          zh: '密码子',
          en: 'codon',
        },
        meaning: {
          zh: 'mRNA中按阅读框读取的三核苷酸单位。',
          en: 'A three-nucleotide mRNA unit read within a frame.',
        },
      },
      {
        word: {
          zh: '反密码子',
          en: 'anticodon',
        },
        meaning: {
          zh: 'tRNA上与密码子反平行配对的三核苷酸。',
          en: 'A tRNA triplet pairing antiparallel with a codon.',
        },
      },
      {
        word: {
          zh: '转运RNA',
          en: 'transfer RNA',
        },
        meaning: {
          zh: '连接密码子识别与氨基酸递送的RNA。',
          en: 'RNA linking codon recognition with amino acid delivery.',
        },
      },
      {
        word: {
          zh: '阅读框',
          en: 'reading frame',
        },
        meaning: {
          zh: '决定连续三联体分组的起点与分组方式。',
          en: 'The starting position and grouping defining consecutive triplets.',
        },
      },
      {
        word: {
          zh: '终止密码子',
          en: 'stop codon',
        },
        meaning: {
          zh: '通常由释放因子识别、不指定氨基酸的信号。',
          en: 'A signal normally recognized by release factors, not specifying an amino acid.',
        },
      },
      {
        word: {
          zh: '多肽',
          en: 'polypeptide',
        },
        meaning: {
          zh: '由肽键连接的氨基酸链。',
          en: 'An amino acid chain linked by peptide bonds.',
        },
      },
      {
        word: {
          zh: '简并',
          en: 'degeneracy',
        },
        meaning: {
          zh: '遗传码中多个密码子可指定同一种氨基酸。',
          en: 'Multiple codons can specify the same amino acid.',
        },
      },
    ],
    questions: [
      {
        id: 'L123-q1',
        skill: 'concept',
        prompt: {
          zh: '本例AUG GCU UUU GGA UAA产生哪条短链？',
          en: 'Which teaching chain follows AUG GCU UUU GGA UAA?',
        },
        options: [
          {
            zh: 'Met–Ala–Phe–Gly，UAA终止',
            en: 'Met–Ala–Phe–Gly, then stop',
          },
          {
            zh: 'Met–Ala–Phe–Gly–Stop氨基酸',
            en: 'Met–Ala–Phe–Gly–a Stop amino acid',
          },
          {
            zh: 'RNA五段变成五个氨基酸',
            en: 'Five RNA blocks become five amino acids',
          },
        ],
        correct: 0,
        feedback: {
          zh: '四个指定氨基酸的密码子加一个终止信号；终止不是第五种氨基酸。',
          en: 'Four amino-acid codons precede a stop signal; stop is not a fifth amino acid.',
        },
        revisit: {
          zh: '看I01帧5及完整终止记录。',
          en: 'Inspect I01 frame 5 and the termination record.',
        },
      },
      {
        id: 'L123-q2',
        skill: 'concept',
        prompt: {
          zh: '密码子5′-GCU-3′对应的反平行反密码子如何写？',
          en: 'How is the antiparallel anticodon to 5′-GCU-3′ written?',
        },
        options: [
          {
            zh: '5′-CGA-3′',
            en: '5′-CGA-3′',
          },
          {
            zh: '3′-CGA-5′',
            en: '3′-CGA-5′',
          },
          {
            zh: '3′-GCU-5′',
            en: '3′-GCU-5′',
          },
        ],
        correct: 1,
        feedback: {
          zh: '互补字母CGA还必须带3′→5′端点；只对字母不检查方向会错。',
          en: 'Complementary CGA must carry 3′→5′ end labels; correct letters alone do not establish correct orientation.',
        },
        revisit: {
          zh: '回I01帧2反密码子端点。',
          en: 'Return to I01 frame 2 anticodon ends.',
        },
      },
      {
        id: 'L123-q3',
        skill: 'reasoning',
        prompt: {
          zh: '同阅读框中GCU→GCC而其余密码子不变；已知两者都指定Ala。哪项结论有证据？',
          en: 'In the same frame, GCU→GCC while other codons stay unchanged; both specify Ala. Which conclusion follows?',
        },
        options: [
          {
            zh: '氨基酸序列不变，但不能据此保证所有表达效果相同',
            en: 'Amino acid sequence remains, but all expression effects need not be identical',
          },
          {
            zh: '任意碱基改变都不影响蛋白',
            en: 'Any base change leaves protein unaffected',
          },
          {
            zh: '整个基因没有变化',
            en: 'The whole gene is unchanged',
          },
        ],
        correct: 0,
        feedback: {
          zh: '这是特定同义替换；不能推广到所有替换、插入或表达条件，RNA序列确实改变。',
          en: 'This is a particular synonymous substitution, not a rule for every substitution or insertion; RNA has changed.',
        },
        revisit: {
          zh: '切换I01 GCU/GCC并对照四个氨基酸。',
          en: 'Toggle I01 GCU/GCC and compare the four residues.',
        },
      },
      {
        id: 'L123-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'degeneracy指？',
          en: 'What is degeneracy?',
        },
        options: [
          {
            zh: '一个密码子可任意解释',
            en: 'A codon can mean anything',
          },
          {
            zh: '多个密码子可指定同一氨基酸',
            en: 'Multiple codons can specify one amino acid',
          },
          {
            zh: '所有密码子都指定同一氨基酸',
            en: 'All codons specify one amino acid',
          },
        ],
        correct: 1,
        feedback: {
          zh: '简并是多对一，非任意多义；给定标准码与阅读框，GCU有确定含义。',
          en: 'Degeneracy is many-to-one, not arbitrary ambiguity; GCU has a defined meaning in the standard code.',
        },
        revisit: {
          zh: '回帧2的GCU/GCC比较。',
          en: 'Revisit the frame 2 GCU/GCC comparison.',
        },
      },
    ],
    mission: {
      zh: '为短RNA制作逐密码子证据表，注明起始、反密码子方向、终止与同义替换限制。',
      en: 'Build a codon-by-codon evidence table marking start, anticodon direction, stop and the limits of synonymous substitutions.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Ribosomes and protein synthesis',
      url: 'https://openstax.org/books/biology-2e/pages/15-5-ribosomes-and-protein-synthesis',
    },
  },
  {
    id: 'L124',
    title: {
      zh: '基因表达与调控',
      en: 'Gene Expression and Regulation',
    },
    hook: {
      zh: 'RNA维持相同水平，蛋白质却减少：一定是基因消失了吗？',
      en: 'RNA stays at the same level but protein falls. Must the gene have disappeared?',
    },
    minutes: 38,
    icon: '⌬',
    objectives: [
      {
        zh: '区分转录、翻译及降解的调控层。',
        en: 'Distinguish transcription, translation and degradation control.',
      },
      {
        zh: '用时间数据解释RNA先变与蛋白滞后。',
        en: 'Use time data to explain RNA changes and protein lag.',
      },
      {
        zh: '限定低蛋白证据能支持的结论。',
        en: 'Limit conclusions supported by low protein evidence.',
      },
    ],
    prediction: [
      {
        zh: '改变翻译可让RNA相同而蛋白不同。',
        en: 'Changing translation can alter protein without changing RNA.',
      },
      {
        zh: '有同一基因就必定同量表达。',
        en: 'The same gene guarantees equal expression.',
      },
      {
        zh: '蛋白低只能由转录减少造成。',
        en: 'Low protein can only result from reduced transcription.',
      },
    ],
    terms: [
      {
        word: {
          zh: '基因表达',
          en: 'gene expression',
        },
        meaning: {
          zh: '利用基因信息产生功能RNA或蛋白产物。',
          en: 'Using gene information to produce functional RNA or protein.',
        },
      },
      {
        word: {
          zh: '调控',
          en: 'regulation',
        },
        meaning: {
          zh: '改变过程强弱、时间或位置的控制。',
          en: 'Control of a process amount, timing or location.',
        },
      },
      {
        word: {
          zh: '转录因子',
          en: 'transcription factor',
        },
        meaning: {
          zh: '参与调节转录的蛋白质。',
          en: 'A protein involved in transcription control.',
        },
      },
      {
        word: {
          zh: '翻译效率',
          en: 'translation efficiency',
        },
        meaning: {
          zh: '给定RNA条件下形成蛋白的有效程度。',
          en: 'The effectiveness of protein production from available RNA.',
        },
      },
      {
        word: {
          zh: '降解',
          en: 'degradation',
        },
        meaning: {
          zh: '分子被分解移除的过程。',
          en: 'Breakdown and removal of molecules.',
        },
      },
      {
        word: {
          zh: '稳态',
          en: 'steady state',
        },
        meaning: {
          zh: '生成与移除相平衡而量近似稳定的状态。',
          en: 'A near-constant amount maintained by balanced production and removal.',
        },
      },
      {
        word: {
          zh: '时间滞后',
          en: 'time lag',
        },
        meaning: {
          zh: '上游变化与下游响应之间的延迟。',
          en: 'A delay between an upstream change and downstream response.',
        },
      },
      {
        word: {
          zh: '功能RNA',
          en: 'functional RNA',
        },
        meaning: {
          zh: '以RNA形式执行功能、不必翻译的基因产物。',
          en: 'A gene product acting as RNA without requiring translation.',
        },
      },
    ],
    questions: [
      {
        id: 'L124-q1',
        skill: 'concept',
        prompt: {
          zh: '哪条路线允许基因产物不经过蛋白质？',
          en: 'Which route permits a gene product without a protein stage?',
        },
        options: [
          {
            zh: 'DNA→功能RNA',
            en: 'DNA→functional RNA',
          },
          {
            zh: '所有基因都只产蛋白',
            en: 'Every gene only makes protein',
          },
          {
            zh: 'DNA直接变氨基酸',
            en: 'DNA directly turns into amino acids',
          },
        ],
        correct: 0,
        feedback: {
          zh: '功能RNA本身可有作用；一基因一蛋白及一基因一性状都过度简化。',
          en: 'Functional RNA can act directly; one gene–one protein and one gene–one trait are oversimplifications.',
        },
        revisit: {
          zh: '回完整记录与Explain的表达层级。',
          en: 'Return to the record and Explain expression levels.',
        },
      },
      {
        id: 'L124-q2',
        skill: 'concept',
        prompt: {
          zh: '蛋白量近似稳定说明什么？',
          en: 'What can near-constant protein amount mean?',
        },
        options: [
          {
            zh: '所有合成和降解已停止',
            en: 'All production and degradation stopped',
          },
          {
            zh: '生成与降解可动态平衡',
            en: 'Production and removal can balance dynamically',
          },
          {
            zh: '基因不存在',
            en: 'The gene is absent',
          },
        ],
        correct: 1,
        feedback: {
          zh: '稳态是通量平衡，不是分子不再变化；仅凭量不能证明所有过程停止。',
          en: 'Steady state can involve balanced fluxes; constant amount does not show that molecular processes stopped.',
        },
        revisit: {
          zh: '看I01后几帧变化减缓和生成/降解公式。',
          en: 'Inspect later I01 frames and the production/loss equations.',
        },
      },
      {
        id: 'L124-q3',
        skill: 'reasoning',
        prompt: {
          zh: '同条件5 min：转录输入均2相对量 min⁻¹；翻译系数0.5→0.1 min⁻¹，RNA均3.875，蛋白4.453→0.891。哪项有依据？',
          en: 'At 5 min, transcription input stays 2 relative units min⁻¹. Translation coefficient changes 0.5→0.1 min⁻¹; RNA stays 3.875, protein changes 4.453→0.891. Best conclusion?',
        },
        options: [
          {
            zh: '模型中的翻译层改变可解释蛋白降低',
            en: 'A translation-level change explains lower model protein',
          },
          {
            zh: 'DNA肯定减少80%',
            en: 'DNA must fall by 80%',
          },
          {
            zh: 'RNA被直接转成蛋白所以耗尽',
            en: 'RNA is consumed into protein',
          },
        ],
        correct: 0,
        feedback: {
          zh: '固定转录和降解后，只改变翻译足以产生这组差异；实细胞还须测降解等，不能据此声称唯一原因。',
          en: 'With transcription/loss fixed, changing translation produces this difference; real cells also require degradation measurements before claiming a unique cause.',
        },
        revisit: {
          zh: '把I01翻译设0.5和0.1，比较完整5 min表。',
          en: 'Compare the I01 full 5-min tables at translation 0.5 and 0.1.',
        },
      },
      {
        id: 'L124-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'steady state在此指？',
          en: 'What does steady state mean here?',
        },
        options: [
          {
            zh: '生成与移除平衡、量近似稳定',
            en: 'A near-stable amount with balanced input/output',
          },
          {
            zh: '所有酶永久关闭',
            en: 'All enzymes permanently off',
          },
          {
            zh: 'DNA从不复制',
            en: 'DNA never replicates',
          },
        ],
        correct: 0,
        feedback: {
          zh: '量稳定可以伴随持续周转，与永久关闭或复制与否不同。',
          en: 'Stable amount can coexist with turnover; this is not permanent shutdown or a statement about replication.',
        },
        revisit: {
          zh: '回Explain动态平衡与I01公式。',
          en: 'Revisit Explain dynamic balance and I01 equations.',
        },
      },
    ],
    mission: {
      zh: '把L122转录与L123翻译按顺序连接，再附两组RNA/蛋白时间证据和一个未排除解释。',
      en: 'Order L122 transcription and L123 translation, then attach two RNA/protein time datasets and one unresolved alternative.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Eukaryotic gene regulation',
      url: 'https://openstax.org/books/biology-2e/pages/16-1-regulation-of-gene-expression',
    },
  },
  {
    id: 'L125',
    title: {
      zh: 'ATP与偶联反应',
      en: 'ATP and Coupled Reactions',
    },
    hook: {
      zh: '把放能与需能反应放进同一杯，为什么不能保证前者驱动后者？',
      en: 'Why does putting an energy-releasing and an energy-requiring reaction together not guarantee coupling?',
    },
    minutes: 38,
    icon: '⌬',
    objectives: [
      {
        zh: '区分断键需能与净水解自由能下降。',
        en: 'Distinguish energy needed for bond breaking from net hydrolysis free-energy change.',
      },
      {
        zh: '在给定条件下计算偶联总ΔG。',
        en: 'Calculate a coupled total ΔG under stated conditions.',
      },
      {
        zh: '用共享中间体判断机制是否实际连接。',
        en: 'Use a shared intermediate to evaluate physical connection.',
      },
    ],
    prediction: [
      {
        zh: '总ΔG为负还需要实际偶联机制。',
        en: 'Negative total ΔG still requires a physical coupling mechanism.',
      },
      {
        zh: 'ATP断一个键本身就释放全部能量。',
        en: 'Breaking an ATP bond alone releases all its energy.',
      },
      {
        zh: '酶能把正ΔG自动改为负值。',
        en: 'An enzyme automatically changes positive ΔG to negative.',
      },
    ],
    terms: [
      {
        word: {
          zh: 'ATP',
          en: 'ATP',
        },
        meaning: {
          zh: '可参与自由能转移与反应偶联的核苷酸。',
          en: 'A nucleotide participating in free-energy transfer and reaction coupling.',
        },
      },
      {
        word: {
          zh: 'ADP',
          en: 'ADP',
        },
        meaning: {
          zh: 'ATP少一个磷酸基的相关核苷酸。',
          en: 'A related nucleotide with one fewer phosphate group than ATP.',
        },
      },
      {
        word: {
          zh: '水解',
          en: 'hydrolysis',
        },
        meaning: {
          zh: '有水参与的化学分解反应。',
          en: 'A chemical breakdown reaction involving water.',
        },
      },
      {
        word: {
          zh: '自由能变化',
          en: 'Gibbs free-energy change',
        },
        meaning: {
          zh: '给定条件下反应前后可用自由能的差，以ΔG表示。',
          en: 'The free-energy difference between products and reactants under stated conditions, ΔG.',
        },
      },
      {
        word: {
          zh: '需能反应',
          en: 'endergonic reaction',
        },
        meaning: {
          zh: '给定条件下ΔG为正的反应。',
          en: 'A reaction with positive ΔG under given conditions.',
        },
      },
      {
        word: {
          zh: '放能反应',
          en: 'exergonic reaction',
        },
        meaning: {
          zh: '给定条件下ΔG为负的反应。',
          en: 'A reaction with negative ΔG under given conditions.',
        },
      },
      {
        word: {
          zh: '偶联',
          en: 'coupling',
        },
        meaning: {
          zh: '通过共享过程使一种反应驱动另一种过程。',
          en: 'Linking reactions through a shared process so one can drive another.',
        },
      },
      {
        word: {
          zh: '中间体',
          en: 'intermediate',
        },
        meaning: {
          zh: '反应过程中形成并进一步反应的物质。',
          en: 'A substance formed and used during a reaction sequence.',
        },
      },
    ],
    questions: [
      {
        id: 'L125-q1',
        skill: 'concept',
        prompt: {
          zh: 'ATP水解净放能的正确解释是？',
          en: 'Which correctly explains net energy release in ATP hydrolysis?',
        },
        options: [
          {
            zh: '断键本身释放能量',
            en: 'Bond breaking alone releases energy',
          },
          {
            zh: '整个反应的产物在给定条件下自由能较低',
            en: 'The whole reaction has lower-free-energy products under stated conditions',
          },
          {
            zh: '物质消失成能量',
            en: 'Matter disappears into energy',
          },
        ],
        correct: 1,
        feedback: {
          zh: '断键需能；水解还形成新相互作用，比较完整反应自由能才决定净值。',
          en: 'Bond breaking costs energy; hydrolysis includes new interactions, and the complete reaction determines the net change.',
        },
        revisit: {
          zh: '看D01净水解框与完整记录，而非只看一个键。',
          en: 'Inspect the D01 net-hydrolysis box and whole-reaction record.',
        },
      },
      {
        id: 'L125-q2',
        skill: 'concept',
        prompt: {
          zh: '两个反应总ΔG<0就一定已发生偶联吗？',
          en: 'Does total ΔG<0 prove two reactions are coupled?',
        },
        options: [
          {
            zh: '是，只要放一起',
            en: 'Yes, if placed together',
          },
          {
            zh: '否，需共享中间体或其他实际连接',
            en: 'No, a shared intermediate or another physical connection is needed',
          },
          {
            zh: '是，任何酶都会自动连接',
            en: 'Yes, any enzyme automatically connects them',
          },
        ],
        correct: 1,
        feedback: {
          zh: '热力学可行性不提供机制；若放能只散为热，需能反应未必被驱动。',
          en: 'Thermodynamic favorability does not supply a mechanism; energy dissipated as heat need not drive the other reaction.',
        },
        revisit: {
          zh: '切I01连接/断开而保持两个ΔG相同。',
          en: 'Toggle I01 connection with both ΔG values unchanged.',
        },
      },
      {
        id: 'L125-q3',
        skill: 'reasoning',
        prompt: {
          zh: '同一给定条件下A→B为+25，ATP净水解为−30 kJ mol⁻¹。共享中间体时总值多少？若断开，结论怎样？',
          en: 'At fixed conditions A→B is +25 and ATP hydrolysis −30 kJ mol⁻¹. What is the linked total, and what if disconnected?',
        },
        options: [
          {
            zh: '−5 kJ mol⁻¹；断开仍保证驱动',
            en: '−5 kJ mol⁻¹; disconnected still guaranteed',
          },
          {
            zh: '−5 kJ mol⁻¹；断开不再由此保证驱动',
            en: '−5 kJ mol⁻¹; disconnected gives no such guarantee',
          },
          {
            zh: '+55 kJ mol⁻¹；断开更好',
            en: '+55 kJ mol⁻¹; disconnection helps',
          },
        ],
        correct: 1,
        feedback: {
          zh: '相加为25−30=−5；负值是条件之一，实际连接仍不可缺。不能把负号丢掉相加成55。',
          en: '25−30=−5; a negative sum is one condition, but connection remains essential. Adding magnitudes loses the sign.',
        },
        revisit: {
          zh: 'I01设25与−30，再切共享开关。',
          en: 'Set I01 to 25 and −30, then toggle the shared intermediate.',
        },
      },
      {
        id: 'L125-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'endergonic在给定条件下指？',
          en: 'What does endergonic mean under given conditions?',
        },
        options: [
          {
            zh: 'ΔG<0',
            en: 'ΔG<0',
          },
          {
            zh: 'ΔG>0',
            en: 'ΔG>0',
          },
          {
            zh: '必定很快',
            en: 'Always fast',
          },
        ],
        correct: 1,
        feedback: {
          zh: '需能指正ΔG，不是反应快慢；活化能和速率是另一个问题。',
          en: 'Endergonic means positive ΔG, not reaction speed; activation barriers and rates are separate.',
        },
        revisit: {
          zh: '回D01需能框与Explain条件段。',
          en: 'Return to the D01 work box and Explain conditions.',
        },
      },
    ],
    mission: {
      zh: '制作一张含反应、ΔG单位、真实连接机制和条件边界的ATP偶联卡。',
      en: 'Make an ATP coupling card with reactions, ΔG units, a physical link and conditional limits.',
    },
    reference: {
      title: 'OpenStax Biology 2e · ATP',
      url: 'https://openstax.org/books/biology-2e/pages/6-4-atp-adenosine-triphosphate',
    },
  },
  {
    id: 'L126',
    title: {
      zh: '细胞呼吸路径总览',
      en: 'Cellular Respiration Pathways',
    },
    hook: {
      zh: '呼吸用氧又放出CO₂，是否说明吸入的O₂直接变成呼出的CO₂？',
      en: 'Respiration uses oxygen and releases CO₂. Does inhaled O₂ directly become exhaled CO₂?',
    },
    minutes: 38,
    icon: '⌬',
    objectives: [
      {
        zh: '把三大过程定位到细胞质、基质和内膜。',
        en: 'Locate major processes in cytosol, matrix and inner membrane.',
      },
      {
        zh: '分别追踪糖碳、电子与ATP账本。',
        en: 'Track separate ledgers for glucose carbon, electrons and ATP.',
      },
      {
        zh: '比较有氧氧化与乳酸发酵的条件及边界。',
        en: 'Compare conditions and limits of aerobic oxidation and lactate fermentation.',
      },
    ],
    prediction: [
      {
        zh: 'CO₂的碳来自被氧化的有机物，氧接收电子形成水。',
        en: 'CO₂ carbon comes from oxidized organic matter; oxygen accepts electrons to form water.',
      },
      {
        zh: '氧气的原子直接提供葡萄糖的碳。',
        en: 'Oxygen supplies glucose carbon.',
      },
      {
        zh: '所有细胞每葡萄糖固定产生38 ATP。',
        en: 'Every cell always makes 38 ATP per glucose.',
      },
    ],
    terms: [
      {
        word: {
          zh: '糖酵解',
          en: 'glycolysis',
        },
        meaning: {
          zh: '在细胞质把葡萄糖转为丙酮酸并净得少量ATP的路径。',
          en: 'A cytosolic pathway converting glucose to pyruvate with a small net ATP yield.',
        },
      },
      {
        word: {
          zh: '基质',
          en: 'matrix',
        },
        meaning: {
          zh: '线粒体内膜所围的内部空间。',
          en: 'The compartment enclosed by the mitochondrial inner membrane.',
        },
      },
      {
        word: {
          zh: '柠檬酸循环',
          en: 'citric acid cycle',
        },
        meaning: {
          zh: '氧化乙酰基并产生CO₂和还原载体的循环。',
          en: 'A cycle oxidizing acetyl groups to CO₂ and reduced carriers.',
        },
      },
      {
        word: {
          zh: 'NADH',
          en: 'NADH',
        },
        meaning: {
          zh: '可向其他反应传递电子的还原载体。',
          en: 'A reduced carrier transferring electrons to other reactions.',
        },
      },
      {
        word: {
          zh: '电子传递链',
          en: 'electron transport chain',
        },
        meaning: {
          zh: '通过电子转移建立跨膜质子梯度的系统。',
          en: 'A system transferring electrons and establishing a transmembrane proton gradient.',
        },
      },
      {
        word: {
          zh: '末端电子受体',
          en: 'terminal electron acceptor',
        },
        meaning: {
          zh: '电子传递路径末端接收电子的物质。',
          en: 'A substance accepting electrons at the end of a transfer pathway.',
        },
      },
      {
        word: {
          zh: '氧化磷酸化',
          en: 'oxidative phosphorylation',
        },
        meaning: {
          zh: '电子转移与质子梯度支持的ATP生成。',
          en: 'ATP production supported by electron transfer and a proton gradient.',
        },
      },
      {
        word: {
          zh: '发酵',
          en: 'fermentation',
        },
        meaning: {
          zh: '通过有机受体再氧化NADH以维持糖酵解的路径。',
          en: 'A pathway reoxidizing NADH with an organic acceptor to sustain glycolysis.',
        },
      },
    ],
    questions: [
      {
        id: 'L126-q1',
        skill: 'concept',
        prompt: {
          zh: '典型真核细胞中电子传递链主要在哪里？',
          en: 'Where is the respiratory electron transport chain in a typical eukaryotic cell?',
        },
        options: [
          {
            zh: '线粒体内膜',
            en: 'Mitochondrial inner membrane',
          },
          {
            zh: '细胞核DNA上',
            en: 'On nuclear DNA',
          },
          {
            zh: '细胞质任意游离处',
            en: 'Freely anywhere in the cytosol',
          },
        ],
        correct: 0,
        feedback: {
          zh: '内膜分隔空间才能支持质子梯度；糖酵解在细胞质，基质主要进行丙酮酸氧化和循环。',
          en: 'The inner membrane separates compartments for a proton gradient; glycolysis is cytosolic, while pyruvate oxidation/cycling occur mainly in matrix.',
        },
        revisit: {
          zh: '回D01三分区与I01帧3。',
          en: 'Return to the D01 compartments and I01 frame 3.',
        },
      },
      {
        id: 'L126-q2',
        skill: 'concept',
        prompt: {
          zh: '有氧呼吸中O₂主要担当什么角色？',
          en: 'What is O₂ doing in aerobic respiration?',
        },
        options: [
          {
            zh: '提供CO₂中的碳',
            en: 'Supplying carbon in CO₂',
          },
          {
            zh: '末端接受电子并形成水',
            en: 'Accepting electrons at the end and forming water',
          },
          {
            zh: '直接变成所有ATP',
            en: 'Directly becoming all ATP',
          },
        ],
        correct: 1,
        feedback: {
          zh: 'CO₂中的碳来自糖等有机物氧化，O₂不含碳；它的受电子作用支持呼吸链继续。',
          en: 'CO₂ carbon comes from oxidized organic material. O₂ contains no carbon; electron acceptance sustains the chain.',
        },
        revisit: {
          zh: '看I01帧2的碳与帧3的电子分开路线。',
          en: 'Compare the carbon route in I01 frame 2 with electrons in frame 3.',
        },
      },
      {
        id: 'L126-q3',
        skill: 'reasoning',
        prompt: {
          zh: '每葡萄糖6C；有氧放6 CO₂得约30 ATP，乳酸发酵产2个3C乳酸得净2 ATP。哪项比较成立？',
          en: 'Per 6C glucose: aerobic model gives 6 CO₂ and ≈30 ATP; lactate fermentation gives two 3C lactates and net 2 ATP. Which comparison is valid?',
        },
        options: [
          {
            zh: '发酵丢了4个碳，因为ATP少',
            en: 'Fermentation loses four carbons because ATP is lower',
          },
          {
            zh: '两条路径均保留6个碳的物质账，发酵仍有能量留在乳酸中',
            en: 'Both conserve six carbons; substantial chemical energy remains in lactate',
          },
          {
            zh: '乳酸发酵直接产生6 CO₂',
            en: 'Lactate fermentation directly gives six CO₂',
          },
        ],
        correct: 1,
        feedback: {
          zh: '碳守恒与ATP收益是不同账本；乳酸2×3=6C，较少ATP不代表碳消失。',
          en: 'Carbon conservation and ATP yield are different ledgers: 2×3=6 carbons remain in lactate; lower ATP does not mean lost carbon.',
        },
        revisit: {
          zh: 'I01切换两路径，核对6 CO₂与2×3C。',
          en: 'Toggle I01 routes and compare 6 CO₂ with 2×3C.',
        },
      },
      {
        id: 'L126-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'terminal electron acceptor指？',
          en: 'What is a terminal electron acceptor?',
        },
        options: [
          {
            zh: '电子路径末端接收电子的物质',
            en: 'A substance accepting electrons at the end of a pathway',
          },
          {
            zh: '最终生成的糖碳',
            en: 'The final sugar carbon',
          },
          {
            zh: '所有酶的通称',
            en: 'A general name for every enzyme',
          },
        ],
        correct: 0,
        feedback: {
          zh: '这里有氧呼吸为O₂；术语描述电子角色，不是碳来源或酶的总称。',
          en: 'Here it is O₂ in aerobic respiration; the term describes an electron role, not carbon origin or all enzymes.',
        },
        revisit: {
          zh: '回内膜O₂→H₂O标记及记录。',
          en: 'Return to the inner-membrane O₂→H₂O label and record.',
        },
      },
    ],
    mission: {
      zh: '绘制过程—部位—碳变化—电子—ATP五列地图，注明有氧和乳酸发酵各自假设。',
      en: 'Draw a process–location–carbon–electron–ATP map and state separate aerobic and lactate assumptions.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Oxidative phosphorylation',
      url: 'https://openstax.org/books/biology-2e/pages/7-4-oxidative-phosphorylation',
    },
  },
  {
    id: 'L127',
    title: {
      zh: '光反应与碳固定概览',
      en: 'Light Reactions and Carbon Fixation',
    },
    hook: {
      zh: '给叶绿体足够CO₂却没有ATP与NADPH，为什么不能继续净造糖？',
      en: 'Why does abundant CO₂ not sustain net carbohydrate production without ATP and NADPH?',
    },
    minutes: 38,
    icon: '⌬',
    objectives: [
      {
        zh: '定位类囊体光反应与基质碳固定。',
        en: 'Locate thylakoid light reactions and stromal carbon fixation.',
      },
      {
        zh: '区分释放O₂的水来源与有机物碳的CO₂来源。',
        en: 'Distinguish water-derived O₂ from CO₂-derived organic carbon.',
      },
      {
        zh: '用ATP/NADPH预算计算净G3P限制。',
        en: 'Calculate net G3P limits from ATP/NADPH budgets.',
      },
    ],
    prediction: [
      {
        zh: '碳固定需要光反应供应的ATP与NADPH。',
        en: 'Carbon fixation requires ATP and NADPH supplied by light reactions.',
      },
      {
        zh: '光合释放的O₂来自CO₂中的碳。',
        en: 'Photosynthetic O₂ comes from carbon in CO₂.',
      },
      {
        zh: '所谓暗反应只能在晚上进行。',
        en: 'The so-called dark reaction can occur only at night.',
      },
    ],
    terms: [
      {
        word: {
          zh: '类囊体',
          en: 'thylakoid',
        },
        meaning: {
          zh: '叶绿体中承载光反应系统的膜结构。',
          en: 'A chloroplast membrane structure housing light-reaction machinery.',
        },
      },
      {
        word: {
          zh: '基质',
          en: 'stroma',
        },
        meaning: {
          zh: '叶绿体中类囊体外的内部液相区域。',
          en: 'The chloroplast internal compartment outside thylakoids.',
        },
      },
      {
        word: {
          zh: '光反应',
          en: 'light reactions',
        },
        meaning: {
          zh: '用光能支持电子转移并形成ATP/NADPH的过程。',
          en: 'Processes using light to support electron transfer and ATP/NADPH supply.',
        },
      },
      {
        word: {
          zh: '碳固定',
          en: 'carbon fixation',
        },
        meaning: {
          zh: '把无机CO₂碳并入有机分子的过程。',
          en: 'Incorporation of inorganic CO₂ carbon into organic molecules.',
        },
      },
      {
        word: {
          zh: 'Calvin循环',
          en: 'Calvin cycle',
        },
        meaning: {
          zh: '利用ATP/NADPH固定并还原碳且再生受体的循环。',
          en: 'A cycle using ATP/NADPH for carbon fixation, reduction and acceptor regeneration.',
        },
      },
      {
        word: {
          zh: 'NADPH',
          en: 'NADPH',
        },
        meaning: {
          zh: '供还原反应用的电子载体。',
          en: 'An electron carrier supplying reducing power.',
        },
      },
      {
        word: {
          zh: 'G3P',
          en: 'G3P',
        },
        meaning: {
          zh: '三碳糖磷酸，可作为形成其他有机物的原料。',
          en: 'A three-carbon sugar phosphate supplying organic synthesis.',
        },
      },
      {
        word: {
          zh: '限制资源',
          en: 'limiting resource',
        },
        meaning: {
          zh: '在给定条件下最先限制输出的可用资源。',
          en: 'An available resource that first constrains output under given conditions.',
        },
      },
    ],
    questions: [
      {
        id: 'L127-q1',
        skill: 'concept',
        prompt: {
          zh: '本课典型叶绿体中，光反应/Calvin循环主要在哪？',
          en: 'Where are light reactions / the Calvin cycle in this chloroplast model?',
        },
        options: [
          {
            zh: '类囊体膜／基质',
            en: 'Thylakoid membrane / stroma',
          },
          {
            zh: '细胞核／线粒体',
            en: 'Nucleus / mitochondrion',
          },
          {
            zh: '基质／细胞核',
            en: 'Stroma / nucleus',
          },
        ],
        correct: 0,
        feedback: {
          zh: '膜上电子传递和梯度支持供能，基质循环使用ATP/NADPH；两者连接但部位不同。',
          en: 'Membrane transfer/gradients support supply; stromal cycling uses ATP/NADPH. Connected processes have distinct locations.',
        },
        revisit: {
          zh: '回D01左右叶绿体分区。',
          en: 'Return to the two D01 chloroplast regions.',
        },
      },
      {
        id: 'L127-q2',
        skill: 'concept',
        prompt: {
          zh: '光合放出的O₂和糖的碳分别主要来自？',
          en: 'What supplies released photosynthetic O₂ and carbohydrate carbon respectively?',
        },
        options: [
          {
            zh: '水／CO₂',
            en: 'Water / CO₂',
          },
          {
            zh: 'CO₂／O₂',
            en: 'CO₂ / O₂',
          },
          {
            zh: 'ATP／光子',
            en: 'ATP / photons',
          },
        ],
        correct: 0,
        feedback: {
          zh: '水提供放氧来源，CO₂提供有机碳；光提供能量而非碳原子。',
          en: 'Water is the oxygen source; CO₂ supplies organic carbon. Light transfers energy rather than carbon atoms.',
        },
        revisit: {
          zh: '看D01水→O₂与CO₂入循环两条路线。',
          en: 'Inspect the separate D01 water→O₂ and CO₂ routes.',
        },
      },
      {
        id: 'L127-q3',
        skill: 'reasoning',
        prompt: {
          zh: '预算：CO₂6、ATP 18、NADPH 6 μmol；每净G3P需3/9/6。净G3P最多多少，先限制哪项？',
          en: 'Budget: 6 CO₂, 18 ATP, 6 NADPH μmol; net G3P costs 3/9/6. Maximum net G3P and limiting resource?',
        },
        options: [
          {
            zh: '2 μmol，CO₂',
            en: '2 μmol, CO₂',
          },
          {
            zh: '1 μmol，NADPH',
            en: '1 μmol, NADPH',
          },
          {
            zh: '6 μmol，ATP',
            en: '6 μmol, ATP',
          },
        ],
        correct: 1,
        feedback: {
          zh: '分别支持6/3=2、18/9=2、6/6=1 μmol，取最小1；不能只看CO₂或把G3P当葡萄糖。',
          en: 'Budgets support 2, 2 and 1 μmol respectively, so take the minimum 1. Counting only CO₂ or calling G3P glucose fails.',
        },
        revisit: {
          zh: 'I01设ATP 18、NADPH 6，读净G3P预算。',
          en: 'Set I01 ATP 18/NADPH 6 and read net G3P.',
        },
      },
      {
        id: 'L127-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'carbon fixation指？',
          en: 'What is carbon fixation?',
        },
        options: [
          {
            zh: '让碳停止运动',
            en: 'Stopping carbon from moving',
          },
          {
            zh: '把CO₂碳并入有机物',
            en: 'Incorporating CO₂ carbon into organic material',
          },
          {
            zh: '把光变为碳原子',
            en: 'Turning light into carbon atoms',
          },
        ],
        correct: 1,
        feedback: {
          zh: '固定描述碳的化学并入，不是物理不动，更不是能量变成碳物质。',
          en: 'Fixation describes chemical incorporation, not physical immobility or energy becoming carbon matter.',
        },
        revisit: {
          zh: '回D01 CO₂进入基质循环。',
          en: 'Return to CO₂ entering the D01 stromal cycle.',
        },
      },
    ],
    mission: {
      zh: '建立光反应与Calvin循环物质—部位卡，附一组限制预算及来源说明。',
      en: 'Build light-reaction and Calvin material/location cards with one limiting-resource calculation and source labels.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Calvin cycle',
      url: 'https://openstax.org/books/biology-2e/pages/8-3-using-light-energy-to-make-organic-molecules',
    },
  },
  {
    id: 'L128',
    title: {
      zh: '代谢怎样被调节？',
      en: 'Regulating Metabolism',
    },
    hook: {
      zh: '产物已经够多，细胞怎样降低一条路径而不让所有反应停摆？',
      en: 'How can a cell reduce one pathway when product is abundant without stopping every reaction?',
    },
    minutes: 38,
    icon: '⌬',
    objectives: [
      {
        zh: '用末端产物解释特异性反馈抑制。',
        en: 'Explain specific feedback inhibition by an end product.',
      },
      {
        zh: '用敏感酶与不敏感对照比较通量。',
        en: 'Compare flux for a sensitive enzyme and an insensitive control.',
      },
      {
        zh: '区分酶活性调节、表达调控与动态稳态。',
        en: 'Distinguish activity regulation, expression control and dynamic steady state.',
      },
    ],
    prediction: [
      {
        zh: '产物可抑制某个早期酶，降低自身生成通量。',
        en: 'An end product can inhibit a specific early enzyme and reduce its own production flux.',
      },
      {
        zh: '任何产物都同样抑制所有酶。',
        en: 'Every product inhibits all enzymes equally.',
      },
      {
        zh: '稳态表示细胞完全停止代谢。',
        en: 'Steady state means metabolism has entirely stopped.',
      },
    ],
    terms: [
      {
        word: {
          zh: '代谢通量',
          en: 'metabolic flux',
        },
        meaning: {
          zh: '单位时间通过某反应或路径的物质量。',
          en: 'Amount passing through a reaction or pathway per time.',
        },
      },
      {
        word: {
          zh: '反馈抑制',
          en: 'feedback inhibition',
        },
        meaning: {
          zh: '产物反过来抑制路径中较早步骤。',
          en: 'An end product inhibits an earlier step in its pathway.',
        },
      },
      {
        word: {
          zh: '酶活性',
          en: 'enzyme activity',
        },
        meaning: {
          zh: '给定条件下酶支持反应的能力或速率表现。',
          en: 'An enzyme reaction capacity or rate under stated conditions.',
        },
      },
      {
        word: {
          zh: '变构调节',
          en: 'allosteric regulation',
        },
        meaning: {
          zh: '分子结合非活性位点并影响酶功能的调节。',
          en: 'Regulation through binding away from the active site and changing function.',
        },
      },
      {
        word: {
          zh: '底物',
          en: 'substrate',
        },
        meaning: {
          zh: '被酶作用的反应物。',
          en: 'A reactant acted on by an enzyme.',
        },
      },
      {
        word: {
          zh: '产物',
          en: 'product',
        },
        meaning: {
          zh: '反应生成的物质。',
          en: 'A substance formed by a reaction.',
        },
      },
      {
        word: {
          zh: '特异性',
          en: 'specificity',
        },
        meaning: {
          zh: '相互作用依赖特定分子与结构条件。',
          en: 'Dependence of an interaction on particular molecules and structural conditions.',
        },
      },
      {
        word: {
          zh: '动态稳态',
          en: 'dynamic steady state',
        },
        meaning: {
          zh: '持续生成与消耗平衡、量近似不变。',
          en: 'Near-constant amount maintained by ongoing balanced production and use.',
        },
      },
    ],
    questions: [
      {
        id: 'L128-q1',
        skill: 'concept',
        prompt: {
          zh: '本例产物P反馈抑制意味着？',
          en: 'What does product P feedback inhibition mean here?',
        },
        options: [
          {
            zh: 'P降低特定早期酶活性',
            en: 'P reduces activity of a specific earlier enzyme',
          },
          {
            zh: 'P毁掉所有DNA',
            en: 'P destroys all DNA',
          },
          {
            zh: '任何P浓度都使全部代谢永久停止',
            en: 'Any P level permanently stops all metabolism',
          },
        ],
        correct: 0,
        feedback: {
          zh: '反馈针对本路径的敏感酶，常可逆；不是对全部代谢的普遍毒杀。',
          en: 'Feedback targets the sensitive enzyme in this pathway and can be reversible, not universal destruction.',
        },
        revisit: {
          zh: '看D01由P返回E₁的抑制线。',
          en: 'Inspect the D01 P→E₁ inhibitory link.',
        },
      },
      {
        id: 'L128-q2',
        skill: 'concept',
        prompt: {
          zh: '短时改变现有酶活性与表达调控的区别是？',
          en: 'How does short-term regulation of existing enzyme activity differ from expression regulation?',
        },
        options: [
          {
            zh: '两者都必定改变DNA碱基',
            en: 'Both necessarily change DNA bases',
          },
          {
            zh: '前者可不改变酶数量，后者可改变生成量',
            en: 'Activity can change without changing enzyme amount; expression can alter production',
          },
          {
            zh: '前者只能把所有酶降解',
            en: 'Activity regulation only destroys all enzymes',
          },
        ],
        correct: 1,
        feedback: {
          zh: '活性与数量是不同层次，可并存；本模型固定数量，因此不把反馈数值解释成基因表达量。',
          en: 'Activity and amount are distinct levels that can coexist. Enzyme amount is fixed here, so feedback values are not expression measurements.',
        },
        revisit: {
          zh: '回I01图下注明酶量固定及L124表达图。',
          en: 'Return to I01 fixed enzyme amount and L124 expression plots.',
        },
      },
      {
        id: 'L128-q3',
        skill: 'reasoning',
        prompt: {
          zh: '固定S=6 μmol L⁻¹，敏感酶P从0升到4，通量9→4.5 μmol min⁻¹；不敏感对照始终9。哪项受支持？',
          en: 'At S=6 μmol L⁻¹, raising P 0→4 lowers sensitive-enzyme flux 9→4.5 μmol min⁻¹; the insensitive control stays9. What is supported?',
        },
        options: [
          {
            zh: 'P对本例敏感酶有特异抑制，未证明酶量下降',
            en: 'P specifically inhibits the sensitive model enzyme; amount reduction is unproven',
          },
          {
            zh: '底物减少一半',
            en: 'Substrate halves',
          },
          {
            zh: 'P把一半DNA变成产物',
            en: 'P turns half the DNA into product',
          },
        ],
        correct: 0,
        feedback: {
          zh: '底物和酶量固定，对照帮助定位敏感性；半速不是酶量减半或DNA变化证据。',
          en: 'Substrate and enzyme amount are fixed; the control identifies sensitivity. Half flux does not show half enzyme amount or DNA change.',
        },
        revisit: {
          zh: 'I01设S6，比较P0/4与不敏感对照。',
          en: 'Set I01 S6, compare P0/4 and the insensitive control.',
        },
      },
      {
        id: 'L128-q4',
        skill: 'vocabulary',
        prompt: {
          zh: 'metabolic flux应使用哪类单位？',
          en: 'Which unit describes metabolic flux?',
        },
        options: [
          {
            zh: 'μmol min⁻¹',
            en: 'μmol min⁻¹',
          },
          {
            zh: '只有μmol L⁻¹浓度',
            en: 'Only μmol L⁻¹ concentration',
          },
          {
            zh: '只有分钟',
            en: 'Only minutes',
          },
        ],
        correct: 0,
        feedback: {
          zh: '通量是每时间的物质量；浓度是每体积物质量，不能混用。',
          en: 'Flux is amount per time; concentration is amount per volume, a different quantity.',
        },
        revisit: {
          zh: '回I01通量与S/P各自的单位。',
          en: 'Return to the separate I01 flux and S/P units.',
        },
      },
    ],
    mission: {
      zh: '为一条虚构路径提交敏感/不敏感对照证据、通量计算及活动调控与表达调控的区别。',
      en: 'Submit sensitive/insensitive control evidence, a flux calculation and the distinction between activity and expression regulation.',
    },
    reference: {
      title: 'OpenStax Biology 2e · Enzymes and feedback inhibition',
      url: 'https://openstax.org/books/biology-2e/pages/6-5-enzymes',
    },
  },
];
