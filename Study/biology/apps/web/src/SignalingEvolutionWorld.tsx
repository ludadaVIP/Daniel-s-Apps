import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { Playback, useFrames } from './LabPlayback';
import {
  alleleCounts,
  evolutionFrames,
  feedbackFrames,
  hardyWeinberg,
  immuneFrames,
  mean,
  signalFrames,
  spikeTrain,
  traitData,
} from './signalingEvolutionModel';
import './signalingEvolution.css';

type ArtProps = { id: string; mode: LanguageMode };
type ExploreProps = ArtProps & { onExplore: () => void };
const choose = (mode: LanguageMode, z: string, e: string) =>
  mode === 'en' ? e : z;
const titles: Record<string, LocalizedText> = {
  L129: t('门外的信号，门内的条件', 'Outside signals, inside conditions'),
  L130: t('等高的峰，不同的频率', 'Equal peaks, different frequencies'),
  L131: t('偏差如何回到控制器', 'How deviation returns to a controller'),
  L132: t('协作网络中的分工', 'Roles in a cooperating network'),
  L133: t('先数个体，再数拷贝', 'Count organisms, then allele copies'),
  L134: t('同一起点，不同演化过程', 'One starting point, different processes'),
  L135: t('旋转枝条，不改变亲缘', 'Rotate branches, retain relationships'),
  L136: t('把品系和环境交叉比较', 'Cross lineages with environments'),
};
function Label({
  x,
  y,
  text,
  mode,
}: {
  x: number;
  y: number;
  text: LocalizedText;
  mode: LanguageMode;
}) {
  return (
    <text x={x} y={y} textAnchor="middle" className="se-label">
      {mode !== 'en' && <tspan x={x}>{text.zh}</tspan>}
      {mode !== 'zh' && (
        <tspan x={x} dy={mode === 'bilingual' ? 22 : 0}>
          {text.en}
        </tspan>
      )}
    </text>
  );
}
function Node({
  x,
  y,
  text,
  mode,
  active = true,
  w = 150,
}: {
  x: number;
  y: number;
  text: LocalizedText;
  mode: LanguageMode;
  active?: boolean;
  w?: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={76}
        rx={16}
        fill={active ? '#e1f3ee' : '#f1f0ec'}
        stroke={active ? '#247766' : '#a5aaa5'}
        strokeWidth={2}
      />
      <Label x={x + w / 2} y={y + 30} text={text} mode={mode} />
    </g>
  );
}
function Arrow({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  const a = Math.atan2(y2 - y1, x2 - x1),
    end = `${x2 - 12 * Math.cos(a - 0.5)},${y2 - 12 * Math.sin(a - 0.5)} ${x2},${y2} ${x2 - 12 * Math.cos(a + 0.5)},${y2 - 12 * Math.sin(a + 0.5)}`;
  return (
    <g stroke="#44695e" strokeWidth={3} fill="none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <polyline points={end} />
    </g>
  );
}
function Surface({
  mode,
  label,
  children,
}: {
  mode: LanguageMode;
  label: LocalizedText;
  children: ReactNode;
}) {
  return (
    <>
      <p className="se-scroll-hint">
        <Text
          mode={mode}
          text={t(
            '图可横向滚动；聚焦后用方向键查看。图为原创教学示意，非比例图。',
            'Scroll the diagram horizontally; focus it and use arrow keys. Original teaching schematic, not to scale.',
          )}
        />
      </p>
      <div
        className="se-scroll"
        tabIndex={0}
        role="region"
        aria-label={choose(mode, label.zh, label.en)}
      >
        <svg
          viewBox="0 0 780 430"
          role="img"
          aria-label={choose(mode, label.zh, label.en)}
        >
          <title>{choose(mode, label.zh, label.en)}</title>
          {children}
        </svg>
      </div>
    </>
  );
}
function Plot({
  values,
  min,
  max,
  mode,
  axis,
  totalSteps,
  color = '#247766',
}: {
  values: number[];
  min: number;
  max: number;
  mode: LanguageMode;
  axis: LocalizedText;
  totalSteps?: number;
  color?: string;
}) {
  const point = (v: number, i: number) =>
    `${95 + (i * 600) / Math.max(1, totalSteps ?? values.length - 1)},${330 - ((v - min) * 200) / (max - min)}`;
  return (
    <g>
      <line x1={95} y1={130} x2={95} y2={330} stroke="#6b7770" />
      <line x1={95} y1={330} x2={695} y2={330} stroke="#6b7770" />
      <text x={74} y={139} textAnchor="end">
        {max}
      </text>
      <text x={74} y={332} textAnchor="end">
        {min}
      </text>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={4}
        points={values.map(point).join(' ')}
      />
      {values.map((value, i) => (
        <circle
          key={i}
          cx={95 + (i * 600) / Math.max(1, totalSteps ?? values.length - 1)}
          cy={330 - ((value - min) * 200) / (max - min)}
          r={values.length > 20 ? 0 : 4}
          fill={color}
        />
      ))}
      <Label x={390} y={380} text={axis} mode={mode} />
    </g>
  );
}
type DrawingProps = ArtProps & {
  frame?: number;
  receptor?: boolean;
  relay?: boolean;
  strong?: boolean;
  gain?: number;
  delay?: number;
  helper?: boolean;
  cd8?: boolean;
  counts?: number[];
  path?: number[];
  rotated?: boolean;
  molecular?: boolean;
  interaction?: boolean;
};
function Drawing({
  id,
  mode,
  frame = 10,
  receptor = true,
  relay = true,
  strong = false,
  gain = 0.3,
  delay = 0,
  helper = true,
  cd8 = true,
  counts = [20, 40, 40],
  path,
  rotated = false,
  molecular = false,
  interaction = false,
}: DrawingProps) {
  let art: ReactNode;
  if (id === 'L129') {
    const state = signalFrames(receptor, relay)[Math.min(frame, 3)]!;
    art = (
      <>
        <path d="M255 75V330 M275 75V330" stroke="#d8ad62" strokeWidth={8} />
        <Label x={140} y={55} text={t('细胞外', 'Outside')} mode={mode} />
        <Label x={560} y={55} text={t('细胞内', 'Inside')} mode={mode} />
        <circle cx={120} cy={155} r={22} fill="#eeb85e" />
        <Label
          x={120}
          y={220}
          text={t('信号分子', 'Signal molecule')}
          mode={mode}
        />
        <Node
          x={190}
          y={255}
          text={t('受体结合', 'Receptor binding')}
          mode={mode}
          active={state.bound}
        />
        <Node
          x={385}
          y={255}
          text={t('胞内传导', 'Internal relay')}
          mode={mode}
          active={state.relay}
        />
        <Node
          x={580}
          y={255}
          text={t('细胞响应', 'Cell response')}
          mode={mode}
          active={state.response}
        />
        <Arrow x1={144} y1={155} x2={250} y2={245} />
        <Arrow x1={345} y1={293} x2={380} y2={293} />
        <Arrow x1={540} y1={293} x2={575} y2={293} />
        <Label
          x={520}
          y={155}
          text={t('亮色表示本步骤已激活', 'Colour marks active steps')}
          mode={mode}
        />
      </>
    );
  } else if (id === 'L130') {
    const series = spikeTrain(strong);
    art = (
      <>
        <Label
          x={390}
          y={38}
          text={t(
            '膜电位 / mV · 100 ms窗口',
            'Membrane potential / mV · 100 ms window',
          )}
          mode={mode}
        />
        <Plot
          values={series.map((p) => p.mv)}
          min={-80}
          max={30}
          axis={t('时间 / ms：0 → 100', 'Time / ms: 0 → 100')}
          mode={mode}
        />
        <text x={585} y={100}>
          {strong ? '5 / 0.1 s = 50 Hz' : '2 / 0.1 s = 20 Hz'}
        </text>
      </>
    );
  } else if (id === 'L131') {
    const values = feedbackFrames(gain, delay).slice(
      0,
      Math.min(frame, 10) + 1,
    );
    art = (
      <>
        <Label
          x={390}
          y={38}
          text={t(
            '偏差 x / 任意单位，目标 x = 0',
            'Deviation x / arbitrary units; target x = 0',
          )}
          mode={mode}
        />
        <line
          x1={95}
          y1={263.3}
          x2={695}
          y2={263.3}
          stroke="#9d6f32"
          strokeDasharray="6 5"
        />
        <Plot
          values={values}
          min={-5}
          max={10}
          totalSteps={10}
          axis={t(
            '模型步：0 → 10（不是分钟）',
            'Model steps: 0 → 10 (not minutes)',
          )}
          mode={mode}
        />
        <text x={160} y={103}>
          x[t+1] = x[t] − k × x[t−d]
        </text>
      </>
    );
  } else if (id === 'L132') {
    const state = immuneFrames(helper, cd8)[Math.min(frame, 4)]!;
    art = (
      <>
        <Node
          x={35}
          y={40}
          text={t('抗原呈递', 'APC presents')}
          mode={mode}
          active={state.presented}
        />
        <Node
          x={255}
          y={40}
          text={t('辅助T细胞', 'Helper T')}
          mode={mode}
          active={state.helper}
        />
        <Arrow x1={190} y1={78} x2={250} y2={78} />
        <Node
          x={475}
          y={40}
          text={t('B → 浆细胞', 'B → plasma cell')}
          mode={mode}
          w={220}
          active={state.plasma}
        />
        <Arrow x1={410} y1={78} x2={470} y2={78} />
        <Node
          x={475}
          y={195}
          text={t('分泌抗体', 'Antibody secreted')}
          mode={mode}
          w={220}
          active={state.antibody}
        />
        <Arrow x1={585} y1={120} x2={585} y2={190} />
        <Node
          x={255}
          y={325}
          text={t('CD8效应细胞', 'CD8 effector')}
          mode={mode}
          active={state.killing}
        />
        <Node
          x={475}
          y={325}
          text={t('感染细胞杀伤', 'Infected-cell killing')}
          mode={mode}
          w={220}
          active={state.killing}
        />
        <Arrow x1={410} y1={363} x2={470} y2={363} />
        <path
          d="M110 120V285H330V320 M330 120V320"
          fill="none"
          stroke="#44695e"
          strokeDasharray="5 5"
          strokeWidth={2}
        />
        <Label
          x={130}
          y={205}
          text={t('协调与呈递', 'Coordination')}
          mode={mode}
        />
      </>
    );
  } else if (id === 'L133') {
    const [AA, Aa, aa] = counts as [number, number, number];
    const c = alleleCounts(AA, Aa, aa);
    art = (
      <>
        {['AA', 'Aa', 'aa'].map((name, i) => (
          <g key={name}>
            <Node
              x={65 + i * 235}
              y={70}
              w={180}
              text={t(
                `${name}：${counts[i]}株`,
                `${name}: ${counts[i]} plants`,
              )}
              mode={mode}
            />
            <circle
              cx={125 + i * 235}
              cy={205}
              r={23}
              fill={i < 2 ? '#247766' : '#e0a64c'}
            />
            <circle
              cx={190 + i * 235}
              cy={205}
              r={23}
              fill={i === 0 ? '#247766' : '#e0a64c'}
            />
            <text x={125 + i * 235} y={212} textAnchor="middle" fill="white">
              {i < 2 ? 'A' : 'a'}
            </text>
            <text x={190 + i * 235} y={212} textAnchor="middle" fill="white">
              {i === 0 ? 'A' : 'a'}
            </text>
          </g>
        ))}
        <Label
          x={390}
          y={290}
          text={t(
            `A拷贝 ${c.A}；a拷贝 ${c.a}；总拷贝 ${c.copies}`,
            `A copies ${c.A}; a copies ${c.a}; total ${c.copies}`,
          )}
          mode={mode}
        />
        <text x={390} y={370} textAnchor="middle">
          p(A) = {c.A}/{c.copies} ={' '}
          {c.p === null ? 'undefined' : c.p.toFixed(3)}
        </text>
      </>
    );
  } else if (id === 'L134') {
    const values = (
      path ?? evolutionFrames({ p: 0.4, N: 20, seed: 17, drift: true })
    ).slice(0, Math.min(frame, 10) + 1);
    art = (
      <>
        <Label
          x={390}
          y={40}
          text={t('A的频率 p，范围0–1', 'Frequency of A, p, bounded by 0–1')}
          mode={mode}
        />
        <Plot
          values={values}
          min={0}
          max={1}
          totalSteps={10}
          axis={t('世代：0 → 10', 'Generation: 0 → 10')}
          mode={mode}
        />
        <text x={170} y={100}>
          p₀ = 0.4 ·{' '}
          {choose(mode, '虚构二倍体植物', 'fictional diploid plants')}
        </text>
      </>
    );
  } else if (id === 'L135') {
    const list = rotated ? ['C', 'D', 'A', 'B'] : ['A', 'B', 'C', 'D'];
    art = (
      <>
        <path
          d="M80 220H215 M215 120V320 M215 120H390 M215 320H390 M390 70V170 M390 270V370 M390 70H590 M390 170H590 M390 270H590 M390 370H590"
          stroke="#247766"
          fill="none"
          strokeWidth={4}
        />
        {list.map((name, i) => (
          <g key={name}>
            <circle cx={590} cy={70 + i * 100} r={8} fill="#e0a64c" />
            <text x={630} y={78 + i * 100}>
              {name}
            </text>
            <text x={690} y={78 + i * 100}>
              {molecular
                ? ['A', 'B'].includes(name)
                  ? 'G'
                  : 'T'
                : ['A', 'B'].includes(name)
                  ? '▲'
                  : '●'}
            </text>
          </g>
        ))}
        <Label
          x={117}
          y={375}
          text={t('共同祖先', 'Common ancestor')}
          mode={mode}
        />
        <Label
          x={390}
          y={33}
          text={
            molecular
              ? t('虚构同源位点证据', 'Toy homologous-site evidence')
              : t('共享衍生特征', 'Shared derived character')
          }
          mode={mode}
        />
      </>
    );
  } else {
    const data = traitData[interaction ? 'interaction' : 'parallel'];
    art = (
      <>
        <Label
          x={390}
          y={35}
          text={t(
            '21天株高 / cm，每格3株',
            'Height at day 21 / cm; 3 plants per cell',
          )}
          mode={mode}
        />
        <line x1={130} y1={130} x2={130} y2={330} stroke="#6b7770" />
        <text x={115} y={136} textAnchor="end">
          22
        </text>
        <text x={115} y={332} textAnchor="end">
          6
        </text>
        {(['A', 'B'] as const).map((lineage, k) => (
          <g key={lineage}>
            <polyline
              points={data[lineage]
                .map((v, i) => `${250 + i * 350},${330 - (mean(v) - 6) * 12.5}`)
                .join(' ')}
              stroke={k ? '#b37729' : '#247766'}
              strokeWidth={4}
              fill="none"
            />
            {data[lineage].flatMap((v, env) =>
              v.map((height, j) => (
                <circle
                  key={`${env}-${j}`}
                  cx={250 + env * 350 + (j - 1) * 12}
                  cy={330 - (height - 6) * 12.5}
                  r={6}
                  fill={k ? '#b37729' : '#247766'}
                />
              )),
            )}
          </g>
        ))}
        <Label
          x={250}
          y={370}
          text={t('较低光照', 'Lower light')}
          mode={mode}
        />
        <Label
          x={600}
          y={370}
          text={t('较高光照', 'Higher light')}
          mode={mode}
        />
        <text x={210} y={96} fill="#247766">
          A
        </text>
        <text x={560} y={96} fill="#b37729">
          B
        </text>
      </>
    );
  }
  return (
    <Surface mode={mode} label={titles[id] ?? titles.L136!}>
      {art}
    </Surface>
  );
}
function Caption({ mode, text }: { mode: LanguageMode; text: LocalizedText }) {
  return (
    <p className="se-evidence" role="status">
      <Text mode={mode} text={text} />
    </p>
  );
}
function Table({
  mode,
  headers,
  rows,
}: {
  mode: LanguageMode;
  headers: LocalizedText[];
  rows: (number | string)[][];
}) {
  return (
    <div
      className="se-table-scroll"
      tabIndex={0}
      role="region"
      aria-label={choose(
        mode,
        '数据表，可横向滚动',
        'Data table; scroll horizontally',
      )}
    >
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i}>
                <Text text={h} mode={mode} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Check({
  mode,
  text,
  checked,
  onChange,
}: {
  mode: LanguageMode;
  text: LocalizedText;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="se-check">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <Text mode={mode} text={text} />
    </label>
  );
}
function SignalLab({ id, mode, onExplore }: ExploreProps) {
  const [receptor, setReceptor] = useState(true),
    [relay, setRelay] = useState(true),
    flow = useFrames(3, onExplore);
  return (
    <>
      <Check
        mode={mode}
        text={t('有匹配受体', 'Matching receptor present')}
        checked={receptor}
        onChange={(v) => {
          setReceptor(v);
          flow.reset();
          onExplore();
        }}
      />
      <Check
        mode={mode}
        text={t('下游传导可工作', 'Downstream relay works')}
        checked={relay}
        onChange={(v) => {
          setRelay(v);
          flow.reset();
          onExplore();
        }}
      />
      <Drawing
        id={id}
        mode={mode}
        frame={flow.frame}
        receptor={receptor}
        relay={relay}
      />
      <Playback flow={flow} mode={mode} />
      <Caption
        mode={mode}
        text={t(
          '静态路线：信号→匹配受体→胞内传导→响应。关掉下游后，结合仍可发生，响应消失。信号分子留在膜外；并非所有信号都必须进入细胞。',
          'Static route: signal → matching receptor → internal relay → response. With the relay off, binding can occur without a response. This signal remains outside; signals need not enter cells.',
        )}
      />
    </>
  );
}
function NeuronLab({ id, mode, onExplore }: ExploreProps) {
  const [strong, setStrong] = useState(false),
    flow = useFrames(4, onExplore);
  const stages = [
    t(
      '静息：泵维持离子梯度，漏通道也参与膜电位。',
      'Rest: pumps maintain gradients; leak channels also contribute to membrane potential.',
    ),
    t(
      '局部达阈值：电压门控通道使动作电位发生。',
      'Local threshold: voltage-gated channels generate an action potential.',
    ),
    t(
      '相邻膜段再生电位：不是递质沿轴突流动。',
      'Adjacent membrane regenerates the voltage event; transmitter does not flow along the axon.',
    ),
    t(
      '末端释放递质：跨越化学突触并结合突触后受体。',
      'The terminal releases transmitter, which crosses a chemical synapse and binds postsynaptic receptors.',
    ),
    t(
      '突触后整合：不保证每次输入都产生新的动作电位。',
      'Postsynaptic integration: an input need not trigger another action potential.',
    ),
  ];
  return (
    <>
      <Check
        mode={mode}
        checked={strong}
        text={t('较强的持续刺激', 'Stronger sustained stimulus')}
        onChange={(v) => {
          setStrong(v);
          onExplore();
        }}
      />
      <Drawing id={id} mode={mode} strong={strong} frame={flow.frame} />
      <ol
        className="se-process"
        aria-label={choose(mode, '神经信号流程', 'Neural signalling sequence')}
      >
        {[
          t('静息', 'Rest'),
          t('达阈值', 'Threshold'),
          t('轴突再生电位', 'Axonal regeneration'),
          t('末端释放', 'Terminal release'),
          t('突触后整合', 'Postsynaptic integration'),
        ].map((stage, i) => (
          <li key={i} aria-current={i === flow.frame ? 'step' : undefined}>
            <span>{i + 1}</span>
            <Text mode={mode} text={stage} />
          </li>
        ))}
      </ol>
      <Playback flow={flow} mode={mode} />
      <Caption mode={mode} text={stages[flow.frame]!} />
      <p>
        <Text
          mode={mode}
          text={t(
            '静态对照：100 ms中弱2峰、强5峰，峰值都+30 mV，基线−70 mV。波形与流程分开：流程框依次展示静息→阈值→轴突膜电位再生→末端释放→突触后整合；不是递质沿轴突旅行。化学突触方向来自释放位置和受体分布。',
            'Static comparison: 2 versus 5 spikes per 100 ms; both peak at +30 mV from −70 mV. The separate sequence is rest → threshold → axonal voltage regeneration → terminal release → postsynaptic integration, not transmitter travelling down an axon. Release sites and receptor locations establish chemical-synapse direction.',
          )}
        />
      </p>
    </>
  );
}
function FeedbackLab({ id, mode, onExplore }: ExploreProps) {
  const [delayed, setDelayed] = useState(false),
    flow = useFrames(10, onExplore),
    gain = delayed ? 0.6 : 0.3,
    delay = delayed ? 1 : 0,
    values = feedbackFrames(gain, delay);
  return (
    <>
      <Check
        mode={mode}
        checked={delayed}
        text={t('比较高增益＋一步延迟', 'Compare higher gain + one-step delay')}
        onChange={(v) => {
          setDelayed(v);
          flow.reset();
          onExplore();
        }}
      />
      <Drawing
        id={id}
        mode={mode}
        frame={flow.frame}
        gain={gain}
        delay={delay}
      />
      <Playback flow={flow} mode={mode} />
      <Caption
        mode={mode}
        text={t(
          `第${flow.frame}步偏差 ${values[flow.frame]!.toFixed(2)} 任意单位；k=${gain}，d=${delay}。负号表示响应抵消偏差，不表示激素浓度为负。`,
          `Step ${flow.frame}: deviation ${values[flow.frame]!.toFixed(2)} arbitrary units; k=${gain}, d=${delay}. The minus sign opposes deviation; it does not mean negative hormone concentration.`,
        )}
      />
      <Table
        mode={mode}
        headers={[
          t('模型步', 'Model step'),
          t('偏差 / 任意单位', 'Deviation / arbitrary units'),
        ]}
        rows={values.map((v, i) => [i, v.toFixed(2)])}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '表格是静态替代。模型开始前偏差也按10初始化，所以延迟控制器已有旧信息。真实例：血糖升高→胰岛素信号促进摄取/储存并抑制肝糖输出→血糖下降→分泌刺激减弱。失水→渗透浓度上升→ADH增多→肾水重吸收增多→原刺激减弱。本模型不是人体时间或疾病预测。',
            'The table is a static alternative. Pre-start deviation is also initialised to 10, so the delayed controller already has old information. Glucose rises → insulin promotes uptake/storage and suppresses liver glucose output → glucose falls → secretion stimulus decreases. Water loss → osmolarity rises → more ADH → more kidney water reabsorption → initial stimulus decreases. This is not a human timing or disease model.',
          )}
        />
      </p>
    </>
  );
}
function ImmuneLab({ id, mode, onExplore }: ExploreProps) {
  const [helper, setHelper] = useState(true),
    [cd8, setCd8] = useState(true),
    flow = useFrames(4, onExplore);
  return (
    <>
      <Check
        mode={mode}
        text={t(
          '本模型有辅助T细胞帮助',
          'Helper T support present in this model',
        )}
        checked={helper}
        onChange={(v) => {
          setHelper(v);
          flow.reset();
          onExplore();
        }}
      />
      <Check
        mode={mode}
        text={t(
          '已有可工作的CD8效应细胞',
          'Functional CD8 effectors available',
        )}
        checked={cd8}
        onChange={(v) => {
          setCd8(v);
          flow.reset();
          onExplore();
        }}
      />
      <Drawing
        id={id}
        mode={mode}
        frame={flow.frame}
        helper={helper}
        cd8={cd8}
      />
      <Playback flow={flow} mode={mode} />
      <Caption
        mode={mode}
        text={t(
          '静态替代：APC呈递→辅助T帮助→B增殖/浆细胞→抗体；CD8效应细胞杀伤感染细胞。虚线为协调/呈递联系。此处CD8已激活的条件单独控制；不是声称CD8启动无需帮助。抗体结合/中和或标记，不吞噬。',
          'Static route: APC presentation → helper support → B expansion/plasma cells → antibody; CD8 effectors kill infected cells. Dashed lines show presentation/coordination. Activated CD8 availability is controlled separately; this does not claim CD8 activation never needs help. Antibodies bind/neutralise or tag, not engulf.',
        )}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '仅模拟一种需要T帮助的抗体响应；不是全部B细胞激活规则。记忆可加快再响应，保护仍取决于目标、时间和位置，不保证永不感染。',
            'Only one T-dependent antibody response is modelled; this is not a universal B-cell activation rule. Memory can accelerate later responses, but protection depends on target, time and location and does not guarantee no infection.',
          )}
        />
      </p>
    </>
  );
}
function AlleleLab({ id, mode, onExplore }: ExploreProps) {
  const [counts, setCounts] = useState([20, 40, 40]),
    [hwe, setHwe] = useState(false),
    c = alleleCounts(counts[0]!, counts[1]!, counts[2]!);
  return (
    <>
      {['AA', 'Aa', 'aa'].map((name, i) => (
        <label className="se-control" key={name}>
          {name}
          <input
            type="range"
            min={0}
            max={60}
            step={5}
            value={counts[i]}
            aria-label={`${name} ${choose(mode, '植株数', 'plant count')}`}
            onChange={(e) => {
              setCounts(counts.map((v, j) => (j === i ? +e.target.value : v)));
              onExplore();
            }}
          />
          <output>{counts[i]}</output>
        </label>
      ))}
      <Drawing id={id} mode={mode} counts={counts} />
      <Caption
        mode={mode}
        text={t(
          c.N
            ? `N=${c.N}株，p=${c.A}/${c.copies}=${c.p!.toFixed(3)}；q=${c.q!.toFixed(3)}。基因型比例的分母为N，等位基因频率的分母为2N。`
            : '空样本：频率未定义，不是0。',
          c.N
            ? `N=${c.N} plants; p=${c.A}/${c.copies}=${c.p!.toFixed(3)}; q=${c.q!.toFixed(3)}. Genotype proportions use N; allele frequencies use 2N.`
            : 'Empty sample: frequency is undefined, not zero.',
        )}
      />
      <Check
        mode={mode}
        text={t(
          '可选：显示Hardy–Weinberg基准',
          'Optional: show a Hardy–Weinberg benchmark',
        )}
        checked={hwe}
        onChange={(v) => {
          setHwe(v);
          onExplore();
        }}
      />
      {hwe && (
        <>
          <p>
            <Text
              mode={mode}
              text={t(
                '仅在随机交配、群体足够大、无选择/迁移/突变等假设下，用p²、2pq、q²预测基因型比例；它们不是每个实测群体都满足的恒等式。',
                'Under random mating, a sufficiently large population and no selection, migration or mutation, p², 2pq and q² predict genotype proportions. These are not identities that every measured population must satisfy.',
              )}
            />
          </p>
          {c.p !== null && (
            <Table
              mode={mode}
              headers={[
                t('基因型', 'Genotype'),
                t('实测比例', 'Observed fraction'),
                t('假设基准', 'Assumption-based benchmark'),
              ]}
              rows={hardyWeinberg(c.p).map((v, i) => [
                ['AA', 'Aa', 'aa'][i]!,
                (counts[i]! / c.N).toFixed(3),
                v.toFixed(3),
              ])}
            />
          )}
        </>
      )}
    </>
  );
}
function EvolutionLab({ id, mode, onExplore }: ExploreProps) {
  const [selection, setSelection] = useState(false),
    [drift, setDrift] = useState(true),
    [migration, setMigration] = useState(false),
    [large, setLarge] = useState(false),
    [seed, setSeed] = useState(17),
    flow = useFrames(10, onExplore);
  const N = large ? 200 : 20,
    path = evolutionFrames({
      p: 0.4,
      N,
      seed,
      drift,
      selection: selection ? 0.4 : 0,
      migrants: migration ? 10 : 0,
      source: 0.8,
    });
  const toggle = (setter: (v: boolean) => void) => (v: boolean) => {
    setter(v);
    flow.reset();
    onExplore();
  };
  return (
    <>
      <div className="se-options">
        <Check
          mode={mode}
          checked={selection}
          text={t(
            '选择：AA/Aa/aa适合度1.4/1.2/1',
            'Selection: AA/Aa/aa fitness 1.4/1.2/1',
          )}
          onChange={toggle(setSelection)}
        />
        <Check
          mode={mode}
          checked={drift}
          text={t('漂变：随机抽取2N拷贝', 'Drift: sample 2N allele copies')}
          onChange={toggle(setDrift)}
        />
        <Check
          mode={mode}
          checked={migration}
          text={t(
            '每代迁入10株，来源p=0.8',
            '10 migrants per generation; source p=0.8',
          )}
          onChange={toggle(setMigration)}
        />
        <Check
          mode={mode}
          checked={large}
          text={t(
            '大群体N=200（默认20）',
            'Large population N=200 (default 20)',
          )}
          onChange={toggle(setLarge)}
        />
      </div>
      <label className="se-control">
        <Text mode={mode} text={t('随机种子', 'Random seed')} />
        <input
          type="range"
          min={1}
          max={100}
          value={seed}
          onChange={(e) => {
            setSeed(+e.target.value);
            flow.reset();
            onExplore();
          }}
        />
        <output>{seed}</output>
      </label>
      <Drawing id={id} mode={mode} frame={flow.frame} path={path} />
      <Playback flow={flow} mode={mode} />
      <Caption
        mode={mode}
        text={t(
          `第${flow.frame}代 p=${path[flow.frame]!.toFixed(3)}。相同种子及条件可复验；换种子比较轨迹，大N通常波动更小，不保证每条路径都如此。`,
          `Generation ${flow.frame}: p=${path[flow.frame]!.toFixed(3)}. Matching seed and conditions reproduce a run. Compare seeds: large N generally fluctuates less, not necessarily in every realised path.`,
        )}
      />
      <Table
        mode={mode}
        headers={[t('世代', 'Generation'), t('p(A)', 'p(A)')]}
        rows={path.map((v, i) => [i, v.toFixed(3)])}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '静态替代表显示完整轨迹。顺序：选择→迁入混合→随机抽样，子代群体恢复为N株；无突变。迁入先以(Np+Mp来源)/(N+M)加权。若无迁入/突变，漂变和选择不能创造已缺失的等位基因；漂变无目的，也在大群体发生。',
            'The full table is a static alternative. Order: selection → pooled immigration → random sampling; the offspring cohort returns to N plants. No mutation. Immigration uses (Np + M p_source)/(N+M). Without migration/mutation, selection and drift cannot create an absent allele. Drift has no purpose and also occurs in large populations.',
          )}
        />
      </p>
    </>
  );
}
function TreeLab({ id, mode, onExplore }: ExploreProps) {
  const [rotated, setRotated] = useState(false),
    [molecular, setMolecular] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setRotated(!rotated);
          onExplore();
        }}
      >
        <Text
          mode={mode}
          text={t('旋转根部两分支', 'Rotate the two root branches')}
        />
      </button>
      <Check
        mode={mode}
        checked={molecular}
        text={t('切换同源DNA位点证据', 'Show a homologous DNA-site character')}
        onChange={(v) => {
          setMolecular(v);
          onExplore();
        }}
      />
      <Drawing id={id} mode={mode} rotated={rotated} molecular={molecular} />
      <Caption
        mode={mode}
        text={t(
          '旋转前后clade始终为AB、CD、ABCD。A与B共享较近祖先；枝端上下不是先进程度。这里没有时间/变化量标度，枝长不能解释为年龄。符号为虚构特征；单个位点证据薄弱。',
          'The clades remain AB, CD and ABCD after rotation. A and B share a more recent ancestor; vertical order is not progress. Without a time/change scale, branch length cannot give ages. Characters are fictional; a single site is weak evidence.',
        )}
      />
      <Table
        mode={mode}
        headers={[
          t('类群', 'Taxon'),
          t('衍生特征', 'Derived character'),
          t('同源位点', 'Homologous site'),
        ]}
        rows={['A', 'B', 'C', 'D'].map((name, i) => [
          name,
          i < 2 ? '▲' : '●',
          i < 2 ? 'G' : 'T',
        ])}
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '静态对照：((A,B),(C,D))和((C,D),(A,B))表示相同拓扑。形态相似也可能趋同；应比较更多独立性状/同源位点、外群和统计支持。新证据可修订这棵假说树。',
            'Static comparison: ((A,B),(C,D)) and ((C,D),(A,B)) have the same topology. Similar form can arise by convergence. Compare additional independent characters/homologous sites, an outgroup and statistical support; new evidence can revise this hypothesis.',
          )}
        />
      </p>
    </>
  );
}
function TraitLab({ id, mode, onExplore }: ExploreProps) {
  const [interaction, setInteraction] = useState(false),
    data = traitData[interaction ? 'interaction' : 'parallel'];
  return (
    <>
      <Check
        mode={mode}
        checked={interaction}
        text={t(
          '改看品系×环境交互情景',
          'Compare a lineage × environment interaction',
        )}
        onChange={(v) => {
          setInteraction(v);
          onExplore();
        }}
      />
      <Drawing id={id} mode={mode} interaction={interaction} />
      <Table
        mode={mode}
        headers={[
          t('品系', 'Lineage'),
          t('光照', 'Light'),
          t('21天株高 / cm', 'Day-21 height / cm'),
          t('均值 / cm', 'Mean / cm'),
        ]}
        rows={(['A', 'B'] as const).flatMap((lineage) =>
          data[lineage].map((v, i) => [
            lineage,
            choose(mode, i ? '较高' : '较低', i ? 'Higher' : 'Lower'),
            v.join(', '),
            mean(v),
          ]),
        )}
      />
      <Caption
        mode={mode}
        text={
          interaction
            ? t(
                'A均值10→20 cm，B为14→16 cm：环境效应分别+10/+2 cm，排序反转，支持本条件下响应不同。不能只由这四格证明涉及哪些基因。',
                'A means 10→20 cm; B 14→16 cm. Environmental differences are +10/+2 cm and ranking reverses, supporting different responses here. These four cells cannot identify the causal genes.',
              )
            : t(
                'A均值10→16 cm，B为14→20 cm：两品系均+6 cm，品系差保持4 cm。本情景没有显示交互，但不能证明所有环境都无交互。',
                'A means 10→16 cm; B 14→20 cm: both gain 6 cm, with a 4 cm lineage difference. This setting shows no interaction; it cannot rule out interaction in other environments.',
              )
        }
      />
      <p>
        <Text
          mode={mode}
          text={t(
            '四格各3株独立植物，随机分配位置与光照；水/土/温度/21天测量规则相同。连线连接不同处理组均值，不是同一植株同时处在两环境。两品系同时出现在两环境，才避免品系和环境完全混杂。多基因性状可受许多位点及环境影响；遗传率描述特定群体环境中的变异，不是个人命运比例。',
            'Each cell has three independent plants, randomly assigned to light and position with matched water, soil, temperature and day-21 measurements. Lines join distinct treatment-group means, not one plant in both environments simultaneously. Both lineages occur in both environments to avoid complete confounding. Polygenic traits involve multiple loci and environment. Heritability concerns variation in a particular population and environment, not an individual destiny percentage.',
          )}
        />
      </p>
    </>
  );
}
export function SignalingEvolutionDiagram(props: ArtProps) {
  return (
    <section className="bio-s6-lab se-lab">
      <Drawing {...props} />
    </section>
  );
}
export function SignalingEvolutionHookArt(props: ArtProps) {
  return (
    <section className="bio-s6-lab se-lab se-hook">
      <Drawing {...props} />
    </section>
  );
}
export function SignalingEvolutionExplore(props: ExploreProps) {
  const labs: Record<string, (p: ExploreProps) => ReactNode> = {
    L129: SignalLab,
    L130: NeuronLab,
    L131: FeedbackLab,
    L132: ImmuneLab,
    L133: AlleleLab,
    L134: EvolutionLab,
    L135: TreeLab,
    L136: TraitLab,
  };
  const Lab = labs[props.id] ?? TraitLab;
  return (
    <section
      className="bio-s6-lab se-lab"
      aria-label={choose(
        props.mode,
        '信号与进化实验室',
        'Signalling and evolution laboratory',
      )}
    >
      <h3>
        <Text mode={props.mode} text={titles[props.id] ?? titles.L136!} />
      </h3>
      <Lab {...props} />
    </section>
  );
}
