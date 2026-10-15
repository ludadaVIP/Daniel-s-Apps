import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text } from './ui';
import { Thermometer, SignedAxis } from './SignedVisuals';
import {
  temperatureReading,
  signedLabel,
  axisWalk,
  compareSigned,
  signedMovement,
  absoluteDistance,
} from './signedModels';
export type SignedLabKind = Extract<Lesson['lab'], `signed-${string}`>;
export const isSignedLab = (kind: Lesson['lab']): kind is SignedLabKind =>
  kind.startsWith('signed-');
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
function Slider({
  label,
  value,
  min,
  max,
  mode,
  change,
}: {
  label: LocalizedText;
  value: number;
  min: number;
  max: number;
  mode: LanguageMode;
  change: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={label} />
      <input
        aria-label={word(mode, label)}
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{signedLabel(value)}</output>
    </label>
  );
}
function Check({
  label,
  mode,
  click,
  disabled = false,
}: {
  label: LocalizedText;
  mode: LanguageMode;
  click: () => void;
  disabled?: boolean;
}) {
  return (
    <button className="math-button" onClick={click} disabled={disabled}>
      <Text mode={mode} text={label} />
    </button>
  );
}
function Temperature({ mode }: { mode: LanguageMode }) {
  const [value, setValue] = useState(-4),
    [interval, setInterval] = useState(5),
    [show, setShow] = useState(false),
    m = temperatureReading(value);
  const change = (n: number) => {
    setValue(n);
    setShow(false);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先找摄氏零度，再数相等小格。负号说明在零下，不是“没有温度”。标签稀疏时每小格仍是一度；换标签不改变读数。',
            'Find zero Celsius and count equal small intervals. A minus sign indicates below zero, not an absence of temperature. Sparse labels do not change the one-degree interval or reading.',
          )}
        />
      </p>
      <Slider
        label={t('假想温度（°C）', 'Fictional temperature (°C)')}
        value={value}
        min={-12}
        max={12}
        mode={mode}
        change={change}
      />
      <label>
        <Text mode={mode} text={t('数字标签间隔', 'Numeric label interval')} />
        <select
          aria-label={word(mode, t('数字标签间隔', 'Numeric label interval'))}
          value={interval}
          onChange={(e) => {
            setInterval(Number(e.target.value));
            setShow(false);
          }}
        >
          <option value="1">1°C</option>
          <option value="5">5°C</option>
        </select>
      </label>
      <div className="math-signed-actions">
        <button
          className="math-quiet"
          disabled={value === -12}
          onClick={() => change(value - 1)}
        >
          <Text mode={mode} text={t('降低 1°C', 'One degree colder')} />
        </button>
        <button
          className="math-quiet"
          disabled={value === 12}
          onClick={() => change(value + 1)}
        >
          <Text mode={mode} text={t('升高 1°C', 'One degree warmer')} />
        </button>
      </div>
      <Thermometer value={value} interval={interval} mode={mode} />
      <Check
        mode={mode}
        label={t(
          '我已看零点，核对带符号读数',
          'I found zero; check the signed reading',
        )}
        click={() => setShow(true)}
      />
      {show && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              m.side === 'zero'
                ? 'P 恰在零点，读作 0°C；零既不是正数，也不是负数。'
                : `P 在零${m.side === 'below' ? '下' : '上'} ${m.steps} 个一度小格，读作 ${signedLabel(value, true)}°C。负号与数值、摄氏单位一起表达位置。`,
              m.side === 'zero'
                ? 'P is at zero: 0°C. Zero is neither positive nor negative.'
                : `P is ${m.steps} one-degree intervals ${m.side} zero, so the reading is ${signedLabel(value, true)}°C. Read the sign, number and Celsius unit together.`,
            )}
          />
        </p>
      )}
    </>
  );
}
const targets = [
  {
    id: 'left-5',
    value: -5,
    zh: '从零向左 5 格',
    en: 'From zero, 5 steps left',
  },
  {
    id: 'right-3',
    value: 3,
    zh: '从零向右 3 格',
    en: 'From zero, 3 steps right',
  },
  { id: 'zero', value: 0, zh: '留在零点', en: 'Stay at zero' },
  {
    id: 'left-12',
    value: -12,
    zh: '从零向左 12 格',
    en: 'From zero, 12 steps left',
  },
  {
    id: 'right-10',
    value: 10,
    zh: '从零向右 10 格',
    en: 'From zero, 10 steps right',
  },
];
function Line({ mode }: { mode: LanguageMode }) {
  const [target, setTarget] = useState('left-5'),
    [position, setPosition] = useState(0),
    [interval, setInterval] = useState(2),
    [feedback, setFeedback] = useState<boolean | null>(null),
    goal = targets.find((t) => t.id === target)!;
  const move = (direction: 'left' | 'right') => {
    setPosition(axisWalk(position, direction));
    setFeedback(null);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '按目标移动 P。每次按键只走一个单位，左边更小、右边更大。标签可以隔几格显示，但小格大小与数的位置不变。',
            'Move P to the target. Each press moves one unit: left is smaller and right is larger. Labels may skip intervals, while unit size and positions stay unchanged.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('移动目标', 'Movement target')} />
        <select
          aria-label={word(mode, t('移动目标', 'Movement target'))}
          value={target}
          onChange={(e) => {
            setTarget(e.target.value);
            setPosition(0);
            setFeedback(null);
          }}
        >
          {targets.map((v) => (
            <option key={v.id} value={v.id}>
              {mode === 'en' ? v.en : v.zh}
            </option>
          ))}
        </select>
      </label>
      <label>
        <Text mode={mode} text={t('数轴标签间隔', 'Axis label interval')} />
        <select
          aria-label={word(mode, t('数轴标签间隔', 'Axis label interval'))}
          value={interval}
          onChange={(e) => {
            setInterval(Number(e.target.value));
            setFeedback(null);
          }}
        >
          {[1, 2, 4].map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <SignedAxis
        points={[{ value: position, label: 'P' }]}
        segments={[{ from: 0, to: position, arrow: false }]}
        interval={interval}
        mode={mode}
      />
      <div className="math-signed-actions">
        <button
          className="math-quiet"
          disabled={position === -12}
          onClick={() => move('left')}
        >
          <Text mode={mode} text={t('向左一格', 'One step left')} />
        </button>
        <button
          className="math-quiet"
          disabled={position === 12}
          onClick={() => move('right')}
        >
          <Text mode={mode} text={t('向右一格', 'One step right')} />
        </button>
        <button
          className="math-quiet"
          onClick={() => {
            setPosition(0);
            setFeedback(null);
          }}
        >
          <Text mode={mode} text={t('回到零点', 'Return to zero')} />
        </button>
      </div>
      <Check
        mode={mode}
        label={t('我已定位，核对目标', 'I located the point; check the target')}
        click={() => setFeedback(position === goal.value)}
      />
      {feedback !== null && (
        <p role="status">
          <Text
            mode={mode}
            text={
              feedback
                ? t(
                    `到达目标，P 表示 ${signedLabel(position, true)}。左侧负数、右侧正数，零不属于这两类。`,
                    `Target reached: P represents ${signedLabel(position, true)}. Negative integers are left of zero and positive integers right of it; zero is neither.`,
                  )
                : t(
                    `P 现在表示 ${signedLabel(position, true)}，还未符合“${goal.zh}”。请回看零点、方向和单位格。`,
                    `P currently represents ${signedLabel(position, true)}, which does not match “${goal.en}”. Check zero, direction and unit intervals.`,
                  )
            }
          />
        </p>
      )}
    </>
  );
}
function Compare({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(-8),
    [b, setB] = useState(-3),
    [relation, setRelation] = useState(''),
    [feedback, setFeedback] = useState<boolean | null>(null),
    m = compareSigned(a, b);
  const reset = () => {
    setRelation('');
    setFeedback(null);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '比较的是带符号的位置，不是只比较负号后面的数码。先指出哪一点在右边，再选择 A 与 B 的关系；重合时两个标签合在同一点。',
            'Compare signed positions, not only the digits after a minus sign. Identify the point farther right, then choose A’s relation to B. Coincident points share a label.',
          )}
        />
      </p>
      <Slider
        label={t('点 A 的整数', 'Integer at A')}
        value={a}
        min={-12}
        max={12}
        mode={mode}
        change={(n) => {
          setA(n);
          reset();
        }}
      />
      <Slider
        label={t('点 B 的整数', 'Integer at B')}
        value={b}
        min={-12}
        max={12}
        mode={mode}
        change={(n) => {
          setB(n);
          reset();
        }}
      />
      <SignedAxis
        points={[
          { value: a, label: 'A' },
          { value: b, label: 'B' },
        ]}
        mode={mode}
      />
      <label>
        <Text mode={mode} text={t('选择关系 A ? B', 'Choose A ? B')} />
        <select
          aria-label={word(mode, t('选择关系 A ? B', 'Choose A ? B'))}
          value={relation}
          onChange={(e) => {
            setRelation(e.target.value);
            setFeedback(null);
          }}
        >
          <option value="">{word(mode, t('先判断', 'Decide first'))}</option>
          {['<', '=', '>'].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </label>
      <Check
        mode={mode}
        label={t(
          '我已比较位置，核对大小',
          'I compared positions; check the order',
        )}
        disabled={!relation}
        click={() => setFeedback(relation === m.relation)}
      />
      {feedback !== null && (
        <p role="status">
          <Text
            mode={mode}
            text={
              feedback
                ? t(
                    `${signedLabel(a)} ${m.relation} ${signedLabel(b)}。${m.equal ? '两点重合，表示同一个数。' : m.relation === '<' ? 'A 在 B 左边，所以 A 较小。' : 'A 在 B 右边，所以 A 较大。'}不能去掉负号再按正数大小判断。`,
                    `${signedLabel(a)} ${m.relation} ${signedLabel(b)}. ${m.equal ? 'The points coincide and represent the same number.' : m.relation === '<' ? 'A is left of B, so A is smaller.' : 'A is right of B, so A is larger.'} Do not discard the signs and compare positive magnitudes instead.`,
                  )
                : t(
                    '还未符合数轴顺序。右边更大，比较的是完整带符号的数；不要只看八与三等数码。',
                    'That does not match the axis order. Values farther right are larger; compare complete signed numbers, not just their digits.',
                  )
            }
          />
        </p>
      )}
    </>
  );
}
function Move({ mode }: { mode: LanguageMode }) {
  const [start, setStart] = useState(-3),
    [operation, setOperation] = useState<'+' | '−'>('+'),
    [term, setTerm] = useState(5),
    [stage, setStage] = useState(0),
    [show, setShow] = useState(false),
    m = signedMovement(start, operation, term),
    last = m.waypoints.length - 1;
  const reset = () => {
      setStage(0);
      setShow(false);
    },
    current = m.waypoints[stage]!;
  const expression = `${signedLabel(start)} ${operation} ${term < 0 ? `(${signedLabel(term)})` : signedLabel(term)}`;
  const directionZh =
    m.direction === 'left'
      ? '向左'
      : m.direction === 'right'
        ? '向右'
        : '不移动';
  const directionEn =
    m.direction === 'left'
      ? 'left'
      : m.direction === 'right'
        ? 'right'
        : 'nowhere';
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先说起点与带符号变化，再逐段移动。加负数表示向左；减去一个变化是在撤销它。终点、变化与走过距离不是同一个量；超出原窗时数轴会扩展，不截断结果。',
            'Name the start and signed change, then move in stages. Adding a negative number moves left; subtracting a change undoes it. Endpoint, change and travelled distance are different quantities. The axis expands when necessary instead of clipping results.',
          )}
        />
      </p>
      <Slider
        label={t('起点整数', 'Starting integer')}
        value={start}
        min={-10}
        max={10}
        mode={mode}
        change={(n) => {
          setStart(n);
          reset();
        }}
      />
      <label>
        <Text mode={mode} text={t('运算', 'Operation')} />
        <select
          aria-label={word(mode, t('运算', 'Operation'))}
          value={operation}
          onChange={(e) => {
            setOperation(e.target.value as typeof operation);
            reset();
          }}
        >
          <option value="+">+</option>
          <option value="−">−</option>
        </select>
      </label>
      <Slider
        label={t('加上或减去的整数', 'Integer to add or subtract')}
        value={term}
        min={-8}
        max={8}
        mode={mode}
        change={(n) => {
          setTerm(n);
          reset();
        }}
      />
      <p className="math-signed-expression">{expression} = ?</p>
      <SignedAxis
        min={m.min}
        max={m.max}
        points={[
          { value: start, label: 'A' },
          { value: current, label: 'P' },
        ]}
        segments={m.waypoints
          .slice(0, stage)
          .map((v, i) => ({ from: v, to: m.waypoints[i + 1]! }))}
        mode={mode}
      />
      {stage < last && (
        <Check
          mode={mode}
          label={
            stage === 0 && m.crossesZero
              ? t('先走到零', 'First move to zero')
              : m.distance === 0
                ? t('核对不移动的位置', 'Check the unchanged position')
                : stage > 0
                  ? t('完成剩余移动', 'Complete the remaining move')
                  : t('完成移动', 'Complete the move')
          }
          click={() => setStage(stage + 1)}
        />
      )}
      {stage === 1 && m.crossesZero && (
        <p>
          <Text
            mode={mode}
            text={t(
              `先${directionZh}走 ${m.firstLeg} 格到零，还剩 ${m.remaining} 格。零是途中位置，不是最终答案。`,
              `First move ${m.firstLeg} steps ${directionEn} to zero; ${m.remaining} remain. Zero is an intermediate position, not the endpoint.`,
            )}
          />
        </p>
      )}
      {stage === last && !show && (
        <Check
          mode={mode}
          label={t(
            '核对终点、变化与距离',
            'Check endpoint, change and distance',
          )}
          click={() => setShow(true)}
        />
      )}
      {show && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `${expression} = ${signedLabel(m.end)}。终点 ${signedLabel(m.end, true)}，带符号变化 ${signedLabel(m.delta, true)}，走过 ${m.distance} 格；${directionZh}。核回 ${signedLabel(m.end)} − (${signedLabel(m.delta, true)}) = ${signedLabel(start)}。${m.reachesZero ? '到零为止，还没有跨到另一边。' : m.distance === 0 ? '加减零没有移动，不能画成一步。' : ''}`,
              `${expression} = ${signedLabel(m.end)}. Endpoint ${signedLabel(m.end, true)}, signed change ${signedLabel(m.delta, true)}, distance ${m.distance} units; move ${directionEn}. Check ${signedLabel(m.end)} − (${signedLabel(m.delta, true)}) = ${signedLabel(start)}. ${m.reachesZero ? 'This reaches zero without crossing to the other side.' : m.distance === 0 ? 'Adding or subtracting zero does not create a step.' : ''}`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Absolute({ mode }: { mode: LanguageMode }) {
  const [value, setValue] = useState(-6),
    [mirror, setMirror] = useState(false),
    [show, setShow] = useState(false),
    m = absoluteDistance(value);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '绝对值表示这个点到零的距离，不带左或右的方向。相反数则是零另一侧的对称位置。先看 P，再显示相反数点 Q，比较二者到零距离；零点只有一处。',
            'Absolute value is distance from a point to zero, without left or right direction. Its opposite is the reflected position across zero. Inspect P, then show the opposite point Q and compare distances; zero is one location.',
          )}
        />
      </p>
      <Slider
        label={t('点 P 的整数', 'Integer at P')}
        value={value}
        min={-12}
        max={12}
        mode={mode}
        change={(n) => {
          setValue(n);
          setMirror(false);
          setShow(false);
        }}
      />
      <SignedAxis
        points={[
          { value, label: 'P' },
          ...(mirror ? [{ value: m.opposite, label: 'Q' }] : []),
        ]}
        segments={[
          { from: 0, to: value, arrow: false },
          ...(mirror ? [{ from: 0, to: m.opposite, arrow: false }] : []),
        ]}
        mode={mode}
      />
      <button
        className="math-quiet"
        aria-pressed={mirror}
        onClick={() => {
          setMirror(!mirror);
          setShow(false);
        }}
      >
        <Text
          mode={mode}
          text={t('显示或隐藏相反数点', 'Show or hide the opposite point')}
        />
      </button>
      <Check
        mode={mode}
        label={t(
          '我已量到零距离，核对绝对值',
          'I measured distance to zero; check absolute value',
        )}
        click={() => setShow(true)}
      />
      {show && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `|${signedLabel(value)}| = ${m.distance}，是到零 ${m.distance} 格的非负距离。相反数为 ${signedLabel(m.opposite, true)}；绝对值和相反数表示不同关系。${value === 0 ? '零的绝对值与相反数都是零；绝对值不一定是正数。' : '两个对称位置到零距离相同，并不表示两个数相等。'}`,
              `|${signedLabel(value)}| = ${m.distance}, a nonnegative distance of ${m.distance} units to zero. The opposite is ${signedLabel(m.opposite, true)}; opposite and absolute value describe different relationships. ${value === 0 ? 'Zero has absolute value zero and opposite zero; an absolute value need not be positive.' : 'Reflected positions have equal distances to zero without being equal numbers.'}`,
            )}
          />
        </p>
      )}
    </>
  );
}
export function SignedLab({
  kind,
  mode,
}: {
  kind: SignedLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-signed-lab">
      <span className="math-eyebrow">
        <Text
          mode={mode}
          text={t(
            '动手数学 · 位置、方向与距离',
            'HANDS-ON MATHS · POSITION, DIRECTION AND DISTANCE',
          )}
        />
      </span>
      {kind === 'signed-temperature' ? (
        <Temperature mode={mode} />
      ) : kind === 'signed-line' ? (
        <Line mode={mode} />
      ) : kind === 'signed-compare' ? (
        <Compare mode={mode} />
      ) : kind === 'signed-move' ? (
        <Move mode={mode} />
      ) : (
        <Absolute mode={mode} />
      )}
    </section>
  );
}
export function SignedHookArt({
  kind,
  mode,
}: {
  kind: SignedLabKind;
  mode: LanguageMode;
}) {
  return kind === 'signed-temperature' ? (
    <Thermometer value={-4} mode={mode} />
  ) : kind === 'signed-compare' ? (
    <SignedAxis
      points={[
        { value: -8, label: 'A' },
        { value: -3, label: 'B' },
      ]}
      mode={mode}
    />
  ) : kind === 'signed-absolute' ? (
    <SignedAxis
      points={[
        { value: -6, label: 'P' },
        { value: 6, label: 'Q' },
      ]}
      segments={[
        { from: 0, to: -6, arrow: false },
        { from: 0, to: 6, arrow: false },
      ]}
      mode={mode}
    />
  ) : (
    <SignedAxis
      points={[{ value: kind === 'signed-move' ? -3 : 0, label: 'P' }]}
      mode={mode}
    />
  );
}
