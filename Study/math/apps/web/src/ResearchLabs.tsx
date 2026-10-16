import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, checkAnswer, type AnswerSpec, type Lesson } from './model';
import { Text } from './ui';
import { textR } from './algebraModels';
import { ResearchBoxes, ResearchScatter } from './ResearchVisuals';
import {
  fiveNumber,
  quartileCases,
  spreadGroups,
  pairedCases,
  pairedData,
  weatherRecords,
  investigationSummary,
  investigationGate,
  investigationReport,
  type QuartileConvention,
} from './researchModels';
export type ResearchLabKind = Extract<Lesson['lab'], `research-${string}`>;
export const isResearchLab = (kind: Lesson['lab']): kind is ResearchLabKind =>
  kind.startsWith('research-');
const label = (mode: LanguageMode, s: LocalizedText) =>
  mode === 'en' ? s.en : s.zh;
function Task({
  mode,
  answer,
  prompt,
}: {
  mode: LanguageMode;
  answer: AnswerSpec;
  prompt: LocalizedText;
}) {
  const [value, setValue] = useState(''),
    [checked, setChecked] = useState(false);
  return (
    <div className="math-research-task">
      <p>
        <Text mode={mode} text={prompt} />
      </p>
      <label>
        <Text mode={mode} text={t('我的数据结论', 'My data conclusion')} />
        <input
          aria-label={label(mode, t('我的数据结论', 'My data conclusion'))}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setChecked(false);
          }}
        />
      </label>
      <button className="math-button" onClick={() => setChecked(true)}>
        <Text mode={mode} text={t('核对数据结论', 'Check data conclusion')} />
      </button>
      {checked && (
        <p
          role="status"
          aria-label={label(
            mode,
            t('数据结论反馈', 'Data conclusion feedback'),
          )}
        >
          <Text
            mode={mode}
            text={
              checkAnswer(value, answer)
                ? t(
                    '结论符合。请另说明记录、约定与推断范围。',
                    'The conclusion matches. Explain the records, convention and scope separately.',
                  )
                : t(
                    '回到原记录、排序分半、所求统计量或证据范围重新检查。',
                    'Recheck original records, ordered halves, the requested summary or evidence scope.',
                  )
            }
          />
        </p>
      )}
    </div>
  );
}
function Quartiles({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [convention, setConvention] = useState<QuartileConvention>('exclude'),
    [sorted, setSorted] = useState(false),
    [reveal, setReveal] = useState(false),
    [wide, setWide] = useState(false),
    values = quartileCases[index]!,
    s = fiveNumber(values, convention),
    reset = () => {
      setSorted(false);
      setReveal(false);
    };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '全部为虚构数值。正式题默认奇数时排除中位数；此处可比较包含法。采用最小–最大须，不采用离群截须规则。重复值保留。',
            'All values are fictional. Formal tasks exclude the odd middle observation; compare the inclusive method here. Whiskers use min–max, not an outlier fence. Retain duplicates.',
          )}
        />
      </p>
      <div className="math-research-controls">
        <label>
          <Text mode={mode} text={t('数据组', 'Data set')} />
          <select
            aria-label={label(mode, t('数据组', 'Data set'))}
            value={index}
            onChange={(e) => {
              setIndex(Number(e.target.value));
              reset();
            }}
          >
            {[
              t('九个乱序值', 'Nine unsorted values'),
              t('八个值', 'Eight values'),
              t('全部相同', 'All equal'),
              t('负数与分数', 'Signed fractions'),
            ].map((v, i) => (
              <option key={i} value={i}>
                {label(mode, v)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <Text mode={mode} text={t('四分位数约定', 'Quartile convention')} />
          <select
            aria-label={label(mode, t('四分位数约定', 'Quartile convention'))}
            value={convention}
            onChange={(e) => {
              setConvention(e.target.value as QuartileConvention);
              setReveal(false);
            }}
          >
            <option value="exclude">
              {label(mode, t('奇数排除中位数', 'Exclude odd middle'))}
            </option>
            <option value="include">
              {label(
                mode,
                t('奇数两半都包含中位数', 'Include odd middle in both halves'),
              )}
            </option>
          </select>
        </label>
      </div>
      <p
        aria-label={label(
          mode,
          t('原始或排序记录', 'Original or sorted records'),
        )}
      >
        {(sorted ? s.ordered.map(textR) : values).join(' · ')}
      </p>
      <div className="math-research-actions">
        <button className="math-button" onClick={() => setSorted(!sorted)}>
          <Text
            mode={mode}
            text={t('排序或恢复原序', 'Sort or restore original order')}
          />
        </button>
        <button className="math-button" onClick={() => setWide(!wide)}>
          <Text
            mode={mode}
            text={t('改变共同数轴窗口', 'Change common axis window')}
          />
        </button>
        <button className="math-button" onClick={() => setReveal(!reveal)}>
          <Text
            mode={mode}
            text={t(
              '显示或隐藏分半与五数',
              'Show or hide halves and five numbers',
            )}
          />
        </button>
      </div>
      <ResearchBoxes
        groups={[{ name: 'D', values }]}
        mode={mode}
        min={index === 3 ? -4 : 0}
        max={wide ? 16 : 12}
        step={wide ? 4 : 2}
        convention={convention}
        reveal={reveal}
      />
      {reveal && (
        <div
          role="status"
          aria-label={label(mode, t('分半核验', 'Halves audit'))}
        >
          <p>
            {s.lower.map(textR).join(', ')} | {s.upper.map(textR).join(', ')}
          </p>
          <p>
            min, Q1, median, Q3, max ={' '}
            {[s.min, s.q1, s.median, s.q3, s.max].map(textR).join(', ')}; IQR=
            {textR(s.iqr)}
          </p>
        </div>
      )}
      <Task
        key={`${index}:${convention}`}
        mode={mode}
        answer={{ kind: 'number', value: textR(s.q1) }}
        prompt={t(
          '按当前约定求 Q1，写精确值，不附单位。',
          'Find Q1 using the current convention. Enter its exact value without units.',
        )}
      />
    </>
  );
}
function Spread({ mode }: { mode: LanguageMode }) {
  const [extreme, setExtreme] = useState(false),
    [reveal, setReveal] = useState(false),
    [wide, setWide] = useState(false),
    groups = spreadGroups(extreme);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '虚构的同单位记录。先比较中位数，再分别比较极差和 IQR；“更稳定”要指明所用指标。改动只替换 A 的最后一条记录，原编号保留。',
            'Fictional records in the same units. Compare medians, then range and IQR separately. Define the measure behind “more consistent”. Only A’s final record changes, retaining its identity.',
          )}
        />
      </p>
      <label>
        <input
          type="checkbox"
          aria-label={label(
            mode,
            t('将 A9 从 6 改为 30', 'Change A9 from 6 to 30'),
          )}
          checked={extreme}
          onChange={(e) => {
            setExtreme(e.target.checked);
            setReveal(false);
          }}
        />
        <Text
          mode={mode}
          text={t('将 A9 从 6 改为 30', 'Change A9 from 6 to 30')}
        />
      </label>
      {groups.map((g) => (
        <p key={g.name}>
          {g.name}: {g.values.join(', ')}
        </p>
      ))}
      <ResearchBoxes
        groups={groups}
        mode={mode}
        max={wide ? 40 : extreme ? 36 : 12}
        step={wide ? 10 : extreme ? 6 : 2}
        reveal={reveal}
      />
      <div className="math-research-actions">
        <button className="math-button" onClick={() => setWide(!wide)}>
          <Text
            mode={mode}
            text={t('改变共同数轴窗口', 'Change common axis window')}
          />
        </button>
        <button className="math-button" onClick={() => setReveal(!reveal)}>
          <Text
            mode={mode}
            text={t('显示或隐藏离散度比较', 'Show or hide spread comparison')}
          />
        </button>
      </div>
      {reveal && (
        <div
          role="status"
          aria-label={label(mode, t('离散度核验', 'Spread audit'))}
        >
          {groups.map((g) => {
            const s = fiveNumber(g.values);
            return (
              <p key={g.name}>
                {g.name}: median={textR(s.median)}; range={textR(s.range)}; IQR=
                {textR(s.iqr)}
              </p>
            );
          })}
          <p>
            <Text
              mode={mode}
              text={t(
                '本例尾值变化使极差改变而 IQR 不变；不能推广为 IQR 永远不受任何异常值影响。',
                'This tail change alters range but not IQR here. It does not prove that IQR is immune to every unusual value.',
              )}
            />
          </p>
        </div>
      )}
      <Task
        key={String(extreme)}
        mode={mode}
        answer={{
          kind: 'number',
          value: textR(fiveNumber(groups[0]!.values).range),
        }}
        prompt={t(
          '求 A 组当前极差，不附单位。',
          'Find the current range of group A, without units.',
        )}
      />
    </>
  );
}
function Scatter({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [selected, setSelected] = useState('P1'),
    [wide, setWide] = useState(false),
    source = pairedCases[index]!,
    m = pairedData(source.records);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '这是程序固定生成的虚构记录，未拟合总体规律。x 为练习轮数（轮），y 为得分（分）；每行是一份配对记录。先看方向、形状和例外，描述整体而非要求每一步都同向。',
            'These are fixed fictional records, not a fitted population rule. x is practice rounds and y a score; each row is one paired record. Describe overall direction, shape and exceptions, without requiring every step to agree.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('散点记录案例', 'Paired-record case')} />
        <select
          aria-label={label(mode, t('散点记录案例', 'Paired-record case'))}
          value={index}
          onChange={(e) => {
            const i = Number(e.target.value);
            setIndex(i);
            setSelected(pairedCases[i]!.records[0]!.id);
          }}
        >
          {pairedCases.map((c, i) => (
            <option value={i} key={c.id}>
              {i + 1} · {c.id}
            </option>
          ))}
        </select>
      </label>
      <ResearchScatter
        records={source.records}
        selected={selected}
        wide={wide}
        mode={mode}
        xLabel={label(mode, t('练习轮数 / 轮', 'Practice / rounds'))}
        yLabel={label(mode, t('得分 / 分', 'Score / points'))}
      />
      <button className="math-button" onClick={() => setWide(!wide)}>
        <Text mode={mode} text={t('改变 x 轴窗口', 'Change x-axis window')} />
      </button>
      <table className="math-research-table">
        <caption>
          <Text
            mode={mode}
            text={t(
              '逐行配对；点选编号定位',
              'Pair by row; select an ID to locate it',
            )}
          />
        </caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>x</th>
            <th>y</th>
          </tr>
        </thead>
        <tbody>
          {source.records.map((r) => (
            <tr key={r.id}>
              <td>
                <button
                  className="math-button"
                  aria-pressed={r.id === selected}
                  onClick={() => setSelected(r.id)}
                >
                  {r.id}
                </button>
              </td>
              <td>{r.x}</td>
              <td>{r.y ?? label(mode, t('缺失', 'missing'))}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p>
        <Text
          mode={mode}
          text={t(
            `${m.total} 条记录，${m.complete.length} 个完整数对，${m.missing} 条 y 缺失。`,
            `Of ${m.total} records, ${m.complete.length} pairs are complete and ${m.missing} have missing y.`,
          )}
        />
      </p>
      <Task
        key={index}
        mode={mode}
        answer={{ kind: 'association', value: source.pattern }}
        prompt={t(
          '描述本图整体形状：positive / negative / no-clear-linear / curved，也可用正相关、负相关、无明显线性关联、弯曲关联。不由此推因果。',
          'Describe the overall shape: positive, negative, no-clear-linear or curved. This does not establish causation.',
        )}
      />
    </>
  );
}
function Causation({ mode }: { mode: LanguageMode }) {
  const [group, setGroup] = useState('all'),
    [design, setDesign] = useState('observe'),
    [audit, setAudit] = useState(false),
    records = weatherRecords.filter(
      (r) => group === 'all' || r.group === group,
    );
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '虚构八天观察：x 是零食销量（份），y 是租车次数（次）。凉天 C 与暖天 W 的记录由程序构造，用来检验“零食导致租车”的说法，不是真实经济资料。',
            'Eight fictional observed days: x counts snacks sold and y bike rentals. Cool C and warm W records are constructed to examine a “snacks cause rentals” claim, not to report real economic data.',
          )}
        />
      </p>
      <label>
        <Text
          mode={mode}
          text={t('按天气查看同一批记录', 'View the same records by weather')}
        />
        <select
          aria-label={label(
            mode,
            t('按天气查看同一批记录', 'View the same records by weather'),
          )}
          value={group}
          onChange={(e) => setGroup(e.target.value)}
        >
          <option value="all">
            {label(mode, t('全部八天', 'All eight days'))}
          </option>
          <option value="cool">
            {label(mode, t('凉天 C（圆点）', 'Cool C (circles)'))}
          </option>
          <option value="warm">
            {label(mode, t('暖天 W（方点）', 'Warm W (squares)'))}
          </option>
        </select>
      </label>
      <ResearchScatter
        records={records}
        mode={mode}
        xLabel={label(mode, t('零食 / 份', 'Snacks / portions'))}
        yLabel={label(mode, t('租车 / 次', 'Rentals / count'))}
      />
      <p>{records.map((r) => `${r.id}=(${r.x},${r.y})`).join('; ')}</p>
      <p>
        <Text
          mode={mode}
          text={t(
            '合并后同向，但同天气内形成四角方阵，没有同样的线性上升趋势。天气可能同时影响两者；这不证明天气是真实唯一原因。',
            'The pooled data rise together; each weather group forms a rectangle without the same rising linear trend. Weather could influence both. This does not prove weather is the sole real cause.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('下一项证据设计', 'Next evidence design')} />
        <select
          aria-label={label(mode, t('下一项证据设计', 'Next evidence design'))}
          value={design}
          onChange={(e) => {
            setDesign(e.target.value);
            setAudit(false);
          }}
        >
          <option value="observe">
            {label(
              mode,
              t(
                '再找一张类似观察散点图',
                'Find another observational scatter plot',
              ),
            )}
          </option>
          <option value="random">
            {label(
              mode,
              t(
                '可行时随机分配处理并控制其他条件',
                'Where feasible, randomly assign treatments and control other conditions',
              ),
            )}
          </option>
        </select>
      </label>
      <button className="math-button" onClick={() => setAudit(!audit)}>
        <Text
          mode={mode}
          text={t('审查或隐藏设计依据', 'Audit or hide the design')}
        />
      </button>
      {audit && (
        <p
          role="status"
          aria-label={label(mode, t('因果证据审查', 'Causal evidence audit'))}
        >
          <Text
            mode={mode}
            text={
              design === 'observe'
                ? t(
                    '更多同类观察仍可能受共同因素、反向关系或选择偏差影响，相关图本身不补因果证据。',
                    'More similar observations may retain confounding, reverse direction or selection bias; a correlation plot alone adds no causal guarantee.',
                  )
                : t(
                    '随机分配与共同条件能加强因果辨别，但这里只选了设计，尚未实施或得到结果；还需重复、处理随机波动和适用范围。',
                    'Random assignment and common conditions strengthen causal discrimination. Selecting a design is not running it or obtaining results; replication, random variation and scope still matter.',
                  )
            }
          />
        </p>
      )}
      <Task
        mode={mode}
        answer={{ kind: 'proof-verdict', value: 'insufficient' }}
        prompt={t(
          '仅凭已有八天观察，是否足以证明零食销量导致租车次数变化？写 sufficient / insufficient（充分/条件不足）。',
          'Do the existing eight observational days alone prove snacks cause rentals to change? Enter sufficient or insufficient.',
        )}
      />
    </>
  );
}
const stages = [
  t('问题', 'Problem'),
  t('计划', 'Plan'),
  t('数据', 'Data'),
  t('分析', 'Analysis'),
  t('结论', 'Conclusion'),
];
function Investigation({ mode }: { mode: LanguageMode }) {
  const [stage, setStage] = useState(0),
    [scope, setScope] = useState<'records' | 'all'>('all'),
    [missing, setMissing] = useState<'retain' | 'zero'>('zero'),
    [corrected, setCorrected] = useState(false),
    [median, setMedian] = useState(''),
    [checked, setChecked] = useState(false),
    [notice, setNotice] = useState(false),
    [draft, setDraft] = useState(''),
    m = investigationSummary(corrected),
    allowed = investigationGate(stage, {
      scope,
      missing,
      corrected,
      medianChecked: checked,
    }),
    report =
      stage === 4 && draft.trim() ? investigationReport(draft, corrected) : '';
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '用十二张虚构纸片下滑距离卡（cm）走完 PPDAC。A/B 折法来自不同桌面、没有随机分配；不作真实实验结果。结论草稿只用于下载，正式解释仍由家长核验。',
            'Complete PPDAC using twelve fictional card-slide distance records (cm). Folds A/B came from different desks without random assignment; these are not real experimental results. The downloadable conclusion remains a draft, with formal reasoning reviewed by a parent.',
          )}
        />
      </p>
      <ol className="math-research-stages">
        {stages.map((v, i) => (
          <li key={i} aria-current={stage === i ? 'step' : undefined}>
            {i + 1}. <Text mode={mode} text={v} />
          </li>
        ))}
      </ol>
      {stage === 0 && (
        <label>
          <Text
            mode={mode}
            text={t('问题的推断范围', 'Scope of the question')}
          />
          <select
            aria-label={label(
              mode,
              t('问题的推断范围', 'Scope of the question'),
            )}
            value={scope}
            onChange={(e) => {
              setScope(e.target.value as typeof scope);
              setNotice(false);
            }}
          >
            <option value="all">
              {label(
                mode,
                t(
                  '据此决定所有纸片哪种折法最好',
                  'Decide the best fold for every card',
                ),
              )}
            </option>
            <option value="records">
              {label(
                mode,
                t(
                  '比较这批 A/B 距离记录的典型值与波动',
                  'Compare typical distances and spread in these A/B records',
                ),
              )}
            </option>
          </select>
        </label>
      )}
      {stage === 1 && (
        <label>
          <Text
            mode={mode}
            text={t('记录与缺失计划', 'Record and missing-value plan')}
          />
          <select
            aria-label={label(
              mode,
              t('记录与缺失计划', 'Record and missing-value plan'),
            )}
            value={missing}
            onChange={(e) => {
              setMissing(e.target.value as typeof missing);
              setNotice(false);
            }}
          >
            <option value="zero">
              {label(
                mode,
                t(
                  '缺失填零，删掉不喜欢的大值',
                  'Fill missing with zero and delete unwanted large values',
                ),
              )}
            </option>
            <option value="retain">
              {label(
                mode,
                t(
                  '保留编号与缺失，异常先查原卡，统一 cm',
                  'Retain IDs/missing; check unusual entries against source cards; use cm',
                ),
              )}
            </option>
          </select>
        </label>
      )}
      {stage >= 2 && (
        <>
          <table className="math-research-table">
            <caption>
              <Text
                mode={mode}
                text={t(
                  '原记录；A5 缺失必须保留',
                  'Source records; retain A5 as missing',
                )}
              />
            </caption>
            <thead>
              <tr>
                <th>ID</th>
                <th>
                  <Text mode={mode} text={t('折法', 'Fold')} />
                </th>
                <th>cm</th>
              </tr>
            </thead>
            <tbody>
              {m.rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.group}</td>
                  <td>{r.value ?? label(mode, t('缺失', 'missing'))}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p>
            <Text
              mode={mode}
              text={t(
                '可核原卡：A6=7 cm；录入栏最初为 27 cm。改正有来源的转录错误，不因数值大就删记录。',
                'Available source card: A6=7 cm; the initial entry reads 27 cm. Correct a documented transcription error rather than deleting a large value.',
              )}
            />
          </p>
          {!corrected ? (
            <button
              className="math-button"
              onClick={() => {
                setCorrected(true);
                setMedian('');
                setChecked(false);
                setNotice(false);
              }}
            >
              <Text
                mode={mode}
                text={t('根据原卡改正 A6', 'Correct A6 from its source card')}
              />
            </button>
          ) : (
            <p
              role="status"
              aria-label={label(mode, t('纠错记录', 'Correction record'))}
            >
              A6: 27 → 7 cm; A5: {label(mode, t('仍缺失', 'still missing'))};
              n(A)=5, n(B)=6.
            </p>
          )}
        </>
      )}
      {stage >= 3 && (
        <>
          <ResearchBoxes
            groups={m.groups.map((g) => ({ name: g.name, values: g.values }))}
            mode={mode}
            max={30}
            step={5}
          />
          <label>
            <Text mode={mode} text={t('A 组中位数', 'Median for group A')} />
            <input
              aria-label={label(mode, t('A 组中位数', 'Median for group A'))}
              value={median}
              disabled={stage === 4}
              onChange={(e) => {
                setMedian(e.target.value);
                setChecked(false);
              }}
            />
          </label>
          {stage === 3 && (
            <button
              className="math-button"
              onClick={() => {
                setChecked(
                  checkAnswer(median, {
                    kind: 'number',
                    value: textR(m.groups[0]!.summary.median),
                  }) === true,
                );
                setNotice(true);
              }}
            >
              <Text
                mode={mode}
                text={t('核对分析数值', 'Check analysis value')}
              />
            </button>
          )}
          {checked && (
            <p
              role="status"
              aria-label={label(mode, t('分析核验', 'Analysis check'))}
            >
              <Text
                mode={mode}
                text={t(
                  'A 中位数为 5。再结合 B 的 9/2、IQR 的 2/1 和缺失 1/0 解释。',
                  'A has median 5. Explain it alongside B’s 9/2, IQRs 2/1 and missing counts 1/0.',
                )}
              />
            </p>
          )}
        </>
      )}
      {stage === 4 && (
        <>
          <label>
            <Text
              mode={mode}
              text={t('我的调查结论草稿', 'My investigation conclusion draft')}
            />
            <textarea
              maxLength={6000}
              aria-label={label(
                mode,
                t('我的调查结论草稿', 'My investigation conclusion draft'),
              )}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
          </label>
          <p>
            <Text
              mode={mode}
              text={t(
                '写典型值、IQR、n=5/6、缺失与纠错；只描述本批，桌面混杂不允许直接归因折法。下载不代表通过人工审核；离开探索页前下载，草稿不自动保存。',
                'Include centres, IQRs, n=5/6, missingness and correction. Describe these records; desk confounding prevents attributing the difference to folding. Downloading is not parent approval. Download before leaving: the draft is not autosaved.',
              )}
            />
          </p>
          {report && (
            <a
              className="math-button"
              download="J88-investigation.txt"
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(report)}`}
            >
              <Text
                mode={mode}
                text={t(
                  '下载我的虚构数据报告',
                  'Download my fictional-data report',
                )}
              />
            </a>
          )}
        </>
      )}
      {notice && !allowed && stage < 4 && (
        <p
          role="status"
          aria-label={label(
            mode,
            t('调查步骤反馈', 'Investigation step feedback'),
          )}
        >
          <Text
            mode={mode}
            text={
              stage === 0
                ? t(
                    '范围超出记录。先明确这十二张卡能回答的问题。',
                    'The scope exceeds the records. Choose a question these twelve cards can answer.',
                  )
                : stage === 1
                  ? t(
                      '缺失不等于零，异常先查来源；不能为偏好结论删数据。',
                      'Missing is not zero; check sources before changing unusual data, rather than deleting inconvenient records.',
                    )
                  : stage === 2
                    ? t(
                        '先核原卡并记录 A6 的转录更正。',
                        'Check the source card and record the A6 correction first.',
                      )
                    : t(
                        '先用五个已知 A 值求中位数并核对；缺失不补零。',
                        'Check the median of the five observed A values first; do not impute zero.',
                      )
            }
          />
        </p>
      )}
      <div className="math-research-actions">
        <button
          className="math-button"
          disabled={stage === 0}
          onClick={() => {
            setStage(stage - 1);
            setNotice(false);
          }}
        >
          <Text
            mode={mode}
            text={t('回到前一调查步骤', 'Previous investigation stage')}
          />
        </button>
        <button
          className="math-button"
          disabled={stage === 4}
          onClick={() => {
            if (allowed) {
              setStage(stage + 1);
              setNotice(false);
            } else setNotice(true);
          }}
        >
          <Text
            mode={mode}
            text={t('进入下一调查步骤', 'Next investigation stage')}
          />
        </button>
      </div>
    </>
  );
}
export function ResearchLab({
  kind,
  mode,
}: {
  kind: ResearchLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-research-lab">
      {kind === 'research-quartiles' ? (
        <Quartiles mode={mode} />
      ) : kind === 'research-spread' ? (
        <Spread mode={mode} />
      ) : kind === 'research-scatter' ? (
        <Scatter mode={mode} />
      ) : kind === 'research-cause' ? (
        <Causation mode={mode} />
      ) : (
        <Investigation mode={mode} />
      )}
    </section>
  );
}
export function ResearchHookArt({
  kind,
  mode,
}: {
  kind: ResearchLabKind;
  mode: LanguageMode;
}) {
  const hooks: Record<ResearchLabKind, LocalizedText> = {
    'research-quartiles': t(
      '同样九个数，先排序再分半，箱子的边界会落在哪？',
      'Where do the box edges fall after sorting and splitting nine values?',
    ),
    'research-spread': t(
      '两组中位数相同，是否就一样稳定？',
      'Do equal medians imply equal consistency?',
    ),
    'research-scatter': t(
      '一个点的一对坐标，能从两张表各随便拿一个数吗？',
      'Can one plotted pair use arbitrary entries from two separate lists?',
    ),
    'research-cause': t(
      '两种销量同时增加，就能说其中一种导致另一种吗？',
      'If two counts rise together, must one cause the other?',
    ),
    'research-investigate': t(
      '一条记录缺失、另一条疑似抄错，应先处理哪一步？',
      'With one missing value and one possible transcription error, what should happen before analysis?',
    ),
  };
  return (
    <p>
      <Text mode={mode} text={hooks[kind]} />
    </p>
  );
}
