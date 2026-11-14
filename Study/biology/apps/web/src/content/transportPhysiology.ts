import { t, q, term, type Lesson } from '../schema';
export const transportPhysiologyLessons: Lesson[] = [
  {
    id: 'L097',
    title: t('细胞膜的结构模型', 'Membrane Structure'),
    hook: t(
      '氧气和更小的钠离子一起到达膜，为什么小的离子反而不容易直接穿过？',
      'Oxygen and a smaller sodium ion reach a membrane. Why may the smaller ion have more difficulty crossing directly?',
    ),
    minutes: 35,
    icon: '◈',
    summary: t('细胞膜的结构模型', 'Membrane Structure'),
    objectives: [
      t(
        '画出磷脂双层，解释两侧头部与内部尾部的方向。',
        'Draw a phospholipid bilayer and explain head and tail orientation.',
      ),
      t(
        '用分子性质和匹配蛋白预测通透性，而不只看大小。',
        'Predict permeability using molecular properties and matching proteins, not size alone.',
      ),
      t(
        '用对照证据区分动态膜模型与固定墙模型。',
        'Use controlled evidence to distinguish a dynamic membrane from a fixed wall.',
      ),
    ],
    prediction: [
      t('任何小分子都能直接穿膜', 'Any small molecule crosses directly'),
      t(
        '疏水核心与蛋白共同决定选择性',
        'The hydrophobic core and proteins shape selectivity',
      ),
      t('膜蛋白完全固定不动', 'Membrane proteins are completely fixed'),
    ],
    terms: [
      term(
        '磷脂',
        'phospholipid',
        '具有亲水头与疏水尾的膜脂分子。',
        'Membrane lipid with a hydrophilic head and hydrophobic tails.',
      ),
      term(
        '双层',
        'bilayer',
        '两层磷脂的尾部相向组成的结构。',
        'Two phospholipid layers with tails facing inward.',
      ),
      term(
        '亲水',
        'hydrophilic',
        '可与水形成有利相互作用。',
        'Forms favourable interactions with water.',
      ),
      term(
        '疏水',
        'hydrophobic',
        '与水接触不利的性质。',
        'A property making contact with water unfavourable.',
      ),
      term(
        '流动镶嵌模型',
        'fluid mosaic model',
        '脂质和蛋白构成动态而非全部固定的膜。',
        'A dynamic membrane of lipids and proteins, not entirely fixed.',
      ),
      term(
        '选择透过性',
        'selective permeability',
        '不同物质跨膜难易不同。',
        'Different substances cross with different ease.',
      ),
      term(
        '通道蛋白',
        'channel protein',
        '为特定物质提供亲水通路的蛋白。',
        'Protein providing a hydrophilic route for particular substances.',
      ),
    ],
    questions: [
      q(
        'L097-q1',
        'concept',
        t('磷脂双层的正确方向是什么？', 'How are phospholipids oriented?'),
        [
          t(
            '头朝两侧水、尾相向',
            'Heads face water on both sides; tails inward',
          ),
          t('尾朝两侧水、头在中央', 'Tails face water; heads at centre'),
          t('所有头都只朝细胞外', 'All heads face only outward'),
        ],
        0,
        t(
          '内外都有水，因此两侧都需要亲水表面；疏水尾形成内部。把膜画成单排会遗漏内侧水环境。',
          'Both sides contain water, requiring hydrophilic surfaces; tails form the core. A single row omits the inner watery environment.',
        ),
        t(
          '回图找两排蓝头及中央黄尾。',
          'Find both blue head rows and the yellow core.',
        ),
      ),
      q(
        'L097-q2',
        'concept',
        t(
          '小离子不易直接穿脂质核心，主要说明什么？',
          'Why does a small ion not readily cross the lipid core?',
        ),
        [
          t('只有大小决定透过', 'Size alone determines crossing'),
          t(
            '电荷与疏水核心的相互作用很重要',
            'Charge and interactions with the hydrophobic core matter',
          ),
          t('所有膜都没有蛋白', 'All membranes lack proteins'),
        ],
        1,
        t(
          '带电粒子跨疏水核心有障碍；小不保证易通过。膜蛋白可提供选择性通路，但并非无蛋白。',
          'Charge creates a barrier in the hydrophobic core; small does not guarantee passage. Membranes can contain selective transport proteins.',
        ),
        t(
          '保持离子不变，对照有无匹配蛋白。',
          'Keep the ion and compare matching-protein presence.',
        ),
      ),
      q(
        'L097-q3',
        'reasoning',
        t(
          '为检验离子通道的作用，哪组比较最有力？',
          'Which comparison best tests an ion channel’s role?',
        ),
        [
          t('同时更换离子和温度', 'Change ion and temperature together'),
          t(
            '比较氧气与离子而不控制膜',
            'Compare oxygen and ions using different membranes',
          ),
          t(
            '相同离子、面积、梯度与温度，只改变匹配通道',
            'Same ion, area, gradient and temperature; vary only matching channel',
          ),
        ],
        2,
        t(
          '只改变目标因素减少其他解释；换分子或温度会同时改变通透性条件。模型结果仍需真实实验检验。',
          'Varying only the target factor reduces alternatives. Changing substance or temperature changes other permeability conditions; model results still require experimental testing.',
        ),
        t(
          '回图和静态结构表，说明通道提供了哪条路径。',
          'Use the figure and structural table to identify the added route.',
        ),
      ),
      q(
        'L097-q4',
        'vocabulary',
        t(
          'fluid mosaic model中的fluid指什么？',
          'What does fluid mean in fluid mosaic model?',
        ),
        [
          t('膜整体是水', 'The membrane is made entirely of water'),
          t(
            '许多组分可侧向移动，部分受锚定',
            'Many components move laterally; some are anchored',
          ),
          t('每个蛋白完全固定', 'Every protein is fixed'),
        ],
        1,
        t(
          '流动性是组分的动态性质；不等于膜是纯水，也不要求每个蛋白都同样自由。',
          'Fluidity describes dynamic components, not pure water or unrestricted movement of every protein.',
        ),
        t(
          '回图右下“蛋白可侧向移动”，再读Depth中的锚定。',
          'Revisit lateral movement and anchored proteins.',
        ),
      ),
    ],
    mission: t(
      '画同一张膜的两种有控制对照，解释氧气与离子的差别。标出结构、证据、一个模型省略项。',
      'Draw two controlled versions of one membrane and explain oxygen versus ion passage. Label structures, evidence and one omission.',
    ),
    reference: {
      title: 'OpenStax — Components and Structure',
      url: 'https://openstax.org/books/biology-2e/pages/5-1-components-and-structure',
    },
  },
  {
    id: 'L098',
    title: t('扩散与浓度梯度', 'Concentration Gradients'),
    hook: t(
      '两侧粒子一样多时，看不见净变化，是否意味着所有粒子都停下了？',
      'If both sides contain equal amounts and show no net change, have all particles stopped?',
    ),
    minutes: 35,
    icon: '◈',
    summary: t('扩散与浓度梯度', 'Concentration Gradients'),
    objectives: [
      t(
        '用双向随机运动解释净扩散方向。',
        'Explain net diffusion through two-way random movement.',
      ),
      t(
        '从双室表计算双向量、净量并检查总量守恒。',
        'Calculate two-way and net transfer and verify conservation.',
      ),
      t(
        '解释平衡与膜通透性对结果的不同限制。',
        'Explain equilibrium and the separate constraint of permeability.',
      ),
    ],
    prediction: [
      t(
        '粒子只会从多的一侧走向少的一侧',
        'Particles move only from the crowded side',
      ),
      t(
        '双向都有运动，但净量可不同',
        'Movement occurs both ways, with unequal net transfer',
      ),
      t('浓度相等时粒子不再运动', 'Equal concentrations stop particle motion'),
    ],
    terms: [
      term(
        '扩散',
        'diffusion',
        '随机运动造成物质顺梯度的净分散。',
        'Net spreading down a gradient arising from random motion.',
      ),
      term(
        '浓度梯度',
        'concentration gradient',
        '不同位置间同种物质浓度的变化。',
        'Change in concentration of one substance across positions.',
      ),
      term(
        '净移动',
        'net movement',
        '一个方向的量减去反方向的量。',
        'Transfer in one direction minus the reverse transfer.',
      ),
      term(
        '动态平衡',
        'dynamic equilibrium',
        '相反过程持续发生且平均速率相等。',
        'Opposite processes continue at equal average rates.',
      ),
      term(
        '通透性',
        'permeability',
        '屏障允许某种物质通过的程度。',
        'How readily a barrier lets a substance cross.',
      ),
      term(
        '守恒',
        'conservation',
        '封闭且无反应时同种物质总量不变。',
        'An unchanged total amount in a closed non-reacting system.',
      ),
    ],
    questions: [
      q(
        'L098-q1',
        'concept',
        t(
          '16/4第一步两向4与1，净量是多少？',
          'With transfers 4 and 1, what is first-step net transfer?',
        ),
        [
          t('5，左向右', '5, left to right'),
          t('3，左向右', '3, left to right'),
          t('4，且无反向运动', '4, with no reverse movement'),
        ],
        1,
        t(
          '净量为4−1=3；5是两向交换总量。反向1必须计入。',
          'Net transfer is 4−1=3; 5 is gross two-way exchange. Reverse transfer must be counted.',
        ),
        t(
          '回全表第1步，核对13+7=20。',
          'Check ledger step 1 and verify 13+7=20.',
        ),
      ),
      q(
        'L098-q2',
        'concept',
        t(
          '平衡时为什么仍能交换？',
          'Why can exchange continue at equilibrium?',
        ),
        [
          t(
            '双向平均量相等，净量为零',
            'Equal average two-way amounts give zero net transfer',
          ),
          t('粒子不再有动能', 'Particles lose all kinetic energy'),
          t('膜必须完全封闭', 'The membrane must be sealed'),
        ],
        0,
        t(
          '动态平衡仍有运动；封闭通路造成的零跨膜交换不是同一机制。',
          'Dynamic equilibrium retains motion; a blocked route gives zero exchange by a different mechanism.',
        ),
        t(
          '选择10/10并查看两向2.5。',
          'Choose 10/10 and inspect the two transfers of 2.5.',
        ),
      ),
      q(
        'L098-q3',
        'reasoning',
        t(
          '密闭等体积模型第一步后左13右7，下一步净左→右应是多少？',
          'After 13/7, what is the next net left-to-right transfer?',
        ),
        [
          t(
            '仍是3，因为初始梯度不变',
            'Still 3 because the initial gradient stays fixed',
          ),
          t(
            '5，因为总量20的1/4交换',
            '5 because one quarter of total 20 transfers',
          ),
          t('1.5，因为13/4−7/4', '1.5 because 13/4−7/4'),
        ],
        2,
        t(
          '两侧现有量决定下一步双向3.25与1.75，净1.5。总量守恒不表示每步净量不变。',
          'Current amounts give 3.25 and 1.75, net 1.5. Conservation does not require a constant net transfer.',
        ),
        t(
          '回表第2步，比较梯度缩小。',
          'Inspect step 2 as the gradient declines.',
        ),
      ),
      q(
        'L098-q4',
        'vocabulary',
        t(
          'concentration gradient指什么？',
          'What is a concentration gradient?',
        ),
        [
          t(
            '同种物质浓度随位置的变化',
            'A change in one substance’s concentration across positions',
          ),
          t('物质跨膜的总数量', 'Total material crossing a membrane'),
          t('所有粒子停止运动', 'All particles stopping'),
        ],
        0,
        t(
          '梯度描述空间差异，不是跨膜量，也不是平衡时运动停止。',
          'A gradient describes spatial differences, not transferred amount or motion stopping.',
        ),
        t(
          '回图先读两室体积与量。',
          'Read compartment volumes and amounts first.',
        ),
      ),
    ],
    mission: t(
      '写16/4与10/10的双向账本，再以不可透膜作对照。用一个反例解释“净0≠运动0”。',
      'Write two-way ledgers for 16/4 and 10/10, then compare an impermeable barrier. Explain with a counterexample why net 0 does not mean motion 0.',
    ),
    reference: {
      title: 'OpenStax — Passive Transport',
      url: 'https://openstax.org/books/biology-2e/pages/5-2-passive-transport',
    },
  },
  {
    id: 'L099',
    title: t('渗透与细胞反应', 'Osmosis in Cells'),
    hook: t(
      '同一外液让植物细胞与动物细胞进水，为什么后果可能不同？',
      'The same external solution causes water entry into plant and animal cells. Why may their outcomes differ?',
    ),
    minutes: 35,
    icon: '◈',
    summary: t('渗透与细胞反应', 'Osmosis in Cells'),
    objectives: [
      t(
        '从初始总水势和选择透过性预测净水流方向。',
        'Predict net water movement from initial total water potentials and selective permeability.',
      ),
      t(
        '区分膨压下降、质壁分离与动物细胞破裂的条件。',
        'Distinguish turgor loss, plasmolysis and animal-cell lysis with conditions.',
      ),
      t(
        '用质量变化数据估计零净变化条件并说明不确定性。',
        'Use mass-change data to estimate zero-net-change conditions and uncertainty.',
      ),
    ],
    prediction: [
      t('渗透是溶质主动进入细胞', 'Osmosis actively carries solute into cells'),
      t(
        '水由较高总水势向较低者净移动',
        'Water moves net from higher to lower total water potential',
      ),
      t('任何失水都等于植物质壁分离', 'Any water loss means plant plasmolysis'),
    ],
    terms: [
      term(
        '渗透',
        'osmosis',
        '水通过选择透过性膜沿总水势降低方向净移动。',
        'Net water movement across a selectively permeable membrane down total water potential.',
      ),
      term(
        '水势',
        'water potential',
        '描述水移动趋势的量，需考虑溶质和压力等。',
        'A quantity describing water movement tendency, including solute and pressure effects.',
      ),
      term(
        '膨压',
        'turgor pressure',
        '细胞内容物对细胞壁产生的压力。',
        'Pressure of cell contents against the cell wall.',
      ),
      term(
        '质壁分离',
        'plasmolysis',
        '植物充分失水时原生质体收缩离开细胞壁。',
        'Withdrawal of the protoplast from the wall after sufficient water loss.',
      ),
      term(
        '溶血',
        'haemolysis',
        '红细胞破裂释放内容物。',
        'Rupture of red blood cells, releasing contents.',
      ),
      term(
        '选择透过性膜',
        'selectively permeable membrane',
        '让水与某些物质通过而限制其他物质的屏障。',
        'A barrier passing water and some substances while restricting others.',
      ),
      term(
        '净质量变化',
        'net mass change',
        '终质量减初质量，可结合初值求百分比。',
        'Final minus initial mass; divided by initial mass for percentage change.',
      ),
    ],
    questions: [
      q(
        'L099-q1',
        'concept',
        t(
          '初始外−0.8、内−0.5 MPa，水净向哪里？',
          'With outside −0.8 and inside −0.5 MPa, where does water initially move?',
        ),
        [
          t('进细胞，因为−0.8更高', 'Into the cell because −0.8 is higher'),
          t('出细胞，从−0.5向−0.8', 'Out of the cell, from −0.5 to −0.8'),
          t('溶质代替水移动', 'Solute moves instead of water'),
        ],
        1,
        t(
          '−0.5高于−0.8；渗透定义水的净移动。方向不自动给出最终细胞状态。',
          '−0.5 is higher than −0.8. Osmosis concerns water; direction alone does not establish final cell state.',
        ),
        t(
          '回图核对初始总水势与箭头说明。',
          'Check initial total potentials and the directional caption.',
        ),
      ),
      q(
        'L099-q2',
        'concept',
        t(
          '为什么植物少量进水后不一定破裂？',
          'Why need a plant cell not rupture after modest water entry?',
        ),
        [
          t(
            '细胞壁支撑并使膨压增加',
            'The wall supports the cell as turgor rises',
          ),
          t('水不能穿植物细胞膜', 'Water cannot cross plant membranes'),
          t('植物没有细胞膜', 'Plants lack membranes'),
        ],
        0,
        t(
          '壁提供机械限制，水仍可跨膜。是否达到某终态还取决于水势、压力与时间。',
          'The wall provides mechanical constraint while water crosses the membrane. Final state depends on potentials, pressure and time.',
        ),
        t(
          '回图区分绿色细胞壁与蓝色膜。',
          'Distinguish the green wall from the blue membrane.',
        ),
      ),
      q(
        'L099-q3',
        'reasoning',
        t(
          '虚构组织2.50 g变2.40 g，质量百分变化和结论是什么？',
          'Fictional tissue changes from 2.50 to 2.40 g. Which result is justified?',
        ),
        [
          t('+4%，说明溶质进入', '+4%, proving solute entry'),
          t(
            '−0.1%，精确给出胞内浓度',
            '−0.1%, giving exact internal concentration',
          ),
          t(
            '−4%，支持该条件下净失水但需控制表面残液',
            '−4%, supporting net water loss with surface-fluid controls',
          ),
        ],
        2,
        t(
          '−0.10/2.50×100%=−4%。克的差不能直接当百分数；质量本身不精确测浓度，也需排除残液等解释。',
          '−0.10/2.50×100%=−4%. A mass difference is not a percentage. Mass alone does not precisely measure concentration; residual liquid is an alternative factor.',
        ),
        t(
          '回Explain的数据公式及静态推理步骤1–3。',
          'Revisit the mass formula and static reasoning steps 1–3.',
        ),
      ),
      q(
        'L099-q4',
        'vocabulary',
        t('plasmolysis描述哪种现象？', 'What does plasmolysis describe?'),
        [
          t('红细胞破裂', 'Red-cell rupture'),
          t(
            '植物充分失水后原生质体与壁分离',
            'Plant protoplast withdrawal from the wall after sufficient water loss',
          ),
          t('水被主动泵入植物', 'Water actively pumped into plants'),
        ],
        1,
        t(
          '质壁分离涉及植物的原生质体和细胞壁；红细胞破裂是溶血。渗透不是水泵。',
          'Plasmolysis concerns a plant protoplast and wall. Red-cell rupture is haemolysis; osmosis is not water pumping.',
        ),
        t(
          '回静态表第2步，比较植物/动物条件。',
          'Compare plant and animal conditions in static step 2.',
        ),
      ),
    ],
    mission: t(
      '不用真实体液。以图中三种水势与两类细胞作六格解释，分别写初始方向和仍不能确定的终态。',
      'Use no bodily fluids. Build six panels from three potentials and two cell types, separating initial direction from unresolved final state.',
    ),
    reference: {
      title: 'OpenStax — Passive Transport',
      url: 'https://openstax.org/books/biology-2e/pages/5-2-passive-transport',
    },
  },
  {
    id: 'L100',
    title: t('主动运输与交换表面', 'Active Transport and Exchange Surfaces'),
    hook: t(
      '把交换表面折出两倍面积，是否就能让矿物离子持续从稀处进入浓处？',
      'If exchange area doubles, can mineral ions continuously move from dilute surroundings into a concentrated cell without energy?',
    ),
    minutes: 35,
    icon: '◈',
    summary: t('主动运输与交换表面', 'Active Transport and Exchange Surfaces'),
    objectives: [
      t(
        '区分顺梯度被动运输与需能的逆梯度运输。',
        'Distinguish passive downhill transport from energy-requiring uphill transport.',
      ),
      t(
        '用面积、距离和梯度模型比较交换容量。',
        'Compare exchange capacity using area, distance and gradient.',
      ),
      t(
        '解释载体、能量与维持梯度如何共同限制运输。',
        'Explain joint limits from carriers, energy and gradient maintenance.',
      ),
    ],
    prediction: [
      t(
        '面积够大就不需能量逆梯度运输',
        'Enough area removes the energy requirement for uphill transport',
      ),
      t(
        '面积与能量解决不同限制',
        'Area and energy address different constraints',
      ),
      t(
        '所有有蛋白参与的运输都直接耗ATP',
        'All protein-assisted transport directly uses ATP',
      ),
    ],
    terms: [
      term(
        '主动运输',
        'active transport',
        '利用代谢能支持物质逆浓度或电化学梯度运输。',
        'Metabolic energy supports movement against a concentration or electrochemical gradient.',
      ),
      term(
        '载体蛋白',
        'carrier protein',
        '通过结合物质与构象变化参与运输的蛋白。',
        'A transport protein using binding and shape changes.',
      ),
      term(
        '代谢能',
        'metabolic energy',
        '细胞代谢提供的可用于工作的能量。',
        'Usable energy supplied by cellular metabolism.',
      ),
      term(
        '交换表面',
        'exchange surface',
        '物质跨越进入或离开系统的界面。',
        'An interface across which material enters or leaves a system.',
      ),
      term(
        '扩散距离',
        'diffusion distance',
        '扩散需跨越的路径长度。',
        'The path length crossed by diffusion.',
      ),
      term(
        '梯度维持',
        'gradient maintenance',
        '通过供给、移走等过程保持差异。',
        'Maintaining a difference through supply or removal.',
      ),
      term(
        '饱和',
        'saturation',
        '可用载体等达到限制而不能无限提高速率。',
        'A carrier or other capacity limit preventing indefinite rate increases.',
      ),
    ],
    questions: [
      q(
        'L100-q1',
        'concept',
        t(
          '逆浓度梯度持续运输通常需要什么？',
          'What supports sustained transport against a concentration gradient?',
        ),
        [
          t('仅增加面积', 'Only more area'),
          t(
            '代谢能与特定运输机制',
            'Metabolic energy and a specific transport mechanism',
          ),
          t('只需把细胞画小', 'Only a smaller drawing'),
        ],
        1,
        t(
          '面积不能提供逆梯度所需能量；特定载体及能量来源必须具备。',
          'Area does not provide the energy for uphill transport; an appropriate carrier mechanism and energy source are needed.',
        ),
        t(
          '对照图右侧能量开关。',
          'Compare the energy switch at the right of the figure.',
        ),
      ),
      q(
        'L100-q2',
        'concept',
        t('哪句话科学上更准确？', 'Which statement is more accurate?'),
        [
          t('所有载体都直接耗ATP', 'Every carrier directly consumes ATP'),
          t('所有主动运输不需要蛋白', 'Active transport never needs proteins'),
          t(
            '主动运输需能，能量可能直接或间接来自代谢',
            'Active transport needs energy that may come directly or indirectly from metabolism',
          ),
        ],
        2,
        t(
          '部分载体利用已建立的离子梯度；顺梯度的蛋白辅助运输又可能是被动的。',
          'Some carriers use established ion gradients; protein-assisted downhill transport can be passive.',
        ),
        t(
          '回Explain第三段，分开“蛋白”和“能量”。',
          'Separate protein involvement from energy in Explain paragraph 3.',
        ),
      ),
      q(
        'L100-q3',
        'reasoning',
        t(
          '梯度3，A=2、d=0.5，比A=1、d=1容量几倍？',
          'At gradient 3, how does A=2,d=0.5 compare with A=1,d=1?',
        ),
        [
          t(
            '4倍，且面积与距离都改变',
            'Fourfold; both area and distance changed',
          ),
          t('2倍，只看面积', 'Twofold, considering area only'),
          t('真实人体速率必为12 mL/min', 'Actual human rate must be 12 mL/min'),
        ],
        0,
        t(
          '12/3=4；面积贡献×2、路径缩短贡献×2。结果是相对模型容量，不具有mL/min实测单位。',
          '12/3=4. Area contributes ×2 and shorter distance ×2. The result is relative model capacity, not measured mL/min.',
        ),
        t(
          '回几何对照表三行，逐列标出变化。',
          'Mark changed columns in all three geometry rows.',
        ),
      ),
      q(
        'L100-q4',
        'vocabulary',
        t('carrier protein是什么？', 'What is a carrier protein?'),
        [
          t('只组成细胞壁的糖', 'A sugar only forming cell walls'),
          t(
            '通过结合与构象改变参与运输的蛋白',
            'A transport protein that binds and changes shape',
          ),
          t('被动扩散的浓度单位', 'A concentration unit for diffusion'),
        ],
        1,
        t(
          '载体是分子机制，不是结构糖或单位；载体可参与不同运输类型。',
          'A carrier is a molecular mechanism, not a sugar or unit; carriers can participate in different transport types.',
        ),
        t(
          '回右侧载体图与Vocabulary。',
          'Revisit the right-hand carrier and vocabulary.',
        ),
      ),
    ],
    mission: t(
      '比较表中3、6、12，写出每次只改变什么；再解释为何逆梯度仍需供能。附一个未纳入模型的限制。',
      'Compare 3, 6 and 12, naming each changed condition. Explain why uphill transport still needs energy and give one omitted limitation.',
    ),
    reference: {
      title: 'OpenStax — Active Transport',
      url: 'https://openstax.org/books/biology-2e/pages/5-3-active-transport',
    },
  },
  {
    id: 'L101',
    title: t('心脏结构与双循环', 'The Heart and Double Circulation'),
    hook: t(
      '肺动脉运输相对低氧血，为什么仍叫动脉？左心室壁又为什么更厚？',
      'Why is the pulmonary artery an artery despite carrying relatively oxygen-poor blood, and why is the left ventricular wall thicker?',
    ),
    minutes: 35,
    icon: '◈',
    summary: t('心脏结构与双循环', 'The Heart and Double Circulation'),
    objectives: [
      t(
        '准确追踪体循环与肺循环的血流方向。',
        'Accurately trace systemic and pulmonary blood flow.',
      ),
      t(
        '按离心/回心区分动静脉，解释肺血管含氧例外。',
        'Define arteries and veins by direction and explain pulmonary oxygenation exceptions.',
      ),
      t(
        '从压力对照解释瓣膜开闭与心室壁的功能。',
        'Use pressure evidence to explain valves and ventricular-wall function.',
      ),
    ],
    prediction: [
      t(
        '动脉按高氧命名，静脉按低氧命名',
        'Arteries mean high oxygen and veins low oxygen',
      ),
      t('血流方向定义动静脉', 'Direction defines arteries and veins'),
      t('瓣膜主动收缩推动血液', 'Valves contract actively to pump blood'),
    ],
    terms: [
      term(
        '心房',
        'atrium',
        '接收回到心脏血液的心腔。',
        'A chamber receiving blood returning to the heart.',
      ),
      term(
        '心室',
        'ventricle',
        '把血泵出心脏的心腔。',
        'A chamber pumping blood out of the heart.',
      ),
      term(
        '动脉',
        'artery',
        '把血液带离心脏的血管。',
        'A vessel carrying blood away from the heart.',
      ),
      term(
        '静脉',
        'vein',
        '把血液带回心脏的血管。',
        'A vessel carrying blood towards the heart.',
      ),
      term(
        '肺循环',
        'pulmonary circulation',
        '右心与肺之间及返回左心的循环路线。',
        'The circuit from right heart through lungs to left heart.',
      ),
      term(
        '体循环',
        'systemic circulation',
        '左心经身体组织返回右心的路线。',
        'The circuit from left heart through body tissues to right heart.',
      ),
      term(
        '瓣膜',
        'valve',
        '受压力差影响开闭并限制倒流的结构。',
        'A structure responding to pressure differences and limiting backflow.',
      ),
      term(
        '毛细血管',
        'capillary',
        '连接微小血管并支持与组织交换的薄壁血管。',
        'A thin-walled vessel supporting exchange with tissues.',
      ),
    ],
    questions: [
      q(
        'L101-q1',
        'concept',
        t(
          '肺静脉的定义与血液状态是哪项？',
          'Which describes a pulmonary vein?',
        ),
        [
          t('离心脏、通常相对低氧', 'Away from heart, usually lower oxygen'),
          t('回心脏、通常相对高氧', 'Towards heart, usually higher oxygen'),
          t('回心脏、完全无氧', 'Towards heart, entirely oxygen-free'),
        ],
        1,
        t(
          '“静脉”由回心方向定义；肺交换使它相对高氧。低氧也不等于无氧。',
          'Vein means towards the heart; lung exchange gives relatively high oxygen. Low oxygen does not mean none.',
        ),
        t(
          '回路线5→6→7，找到肺与左心房。',
          'Trace steps 5→6→7 from lungs to left atrium.',
        ),
      ),
      q(
        'L101-q2',
        'concept',
        t(
          '左心室壁较厚，最合理解释是什么？',
          'Why is the left ventricular wall thicker?',
        ),
        [
          t(
            '支持体循环较高压力需要',
            'It supports systemic circulation’s higher pressure requirement',
          ),
          t(
            '必须持续泵出右侧两倍血量',
            'It must continuously pump twice the right side’s volume',
          ),
          t('只因示意图画得较大', 'Only because it is drawn larger'),
        ],
        0,
        t(
          '肌壁厚与压力需求相关；两侧长期平均流量应匹配。示意比例不是证据。',
          'Wall thickness relates to pressure demand; average outputs must match. Drawing scale is not evidence.',
        ),
        t(
          '比较左心→全身与右心→肺路线。',
          'Compare left-heart→body with right-heart→lungs.',
        ),
      ),
      q(
        'L101-q3',
        'reasoning',
        t(
          '模型瓣膜前压从12降到8，后压保持10 kPa，预期怎样？',
          'Upstream model pressure falls from 12 to 8 while downstream stays 10 kPa. What follows?',
        ),
        [
          t('一直打开，因为血是红色', 'It stays open because blood is red'),
          t('瓣膜主动加压到12', 'The valve actively raises pressure to 12'),
          t(
            '从可正向打开变为关闭以限制倒流',
            'It changes from forward opening to closing against backflow',
          ),
        ],
        2,
        t(
          '前12>后10时可正向开；前8<后10时压差反转使单向瓣关闭。颜色不控制流向，瓣膜不是泵。',
          '12>10 permits forward opening; 8<10 reverses the pressure difference and closes the valve. Colour does not control flow; a valve is not a pump.',
        ),
        t(
          '切换两压力对照并回Explain压力例。',
          'Switch pressure comparisons and revisit the pressure example.',
        ),
      ),
      q(
        'L101-q4',
        'vocabulary',
        t('double circulation指什么？', 'What does double circulation mean?'),
        [
          t(
            '一次完整体肺循环经过心脏两次',
            'A complete systemic–pulmonary circuit passes the heart twice',
          ),
          t('任何动脉有两层血', 'Every artery contains two layers of blood'),
          t('每次心跳左侧泵两次', 'The left side pumps twice per heartbeat'),
        ],
        0,
        t(
          '两条相连的肺/体循环使完整路线经过心脏两次，不是单侧多跳一次。',
          'Connected pulmonary and systemic circuits take blood through the heart twice, not an extra contraction by one side.',
        ),
        t(
          '沿1→10再回1，圈出左右心各一次。',
          'Trace 1→10→1 and circle one passage through each side.',
        ),
      ),
    ],
    mission: t(
      '画不按比例的双循环箭头图，逐条用离心/回心和气体交换解释名称；加一个压力瓣膜对照。',
      'Draw a not-to-scale double-circulation map. Explain names using direction and gas exchange, and add one valve-pressure comparison.',
    ),
    reference: {
      title: 'OpenStax — Mammalian Heart and Blood Vessels',
      url: 'https://openstax.org/books/biology-2e/pages/40-3-mammalian-heart-and-blood-vessels',
    },
  },
  {
    id: 'L102',
    title: t('消化、吸收与绒毛', 'Digestion and Absorption'),
    hook: t(
      '小肠已经把淀粉分解，为什么还不能说葡萄糖已经进入血液？脂肪又走哪里？',
      'If starch has been digested in the small intestine, why has glucose not necessarily entered blood, and where do fats go?',
    ),
    minutes: 35,
    icon: '◈',
    summary: t('消化、吸收与绒毛', 'Digestion and Absorption'),
    objectives: [
      t(
        '区分大分子分解与产物跨上皮吸收。',
        'Distinguish molecular breakdown from absorption across epithelium.',
      ),
      t(
        '追踪淀粉、蛋白质与长链脂肪的不同路线。',
        'Trace routes for starch, protein and long-chain fats.',
      ),
      t(
        '用绒毛结构及对照数据解释交换优势与限制。',
        'Use villus structure and controlled data to explain exchange advantages and limits.',
      ),
    ],
    prediction: [
      t(
        '淀粉酶一步把淀粉全部变成葡萄糖',
        'Amylase converts starch completely to glucose in one step',
      ),
      t(
        '分解之后还需跨上皮，且输出路线有差异',
        'Digestion is followed by epithelial crossing, with different outputs',
      ),
      t(
        '所有消化产物都直接进入同一血管',
        'Every digestion product enters the same blood vessel directly',
      ),
    ],
    terms: [
      term(
        '消化',
        'digestion',
        '把食物分解为更小组分的机械与化学过程。',
        'Mechanical and chemical breakdown of food into smaller components.',
      ),
      term(
        '吸收',
        'absorption',
        '物质跨肠上皮进入身体内部的过程。',
        'Movement across intestinal epithelium into the body.',
      ),
      term(
        '绒毛',
        'villus',
        '小肠内壁的指状突起，内有血毛细血管和乳糜管。',
        'A finger-like intestinal projection containing capillaries and a lacteal.',
      ),
      term(
        '微绒毛',
        'microvilli',
        '上皮细胞表面的微小突起，增加面积。',
        'Tiny epithelial-cell projections increasing surface area.',
      ),
      term(
        '上皮',
        'epithelium',
        '覆盖表面和内腔的细胞层。',
        'A cell layer lining surfaces and cavities.',
      ),
      term(
        '乳糜管',
        'lacteal',
        '绒毛中接收多数长链脂肪运输颗粒的淋巴管。',
        'A villus lymphatic receiving most packaged long-chain fats.',
      ),
      term(
        '乳化',
        'emulsification',
        '将大脂滴分散成较小液滴而不水解脂肪。',
        'Dispersing fat into smaller droplets without hydrolysis.',
      ),
    ],
    questions: [
      q(
        'L102-q1',
        'concept',
        t(
          '淀粉酶作用之后通常还需要什么？',
          'What normally follows amylase action on starch?',
        ),
        [
          t(
            '无需其他酶就已全部成为葡萄糖',
            'Everything is already glucose without other enzymes',
          ),
          t(
            '其他小肠酶进一步生成葡萄糖，再跨上皮',
            'Other intestinal enzymes form glucose, followed by epithelial crossing',
          ),
          t('胆汁把麦芽糖变成氨基酸', 'Bile converts maltose to amino acids'),
        ],
        1,
        t(
          '淀粉酶产生麦芽糖/短寡糖，不一跳完成葡萄糖吸收；胆汁主要乳化脂肪。',
          'Amylase yields maltose/short chains, not one-step glucose absorption. Bile mainly emulsifies fat.',
        ),
        t('回淀粉路线第2→3→4步。', 'Trace starch steps 2→3→4.'),
      ),
      q(
        'L102-q2',
        'concept',
        t(
          '多数长链脂肪吸收后的首条输出路线是哪项？',
          'What is the main initial output route for most absorbed long-chain fats?',
        ),
        [
          t(
            '上皮重组包装后进乳糜管',
            'After epithelial rebuilding/packaging, into lacteals',
          ),
          t(
            '全部直接进同一血毛细血管',
            'All directly into the same blood capillary',
          ),
          t(
            '无需跨上皮就进入细胞核',
            'Into nuclei without crossing epithelium',
          ),
        ],
        0,
        t(
          '上皮加工后主要进淋巴乳糜管，再汇入血；本规则不对每种脂肪酸作绝对归类。',
          'After epithelial processing they mainly enter lacteals, then blood via lymph. This is not an absolute rule for every fatty acid.',
        ),
        t(
          '切换长链脂肪，找绿色路线。',
          'Select long-chain fats and find the green route.',
        ),
      ),
      q(
        'L102-q3',
        'reasoning',
        t(
          '固定每mm²每分钟通过2模型单位，面积由3变6 mm²，正确推断是什么？',
          'At fixed 2 model units per mm² per minute, area changes 3→6 mm². What follows?',
        ),
        [
          t(
            '总量6→12单位/分钟，限于相同其他条件',
            'Total 6→12 units/minute, under the same other conditions',
          ),
          t(
            '必是真实人小肠加倍，任何条件都成立',
            'Every real intestine must double its rate under all conditions',
          ),
          t(
            '单位不必写，因为只是图',
            'Units are unnecessary because it is a diagram',
          ),
        ],
        0,
        t(
          '面积乘单位面积通量给总量；这是假设数据，不能越过梯度、供应或饱和限制。',
          'Area times transfer per area gives total. These assumed values do not override gradient, supply or saturation limits.',
        ),
        t(
          '回Explain数值例并指出固定了哪些条件。',
          'Identify controlled conditions in the numerical example.',
        ),
      ),
      q(
        'L102-q4',
        'vocabulary',
        t(
          'absorption与digestion的区别是哪项？',
          'How does absorption differ from digestion?',
        ),
        [
          t('吸收只使食物碎块变小', 'Absorption only breaks food into pieces'),
          t('二者都等于排出粪便', 'Both mean passing faeces'),
          t(
            '吸收跨上皮；消化把食物分解',
            'Absorption crosses epithelium; digestion breaks down food',
          ),
        ],
        2,
        t(
          '跨边界进入体内与分解大分子是不同事件；排出未消化物又是排遗。',
          'Crossing into the body differs from molecular breakdown; egestion removes undigested material.',
        ),
        t(
          '回图定位肠腔、上皮与两条输出。',
          'Locate lumen, epithelium and both outputs.',
        ),
      ),
    ],
    mission: t(
      '制作三条食物路线，明确每一步是消化、上皮加工还是吸收/输出。用面积对照附一条条件与一条局限。',
      'Create three food routes, marking digestion, epithelial processing and absorption/output. Add an area comparison with one condition and one limitation.',
    ),
    reference: {
      title: 'OpenStax — Digestive System Processes',
      url: 'https://openstax.org/books/biology-2e/pages/34-3-digestive-system-processes',
    },
  },
  {
    id: 'L103',
    title: t('肾脏、排泄与水分调节', 'Kidneys and Excretion'),
    hook: t(
      '葡萄糖进入滤液后，为什么正常情况下仍能大部分回到血里？水分不足时又发生什么？',
      'After glucose enters filtrate, why is most normally recovered into blood, and what changes when water is scarce?',
    ),
    minutes: 35,
    icon: '◈',
    summary: t('肾脏、排泄与水分调节', 'Kidneys and Excretion'),
    objectives: [
      t(
        '区分压力过滤与选择性重吸收的方向与机制。',
        'Distinguish pressure filtration from selective reabsorption.',
      ),
      t(
        '用滤液—回收—尿液收支计算体积。',
        'Calculate filtrate–recovery–urine volume balances.',
      ),
      t(
        '解释ADH负反馈并区别排泄与排遗。',
        'Explain ADH negative feedback and distinguish excretion from egestion.',
      ),
    ],
    prediction: [
      t(
        '过滤把血细胞全部筛进尿液',
        'Filtration sends all blood cells into urine',
      ),
      t(
        '过滤后仍需选择性重吸收并调节水',
        'Filtration is followed by selective recovery and water regulation',
      ),
      t('ADH直接把尿中水泵回', 'ADH directly pumps water back from urine'),
    ],
    terms: [
      term(
        '排泄',
        'excretion',
        '移除代谢废物和过量物质。',
        'Removal of metabolic wastes and excess substances.',
      ),
      term(
        '排遗',
        'egestion',
        '排出消化道内未消化/未吸收的食物残余。',
        'Removal of undigested/unabsorbed food remains from the gut.',
      ),
      term(
        '肾单位',
        'nephron',
        '肾中执行过滤与后续处理的功能单位。',
        'Kidney functional unit performing filtration and subsequent processing.',
      ),
      term(
        '滤液',
        'filtrate',
        '经肾小球屏障进入肾小囊的液体。',
        'Fluid entering the renal capsule through the glomerular barrier.',
      ),
      term(
        '重吸收',
        'reabsorption',
        '物质由肾小管液返回血液。',
        'Movement from tubular fluid back into blood.',
      ),
      term(
        '抗利尿激素',
        'ADH',
        '影响集合管等处水通透性的调节激素。',
        'A hormone regulating water permeability in regions including collecting ducts.',
      ),
      term(
        '负反馈',
        'negative feedback',
        '响应减弱引发响应的原始变化。',
        'A response reducing the original change that triggered it.',
      ),
      term(
        '尿素',
        'urea',
        '氨基酸代谢产生的含氮废物之一，主要经尿排出。',
        'A nitrogenous waste from amino-acid metabolism, mainly removed in urine.',
      ),
    ],
    questions: [
      q(
        'L103-q1',
        'concept',
        t(
          '哪种物质正常可进入滤液后被大量重吸收？',
          'Which can normally enter filtrate and then be largely reabsorbed?',
        ),
        [
          t('完整红细胞', 'Intact red cells'),
          t('大部分大血浆蛋白', 'Most large plasma proteins'),
          t('葡萄糖', 'Glucose'),
        ],
        2,
        t(
          '葡萄糖足够小可进入滤液，再被选择性回收；细胞和大部分大蛋白正常保留在血中。',
          'Small glucose enters filtrate and is selectively recovered; cells and most large proteins normally remain in blood.',
        ),
        t(
          '回图左侧过滤与回收箭头，分别标去向。',
          'Label the filtration and recovery arrows separately.',
        ),
      ),
      q(
        'L103-q2',
        'concept',
        t(
          '水分不足后ADH升高的典型机制是什么？',
          'What typically follows higher ADH during water shortage?',
        ),
        [
          t(
            '增加集合管水通透性，适宜梯度下增加回收',
            'Greater collecting-duct water permeability and recovery with a suitable gradient',
          ),
          t('ADH直接泵水进尿', 'ADH pumps water directly into urine'),
          t('关闭所有肾过滤且永久停止', 'All filtration permanently stops'),
        ],
        0,
        t(
          'ADH调节通透性而非直接搬水；模型不支持所有过滤停止的绝对说法。',
          'ADH changes permeability rather than directly carrying water; the model does not imply all filtration stops.',
        ),
        t(
          '读静态反馈链，圈出“原变化减弱”。',
          'Read the feedback chain and mark reduction of the original change.',
        ),
      ),
      q(
        'L103-q3',
        'reasoning',
        t(
          '同100 mL滤液，回收90和98 mL时，尿量如何比较？',
          'For 100 mL filtrate with 90 and 98 mL recovered, compare urine.',
        ),
        [
          t(
            '90与98 mL，因为回收就是尿量',
            '90 and 98 mL because recovery equals urine',
          ),
          t(
            '10与2 mL，较高回收组少80%',
            '10 and 2 mL; higher recovery gives 80% less',
          ),
          t(
            '10与2 mL，证明任何人的ADH浓度',
            '10 and 2 mL, proving anyone’s ADH concentration',
          ),
        ],
        1,
        t(
          '尿量=滤液−回收；(10−2)/10=80%。守恒例不能单独推断个人激素水平。',
          'Urine=filtrate−recovery; (10−2)/10=80%. A conservation example alone cannot infer an individual hormone level.',
        ),
        t(
          '核对水量表，再以较低回收组10作分母。',
          'Check the balance table and use 10 as the comparison denominator.',
        ),
      ),
      q(
        'L103-q4',
        'vocabulary',
        t(
          'excretion和egestion的正确配对是什么？',
          'Which correctly pairs excretion and egestion?',
        ),
        [
          t(
            '排泄尿素；排遗消化道食物残余',
            'Excretion of urea; egestion of gut food remains',
          ),
          t('二者都只是排出粪便', 'Both only mean passing faeces'),
          t('排泄就是过滤红细胞', 'Excretion means filtering out red cells'),
        ],
        0,
        t(
          '排泄按代谢废物/过量物质定义，排遗按消化道残余定义；并非一切排出都一样。',
          'Excretion concerns metabolic wastes/excess substances; egestion concerns gut remains. Outward movement alone does not equate them.',
        ),
        t(
          '回Vocabulary与Explain末段。',
          'Revisit Vocabulary and the final Explain paragraph.',
        ),
      ),
    ],
    mission: t(
      '以100 mL模型建立两列水账本，画ADH负反馈箭头，明确过滤、重吸收与尿液不同。只用屏幕/纸笔数据。',
      'Build two 100 mL water ledgers and an ADH feedback map, distinguishing filtration, reabsorption and urine. Use screen/paper data only.',
    ),
    reference: {
      title: 'OpenStax — Tubular Reabsorption',
      url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/25-6-tubular-reabsorption',
    },
  },
  {
    id: 'L104',
    title: t('神经与激素协同', 'Nervous and Hormonal Coordination'),
    hook: t(
      '同一激素随血液接触许多细胞，为什么不是每个细胞都作出相同响应？',
      'If one hormone reaches many cells in blood, why do they not all respond identically?',
    ),
    minutes: 35,
    icon: '◈',
    summary: t('神经与激素协同', 'Nervous and Hormonal Coordination'),
    objectives: [
      t(
        '比较神经与内分泌信号的路线和靶细胞条件。',
        'Compare neural and endocrine routes and target-cell requirements.',
      ),
      t(
        '分析起效与持续时间数据，避免把典型差异写成绝对。',
        'Analyse onset/duration evidence without treating typical differences as absolutes.',
      ),
      t(
        '用一个协同反馈例连接感受、传递、响应与恢复。',
        'Connect detection, signalling, response and recovery in a coordinated example.',
      ),
    ],
    prediction: [
      t(
        '所有激素都慢，所有神经效果都短',
        'All hormones are slow and all neural effects brief',
      ),
      t(
        '路线与受体共同决定响应，速度需要证据',
        'Routes and receptors shape response, while speed needs evidence',
      ),
      t(
        '激素到达哪里，哪里必然同样响应',
        'Every cell reached by a hormone responds identically',
      ),
    ],
    terms: [
      term(
        '神经元',
        'neuron',
        '传递神经信息的特化细胞。',
        'A specialised cell transmitting neural information.',
      ),
      term(
        '轴突',
        'axon',
        '神经元中把信号传向末端的长突起。',
        'A neuronal projection conducting signals towards terminals.',
      ),
      term(
        '突触',
        'synapse',
        '神经元与另一细胞间传递信息的连接处。',
        'A junction transmitting signals between a neuron and another cell.',
      ),
      term(
        '激素',
        'hormone',
        '内分泌细胞释放并作用于靶细胞的化学信号。',
        'A chemical signal released by endocrine cells and acting on targets.',
      ),
      term(
        '受体',
        'receptor',
        '能识别特定信号并参与响应的分子结构。',
        'A molecular structure recognising a signal and supporting response.',
      ),
      term(
        '靶细胞',
        'target cell',
        '具备相应受体和响应机制的细胞。',
        'A cell with suitable receptors and response machinery.',
      ),
      term(
        '协调',
        'coordination',
        '多个过程相互配合以形成适宜响应。',
        'Processes working together to produce suitable responses.',
      ),
      term(
        '起效时间',
        'onset time',
        '从所定起点到可检测响应的时间。',
        'Time from a defined start to a detectable response.',
      ),
    ],
    questions: [
      q(
        'L104-q1',
        'concept',
        t(
          '某激素接触细胞但无匹配受体，最合理预测是什么？',
          'A hormone reaches a cell without its matching receptor. What follows?',
        ),
        [
          t(
            '一定产生与所有细胞相同响应',
            'It must produce the same response as every other cell',
          ),
          t(
            '不能启动本设定受体依赖响应',
            'It cannot initiate the specified receptor-dependent response',
          ),
          t('该细胞完全没有生命活动', 'The cell has no life processes'),
        ],
        1,
        t(
          '接触与识别不同；缺少本受体不代表细胞没有其他功能。真实响应还需下游机制。',
          'Contact differs from recognition; lacking this receptor does not remove other cell functions. Downstream machinery also matters.',
        ),
        t(
          '保持激素路线，只切受体有/无。',
          'Keep hormone signalling and toggle receptor presence.',
        ),
      ),
      q(
        'L104-q2',
        'concept',
        t('哪句话正确描述协同？', 'Which describes coordination?'),
        [
          t(
            '神经可影响内分泌释放，两者共同参与响应',
            'Neural activity can affect endocrine release, supporting a shared response',
          ),
          t('两系统永远互不联系', 'The systems never interact'),
          t(
            '所有内分泌信号沿轴突传递',
            'All endocrine signals travel down axons',
          ),
        ],
        0,
        t(
          '神经和激素可相互影响；路线不同不等于不能协作。激素典型经血，而非沿轴突。',
          'Nerves and hormones can interact. Different routes do not prevent cooperation; hormones typically travel in blood rather than along axons.',
        ),
        t(
          '读Explain的刺激→神经→内分泌例。',
          'Trace the stimulus→nerve→endocrine example.',
        ),
      ),
      q(
        'L104-q3',
        'reasoning',
        t(
          '本表神经0.05 s、激素5 s起效，支持哪项？',
          'The table gives neural onset 0.05 s and hormonal onset 5 s. What is supported?',
        ),
        [
          t('所有激素永远慢100倍', 'Every hormone is always 100 times slower'),
          t(
            '本例激素起效时间为100倍，不能推广全部系统',
            'This example’s endocrine onset is 100 times longer; it is not universal',
          ),
          t('5−0.05=100 s', '5−0.05 equals 100 s'),
        ],
        1,
        t(
          '5/0.05=100是比值，不是时间差。证据只支持这两种选定响应。',
          '5/0.05=100 is a ratio, not a time difference. Evidence covers these selected responses only.',
        ),
        t(
          '回时间表，先标单位s再选分母。',
          'Read seconds in the timing table and choose the denominator.',
        ),
      ),
      q(
        'L104-q4',
        'vocabulary',
        t('target cell最准确指什么？', 'What best defines a target cell?'),
        [
          t('所有被血液经过的细胞', 'Every cell near blood'),
          t('只要细胞尺寸大', 'Any large cell'),
          t(
            '有适当受体和响应机制的细胞',
            'A cell with suitable receptors and response machinery',
          ),
        ],
        2,
        t(
          '靶性来自识别和响应条件，不是血液接近或大小。',
          'Target specificity depends on recognition and response conditions, not proximity to blood or size.',
        ),
        t(
          '回图靶细胞与受体开关。',
          'Revisit the target panel and receptor control.',
        ),
      ),
    ],
    mission: t(
      '比较两条路线，引用有单位时间数据，并用有/无受体对照解释靶性。写一个协同例与一个不能推广的结论。',
      'Compare routes using timed evidence with units, then explain targeting through receptor controls. Include a coordination example and one conclusion that cannot be generalised.',
    ),
    reference: {
      title: 'OpenStax — Overview of the Endocrine System',
      url: 'https://openstax.org/books/anatomy-and-physiology-2e/pages/17-1-an-overview-of-the-endocrine-system',
    },
  },
];
