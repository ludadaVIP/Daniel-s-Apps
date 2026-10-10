export type SolvingKind = 'arrival' | 'energy' | 'spring' | 'density';
export const solvingKinds: SolvingKind[] = [
  'arrival',
  'energy',
  'spring',
  'density',
];
export type Pair = [string, string];
export const solvingSteps: Pair[] = [
  ['发生了什么？', 'What is happening?'],
  ['画出来。', 'Draw it.'],
  ['写出已知量。', 'List known quantities.'],
  ['求什么？', 'What is unknown?'],
  ['选择模型或公式。', 'Choose a model or equation.'],
  ['计算。', 'Calculate.'],
  ['检查单位。', 'Check the unit.'],
  ['答案合理吗？', 'Does the answer make sense?'],
];
export function solvingCase(i: number) {
  if (!Number.isInteger(i) || i < 0 || i > 2)
    throw new RangeError('Three integer cases required');
  return i;
}
const finiteRange = (n: number, a: number, b: number) => {
  if (!Number.isFinite(n) || n < a || n > b)
    throw new RangeError('Outside this reasoning model');
  return n;
};
export const format = (n: number) => Number(n.toFixed(4)).toString();
export function arrivalModel(distance: number, speed: number) {
  finiteRange(distance, 0, 1000);
  finiteRange(speed, 0, 10);
  return {
    distance,
    speed,
    seconds: distance === 0 ? 0 : speed === 0 ? null : distance / speed,
  };
}
export function energyModel(energy: number, power: number) {
  finiteRange(energy, 0, 5000);
  finiteRange(power, 0.1, 20);
  const seconds = energy / power;
  return { energy, power, seconds, minutes: seconds / 60 };
}
export function springModel(mass: number, gravity: number, stiffness: number) {
  finiteRange(mass, 0, 2);
  finiteRange(gravity, 0, 20);
  finiteRange(stiffness, 10, 500);
  const weight = mass * gravity,
    metres = weight / stiffness;
  return {
    mass,
    gravity,
    stiffness,
    weight,
    metres,
    centimetres: 100 * metres,
    totalCentimetres: 20 + 100 * metres,
  };
}
export function densityModel(
  mass: number,
  before: number,
  after: number,
  fullyImmersed: boolean,
) {
  finiteRange(mass, 0.1, 500);
  finiteRange(before, 0, 200);
  finiteRange(after, 0, 200);
  if (after <= before)
    throw new RangeError('Positive displacement is required');
  const volume = after - before;
  return {
    mass,
    before,
    after,
    volume,
    apparentDensity: mass / volume,
    valid: fullyImmersed,
  };
}
export type Problem = {
  kind: SolvingKind;
  index: number;
  name: Pair;
  story: Pair;
  known: Pair;
  assumptions: Pair;
  result: number | null;
  unit: string;
  resultLabel: Pair;
  equation: Pair;
  valid: boolean;
  row: Pair;
};
export function solvingProblem(kind: SolvingKind, index: number): Problem {
  solvingCase(index);
  switch (kind) {
    case 'arrival': {
      const m = arrivalModel(
        index === 1 ? 240 : 120,
        index === 1 ? 4 : index === 2 ? 0 : 2,
      );
      return {
        kind,
        index,
        name:
          index === 0
            ? ['120 m · 2 m/s', '120 m · 2 m/s']
            : index === 1
              ? ['0.24 km · 4 m/s', '0.24 km · 4 m/s']
              : ['120 m · 静止', '120 m · stationary'],
        story: [
          '机器人沿直线朝社团教室的门行驶。给定速率从出发起保持不变，求到达门口所需的时间。',
          'A robot travels straight toward a club-room door. Its prescribed speed stays constant from departure. Find its arrival time.',
        ],
        known: [
          `${index === 1 ? 'd = 0.24 km = 240 m' : 'd = 120 m'}；v = ${m.speed} m/s`,
          `${index === 1 ? 'd = 0.24 km = 240 m' : 'd = 120 m'}; v = ${m.speed} m/s`,
        ],
        assumptions: [
          '朝目标的直线匀速模型；忽略启动、停止与障碍。v=0且目标在前方时，没有有限到达时间。',
          'Straight uniform motion toward the target; starting, stopping and obstacles are omitted. For v=0 with a positive target distance, no finite arrival time exists.',
        ],
        result: m.seconds,
        unit: 's',
        resultLabel: ['到达时间', 'Arrival time'],
        equation: ['d = vt；v > 0时t = d/v', 'd = vt; t = d/v when v > 0'],
        valid: m.seconds !== null,
        row: [
          `${m.distance} m · ${m.speed} m/s · ${m.seconds === null ? '无有限到达时间' : `${format(m.seconds)} s`}`,
          `${m.distance} m · ${m.speed} m/s · ${m.seconds === null ? 'No finite arrival' : `${format(m.seconds)} s`}`,
        ],
      };
    }
    case 'energy': {
      const m = energyModel(index === 2 ? 2400 : 1200, index === 1 ? 4 : 2);
      return {
        kind,
        index,
        name: [`${m.energy} J · ${m.power} W`, `${m.energy} J · ${m.power} W`],
        story: [
          '阅读灯以固定功率接收电能，给定可供灯接收的能量预算。求预算可维持多久，不按真实电池规格推测。',
          'A reading lamp receives electrical energy at constant power. Its usable delivered-energy budget is given. Find how long that budget lasts, without predicting real battery specifications.',
        ],
        known: [
          `E可供 = ${m.energy} J；P = ${m.power} W`,
          `E_usable = ${m.energy} J; P = ${m.power} W`,
        ],
        assumptions: [
          '给定能量是已可供灯接收的电能，功率固定；省略电池电压变化、转换损失与关机阈值，不重复扣除未知损耗。',
          'Energy is the given usable electrical energy delivered to the lamp at fixed power. Battery voltage changes, conversion loss and cutoff are omitted; do not deduct an unspecified loss again.',
        ],
        result: m.seconds,
        unit: 's',
        resultLabel: ['可维持时间', 'Budget duration'],
        equation: [
          'E = Pt；t = E/P；1 W = 1 J/s',
          'E = Pt; t = E/P; 1 W = 1 J/s',
        ],
        valid: true,
        row: [
          `${m.energy} J · ${m.power} W · ${m.seconds} s / ${m.minutes} min`,
          `${m.energy} J · ${m.power} W · ${m.seconds} s / ${m.minutes} min`,
        ],
      };
    }
    case 'spring': {
      const m = springModel(index === 1 ? 2 : 1, index === 2 ? 1.6 : 10, 100);
      return {
        kind,
        index,
        name:
          index === 2
            ? ['1 kg · 月球模型', '1 kg · Moon model']
            : [`${m.mass} kg · 地球模型`, `${m.mass} kg · Earth model`],
        story: [
          '物体挂在理想弹簧下，已静止平衡。弹簧原长20 cm，给定质量、当地g与劲度系数。求额外伸长，不能把原长当作伸长。',
          'An object hangs in static equilibrium from an ideal spring of rest length 20 cm. Mass, local g and stiffness are given. Find extra extension, not total length.',
        ],
        known: [
          `m=${m.mass} kg；g=${m.gravity} N/kg；k=100 N/m；L₀=20 cm`,
          `m=${m.mass} kg; g=${m.gravity} N/kg; k=100 N/m; L₀=20 cm`,
        ],
        assumptions: [
          '质量可忽略的理想线性弹簧，0–20 N内服从F=kx；物体已平衡，无振动。地球取g=10 N/kg，月球取1.6 N/kg作教学近似。',
          'Ideal massless linear spring with F=kx over 0–20 N. The object is already in equilibrium; oscillations are omitted. Teaching approximations use g=10 N/kg on Earth and 1.6 N/kg on the Moon.',
        ],
        result: m.centimetres,
        unit: 'cm',
        resultLabel: ['额外伸长', 'Extra extension'],
        equation: [
          '平衡时kx=mg；x=mg/k；再将m换成cm',
          'At equilibrium kx=mg; x=mg/k; then convert metres to cm',
        ],
        valid: true,
        row: [
          `重量 ${m.weight} N · 伸长 ${format(m.centimetres)} cm · 总长 ${format(m.totalCentimetres)} cm`,
          `Weight ${m.weight} N · extension ${format(m.centimetres)} cm · total length ${format(m.totalCentimetres)} cm`,
        ],
      };
    }
    case 'density': {
      const m = densityModel(
        index === 1 ? 108 : 54,
        50,
        index === 1 ? 90 : index === 2 ? 62 : 70,
        index !== 2,
      );
      return {
        kind,
        index,
        name:
          index === 0
            ? ['小块 · 完全浸没', 'Small piece · fully immersed']
            : index === 1
              ? ['大块 · 完全浸没', 'Large piece · fully immersed']
              : ['同一小块 · 部分浸入', 'Same small piece · partial immersion'],
        story: [
          '用干燥固体的质量与量筒水位变化求密度。先看操作记录：前两次完全浸没、无气泡；第三次是同一小块只浸入一部分。',
          'Find solid density from dry mass and a measuring-cylinder level change. Procedure notes say the first two cases are fully immersed without bubbles; the third uses the same small piece only partly immersed.',
        ],
        known: [
          `m=${m.mass} g；水位${m.before}→${m.after} mL；${m.valid ? '完全浸没' : '仅部分浸入'}`,
          `m=${m.mass} g; levels ${m.before}→${m.after} mL; ${m.valid ? 'fully immersed' : 'only partly immersed'}`,
        ],
        assumptions: [
          '固体不溶解、不吸水；水位读数理想化，1 mL=1 cm³。水位变化只有在完全浸没且无气泡时才等于整个物体体积。教学数据不是孩子自己的测量。',
          'The solid does not dissolve or absorb water; idealized level readings use 1 mL=1 cm³. Level change equals whole-object volume only with full immersion and no bubbles. These are supplied teaching data, not the learner’s measurements.',
        ],
        result: m.apparentDensity,
        unit: 'g/cm³',
        resultLabel: m.valid
          ? ['由有效体积求密度', 'Density from valid volume']
          : ['仅为表观比值，实验无效', 'Apparent ratio only; invalid trial'],
        equation: [
          'V = 水位差；ρ = m/V，先验证V是否是完整体积',
          'V = level difference; ρ = m/V, first check that V is the full volume',
        ],
        valid: m.valid,
        row: [
          `${m.mass} g · 排水 ${m.volume} cm³ · ${m.valid ? '密度' : '表观比值'} ${format(m.apparentDensity)} g/cm³${m.valid ? '' : ' · 测量无效，需重测'}`,
          `${m.mass} g · displacement ${m.volume} cm³ · ${m.valid ? 'density' : 'apparent ratio'} ${format(m.apparentDensity)} g/cm³${m.valid ? '' : ' · invalid trial; remeasure'}`,
        ],
      };
    }
  }
}
export type ReasonOption = { id: string; text: Pair; sketch?: number };
export type ReasonStep = {
  title: Pair;
  prompt: Pair;
  options: ReasonOption[];
  correct: string;
  feedback: Pair;
  numeric?: { expected: number; unit: string };
};
const choice = (
  id: string,
  zh: string,
  en: string,
  sketch?: number,
): ReasonOption => ({
  id,
  text: [zh, en],
  ...(sketch === undefined ? {} : { sketch }),
});
export function reasoningSteps(p: Problem): ReasonStep[] {
  const { kind, index } = p;
  let groups: ReasonOption[][], feedback: Pair[], calculation: Pair;
  switch (kind) {
    case 'arrival': {
      const zero = p.result === null;
      groups = [
        [
          choice(
            'toward',
            '沿直线朝门走，速率固定',
            'Straight toward the door at fixed speed',
          ),
          choice('circle', '绕一圈回起点', 'A round trip back to the start'),
          choice(
            'accelerate',
            '速度必然持续增加',
            'Speed necessarily keeps increasing',
          ),
        ],
        [
          choice(
            'diagram',
            '标出路程d、朝门的v和未知t',
            'Label distance d, velocity toward the door, and unknown t',
            0,
          ),
          choice(
            'diagram-wrong-unit',
            '把速率当成到门的距离',
            'Use speed as the distance to the door',
            1,
          ),
          choice(
            'diagram-return',
            '把单程画成完整往返',
            'Draw a one-way task as an out-and-back trip',
            2,
          ),
        ],
        [
          choice('known', p.known[0], p.known[1]),
          choice(
            'raw',
            '把0.24 km直接写成0.24 m',
            'Write 0.24 km directly as 0.24 m',
          ),
          choice(
            'unrelated',
            '把机器人颜色作为计算量',
            'Use robot colour as a calculation quantity',
          ),
        ],
        [
          choice('time', '到达时间t', 'Arrival time t'),
          choice('force', '拉力F', 'Pulling force F'),
          choice('mass', '机器人质量m', 'Robot mass m'),
        ],
        [
          choice(
            'model',
            zero ? '先用d=vt；v=0无法覆盖正路程' : '朝目标匀速且v>0：t=d/v',
            zero
              ? 'Start from d=vt; v=0 cannot cover a positive distance'
              : 'Uniform motion toward target with v>0: t=d/v',
          ),
          choice('multiply', 't=d×v', 't=d×v'),
          choice('reverse', 't=v/d', 't=v/d'),
        ],
        zero
          ? [
              choice(
                'no-arrival',
                '没有有限到达时间',
                'No finite arrival time',
              ),
              choice('zero', '到达时间0', 'Arrival time zero'),
              choice('distance', '到达时间120', 'Arrival time 120'),
            ]
          : [],
        [
          choice(
            'unit',
            zero ? '时间量应使用s；此情境没有有限数值' : 'm÷(m/s)=s',
            zero
              ? 'Time would be measured in s; this case has no finite value'
              : 'm÷(m/s)=s',
          ),
          choice('metres', '答案单位m', 'Answer unit m'),
          choice('speed-unit', '答案单位m/s', 'Answer unit m/s'),
        ],
        [
          choice(
            'sense',
            zero
              ? '机器人没动，不能到达前方的门'
              : '把时间代回v×t，必须还原路程',
            zero
              ? 'The stationary robot cannot reach a door ahead'
              : 'Substitute time into v×t; it must restore the distance',
          ),
          choice(
            'only-number',
            '只看数字像不像答案',
            'Judge only whether the number looks answer-like',
          ),
          choice(
            'always-finite',
            '任何除法都必须给有限时间',
            'Every division must yield a finite time',
          ),
        ],
      ];
      feedback = [
        [
          '先写运动方向与匀速条件，别让公式替你猜故事。',
          'State direction and constant-speed conditions before choosing an equation.',
        ],
        [
          '一条带单位的单程线，比装饰性图画更有用。',
          'A unit-bearing one-way sketch is more useful than a decorative picture.',
        ],
        [
          '统一距离单位：1 km=1000 m；保留原始给定量。',
          'Unify distance units: 1 km=1000 m; retain the original given quantity.',
        ],
        [
          '求的是时间，不是把所有已知量都算一遍。',
          'The target is time, not every possible quantity.',
        ],
        [
          '除以速度之前检查v是否为零，以及运动是否朝目标。',
          'Check for zero speed and travel toward the target before division.',
        ],
        zero
          ? [
              '从d=0×t无法得到正路程，不把除零显示成0或Infinity答案。',
              'd=0×t cannot give a positive distance; do not present division by zero as zero or an Infinity answer.',
            ]
          : [
              '先在统一单位下算t=d/v，再保留时间单位。',
              'Calculate t=d/v using compatible units and retain the time unit.',
            ],
        [
          '单位通过是必要检查，但不能替代模型条件。',
          'Correct units are necessary but do not replace model conditions.',
        ],
        [
          '用原模型反查结果和边界情境，比凭感觉认数字可靠。',
          'Back-substitution and boundary checks are more reliable than recognizing a familiar number.',
        ],
      ];
      calculation = [
        `用m与m/s计算到达时间，结果填s。`,
        `Use metres and m/s to calculate arrival time; enter seconds.`,
      ];
      break;
    }
    case 'energy':
      groups = [
        [
          choice(
            'budget',
            '固定功率逐步使用给定的可供能量',
            'Fixed power uses the given usable energy budget',
          ),
          choice(
            'create',
            '灯持续制造新能量',
            'The lamp creates new energy continuously',
          ),
          choice(
            'charge',
            '必须用灯的颜色求电荷',
            'Use lamp colour to find charge',
          ),
        ],
        [
          choice(
            'diagram',
            '画能量预算流向固定功率灯，时间未知',
            'Draw budget energy flowing to a fixed-power lamp; time unknown',
            0,
          ),
          choice(
            'swap',
            '把功率标成J、能量标成W',
            'Label power in J and energy in W',
            1,
          ),
          choice(
            'free',
            '画没有能量来源的灯',
            'Draw a lamp without any energy source',
            2,
          ),
        ],
        [
          choice('known', p.known[0], p.known[1]),
          choice(
            'reverse-known',
            '把功率与能量的数值和单位交换',
            'Swap power and energy values and units',
          ),
          choice(
            'loss',
            '随意再扣掉一半“损失”',
            'Arbitrarily deduct another half as “loss”',
          ),
        ],
        [
          choice('time', '这份预算可维持的时间t', 'Duration t of this budget'),
          choice(
            'voltage',
            '未知电池电压U',
            'An unspecified battery voltage U',
          ),
          choice('current', '未知电流I', 'An unspecified current I'),
        ],
        [
          choice('model', 'E=Pt，固定P时t=E/P', 'E=Pt; at fixed P, t=E/P'),
          choice('multiply', 't=E×P', 't=E×P'),
          choice('reverse', 't=P/E', 't=P/E'),
        ],
        [],
        [
          choice(
            'unit',
            'J÷(J/s)=s，再÷60得到min',
            'J÷(J/s)=s; divide by 60 for minutes',
          ),
          choice('watt', '答案单位W', 'Answer unit W'),
          choice('joule', '答案单位J', 'Answer unit J'),
        ],
        [
          choice(
            'sense',
            '检查Pt=E；相同能量下功率翻倍时间减半',
            'Check Pt=E; doubling power at fixed energy halves duration',
          ),
          choice(
            'double',
            '功率越大，这份预算必用得越久',
            'Higher power must make this budget last longer',
          ),
          choice(
            'battery',
            '把理想时间当作任何电池的承诺',
            'Treat ideal duration as a promise for every battery',
          ),
        ],
      ];
      feedback = [
        [
          '把功率读成每秒多少能量，预算才有消耗过程。',
          'Read power as energy per second so the budget has a use rate.',
        ],
        [
          '能量和功率要在图中保留各自单位，t是待求量。',
          'Keep distinct energy and power units in the sketch; t is unknown.',
        ],
        [
          '给定的是可供灯接收的能量，不能杜撰损失或未给电压。',
          'The delivered usable energy is given; do not invent loss or an unspecified voltage.',
        ],
        [
          '本题求时间；没有电压也能用能量与功率建立模型。',
          'This task asks for time; energy and power suffice without a voltage.',
        ],
        [
          'E=Pt描述固定功率的能量账，整理时两边同时除以P。',
          'E=Pt is the fixed-power energy account; divide both sides by P.',
        ],
        [
          '先求秒，再换分钟；别把600 s读成600 min。',
          'Find seconds first, then convert to minutes; 600 s is not 600 min.',
        ],
        [
          '瓦等于焦耳每秒，除法留下时间单位。',
          'A watt is a joule per second; division leaves a time unit.',
        ],
        [
          '预算、模型条件与比例检查一起决定答案的含义。',
          'Budget, model conditions and proportional checks jointly determine the answer’s meaning.',
        ],
      ];
      calculation = [
        '计算t=E/P，结果先填s。',
        'Calculate t=E/P; enter the result in seconds first.',
      ];
      break;
    case 'spring':
      groups = [
        [
          choice(
            'balance',
            '物体已经静止，弹簧拉力与重力平衡',
            'The object is already at rest; spring pull balances weight',
          ),
          choice(
            'fall',
            '物体在真空自由下落',
            'The object is in vacuum free fall',
          ),
          choice(
            'no-force',
            '静止证明两个力都不存在',
            'Rest proves both forces are absent',
          ),
        ],
        [
          choice(
            'diagram',
            '向上弹簧力与向下重量；标额外伸长x',
            'Upward spring force and downward weight; label extra extension x',
            0,
          ),
          choice(
            'same-direction',
            '把两个力都画向下',
            'Draw both forces downward',
            1,
          ),
          choice(
            'length',
            '把原长20 cm直接当伸长x',
            'Treat rest length 20 cm as extension x',
            2,
          ),
        ],
        [
          choice('known', p.known[0], p.known[1]),
          choice(
            'kg-force',
            '把kg当作重量单位N',
            'Treat kg as the weight unit N',
          ),
          choice(
            'always-earth',
            '不管地点都用g=10 N/kg',
            'Use g=10 N/kg regardless of location',
          ),
        ],
        [
          choice(
            'extension',
            '相对原长的额外伸长x',
            'Extra extension x beyond rest length',
          ),
          choice('total', '先把总长度L当作未知x', 'Treat total length L as x'),
          choice('mass', '物体质量m', 'Object mass m'),
        ],
        [
          choice('model', '平衡kx=mg，x=mg/k', 'Equilibrium kx=mg; x=mg/k'),
          choice('add', 'x=mg+k', 'x=mg+k'),
          choice('rest', 'x=L₀，和拉力无关', 'x=L₀ regardless of pull'),
        ],
        [],
        [
          choice(
            'unit',
            'N÷(N/m)=m；乘100换成cm',
            'N÷(N/m)=m; multiply by 100 for cm',
          ),
          choice('newton', '伸长单位N', 'Extension unit N'),
          choice('kilogram', '伸长单位kg', 'Extension unit kg'),
        ],
        [
          choice(
            'sense',
            '代回kx=mg，并检查总长L₀+x',
            'Check kx=mg and total length L₀+x',
          ),
          choice(
            'mass-gone',
            '月球质量变小导致伸长变小',
            'Lunar mass shrinks, reducing extension',
          ),
          choice(
            'add-components',
            '把kx和mg相加当作合力大小',
            'Add kx and mg magnitudes as net force',
          ),
        ],
      ];
      feedback = [
        [
          '静止平衡可以有两个非零、方向相反的力。',
          'Static equilibrium can involve two nonzero opposing forces.',
        ],
        [
          '力图要画方向，长度图要分清原长、伸长和总长。',
          'Force diagrams need directions; length diagrams must distinguish rest, extension and total length.',
        ],
        [
          '质量单位kg、重量单位N；当地g必须使用给定值。',
          'Mass uses kg, weight uses N; use the stated local g.',
        ],
        [
          '未知量定义为x；总长还需另加原长。',
          'The unknown is x; total length separately adds the rest length.',
        ],
        [
          '先用力平衡，再用弹簧关系；不是看到字母就加起来。',
          'Use force balance and the spring relation, not arbitrary addition of letters.',
        ],
        [
          'N/(N/m)先得到m，回答cm时还需乘100。',
          'N/(N/m) first gives metres; multiply by 100 to answer in centimetres.',
        ],
        [
          '单位推导和数值换算是同一次计算的两部分。',
          'Unit derivation and numerical conversion are parts of one calculation.',
        ],
        [
          '月球改变重量而不改变质量；更小伸长应与更小mg对应。',
          'The Moon changes weight, not mass; smaller extension should match smaller mg.',
        ],
      ];
      calculation = [
        '用x=mg/k求伸长，先得m，再填cm。',
        'Use x=mg/k for extension, first in metres, then enter centimetres.',
      ];
      break;
    case 'density':
      groups = [
        [
          choice(
            'displacement',
            p.valid
              ? '完全浸没固体，用排水体积求密度'
              : '只部分浸入，水位差还不是整个物体体积',
            p.valid
              ? 'A fully immersed solid; use displacement volume for density'
              : 'Only partial immersion; level change is not the whole volume',
          ),
          choice(
            'final-level',
            '把最终水位当作物体体积',
            'Treat the final water level as object volume',
          ),
          choice(
            'mass-volume',
            '把质量大小当作体积',
            'Treat mass value as volume',
          ),
        ],
        [
          choice(
            'diagram',
            '并排画前后水位，标水位差与浸入状态',
            'Draw before/after levels, their difference and immersion state',
            0,
          ),
          choice(
            'one-level',
            '只画末水位，不记录初水位',
            'Draw only final level, omitting the initial level',
            1,
          ),
          choice(
            'force',
            '用受力箭头代替体积读数',
            'Replace volume readings with force arrows',
            2,
          ),
        ],
        [
          choice('known', p.known[0], p.known[1]),
          choice(
            'all-level',
            'V等于末水位，不减初水位',
            'V equals the final level without subtraction',
          ),
          choice(
            'ignore-procedure',
            '只抄数字，删掉浸入状态',
            'Copy numbers and discard immersion state',
          ),
        ],
        [
          choice(
            'density',
            p.valid
              ? '固体密度ρ，并确认体积有效'
              : '检查表观比值，判断能否作为固体密度',
            p.valid
              ? 'Solid density ρ, after validating the volume'
              : 'Check the apparent ratio and whether it is valid solid density',
          ),
          choice(
            'identify',
            '仅凭密度确定唯一材料',
            'Identify one unique material from density alone',
          ),
          choice('level', '只求末水位', 'Find only the final water level'),
        ],
        [
          choice(
            'model',
            p.valid
              ? 'V=后−前，ρ=m/V，完全浸没才适用'
              : '可算m/水位差作表观比值，不能确认整块密度',
            p.valid
              ? 'V=after−before, ρ=m/V; full immersion is required'
              : 'm/level change is an apparent ratio, not validated whole-solid density',
          ),
          choice('multiply', 'ρ=m×V', 'ρ=m×V'),
          choice('final', 'ρ=m/末水位', 'ρ=m/final level'),
        ],
        [],
        [
          choice('unit', '1 mL=1 cm³；g÷cm³=g/cm³', '1 mL=1 cm³; g÷cm³=g/cm³'),
          choice('gram', '答案单位g', 'Answer unit g'),
          choice('volume', '答案单位cm³', 'Answer unit cm³'),
        ],
        [
          choice(
            'sense',
            p.valid
              ? '核对完整浸没与无气泡，再比较不同大小的比值'
              : '保留4.5的表观计算，但拒绝把它认作有效密度',
            p.valid
              ? 'Check full immersion/no bubbles, then compare differently sized pieces'
              : 'Retain the apparent 4.5 calculation but reject it as valid density',
          ),
          choice(
            'unit-only',
            '单位正确就证明实验有效',
            'Correct units prove the experiment valid',
          ),
          choice(
            'delete',
            '删掉不喜欢的读数，不说明操作',
            'Delete unwelcome readings without documenting procedure',
          ),
        ],
      ];
      feedback = [
        [
          '操作条件也是证据，不能被漂亮数字替代。',
          'Procedure conditions are evidence, not replaceable by attractive numbers.',
        ],
        [
          '前后读数和浸入状态一起决定体积的含义。',
          'Before/after readings and immersion state jointly determine volume meaning.',
        ],
        [
          '保留原始水位，先作差；相同mL和cm³体积数值。',
          'Retain original levels and subtract; mL and cm³ have equal volume values.',
        ],
        [
          '目标是有依据的密度，不是猜材料的唯一名称。',
          'The target is justified density, not a unique material guess.',
        ],
        [
          '部分排水量不能搭配整块质量当作完整密度测量。',
          'Partial displaced volume cannot validate a whole-solid density using total mass.',
        ],
        [
          '不有效的操作也可能产生可计算的数值；先把计算明确叫表观比值。',
          'An invalid procedure can still produce a calculable number; name it an apparent ratio.',
        ],
        [
          '量纲能查出某些错误，但查不出全部操作错误。',
          'Dimensions detect some errors, not every procedural error.',
        ],
        [
          '保留不理想结果与操作记录，说明为何重测，比删数更有用。',
          'Retain imperfect results and procedure notes; explain remeasurement rather than deleting data.',
        ],
      ];
      calculation = [
        '先算后水位减前水位，再算m/差值，填g/cm³；部分浸入只能叫表观比值。',
        'Subtract initial from final level, then divide mass by that change; enter g/cm³. Partial immersion yields only an apparent ratio.',
      ];
      break;
  }
  return solvingSteps.map((title, s) => {
    const base = groups[s]!;
    const rotation = (s + index + solvingKinds.indexOf(kind)) % 3,
      options = base.length
        ? [...base.slice(rotation), ...base.slice(0, rotation)]
        : [];
    return {
      title,
      prompt: s === 5 ? calculation : title,
      options,
      correct: base[0]?.id ?? '',
      feedback: feedback[s]!,
      ...(s === 5 && p.result !== null
        ? { numeric: { expected: p.result, unit: p.unit } }
        : {}),
    };
  });
}
export function strictNumber(raw: string) {
  if (
    typeof raw !== 'string' ||
    raw.length > 40 ||
    !raw.trim() ||
    !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(raw.trim())
  )
    return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}
export function checkReasonAnswer(step: ReasonStep, answer: unknown) {
  if (typeof answer !== 'string') return false;
  if (step.numeric) {
    const n = strictNumber(answer);
    return (
      n !== null &&
      Math.abs(n - step.numeric.expected) <=
        Math.max(1e-6, Math.abs(step.numeric.expected) * 0.001)
    );
  }
  return answer === step.correct && step.options.some((o) => o.id === answer);
}
export type ReasonDraft = {
  step: number;
  answers: (string | null)[];
  input: string;
};
export const blankReasonDraft = (): ReasonDraft => ({
  step: 0,
  answers: Array(8).fill(null),
  input: '',
});
export function solvedPrefix(p: Problem, answers: unknown[]) {
  const steps = reasoningSteps(p);
  let n = 0;
  while (n < 8 && checkReasonAnswer(steps[n]!, answers[n])) n++;
  return n;
}
export function decodeReasonDrafts(kind: SolvingKind, raw: string | null) {
  const empty = () => Array.from({ length: 3 }, blankReasonDraft);
  try {
    if (!raw || raw.length > 16000) return empty();
    const data = JSON.parse(raw);
    if (data?.version !== 1 || !Array.isArray(data.cases)) return empty();
    return [0, 1, 2].map((i) => {
      const d = data.cases[i],
        p = solvingProblem(kind, i);
      if (!d || !Array.isArray(d.answers)) return blankReasonDraft();
      const answers = Array.from({ length: 8 }, (_, s) =>
        typeof d.answers[s] === 'string' && d.answers[s].length <= 40
          ? d.answers[s]
          : null,
      );
      const prefix = solvedPrefix(p, answers);
      for (let s = prefix + 1; s < 8; s++) answers[s] = null;
      return {
        step: Number.isInteger(d.step)
          ? Math.max(0, Math.min(7, prefix, d.step))
          : Math.min(prefix, 7),
        answers,
        input: typeof d.input === 'string' ? d.input.slice(0, 40) : '',
      };
    });
  } catch {
    return empty();
  }
}
export function reasoningReport(kind: SolvingKind, drafts: ReasonDraft[]) {
  const body = [
    '# Physics reasoning record / 物理解题记录',
    'Supplied teaching scenarios, not personal measurements. / 教学情境，不是自己的实测。',
    '',
  ];
  for (let i = 0; i < 3; i++) {
    const p = solvingProblem(kind, i),
      d = drafts[i];
    if (!d || solvedPrefix(p, d.answers) !== 8) continue;
    body.push(
      `## ${p.name[0]} / ${p.name[1]}`,
      p.known[0],
      p.known[1],
      p.assumptions[0],
      p.assumptions[1],
      '',
    );
    reasoningSteps(p).forEach((s, j) => {
      const a = d.answers[j]!,
        o = s.options.find((o) => o.id === a);
      body.push(
        `${j + 1}. ${s.title[0]} / ${s.title[1]}`,
        o ? `${o.text[0]} / ${o.text[1]}` : `${a} ${s.numeric?.unit ?? ''}`,
      );
    });
    body.push(
      '',
      `${p.resultLabel[0]} / ${p.resultLabel[1]}: ${p.result === null ? 'No finite arrival time / 无有限到达时间' : `${format(p.result)} ${p.unit}`}`,
      '',
    );
  }
  return body.join('\n');
}
