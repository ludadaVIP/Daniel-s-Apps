import { useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { Text } from './ui';
import { t } from './schema';
import { Playback, useFrames } from './LabPlayback';
import {
  absorptionRoute,
  circulationRoute,
  diffusionSeries,
  exchangeCapacity,
  kidneyBalance,
  membranePassage,
  osmosisResponse,
  signalResponse,
  valveOpen,
  type Molecule,
  type Food,
  type CellKind,
} from './transportPhysiologyModel';
import './transportPhysiology.css';
type Props = { id: string; mode: LanguageMode };
const names: Record<string, LocalizedText> = {
  L097: t('膜不是一道固定的墙', 'A membrane is a fluid boundary'),
  L098: t('双向运动，比较净量', 'Two-way movement, net transfer'),
  L099: t(
    '先读总水势，再看细胞壁',
    'Read total water potential, then cell walls',
  ),
  L100: t('交换面积与逆梯度运输', 'Exchange area and uphill transport'),
  L101: t('沿箭头走两条循环', 'Trace two circulatory circuits'),
  L102: t('分解之后，还要跨过上皮', 'After digestion, cross the epithelium'),
  L103: t('过滤、回收与水分反馈', 'Filter, recover and regulate water'),
  L104: t('信息路线与靶细胞', 'Signal routes and target cells'),
};
function Label({
  mode,
  value,
  x,
  y,
  size = 16,
}: {
  mode: LanguageMode;
  value: LocalizedText;
  x: number;
  y: number;
  size?: number;
}) {
  return (
    <text x={x} y={y} fontSize={size} textAnchor="middle" fill="#263b45">
      <tspan x={x}>{mode === 'en' ? value.en : value.zh}</tspan>
      {mode === 'bilingual' && (
        <tspan x={x} dy="21" fontSize={size - 1}>
          {value.en}
        </tspan>
      )}
    </text>
  );
}
function Scene({ id, mode, children }: Props & { children: ReactNode }) {
  const name = names[id] ?? names.L097!;
  return (
    <>
      <p className="tp-scroll-hint">
        <Text
          mode={mode}
          text={t(
            '图为原创示意、不按比例。窄屏可聚焦图框后横向滚动；完整静态记录在图下。',
            'Original schematic, not to scale. On narrow screens focus the figure region and scroll horizontally; full static records follow.',
          )}
        />
      </p>
      <div
        className="tp-figure"
        role="region"
        tabIndex={0}
        aria-label={mode === 'en' ? name.en : `${name.zh} / ${name.en}`}
      >
        <svg
          viewBox="0 0 640 380"
          role="img"
          aria-label={mode === 'en' ? name.en : `${name.zh} / ${name.en}`}
        >
          <title>
            {mode === 'en'
              ? name.en
              : mode === 'zh'
                ? name.zh
                : `${name.zh} / ${name.en}`}
          </title>
          <rect width="640" height="380" rx="20" fill="#edf3ef" />
          {children}
        </svg>
      </div>
    </>
  );
}
function Note({ mode, value }: { mode: LanguageMode; value: LocalizedText }) {
  return (
    <p>
      <Text mode={mode} text={value} />
    </p>
  );
}
function Choices({
  mode,
  label,
  values,
  selected,
  onSelect,
}: {
  mode: LanguageMode;
  label: LocalizedText;
  values: LocalizedText[];
  selected: number;
  onSelect: (n: number) => void;
}) {
  return (
    <fieldset>
      <legend>
        <Text mode={mode} text={label} />
      </legend>
      <div className="tp-choices">
        {values.map((v, i) => (
          <button
            key={i}
            aria-pressed={selected === i}
            onClick={() => onSelect(i)}
          >
            <Text mode={mode} text={v} />
          </button>
        ))}
      </div>
    </fieldset>
  );
}
function Records({
  mode,
  title,
  headers,
  rows,
}: {
  mode: LanguageMode;
  title: LocalizedText;
  headers: LocalizedText[];
  rows: (LocalizedText | number | string)[][];
}) {
  return (
    <div
      className="tp-table"
      role="region"
      tabIndex={0}
      aria-label={mode === 'en' ? title.en : title.zh}
    >
      <table>
        <caption>
          <Text mode={mode} text={title} />
        </caption>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th scope="col" key={i}>
                <Text mode={mode} text={h} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((v, j) => (
                <td
                  key={j}
                  className={
                    typeof v === 'number' || typeof v === 'string'
                      ? 'tp-number'
                      : ''
                  }
                >
                  {typeof v === 'object' ? <Text mode={mode} text={v} /> : v}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const moleculeNames = [
  t('氧气', 'Oxygen'),
  t('离子', 'Ion'),
  t('葡萄糖', 'Glucose'),
];
const molecules: Molecule[] = ['oxygen', 'ion', 'glucose'];
const foods: Food[] = ['starch', 'protein', 'fat'];
const cellNames = [t('植物细胞', 'Plant cell'), t('动物细胞', 'Animal cell')];
const nerveSteps = [
  t('刺激被感受', 'Stimulus detected'),
  t('神经信号沿轴突', 'Neural signal along axon'),
  t('突触传递至靶细胞', 'Synapse signals target'),
  t('有受体才作出响应', 'Response requires receptor'),
];
const hormoneSteps = [
  t('内分泌细胞分泌', 'Endocrine secretion'),
  t('激素随血液运输', 'Hormone travels in blood'),
  t('接触多种细胞', 'Many cells exposed'),
  t('有受体才作出响应', 'Response requires receptor'),
];
const kidneySteps = [
  t('压强驱动小分子过滤', 'Pressure filters small substances'),
  t('选择性重吸收至血', 'Selective return to blood'),
  t('ADH影响集合管透水性', 'ADH changes collecting-duct permeability'),
  t('剩余液形成尿液', 'Remaining fluid becomes urine'),
];
type FigureProps = Props & {
  frame?: number;
  choice?: number;
  second?: number;
  third?: number;
};
function Figure({
  id,
  mode,
  frame = 0,
  choice = 0,
  second = 0,
  third = 0,
}: FigureProps) {
  if (id === 'L097') {
    const r = membranePassage(molecules[choice]!, second === 1);
    const passageX = r.route === 'lipid' ? 390 : 320;
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          x={320}
          y={35}
          value={t('细胞外水环境', 'Extracellular water')}
        />
        {Array.from({ length: 16 }, (_, i) => (
          <g key={i}>
            {[130, 230].map((y, n) => (
              <g key={y}>
                <circle cx={25 + i * 39} cy={y} r="12" fill="#4c8e9d" />
                <path
                  d={`M${20 + i * 39},${y + (n ? -9 : 9)} v${n ? -31 : 31} m10,0 v${n ? 31 : -31}`}
                  fill="none"
                  stroke="#cda953"
                  strokeWidth="5"
                />
              </g>
            ))}
          </g>
        ))}
        <rect
          x="280"
          y="116"
          width="80"
          height="132"
          rx="25"
          fill={second ? '#678560' : '#a7988a'}
        />
        <rect
          x="311"
          y="118"
          width="18"
          height="128"
          rx="9"
          fill={second ? '#edf3ef' : '#a7988a'}
        />
        <Label
          mode={mode}
          x={140}
          y={295}
          value={t('头朝水；尾相向', 'Heads face water; tails inward')}
        />
        <Label
          mode={mode}
          x={450}
          y={295}
          value={t('蛋白可侧向移动', 'Proteins can move laterally')}
        />
        <Label mode={mode} x={passageX} y={72} value={moleculeNames[choice]!} />
        <path
          data-transport-route={r.route}
          d={
            r.passes
              ? `M${passageX} 98 V260 l-9 -14 m9 14 l9 -14`
              : `M${passageX} 98 V113 m-10 0 h20`
          }
          stroke={r.passes ? '#547a50' : '#ac6257'}
          strokeWidth="5"
          fill="none"
        />
        <Label
          mode={mode}
          x={320}
          y={350}
          value={t('细胞内水环境', 'Intracellular water')}
        />
      </Scene>
    );
  }
  if (id === 'L098') {
    const rows = diffusionSeries(
      choice === 1 ? 10 : 16,
      choice === 1 ? 10 : 4,
      second === 0,
    );
    const r = rows[frame]!;
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          x={170}
          y={38}
          value={t('左室；体积1模型单位', 'Left; volume 1 model unit')}
        />
        <Label
          mode={mode}
          x={470}
          y={38}
          value={t('右室；体积1模型单位', 'Right; volume 1 model unit')}
        />
        <rect
          x="45"
          y="90"
          width="550"
          height="180"
          rx="12"
          fill="#dbe9ed"
          stroke="#437d95"
        />
        <path
          d="M320 90 V270"
          stroke="#926f50"
          strokeWidth="12"
          strokeDasharray={second ? '0' : '12 12'}
        />
        {[r.left, r.right].map((n, side) =>
          Array.from({ length: Math.round(n) }, (_, i) => (
            <circle
              key={`${side}-${i}`}
              cx={75 + side * 295 + (i % 5) * 40}
              cy={115 + Math.floor(i / 5) * 35}
              r="8"
              fill="#437d95"
            />
          )),
        )}
        <Label
          mode={mode}
          x={170}
          y={310}
          value={t(`量 ${r.left.toFixed(2)}`, `Amount ${r.left.toFixed(2)}`)}
        />
        <Label
          mode={mode}
          x={470}
          y={310}
          value={t(`量 ${r.right.toFixed(2)}`, `Amount ${r.right.toFixed(2)}`)}
        />
        <Label
          mode={mode}
          x={320}
          y={355}
          value={t(
            '圆点数四舍五入；精确量看表',
            'Dots rounded; exact amounts in table',
          )}
        />
      </Scene>
    );
  }
  if (id === 'L099') {
    const r = osmosisResponse(
      [-0.2, -0.8, -0.5][choice]!,
      -0.5,
      second === 0 ? 'plant' : 'animal',
    );
    // Plant frames depict early turgor change, never unsupported membrane withdrawal.
    const size =
      second === 0
        ? 206
        : frame === 0 || r.direction === 'balanced'
          ? 150
          : r.direction === 'in'
            ? 180
            : 112;
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          x={320}
          y={35}
          value={t(
            `初始 Ψ外=${[-0.2, -0.8, -0.5][choice]} MPa；Ψ内=−0.5 MPa`,
            `Initial Ψoutside=${[-0.2, -0.8, -0.5][choice]} MPa; Ψinside=−0.5 MPa`,
          )}
        />
        {second === 0 && (
          <rect
            x="210"
            y="100"
            width="220"
            height="220"
            rx="12"
            fill="none"
            stroke="#668454"
            strokeWidth="13"
          />
        )}
        <rect
          data-cell-membrane={second === 0 ? 'wall-adjacent' : 'animal'}
          x={320 - size / 2}
          y={210 - size / 2}
          width={size}
          height={size}
          rx={second === 0 ? 6 : 65}
          fill="#abc7de"
          stroke="#437d95"
          strokeWidth="4"
        />
        <Label mode={mode} x={320} y={205} value={cellNames[second]!} />
        <Label
          mode={mode}
          x={320}
          y={245}
          size={12}
          value={
            [
              t('起点', 'Initial state'),
              t('净水流方向', 'Net water direction'),
              t('膨压或体积趋势', 'Turgor / volume tendency'),
              t('梯度可随之改变', 'Gradient may change'),
            ][frame]!
          }
        />
        {frame > 0 && r.direction !== 'balanced' && (
          <path
            d={
              r.direction === 'in'
                ? 'M175 150 H250 l-9 -8 m9 8 l-9 8'
                : 'M250 150 H175 l9 -8 m-9 8 l9 8'
            }
            fill="none"
            stroke="#437d95"
            strokeWidth="4"
          />
        )}
        <Label
          mode={mode}
          x={320}
          y={355}
          value={
            second === 0 && r.direction === 'in'
              ? t('净入水；膨压上升趋势', 'Net entry; turgor tends to rise')
              : second === 0 && r.direction === 'out'
                ? t(
                    '净失水；膨压可下降，未示质壁分离',
                    'Net loss; turgor may fall, no plasmolysis shown',
                  )
                : r.direction === 'in'
                  ? t(
                      '水净进入 → 膨胀趋势',
                      'Net water entry → swelling tendency',
                    )
                  : r.direction === 'out'
                    ? t(
                        '水净离开 → 收缩趋势',
                        'Net water loss → shrinkage tendency',
                      )
                    : t(
                        '净水流为零；水仍双向运动',
                        'Zero net flow; water still moves both ways',
                      )
          }
        />
      </Scene>
    );
  }
  if (id === 'L100') {
    const area = choice ? 2 : 1,
      distance = second ? 0.5 : 1;
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          x={320}
          y={35}
          value={t(
            '相同通透性与浓度差；几何对照',
            'Same permeability and gradient; geometry comparison',
          )}
        />
        <path
          d={
            choice
              ? 'M50 190 Q80 70 110 190 T170 190 T230 190 T290 190'
              : 'M50 190 H290'
          }
          stroke="#678560"
          strokeWidth="12"
          fill="none"
        />
        <path
          d={`M50 ${190 + 70 * distance} H290`}
          stroke="#437d95"
          strokeWidth="7"
        />
        <Label
          mode={mode}
          x={170}
          y={310}
          value={t(
            `面积${area}；距离${distance}`,
            `Area ${area}; distance ${distance}`,
          )}
        />
        <rect x="400" y="105" width="100" height="160" rx="25" fill="#cda953" />
        <path
          d="M450 280 V75 l-12 17 m12 -17 l12 17"
          stroke={third ? '#547a50' : '#ac6257'}
          strokeWidth="6"
          fill="none"
        />
        <Label
          mode={mode}
          x={460}
          y={310}
          value={t(
            third ? '有代谢能与载体' : '能量不可用',
            third ? 'Energy and carrier available' : 'Energy unavailable',
          )}
        />
        <Label
          mode={mode}
          x={320}
          y={355}
          value={t(
            '面积增大不能替代逆梯度运输的能量',
            'More area cannot replace energy for uphill transport',
          )}
        />
      </Scene>
    );
  }
  if (id === 'L101')
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          x={320}
          y={30}
          value={t(
            '右心→肺；左心→全身（路线图）',
            'Right heart → lungs; left heart → body (route map)',
          )}
        />
        {circulationRoute.map((v, i) => {
          const x = 70 + (i % 5) * 125,
            y = 125 + Math.floor(i / 5) * 150;
          return (
            <g key={i}>
              <rect
                x={x - 56}
                y={y - 44}
                width="112"
                height="85"
                rx="15"
                fill={frame === i ? '#dbb75c' : '#d8e5df'}
                stroke={i >= 5 && i <= 8 ? '#ac6257' : '#437d95'}
                strokeWidth="3"
              />
              <Label
                mode={mode}
                x={x}
                y={y - 12}
                size={13}
                value={t(v[0], v[1])}
              />
              <text x={x} y={y + 30} textAnchor="middle" fontSize="14">
                {i + 1}
              </text>
              {i % 5 !== 4 && (
                <text x={x + 60} y={y} fontSize="20">
                  →
                </text>
              )}
            </g>
          );
        })}
        <path
          d="M580 177 V205 H70 V220"
          stroke="#668454"
          strokeWidth="3"
          fill="none"
        />
        <Label
          mode={mode}
          x={320}
          y={355}
          value={t(
            '按1→10；末端经静脉回1。颜色标示含氧状态。',
            'Follow 1→10, then veins return to 1. Colour denotes oxygenation.',
          )}
        />
      </Scene>
    );
  if (id === 'L102') {
    const route = absorptionRoute(foods[choice]!);
    const location = route.locations[frame]!;
    const position =
      location === 'lumen'
        ? { x: 80, y: 180 + frame * 35 }
        : location === 'epithelium'
          ? { x: 145, y: 270 }
          : { x: location === 'blood' ? 230 : 320, y: 285 };
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          x={320}
          y={35}
          value={t(
            '小肠绒毛：短路径与两条输出',
            'Intestinal villus: short path, two outputs',
          )}
        />
        <path
          d="M140 320 V210 Q140 120 320 120 Q500 120 500 210 V320"
          stroke="#ba9669"
          strokeWidth="18"
          fill="#e8e3c7"
        />
        <path
          d="M230 320 V230 Q320 170 410 230 V320"
          stroke="#ac6257"
          strokeWidth="12"
          fill="none"
        />
        <path d="M320 320 V220" stroke="#668454" strokeWidth="18" />
        <Label
          mode={mode}
          x={160}
          y={350}
          value={t('血毛细血管', 'Blood capillaries')}
        />
        <Label
          mode={mode}
          x={450}
          y={350}
          value={t('乳糜管（淋巴）', 'Lacteal (lymph)')}
        />
        {frame === 3 && (
          <path
            d={`M${choice === 2 ? 155 : 95} 285 H${position.x - 18} l-9 -8 m9 8 l-9 8`}
            stroke="#263b45"
            strokeWidth="3"
            fill="none"
          />
        )}
        {location === 'epithelium' && (
          <path
            d="M95 270 H127 l-8 -7 m8 7 l-8 7"
            stroke="#263b45"
            strokeWidth="3"
            fill="none"
          />
        )}
        <g
          data-food-location={location}
          data-food-state={
            frame === 0
              ? 'food'
              : choice === 2 && frame >= 2
                ? 'packaged-fat'
                : 'digestion-products'
          }
        >
          {frame === 0 ? (
            <g stroke="#926f50" strokeWidth="3">
              <path d={`M${position.x - 12} ${position.y} h24`} />
              {[-12, 0, 12].map((offset) => (
                <circle
                  key={offset}
                  cx={position.x + offset}
                  cy={position.y}
                  r="7"
                  fill="#cda953"
                />
              ))}
            </g>
          ) : choice === 2 && frame >= 2 ? (
            <rect
              x={position.x - 11}
              y={position.y - 11}
              width="22"
              height="22"
              rx="5"
              fill="#668454"
              stroke="#263b45"
              strokeWidth="2"
            />
          ) : (
            <circle
              cx={position.x}
              cy={position.y}
              r="8"
              fill={choice === 2 ? '#668454' : '#ac6257'}
            />
          )}
        </g>
        <Label
          mode={mode}
          x={320}
          y={75}
          size={13}
          value={t(route.stages[frame]![0], route.stages[frame]![1])}
        />
        <Label
          mode={mode}
          x={70}
          y={125}
          size={12}
          value={t('肠腔', 'Lumen')}
        />
        <path
          d="M103 305 H130"
          stroke="#6c6f61"
          strokeWidth="1.5"
          fill="none"
        />
        <Label
          mode={mode}
          x={65}
          y={305}
          size={11}
          value={t('上皮', 'Epithelium')}
        />
      </Scene>
    );
  }
  if (id === 'L103')
    return (
      <Scene id={id} mode={mode}>
        <Label
          mode={mode}
          x={320}
          y={35}
          value={t(
            '肾单位：路线简化，位置不按比例',
            'Nephron: simplified route, not to scale',
          )}
        />
        <circle
          cx="110"
          cy="150"
          r="55"
          fill="#d6afab"
          stroke="#ac6257"
          strokeWidth="10"
        />
        <path
          d="M165 150 H230 V260 H380 V150 H480 V310"
          stroke="#cda953"
          strokeWidth="25"
          fill="none"
        />
        <path d="M60 240 H410" stroke="#437d95" strokeWidth="15" />
        <path
          d="M110 150 L210 150 M280 260 V245 M420 160 V235"
          stroke="#668454"
          strokeWidth="5"
        />
        <circle
          cx={[110, 280, 420, 480][frame]}
          cy={[150, 260, 160, 310][frame]}
          r="15"
          fill="#263b45"
        />
        <Label
          mode={mode}
          x={110}
          y={82}
          value={t('血→滤液', 'Blood → filtrate')}
        />
        <Label
          mode={mode}
          x={285}
          y={310}
          value={t('回收→血', 'Recovery → blood')}
        />
        <Label mode={mode} x={495} y={350} value={t('尿液', 'Urine')} />
      </Scene>
    );
  const steps = choice
    ? [
        t('分泌', 'Secretion'),
        t('血液', 'Blood'),
        t('接触', 'Exposure'),
        t('靶细胞', 'Target'),
      ]
    : [
        t('感受', 'Detection'),
        t('轴突', 'Axon'),
        t('突触', 'Synapse'),
        t('靶细胞', 'Target'),
      ];
  return (
    <Scene id={id} mode={mode}>
      <Label
        mode={mode}
        x={320}
        y={35}
        value={t(
          '路线不同，受体决定响应',
          'Different routes; receptors determine response',
        )}
      />
      {steps.map((s, i) => (
        <g key={i}>
          <rect
            x={45 + i * 150}
            y="105"
            width="130"
            height="120"
            rx="18"
            fill={frame === i ? '#dbb75c' : '#d8e5df'}
          />
          <text x={110 + i * 150} y="140" textAnchor="middle" fontSize="18">
            {i + 1}
          </text>
          <Label mode={mode} x={110 + i * 150} y={175} size={12} value={s} />
          {i < 3 && (
            <text x={179 + i * 150} y="165" fontSize="22">
              →
            </text>
          )}
        </g>
      ))}
      <Label
        mode={mode}
        x={320}
        y={300}
        value={
          second
            ? t(
                '靶细胞没有匹配受体：本信号无效',
                'Target lacks matching receptor: no response',
              )
            : t(
                '匹配受体：能响应本信号',
                'Matching receptor: can respond to signal',
              )
        }
      />
      <Label
        mode={mode}
        x={320}
        y={355}
        value={t(
          '示意帧不是相等真实时长',
          'Frames are not equal biological durations',
        )}
      />
    </Scene>
  );
}
export function TransportPhysiologyDiagram({ id, mode }: Props) {
  return (
    <div className="bio-s5-lab tp-lab">
      <Figure id={id} mode={mode} />
    </div>
  );
}
export function TransportPhysiologyHookArt({ id, mode }: Props) {
  return (
    <div className="bio-s5-lab tp-lab">
      <Figure id={id} mode={mode} frame={id === 'L101' ? 4 : 0} />
    </div>
  );
}
export function TransportPhysiologyExplore({
  id,
  mode,
  onExplore,
}: Props & { onExplore: () => void }) {
  const [choice, setChoice] = useState(0),
    [second, setSecond] = useState(0),
    [third, setThird] = useState(0);
  const last = id === 'L101' ? 9 : id === 'L098' ? 4 : 3;
  const flow = useFrames(last, onExplore);
  const change = (setter: (n: number) => void) => (n: number) => {
    setter(n);
    flow.reset();
    onExplore();
  };
  const choiceSet = change(setChoice),
    secondSet = change(setSecond),
    thirdSet = change(setThird);
  const process = id !== 'L097' && id !== 'L100';
  const kind: CellKind = second === 0 ? 'plant' : 'animal';
  const water = osmosisResponse([-0.2, -0.8, -0.5][choice]!, -0.5, kind);
  const capacity = exchangeCapacity(
    choice ? 2 : 1,
    second ? 0.5 : 1,
    3,
    third === 1,
  );
  const balance = kidneyBalance(choice ? 'high' : 'low');
  const signal = signalResponse(choice ? 'hormone' : 'nerve', second === 0);
  return (
    <div className="bio-s5-lab tp-lab">
      {id === 'L097' && (
        <>
          <Choices
            mode={mode}
            label={t('选择跨膜物质', 'Choose a transported substance')}
            values={moleculeNames}
            selected={choice}
            onSelect={choiceSet}
          />
          <Choices
            mode={mode}
            label={t('匹配运输蛋白', 'Matching transport protein')}
            values={[
              t('无匹配蛋白', 'No matching protein'),
              t('有匹配蛋白', 'Matching protein present'),
            ]}
            selected={second}
            onSelect={secondSet}
          />
        </>
      )}
      {id === 'L098' && (
        <>
          <Choices
            mode={mode}
            label={t('两室初始量（等体积）', 'Initial amounts (equal volumes)')}
            values={[
              t('左16、右4', 'Left 16, right 4'),
              t('左10、右10', 'Left 10, right 10'),
            ]}
            selected={choice}
            onSelect={choiceSet}
          />
          <Choices
            mode={mode}
            label={t(
              '膜对该物质的通透性',
              'Membrane permeability to this substance',
            )}
            values={[t('可透过', 'Permeable'), t('不可透过', 'Impermeable')]}
            selected={second}
            onSelect={secondSet}
          />
        </>
      )}
      {id === 'L099' && (
        <>
          <Choices
            mode={mode}
            label={t(
              '初始外液总水势；温度相同',
              'Initial external total water potential; same temperature',
            )}
            values={[
              t('−0.2 MPa', '−0.2 MPa'),
              t('−0.8 MPa', '−0.8 MPa'),
              t('−0.5 MPa', '−0.5 MPa'),
            ]}
            selected={choice}
            onSelect={choiceSet}
          />
          <Choices
            mode={mode}
            label={t('细胞类型', 'Cell type')}
            values={cellNames}
            selected={second}
            onSelect={secondSet}
          />
        </>
      )}
      {id === 'L100' && (
        <>
          <Choices
            mode={mode}
            label={t('面积（相对单位）', 'Area (relative units)')}
            values={[t('1', '1'), t('2', '2')]}
            selected={choice}
            onSelect={choiceSet}
          />
          <Choices
            mode={mode}
            label={t('路径长度（相对单位）', 'Path length (relative units)')}
            values={[t('1', '1'), t('0.5', '0.5')]}
            selected={second}
            onSelect={secondSet}
          />
          <Choices
            mode={mode}
            label={t('逆梯度载体能量供应', 'Energy for uphill carriers')}
            values={[t('不可用', 'Unavailable'), t('可用', 'Available')]}
            selected={third}
            onSelect={thirdSet}
          />
        </>
      )}
      {id === 'L101' && (
        <Choices
          mode={mode}
          label={t(
            '单向瓣膜两侧模型压力（kPa）',
            'Model pressures across a one-way valve (kPa)',
          )}
          values={[
            t('前12、后8', 'Upstream 12, downstream 8'),
            t('前8、后12', 'Upstream 8, downstream 12'),
          ]}
          selected={choice}
          onSelect={choiceSet}
        />
      )}
      {id === 'L102' && (
        <Choices
          mode={mode}
          label={t('追踪食物成分', 'Trace a food component')}
          values={[
            t('淀粉', 'Starch'),
            t('蛋白质', 'Protein'),
            t('长链脂肪', 'Long-chain fats'),
          ]}
          selected={choice}
          onSelect={choiceSet}
        />
      )}
      {id === 'L103' && (
        <Choices
          mode={mode}
          label={t(
            '相同100 mL滤液的ADH比较',
            'Compare ADH with the same 100 mL filtrate',
          )}
          values={[t('较低ADH', 'Lower ADH'), t('较高ADH', 'Higher ADH')]}
          selected={choice}
          onSelect={choiceSet}
        />
      )}
      {id === 'L104' && (
        <>
          <Choices
            mode={mode}
            label={t('信息路线', 'Signal pathway')}
            values={[t('神经', 'Nervous'), t('内分泌', 'Endocrine')]}
            selected={choice}
            onSelect={choiceSet}
          />
          <Choices
            mode={mode}
            label={t('靶细胞', 'Target cell')}
            values={[
              t('匹配受体', 'Matching receptor'),
              t('无匹配受体', 'No matching receptor'),
            ]}
            selected={second}
            onSelect={secondSet}
          />
        </>
      )}
      <Figure
        id={id}
        mode={mode}
        choice={choice}
        second={second}
        third={third}
        frame={flow.frame}
      />
      {process && <Playback mode={mode} flow={flow} />}
      {id === 'L097' && (
        <>
          <Note
            mode={mode}
            value={
              membranePassage(molecules[choice]!, second === 1).passes
                ? t(
                    '本模型允许通过。氧气可通过脂质核心；离子和葡萄糖需要各自匹配的运输蛋白。选择蛋白存在不等于证明主动运输。',
                    'Passage allowed in this model. Oxygen crosses the lipid core; ions and glucose need their respective matching proteins. Protein presence alone does not establish active transport.',
                  )
                : t(
                    '本模型阻止通过：亲水或带电物质不易穿过疏水核心，不能只按大小判定。',
                    'Passage blocked: hydrophilic or charged substances do not readily cross the hydrophobic core; size alone is insufficient.',
                  )
            }
          />
          <Records
            mode={mode}
            title={t('静态结构证据', 'Static structural evidence')}
            headers={[
              t('结构', 'Structure'),
              t('位置与意义', 'Position and significance'),
            ]}
            rows={[
              [
                t('亲水头', 'Hydrophilic heads'),
                t('朝向两侧水环境', 'Face water on both sides'),
              ],
              [
                t('疏水尾', 'Hydrophobic tails'),
                t('相向组成内部核心', 'Face one another in the core'),
              ],
              [
                t('膜蛋白', 'Membrane proteins'),
                t(
                  '可嵌入/跨越；部分受锚定，非全部固定',
                  'Embedded/spanning; some anchored, not all fixed',
                ),
              ],
            ]}
          />
        </>
      )}
      {id === 'L098' && (
        <>
          <Note
            mode={mode}
            value={t(
              '模型每步各侧现有量的1/4交换，密闭等体积、无反应、固定通透性；量为大量粒子的期望值。表中双向量是刚完成的一步；第0步尚未交换。量为模型单位，步骤不是秒；圆点仅近似显示。平衡时双向流可相等而不为零。',
              'Each step transfers one quarter of each side’s current amount; closed equal-volume compartments, no reactions, fixed permeability; amounts are expected values for many particles. Two-way amounts describe the just-completed step; step 0 precedes exchange. Amounts are model units, steps are not seconds and dots are approximate. At equilibrium, nonzero two-way transfers balance.',
            )}
          />
          <Records
            mode={mode}
            title={t(
              '完整静态扩散账本（模型单位）',
              'Complete static diffusion ledger (model units)',
            )}
            headers={[
              t('步', 'Step'),
              t('左量', 'Left amount'),
              t('右量', 'Right amount'),
              t('左→右', 'L→R'),
              t('右→左', 'R→L'),
              t('净左→右', 'Net L→R'),
            ]}
            rows={diffusionSeries(
              choice ? 10 : 16,
              choice ? 10 : 4,
              second === 0,
            ).map((r, i) => [
              i,
              ...[r.left, r.right, r.forward, r.reverse, r.net].map((n) =>
                n.toFixed(2),
              ),
            ])}
          />
        </>
      )}
      {id === 'L099' && (
        <>
          <Note
            mode={mode}
            value={t(
              `当前初始净方向：${water.direction === 'in' ? '进细胞' : water.direction === 'out' ? '出细胞' : '净零'}。膜透水、所选溶质不透过；比较总水势，不能只比较溶质浓度。植物图仅示膜贴壁的早期膨压变化趋势，未画质壁分离；动物尺寸只示趋势，不预测最终体积或压力。`,
              `Initial net direction: ${water.direction === 'in' ? 'into cell' : water.direction === 'out' ? 'out of cell' : 'zero net'}. Membrane passes water, not the selected solute. Compare total water potential, not solute concentration alone. Plant frames show early turgor tendencies with membrane against wall, not plasmolysis. Animal sizes show tendencies, not final volumes or pressures.`,
            )}
          />
          <Records
            mode={mode}
            title={t('完整静态渗透推理', 'Complete static osmosis reasoning')}
            headers={[t('步', 'Step'), t('机制/边界', 'Mechanism / limit')]}
            rows={[
              [
                0,
                t(
                  '读初始Ψ外与Ψ内，温度相同',
                  'Read initial external and internal Ψ at equal temperature',
                ),
              ],
              [
                1,
                t(
                  '水从较高总水势向较低总水势净移动',
                  'Net water moves from higher to lower total water potential',
                ),
              ],
              [
                2,
                t(
                  '植物少量失水可先降膨压，足够失水才可能质壁分离；进水可增加膨压。动物失水可皱缩，过量进水可破裂',
                  'Plant water loss can first reduce turgor; sufficient loss may cause plasmolysis. Entry can raise turgor. Animals may shrink on loss or lyse after excessive entry',
                ),
              ],
              [
                3,
                t(
                  '随着浓度/压力变化净流减小；水仍双向运动',
                  'Changing concentration/pressure reduces net flow; water still moves both ways',
                ),
              ],
            ]}
          />
        </>
      )}
      {id === 'L100' && (
        <>
          <Note
            mode={mode}
            value={t(
              `固定浓度差3与通透性：相对被动容量=A×3/d=${capacity.passive}；逆梯度运输=${capacity.uphill}模型单位/步（载体2，假定充足底物）。本静态比较无时间播放。`,
              `Fixed gradient 3 and permeability: relative passive capacity=A×3/d=${capacity.passive}; uphill uptake=${capacity.uphill} model units/step (2 carriers, assumed ample substrate). This static comparison has no timeline.`,
            )}
          />
          <Records
            mode={mode}
            title={t(
              '相同梯度的几何对照；原创模型',
              'Geometry comparisons at fixed gradient; original model',
            )}
            headers={[
              t('面积', 'Area'),
              t('距离', 'Distance'),
              t('相对容量', 'Relative capacity'),
            ]}
            rows={[
              [1, 1, 3],
              [2, 1, 6],
              [2, 0.5, 12],
            ]}
          />
          <Note
            mode={mode}
            value={t(
              '主动运输需代谢能和特定载体；能量可来自ATP直接驱动，也可来自此前建立的离子梯度。面积大、屏障薄及血流/通气维持梯度互相配合；实际速率还受运输蛋白饱和等影响。',
              'Active transport needs metabolic energy and specific carriers. Energy may come directly from ATP or from previously established ion gradients. Large area, thin barriers and maintained gradients cooperate; real rates can be limited by carrier saturation.',
            )}
          />
        </>
      )}
      {id === 'L101' && (
        <>
          <Note
            mode={mode}
            value={t(
              `当前模型瓣膜${valveOpen(choice ? 8 : 12, choice ? 12 : 8) ? '打开' : '关闭'}：压力差推动开闭；瓣膜不是主动泵。表中压力为独立假设对照，不代表每个心腔的典型实测值。`,
              `Model valve ${valveOpen(choice ? 8 : 12, choice ? 12 : 8) ? 'opens' : 'closes'} as the pressure difference changes; valves are not active pumps. Pressures are independent hypothetical comparisons, not typical measured values for each chamber.`,
            )}
          />
          <Records
            mode={mode}
            title={t('完整静态血流路线', 'Complete static blood-flow route')}
            headers={[
              t('序', 'Order'),
              t('位置', 'Location'),
              t('血氧/结构解释', 'Oxygenation / explanation'),
            ]}
            rows={circulationRoute.map((r, i) => [
              i + 1,
              t(r[0], r[1]),
              i === 4
                ? t('肺交换后含氧量升高', 'Oxygen rises during lung exchange')
                : i === 9
                  ? t(
                      '组织取氧后含氧量降低',
                      'Oxygen falls as tissues take it up',
                    )
                  : i < 4
                    ? t(
                        '相对低氧；流向定义动静脉',
                        'Relatively low O₂; direction defines artery/vein',
                      )
                    : t(
                        '相对高氧；左室壁较厚',
                        'Relatively high O₂; thicker left ventricular wall',
                      ),
            ])}
          />
        </>
      )}
      {id === 'L102' && (
        <>
          <Records
            mode={mode}
            title={t(
              '完整静态消化—吸收路线',
              'Complete static digestion–absorption route',
            )}
            headers={[t('步', 'Step'), t('发生什么', 'What happens')]}
            rows={absorptionRoute(foods[choice]!).stages.map((s, i) => [
              i + 1,
              t(s[0], s[1]),
            ])}
          />
          <Note
            mode={mode}
            value={t(
              '消化改变大分子，吸收是产物跨上皮进入体内。绒毛/微绒毛增面积、上皮薄、血和淋巴及时带走产物。长链脂肪在上皮内重组并包装后主要进入乳糜管；本课不把所有脂肪酸都归到同一路线。胆汁不是酶；淀粉酶不一步生成全部葡萄糖。',
              'Digestion changes large molecules; absorption carries products across epithelium. Villi/microvilli increase area, thin epithelium shortens paths, and blood/lymph remove products. Long-chain fats are rebuilt and packaged in epithelial cells, entering lacteals mainly; not every fatty acid follows this route. Bile is not an enzyme and amylase does not complete glucose production in one step.',
            )}
          />
        </>
      )}
      {id === 'L103' && (
        <>
          <Records
            mode={mode}
            title={t(
              '完整静态过滤和回收；虚构100 mL滤液',
              'Complete static filtration and recovery; fictional 100 mL filtrate',
            )}
            headers={[t('量', 'Quantity'), t('mL', 'mL')]}
            rows={[
              [
                t('进入肾小管的滤液', 'Filtrate entering tubules'),
                balance.filtrateMl,
              ],
              [t('回到血的水', 'Water returned to blood'), balance.recoveredMl],
              [
                t('余留尿液', 'Remaining urine'),
                Number(balance.urineMl.toFixed(2)),
              ],
            ]}
          />
          <Records
            mode={mode}
            title={t('静态过程顺序', 'Static process sequence')}
            headers={[t('步', 'Step'), t('过程', 'Process')]}
            rows={kidneySteps.map((s, i) => [i + 1, s])}
          />
          <Note
            mode={mode}
            value={t(
              '过滤由压力及屏障选择性决定，血细胞和大部分大蛋白正常保留在血中；葡萄糖等小分子先进入滤液再选择性重吸收。假设低/高ADH时总回收90%/98%，用于水量守恒，不是人体每日测定。水不足→血浆渗透浓度上升→下丘脑感受→垂体后叶释放更多ADH→集合管透水性增加→更多水回收→原变化减弱。无个人检测或诊疗。',
              'Pressure and barrier selectivity drive filtration; cells and most large proteins normally stay in blood. Small glucose molecules enter filtrate and are selectively reabsorbed. Assumed total recovery is 90%/98% at low/high ADH, illustrating conservation rather than daily human measurements. Water shortage → higher plasma osmotic concentration → hypothalamic detection → more ADH released from posterior pituitary → greater collecting-duct water permeability → greater recovery → reduced original change. No personal testing or diagnosis.',
            )}
          />
        </>
      )}
      {id === 'L104' && (
        <>
          <Records
            mode={mode}
            title={t('完整静态信息路径', 'Complete static signal pathway')}
            headers={[t('步', 'Step'), t('过程', 'Process')]}
            rows={(choice ? hormoneSteps : nerveSteps).map((s, i) => [
              i + 1,
              s,
            ])}
          />
          <Records
            mode={mode}
            title={t(
              '原创时间证据；两选定响应而非普遍定律',
              'Original timing evidence; two selected responses, not universal laws',
            )}
            headers={[
              t('路线', 'Route'),
              t('起效/s', 'Onset / s'),
              t('持续/s', 'Duration / s'),
            ]}
            rows={[
              [t('本神经响应', 'Selected neural response'), 0.05, 0.2],
              [t('本激素响应', 'Selected endocrine response'), 5, 60],
            ]}
          />
          <Note
            mode={mode}
            value={t(
              `当前${signal.responds ? '有匹配受体，可响应' : '无匹配受体，不响应'}。神经常较快且定位，激素随血液分布但只作用于具备受体与适当细胞机制的靶细胞。速度/持续时间是典型比较而非绝对；神经可刺激内分泌细胞，激素也会影响神经。不要用示意播放帧长推算真实时间。`,
              `Current target ${signal.responds ? 'has a matching receptor and can respond' : 'lacks a matching receptor and does not respond'}. Neural signalling is often fast and directed; blood carries hormones widely but targets require receptors and suitable cellular machinery. Speed/duration comparisons are typical, not absolute. Nerves can stimulate endocrine cells and hormones can affect nerves. Do not infer real time from frame duration.`,
            )}
          />
        </>
      )}
    </div>
  );
}
