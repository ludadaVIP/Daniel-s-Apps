import { t, type Lesson, type Question, type AnswerSpec } from '../model';
import { numeric, choice, reasoning } from './builders';
import {
  jointModel,
  probabilityString,
  numberedPairs,
} from '../probabilityModels';
import { treeEvent, type TreeEvent } from '../inferenceModels';
import { rational } from '../algebraModels';
type Pair = [string, string];
const T = (v: Pair) => t(...v);
type Item = {
  stem: Pair;
  answer: AnswerSpec;
  step: Pair;
  wrong: string[];
  diagram?: Question['diagram'];
};
const N = (
  stem: Pair,
  value: string,
  step: Pair,
  wrong: string[],
  diagram?: Question['diagram'],
): Item => ({ stem, answer: { kind: 'number', value }, step, wrong, diagram });
const I = (
  stem: Pair,
  value: 'independent' | 'dependent',
  step: Pair,
  wrong: string[],
  diagram?: Question['diagram'],
): Item => ({
  stem,
  answer: { kind: 'independence', value },
  step,
  wrong,
  diagram,
});
const V = (
  stem: Pair,
  value: 'sufficient' | 'insufficient',
  step: Pair,
  wrong: string[],
): Item => ({ stem, answer: { kind: 'proof-verdict', value }, step, wrong });
const E = (stem: Pair, rubric: Pair): Item => ({
  stem,
  answer: { kind: 'explain', rubric: T(rubric) },
  step: rubric,
  wrong: [],
});
type Pick = { stem: Pair; options: Pair[]; feedback: Pair[]; correct: number };
type Spec = {
  title: Pair;
  objective: Pair;
  lab: Lesson['lab'];
  prerequisites: string[];
  keywords: Pair[];
  hook: Pair;
  items: Item[];
  pick: Pick;
  reason: Pair;
  rubric: Pair;
  misconception: Pair;
};
const skills = [
  'probability-independence-product',
  'probability-conditional-product',
  'probability-without-ordered-pairs',
  'probability-frame-response-bias',
  'probability-simulation-theory',
];
const hints: Pair[][] = [
  [
    [
      '先把完整模型分成A且B、仅A、仅B、皆非四格。',
      'Partition the full model into A and B, A only, B only and neither.',
    ],
    [
      '比较P(A且B)与P(A)P(B)。条件概率的分母是条件事件数；概率为零的条件不能相除。',
      'Compare P(A and B) with P(A)P(B). A conditional denominator counts the conditioning event; do not divide by zero.',
    ],
  ],
  [
    [
      '沿一条具体首步分支，再问第二步还剩什么。',
      'Follow one specific first branch, then count what remains.',
    ],
    [
      '路径相乘用首步概率×条件概率；合并RB与BR等互斥路径才相加。',
      'Multiply first and conditional probabilities along a path; add disjoint paths such as RB and BR.',
    ],
  ],
  [
    [
      '把球编号，保留第一抽与第二抽的顺序。',
      'Number the tokens and retain first/second order.',
    ],
    [
      '不放回有N(N−1)个等可能编号有序对；排除同编号，不排除同颜色。',
      'Without replacement there are N(N−1) equally likely ordered ID pairs. Exclude the same ID, not every same-colour pair.',
    ],
  ],
  [
    [
      '先说总体、抽样框、邀请数和回答数，未回答不等于否。',
      'Name population, frame, invited count and responses. Missing is not no.',
    ],
    [
      '回答者比例用是/有效回答。扩大偏窄抽样框不能补遗漏，随机小样本也不是普查真值。',
      'Use yes/respondents. A larger restricted-frame sample cannot restore omitted groups, and a random sample is not a census.',
    ],
  ],
  [
    [
      '先写理论模型，再读实际命中数与试验数。',
      'State the model, then read actual hits and trial count.',
    ],
    [
      '频率=命中/n，n=0未定义；每轮重置原袋，轮内放回规则另说明。更多试验不保证逐步逼近。',
      'Frequency=hits/n, undefined at n=0. Restore the original bag each trial and specify within-trial replacement. More trials do not guarantee stepwise improvement.',
    ],
  ],
];
const specs: Spec[] = [
  {
    title: ['独立事件的直观意义', 'Independence of events'],
    objective: [
      '在完整等可能模型中用乘积关系判断独立，并区分独立与互斥。',
      'Use the product relation in a complete equally likely model to judge independence, distinguishing it from disjointness.',
    ],
    lab: 'probability-independent',
    prerequisites: ['J76-L04', 'J76-L05'],
    keywords: [
      ['独立', 'independence'],
      ['同时发生', 'intersection'],
      ['条件概率', 'conditional probability'],
    ],
    hook: [
      '知道第一枚硬币结果，会改变独立第二枚的正面概率吗？同一枚骰子的奇偶事件又怎样？',
      'Does learning the first coin change an independent second coin’s head probability? What about even and odd on one die?',
    ],
    items: [
      I(
        [
          '独立公平两硬币四种等可能结果HH、HT、TH、TT；A首枚H，B次枚H。A、B独立吗？',
          'Two independent fair coins have equally likely HH, HT, TH, TT. A=first H and B=second H. Are A and B independent?',
        ],
        'independent',
        [
          'P(A)=P(B)=1/2，P(A且B)=1/4，恰等于乘积。',
          'P(A)=P(B)=1/2 and P(A and B)=1/4, equal to their product.',
        ],
        ['dependent', '互斥'],
        { kind: 'probability-joint', cells: [1, 1, 1, 1] },
      ),
      N(
        [
          '九个等可能编号，四格A且B=2、仅A=4、仅B=1、皆非=2。求P(A且B)。',
          'Nine equally likely IDs have cells overlap 2, A-only 4, B-only 1, neither 2. Find P(A and B).',
        ],
        '2/9',
        [
          '重叠的两个编号除完整九个编号，得2/9。',
          'Two overlap IDs out of nine give 2/9.',
        ],
        ['1/4', '1/3'],
        { kind: 'probability-joint', cells: [2, 4, 1, 2] },
      ),
      N(
        [
          '同一九编号模型，已知A发生。求P(B|A)。',
          'In that nine-ID model, given A occurred, find P(B|A).',
        ],
        '1/3',
        [
          'A包含2+4=6个编号，重叠2个，条件概率2/6=1/3。',
          'A has six IDs, two also in B; 2/6=1/3.',
        ],
        ['2/9', '2/3'],
      ),
      I(
        [
          '八等可能编号，四格为3、1、1、3。A、B独立吗？',
          'Eight equally likely IDs have cells 3,1,1,3. Are A and B independent?',
        ],
        'dependent',
        [
          'P(A)=P(B)=1/2，但P(A且B)=3/8≠1/4，不独立。',
          'P(A)=P(B)=1/2 but intersection 3/8 differs from 1/4, so dependent.',
        ],
        ['independent', '相等'],
        { kind: 'probability-joint', cells: [3, 1, 1, 3] },
      ),
      N(
        [
          '公平六面骰子，A偶数、B奇数。求P(A且B)。',
          'For a fair six-sided die, A=even and B=odd. Find P(A and B).',
        ],
        '0',
        [
          '没有同时奇偶的结果，交集概率0；两边际各1/2，所以这两个非零互斥事件不独立。',
          'No outcome is both even and odd, so intersection is zero. Both marginals are 1/2, so these nonzero disjoint events are dependent.',
        ],
        ['1/4', '1/2'],
      ),
      E(
        [
          '用两独立公平硬币与同骰奇偶，解释独立为何不等于互斥。',
          'Use independent fair coins and even/odd on one die to explain why independence is not disjointness.',
        ],
        [
          '独立是知道一个事件不改变另一个概率，可用乘积定义核验；两硬币A/B可同时发生，交集1/4。骰子奇偶互斥、交集0，边际各1/2，乘积1/4不相等，故不独立。若讨论P(B|A)，须P(A)>0；A不可能时条件式未定义，但乘积定义仍可判断。',
          'Independence preserves the other event’s probability and can be checked by the product definition. Coin A/B can occur together with probability 1/4. Even/odd on one die are disjoint with intersection zero but marginal product 1/4, hence dependent. P(B|A) needs P(A)>0; for impossible A that conditional is undefined, although the product definition still applies.',
        ],
      ),
    ],
    pick: {
      stem: [
        '哪项足以在给定完整概率模型中判断A与B独立？',
        'Which relation establishes independence within a specified complete probability model?',
      ],
      options: [
        ['不能同时发生', 'They cannot occur together'],
        ['P(A且B)=P(A)P(B)', 'P(A and B)=P(A)P(B)'],
        ['样本里两类次数一样', 'Two categories have equal observed counts'],
      ],
      feedback: [
        ['这是互斥，不是独立定义。', 'That is disjointness, not independence.'],
        [
          '在完整模型中这是独立的乘积定义。',
          'This is the product definition in the complete model.',
        ],
        [
          '有限样本相等不能证明模型独立。',
          'Equal sample counts do not prove model independence.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '说明一个等概率四格表与一张有限观察样本表的不同，为什么不能只凭样本恰好吻合证明现实独立。',
      'Distinguish a complete equally likely model table from finite observed sample counts; why does an exact sample match not prove real independence?',
    ],
    rubric: [
      '四格模型列出全部基本结果且假设等可能，比例直接给模型概率。观测样本只是一部分记录，即使样本乘积恰好相等，也有抽样波动、覆盖与测量限制，不能证明总体机制。应报告研究对象、设计、样本范围和不确定性；也不能从一次不吻合就宣布随机装置必坏。',
      'A model exhausts all equally likely outcomes, so its proportions define probabilities. Observed data are a finite sample subject to variation, coverage and measurement limits. Exact sample equality does not prove a population mechanism. Report the target, design, coverage and uncertainty; one mismatch also does not establish a broken device.',
    ],
    misconception: [
      '互斥、独立和频数相等是不同概念。',
      'Disjointness, independence and equal observed counts are different.',
    ],
  },
  {
    title: ['乘法法则与树状图', 'Multiplication rule and trees'],
    objective: [
      '沿路径使用首步概率乘条件概率，并对互斥路径求和。',
      'Multiply first and conditional probabilities along paths, then add disjoint paths.',
    ],
    lab: 'probability-tree',
    prerequisites: ['J97-L01', 'J76-L05'],
    keywords: [
      ['条件分支', 'conditional branch'],
      ['路径概率', 'path probability'],
      ['互斥求和', 'disjoint sum'],
    ],
    hook: [
      '三红两蓝抽两次，第二次的红色概率一定还是3/5吗？',
      'With three red and two blue tokens, is the second red probability always 3/5 after learning the first draw?',
    ],
    items: [
      N(
        [
          '3红2蓝编号球，各球等机会，连续抽两次不放回。求两次红RR的概率。',
          'Three red and two blue numbered tokens, each equally likely. Draw twice without replacement. Find P(RR).',
        ],
        '3/10',
        [
          '首红3/5，已红后剩2红共4，故3/5×2/4=3/10。',
          'First red 3/5, then two red among four; 3/5×2/4=3/10.',
        ],
        ['9/25', '1/4'],
        { kind: 'probability-pairs', red: 3, blue: 2, replace: false },
      ),
      N(
        [
          '同袋不放回，已知第一抽红。第二抽红的条件概率？',
          'Same bag without replacement, given first red. What is the conditional probability of second red?',
        ],
        '1/2',
        [
          '第一抽已移走一红，剩2红2蓝，2/4=1/2。',
          'Removing one red leaves two red and two blue, so 2/4=1/2.',
        ],
        ['3/5', '2/5'],
      ),
      N(
        [
          '同袋不放回，求先红后蓝RB的概率。',
          'Same bag without replacement. Find first red then blue, RB.',
        ],
        '3/10',
        [
          '3/5×2/4=3/10；这里第二步的2是蓝球数。',
          '3/5×2/4=3/10; the second numerator counts blue tokens.',
        ],
        ['6/25', '1/2'],
      ),
      N(
        [
          '同袋不放回，求颜色不同的概率。',
          'Same bag without replacement. Find different-colour probability.',
        ],
        '3/5',
        [
          'RB与BR不能同时为同一有序结果，3/10+3/10=3/5。',
          'RB and BR are disjoint ordered events, so 3/10+3/10=3/5.',
        ],
        ['3/10', '9/100'],
      ),
      N(
        [
          '改为第一抽后放回并混匀，3红2蓝，求RR。',
          'Now return and remix after the first draw, with three red and two blue. Find P(RR).',
        ],
        '9/25',
        [
          '第二步仍3/5，按给定独立重抽模型，3/5×3/5=9/25。',
          'The second probability remains 3/5 under the independent remixed draw model; product 9/25.',
        ],
        ['3/10', '6/25'],
      ),
      N(
        [
          '另一袋2红3蓝，不放回抽两次，求BB。',
          'Another bag has two red and three blue. Draw twice without replacement; find P(BB).',
        ],
        '3/10',
        [
          '首蓝3/5，后蓝2/4，路径概率3/10。',
          'First blue 3/5 and second given blue 2/4 give 3/10.',
        ],
        ['9/25', '1/10'],
      ),
    ],
    pick: {
      stem: [
        '一般乘法法则是哪一个？',
        'Which is the general multiplication rule?',
      ],
      options: [
        ['P(A且B)=P(A)+P(B)', 'P(A and B)=P(A)+P(B)'],
        ['所有情况都乘边际概率', 'Always multiply the two marginals'],
        ['P(A且B)=P(A)P(B|A)，P(A)>0', 'P(A and B)=P(A)P(B|A), P(A)>0'],
      ],
      feedback: [
        [
          '相加用于互斥路径的并，不是沿路径的且。',
          'Addition combines disjoint alternatives, not successive conditions.',
        ],
        [
          '仅在有依据独立时可用未改变的边际。',
          'Unchanged marginals require justified independence.',
        ],
        [
          '条件概率随首步更新；一般法则不要求独立。',
          'Update for the first condition; this rule does not require independence.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '袋中3红2蓝，逐枚编号，每次对余球等可能抽，连续两抽且不放回。解释RR为何不能用3/5×3/5，以及颜色不同为何还要另一条路径。',
      'A bag has three red and two blue balls, individually identified. Draw twice without replacement, each draw uniform over the remaining balls. Explain why RR is not 3/5×3/5 and why different colours require another path.',
    ],
    rubric: [
      '第一红后剩2红共4，第二步条件概率2/4而非3/5，RR=3/10。RB=3/5×2/4，BR=2/5×3/4，二者各3/10且互斥，相加3/5。颜色路径数量不等概率，不能只数四个字母路径；零分支不当作可能结果。',
      'After first red, two reds remain among four, so RR=3/5×2/4=3/10. RB=3/5×2/4 and BR=2/5×3/4 each give 3/10; add these disjoint paths for 3/5. Colour paths are not equally likely merely because there are four labels. Exclude impossible zero branches.',
    ],
    misconception: [
      '沿路径相乘的是条件概率，跨互斥路径才相加。',
      'Multiply conditional probabilities along a path; add disjoint alternative paths.',
    ],
  },
  {
    title: ['不放回抽取', 'Sampling without replacement'],
    objective: [
      '用等可能编号有序对与更新的数量核不放回事件概率。',
      'Audit no-replacement probabilities using equally likely ordered ID pairs and updated counts.',
    ],
    lab: 'probability-without',
    prerequisites: ['J97-L02'],
    keywords: [
      ['不放回', 'without replacement'],
      ['编号有序对', 'ordered ID pairs'],
      ['补事件', 'complement'],
    ],
    hook: [
      '不放回排除“同一个球”还是排除“同一种颜色”？',
      'Does no replacement exclude the same token, or every token of the same colour?',
    ],
    items: [
      N(
        [
          '3红2蓝编号球不放回抽两次。求颜色不同概率。',
          'Three red and two blue numbered tokens, two draws without replacement. Find different-colour probability.',
        ],
        '3/5',
        [
          '5×4=20个等可能有序对，RB有3×2=6、BR也6，12/20=3/5。',
          'There are 5×4=20 ordered pairs; RB has six and BR six, giving 12/20=3/5.',
        ],
        ['1/2', '6/25'],
        { kind: 'probability-pairs', red: 3, blue: 2, replace: false },
      ),
      N(
        [
          '同袋5个不同编号，不放回抽两次，有多少个编号有序对？',
          'Same five distinct IDs, two draws without replacement: how many ordered ID pairs?',
        ],
        '20',
        [
          '第一步5选，第二步4选，5×4=20；第一第二有序。',
          'Five first choices and four second choices give 20, retaining order.',
        ],
        ['25', '10', '4'],
      ),
      N(
        [
          '同袋求两次红的概率，用编号数核验。',
          'Find two-red probability in the same bag using ID counts.',
        ],
        '3/10',
        [
          '红有序对3×2=6，总20，6/20=3/10。',
          'Three times two red ID pairs out of 20 give 3/10.',
        ],
        ['1/4', '9/25'],
      ),
      N(
        ['同袋求两次蓝的概率。', 'Find two-blue probability in the same bag.'],
        '1/10',
        [
          '蓝有序对2×1=2，2/20=1/10。',
          'Two times one blue pairs give 2/20=1/10.',
        ],
        ['1/4', '4/25'],
      ),
      N(
        ['同袋求至少一次蓝的概率。', 'Find at least one blue in the same bag.'],
        '7/10',
        [
          '至少蓝是RR的补事件，1−3/10=7/10；也可加RB、BR、BB。',
          'At least one blue complements RR, so 1−3/10=7/10; alternatively add RB, BR, BB.',
        ],
        ['3/5', '1/10', '4/5'],
      ),
      N(
        [
          '另一袋1红3蓝，不放回抽两次，求RR。',
          'Another bag has one red and three blue. Two draws without replacement: find P(RR).',
        ],
        '0',
        [
          '首红后没有红，第二红条件概率0，RR不可能；同颜色并非总不可能，BB仍可。',
          'After the sole red is drawn no red remains, so RR is impossible; BB can still occur.',
        ],
        ['1/16', '1/4'],
      ),
    ],
    pick: {
      stem: [
        '不放回时，编号表哪一格必须排除？',
        'Without replacement, which ID-grid cell must be excluded?',
      ],
      options: [
        ['R1→R1', 'R1→R1'],
        ['R1→R2', 'R1→R2'],
        ['R1→B1', 'R1→B1'],
      ],
      feedback: [
        [
          '同一编号已经取走，不能再抽。',
          'The same ID has been removed and cannot be drawn again.',
        ],
        ['不同编号的红球仍可抽。', 'A different red ID remains possible.'],
        ['另一颜色的该编号仍可抽。', 'This other-colour ID remains possible.'],
      ],
      correct: 0,
    },
    reason: [
      '原袋R1、R2、R3、B1、B2五球，每次对可抽球等可能。两个独立分支各从原袋开始抽两次，分别放回与不放回；比较编号有序对总数，说明为何不能把RR、RB、BR、BB当四个等可能结果。',
      'The original bag contains R1,R2,R3,B1,B2, with each draw uniform over available balls. TWO INDEPENDENT branches each start from that bag and draw twice, with or without replacement. Compare ordered-ID-pair totals and explain why RR,RB,BR,BB are not four equally likely outcomes.',
    ],
    rubric: [
      '5编号放回有25有序对，不放回有20。3红2蓝不放回颜色类别对应6、6、6、2个编号有序对，因此概率3/10、3/10、3/10、1/10不相等。排除的是同编号对角线，R1R2与R2R1顺序不同都保留。若改用无序对须一致重算分子分母，不能把无序分子除有序分母。',
      'Five IDs yield 25 ordered pairs with replacement and 20 without. The four colour categories contain 6,6,6,2 pairs, giving 3/10,3/10,3/10,1/10. Exclude the same-ID diagonal; retain both R1R2 and R2R1. An unordered-pair method must consistently recount numerator and denominator, never mixing conventions.',
    ],
    misconception: [
      '同编号不能再抽；同颜色的另一编号仍可能。',
      'The same ID cannot return; a different ID of the same colour may remain.',
    ],
  },
  {
    title: ['样本偏差', 'Sampling bias'],
    objective: [
      '分别核总体覆盖、选择办法与未回答，区分回答者比例和总体真值。',
      'Audit coverage, selection and nonresponse, distinguishing respondent proportion from population truth.',
    ],
    lab: 'probability-bias',
    prerequisites: ['J76-L01', 'J88-L05'],
    keywords: [
      ['抽样框', 'sampling frame'],
      ['未回答', 'nonresponse'],
      ['偏差', 'bias'],
    ],
    hook: [
      '把身边A组全部问完，为什么仍可能答不出全部A/B/C组的比例？',
      'Why might asking every nearby A-group member still fail to establish the proportion across A/B/C?',
    ],
    items: [
      N(
        [
          '虚构A组8张卡全部回答，其中2张“是”。求A组回答者中的比例。',
          'All eight fictional A-group cards respond, two yes. Find the respondent yes proportion.',
        ],
        '1/4',
        [
          '回答者分母8，是2，比例2/8=1/4，只描述A组。',
          'Two yes among eight responses give 1/4, describing A only.',
        ],
        ['1/12', '1/2'],
      ),
      N(
        [
          '已知完整普查：A/B/C各8张，“是”分别2、4、6。求全部24张的比例。',
          'A complete census has eight A/B/C cards each, with yes counts 2,4,6. Find the proportion among all 24.',
        ],
        '1/2',
        ['是共12，总24，12/24=1/2。', 'Twelve yes among 24 give 1/2.'],
        ['1/4', '3/4'],
      ),
      N(
        [
          '邀请12张卡，8张回答，其中6张是，4张未回答。求回答者中的“是”比例。',
          'Invite 12 cards; eight respond, six yes, four missing. Find yes proportion among respondents.',
        ],
        '3/4',
        [
          '分母是8个有效回答，不是12次邀请；6/8=3/4。',
          'Use eight responses rather than 12 invitations: 6/8=3/4.',
        ],
        ['1/2', '2/3'],
      ),
      V(
        [
          '只问完A组全部8张，足以断言全部24张的精确比例为1/4吗？',
          'All eight A cards are asked. Is that sufficient to assert the exact all-24 proportion is 1/4?',
        ],
        'insufficient',
        [
          '漏掉B/C，增加A组覆盖不能补回其他组；目标总体不是A。',
          'B/C are omitted; covering more A does not restore other groups. The target is not A alone.',
        ],
        ['sufficient', '独立'],
      ),
      V(
        [
          '完整24张逐一回答，没有遗漏且记录准确，其中12张是。足以知道这24张的精确比例吗？',
          'All 24 respond with accurate records and no omissions, twelve yes. Is that sufficient to know the exact proportion of these 24?',
        ],
        'sufficient',
        [
          '这是假定记录准确的完整普查，12/24确定本总体；不自动推广到另一个总体。',
          'This accurate complete census determines this population’s 12/24, without automatically generalising to another.',
        ],
        ['insufficient', '随机'],
      ),
      E(
        [
          '解释为何扩大到A组全部8张不能修复覆盖偏差；若全框抽取但C组不回答，又该如何报告？',
          'Explain why all eight A cards do not fix undercoverage; how should a full-frame sample with C nonresponse be reported?',
        ],
        [
          'A/B/C各8张，是分别2/4/6，A比例1/4但总体1/2。A组普查仍漏16张。全框选择不保证全体回答，C不回答须记未回答，不能改否或把邀请数当回答分母。报告总体、框、邀请/回答/未回答数、选择与回应机制及局限，尝试覆盖遗漏组和改善回应，不能保证某次小随机样本恰好代表。',
          'A/B/C yes proportions differ: A=1/4 but all=1/2. A-only census omits 16 cards. Full-frame selection does not ensure full response. Record C nonresponse as missing, never no, and use respondents as the yes-proportion denominator. Report target, frame, invitations/responses/missing counts, selection and response mechanisms and limits; improve coverage and follow-up without promising a perfectly representative small random sample.',
        ],
      ),
    ],
    pick: {
      stem: [
        '邀请12、回答8、是6、未回答4；哪句话正确？',
        'Invited 12, responded 8, yes 6, missing 4. Which statement is correct?',
      ],
      options: [
        ['未回答都当否，比例1/2', 'Treat missing as no; proportion 1/2'],
        [
          '回答者中是3/4，不能直接断言总体3/4',
          'Respondent yes=3/4; population need not be 3/4',
        ],
        [
          '样本越大任何偏差自动消失',
          'Every bias disappears automatically with size',
        ],
      ],
      feedback: [
        [
          '未回答不是否，分母身份错。',
          'Missing is not no; the denominator describes a different quantity.',
        ],
        [
          '对回答者的准确描述不自动成为总体真值。',
          'An accurate respondent description is not automatically population truth.',
        ],
        [
          '样本量不能自动修复覆盖或回应机制。',
          'Size alone cannot repair coverage or response mechanisms.',
        ],
      ],
      correct: 1,
    },
    reason: [
      '随机抽到的8张卡比例刚好1/2，是否证明抽样办法永远无偏且每次代表总体？',
      'A random sample of eight happens to give 1/2. Does this prove every sample is representative and the procedure always unbiased?',
    ],
    rubric: [
      '一次吻合只是一批结果。评估办法要看是否从目标全框按已知机会选取、重复/遗漏及未回答，不能只看结果是否接近真值。合适随机办法仍有有限样本波动；反过来一个偏窄办法也可能偶然给对比例。区分方法的长期性质、单次样本和完整普查。',
      'One match is one outcome. Audit selection opportunities across the target frame, duplicates, omissions and nonresponse, rather than judging a procedure solely by closeness to truth. Appropriate random samples still vary; a restricted method can sometimes match by accident. Distinguish long-run design properties, one sample and a complete census.',
    ],
    misconception: [
      '扩大样本不自动修复偏差；未回答不是否。',
      'Larger samples do not automatically repair bias; missing is not no.',
    ],
  },
  {
    title: [
      '模拟核对理论概率',
      'Testing theoretical probability by simulation',
    ],
    objective: [
      '按明确试验模型保留模拟记录，比较累计频率与理论值并解释有限波动。',
      'Preserve simulated trial records under an explicit model, comparing cumulative frequency with theory and explaining finite variation.',
    ],
    lab: 'probability-simulation',
    prerequisites: ['J97-L03', 'J97-L04', 'P67-L05'],
    keywords: [
      ['理论概率', 'theoretical probability'],
      ['累计频率', 'cumulative frequency'],
      ['可重放模拟', 'reproducible simulation'],
    ],
    hook: [
      '理论异色概率3/5，20次里实际11次异色，应记录3/5还是11/20？',
      'With theoretical different-colour probability 3/5, a run has 11 hits in 20 trials. Do we record 3/5 or 11/20?',
    ],
    items: [
      N(
        [
          '3红2蓝，每轮恢复原袋，轮内不放回抽两次；20轮有11轮异色。写实际频率。',
          'Restore the three-red/two-blue bag each trial; draw twice without replacement within it. Eleven different-colour hits in 20 trials: give observed frequency.',
        ],
        '11/20',
        [
          '频率按记录11/20，不把理论3/5覆盖成12次。',
          'Observed frequency is 11/20; do not overwrite records with the theoretical 3/5 or invent 12 hits.',
        ],
        ['3/5', '12/20'],
        { kind: 'probability-record', hits: 11, total: 20 },
      ),
      N(
        [
          '同一公平编号模型，不放回两抽，求异色理论概率。',
          'For the same equally likely numbered model, two draws without replacement: find theoretical different-colour probability.',
        ],
        '3/5',
        [
          'RB与BR各3/10，理论值3/5，与某批运行次数无关。',
          'RB and BR each have probability 3/10; theory is 3/5, independent of a particular run’s count.',
        ],
        ['11/20', '1/2'],
      ),
      V(
        [
          '还未开始，0轮0命中。足以给出定义良好的命中频率吗？',
          'Before starting, zero trials and zero hits. Is that sufficient to give a defined hit frequency?',
        ],
        'insufficient',
        [
          '0/0没有定义，不把零轮显示为0%。',
          'Zero over zero is undefined; do not display zero trials as 0%.',
        ],
        ['sufficient', '0'],
      ),
      N(
        [
          '同模型100轮记录58命中。求实际频率。',
          'One hundred trials record 58 hits. Find observed frequency.',
        ],
        '29/50',
        [
          '58/100=29/50，记录是58而不是按理论改60。',
          '58/100=29/50; retain 58 rather than replacing it with theoretical 60.',
        ],
        ['3/5', '58'],
        { kind: 'probability-record', hits: 58, total: 100 },
      ),
      N(
        [
          '已有100轮58命中，追加10轮其中3命中。求110轮累计频率。',
          'After 58 hits in 100 trials, append ten trials with three hits. Find cumulative frequency across 110.',
        ],
        '61/110',
        [
          '总命中61，总轮数110，不平均58%与30%。',
          'There are 61 hits among 110 trials; do not equally average 58% and 30%.',
        ],
        ['11/25', '3/5', '3/10'],
      ),
      E(
        [
          '累计频率一次接近3/5，能证明模型或保证下一批更接近吗？说明试验重置、种子和记录该如何保留。',
          'Does a frequency near 3/5 prove the model or guarantee the next batch is closer? Explain reset rules, seeds and record preservation.',
        ],
        [
          '先写每轮原袋3红2蓝、各编号等机会、轮内不放回、轮间恢复原袋及所求异色。理论3/5，有限频率可高可低、不保证单调靠近或恰好等于。一次吻合不证明模型；一次偏离也不自动推翻。种子提供伪随机重放，不冒充真实观测；记录总轮数、命中、参数和种子，换规则重新开始，不能挑好看运行或修改命中数。',
          'Specify the original three-red/two-blue bag, equally likely IDs, no within-trial replacement, reset between trials and the different-colour event. Theory is 3/5; finite frequency can lie above or below it and need not improve monotonically or equal it. One match does not prove the model, and one discrepancy does not automatically refute it. Seeds give pseudorandom replay, not real observations. Keep counts, parameters and seed; restart changed rules and never cherry-pick or alter hits.',
        ],
      ),
    ],
    pick: {
      stem: [
        '看到前10轮没命中，下一轮是否“必须补回来”？',
        'After ten misses, must the next trial compensate with a hit?',
      ],
      options: [
        ['是，否则长期不平衡', 'Yes, otherwise long-run balance fails'],
        [
          '下一轮概率由累计亏欠决定',
          'Its probability depends on the accumulated debt',
        ],
        [
          '按同一独立重置模型，下一轮仍用原概率',
          'Under the same independently reset model, next-trial probability remains unchanged',
        ],
      ],
      feedback: [
        [
          '长期比例描述不要求下一步补偿。',
          'Long-run proportion does not require next-step compensation.',
        ],
        [
          '模型没有概率亏欠账户。',
          'The model has no accumulated probability debt.',
        ],
        [
          '历史不改变明确独立重置的下一轮概率。',
          'History does not change the next trial in the stipulated independent reset model.',
        ],
      ],
      correct: 2,
    },
    reason: [
      '比较理论、模拟和真实测量，并解释为何轮内不放回仍要轮间恢复。',
      'Distinguish theory, simulation and real measurements, and explain resetting between no-replacement trials.',
    ],
    rubric: [
      '理论基于假设计算事件概率。模拟按代码的抽取和重置规则生成有限伪随机记录，核的是这些规则是否吻合理论，不能替代真实装置资料。轮内移走首球保留条件变化，轮间恢复原袋让每轮对应同一试验；若一直移走球，后续不是原模型。频率仅n>0定义，分母是完整两抽试验轮数，不是单次抽球数。',
      'Theory computes probability from assumptions. Simulation produces finite pseudorandom records under coded selection/reset rules, auditing that model rather than supplying real-device data. Remove the first token within a trial to preserve the conditional change; restore the bag between trials so each trial represents the same experiment. Continuing to remove tokens changes the model. Frequency needs n>0 and counts complete two-draw trials, not individual draws.',
    ],
    misconception: [
      '理论不改写实际记录，更多试验不保证每一步更接近。',
      'Theory does not rewrite observations, and more trials do not guarantee each step is closer.',
    ],
  },
];
function q(id: string, i: number, v: Item): Question {
  if (v.answer.kind === 'explain')
    return reasoning(
      id,
      T(v.stem),
      skills[i]!,
      v.answer.rubric,
      hints[i]!.map(T),
    );
  const value = 'value' in v.answer ? v.answer.value : '',
    r = numeric(
      id,
      T(v.stem),
      String(value),
      skills[i]!,
      hints[i]!.map(T),
      [T(v.step)],
      { accepted: [String(value)], rejected: v.wrong },
      v.diagram,
    );
  r.answer = v.answer;
  return r;
}
function pick(id: string, i: number, p: Pick) {
  return choice(
    id,
    T(p.stem),
    p.correct,
    skills[i]!,
    p.options.map((v, j) => ({ text: T(v), feedback: T(p.feedback[j]!) })),
    hints[i]!.map(T),
    [T(p.feedback[p.correct]!)],
  );
}
export const j97Lessons: Lesson[] = specs.map((s, i) => {
  const id = `J97-L0${i + 1}`;
  return {
    id,
    title: T(s.title),
    objective: T(s.objective),
    prerequisites: s.prerequisites,
    keywords: s.keywords.map(T),
    minutes: 20,
    lab: s.lab,
    hook: T(s.hook),
    stage: 'J09',
    unit: 'J97',
    order: i + 1,
    nzYearHints: [9, 10, 11],
    cnGradeHints: [9],
    contentStatus: 'ready',
    skillTags: [skills[i]!],
    guided: q(`${id}-G`, i, s.items[0]!),
    questions: [
      pick(`${id}-Q1`, i, s.pick),
      ...s.items.slice(1, 5).map((v, j) => q(`${id}-Q${j + 2}`, i, v)),
      reasoning(
        `${id}-Q6`,
        T(s.reason),
        skills[i]!,
        T(s.rubric),
        hints[i]!.map(T),
      ),
    ],
    exit: q(`${id}-X`, i, s.items[5]!),
    exitReason: T(s.objective),
    parent: {
      goal: T(s.objective),
      misconception: T(s.misconception),
      prompts: [
        t(
          '先说明总体或结果空间，为什么等机会？',
          'Name the population or outcome space. Why equally likely?',
        ),
        t(
          '分母对应谁？条件与实际记录有没有改变？',
          'What does the denominator count? Have conditions or actual records changed?',
        ),
      ],
      bridge: s.prerequisites[0]!,
    },
    ...(i === 4
      ? {
          familyChallenge: t(
            '纸上设计虚构抽球研究：三红两蓝编号，分别列放回与不放回的完整有序对，求RR和异色。先给理论预测，再在本地模拟保留两个种子各100轮的命中与频率，解释任何偏离，不挑好看运行。另用A/B/C资料卡核覆盖和未回答。家长审等可能、条件分母、轮间重置、记录和局限；无需购买、真实调查或上传。',
            'Design a fictional paper token study: number three red and two blue tokens, list ordered pairs with/without replacement, and predict RR and different-colour theory. Preserve two seeded 100-trial local runs, counts and frequencies, explaining discrepancies without selecting prettier runs. Audit A/B/C card coverage and nonresponse separately. A parent reviews equal likelihood, conditional denominators, resets, records and limits; no purchase, real survey or upload is required.',
          ),
        }
      : {}),
  };
});
export function j97ReviewQuestion(id: string, round: number): Question {
  if (
    !/^J97-L0[1-5]$/.test(id) ||
    !Number.isSafeInteger(round) ||
    round < 0 ||
    round > 100000
  )
    throw new RangeError('Invalid J97 review');
  const i = Number(id.slice(-1)) - 1,
    k = round % 80;
  let v: Item;
  if (i === 0) {
    const a = 1 + (k % 3),
      b = 1 + (Math.floor(k / 3) % 2),
      c = 1 + (Math.floor(k / 6) % 3),
      d = 1 + (Math.floor(k / 18) % 2),
      cells = [a * c + (k % 2), a * d, b * c, b * d],
      m = jointModel(cells);
    v = I(
      [
        `完整等可能模型四格A且B、仅A、仅B、皆非为${cells.join('、')}。判断独立。`,
        `A complete equally likely model has overlap, A-only, B-only, neither counts ${cells.join(', ')}. Judge independence.`,
      ],
      m.independent ? 'independent' : 'dependent',
      [
        `交集${probabilityString(m.pAB)}，边际乘积${probabilityString(m.product)}；比较两者。`,
        `Compare intersection ${probabilityString(m.pAB)} with marginal product ${probabilityString(m.product)}.`,
      ],
      [m.independent ? 'dependent' : 'independent'],
      { kind: 'probability-joint', cells },
    );
  } else if (i === 1 || i === 2) {
    const red = 1 + (k % 5),
      blue = 1 + (Math.floor(k / 5) % 5),
      replace = i === 1 && Math.floor(k / 25) % 2 === 1,
      m = numberedPairs(red, blue, replace);
    if (i === 1) {
      const path = ['RR', 'RB', 'BR', 'BB'][k % 4]!,
        leaf = m.leaves.find((l) => l.code === path)!;
      v = N(
        [
          `${red}红${blue}蓝编号球，${replace ? '放回并混匀' : '不放回'}两抽，求${path}。`,
          `${red} red and ${blue} blue equally likely IDs; two draws ${replace ? 'with replacement and remixing' : 'without replacement'}. Find P(${path}).`,
        ],
        probabilityString(leaf.probability),
        [
          `${probabilityString(leaf.firstProbability)}×${probabilityString(leaf.conditionalProbability)}=${probabilityString(leaf.probability)}。`,
          `Multiply ${probabilityString(leaf.firstProbability)} by ${probabilityString(leaf.conditionalProbability)} to get ${probabilityString(leaf.probability)}.`,
        ],
        ['-1', '2'],
      );
    } else {
      const event = (['different', 'two-red', 'at-least-blue'] as TreeEvent[])[
          Math.floor(k / 5) % 3
        ]!,
        e = treeEvent(m, event),
        names = {
          different: ['异色', 'different colours'],
          'two-red': ['两次红', 'two reds'],
          'at-least-blue': ['至少一次蓝', 'at least one blue'],
        } as const;
      v = N(
        [
          `${red}红${blue}蓝编号球，不放回两抽，求${names[event][0]}。`,
          `${red} red and ${blue} blue equally likely IDs, two draws without replacement. Find probability of ${names[event][1]}.`,
        ],
        probabilityString(e.probability),
        [
          `${e.labelledHits}/${m.labelledTotal}=${probabilityString(e.probability)}，按编号有序对。`,
          `${e.labelledHits}/${m.labelledTotal}=${probabilityString(e.probability)}, using ordered ID pairs.`,
        ],
        ['-1', '2'],
      );
    }
  } else {
    const total = i === 3 ? 5 + (k % 4) : 20 + (k % 11),
      hits = 1 + (k % (i === 3 ? 5 : 13));
    v = N(
      i === 3
        ? [
            `邀请${total + 4}，回答${total}，其中${hits}是，其余4未回答。求回答者中比例。`,
            `Invited ${total + 4}; ${total} respond, ${hits} yes, four missing. Find yes proportion among respondents.`,
          ]
        : [
            `一批${total}轮完整试验有${hits}命中，求实际频率。`,
            `A run of ${total} complete trials has ${hits} hits. Find observed frequency.`,
          ],
      probabilityString(rational(BigInt(hits), BigInt(total))),
      [
        `用${hits}/${total}；分母是${i === 3 ? '有效回答' : '完整试验数'}。`,
        `Use ${hits}/${total}; the denominator counts ${i === 3 ? 'responses' : 'complete trials'}.`,
      ],
      ['-1', '2'],
    );
  }
  return q(`${id}-R${round}`, i, v);
}
export const j97CheckQuestions: Question[] = [
  q('J97-CHECK-Q1', 0, specs[0]!.items[0]!),
  q('J97-CHECK-Q2', 1, specs[1]!.items[0]!),
  q('J97-CHECK-Q3', 2, specs[2]!.items[0]!),
  q('J97-CHECK-Q4', 3, specs[3]!.items[2]!),
  q('J97-CHECK-Q5', 4, specs[4]!.items[4]!),
  reasoning(
    'J97-CHECK-Q6',
    T(specs[3]!.reason),
    skills[3]!,
    T(specs[3]!.rubric),
    hints[3]!.map(T),
  ),
  pick('J97-CHECK-Q7', 4, specs[4]!.pick),
  q('J97-CHECK-Q8', 4, specs[4]!.items[5]!),
];
