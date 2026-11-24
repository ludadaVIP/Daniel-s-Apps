import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Localized } from '@study/ui';
import {
  candidatePicture,
  dissolvingPicture,
  dissolvingStages,
  phaseCandidates,
  phaseFeedback,
  waterPicture,
  type ParticleMark,
  type DiagramClaim,
} from './particleEvidence';
import './IonicReactionLabs.css';
import './ParticleEvidenceLabs.css';
const t = (zh: string, en: string): LocalizedText => ({ zh, en });
const label = (text: LocalizedText, mode: LanguageMode) =>
  mode === 'bilingual' ? `${text.zh} / ${text.en}` : text[mode];

function Picture({
  marks,
  mode,
  title,
  includeSugar = false,
}: {
  marks: ParticleMark[];
  mode: LanguageMode;
  title: LocalizedText;
  includeSugar?: boolean;
}) {
  const w = marks.filter((p) => p.species === 'W').length;
  const s = marks.filter((p) => p.species === 'S').length;
  return (
    <figure className="chem-particle-picture">
      <figcaption>
        <Localized text={title} mode={mode} />
      </figcaption>
      <svg
        viewBox="0 0 240 200"
        role="img"
        aria-label={`${label(title, mode)}: W ${w}${includeSugar ? `, S ${s}` : ''}`}
      >
        <rect
          x="2"
          y="2"
          width="236"
          height="196"
          rx="12"
          fill="#f7fbfc"
          stroke="#8caeae"
          strokeWidth="2"
        />
        {marks.map((p) => (
          <g key={p.id} data-species={p.species}>
            {p.species === 'W' ? (
              <circle
                cx={p.x}
                cy={p.y}
                r={p.radius}
                fill="#d6edf4"
                stroke="#3b7488"
              />
            ) : (
              <rect
                x={p.x - p.radius}
                y={p.y - p.radius}
                width={2 * p.radius}
                height={2 * p.radius}
                rx="2"
                fill="#f7e7bb"
                stroke="#85631c"
              />
            )}
            <text
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fill="#193f4d"
              fontSize="12"
              fontFamily="sans-serif"
              aria-hidden="true"
            >
              {p.species}
            </text>
          </g>
        ))}
      </svg>
      <p className="chem-particle-count">
        W: {w}
        {includeSugar && <> · S: {s}</>}
      </p>
    </figure>
  );
}
function ModelKey({
  mode,
  sugar = false,
}: {
  mode: LanguageMode;
  sugar?: boolean;
}) {
  return (
    <div className="ionic-receipt">
      <Localized
        mode={mode}
        text={
          sugar
            ? t(
                '图例：圆圈 W 代表水分子，方框 S 代表糖分子；不是液滴或糖粒。W/S 只是本课标签，不是水和糖的化学式。图仅作示意，不按真实大小、数量比例绘制。',
                'Key: circle W represents a water molecule; square S a sugar molecule, not a droplet or grain. W/S are lesson labels, not chemical formulas. Sizes and counts are schematic, not real proportions.',
              )
            : t(
                '图例：圆圈 W 代表水分子，不是水滴或气泡。W 只是本课标签，不是水的化学式。图仅作示意，不按真实大小、数量比例绘制，也不是运动轨迹。',
                'Key: circle W represents a water molecule, not a droplet or bubble. W is a lesson label, not water’s chemical formula. Sizes and counts are schematic, not real proportions or motion paths.',
              )
        }
      />
    </div>
  );
}
function PhasePictureLab({ mode }: { mode: LanguageMode }) {
  const [phase, setPhase] = useState<'gas' | 'solid'>('gas');
  const [choice, setChoice] = useState<DiagramClaim | null>(null);
  return (
    <div className="ionic-lab chem-particle-lab" data-particle-lab="phase">
      <ModelKey mode={mode} />
      <label className="ionic-control">
        <Localized
          text={t(
            '同一份水，封闭范围内，没有化学反应',
            'The same water, closed boundary, no chemical reaction',
          )}
          mode={mode}
        />
        <select
          aria-label={label(t('目标状态', 'Target state'), mode)}
          value={phase}
          onChange={(e) => {
            setPhase(e.target.value as 'gas' | 'solid');
            setChoice(null);
          }}
        >
          <option value="gas">
            {label(t('液态 → 气态', 'Liquid → gas'), mode)}
          </option>
          <option value="solid">
            {label(t('液态 → 固态', 'Liquid → solid'), mode)}
          </option>
        </select>
      </label>
      <div className="chem-particle-start">
        <Picture
          mode={mode}
          marks={waterPicture('liquid')}
          title={t('变化前：液态水', 'Before: liquid water')}
        />
      </div>
      <h3>
        <Localized
          text={t(
            '哪张“变化后”图符合粒子账本？先比较，再选。',
            'Which “after” picture fits the particle ledger? Compare before choosing.',
          )}
          mode={mode}
        />
      </h3>
      <div className="chem-particle-candidates">
        {phaseCandidates[phase].map((claim, index) => (
          <div key={claim} className="chem-particle-candidate">
            <Picture
              mode={mode}
              marks={candidatePicture(phase, claim)}
              title={t(`候选 ${'ABC'[index]}`, `Candidate ${'ABC'[index]}`)}
            />
            <button
              type="button"
              aria-pressed={choice === claim}
              onClick={() => setChoice(claim)}
            >
              {label(t('选择', 'Choose'), mode)} {'ABC'[index]}
            </button>
          </div>
        ))}
      </div>
      {choice !== null && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                choice === 'conserved'
                  ? t(
                      '数量、身份和符号大小都保留了',
                      'Number, identity and symbol size are preserved',
                    )
                  : t('再核对一次同一份水', 'Recheck the same water sample')
              }
            />
          </strong>
          <Localized mode={mode} text={phaseFeedback[choice]} />
          <Localized
            mode={mode}
            text={
              phase === 'solid'
                ? t(
                    '固态图用有序排列表示位置约束。固体分子仍会振动；静止截图不表示完全不动。这里不按比例表示冰与液态水的密度，冰并不比液态水排列得更密。',
                    'The ordered solid picture indicates constrained positions. Solid molecules still vibrate; a still image does not mean no motion. Ice and liquid-water densities are not drawn to scale; ice is not more densely packed than liquid water.',
                  )
                : t(
                    '气态图主要显示分子间距变大。水蒸气仍是水，不是氧气与氢气；本图不预测温度、压力或何时全部汽化。',
                    'The gas picture mainly shows greater intermolecular spacing. Water vapour remains water, not oxygen and hydrogen. This diagram predicts neither temperature, pressure nor when vaporisation completes.',
                  )
            }
          />
        </div>
      )}
    </div>
  );
}
function DissolvingPictureLab({ mode }: { mode: LanguageMode }) {
  const [stage, setStage] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const frame = dissolvingStages[stage]!;
  const picture = dissolvingPicture(stage);
  return (
    <div className="ionic-lab chem-particle-lab" data-particle-lab="dissolving">
      <ModelKey mode={mode} sugar />
      <label className="ionic-control">
        <Localized
          mode={mode}
          text={t(
            '沿同一份糖水追踪，不是计时模拟',
            'Follow one sugar–water sample; this is not a timed simulation',
          )}
        />
        <select
          aria-label={label(t('过程记录', 'Process record'), mode)}
          value={stage}
          onChange={(e) => {
            setStage(Number(e.target.value));
            setChoice(null);
          }}
        >
          {dissolvingStages.map((item, i) => (
            <option key={i} value={i}>
              {i + 1}. {label(item.title, mode)}
            </option>
          ))}
        </select>
      </label>
      <div className="chem-particle-compartments">
        <Picture
          marks={picture.inside}
          includeSugar
          mode={mode}
          title={
            stage === 2
              ? t('滤液：已通过滤纸', 'Filtrate: through the paper')
              : t('容器内', 'Inside the vessel')
          }
        />
        <Picture
          marks={picture.outside}
          includeSugar
          mode={mode}
          title={t(
            '范围外：累计离开的水',
            'Outside: water accounted for cumulatively',
          )}
        />
        {stage === 2 && (
          <Picture
            marks={picture.filter}
            includeSugar
            mode={mode}
            title={t(
              '滤纸上：忽略附着损失',
              'On paper: ignoring adhesion losses',
            )}
          />
        )}
      </div>
      <p>
        <Localized
          mode={mode}
          text={t(
            '外框是记录范围，不是同体积容器；外部水蒸气示意也不按真实间距。过滤阶段仅追踪溶液中已溶解的糖。',
            'Boxes indicate accounting regions, not equal-volume containers; outside vapour spacing is schematic too. Filtration follows only sugar already dissolved in the solution.',
          )}
        />
      </p>
      <h3>
        <Localized mode={mode} text={frame.question} />
      </h3>
      <div className="ionic-choices">
        {frame.options.map((item, i) => (
          <button
            type="button"
            key={i}
            aria-pressed={choice === i}
            onClick={() => setChoice(i)}
          >
            <Localized mode={mode} text={item} />
          </button>
        ))}
      </div>
      {choice !== null && (
        <div className="ionic-result" role="status">
          <strong>
            <Localized
              mode={mode}
              text={
                choice === frame.answer
                  ? t(
                      '解释与这份库存一致',
                      'The explanation matches this inventory',
                    )
                  : t('再追踪 W 和 S 的去向', 'Trace W and S again')
              }
            />
          </strong>
          <Localized mode={mode} text={frame.explanation} />
          <p>
            <Localized
              mode={mode}
              text={t('所有范围合计', 'All regions combined')}
            />
            : W{' '}
            {picture.inside.filter((p) => p.species === 'W').length +
              picture.outside.length}{' '}
            · S {picture.inside.filter((p) => p.species === 'S').length}
          </p>
        </div>
      )}
    </div>
  );
}
export default function ParticleEvidenceLab({
  kind,
  mode,
}: {
  kind: 'phase-particle-evidence-lab' | 'dissolving-particle-evidence-lab';
  mode: LanguageMode;
}) {
  return kind === 'phase-particle-evidence-lab' ? (
    <PhasePictureLab mode={mode} />
  ) : (
    <DissolvingPictureLab mode={mode} />
  );
}
