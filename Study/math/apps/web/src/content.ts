import {
  h23Lessons,
  h23ReviewQuestion,
  h23CheckQuestions,
} from './content/H23';
import {
  h22Lessons,
  h22ReviewQuestion,
  h22CheckQuestions,
} from './content/H22';
import {
  h21Lessons,
  h21ReviewQuestion,
  h21CheckQuestions,
} from './content/H21';
import {
  h08Lessons,
  h08ReviewQuestion,
  h08CheckQuestions,
} from './content/H08';
import {
  h07Lessons,
  h07ReviewQuestion,
  h07CheckQuestions,
} from './content/H07';
import {
  h06Lessons,
  h06ReviewQuestion,
  h06CheckQuestions,
} from './content/H06';
import {
  h05Lessons,
  h05ReviewQuestion,
  h05CheckQuestions,
} from './content/H05';
import {
  h04Lessons,
  h04ReviewQuestion,
  h04CheckQuestions,
} from './content/H04';
import {
  h03Lessons,
  h03ReviewQuestion,
  h03CheckQuestions,
} from './content/H03';
import {
  h02Lessons,
  h02ReviewQuestion,
  h02CheckQuestions,
} from './content/H02';
import {
  h01Lessons,
  h01ReviewQuestion,
  h01CheckQuestions,
} from './content/H01';
import {
  j98Lessons,
  j98ReviewQuestion,
  j98CheckQuestions,
} from './content/J98';
import {
  j97Lessons,
  j97ReviewQuestion,
  j97CheckQuestions,
} from './content/J97';
import {
  j96Lessons,
  j96ReviewQuestion,
  j96CheckQuestions,
} from './content/J96';
import {
  j95Lessons,
  j95ReviewQuestion,
  j95CheckQuestions,
} from './content/J95';
import {
  j94Lessons,
  j94ReviewQuestion,
  j94CheckQuestions,
} from './content/J94';
import {
  j93Lessons,
  j93ReviewQuestion,
  j93CheckQuestions,
} from './content/J93';
import {
  j92Lessons,
  j92ReviewQuestion,
  j92CheckQuestions,
} from './content/J92';
import {
  j91Lessons,
  j91ReviewQuestion,
  j91CheckQuestions,
} from './content/J91';
import {
  j88Lessons,
  j88ReviewQuestion,
  j88CheckQuestions,
} from './content/J88';
import {
  j84Lessons,
  j84ReviewQuestion,
  j84CheckQuestions,
} from './content/J84';
import {
  j85Lessons,
  j85ReviewQuestion,
  j85CheckQuestions,
} from './content/J85';
import {
  j86Lessons,
  j86ReviewQuestion,
  j86CheckQuestions,
} from './content/J86';
import {
  j87Lessons,
  j87ReviewQuestion,
  j87CheckQuestions,
} from './content/J87';
import curriculumData from '../../../content/curriculum.json';
import {
  lessons as b04Lessons,
  diagnosticGroups,
  reviewQuestions as b04ReviewQuestions,
  reviewQuestionFor as b04ReviewQuestionFor,
} from './content/foundationPilot';
import {
  b01Lessons,
  b01ReviewQuestion,
  b01CheckQuestions,
} from './content/B01';
import {
  b02Lessons,
  b02ReviewQuestion,
  b02CheckQuestions,
} from './content/B02';
import {
  b03Lessons,
  b03CheckQuestions,
  b03ReviewQuestion,
} from './content/B03';
import {
  b05Lessons,
  b05CheckQuestions,
  b05ReviewQuestion,
} from './content/B05';
import {
  b06Lessons,
  b06CheckQuestions,
  b06ReviewQuestion,
} from './content/B06';
import { t, type Lesson, type Question } from './model';
import {
  p51Lessons,
  p51CheckQuestions,
  p51ReviewQuestion,
} from './content/P51';
import {
  p52Lessons,
  p52CheckQuestions,
  p52ReviewQuestion,
} from './content/P52';
import {
  p53Lessons,
  p53CheckQuestions,
  p53ReviewQuestion,
} from './content/P53';
import {
  p54Lessons,
  p54CheckQuestions,
  p54ReviewQuestion,
} from './content/P54';
import {
  p55Lessons,
  p55CheckQuestions,
  p55ReviewQuestion,
} from './content/P55';
import {
  p56Lessons,
  p56CheckQuestions,
  p56ReviewQuestion,
} from './content/P56';
import {
  p57Lessons,
  p57CheckQuestions,
  p57ReviewQuestion,
} from './content/P57';
import {
  p61Lessons,
  p61CheckQuestions,
  p61ReviewQuestion,
} from './content/P61';
import {
  p62Lessons,
  p62CheckQuestions,
  p62ReviewQuestion,
} from './content/P62';
import {
  p63Lessons,
  p63CheckQuestions,
  p63ReviewQuestion,
} from './content/P63';
import {
  p64Lessons,
  p64CheckQuestions,
  p64ReviewQuestion,
} from './content/P64';
import {
  p65Lessons,
  p65CheckQuestions,
  p65ReviewQuestion,
} from './content/P65';
import {
  p66Lessons,
  p66CheckQuestions,
  p66ReviewQuestion,
} from './content/P66';
import {
  p67Lessons,
  p67CheckQuestions,
  p67ReviewQuestion,
} from './content/P67';
import {
  p68Lessons,
  p68CheckQuestions,
  p68ReviewQuestion,
} from './content/P68';
import {
  j71Lessons,
  j71CheckQuestions,
  j71ReviewQuestion,
} from './content/J71';
import {
  j72Lessons,
  j72CheckQuestions,
  j72ReviewQuestion,
} from './content/J72';
import {
  j73Lessons,
  j73CheckQuestions,
  j73ReviewQuestion,
} from './content/J73';
import {
  j74Lessons,
  j74CheckQuestions,
  j74ReviewQuestion,
} from './content/J74';
import {
  j75Lessons,
  j75CheckQuestions,
  j75ReviewQuestion,
} from './content/J75';
import {
  j76Lessons,
  j76CheckQuestions,
  j76ReviewQuestion,
} from './content/J76';
export const curriculum = curriculumData;
import {
  j81Lessons,
  j81ReviewQuestion,
  j81CheckQuestions,
} from './content/J81';
import {
  j82Lessons,
  j82ReviewQuestion,
  j82CheckQuestions,
} from './content/J82';
import {
  j83Lessons,
  j83ReviewQuestion,
  j83CheckQuestions,
} from './content/J83';
export const lessons: Lesson[] = [
  ...b01Lessons,
  ...b02Lessons,
  ...b03Lessons,
  ...b04Lessons.map((l) => ({
    ...l,
    stage: 'B00',
    unit: 'B04',
    order: Number(l.id.slice(-2)),
    skillTags: [...new Set(l.questions.map((q) => q.skill))],
    nzYearHints: [4, 5, 6],
    cnGradeHints: [4, 5],
    contentStatus: 'ready' as const,
  })),
  ...b05Lessons,
  ...b06Lessons,
  ...p51Lessons,
  ...p52Lessons,
  ...p53Lessons,
  ...p54Lessons,
  ...p55Lessons,
  ...p56Lessons,
  ...p57Lessons,
  ...p61Lessons,
  ...p62Lessons,
  ...p63Lessons,
  ...p64Lessons,
  ...p65Lessons,
  ...p66Lessons,
  ...p67Lessons,
  ...p68Lessons,
  ...j71Lessons,
  ...j72Lessons,
  ...j73Lessons,
  ...j74Lessons,
  ...j75Lessons,
  ...j76Lessons,
  ...j81Lessons,
  ...j82Lessons,
  ...j83Lessons,
  ...j84Lessons,
  ...j85Lessons,
  ...j86Lessons,
  ...j87Lessons,
  ...j88Lessons,
  ...j91Lessons,
  ...j92Lessons,
  ...j93Lessons,
  ...j94Lessons,
  ...j95Lessons,
  ...j96Lessons,
  ...j97Lessons,
  ...j98Lessons,
  ...h01Lessons,
  ...h02Lessons,
  ...h03Lessons,
  ...h04Lessons,
  ...h05Lessons,
  ...h06Lessons,
  ...h07Lessons,
  ...h08Lessons,
  ...h21Lessons,
  ...h22Lessons,
  ...h23Lessons,
];
export { diagnosticGroups };
export const lessonById = (id?: string) => lessons.find((l) => l.id === id);
export const openUnits = curriculum
  .flatMap((stage) =>
    stage.units.map((unit) => ({
      ...unit,
      stage: stage.id,
      openLessons: lessons.filter((l) => l.unit === unit.id),
    })),
  )
  .filter((unit) => unit.openLessons.length);
export const reviewQuestions: Record<string, Question> = {
  ...Object.fromEntries(
    h23Lessons.map((l) => [l.id, h23ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    h22Lessons.map((l) => [l.id, h22ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    h21Lessons.map((l) => [l.id, h21ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    h08Lessons.map((l) => [l.id, h08ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    h07Lessons.map((l) => [l.id, h07ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    h06Lessons.map((l) => [l.id, h06ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    h05Lessons.map((l) => [l.id, h05ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    h04Lessons.map((l) => [l.id, h04ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    h03Lessons.map((l) => [l.id, h03ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    h02Lessons.map((l) => [l.id, h02ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    h01Lessons.map((l) => [l.id, h01ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    j98Lessons.map((l) => [l.id, j98ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    j97Lessons.map((l) => [l.id, j97ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    j96Lessons.map((l) => [l.id, j96ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    j95Lessons.map((l) => [l.id, j95ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    j94Lessons.map((l) => [l.id, j94ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    j93Lessons.map((l) => [l.id, j93ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    j92Lessons.map((l) => [l.id, j92ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    j76Lessons.map((l) => [l.id, j76ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    j75Lessons.map((l) => [l.id, j75ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    j74Lessons.map((l) => [l.id, j74ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    j73Lessons.map((l) => [l.id, j73ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    j72Lessons.map((l) => [l.id, j72ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    j71Lessons.map((l) => [l.id, j71ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p68Lessons.map((l) => [l.id, p68ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p67Lessons.map((l) => [l.id, p67ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p66Lessons.map((l) => [l.id, p66ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    [...p64Lessons, ...p65Lessons].map((l) => [
      l.id,
      l.unit === 'P65'
        ? p65ReviewQuestion(l.id, 0)
        : p64ReviewQuestion(l.id, 0),
    ]),
  ),
  ...Object.fromEntries(
    p63Lessons.map((l) => [l.id, p63ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p62Lessons.map((l) => [l.id, p62ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p61Lessons.map((l) => [l.id, p61ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p57Lessons.map((l) => [l.id, p57ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p56Lessons.map((l) => [l.id, p56ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p55Lessons.map((l) => [l.id, p55ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p54Lessons.map((l) => [l.id, p54ReviewQuestion(l.id, 0)]),
  ),
  ...b04ReviewQuestions,
  ...Object.fromEntries(
    b01Lessons.map((l) => [l.id, b01ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    b02Lessons.map((l) => [l.id, b02ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    b03Lessons.map((l) => [l.id, b03ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    b05Lessons.map((l) => [l.id, b05ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    b06Lessons.map((l) => [l.id, b06ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p51Lessons.map((l) => [l.id, p51ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p52Lessons.map((l) => [l.id, p52ReviewQuestion(l.id, 0)]),
  ),
  ...Object.fromEntries(
    p53Lessons.map((l) => [l.id, p53ReviewQuestion(l.id, 0)]),
  ),
};
export function reviewQuestionFor(id: string, round: number): Question {
  if (id.startsWith('H23-')) return h23ReviewQuestion(id, round);
  if (id.startsWith('H22-')) return h22ReviewQuestion(id, round);
  if (id.startsWith('H21-')) return h21ReviewQuestion(id, round);
  if (id.startsWith('H08-')) return h08ReviewQuestion(id, round);
  if (id.startsWith('H07-')) return h07ReviewQuestion(id, round);
  if (id.startsWith('H06-')) return h06ReviewQuestion(id, round);
  if (id.startsWith('H05-')) return h05ReviewQuestion(id, round);
  if (id.startsWith('H04-')) return h04ReviewQuestion(id, round);
  if (id.startsWith('H03-')) return h03ReviewQuestion(id, round);
  if (id.startsWith('H02-')) return h02ReviewQuestion(id, round);
  if (id.startsWith('H01-')) return h01ReviewQuestion(id, round);
  if (id.startsWith('J98-')) return j98ReviewQuestion(id, round);
  if (id.startsWith('J97-')) return j97ReviewQuestion(id, round);
  if (id.startsWith('J96-')) return j96ReviewQuestion(id, round);
  if (id.startsWith('J95-')) return j95ReviewQuestion(id, round);
  if (id.startsWith('J94-')) return j94ReviewQuestion(id, round);
  if (id.startsWith('J93-')) return j93ReviewQuestion(id, round);
  if (id.startsWith('J92-')) return j92ReviewQuestion(id, round);
  if (id.startsWith('J91-')) return j91ReviewQuestion(id, round);
  if (id.startsWith('J88-')) return j88ReviewQuestion(id, round);
  if (id.startsWith('J87-')) return j87ReviewQuestion(id, round);
  if (id.startsWith('J86-')) return j86ReviewQuestion(id, round);
  if (id.startsWith('J85-')) return j85ReviewQuestion(id, round);
  if (id.startsWith('J84-')) return j84ReviewQuestion(id, round);
  if (id.startsWith('J83-')) return j83ReviewQuestion(id, round);
  if (id.startsWith('J82-')) return j82ReviewQuestion(id, round);
  if (id.startsWith('J81-')) return j81ReviewQuestion(id, round);
  if (id.startsWith('J76-')) return j76ReviewQuestion(id, round);
  if (id.startsWith('J75-')) return j75ReviewQuestion(id, round);
  if (id.startsWith('J74-')) return j74ReviewQuestion(id, round);
  if (id.startsWith('J73-')) return j73ReviewQuestion(id, round);
  if (id.startsWith('J72-')) return j72ReviewQuestion(id, round);
  if (id.startsWith('J71-')) return j71ReviewQuestion(id, round);
  if (id.startsWith('P68-')) return p68ReviewQuestion(id, round);
  if (id.startsWith('P67-')) return p67ReviewQuestion(id, round);
  if (id.startsWith('P66-')) return p66ReviewQuestion(id, round);
  if (id.startsWith('P65-')) return p65ReviewQuestion(id, round);
  if (id.startsWith('P64-')) return p64ReviewQuestion(id, round);
  if (id.startsWith('P63-')) return p63ReviewQuestion(id, round);
  if (id.startsWith('P62-')) return p62ReviewQuestion(id, round);
  if (id.startsWith('P61-')) return p61ReviewQuestion(id, round);
  if (id.startsWith('P57-')) return p57ReviewQuestion(id, round);
  if (id.startsWith('P56-')) return p56ReviewQuestion(id, round);
  if (id.startsWith('B01-')) return b01ReviewQuestion(id, round);
  if (id.startsWith('B02-')) return b02ReviewQuestion(id, round);
  if (id.startsWith('B03-')) return b03ReviewQuestion(id, round);
  if (id.startsWith('B05-')) return b05ReviewQuestion(id, round);
  if (id.startsWith('B06-')) return b06ReviewQuestion(id, round);
  if (id.startsWith('P51-')) return p51ReviewQuestion(id, round);
  if (id.startsWith('P52-')) return p52ReviewQuestion(id, round);
  if (id.startsWith('P55-')) return p55ReviewQuestion(id, round);
  if (id.startsWith('P54-')) return p54ReviewQuestion(id, round);
  if (id.startsWith('P53-')) return p53ReviewQuestion(id, round);
  return b04ReviewQuestionFor(id, round);
}
export const unitChecks = {
  H23: {
    id: 'H23-CHECK',
    unit: 'H23',
    title: t('空间向量小回顾', 'A small 3D vector review'),
    questions: h23CheckQuestions,
    bridge: 'H23-L01',
  },
  H22: {
    id: 'H22-CHECK',
    unit: 'H22',
    title: t('解析几何小回顾', 'A small analytic geometry review'),
    questions: h22CheckQuestions,
    bridge: 'H22-L01',
  },
  H21: {
    id: 'H21-CHECK',
    unit: 'H21',
    title: t('复数小回顾', 'A small complex numbers review'),
    questions: h21CheckQuestions,
    bridge: 'H21-L01',
  },
  H08: {
    id: 'H08-CHECK',
    unit: 'H08',
    title: t('数据建模小回顾', 'A small data modelling review'),
    questions: h08CheckQuestions,
    bridge: 'H08-L01',
  },
  H07: {
    id: 'H07-CHECK',
    unit: 'H07',
    title: t('数列小回顾', 'A small sequences review'),
    questions: h07CheckQuestions,
    bridge: 'H07-L01',
  },
  H06: {
    id: 'H06-CHECK',
    unit: 'H06',
    title: t('立体几何小回顾', 'A small solid geometry review'),
    questions: h06CheckQuestions,
    bridge: 'H06-L01',
  },
  H05: {
    id: 'H05-CHECK',
    unit: 'H05',
    title: t('平面向量小回顾', 'A small plane vector review'),
    questions: h05CheckQuestions,
    bridge: 'H05-L01',
  },
  H04: {
    id: 'H04-CHECK',
    unit: 'H04',
    title: t('三角函数扩展小回顾', 'A small circular functions review'),
    questions: h04CheckQuestions,
    bridge: 'H04-L01',
  },
  H03: {
    id: 'H03-CHECK',
    unit: 'H03',
    title: t('指数与对数小回顾', 'A small exponents and logarithms review'),
    questions: h03CheckQuestions,
    bridge: 'H03-L01',
  },
  H02: {
    id: 'H02-CHECK',
    unit: 'H02',
    title: t('函数语言小回顾', 'A small function language review'),
    questions: h02CheckQuestions,
    bridge: 'H02-L01',
  },
  H01: {
    id: 'H01-CHECK',
    unit: 'H01',
    title: t('集合与逻辑小回顾', 'A small sets and logic review'),
    questions: h01CheckQuestions,
    bridge: 'H01-L01',
  },
  J98: {
    id: 'J98-CHECK',
    unit: 'J98',
    title: t('初中知识联结小回顾', 'A small secondary integration review'),
    questions: j98CheckQuestions,
    bridge: 'J98-L01',
  },
  J97: {
    id: 'J97-CHECK',
    unit: 'J97',
    title: t(
      '概率、抽样与模拟小回顾',
      'A small probability, sampling and simulation review',
    ),
    questions: j97CheckQuestions,
    bridge: 'J97-L01',
  },
  J96: {
    id: 'J96-CHECK',
    unit: 'J96',
    title: t(
      '直角三角函数小回顾',
      'A small right-triangle trigonometry review',
    ),
    questions: j96CheckQuestions,
    bridge: 'J96-L01',
  },
  J95: {
    id: 'J95-CHECK',
    unit: 'J95',
    title: t('圆的性质小回顾', 'A small circle-geometry review'),
    questions: j95CheckQuestions,
    bridge: 'J95-L01',
  },
  J94: {
    id: 'J94-CHECK',
    unit: 'J94',
    title: t('相似图形小回顾', 'A small similarity review'),
    questions: j94CheckQuestions,
    bridge: 'J94-L01',
  },
  J93: {
    id: 'J93-CHECK',
    unit: 'J93',
    title: t('二次函数小回顾', 'A small quadratic-functions review'),
    questions: j93CheckQuestions,
    bridge: 'J93-L01',
  },
  J92: {
    id: 'J92-CHECK',
    unit: 'J92',
    title: t('一元二次方程小回顾', 'A small quadratic-equations review'),
    questions: j92CheckQuestions,
    bridge: 'J92-L01',
  },
  J91: {
    id: 'J91-CHECK',
    unit: 'J91',
    title: t('根式与实数小回顾', 'A small radicals and real-numbers review'),
    questions: j91CheckQuestions,
    bridge: 'J91-L01',
  },
  J88: {
    id: 'J88-CHECK',
    unit: 'J88',
    title: t('初中数据研究小回顾', 'A small secondary-data review'),
    questions: j88CheckQuestions,
    bridge: 'J88-L01',
  },
  J87: {
    id: 'J87-CHECK',
    unit: 'J87',
    title: t(
      '变换与勾股小回顾',
      'A small transformations and Pythagoras review',
    ),
    questions: j87CheckQuestions,
    bridge: 'J87-L01',
  },
  J86: {
    id: 'J86-CHECK',
    unit: 'J86',
    title: t('全等与证明小回顾', 'A small congruence and proof review'),
    questions: j86CheckQuestions,
    bridge: 'J86-L01',
  },
  J85: {
    id: 'J85-CHECK',
    unit: 'J85',
    title: t('一次函数小回顾', 'A small linear functions review'),
    questions: j85CheckQuestions,
    bridge: 'J85-L01',
  },
  J84: {
    id: 'J84-CHECK',
    unit: 'J84',
    title: t('不等式与数轴小回顾', 'A small inequalities review'),
    questions: j84CheckQuestions,
    bridge: 'J84-L01',
  },
  J83: {
    id: 'J83-CHECK',
    unit: 'J83',
    title: t('二元一次方程组小回顾', 'A small linear systems review'),
    questions: j83CheckQuestions,
    bridge: 'J83-L01',
  },
  J82: {
    id: 'J82-CHECK',
    unit: 'J82',
    title: t('因式分解小回顾', 'A small factorisation review'),
    questions: j82CheckQuestions,
    bridge: 'J82-L01',
  },
  J81: {
    id: 'J81-CHECK',
    unit: 'J81',
    title: t(
      '整式乘法与恒等式小回顾',
      'A small polynomial multiplication and identities review',
    ),
    questions: j81CheckQuestions,
    bridge: 'J81-L01',
  },
  J76: {
    id: 'J76-CHECK',
    unit: 'J76',
    title: t(
      '数据与概率推理小回顾',
      'A small data and probability reasoning review',
    ),
    questions: j76CheckQuestions,
    bridge: 'J76-L01',
  },
  J75: {
    id: 'J75-CHECK',
    unit: 'J75',
    title: t('坐标与规律小回顾', 'A small coordinates and patterns review'),
    questions: j75CheckQuestions,
    bridge: 'J75-L01',
  },
  J74: {
    id: 'J74-CHECK',
    unit: 'J74',
    title: t('平面几何小回顾', 'A small plane-geometry review'),
    questions: j74CheckQuestions,
    bridge: 'J74-L01',
  },
  J73: {
    id: 'J73-CHECK',
    unit: 'J73',
    title: t('一元一次方程小回顾', 'A small linear-equation review'),
    questions: j73CheckQuestions,
    bridge: 'J73-L01',
  },
  J72: {
    id: 'J72-CHECK',
    unit: 'J72',
    title: t('整式与代数小回顾', 'A small expressions and algebra review'),
    questions: j72CheckQuestions,
    bridge: 'J72-L01',
  },
  J71: {
    id: 'J71-CHECK',
    unit: 'J71',
    title: t('有理数小回顾', 'A small rational number review'),
    questions: j71CheckQuestions,
    bridge: 'J71-L01',
  },
  P68: {
    id: 'P68-CHECK',
    unit: 'P68',
    title: t('应用问题小回顾', 'A small applied problem review'),
    questions: p68CheckQuestions,
    bridge: 'P68-L01',
  },
  P67: {
    id: 'P67-CHECK',
    unit: 'P67',
    title: t('统计量与概率小回顾', 'A small summaries and probability review'),
    questions: p67CheckQuestions,
    bridge: 'P67-L01',
  },
  P66: {
    id: 'P66-CHECK',
    unit: 'P66',
    title: t(
      '圆与空间测量小回顾',
      'A small circles and spatial measurement review',
    ),
    questions: p66CheckQuestions,
    bridge: 'P66-L01',
  },
  P65: {
    id: 'P65-CHECK',
    unit: 'P65',
    title: t('字母与等价关系小回顾', 'A small letters and equivalence review'),
    questions: p65CheckQuestions,
    bridge: 'P65-L01',
  },
  P64: {
    id: 'P64-CHECK',
    unit: 'P64',
    title: t(
      '负数与距离小回顾',
      'A small negative numbers and distance review',
    ),
    questions: p64CheckQuestions,
    bridge: 'P64-L01',
  },
  P63: {
    id: 'P63-CHECK',
    unit: 'P63',
    title: t('比与比例小回顾', 'A small ratios and proportion review'),
    questions: p63CheckQuestions,
    bridge: 'P63-L01',
  },
  P62: {
    id: 'P62-CHECK',
    unit: 'P62',
    title: t(
      '百分数与参照整体小回顾',
      'A small percentages and reference wholes review',
    ),
    questions: p62CheckQuestions,
    bridge: 'P62-L01',
  },
  P61: {
    id: 'P61-CHECK',
    unit: 'P61',
    title: t(
      '分数乘除小回顾',
      'A small fraction multiplication and division review',
    ),
    questions: p61CheckQuestions,
    bridge: 'P61-L01',
  },
  P57: {
    id: 'P57-CHECK',
    unit: 'P57',
    title: t('数据与购物小回顾', 'A small data and shopping review'),
    questions: p57CheckQuestions,
    bridge: 'P57-L01',
  },
  P56: {
    id: 'P56-CHECK',
    unit: 'P56',
    title: t('面积与体积小回顾', 'A small area and volume review'),
    questions: p56CheckQuestions,
    bridge: 'P56-L01',
  },
  P55: {
    id: 'P55-CHECK',
    unit: 'P55',
    title: t('等量关系小回顾', 'A small equality-relationship review'),
    questions: p55CheckQuestions,
    bridge: 'P55-L01',
  },
  P54: {
    id: 'P54-CHECK',
    unit: 'P54',
    title: t('分数加减小回顾', 'A small fraction-operation review'),
    questions: p54CheckQuestions,
    bridge: 'P54-L01',
  },
  P51: {
    id: 'P51-CHECK',
    unit: 'P51',
    title: t('整数策略小回顾', 'A small whole-number strategy review'),
    questions: p51CheckQuestions,
    bridge: 'P51-L01',
  },
  B01: {
    id: 'B01-CHECK',
    unit: 'B01',
    title: t('数感小回顾', 'A small number-sense review'),
    questions: b01CheckQuestions,
    bridge: 'B01-L01',
  },
  B02: {
    id: 'B02-CHECK',
    unit: 'B02',
    title: t('运算意义小回顾', 'A small operation-meaning review'),
    questions: b02CheckQuestions,
    bridge: 'B02-L01',
  },
  P52: {
    id: 'P52-CHECK',
    unit: 'P52',
    title: t('小数小回顾', 'A small decimal review'),
    questions: p52CheckQuestions,
    bridge: 'P52-L01',
  },
  B03: {
    id: 'B03-CHECK',
    unit: 'B03',
    title: t('计算策略小回顾', 'A small calculation-strategy review'),
    questions: b03CheckQuestions,
    bridge: 'B03-L01',
  },
  P53: {
    id: 'P53-CHECK',
    unit: 'P53',
    title: t('分数小回顾', 'A small fraction review'),
    questions: p53CheckQuestions,
    bridge: 'P53-L01',
  },
  B05: {
    id: 'B05-CHECK',
    unit: 'B05',
    title: t('测量与读图小回顾', 'A small measurement and chart review'),
    questions: b05CheckQuestions,
    bridge: 'B05-L01',
  },
  B06: {
    id: 'B06-CHECK',
    unit: 'B06',
    title: t('问题解决小回顾', 'A small problem-solving review'),
    questions: b06CheckQuestions,
    bridge: 'B06-L01',
  },
};
export type UnitCheckId = keyof typeof unitChecks;
