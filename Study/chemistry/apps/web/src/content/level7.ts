import type { Lesson } from './lessons';

export const level7Lessons = [
  {
    id: 'what-is-a-chemical-reaction',
    levelId: 'reactions',
    order: 37,
    title: {
      zh: '化学反应：原子换队，不会消失',
      en: 'Chemical reactions: atoms change teams, not disappear',
    },
    eyebrow: {
      zh: '第 37 课 · 从现象走进反应本质',
      en: 'Lesson 37 · From visible clues to what reactions really do',
    },
    hook: {
      zh: '泡腾片放进水里会冒出大量气泡。气体原本是“藏”在药片里，还是原子重新组合后才形成的新物质？',
      en: 'Drop an effervescent tablet into water and bubbles rush out. Was the gas hidden inside, or did atoms rearrange to form a new substance?',
    },
    hookHint: {
      zh: '化学反应不是把旧物质凭空抹掉、再制造新原子，而是拆开一些旧连接，让同一批原子以新的组合形成产物。',
      en: 'A reaction does not erase old matter and create new atoms. It breaks some old connections and rearranges the same atoms into products.',
    },
    bigIdea: {
      zh: '化学反应中原子重新排列、化学键发生变化并形成新物质；每种原子的总数仍然守恒。',
      en: 'In a chemical reaction, atoms rearrange and bonds change to form new substances, while the total number of each type of atom is conserved.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🍞',
        title: { zh: '烤面包的香味与颜色', en: 'Toast aroma and browning' },
        body: {
          zh: '受热时，面包表面发生许多反应，形成新的棕色物质和香味分子。颜色与气味变化是线索，但真正关键是出现了新物质。',
          en: 'Heating triggers many reactions on bread, forming new brown substances and aroma molecules. Colour and smell are clues; the key is that new substances form.',
        },
      },
      {
        icon: '🫧',
        title: { zh: '泡腾片产生 CO₂', en: 'CO₂ from an effervescent tablet' },
        body: {
          zh: '片中的成分溶于水后反应，生成二氧化碳气体。气泡是反应证据之一；在敞口杯里，气体逸出还会让测得的质量变小。',
          en: 'Ingredients dissolve and react in water to make carbon dioxide. Bubbles are one clue; in an open cup, escaping gas also lowers the measured mass.',
        },
      },
      {
        icon: '🔥',
        title: {
          zh: '暖手包中的缓慢氧化',
          en: 'Slow oxidation in hand warmers',
        },
        body: {
          zh: '一次性暖手包里的铁与空气中的氧逐渐反应并释放能量。温度上升说明能量转移，也帮助我们发现反应正在发生。',
          en: 'Iron in a disposable hand warmer slowly reacts with oxygen and releases energy. The temperature rise reveals energy transfer and helps signal a reaction.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '反应物的原子没有被删除',
          en: 'Reactant atoms are not deleted',
        },
        body: {
          zh: '反应开始前的物质叫反应物，形成的新物质叫生成物。以 2H₂ + O₂ → 2H₂O 为例，反应前后都是 4 个 H 与 2 个 O，只是连接方式改变。',
          en: 'Starting substances are reactants and new substances are products. In 2H₂ + O₂ → 2H₂O, both sides contain four H and two O atoms; only their connections change.',
        },
      },
      {
        title: {
          zh: '断开旧键、形成新键会伴随能量变化',
          en: 'Breaking old bonds and forming new ones involves energy',
        },
        body: {
          zh: '原子重新组合需要一些旧键断开、新键形成。反应可能放热、吸热、发光或发声；这些不是额外产生的物质，而是能量转移的表现。',
          en: 'Rearrangement requires some old bonds to break and new bonds to form. Reactions may heat, cool, glow or make sound—signs of energy transfer, not extra matter.',
        },
      },
      {
        title: {
          zh: '现象是线索，不是单独的“判决书”',
          en: 'Observations are clues, not automatic proof',
        },
        body: {
          zh: '冒泡、变色、出现固体或温度变化都可能提示反应，但物理变化也能产生相似现象，例如沸水也会冒泡。要结合物质身份与多项证据判断是否生成了新物质。',
          en: 'Bubbles, colour change, solids or temperature shifts can suggest reaction, but physical changes can look similar—boiling water also bubbles. Use several clues and ask whether new substances formed.',
        },
      },
    ],
    misconception: {
      zh: '敞口容器里反应后质量变小，不代表原子消失。若生成气体并逸出，天平只称到了留下的部分；把整个反应系统密闭起来，总质量仍保持不变。',
      en: 'A lower mass after an open-cup reaction does not mean atoms vanished. If gas escapes, the balance weighs only what remains; in a closed system, total mass stays constant.',
    },
    mission: {
      zh: '做一次安全的“苹果反应观察”：切开的苹果一半直接放置，另一半表面涂少量柠檬汁，每 5 分钟比较颜色并记录。只用可食用材料和干净工具；解释为什么颜色变化是反应线索，以及柠檬汁怎样减慢它。',
      en: 'Try a safe apple-reaction observation: leave half a cut apple exposed and coat the other half with a little lemon juice. Compare colour every five minutes. Use clean food-safe tools; explain why browning is a reaction clue and how lemon slows it.',
    },
    vocabulary: [
      { en: 'chemical reaction', zh: '化学反应' },
      { en: 'reactant', zh: '反应物' },
      { en: 'product', zh: '生成物' },
      { en: 'rearrangement', zh: '重新排列' },
      { en: 'conservation of atoms', zh: '原子守恒' },
    ],
    interactive: 'reaction-rearrangement-lab',
    questions: [
      {
        id: 'reaction-q1',
        prompt: {
          zh: '从粒子角度看，化学反应最准确的描述是什么？',
          en: 'Which particle-level description of a chemical reaction is most accurate?',
        },
        options: [
          {
            zh: '旧原子消失，新原子凭空出现',
            en: 'Old atoms vanish and new atoms appear from nowhere',
          },
          {
            zh: '同一批原子改变连接方式，形成新物质',
            en: 'The same atoms reconnect in new ways to form new substances',
          },
          {
            zh: '所有原子只改变位置，但化学键永远不变',
            en: 'Atoms move position but their bonds never change',
          },
        ],
        answer: 1,
        explanation: {
          zh: '反应会断开和形成化学键，使同一批原子重新排列成不同粒子；原子种类和总数不会凭空改变。',
          en: 'Bonds break and form, rearranging the same atoms into different particles. Atom types and totals do not appear or disappear.',
        },
      },
      {
        id: 'reaction-q2',
        prompt: {
          zh: '看到液体冒泡时，怎样判断它是否发生了化学反应？',
          en: 'When a liquid bubbles, how should you decide whether a reaction occurred?',
        },
        options: [
          { zh: '只要冒泡就一定是反应', en: 'Bubbles always prove a reaction' },
          {
            zh: '结合温度、物质身份等证据，判断是否形成新气体',
            en: 'Combine clues and substance identity to decide whether a new gas formed',
          },
          {
            zh: '冒泡永远只是物理变化',
            en: 'Bubbling is always a physical change',
          },
        ],
        answer: 1,
        explanation: {
          zh: '沸腾也会冒泡，所以气泡只是线索。若原有物质经过反应生成新的气体，并有其他证据支持，才是化学反应。',
          en: 'Boiling also bubbles, so bubbles alone are only a clue. A reaction is supported when the starting substances form a new gas and other evidence agrees.',
        },
      },
      {
        id: 'reaction-q3',
        prompt: {
          zh: '在 2H₂ + O₂ → 2H₂O 中，反应前后各有多少个 H 和 O 原子？',
          en: 'In 2H₂ + O₂ → 2H₂O, how many H and O atoms are on each side?',
        },
        options: [
          { zh: 'H：2，O：1', en: 'H: 2, O: 1' },
          { zh: 'H：4，O：2', en: 'H: 4, O: 2' },
          { zh: 'H：4，O：1', en: 'H: 4, O: 1' },
        ],
        answer: 1,
        explanation: {
          zh: '左边 2H₂ 含 4 个 H，O₂ 含 2 个 O；右边 2H₂O 也含 4 个 H 与 2 个 O，原子数完全对应。',
          en: 'On the left, 2H₂ contains four H and O₂ contains two O. On the right, 2H₂O also contains four H and two O.',
        },
      },
      {
        id: 'reaction-q4',
        prompt: {
          zh: '泡腾片在敞口杯中反应后，杯中质量变小，最合理的解释是什么？',
          en: 'An effervescent tablet reacts in an open cup and the cup loses mass. What best explains this?',
        },
        options: [
          {
            zh: '一部分原子被反应消灭了',
            en: 'The reaction destroyed some atoms',
          },
          {
            zh: '生成的气体逃出了称量范围',
            en: 'A gaseous product escaped the weighed system',
          },
          {
            zh: '质量守恒只适用于固体',
            en: 'Conservation of mass applies only to solids',
          },
        ],
        answer: 1,
        explanation: {
          zh: '逸出的 CO₂ 仍然带着质量，只是离开了杯子和天平的称量范围；若密闭并称量整个系统，总质量不变。',
          en: 'Escaping CO₂ still has mass, but it left the cup and the weighed system. In a closed system, total mass remains unchanged.',
        },
      },
    ],
  },
  {
    id: 'reading-chemical-equations',
    levelId: 'reactions',
    order: 38,
    title: {
      zh: '读懂化学方程式：一行小小的反应地图',
      en: 'Reading chemical equations: a tiny map of a reaction',
    },
    eyebrow: {
      zh: '第 38 课 · 让符号说清楚过程',
      en: 'Lesson 38 · Let symbols tell the whole story',
    },
    hook: {
      zh: '食谱里的“2 个鸡蛋”不是“鸡蛋有两个蛋壳”。同样，2H₂ 里的前面 2 和右下角 ₂，也在说两件完全不同的事。你能把这张反应地图读出来吗？',
      en: 'In a recipe, “2 eggs” does not mean each egg has two shells. Likewise, the front 2 and the tiny lower ₂ in 2H₂ tell two different stories. Can you read this reaction map?',
    },
    hookHint: {
      zh: '把方程式当成一句极简的“物质故事”：左边是谁出发，箭头表示发生变化，右边是谁形成；前面的系数数“几份”，右下角的下标数“一份里有几个原子”。',
      en: 'Treat an equation as a super-short material story: who starts on the left, what the arrow means, and who forms on the right. A front coefficient counts packages; a lower subscript counts atoms inside one package.',
    },
    bigIdea: {
      zh: '化学方程式用“反应物 → 生成物”记录原子重新组合；系数乘整份化学式，下标只数一份粒子里的原子。',
      en: 'A chemical equation records atom rearrangement as “reactants → products”; a coefficient multiplies a whole formula, while a subscript counts atoms within one particle.',
    },
    estimatedMinutes: 18,
    everydayExamples: [
      {
        icon: '🍳',
        title: { zh: '食谱的份数', en: 'Recipe portions' },
        body: {
          zh: '“2 个三明治”表示两份完整三明治；系数也一样，2H₂ 是两份完整的氢分子，每份里本来就有 2 个 H。',
          en: '“Two sandwiches” means two complete sandwiches. Likewise, 2H₂ means two complete hydrogen molecules, each already containing two H atoms.',
        },
      },
      {
        icon: '🧭',
        title: { zh: '箭头是一张路线图', en: 'An arrow is a route marker' },
        body: {
          zh: '方程式中的箭头读作“生成”或“变成”。它不是等号，也不表示左边和右边是同一种物质。',
          en: 'Read the arrow as “forms” or “becomes.” It is not an equals sign and does not say the left and right are the same substance.',
        },
      },
      {
        icon: '🫧',
        title: { zh: '泡腾片的简写故事', en: 'A shorthand story for bubbles' },
        body: {
          zh: '科学家用方程式把“固体进水、出现气泡、得到新物质”的过程压缩成一行。但一行符号背后仍是可观察、可测量的真实变化。',
          en: 'Scientists compress “solid into water, bubbles appear, new materials form” into one line. Behind the symbols is still a real, observable, measurable change.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先沿着箭头读故事',
          en: 'Read the story along the arrow first',
        },
        body: {
          zh: '在 2H₂ + O₂ → 2H₂O 中，左边的 H₂ 与 O₂ 是反应物，右边的 H₂O 是生成物。“+”读作“和/与”，箭头读作“生成”。先别急着算数，先知道谁变成了谁。',
          en: 'In 2H₂ + O₂ → 2H₂O, H₂ and O₂ on the left are reactants, and H₂O on the right is the product. Read “+” as “and” and the arrow as “forms.” First see who becomes what.',
        },
      },
      {
        title: {
          zh: '下标：打开一份粒子看里面',
          en: 'Subscripts: look inside one particle',
        },
        body: {
          zh: 'H₂ 中的下标 ₂ 只紧贴 H，表示每一份 H₂ 含 2 个氢原子。H₂O 则表示每一份水分子含 2 个 H 和 1 个 O；没有写下标就默认是 1。',
          en: 'The lower ₂ in H₂ hugs H and says each H₂ particle has two H atoms. H₂O means each water molecule has two H and one O; no written subscript means one.',
        },
      },
      {
        title: {
          zh: '系数：把整份化学式一起乘',
          en: 'Coefficients: multiply the whole formula',
        },
        body: {
          zh: '2H₂ 里的 2 表示两份 H₂，所以氢原子总数是 2 × 2 = 4。它同时乘整份化学式；例如 2H₂O 含 4 个 H 和 2 个 O。系数不能随意改成下标，否则物质身份会变。',
          en: 'The 2 in 2H₂ means two H₂ particles, so total H atoms are 2 × 2 = 4. It multiplies the whole formula: 2H₂O has four H and two O. Do not swap a coefficient for a subscript—the substance changes.',
        },
      },
    ],
    misconception: {
      zh: '2H₂ 和 H₄ 不是同一个意思。2H₂ 是两份氢分子；H₄ 会暗示每一份粒子里有 4 个氢原子，是另一种写法、也代表另一种粒子。配平方程式时只调整系数，不改已经确定物质身份的下标。',
      en: '2H₂ and H₄ do not mean the same thing. 2H₂ is two hydrogen molecules; H₄ would claim four H atoms in each particle—a different particle. When balancing, change coefficients, never the fixed subscripts that define substances.',
    },
    mission: {
      zh: '“口述方程式”挑战：对着 2H₂ + O₂ → 2H₂O，先不用说原子数，完整读一遍“谁和谁生成谁”；再分别指出一个系数和一个下标，并用“几份”“每份几个”解释它们。能说出来，才是真的读懂。',
      en: 'Try the “say the equation” challenge with 2H₂ + O₂ → 2H₂O. First say who and what forms what without counting. Then point out one coefficient and one subscript, explaining them as “how many packages” and “how many inside each.”',
    },
    vocabulary: [
      { en: 'chemical equation', zh: '化学方程式' },
      { en: 'coefficient', zh: '系数' },
      { en: 'subscript', zh: '下标' },
      { en: 'reactant', zh: '反应物' },
      { en: 'product', zh: '生成物' },
    ],
    interactive: 'equation-reader-lab',
    questions: [
      {
        id: 'equation-q1',
        prompt: {
          zh: '在 3CO₂ 中，开头的 3 最准确表示什么？',
          en: 'In 3CO₂, what does the opening 3 most accurately mean?',
        },
        options: [
          { zh: '每份 CO₂ 里有 3 个 C', en: 'Each CO₂ has three C atoms' },
          {
            zh: '有 3 份完整的 CO₂',
            en: 'There are three whole CO₂ particles or formula units',
          },
          { zh: '氧原子变成 3 个', en: 'The oxygen atoms become three' },
        ],
        answer: 1,
        explanation: {
          zh: '前面的数字是系数，数整份化学式。3CO₂ 表示 3 份 CO₂；每一份仍有 1 个 C 和 2 个 O。',
          en: 'A front number is a coefficient and counts whole formulas. 3CO₂ means three CO₂ units; each still has one C and two O.',
        },
      },
      {
        id: 'equation-q2',
        prompt: {
          zh: '2H₂O 一共含有多少个 H 原子和 O 原子？',
          en: 'How many H and O atoms are in total in 2H₂O?',
        },
        options: [
          { zh: 'H：2，O：1', en: 'H: 2, O: 1' },
          { zh: 'H：2，O：2', en: 'H: 2, O: 2' },
          { zh: 'H：4，O：2', en: 'H: 4, O: 2' },
        ],
        answer: 2,
        explanation: {
          zh: '每份 H₂O 有 2 个 H、1 个 O；前面的 2 要乘整份，所以得到 H：2×2=4，O：2×1=2。',
          en: 'Each H₂O has two H and one O. The front 2 multiplies the whole formula: H is 2×2=4 and O is 2×1=2.',
        },
      },
      {
        id: 'equation-q3',
        prompt: {
          zh: '在 H₂ + O₂ → H₂O 这张“反应地图”中，箭头最合适读作什么？',
          en: 'In the reaction map H₂ + O₂ → H₂O, how should the arrow be read?',
        },
        options: [
          { zh: '等于', en: 'equals' },
          { zh: '生成 / 变成', en: 'forms / becomes' },
          { zh: '比……更重', en: 'is heavier than' },
        ],
        answer: 1,
        explanation: {
          zh: '箭头告诉我们反应方向：左边的反应物经过反应形成右边的生成物。它不是数学等号。',
          en: 'The arrow gives the reaction direction: reactants on the left form products on the right. It is not a mathematical equals sign.',
        },
      },
      {
        id: 'equation-q4',
        prompt: {
          zh: '为什么配平方程式时可以改系数，却不能把 H₂O 改写成 HO？',
          en: 'Why may balancing change coefficients, but not rewrite H₂O as HO?',
        },
        options: [
          {
            zh: '系数改变份数；下标会改变每份粒子的组成和物质身份',
            en: 'Coefficients change the number of packages; subscripts change what each particle is and thus the substance',
          },
          {
            zh: '因为下标在视觉上比较小',
            en: 'Because subscripts are visually smaller',
          },
          {
            zh: '两种改法总会得到完全一样的原子数',
            en: 'Both changes always give exactly the same atom totals',
          },
        ],
        answer: 0,
        explanation: {
          zh: 'H₂O 是水，每份有 2 个 H 和 1 个 O；HO 的每份组成不同。系数只说拿几份水，不会改变水分子的身份。',
          en: 'H₂O is water, with two H and one O in each particle; HO has a different composition. A coefficient only says how many water particles are present.',
        },
      },
    ],
  },
  {
    id: 'balancing-equations',
    levelId: 'reactions',
    order: 39,
    title: {
      zh: '配平化学方程式：像核对两边的积木',
      en: 'Balancing equations: checking the same bricks on both sides',
    },
    eyebrow: {
      zh: '第 39 课 · 用守恒做一场公平核对',
      en: 'Lesson 39 · A fair check using conservation',
    },
    hook: {
      zh: '把 4 块蓝色积木和 2 块橙色积木重新拼成两座小房子，两边都必须用到同样的积木。化学方程式配平也是这样：不是让等式“好看”，而是核对原子有没有被如实记账。',
      en: 'If four blue bricks and two orange bricks are rebuilt into two small houses, both sides must use the same bricks. Balancing is not decoration; it is honest atom bookkeeping.',
    },
    hookHint: {
      zh: '反应没有制造或销毁元素原子，所以方程式两边每种原子的数量必须相等。只调整化学式前的系数，绝不修改下标。',
      en: 'Reactions do not create or destroy element atoms, so each atom type must total the same on both sides. Adjust only front coefficients—never subscripts.',
    },
    bigIdea: {
      zh: '配平方程式就是选择合适的系数，让箭头两边每种元素的原子总数完全相等，同时不改变任何物质的化学式。',
      en: 'Balancing means choosing coefficients so every element has equal atom totals on both sides, without changing any chemical formula.',
    },
    estimatedMinutes: 20,
    everydayExamples: [
      {
        icon: '🧱',
        title: { zh: '积木只会换位置', en: 'Bricks only move around' },
        body: {
          zh: '拆开一座积木城堡、拼成另一座，积木的颜色和总数不该改变。原子在反应里也只改变组合方式。',
          en: 'Take apart one brick castle and rebuild another: colours and totals do not change. Atoms in a reaction only change their grouping.',
        },
      },
      {
        icon: '🍪',
        title: {
          zh: '份数可以变，配方不能乱改',
          en: 'Portions change; the recipe does not',
        },
        body: {
          zh: '要做两份饼干，可以把每种材料的份数加倍；但不能把“2 个鸡蛋”改成“1 个鸡蛋”还说是同一份配方。系数改份数，下标定义组成。',
          en: 'To make two batches, double every portion. But changing “two eggs” to “one egg” changes the recipe. Coefficients change portions; subscripts define composition.',
        },
      },
      {
        icon: '💧',
        title: {
          zh: '水的形成可以被清点',
          en: 'Water formation can be counted',
        },
        body: {
          zh: '2H₂ + O₂ → 2H₂O 的两边都有 4 个 H 和 2 个 O。方程式精确记录了原子账本。',
          en: '2H₂ + O₂ → 2H₂O has four H and two O atoms on each side. The equation records the atom ledger precisely.',
        },
      },
    ],
    steps: [
      {
        title: {
          zh: '先写对物质，再开始数',
          en: 'Write the correct substances, then count',
        },
        body: {
          zh: '先确认 H₂、O₂、H₂O 这些化学式正确。下标是物质的“身份卡”，不能为了凑数而修改。',
          en: 'First confirm formulas such as H₂, O₂ and H₂O. Subscripts are a substance’s identity card and are never altered just to make numbers fit.',
        },
      },
      {
        title: { zh: '把每种元素分开清点', en: 'Count one element at a time' },
        body: {
          zh: '对 H₂ + O₂ → H₂O，先数 H：左 2、右 2；再数 O：左 2、右 1。氧还不相等，所以还没配平。',
          en: 'For H₂ + O₂ → H₂O, count H: 2 left and 2 right. Then O: 2 left and 1 right. Oxygen does not match yet.',
        },
      },
      {
        title: {
          zh: '用最小整数系数反复核对',
          en: 'Use the smallest whole-number coefficients and recheck',
        },
        body: {
          zh: '在 H₂O 前放 2，右边变成 H：4、O：2；于是 H₂ 前也放 2，左边 H：4、O：2。每改一次系数，都要重新数所有元素。',
          en: 'Put 2 before H₂O: the right becomes H: 4, O: 2. Then put 2 before H₂: the left becomes H: 4, O: 2. Recount every element after each coefficient change.',
        },
      },
    ],
    misconception: {
      zh: '“把 H₂O 改成 H₂O₂ 就能让氧变多”是错误的。H₂O₂ 是过氧化氢，不是水；你换掉了物质，而不是配平。配平只能在化学式前加系数。',
      en: '“Change H₂O to H₂O₂ to get more oxygen” is wrong. H₂O₂ is hydrogen peroxide, not water; you changed the substance instead of balancing it. Balance only by adding coefficients.',
    },
    mission: {
      zh: '家庭“原子账本”练习：看 2H₂ + O₂ → 2H₂O，用手指分别报出左边与右边的 H 数、O 数。再把前面的 2 暂时遮住，观察哪一种原子先对不上。',
      en: 'Try a home “atom ledger”: look at 2H₂ + O₂ → 2H₂O and report H and O totals on both sides. Then cover the front 2s and see which atom count first stops matching.',
    },
    vocabulary: [
      { en: 'balanced equation', zh: '已配平的方程式' },
      { en: 'coefficient', zh: '系数' },
      { en: 'conservation of atoms', zh: '原子守恒' },
      { en: 'smallest whole-number ratio', zh: '最小整数比' },
    ],
    interactive: 'equation-balance-lab',
    questions: [
      {
        id: 'balance-q1',
        prompt: {
          zh: '下列哪一个方程式的 H 与 O 原子数已经两边相等？',
          en: 'Which equation has equal H and O atom totals on both sides?',
        },
        options: [
          { zh: 'H₂ + O₂ → H₂O', en: 'H₂ + O₂ → H₂O' },
          { zh: '2H₂ + O₂ → 2H₂O', en: '2H₂ + O₂ → 2H₂O' },
          { zh: 'H₂ + O₂ → H₂O₂', en: 'H₂ + O₂ → H₂O₂' },
        ],
        answer: 1,
        explanation: {
          zh: '选 B：两边都是 H：4、O：2。A 的氧数不等；C 虽然原子数相等，却把水错误换成了另一种物质 H₂O₂。',
          en: 'Choose B: both sides have H: 4 and O: 2. A has unequal oxygen totals; C wrongly replaces water with a different substance, H₂O₂.',
        },
      },
      {
        id: 'balance-q2',
        prompt: {
          zh: '把 H₂O 前面的系数改为 2 后，下一步最需要做什么？',
          en: 'After placing 2 before H₂O, what should you do next?',
        },
        options: [
          {
            zh: '把水写成 H₂O₂，让氧更多',
            en: 'Rewrite water as H₂O₂ to add oxygen',
          },
          {
            zh: '重新数两边原子，并用系数调整 H₂ 的份数',
            en: 'Recount both sides and adjust the number of H₂ packages with a coefficient',
          },
          { zh: '把箭头改成等号', en: 'Change the arrow into an equals sign' },
        ],
        answer: 1,
        explanation: {
          zh: '2H₂O 使右边成为 H：4、O：2；氧已对齐，但氢还差，所以把 H₂ 前的系数改为 2，再次核对。',
          en: '2H₂O gives H: 4 and O: 2 on the right. Oxygen now matches, but hydrogen does not, so place 2 before H₂ and check again.',
        },
      },
      {
        id: 'balance-q3',
        prompt: {
          zh: '配平时为什么使用最小整数系数？',
          en: 'Why use the smallest whole-number coefficients?',
        },
        options: [
          {
            zh: '它给出最简洁的实际原子比例，避免把同一答案无意义地整体放大',
            en: 'It gives the simplest atom ratio and avoids needlessly scaling the same answer up',
          },
          {
            zh: '因为更大的系数会改变下标',
            en: 'Because larger coefficients change subscripts',
          },
          {
            zh: '因为所有反应都只能有两个生成物',
            en: 'Because every reaction can have only two products',
          },
        ],
        answer: 0,
        explanation: {
          zh: '4H₂ + 2O₂ → 4H₂O 也数得平，但所有系数都可同时除以 2。2、1、2 是同一比例的最简整数写法。',
          en: '4H₂ + 2O₂ → 4H₂O also counts equally, but every coefficient can be divided by two. 2, 1, 2 is the simplest whole-number form.',
        },
      },
      {
        id: 'balance-q4',
        prompt: {
          zh: '“原子守恒”在配平方程式中最直接意味着什么？',
          en: 'What does “conservation of atoms” require when balancing?',
        },
        options: [
          {
            zh: '每种元素在箭头两边的原子总数相等',
            en: 'Each element has the same total number of atoms on both sides',
          },
          {
            zh: '两边必须有相同数量的化学式',
            en: 'Both sides must contain the same number of formulas',
          },
          {
            zh: '反应前后所有分子都保持不变',
            en: 'All molecules remain unchanged before and after reaction',
          },
        ],
        answer: 0,
        explanation: {
          zh: '粒子会重新组合，所以化学式和分子数可能变化；守恒的是每种元素原子的总数。',
          en: 'Particles can regroup, so formulas and molecule counts can change. What is conserved is each element’s total atom count.',
        },
      },
    ],
  },
] satisfies Lesson[];
