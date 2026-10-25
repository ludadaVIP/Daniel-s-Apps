import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text } from './ui';
import {
  frequencyTable,
  meanSummary,
  shareOne,
  recipePlan,
  type TimeObservation,
} from './dataModels';
import { MeanPiles, TimeLine, ScaleBars } from './DataVisuals';
export type DataLabKind =
  'data-frequency' | 'data-mean' | 'data-line' | 'data-chart' | 'data-recipe';
export const isDataLab = (kind: Lesson['lab']): kind is DataLabKind =>
  [
    'data-frequency',
    'data-mean',
    'data-line',
    'data-chart',
    'data-recipe',
  ].includes(kind);
const isDataLab = (kind: Lesson['lab']): kind is DataLabKind =>
  kind.startsWith('data-');
const categories = [
  { id: 'walk', name: t('步行', 'Walk') },
  { id: 'bike', name: t('骑车', 'Bike') },
  { id: 'bus', name: t('公交', 'Bus') },
  { id: 'other', name: t('其他', 'Other') },
];
const missing = t('无回应', 'No response');
const word = (mode: LanguageMode, copy: LocalizedText) =>
  mode === 'en' ? copy.en : copy.zh;
function Frequency({ mode }: { mode: LanguageMode }) {
  const raw: (string | null)[] = [
    'walk',
    'bus',
    'walk',
    'bike',
    'bus',
    'walk',
    null,
  ];
  const [records, setRecords] = useState<(string | null)[]>([]),
    [chosen, setChosen] = useState(''),
    [feedback, setFeedback] = useState<LocalizedText | null>(null),
    [reveal, setReveal] = useState(false);
  const table = frequencyTable(
      categories.map((c) => c.id),
      records,
    ),
    next = raw[records.length];
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '同一假想小组七人，每人只答一次“今天主要怎样来？”先读一张原始记录，选分类再录入。无回应要保留，但不能猜成其他交通方式。',
            'Seven fictional learners each answer once: “What was your main way here today?” Read a raw response and classify it before recording. Retain no response without guessing a transport category.',
          )}
        />
      </p>
      {records.length < raw.length ? (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                `第 ${records.length + 1}/7 张原始记录：${next === null ? missing.zh : categories.find((c) => c.id === next)!.name.zh}`,
                `Raw response ${records.length + 1}/7: ${next === null ? missing.en : categories.find((c) => c.id === next)!.name.en}`,
              )}
            />
          </p>
          <label>
            <Text
              mode={mode}
              text={t('选择记录分类', 'Choose a response category')}
            />
            <select
              aria-label={word(mode, t('记录分类', 'Response category'))}
              value={chosen}
              onChange={(e) => {
                setChosen(e.target.value);
                setFeedback(null);
              }}
            >
              <option value="">
                {word(mode, t('先选择', 'Choose first'))}
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {word(mode, c.name)}
                </option>
              ))}
              <option value="missing">{word(mode, missing)}</option>
            </select>
          </label>
          <button
            className="math-button"
            disabled={!chosen}
            onClick={() => {
              if ((chosen === 'missing' ? null : chosen) !== next) {
                setFeedback(
                  t(
                    '再读原始记录；一次回答只进入对应的一类，无回应不等于其他。',
                    'Reread the raw response. Count it in its matching category only; no response is not Other.',
                  ),
                );
                return;
              }
              setRecords([...records, next!]);
              setChosen('');
              setFeedback(null);
              setReveal(false);
            }}
          >
            <Text
              mode={mode}
              text={t('核对并录入这一条', 'Check and record this response')}
            />
          </button>
        </>
      ) : (
        <p>
          <Text
            mode={mode}
            text={t(
              '七条邀请记录都已核对。先预测回答人数和无回应数，再核对总数。',
              'All seven invitation records are checked. Predict the answered and missing counts before checking totals.',
            )}
          />
        </p>
      )}
      <div
        className="math-data-scroll"
        tabIndex={0}
        role="region"
        aria-label={word(mode, t('频数表', 'Frequency table'))}
      >
        <table className="math-data-table">
          <thead>
            <tr>
              <th>
                <Text mode={mode} text={t('类别', 'Category')} />
              </th>
              <th>
                <Text mode={mode} text={t('逐条记数', 'Tally')} />
              </th>
              <th>
                <Text mode={mode} text={t('频数', 'Frequency')} />
              </th>
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r) => (
              <tr key={r.id}>
                <th scope="row">
                  <Text
                    mode={mode}
                    text={categories.find((c) => c.id === r.id)!.name}
                  />
                </th>
                <td className="data-tally">
                  {r.count ? '|'.repeat(r.count) : '—'}
                </td>
                <td data-frequency={r.id}>{r.count}</td>
              </tr>
            ))}
            <tr>
              <th>
                <Text mode={mode} text={missing} />
              </th>
              <td>{table.missing ? '|'.repeat(table.missing) : '—'}</td>
              <td data-frequency="missing">{table.missing}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="math-data-actions">
        <button
          className="math-button secondary"
          onClick={() => setReveal(true)}
        >
          <Text
            mode={mode}
            text={t('我已加总，核对记录', 'I added the counts; check records')}
          />
        </button>
        <button
          className="math-button secondary"
          onClick={() => {
            setRecords([]);
            setChosen('');
            setFeedback(null);
            setReveal(false);
          }}
        >
          <Text
            mode={mode}
            text={t('重新整理七条记录', 'Sort the seven records again')}
          />
        </button>
      </div>
      {feedback && (
        <p role="status">
          <Text mode={mode} text={feedback} />
        </p>
      )}
      {reveal && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `已录入 ${records.length}/7 条：有效回答 ${table.recorded}，无回应 ${table.missing}。当前类别之和加无回应等于已录入数；尚未录入的不能当作零回答。`,
              `Recorded ${records.length}/7: ${table.recorded} answered, ${table.missing} missing. Category counts plus missing equal records entered; unentered records are not zero responses.`,
            )}
          />
        </p>
      )}
      <p className="math-muted">
        <Text
          mode={mode}
          text={t(
            '这七人不是全校或全新西兰的代表样本；结论只描述这个小组。',
            'These seven are not a representative sample of a school or New Zealand; describe this group only.',
          )}
        />
      </p>
    </>
  );
}
const meanSets = [
  [1, 3, 6, 6],
  [1, 2, 2],
  [0, 0, 0],
  [2, 2, 2, 18],
];
function Mean({ mode }: { mode: LanguageMode }) {
  const [set, setSet] = useState(0),
    [values, setValues] = useState(meanSets[0]!),
    [reveal, setReveal] = useState(false);
  const m = meanSummary(values),
    settled = Math.max(...values) - Math.min(...values) <= 1;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测公平分配后每堆多少张。每次从最多的一堆移一张到最少的一堆，总数与堆数都不变。平均数并不是每个人实际拥有的数量。',
            'Predict the fair share. Move one card from a largest pile to a smallest pile, preserving total and pile count. The mean need not be anyone’s actual pile.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('观察哪组卡堆', 'Choose card piles')} />
        <select
          aria-label={word(mode, t('卡堆数据', 'Card-pile data'))}
          value={set}
          onChange={(e) => {
            const i = Number(e.target.value);
            setSet(i);
            setValues([...meanSets[i]!]);
            setReveal(false);
          }}
        >
          {meanSets.map((v, i) => (
            <option value={i} key={i}>
              {v.join(', ')}
            </option>
          ))}
        </select>
      </label>
      <MeanPiles values={values} mode={mode} />
      <div className="math-data-actions">
        <button
          className="math-button"
          disabled={settled}
          onClick={() => {
            setValues(shareOne(values));
            setReveal(false);
          }}
        >
          <Text
            mode={mode}
            text={t(
              '把一张卡从最多移到最少',
              'Move one card from most to least',
            )}
          />
        </button>
        <button
          className="math-button secondary"
          onClick={() => setReveal(true)}
        >
          <Text
            mode={mode}
            text={t('我已预测，核对平均数', 'I predicted; check the mean')}
          />
        </button>
        <button
          className="math-button secondary"
          onClick={() => {
            setValues([...meanSets[set]!]);
            setReveal(false);
          }}
        >
          <Text
            mode={mode}
            text={t('恢复原始卡堆', 'Restore original piles')}
          />
        </button>
      </div>
      {reveal && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `总数 ${m.total} 张，${m.count} 堆，平均 ${m.total}÷${m.count}=${m.d === 1 ? m.n : `${m.n}/${m.d}`} 张。${m.d === 1 ? '公平分配可每堆相同。' : '整张卡无法完全等分；平均数仍是精确的分数，不能舍去余量。'}`,
              `Total ${m.total} cards in ${m.count} piles: mean ${m.total}÷${m.count}=${m.d === 1 ? m.n : `${m.n}/${m.d}`} cards. ${m.d === 1 ? 'Equal whole-card shares are possible.' : 'Whole cards cannot be perfectly equalised; the exact fractional mean still exists. Keep the remainder.'}`,
            )}
          />
        </p>
      )}
    </>
  );
}
export const lineObservations: TimeObservation[] = [
  { time: 0, value: 12 },
  { time: 1, value: 16 },
  { time: 3, value: 14 },
  { time: 6, value: 20 },
];
function Line({ mode }: { mode: LanguageMode }) {
  const [missingPoint, setMissing] = useState(false),
    [zoom, setZoom] = useState(false),
    [reveal, setReveal] = useState(false);
  const points = lineObservations.map((p, i) => ({
    ...p,
    value: missingPoint && i === 2 ? null : p.value,
  }));
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '观察同一地点的假想温度。先读横轴时刻和纵轴单位；0→1、1→3、3→6 小时不等长，所以横向距离也不等长。',
            'Observe fictional temperatures at one place. Read times and units first. Intervals 0→1, 1→3 and 3→6 hours differ, so horizontal distances must differ too.',
          )}
        />
      </p>
      <label>
        <input
          type="checkbox"
          checked={missingPoint}
          onChange={(e) => {
            setMissing(e.target.checked);
            setReveal(false);
          }}
        />
        <Text
          mode={mode}
          text={t('把第 3 小时改为缺测', 'Mark hour 3 as missing')}
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={zoom}
          onChange={(e) => {
            setZoom(e.target.checked);
            setReveal(false);
          }}
        />
        <Text
          mode={mode}
          text={t(
            '把纵轴上限从 24 改为 40 °C',
            'Change vertical maximum from 24 to 40 °C',
          )}
        />
      </label>
      <TimeLine points={points} maxY={zoom ? 40 : 24} mode={mode} />
      <div
        className="math-data-scroll"
        role="region"
        tabIndex={0}
        aria-label={word(mode, t('时间与温度表', 'Time and temperature table'))}
      >
        <table className="math-data-table">
          <thead>
            <tr>
              <th>
                <Text mode={mode} text={t('经过小时', 'Elapsed hours')} />
              </th>
              <th>°C</th>
            </tr>
          </thead>
          <tbody>
            {points.map((p) => (
              <tr key={p.time}>
                <td>{p.time}</td>
                <td>{p.value ?? word(mode, t('缺测', 'Missing'))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="math-button" onClick={() => setReveal(true)}>
        <Text
          mode={mode}
          text={t('我已读图，核对变化', 'I read the chart; check the changes')}
        />
      </button>
      {reveal && (
        <p role="status">
          <Text
            mode={mode}
            text={
              missingPoint
                ? t(
                    '0→1 小时升高四度；第 3 小时缺测，不能说它是零或猜出精确值。两端 12 与 20 仍相差八度。',
                    'From hour 0 to 1, temperature rises four degrees. Hour 3 is missing: neither zero nor an exact guessed value is justified. Endpoints 12 and 20 still differ by eight degrees.',
                  )
                : t(
                    '0→1 升高四度，1→3 降低二度，3→6 升高六度。最终比开始高八度；没有证据保证下一时刻还会升温。',
                    'Changes are +4, −2 and +6 degrees. The final reading is eight degrees above the first. This does not guarantee the next reading will rise.',
                  )
            }
          />
        </p>
      )}
    </>
  );
}
function Charts({ mode }: { mode: LanguageMode }) {
  const [truncated, setTruncated] = useState(false),
    [claim, setClaim] = useState(''),
    [feedback, setFeedback] = useState<LocalizedText | null>(null);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '同一次假想计数：A 组 40 人，B 组 44 人。只切换纵轴，数据不能跟着改变。先预测柱高会怎样，再选择有依据的结论。',
            'The same fictional count: group A has 40 people and B has 44. Change only the axis, retaining data. Predict the appearance, then choose a supported claim.',
          )}
        />
      </p>
      <label>
        <input
          type="checkbox"
          checked={truncated}
          onChange={(e) => {
            setTruncated(e.target.checked);
            setFeedback(null);
          }}
        />
        <Text
          mode={mode}
          text={t('截断纵轴，从 38 人开始', 'Truncate the axis at 38 people')}
        />
      </label>
      <ScaleBars values={[40, 44]} baseline={truncated ? 38 : 0} mode={mode} />
      <label>
        <Text
          mode={mode}
          text={t('哪句话被数据支持？', 'Which claim do the data support?')}
        />
        <select
          aria-label={word(mode, t('数据结论', 'Data claim'))}
          value={claim}
          onChange={(e) => {
            setClaim(e.target.value);
            setFeedback(null);
          }}
        >
          <option value="">{word(mode, t('先选择', 'Choose first'))}</option>
          <option value="triple">
            {word(
              mode,
              t('B 组人数是 A 的三倍', 'B has three times as many people'),
            )}
          </option>
          <option value="difference">
            {word(
              mode,
              t(
                '这次记录里 B 比 A 多四人',
                'B has four more people in this record',
              ),
            )}
          </option>
          <option value="all">
            {word(
              mode,
              t(
                '全新西兰的 B 组一定更多',
                'Every B group in New Zealand must be larger',
              ),
            )}
          </option>
        </select>
      </label>
      <button
        className="math-button"
        disabled={!claim}
        onClick={() =>
          setFeedback(
            claim === 'difference'
              ? t(
                  '有依据：44−40=4 人。截断图的柱高为六和二个刻度单位，不代表人数三倍；样本只支持这次记录。',
                  'Supported: 44−40=4 people. Truncated heights represent six and two scale units, not triple counts. Describe this record only.',
                )
              : claim === 'triple'
                ? t(
                    '要比较人数，读 44 与 40，而不是从 38 起算的柱高六与二。44 并不是 40 的三倍。',
                    'Compare counts 44 and 40, not the displayed six and two above 38. Forty-four is not three times forty.',
                  )
                : t(
                    '这里只观察两个假想小组；没有代表性抽样证据，不能推广所有人。',
                    'Only two fictional groups were observed. Without representative sampling, the claim about everyone is unsupported.',
                  ),
          )
        }
      >
        <Text
          mode={mode}
          text={t('核对结论与依据', 'Check the claim and evidence')}
        />
      </button>
      {feedback && (
        <p role="status">
          <Text mode={mode} text={feedback} />
        </p>
      )}
    </>
  );
}
function Recipe({ mode }: { mode: LanguageMode }) {
  const [servings, setServings] = useState(4),
    [budget, setBudget] = useState(600),
    [reveal, setReveal] = useState(false);
  const m = recipePlan(servings, budget);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '假想食谱：四份用面粉 200 g、牛奶 300 mL。按相同配方改份数；商店只卖整包面粉 500 g/NZ$2.40 与整盒奶 1000 mL/NZ$3.00，从零库存买。先算用量，再决定整包数与预算。无需购物或实际烹饪。',
            'Fictional recipe: four servings need 200 g flour and 300 mL milk. Keep the recipe proportions. Buy whole packs from zero stock: flour 500 g for NZ$2.40; milk 1000 mL for NZ$3.00. Predict quantities, whole packs and budget. No shopping or cooking is needed.',
          )}
        />
      </p>
      <label>
        <Text mode={mode} text={t('制作份数', 'Servings to make')} />
        <input
          type="range"
          min="1"
          max="12"
          value={servings}
          aria-label={word(mode, t('制作份数', 'Servings to make'))}
          onChange={(e) => {
            setServings(Number(e.target.value));
            setReveal(false);
          }}
        />
        <output>{servings}</output>
      </label>
      <label>
        <Text mode={mode} text={t('假想预算', 'Fictional budget')} />
        <select
          value={budget}
          aria-label={word(mode, t('假想预算', 'Fictional budget'))}
          onChange={(e) => {
            setBudget(Number(e.target.value));
            setReveal(false);
          }}
        >
          {[500, 600, 800, 1000].map((v) => (
            <option key={v} value={v}>
              NZ${(v / 100).toFixed(2)}
            </option>
          ))}
        </select>
      </label>
      <div className="math-data-recipe-map">
        <span>
          4 → {servings}
          <br />
          <Text mode={mode} text={t('份', 'servings')} />
        </span>
        <span>
          200 → ? g<br />
          <Text mode={mode} text={t('面粉', 'flour')} />
        </span>
        <span>
          300 → ? mL
          <br />
          <Text mode={mode} text={t('牛奶', 'milk')} />
        </span>
      </div>
      <button className="math-button" onClick={() => setReveal(true)}>
        <Text
          mode={mode}
          text={t(
            '我已做计划，核对用量与整包费用',
            'I planned; check quantities and whole-pack cost',
          )}
        />
      </button>
      {reveal && (
        <div role="status">
          <p>
            <Text
              mode={mode}
              text={t(
                `每份 50 g 面粉与 75 mL 牛奶。${servings} 份需 ${m.flourG} g 与 ${m.milkMl} mL；买面粉 ${m.flourPacks} 包、牛奶 ${m.milkPacks} 盒，共 NZ$${(m.costCents / 100).toFixed(2)}。`,
                `Each serving needs 50 g flour and 75 mL milk. ${servings} servings need ${m.flourG} g and ${m.milkMl} mL; buy ${m.flourPacks} flour pack(s) and ${m.milkPacks} milk carton(s), costing NZ$${(m.costCents / 100).toFixed(2)}.`,
              )}
            />
          </p>
          <p>
            <Text
              mode={mode}
              text={
                m.balanceCents >= 0
                  ? t(
                      `预算剩余 NZ$${(m.balanceCents / 100).toFixed(2)}；面粉剩 ${m.flourLeft} g、牛奶剩 ${m.milkLeft} mL。剩余库存不自动等于退回的钱。`,
                      `Budget remaining NZ$${(m.balanceCents / 100).toFixed(2)}; leftovers: ${m.flourLeft} g flour and ${m.milkLeft} mL milk. Unused stock is not automatically a refund.`,
                    )
                  : t(
                      `预算不足，还差 NZ$${(-m.balanceCents / 100).toFixed(2)}；不能把短缺写成“剩余”。`,
                      `Budget is insufficient by NZ$${(-m.balanceCents / 100).toFixed(2)}; label the shortfall rather than calling it money left.`,
                    )
              }
            />
          </p>
        </div>
      )}
    </>
  );
}
export function DataLab({
  kind,
  mode,
}: {
  kind: DataLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-data-lab">
      <div className="math-row">
        <span className="math-eyebrow">
          <Text
            mode={mode}
            text={t(
              '动手数学 · 记录、观察、解释',
              'HANDS-ON MATHS · RECORD, OBSERVE, EXPLAIN',
            )}
          />
        </span>
      </div>
      {kind === 'data-frequency' ? (
        <Frequency mode={mode} />
      ) : kind === 'data-mean' ? (
        <Mean mode={mode} />
      ) : kind === 'data-line' ? (
        <Line mode={mode} />
      ) : kind === 'data-chart' ? (
        <Charts mode={mode} />
      ) : (
        <Recipe mode={mode} />
      )}
    </section>
  );
}
export function DataHookArt({
  kind,
  mode,
}: {
  kind: DataLabKind;
  mode: LanguageMode;
}) {
  return kind === 'data-mean' ? (
    <MeanPiles values={[1, 3, 6, 6]} mode={mode} />
  ) : kind === 'data-line' ? (
    <TimeLine points={lineObservations} maxY={24} mode={mode} />
  ) : kind === 'data-chart' ? (
    <ScaleBars values={[40, 44]} baseline={38} mode={mode} />
  ) : (
    <p className="math-data-hook">
      <Text
        mode={mode}
        text={
          kind === 'data-frequency'
            ? t(
                '七条原始回应 → 分类 → 记数 → 核对；无回应不能偷偷消失。',
                'Seven raw responses → classify → tally → check; keep missing responses visible.',
              )
            : t(
                '四份：200 g + 300 mL。十份：？买到的整包与用掉的量相同吗？',
                'Four servings: 200 g + 300 mL. Ten servings: ? Are whole packs purchased the same as quantities used?',
              )
        }
      />
    </p>
  );
}
