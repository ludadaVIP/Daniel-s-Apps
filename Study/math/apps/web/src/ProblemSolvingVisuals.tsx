import type { LanguageMode } from '@study/shared';
import { DataFigure } from './DataModellingVisuals';
import { t } from './model';
import {
  workshopModel,
  workshopComparison,
  workshopDependencies,
  type WorkshopStep,
} from './problemSolvingModels';
const word = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
export const stepLabels = {
  demand: t('总需求', 'Demand'),
  net: t('扣库存', 'Shortage'),
  packets: t('整包采购', 'Packets'),
  cost: t('算费用', 'Cost'),
  capacity: t('查容量', 'Capacity'),
  decision: t('合并决策', 'Decision'),
};
export function DependencyFigure({
  mode,
  done = [],
}: {
  mode: LanguageMode;
  done?: WorkshopStep[];
}) {
  const positions: Record<WorkshopStep, [number, number]> = {
    demand: [82, 70],
    net: [240, 70],
    packets: [398, 70],
    cost: [556, 70],
    capacity: [240, 190],
    decision: [556, 190],
  };
  return (
    <DataFigure
      mode={mode}
      name={t('任务依赖图', 'Task dependency diagram')}
      caption={t(
        '箭头从前置任务指向后续任务。容量是一条独立分支；节点只标记已完成步骤，不表示数值。',
        'Arrows run from prerequisites to dependent tasks. Capacity is independent; marked nodes show completion, not numerical magnitude.',
      )}
    >
      <svg
        viewBox="0 0 640 260"
        width="640"
        role="img"
        aria-label={word(
          mode,
          '六项任务的先后依赖',
          'Dependencies among six tasks',
        )}
      >
        {Object.entries(workshopDependencies).flatMap(([target, deps]) =>
          deps.map((source) => {
            const a = positions[source],
              b = positions[target as WorkshopStep];
            return (
              <g key={`${source}-${target}`}>
                <line
                  x1={a[0]}
                  y1={a[1]}
                  x2={b[0]}
                  y2={b[1]}
                  stroke="#54706d"
                  strokeWidth="2"
                />
                <text
                  x={(a[0] + b[0]) / 2}
                  y={(a[1] + b[1]) / 2 + 5}
                  transform={`rotate(${(Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI} ${(a[0] + b[0]) / 2} ${(a[1] + b[1]) / 2})`}
                  textAnchor="middle"
                  fontSize="18"
                >
                  →
                </text>
              </g>
            );
          }),
        )}
        {(Object.keys(positions) as WorkshopStep[]).map((s) => (
          <g key={s} data-step={s} data-complete={done.includes(s)}>
            <rect
              x={positions[s][0] - 65}
              y={positions[s][1] - 23}
              width="130"
              height="46"
              rx="12"
              fill={done.includes(s) ? '#d5f3df' : '#edf3fa'}
              stroke="#35596c"
            />
            <text
              x={positions[s][0]}
              y={positions[s][1] + 5}
              textAnchor="middle"
              fontSize="16"
            >
              {stepLabels[s][mode === 'en' ? 'en' : 'zh']}
              {done.includes(s) ? ' ✓' : ''}
            </text>
          </g>
        ))}
      </svg>
    </DataFigure>
  );
}
export function PacketFigure({
  mode,
  n = 18,
  stock = 4,
}: {
  mode: LanguageMode;
  n?: number;
  stock?: number;
}) {
  const m = workshopModel({ n, stock }),
    cells = Array.from({ length: m.supply }, (_, i) => ({
      i,
      kind: i < n * 3 ? 'participant' : i < m.demand ? 'reserve' : 'unused',
      bought: i >= stock,
    })),
    rows = Math.max(1, Math.ceil(cells.length / 16)),
    height = 100 + rows * 29;
  return (
    <DataFigure
      mode={mode}
      name={t('逐张材料核验图', 'Card-by-card materials audit')}
      caption={t(
        '每格严格代表1张。蓝=参与者，橙=备用，白=剩余；深边框=原库存，细边框=新购。新购每8格为一包；包号P与库存号S保留来源。',
        'Every cell is one card: blue for participants, orange for spares, white for surplus. Dark borders denote stock, thin borders purchases. Every eight purchased cells form one packet; P and S labels retain provenance.',
      )}
    >
      <svg
        viewBox={`0 0 640 ${height}`}
        width="640"
        role="img"
        aria-label={word(
          mode,
          '实际卡片数量与用途',
          'Exact card quantities and uses',
        )}
      >
        <text x="20" y="24" fontSize="15">
          {word(
            mode,
            `n=${n}人，库存=${stock}张；新购包按8张分组`,
            `n=${n} people, stock=${stock} cards; purchased packets contain eight`,
          )}
        </text>
        {cells.map(({ i, kind, bought }) => (
          <g
            key={i}
            data-card={i + 1}
            data-use={kind}
            data-source={bought ? 'purchase' : 'stock'}
            data-packet={bought ? Math.floor((i - stock) / 8) + 1 : undefined}
          >
            <rect
              x={20 + (i % 16) * 37}
              y={42 + Math.floor(i / 16) * 29}
              width="33"
              height="25"
              fill={
                kind === 'participant'
                  ? '#acd4ef'
                  : kind === 'reserve'
                    ? '#ffd895'
                    : '#fff'
              }
              stroke="#24485f"
              strokeWidth={bought ? 1 : 3}
            />
            <text
              x={36.5 + (i % 16) * 37}
              y={58 + Math.floor(i / 16) * 29}
              textAnchor="middle"
              fontSize="9"
            >
              {bought ? `P${Math.floor((i - stock) / 8) + 1}` : `S${i + 1}`}
            </text>
          </g>
        ))}
        {cells.length === 0 && (
          <text x="20" y="60">
            {word(mode, '没有卡片', 'No cards')}
          </text>
        )}
        <text x="20" y={height - 12} fontSize="15">
          {word(
            mode,
            `总供给${m.supply} = 需求${m.demand} + 剩余${m.surplus}`,
            `Supply ${m.supply} = demand ${m.demand} + surplus ${m.surplus}`,
          )}
        </text>
      </svg>
    </DataFigure>
  );
}
export function CostFigure({
  mode,
  axis = 'people',
  budget = 50,
}: {
  mode: LanguageMode;
  axis?: 'people' | 'packets';
  budget?: number;
}) {
  const rows =
      axis === 'people'
        ? workshopComparison(budget).rows.map((r) => ({
            x: r.n,
            a: r.a,
            b: r.b,
          }))
        : Array.from({ length: 8 }, (_, i) => ({
            x: i + 1,
            a: 7 + 6 * (i + 1),
            b: 19 + 4 * (i + 1),
          })),
    xmax = axis === 'people' ? 20 : 8,
    px = (x: number) => 60 + (x / xmax) * 540,
    py = (y: number) => 330 - (y / 80) * 270;
  return (
    <DataFigure
      mode={mode}
      name={t('两方案费用图', 'Two-plan cost plot')}
      caption={
        axis === 'people'
          ? t(
              '横轴为整数人数n，点表示可输入人数；没有用连线制造小数人数。n=0是取消分支。',
              'The horizontal axis is whole attendance n. Discrete dots represent admissible inputs; no interpolation creates fractional people. Zero is cancellation.',
            )
          : t(
              '横轴为正活动的整数包数k=1…8，直线显示仿射关系；只在整包点实施。取消n=0单独计0，不能用直线截距计费。',
              'The horizontal axis is positive-event packet count k=1…8. Lines show affine relationships, implemented only at whole packets. Cancellation costs zero separately, not the line intercept.',
            )
      }
    >
      <svg
        viewBox="0 0 640 395"
        width="640"
        role="img"
        aria-label={word(
          mode,
          '坐标按人数或包数和费用绘制',
          'Costs plotted against attendance or packets',
        )}
      >
        {[0, 20, 40, 60, 80].map((y) => (
          <g key={y}>
            <line x1="60" y1={py(y)} x2="600" y2={py(y)} stroke="#d7e3ea" />
            <text x="48" y={py(y) + 5} textAnchor="end" fontSize="14">
              {y}
            </text>
          </g>
        ))}
        <line x1="60" y1="60" x2="60" y2="330" stroke="#385567" />
        <line x1="60" y1="330" x2="600" y2="330" stroke="#385567" />
        <line
          x1="60"
          x2="600"
          y1={py(budget)}
          y2={py(budget)}
          stroke="#a74938"
          strokeDasharray="6 4"
        />
        <text x="600" y={py(budget) - 7} textAnchor="end" fontSize="13">
          {word(mode, '预算', 'Budget')} {budget}
        </text>
        {(axis === 'people' ? [0, 5, 10, 15, 20] : [0, 2, 4, 6, 8]).map((x) => (
          <text key={x} x={px(x)} y="352" textAnchor="middle" fontSize="14">
            {x}
          </text>
        ))}
        {axis === 'packets' &&
          (['a', 'b'] as const).map((plan) => (
            <polyline
              key={plan}
              points={rows.map((r) => `${px(r.x)},${py(r[plan])}`).join(' ')}
              fill="none"
              stroke={plan === 'a' ? '#19639a' : '#b35a17'}
              strokeWidth="2"
            />
          ))}
        {rows.flatMap((r) => [
          <circle
            key={`a${r.x}`}
            data-plan="A"
            data-x={r.x}
            data-cost={r.a}
            cx={px(r.x)}
            cy={py(r.a)}
            r="5"
            fill="#19639a"
          />,
          <rect
            key={`b${r.x}`}
            data-plan="B"
            data-x={r.x}
            data-cost={r.b}
            x={px(r.x) - 3}
            y={py(r.b) - 3}
            width="6"
            height="6"
            fill="#e98936"
            stroke="#7c3e10"
          />,
        ])}
        <text x="20" y="25" fontSize="15">
          {word(mode, '费用 / 筹码', 'Cost / toy credits')}
        </text>
        <text x="330" y="380" textAnchor="middle" fontSize="15">
          {axis === 'people'
            ? word(mode, '人数n / 人', 'Attendance n / people')
            : word(mode, '包数k / 包', 'Packet count k / packets')}
        </text>
        <text x="365" y="25" fontSize="14" fill="#19639a">
          ● A
        </text>
        <text x="435" y="25" fontSize="14" fill="#994c14">
          ■ B
        </text>
      </svg>
    </DataFigure>
  );
}
export function WitnessFigure({ mode }: { mode: LanguageMode }) {
  return (
    <DataFigure
      mode={mode}
      name={t('同周长矩形的可变面积', 'Variable area at fixed perimeter')}
      caption={t(
        '同一长度刻度：每单位40像素。1×5和2×4周长均12，面积分别5、8；旋转1×5只变成5×1，不改变面积。',
        'One length unit is forty pixels in both drawings. Rectangles 1×5 and 2×4 both have perimeter twelve, with areas five and eight. Rotating 1×5 gives 5×1 and preserves area.',
      )}
    >
      <svg
        viewBox="0 0 640 300"
        width="640"
        role="img"
        aria-label={word(
          mode,
          '两个同周长不同面积矩形',
          'Two equal-perimeter rectangles with unequal areas',
        )}
      >
        <rect
          x="60"
          y="60"
          width="200"
          height="40"
          fill="#c7e7f4"
          stroke="#245a79"
        />
        <rect
          x="360"
          y="60"
          width="160"
          height="80"
          fill="#f8d9ab"
          stroke="#80531c"
        />
        <text x="160" y="45" textAnchor="middle">
          5
        </text>
        <text x="45" y="85" textAnchor="middle">
          1
        </text>
        <text x="440" y="45" textAnchor="middle">
          4
        </text>
        <text x="340" y="105" textAnchor="middle">
          2
        </text>
        <text x="160" y="180" textAnchor="middle">
          P=12, A=5
        </text>
        <text x="440" y="180" textAnchor="middle">
          P=12, A=8
        </text>
        <text x="320" y="240" textAnchor="middle">
          2(a+6−a)=12; A=a(6−a)
        </text>
      </svg>
    </DataFigure>
  );
}
