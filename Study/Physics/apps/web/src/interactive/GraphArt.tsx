import type { GraphKind } from './graphModels';
export function GraphArt({ kind }: { kind: GraphKind }) {
  const blue = '#93c5cf',
    gold = '#e3c68d',
    cream = '#eeece0';
  return (
    <g>
      <rect width="294" height="144" rx="12" fill="#283d48" />
      <path d="M40 27V112H265" fill="none" stroke={cream} />
      {kind === 'axes' && (
        <g>
          <path
            d="M40 95L230 40M174 56V112M40 56H174"
            fill="none"
            stroke={blue}
            strokeDasharray="4 3"
          />
          <circle cx="174" cy="56" r="5" fill={gold} />
          <text x="51" y="29" fill={cream}>
            x / m
          </text>
          <text x="209" y="133" fill={cream}>
            t / s
          </text>
        </g>
      )}
      {kind === 'reading' && (
        <g>
          <path
            d="M40 99L105 46H175L245 99"
            fill="none"
            stroke={blue}
            strokeWidth="3"
          />
          <circle cx="140" cy="46" r="5" fill={gold} />
          <text x="100" y="82" fill={cream}>
            v = 0
          </text>
        </g>
      )}
      {kind === 'gradient' && (
        <g>
          <path d="M50 101L240 35" stroke={blue} strokeWidth="3" />
          <path
            d="M95 85H203V48"
            fill="none"
            stroke={gold}
            strokeDasharray="4 3"
          />
          <text x="114" y="77" fill={cream}>
            Δx / Δt
          </text>
        </g>
      )}
      {kind === 'area' && (
        <g>
          <path d="M40 72H265" stroke={cream} />
          <path d="M40 72V40H145V72Z" fill={blue} opacity=".5" />
          <path d="M145 72V104H250V72Z" fill="#ce9292" opacity=".5" />
          <text x="72" y="64" fill={cream}>
            +6
          </text>
          <text x="175" y="96" fill={cream}>
            −6
          </text>
          <text x="93" y="132" fill={cream}>
            Δx = 0 m
          </text>
        </g>
      )}
      {kind === 'linear' && (
        <g>
          <path d="M40 91L250 53M40 68L250 30" stroke={blue} strokeWidth="3" />
          <circle cx="40" cy="91" r="4" fill={gold} />
          <circle cx="40" cy="68" r="4" fill={gold} />
          <text x="74" y="107" fill={cream}>
            T = T₀ + mt
          </text>
        </g>
      )}
      {kind === 'curve' && (
        <g>
          <path
            d="M40 110Q164 110 248 32"
            fill="none"
            stroke={blue}
            strokeWidth="3"
          />
          <path d="M40 110L248 32" stroke={gold} strokeDasharray="4 3" />
          <text x="67" y="48" fill={cream}>
            x ∝ t²
          </text>
          <text x="152" y="130" fill={cream}>
            t → t²
          </text>
        </g>
      )}
      {kind === 'experiment' && (
        <g>
          <path d="M40 99L250 36" stroke={gold} strokeWidth="2" />
          {[65, 110, 155, 200, 245].map((x, i) => (
            <g key={x}>
              <path d={`M${x} ${96 - i * 14}v-12`} stroke={cream} />
              {[-4, 0, 4].map((j) => (
                <circle key={j} cx={x} cy={90 - i * 14 + j} r="3" fill={blue} />
              ))}
            </g>
          ))}
          <text x="66" y="131" fill={cream}>
            15 readings · 1 fit
          </text>
        </g>
      )}
    </g>
  );
}
