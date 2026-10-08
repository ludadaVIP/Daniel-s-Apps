export function MotionArt({ kind }: { kind: string }) {
  if (kind === 'reference')
    return (
      <>
        <rect x="75" y="49" width="150" height="66" rx="8" fill="#d6c6e2" />
        <rect x="82" y="56" width="136" height="39" rx="5" fill="#f7f2fb" />
        <circle cx="111" cy="121" r="10" fill="#ad91c1" />
        <circle cx="192" cy="121" r="10" fill="#ad91c1" />
        <circle cx="146" cy="64" r="7" fill="#cfa571" />
        <path
          d="M146 73v21m-8-15 8-6 8 6"
          fill="none"
          stroke="#a17ab8"
          strokeWidth="4"
        />
        <path
          d="M28 122h33m-7-5 7 5-7 5M238 79h28m-7-5 7 5-7 5"
          stroke="#c6a16b"
          fill="none"
          strokeWidth="2"
        />
        <path d="M41 56v57" stroke="#b3bba1" strokeWidth="3" />
        <circle cx="41" cy="48" r="12" fill="#c4ccb4" />
      </>
    );
  if (kind === 'journey')
    return (
      <>
        <rect x="46" y="76" width="37" height="27" rx="4" fill="#d1b58a" />
        <path d="M51 103v17m27-17v17" stroke="#b49565" />
        <rect x="219" y="70" width="34" height="45" fill="#cebae0" />
        <circle cx="236" cy="60" r="9" fill="#c9a571" />
        <path
          d="M89 64h115m-7-5 7 5-7 5"
          stroke="#a886c0"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M210 107H95m7-5-7 5 7 5"
          stroke="#c9a571"
          strokeWidth="3"
          fill="none"
        />
        <text x="152" y="49" textAnchor="middle" fontSize="16" fill="#a284b7">
          6 m
        </text>
        <text x="151" y="134" textAnchor="middle" fontSize="14" fill="#b2966d">
          6 + 6
        </text>
      </>
    );
  if (kind === 'average')
    return (
      <>
        {[0, 1].map((i) => (
          <g key={i} transform={`translate(${95 + i * 111},76)`}>
            <circle
              r="35"
              fill="#f7f1fc"
              stroke={i ? '#c8a874' : '#b196c5'}
              strokeWidth="3"
            />
            <path
              d="M-8-40H8M0-35v-9M0 0v-20m0 20 16 8"
              stroke={i ? '#c8a874' : '#b196c5'}
              fill="none"
              strokeWidth="3"
            />
            <text y="58" fontSize="16" textAnchor="middle" fill="#a38aae">
              6 m / {i ? 6 : 3} s
            </text>
          </g>
        ))}
      </>
    );
  return (
    <>
      <path d="M57 30v92h187" stroke="#c1afd0" fill="none" />
      <path
        d="m57 122 55-45h55l77 45"
        fill="none"
        stroke="#ab8dc0"
        strokeWidth="3"
      />
      <path
        d="m57 122 55-45h55l77-45"
        fill="none"
        stroke="#c2a374"
        strokeWidth="3"
      />
      <path d="M200 30v93" stroke="#d2c2dc" strokeDasharray="4 5" />
      <circle cx="200" cy="54" r="5" fill="#c2a374" />
      <circle cx="200" cy="96" r="5" fill="#ab8dc0" />
    </>
  );
}
