export function LightArt({ kind }: { kind: string }) {
  const ink = '#ab91bc',
    gold = '#c2a06c',
    teal = '#88aaa0';
  if (kind === 'light-shadow')
    return (
      <g>
        <circle cx="45" cy="76" r="9" fill={gold} />
        <path d="M135 58v36" stroke={ink} strokeWidth="9" />
        <path d="M260 30v95" stroke="#d5cadd" strokeWidth="7" />
        <path d="M260 33v86" stroke={ink} strokeWidth="7" />
        <path
          d="M45 76 260 33M45 76 260 119"
          stroke={gold}
          fill="none"
          strokeWidth="2"
        />
      </g>
    );
  if (kind === 'light-reflection')
    return (
      <g>
        <path d="M45 110h210" stroke={ink} strokeWidth="4" />
        <path d="M150 30v95" stroke="#cdbfd5" strokeDasharray="4 5" />
        <path
          d="m75 35 75 75 75-75"
          fill="none"
          stroke={gold}
          strokeWidth="3"
        />
        <path d="m105 64 8 9-9-1m73-6 10-2-2 10" stroke={gold} fill="none" />
      </g>
    );
  if (kind === 'light-mirror')
    return (
      <g>
        <path d="M150 27v100" stroke={ink} strokeWidth="4" />
        <rect x="153" y="27" width="95" height="100" fill="#eee7f2" />
        <path
          d="M70 101V49m-7 9 7-9 7 9"
          stroke={teal}
          strokeWidth="4"
          fill="none"
        />
        <path
          d="M230 101V49m-7 9 7-9 7 9"
          stroke={ink}
          strokeWidth="3"
          strokeDasharray="4 3"
          fill="none"
        />
        <path
          d="M70 49 150 85 55 128M70 49 150 114 125 135"
          stroke={gold}
          fill="none"
        />
        <path
          d="M150 85 230 49M150 114 230 49"
          stroke={gold}
          fill="none"
          strokeDasharray="4 4"
        />
      </g>
    );
  if (kind === 'light-refraction')
    return (
      <g>
        <rect x="40" y="76" width="220" height="55" rx="8" fill="#e4eeee" />
        <path d="M40 76h220" stroke={teal} strokeWidth="2" />
        <path d="M150 22v110" stroke="#cbbdd4" strokeDasharray="4 5" />
        <path
          d="m80 23 70 53 30 52"
          fill="none"
          stroke={gold}
          strokeWidth="3"
        />
      </g>
    );
  if (kind === 'light-colour')
    return (
      <g>
        <path
          d="m137 35-35 76h75Z"
          fill="#e5daee"
          stroke={ink}
          strokeWidth="2"
        />
        <path d="M40 75h83" stroke={gold} strokeWidth="4" />
        {['#c3747c', '#7caa98', '#809cc3'].map((c, i) => (
          <path
            key={c}
            d={`M123 75 160 ${77 + i * 3} 266 ${88 + i * 14}`}
            stroke={c}
            strokeWidth="2"
            fill="none"
          />
        ))}
      </g>
    );
  return (
    <g>
      <path d="M40 80h220" stroke="#d2c5db" strokeDasharray="4 5" />
      <path
        d="M143 25q25 55 0 110-25-55 0-110"
        fill="#e3eeee"
        stroke={teal}
        strokeWidth="2"
      />
      <path
        d="M60 80V43m-6 8 6-8 6 8"
        stroke={ink}
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M60 43 143 43 232 105M60 43 143 80 232 119"
        stroke={gold}
        strokeWidth="2"
        fill="none"
      />
      {kind === 'light-eye' ? (
        <path d="M231 31v97" stroke={teal} strokeWidth="5" />
      ) : (
        <path
          d="M232 80v39m-6-8 6 8 6-8"
          stroke={ink}
          strokeWidth="3"
          fill="none"
        />
      )}
    </g>
  );
}
