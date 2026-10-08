export function BuoyancyArt({ kind }: { kind: string }) {
  const ink = '#a68ab7',
    water = '#87b5c7',
    gold = '#c49a61';
  return (
    <g
      stroke={ink}
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {kind === 'buoyancy-balloon' ? (
        <>
          <ellipse cx="150" cy="54" rx="48" ry="44" fill="#eee2f3" />
          <path d="M150 10c-30 25-30 65 0 88m0-88c30 25 30 65 0 88M123 89l10 24m44-24-10 24" />
          <rect
            x="132"
            y="111"
            width="36"
            height="24"
            rx="4"
            fill="#e6ceb2"
            stroke={gold}
          />
          <path d="M215 108V52m-7 8 7-8 7 8" stroke={water} />
        </>
      ) : (
        <>
          <path d="M50 52v81h200V52" />
          <path d="M52 77h196v54H52Z" fill="#e3f0f6" stroke={water} />
          {kind === 'buoyancy-submarine' ? (
            <>
              <rect
                x="84"
                y="85"
                width="133"
                height="37"
                rx="18"
                fill="#eee4f3"
              />
              <path d="M137 85V63h24v22M217 103h16" />
              <rect
                x="130"
                y="100"
                width="52"
                height="14"
                fill="#c1dce7"
                stroke={water}
              />
            </>
          ) : kind === 'buoyancy-ship' ? (
            <>
              <path d="M94 57h110v45H94Z" fill="#eee4f3" />
              <path d="M118 56V33h39v23m12 0V41h24v15" stroke={gold} />
              <path d="M52 77h196" stroke={water} />
            </>
          ) : kind === 'buoyancy-archimedes' ? (
            <>
              <rect
                x="136"
                y="9"
                width="29"
                height="39"
                rx="5"
                fill="#eee4f3"
              />
              <path d="M150 18v21m-7-9h14M150 48v43" />
              <rect
                x="126"
                y="91"
                width="48"
                height="30"
                fill="#dec49d"
                stroke={gold}
              />
            </>
          ) : kind === 'buoyancy-displacement' ? (
            <>
              <rect
                x="115"
                y="64"
                width="63"
                height="52"
                fill="#dec49d"
                stroke={gold}
              />
              <path
                d="M217 89h18m-18 16h18m-18 16h18M196 60V28m-6 7 6-7 6 7"
                stroke={water}
              />
            </>
          ) : kind === 'buoyancy-pressure' ? (
            <>
              <rect x="119" y="83" width="63" height="35" fill="#eee4f3" />
              <path d="M150 48v30m-6-7 6 7 6-7" stroke={gold} />
              <path d="M150 140v-19m-6 7 6-7 6 7" stroke={water} />
            </>
          ) : (
            <>
              <rect
                x="110"
                y="92"
                width="48"
                height="29"
                fill="#dec49d"
                stroke={gold}
              />
              <path
                d="M182 134V86m-6 7 6-7 6 7M204 86v37m-6-7 6 7 6-7"
                stroke={water}
              />
            </>
          )}
        </>
      )}
    </g>
  );
}
