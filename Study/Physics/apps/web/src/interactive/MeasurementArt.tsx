export function MeasurementArt({ kind }: { kind: string }) {
  if (kind === 'mass')
    return (
      <>
        <path
          d="M150 51v69m-23 0h46M78 62h144M90 63l-20 42h40Zm120 0-20 42h40Z"
          fill="none"
          stroke="#9a81af"
          strokeWidth="3"
        />
        <circle cx="90" cy="91" r="13" fill="#c1968d" />
        <rect x="198" y="87" width="24" height="17" rx="3" fill="#a794bb" />
        <circle cx="150" cy="62" r="6" fill="#b7a4c9" />
      </>
    );
  if (kind === 'temperature')
    return (
      <>
        <rect x="86" y="68" width="51" height="46" rx="5" fill="#d8b98a" />
        <path d="M92 78h34M92 90h34M92 102h34" stroke="#c4a274" />
        <rect x="165" y="68" width="51" height="46" rx="5" fill="#b3b8c6" />
        <path d="M151 45v44" stroke="#dfaa96" strokeWidth="6" />
        <circle cx="151" cy="96" r="10" fill="#dfaa96" />
        <path
          d="M148 45a3 3 0 0 1 6 0"
          fill="none"
          stroke="#dfaa96"
          strokeWidth="2"
        />
        <text x="150" y="33" textAnchor="middle" fill="#a080aa" fontSize="13">
          20°C
        </text>
      </>
    );
  if (kind === 'time')
    return (
      <>
        <path d="M75 35h55M103 35v65" stroke="#a08bab" strokeWidth="3" />
        <circle cx="103" cy="101" r="15" fill="#b59dc6" />
        <circle
          cx="199"
          cy="81"
          r="35"
          fill="#eee5f7"
          stroke="#bba5cc"
          strokeWidth="3"
        />
        <path
          d="M199 62v19l12 10M190 37h18M199 37v9"
          stroke="#aa8abf"
          strokeWidth="3"
        />
        <text x="199" y="116" fontSize="10" textAnchor="middle" fill="#a389b0">
          10 ×
        </text>
      </>
    );
  if (kind === 'graph')
    return (
      <>
        <path d="M74 36v78h160" fill="none" stroke="#b4a0c6" strokeWidth="2" />
        <path
          d="m74 114 38-33h75l38-32"
          fill="none"
          stroke="#9f84b8"
          strokeWidth="4"
        />
        {[
          [74, 114],
          [112, 81],
          [150, 81],
          [187, 81],
          [225, 49],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="4" fill="#caa675" />
        ))}
        <path
          d="M73 81h156M111 38v76M188 38v76"
          stroke="#cdbed8"
          opacity=".5"
          strokeDasharray="3 5"
        />
      </>
    );
  if (kind === 'data')
    return (
      <>
        <rect
          x="89"
          y="30"
          width="122"
          height="97"
          rx="5"
          fill="#f8f4fb"
          stroke="#c4b2d1"
        />
        <rect x="89" y="30" width="122" height="22" rx="5" fill="#d5c7e3" />
        <path d="M89 78h122M89 103h122M132 52v75M171 52v75" stroke="#d4c5df" />
        <text x="150" y="69" fontSize="11" fill="#a88eba" textAnchor="middle">
          8.8
        </text>
        <text x="150" y="94" fontSize="11" fill="#a88eba" textAnchor="middle">
          9.0
        </text>
        <text x="150" y="119" fontSize="11" fill="#a88eba" textAnchor="middle">
          9.2
        </text>
      </>
    );
  if (kind === 'units')
    return (
      <>
        <path
          d="M56 85q34-8 67 0t67 0 67 0"
          stroke="#c6ad88"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M56 100v15m201-15v15M56 108h201"
          stroke="#ab8dc2"
          strokeWidth="2"
        />
        <text x="150" y="47" textAnchor="middle" fill="#a180b6" fontSize="16">
          24 cm = 240 mm
        </text>
      </>
    );
  return (
    <>
      <rect x="62" y="76" width="77" height="28" rx="3" fill="#e4c791" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <path key={i} d={`M${70 + i * 10} 76v12`} stroke="#b99b64" />
      ))}
      <circle cx="186" cy="61" r="23" fill="#ded0eb" />
      <path d="M186 48v13l9 5" stroke="#aa8abb" strokeWidth="3" />
      <path d="M162 103h48l-6-19h-36Z" fill="#b4a2c8" />
    </>
  );
}
