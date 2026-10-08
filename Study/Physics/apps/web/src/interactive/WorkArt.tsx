export function WorkArt({ kind }: { kind: string }) {
  if (kind === 'work-direction')
    return (
      <g>
        <rect x="64" y="82" width="63" height="35" rx="5" fill="#bca5ce" />
        <path d="M45 126h210" stroke="#cbbbd6" strokeWidth="2" />
        <path
          d="M95 75V35m-7 10 7-10 7 10"
          stroke="#a187b6"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M160 95h75m-10-6 10 6-10 6"
          stroke="#c9a674"
          strokeWidth="3"
          fill="none"
        />
        <circle
          cx="199"
          cy="53"
          r="15"
          stroke="#98b6a9"
          strokeWidth="2"
          fill="none"
        />
        <path d="M188 53h22" stroke="#98b6a9" strokeWidth="2" />
      </g>
    );
  if (kind === 'work-area')
    return (
      <g>
        <path d="M59 32v100h189" stroke="#b6a0c9" strokeWidth="2" fill="none" />
        <rect x="60" y="62" width="149" height="69" fill="#eadabf" />
        <path d="M59 61h151" stroke="#c4a06b" strokeWidth="3" />
        <path d="M88 136v5m51-5v5m52-5v5M54 92h5M54 62h5" stroke="#b6a0c9" />
        <text x="136" y="103" textAnchor="middle" fill="#b4976b" fontSize="21">
          F × s
        </text>
      </g>
    );
  if (kind === 'work-power')
    return (
      <g>
        {[92, 211].map((x, i) => (
          <g key={x}>
            <path
              d={`M${x} 36v${i ? 29 : 64}`}
              stroke="#c8ad82"
              strokeWidth="3"
            />
            <path
              d={`M${x - 38} 37h76m-76 88h76`}
              stroke="#c5b2d4"
              strokeWidth="2"
            />
            <rect
              x={x - 27}
              y={i ? 66 : 101}
              width="54"
              height="22"
              rx="4"
              fill={i ? '#ccb184' : '#b6a0c9'}
            />
          </g>
        ))}
        <circle
          cx="153"
          cy="72"
          r="17"
          stroke="#99b6a9"
          fill="none"
          strokeWidth="2"
        />
        <path d="M153 60v12l9 4" stroke="#99b6a9" fill="none" strokeWidth="2" />
      </g>
    );
  if (kind === 'work-human')
    return (
      <g>
        <path
          d="M43 134h38v-21h38V92h38V71h38V50h38"
          stroke="#b6a0c9"
          strokeWidth="3"
          fill="none"
        />
        <circle cx="217" cy="26" r="9" fill="#c9a674" />
        <path
          d="M217 35v20m0-10-12 6m12-6 13 6m-13 4-12 14m12-14 12 14M256 131V60m-6 8 6-8 6 8"
          stroke="#c9a674"
          fill="none"
          strokeWidth="3"
        />
        <text x="256" y="150" fill="#a68d66" textAnchor="middle" fontSize="16">
          h
        </text>
      </g>
    );
  return (
    <g>
      <path
        d="M43 132 238 49v83Z"
        fill="#e9ddc8"
        stroke="#c1aed1"
        strokeWidth="2"
      />
      <g transform="translate(162 81) rotate(-23)">
        <rect x="-24" y="-29" width="48" height="29" rx="4" fill="#b6a0c9" />
        <path
          d="M-4-43h62m-8-5 8 5-8 5"
          fill="none"
          stroke="#c9a674"
          strokeWidth="3"
        />
      </g>
      <path
        d="M263 131V55m-6 8 6-8 6 8"
        stroke="#98b6a9"
        strokeWidth="3"
        fill="none"
      />
      <text x="129" y="152" textAnchor="middle" fill="#ab9068" fontSize="16">
        F × L
      </text>
    </g>
  );
}
