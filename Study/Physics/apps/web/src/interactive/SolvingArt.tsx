import type { SolvingKind } from './solvingModels';
export function SolvingArt({ kind }: { kind: SolvingKind }) {
  const blue = '#95c7cb',
    gold = '#e6c58b',
    cream = '#eeeee3';
  return (
    <g fill="none">
      <rect width="294" height="144" rx="12" fill="#30423b" />
      {kind === 'arrival' && (
        <g>
          <path
            d="M34 105H263M82 80H198l-9-6m9 6-9 6M240 42v58h23V42z"
            stroke={blue}
            strokeWidth="3"
          />
          <rect x="42" y="75" width="32" height="21" rx="5" fill={gold} />
          <text x="113" y="43" fill={cream}>
            t = ?
          </text>
          <text x="115" y="128" fill={cream}>
            d = vt
          </text>
        </g>
      )}
      {kind === 'energy' && (
        <g>
          <rect
            x="34"
            y="42"
            width="57"
            height="62"
            rx="6"
            stroke={blue}
            strokeWidth="3"
          />
          <path d="M95 72H186l-10-6m10 6-10 6" stroke={gold} strokeWidth="3" />
          <circle cx="225" cy="59" r="23" fill={gold} />
          <path d="M211 87h28m-25 6h22" stroke={cream} />
          <text x="49" y="81" fill={cream}>
            E
          </text>
          <text x="118" y="121" fill={cream}>
            E = Pt
          </text>
        </g>
      )}
      {kind === 'spring' && (
        <g>
          <path
            d="M73 22H173m-50 0v10l-8 7 16 9-16 9 16 9-16 9 8 7v13"
            stroke={blue}
            strokeWidth="3"
          />
          <rect x="105" y="95" width="36" height="25" rx="4" fill={gold} />
          <path d="M171 44v62m-7-62h14m-14 62h14" stroke={cream} />
          <text x="191" y="81" fill={cream}>
            x = ?
          </text>
          <text x="102" y="140" fill={cream}>
            kx = mg
          </text>
        </g>
      )}
      {kind === 'density' && (
        <g>
          <path
            d="M31 30v88h58V30m88 0v88h58V30"
            stroke={blue}
            strokeWidth="3"
          />
          <path d="M32 80h55m91-27h55" stroke={blue} strokeWidth="5" />
          <rect x="192" y="79" width="27" height="28" rx="3" fill={gold} />
          <text x="102" y="59" fill={cream}>
            ΔV
          </text>
          <text x="95" y="133" fill={cream}>
            ρ = m/V
          </text>
        </g>
      )}
    </g>
  );
}
