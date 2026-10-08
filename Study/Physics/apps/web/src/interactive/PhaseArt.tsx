export function PhaseArt({ kind }: { kind: string }) {
  if (kind === 'phase-fusion')
    return (
      <g>
        <rect
          x="47"
          y="57"
          width="67"
          height="65"
          rx="8"
          fill="#c5dce1"
          stroke="#a1c2c9"
        />
        <path
          d="M57 73h47M57 93h47M77 61v54"
          stroke="#edf7f8"
          strokeWidth="3"
        />
        <path
          d="M134 75h34m-7-6 7 6-7 6m0 23h-34m7-6-7 6 7 6"
          fill="none"
          stroke="#c5a16f"
          strokeWidth="3"
        />
        <path
          d="M197 56v67h57V56"
          fill="none"
          stroke="#b7a0ca"
          strokeWidth="2"
        />
        <path d="M200 83h51v37h-51" fill="#d1c0df" />
        <text x="150" y="37" textAnchor="middle" fill="#a38bbb" fontSize="18">
          0°C
        </text>
      </g>
    );
  if (kind === 'phase-boiling')
    return (
      <g>
        <path
          d="M62 36v87h121V36"
          fill="none"
          stroke="#b7a0ca"
          strokeWidth="2"
        />
        <path d="M65 78h115v42H65" fill="#c5dce1" />
        {[82, 119, 156].map((x, i) => (
          <circle
            key={x}
            cx={x}
            cy={106 - i * 9}
            r="5"
            fill="#f1f8f9"
            stroke="#a1c2c9"
          />
        ))}
        <path
          d="M96 140h55m-27 0v-12m-5 5 5-5 5 5M187 65h53m-8-6 8 6-8 6"
          fill="none"
          stroke="#c5a16f"
          strokeWidth="3"
        />
        {[205, 226, 246].map((x) => (
          <circle key={x} cx={x} cy="40" r="4" fill="#b7a0ca" />
        ))}
        <text x="123" y="64" textAnchor="middle" fill="#a38bbb" fontSize="18">
          100°C
        </text>
      </g>
    );
  if (kind === 'phase-condensation')
    return (
      <g>
        <path
          d="M90 38l12 88h79l12-88"
          fill="#f1eaf5"
          stroke="#b7a0ca"
          strokeWidth="2"
        />
        <path d="M99 70h85l-7 52h-73" fill="#cdb9dc" />
        <rect x="85" y="32" width="113" height="8" rx="4" fill="#b7a0ca" />
        {[76, 200, 215].map((x, i) => (
          <path
            key={x}
            d={`M${x} ${67 + i * 19}q-10 16 0 16q10 0 0-16Z`}
            fill="#98bfc6"
          />
        ))}
        <circle cx="232" cy="50" r="4" fill="#b7a0ca" />
        <circle cx="253" cy="83" r="4" fill="#b7a0ca" />
        <text x="145" y="149" textAnchor="middle" fill="#a38bbb" fontSize="15">
          air → droplets
        </text>
      </g>
    );
  return (
    <g>
      <path d="M42 24v104h224" stroke="#b7a0ca" fill="none" strokeWidth="2" />
      <path
        d="M42 123l29-37h142l42-48"
        stroke="#a38bbb"
        fill="none"
        strokeWidth="3"
      />
      <path d="M71 86h142" stroke="#c5a16f" strokeWidth="4" />
      <text x="145" y="75" textAnchor="middle" fill="#c5a16f" fontSize="17">
        Q keeps entering
      </text>
      <text x="26" y="31" fill="#a38bbb" fontSize="15">
        T
      </text>
      <text x="254" y="145" fill="#a38bbb" fontSize="15">
        t
      </text>
    </g>
  );
}
