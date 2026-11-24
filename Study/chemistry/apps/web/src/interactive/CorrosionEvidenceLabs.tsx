import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized } from '@study/ui';
import {
  protectionCircuit,
  rustComparison,
  rustDays,
  rustLevelLabels,
  rustQuestionVariables,
  rustRecords,
  rustVariableLabels,
} from './corrosionEvidence';
import type {
  CompanionMetal,
  RustConclusion,
  RustVariable,
} from './corrosionEvidence';
import './IonicReactionLabs.css';
import './CorrosionEvidenceLabs.css';

const t = (zh: string, en: string): LocalizedText => ({ zh, en });
const label = (text: LocalizedText, mode: LanguageMode) =>
  mode === 'bilingual' ? text.zh + ' / ' + text.en : text[mode];
const variables = Object.keys(rustVariableLabels) as RustVariable[];
const dayText = (day: number) => t('第 ' + day + ' 天', 'Day ' + day);
const conclusionLabels: Record<RustConclusion, LocalizedText> = {
  supported: t(
    '条件匹配，已观察到差异',
    'Matched comparison with a visible difference',
  ),
  'not-yet-visible': t(
    '条件匹配，暂未观察到差异',
    'Matched comparison with no visible difference yet',
  ),
  'not-controlled': t(
    '这组记录无法单独检验目标因素',
    'These records do not isolate the target factor',
  ),
};
const compareFeedback: Record<RustConclusion, LocalizedText> = {
  supported: t(
    '只有目标因素不同，同一天也出现等级差异。本组记录支持该因素在这些条件下有影响。',
    'Only the target factor differs, and the grades differ on the same day. The records support an effect under these conditions.',
  ),
  'not-yet-visible': t(
    '只有目标因素不同，但今天的等级相同。换到较晚的同一天再比，看看证据是否改变。',
    'Only the target factor differs, but the grades match today. Compare a later matched day and see whether the evidence changes.',
  ),
  'not-controlled': t(
    '找一对只改变目标因素的记录。即使两栏的锈迹等级不同，也要先检查是哪几个条件变了。',
    'Find a pair that differs only in the target factor. Even if the rust grades differ, first check which conditions changed.',
  ),
};

function PredictionChoices<Value extends string>({
  mode,
  prompt,
  options,
  labels,
  value,
  onChange,
}: {
  mode: LanguageMode;
  prompt: LocalizedText;
  options: readonly Value[];
  labels: Record<Value, LocalizedText>;
  value: Value | '';
  onChange: (value: Value) => void;
}) {
  return (
    <fieldset className="chem-corrosion-choices">
      <legend>
        <Localized mode={mode} text={prompt} />
      </legend>
      {options.map((option) => (
        <label key={option}>
          <input
            type="radio"
            name="corrosion-prediction"
            value={option}
            checked={value === option}
            onChange={() => onChange(option)}
          />
          <Localized mode={mode} text={labels[option]} />
        </label>
      ))}
    </fieldset>
  );
}

function renderCondition(
  variable: RustVariable,
  value: boolean | number,
  mode: LanguageMode,
) {
  if (typeof value === 'boolean')
    return (
      <Localized
        mode={mode}
        text={value ? t('有', 'Present') : t('无', 'Absent')}
      />
    );
  const unit = variable === 'temperature' ? ' °C' : '×';
  return value + unit;
}

function RustComparisonLab({ mode }: { mode: LanguageMode }) {
  const [question, setQuestion] = useState(0);
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(1);
  const [day, setDay] = useState<number>(1);
  const [prediction, setPrediction] = useState<RustConclusion | ''>('');
  const [checked, setChecked] = useState(false);
  const result = rustComparison(question, left, right, day);

  function resetPrediction() {
    setPrediction('');
    setChecked(false);
  }

  return (
    <form
      className="ionic-lab chem-corrosion-lab"
      data-rust-comparison-lab
      onSubmit={(event) => {
        event.preventDefault();
        setChecked(true);
      }}
    >
      <p className="ionic-note">
        <Localized
          mode={mode}
          text={t(
            '选一个要检验的因素。先对照两栏条件，再用同一天的记录判断。这是课堂练习记录，等级只描述肉眼看到的锈迹。',
            'Choose a factor to test. Compare the conditions, then judge the records from the same day. These practice records use grades that describe visible rust.',
          )}
        />
      </p>
      <div className="chem-corrosion-controls">
        <label className="ionic-control">
          <Localized mode={mode} text={t('要检验的因素', 'Factor to test')} />
          <select
            value={question}
            onChange={(event) => {
              setQuestion(Number(event.target.value));
              resetPrediction();
            }}
          >
            {rustQuestionVariables.map((variable, index) => (
              <option key={variable} value={index}>
                {label(rustVariableLabels[variable], mode)}
              </option>
            ))}
          </select>
        </label>
        <label className="ionic-control">
          <Localized mode={mode} text={t('观察日期', 'Observation day')} />
          <select
            value={day}
            onChange={(event) => {
              setDay(Number(event.target.value));
              resetPrediction();
            }}
          >
            {rustDays.slice(1).map((value) => (
              <option key={value} value={value}>
                {label(dayText(value), mode)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <table className="chem-corrosion-records">
        <thead>
          <tr>
            <th scope="col">
              <Localized mode={mode} text={t('条件', 'Condition')} />
            </th>
            {([left, right] as const).map((index, position) => (
              <th key={position} scope="col">
                <label className="ionic-control">
                  <Localized
                    mode={mode}
                    text={
                      position === 0
                        ? t('左栏记录', 'Left record')
                        : t('右栏记录', 'Right record')
                    }
                  />
                  <select
                    value={index}
                    onChange={(event) => {
                      const setRecord = position === 0 ? setLeft : setRight;
                      setRecord(Number(event.target.value));
                      resetPrediction();
                    }}
                  >
                    {rustRecords.map((record, recordIndex) => (
                      <option key={record.id} value={recordIndex}>
                        {record.id}
                      </option>
                    ))}
                  </select>
                </label>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {variables.map((variable) => (
            <tr
              key={variable}
              className={
                checked && result.changed.includes(variable)
                  ? 'chem-corrosion-difference'
                  : undefined
              }
            >
              <th scope="row">
                <Localized mode={mode} text={rustVariableLabels[variable]} />
              </th>
              {[result.a, result.b].map((record, index) => (
                <td key={index}>
                  {renderCondition(variable, record.conditions[variable], mode)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="chem-corrosion-observation">
            <th scope="row">
              <Localized mode={mode} text={dayText(day)} />
            </th>
            {[result.firstLevel, result.secondLevel].map((level, index) => (
              <td key={index}>
                <span className="chem-corrosion-grades" aria-hidden="true">
                  {[1, 2, 3].map((grade) => (
                    <i key={grade} data-filled={grade <= level} />
                  ))}
                </span>
                <Localized mode={mode} text={rustLevelLabels[level]!} />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <PredictionChoices
        mode={mode}
        prompt={t(
          '证据支持哪一种判断？',
          'Which conclusion do the records support?',
        )}
        options={Object.keys(conclusionLabels) as RustConclusion[]}
        labels={conclusionLabels}
        value={prediction}
        onChange={(value) => {
          setPrediction(value);
          setChecked(false);
        }}
      />
      <button className="ionic-check" type="submit" disabled={!prediction}>
        <Localized mode={mode} text={t('核对判断', 'Check conclusion')} />
      </button>
      <div role="status">
        {checked && (
          <div className="ionic-result">
            <strong>
              <Localized
                mode={mode}
                text={
                  prediction === result.conclusion
                    ? t(
                        '你的判断有证据支持。',
                        'Your conclusion fits the evidence.',
                      )
                    : t(
                        '再检查条件和观察结果。',
                        'Recheck the conditions and observations.',
                      )
                }
              />
            </strong>
            <p>
              <Localized
                mode={mode}
                text={
                  result.changed.length
                    ? t(
                        '变化的条件：' +
                          result.changed
                            .map((variable) => rustVariableLabels[variable].zh)
                            .join('、') +
                          '。',
                        'Changed conditions: ' +
                          result.changed
                            .map((variable) =>
                              rustVariableLabels[variable].en.toLowerCase(),
                            )
                            .join(', ') +
                          '.',
                      )
                    : t(
                        '两栏的条件完全相同。',
                        'The conditions in both columns are identical.',
                      )
                }
              />
            </p>
            <p>
              <Localized
                mode={mode}
                text={compareFeedback[result.conclusion]}
              />
            </p>
          </div>
        )}
      </div>
    </form>
  );
}

const donorLabels = {
  Fe: t('铁 Fe', 'Iron Fe'),
  Zn: t('锌 Zn', 'Zinc Zn'),
  Cu: t('铜 Cu', 'Copper Cu'),
  none: t(
    '没有持续的跨金属电子转移',
    'No sustained transfer between the metals',
  ),
};
const couplingFeedback = {
  sacrificial: t(
    '锌发生氧化，电子沿金属通路流向铁表面，参与氧的还原。锌逐渐消耗，铁的氧化受到抑制。',
    'Zinc oxidises. Electrons travel through the metal path to the iron surface for oxygen reduction. Zinc is consumed, and iron oxidation is suppressed.',
  ),
  'iron-at-risk': t(
    '在这组条件下，铁发生氧化，电子沿金属通路流向铜表面，参与氧的还原。铁的腐蚀风险增加。',
    'Under these conditions, iron oxidises. Electrons travel through the metal path to the copper surface for oxygen reduction. The corrosion risk for iron increases.',
  ),
  uncoupled: t(
    '打开任意一条通路，都无法维持这两块金属之间的持续电化学耦合。铁表面仍可能发生局部腐蚀。',
    'Opening either path breaks the sustained electrochemical coupling between the two metals. Local corrosion can still occur on iron.',
  ),
};

function ProtectionLab({ mode }: { mode: LanguageMode }) {
  const [metal, setMetal] = useState<CompanionMetal>('Zn');
  const [metalLink, setMetalLink] = useState(false);
  const [ionicLink, setIonicLink] = useState(true);
  const [prediction, setPrediction] = useState<keyof typeof donorLabels | ''>(
    '',
  );
  const [checked, setChecked] = useState(false);
  const circuit = protectionCircuit(metal, metalLink, ionicLink);
  const options = ['Fe', metal, 'none'] as const;
  const paths = [
    {
      id: 'metal',
      label: t('金属通路 · 电子', 'Metal path · electrons'),
      connected: metalLink,
      setConnected: setMetalLink,
    },
    {
      id: 'electrolyte',
      label: t('电解质通路 · 离子', 'Electrolyte path · ions'),
      connected: ionicLink,
      setConnected: setIonicLink,
    },
  ];

  function resetPrediction() {
    setPrediction('');
    setChecked(false);
  }

  return (
    <form
      className="ionic-lab chem-corrosion-lab"
      data-protection-path-lab
      onSubmit={(event) => {
        event.preventDefault();
        setChecked(true);
      }}
    >
      <p className="ionic-note">
        <Localized
          mode={mode}
          text={t(
            '在有氧的给定模型里，更换铁旁边的金属，分别开关两条通路。先预测，再核对电子方向。',
            'In this supplied model with oxygen available, change the partner metal and switch each path separately. Predict before checking the electron direction.',
          )}
        />
      </p>
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t('铁旁边的金属', 'Partner metal next to iron')}
        />
        <select
          value={metal}
          onChange={(event) => {
            setMetal(event.target.value as CompanionMetal);
            resetPrediction();
          }}
        >
          {(['Zn', 'Cu'] as const).map((value) => (
            <option key={value} value={value}>
              {label(donorLabels[value], mode)}
            </option>
          ))}
        </select>
      </label>
      <div className="chem-corrosion-circuit">
        {paths.map((path) => (
          <label
            key={path.id}
            className="chem-corrosion-path"
            data-path={path.id}
            data-connected={path.connected}
          >
            <span>
              <input
                type="checkbox"
                checked={path.connected}
                onChange={(event) => {
                  path.setConnected(event.target.checked);
                  resetPrediction();
                }}
              />
              <Localized mode={mode} text={path.label} />
            </span>
            <i aria-hidden="true" />
            <strong>
              <Localized
                mode={mode}
                text={
                  path.connected ? t('连通', 'Connected') : t('断开', 'Open')
                }
              />
            </strong>
          </label>
        ))}
        <div className="chem-corrosion-metals">
          <div data-metal="Fe">
            <Localized mode={mode} text={donorLabels.Fe} />
          </div>
          <div data-metal={metal}>
            <Localized mode={mode} text={donorLabels[metal]} />
          </div>
        </div>
      </div>
      <PredictionChoices
        mode={mode}
        prompt={t(
          '谁会持续向另一块金属提供电子？',
          'Which metal will keep supplying electrons to the other?',
        )}
        options={options}
        labels={donorLabels}
        value={prediction}
        onChange={(value) => {
          setPrediction(value);
          setChecked(false);
        }}
      />
      <button className="ionic-check" type="submit" disabled={!prediction}>
        <Localized
          mode={mode}
          text={t('核对电子方向', 'Check electron direction')}
        />
      </button>
      <div role="status">
        {checked && (
          <div className="ionic-result">
            <strong>
              <Localized
                mode={mode}
                text={
                  prediction === circuit.donor
                    ? t(
                        '你的预测符合这组条件。',
                        'Your prediction fits these conditions.',
                      )
                    : t(
                        '先检查两条通路，再看是哪种金属。',
                        'Check both paths, then identify the metal.',
                      )
                }
              />
            </strong>
            <p>
              {circuit.coupled ? (
                <Localized
                  mode={mode}
                  text={t(
                    '电子沿金属通路：' +
                      circuit.donor +
                      ' → ' +
                      circuit.cathode,
                    'Electrons along the metal path: ' +
                      circuit.donor +
                      ' → ' +
                      circuit.cathode,
                  )}
                />
              ) : (
                <Localized mode={mode} text={donorLabels.none} />
              )}
            </p>
            <p>
              <Localized mode={mode} text={couplingFeedback[circuit.effect]} />
            </p>
          </div>
        )}
      </div>
      <p className="ionic-note">
        <Localized
          mode={mode}
          text={t(
            '模型只判断这对金属的连接和电子方向。腐蚀速率和保护时间需要其他证据。',
            'This model shows the two paths and electron direction. Corrosion rate and protection lifetime require other evidence.',
          )}
        />
      </p>
    </form>
  );
}

export default function CorrosionEvidenceLab({
  kind,
  mode,
}: {
  kind: 'rust-comparison-evidence-lab' | 'galvanic-protection-path-lab';
  mode: LanguageMode;
}) {
  return kind === 'rust-comparison-evidence-lab' ? (
    <RustComparisonLab mode={mode} />
  ) : (
    <ProtectionLab mode={mode} />
  );
}
