import type { LanguageMode } from '@study/shared';
import {
  chargeTransfer,
  chargeInteraction,
  currentWindow,
  circuitPoint,
  dcCircuit,
  type CircuitCase,
} from './electricModels';
const ink = '#a58cb4',
  blue = '#82adbd',
  gold = '#bc996a';
const word = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
const fmt = (n: number) => String(Number(n.toFixed(2)));
export function ChargeScene({
  transfer,
  progress,
  mode,
}: {
  transfer: number;
  progress: number;
  mode: LanguageMode;
}) {
  const m = chargeTransfer(transfer, progress);
  return (
    <g>
      <text x="160" y="42" textAnchor="middle">
        A
      </text>
      <text x="460" y="42" textAnchor="middle">
        B
      </text>
      {[m.electronsA, m.electronsB].map((electrons, side) => {
        const cx = 160 + side * 300;
        return (
          <g key={side}>
            <rect
              x={cx - 95}
              y="65"
              width="190"
              height="180"
              rx="20"
              fill={side ? '#f3ebdf' : '#ede6f2'}
              stroke={side ? gold : ink}
              strokeWidth="2"
            />
            {Array.from({ length: 8 }, (_, i) => (
              <g key={`p${i}`}>
                <circle
                  cx={cx - 51 + (i % 4) * 34}
                  cy={89 + Math.floor(i / 4) * 30}
                  r="11"
                  fill="#e2c9a7"
                />
                <text
                  x={cx - 51 + (i % 4) * 34}
                  y={95 + Math.floor(i / 4) * 30}
                  textAnchor="middle"
                  fontSize="18"
                >
                  +
                </text>
              </g>
            ))}
            {Array.from({ length: electrons }, (_, i) => (
              <g key={`e${i}`}>
                <circle
                  cx={cx - 51 + (i % 4) * 34}
                  cy={160 + Math.floor(i / 4) * 30}
                  r="11"
                  fill="#c9e0e8"
                />
                <text
                  x={cx - 51 + (i % 4) * 34}
                  y={166 + Math.floor(i / 4) * 30}
                  textAnchor="middle"
                  fontSize="18"
                >
                  −
                </text>
              </g>
            ))}
          </g>
        );
      })}
      {m.inFlight > 0 && (
        <g>
          <circle
            cx={transfer > 0 ? 365 - m.fraction * 110 : 255 + m.fraction * 110}
            cy="175"
            r="12"
            fill={blue}
          />
          <text
            x={transfer > 0 ? 365 - m.fraction * 110 : 255 + m.fraction * 110}
            y="181"
            textAnchor="middle"
            fontSize="18"
            fill="white"
          >
            −
          </text>
        </g>
      )}
      <text x="160" y="286" textAnchor="middle">
        {m.chargeA > 0 ? '+' : ''}
        {m.chargeA}e
      </text>
      <text x="460" y="286" textAnchor="middle">
        {m.chargeB > 0 ? '+' : ''}
        {m.chargeB}e
      </text>
      <text x="310" y="326" textAnchor="middle">
        {word(mode, '途中', 'In transit')} {m.transitCharge}e · Σ 0
      </text>
    </g>
  );
}
export function InteractionScene({
  partner,
  progress,
  mode,
}: {
  partner: number;
  progress: number;
  mode: LanguageMode;
}) {
  const m = chargeInteraction(partner),
    attract = m.action === 'attract';
  return (
    <g>
      <circle
        cx="160"
        cy="155"
        r="69"
        fill="#e5dced"
        stroke={ink}
        strokeWidth="2"
      />
      <circle
        cx="460"
        cy="155"
        r="69"
        fill={m.polarized ? '#edf1e8' : '#e6eff3'}
        stroke={blue}
        strokeWidth="2"
      />
      <text x="160" y="165" textAnchor="middle" fontSize="34">
        −4e
      </text>
      {m.polarized ? (
        <>
          <text x="425" y="168" fontSize="35" fill={gold}>
            +
          </text>
          <text x="480" y="168" fontSize="35" fill={blue}>
            −
          </text>
          <text x="460" y="254" textAnchor="middle">
            {word(mode, '净0；分布偏移', 'Net 0; polarized')}
          </text>
        </>
      ) : (
        <text x="460" y="165" textAnchor="middle" fontSize="34">
          {partner > 0 ? '+' : ''}
          {partner}e
        </text>
      )}
      <g
        stroke={gold}
        strokeWidth="4"
        fill="none"
        opacity={0.2 + progress * 0.8}
      >
        <path
          d={
            attract
              ? 'M115 65h60m-10-8 10 8-10 8M505 65h-60m10-8-10 8 10 8'
              : 'M180 65h-60m10-8-10 8 10 8M440 65h60m-10-8 10 8-10 8'
          }
        />
      </g>
      <text x="310" y="307" textAnchor="middle">
        {word(
          mode,
          '固定物体，只查作用方向',
          'Held objects; direction check only',
        )}
      </text>
    </g>
  );
}
export function CurrentScene({
  charge,
  seconds,
  progress,
  mode,
}: {
  charge: number;
  seconds: number;
  progress: number;
  mode: LanguageMode;
}) {
  const m = currentWindow(charge, seconds, progress);
  return (
    <g>
      <rect
        x="55"
        y="125"
        width="510"
        height="65"
        rx="20"
        fill="#eee8f3"
        stroke={ink}
        strokeWidth="2"
      />
      <path
        d="M310 86v149"
        stroke={gold}
        strokeWidth="3"
        strokeDasharray="6 5"
      />
      <text x="310" y="66" textAnchor="middle">
        {word(mode, '计数截面', 'Counting section')}
      </text>
      {Array.from({ length: m.packets }, (_, j) => {
        const x = 310 + (progress * m.packets - j - 1) * 70;
        return x >= 70 && x <= 550 ? (
          <g key={j}>
            <circle cx={x} cy="157" r="13" fill={blue} />
            <text x={x} y="164" textAnchor="middle" fontSize="21" fill="white">
              +
            </text>
          </g>
        ) : null;
      })}
      <path
        d="M80 95h105m-10-8 10 8-10 8M185 255H80m10-8-10 8 10 8"
        stroke={blue}
        strokeWidth="3"
        fill="none"
      />
      <text x="225" y="103">
        {word(mode, '约定电流 →', 'Conventional current →')}
      </text>
      <text x="225" y="264">
        {word(mode, '金属电子漂移 ←', 'Metal electron drift ←')}
      </text>
      <text x="310" y="317" textAnchor="middle">
        {word(mode, '已计数', 'Counted')} {fmt(m.countedCharge)} C / {charge} C
      </text>
    </g>
  );
}
function Lamp({
  x,
  y,
  power,
  broken = false,
  reference = 0.9,
}: {
  x: number;
  y: number;
  power: number;
  broken?: boolean;
  reference?: number;
}) {
  return (
    <g>
      <circle
        cx={x}
        cy={y}
        r="25"
        fill={`rgba(224, 188, 110, ${Math.min(0.85, 0.08 + (power / reference) * 0.65)})`}
        stroke={gold}
        strokeWidth="2.5"
      />
      {broken ? (
        <path
          d={`M${x - 17} ${y}h10m14 0h10`}
          stroke={gold}
          strokeWidth="3"
          fill="none"
        />
      ) : (
        <path
          d={`M${x - 17} ${y - 17}l34 34m0-34-34 34`}
          stroke={gold}
          strokeWidth="2"
          fill="none"
        />
      )}
    </g>
  );
}
function Switch({
  x,
  y,
  vertical,
  closed,
}: {
  x: number;
  y: number;
  vertical: boolean;
  closed: boolean;
}) {
  return (
    <g
      transform={`translate(${x} ${y})${vertical ? ' rotate(90)' : ''}`}
      stroke={ink}
      strokeWidth="3"
      fill="none"
    >
      <circle cx="-20" cy="0" r="4" fill="#faf7fc" />
      <circle cx="20" cy="0" r="4" fill="#faf7fc" />
      <path d={closed ? 'M-16 0H16' : 'M-16 0L12-23'} />
    </g>
  );
}
function Flow({
  points,
  current,
  progress,
}: {
  points: readonly (readonly [number, number])[];
  current: number;
  progress: number;
}) {
  if (!current) return null;
  return (
    <g>
      {Array.from({ length: 6 }, (_, j) => {
        const point = circuitPoint(points, j / 6 + (progress * current) / 0.3);
        return (
          <circle
            key={j}
            cx={point.x}
            cy={point.y}
            r="5"
            fill={blue}
            stroke="white"
            strokeWidth="1.5"
          />
        );
      })}
    </g>
  );
}
export function CircuitScene({
  config: c,
  progress,
  mode,
}: {
  config: CircuitCase;
  progress: number;
  mode: LanguageMode;
}) {
  const m = dcCircuit(c),
    parallel = c.topology === 'parallel',
    lamps = c.resistance.length;
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {parallel ? (
        <>
          <path
            d="M80 148V65H190V245M80 182V300H530V100"
            fill="none"
            stroke={ink}
            strokeWidth="3"
          />
          <path
            d="M190 110H345m50 0h135M190 220h35m40 0h80m50 0h135"
            fill="none"
            stroke={ink}
            strokeWidth="3"
          />
          <Switch
            x={245}
            y={220}
            vertical={false}
            closed={c.branchClosed[1]!}
          />
          <Lamp x={370} y={110} power={m.powers[0]!} />
          <Lamp x={370} y={220} power={m.powers[1]!} />
          {[110, 220].map((y) => (
            <g key={y}>
              <circle cx="190" cy={y} r="5" fill={ink} />
              <circle cx="530" cy={y} r="5" fill={ink} />
            </g>
          ))}
          <Flow
            points={[
              [80, 165],
              [80, 65],
              [190, 65],
              [190, 110],
              [530, 110],
              [530, 300],
              [80, 300],
              [80, 165],
            ]}
            current={m.currents[0]!}
            progress={progress}
          />
          <Flow
            points={[
              [80, 165],
              [80, 65],
              [190, 65],
              [190, 220],
              [530, 220],
              [530, 300],
              [80, 300],
              [80, 165],
            ]}
            current={m.currents[1]!}
            progress={progress}
          />
          <text x="565" y="117">
            A
          </text>
          <text x="565" y="227">
            B
          </text>
          <text x="370" y="157" textAnchor="middle">
            {fmt(m.currents[0]!)} A
          </text>
          <text x="370" y="265" textAnchor="middle">
            {fmt(m.currents[1]!)} A
          </text>
        </>
      ) : (
        <>
          <path
            d={`M80 148V65H${lamps === 1 ? 305 : 220}m50 0h${lamps === 1 ? 175 : 110}${lamps === 2 ? 'm50 0h100' : ''}`}
            fill="none"
            stroke={ink}
            strokeWidth="3"
          />
          <path
            d={
              c.switchPosition === 'supply' || c.material
                ? 'M530 65v80m0 40v115'
                : 'M530 65V300'
            }
            fill="none"
            stroke={ink}
            strokeWidth="3"
          />
          <path
            d={
              c.returnConnected === false
                ? 'M530 300H365M245 300H80V182'
                : c.switchPosition === 'return'
                  ? 'M530 300H325m-40 0H80V182'
                  : 'M530 300H80V182'
            }
            fill="none"
            stroke={ink}
            strokeWidth="3"
          />
          {c.returnConnected === false && (
            <text x="305" y="330" textAnchor="middle">
              {word(mode, '缺回线', 'Return gap')}
            </text>
          )}
          {c.material ? (
            <>
              {c.material === 'gap' ? (
                <g fill="#cfdae0" stroke={blue} strokeWidth="2">
                  <rect x="518" y="145" width="24" height="12" rx="3" />
                  <rect x="518" y="173" width="24" height="12" rx="3" />
                </g>
              ) : (
                <rect
                  x="518"
                  y="145"
                  width="24"
                  height="40"
                  rx="4"
                  fill={
                    c.material === 'metal'
                      ? '#cfdae0'
                      : c.material === 'plastic'
                        ? '#dfcfe9'
                        : '#faf7fc'
                  }
                  stroke={c.material === 'metal' ? blue : ink}
                  strokeWidth="2"
                />
              )}
              <text x="570" y="228" textAnchor="middle" fontSize="19">
                {word(
                  mode,
                  c.material === 'metal'
                    ? '金属'
                    : c.material === 'plastic'
                      ? '干塑料'
                      : '缺口',
                  c.material === 'metal'
                    ? 'Metal'
                    : c.material === 'plastic'
                      ? 'Plastic'
                      : 'Gap',
                )}
              </text>
            </>
          ) : (
            <Switch
              x={c.switchPosition === 'supply' ? 530 : 305}
              y={c.switchPosition === 'supply' ? 165 : 300}
              vertical={c.switchPosition === 'supply'}
              closed={c.mainClosed !== false}
            />
          )}
          <Lamp x={lamps === 1 ? 330 : 245} y={65} power={m.powers[0]!} />
          {lamps === 2 && (
            <Lamp
              x={405}
              y={65}
              power={m.powers[1]!}
              broken={!c.branchClosed[1]}
            />
          )}
          {m.complete ? (
            <Flow
              points={[
                [80, 165],
                [80, 65],
                [530, 65],
                [530, 300],
                [80, 300],
                [80, 165],
              ]}
              current={m.sourceCurrent}
              progress={progress}
            />
          ) : (
            <g fill="#cfc5d5">
              {[
                [80, 100],
                [80, 235],
                [170, 65],
                [480, 65],
                [530, 245],
                [180, 300],
                [435, 300],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="4" />
              ))}
            </g>
          )}
          <text x={lamps === 1 ? 330 : 245} y="116" textAnchor="middle">
            {fmt(m.powers[0]!)} W
          </text>
          {lamps === 2 && (
            <text x="405" y="116" textAnchor="middle">
              {fmt(m.powers[1]!)} W
            </text>
          )}
        </>
      )}
      <path
        d={`M55 ${c.voltage < 0 ? 182 : 148}h50M66 ${c.voltage < 0 ? 148 : 182}h28`}
        stroke={gold}
        strokeWidth="4"
      />
      {c.cells === 2 && (
        <path d="M66 158h28M55 172h50" stroke={gold} strokeWidth="3" />
      )}
      <text
        x="28"
        y={c.voltage < 0 ? 192 : 156}
        textAnchor="middle"
        fill={gold}
      >
        +
      </text>
      <text
        x="28"
        y={c.voltage < 0 ? 155 : 191}
        textAnchor="middle"
        fill={gold}
      >
        −
      </text>
      <text x="125" y="172" fill={gold}>
        {Math.abs(c.voltage)} V
      </text>
      {!parallel && (
        <text x="330" y="245" textAnchor="middle">
          {word(mode, '回路电流', 'Loop current')} {fmt(m.sourceCurrent)} A
        </text>
      )}
    </g>
  );
}
