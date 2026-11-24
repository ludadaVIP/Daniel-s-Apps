import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized } from '@study/ui';
import {
  balanceRecords,
  changedDissolvingVariables,
  dissolvingTrials,
  evidenceCards,
  isolatesDissolvingVariable,
  massBoundaryCases,
  massBoundaryLedger,
  readingStats,
  type TrialVariable,
} from './scienceEvidence';
import './IonicReactionLabs.css';
import './ScienceEvidenceLabs.css';

const t = (zh: string, en: string): LocalizedText => ({ zh, en });
const label = (text: LocalizedText, mode: LanguageMode) =>
  mode === 'bilingual' ? `${text.zh} / ${text.en}` : text[mode];

function ObservationLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0);
  const [prediction, setPrediction] = useState<string | null>(null);
  const card = evidenceCards[index]!;
  return (
    <div
      className="ionic-lab chem-evidence-lab"
      data-evidence-lab="observation"
    >
      <div
        className="chem-evidence-chain"
        aria-label={
          mode === 'en'
            ? 'Record, explain and check evidence'
            : '记录、解释与证据检查'
        }
      >
        <span>
          <Localized mode={mode} text={t('记录现象', 'Record observations')} />
        </span>
        <b aria-hidden="true">→</b>
        <span>
          <Localized
            mode={mode}
            text={t('提出解释', 'Propose an explanation')}
          />
        </span>
        <b aria-hidden="true">⇄</b>
        <span>
          <Localized
            mode={mode}
            text={t('用证据检查', 'Check with evidence')}
          />
        </span>
      </div>
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t('选择证据卡', 'Choose an evidence card')}
        />
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setPrediction(null);
          }}
        >
          {evidenceCards.map((item, i) => (
            <option key={item.id} value={i}>
              {i + 1} / {evidenceCards.length}
            </option>
          ))}
        </select>
      </label>
      <div className="chem-evidence-record">
        <Localized mode={mode} text={card.record} />
      </div>
      <div className="ionic-receipt">
        <Localized
          mode={mode}
          text={t('要分类的这句话', 'Classify this statement')}
        />
        <strong>
          <Localized mode={mode} text={card.statement} />
        </strong>
      </div>
      <div className="ionic-choices">
        {[
          {
            id: 'observation',
            title: t('观察／读数记录', 'Observation / reading'),
          },
          {
            id: 'inference',
            title: t('推断／解释', 'Inference / explanation'),
          },
        ].map((choice) => (
          <button
            key={choice.id}
            type="button"
            aria-pressed={prediction === choice.id}
            onClick={() => setPrediction(choice.id)}
          >
            <Localized mode={mode} text={choice.title} />
          </button>
        ))}
      </div>
      {prediction !== null && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                prediction === card.kind
                  ? t('分类有依据', 'Your classification is supported')
                  : t(
                      '再看：这句话是否加入了身份、原因或模型？',
                      'Recheck: does the statement add an identity, cause or model?',
                    )
              }
            />
          </strong>
          <p>
            <Localized mode={mode} text={card.explanation} />
          </p>
        </div>
      )}
      <p>
        <Localized
          mode={mode}
          text={t(
            '推断不等于错误。先把记录与解释分开，再问证据是否足够、还需要什么对照。所有记录为本课编写，不是实时实验。',
            'An inference is not automatically wrong. Separate the record from its interpretation, then ask whether evidence is sufficient and what controls are needed. These are authored records, not live experiments.',
          )}
        />
      </p>
    </div>
  );
}

const variableNames: Record<TrialVariable, LocalizedText> = {
  temperature: t('温度', 'Temperature'),
  water: t('水体积', 'Water volume'),
  sugar: t('糖质量', 'Sugar mass'),
  stirring: t('搅拌频率', 'Stirring frequency'),
  grains: t('糖颗粒状态', 'Sugar grain size'),
};

function TrialCard({
  trial,
  mode,
}: {
  trial: (typeof dissolvingTrials)[number];
  mode: LanguageMode;
}) {
  return (
    <div className="chem-evidence-trial">
      <strong>
        <Localized mode={mode} text={t('试验记录', 'Trial record')} />{' '}
        {trial.id}
      </strong>
      <dl>
        {[
          { key: 'temperature' as const, value: `${trial.temperature} °C` },
          { key: 'water' as const, value: `${trial.water} mL` },
          { key: 'sugar' as const, value: `${trial.sugar} g` },
          { key: 'stirring' as const, value: `${trial.stirring} / min` },
          {
            key: 'grains' as const,
            value: label(
              trial.grains === 'fine'
                ? t('细颗粒', 'Fine')
                : t('粗颗粒', 'Coarse'),
              mode,
            ),
          },
        ].map((item) => (
          <div key={item.key}>
            <dt>
              <Localized mode={mode} text={variableNames[item.key]} />
            </dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
      <p>
        <Localized
          mode={mode}
          text={t(
            '三次颗粒不再可见的时间',
            'Three times until grains were no longer visible',
          )}
        />
        : {trial.seconds.join(' / ')} s
      </p>
    </div>
  );
}

function FairComparisonLab({ mode }: { mode: LanguageMode }) {
  const [target, setTarget] = useState<'temperature' | 'stirring'>(
    'temperature',
  );
  const [index, setIndex] = useState(1);
  const [prediction, setPrediction] = useState<boolean | null>(null);
  const a = dissolvingTrials[0]!;
  const b = dissolvingTrials[index]!;
  const changed = changedDissolvingVariables(a, b);
  const fair = isolatesDissolvingVariable(a, b, target);
  return (
    <div className="ionic-lab chem-evidence-lab" data-evidence-lab="comparison">
      <p className="chem-evidence-record">
        <Localized
          mode={mode}
          text={t(
            '以下均为虚构教学记录：同种材料、同一观察终点与仪器，假定未列出的条件一致、各记录温度维持不变。不是溶解时间预测器。',
            'These are authored teaching records: the same materials, endpoint and apparatus, with unlisted conditions held equal and each stated temperature maintained. This is not a dissolving-time predictor.',
          )}
        />
      </p>
      <div className="ionic-controls">
        <label className="ionic-control">
          <Localized
            mode={mode}
            text={t(
              '要研究哪一个条件？',
              'Which condition are you investigating?',
            )}
          />
          <select
            aria-label="Target variable"
            value={target}
            onChange={(e) => {
              setTarget(e.target.value as typeof target);
              setPrediction(null);
            }}
          >
            {(['temperature', 'stirring'] as const).map((key) => (
              <option key={key} value={key}>
                {label(variableNames[key], mode)}
              </option>
            ))}
          </select>
        </label>
        <label className="ionic-control">
          <Localized
            mode={mode}
            text={t('用 A 与哪份记录比较？', 'Compare A with which record?')}
          />
          <select
            aria-label="Comparison record"
            value={index}
            onChange={(e) => {
              setIndex(Number(e.target.value));
              setPrediction(null);
            }}
          >
            {dissolvingTrials.map((item, i) => (
              <option key={item.id} value={i}>
                {item.id}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="chem-evidence-pair">
        <TrialCard trial={a} mode={mode} />
        <TrialCard trial={b} mode={mode} />
      </div>
      <p>
        <Localized
          mode={mode}
          text={t(
            '这组比较是否只改变了选定的研究条件？',
            'Does this comparison change only the chosen target condition?',
          )}
        />
      </p>
      <div className="ionic-choices">
        {[true, false].map((choice) => (
          <button
            type="button"
            key={String(choice)}
            aria-pressed={prediction === choice}
            onClick={() => setPrediction(choice)}
          >
            <Localized
              mode={mode}
              text={
                choice
                  ? t('可以隔离目标条件', 'It isolates the target')
                  : t('不能隔离目标条件', 'It does not isolate the target')
              }
            />
          </button>
        ))}
      </div>
      {prediction !== null && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                prediction === fair
                  ? t(
                      '判断与条件表一致',
                      'Your judgment matches the conditions',
                    )
                  : t(
                      '先逐列比较，再看时间',
                      'Compare conditions column by column before the times',
                    )
              }
            />
          </strong>
          <p>
            <Localized
              mode={mode}
              text={t('发生变化的条件', 'Changed conditions')}
            />
            :{' '}
            {changed.length
              ? changed
                  .map((key) => label(variableNames[key], mode))
                  .join(' · ')
              : label(t('没有变化', 'None'), mode)}
          </p>
          {fair ? (
            <p>
              <Localized
                mode={mode}
                text={t(
                  '这组给定记录只改变目标条件。三次记录的平均时间为',
                  'These supplied records vary only the target. The three-repeat mean times are',
                )}
              />{' '}
              A: {readingStats(a.seconds).mean.toFixed(1)} s / {b.id}:{' '}
              {readingStats(b.seconds).mean.toFixed(1)} s.{' '}
              <Localized
                mode={mode}
                text={t(
                  '这支持本比较的有限结论，不能外推为任意材料与条件下的规律。',
                  'This supports a limited conclusion for the comparison, not a universal rule for all materials and conditions.',
                )}
              />
            </p>
          ) : (
            <p>
              <Localized
                mode={mode}
                text={t(
                  '时间不同不能修复不公平的设计；目标没有变化或多个条件同时变化，都不能单独归因给目标。',
                  'Different times cannot repair the design. An unchanged target or multiple changed conditions prevents attribution to that target alone.',
                )}
              />
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function MeasurementLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0);
  const [prediction, setPrediction] = useState<string | null>(null);
  const record = balanceRecords[index]!;
  const stats = readingStats(record.readings);
  const digits = record.resolution === 1 ? 0 : 1;
  const claims = [
    {
      id: 'near',
      title: t('较集中且接近给定参考', 'Tight and near the supplied reference'),
    },
    {
      id: 'shifted',
      title: t('较集中却整体偏高', 'Tight but consistently high'),
    },
    {
      id: 'spread',
      title: t(
        '平均接近，单次波动较大',
        'Mean near reference, individual spread wider',
      ),
    },
    {
      id: 'coarse',
      title: t(
        '显示较粗，可能掩盖小变化',
        'Coarse display may hide small changes',
      ),
    },
  ];
  return (
    <div
      className="ionic-lab chem-evidence-lab"
      data-evidence-lab="measurement"
    >
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t(
            '选择同一参考样品的五次读数',
            'Choose five readings of the same reference sample',
          )}
        />
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setPrediction(null);
          }}
        >
          {balanceRecords.map((item, i) => (
            <option key={item.id} value={i}>
              {label(t('记录', 'Record'), mode)} {String.fromCharCode(65 + i)}
            </option>
          ))}
        </select>
      </label>
      <div className="ionic-receipt">
        <span>
          <Localized
            mode={mode}
            text={t(
              '题目给定的参考质量',
              'Reference mass supplied by the task',
            )}
          />
          : {record.reference.toFixed(1)} g
        </span>
        <span>
          <Localized mode={mode} text={t('显示分辨率', 'Display resolution')} />
          : {record.resolution} g
        </span>
        <Localized
          mode={mode}
          text={t(
            '虚构记录，不是仪器现场采样。所有图使用同一 9–11 g 标尺。',
            'Authored records, not live instrument samples. Every plot uses the same 9–11 g scale.',
          )}
        />
      </div>
      <div className="chem-evidence-readings">
        <div className="chem-evidence-axis">
          <span>9 g</span>
          <span>10 g</span>
          <span>11 g</span>
        </div>
        {record.readings.map((value, i) => (
          <div key={i} className="chem-evidence-reading">
            <span>
              {i + 1}: {value.toFixed(digits)} g
            </span>
            <div className="chem-evidence-track">
              <span className="chem-evidence-reference" />
              <span
                className="chem-evidence-dot"
                style={{ left: `${((value - 9) / 2) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p>
        <Localized
          mode={mode}
          text={t(
            '哪句话最符合这份记录？',
            'Which description best fits these records?',
          )}
        />
      </p>
      <div className="ionic-choices">
        {claims.map((claim) => (
          <button
            key={claim.id}
            type="button"
            aria-pressed={prediction === claim.id}
            onClick={() => setPrediction(claim.id)}
          >
            <Localized mode={mode} text={claim.title} />
          </button>
        ))}
      </div>
      {prediction !== null && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                prediction === record.claim
                  ? t(
                      '判断与完整读数一致',
                      'Your judgment fits all the readings',
                    )
                  : t(
                      '同时看平均、波动、参考值与分辨率',
                      'Consider mean, spread, reference and resolution together',
                    )
              }
            />
          </strong>
          <p>
            <Localized mode={mode} text={record.explanation} />
          </p>
          <dl className="chem-evidence-stats">
            <div>
              <dt>
                <Localized mode={mode} text={t('均值', 'Mean')} />
              </dt>
              <dd>{stats.mean.toFixed(digits)} g</dd>
            </div>
            <div>
              <dt>
                <Localized
                  mode={mode}
                  text={t('最大 − 最小', 'Maximum − minimum')}
                />
              </dt>
              <dd>{stats.spread.toFixed(digits)} g</dd>
            </div>
            <div>
              <dt>
                <Localized
                  mode={mode}
                  text={t('均值 − 参考', 'Mean − reference')}
                />
              </dt>
              <dd>{(stats.mean - record.reference).toFixed(digits)} g</dd>
            </div>
          </dl>
        </div>
      )}
      <details>
        <summary>
          <Localized
            mode={mode}
            text={t(
              '这些数还不能告诉我们什么？',
              'What do these numbers not establish?',
            )}
          />
        </summary>
        <p>
          <Localized
            mode={mode}
            text={t(
              '本入门活动把均值报告到与单次显示相同的小数位，不估算均值的不确定度。最大最小范围不是完整不确定度；重复不会自动消除系统偏差。参考值按题目给定，真实校准还需考虑参考本身的不确定度。',
              'This introductory activity reports the mean to the same decimal place as the display, without estimating uncertainty of the mean. The observed range is not a complete uncertainty, and repetition does not automatically remove bias. Real calibration also considers uncertainty of the reference itself.',
            )}
          />
        </p>
      </details>
    </div>
  );
}

function MassBoundaryLab({ mode }: { mode: LanguageMode }) {
  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(4);
  const [closed, setClosed] = useState(true);
  const [prediction, setPrediction] = useState<string | null>(null);
  const sample = massBoundaryCases[index]!;
  const result = massBoundaryLedger(sample, step, closed);
  const answer =
    result.readingG === result.initialReadingG
      ? 'same'
      : result.readingG < result.initialReadingG
        ? 'less'
        : 'more';
  return (
    <div
      className="ionic-lab chem-evidence-lab"
      data-evidence-lab="mass-boundary"
    >
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t('选择虚拟质量记录', 'Choose a virtual mass record')}
        />
        <select
          value={index}
          onChange={(e) => {
            setIndex(Number(e.target.value));
            setPrediction(null);
          }}
        >
          {massBoundaryCases.map((item, i) => (
            <option key={item.id} value={i}>
              {label(item.title, mode)}
            </option>
          ))}
        </select>
      </label>
      <p>
        <Localized mode={mode} text={sample.description} />
      </p>
      <div className="ionic-choices">
        {[true, false].map((value) => (
          <button
            key={String(value)}
            type="button"
            aria-pressed={closed === value}
            onClick={() => {
              setClosed(value);
              setPrediction(null);
            }}
          >
            <Localized
              mode={mode}
              text={
                value
                  ? t('封闭边界：气体留在内部', 'Closed: gas stays inside')
                  : t('开放边界：气体移到外部', 'Open: gas moves outside')
              }
            />
          </button>
        ))}
      </div>
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t(
            '模型记录位置（不是时间）',
            'Model record position (not time)',
          )}
        />
        : {step + 1}/5
        <input
          type="range"
          aria-label="Mass record position"
          min="0"
          max="4"
          step="1"
          value={step}
          onChange={(e) => {
            setStep(Number(e.target.value));
            setPrediction(null);
          }}
        />
      </label>
      <div className="ionic-receipt">
        <Localized mode={mode} text={t('起始称量', 'Initial weighing')} />
        <b>
          {result.containerG} g + {result.matterG} g = {result.initialReadingG}{' '}
          g
        </b>
        <Localized
          mode={mode}
          text={t(
            '容器 + 所有起始材料；本模型没有外部材料进入。',
            'Container + all starting materials; nothing enters from outside in this model.',
          )}
        />
      </div>
      <p>
        <Localized
          mode={mode}
          text={t(
            '到这条记录时，只称容器与边界内物质，读数比起始怎样？',
            'At this record, how does weighing only the vessel and its contents compare with the start?',
          )}
        />
      </p>
      <div className="ionic-choices">
        {[
          { id: 'less', title: t('较小', 'Lower') },
          { id: 'same', title: t('相同', 'Same') },
          { id: 'more', title: t('较大', 'Higher') },
        ].map((choice) => (
          <button
            key={choice.id}
            type="button"
            aria-pressed={prediction === choice.id}
            onClick={() => setPrediction(choice.id)}
          >
            <Localized mode={mode} text={choice.title} />
          </button>
        ))}
      </div>
      {prediction !== null && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                prediction === answer
                  ? t(
                      '称量边界与预测一致',
                      'The weighing boundary supports your prediction',
                    )
                  : t(
                      '再检查气体是否仍在称量范围内',
                      'Check whether the gas is still inside the weighing boundary',
                    )
              }
            />
          </strong>
          <div className="chem-evidence-boundaries">
            <div className="chem-evidence-inside">
              <strong>
                <Localized
                  mode={mode}
                  text={t('称量范围内', 'Inside the weighing boundary')}
                />
              </strong>
              <span>
                <Localized
                  mode={mode}
                  text={t('非气相材料', 'Nongaseous material')}
                />
                : {result.insideMaterialG.toFixed(1)} g
              </span>
              <span>
                <Localized mode={mode} text={t('气体', 'Gas')} />:{' '}
                {result.insideGasG.toFixed(1)} g
              </span>
              <span>
                <Localized mode={mode} text={t('容器', 'Container')} />:{' '}
                {result.containerG.toFixed(1)} g
              </span>
              <b>{result.readingG.toFixed(1)} g</b>
            </div>
            <div className="chem-evidence-outside">
              <strong>
                <Localized
                  mode={mode}
                  text={t('边界外仍要记账', 'Still accounted for outside')}
                />
              </strong>
              <span>
                <Localized
                  mode={mode}
                  text={t('移出的气体', 'Gas moved outside')}
                />
                : {result.outsideGasG.toFixed(1)} g
              </span>
            </div>
          </div>
          <p>
            <Localized
              mode={mode}
              text={t(
                '只算容器内物质，需扣除容器质量',
                'To report contents only, subtract the container mass',
              )}
            />
            : {result.readingG.toFixed(1)} − {result.containerG.toFixed(1)} ={' '}
            {result.contentsG.toFixed(1)} g
          </p>
          <p>
            <Localized
              mode={mode}
              text={t('整个账本（内 + 外）', 'Full ledger (inside + outside)')}
            />
            : {result.readingG.toFixed(1)} + {result.outsideGasG.toFixed(1)} ={' '}
            {result.totalAccountedG.toFixed(1)} g
          </p>
        </div>
      )}
      <details>
        <summary>
          <Localized
            mode={mode}
            text={t(
              '理想记录与现实测量的区别',
              'Ideal records and real measurements',
            )}
          />
        </summary>
        <p>
          <Localized
            mode={mode}
            text={t(
              '这些数由本课编写，模型忽略仪器误差、浮力、泄漏与洒出；图不按体积比例。真实质量差还可能有多种原因，不能只凭差值认定产气。其他开放体系也可能有外部气体进入而增重。封闭产气仅为虚拟比较，不进行家庭密封反应实验。',
              'These authored records omit instrument errors, buoyancy, leaks and spills; diagrams are not to volume scale. A real mass difference can have several causes and alone does not prove gas formation. Other open systems may gain mass when gas enters. Closed gas formation is a virtual comparison, not a home sealed-reaction experiment.',
            )}
          />
        </p>
      </details>
    </div>
  );
}

export default function ScienceEvidenceLab({
  kind,
  mode,
}: {
  kind:
    | 'observation-inference-lab'
    | 'fair-comparison-basics-lab'
    | 'measurement-evidence-lab'
    | 'mass-boundary-basics-lab';
  mode: LanguageMode;
}) {
  if (kind === 'observation-inference-lab')
    return <ObservationLab mode={mode} />;
  if (kind === 'fair-comparison-basics-lab')
    return <FairComparisonLab mode={mode} />;
  if (kind === 'measurement-evidence-lab')
    return <MeasurementLab mode={mode} />;
  return <MassBoundaryLab mode={mode} />;
}
