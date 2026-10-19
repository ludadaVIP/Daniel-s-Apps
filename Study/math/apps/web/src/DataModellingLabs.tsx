import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { textR } from './algebraModels';
import {
  dataSummary,
  cleaningAudit,
  shapeCases,
  spreadCases,
  transformData,
  zScore,
  regressionCases,
  leastSquares,
  candidateFit,
  regressionPrediction,
  predictionScope,
  type DataCode,
} from './dataModellingModels';
import {
  DataTable,
  ShapeFigure,
  DeviationFigure,
  StandardFigure,
  RegressionFigure,
} from './DataModellingVisuals';
export type DataModellingLabKind = Extract<Lesson['lab'], `data-${string}`>;
export const isDataModellingLab = (
  kind: Lesson['lab'],
): kind is DataModellingLabKind => kind.startsWith('data-');
const word = (mode: LanguageMode, s: LocalizedText) =>
  mode === 'en' ? s.en : s.zh;
const number = (value: string): AnswerSpec => ({ kind: 'number', value });
const code = (value: DataCode): AnswerSpec => ({ kind: 'data-code', value });
const derived = (
  value: ReturnType<typeof zScore>,
  empty: DataCode = 'undefined',
): AnswerSpec => (value === null ? code(empty) : number(textR(value)));
function Select({
  mode,
  name,
  value,
  values,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: string;
  values: [string, LocalizedText][];
  change: (s: string) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <select
        aria-label={word(mode, name)}
        value={value}
        onChange={(e) => change(e.target.value)}
      >
        {values.map(([v, s]) => (
          <option key={v} value={v}>
            {word(mode, s)}
          </option>
        ))}
      </select>
    </label>
  );
}
const options = (v: string[]): [string, LocalizedText][] =>
  v.map((x) => [x, t(x, x)]);
function Prediction({
  mode,
  name,
  answer,
  hint,
  derivation,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  answer: AnswerSpec;
  hint: LocalizedText;
  derivation: LocalizedText;
}) {
  const [value, setValue] = useState(''),
    [checked, setChecked] = useState(false),
    [show, setShow] = useState(false),
    correct = checkAnswer(value, answer);
  return (
    <div className="math-concept-task">
      <label>
        <Text mode={mode} text={name} />
        <input
          aria-label={word(mode, name)}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
            setShow(false);
          }}
        />
      </label>
      <button
        className="math-button"
        aria-label={word(mode, t(`核对：${name.zh}`, `Check: ${name.en}`))}
        onClick={() => setChecked(true)}
      >
        <Text mode={mode} text={t('核对预测', 'Check prediction')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={word(mode, t(`${name.zh}反馈`, `${name.en} feedback`))}
        >
          <Text
            mode={mode}
            text={
              correct
                ? t(
                    '预测符合。再说明记录、分母、单位与推断范围。',
                    'The prediction matches. Explain records, divisor, units and inference scope.',
                  )
                : hint
            }
          />
        </p>
      )}
      {checked && !correct && (
        <button className="math-button" onClick={() => setShow(true)}>
          <Text mode={mode} text={t('查看推导', 'Reveal derivation')} />
        </button>
      )}
      {show && (
        <p>
          <Text mode={mode} text={derivation} />
        </p>
      )}
    </div>
  );
}
function Audit({
  mode,
  reveal,
  setReveal,
}: {
  mode: LanguageMode;
  reveal: boolean;
  setReveal: (v: boolean) => void;
}) {
  return (
    <button
      className="math-button"
      aria-expanded={reveal}
      onClick={() => setReveal(!reveal)}
    >
      <Text mode={mode} text={t('显示/隐藏核验', 'Show/hide audit')} />
    </button>
  );
}
function CleaningLab({ mode }: { mode: LanguageMode }) {
  const [corrected, setCorrected] = useState(false),
    [variable, setVariable] = useState('colour'),
    [reveal, setReveal] = useState(false),
    a = cleaningAudit(corrected),
    types: Record<string, DataCode> = {
      colour: 'nominal',
      rating: 'ordinal',
      count: 'discrete',
      length: 'continuous',
    };
  const issue: Record<string, LocalizedText> = {
    duplicate: t(
      '同ID重复导入，不再计数',
      'Same ID imported twice: count once',
    ),
    missing: t('长度缺失，不能填0', 'Length missing: do not fill with zero'),
    invalid: t(
      '长度负值待核；件数仍有效',
      'Negative length under review; count remains valid',
    ),
    'source-pending': t(
      '来源已核为20 cm，尚未采用',
      'Source confirms 20 cm; correction not applied',
    ),
    usable: t('该字段可分析', 'Field usable'),
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '虚构纸卡记录。R2是同一记录重复导入，不是两个同值个体；R5原始200 cm经给定来源确认为20 cm。保留原值与改动理由；R4长度无效不抹掉它有效的件数。',
            'Fictional card records. Repeated R2 is the same imported record, not two equal-valued individuals. The supplied source confirms R5 was 20 cm, not its recorded 200 cm. Retain originals and reasons; invalid length does not erase a valid count.',
          )}
        />
      </p>
      <DataTable
        mode={mode}
        name={t('原始记录与审计轨迹', 'Original records and audit trail')}
        headers={[
          t('记录', 'Record'),
          t('颜色', 'Colour'),
          t('件数', 'Count'),
          t('原长度', 'Original length'),
          t('统一cm', 'In cm'),
          t('字段处理', 'Field decision'),
        ]}
        rows={a.rows.map((r) => [
          `${r.entry}/${r.id}`,
          r.colour,
          r.count,
          r.length === null ? '—' : `${r.length} ${r.unit}`,
          r.cm === null ? '—' : textR(r.cm),
          word(mode, issue[r.issue]!),
        ])}
      />
      <button
        className="math-button"
        aria-pressed={corrected}
        onClick={() => setCorrected(!corrected)}
      >
        <Text
          mode={mode}
          text={t('采用/撤回来源修正', 'Apply/revert source correction')}
        />
      </button>
      {!corrected && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              '当前平均数仅作原编码对照，含已知未修正错误，不能当最终结论。',
              'The current mean is only an unreconciled coding comparison containing a known error, not the final conclusion.',
            )}
          />
        </p>
      )}
      <Select
        mode={mode}
        name={t('待分类变量', 'Variable to classify')}
        value={variable}
        values={[
          ['colour', t('颜色（无顺序）', 'Colour (unordered)')],
          [
            'rating',
            t('满意等级（低、中、高）', 'Satisfaction (low, medium, high)'),
          ],
          ['count', t('件数', 'Number of items')],
          [
            'length',
            t('长度（四舍五入记录）', 'Length (recorded after rounding)'),
          ],
        ]}
        change={setVariable}
      />
      <Prediction
        key={variable}
        mode={mode}
        name={t('预测变量类型', 'Predict variable type')}
        answer={code(types[variable]!)}
        hint={t(
          '先分数值/类别；类别是否有顺序，数值是计数还是测量？',
          'First separate categories from numerical quantities, then order, count or measurement.',
        )}
        derivation={t(
          `本变量为${types[variable]}。测量四舍五入后仍是连续型变量。`,
          `This variable is ${types[variable]}. Rounding a measurement does not change its underlying continuous type.`,
        )}
      />
      <Prediction
        mode={mode}
        name={t('预测不同记录数', 'Predict distinct record count')}
        answer={number('6')}
        hint={t(
          '按身份而非数值去重，只将重复导入的R2合并。',
          'Deduplicate identities, not equal values; merge only the repeated R2 import.',
        )}
        derivation={t(
          '7行中R2重复一次，6个不同记录。',
          'Seven rows include R2 twice: six distinct records.',
        )}
      />
      <Prediction
        key={String(corrected)}
        mode={mode}
        name={t('预测当前长度均值（cm）', 'Predict current length mean (cm)')}
        answer={number(textR(a.summary.mean))}
        hint={t(
          '先统一单位、合并重复ID，长度缺失/负值不入长度分母；再查来源修正。',
          'Convert units and merge duplicate IDs. Missing/negative lengths do not enter the length denominator; check source corrections.',
        )}
        derivation={t(
          `四个数${a.values.join('、')}，均值${textR(a.summary.mean)} cm。`,
          `The four values ${a.values.join(', ')} average ${textR(a.summary.mean)} cm.`,
        )}
      />
      <Audit mode={mode} reveal={reveal} setReveal={setReveal} />
      {reveal && (
        <p>
          <Text
            mode={mode}
            text={t(
              `唯一记录6，重复导入1；长度缺失1、无效1、可计算4。来源${corrected ? '已' : '未'}采用，均值${textR(a.summary.mean)} cm。真实0件不能填成缺失；相同20 cm的两条记录均保留。`,
              `Six unique records, one duplicate import; lengths: one missing, one invalid, four numerically usable. Source correction ${corrected ? 'applied' : 'not applied'}; mean ${textR(a.summary.mean)} cm. A genuine count of zero is not missing; two distinct records at 20 cm both remain.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function ShapeLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState('0'),
    [width, setWidth] = useState('1'),
    [reveal, setReveal] = useState(false),
    s = shapeCases[Number(index)]!,
    a = dataSummary(s.values);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '比较同一原始数据的逐点图与不同等宽分组。偏态按长尾方向命名，不按柱子多数在哪边；对称可有两个峰，不保证正态。均值等于中位数也不保证对称。',
            'Compare individual observations with different equal-width bins of the same data. Skew is named for the long tail, not the crowded side. Symmetry can have two peaks and does not establish normality. Equal mean and median do not establish symmetry.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('分布案例', 'Distribution case')}
        value={index}
        values={shapeCases.map((s, i) => [
          String(i),
          t(`记录组${i + 1}`, `Record set ${i + 1}`),
        ])}
        change={setIndex}
      />
      <p>{s.values.join(', ')}</p>
      <Select
        mode={mode}
        name={t('直方图组距', 'Histogram bin width')}
        value={width}
        values={options(['1', '2', '4'])}
        change={setWidth}
      />
      <Prediction
        key={index}
        mode={mode}
        name={t('预测形状代码', 'Predict shape code')}
        answer={code(s.shape)}
        hint={t(
          '比较尾部伸展、镜像和峰数；不要仅比较均值与中位数。',
          'Compare tail extent, mirror pairs and peaks, not only mean versus median.',
        )}
        derivation={t(
          `此构造例的形状为${s.shape}；请用原始点给证据。`,
          `This constructed example is ${s.shape}; justify it using the individual observations.`,
        )}
      />
      <Prediction
        key={`mean${index}`}
        mode={mode}
        name={t('预测均值', 'Predict mean')}
        answer={number(textR(a.mean))}
        hint={t(
          '保留每次重复出现，原数据总和除以观测数。',
          'Keep repeated observations; divide the original total by the observation count.',
        )}
        derivation={t(
          `n=${a.n}，均值${textR(a.mean)}。`,
          `n=${a.n}, mean=${textR(a.mean)}.`,
        )}
      />
      <Prediction
        key={`median${index}`}
        mode={mode}
        name={t('预测中位数', 'Predict median')}
        answer={number(textR(a.median))}
        hint={t(
          '先排序；偶数个时取中间两项的平均。',
          'Order values; with even n, average the two middle observations.',
        )}
        derivation={t(
          `排序后中位数${textR(a.median)}。`,
          `The ordered middle gives ${textR(a.median)}.`,
        )}
      />
      <Audit mode={mode} reveal={reveal} setReveal={setReveal} />
      <ShapeFigure
        mode={mode}
        values={s.values}
        width={Number(width)}
        reveal={reveal}
      />
    </>
  );
}
function SpreadLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState('0'),
    [scale, setScale] = useState('1'),
    [shift, setShift] = useState('0'),
    [convention, setConvention] = useState<'population' | 'sample'>(
      'population',
    ),
    [reveal, setReveal] = useState(false),
    values = transformData(spreadCases[Number(index)]!, scale, shift),
    s = dataSummary(values, convention),
    spreadKey = `${index}/${Math.abs(Number(scale))}/${convention}`;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '总体模式把列出的数当完整有限总体，方差除以n；样本模式用n−1估计总体方差；独立同分布且有限方差时该方差估计无偏，标准差本身不因此无偏。不把这两种约定混用。输入精确根式，如sqrt(2)，不填近似小数。',
            'Population mode describes the entire listed finite population, dividing variance by n. Sample mode uses n−1 for variance estimation; for independent identically distributed observations with finite variance this is unbiased for variance, not for SD. Keep the conventions distinct. Enter exact roots such as sqrt(2), not approximations.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('离散程度案例', 'Spread case')}
        value={index}
        values={[
          ['0', t('2,4,4,6', '2,4,4,6')],
          ['1', t('全部为4', 'All fours')],
          ['2', t('只有一个4', 'One observation: 4')],
          ['3', t('尾部变为14', 'Tail becomes 14')],
        ]}
        change={setIndex}
      />
      <Select
        mode={mode}
        name={t('同乘因子', 'Common scale factor')}
        value={scale}
        values={options(['1', '2', '-1'])}
        change={setScale}
      />
      <Select
        mode={mode}
        name={t('同加常数', 'Common shift')}
        value={shift}
        values={options(['0', '10'])}
        change={setShift}
      />
      <Select
        mode={mode}
        name={t('方差分母约定', 'Variance divisor convention')}
        value={convention}
        values={[
          ['population', t('总体：n', 'Population: n')],
          ['sample', t('样本：n−1', 'Sample: n−1')],
        ]}
        change={(v) => setConvention(v as 'population' | 'sample')}
      />
      <p>{values.join(', ')}</p>
      <Prediction
        key={`mean/${index}/${scale}/${shift}`}
        mode={mode}
        name={t('预测均值', 'Predict mean')}
        answer={number(textR(s.mean))}
        hint={t(
          '先求均值，再对每项减去同一个均值。',
          'Find the mean before subtracting that same mean from every observation.',
        )}
        derivation={t(`均值${textR(s.mean)}。`, `Mean=${textR(s.mean)}.`)}
      />
      <Prediction
        key={`ss/${index}/${Math.abs(Number(scale))}`}
        mode={mode}
        name={t('预测离均差平方和', 'Predict squared deviation sum')}
        answer={number(textR(s.ss))}
        hint={t(
          '先减均值再平方后相加；带符号离差和为零不能代替平方和。',
          'Subtract the mean, square each deviation, then sum. A zero signed sum is not the squared sum.',
        )}
        derivation={t(
          `平方贡献${s.squares.map(textR).join('+')}=${textR(s.ss)}。`,
          `Squared contributions ${s.squares.map(textR).join('+')}=${textR(s.ss)}.`,
        )}
      />
      <Prediction
        key={`sd/${spreadKey}`}
        mode={mode}
        name={t(
          '预测标准差（精确；无定义写undefined）',
          'Predict SD (exact; undefined if needed)',
        )}
        answer={
          s.variance === null
            ? code('undefined')
            : { kind: 'radical', value: `sqrt(${textR(s.variance)})` }
        }
        hint={t(
          '平方和除以所选分母后开非负平方根；n−1为零时无定义。',
          'Divide the squared sum by the stated divisor, then take the nonnegative square root. A zero n−1 divisor is undefined.',
        )}
        derivation={t(
          s.variance === null
            ? '单个观测无法用样本n−1估计，分母为0。'
            : `方差${textR(s.variance)}，标准差sqrt(${textR(s.variance)})。`,
          s.variance === null
            ? 'A single observation has sample divisor zero.'
            : `Variance=${textR(s.variance)}; SD=sqrt(${textR(s.variance)}).`,
        )}
      />
      <Audit mode={mode} reveal={reveal} setReveal={setReveal} />
      <DeviationFigure mode={mode} values={values} reveal={reveal} />
      {reveal && (
        <DataTable
          mode={mode}
          headers={[t('x', 'x'), t('x−均值', 'x−mean'), t('平方', 'Square')]}
          rows={s.values.map((v, i) => [
            textR(v),
            textR(s.deviations[i]!),
            textR(s.squares[i]!),
          ])}
        />
      )}
    </>
  );
}
function StandardLab({ mode }: { mode: LanguageMode }) {
  const [a, setA] = useState('70'),
    [b, setB] = useState('85'),
    [constant, setConstant] = useState(false),
    [converted, setConverted] = useState(false),
    [reveal, setReveal] = useState(false),
    za = zScore(a, '50', '10'),
    zb = zScore(b, '80', constant ? '0' : '5'),
    convert = (x: string) => (converted ? String(10 * Number(x) + 100) : x);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '参照A为完整总体40,40,60,60（μ=50,σ=10），B为75,75,85,85（μ=80,σ=5）；待比较观测另给，不加入参照重新计算。切换B为80,80,80,80时σ=0。较大z只表示相对位置更高，未规定“更好”。',
            'Reference A is the finite population 40,40,60,60 (μ=50,σ=10); B is 75,75,85,85 (μ=80,σ=5). Separate observations are compared without recomputing these references. The alternative B reference is 80,80,80,80 with σ=0. A larger z indicates a higher relative position, not an unspecified notion of better.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('A的待比较观测', 'Observation A')}
        value={a}
        values={options(['40', '50', '70'])}
        change={setA}
      />
      <Select
        mode={mode}
        name={t('B的待比较观测', 'Observation B')}
        value={b}
        values={options(['75', '80', '85', '90'])}
        change={setB}
      />
      <button
        className="math-button"
        aria-pressed={constant}
        onClick={() => setConstant(!constant)}
      >
        <Text
          mode={mode}
          text={t('切换B参照的零波动', 'Toggle zero spread in reference B')}
        />
      </button>
      <button
        className="math-button"
        aria-pressed={converted}
        onClick={() => setConverted(!converted)}
      >
        <Text
          mode={mode}
          text={t('切换单位x′=10x+100', 'Change units: x′=10x+100')}
        />
      </button>
      <p>
        A: x={convert(a)}, μ={convert('50')}, σ={converted ? '100' : '10'}; B:
        x={convert(b)}, μ={convert('80')}, σ=
        {constant ? '0' : converted ? '50' : '5'}
      </p>
      <Prediction
        key={`A${a}`}
        mode={mode}
        name={t('预测A的z', 'Predict z for A')}
        answer={derived(za)}
        hint={t(
          '先用待比较值减参照均值，再除参照标准差；保留正负。',
          'Subtract the reference mean from the observation, then divide by the reference SD; retain the sign.',
        )}
        derivation={t(
          `(${a}−50)/10=${textR(za!)}。`,
          `(${a}−50)/10=${textR(za!)}.`,
        )}
      />
      <Prediction
        key={`B${b}/${constant}`}
        mode={mode}
        name={t(
          '预测B的z（无定义写undefined）',
          'Predict z for B (undefined if needed)',
        )}
        answer={derived(zb)}
        hint={t(
          '标准差为0时不能标准化；即使x=μ也不能将0/0写0。',
          'A zero SD cannot standardize; even x=μ gives 0/0, not z=0.',
        )}
        derivation={t(
          zb === null ? '分母0，无定义。' : `(${b}−80)/5=${textR(zb)}。`,
          zb === null
            ? 'The denominator is zero: undefined.'
            : `(${b}−80)/5=${textR(zb)}.`,
        )}
      />
      <Audit mode={mode} reveal={reveal} setReveal={setReveal} />
      {reveal && <StandardFigure mode={mode} a={za} b={zb} />}
    </>
  );
}
function RegressionLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState('0'),
    [a, setA] = useState('1'),
    [b, setB] = useState('1'),
    [query, setQuery] = useState('2'),
    [residuals, setResiduals] = useState(false),
    [reveal, setReveal] = useState(false),
    rows = regressionCases[Number(index)]!.rows,
    fit = leastSquares(rows),
    candidate = candidateFit(rows, a, b),
    predicted = regressionPrediction(rows, query),
    scope = predictionScope(rows, query);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '所有点为虚构成对记录，不代表因果。比较候选ŷ=a+bx的竖直残差平方和，再揭示含截距的最小二乘线。x全相同时斜率不唯一，但该x处最佳共同拟合值仍是y均值；范围内预测也不保证可靠。',
            'All points are fictional paired records and do not establish causation. Compare vertical squared residuals for candidate ŷ=a+bx, then reveal the least-squares line with an intercept. Constant x does not identify a slope, but its best common fitted value is still mean y. In-range prediction is not a reliability guarantee.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('配对案例', 'Paired case')}
        value={index}
        values={regressionCases.map((r, i) => [
          String(i),
          t(
            [
              '上升散点',
              '下降散点',
              'y恒定',
              'x恒定',
              '弯曲关系',
              '新增有效远点',
            ][i]!,
            [
              'Rising scatter',
              'Falling scatter',
              'Constant y',
              'Constant x',
              'Curved relationship',
              'Additional valid distant point',
            ][i]!,
          ),
        ])}
        change={setIndex}
      />
      <DataTable
        mode={mode}
        name={t('原始成对观测', 'Original paired observations')}
        headers={[t('记录', 'Record'), t('x', 'x'), t('y', 'y')]}
        rows={rows.map((r) => [r.id, r.x, r.y])}
      />
      <Select
        mode={mode}
        name={t('候选截距a', 'Candidate intercept a')}
        value={a}
        values={options(['0', '1', '4', '7'])}
        change={setA}
      />
      <Select
        mode={mode}
        name={t('候选斜率b', 'Candidate slope b')}
        value={b}
        values={options(['-1.5', '0', '1', '1.5', '2'])}
        change={setB}
      />
      <Select
        mode={mode}
        name={t('查询x', 'Query x')}
        value={query}
        values={options(['2', '4', '7'])}
        change={setQuery}
      />
      <Prediction
        key={`sse/${index}/${a}/${b}`}
        mode={mode}
        name={t(
          '预测候选线残差平方和',
          'Predict candidate residual sum of squares',
        )}
        answer={number(textR(candidate.sse))}
        hint={t(
          '对每对数据用同一x算ŷ；求y−ŷ，平方后求和。正负不能抵消。',
          'At each observed x compute ŷ, then y−ŷ. Square before summing so signs cannot cancel.',
        )}
        derivation={t(
          `各残差${candidate.rows.map((r) => textR(r.residual)).join('、')}，平方和${textR(candidate.sse)}。`,
          `Residuals ${candidate.rows.map((r) => textR(r.residual)).join(', ')}; squared sum=${textR(candidate.sse)}.`,
        )}
      />
      <Prediction
        key={`slope/${index}`}
        mode={mode}
        name={t(
          '预测最小二乘斜率（不唯一写not-identified）',
          'Predict least-squares slope (not-identified if nonunique)',
        )}
        answer={derived(fit.slope, 'not-identified')}
        hint={t(
          '比较平方和而非穿过最多点；x无变化时不能唯一求斜率。',
          'Minimize squared vertical residuals, not the number of points missed. With no x variation, slope is not unique.',
        )}
        derivation={t(
          fit.slope === null
            ? 'Sxx=0，许多a+bx在同一x给同样最优均值，斜率不唯一。'
            : `Sxy/Sxx=${textR(fit.sxy)}/${textR(fit.sxx)}=${textR(fit.slope)}。`,
          fit.slope === null
            ? 'Sxx=0: many intercept/slope pairs give the same best common fitted value.'
            : `Sxy/Sxx=${textR(fit.sxy)}/${textR(fit.sxx)}=${textR(fit.slope)}.`,
        )}
      />
      <Prediction
        key={`pred/${index}/${query}`}
        mode={mode}
        name={t(
          '预测最小二乘线的ŷ（不能确定写not-identified）',
          'Predict least-squares fitted y (not-identified if needed)',
        )}
        answer={derived(predicted, 'not-identified')}
        hint={t(
          '用拟合线，不直接抄某个观测y；常数x例在原x外不能唯一预测。',
          'Use the fitted model, not a single observed y. With constant x, prediction away from that x is not identified.',
        )}
        derivation={t(
          predicted === null
            ? '无唯一斜率，原x以外无唯一拟合值。'
            : `x=${query}时ŷ=${textR(predicted)}；这不是必然观测值。`,
          predicted === null
            ? 'Without an identified slope, fitted values away from the observed x are nonunique.'
            : `At x=${query}, fitted y=${textR(predicted)}; this is not a guaranteed observation.`,
        )}
      />
      <Prediction
        key={`scope/${index}/${query}`}
        mode={mode}
        name={t(
          '预测内插/外推代码',
          'Predict interpolation/extrapolation code',
        )}
        answer={code(scope)}
        hint={t(
          '比较查询x与观测x的最小/最大，不按y是否落在图内判断。',
          'Compare the requested x with observed minimum/maximum x, not with the visible y range.',
        )}
        derivation={t(
          `观测x范围[${fit.minX},${fit.maxX}]，本查询为${scope}。`,
          `Observed x range [${fit.minX},${fit.maxX}]; this query is ${scope}.`,
        )}
      />
      <button
        className="math-button"
        aria-pressed={residuals}
        onClick={() => setResiduals(!residuals)}
      >
        <Text
          mode={mode}
          text={t('显示/隐藏候选残差', 'Show/hide candidate residuals')}
        />
      </button>
      <Audit mode={mode} reveal={reveal} setReveal={setReveal} />
      <RegressionFigure
        mode={mode}
        rows={rows}
        intercept={a}
        slope={b}
        reveal={reveal}
        residuals={residuals}
      />
      {reveal && (
        <>
          <p>
            {fit.slope === null
              ? (mode === 'en'
                  ? 'Slope nonunique; fitted value at the common x'
                  : '斜率不唯一；原x处拟合值') + `=${textR(fit.my)}`
              : `ŷ=${textR(fit.intercept!)}+(${textR(fit.slope)})x; SSE=${textR(fit.sse)}`}
          </p>
          <DataTable
            mode={mode}
            headers={[
              t('记录', 'Record'),
              t('候选ŷ', 'Candidate ŷ'),
              t('候选残差', 'Candidate residual'),
              t('最优ŷ', 'Best fitted y'),
              t('最优残差', 'Best residual'),
            ]}
            rows={candidate.rows.map((r, i) => [
              r.id,
              textR(r.predicted),
              textR(r.residual),
              textR(fit.rows[i]!.predicted),
              textR(fit.rows[i]!.residual),
            ])}
          />
        </>
      )}
    </>
  );
}
export function DataModellingLab({
  kind,
  mode,
}: {
  kind: DataModellingLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-concept-lab">
      {kind === 'data-cleaning' ? (
        <CleaningLab mode={mode} />
      ) : kind === 'data-shape' ? (
        <ShapeLab mode={mode} />
      ) : kind === 'data-spread' ? (
        <SpreadLab mode={mode} />
      ) : kind === 'data-standard' ? (
        <StandardLab mode={mode} />
      ) : (
        <RegressionLab mode={mode} />
      )}
    </div>
  );
}
export function DataModellingHookArt({
  kind,
  mode,
}: {
  kind: DataModellingLabKind;
  mode: LanguageMode;
}) {
  if (kind === 'data-cleaning')
    return (
      <DataTable
        mode={mode}
        headers={[t('记录', 'Record'), t('长度', 'Length')]}
        rows={[
          ['R1', '20 cm'],
          ['R2', '200 mm'],
          ['R3', '—'],
          ['R2', '200 mm'],
        ]}
      />
    );
  if (kind === 'data-shape')
    return (
      <ShapeFigure
        mode={mode}
        values={shapeCases[0]!.values}
        width={1}
        reveal={false}
      />
    );
  if (kind === 'data-spread')
    return <DeviationFigure mode={mode} values={['1', '3']} reveal={false} />;
  if (kind === 'data-standard')
    return (
      <p>
        <Text
          mode={mode}
          text={t(
            'A：70（均值50，标准差10）；B：85（均值80，标准差5）。',
            'A: 70 (mean 50, SD 10); B: 85 (mean 80, SD 5).',
          )}
        />
      </p>
    );
  return (
    <RegressionFigure
      mode={mode}
      rows={regressionCases[0]!.rows}
      intercept="1"
      slope="1"
      reveal={false}
      residuals={true}
    />
  );
}
