import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './model';
import { DataTable } from './DataModellingVisuals';
import { SolidScene, type SpaceSegment } from './SolidVisuals';
import {
  vec3,
  vec3Number,
  vec3Text,
  zeroVec3,
  addVec3,
  scaleVec3,
  pointPlaneProjection,
  type Vec3,
  type VectorPlane3,
  type VectorLine3,
} from './spaceVectorModels';
import { rational, textR } from './algebraModels';
import type { SpacePoint } from './solidModels';
export type SpatialArrow = {
  name: string;
  tail: Vec3;
  value: Vec3;
  color?: string;
};
export function planePatch(plane: VectorPlane3): SpacePoint[] {
  const centre = vec3Number(pointPlaneProjection(zeroVec3(), plane).foot),
    n = vec3Number(plane.normal),
    raw: SpacePoint =
      Math.abs(n[0]) + Math.abs(n[1]) > 0 ? [-n[1], n[0], 0] : [1, 0, 0],
    len = Math.hypot(...raw),
    u = raw.map((v) => v / len) as unknown as SpacePoint,
    vraw: SpacePoint = [
      n[1] * u[2] - n[2] * u[1],
      n[2] * u[0] - n[0] * u[2],
      n[0] * u[1] - n[1] * u[0],
    ],
    vlen = Math.hypot(...vraw),
    v = vraw.map((x) => x / vlen) as unknown as SpacePoint;
  return [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ].map(
    ([a, b]) =>
      centre.map(
        (x, i) => x + 3 * a! * u[i]! + 3 * b! * v[i]!,
      ) as unknown as SpacePoint,
  );
}
export function SpaceVectorFigure({
  mode,
  points = [],
  arrows = [],
  segments = [],
  plane,
  otherPlane,
  line,
  view = 0,
  reveal = false,
  axes = false,
  caption,
}: {
  mode: LanguageMode;
  points?: { name: string; point: Vec3 }[];
  arrows?: SpatialArrow[];
  segments?: { name: string; a: Vec3; b: Vec3; dashed?: boolean }[];
  plane?: VectorPlane3;
  otherPlane?: VectorPlane3;
  line?: VectorLine3;
  view?: number;
  reveal?: boolean;
  axes?: boolean;
  caption: LocalizedText;
}) {
  const axisPoints = axes
      ? [
          { name: 'O', point: zeroVec3() },
          { name: 'x', point: vec3(4, 0, 0) },
          { name: 'y', point: vec3(0, 4, 0) },
          { name: 'z', point: vec3(0, 0, 4) },
        ]
      : [],
    allPoints = [...axisPoints, ...points];
  const axisSegments: SpaceSegment[] = axisPoints.slice(1).map((p) => ({
    name: `axis-${p.name}`,
    a: [0, 0, 0],
    b: vec3Number(p.point),
    arrow: true,
  }));
  const planeCentre = plane
    ? pointPlaneProjection(zeroVec3(), plane).foot
    : null;
  return (
    <>
      <SolidScene
        mode={mode}
        view={view}
        reveal={false}
        points={allPoints.map((p) => ({
          name: p.name,
          point: vec3Number(p.point),
        }))}
        segments={[
          ...axisSegments,
          ...segments.map((s) => ({
            ...s,
            a: vec3Number(s.a),
            b: vec3Number(s.b),
          })),
          ...arrows.map((a) => ({
            name: a.name,
            a: vec3Number(a.tail),
            b: vec3Number(addVec3(a.tail, a.value)),
            color: a.color ?? '#6652a1',
            arrow: true,
          })),
          ...(line
            ? [
                {
                  name: 'line l (window)',
                  a: vec3Number(
                    addVec3(
                      line.point,
                      scaleVec3(rational(-3n), line.direction),
                    ),
                  ),
                  b: vec3Number(
                    addVec3(
                      line.point,
                      scaleVec3(rational(3n), line.direction),
                    ),
                  ),
                  color: '#6652a1',
                },
              ]
            : []),
          ...(plane && planeCentre && reveal
            ? [
                {
                  name: 'normal n',
                  a: vec3Number(planeCentre),
                  b: vec3Number(addVec3(planeCentre, plane.normal)),
                  arrow: true,
                  color: '#9a6b18',
                },
              ]
            : []),
        ]}
        faces={[
          ...(plane
            ? [{ name: 'plane alpha (patch)', vertices: planePatch(plane) }]
            : []),
          ...(otherPlane
            ? [
                {
                  name: 'plane beta (patch)',
                  vertices: planePatch(otherPlane),
                  color: '#c29c61',
                },
              ]
            : []),
        ]}
        caption={caption}
      />
      {reveal && (
        <DataTable
          mode={mode}
          name={t('三维坐标与向量核验', '3D coordinates and vector audit')}
          headers={[
            t('名称', 'Name'),
            t('起点或点坐标', 'Tail or point'),
            t('分量或终点', 'Components or head'),
          ]}
          rows={[
            ...points.map((p) => [p.name, vec3Text(p.point), '—']),
            ...arrows.map((a) => [
              a.name,
              vec3Text(a.tail),
              `${vec3Text(a.value)} → ${vec3Text(addVec3(a.tail, a.value))}`,
            ]),
          ]}
        />
      )}
    </>
  );
}
export function spatialEquationText(plane: VectorPlane3) {
  return `${vec3Text(plane.normal)} · (x,y,z) = ${textR(plane.offset)}`;
}
