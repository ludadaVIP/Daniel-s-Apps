export function MachineArt({ kind }: { kind: string }) {
  const ink = '#a68ab7',
    blue = '#86b2c2',
    gold = '#c29b66';
  return (
    <g
      stroke={ink}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === 'machine-gears' ? (
        <>
          <g stroke={gold}>
            {Array.from({ length: 12 }, (_, i) => (
              <path
                key={i}
                d="M95 27v-9"
                transform={`rotate(${i * 30} 95 65)`}
              />
            ))}
          </g>
          <circle cx="95" cy="65" r="35" fill="#ecdef2" />
          <circle cx="180" cy="65" r="49" fill="#e3f0f5" stroke={blue} />
          {Array.from({ length: 18 }, (_, i) => (
            <path
              key={i}
              d="M180 13v-8"
              transform={`rotate(${i * 20} 180 65)`}
              stroke={blue}
            />
          ))}
          <circle cx="95" cy="65" r="5" fill={ink} />
          <circle cx="180" cy="65" r="5" fill={blue} />
          <path d="M80 115h40m44 12h40" />
        </>
      ) : kind === 'machine-turning' ? (
        <>
          <circle cx="82" cy="93" r="14" fill="#ecdef2" />
          <path d="M95 93h125" strokeWidth="10" />
          <path d="M210 84V25m-7 8 7-8 7 8" stroke={gold} />
          <path d="M82 49h128" strokeDasharray="5 5" stroke={blue} />
        </>
      ) : kind === 'machine-lever' ? (
        <>
          <path d="M45 113l195-62" strokeWidth="7" />
          <path d="M151 80l-20 46h40Z" fill="#ecdef2" />
          <rect
            x="200"
            y="21"
            width="39"
            height="32"
            fill="#dec49d"
            stroke={gold}
          />
          <path d="M55 59v40m-6-7 6 7 6-7" stroke={blue} />
        </>
      ) : (
        <>
          <path
            d="M75 20h150M90 20v67a20 20 0 0 0 40 0V49a20 20 0 0 1 40 0v65"
            stroke={blue}
          />
          <circle cx="110" cy="87" r="18" fill="#eadef1" />
          <circle cx="150" cy="49" r="18" fill="#eee3d3" stroke={gold} />
          <path d="M150 30V20M110 106v11" />
          <rect
            x="88"
            y="118"
            width="44"
            height="25"
            rx="4"
            fill="#e4cfb0"
            stroke={gold}
          />
          {kind === 'machine-real' ? (
            <path d="M205 99l8-15 8 15 8-15 8 15" stroke={gold} />
          ) : kind === 'machine-advantage' ? (
            <path
              d="M205 65v60m-6-7 6 7 6-7M237 125V95m-6 7 6-7 6 7"
              stroke={blue}
            />
          ) : (
            <path d="M170 117v17m-6-7 6 7 6-7" stroke={blue} />
          )}
        </>
      )}
    </g>
  );
}
