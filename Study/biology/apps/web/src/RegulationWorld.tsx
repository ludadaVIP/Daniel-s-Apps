import { useId, useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { Playback, useFrames } from './LabPlayback';
import {
  detects,
  neuralReach,
  reflexRoute,
  addReflexPart,
  hormoneTarget,
  feedbackSeries,
  thermalResponse,
  glucoseResponse,
  waterResponse,
  type Stimulus,
  type Receptor,
  type PathCondition,
  type ReflexPart,
  type Messenger,
  type CellReceptors,
  type Disturbance,
  type ThermalState,
  type AirMoisture,
  type WaterState,
} from './regulationModel';

type Props = { id: string; mode: LanguageMode; onExplore: () => void };
type FigureProps = {
  mode: LanguageMode;
  frame?: number;
  stimulus?: Stimulus;
  receptor?: Receptor;
  condition?: PathCondition;
  built?: number;
  messenger?: Messenger;
  receptors?: CellReceptors;
  disturbance?: Disturbance;
  enabled?: boolean;
  thermal?: ThermalState;
  air?: AirMoisture;
  water?: WaterState;
};
const green = '#698451',
  blue = '#4b8294',
  gold = '#b38c3f',
  red = '#b87564';
const names = {
  receptor: t('感受器', 'Receptor'),
  sensory: t('感觉神经元', 'Sensory neuron'),
  relay: t('脊髓中间神经元', 'Spinal interneuron'),
  motor: t('运动神经元', 'Motor neuron'),
  muscle: t('肌肉', 'Muscle'),
};
const titles: Record<string, LocalizedText> = {
  L057: t(
    '刺激怎样变成神经信息？',
    'How does a stimulus become a nerve signal?',
  ),
  L058: t('追踪信息的去程与回程', 'Trace incoming and outgoing information'),
  L059: t('搭建缩手反射弧', 'Build a withdrawal reflex arc'),
  L060: t('信使到达，谁会响应？', 'The messenger arrives: who responds?'),
  L061: t(
    '偏离以后，反馈如何作用？',
    'What does feedback do after a disturbance?',
  ),
  L062: t('身体怎样调节热量？', 'How does the body regulate heat?'),
  L063: t('血糖升与降的两条路线', 'Two routes for rising and falling glucose'),
  L064: t(
    '水回到血液，还是留在尿液？',
    'Water returns to blood or stays in urine?',
  ),
};
function Label({
  mode,
  text,
  x,
  y,
  size = 13,
}: {
  mode: LanguageMode;
  text: LocalizedText;
  x: number;
  y: number;
  size?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      fontSize={size}
      fill="#354832"
      stroke="#f0f3e6"
      strokeWidth="3"
      paintOrder="stroke"
    >
      <tspan x={x}>{mode === 'en' ? text.en : text.zh}</tspan>
      {mode === 'bilingual' && (
        <tspan x={x} dy="14" fontSize={size - 1}>
          {text.en}
        </tspan>
      )}
    </text>
  );
}
function Scene({
  mode,
  title,
  children,
}: {
  mode: LanguageMode;
  title: LocalizedText;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 420 320"
      role="img"
      aria-label={mode === 'en' ? title.en : `${title.zh} / ${title.en}`}
      style={{ width: '100%', display: 'block' }}
    >
      <title>
        {mode === 'en'
          ? title.en
          : mode === 'zh'
            ? title.zh
            : `${title.zh} / ${title.en}`}
      </title>
      <rect x="4" y="4" width="412" height="312" rx="20" fill="#f0f3e6" />
      {children}
    </svg>
  );
}
function Arrow({
  x1,
  y1,
  x2,
  y2,
  active = true,
  color = blue,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active?: boolean;
  color?: string;
  dashed?: boolean;
}) {
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g opacity={active ? 1 : 0.2}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="4"
        strokeDasharray={dashed ? '5 5' : undefined}
      />
      <path
        d="M-10 -5L0 0L-10 5"
        transform={`translate(${x2} ${y2}) rotate(${angle})`}
        fill="none"
        stroke={color}
        strokeWidth="3"
      />
    </g>
  );
}
function Neuron({
  x,
  y,
  active = true,
}: {
  x: number;
  y: number;
  active?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={active ? 1 : 0.3}>
      <path
        d="M-20 -20L0 0L-23 18M-25 0H0M2 0H55M55 0L68 -13M55 0L68 13"
        fill="none"
        stroke={green}
        strokeWidth="4"
      />
      <circle r="11" fill="#d4dfbd" stroke={green} strokeWidth="2" />
      <circle r="4" fill={active ? gold : '#b9c5aa'} />
    </g>
  );
}
function SignalScene({
  mode,
  stimulus = 'light',
  receptor = 'eye',
  frame = 3,
}: FigureProps) {
  const match = detects(stimulus, receptor),
    icon = stimulus === 'light' ? '☀' : stimulus === 'sound' ? '♪' : '↓';
  return (
    <Scene mode={mode} title={titles.L057!}>
      <text x="55" y="100" textAnchor="middle" fontSize="45" fill={gold}>
        {icon}
      </text>
      <Arrow x1={85} y1={88} x2={142} y2={88} active={frame >= 1} />
      {receptor === 'eye' ? (
        <g>
          <path
            d="M145 88Q195 35 245 88Q195 140 145 88Z"
            fill="white"
            stroke={green}
            strokeWidth="3"
          />
          <circle cx="195" cy="88" r="20" fill={blue} />
          <circle cx="195" cy="88" r="8" fill="#354832" />
        </g>
      ) : receptor === 'ear' ? (
        <path
          d="M180 115Q145 60 190 42Q242 32 235 80Q232 105 212 108L208 128Q185 148 180 115ZM184 79Q197 54 212 76L194 103"
          fill="#e8cdb4"
          stroke={green}
          strokeWidth="4"
        />
      ) : (
        <g>
          <rect
            x="148"
            y="55"
            width="94"
            height="70"
            rx="14"
            fill="#e8cdb4"
            stroke={green}
            strokeWidth="3"
          />
          <path
            d="M175 110V80M175 80L160 70M175 80L190 65"
            fill="none"
            stroke={red}
            strokeWidth="3"
          />
        </g>
      )}
      <Arrow x1={246} y1={88} x2={298} y2={88} active={frame >= 2 && match} />
      <Neuron x={310} y={88} active={frame >= 2 && match} />
      <Label
        mode={mode}
        text={t('外界刺激', 'External stimulus')}
        x={55}
        y={155}
      />
      <Label
        mode={mode}
        text={
          receptor === 'eye'
            ? t('视网膜感光细胞', 'Retinal receptors')
            : receptor === 'ear'
              ? t('内耳毛细胞', 'Inner-ear hair cells')
              : t('皮肤机械感受器', 'Skin mechanoreceptors')
        }
        x={195}
        y={155}
      />
      <Label
        mode={mode}
        text={t('神经信号', 'Neural signal')}
        x={340}
        y={155}
      />
      <rect
        x="35"
        y="205"
        width="350"
        height="65"
        rx="15"
        fill={match && frame >= 2 ? '#dbe8ca' : '#e6e8df'}
      />
      <Label
        mode={mode}
        text={
          frame < 2
            ? t('等待转换', 'Awaiting transduction')
            : match
              ? t('匹配通道：发生转换', 'Matched channel: transduction')
              : t('本图不显示此通道的响应', 'No response in this model channel')
        }
        x={210}
        y={231}
      />
    </Scene>
  );
}
function PathScene({ mode, frame = 4, condition = 'intact' }: FigureProps) {
  const reach = neuralReach(condition, frame);
  const points = [
    [65, 75],
    [210, 75],
    [355, 75],
    [280, 215],
    [105, 215],
  ] as const;
  const labels = [
    names.receptor,
    names.sensory,
    t('中枢整合', 'CNS integration'),
    names.motor,
    names.muscle,
  ];
  return (
    <Scene mode={mode} title={titles.L058!}>
      {points.map(([x, y], i) => (
        <g key={i}>
          {i === 3 && (
            <g opacity={reach >= i ? 1 : 0.2}>
              <path
                d="M385 75H405V180H280V185"
                fill="none"
                stroke={blue}
                strokeWidth="4"
                strokeDasharray={condition === 'motor-gap' ? '5 5' : undefined}
              />
              <path
                d="M275 177L280 186L285 177"
                fill="none"
                stroke={blue}
                strokeWidth="3"
              />
            </g>
          )}
          {i > 0 && i !== 3 && (
            <Arrow
              x1={points[i - 1]![0]}
              y1={points[i - 1]![1] + 8}
              x2={x}
              y2={y + 8}
              active={reach >= i}
              dashed={
                (condition === 'sensory-gap' && i === 1) ||
                (condition === 'motor-gap' && i === 3)
              }
            />
          )}
          <circle
            cx={x}
            cy={y}
            r="29"
            fill={reach >= i ? '#d8e7bf' : '#e6e8df'}
            stroke={i === 2 ? blue : green}
            strokeWidth="3"
          />
          <text
            x={x}
            y={y + 5}
            textAnchor="middle"
            fill="#354832"
            fontSize="16"
          >
            {i + 1}
          </text>
          <Label mode={mode} text={labels[i]!} x={x} y={y + 47} />
        </g>
      ))}
    </Scene>
  );
}
function ReflexScene({ mode, frame = 4, built = 5 }: FigureProps) {
  const points = [
    [50, 95],
    [155, 95],
    [280, 95],
    [280, 235],
    [95, 235],
  ] as const;
  return (
    <Scene mode={mode} title={titles.L059!}>
      <path
        d="M350 51Q378 34 388 60Q404 76 386 90Q364 106 346 85Q332 66 350 51"
        fill="#e2d4b3"
        stroke={gold}
        strokeWidth="2"
      />
      <Label
        mode={mode}
        text={t('脑得到信息', 'Brain informed')}
        x={350}
        y={125}
      />
      <Arrow
        x1={295}
        y1={84}
        x2={352}
        y2={70}
        active={built >= 3 && frame >= 2}
        dashed
        color={gold}
      />
      {points.map(([x, y], i) => (
        <g key={i}>
          {i === 3 && (
            <g opacity={i < built && i <= frame ? 1 : 0.2}>
              <path
                d="M308 95H405V235H310"
                fill="none"
                stroke={blue}
                strokeWidth="4"
              />
              <path
                d="M318 230L309 235L318 240"
                fill="none"
                stroke={blue}
                strokeWidth="3"
              />
            </g>
          )}
          {i > 0 && i !== 3 && (
            <Arrow
              x1={points[i - 1]![0]}
              y1={points[i - 1]![1]}
              x2={x}
              y2={y}
              active={i < built && i <= frame}
            />
          )}
          <rect
            x={x - 28}
            y={y - 24}
            width="56"
            height="48"
            rx={i === 2 ? 8 : 24}
            fill={i < built && i <= frame ? '#d5e6bd' : '#e6e8df'}
            stroke={green}
            strokeWidth="2"
          />
          <text
            x={x}
            y={y + 5}
            textAnchor="middle"
            fontSize="16"
            fill="#354832"
          >
            {i + 1}
          </text>
          <Label
            mode={mode}
            text={names[reflexRoute[i]!]}
            x={x}
            y={y + 41}
            size={i === 2 ? 12 : 13}
          />
        </g>
      ))}
    </Scene>
  );
}
function HormoneScene({
  mode,
  frame = 3,
  messenger = 'A',
  receptors = 'A',
}: FigureProps) {
  const responds = hormoneTarget(messenger, receptors);
  return (
    <Scene mode={mode} title={titles.L060!}>
      <path
        d="M33 85Q25 45 58 42Q77 22 91 57Q112 64 90 95Q57 115 33 85"
        fill="#e4d0ae"
        stroke={gold}
        strokeWidth="3"
      />
      <Label
        mode={mode}
        text={t('内分泌细胞', 'Endocrine cells')}
        x={67}
        y={145}
      />
      <rect
        x="117"
        y="66"
        width="167"
        height="50"
        rx="25"
        fill="#efd5c9"
        stroke={red}
        strokeWidth="2"
      />
      {[150, 200, 250].map((x, i) => (
        <g key={x} opacity={frame >= 1 ? 1 : 0.15}>
          <circle
            cx={x}
            cy={90}
            r={messenger === 'A' ? 7 : 9}
            fill={messenger === 'A' ? blue : gold}
          />
          <text x={x} y="94" textAnchor="middle" fill="white" fontSize="10">
            {messenger}
          </text>
          {i < 2 && (
            <path
              d={`M${x + 15} 90h18l-6 -5m6 5l-6 5`}
              stroke={red}
              fill="none"
            />
          )}
        </g>
      ))}
      <Label
        mode={mode}
        text={t('血液运输', 'Blood transport')}
        x={200}
        y={145}
      />
      <circle
        cx="348"
        cy="89"
        r="38"
        fill={responds && frame >= 3 ? '#d5e6bd' : '#e7e9df'}
        stroke={green}
        strokeWidth="3"
      />
      <path
        d="M317 70l-8 9 8 9"
        fill="none"
        stroke={receptors === 'B' ? gold : blue}
        strokeWidth="5"
      />
      <Label
        mode={mode}
        text={t('细胞与受体', 'Cell & receptors')}
        x={345}
        y={145}
      />
      <Arrow x1={285} y1={89} x2={307} y2={89} active={frame >= 2} />
      <rect x="35" y="210" width="350" height="62" rx="14" fill="#e3ead6" />
      <Label
        mode={mode}
        text={
          frame < 3
            ? t('先到达，再判断匹配', 'Arrival before receptor matching')
            : responds
              ? t('受体匹配：细胞活动改变', 'Receptor match: activity changes')
              : t('不匹配：无所选响应', 'No match: no selected response')
        }
        x={210}
        y={236}
      />
    </Scene>
  );
}
function FeedbackScene({
  mode,
  frame = 5,
  disturbance = 'high',
  enabled = true,
}: FigureProps) {
  const values = feedbackSeries(disturbance, enabled),
    visible = values.slice(0, frame + 1),
    y = (v: number) => 226 - v * 1.8;
  return (
    <Scene mode={mode} title={titles.L061!}>
      <rect
        x="54"
        y={y(55)}
        width="310"
        height={y(45) - y(55)}
        fill="#dce9c6"
      />
      <path d="M54 40V230H375" fill="none" stroke="#829277" strokeWidth="2" />
      <line
        x1="54"
        y1={y(50)}
        x2="364"
        y2={y(50)}
        stroke={green}
        strokeDasharray="4 4"
      />
      {[20, 50, 80].map((v) => (
        <text
          key={v}
          x="43"
          y={y(v) + 4}
          textAnchor="end"
          fontSize="11"
          fill="#53664c"
        >
          {v}
        </text>
      ))}
      <polyline
        points={visible.map((v, i) => `${65 + i * 58},${y(v)}`).join(' ')}
        fill="none"
        stroke={blue}
        strokeWidth="4"
      />
      {visible.map((v, i) => (
        <circle
          key={i}
          cx={65 + i * 58}
          cy={y(v)}
          r="5"
          fill={i === 1 ? red : blue}
        />
      ))}
      <Label
        mode={mode}
        text={t('模型记录顺序', 'Model snapshot order')}
        x={213}
        y={259}
      />
      <Label
        mode={mode}
        text={t('任意单位；绿带45–55', 'Arbitrary units; green band 45–55')}
        x={213}
        y={290}
      />
    </Scene>
  );
}
function ThermalScene({
  mode,
  frame = 3,
  thermal = 'warm',
  air = 'drier',
}: FigureProps) {
  const state = thermalResponse(thermal, air);
  return (
    <Scene mode={mode} title={titles.L062!}>
      <rect x="36" y="123" width="348" height="98" rx="12" fill="#e7cdb8" />
      <path
        d="M38 130Q80 117 120 130T205 130T290 130T383 130"
        fill="none"
        stroke="#ad8c72"
        strokeWidth="4"
      />
      <path
        d="M58 181H357"
        stroke={red}
        strokeWidth={state.vessels === 'wider' ? 15 : 5}
      />
      <Label
        mode={mode}
        text={
          state.vessels === 'wider'
            ? t('皮肤血管较宽', 'Wider skin vessels')
            : t('皮肤血管较窄', 'Narrower skin vessels')
        }
        x={210}
        y={250}
      />
      {thermal === 'warm' ? (
        <g>
          <path
            d="M135 169q-22 -15 0 -29q22 -15 0 -30V99"
            fill="none"
            stroke={blue}
            strokeWidth="4"
          />
          {[125, 145, 165].map((x, i) => (
            <g key={x} opacity={frame >= 1 ? 1 : 0.15}>
              <circle cx={x} cy={105 - i * 6} r="4" fill={blue} />
              <Arrow
                x1={x}
                y1={86 - i * 6}
                x2={x}
                y2={air === 'drier' ? 38 : 66}
                active={frame >= 2}
                color={blue}
              />
            </g>
          ))}
          <Arrow
            x1={300}
            y1={156}
            x2={300}
            y2={65}
            active={frame >= 2}
            color={red}
          />
          <Label
            mode={mode}
            text={t('蒸发带走热', 'Evaporation removes heat')}
            x={135}
            y={28}
          />
          <Label
            mode={mode}
            text={t('向较凉空气散热', 'Heat to cooler air')}
            x={307}
            y={35}
          />
        </g>
      ) : (
        <g>
          <path
            d="M85 70l15 -13 15 26 15 -26 15 26 15 -13"
            fill="none"
            stroke={red}
            strokeWidth="4"
            opacity={frame >= 2 ? 1 : 0.2}
          />
          <Label
            mode={mode}
            text={t('肌肉颤抖产热', 'Shivering produces heat')}
            x={150}
            y={38}
          />
          <Arrow
            x1={300}
            y1={157}
            x2={300}
            y2={114}
            active={frame >= 2}
            color={red}
          />
          <Label
            mode={mode}
            text={t('减少热量流失', 'Reduced heat loss')}
            x={299}
            y={78}
          />
        </g>
      )}
    </Scene>
  );
}
function GlucoseScene({ mode, frame = 3, disturbance = 'high' }: FigureProps) {
  const s = glucoseResponse(disturbance),
    high = disturbance === 'high';
  return (
    <Scene mode={mode} title={titles.L063!}>
      <rect
        x="25"
        y="48"
        width="105"
        height="74"
        rx="30"
        fill="#e0d1ad"
        stroke={gold}
        strokeWidth="3"
      />
      <Label
        mode={mode}
        text={
          high
            ? t('胰岛β细胞', 'Pancreatic beta cells')
            : t('胰岛α细胞', 'Pancreatic alpha cells')
        }
        x={78}
        y={77}
      />
      <Arrow
        x1={133}
        y1={83}
        x2={273}
        y2={83}
        active={frame >= 1}
        color={blue}
      />
      <Label
        mode={mode}
        text={
          s.hormone === 'insulin'
            ? t('胰岛素', 'Insulin')
            : t('胰高血糖素', 'Glucagon')
        }
        x={200}
        y={55}
      />
      <path
        d="M290 56Q361 33 388 84L372 128L288 114Z"
        fill="#d3b29a"
        stroke={red}
        strokeWidth="3"
      />
      <Label mode={mode} text={t('肝细胞', 'Liver cells')} x={336} y={151} />
      <rect x="53" y="208" width="137" height="50" rx="12" fill="#ead9b7" />
      <rect x="254" y="208" width="111" height="50" rx="12" fill="#d7e4be" />
      <Label
        mode={mode}
        text={t('血液中的葡萄糖', 'Blood glucose')}
        x={121}
        y={229}
      />
      <Label
        mode={mode}
        text={t('肝糖原储备', 'Liver glycogen')}
        x={310}
        y={229}
      />
      <Arrow
        x1={high ? 194 : 248}
        y1={233}
        x2={high ? 248 : 194}
        y2={233}
        active={frame >= 2}
        color={gold}
      />
      <Arrow
        x1={337}
        y1={122}
        x2={337}
        y2={198}
        active={frame >= 2}
        color={green}
        dashed
      />
      <Label
        mode={mode}
        text={
          high
            ? t('促进摄取与储存', 'Uptake & storage promoted')
            : t('促进肝释放葡萄糖', 'Liver glucose release promoted')
        }
        x={210}
        y={292}
      />
    </Scene>
  );
}
function WaterScene({ mode, frame = 4, water = 'concentrated' }: FigureProps) {
  const s = waterResponse(water),
    high = s.adh === 'more';
  return (
    <Scene mode={mode} title={titles.L064!}>
      <path
        d="M40 55Q55 23 82 45Q113 44 111 71Q96 100 69 85Q37 90 40 55"
        fill="#e3d2b3"
        stroke={gold}
        strokeWidth="2"
      />
      <Label mode={mode} text={t('下丘脑', 'Hypothalamus')} x={73} y={115} />
      <circle
        cx="144"
        cy="65"
        r="16"
        fill="#dcc9a3"
        stroke={gold}
        strokeWidth="2"
      />
      <Arrow x1={112} y1={66} x2={125} y2={66} active={frame >= 1} />
      <Label
        mode={mode}
        text={t('垂体后叶', 'Posterior pituitary')}
        x={157}
        y={153}
      />
      <Arrow x1={164} y1={65} x2={263} y2={65} active={frame >= 2} />
      <Label mode={mode} text={t('ADH经血液', 'ADH in blood')} x={213} y={36} />
      <path
        d="M295 44V228Q295 253 317 253"
        fill="none"
        stroke="#d4bca6"
        strokeWidth="38"
      />
      <path
        d="M295 44V228Q295 253 317 253"
        fill="none"
        stroke="#fcf7e8"
        strokeWidth="24"
      />
      <rect x="367" y="62" width="16" height="167" rx="8" fill="#dfbab0" />
      {[100, 144, 187].map((y, i) => (
        <g key={y}>
          <circle cx={295} cy={y} r="4" fill={blue} />
          <Arrow
            x1={314}
            y1={y}
            x2={361}
            y2={y}
            active={frame >= 3 && (high || i === 1)}
          />
        </g>
      ))}
      <Label
        mode={mode}
        text={t('集合管', 'Collecting duct')}
        x={285}
        y={284}
      />
      <Label
        mode={mode}
        text={t('回到血液', 'Back to blood')}
        x={365}
        y={268}
      />
      <Arrow
        x1={295}
        y1={215}
        x2={295}
        y2={242}
        active={frame >= 4}
        color={gold}
      />
      <Label
        mode={mode}
        text={
          high
            ? t('相对少尿', 'Relatively less urine')
            : t('相对多尿', 'Relatively more urine')
        }
        x={146}
        y={237}
      />
    </Scene>
  );
}
function Artwork({ id, ...props }: FigureProps & { id: string }) {
  switch (id) {
    case 'L057':
      return <SignalScene {...props} />;
    case 'L058':
      return <PathScene {...props} />;
    case 'L059':
      return <ReflexScene {...props} />;
    case 'L060':
      return <HormoneScene {...props} />;
    case 'L061':
      return <FeedbackScene {...props} />;
    case 'L062':
      return <ThermalScene {...props} />;
    case 'L063':
      return <GlucoseScene {...props} />;
    default:
      return <WaterScene {...props} />;
  }
}
const clues: Record<string, LocalizedText[]> = {
  L057: [
    t(
      '本图选视觉、听觉或轻压通道，感受器将相应刺激转换为神经信息。',
      'This diagram selects vision, hearing or gentle-pressure channels; receptors convert the corresponding stimulus into neural information.',
    ),
    t(
      '眼、耳和皮肤内有专门的细胞或神经末梢；器官名称不等于只有一个感受器。',
      'Eyes, ears and skin contain specialised cells or nerve endings; an organ is not a single receptor.',
    ),
    t(
      '大脑整合信息才产生知觉；神经里跑的不是光、声音或小照片。',
      'Perception depends on brain integration; nerves do not carry light, sound or tiny pictures.',
    ),
  ],
  L058: [
    t(
      '感觉神经元把信息传向中枢；运动神经元把指令传向效应器。',
      'Sensory neurons carry information towards the CNS; motor neurons carry commands towards effectors.',
    ),
    t(
      '电信号沿神经元膜传播；许多突触用化学信使跨越细胞间隙。',
      'Electrical signals propagate along neuronal membranes; many synapses use chemical messengers across cell gaps.',
    ),
    t(
      '图中一条选定路线被阻断，不代表所有其他路线停止；这不是损伤诊断图。',
      'Interrupting one selected route does not stop every other route; this is not a diagnostic diagram.',
    ),
  ],
  L059: [
    t(
      '本例缩手路线在脊髓内通过中间神经元连接感觉与运动神经元。',
      'This withdrawal example links sensory and motor neurons through spinal interneurons.',
    ),
    t(
      '脊髓可组织缩手反应，信息也传给脑；不是永远绕过大脑。',
      'The spinal cord can organise withdrawal while information also reaches the brain; the brain is not permanently bypassed.',
    ),
    t(
      '这里展示多突触缩手反射；有些反射含直接感觉—运动连接，不能一概而论。',
      'This is a polysynaptic withdrawal reflex; some reflexes include a direct sensory–motor link, so do not generalise every detail.',
    ),
  ],
  L060: [
    t(
      '内分泌细胞把激素释放到内环境，再由血液运送。',
      'Endocrine cells release hormones into the internal environment for transport in blood.',
    ),
    t(
      '血液可经过很多细胞；是否有合适受体决定能否产生某种响应。',
      'Blood passes many cells; suitable receptors determine whether a particular response can occur.',
    ),
    t(
      'A与B是虚构信使；真实细胞可有多种受体，响应还依赖细胞内过程。',
      'A and B are invented messengers; real cells can have several receptors, and responses also depend on internal processes.',
    ),
  ],
  L061: [
    t(
      '绿带是任意45–55模型单位，不是体温、血糖或个人健康范围。',
      'The green band is an arbitrary 45–55 model-unit range, not temperature, glucose or a personal health range.',
    ),
    t(
      '偏高后向下纠偏、偏低后向上纠偏，都可以是负反馈。',
      'Correcting a high value downwards or a low value upwards can both be negative feedback.',
    ),
    t(
      '响应需要过程且可能不完全恢复；本模型不预测真实时间或复杂控制。',
      'Responses take a process and may not restore perfectly; this model does not predict real time or complex control.',
    ),
  ],
  L062: [
    t(
      '较热时皮肤血管扩张可帮助热量到达表面；本图假设空气比皮肤凉。',
      'When warm, wider skin vessels can help heat reach the surface; this diagram assumes air cooler than skin.',
    ),
    t(
      '汗蒸发才带走相应热量，空气较湿会削弱蒸发条件；并非汗越多越好。',
      'Evaporating sweat removes heat; humid air reduces the evaporation gradient, so more sweat is not automatically better.',
    ),
    t(
      '较冷时减少皮肤散热，颤抖增加肌肉产热；这些不是改变天气。',
      'When cold, reduced skin heat loss and shivering-generated heat act internally; they do not change the weather.',
    ),
  ],
  L063: [
    t(
      '胰岛β细胞释放胰岛素，促进部分组织摄取葡萄糖及储存。',
      'Pancreatic beta cells release insulin, promoting glucose uptake in some tissues and storage.',
    ),
    t(
      '胰岛α细胞释放胰高血糖素，促进肝向血液释放葡萄糖。',
      'Pancreatic alpha cells release glucagon, promoting glucose release from the liver into blood.',
    ),
    t(
      '激素是信号，葡萄糖是运输的物质；激素不直接变成葡萄糖或糖原。',
      'Hormones are signals; glucose is transported matter. A hormone does not directly turn into glucose or glycogen.',
    ),
  ],
  L064: [
    t(
      '下丘脑产生ADH，经神经元运送至垂体后叶储存和释放。',
      'The hypothalamus produces ADH, transported along neurons to the posterior pituitary for storage and release.',
    ),
    t(
      'ADH改变集合管等部位的水通透性，水从管液重吸收回内环境与血液。',
      'ADH changes water permeability in parts including collecting ducts, allowing water reabsorption from tubular fluid back towards blood.',
    ),
    t(
      '水重吸收相对增加时，其他条件相同，尿量相对减少；口渴可促进摄入，但肾不会制造水。',
      'With greater water reabsorption, other conditions equal, urine volume is relatively smaller. Thirst can encourage intake; kidneys do not create water.',
    ),
  ],
};
function Choices<T extends string>({
  mode,
  label,
  items,
  value,
  choose,
}: {
  mode: LanguageMode;
  label: LocalizedText;
  items: { value: T; name: LocalizedText }[];
  value: T;
  choose: (v: T) => void;
}) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: '12px 0' }}>
      <legend>
        <Text mode={mode} text={label} />
      </legend>
      <div className="bio-choice-row">
        {items.map((i) => (
          <button
            key={i.value}
            type="button"
            aria-pressed={value === i.value}
            style={{ minHeight: 44 }}
            onClick={() => choose(i.value)}
          >
            <Text mode={mode} text={i.name} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
function Lab({
  id,
  mode,
  children,
  note,
}: {
  id: string;
  mode: LanguageMode;
  children: ReactNode;
  note: LocalizedText;
}) {
  return (
    <section className="bio-lab">
      <span className="bio-model-tag">
        <Text mode={mode} text={t('可操作的机制模型', 'Explore a mechanism')} />
      </span>
      <h3>
        <Text mode={mode} text={titles[id]!} />
      </h3>
      {children}
      <details className="bio-static">
        <summary>
          <Text
            mode={mode}
            text={t('文字说明与模型边界', 'Text explanation & model limits')}
          />
        </summary>
        <p>
          <Text mode={mode} text={note} />
        </p>
        {clues[id]!.map((c, i) => (
          <p key={i}>
            <Text mode={mode} text={c} />
          </p>
        ))}
      </details>
    </section>
  );
}
function SensoryLab({ id, mode, onExplore }: Props) {
  const [stimulus, setStimulus] = useState<Stimulus>('light'),
    [receptor, setReceptor] = useState<Receptor>('eye'),
    flow = useFrames(3, onExplore);
  return (
    <Lab
      id={id}
      mode={mode}
      note={t(
        '比较三种典型通道，不是说真实感受器绝对只对一种刺激响应；本图不显示阈值、频率或感觉障碍。',
        'Compare three representative channels, not absolute single-stimulus specificity in all real receptors. Thresholds, firing rates and sensory conditions are not modelled.',
      )}
    >
      <Choices
        mode={mode}
        label={t('给定刺激', 'Choose a stimulus')}
        value={stimulus}
        choose={(v) => {
          setStimulus(v);
          flow.reset();
          onExplore();
        }}
        items={[
          { value: 'light', name: t('光', 'Light') },
          { value: 'sound', name: t('声音振动', 'Sound vibration') },
          { value: 'pressure', name: t('轻压', 'Gentle pressure') },
        ]}
      />
      <Choices
        mode={mode}
        label={t('观察哪种感受器？', 'Which receptor channel?')}
        value={receptor}
        choose={(v) => {
          setReceptor(v);
          flow.reset();
          onExplore();
        }}
        items={[
          { value: 'eye', name: t('视网膜', 'Retina') },
          { value: 'ear', name: t('内耳', 'Inner ear') },
          { value: 'skin', name: t('皮肤', 'Skin') },
        ]}
      />
      <SignalScene
        mode={mode}
        frame={flow.frame}
        stimulus={stimulus}
        receptor={receptor}
      />
      <Playback mode={mode} flow={flow} />
      <p aria-live="polite">
        <Text
          mode={mode}
          text={
            flow.frame < 2
              ? t(
                  '先预测：所选通道会不会显示转换？再逐步看证据。',
                  'Predict whether this channel shows transduction, then step through the evidence.',
                )
              : detects(stimulus, receptor)
                ? t(
                    '所选通道匹配：相应感受器将刺激转换为神经信息，后续由中枢整合。',
                    'The selected channel matches: receptors convert the stimulus into neural information for CNS integration.',
                  )
                : t(
                    '所选通道不匹配：本模型不显示该响应。请换一个感受器；不能据此判断真实器官的所有功能。',
                    'The selected model channel does not match. Try another receptor; this does not establish all functions of a real organ.',
                  )
          }
        />
      </p>
    </Lab>
  );
}
function RouteLab({ id, mode, onExplore }: Props) {
  const [condition, setCondition] = useState<PathCondition>('intact'),
    flow = useFrames(4, onExplore);
  return (
    <Lab
      id={id}
      mode={mode}
      note={t(
        '按受体→感觉神经元→中枢整合→运动神经元→肌肉追踪一条虚构路线。虚线仅表示本模型选定连接关闭，不是真实损伤、麻醉或测试身体的方法。',
        'Trace one fictional receptor → sensory neuron → CNS integration → motor neuron → muscle route. A dashed gap is a switched-off model connection, not an injury, anaesthesia or a way to test a body.',
      )}
    >
      <Choices
        mode={mode}
        label={t('比较模型连接', 'Compare model connections')}
        value={condition}
        choose={(v) => {
          setCondition(v);
          flow.reset();
          onExplore();
        }}
        items={[
          { value: 'intact', name: t('连接完整', 'Connected') },
          { value: 'sensory-gap', name: t('关闭感觉连接', 'Sensory link off') },
          { value: 'motor-gap', name: t('关闭运动连接', 'Motor link off') },
        ]}
      />
      <PathScene mode={mode} frame={flow.frame} condition={condition} />
      <Playback mode={mode} flow={flow} />
      <p aria-live="polite">
        <Text
          mode={mode}
          text={
            condition === 'motor-gap' && flow.frame >= 3
              ? t(
                  '信息已到中枢，但所选运动连接没有递送指令；“能接收信息”和“这块肌肉完成动作”是不同判断。',
                  'Information reached the CNS, but the selected motor link did not deliver a command. Receiving information and completing this muscle action are different claims.',
                )
              : condition === 'sensory-gap' && flow.frame >= 1
                ? t(
                    '所选感觉连接关闭，图中这条输入没有继续到中枢。不要推断其他输入也消失。',
                    'This selected sensory link is off, so this input does not reach the CNS. Other inputs have not been assessed.',
                  )
                : t(
                    '顺着编号解释每一站传入还是传出，并指出中枢在哪里整合。',
                    'Use the numbered route to distinguish incoming and outgoing information and locate CNS integration.',
                  )
          }
        />
      </p>
    </Lab>
  );
}
function ReflexLab({ id, mode, onExplore }: Props) {
  const [built, setBuilt] = useState<ReflexPart[]>([]),
    [error, setError] = useState(false),
    flow = useFrames(4, onExplore);
  function add(part: ReflexPart) {
    const result = addReflexPart(built, part);
    setBuilt(result.route);
    setError(!result.correct);
    flow.reset();
    onExplore();
  }
  return (
    <Lab
      id={id}
      mode={mode}
      note={t(
        '这是虚构缩手反射，不做接触热物或疼痛实验。按信息前进方向点选卡片搭路线，错误卡不推进；完成后播放。五站不是等时阶段，虚线到脑分支不代表等到动作完成才上传。',
        'This is a fictional withdrawal reflex, with no heat or pain experiment. Select cards in information-flow order; a wrong card does not advance. Play after building. Stations are not equal time intervals; the brain branch does not wait for completed withdrawal.',
      )}
    >
      <p>
        <Text
          mode={mode}
          text={t(
            '起点是皮肤中的感受器。下一站选哪张？',
            'Start with a receptor in skin. Which card comes next?',
          )}
        />
      </p>
      <div
        className="bio-choice-row"
        role="group"
        aria-label={mode === 'en' ? 'Build reflex route' : '搭建反射路线'}
      >
        {(['motor', 'receptor', 'muscle', 'sensory', 'relay'] as const).map(
          (part) => (
            <button
              key={part}
              type="button"
              disabled={built.includes(part)}
              style={{ minHeight: 44 }}
              onClick={() => add(part)}
            >
              <Text mode={mode} text={names[part]} />
            </button>
          ),
        )}
        <button
          type="button"
          style={{ minHeight: 44 }}
          onClick={() => {
            setBuilt([]);
            setError(false);
            flow.reset();
          }}
        >
          <Text mode={mode} text={t('重新搭建', 'Build again')} />
        </button>
      </div>
      <ol>
        {built.map((part) => (
          <li key={part}>
            <Text mode={mode} text={names[part]} />
          </li>
        ))}
      </ol>
      <p role="status">
        <Text
          mode={mode}
          text={
            error
              ? t(
                  '这张卡不在下一站。先问：谁把信息传向脊髓，谁把指令传向肌肉？',
                  'That is not the next station. Ask who carries information towards the spinal cord and who carries commands towards muscle.',
                )
              : built.length === 5
                ? t(
                    '路线已接通。播放检查脊髓连接与通往脑的信息支路。',
                    'The route is connected. Play to inspect spinal integration and the information branch to the brain.',
                  )
                : t(
                    `已连接 ${built.length}/5 站。`,
                    `${built.length}/5 stations connected.`,
                  )
          }
        />
      </p>
      <ReflexScene mode={mode} frame={flow.frame} built={built.length} />
      {built.length === 5 && <Playback mode={mode} flow={flow} />}
    </Lab>
  );
}
function HormoneLab({ id, mode, onExplore }: Props) {
  const [messenger, setMessenger] = useState<Messenger>('A'),
    [receptors, setReceptors] = useState<CellReceptors>('A'),
    flow = useFrames(3, onExplore);
  return (
    <Lab
      id={id}
      mode={mode}
      note={t(
        'A/B为虚构信使、三种受体配置仅为模型。血液到达不等于细胞响应；细胞可有多个受体，真实响应还依赖浓度和细胞内通路，本图不计算激素速度或效应大小。',
        'A/B are fictional messengers and receptor sets. Blood arrival does not guarantee a cellular response. Real cells can carry several receptor types, with responses depending on concentration and intracellular pathways. No hormone speed or effect size is calculated.',
      )}
    >
      <Choices
        mode={mode}
        label={t('释放哪种信使？', 'Which messenger is released?')}
        value={messenger}
        choose={(v) => {
          setMessenger(v);
          flow.reset();
          onExplore();
        }}
        items={[
          { value: 'A', name: t('信使A', 'Messenger A') },
          { value: 'B', name: t('信使B', 'Messenger B') },
        ]}
      />
      <Choices
        mode={mode}
        label={t('细胞具有的受体', 'Cell receptor set')}
        value={receptors}
        choose={(v) => {
          setReceptors(v);
          flow.reset();
          onExplore();
        }}
        items={[
          { value: 'A', name: t('匹配A', 'A receptor') },
          { value: 'B', name: t('匹配B', 'B receptor') },
          { value: 'both', name: t('A和B', 'A and B receptors') },
        ]}
      />
      <HormoneScene
        mode={mode}
        frame={flow.frame}
        messenger={messenger}
        receptors={receptors}
      />
      <Playback mode={mode} flow={flow} />
      <p aria-live="polite">
        <Text
          mode={mode}
          text={
            flow.frame < 3
              ? t(
                  '先看信使离开分泌细胞，经血液到达，再判断受体。',
                  'First follow secretion and blood transport, then evaluate receptors.',
                )
              : hormoneTarget(messenger, receptors)
                ? t(
                    '存在匹配受体，模型显示细胞活动改变；信使是信息，不是给细胞运送能量的食物。',
                    'A matching receptor is present, so the model shows altered cell activity. The messenger carries information, not food energy.',
                  )
                : t(
                    '没有匹配受体，图中不显示这项响应；信使仍能随血液到达。',
                    'No matching receptor means no selected response here, although blood still carries the messenger past the cell.',
                  )
          }
        />
      </p>
    </Lab>
  );
}
function FeedbackLab({ id, mode, onExplore }: Props) {
  const [disturbance, setDisturbance] = useState<Disturbance>('high'),
    [enabled, setEnabled] = useState(true),
    flow = useFrames(5, onExplore);
  return (
    <Lab
      id={id}
      mode={mode}
      note={t(
        '50是任意参考值，45–55为示例范围。外界在第二点给一次扰动；所选反馈使后续偏差减小，关闭时图中没有其他调节器。不是实测人体数据、真实速度或个人健康阈值。',
        '50 is an arbitrary reference and 45–55 an illustrative range. One disturbance occurs at snapshot two. Selected feedback reduces subsequent deviation; no other controller is included when off. These are not body measurements, real rates or personal thresholds.',
      )}
    >
      <Choices
        mode={mode}
        label={t('扰动方向', 'Disturbance direction')}
        value={disturbance}
        choose={(v) => {
          setDisturbance(v);
          flow.reset();
          onExplore();
        }}
        items={[
          { value: 'high', name: t('向上偏离', 'Upward disturbance') },
          { value: 'low', name: t('向下偏离', 'Downward disturbance') },
        ]}
      />
      <Choices
        mode={mode}
        label={t('所选反馈回路', 'Selected feedback loop')}
        value={enabled ? 'on' : 'off'}
        choose={(v) => {
          setEnabled(v === 'on');
          flow.reset();
          onExplore();
        }}
        items={[
          { value: 'on', name: t('连接', 'Connected') },
          { value: 'off', name: t('关闭', 'Off') },
        ]}
      />
      <FeedbackScene
        mode={mode}
        frame={flow.frame}
        disturbance={disturbance}
        enabled={enabled}
      />
      <Playback mode={mode} flow={flow} />
      <p aria-live="polite">
        <Text
          mode={mode}
          text={
            flow.frame < 2
              ? t(
                  '参考值之后有一次扰动；稳态不意味着曲线永远是一条直线。',
                  'A disturbance follows the reference snapshot; homeostasis does not mean an eternally flat line.',
                )
              : enabled
                ? t(
                    '响应方向与最初偏离相反：偏高向下、偏低向上，所以都是负反馈。最后仍可保留小幅偏差。',
                    'The response opposes the original deviation: down from high or up from low. Both are negative feedback, with a residual deviation allowed.',
                  )
                : t(
                    '仅此示例控制器关闭，偏差在图中保留；不能推出真实身体完全没有其他调节。',
                    'This example controller is off and deviation remains in the diagram; that does not imply a real body has no other regulation.',
                  )
          }
        />
      </p>
      <table>
        <caption>
          <Text
            mode={mode}
            text={t(
              '与图同源的模型记录',
              'Model records corresponding to the graph',
            )}
          />
        </caption>
        <thead>
          <tr>
            <th>
              <Text mode={mode} text={t('顺序', 'Snapshot')} />
            </th>
            <th>
              <Text mode={mode} text={t('任意单位', 'Arbitrary units')} />
            </th>
          </tr>
        </thead>
        <tbody>
          {feedbackSeries(disturbance, enabled)
            .slice(0, flow.frame + 1)
            .map((value, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{value}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </Lab>
  );
}
function ThermalLab({ id, mode, onExplore }: Props) {
  const [thermal, setThermal] = useState<ThermalState>('warm'),
    [air, setAir] = useState<AirMoisture>('drier'),
    flow = useFrames(3, onExplore);
  return (
    <Lab
      id={id}
      mode={mode}
      note={t(
        '假设空气低于皮温、风和衣物不变，比较调节方向；空气较湿只改变蒸发条件。本图不提供体温、热指数、汗量、调节速度或个人建议，不要求运动或冷热暴露。',
        'Assume air cooler than skin, with wind and clothing held constant. Humidity changes evaporation conditions only. No temperature, heat index, sweat volume, response rate or personal advice is given; no exercise or hot/cold exposure is required.',
      )}
    >
      <Choices
        mode={mode}
        label={t('内部热状态偏离', 'Internal thermal deviation')}
        value={thermal}
        choose={(v) => {
          setThermal(v);
          flow.reset();
          onExplore();
        }}
        items={[
          { value: 'warm', name: t('偏热', 'Too warm') },
          { value: 'cold', name: t('偏冷', 'Too cold') },
        ]}
      />
      <Choices
        mode={mode}
        label={t('空气水蒸气条件', 'Air moisture conditions')}
        value={air}
        choose={(v) => {
          setAir(v);
          flow.reset();
          onExplore();
        }}
        items={[
          { value: 'drier', name: t('较干空气', 'Drier air') },
          { value: 'humid', name: t('较湿空气', 'More humid air') },
        ]}
      />
      <ThermalScene
        mode={mode}
        frame={flow.frame}
        thermal={thermal}
        air={air}
      />
      <Playback mode={mode} flow={flow} />
      <p aria-live="polite">
        <Text
          mode={mode}
          text={
            thermal === 'cold'
              ? t(
                  '较窄皮肤血管减少热量流失，颤抖增加产热；本图不突出冷状态的出汗。',
                  'Narrower skin vessels reduce heat loss, while shivering increases heat production. Sweating is not highlighted in the cold state.',
                )
              : air === 'humid'
                ? t(
                    '血管仍较宽，汗仍可出现，但较湿空气削弱蒸发梯度，箭头较短不等于完全停止。',
                    'Skin vessels remain wider and sweat can still occur, but more humid air reduces the evaporation gradient. Shorter arrows do not mean zero evaporation.',
                  )
                : t(
                    '热量到达皮肤表面，汗蒸发可带走热；汗只停在皮肤上不是同样的冷却证据。',
                    'Heat reaches the skin surface, and evaporation can remove heat. Sweat remaining on skin is not equivalent evidence of evaporative cooling.',
                  )
          }
        />
      </p>
    </Lab>
  );
}
function GlucoseLab({ id, mode, onExplore }: Props) {
  const [disturbance, setDisturbance] = useState<Disturbance>('high'),
    flow = useFrames(3, onExplore);
  return (
    <Lab
      id={id}
      mode={mode}
      note={t(
        '用“相对偏高/偏低”比较健康调节机制，不给浓度或个人阈值。肝有可动用储备等条件被固定；没有计算摄入、运动、疾病或药物。胰岛素的作用不只限于肝，胰高血糖素不是对所有细胞的相同指令。',
        'Compare relatively high/low states without concentrations or personal thresholds. Conditions such as usable liver stores are held fixed. Intake, exercise, disease and medication are not calculated. Insulin is not limited to liver actions, and glucagon is not an identical command to all cells.',
      )}
    >
      <Choices
        mode={mode}
        label={t('观察的血糖方向', 'Observed glucose deviation')}
        value={disturbance}
        choose={(v) => {
          setDisturbance(v);
          flow.reset();
          onExplore();
        }}
        items={[
          { value: 'high', name: t('相对偏高', 'Relatively high') },
          { value: 'low', name: t('相对偏低', 'Relatively low') },
        ]}
      />
      <GlucoseScene mode={mode} frame={flow.frame} disturbance={disturbance} />
      <Playback mode={mode} flow={flow} />
      <p aria-live="polite">
        <Text
          mode={mode}
          text={
            disturbance === 'high'
              ? t(
                  'β细胞→胰岛素→促进部分组织摄取和储存，血糖趋向回落；不是把全部血糖清零。',
                  'Beta cells → insulin → increased uptake in some tissues and storage, tending to lower blood glucose rather than remove it all.',
                )
              : t(
                  'α细胞→胰高血糖素→肝糖原分解及其他产糖过程增加释放，血糖趋向回升；本例突出糖原路线。',
                  'Alpha cells → glucagon → liver glycogen breakdown and other glucose-producing processes promote release, tending to raise blood glucose. This example highlights glycogen.',
                )
          }
        />
      </p>
    </Lab>
  );
}
function WaterLab({ id, mode, onExplore }: Props) {
  const [water, setWater] = useState<WaterState>('concentrated'),
    flow = useFrames(4, onExplore);
  return (
    <Lab
      id={id}
      mode={mode}
      note={t(
        '固定溶质负荷等其他条件，比较ADH—集合管这条路线的相对趋势；图中箭头数量仅作示意，不是水分子数。两种状态均有重吸收，少ADH不等于肾停止工作。口渴是摄入调节的一支，不是肾制造水；无需改变饮水或记录尿液。',
        'Hold other conditions such as solute load fixed and compare relative trends in the ADH–collecting-duct route. Arrow counts are illustrative, not water-molecule counts. Reabsorption occurs in both states; lower ADH does not stop the kidneys. Thirst is an intake-related branch, not water production by kidneys. Do not change drinking or collect urine records.',
      )}
    >
      <Choices
        mode={mode}
        label={t(
          '内环境溶质的相对浓度',
          'Relative internal solute concentration',
        )}
        value={water}
        choose={(v) => {
          setWater(v);
          flow.reset();
          onExplore();
        }}
        items={[
          { value: 'concentrated', name: t('相对较浓', 'More concentrated') },
          { value: 'dilute', name: t('相对较稀', 'More dilute') },
        ]}
      />
      <WaterScene mode={mode} frame={flow.frame} water={water} />
      <Playback mode={mode} flow={flow} />
      <p aria-live="polite">
        <Text
          mode={mode}
          text={
            water === 'concentrated'
              ? t(
                  '较浓→ADH释放相对增加→集合管水通透性增加→更多水重吸收→尿量相对少且较浓。口渴也可增强，但保水不等于补回已失去的水。',
                  'More concentrated → relatively more ADH → greater collecting-duct water permeability → more reabsorption → relatively less, more concentrated urine. Thirst can also increase, but conservation does not replace lost water.',
                )
              : t(
                  '较稀→ADH释放相对减少→集合管水通透性较低→较少水重吸收→尿量相对多且较稀。仍有基础重吸收，不是血液直接漏成尿。',
                  'More dilute → relatively less ADH → lower collecting-duct water permeability → less reabsorption → relatively more, more dilute urine. Baseline reabsorption remains; blood does not simply leak into urine.',
                )
          }
        />
      </p>
    </Lab>
  );
}
export function RegulationExplore(props: Props) {
  switch (props.id) {
    case 'L057':
      return <SensoryLab {...props} />;
    case 'L058':
      return <RouteLab {...props} />;
    case 'L059':
      return <ReflexLab {...props} />;
    case 'L060':
      return <HormoneLab {...props} />;
    case 'L061':
      return <FeedbackLab {...props} />;
    case 'L062':
      return <ThermalLab {...props} />;
    case 'L063':
      return <GlucoseLab {...props} />;
    default:
      return <WaterLab {...props} />;
  }
}
export function RegulationHookArt({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  return <Artwork id={id} mode={mode} />;
}
export function RegulationDiagram({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  const [clue, setClue] = useState(0),
    caption = useId();
  return (
    <figure aria-describedby={caption}>
      <Artwork id={id} mode={mode} />
      <div className="bio-choice-row">
        {clues[id]!.map((_, i) => (
          <button
            key={i}
            type="button"
            style={{ minHeight: 44 }}
            aria-pressed={clue === i}
            onClick={() => setClue(i)}
          >
            <Text
              mode={mode}
              text={t(`机制线索 ${i + 1}`, `Mechanism clue ${i + 1}`)}
            />
          </button>
        ))}
      </div>
      <figcaption id={caption} aria-live="polite">
        <Text mode={mode} text={clues[id]![clue]!} />
      </figcaption>
      <small>
        <Text
          mode={mode}
          text={t(
            '原创示意，非按比例绘制。图中分步不是真实时间。',
            'Original schematic, not to scale. Steps are not real time.',
          )}
        />
      </small>
    </figure>
  );
}
