import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { mulR, textR } from './algebraModels';
import { readRational } from './rationalModels';
import {
  baseSimilarTriangle,
  similaritySummary,
  similarityNumericPoints,
  availableSimilarityRules,
  similarityCases,
  similaritySideCases,
  rectangleScale,
  mapDistance,
  shadowHeight,
  photoModel,
  type PhotoMode,
} from './similarityModels';
import {
  SimilarityPair,
  NestedSimilarity,
  ScaleAreaView,
  SimilarityMap,
  SimilarityPhoto,
  SimilarityShadow,
} from './SimilarityVisuals';
export type SimilarityLabKind = Extract<Lesson['lab'], `similarity-${string}`>;
export const isSimilarityLab = (
  kind: Lesson['lab'],
): kind is SimilarityLabKind => kind.startsWith('similarity-');
const label = (mode: LanguageMode, s: LocalizedText) =>
  mode === 'en' ? s.en : s.zh;
function Task({
  mode,
  answer,
  prompt,
  name = t('我的相似关系结论', 'My similarity conclusion'),
}: {
  mode: LanguageMode;
  answer: AnswerSpec;
  prompt: LocalizedText;
  name?: LocalizedText;
}) {
  const [value, setValue] = useState(''),
    [checked, setChecked] = useState(false);
  return (
    <div className="math-quadratic-task">
      <p>
        <Text mode={mode} text={prompt} />
      </p>
      <label>
        <Text mode={mode} text={name} />
        <input
          aria-label={label(mode, name)}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button
        className="math-button"
        aria-label={label(mode, t(`核对：${name.zh}`, `Check: ${name.en}`))}
        onClick={() => setChecked(true)}
      >
        <Text
          mode={mode}
          text={t('核对相似结论', 'Check similarity conclusion')}
        />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(mode, t(`${name.zh}反馈`, `${name.en} feedback`))}
        >
          <Text
            mode={mode}
            text={
              checkAnswer(value, answer)
                ? t(
                    '结论符合。请另说明对应、统一倍率或判定前提；名称与数值不代替证明。',
                    'The conclusion matches. Explain correspondence, a common scale or the criterion premises; a name or value does not replace proof.',
                  )
                : t(
                    '重核顶点次序、第二个/第一个的倍率方向、夹角位置、平方倍率及已给条件。',
                    'Recheck vertex order, second/first scale direction, the included angle, squared area scale and supplied premises.',
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
function ViewControls({
  mode,
  turns,
  setTurns,
  mirror,
  setMirror,
  zoom,
  setZoom,
}: {
  mode: LanguageMode;
  turns: number;
  setTurns: (n: number) => void;
  mirror: boolean;
  setMirror: (b: boolean) => void;
  zoom: number;
  setZoom: (n: number) => void;
}) {
  return (
    <div className="math-quadratic-controls">
      <label>
        <Text
          mode={mode}
          text={t('仅改变第二图旋转', 'Rotate second diagram only')}
        />
        <select
          aria-label={label(
            mode,
            t('仅改变第二图旋转', 'Rotate second diagram only'),
          )}
          value={turns}
          onChange={(e) => setTurns(Number(e.target.value))}
        >
          {[0, 1, 2, 3].map((n) => (
            <option key={n} value={n}>
              {n * 90}°
            </option>
          ))}
        </select>
      </label>
      <label className="math-similarity-toggle">
        <input
          type="checkbox"
          aria-label={label(
            mode,
            t('仅反射第二图', 'Reflect second diagram only'),
          )}
          checked={mirror}
          onChange={(e) => setMirror(e.target.checked)}
        />
        <Text
          mode={mode}
          text={t('仅反射第二图', 'Reflect second diagram only')}
        />
      </label>
      <button
        className="math-button"
        onClick={() => setZoom(zoom === 1 ? 0.75 : 1)}
      >
        <Text
          mode={mode}
          text={t('共同改变图示缩放', 'Change common diagram zoom')}
        />
      </button>
    </div>
  );
}
function Meaning({ mode }: { mode: LanguageMode }) {
  const [k, setK] = useState('1.5'),
    [vertical, setVertical] = useState('1'),
    [uniform, setUniform] = useState(true),
    [order, setOrder] = useState('DEF'),
    [shown, setShown] = useState(false),
    [turns, setTurns] = useState(1),
    [mirror, setMirror] = useState(true),
    [zoom, setZoom] = useState(1),
    sx = readRational(k),
    sy = readRational(uniform ? k : vertical),
    target = baseSimilarTriangle.map(
      (p) => [mulR(p[0], sx), mulR(p[1], sy)] as const,
    ),
    actual = similaritySummary(baseSimilarTriangle, target),
    tested = similaritySummary(baseSimilarTriangle, target, order),
    key = `${k}:${textR(sy)}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '相似需对应角相等、对应边同倍率；先固定第二个/第一个的方向。旋转、反射不改字母身份，k=1时相似也全等。单向拉伸要另核，不能只看一对边。',
            'Similarity requires equal corresponding angles and one scale for corresponding sides. Fix second/first as the direction. Rotation and reflection preserve label identity; k=1 is both similar and congruent. A directional stretch needs a new check, not one side pair.',
          )}
        />
      </p>
      <label>
        kₓ
        <input
          type="range"
          min=".5"
          max="2"
          step=".5"
          aria-label={label(mode, t('横向倍率', 'Horizontal scale factor'))}
          value={k}
          onChange={(e) => {
            setK(e.target.value);
            setShown(false);
          }}
        />
        <output>{k}</output>
      </label>
      <label className="math-similarity-toggle">
        <input
          type="checkbox"
          aria-label={label(
            mode,
            t('横纵统一倍率', 'Use one scale in both directions'),
          )}
          checked={uniform}
          onChange={(e) => {
            setUniform(e.target.checked);
            setShown(false);
          }}
        />
        <Text
          mode={mode}
          text={t('横纵统一倍率', 'Use one scale in both directions')}
        />
      </label>
      {!uniform && (
        <label>
          kᵧ
          <input
            type="range"
            min=".5"
            max="2"
            step=".5"
            aria-label={label(mode, t('纵向倍率', 'Vertical scale factor'))}
            value={vertical}
            onChange={(e) => {
              setVertical(e.target.value);
              setShown(false);
            }}
          />
          <output>{vertical}</output>
        </label>
      )}
      <ViewControls
        {...{ mode, turns, setTurns, mirror, setMirror, zoom, setZoom }}
      />
      <SimilarityPair
        mode={mode}
        source={similarityNumericPoints(baseSimilarTriangle)}
        target={similarityNumericPoints(target)}
        turns={turns}
        mirror={mirror}
        zoom={zoom}
        sourceLengths={{ AB: '4', CA: '3', BC: '5' }}
        targetLengths={{
          AB: textR(mulR([4n, 1n], sx)),
          CA: textR(mulR([3n, 1n], sy)),
        }}
      />
      <Task
        key={`${key}:class`}
        mode={mode}
        answer={{
          kind: 'similarity-class',
          value: actual.similar ? 'similar' : 'not-similar',
        }}
        prompt={t(
          '按完整图形判断相似/不相似，写similar/not similar；不要求方向相同。',
          'Judge the complete figures as similar or not similar, regardless of orientation.',
        )}
      />
      {actual.similar && (
        <>
          <Task
            key={`${key}:order`}
            name={t('从ABC写对应三角形', 'Corresponding triangle for ABC')}
            mode={mode}
            answer={{ kind: 'geometry-code', value: 'DEF' }}
            prompt={t(
              '按A、B、C顺序写像三角形的三个字母；旋转反射不重新命名。',
              'Write image letters in A,B,C correspondence order; rotation and reflection do not rename vertices.',
            )}
          />
          <Task
            key={key}
            name={t(
              '第二个比第一个的正倍率',
              'Positive second-to-first factor',
            )}
            mode={mode}
            answer={{
              kind: 'radical',
              value: actual.factor!,
              simplified: false,
            }}
            prompt={t(
              '只写第二个/第一个的正倍率，可用精确分数。',
              'Enter only the positive second/first factor, using exact fractions if useful.',
            )}
          />
        </>
      )}
      <label>
        <Text
          mode={mode}
          text={t(
            '仅检验一个提出的对应',
            'Audit a proposed correspondence only',
          )}
        />
        <select
          aria-label={label(
            mode,
            t('仅检验一个提出的对应', 'Audit a proposed correspondence only'),
          )}
          value={order}
          onChange={(e) => setOrder(e.target.value)}
        >
          {['DEF', 'DFE', 'EDF', 'EFD', 'FDE', 'FED'].map((v) => (
            <option key={v}>{v}</option>
          ))}
        </select>
      </label>
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t(
            '显示或隐藏对应倍率核验',
            'Show or hide correspondence audit',
          )}
        />
      </button>
      {shown && (
        <div
          role="status"
          aria-label={label(mode, t('对应倍率核验', 'Correspondence audit'))}
        >
          <p>
            ABC ↔ {order};{' '}
            <Text
              mode={mode}
              text={t('三对边的平方比', 'Three squared-side ratios')}
            />
            : {tested.squaredRatios.map(textR).join(', ')}
          </p>
          <p>
            <Text
              mode={mode}
              text={
                tested.similar
                  ? t(
                      `此对应统一，k=${tested.factor}；面积比=${textR(tested.areaRatio)}。`,
                      `This correspondence is uniform: k=${tested.factor}, area ratio=${textR(tested.areaRatio)}.`,
                    )
                  : t(
                      '此提出的对应未给统一倍率；应另查正确对应，不能仅由错误次序宣布整个图形不相似。',
                      'This proposed correspondence is not uniform. Check other correspondences before declaring the whole figures nonsimilar.',
                    )
              }
            />
          </p>
          <p>
            <Text
              mode={mode}
              text={t(
                `实际图形${actual.similar ? '相似' : '不相似'}；${actual.congruent ? '也全等' : '本例不全等'}。`,
                `The actual figures are ${actual.similar ? 'similar' : 'not similar'}; ${actual.congruent ? 'also congruent' : 'not congruent in this case'}.`,
              )}
            />
          </p>
        </div>
      )}
    </>
  );
}
function Criteria({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [shown, setShown] = useState(false),
    [turns, setTurns] = useState(1),
    [mirror, setMirror] = useState(true),
    [zoom, setZoom] = useState(1),
    c = similarityCases[index]!,
    rules = availableSimilarityRules(c.facts);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '这里问已给条件保证哪条判定，不把图形看起来相似当证明。AA两角、SAS两边成比例且夹角相等、SSS三边成比例；SSA的一般非夹角条件不足。先读固定对应ABC↔DEF。',
            'Choose a criterion justified by supplied evidence, not by appearance: AA, proportional sides with their included angle for SAS, or three proportional sides for SSS. General SSA is insufficient. The correspondence is fixed as ABC↔DEF.',
          )}
        />
      </p>
      <label>
        <Text
          mode={mode}
          text={t('相似判定证据案例', 'Similarity-evidence case')}
        />
        <select
          aria-label={label(
            mode,
            t('相似判定证据案例', 'Similarity-evidence case'),
          )}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setShown(false);
          }}
        >
          {similarityCases.map((v, i) => (
            <option key={v.id} value={i}>
              {i + 1} · {v.id}
            </option>
          ))}
        </select>
      </label>
      <p>
        <Text mode={mode} text={t('只用这些已知', 'Use only these givens')} />:{' '}
        {c.facts.angles
          .map((v) => `∠${v}=∠${'DEF'['ABC'.indexOf(v)]}=${c.angleValues[v]}°`)
          .join('; ') || label(mode, t('未给角相等', 'no angle equalities'))}
        ;{' '}
        {Object.entries(c.facts.ratios)
          .map(
            ([side, value]) =>
              `${({ AB: 'DE/AB', BC: 'EF/BC', CA: 'FD/CA' } as Record<string, string>)[side]}=${value}`,
          )
          .join('; ')}
      </p>
      <ViewControls
        {...{ mode, turns, setTurns, mirror, setMirror, zoom, setZoom }}
      />
      <SimilarityPair
        mode={mode}
        source={c.source}
        target={c.target}
        turns={turns}
        mirror={mirror}
        zoom={zoom}
        sourceLengths={c.sourceLengths}
        targetLengths={c.targetLengths}
        angles={c.angleValues}
      />
      <Task
        key={index}
        mode={mode}
        answer={{
          kind: 'similarity-rule',
          value: rules[0]!,
          alternatives: rules.slice(1),
        }}
        prompt={t(
          '写AA/SAS/SSS或insufficient；若用AAA，应说明第三角冗余。完整理由仍由家长核。',
          'Enter AA, SAS, SSS or insufficient. If using AAA explain the redundant third angle; a parent still reviews the proof.',
        )}
      />
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t('显示或隐藏判定依据核验', 'Show or hide criterion audit')}
        />
      </button>
      {shown && (
        <div
          role="status"
          aria-label={label(
            mode,
            t('相似判定核验', 'Similarity-criterion audit'),
          )}
        >
          <p>{rules.join(' / ')}</p>
          <Text
            mode={mode}
            text={
              c.id === 'SSA'
                ? t(
                    '反例两三角形分别有AB=6、BC=4、∠A=30°，CA=3√3−√7或3√3+√7；第二个再乘3/2仍符合两对已知边比例，但第三对不同比。给的是非夹角，不能套SAS。',
                    'The two base alternatives have AB=6, BC=4, ∠A=30°, with CA=3√3−√7 or 3√3+√7. Scaling the second by 3/2 preserves the two given side ratios, but not the third. The supplied angle is not included, so SAS does not apply.',
                  )
                : c.id === 'AAA'
                  ? t(
                      '三角和使第三角由前两角确定，AA足够相似；这与AAA不足以证明全等不同，大小倍率仍可不同。',
                      'The angle sum makes the third equality redundant: AA establishes similarity, while AAA alone does not establish congruence or fix scale.',
                    )
                  : rules[0] === 'insufficient'
                    ? t(
                        '一角或不统一的边比不能给本课一般判定。需补充分条件，不能从示意图补条件。',
                        'One angle or nonuniform side ratios do not establish these general criteria. Supply sufficient premises rather than inferring them from the sketch.',
                      )
                    : t(
                        '角对应固定；SAS必须是两条已比边的夹角，SSS须三个同方向正边比一致。AA可由内角和推出第三角。',
                        'Keep the angle correspondence fixed. SAS needs the angle included between the compared sides; SSS needs three equal positive ratios in one direction. AA implies the third angle by the angle sum.',
                      )
            }
          />
        </div>
      )}
    </>
  );
}
function Lengths({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [shown, setShown] = useState(false),
    [alternative, setAlternative] = useState(false),
    c = similaritySideCases[index]!,
    source = similarityNumericPoints(baseSimilarTriangle),
    target =
      index === 3
        ? source.map((p) => ({ x: p.x * 1.5, y: p.y * (alternative ? 2 : 1) }))
        : source.map((p) => ({ x: p.x * 1.5, y: p.y * 1.5 }));
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先证明或明确给出相似，再按顶点次序匹配整条边。目标/原图倍率用于放大，反求原边则相除；嵌套图不能拿一段与另一段冒充对应全边。',
            'Establish or use given similarity before matching whole sides in vertex order. Multiply by target/original for a forward side and divide for the reverse. In a nested diagram, do not substitute a leftover segment for a corresponding whole side.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('相似边长案例', 'Similar-side case')} />
        <select
          aria-label={label(mode, t('相似边长案例', 'Similar-side case'))}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setShown(false);
            setAlternative(false);
          }}
        >
          {similaritySideCases.map((v, i) => (
            <option key={v.id} value={i}>
              {i + 1} · {v.id}
            </option>
          ))}
        </select>
      </label>
      <p>
        <Text mode={mode} text={c.story} />
      </p>
      {index === 2 ? (
        <NestedSimilarity mode={mode} shown={shown} />
      ) : (
        <SimilarityPair
          mode={mode}
          source={source}
          target={target}
          sourceLengths={
            index === 1 ? { AB: '4', CA: 'x' } : { AB: '4', BC: '5' }
          }
          targetLengths={
            index === 1 ? { AB: '6', CA: '9/2' } : { AB: '6', BC: 'x' }
          }
        />
      )}
      {index === 3 && (
        <button
          className="math-button"
          onClick={() => setAlternative(!alternative)}
        >
          <Text
            mode={mode}
            text={t(
              '仅换另一种可能图形',
              'Show another possible triangle only',
            )}
          />
        </button>
      )}
      <Task
        key={index}
        mode={mode}
        answer={
          c.value
            ? { kind: 'number', value: c.value, unit: 'cm' }
            : { kind: 'proof-verdict', value: 'insufficient' }
        }
        prompt={
          c.value
            ? t(
                '只写所求边长，可附cm；先说明哪条边对应，不只交一个比例。',
                'Enter the requested length, optionally in cm. Explain the corresponding sides, not just an isolated ratio.',
              )
            : t(
                '只知一对边，能唯一求另一边吗？写sufficient/insufficient，理由另核。',
                'Does one side pair determine the other side? Enter sufficient or insufficient, then explain.',
              )
        }
      />
      {c.factor && (
        <Task
          key={`${index}:factor`}
          name={t('本题方向的倍率', 'Scale in the stated direction')}
          mode={mode}
          answer={{ kind: 'number', value: c.factor }}
          prompt={t(
            '写题设指定方向的倍率；嵌套题是小/大。',
            'Enter the scale in the stated direction; the nested case uses small/large.',
          )}
        />
      )}
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t(
            '显示或隐藏对应边核验',
            'Show or hide side-correspondence audit',
          )}
        />
      </button>
      {shown && (
        <p
          role="status"
          aria-label={label(mode, t('对应边核验', 'Side-correspondence audit'))}
        >
          <Text
            mode={mode}
            text={
              index === 0
                ? t(
                    'EF/BC=DE/AB=6/4=3/2，EF=5×3/2=15/2 cm。',
                    'EF/BC=DE/AB=6/4=3/2, so EF=5×3/2=15/2 cm.',
                  )
                : index === 1
                  ? t(
                      'DF/CA=DE/AB=3/2，CA=(9/2)÷(3/2)=3 cm。',
                      'DF/CA=DE/AB=3/2, so CA=(9/2)÷(3/2)=3 cm.',
                    )
                  : index === 2
                    ? t(
                        '由平行得AA，△ADE∼△ABC。AD/AB=4/6=2/3，DE=12×2/3=8，AE=9×2/3=6；AD/DB=2不是相似倍率。',
                        'Parallel lines give AA and △ADE∼△ABC. AD/AB=4/6=2/3, so DE=12×2/3=8 and AE=9×2/3=6; AD/DB=2 is not the similarity scale.',
                      )
                    : t(
                        '两种可能图形保留DE=6，EF却不同；未给相似不能把6/4套到所有边。',
                        'Both possible diagrams retain DE=6 but give different EF. Without similarity, 6/4 cannot be applied to every side.',
                      )
            }
          />
        </p>
      )}
    </>
  );
}
function Area({ mode }: { mode: LanguageMode }) {
  const [sx, setSx] = useState(2),
    [sy, setSy] = useState(1),
    [uniform, setUniform] = useState(true),
    [shown, setShown] = useState(false),
    vertical = uniform ? sx : sy,
    m = rectangleScale('3', '2', String(sx), String(vertical)),
    key = `${sx}:${vertical}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '固定宽3、高2的原矩形与同一单位小格。只有对应长度统一乘正k时，周长乘k、面积乘k²。反求正长度比取面积比的正平方根；面积比相同本身不保证图形相似。',
            'Keep the original 3-by-2 rectangle and common unit cells. Uniform positive length factor k scales perimeter by k and area by k². Recover length scale with the positive square root; an area ratio alone does not establish similarity.',
          )}
        />
      </p>
      <label>
        kₓ
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          aria-label={label(
            mode,
            t('面积图横倍率', 'Area-diagram horizontal factor'),
          )}
          value={sx}
          onChange={(e) => {
            setSx(Number(e.target.value));
            setShown(false);
          }}
        />
        <output>{sx}</output>
      </label>
      <label className="math-similarity-toggle">
        <input
          type="checkbox"
          aria-label={label(
            mode,
            t('面积图统一倍率', 'Uniform area-diagram scale'),
          )}
          checked={uniform}
          onChange={(e) => {
            setUniform(e.target.checked);
            setShown(false);
          }}
        />
        <Text
          mode={mode}
          text={t('面积图统一倍率', 'Uniform area-diagram scale')}
        />
      </label>
      {!uniform && (
        <label>
          kᵧ
          <input
            type="range"
            min="1"
            max="3"
            step="1"
            aria-label={label(
              mode,
              t('面积图纵倍率', 'Area-diagram vertical factor'),
            )}
            value={sy}
            onChange={(e) => {
              setSy(Number(e.target.value));
              setShown(false);
            }}
          />
          <output>{sy}</output>
        </label>
      )}
      <ScaleAreaView mode={mode} sx={sx} sy={vertical} shown={shown} />
      <Task
        key={`${key}:class`}
        mode={mode}
        answer={{
          kind: 'similarity-class',
          value: m.similar ? 'similar' : 'not-similar',
        }}
        prompt={t(
          '按宽对应宽、高对应高，图形相似吗？写similar/not similar。',
          'With width-to-width and height-to-height correspondence, enter similar or not similar.',
        )}
      />
      <Task
        key={`${key}:ratio`}
        name={t('目标比原图的面积倍率', 'Target-to-original area factor')}
        mode={mode}
        answer={{ kind: 'number', value: textR(m.areaRatio) }}
        prompt={t(
          '只写面积倍率，不把长度倍率抄过来。',
          'Enter the area factor, not a copied length factor.',
        )}
      />
      <Task
        key={key}
        name={t('目标面积', 'Target area')}
        mode={mode}
        answer={{ kind: 'number', value: textR(m.targetArea), unit: 'cm²' }}
        prompt={t(
          '每小格1cm²，求目标总面积。',
          'Each cell is 1 cm². Find the target’s total area.',
        )}
      />
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t('显示或隐藏面积分块核验', 'Show or hide area-block audit')}
        />
      </button>
      {shown && (
        <p
          role="status"
          aria-label={label(mode, t('面积分块核验', 'Area-block audit'))}
        >
          <Text
            mode={mode}
            text={t(
              `面积比=${textR(m.areaRatio)}，周长比=${textR(m.perimeterRatio)}；${m.similar ? `统一k=${sx}，有${sx * sx}个原面积块` : '横纵倍率不同，不能把一对边的倍率平方当作相似面积公式'}。`,
              `Area ratio=${textR(m.areaRatio)}, perimeter ratio=${textR(m.perimeterRatio)}; ${m.similar ? `uniform k=${sx} gives ${sx * sx} original-area blocks` : 'the directional factors differ, so one side factor squared is not a justified similarity rule'}.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Applications({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [zoom, setZoom] = useState(1),
    [photo, setPhoto] = useState<PhotoMode>('uniform'),
    [conditions, setConditions] = useState(true),
    [shown, setShown] = useState(false),
    m = photoModel(photo);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '地图比例、等比图像与影长都依赖明确条件。先统一单位与倍率方向；屏幕缩放不改实际距离，裁切不等于把留下的内容拉伸，透视也不保证全图统一比例。',
            'Map scale, uniform images and shadows depend on explicit premises. Unify units and ratio direction. Screen zoom does not change distance; cropping does not stretch retained content, and perspective does not guarantee one image-wide scale.',
          )}
        />
      </p>
      <label>
        <Text
          mode={mode}
          text={t('相似应用案例', 'Similarity-application case')}
        />
        <select
          aria-label={label(
            mode,
            t('相似应用案例', 'Similarity-application case'),
          )}
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setShown(false);
          }}
        >
          <option value="0">map</option>
          <option value="1">photo</option>
          <option value="2">shadow</option>
        </select>
      </label>
      {index === 0 ? (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                '虚构地图原参考图1:50000，AB直线图距3cm。求实际直线距离，不冒充道路行程。',
                'A fictional reference map is 1:50000 and AB measures 3 cm. Find real straight-line distance, not road travel distance.',
              )}
            />
          </p>
          <label>
            <Text
              mode={mode}
              text={t('仅改变地图屏幕缩放', 'Map screen zoom only')}
            />
            <input
              type="range"
              min=".5"
              max="1.5"
              step=".25"
              aria-label={label(
                mode,
                t('仅改变地图屏幕缩放', 'Map screen zoom only'),
              )}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
            <output>{zoom}</output>
          </label>
          <SimilarityMap mode={mode} zoom={zoom} />
          <Task
            key="map"
            mode={mode}
            answer={{
              kind: 'number',
              value: textR(mapDistance('3', '50000')),
              unit: 'km',
            }}
            prompt={t(
              '写实际直线距离，单位km；缩放后同一答案应保留。',
              'Give real straight-line distance in km; the same answer remains after zoom.',
            )}
          />
        </>
      ) : index === 1 ? (
        <>
          <label>
            <Text mode={mode} text={t('图像变换方式', 'Image operation')} />
            <select
              aria-label={label(mode, t('图像变换方式', 'Image operation'))}
              value={photo}
              onChange={(e) => {
                setPhoto(e.target.value as PhotoMode);
                setShown(false);
              }}
            >
              {['uniform', 'stretch', 'crop', 'perspective'].map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <p>
            <Text
              mode={mode}
              text={t(
                '原图框4×3cm。等比模式宽改10cm；拉伸模式改10×6cm；裁切先留4×2再等比放大；透视模式无统一倍率保证。',
                'The original frame is 4×3 cm. Uniform mode sets width ten; stretch mode makes 10×6; crop mode keeps 4×2 then resizes uniformly; perspective supplies no uniform-scale guarantee.',
              )}
            />
          </p>
          <SimilarityPhoto mode={mode} operation={photo} />
          <Task
            key={`photo:${photo}`}
            mode={mode}
            answer={
              photo === 'perspective'
                ? { kind: 'proof-verdict', value: 'insufficient' }
                : {
                    kind: 'similarity-class',
                    value: m.similar ? 'similar' : 'not-similar',
                  }
            }
            prompt={
              photo === 'perspective'
                ? t(
                    '仅凭透视图一个参照长度，足以用统一倍率恢复别处真实长度吗？写sufficient/insufficient。',
                    'Does one reference length in a perspective image justify a uniform scale for other real lengths? Enter sufficient or insufficient.',
                  )
                : t(
                    '比较完整原图框与新图框，按宽高对应判断similar/not similar；裁掉的内容不算仍完整对应。',
                    'Compare the complete original and new frames as similar/not similar by width/height correspondence; cropped-away content is no longer a full correspondence.',
                  )
            }
          />
          {photo === 'uniform' && (
            <Task
              key="photo-height"
              name={t('等比新图高度', 'Uniformly resized height')}
              mode={mode}
              answer={{ kind: 'number', value: '15/2', unit: 'cm' }}
              prompt={t(
                '宽4到10，等比高度应为多少？',
                'With width changing from four to ten, what is the uniformly resized height?',
              )}
            />
          )}
        </>
      ) : (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                '虚构直立标杆高1.2m、影长0.8m，目标影长3m。共同平行光线、同一平地且目标直立时求高度；取消前提后改判断。',
                'A fictional upright stick is 1.2 m tall with shadow 0.8 m; the target shadow is 3 m. Under common parallel light, the same level ground and an upright target, find its height; without those premises judge sufficiency.',
              )}
            />
          </p>
          <label className="math-similarity-toggle">
            <input
              type="checkbox"
              aria-label={label(
                mode,
                t(
                  '平行光线与平地直立前提齐全',
                  'Parallel-light and level-upright premises supplied',
                ),
              )}
              checked={conditions}
              onChange={(e) => {
                setConditions(e.target.checked);
                setShown(false);
              }}
            />
            <Text
              mode={mode}
              text={t(
                '平行光线与平地直立前提齐全',
                'Parallel-light and level-upright premises supplied',
              )}
            />
          </label>
          <SimilarityShadow mode={mode} conditions={conditions} />
          <Task
            key={`shadow:${conditions}`}
            mode={mode}
            answer={
              conditions
                ? {
                    kind: 'number',
                    value: textR(shadowHeight('1.2', '.8', '3')),
                    unit: 'm',
                  }
                : { kind: 'proof-verdict', value: 'insufficient' }
            }
            prompt={
              conditions
                ? t(
                    '求高度，单位m；先用AA说明相似。',
                    'Find height in m, first justifying similarity by AA.',
                  )
                : t(
                    '条件取消后，能唯一求目标高度吗？写sufficient/insufficient。',
                    'With the premises removed, is target height uniquely determined? Enter sufficient or insufficient.',
                  )
            }
          />
        </>
      )}
      <button className="math-button" onClick={() => setShown(!shown)}>
        <Text
          mode={mode}
          text={t(
            '显示或隐藏应用条件核验',
            'Show or hide application-premise audit',
          )}
        />
      </button>
      {shown && (
        <p
          role="status"
          aria-label={label(
            mode,
            t('应用条件核验', 'Application-premise audit'),
          )}
        >
          <Text
            mode={mode}
            text={
              index === 0
                ? t(
                    '3×50000=150000cm=1.5km；AB像素长与比例尺像素长的比始终1.5。屏幕厘米不能直接冒充原参考厘米。',
                    '3×50000=150000 cm=1.5 km. AB pixel length divided by the scale-bar pixel length remains 1.5; screen centimetres are not the reference centimetres.',
                  )
                : index === 1
                  ? photo === 'uniform'
                    ? t(
                        '统一k=10/4=5/2，高=3×5/2=15/2cm；面积倍率25/4而不是5/2。',
                        'Uniform k=10/4=5/2 gives height 15/2 cm; area factor is 25/4, not 5/2.',
                      )
                    : photo === 'crop'
                      ? t(
                          '新图框比例10:5=2:1，原框4:3，不相似；剩余局部仍等比缩放，没有被压扁，只是内容不完整。',
                          'The new 10:5 frame differs from original 4:3. Retained content is still uniformly scaled, without squashing, but the complete original is no longer present.',
                        )
                      : photo === 'stretch'
                        ? t(
                            '宽倍率5/2，高倍率2，不能同一个k；内部圆形变成椭圆。',
                            'Width factor 5/2 differs from height factor two; there is no single k and the circle becomes an ellipse.',
                          )
                        : t(
                            '透视投影的局部倍率会随位置改变；缺少平面姿态/校准条件，一个长度不能给全图统一比例。',
                            'Projective local scale varies with position. Without pose/calibration conditions, one length does not establish a uniform image-wide scale.',
                          )
                  : conditions
                    ? t(
                        '两直角加相同光线夹角给AA；高/影长=1.2/0.8=3/2，目标高3×3/2=4.5m。',
                        'Right angles and equal light angles give AA; height/shadow=1.2/0.8=3/2, so target height is 3×3/2=4.5 m.',
                      )
                    : t(
                        '没有保证相似的前提，比例式不能直接成立；缺条件与算术失误分开。',
                        'Without premises guaranteeing similarity the proportion is unjustified; missing evidence differs from an arithmetic error.',
                      )
            }
          />
        </p>
      )}
    </>
  );
}
export function SimilarityLab({
  kind,
  mode,
}: {
  kind: SimilarityLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-quadratic-lab math-similarity-lab">
      {kind === 'similarity-meaning' ? (
        <Meaning mode={mode} />
      ) : kind === 'similarity-tests' ? (
        <Criteria mode={mode} />
      ) : kind === 'similarity-sides' ? (
        <Lengths mode={mode} />
      ) : kind === 'similarity-area' ? (
        <Area mode={mode} />
      ) : (
        <Applications mode={mode} />
      )}
    </section>
  );
}
export function SimilarityHookArt({
  kind,
  mode,
}: {
  kind: SimilarityLabKind;
  mode: LanguageMode;
}) {
  const hooks: Record<SimilarityLabKind, LocalizedText> = {
    'similarity-meaning': t(
      '把三角形旋转、翻面并放大，怎样保持顶点对应？',
      'How do vertices keep their correspondence after rotating, reflecting and enlarging a triangle?',
    ),
    'similarity-tests': t(
      '两边成比例再加一个角，夹角与非夹角能互换吗？',
      'With two proportional sides and an angle, may included and nonincluded angles be interchanged?',
    ),
    'similarity-sides': t(
      '小三角形的4，对应大边的6，还是剩下的一段2？',
      'Does the small triangle’s four correspond to the whole side six or the leftover segment two?',
    ),
    'similarity-area': t(
      '长度放大三倍，为何面积不是只放大三倍？',
      'Why does tripling lengths do more than triple area?',
    ),
    'similarity-applications': t(
      '手机放大地图，真实距离会变吗；一张斜拍照片能处处用同一倍率吗？',
      'Does zooming a map change real distance, and does a tilted photo have one scale everywhere?',
    ),
  };
  return (
    <p>
      <Text mode={mode} text={hooks[kind]} />
    </p>
  );
}
