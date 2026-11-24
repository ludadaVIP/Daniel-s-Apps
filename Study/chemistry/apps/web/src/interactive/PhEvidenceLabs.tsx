import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized } from '@study/ui';
import { parseAtomicAnswer } from './atomicEvidence';
import { parseSignedCount } from './formulaEvidence';
import {
  aqueousInventoryCards,
  aqueousPhInventory,
  indicatorCharts,
  indicatorEvidence,
  phInventorySpecies,
  type PhInterval,
  type PhInventoryIon,
  type RangeClass,
} from './phEvidence';
import './IonicReactionLabs.css';
import './PhEvidenceLabs.css';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
const label = (text: LocalizedText, mode: LanguageMode) =>
  mode === 'bilingual' ? `${text.zh} / ${text.en}` : text[mode];
const classifications: Record<RangeClass, LocalizedText> = {
  acidic: t('可确定酸性', 'Acidic'),
  neutral: t('可确定中性', 'Neutral'),
  basic: t('可确定碱性', 'Basic'),
  undetermined: t(
    '跨过中性，暂不能确定类别',
    'Spans neutrality; class unresolved',
  ),
  incompatible: t(
    '读数不兼容，无共同范围',
    'Incompatible readings; no common range',
  ),
};
const rangeText = (r: PhInterval) =>
  `${r.low} ${r.lowClosed ? '≤' : '<'} pH ${r.highClosed ? '≤' : '<'} ${r.high}`;
function NumberField({
  title,
  value,
  onChange,
  signed = false,
}: {
  title: string;
  value: string;
  onChange: (v: string) => void;
  signed?: boolean;
}) {
  return (
    <label className="chem-ph-field">
      {title}
      <input
        type="text"
        inputMode={signed ? 'text' : 'decimal'}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
function Choice({
  title,
  value,
  onChange,
  mode,
}: {
  title: LocalizedText;
  value: boolean | null;
  onChange: (v: boolean) => void;
  mode: LanguageMode;
}) {
  return (
    <fieldset className="chem-ph-question">
      <legend>
        <Localized mode={mode} text={title} />
      </legend>
      <div className="ionic-choices">
        {[true, false].map((v) => (
          <button
            type="button"
            key={String(v)}
            aria-pressed={value === v}
            onClick={() => onChange(v)}
          >
            <Localized mode={mode} text={v ? t('是', 'Yes') : t('否', 'No')} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
function RangeBar({ range, title }: { range: PhInterval; title: string }) {
  return (
    <div className="chem-ph-range">
      <strong>{title}</strong>
      <div className="chem-ph-track">
        <span
          style={{
            left: `${(range.low / 14) * 100}%`,
            width: `${((range.high - range.low) / 14) * 100}%`,
          }}
        >
          <i className={range.lowClosed ? 'closed' : ''} />
          <i className={range.highClosed ? 'closed' : ''} />
        </span>
      </div>
      <div className="chem-ph-axis">
        <span>0</span>
        <span>7</span>
        <span>14</span>
      </div>
      <p>{rangeText(range)}</p>
    </div>
  );
}
function IndicatorLab({ mode }: { mode: LanguageMode }) {
  const [first, setFirst] = useState(2),
    [second, setSecond] = useState(1);
  const [compatible, setCompatible] = useState<boolean | null>(null),
    [classification, setClassification] = useState<RangeClass | ''>(''),
    [low, setLow] = useState(''),
    [high, setHigh] = useState(''),
    [checked, setChecked] = useState(false);
  const l = indicatorEvidence(first, second),
    lo = parseAtomicAnswer(low, true),
    hi = parseAtomicAnswer(high, true);
  const complete =
    compatible !== null &&
    classification !== '' &&
    (!compatible || (lo !== null && hi !== null && lo <= 14 && hi <= 14));
  const correct =
    complete &&
    compatible === l.compatible &&
    classification === l.classification &&
    (!l.range || (lo === l.range.low && hi === l.range.high));
  const reset = () => {
    setCompatible(null);
    setClassification('');
    setLow('');
    setHigh('');
    setChecked(false);
  };
  return (
    <div className="ionic-lab chem-ph-lab" data-indicator-evidence-lab>
      <p className="ionic-note">
        <Localized
          mode={mode}
          text={t(
            '题设为 25 °C、pH 在 0–14 内的同一无色水样，两份独立取样各用一种指示剂。按下方给定色卡作理想读数；色块是示意，不是实测照片或精确测量。',
            'The specified colourless water sample is at 25 °C and within pH 0–14. Separate portions use one indicator each. Apply the supplied ideal charts; swatches are schematic, not measured photographs or exact measurements.',
          )}
        />
      </p>
      <div className="chem-ph-charts">
        {indicatorCharts.map((c, i) => (
          <section className="chem-ph-chart" key={i}>
            <h4>
              <Localized mode={mode} text={c.name} />
            </h4>
            <div className="chem-ph-colours">
              {c.colours.map((colour, j) => (
                <div key={j}>
                  <span
                    className="chem-ph-swatch"
                    style={{ background: c.swatches[j] }}
                  />
                  <Localized mode={mode} text={colour} />
                  <strong>
                    {j === 0
                      ? `pH < ${c.low}`
                      : j === 1
                        ? `${c.low} ≤ pH ≤ ${c.high}`
                        : `pH > ${c.high}`}
                  </strong>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
      <div className="chem-ph-controls">
        {indicatorCharts.map((c, i) => (
          <label className="ionic-control" key={i}>
            <Localized mode={mode} text={c.name} />
            <select
              value={i === 0 ? first : second}
              onChange={(e) => {
                if (i === 0) setFirst(Number(e.target.value));
                else setSecond(Number(e.target.value));
                reset();
              }}
            >
              {c.colours.map((colour, j) => (
                <option key={j} value={j}>
                  {label(colour, mode)}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <figure className="chem-ph-picture">
        <figcaption>
          <Localized
            mode={mode}
            text={t(
              '两条读数范围：找同时满足的部分',
              'Two reading ranges: find what both allow',
            )}
          />
        </figcaption>
        <RangeBar range={l.a} title={label(indicatorCharts[0].name, mode)} />
        <RangeBar range={l.b} title={label(indicatorCharts[1].name, mode)} />
        <p>
          <Localized
            mode={mode}
            text={t(
              '空心端点表示不含边界，实心端点表示含边界；这些是本题给定规则，真实过渡颜色是连续的。',
              'Open endpoints exclude the boundary; filled endpoints include it. These are the exercise’s supplied rules; real transition colours are continuous.',
            )}
          />
        </p>
      </figure>
      <form
        className="chem-ph-form"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <Choice
          mode={mode}
          title={t(
            '同一 pH 能同时符合这两条读数吗？',
            'Can one pH satisfy both readings?',
          )}
          value={compatible}
          onChange={(v) => {
            setCompatible(v);
            setLow('');
            setHigh('');
            setChecked(false);
          }}
        />
        {compatible !== false && (
          <div className="chem-ph-number-grid">
            <NumberField
              title={label(
                t(
                  '若兼容：共同范围的下边界数值',
                  'If compatible: lower boundary value',
                ),
                mode,
              )}
              value={low}
              onChange={(v) => {
                setLow(v);
                setChecked(false);
              }}
            />
            <NumberField
              title={label(
                t(
                  '若兼容：共同范围的上边界数值',
                  'If compatible: upper boundary value',
                ),
                mode,
              )}
              value={high}
              onChange={(v) => {
                setHigh(v);
                setChecked(false);
              }}
            />
          </div>
        )}
        <label className="ionic-control">
          <Localized
            mode={mode}
            text={t(
              '按共同范围，能确定什么？',
              'What does the common range establish?',
            )}
          />
          <select
            value={classification}
            onChange={(e) => {
              setClassification(e.target.value as RangeClass | '');
              setChecked(false);
            }}
          >
            <option value="">
              {label(t('先作判断', 'Choose a judgment'), mode)}
            </option>
            {Object.entries(classifications).map(([k, v]) => (
              <option key={k} value={k}>
                {label(v, mode)}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" className="ionic-check">
          <Localized
            mode={mode}
            text={t('核对共同范围', 'Check the common range')}
          />
        </button>
      </form>
      {checked && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                !complete
                  ? t(
                      '先作兼容与类别判断；若选兼容，再填 0–14 的边界数值',
                      'Choose compatibility and class; if compatible, enter boundary values within 0–14',
                    )
                  : correct
                    ? t(
                        '兼容判断、范围与类别都正确',
                        'Compatibility, range and classification are correct',
                      )
                    : t(
                        '重新找两条范围的交集，不把过渡色当成精确数值',
                        'Recheck the overlap; a transition colour is not an exact reading',
                      )
              }
            />
          </strong>
          {complete && (
            <>
              <p>
                <Localized
                  mode={mode}
                  text={classifications[l.classification]}
                />
              </p>
              {l.range ? (
                <>
                  <RangeBar
                    range={l.range}
                    title={label(t('共同范围', 'Common range'), mode)}
                  />
                  <p>
                    <Localized
                      mode={mode}
                      text={t(
                        '共同范围不是某一个精确 pH。若包含 7 两边的值，就不能仅凭这次读数判定酸性、中性或碱性。',
                        'A common range is not one exact pH. If it spans values on both sides of seven, these readings cannot establish acidic, neutral or basic class.',
                      )}
                    />
                  </p>
                </>
              ) : (
                <p>
                  <Localized
                    mode={mode}
                    text={t(
                      '在本题同一样品与给定规则下，读数没有共同范围。应复核样品标记、色卡和读数，不能随意平均，也不能仅凭此断定一定污染。',
                      'For the same sample and supplied rules, no common range exists. Recheck sample labels, charts and readings; do not average them or claim contamination from this alone.',
                    )}
                  />
                </p>
              )}
            </>
          )}
        </div>
      )}
      <p className="ionic-note">
        <Localized
          mode={mode}
          text={t(
            '0–14 只是这道题的范围条件，不是所有 pH 的极限。读色受工具、光线与样品影响；本题不模拟误差、滴定或指示剂改变样品的效应。',
            '0–14 is this exercise’s domain, not a universal pH limit. Tools, lighting and samples affect colour reading; error, titration and indicator perturbation are not modelled.',
          )}
        />
      </p>
    </div>
  );
}
function InventoryLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0),
    [portions, setPortions] = useState(1),
    [answers, setAnswers] = useState(['', '', '']),
    [classification, setClassification] = useState<RangeClass | ''>(''),
    [changes, setChanges] = useState<boolean | null>(null),
    [checked, setChecked] = useState(false);
  const l = aqueousPhInventory(index, portions),
    values = [
      parseAtomicAnswer(answers[0]!),
      parseAtomicAnswer(answers[1]!),
      parseSignedCount(answers[2]!),
    ];
  const complete =
      values.every((v) => v !== null) &&
      classification !== '' &&
      changes !== null,
    correct =
      complete &&
      values[0] === l.positive &&
      values[1] === l.negative &&
      values[2] === l.net &&
      classification === l.classification &&
      changes === false;
  const reset = () => {
    setAnswers(['', '', '']);
    setClassification('');
    setChanges(null);
    setChecked(false);
  };
  return (
    <div className="ionic-lab chem-ph-lab" data-aqueous-ph-lab>
      <p className="ionic-note">
        <Localized
          mode={mode}
          text={t(
            '25 °C 的六份理想水溶液记录。小数字是按同一比例缩小的平均组成相对份数，不是真实一杯中的离子个数或瞬时照片。列出本题考虑的全部带电种类；大量溶剂水未画出，但仍存在。',
            'Six ideal aqueous records at 25 °C. Small numbers are relative mean-composition units on one common scale, not literal ion counts in a cup or snapshots. All charged species considered in the exercise are listed; abundant solvent water is omitted, not absent.',
          )}
        />
      </p>
      <div className="chem-ph-controls">
        <label className="ionic-control">
          <Localized
            mode={mode}
            text={t('选择给定组成卡', 'Choose a supplied composition card')}
          />
          <select
            value={index}
            onChange={(e) => {
              setIndex(Number(e.target.value));
              reset();
            }}
          >
            {aqueousInventoryCards.map((_, i) => (
              <option value={i} key={i}>
                {String.fromCharCode(65 + i)}
              </option>
            ))}
          </select>
        </label>
        <label className="ionic-control">
          <Localized
            mode={mode}
            text={t(
              '清点同一溶液的体积份数',
              'Volume portions of the same solution counted',
            )}
          />
          <select
            value={portions}
            onChange={(e) => {
              setPortions(Number(e.target.value));
              reset();
            }}
          >
            {[1, 2, 3].map((n) => (
              <option key={n}>{n}</option>
            ))}
          </select>
        </label>
      </div>
      <figure className="chem-ph-picture">
        <figcaption>
          <Localized
            mode={mode}
            text={t(
              '完整相对离子清单：四行使用相同计数比例尺',
              'Complete relative ion inventory: one scale across all four rows',
            )}
          />
        </figcaption>
        <div className="chem-ph-inventory">
          {(Object.keys(phInventorySpecies) as PhInventoryIon[]).map((id) => (
            <div key={id} data-aqueous-ion={id}>
              <strong>{phInventorySpecies[id].label}</strong>
              <span data-relative-count>{l.counts[id]}</span>
              <div className="chem-ph-count-track">
                <span style={{ width: `${(l.counts[id] / 36) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
        <p>
          <Localized
            mode={mode}
            text={t(
              '在同一体积内比较 H₃O⁺ 与 OH⁻ 的相对数，就可比较浓度。Na⁺、Cl⁻ 仍要计入全部电荷，不能因它们不决定这道题的酸碱分类就漏记。',
              'Compare relative H₃O⁺ and OH⁻ counts within the same volume to compare concentrations. Na⁺ and Cl⁻ still belong in total-charge accounting, even though they do not set this exercise’s acid/base classification.',
            )}
          />
        </p>
      </figure>
      <p>
        <Localized
          mode={mode}
          text={t(
            '改变体积份数，是从同一均匀溶液清点更大体积，温度不变；没有加水稀释或混入新物质。',
            'Changing portions counts a larger volume of the same homogeneous solution at fixed temperature; it neither dilutes with water nor mixes in a new substance.',
          )}
        />
      </p>
      <form
        className="chem-ph-form"
        onSubmit={(e) => {
          e.preventDefault();
          setChecked(true);
        }}
      >
        <div className="chem-ph-three-fields">
          {[
            t('总正电荷相对份数', 'Total positive-charge units'),
            t(
              '总负电荷的绝对值相对份数',
              'Magnitude of total negative-charge units',
            ),
            t(
              '净电荷相对份数（正减负，归零填 0）',
              'Net-charge units (positive minus negative; zero is 0)',
            ),
          ].map((title, i) => (
            <NumberField
              key={i}
              title={label(title, mode)}
              value={answers[i]!}
              signed={i === 2}
              onChange={(v) => {
                setAnswers((a) => a.map((x, j) => (j === i ? v : x)));
                setChecked(false);
              }}
            />
          ))}
        </div>
        <label className="ionic-control">
          <Localized
            mode={mode}
            text={t(
              'H₃O⁺ 与 OH⁻ 浓度关系支持哪类？',
              'Which class follows from the H₃O⁺/OH⁻ concentration relation?',
            )}
          />
          <select
            value={classification}
            onChange={(e) => {
              setClassification(e.target.value as RangeClass | '');
              setChecked(false);
            }}
          >
            <option value="">
              {label(t('先作判断', 'Choose a judgment'), mode)}
            </option>
            {(['acidic', 'neutral', 'basic'] as const).map((k) => (
              <option key={k} value={k}>
                {label(classifications[k], mode)}
              </option>
            ))}
          </select>
        </label>
        <Choice
          mode={mode}
          title={t(
            '仅清点更大体积，会使这份均匀溶液的 pH 改变吗？',
            'Does merely counting a larger volume change this homogeneous solution’s pH?',
          )}
          value={changes}
          onChange={(v) => {
            setChanges(v);
            setChecked(false);
          }}
        />
        <button className="ionic-check" type="submit">
          <Localized
            mode={mode}
            text={t(
              '分别核对酸碱性与全部电荷',
              'Check acid/base class and whole charge separately',
            )}
          />
        </button>
      </form>
      {checked && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                !complete
                  ? t(
                      '先填三项整数，并完成类别与体积判断',
                      'Enter three integers, a class and the volume judgment first',
                    )
                  : correct
                    ? t(
                        '电荷、酸碱类别与取样体积判断都正确',
                        'Charge, acid/base class and sampling-volume judgment are correct',
                      )
                    : t(
                        '分别核对全部离子电荷与 H₃O⁺/OH⁻ 浓度关系',
                        'Audit all ion charges separately from the H₃O⁺/OH⁻ concentration relation',
                      )
              }
            />
          </strong>
          {complete && (
            <>
              <p>
                <Localized
                  mode={mode}
                  text={t('总正电荷', 'Positive charge')}
                />
                : {l.counts.hydronium}+{l.counts.sodium}={l.positive}
              </p>
              <p>
                <Localized
                  mode={mode}
                  text={t('总负电荷绝对值', 'Negative-charge magnitude')}
                />
                : {l.counts.hydroxide}+{l.counts.chloride}={l.negative}
              </p>
              <p>
                <Localized mode={mode} text={t('净电荷', 'Net charge')} />:{' '}
                {l.positive}−{l.negative}={l.net}
              </p>
              <p className="chem-ph-status">
                <Localized
                  mode={mode}
                  text={classifications[l.classification]}
                />{' '}
                ·{' '}
                <Localized
                  mode={mode}
                  text={t(
                    '这份完整清单整体电中性；电中性不等于 pH 中性。',
                    'This complete inventory is electrically neutral; electrical neutrality does not mean neutral pH.',
                  )}
                />
              </p>
              <p>
                H₃O⁺: {l.counts.hydronium} ÷ {portions} = {l.hydroniumDensity};
                OH⁻: {l.counts.hydroxide} ÷ {portions} = {l.hydroxideDensity}
              </p>
              <p>
                <Localized
                  mode={mode}
                  text={t(
                    '体积与所有粒子相对数同倍增加，每体积的相对数不变，所以这份均匀溶液的 pH 不因取样体积改变。这里不给实际摩尔浓度，也不从这些相对份数报出精确 pH。',
                    'Volume and all relative particle counts increase together; relative counts per volume stay fixed, so sampling volume does not change this solution’s pH. No actual molar concentrations or exact pH are reported from these relative units.',
                  )}
                />
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
export default function PhEvidenceLab({
  kind,
  mode,
}: {
  kind: 'indicator-range-evidence-lab' | 'aqueous-charge-versus-ph-lab';
  mode: LanguageMode;
}) {
  return kind === 'indicator-range-evidence-lab' ? (
    <IndicatorLab mode={mode} />
  ) : (
    <InventoryLab mode={mode} />
  );
}
