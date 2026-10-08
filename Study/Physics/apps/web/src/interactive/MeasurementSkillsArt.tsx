export function MeasurementSkillsArt({ kind }: { kind: string }) {
  if (kind === 'volume')
    return (
      <>
        <path
          d="M97 20v112h96V20"
          fill="#f4edf9"
          stroke="#b99dce"
          strokeWidth="3"
        />
        <path d="M100 58h90v71h-90Z" fill="#bad8d9" opacity=".7" />
        <path d="M100 83h90" stroke="#88b5b6" strokeDasharray="4 4" />
        <path d="m121 107 5-22 27-11 15 17-4 26-29 2Z" fill="#bcae95" />
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M196 ${29 + i * 20}h14`} stroke="#a891b9" />
        ))}
        <path d="M216 58v25m-4-5 4 5 4-5" stroke="#96bec0" fill="none" />
      </>
    );
  if (kind === 'accuracy')
    return (
      <>
        <path d="M64 109h181" stroke="#bba6ce" />
        <path d="M131 26v85" stroke="#a1bda5" strokeWidth="9" opacity=".7" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <path d={`M64 ${40 + i * 25}h181`} stroke="#e1d7e9" />
            <circle cx={198 + i * 4} cy={40 + i * 25} r="6" fill="#b393c9" />
          </g>
        ))}
        <path
          d="M187 127h-52m7-5-7 5 7 5"
          stroke="#c6a06a"
          strokeWidth="2"
          fill="none"
        />
      </>
    );
  if (kind === 'repeats')
    return (
      <>
        <rect
          x="65"
          y="25"
          width="170"
          height="106"
          rx="8"
          fill="#faf6fd"
          stroke="#c2add0"
        />
        <path
          d="M65 52h170M112 25v106M175 25v106M65 78h170M65 103h170"
          stroke="#d3c3df"
        />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <circle
              cx="89"
              cy={65 + i * 25}
              r="5"
              fill={i === 2 ? '#c9a675' : '#b094c8'}
            />
            <path
              d={`M130 ${65 + i * 25}h25`}
              stroke="#b094c8"
              strokeWidth="3"
            />
            <path
              d={`m195 ${62 + i * 25} 5 5 9-10`}
              stroke="#9ab39a"
              fill="none"
            />
          </g>
        ))}
      </>
    );
  return (
    <>
      <rect
        x="66"
        y="50"
        width="145"
        height="68"
        fill="#f0ddba"
        stroke="#bda67d"
      />
      {Array.from({ length: 11 }, (_, i) => (
        <path key={i} d={`M66 ${56 + i * 6}h145`} stroke="#c9b38f" />
      ))}
      <rect x="224" y="26" width="25" height="93" fill="#d6c7e3" />
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M224 ${32 + i * 10}h${i % 2 ? 9 : 16}`}
          stroke="#9e83b3"
        />
      ))}
      <path d="M211 50h10M211 118h10" stroke="#9477a8" />
    </>
  );
}
