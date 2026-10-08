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
      {kind === 'electric-charge' ? (
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
