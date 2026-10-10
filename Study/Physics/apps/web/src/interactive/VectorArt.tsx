import type { VectorKind } from './vectorModels';
export function VectorArt({ kind }: { kind: VectorKind }) {
  const cream = '#efeee3',
    blue = '#90c5d0',
    gold = '#e8c782',
    teal = '#95bda9';
  return (
    <g fill="none">
      <rect width="294" height="144" rx="12" fill="#263f39" />
      {kind === 'quantities' && (
        <g>
          <path d="M60 115H140V55" stroke={blue} strokeWidth="3" fill="none" />
          <path
            d="M60 115L140 55l-13 1m13-1-8 10"
            stroke={gold}
            strokeWidth="3"
            fill="none"
          />
          <text x="75" y="137" fill={cream}>
            7 m path · 5 m shift
          </text>
        </g>
      )}
      {kind === 'direction' && (
        <g>
          <path d="M70 95H230M147 125V25" stroke={teal} />
          <path d="M147 95H224l-10-6m10 6-10 6" stroke={blue} strokeWidth="4" />
          <text x="54" y="44" fill={cream}>
            N
          </text>
          <text x="240" y="101" fill={cream}>
            E
          </text>
          <text x="55" y="132" fill={gold}>
            (3, 0) m/s
          </text>
        </g>
      )}
      {kind === 'arrows' && (
        <g>
          <path
            d="M35 48H105l-10-7m10 7-10 7M35 95H175l-10-7m10 7-10 7"
            stroke={blue}
            strokeWidth="3"
          />
          <text x="121" y="55" fill={cream}>
            3 m/s
          </text>
          <text x="190" y="101" fill={cream}>
            6 m/s
          </text>
          <text x="45" y="132" fill={gold}>
            one shared scale
          </text>
        </g>
      )}
      {kind === 'addition' && (
        <g>
          <path d="M60 120H135l-10-6m10 6-10 6" stroke={blue} strokeWidth="3" />
          <path d="M135 120V20l-6 10m6-10 6 10" stroke={teal} strokeWidth="3" />
          <path
            d="M60 120L135 20l-12 1m12-1-6 11"
            stroke={gold}
            strokeWidth="3"
          />
          <text x="200" y="74" fill={cream}>
            3 ⟂ 4
          </text>
          <text x="204" y="108" fill={gold}>
            → 5
          </text>
        </g>
      )}
      {kind === 'components' && (
        <g>
          <path
            d="M50 125H170V35"
            stroke={teal}
            strokeWidth="3"
            strokeDasharray="5 4"
            fill="none"
          />
          <path
            d="M50 125L170 35l-13 1m13-1-7 11"
            stroke={blue}
            strokeWidth="3"
            fill="none"
          />
          <text x="102" y="140" fill={cream}>
            8 N
          </text>
          <text x="186" y="87" fill={cream}>
            6 N
          </text>
          <text x="77" y="47" fill={gold}>
            F = 10 N
          </text>
        </g>
      )}
    </g>
  );
}
