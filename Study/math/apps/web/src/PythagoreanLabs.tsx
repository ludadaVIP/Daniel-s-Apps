import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { coordinateText } from './cartesianModels';
import { textR } from './algebraModels';
import {
  TransformBoard,
  DissectionView,
  PythagoreanTriangleView,
  ConverseView,
} from './PythagoreanVisuals';
import {
  rigidImage,
  origin,
  transformTriangle,
  dissection,
  pythagoreanSquare,
  pythagoreanClassification,
  pythagoreanCases,
  type RigidTransform,
} from './pythagoreanModels';
export type PythagoreanLabKind = Extract<Lesson['lab'], `pyth-${string}`>;
export const isPythagoreanLab = (
  kind: Lesson['lab'],
): kind is PythagoreanLabKind => kind.startsWith('pyth-');
const label = (mode: LanguageMode, s: LocalizedText) =>
  mode === 'en' ? s.en : s.zh;
function Task({ mode, answer }: { mode: LanguageMode; answer: AnswerSpec }) {
  const [value, setValue] = useState(''),
    [checked, setChecked] = useState(false);
  return (
    <div
      className="math-pyth-task"
      role="group"
      aria-label={label(
        mode,
        t('我的变换或边长结论', 'My transformation or length conclusion'),
      )}
    >
      <label>
        <Text
          mode={mode}
          text={t(
            '我的变换或边长结论',
            'My transformation or length conclusion',
          )}
        />
        <input
          type="text"
          aria-label={label(
            mode,
            t('我的变换或边长结论', 'My transformation or length conclusion'),
          )}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <p>
        <Text
          mode={mode}
          text={
            answer.kind === 'coordinate'
              ? t(
                  '按 (x,y) 写像点，允许精确分数；先核参照轴、中心和方向。',
                  'Write the image point (x,y), using exact fractions if needed; check the axis, centre and direction.',
                )
              : answer.kind === 'root-length'
                ? t(
                    '只写非负精确长度，不附单位，如 √13、2√2、sqrt(13)、√(1/2) 或 5/4。支持一个根式的有理数倍，不以截断小数代替；根号内运算请先算成数值。',
                    'Enter a nonnegative exact length without units, such as √13, 2√2, sqrt(13), √(1/2) or 5/4. One root times a rational factor is supported; do not substitute a truncated decimal. Evaluate the radicand first.',
                  )
                : answer.kind === 'geometry-class'
                  ? t(
                      '写直角/锐角/钝角三角形或不能成三角形，可用 right / acute / obtuse / impossible。先核三边存在条件。',
                      'Enter right, acute, obtuse or impossible. Check triangle existence before classification.',
                    )
                  : answer.kind === 'proof-verdict'
                    ? t(
                        '问已有条件是否充分，写充分或条件不足 / sufficient or insufficient；图示不能补直角。',
                        'For sufficiency, enter sufficient or insufficient. The drawing cannot supply a missing right-angle premise.',
                      )
                    : t(
                        '只写所求数值，分清长度和平方的面积单位。',
                        'Enter the requested number, distinguishing length from squared area units.',
                      )
          }
        />
      </p>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text mode={mode} text={t('核对本次结论', 'Check this conclusion')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(
            mode,
            t('变换与勾股反馈', 'Transformation and Pythagoras feedback'),
          )}
        >
          <Text
            mode={mode}
            text={
              checkAnswer(value, answer)
                ? t(
                    '结论符合。再说明变换参照、直角前提或三边检验的依据。',
                    'The conclusion matches. Explain the transformation reference, right-angle premise or side test.',
                  )
                : t(
                    '再核参照中心/方向、斜边身份、平方与开方、精确值及三角形存在条件。',
                    'Recheck centre/direction, the hypotenuse, squaring versus taking a root, exact values and triangle existence.',
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
function Slider({
  mode,
  name,
  value,
  min,
  max,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: number;
  min: number;
  max: number;
  change: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <input
        type="range"
        min={min}
        max={max}
        step="1"
        aria-label={label(mode, name)}
        value={value}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Transform({
  mode,
  rotation,
}: {
  mode: LanguageMode;
  rotation: boolean;
}) {
  const [method, setMethod] = useState('translate'),
    [dx, setDx] = useState(2),
    [dy, setDy] = useState(1),
    [turns, setTurns] = useState<1 | 2 | 3>(1),
    [center, setCenter] = useState(0),
    [vertex, setVertex] = useState(0),
    [shown, setShown] = useState(false),
    [wide, setWide] = useState(false),
    [twice, setTwice] = useState(false);
  const transform: RigidTransform = rotation
      ? {
          kind: 'rotate',
          center:
            center === 0
              ? origin
              : [
                  [1n, 1n],
                  [1n, 1n],
                ],
          turns,
        }
      : method === 'translate'
        ? {
            kind: 'translate',
            vector: [
              [BigInt(dx), 1n],
              [BigInt(dy), 1n],
            ],
          }
        : {
            kind: 'reflect',
            line: method as 'x-axis' | 'y-axis' | 'x=1' | 'y=x',
          },
    key = rotation
      ? `${turns}:${center}:${vertex}`
      : `${method}:${dx}:${dy}:${vertex}`,
    point = transformTriangle[vertex]!,
    image = rigidImage(point, transform),
    clear = () => {
      setShown(false);
      setTwice(false);
    };
  return (
    <>
      <p>A=(−2,−1); B=(0,−1); C=(−1,1)</p>
      <p>
        <Text
          mode={mode}
          text={t(
            `求 ${'ABC'[vertex]} 经一次所选变换的像。先作答，再主动揭示。`,
            `Find the image of ${'ABC'[vertex]} after one selected transformation. Answer before revealing.`,
          )}
        />
      </p>
      <div className="math-pyth-controls">
        {rotation ? (
          <>
            <label>
              <Text
                mode={mode}
                text={t('旋转方向与角度', 'Rotation direction and angle')}
              />
              <select
                aria-label={label(
                  mode,
                  t('旋转方向与角度', 'Rotation direction and angle'),
                )}
                value={turns}
                onChange={(e) => {
                  setTurns(Number(e.target.value) as 1 | 2 | 3);
                  clear();
                }}
              >
                <option value="1">
                  {label(mode, t('逆时针 90°', '90° anticlockwise'))}
                </option>
                <option value="2">180°</option>
                <option value="3">
                  {label(
                    mode,
                    t(
                      '顺时针 90°（逆时针 270°）',
                      '90° clockwise (270° anticlockwise)',
                    ),
                  )}
                </option>
              </select>
            </label>
            <label>
              <Text mode={mode} text={t('旋转中心', 'Rotation centre')} />
              <select
                aria-label={label(mode, t('旋转中心', 'Rotation centre'))}
                value={center}
                onChange={(e) => {
                  setCenter(Number(e.target.value));
                  clear();
                }}
              >
                <option value="0">O=(0,0)</option>
                <option value="1">O=(1,1)</option>
              </select>
            </label>
          </>
        ) : (
          <>
            <label>
              <Text
                mode={mode}
                text={t('平移或反射规则', 'Translation or reflection rule')}
              />
              <select
                aria-label={label(
                  mode,
                  t('平移或反射规则', 'Translation or reflection rule'),
                )}
                value={method}
                onChange={(e) => {
                  setMethod(e.target.value);
                  clear();
                }}
              >
                <option value="translate">
                  {label(mode, t('平移', 'Translation'))}
                </option>
                <option value="x-axis">
                  x {label(mode, t('轴反射', 'axis reflection'))}
                </option>
                <option value="y-axis">
                  y {label(mode, t('轴反射', 'axis reflection'))}
                </option>
                <option value="x=1">x=1</option>
                <option value="y=x">y=x</option>
              </select>
            </label>
            {method === 'translate' && (
              <>
                <Slider
                  mode={mode}
                  name={t('横向平移量', 'Horizontal translation')}
                  value={dx}
                  min={-3}
                  max={3}
                  change={(v) => {
                    setDx(v);
                    clear();
                  }}
                />
                <Slider
                  mode={mode}
                  name={t('纵向平移量', 'Vertical translation')}
                  value={dy}
                  min={-3}
                  max={3}
                  change={(v) => {
                    setDy(v);
                    clear();
                  }}
                />
              </>
            )}
          </>
        )}
        <label>
          <Text
            mode={mode}
            text={t('要求像点的顶点', 'Vertex whose image is requested')}
          />
          <select
            aria-label={label(
              mode,
              t('要求像点的顶点', 'Vertex whose image is requested'),
            )}
            value={vertex}
            onChange={(e) => setVertex(Number(e.target.value))}
          >
            {['A', 'B', 'C'].map((v, i) => (
              <option key={v} value={i}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>
      <TransformBoard
        mode={mode}
        transform={transform}
        shown={shown}
        wide={wide}
      />
      <div className="math-pyth-actions">
        <button className="math-button" onClick={() => setShown(!shown)}>
          <Text
            mode={mode}
            text={t('显示或隐藏一次变换的像', 'Show or hide the first image')}
          />
        </button>
        <button className="math-button" onClick={() => setWide(!wide)}>
          <Text
            mode={mode}
            text={t('改变等单位视窗', 'Change equal-unit window')}
          />
        </button>
        {rotation && turns === 2 && (
          <button className="math-button" onClick={() => setTwice(!twice)}>
            <Text
              mode={mode}
              text={t(
                '核同中心两次半转',
                'Check two half-turns about the same centre',
              )}
            />
          </button>
        )}
      </div>
      {twice && (
        <p
          role="status"
          aria-label={label(mode, t('两次半转', 'Two half-turns'))}
        >
          {coordinateText(point)} → {coordinateText(image)} →{' '}
          {coordinateText(rigidImage(image, transform))};{' '}
          <Text
            mode={mode}
            text={t(
              '两次回到原位置，作答仍问第一次。',
              'Two half-turns return to the original; the answer still concerns the first image.',
            )}
          />
        </p>
      )}
      <Task
        key={key}
        mode={mode}
        answer={{ kind: 'coordinate', value: coordinateText(image) }}
      />
    </>
  );
}
function Puzzle({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState(3),
    [b, setB] = useState(4),
    [arranged, setArranged] = useState(false),
    [stage, setStage] = useState(0),
    m = dissection(a, b);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '已给直角三角形两直角边 a、b（cm），斜边 c。四块编号三角形全等；先预测重排后的空白总面积。',
            'A right triangle has legs a,b in cm and hypotenuse c. The four numbered pieces are congruent; predict the uncovered area after rearrangement.',
          )}
        />
      </p>
      <div className="math-pyth-controls">
        <Slider
          mode={mode}
          name={t('直角边 a', 'Leg a')}
          value={a}
          min={1}
          max={5}
          change={(v) => {
            setA(v);
            setArranged(false);
            setStage(0);
          }}
        />
        <Slider
          mode={mode}
          name={t('直角边 b', 'Leg b')}
          value={b}
          min={1}
          max={5}
          change={(v) => {
            setB(v);
            setArranged(false);
            setStage(0);
          }}
        />
      </div>
      <DissectionView a={a} b={b} rearranged={arranged} mode={mode} />
      <div className="math-pyth-actions">
        <button className="math-button" onClick={() => setArranged(!arranged)}>
          <Text
            mode={mode}
            text={t(
              '重排或还原同样四块',
              'Rearrange or restore the same four pieces',
            )}
          />
        </button>
        <button
          className="math-button"
          disabled={stage === 3}
          onClick={() => setStage(stage + 1)}
        >
          <Text
            mode={mode}
            text={t('下一条面积依据', 'Next area justification')}
          />
        </button>
        <button
          className="math-button"
          disabled={!stage}
          onClick={() => setStage(stage - 1)}
        >
          <Text
            mode={mode}
            text={t('撤回面积依据', 'Undo area justification')}
          />
        </button>
      </div>
      <ol>
        {stage >= 1 && (
          <li data-area-step="1">
            <Text
              mode={mode}
              text={t(
                '四个直角三角形全等，两锐角和为 90°；中间四边形各边为 c、各角为 90°，所以是正方形。',
                'The four right triangles are congruent and their acute angles sum to 90°. The central gap has sides c and right angles, so it is a square.',
              )}
            />
          </li>
        )}
        {stage >= 2 && (
          <li data-area-step="2">
            (a+b)²−4×ab/2;{' '}
            <Text
              mode={mode}
              text={t(
                '同一个外正方形，减掉同样四块，无重叠或缝隙。',
                'Use the same outer square minus the same four pieces, without overlaps or gaps.',
              )}
            />
          </li>
        )}
        {stage >= 3 && (
          <li data-area-step="3">
            c²=a²+b²={a * a}+{b * b}={a * a + b * b};{' '}
            <Text
              mode={mode}
              text={t(
                '比较空白面积，不把边长直接相加。',
                'Compare uncovered areas rather than adding side lengths.',
              )}
            />
          </li>
        )}
      </ol>
      <p>
        (a+b)²={m.s * m.s}; 4×ab/2={2 * a * b}
      </p>
      <Task
        key={`${a}:${b}`}
        mode={mode}
        answer={{ kind: 'number', value: String(a * a + b * b), unit: 'cm²' }}
      />
    </>
  );
}
const stories: LocalizedText[] = [
  t(
    '虚构矩形两边 3 m、4 m，求对角线。矩形提供直角前提。',
    'A fictional rectangle has sides 3 m,4 m. Find its diagonal; the rectangle supplies the right angle.',
  ),
  t(
    '给定直角三角形斜边 13 cm、一条直角边 5 cm，求另一条直角边。',
    'A given right triangle has hypotenuse 13 cm and one leg 5 cm. Find the other leg.',
  ),
  t(
    '虚构矩形边长 2 m、3 m，求精确对角线。√13 表示平方为十三的非负数，不用截断小数替代。',
    'A fictional rectangle has sides 2 m,3 m. Find the exact diagonal. √13 denotes the nonnegative number squaring to thirteen, not a truncated decimal.',
  ),
  t(
    '给定直角三角形两直角边 3/4 cm、1 cm，求精确斜边。',
    'A given right triangle has legs 3/4 cm and 1 cm. Find the exact hypotenuse.',
  ),
  t(
    '仅知三角形两边 3 cm、4 cm，没有给直角或夹角。是否足以用勾股求第三边？图是一种可能，不补入直角。',
    'Only two triangle sides, 3 cm and 4 cm, are supplied without an angle. Is this sufficient to apply Pythagoras? The drawing shows one possibility and supplies no right-angle premise.',
  ),
];
function Applications({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [reveal, setReveal] = useState(false),
    c = pythagoreanCases[index]!,
    r = pythagoreanSquare(c.a, c.b, c.unknown, c.id !== 'no-right'),
    answer: AnswerSpec =
      r.kind === 'length'
        ? { kind: 'root-length', square: textR(r.square), value: r.text }
        : { kind: 'proof-verdict', value: 'insufficient' },
    b = c.unknown === 'leg' && r.kind === 'length' ? r.text : c.b;
  return (
    <>
      <label>
        <Text
          mode={mode}
          text={t('直角与边长案例', 'Right-angle and length case')}
        />
        <select
          aria-label={label(
            mode,
            t('直角与边长案例', 'Right-angle and length case'),
          )}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setReveal(false);
          }}
        >
          {stories.map((s, i) => (
            <option value={i} key={i}>
              {label(mode, s)}
            </option>
          ))}
        </select>
      </label>
      <p>
        <Text mode={mode} text={stories[index]!} />
      </p>
      <PythagoreanTriangleView
        a={c.a}
        b={b}
        unknown={c.unknown === 'leg' ? 'b' : 'c'}
        right={c.id !== 'no-right'}
        rectangle={c.id === 'rectangle' || c.id === 'root'}
        reveal={reveal}
        mode={mode}
      />
      <Task key={index} mode={mode} answer={answer} />
      <button className="math-button" onClick={() => setReveal(!reveal)}>
        <Text
          mode={mode}
          text={t('显示或隐藏原式核算', 'Show or hide the equation audit')}
        />
      </button>
      {reveal && (
        <p
          role="status"
          aria-label={label(
            mode,
            t('勾股原式核验', 'Pythagorean equation audit'),
          )}
        >
          {r.kind === 'length' ? (
            <>
              {c.unknown === 'hypotenuse'
                ? `(${c.a})²+(${c.b})²`
                : `${c.b}²−(${c.a})²`}
              ={textR(r.square)};{' '}
              <Text
                mode={mode}
                text={t(
                  `所求长度 ${r.text} ${c.unit}，取非负根。`,
                  `The length is ${r.text} ${c.unit}, using the nonnegative root.`,
                )}
              />
            </>
          ) : (
            <Text
              mode={mode}
              text={t(
                '条件不足；不知道直角时，不能把任何两边的平方和当第三边平方。',
                'Insufficient premises: without a right angle, two arbitrary squared sides need not sum to the third.',
              )}
            />
          )}
        </p>
      )}
    </>
  );
}
function Converse({ mode }: { mode: LanguageMode }) {
  const [values, setValues] = useState(['5', '3', '4']),
    [shown, setShown] = useState(false),
    r = pythagoreanClassification(values);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先核能否成非退化三角形，再排序取最长边 c。先预测类型，再显示精确平方比较；不是靠屏幕量角。',
            'Check triangle existence first, then sort to take the longest side c. Predict before showing the exact square comparison; screen angle measurements are not the test.',
          )}
        />
      </p>
      <div className="math-pyth-controls">
        {values.map((v, i) => (
          <label key={i}>
            <Text
              mode={mode}
              text={t(`输入边 ${i + 1}`, `Input side ${i + 1}`)}
            />
            <input
              type="text"
              aria-label={label(
                mode,
                t(`输入边 ${i + 1}`, `Input side ${i + 1}`),
              )}
              value={v}
              onChange={(e) => {
                setValues(
                  values.map((old, j) => (j === i ? e.target.value : old)),
                );
                setShown(false);
              }}
            />
          </label>
        ))}
      </div>
      {r ? (
        <>
          <ConverseView sides={values} mode={mode} reveal={shown} />
          <Task
            key={values.join(';')}
            mode={mode}
            answer={{ kind: 'geometry-class', value: r.kind }}
          />
          <button className="math-button" onClick={() => setShown(!shown)}>
            <Text
              mode={mode}
              text={t('显示或隐藏三边检验', 'Show or hide the side test')}
            />
          </button>
          {shown && (
            <p
              role="status"
              aria-label={label(mode, t('逆定理核验', 'Converse audit'))}
            >
              {r.kind === 'impossible' ? (
                <Text
                  mode={mode}
                  text={t(
                    '非正长度或两短边和不大于长边，不能成三角形；到此停止。',
                    'A nonpositive side or short-side sum not exceeding the longest prevents a triangle; stop here.',
                  )}
                />
              ) : (
                <>
                  {r.sides.map(textR).join(' ≤ ')}; c²−a²−b²={textR(r.delta!)};{' '}
                  <Text
                    mode={mode}
                    text={
                      r.kind === 'right'
                        ? t(
                            '等于零，最长边所对角为直角。',
                            'Zero: the angle opposite the longest side is right.',
                          )
                        : r.kind === 'obtuse'
                          ? t(
                              '大于零，最长边所对角为钝角。',
                              'Positive: the angle opposite the longest side is obtuse.',
                            )
                          : t(
                              '小于零，最大角为锐角，故为锐角三角形。',
                              'Negative: even the largest angle is acute, so the triangle is acute.',
                            )
                    }
                  />
                </>
              )}
            </p>
          )}
        </>
      ) : (
        <p>
          <Text
            mode={mode}
            text={t(
              '请输入三个有效数值或分数。',
              'Enter three valid numbers or fractions.',
            )}
          />
        </p>
      )}
    </>
  );
}
export function PythagoreanLab({
  kind,
  mode,
}: {
  kind: PythagoreanLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-pyth-lab">
      {kind === 'pyth-translate' ? (
        <Transform mode={mode} rotation={false} />
      ) : kind === 'pyth-rotate' ? (
        <Transform mode={mode} rotation />
      ) : kind === 'pyth-proof' ? (
        <Puzzle mode={mode} />
      ) : kind === 'pyth-apply' ? (
        <Applications mode={mode} />
      ) : (
        <Converse mode={mode} />
      )}
    </section>
  );
}
export function PythagoreanHookArt({
  kind,
  mode,
}: {
  kind: PythagoreanLabKind;
  mode: LanguageMode;
}) {
  const text: Record<PythagoreanLabKind, LocalizedText> = {
    'pyth-translate': t(
      '向右平移与对 y 轴反射，会怎样改变坐标？',
      'How do rightward translation and reflection in the y axis change coordinates?',
    ),
    'pyth-rotate': t(
      '绕 (1,1) 半转，能直接把两个坐标都改号吗？',
      'Can a half-turn about (1,1) simply negate both coordinates?',
    ),
    'pyth-proof': t(
      '同一个正方形减去同样四块，剩余面积能不同吗？',
      'Can the remaining area change after the same square loses the same four pieces?',
    ),
    'pyth-apply': t(
      '直角边三和四，斜边为什么不是七？',
      'With legs three and four, why is the hypotenuse not seven?',
    ),
    'pyth-converse': t(
      '三边顺序写成五、三、四，哪条才应该拿来作最长边？',
      'With sides listed five, three, four, which should be treated as the longest?',
    ),
  };
  return (
    <p className="math-pyth-hook">
      <Text mode={mode} text={text[kind]} />
    </p>
  );
}
