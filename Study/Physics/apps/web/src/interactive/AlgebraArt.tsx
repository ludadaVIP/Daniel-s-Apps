import type { AlgebraKind } from './algebraModels';
export function AlgebraArt({ kind }: { kind: AlgebraKind }) {
  const blue = '#91c7ce',
    gold = '#e8c783',
    cream = '#ecebdc';
  return (
    <g>
      <rect width="294" height="144" rx="12" fill="#263b39" />
      {kind === 'variables' && (
        <g>
          <path d="M25 106H270" stroke={cream} />
          <rect x="82" y="62" width="44" height="28" rx="6" fill={blue} />
          <circle cx="90" cy="98" r="8" fill={cream} />
          <circle cx="118" cy="98" r="8" fill={cream} />
          <path d="M145 78H212l-8-7m8 7-8 7" stroke={gold} fill="none" />
          <text x="29" y="39" fill={cream}>
            d = vt
          </text>
        </g>
      )}
      {kind === 'substitution' && (
        <g>
          <circle cx="62" cy="55" r="22" fill={gold} />
          <path d="M49 80H75m-23 6h19" stroke={cream} />
          <text x="103" y="56" fill={cream}>
            0.5 min
          </text>
          <text x="103" y="92" fill={blue}>
            = 30 s
          </text>
          <path d="M35 119H255" stroke={blue} strokeWidth="8" />
        </g>
      )}
      {kind === 'rearrange' && (
        <g>
          <path d="M50 67H245m-97 0v31m-22 0h44" stroke={cream} />
          <text x="66" y="50" fill={blue}>
            d
          </text>
          <text x="211" y="50" fill={blue}>
            vt
          </text>
          <text x="50" y="116" fill={gold}>
            ÷ v
          </text>
          <text x="203" y="116" fill={gold}>
            ÷ v
          </text>
        </g>
      )}
      {kind === 'ratio' && (
        <g>
          <text x="30" y="40" fill={cream}>
            1 : 10000
          </text>
          <path d="M30 72H128" stroke={blue} strokeWidth="12" />
          <path d="M30 109H245" stroke={gold} strokeWidth="12" />
          <text x="153" y="77" fill={cream}>
            cm → m
          </text>
        </g>
      )}
      {kind === 'direct' && (
        <g>
          <path d="M40 118V22m0 96h225" stroke={cream} />
          <path d="M40 118L250 43" stroke={blue} strokeWidth="3" />
          <path d="M40 82L250 7" stroke={cream} strokeWidth="2" />
          <circle cx="154" cy="77" r="6" fill={gold} />
          <text x="202" y="113" fill={cream}>
            x ∝ F
          </text>
        </g>
      )}
      {kind === 'inverse' && (
        <g>
          <path d="M40 118V22m0 96h225" stroke={cream} />
          <path
            d="M58 27Q68 88 253 105"
            stroke={blue}
            strokeWidth="3"
            fill="none"
          />
          <text x="149" y="49" fill={gold}>
            pA = F
          </text>
          <rect x="61" y="79" width="20" height="20" fill={blue} />
          <rect x="98" y="63" width="36" height="36" fill={blue} />
        </g>
      )}
      {kind === 'square' && (
        <g>
          {[0, 1, 2].flatMap((a) =>
            [0, 1, 2].map((b) => (
              <rect
                key={`${a}-${b}`}
                x={31 + a * 26}
                y={35 + b * 26}
                width="23"
                height="23"
                fill={blue}
              />
            )),
          )}
          <text x="146" y="64" fill={cream}>
            3 × 3
          </text>
          <text x="146" y="100" fill={gold}>
            = 9
          </text>
        </g>
      )}
      {kind === 'notation' && (
        <g>
          <text x="36" y="57" fill={cream}>
            0.000004 m
          </text>
          <text x="36" y="101" fill={blue}>
            4 × 10
            <tspan dy="-12" fontSize="16">
              −6
            </tspan>
            <tspan dy="12"> m</tspan>
          </text>
        </g>
      )}
    </g>
  );
}
