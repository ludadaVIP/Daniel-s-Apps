import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text } from './ui';
import {
  CircleParts,
  RollingCircle,
  CircleSectors,
  CylinderNet,
} from './CircleVisuals';
import {
  circleMeasures,
  circleParts,
  simulatedPiReading,
  measuredPiRatio,
  sectorCounts,
  sectorRearrangement,
  cylinderMeasures,
  piTerm,
} from './circleModels';
export type CircleLabKind = Extract<Lesson['lab'], `circle-${string}`>;
export const isCircleLab = (kind: Lesson['lab']): kind is CircleLabKind =>
  kind.startsWith('circle-');
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  mode,
  change,
}: {
  label: LocalizedText;
  value: number;
  min: number;
  max: number;
  step?: number;
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
        step={step}
        value={value}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Check({
  text,
  mode,
  click,
}: {
  text: LocalizedText;
  mode: LanguageMode;
  click: () => void;
}) {
  return (
    <button className="math-button" onClick={click}>
      <Text mode={mode} text={text} />
    </button>
  );
}
function Feedback({
  mode,
  text,
}: {
  mode: LanguageMode;
  text: LocalizedText | null;
}) {
  return text ? (
    <p
      role="status"
      aria-label={word(mode, t('探索反馈', 'Workshop feedback'))}
    >
      <Text mode={mode} text={text} />
    </p>
  ) : null;
}
function Parts({ mode }: { mode: LanguageMode }) {
  const [r, setR] = useState(3),
    [angle, setAngle] = useState(0),
    [offset, setOffset] = useState(50),
    [guess, setGuess] = useState('diameter'),
    [show, setShow] = useState(false),
    m = circleParts(r, angle, offset / 100);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先找 O。OA 是半径，AB 经过圆心。判断 CD 是不是直径时要看它是否经过 O，不能只看是否横着或是否很长。',
            'Find O first. OA is a radius and AB passes through the centre. Decide whether CD is a diameter by whether it passes through O, not by horizontal orientation or apparent length.',
          )}
        />
      </p>
      <Slider
        label={t('半径 r（cm）', 'Radius r (cm)')}
        value={r}
        min={1}
        max={6}
        mode={mode}
        change={(v) => {
          setR(v);
          setShow(false);
        }}
      />
      <Slider
        label={t('旋转角度（度）', 'Rotation (degrees)')}
        value={angle}
        min={0}
        max={330}
        step={30}
        mode={mode}
        change={(v) => {
          setAngle(v);
          setShow(false);
        }}
      />
      <Slider
        label={t(
          '弦偏离圆心（半径百分数）',
          'Chord offset (percent of radius)',
        )}
        value={offset}
        min={0}
        max={80}
        step={10}
        mode={mode}
        change={(v) => {
          setOffset(v);
          setShow(false);
        }}
      />
      <CircleParts r={r} angle={angle} offset={offset / 100} mode={mode} />
      <label>
        <Text mode={mode} text={t('判断 CD', 'Classify CD')} />
        <select
          aria-label={word(mode, t('判断 CD', 'Classify CD'))}
          value={guess}
          onChange={(e) => {
            setGuess(e.target.value);
            setShow(false);
          }}
        >
          <option value="diameter">
            {word(mode, t('既是弦也是直径', 'Both chord and diameter'))}
          </option>
          <option value="chord">
            {word(mode, t('是弦但不是直径', 'Chord but not diameter'))}
          </option>
          <option value="radius">{word(mode, t('是半径', 'Radius'))}</option>
        </select>
      </label>
      <Check
        mode={mode}
        text={t('用圆心核对线段', 'Check segments using the centre')}
        click={() => setShow(true)}
      />
      <Feedback
        mode={mode}
        text={
          show
            ? t(
                `${guess === (m.isDiameter ? 'diameter' : 'chord') ? '判断正确。' : '再检查端点和圆心。'}CD ${m.isDiameter ? '经过 O，既是弦也是直径' : '不经过 O，是弦但不是直径'}；OA=${r} cm，AB=${2 * r} cm。同一个圆内 d=2r，旋转不改变。`,
                `${guess === (m.isDiameter ? 'diameter' : 'chord') ? 'Correct.' : 'Check the endpoints and centre again.'} CD ${m.isDiameter ? 'passes through O: both chord and diameter' : 'misses O: a chord but not a diameter'}; OA=${r} cm and AB=${2 * r} cm. Within one circle d=2r; rotation preserves this.`,
              )
            : null
        }
      />
    </>
  );
}
function PiExperiment({ mode }: { mode: LanguageMode }) {
  const [r, setR] = useState(2),
    [progress, setProgress] = useState(0),
    [precision, setPrecision] = useState<0.1 | 1>(0.1),
    [d, setD] = useState('4'),
    [c, setC] = useState('12.6'),
    [rows, setRows] = useState<{ d: number; c: number; ratio: number }[]>([]),
    [status, setStatus] = useState<LocalizedText | null>(null);
  const add = () => {
    if (![d, c].every((s) => /^(?:\d+(?:\.\d*)?|\.\d+)$/.test(s.trim()))) {
      setStatus(
        t(
          '请用同一厘米单位填写正的小数或整数。',
          'Enter positive decimals or integers in the same centimetre unit.',
        ),
      );
      return;
    }
    try {
      const D = Number(d),
        C = Number(c),
        ratio = measuredPiRatio(D, C);
      setRows([...rows.slice(-3), { d: D, c: C, ratio }]);
      setStatus(
        t(
          `你的读数商 C÷d≈${ratio.toFixed(4)}。这条记录只代表所填数据；偏离 3.14 时先查单位、是否完整一周与测量误差，不把商直接叫作精确 π。`,
          `Your reading ratio C÷d≈${ratio.toFixed(4)} describes the entered data. If it differs from 3.14, check units, a complete turn and measurement error. The measured quotient is not exact π.`,
        ),
      );
    } catch {
      setStatus(
        t(
          '直径与周长必须为正，模型范围为 d≤100 cm、C≤400 cm；不能除零。',
          'Diameter and circumference must be positive, within d≤100 cm and C≤400 cm; division by zero is invalid.',
        ),
      );
    }
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测一周路程是几个直径，再滚动。下表是理想几何计算后按精度显示的模拟仪器读数，不是真实测量，也不是用有限测量证明 π 的所有性质。π 定义为圆周长与直径的恒定比，3.14 只是近似。',
            'Predict how many diameters fit one turn, then roll. The table contains simulated readings rounded from ideal geometry, not real measurements or proof of every property of π. π is the constant ratio of circumference to diameter; 3.14 is an approximation.',
          )}
        />
      </p>
      <Slider
        label={t('滚动圆的半径（cm）', 'Rolling radius (cm)')}
        value={r}
        min={1}
        max={3}
        mode={mode}
        change={(v) => {
          setR(v);
          setProgress(0);
          setStatus(null);
        }}
      />
      <Slider
        label={t('一周进度（%）', 'One-turn progress (%)')}
        value={progress}
        min={0}
        max={100}
        step={10}
        mode={mode}
        change={setProgress}
      />
      <RollingCircle r={r} progress={progress / 100} mode={mode} />
      <label>
        <Text
          mode={mode}
          text={t('模拟读数精度（cm）', 'Simulated reading precision (cm)')}
        />
        <select
          aria-label={word(
            mode,
            t('模拟读数精度（cm）', 'Simulated reading precision (cm)'),
          )}
          value={precision}
          onChange={(e) => {
            setPrecision(Number(e.target.value) as 0.1 | 1);
            setStatus(null);
          }}
        >
          <option value="0.1">0.1</option>
          <option value="1">1</option>
        </select>
      </label>
      <div className="math-circle-scroll" tabIndex={0}>
        <table className="math-circle-table">
          <caption>
            <Text
              mode={mode}
              text={t(
                '模拟数据（非实测）',
                'Simulated data (not observed measurements)',
              )}
            />
          </caption>
          <thead>
            <tr>
              <th>d / cm</th>
              <th>C / cm</th>
              <th>C÷d ≈</th>
            </tr>
          </thead>
          <tbody>
            {[2, 4, 6].map((D) => {
              const row = simulatedPiReading(D, precision);
              return (
                <tr key={D}>
                  <td>{D}</td>
                  <td>{row.c}</td>
                  <td>{row.ratio.toFixed(4)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p>
        <Text
          mode={mode}
          text={t(
            '可另输入同单位的假想读数，或家庭纸笔记录；系统不会把它改成预设的 π。',
            'Enter fictional readings in the same unit, or a family paper record. Your quotient is not forced to match a preset π.',
          )}
        />
      </p>
      <div className="math-circle-controls">
        <label>
          d / cm
          <input
            aria-label={word(
              mode,
              t('记录直径（cm）', 'Recorded diameter (cm)'),
            )}
            value={d}
            onChange={(e) => {
              setD(e.target.value);
              setStatus(null);
            }}
          />
        </label>
        <label>
          C / cm
          <input
            aria-label={word(
              mode,
              t('记录周长（cm）', 'Recorded circumference (cm)'),
            )}
            value={c}
            onChange={(e) => {
              setC(e.target.value);
              setStatus(null);
            }}
          />
        </label>
      </div>
      <Check
        mode={mode}
        text={t('记录并算自己的商', 'Record and calculate my quotient')}
        click={add}
      />
      <ul aria-label={word(mode, t('我的读数记录', 'My reading records'))}>
        {rows.map((row, i) => (
          <li key={i}>
            d={row.d} cm · C={row.c} cm · C÷d≈{row.ratio.toFixed(4)}
          </li>
        ))}
      </ul>
      <Feedback mode={mode} text={status} />
    </>
  );
}
function Circumference({ mode }: { mode: LanguageMode }) {
  const [r, setR] = useState(3),
    [given, setGiven] = useState('r'),
    [show, setShow] = useState(false),
    m = circleMeasures(r);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先确认给的是半径还是直径。同一个圆切换标签不改变图；只换表达。周长量边界一周，单位是厘米。',
            'Identify whether the given length is radius or diameter. Switching labels keeps the same circle and changes its description. Circumference measures one boundary turn in centimetres.',
          )}
        />
      </p>
      <label>
        <Text
          mode={mode}
          text={t('已知长度的角色', 'Role of the given length')}
        />
        <select
          aria-label={word(
            mode,
            t('已知长度的角色', 'Role of the given length'),
          )}
          value={given}
          onChange={(e) => {
            setGiven(e.target.value);
            setShow(false);
          }}
        >
          <option value="r">r</option>
          <option value="d">d</option>
        </select>
      </label>
      <Slider
        label={t('给定长度（cm）', 'Given length (cm)')}
        value={given === 'r' ? r : 2 * r}
        min={given === 'r' ? 1 : 2}
        max={given === 'r' ? 6 : 12}
        step={given === 'r' ? 1 : 2}
        mode={mode}
        change={(v) => {
          setR(given === 'r' ? v : v / 2);
          setShow(false);
        }}
      />
      <CircleParts r={r} offset={0} mode={mode} />
      <p>
        {given} = {given === 'r' ? r : 2 * r} cm
      </p>
      <Check
        mode={mode}
        text={t(
          '分别核对精确周长与近似计算',
          'Check exact circumference and approximate calculation',
        )}
        click={() => setShow(true)}
      />
      <Feedback
        mode={mode}
        text={
          show
            ? t(
                `C=πd=2πr=${piTerm(m.cCoefficient)} cm。按 π≈3.14 计算，C≈${(m.cCoefficient * 3.14).toFixed(2)} cm。不能把 ${piTerm(m.cCoefficient)} 当成 ${m.cCoefficient}，也不能给周长加平方单位。`,
                `C=πd=2πr=${piTerm(m.cCoefficient)} cm. Using π≈3.14 gives C≈${(m.cCoefficient * 3.14).toFixed(2)} cm. ${piTerm(m.cCoefficient)} is not ${m.cCoefficient}, and circumference does not use square units.`,
              )
            : null
        }
      />
    </>
  );
}
function Area({ mode }: { mode: LanguageMode }) {
  const [r, setR] = useState(3),
    [count, setCount] = useState(8),
    [rearranged, setRearranged] = useState(false),
    [show, setShow] = useState(false),
    m = sectorRearrangement(r, count);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '相同扇形只旋转和平移，不拉伸或丢弃。观察半周弧边与半径如何支持面积公式；有限份图仍有弧边，不能直接说已经是精确长方形。',
            'Rotate and translate the same sectors without stretching or discarding them. Observe how half the circumference and the radius support the area formula. Finite sectors retain curved edges; the result is not already an exact rectangle.',
          )}
        />
      </p>
      <Slider
        label={t('原圆半径（cm）', 'Original radius (cm)')}
        value={r}
        min={1}
        max={6}
        mode={mode}
        change={(v) => {
          setR(v);
          setShow(false);
        }}
      />
      <label>
        <Text mode={mode} text={t('等扇形份数', 'Equal-sector count')} />
        <select
          aria-label={word(mode, t('等扇形份数', 'Equal-sector count'))}
          value={count}
          onChange={(e) => {
            setCount(Number(e.target.value));
            setShow(false);
          }}
        >
          {sectorCounts.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
      </label>
      <button
        className="math-quiet"
        onClick={() => {
          setRearranged(!rearranged);
          setShow(false);
        }}
      >
        <Text
          mode={mode}
          text={
            rearranged
              ? t('还原同一批扇形', 'Restore the same sectors')
              : t('重排原扇形', 'Rearrange the original sectors')
          }
        />
      </button>
      <CircleSectors r={r} count={count} rearranged={rearranged} mode={mode} />
      <Check
        mode={mode}
        text={t(
          '用保面积和极限形状解释',
          'Explain using area conservation and the limiting shape',
        )}
        click={() => setShow(true)}
      />
      <Feedback
        mode={mode}
        text={
          show
            ? t(
                `仍有 ${count} 份，面积始终 ${piTerm(r * r)} cm²。份数增多时弧边更平，底趋近 πr，高趋近 r，所以 A=πr²。当前虚线辅助平行四边形面积约 ${m.guideArea.toFixed(3)} cm²，小于原圆面积约 ${m.totalArea.toFixed(3)} cm²；相差来自弓形，不是切掉了原扇形。`,
                `The same ${count} pieces retain area ${piTerm(r * r)} cm². With finer sectors the boundary flattens, base approaches πr and height r, giving A=πr². The current dashed parallelogram has area about ${m.guideArea.toFixed(3)} cm², below the circle’s ${m.totalArea.toFixed(3)} cm²; the difference lies in curved segments, not discarded sectors.`,
              )
            : null
        }
      />
    </>
  );
}
function Cylinder({ mode }: { mode: LanguageMode }) {
  const [r, setR] = useState(2),
    [h, setH] = useState(5),
    [lids, setLids] = useState<0 | 1 | 2>(2),
    [show, setShow] = useState(false),
    m = cylinderMeasures(r, h, lids);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '理想薄壁圆柱统一使用 r、h；实际容积要用内部尺寸。先数需要哪些面，侧面展开的长是圆周长，不是直径；材料面片面积与体积不能相加。',
            'The ideal thin-walled cylinder uses one r and h; actual capacity needs internal dimensions. Count the required faces first. The side unwraps to circumference, not diameter; face area cannot be added to volume.',
          )}
        />
      </p>
      <Slider
        label={t('圆柱半径（cm）', 'Cylinder radius (cm)')}
        value={r}
        min={1}
        max={6}
        mode={mode}
        change={(v) => {
          setR(v);
          setShow(false);
        }}
      />
      <Slider
        label={t('圆柱高（cm）', 'Cylinder height (cm)')}
        value={h}
        min={1}
        max={10}
        mode={mode}
        change={(v) => {
          setH(v);
          setShow(false);
        }}
      />
      <label>
        <Text
          mode={mode}
          text={t('需要的圆形面数', 'Required circular end faces')}
        />
        <select
          aria-label={word(
            mode,
            t('需要的圆形面数', 'Required circular end faces'),
          )}
          value={lids}
          onChange={(e) => {
            setLids(Number(e.target.value) as 0 | 1 | 2);
            setShow(false);
          }}
        >
          <option value="2">
            {word(mode, t('封闭：两圆面', 'Closed: two ends'))}
          </option>
          <option value="1">
            {word(mode, t('无盖：一圆面', 'Open top: one end'))}
          </option>
          <option value="0">
            {word(mode, t('只做侧面：零圆面', 'Side only: no ends'))}
          </option>
        </select>
      </label>
      <CylinderNet r={r} h={h} lids={lids} mode={mode} />
      <Check
        mode={mode}
        text={t(
          '分开核对侧面、圆面与体积',
          'Check side area, end faces and volume separately',
        )}
        click={() => setShow(true)}
      />
      <Feedback
        mode={mode}
        text={
          show
            ? t(
                `侧面积 (2πr)h=${piTerm(m.lateralCoefficient)} cm²；${lids} 个圆面合计 ${piTerm(lids * m.baseCoefficient)} cm²，所需面片总面积 ${piTerm(m.surfaceCoefficient)} cm²。完整理想圆柱的体积 πr²h=${piTerm(m.volumeCoefficient)} cm³，改变盖片数量不改变这组内部尺寸的体积；零圆面时该数不是可盛液体的容器容量。`,
                `Side area (2πr)h=${piTerm(m.lateralCoefficient)} cm²; circular-end count ${lids}, combined end area ${piTerm(lids * m.baseCoefficient)} cm², giving required face area ${piTerm(m.surfaceCoefficient)} cm². The full ideal cylinder volume πr²h=${piTerm(m.volumeCoefficient)} cm³ is unchanged by selecting end faces. With no ends it is not a liquid-holding container capacity.`,
              )
            : null
        }
      />
    </>
  );
}
export function CircleLab({
  kind,
  mode,
}: {
  kind: CircleLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-circle-lab">
      <span className="math-eyebrow">
        <Text
          mode={mode}
          text={t(
            '动手数学 · 圆、边界与空间',
            'HANDS-ON MATHS · CIRCLES, BOUNDARIES AND SPACE',
          )}
        />
      </span>
      {kind === 'circle-parts' ? (
        <Parts mode={mode} />
      ) : kind === 'circle-pi' ? (
        <PiExperiment mode={mode} />
      ) : kind === 'circle-circumference' ? (
        <Circumference mode={mode} />
      ) : kind === 'circle-area' ? (
        <Area mode={mode} />
      ) : (
        <Cylinder mode={mode} />
      )}
    </section>
  );
}
export function CircleHookArt({
  kind,
  mode,
}: {
  kind: CircleLabKind;
  mode: LanguageMode;
}) {
  const prompts: Record<CircleLabKind, string> = {
    'circle-parts': 'O → r → d ?',
    'circle-pi': 'C ÷ d ≈ ?',
    'circle-circumference': 'r · d → C ?',
    'circle-area': 'N → A ?',
    'circle-cylinder': '2πr × h · πr² × h ?',
  };
  return (
    <div className="math-circle-hook">
      <b>{prompts[kind]}</b>
      <Text
        mode={mode}
        text={t(
          '先说明测量对象和单位，再预测并验证。',
          'Identify the quantity and unit, then predict and investigate.',
        )}
      />
    </div>
  );
}
