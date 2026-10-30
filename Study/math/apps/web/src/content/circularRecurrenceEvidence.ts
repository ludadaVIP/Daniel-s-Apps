import { t } from '../model';
const pair = (i: number) =>
  ['H32', 'H36'].map((u) => `${u}-MAINT-CIRCULAR-Q${i}`);
const e = (
  skill: string,
  i: number,
  z: string,
  en: string,
  rz: string,
  re: string,
) => ({
  skill,
  sourceLesson: `H04-L0${i}`,
  sourceTask: `H04-L0${i}-Q6`,
  targets: pair(i),
  focus: t(z, en),
  rationale: t(rz, re),
});
const originalEvidence = [
  e(
    'radian-arc-ratio',
    1,
    '完整转角、有向弧与终边',
    'Full winding, signed arc and terminal ray',
    'H32半径3顺转750°保−25π/6及有向弧−25π/2，H36半径4逆转1110°保37π/6及74π/3；同终边−π/6或π/6不能替代完整转动。两处从s/r说明半径加倍角不变，并保弧长cm与角rad的不同角色。',
    'H32 retains−25π/6 from a clockwise750° rotation and signed arc−25π/2 at radius3; H36 retains37π/6 and arc74π/3 from1110° at radius4. Coterminal representatives cannot replace the full winding. Both derive radius-scaling invariance from s/r and distinguish arc centimetres from angle radians.',
  ),
  e(
    'unit-circle-signed-coordinates',
    2,
    '任意角的有符号坐标和正切域',
    'Signed arbitrary-angle coordinates and tangent domains',
    'H32亲画−5π/6第三象限点，H36画5π/3第四象限点，分别精确生成sin/cos/tan并解释符号；两处以π/2、3π/2横坐标0说明正切无定义，锐角正边长只给参考量级而非全角非负性。',
    'H32 constructs the quadrant-three point at−5π/6 and H36 the quadrant-four point at5π/3, generating exact sine, cosine and tangent with sign explanations. Both exclude tangent at zero horizontal coordinatesπ/2 and3π/2, rather than extending positive acute side ratios to all angles.',
  ),
  e(
    'circular-coordinate-to-wave',
    3,
    '坐标搬图与最小周期的两步证明',
    'Coordinate-to-graph transfer and two-part least-period proof',
    'H32搬单位圆纵坐标成正弦波、H36搬横坐标成余弦波。各给π移位反例；任意点转整周证明2π确可用，最高点仅在每整周同一顶/右点再推出任何正周期至少2π，避免只凭零点或样点宣布最小周期。',
    'H32 transfers circle heights into sine and H36 horizontal coordinates into cosine. Exact half-turn counterexamples rejectπ; full-turn recovery proves2π works for every input, while unique maximum locations force any positive period to be at least2π. Repeated zeros or finite graph samples do not establish the claim.',
  ),
  e(
    'circular-inner-angle-transform',
    4,
    '内角反解、非负振幅与常数边界',
    'Inverse inner angles, nonnegative amplitude and constant boundaries',
    'H32负外系数−3、内2给振幅3/周期π；H36外2、负内−3给振幅2/周期2π/3。两处从u反解五个精确点并画一周，明确横向倒数倍率、反射、中线像集。另A0及B0分别回定义，常数每个正移位都是周期却没有最小正周期，图不能唯一识别相位。',
    'H32 uses outer−3 and inner2 for amplitude3 and periodπ; H36 uses outer2 and inner−3 for amplitude2 and period2π/3. Both solve the inner angle to transfer five exact points, explaining reciprocal horizontal scale, reflection, midline and image. They separately evaluate A=0 and B=0: constants admit every positive shift but no least positive period or unique phase identification.',
  ),
  e(
    'circular-identity-with-domain',
    5,
    '任意点恒等式与保留分母限制',
    'Arbitrary-point identities with original denominator restrictions',
    '两处从任意圆点平方和推恒等，再分别约sin²/sin与cos²/cos，保θ≠kπ或θ≠π/2+kπ。右式零值不授权为原0/0补定义；π/4给sin+cos=√2反驳拆平方和为一次和，有限成功不当全称证明。',
    'Both prove the squared identity from an arbitrary circle point, then cancel sine or cosine only on the original nonzero-denominator domain. A defined zero on the simplified side cannot fill an original0/0 without declaring a new extension. Atπ/4,the sum√2 refutes a false identity; finite successes cannot prove a universal.',
  ),
  e(
    'circular-complete-finite-roots',
    6,
    '全体两分支与有限区间精确筛选',
    'Two full real branches and exact finite-interval filtering',
    'H32解sin(2(x−π/6))=1/2保两支，筛得{−5π/12,π/4,7π/12,5π/4}；H36解cos(−3(x+π/9))=1/2得{−2π/3,−2π/9,0,4π/9}。逐支给整数范围，两个区间均左端根含、右端根不含；反三角主值只返一角，不覆盖另一支/整周，目标改2由像集判空。',
    'H32 filters the transformed sine branches to{−5π/12,π/4,7π/12,5π/4}; H36 filters transformed cosine to{−2π/3,−2π/9,0,4π/9}. Both give branch-specific integer ranges and include a left endpoint root while excluding a right endpoint root. Principal inverse values alone omit branches and turns; target two is excluded by the image.',
  ),
];

const sharedCards = [[1], [2], [2], [4], [3], [4, 5]];
export const circularRecurrenceEvidence = originalEvidence.map((entry, i) => ({
  ...entry,
  targets: [
    ...entry.targets,
    ...sharedCards[i]!.flatMap((n) =>
      ['H32', 'H36'].map((u) => `${u}-MAINT-CIRCULAR-MEANING-Q${n}`),
    ),
    ...(i === 4
      ? [
          'H36-MAINT-ADVANCED-EQUATION-Q3',
          'H38-MAINT-ADVANCED-EQUATION-Q3',
          'H35-L03-Q3',
          'H35-L03-Q4',
          'H35-L03-Q5',
        ]
      : []),
  ],
  rationale: t(
    entry.rationale.zh +
      ' ' +
      [
        '独立N1要求混长度单位、纯弧度正逆比和度数最后舍入。',
        '共享N2先由给定有符号坐标反求原角及交换后的角，核横轴与图点身份。',
        '共享N2分别生成圆点/正弦图点/余弦图点，从任意反射证奇偶，并论完整定义域和像集。',
        'N4重新计算虚构高度全表/图/所有极值和中线时刻，推时间单位转换后的角速度及位移。',
        'N3补平方记号、未知象限两符号/主根与正切平方恒等的原域；直接复用H35-Q3常数交叉项、Q4指定cos形式、Q5原分母sin及H36/H38-A3完整约分域，不重创。',
        '共享N4补完整时间模型，N5补正切极点、极值两支合并及非特殊角反函数符号全解。',
      ][i],
    entry.rationale.en +
      ' ' +
      [
        'Independent N1 requires mixed length units, pure-radian forward/reverse ratios and final degree rounding.',
        'Shared N2 inverts signed coordinates and their swap to angles, then checks axis and graph-point roles.',
        'Shared N2 generates circle/sine/cosine points, proves parity by arbitrary reflection and explains full domains/images.',
        'N4 recomputes complete fictional height tables/graphs/extrema/midline times and derives angular speed and shift after a time-unit change.',
        'N3 adds square notation, both signs before quadrant information, principal roots and the tangent-square domain. Reuse H35-Q3 constant cross terms,Q4 cosine-only form,Q5 original sine denominator,and H36/H38-A3 complete quotient domains.',
        'Shared N4 adds a complete time model;N5 adds tangent poles,merged extreme branches and inverse-symbol roots beyond special tables.',
      ][i],
  ),
}));
