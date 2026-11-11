import { useId, useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { useFrames, Playback } from './LabPlayback';
import {
  microbeSamples,
  microbeEvidence,
  fermentation,
  microbeRoles,
  transferPath,
  barrierSites,
  barrierSequence,
  lifeCycles,
  cycleTransition,
  plantReproduction,
  animalCases,
  animalDevelopment,
  changeCards,
  targetResponse,
  type TransferRoute,
  type LifeCycle,
} from './connectionModel';

type Props = { id: string; mode: LanguageMode; onExplore: () => void };
const green = '#66825b',
  blue = '#508b9b',
  gold = '#bd944b',
  pink = '#bd7f78';
const word = (mode: LanguageMode, value: LocalizedText) =>
  mode === 'en' ? value.en : value.zh;
function Choices<T extends string>({
  mode,
  label,
  value,
  items,
  choose,
}: {
  mode: LanguageMode;
  label: LocalizedText;
  value: T;
  items: readonly { value: T; name: LocalizedText }[];
  choose: (v: T) => void;
}) {
  return (
    <fieldset style={{ border: 0, padding: 0, margin: '12px 0', minWidth: 0 }}>
      <legend>
        <Text mode={mode} text={label} />
      </legend>
      <div className="bio-choice-row">
        {items.map((i) => (
          <button
            type="button"
            key={i.value}
            style={{ minHeight: 44 }}
            aria-pressed={value === i.value}
            onClick={() => choose(i.value)}
          >
            <Text mode={mode} text={i.name} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
function Scene({
  title,
  mode,
  children,
}: {
  title: LocalizedText;
  mode: LanguageMode;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 420 290"
      role="img"
      aria-label={word(mode, title)}
      style={{ width: '100%', display: 'block', maxHeight: 330 }}
    >
      <title>{word(mode, title)}</title>
      <rect x="5" y="5" width="410" height="280" rx="22" fill="#eff2e6" />
      {children}
    </svg>
  );
}
function Label({
  x,
  y,
  text,
  mode,
  color = '#354832',
}: {
  x: number;
  y: number;
  text: LocalizedText;
  mode: LanguageMode;
  color?: string;
}) {
  return (
    <text x={x} y={y} textAnchor="middle" fill={color} fontSize="12">
      {word(mode, text)}
    </text>
  );
}
function Arrow({
  x1,
  y1,
  x2,
  y2,
  active = true,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active?: boolean;
}) {
  const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return (
    <g opacity={active ? 1 : 0.2}>
      <path
        d={`M${x1} ${y1}L${x2} ${y2}`}
        stroke={blue}
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M-8 -5L0 0L-8 5"
        stroke={blue}
        strokeWidth="3"
        fill="none"
        transform={`translate(${x2} ${y2}) rotate(${angle})`}
      />
    </g>
  );
}
function Plant({
  x,
  y,
  flower = false,
  small = false,
}: {
  x: number;
  y: number;
  flower?: boolean;
  small?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${small ? 0.65 : 1})`}>
      <path
        d="M0 50V-35M0 12Q-42 5-35-20Q-5-25 0 12M0-5Q37-20 37 4Q10 20 0-5"
        fill="#a3ba83"
        stroke={green}
        strokeWidth="3"
      />
      {flower && (
        <g transform="translate(0 -43)">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              rx="12"
              ry="22"
              fill="#dca5a1"
              transform={`rotate(${a}) translate(0 -12)`}
            />
          ))}
          <circle r="9" fill={gold} />
        </g>
      )}
      <path d="M-20 52H20" stroke="#9a8d6a" strokeWidth="4" />
    </g>
  );
}
function CycleGlyph({
  cycle,
  step,
  x,
  y,
}: {
  cycle: LifeCycle;
  step: number;
  x: number;
  y: number;
}) {
  if (cycle === 'pea')
    return step === 0 ? (
      <ellipse cx={x} cy={y} rx="15" ry="20" fill={gold} />
    ) : step === 3 ? (
      <g>
        <path
          d={`M${x - 25} ${y - 25}Q${x + 35} ${y - 20} ${x + 20} ${y + 20}Q${x - 30} ${y + 20} ${x - 25} ${y - 25}`}
          fill="#b1c889"
          stroke={green}
        />
        {[-10, 5, 18].map((dx) => (
          <circle key={dx} cx={x + dx} cy={y} r="6" fill={green} />
        ))}
      </g>
    ) : (
      <Plant x={x} y={y + 5} small flower={step === 2} />
    );
  if (cycle === 'strawberry')
    return <Plant x={x} y={y} small={step !== 0} flower={false} />;
  if (cycle === 'frog')
    return step === 0 ? (
      <g>
        {[-12, 0, 12].map((dx) => (
          <circle
            key={dx}
            cx={x + dx}
            cy={y}
            r="8"
            fill="#c8d8da"
            stroke={blue}
          />
        ))}
      </g>
    ) : step === 1 ? (
      <g>
        <ellipse cx={x - 8} cy={y} rx="17" ry="12" fill={green} />
        <path
          d={`M${x + 9} ${y}Q${x + 45} ${y - 25} ${x + 25} ${y + 10}`}
          stroke={green}
          strokeWidth="6"
          fill="none"
        />
      </g>
    ) : (
      <g>
        <ellipse
          cx={x}
          cy={y}
          rx={step === 2 ? 20 : 28}
          ry="18"
          fill="#a0b87d"
        />
        <circle cx={x - 12} cy={y - 18} r="7" fill={green} />
        <circle cx={x + 12} cy={y - 18} r="7" fill={green} />
        <path
          d={`M${x - 16} ${y + 7}l-17 16 23-5M${x + 16} ${y + 7}l17 16-23-5`}
          stroke={green}
          strokeWidth="5"
          fill="none"
        />
        {step === 2 && (
          <path
            d={`M${x + 18} ${y}q30 0 25 20`}
            stroke={green}
            strokeWidth="5"
            fill="none"
          />
        )}
      </g>
    );
  return step === 0 ? (
    <g>
      {[-10, 0, 10].map((dx) => (
        <ellipse key={dx} cx={x + dx} cy={y} rx="5" ry="9" fill={gold} />
      ))}
    </g>
  ) : step === 1 ? (
    <g>
      {[0, 10, 20, 30].map((dx) => (
        <circle key={dx} cx={x - 15 + dx} cy={y} r="10" fill={green} />
      ))}
      <path
        d={`M${x - 12} ${y + 10}v8M${x + 5} ${y + 10}v8M${x + 20} ${y + 10}v8`}
        stroke={green}
      />
    </g>
  ) : step === 2 ? (
    <path
      d={`M${x} ${y - 26}Q${x + 30} ${y} ${x} ${y + 28}Q${x - 25} ${y} ${x} ${y - 26}`}
      fill={gold}
    />
  ) : (
    <g>
      <ellipse
        cx={x - 18}
        cy={y - 9}
        rx="22"
        ry="27"
        fill="#d4b478"
        transform={`rotate(-25 ${x - 18} ${y - 9})`}
      />
      <ellipse
        cx={x + 18}
        cy={y - 9}
        rx="22"
        ry="27"
        fill="#d4b478"
        transform={`rotate(25 ${x + 18} ${y - 9})`}
      />
      <ellipse cx={x} cy={y} rx="5" ry="28" fill={green} />
      <path
        d={`M${x - 2} ${y - 24}l-9-12M${x + 2} ${y - 24}l9-12`}
        stroke={green}
      />
    </g>
  );
}
const sceneTitles: Record<string, LocalizedText> = {
  L049: t(
    '细菌、酵母与菌丝结构比较，非按比例',
    'Bacterium, yeast and hypha comparison; not to scale',
  ),
  L050: t(
    '酵母发酵的条件与产物模型，非按比例',
    'Yeast fermentation conditions and products; not to scale',
  ),
  L051: t(
    '两种传播机会路径，不预测感染',
    'Two transfer-opportunity routes; no infection prediction',
  ),
  L052: t('身体屏障作用过程，非按比例', 'Body-barrier processes; not to scale'),
  L053: t(
    '代表生命周期与代际连接，非按比例',
    'Representative life cycles and generations; not to scale',
  ),
  L054: t(
    '开花植物有性与营养繁殖，非按比例',
    'Sexual and vegetative plant reproduction; not to scale',
  ),
  L055: t(
    '配子融合与发育场所，非按比例',
    'Gamete fusion and developmental sites; not to scale',
  ),
  L056: t(
    '生长发育的信号与证据，非按比例',
    'Signals and evidence in growth and development; not to scale',
  ),
};
type SceneProps = {
  id: string;
  mode: LanguageMode;
  frame?: number;
  choice?: number;
  flag?: boolean;
};
function ConnectionScene({
  id,
  mode,
  frame = 3,
  choice = 0,
  flag = true,
}: SceneProps) {
  let art: ReactNode;
  if (id === 'L049')
    art = (
      <>
        {[0, 1, 2].map((i) => (
          <g
            key={i}
            opacity={choice === i ? 1 : 0.4}
            transform={`translate(${76 + i * 133} 135)`}
          >
            {i === 0 ? (
              <>
                <rect
                  x="-40"
                  y="-21"
                  width="80"
                  height="42"
                  rx="21"
                  fill="#c4d4ad"
                  stroke={green}
                  strokeWidth="3"
                />
                <path
                  d="M-22 0q15-25 20 0t22 0"
                  stroke={gold}
                  strokeWidth="4"
                  fill="none"
                />
              </>
            ) : i === 1 ? (
              <>
                <ellipse
                  rx="34"
                  ry="45"
                  fill="#dfd2ad"
                  stroke={gold}
                  strokeWidth="3"
                />
                <ellipse
                  cx="29"
                  cy="-29"
                  rx="17"
                  ry="22"
                  fill="#dfd2ad"
                  stroke={gold}
                  strokeWidth="2"
                />
                {flag && <circle cx="-3" cy="2" r="11" fill={pink} />}
              </>
            ) : (
              <>
                <path
                  d="M-42 0H42M0 0l20-43M-14 0l-14 37"
                  stroke="#adc497"
                  strokeWidth="18"
                  fill="none"
                />
                <path d="M-42-10H42M-42 10H42" stroke={green} fill="none" />
                {flag &&
                  [-25, 0, 25].map((x) => (
                    <circle key={x} cx={x} cy="0" r="5" fill={pink} />
                  ))}
              </>
            )}
            <Label
              x={0}
              y={80}
              mode={mode}
              text={
                [
                  t('细菌', 'Bacterium'),
                  t('酵母', 'Yeast'),
                  t('菌丝', 'Hypha'),
                ][i]!
              }
            />
          </g>
        ))}
        <Label
          x={210}
          y={45}
          mode={mode}
          text={
            flag
              ? t('结构线索已标注', 'Structural clues marked')
              : t('仅凭轮廓，不足判断', 'Outline alone is insufficient')
          }
        />
      </>
    );
  else if (id === 'L050') {
    const active = fermentation(flag, choice === 0, frame);
    art = (
      <>
        <rect
          x="32"
          y="90"
          width="88"
          height="90"
          rx="15"
          fill={choice === 0 ? '#dfc390' : '#dfe5d8'}
        />
        <Label
          x={76}
          y={128}
          mode={mode}
          text={choice === 0 ? t('糖', 'Sugar') : t('无糖', 'No sugar')}
        />
        <Arrow
          x1={127}
          y1={135}
          x2={172}
          y2={135}
          active={active.active && frame >= 1}
        />
        <ellipse
          cx="220"
          cy="135"
          rx="37"
          ry="48"
          fill={flag ? '#c5d3ad' : '#d6d6d0'}
          stroke={green}
          strokeWidth="3"
        />
        <circle cx="218" cy="130" r="11" fill={pink} />
        <Label
          x={220}
          y={210}
          mode={mode}
          text={
            flag
              ? t('活酵母', 'Live yeast')
              : t('热灭活酵母', 'Heat-inactivated')
          }
        />
        <Arrow
          x1={264}
          y1={135}
          x2={308}
          y2={135}
          active={active.carbonDioxide}
        />
        {active.carbonDioxide && (
          <>
            {[0, 1, 2].map((i) => (
              <circle
                key={i}
                cx={337 + i * 17}
                cy={75 + i * 21}
                r="9"
                fill="none"
                stroke={blue}
                strokeWidth="2"
              />
            ))}
            <Label
              x={348}
              y={164}
              mode={mode}
              text={t('CO₂ + 乙醇', 'CO₂ + ethanol')}
            />
          </>
        )}
        <Label
          x={210}
          y={258}
          mode={mode}
          text={t(
            '水、适温、低氧固定；不计算速率',
            'Water, temperature and low oxygen fixed',
          )}
        />
      </>
    );
  } else if (id === 'L051') {
    const r = transferPath(choice === 0 ? 'touch' : 'air', flag);
    const label =
      choice === 0
        ? [
            t('来源', 'Source'),
            t('表面', 'Surface'),
            t('手', 'Hand'),
            t('入口', 'Entry'),
          ]
        : [
            t('来源', 'Source'),
            t('共同空气', 'Shared air'),
            t('入口', 'Entry'),
          ];
    art = (
      <>
        {label.map((text, i) => {
          const x = 55 + i * (310 / (label.length - 1));
          return (
            <g key={i}>
              {i > 0 && (
                <Arrow
                  x1={x - 310 / (label.length - 1) + 22}
                  y1={130}
                  x2={x - 24}
                  y2={130}
                  active={i < r.reached.length && frame >= i}
                />
              )}
              <circle
                cx={x}
                cy="130"
                r="24"
                fill={
                  i < r.reached.length && frame >= i ? '#c3d5b3' : '#dfe4d7'
                }
                stroke={green}
              />
              <Label x={x} y={182} mode={mode} text={text} />
              {choice === 0 && flag && i === 2 && (
                <path
                  d={`M${x - 60} 110l25 40m-25 0 25-40`}
                  stroke={pink}
                  strokeWidth="4"
                />
              )}
            </g>
          );
        })}
        <Label
          x={210}
          y={53}
          mode={mode}
          text={t(
            '传播机会 ≠ 一定感染',
            'Transfer opportunity ≠ certain infection',
          )}
        />
        <Label
          x={210}
          y={245}
          mode={mode}
          text={
            choice === 0 && flag
              ? t(
                  '本模型中移除表面→手连接',
                  'Surface → hand link removed in this model',
                )
              : t(
                  '路径存在；未计算剂量或结果',
                  'Path exists; dose and outcome uncalculated',
                )
          }
        />
      </>
    );
  } else if (id === 'L052') {
    const site = (['skin', 'airway', 'stomach'] as const)[choice]!;
    art = (
      <>
        {site === 'skin' ? (
          <>
            {[0, 1, 2, 3, 4].map((i) => (
              <rect
                key={i}
                x={30 + i * 75}
                y="150"
                width="70"
                height="45"
                rx="8"
                fill={flag && i === 2 ? '#eff2e6' : '#b9cc9f'}
                stroke={green}
              />
            ))}
            <path d="M30 205H390" stroke={pink} strokeWidth="18" />
          </>
        ) : site === 'airway' ? (
          <>
            <path d="M30 170H390" stroke={blue} strokeWidth="22" />
            {Array.from({ length: 15 }, (_, i) => (
              <path
                key={i}
                d={`M${35 + i * 25} 202q10-25 5-34`}
                stroke={green}
                strokeWidth="2"
              />
            ))}
            <Arrow x1={320} y1={140} x2={80} y2={140} active={!flag} />
          </>
        ) : (
          <>
            <ellipse
              cx="210"
              cy="163"
              rx="130"
              ry="62"
              fill="#e4c9ae"
              stroke={gold}
              strokeWidth="4"
            />
            {Array.from({ length: 12 }, (_, i) => (
              <circle
                key={i}
                cx={130 + (i % 6) * 31}
                cy={147 + Math.floor(i / 6) * 32}
                r="4"
                fill={pink}
              />
            ))}
          </>
        )}
        <circle
          cx={210 + frame * 17}
          cy={70 + Math.min(frame, 2) * 24}
          r="10"
          fill={pink}
        />
        <Label x={210} y={45} mode={mode} text={barrierSites[site].title} />
        <Label
          x={210}
          y={259}
          mode={mode}
          text={
            flag
              ? t(
                  '限制条件：不能保证完全阻挡',
                  'Limits: no complete-blocking guarantee',
                )
              : t(
                  '多层防护之一，不保证无菌',
                  'One defence layer, not sterility',
                )
          }
        />
      </>
    );
  } else if (id === 'L053') {
    const cycle = (['butterfly', 'frog', 'pea', 'strawberry'] as const)[
      choice
    ]!;
    const coords = [
      [100, 90],
      [320, 90],
      [320, 215],
      [100, 215],
    ];
    art = (
      <>
        {coords.map(([x, y], i) => (
          <g key={i} opacity={frame === i ? 1 : 0.35}>
            <CycleGlyph cycle={cycle} step={i} x={x!} y={y! - 7} />
            <Label
              x={x!}
              y={y! + 49}
              mode={mode}
              text={lifeCycles[cycle].stages[i]!}
            />
          </g>
        ))}
        <Arrow x1={150} y1={90} x2={265} y2={90} />
        <Arrow x1={320} y1={145} x2={320} y2={163} />
        <Arrow x1={264} y1={215} x2={151} y2={215} />
        <path
          d="M55 200Q12 140 55 100"
          stroke={gold}
          strokeWidth="3"
          strokeDasharray="6 5"
          fill="none"
        />
      </>
    );
  } else if (id === 'L054') {
    const result = plantReproduction(
      choice === 0 ? 'flower' : 'runner',
      flag,
      frame,
    );
    art =
      choice === 0 ? (
        <>
          <Plant x={91} y={169} flower />
          <path d="M230 80V171" stroke={green} strokeWidth="13" fill="none" />
          <ellipse
            cx="230"
            cy="181"
            rx="38"
            ry="30"
            fill="#c7d7af"
            stroke={green}
          />
          <circle cx="230" cy="181" r="13" fill={gold} />
          <circle
            cx={frame === 0 ? 150 : 230}
            cy={frame === 0 ? 75 : 66}
            r="9"
            fill={gold}
          />
          {frame >= 1 && flag && (
            <path
              d={`M230 76V${frame >= 2 ? 177 : 125}`}
              stroke={pink}
              strokeWidth="4"
            />
          )}
          {result.gameteFusion && (
            <circle cx="230" cy="181" r="7" fill={pink} />
          )}
          <Label
            x={230}
            y={245}
            mode={mode}
            text={
              result.newSeed
                ? t('胚珠→种子', 'Ovule → seed')
                : result.stalled
                  ? t('不相容，路线暂停', 'Incompatible: route stops')
                  : t('花粉管递送精细胞', 'Tube delivers sperm cells')
            }
          />
        </>
      ) : (
        <>
          <Plant x={85} y={140} />
          <path
            d="M85 185Q190 240 310 197"
            stroke={green}
            strokeWidth="6"
            fill="none"
          />
          {frame >= 1 && <circle cx="310" cy="197" r="8" fill={green} />}
          {frame >= 2 && (
            <path
              d="M310 198l-15 31m15-31 12 28m-12-28v32"
              stroke={gold}
              strokeWidth="3"
            />
          )}
          {result.daughterPlant && <Plant x={310} y={166} small />}
          <Label
            x={210}
            y={56}
            mode={mode}
            text={t('匍匐茎：无配子融合', 'Runner: no gamete fusion')}
          />
        </>
      );
  } else if (id === 'L055') {
    const kind = (['frog', 'chicken', 'human'] as const)[choice]!;
    const result = animalDevelopment(kind, flag, frame);
    art = (
      <>
        <circle cx="87" cy="90" r="28" fill="#e0c18c" stroke={gold} />
        <path
          d="M160 63q15-15 23 0t25 0"
          stroke={blue}
          strokeWidth="3"
          fill="none"
        />
        <ellipse cx="153" cy="63" rx="10" ry="5" fill={blue} />
        <Label x={88} y={140} mode={mode} text={t('卵细胞', 'Egg cell')} />
        <Label x={179} y={32} mode={mode} text={t('精子', 'Sperm')} />
        <Arrow x1={123} y1={100} x2={259} y2={100} active={result.zygote} />
        <circle
          cx="306"
          cy="100"
          r="30"
          fill={result.zygote ? '#d4c396' : '#e4e8dc'}
          stroke={gold}
        />
        {result.embryo &&
          !result.fetus &&
          !result.offspring &&
          [
            [-10, -10],
            [10, -10],
            [-10, 10],
            [10, 10],
          ].map(([x, y], i) => (
            <circle key={i} cx={306 + x!} cy={100 + y!} r="9" fill={pink} />
          ))}
        {result.fetus && !result.offspring && (
          <g>
            <circle cx="303" cy="87" r="11" fill={pink} />
            <path
              d="M306 99q21 2 8 19q-14 11-21-1q-6-9 5-10"
              stroke={pink}
              strokeWidth="9"
              fill="none"
            />
            <path
              d="M317 108q19-7 10-20"
              stroke={blue}
              strokeWidth="2"
              fill="none"
            />
            <path d="M326 79v20" stroke={gold} strokeWidth="5" />
          </g>
        )}
        {result.offspring &&
          (kind === 'human' ? (
            <g>
              <circle cx="306" cy="84" r="11" fill={pink} />
              <path d="M291 98l30 0-4 28h-22Z" fill="#bccfaa" stroke={green} />
            </g>
          ) : kind === 'chicken' ? (
            <g>
              <ellipse cx="306" cy="104" rx="19" ry="16" fill={gold} />
              <circle cx="317" cy="88" r="10" fill={gold} />
              <path d="M325 86l9 4-9 4" fill={pink} />
            </g>
          ) : (
            <CycleGlyph cycle="frog" step={1} x={306} y={103} />
          ))}
        <Label
          x={306}
          y={150}
          mode={mode}
          text={
            result.offspring
              ? t('新个体', 'New individual')
              : result.fetus
                ? t('胎儿期', 'Fetal stage')
                : result.embryo
                  ? t('胚胎发育', 'Embryonic development')
                  : result.zygote
                    ? t('受精卵', 'Zygote')
                    : t('尚未融合', 'No fusion')
          }
        />
        <rect
          x="45"
          y="188"
          width="330"
          height="54"
          rx="16"
          fill={choice === 2 ? '#e6cbd0' : choice === 1 ? '#e6dbbd' : '#cbdfe2'}
          stroke={choice === 2 ? pink : gold}
        />
        <Label x={210} y={211} mode={mode} text={result.fertilisation} />
        <Label x={210} y={231} mode={mode} text={result.development} />
        {result.offspring && (
          <Label
            x={210}
            y={271}
            mode={mode}
            text={t(
              '出生或孵化后的新个体',
              'New individual after birth or hatching',
            )}
          />
        )}
      </>
    );
  } else {
    const r = targetResponse(flag, choice === 0);
    art = (
      <>
        <circle cx="72" cy="105" r="28" fill={flag ? gold : '#dfe3d8'} />
        <Label x={72} y={158} mode={mode} text={t('信号', 'Signal')} />
        <Arrow x1={109} y1={105} x2={181} y2={105} active={flag} />
        <path
          d="M200 60V95h15v20h-15v35"
          stroke={blue}
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M220 60Q350 25 363 105Q350 185 220 150"
          stroke={green}
          strokeWidth="4"
          fill="#cedcbd"
        />
        <rect
          x="212"
          y="94"
          width="15"
          height="22"
          fill={choice === 0 ? gold : '#d1d6ca'}
        />
        {r.specificResponse && frame >= 2 && (
          <>
            <Arrow x1={240} y1={106} x2={300} y2={106} />
            <circle cx="325" cy="105" r="17" fill={pink} />
          </>
        )}
        <Label
          x={277}
          y={197}
          mode={mode}
          text={
            choice === 0
              ? t('匹配受体的靶细胞', 'Target: matching receptor')
              : t('无此受体的细胞', 'Cell without this receptor')
          }
        />
        <Label
          x={210}
          y={257}
          mode={mode}
          text={t(
            '特定反应示意；不预测青春期时间',
            'Specific response only; no puberty timeline',
          )}
        />
      </>
    );
  }
  return (
    <Scene title={sceneTitles[id] ?? sceneTitles.L049!} mode={mode}>
      {art}
    </Scene>
  );
}

const diagramClues: Record<string, LocalizedText[]> = {
  L049: [
    t(
      '细菌没有膜包围的细胞核，但有DNA。',
      'Bacteria have DNA without a membrane-bound nucleus.',
    ),
    t(
      '酵母是单细胞真菌；霉菌常由许多菌丝构成。',
      'Yeast is a unicellular fungus; moulds commonly form networks of hyphae.',
    ),
    t(
      '这是已知代表样本；真实照片不能仅凭轮廓断定身份或致病性。',
      'These are known representatives; outlines in real images do not establish identity or pathogenicity.',
    ),
  ],
  L050: [
    t(
      '固定条件下，活酵母可将糖发酵成CO₂和乙醇。',
      'Under the stated conditions, live yeast can ferment sugar into CO₂ and ethanol.',
    ),
    t(
      'CO₂能使面团膨起；产气不等于本图预测食品品质。',
      'CO₂ can raise dough; the model does not predict food quality.',
    ),
    t(
      '同属微生物，不等于拥有同一种功能或同样的危害。',
      'Being microbes does not imply identical functions or harms.',
    ),
  ],
  L051: [
    t(
      '先区分来源、途径与入口，连线表示机会。',
      'Separate source, route and entry; a link denotes opportunity.',
    ),
    t(
      '触摸途径与共同空气途径不同；改变一个连接不能代表所有途径消失。',
      'Touch and shared-air routes differ; altering one link does not remove all routes.',
    ),
    t(
      '感染还取决于病原体、剂量与宿主；本图均未量化。',
      'Infection also depends on agent, dose and host; none is quantified here.',
    ),
  ],
  L052: [
    t(
      '皮肤连续表层限制进入；破口可能改变屏障。',
      'The continuous outer skin limits entry; a break can alter the barrier.',
    ),
    t(
      '黏液捕获颗粒，纤毛推动黏液；胃酸抑制许多病原体。',
      'Mucus traps particles, cilia move mucus, and stomach acid inhibits many pathogens.',
    ),
    t(
      '屏障不是绝对墙；穿过一层也不等于必然患病。',
      'Barriers are not absolute walls; passing one layer does not mean certain disease.',
    ),
  ],
  L053: [
    t(
      '蝴蝶的卵、幼虫、蛹与成虫属于同一物种的不同阶段。',
      'Egg, larva, pupa and adult are stages of the same butterfly species.',
    ),
    t(
      '代表青蛙的蝌蚪到成蛙经历变态；并无蝴蝶式蛹期。',
      'Representative frogs undergo metamorphosis from tadpole to adult without a butterfly-like pupa.',
    ),
    t(
      '虚线连接下一代；种子内的胚和原植株不是同一个体。',
      'The dashed link connects generations; a seed embryo and its parent are different individuals.',
    ),
  ],
  L054: [
    t(
      '传粉是花粉到达柱头；精细胞经花粉管递送。',
      'Pollination transfers pollen to a stigma; sperm cells travel through a pollen tube.',
    ),
    t(
      '成功融合后，胚珠可发育成种子，子房通常发育成果实。',
      'After successful fusion, an ovule can develop into a seed and the ovary usually into fruit.',
    ),
    t(
      '草莓匍匐茎的营养繁殖不经过配子融合，仍需生长条件。',
      'Vegetative reproduction by strawberry runners has no gamete fusion, but still needs growth conditions.',
    ),
  ],
  L055: [
    t(
      '精子与卵细胞融合形成受精卵；之后分裂并分化。',
      'Sperm and egg fusion forms a zygote, followed by division and differentiation.',
    ),
    t(
      '体内受精不等于体内发育：鸡是重要反例。',
      'Internal fertilisation does not imply internal development: chickens are a counterexample.',
    ),
    t(
      '人类胚胎在子宫中继续发育，胎盘交换物质；母胎血液通常不直接混合。',
      'Human development continues in the uterus; the placenta exchanges materials, usually without direct mixing of maternal and fetal blood.',
    ),
  ],
  L056: [
    t(
      '生长侧重大小与细胞数量/体积增加；发育包含结构与功能成熟。',
      'Growth concerns increasing size and cell number/volume; development includes structural and functional maturation.',
    ),
    t(
      '激素经循环到达多处，具有相应受体的靶细胞作出特定反应。',
      'Hormones travel widely in circulation; matching target receptors support specific responses.',
    ),
    t(
      '青春期受多种信号和条件协调；不能用身高、动画或同学比较来判断个人阶段。',
      'Puberty involves many signals and conditions; height, animation or classmate comparisons cannot assign an individual stage.',
    ),
  ],
};
export function ConnectionHookArt({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  return <ConnectionScene id={id} mode={mode} flag={id !== 'L052'} />;
}
export function ConnectionDiagram({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  const [selected, setSelected] = useState(0),
    description = useId();
  return (
    <figure aria-describedby={description}>
      <ConnectionScene id={id} mode={mode} flag={id !== 'L052'} />
      <Choices
        mode={mode}
        label={t('选择图解线索', 'Choose a diagram clue')}
        value={String(selected)}
        items={(diagramClues[id] ?? []).map((_, i) => ({
          value: String(i),
          name: t(`线索 ${i + 1}`, `Clue ${i + 1}`),
        }))}
        choose={(v) => setSelected(Number(v))}
      />
      <figcaption id={description} aria-live="polite">
        <Text
          mode={mode}
          text={
            diagramClues[id]?.[selected] ??
            t('请选择课程。', 'Choose a lesson.')
          }
        />
      </figcaption>
    </figure>
  );
}

export function ConnectionExplore({ id, mode, onExplore }: Props) {
  const flow = useFrames(id === 'L055' ? 4 : id === 'L052' ? 2 : 3, onExplore);
  const [choice, setChoice] = useState(0),
    [flag, setFlag] = useState(true),
    [role, setRole] = useState(0),
    [classification, setClassification] = useState(''),
    [card, setCard] = useState(0);
  const choose = (v: string) => {
    setChoice(Number(v));
    setClassification('');
    flow.reset();
    onExplore();
  };
  const toggle = () => {
    setFlag(!flag);
    flow.reset();
    onExplore();
  };
  let controls: ReactNode, readout: LocalizedText, limits: LocalizedText;
  if (id === 'L049') {
    const sample = (['bacterium', 'yeast', 'mould'] as const)[choice]!;
    const evidence = microbeEvidence(sample, flag);
    controls = (
      <>
        <Choices
          mode={mode}
          label={t('比较已标定样本', 'Compare labelled samples')}
          value={String(choice)}
          items={Object.values(microbeSamples).map((s, i) => ({
            value: String(i),
            name: s.name,
          }))}
          choose={choose}
        />
        <button style={{ minHeight: 44 }} aria-pressed={flag} onClick={toggle}>
          <Text
            mode={mode}
            text={
              flag
                ? t('隐藏结构证据', 'Hide structural evidence')
                : t('显示结构证据', 'Reveal structural evidence')
            }
          />
        </button>
        <Choices
          mode={mode}
          label={t(
            '仅凭当前结构线索，能核对哪个已标定样本标签？',
            'Which pre-labelled sample can the displayed structural clues corroborate?',
          )}
          value={classification}
          items={[
            {
              value: 'bacterium',
              name: t('与本例细菌结构一致', 'Matches this bacterial example'),
            },
            {
              value: 'fungus',
              name: t('与本例真菌结构一致', 'Matches this fungal example'),
            },
            {
              value: 'insufficient',
              name: t('当前图形不足以核对', 'Displayed clues are insufficient'),
            },
          ]}
          choose={(v) => {
            setClassification(v);
            onExplore();
          }}
        />
      </>
    );
    readout = classification
      ? t(
          classification === evidence.conclusion
            ? '判断与此处证据一致。'
            : '再检查：显示结构证据了吗？不要仅凭大小判断。',
          classification === evidence.conclusion
            ? 'Your judgement matches the available evidence.'
            : 'Check whether structural evidence is revealed; do not classify by apparent size.',
        )
      : microbeSamples[sample].clue;
    limits = t(
      '预先标定的教学图，不是显微照片；隐藏标注表示本活动暂不提供结构证据，不表示真实细胞失去结构。没有细胞核不表示没有DNA，也不说明有害。',
      'Pre-labelled teaching schematics, not micrographs. Hiding labels withholds activity evidence, rather than removing real structures. No nucleus does not mean no DNA or harmfulness.',
    );
  } else if (id === 'L050') {
    const result = fermentation(flag, choice === 0, flow.frame);
    const selected = microbeRoles[role]!;
    controls = (
      <>
        <Choices
          mode={mode}
          label={t('只改变糖是否可用', 'Change sugar availability only')}
          value={String(choice)}
          items={[
            { value: '0', name: t('有糖', 'Sugar available') },
            { value: '1', name: t('无可用糖', 'No available sugar') },
          ]}
          choose={choose}
        />
        <button style={{ minHeight: 44 }} aria-pressed={flag} onClick={toggle}>
          <Text
            mode={mode}
            text={
              flag
                ? t(
                    '活酵母：切换热灭活对照',
                    'Live yeast: switch to heat-inactivated control',
                  )
                : t(
                    '热灭活对照：切回活酵母',
                    'Heat-inactivated: return to live yeast',
                  )
            }
          />
        </button>
        <Choices
          mode={mode}
          label={t('微生物角色证据卡', 'Microbial role evidence cards')}
          value={String(role)}
          items={microbeRoles.map((r, i) => ({
            value: String(i),
            name: r.title,
          }))}
          choose={(v) => {
            setRole(Number(v));
            setClassification('');
            onExplore();
          }}
        />
        <p>
          <Text mode={mode} text={selected.evidence} />
        </p>
        <Choices
          mode={mode}
          label={t(
            '本情境支持哪种角色？',
            'Which role is supported in this situation?',
          )}
          value={classification}
          items={[
            { value: 'helpful', name: t('有帮助', 'Helpful') },
            { value: 'harmful', name: t('有危害', 'Harmful') },
            { value: 'unknown', name: t('不足判断', 'Insufficient evidence') },
          ]}
          choose={(v) => {
            setClassification(v);
            onExplore();
          }}
        />
      </>
    );
    readout = classification
      ? t(
          classification === selected.role
            ? '分类有相应作用证据支持；结论限于这张卡的情境。'
            : '先看作用证据：颜色、大小或“微生物”这个名称都不能单独决定角色。',
          classification === selected.role
            ? 'The effect evidence supports your classification within this card’s context.'
            : 'Use effect evidence: colour, size and the label “microbe” alone cannot determine a role.',
        )
      : result.carbonDioxide
        ? t(
            '模型显示CO₂和乙醇产物；没有计算气体量或真实时间。',
            'The model shows CO₂ and ethanol products, without gas amounts or real time.',
          )
        : t(
            '逐步查看条件→糖的利用→产物；条件缺失时不画新产物。',
            'Step through conditions → sugar use → products. Missing conditions suppress new model products.',
          );
    limits = t(
      '只表示可存活面包酵母在有水、适温和本例选定的低氧条件下利用外加糖发酵；不计算氧浓度、途径选择或全部细胞呼吸，也不预测食品安全。不培养或品尝未知微生物。',
      'Only represents viable baking yeast fermenting added sugar with water, suitable temperature and the low-oxygen conditions selected for this example. It does not calculate oxygen concentration, pathway choice or all respiration, or predict food safety. Do not culture or taste unknown microbes.',
    );
  } else if (id === 'L051') {
    const route: TransferRoute = choice === 0 ? 'touch' : 'air';
    const result = transferPath(route, flag);
    controls = (
      <>
        <Choices
          mode={mode}
          label={t('选择独立传播途径', 'Choose an independent transfer route')}
          value={String(choice)}
          items={[
            { value: '0', name: t('表面接触途径', 'Surface-contact route') },
            { value: '1', name: t('共同空气途径', 'Shared-air route') },
          ]}
          choose={choose}
        />
        <button style={{ minHeight: 44 }} aria-pressed={flag} onClick={toggle}>
          <Text
            mode={mode}
            text={
              flag
                ? t(
                    '已移除表面→手连接：恢复',
                    'Surface → hand link removed: restore',
                  )
                : t('移除表面→手连接', 'Remove the surface → hand link')
            }
          />
        </button>
      </>
    );
    readout = result.interrupted
      ? t(
          '给定接触链在表面后中断；换到共同空气路径，它仍存在。',
          'This specified contact chain stops after the surface. Switch to shared air: that independent path remains.',
        )
      : t(
          '当前路径仍有传播机会；有机会不等于已经感染或患病。',
          'The current route retains a transfer opportunity. Opportunity is not established infection or disease.',
        );
    limits = t(
      '虚构来源与机会网络；移除连接是理想化干预，不表示真实洗手或清洁能完全消除所有病原体。未模拟剂量、通风效率、潜伏期或个人风险；不用模型诊断同学。',
      'A fictional opportunity network. Link removal is an idealised intervention, not a claim that real handwashing or cleaning eliminates every pathogen. Dose, ventilation efficiency, incubation and individual risk are omitted; do not diagnose classmates.',
    );
  } else if (id === 'L052') {
    const site = (['skin', 'airway', 'stomach'] as const)[choice]!;
    const result = barrierSequence(site, flag, flow.frame);
    controls = (
      <>
        <Choices
          mode={mode}
          label={t('选择屏障', 'Choose a barrier')}
          value={String(choice)}
          items={Object.values(barrierSites).map((s, i) => ({
            value: String(i),
            name: s.title,
          }))}
          choose={choose}
        />
        <button style={{ minHeight: 44 }} aria-pressed={flag} onClick={toggle}>
          <Text
            mode={mode}
            text={
              flag
                ? t('显示屏障作用', 'Show barrier action')
                : t('检查屏障的局限', 'Examine barrier limits')
            }
          />
        </button>
      </>
    );
    readout = flow.frame === 2 ? result.last : result.visible.at(-1)!;
    limits = t(
      '这不是在身体里做试验。皮肤破口、纤毛清除减弱和病原体耐酸是三种不同限制，不是一个共同开关的生理作用；按钮只切换解释情境。感染结果、数量与健康状态均未计算。',
      'No bodily experiment is involved. Broken skin, weaker ciliary clearance and acid tolerance are distinct limits, not one physiological switch; the button changes the explanatory case. Infection, counts and health status are not calculated.',
    );
  } else if (id === 'L053') {
    const cycle = (['butterfly', 'frog', 'pea', 'strawberry'] as const)[
      choice
    ]!;
    const current = cycleTransition(cycle, flow.frame);
    controls = (
      <Choices
        mode={mode}
        label={t('比较生命周期', 'Compare life cycles')}
        value={String(choice)}
        items={Object.values(lifeCycles).map((c, i) => ({
          value: String(i),
          name: c.name,
        }))}
        choose={choose}
      />
    );
    readout = t(
      `${current.stage.zh}：${lifeCycles[cycle].link.zh}`,
      `${current.stage.en}: ${lifeCycles[cycle].link.en}`,
    );
    limits = t(
      '代表性顺序，不表示各阶段持续时间相等或每个个体都成功繁殖。蝴蝶与青蛙有不同变态过程；草莓展示无性繁殖支路，另有花与种子支路。',
      'Representative sequences, without equal durations or guaranteed reproduction. Butterfly and frog metamorphosis differ. Strawberry shows an asexual branch and also has a flower-and-seed branch.',
    );
  } else if (id === 'L054') {
    const result = plantReproduction(
      choice === 0 ? 'flower' : 'runner',
      flag,
      flow.frame,
    );
    controls = (
      <>
        <Choices
          mode={mode}
          label={t('选择繁殖路线', 'Choose a reproductive route')}
          value={String(choice)}
          items={[
            { value: '0', name: t('豌豆：花与种子', 'Pea: flowers and seeds') },
            { value: '1', name: t('草莓：匍匐茎', 'Strawberry: runners') },
          ]}
          choose={choose}
        />
        {choice === 0 && (
          <button
            style={{ minHeight: 44 }}
            aria-pressed={flag}
            onClick={toggle}
          >
            <Text
              mode={mode}
              text={
                flag
                  ? t(
                      '相容花粉：切换不相容',
                      'Compatible pollen: switch to incompatible',
                    )
                  : t(
                      '不相容花粉：切换相容',
                      'Incompatible pollen: switch to compatible',
                    )
              }
            />
          </button>
        )}
      </>
    );
    readout = result.daughterPlant
      ? t(
          '节上长根并形成子株；不经过卵与精细胞融合。',
          'Roots and a daughter plant form at a node, without sperm–egg fusion.',
        )
      : result.newSeed
        ? t(
            '成功融合后的胚珠进入种子发育；仍假定后续条件适宜。',
            'The ovule proceeds to seed development after successful fusion, assuming suitable later conditions.',
          )
        : result.stalled
          ? t(
              '花粉到达不等于完成受精；本分支停在不相容条件。',
              'Pollen arrival is not fertilisation; this branch stops under incompatibility.',
            )
          : t(
              '逐步区分传粉、花粉管、融合与发育。',
              'Distinguish pollination, pollen-tube growth, fusion and development step by step.',
            );
    limits = t(
      '花模型聚焦精卵融合；被子植物还发生另一精细胞与中央细胞的融合，形成胚乳的起始细胞，见进阶说明。匍匐茎不保证每个节都成活；图不计算遗传多样性或产量。',
      'The flower focuses on sperm–egg fusion. A second sperm fuses with the central cell to initiate endosperm in flowering plants; see Depth. Not every runner node survives, and the diagram calculates neither diversity nor yield.',
    );
  } else if (id === 'L055') {
    const kind = (['frog', 'chicken', 'human'] as const)[choice]!;
    const result = animalDevelopment(kind, flag, flow.frame);
    controls = (
      <>
        <Choices
          mode={mode}
          label={t(
            '分别比较受精与发育场所',
            'Compare fertilisation and development sites separately',
          )}
          value={String(choice)}
          items={Object.values(animalCases).map((a, i) => ({
            value: String(i),
            name: a.name,
          }))}
          choose={choose}
        />
        <button style={{ minHeight: 44 }} aria-pressed={flag} onClick={toggle}>
          <Text
            mode={mode}
            text={
              flag
                ? t(
                    '已发生配子融合：切换未融合',
                    'Gamete fusion occurs: switch to no fusion',
                  )
                : t(
                    '未融合：切回成功融合情境',
                    'No fusion: return to successful-fusion case',
                  )
            }
          />
        </button>
      </>
    );
    readout = !flag
      ? t(
          '本课的有性繁殖模型中，未融合就不画受精卵、胚胎或新个体。',
          'In this lesson’s sexual-reproduction model, no fusion means no model zygote, embryo or offspring.',
        )
      : result.offspring
        ? t(
            '出生或孵化连接到新个体；物种之间营养来源与发育场所不同。',
            'Birth or hatching leads to a new individual; nourishment and developmental sites differ among species.',
          )
        : result.fetus
          ? t(
              '人类胎儿期：胎盘交换氧、养分与废物；母胎血液通常不直接混合。',
              'Human fetal stage: the placenta exchanges oxygen, nutrients and wastes, usually without direct maternal–fetal blood mixing.',
            )
          : result.embryo
            ? t(
                '受精卵的后代细胞分裂并逐步分化，形成胚胎结构。',
                'Descendants of the zygote divide and progressively differentiate into embryonic structures.',
              )
            : result.zygote
              ? t(
                  '受精卵结合来自精子和卵细胞的遗传物质。',
                  'A zygote combines genetic material contributed by sperm and egg.',
                )
              : t(
                  '先找两种配子，再追踪融合与发育。',
                  'Identify the two gametes, then trace fusion and development.',
                );
    limits = t(
      '只比较三种给定有性生殖情境；不概括全部青蛙、鱼或哺乳动物，也不排除动物界其他生殖方式。等长帧不是相等时间，早期分裂画成四细胞只是阶段线索。',
      'Only three specified sexual-reproduction cases, not all frogs, fish or mammals, and not a denial of other animal reproductive modes. Equal frames do not mean equal durations; the four-cell drawing is a stage cue.',
    );
  } else {
    const response = targetResponse(flag, choice === 0);
    const selected = changeCards[card]!;
    controls = (
      <>
        <Choices
          mode={mode}
          label={t(
            '比较细胞对同一示意信号的反应',
            'Compare cells exposed to the same illustrative signal',
          )}
          value={String(choice)}
          items={[
            { value: '0', name: t('匹配受体', 'Matching receptor') },
            { value: '1', name: t('无此受体', 'No matching receptor') },
          ]}
          choose={choose}
        />
        <button style={{ minHeight: 44 }} aria-pressed={flag} onClick={toggle}>
          <Text
            mode={mode}
            text={
              flag
                ? t('信号可用：切换未提供', 'Signal available: switch off')
                : t('未提供信号：切换可用', 'No signal provided: switch on')
            }
          />
        </button>
        <Choices
          mode={mode}
          label={t('检查变化证据', 'Examine change evidence')}
          value={String(card)}
          items={changeCards.map((c, i) => ({
            value: String(i),
            name: c.title,
          }))}
          choose={(v) => {
            setCard(Number(v));
            setClassification('');
            onExplore();
          }}
        />
        <Choices
          mode={mode}
          label={t('证据支持什么？', 'What does the evidence support?')}
          value={classification}
          items={[
            { value: 'growth', name: t('生长', 'Growth') },
            { value: 'development', name: t('发育', 'Development') },
            {
              value: 'unsupported',
              name: t('推断不足', 'Unsupported inference'),
            },
          ]}
          choose={(v) => {
            setClassification(v);
            onExplore();
          }}
        />
      </>
    );
    readout = classification
      ? t(
          `${classification === selected.answer ? '判断有依据。' : '再检查证据类型。'}${selected.reason.zh}`,
          `${classification === selected.answer ? 'Supported judgement. ' : 'Check the evidence type. '}${selected.reason.en}`,
        )
      : response.specificResponse && flow.frame >= 2
        ? t(
            '出现这一个特定反应，不代表所有青春期变化同时发生。',
            'This one specific response occurs; not all puberty changes happen simultaneously.',
          )
        : t(
            '信号与相应受体共同支持特定反应；身体还有许多其他调节路径。',
            'A signal and matching receptor support a specific response; the body has many other regulatory pathways.',
          );
    limits = t(
      '这是一般激素信号示意，不模拟激素浓度、青春期年龄、性别认同或个人健康；不收集身体信息。个体发育节奏有差异，困惑可向可信任成人或医护人员咨询。',
      'A general hormone-signalling schematic, not a simulation of concentrations, puberty age, gender identity or individual health; no body information is collected. Developmental timing varies; questions can be discussed with a trusted adult or health professional.',
    );
  }
  return (
    <section className="bio-lab bio-s3-lab">
      <div className="bio-lab-top">
        <span className="bio-eyebrow">
          <Text
            mode={mode}
            text={t(
              '预测 · 改变条件 · 比较证据',
              'Predict · change a condition · compare evidence',
            )}
          />
        </span>
        <span className="bio-model-tag">
          <Text mode={mode} text={t('示意模型', 'MODEL')} />
        </span>
      </div>
      {controls}
      <ConnectionScene
        id={id}
        mode={mode}
        choice={choice}
        flag={flag}
        frame={flow.frame}
      />
      {id === 'L049' ? (
        <p className="bio-caption">
          <Text
            mode={mode}
            text={t(
              '切换样本或显示/隐藏结构证据，再比较你的分类；本活动不按时间播放。',
              'Change the sample or reveal/hide structural evidence, then compare your classification. This activity has no timed playback.',
            )}
          />
        </p>
      ) : (
        <Playback flow={flow} mode={mode} />
      )}
      <p className="bio-caption" aria-live="polite">
        <Text mode={mode} text={readout} />
      </p>
      <details className="bio-static">
        <summary>
          <Text
            mode={mode}
            text={t(
              '文字版、条件与模型边界',
              'Text alternative, conditions and model limits',
            )}
          />
        </summary>
        <p>
          <Text mode={mode} text={limits} />
        </p>
        {diagramClues[id]?.map((text, i) => (
          <p key={i}>
            <Text mode={mode} text={text} />
          </p>
        ))}
      </details>
    </section>
  );
}
