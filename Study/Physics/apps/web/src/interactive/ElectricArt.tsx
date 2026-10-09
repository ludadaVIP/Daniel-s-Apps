export function ElectricArt({ kind }: { kind: string }) {
  const ink = '#a68cb6',
    blue = '#83adbd',
    gold = '#be9967';
  const lamp = (x: number, y: number) => (
    <g>
      <circle cx={x} cy={y} r="17" fill="#ecd9b5" stroke={gold} />
      <path d={`M${x - 11} ${y - 11}l22 22m0-22-22 22`} stroke={gold} />
    </g>
  );
  return (
    <g
      stroke={ink}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {['electric-ammeter', 'electric-voltmeter'].includes(kind) ? (
        <>
          <path
            d={
              kind === 'electric-ammeter'
                ? 'M45 57V25H137m36 0h77v28m0 26v41H45V80'
                : 'M45 57V25H130m50 0h70v95H45V80'
            }
          />
          <path d="M32 57h26m-20 23h14" stroke={gold} />
          {kind === 'electric-ammeter' ? (
            <rect
              x="237"
              y="53"
              width="26"
              height="26"
              rx="4"
              fill="#eee1c7"
              stroke={gold}
            />
          ) : (
            <>
              <rect
                x="130"
                y="12"
                width="50"
                height="26"
                rx="4"
                fill="#eee1c7"
                stroke={gold}
              />
              <path d="M115 25v60h22m36 0h22V25" stroke={blue} />
            </>
          )}
          <circle
            cx="155"
            cy={kind === 'electric-ammeter' ? 25 : 85}
            r="18"
            fill="#dce8ee"
            stroke={blue}
          />
          <text
            x="155"
            y={kind === 'electric-ammeter' ? 32 : 92}
            textAnchor="middle"
            fill={blue}
            stroke="none"
            fontSize="22"
          >
            {kind === 'electric-ammeter' ? 'A' : 'V'}
          </text>
          {kind === 'electric-ammeter' && (
            <path
              d="M95 74h110m-100 0v7m30-7v7m30-7v7m30-7v7M147 53v18"
              stroke={gold}
            />
          )}
        </>
      ) : ['electric-ohm', 'electric-power'].includes(kind) ? (
        <>
          <path d="M60 25v100h190" />
          <path d="M60 125l170-90M60 125l170-50" stroke={blue} />
          {[115, 170, 225].map((x, i) => (
            <circle
              key={x}
              cx={x}
              cy={96 - i * 29}
              r="5"
              fill={gold}
              stroke="none"
            />
          ))}
        </>
      ) : kind === 'electric-voltage' ? (
        <>
          <rect
            x="70"
            y="38"
            width="160"
            height="23"
            rx="7"
            fill="#dce8ee"
            stroke={blue}
          />
          <rect
            x="70"
            y="90"
            width="110"
            height="23"
            rx="7"
            fill="#ead7b4"
            stroke={gold}
          />
          <text x="45" y="55" fill={blue} stroke="none" fontSize="20">
            C
          </text>
          <text x="45" y="108" fill={gold} stroke="none" fontSize="20">
            J
          </text>
        </>
      ) : kind === 'electric-resistance' ? (
        <>
          <path d="M55 40h95M55 77h190" stroke={blue} strokeWidth="9" />
          <path d="M55 118h95" stroke={gold} strokeWidth="17" />
        </>
      ) : kind === 'electric-safety' ? (
        <>
          <path
            d="m150 25 57 18v34c0 25-28 41-57 53-29-12-57-28-57-53V43Z"
            fill="#e5ede2"
            stroke={blue}
          />
          <path d="m140 50 25 0-17 25h15l-27 31 7-28h-13Z" stroke={gold} />
        </>
      ) : kind === 'electric-charge' ? (
        <>
          <rect x="40" y="40" width="75" height="75" rx="18" fill="#e8def0" />
          <rect
            x="185"
            y="40"
            width="75"
            height="75"
            rx="18"
            fill="#eee2d0"
            stroke={gold}
          />
          <path d="M128 76h44m-8-7 8 7-8 7" stroke={blue} />
          {[65, 90, 210, 235].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy="65" r="5" fill={gold} stroke="none" />
              <circle cx={x} cy="90" r="5" fill={blue} stroke="none" />
              {i < 2 && (
                <path
                  d={`M${x - 3} 65h6m-3-3v6`}
                  stroke="white"
                  strokeWidth="1"
                />
              )}
            </g>
          ))}
        </>
      ) : kind === 'electric-interaction' ? (
        <>
          <circle cx="80" cy="80" r="35" fill="#e8def0" />
          <circle cx="220" cy="80" r="35" fill="#e3edf1" stroke={blue} />
          <path d="M66 80h28M205 80h30m-15-15v30" />
          <path
            d="M72 28h27m-7-6 7 6-7 6M228 28h-27m7-6-7 6 7 6"
            stroke={gold}
          />
        </>
      ) : kind === 'electric-current' ? (
        <>
          <rect x="25" y="58" width="250" height="38" rx="15" fill="#e8def0" />
          <path d="M150 35v84" strokeDasharray="4 4" stroke={gold} />
          {[55, 105, 185, 235].map((x) => (
            <circle key={x} cx={x} cy="77" r="7" fill={blue} stroke="none" />
          ))}
          <path d="M45 123h75m-8-6 8 6-8 6" stroke={blue} />
        </>
      ) : kind === 'electric-parallel' ? (
        <>
          <path d="M55 53V25h52v90M55 78v57h196V45M107 55h63m34 0h47M107 105h63m34 0h47" />
          <path d="M42 56h26m-21 20h16" stroke={gold} />
          {lamp(187, 55)}
          {lamp(187, 105)}
          {[55, 105].map((y) => (
            <g key={y}>
              <circle cx="107" cy={y} r="3" fill={ink} />
              <circle cx="251" cy={y} r="3" fill={ink} />
            </g>
          ))}
        </>
      ) : (
        <>
          <path
            d={
              kind === 'electric-series'
                ? 'M55 54V28h62m34 0h52m34 0h16v99H55V80'
                : 'M55 54V28h99m34 0h65v30m0 32v37H55V80'
            }
          />
          <path d="M41 57h28m-22 20h16" stroke={gold} />
          {kind === 'electric-battery' && (
            <path d="M41 63h28m-22 8h16" stroke={gold} />
          )}{' '}
          {kind === 'electric-series' ? (
            <>
              {lamp(134, 28)}
              {lamp(220, 28)}
            </>
          ) : (
            lamp(171, 28)
          )}
          {kind === 'electric-switch' || kind === 'electric-circuit' ? (
            <>
              <circle cx="253" cy="61" r="3" />
              <circle cx="253" cy="87" r="3" />
              <path d="M253 64l19 15" stroke={blue} />
            </>
          ) : kind === 'electric-materials' ? (
            <rect x="240" y="58" width="26" height="32" rx="4" fill="#d5c9e0" />
          ) : (
            <path d="M253 58v32" />
          )}
          {kind === 'electric-lamp' && (
            <>
              <path d="M137 69l-9 15m74-15 9 15M170 75v18" stroke={gold} />
              <path d="M122 112l8-7 8 7 8-7" stroke={gold} />
            </>
          )}
        </>
      )}
    </g>
  );
}
