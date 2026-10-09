export function MagneticArt({ kind }: { kind: string }) {
  const north = '#bb8376',
    south = '#83a6b6',
    ink = '#a087ad',
    gold = '#b99b70';
  const bar = (x: number, y: number, w = 80, flip = false) => (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height="25"
        rx="4"
        fill={flip ? north : south}
      />
      <path
        d={`M${x + w / 2} ${y}h${w / 2 - 4}q4 0 4 4v17q0 4-4 4H${x + w / 2}Z`}
        fill={flip ? south : north}
      />
      <text
        x={x + w / 4}
        y={y + 17}
        textAnchor="middle"
        fill="white"
        fontSize="12"
      >
        {flip ? 'N' : 'S'}
      </text>
      <text
        x={x + (w * 3) / 4}
        y={y + 17}
        textAnchor="middle"
        fill="white"
        fontSize="12"
      >
        {flip ? 'S' : 'N'}
      </text>
    </g>
  );
  return (
    <g>
      {kind === 'magnetic-materials' ? (
        <>
          {bar(55, 62)}
          <path
            d="M163 74h35m-8-6 8 6-8 6"
            stroke={gold}
            fill="none"
            strokeWidth="2"
          />
          <rect x="210" y="52" width="35" height="45" rx="5" fill="#c8c2d0" />
          <path d="M55 116h190" stroke={ink} strokeDasharray="3 5" />
        </>
      ) : kind === 'magnetic-poles' ? (
        <>
          {bar(40, 55)}
          {bar(185, 55, 80, true)}
          <path
            d="M130 67h16m-6-5 6 5-6 5m35 0h-16m6-5-6 5 6 5"
            stroke={gold}
            fill="none"
            strokeWidth="2"
          />
          {bar(82, 109, 50)}
          {bar(169, 109, 50)}
          <path d="M150 107v29" stroke={ink} strokeDasharray="3 4" />
        </>
      ) : kind === 'magnetic-field' ? (
        <>
          <path
            d="M185 72C255 5 45 5 115 72M185 72C265 140 35 140 115 72"
            stroke={south}
            fill="none"
            strokeWidth="2"
          />
          {bar(115, 60, 70)}
          <path
            d="M160 25h-20m5-5-5 5 5 5"
            stroke={south}
            fill="none"
            strokeWidth="2"
          />
          <circle cx="215" cy="74" r="16" fill="#faf7ed" stroke={ink} />
          <path d="M228 74l-13-5v10Z" fill={north} />
          <path d="M202 74l13-5v10Z" fill={south} />
        </>
      ) : kind === 'magnetic-earth' ? (
        <>
          <circle cx="150" cy="78" r="52" fill="#e4ece5" stroke={ink} />
          <ellipse
            cx="150"
            cy="78"
            rx="25"
            ry="52"
            stroke={south}
            fill="none"
          />
          <path d="M100 78h100m-42-63-16 120" stroke={ink} fill="none" />
          <path d="M150 24l-8 25h16Z" fill={north} />
          <text x="150" y="10" fill={ink} textAnchor="middle" fontSize="10">
            MAP N
          </text>
          <circle cx="230" cy="99" r="19" fill="#f6f0e4" stroke={ink} />
          <path d="M244 86l-18 9 9 9Z" fill={north} />
        </>
      ) : kind === 'magnetic-wire' ? (
        <>
          <circle cx="140" cy="80" r="43" fill="none" stroke={south} />
          <circle cx="140" cy="80" r="27" fill="none" stroke={south} />
          <circle cx="140" cy="80" r="10" fill="#f7f1e7" stroke={ink} />
          <circle cx="140" cy="80" r="3" fill={ink} />
          <path
            d="M185 91V72m-5 7 5-7 5 7"
            stroke={south}
            fill="none"
            strokeWidth="2"
          />
          <circle cx="225" cy="63" r="20" fill="#f7f1e7" stroke={ink} />
          <path d="M215 46l-2 20 12-6Z" fill={north} />
        </>
      ) : kind === 'magnetic-coil' ? (
        <>
          <rect x="72" y="60" width="157" height="35" rx="10" fill="#cbc3d5" />
          {Array.from({ length: 12 }, (_, i) => (
            <ellipse
              key={i}
              cx={80 + i * 13}
              cy="77"
              rx="5"
              ry="28"
              fill="none"
              stroke={gold}
              strokeWidth="1.5"
            />
          ))}
          <text x="249" y="82" fill={north} fontSize="17">
            N
          </text>
          <path
            d="M86 117h128m-7-5 7 5-7 5"
            stroke={south}
            fill="none"
            strokeWidth="2"
          />
        </>
      ) : kind === 'magnetic-motor' ? (
        <>
          <rect x="43" y="43" width="34" height="70" rx="5" fill={north} />
          <rect x="223" y="43" width="34" height="70" rx="5" fill={south} />
          <path d="M87 78h125m-7-5 7 5-7 5" stroke={ink} fill="none" />
          <circle
            cx="150"
            cy="78"
            r="35"
            fill="none"
            stroke={ink}
            strokeDasharray="3 5"
          />
          <path d="M127 107l46-58" stroke={gold} strokeWidth="5" />
          <path
            d="M116 107V87m-4 6 4-6 4 6M184 49v20m-4-6 4 6 4-6"
            stroke={south}
            fill="none"
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          <circle cx="95" cy="77" r="32" fill="none" stroke={ink} />
          <path
            d="M75 99l40-44M63 77H40v22"
            stroke={gold}
            strokeWidth="4"
            fill="none"
          />
          <path d="M155 45v77h100M155 83h100" stroke={ink} fill="none" />
          <path
            d="M155 83Q168 35 180 83T205 83T230 83T255 83"
            stroke={south}
            strokeWidth="2.5"
            fill="none"
          />
        </>
      )}
    </g>
  );
}
