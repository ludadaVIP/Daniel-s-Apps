import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type Lesson, type AnswerSpec } from './model';
import { Text } from './ui';
import { textR } from './algebraModels';
import { roundTrig } from './trigModels';
import {
  rectangleLink,
  integrationGraph,
  strategyCases,
  tryStrategy,
  auditCases,
  rampModel,
  rampReport,
  parseRampDraft,
  RAMP_DRAFT_KEY,
  defaultRamp,
  type RampParams,
  type IntegrationGraphKind,
  type StrategyKind,
} from './integrationModels';
import {
  RectangleLinkView,
  IntegrationGraphView,
  RampView,
} from './IntegrationVisuals';
export type IntegrationLabKind = Extract<
  Lesson['lab'],
  `integration-${string}`
>;
export const isIntegrationLab = (
  kind: Lesson['lab'],
): kind is IntegrationLabKind => kind.startsWith('integration-');
const word = (mode: LanguageMode, v: LocalizedText) =>
  mode === 'en' ? v.en : v.zh;
function Task({
  mode,
  answer,
  prompt,
  name = t('我的联结结论', 'My integration conclusion'),
}: {
  mode: LanguageMode;
  answer: AnswerSpec;
  prompt: LocalizedText;
  name?: LocalizedText;
}) {
  const [input, setInput] = useState(''),
    [checked, setChecked] = useState(false);
  return (
    <div className="math-quadratic-task">
      <p>
        <Text mode={mode} text={prompt} />
      </p>
      <label>
        <Text mode={mode} text={name} />
        <input
          aria-label={word(mode, name)}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button
        className="math-button"
        aria-label={word(mode, t(`核对：${name.zh}`, `Check: ${name.en}`))}
        onClick={() => setChecked(true)}
      >
        <Text
          mode={mode}
          text={t('核对联结结论', 'Check integration conclusion')}
        />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={word(mode, t(`${name.zh}反馈`, `${name.en} feedback`))}
        >
          <Text
            mode={mode}
            text={
              checkAnswer(input, answer)
                ? t(
                    '结论符合。请解释结构、前提、定义域、单位及核验方法；完整理由由家长阅读。',
                    'The conclusion matches. Explain structure, premises, domain, units and checks; a parent reviews the full reasoning.',
                  )
                : t(
                    '重新核所求量、关系、条件和单位。数值看似合理不代替完整验证，证据不足也不等于结论必错。',
                    'Recheck the target, relationships, conditions and units. Plausibility does not replace verification, and insufficient evidence does not mean a claim is false.',
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
  step = 1,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: number;
  min: number;
  max: number;
  step?: number;
  change: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={name} />
      <input
        type="range"
        aria-label={word(mode, name)}
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => change(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Select({
  mode,
  name,
  value,
  options,
  change,
}: {
  mode: LanguageMode;
  name: LocalizedText;
  value: string;
  options: { value: string; text: LocalizedText }[];
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
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {word(mode, o.text)}
          </option>
        ))}
      </select>
    </label>
  );
}
function Reveal({
  mode,
  shown,
  toggle,
  children,
}: {
  mode: LanguageMode;
  shown: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <button className="math-button secondary" onClick={toggle}>
        <Text
          mode={mode}
          text={t('显示或隐藏联结核验', 'Show or hide integration audit')}
        />
      </button>
      {shown && (
        <div
          role="status"
          aria-label={word(mode, t('联结核验', 'Integration audit'))}
        >
          {children}
        </div>
      )}
    </>
  );
}
const numberAnswer = (
  value: string,
  unit?: Extract<AnswerSpec, { kind: 'number' }>['unit'],
): AnswerSpec => ({ kind: 'number', value, unit });
function GeometryLinkLab({ mode }: { mode: LanguageMode }) {
  const [x, setX] = useState(3),
    [offset, setOffset] = useState(2),
    [target, setTarget] = useState('area'),
    [shown, setShown] = useState(false),
    [small, setSmall] = useState(false),
    m = rectangleLink(String(x), offset),
    area = target === 'area';
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '把同一长方形分成正方形与长条，再连接一般式和当前数值。移动x只换实例；改变d或所求量才换一般关系。',
            'Split one rectangle into square and strip, linking a general expression to its current value. Moving x changes an instance; changing d or the target changes the general relationship.',
          )}
        />
      </p>
      <Slider
        mode={mode}
        name={t('实例的x长度', 'Instance side x')}
        value={x}
        min={1}
        max={6}
        change={setX}
      />
      <Slider
        mode={mode}
        name={t('长出的固定量d', 'Fixed extra length d')}
        value={offset}
        min={0}
        max={4}
        change={(n) => {
          setOffset(n);
          setShown(false);
        }}
      />
      <Select
        mode={mode}
        name={t('所求几何量', 'Requested geometry quantity')}
        value={target}
        options={[
          { value: 'area', text: t('面积一般式', 'General area expression') },
          {
            value: 'perimeter',
            text: t('周长一般式', 'General perimeter expression'),
          },
        ]}
        change={(v) => {
          setTarget(v);
          setShown(false);
        }}
      />
      <button
        className="math-button secondary"
        onClick={() => setSmall(!small)}
      >
        <Text
          mode={mode}
          text={t('仅改变图形显示缩放', 'Change geometry display zoom only')}
        />
      </button>
      <RectangleLinkView
        mode={mode}
        x={String(x)}
        offset={offset}
        reveal={shown}
        zoom={small ? 0.8 : 1}
      />
      <Task
        key={`${offset}:${target}`}
        mode={mode}
        answer={{
          kind: 'polynomial',
          value: area ? m.areaExpression : m.perimeterExpression,
          variables: ['x'],
          collected: true,
        }}
        prompt={t(
          '写以x表示的一般式，完成展开合并；不能用当前数值替代。',
          'Write the general expression in x, fully expanded and collected, rather than the current numerical value.',
        )}
      />
      <Task
        key={`${x}:${offset}:${target}`}
        mode={mode}
        name={t('当前实例的数值', 'Current instance value')}
        answer={numberAnswer(textR(area ? m.area : m.perimeter))}
        prompt={t(
          '另求当前实例的数值；长度同一单位，面积为平方单位。',
          'Separately calculate this instance’s value, using common length units and square units for area.',
        )}
      />
      <Reveal mode={mode} shown={shown} toggle={() => setShown(!shown)}>
        <p>
          {area
            ? `x(x+${offset}) = ${m.areaExpression}; ${textR(m.area)}`
            : `2(x+x+${offset}) = ${m.perimeterExpression}; ${textR(m.perimeter)}`}
        </p>
        <p>
          <Text
            mode={mode}
            text={t(
              '代数式对允许的每个正x成立。只验证某一个数值不是一般恒等证明。',
              'The expression holds for every permitted positive x. Checking one value does not prove a general identity.',
            )}
          />
        </p>
      </Reveal>
    </>
  );
}
function GraphLab({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<IntegrationGraphKind>('affine'),
    [query, setQuery] = useState(2),
    [wide, setWide] = useState(false),
    [alternatives, setAlternatives] = useState(false),
    [shown, setShown] = useState(false),
    m = integrationGraph(kind, String(query)),
    answer: AnswerSpec =
      kind === 'affine'
        ? {
            kind: 'polynomial',
            value: '2x+3',
            variables: ['x'],
            collected: true,
          }
        : m.domain && m.value
          ? numberAnswer(
              textR(m.value),
              kind === 'drain' ? 'L' : kind === 'count' ? 'NZD' : undefined,
            )
          : {
              kind: 'integration-verdict',
              value:
                kind === 'observations' ? 'insufficient' : 'outside-domain',
            };
  return (
    <>
      <Select
        mode={mode}
        name={t('图像模型来源', 'Graph model source')}
        value={kind}
        options={[
          {
            value: 'affine',
            text: t(
              '明确给一次函数与两点',
              'Affine rule explicitly given with two points',
            ),
          },
          {
            value: 'drain',
            text: t(
              '给完整分段直线水量图',
              'Full piecewise-linear water trace given',
            ),
          },
          {
            value: 'count',
            text: t('整数卡数与费用规则', 'Integer card counts and cost rule'),
          },
          {
            value: 'observations',
            text: t('只给两个观测点', 'Only two observed points'),
          },
        ]}
        change={(v) => {
          setKind(v as IntegrationGraphKind);
          setQuery(v === 'drain' ? 4 : 2);
          setShown(false);
          setAlternatives(false);
        }}
      />
      <Slider
        mode={mode}
        name={t('查询的输入', 'Queried input')}
        value={query}
        min={0}
        max={
          kind === 'drain'
            ? 9
            : kind === 'count'
              ? 5
              : kind === 'affine'
                ? 4
                : 3
        }
        step={0.5}
        change={(n) => {
          setQuery(n);
          setShown(false);
        }}
      />
      <button className="math-button secondary" onClick={() => setWide(!wide)}>
        <Text
          mode={mode}
          text={t('仅改变坐标视窗', 'Change graph window only')}
        />
      </button>
      {kind === 'observations' && (
        <button
          className="math-button secondary"
          onClick={() => setAlternatives(!alternatives)}
        >
          <Text
            mode={mode}
            text={t('显示两种可行延伸', 'Show two possible extensions')}
          />
        </button>
      )}
      <IntegrationGraphView
        mode={mode}
        kind={kind}
        query={String(query)}
        wide={wide}
        alternatives={alternatives}
      />
      <Task
        key={kind === 'affine' ? kind : `${kind}:${query}`}
        mode={mode}
        answer={answer}
        prompt={
          kind === 'affine'
            ? t(
                '题目明确一次函数，写y右侧的一般式，用x并完成合并。',
                'An affine function is explicitly supplied. Enter its general right side in x, collected.',
              )
            : m.domain
              ? t(
                  `按已给规则求输入${query}对应的量；保留正确单位。`,
                  `Use the supplied rule to find the quantity at input ${query}, with the correct units.`,
                )
              : kind === 'observations'
                ? t(
                    '没有足够规则，写insufficient/证据不足。',
                    'No sufficient rule is supplied; enter insufficient.',
                  )
                : t(
                    '输入不属于已给定义域，写outside-domain/不在定义域。',
                    'The input is outside the supplied domain; enter outside-domain.',
                  )
        }
      />
      <Reveal mode={mode} shown={shown} toggle={() => setShown(!shown)}>
        <p>
          <Text
            mode={mode}
            text={
              kind === 'affine'
                ? t(
                    '斜率(11−3)/(4−0)=2，截距3，y=2x+3，定义域0–4；移动查询点不改变一般式。',
                    'Slope (11−3)/(4−0)=2 and intercept three give y=2x+3 on 0–4. Moving the query does not change this general expression.',
                  )
                : kind === 'observations'
                  ? t(
                      'f=x与f=x²都经过两个观测点，在2处分别2与4。缺少规则时不能宣布唯一延伸。',
                      'Both f=x and f=x² pass through the observations but give two and four at two. Missing rules do not establish a unique extension.',
                    )
                  : kind === 'count' && !m.domain
                    ? t(
                        '代数式可代小数，不代表半张卡实际允许；先核计数定义域。',
                        'Substitution into an expression does not authorise half a card; check the count domain first.',
                      )
                    : t(
                        `按有效段/点得到${m.value ? textR(m.value) : '—'}，不能把整个过程强套一条直线。`,
                        `The valid segment/point gives ${m.value ? textR(m.value) : '—'}; do not force the whole process onto one line.`,
                      )
            }
          />
        </p>
      </Reveal>
    </>
  );
}
function StrategyExperiment({
  mode,
  kind,
}: {
  mode: LanguageMode;
  kind: StrategyKind;
}) {
  const [history, setHistory] = useState<string[]>([]),
    [selected, setSelected] = useState('target'),
    [message, setMessage] = useState(''),
    [draft, setDraft] = useState(''),
    [shown, setShown] = useState(false),
    s = strategyCases[kind];
  return (
    <>
      <p>
        <Text mode={mode} text={t(s.zh, s.en)} />
      </p>
      <Select
        mode={mode}
        name={t('下一步策略卡', 'Next strategy card')}
        value={selected}
        options={s.cards.map((c) => ({ value: c.id, text: t(c.zh, c.en) }))}
        change={setSelected}
      />
      <button
        className="math-button"
        onClick={() => {
          const r = tryStrategy(kind, history, selected);
          if (r.valid) setHistory(r.history);
          setMessage(r.valid ? 'accepted' : r.reason);
        }}
      >
        <Text
          mode={mode}
          text={t('尝试连接这一步', 'Try this strategy step')}
        />
      </button>
      {message && (
        <p
          role="status"
          aria-label={word(mode, t('策略步骤反馈', 'Strategy step feedback'))}
        >
          <Text
            mode={mode}
            text={
              message === 'accepted'
                ? t(
                    '这一步的依赖已具备。',
                    'The dependencies for this step are established.',
                  )
                : message === 'missing'
                  ? t(
                      '先建立所需关系或数量，不能直接使用结论。',
                      'Establish the required relationships or quantities before using this conclusion.',
                    )
                  : message === 'duplicate'
                    ? t(
                        '这一步已在方案里。',
                        'This step is already in the plan.',
                      )
                    : t(
                        '这张卡把不同量或权重混淆，不能加入。',
                        'This card confuses quantities or weights and cannot be added.',
                      )
            }
          />
        </p>
      )}
      <ol className="math-integration-plan">
        {history.map((id) => (
          <li key={id}>
            <Text
              mode={mode}
              text={t(
                s.cards.find((c) => c.id === id)!.zh,
                s.cards.find((c) => c.id === id)!.en,
              )}
            />
          </li>
        ))}
      </ol>
      <button
        className="math-button secondary"
        disabled={!history.length}
        onClick={() => {
          setHistory(history.slice(0, -1));
          setMessage('');
        }}
      >
        <Text mode={mode} text={t('撤回上一步', 'Undo the last step')} />
      </button>
      <Task
        mode={mode}
        answer={numberAnswer(s.answer, s.unit)}
        prompt={t(
          '最后回答题目真正所求的量。卡片合法不代替完整解释。',
          'Finally answer the actual target quantity. Valid cards do not replace a full explanation.',
        )}
      />
      <label>
        <Text
          mode={mode}
          text={t(
            '临时方案草稿（离开工作台不保存）',
            'Temporary plan draft (not saved after leaving this lab)',
          )}
        />
        <textarea
          aria-label={word(mode, t('临时方案草稿', 'Temporary plan draft'))}
          value={draft}
          maxLength={3000}
          onChange={(e) => setDraft(e.target.value)}
        />
      </label>
      <Reveal mode={mode} shown={shown} toggle={() => setShown(!shown)}>
        <p>
          <Text
            mode={mode}
            text={t(
              '关系→方法→数学结果→情境筛选→原题目标。数值题与完整理由分别核验；两条无依赖的支线可以换序。',
              'Relationship → method → mathematical result → context filter → original target. Check the value and full argument separately; independent preparatory branches can exchange order.',
            )}
          />
        </p>
      </Reveal>
    </>
  );
}
function StrategyLab({ mode }: { mode: LanguageMode }) {
  const [kind, setKind] = useState<StrategyKind>('garden');
  return (
    <>
      <Select
        mode={mode}
        name={t('混合题任务', 'Mixed problem task')}
        value={kind}
        options={(Object.keys(strategyCases) as StrategyKind[]).map((v) => ({
          value: v,
          text: t(strategyCases[v].zh, strategyCases[v].en),
        }))}
        change={(v) => setKind(v as StrategyKind)}
      />
      <StrategyExperiment key={kind} kind={kind} mode={mode} />
    </>
  );
}
function AuditLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [shown, setShown] = useState(false),
    [alternatives, setAlternatives] = useState(false),
    c = auditCases[index]!,
    repair: AnswerSpec =
      c.repair === 'roots'
        ? { kind: 'root-set', radicand: '9', value: '±3' }
        : c.repair === 'angle'
          ? { kind: 'trig-rounded', value: '36.9', places: 1, unit: '°' }
          : c.repair === 'area'
            ? numberAnswer('15', 'm²')
            : c.repair === 'speed'
              ? numberAnswer('24/5', 'km/h')
              : { kind: 'root-length', value: '5', square: '25' };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '区分已被反例推翻、现有证据不足、已经按前提核验。看似合理只是筛查，不能代替证明。',
            'Distinguish a refuted claim, insufficient evidence and a verified claim. Plausibility is a screening check, not a proof.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('待核的答案主张', 'Answer claim to audit')}
        value={String(index)}
        options={auditCases.map((c, i) => ({
          value: String(i),
          text: t(c.zh, c.en),
        }))}
        change={(v) => {
          setIndex(Number(v));
          setShown(false);
          setAlternatives(false);
        }}
      />
      <blockquote>
        <Text mode={mode} text={t(c.zh, c.en)} />
      </blockquote>
      {c.repair === 'none' && (
        <>
          <button
            className="math-button secondary"
            onClick={() => setAlternatives(!alternatives)}
          >
            <Text
              mode={mode}
              text={t(
                '仅显示另一种满足观测的延伸',
                'Show another observation-compatible extension only',
              )}
            />
          </button>
          <IntegrationGraphView
            mode={mode}
            kind="observations"
            query="2"
            alternatives={alternatives}
          />
        </>
      )}
      <Task
        key={index}
        mode={mode}
        answer={{ kind: 'integration-verdict', value: c.verdict }}
        prompt={t(
          '写valid/已核验、invalid/错误或insufficient/证据不足。',
          'Enter valid, invalid or insufficient.',
        )}
      />
      {c.repair !== 'none' && (
        <Task
          key={`${index}:repair`}
          mode={mode}
          name={t('核验后的修正量', 'Checked replacement quantity')}
          answer={repair}
          prompt={t(
            c.repair === 'roots'
              ? '写完整实根集合。'
              : c.repair === 'angle'
                ? '写坡角，恰好1位小数，单位度。'
                : c.repair === 'area'
                  ? '另求面积数值，单位m²。'
                  : c.repair === 'speed'
                    ? '另求全程平均速度，单位km/h。'
                    : '另写非负精确斜边长度，不附单位。',
            c.repair === 'roots'
              ? 'Enter the complete real root set.'
              : c.repair === 'angle'
                ? 'Enter the angle in degrees to exactly one decimal place.'
                : c.repair === 'area'
                  ? 'Enter the area value in m².'
                  : c.repair === 'speed'
                    ? 'Enter the overall average speed in km/h.'
                    : 'Enter the nonnegative exact hypotenuse length without units.',
          )}
        />
      )}
      <Reveal mode={mode} shown={shown} toggle={() => setShown(!shown)}>
        <p>
          <Text mode={mode} text={t(c.reasonZh, c.reasonEn)} />
        </p>
        <p>
          <Text
            mode={mode}
            text={t(
              '顺序核：所求对象、单位、符号与范围、全部解、原式代回、条件和证据。通过一个检查不代表全部已核验。',
              'Check target, units, signs/ranges, completeness, original substitution, premises and evidence. Passing one check does not establish all the others.',
            )}
          />
        </p>
      </Reveal>
    </>
  );
}
const checkNames = {
  height: t('高度至少0.6 m', 'Height at least 0.6 m'),
  run: t('水平距不超2.4 m', 'Horizontal run at most 2.4 m'),
  grade: t('坡度不超25%', 'Grade at most 25%'),
  area: t('单块坡面不超3 m²', 'Single inclined surface at most 3 m²'),
  budget: t('虚构坡面费用不超预算', 'Fictional surface cost within budget'),
};
const rampPresets = [
  {
    id: 'default',
    text: t(
      '默认：60/240/100 cm，预算150',
      'Default: 60/240/100 cm, budget 150',
    ),
    params: defaultRamp,
  },
  {
    id: 'wide',
    text: t('只加宽到120 cm', 'Change only width to 120 cm'),
    params: { ...defaultRamp, widthCm: 120 },
  },
  {
    id: 'narrow',
    text: t('只减宽到80 cm', 'Change only width to 80 cm'),
    params: { ...defaultRamp, widthCm: 80 },
  },
];
function RampLab({ mode }: { mode: LanguageMode }) {
  const [loaded] = useState(() => {
      try {
        const raw = localStorage.getItem(RAMP_DRAFT_KEY);
        if (raw === null)
          return { params: defaultRamp, notes: '', blocked: false };
        const v = parseRampDraft(raw);
        return v
          ? { params: v.params, notes: v.notes, blocked: false }
          : { params: defaultRamp, notes: '', blocked: true };
      } catch {
        return { params: defaultRamp, notes: '', blocked: true };
      }
    }),
    [params, setParams] = useState<RampParams>(loaded.params),
    [notes, setNotes] = useState(loaded.notes),
    [shown, setShown] = useState(false),
    [small, setSmall] = useState(false),
    [saved, setSaved] = useState(false),
    [error, setError] = useState(false),
    m = rampModel(params),
    key = JSON.stringify(params);
  const change = (k: keyof RampParams, n: number) => {
    setParams({ ...params, [k]: n });
    setShown(false);
    setSaved(false);
  };
  const save = () => {
    try {
      localStorage.setItem(
        RAMP_DRAFT_KEY,
        JSON.stringify({ version: 1, params, notes }),
      );
      setSaved(true);
      setError(false);
    } catch {
      setError(true);
    }
  };
  const download = () => {
    const report = rampReport(params, notes),
      url = URL.createObjectURL(
        new Blob([report], { type: 'text/markdown;charset=utf-8' }),
      ),
      a = document.createElement('a');
    a.href = url;
    a.download = 'J98-paper-ramp-report.md';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '纸上虚构项目：h≥0.6 m，水平r≤2.4 m，坡度h/r≤25%，单块坡面面积≤3 m²，虚构费用每m²为NZ$60且不超预算。侧面直角是给定，宽w与侧面垂直；这些是练习条件，不是实际场地或施工标准。',
            'Fictional paper project: h≥0.6 m, horizontal r≤2.4 m, grade h/r≤25%, one inclined surface≤3 m², fictional rate NZ$60/m² within budget. A right-triangle side and perpendicular width w are given. These are worksheet conditions, not real facility or construction standards.',
          )}
        />
      </p>
      <Select
        mode={mode}
        name={t('纸上方案卡', 'Paper design preset')}
        value={
          rampPresets.find(
            (p) =>
              p.params.riseCm === params.riseCm &&
              p.params.runCm === params.runCm &&
              p.params.widthCm === params.widthCm &&
              p.params.budget === params.budget,
          )?.id ?? 'custom'
        }
        options={[
          { value: 'custom', text: t('自行调整的参数', 'Custom parameters') },
          ...rampPresets.map((p) => ({ value: p.id, text: p.text })),
        ]}
        change={(id) => {
          const p = rampPresets.find((p) => p.id === id);
          if (p) {
            setParams({ ...p.params });
            setShown(false);
            setSaved(false);
          }
        }}
      />
      <Slider
        mode={mode}
        name={t('竖升高度cm', 'Rise in centimetres')}
        value={params.riseCm}
        min={10}
        max={150}
        change={(n) => change('riseCm', n)}
      />
      <Slider
        mode={mode}
        name={t('水平长度cm', 'Horizontal run in centimetres')}
        value={params.runCm}
        min={50}
        max={400}
        change={(n) => change('runCm', n)}
      />
      <Slider
        mode={mode}
        name={t('坡面宽度cm', 'Surface width in centimetres')}
        value={params.widthCm}
        min={40}
        max={150}
        change={(n) => change('widthCm', n)}
      />
      <Slider
        mode={mode}
        name={t('虚构预算NZD', 'Fictional budget in NZD')}
        value={params.budget}
        min={80}
        max={300}
        change={(n) => change('budget', n)}
      />
      <button
        className="math-button secondary"
        onClick={() => setSmall(!small)}
      >
        <Text
          mode={mode}
          text={t(
            '仅改变侧视图显示比例',
            'Change side-view display scale only',
          )}
        />
      </button>
      <RampView
        mode={mode}
        params={params}
        reveal={shown}
        zoom={small ? 0.8 : 1}
      />
      <Task
        key={key}
        mode={mode}
        answer={{
          kind: 'integration-verdict',
          value: m.feasible ? 'valid' : 'invalid',
        }}
        prompt={t(
          '这个方案满足全部给定纸上约束吗？满足写valid，不满足写invalid。',
          'Does this design satisfy every worksheet constraint? Enter valid or invalid.',
        )}
      />
      <Task
        key={`${params.riseCm}:${params.runCm}:length`}
        mode={mode}
        name={t('精确坡面长度', 'Exact inclined length')}
        answer={{
          kind: 'root-length',
          value: m.lengthExact,
          square: textR(m.square),
        }}
        prompt={t(
          '求斜长s，写非负精确米数，不附单位；改变宽度不改变s。',
          'Find s as a nonnegative exact length in metres, without units. Changing width does not change s.',
        )}
      />
      <Task
        key={`${params.riseCm}:${params.runCm}:${params.widthCm}:cost`}
        mode={mode}
        name={t('虚构坡面费用', 'Fictional surface cost')}
        answer={{
          kind: 'number',
          value: m.costRounded,
          unit: 'NZD',
          formats: ['decimal'],
        }}
        prompt={t(
          '按NZ$60/m²求这单块坡面费用，最后舍入到分；不包括其他部件。',
          'At NZ$60/m² find the single-surface cost, rounded finally to the nearest cent; other components are excluded.',
        )}
      />
      <Reveal mode={mode} shown={shown} toggle={() => setShown(!shown)}>
        <p>
          s²={textR(m.square)} m²; s={m.lengthExact} m; A={m.areaExact} m²;
          C=NZ${m.costExact}≈NZ${m.costRounded};{' '}
          <Text
            mode={mode}
            text={t(
              `坡度${textR(m.grade)}=${roundTrig((Number(m.grade[0]) / Number(m.grade[1])) * 100, 1)}%，坡角约${m.angleRounded}°。`,
              `Grade ${textR(m.grade)}=${roundTrig((Number(m.grade[0]) / Number(m.grade[1])) * 100, 1)}%; angle≈${m.angleRounded}°.`,
            )}
          />
        </p>
        <table className="math-integration-checks">
          <thead>
            <tr>
              <th>
                <Text
                  mode={mode}
                  text={t('纸上约束', 'Worksheet constraint')}
                />
              </th>
              <th>
                <Text
                  mode={mode}
                  text={t('精确比较结果', 'Exact comparison')}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {(Object.keys(m.checks) as (keyof typeof m.checks)[]).map((k) => (
              <tr key={k} data-ramp-constraint={k}>
                <td>
                  <Text mode={mode} text={checkNames[k]} />
                </td>
                <td>
                  <Text
                    mode={mode}
                    text={
                      m.checks[k] ? t('满足', 'Meets') : t('未满足', 'Not met')
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          <Text
            mode={mode}
            text={t(
              '均为正量，面积与费用约束先比较平方的精确有理数；不先舍入再决定是否压线满足。',
              'All quantities are positive: compare squared exact rational quantities for area and cost limits, rather than deciding a boundary from rounded displays.',
            )}
          />
        </p>
      </Reveal>
      <label>
        <Text
          mode={mode}
          text={t(
            '项目论证草稿：数量、方法、逐项约束、另一方案与局限',
            'Project argument draft: quantities, method, every constraint, another design and limitations',
          )}
        />
        <textarea
          aria-label={word(mode, t('坡道项目草稿', 'Ramp project draft'))}
          maxLength={6000}
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
            setSaved(false);
          }}
        />
      </label>
      <div className="math-integration-actions">
        <button
          className="math-button"
          disabled={loaded.blocked}
          onClick={save}
        >
          <Text
            mode={mode}
            text={t('在本机保存项目草稿', 'Save project draft locally')}
          />
        </button>
        <button
          className="math-button secondary"
          disabled={!notes.trim()}
          onClick={download}
        >
          <Text
            mode={mode}
            text={t(
              '下载纸上项目Markdown报告',
              'Download paper-project Markdown report',
            )}
          />
        </button>
      </div>
      {saved && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              '已保存参数与原文，回到本工作台可恢复。未自动授予完成或审核。',
              'Parameters and your original text are saved for this lab. This does not award completion or review.',
            )}
          />
        </p>
      )}
      {(loaded.blocked || error) && (
        <p role="alert">
          <Text
            mode={mode}
            text={t(
              '原有项目草稿无法安全读取或写入，保留原数据。仍可下载当前文字报告。',
              'The existing project draft could not be safely read or written; its data are preserved. You can still download the current argument report.',
            )}
          />
        </p>
      )}
      <p>
        <Text
          mode={mode}
          text={t(
            '报告保留精确值、近似值及每条数学约束；论证和模型局限由家长审核，不把导出当作课程完成。',
            'The report retains exact values, approximations and every mathematical constraint. A parent reviews reasoning and model limits; exporting is not lesson completion.',
          )}
        />
      </p>
    </>
  );
}
export function IntegrationHookArt({
  kind,
  mode,
}: {
  kind: IntegrationLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-integration-hook">
      <strong>
        {kind === 'integration-geometry'
          ? 'GEOMETRY ↔ x(x+d) ?'
          : kind === 'integration-graph'
            ? 'OBSERVATIONS → RULE ?'
            : kind === 'integration-strategy'
              ? 'RELATION → METHOD → TARGET ?'
              : kind === 'integration-audit'
                ? 'VALID · INVALID · INSUFFICIENT ?'
                : 'h · r · s · w · EVERY CONSTRAINT ?'}
      </strong>
      <p>
        <Text
          mode={mode}
          text={t(
            '先说明条件，再选择表示与核验办法。',
            'State the conditions, then choose representations and checks.',
          )}
        />
      </p>
    </div>
  );
}
export function IntegrationLab({
  kind,
  mode,
}: {
  kind: IntegrationLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-integration-lab">
      {kind === 'integration-geometry' ? (
        <GeometryLinkLab mode={mode} />
      ) : kind === 'integration-graph' ? (
        <GraphLab mode={mode} />
      ) : kind === 'integration-strategy' ? (
        <StrategyLab mode={mode} />
      ) : kind === 'integration-audit' ? (
        <AuditLab mode={mode} />
      ) : (
        <RampLab mode={mode} />
      )}
    </section>
  );
}
