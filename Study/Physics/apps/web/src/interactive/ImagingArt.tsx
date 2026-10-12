import type { ImagingKind } from './imagingModels';
export function ImagingArt({ kind }: { kind: ImagingKind }) {
  const label = {
    convex: 'one lens · real or virtual',
    concave: 'diverging rays · upright image',
    rays: 'one point · many rays',
    equation: '1/u + 1/v = 1/f',
    magnification: 'M = h′/h = −v/u',
    eye: 'retina stays · power changes',
    camera: 'focus plane · sensor plane',
    instruments: 'objective → image → eyepiece',
  }[kind];
  return (
    <g>
      <text x="22" y="30" fontSize="14" fill="#6c5b7c">
        {label}
      </text>
      <path d="M25 100H275" stroke="#b9b1c1" strokeDasharray="4 4" />
      <path
        d={
          kind === 'concave'
            ? 'M125 55Q145 95 125 135L145 135Q125 95 145 55Z'
            : 'M135 55Q115 95 135 135Q155 95 135 55'
        }
        fill="#8ba9b1"
        fillOpacity=".2"
        stroke="#8ba9b1"
      />
      {kind === 'instruments' ? (
        <>
          <path
            d="M230 55Q210 95 230 135Q250 95 230 55"
            fill="none"
            stroke="#8ba9b1"
          />
          <path
            d="M30 75L135 75L230 125L275 125M30 120L135 120L230 80L275 80"
            stroke="#d9bc85"
            fill="none"
          />
        </>
      ) : (
        <>
          <path
            d={
              kind === 'concave'
                ? 'M40 70L135 70L270 50M40 70L135 100L270 140'
                : 'M40 70L135 70L260 130M40 70L135 100L260 130'
            }
            stroke="#d9bc85"
            fill="none"
          />
          {kind === 'eye' || kind === 'camera' ? (
            <path d="M235 55V140" stroke="#ae99bf" strokeWidth="3" />
          ) : (
            <path
              d="M40 115V70M35 77L40 70L45 77"
              stroke="#ae99bf"
              fill="none"
            />
          )}
        </>
      )}
    </g>
  );
}
