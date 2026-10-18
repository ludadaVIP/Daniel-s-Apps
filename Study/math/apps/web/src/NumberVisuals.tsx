import {
  MappingView,
  InverseView,
  PiecewiseView,
} from './FunctionConceptVisuals';
import { piecewiseAt, rationalNumber } from './functionConceptModels';
import { readRational } from './rationalModels';
import { SetRegions, UnionLine } from './LogicVisuals';
import { absoluteSolution } from './logicModels';
import {
  RectangleLinkView,
  IntegrationGraphView,
  RampView,
} from './IntegrationVisuals';
import { JointView, PairGrid, FrequencyRecord } from './ProbabilityVisuals';
import type { LanguageMode } from '@study/shared';
import {
  TrigTriangleView,
  TrigAngleView,
  HeightView,
  SlopeView,
} from './TrigVisuals';
import {
  InscribedView,
  TangentsView,
  SectorGeometryView,
  CircleProofView,
} from './CircleGeometryVisuals';
import {
  SimilarityPair,
  NestedSimilarity,
  ScaleAreaView,
} from './SimilarityVisuals';
import {
  baseSimilarTriangle,
  similarityImage,
  similarityNumericPoints,
} from './similarityModels';
import { ParabolaGraph } from './ParabolaVisuals';
import { QuadraticGraph, CompletingArea } from './QuadraticVisuals';
import { RadicalTiles, RootBoundsView } from './RadicalVisuals';
import { ResearchBoxes, ResearchScatter } from './ResearchVisuals';
import { AlgebraGroups } from './AlgebraVisuals';
import {
  CongruenceDiagram,
  IsoscelesView,
  QuadrilateralView,
} from './CongruenceVisuals';
import { DissectionView, PythagoreanTriangleView } from './PythagoreanVisuals';
import { InequalityDiagram } from './InequalityVisuals';
import { RationalLine } from './RationalVisuals';
import { DotDistribution } from './InferenceVisuals';
import { CartesianPlot } from './CartesianVisuals';
import {
  ObjectView,
  IntersectionView,
  ParallelView,
  TriangleView,
} from './PlaneVisuals';
import { CircleParts, CircleSectors, CylinderNet } from './CircleVisuals';
import { OrderedCards, Spinner, ChanceTokens } from './ChanceVisuals';
import { PercentGrid, PercentSource, PercentAxis } from './PercentVisuals';
import { Thermometer, SignedAxis } from './SignedVisuals';
import {
  RatioCounters,
  RatioShares,
  RatioMap,
  ProportionGraph,
} from './RatioVisuals';
import { t, type NumberDiagram } from './model';
import { axisPosition, placeValues, type Blocks } from './numberModels';
import { DecimalPlaceChart } from './DecimalVisuals';
import { EquationBoard, GrowingPatternView } from './EquationVisuals';
import { FractionOperands } from './FractionOperationVisuals';
import { GeometryDiagram } from './GeometryVisuals';
import { MeanPiles, TimeLine } from './DataVisuals';
import {
  ProductArea as FractionProductArea,
  GroupedMeasure,
  RepeatedFraction,
  SharedFraction,
} from './FractionProductVisuals';
import { FractionDiagram } from './FractionVisuals';
import { ProductArea } from './CalculationVisuals';
import { Ruler, TileGrid, BarChart } from './MeasurementVisuals';
import { ProblemBars } from './ProblemVisuals';
import { FactorArray, CommonLists } from './IntegerVisuals';
import {
  PartCounters,
  GroupCounters,
  SharedCounters,
} from './OperationVisuals';
import { Text } from './ui';
export function PlaceChart({
  value,
  mode,
  places = 7,
  onDigit,
}: {
  value: number;
  mode: LanguageMode;
  places?: number;
  onDigit?: (unit: number, digit: number) => void;
}) {
  return (
    <div
      className="math-chart-scroll"
      tabIndex={0}
      aria-label={
        mode === 'en'
          ? 'Place-value chart; scroll to read all columns'
          : '位值表；可滚动查看各列'
      }
    >
      <table
        className="math-place-chart"
        style={{ minWidth: Math.max(220, places * 64) }}
      >
        <thead>
          <tr>
            {placeValues(value, places).map((p) => (
              <th key={p.unit} scope="col">
                <Text mode={mode} text={p.name} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {placeValues(value, places).map((p) => (
              <td key={p.unit}>
                {onDigit ? (
                  <select
                    aria-label={`${mode === 'en' ? p.name.en : p.name.zh} ${mode === 'en' ? 'digit' : '数字'}`}
                    value={p.digit}
                    onChange={(e) => onDigit(p.unit, Number(e.target.value))}
                  >
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                ) : (
                  <strong>{p.digit}</strong>
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export function NumberAxis({
  start,
  end,
  divisions,
  point,
  label,
  mode,
}: {
  start: number;
  end: number;
  divisions: number;
  point: number;
  label?: string;
  mode: LanguageMode;
}) {
  const position = axisPosition(point, start, end),
    step = (end - start) / divisions;
  return (
    <div className="math-number-axis">
      <svg
        viewBox="0 0 640 126"
        role="img"
        aria-label={
          mode === 'en'
            ? `Number line from ${start} to ${end}, ${divisions} equal intervals; point ${label ?? point} lies ${(point - start) / step} intervals after the start.`
            : `数轴从 ${start} 到 ${end}，分成 ${divisions} 个等长区间；点 ${label ?? point} 在起点之后 ${(point - start) / step} 个区间处。`
        }
      >
        <path d="M35 55H605" stroke="#b9b5cc" strokeWidth="3" />
        {Array.from({ length: divisions + 1 }, (_, i) => (
          <g key={i}>
            <path
              d={`M${35 + (i / divisions) * 570} 47v16`}
              stroke="#625b92"
              strokeWidth="2"
            />
            <text
              x={35 + (i / divisions) * 570}
              y="91"
              textAnchor="middle"
              fontSize="17"
              fill="#625b92"
            >
              {start + i * step}
            </text>
          </g>
        ))}
        <circle cx={35 + position * 570} cy="55" r="8" fill="#5954a3" />
        <text
          x={35 + position * 570}
          y="30"
          textAnchor="middle"
          fontSize="20"
          fontWeight="600"
          fill="#5954a3"
        >
          {label ?? point}
        </text>
      </svg>
      <div className="math-axis-scale">
        <span>{start.toLocaleString('en-NZ')}</span>
        <span>
          <Text mode={mode} text={t(`每格 ${step}`, `${step} per interval`)} />
        </span>
        <span>{end.toLocaleString('en-NZ')}</span>
      </div>
    </div>
  );
}
export function BaseTenBlocks({
  blocks,
  mode,
}: {
  blocks: Blocks;
  mode: LanguageMode;
}) {
  const rows = [
    {
      key: 'hundreds',
      label: t('百方格', 'Hundred squares'),
      size: 100,
      count: blocks.hundreds,
    },
    { key: 'tens', label: t('十条', 'Ten rods'), size: 10, count: blocks.tens },
    {
      key: 'ones',
      label: t('一小格', 'Single units'),
      size: 1,
      count: blocks.ones,
    },
  ];
  return (
    <div className="math-block-model">
      {rows.map((row) => (
        <section key={row.key}>
          <div className="math-row">
            <Text mode={mode} text={row.label} />
            <b>
              {row.count} × {row.size}
            </b>
          </div>
          <div
            className="math-block-pieces"
            role="img"
            aria-label={
              mode === 'en'
                ? `${row.count} blocks of ${row.size} units; ${row.count * row.size} units total`
                : `${row.count} 块，每块 ${row.size} 个单位，总计 ${row.count * row.size} 个单位`
            }
          >
            {Array.from({ length: row.count }, (_, i) => (
              <span
                className={`math-base-block ${row.key}`}
                key={i}
                aria-hidden="true"
              >
                {Array.from({ length: row.size }, (_, j) => (
                  <i key={j} />
                ))}
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
export function NumberDiagramView({
  diagram,
  mode,
}: {
  diagram: NumberDiagram;
  mode: LanguageMode;
}) {
  if (diagram.kind === 'concept-mapping')
    return <MappingView mode={mode} kind={diagram.source} />;
  if (diagram.kind === 'concept-inverse')
    return <InverseView mode={mode} kind={diagram.source} />;
  if (diagram.kind === 'concept-piecewise') {
    const at = piecewiseAt(diagram.source, diagram.query);
    return (
      <PiecewiseView
        mode={mode}
        kind={diagram.source}
        query={
          at
            ? {
                x: rationalNumber(readRational(diagram.query)),
                y: rationalNumber(at.value),
                label: 'P',
              }
            : undefined
        }
      />
    );
  }
  if (diagram.kind === 'logic-sets')
    return <SetRegions mode={mode} u={diagram.u} a={diagram.a} b={diagram.b} />;
  if (diagram.kind === 'logic-absolute')
    return (
      <UnionLine
        mode={mode}
        set={absoluteSolution(diagram.a, diagram.b, diagram.c, diagram.sign)}
      />
    );
  if (diagram.kind === 'integration-rectangle')
    return (
      <RectangleLinkView mode={mode} x={diagram.x} offset={diagram.offset} />
    );
  if (diagram.kind === 'integration-graph')
    return (
      <IntegrationGraphView
        mode={mode}
        kind={diagram.source}
        query={diagram.query}
      />
    );
  if (diagram.kind === 'integration-ramp')
    return <RampView mode={mode} params={diagram} />;
  if (diagram.kind === 'probability-joint')
    return <JointView mode={mode} {...diagram} />;
  if (diagram.kind === 'probability-pairs')
    return <PairGrid mode={mode} {...diagram} />;
  if (diagram.kind === 'probability-record')
    return <FrequencyRecord mode={mode} {...diagram} />;
  if (diagram.kind === 'congruence-triangles')
    return <CongruenceDiagram {...diagram} mode={mode} />;
  if (diagram.kind === 'congruence-isosceles')
    return <IsoscelesView {...diagram} mode={mode} />;
  if (diagram.kind === 'congruence-quadrilateral')
    return <QuadrilateralView {...diagram} mode={mode} />;
  if (diagram.kind === 'pythagorean-triangle')
    return <PythagoreanTriangleView {...diagram} mode={mode} />;
  if (diagram.kind === 'pythagorean-dissection')
    return <DissectionView {...diagram} mode={mode} />;
  if (diagram.kind === 'trig-triangle')
    return <TrigTriangleView mode={mode} {...diagram} />;
  if (diagram.kind === 'trig-angle')
    return <TrigAngleView mode={mode} {...diagram} />;
  if (diagram.kind === 'trig-height')
    return <HeightView mode={mode} {...diagram} />;
  if (diagram.kind === 'trig-slope')
    return <SlopeView mode={mode} {...diagram} />;
  if (diagram.kind === 'cyclic-inscribed')
    return <InscribedView mode={mode} {...diagram} />;
  if (diagram.kind === 'cyclic-tangents')
    return <TangentsView mode={mode} {...diagram} />;
  if (diagram.kind === 'cyclic-sector')
    return <SectorGeometryView mode={mode} {...diagram} />;
  if (diagram.kind === 'cyclic-proof')
    return <CircleProofView mode={mode} {...diagram} />;
  if (diagram.kind === 'similarity-pair')
    return (
      <SimilarityPair
        mode={mode}
        source={similarityNumericPoints(baseSimilarTriangle)}
        target={similarityNumericPoints(
          similarityImage(baseSimilarTriangle, diagram.factor),
        )}
        turns={1}
        mirror
      />
    );
  if (diagram.kind === 'similarity-nested')
    return <NestedSimilarity mode={mode} />;
  if (diagram.kind === 'similarity-area')
    return <ScaleAreaView mode={mode} sx={diagram.sx} sy={diagram.sy} />;
  if (diagram.kind === 'parabola')
    return <ParabolaGraph {...diagram} mode={mode} />;
  if (diagram.kind === 'quadratic-graph')
    return <QuadraticGraph {...diagram} mode={mode} />;
  if (diagram.kind === 'completing-area')
    return <CompletingArea {...diagram} mode={mode} />;
  if (diagram.kind === 'radical-tiles')
    return <RadicalTiles {...diagram} mode={mode} />;
  if (diagram.kind === 'root-bounds')
    return <RootBoundsView {...diagram} mode={mode} />;
  if (diagram.kind === 'research-boxes')
    return <ResearchBoxes {...diagram} mode={mode} />;
  if (diagram.kind === 'research-scatter')
    return <ResearchScatter {...diagram} mode={mode} />;
  if (diagram.kind === 'cartesian')
    return <CartesianPlot {...diagram} mode={mode} />;
  if (diagram.kind === 'dot-distribution')
    return <DotDistribution {...diagram} mode={mode} />;
  if (diagram.kind === 'plane-object')
    return <ObjectView kind={diagram.object} mode={mode} />;
  if (diagram.kind === 'plane-intersection')
    return <IntersectionView {...diagram} mode={mode} />;
  if (diagram.kind === 'plane-parallel')
    return <ParallelView {...diagram} mode={mode} />;
  if (diagram.kind === 'plane-triangle')
    return <TriangleView {...diagram} mode={mode} />;
  if (diagram.kind === 'inequality-line')
    return <InequalityDiagram {...diagram} mode={mode} />;
  if (diagram.kind === 'rational-line')
    return <RationalLine points={diagram.points} mode={mode} />;
  if (diagram.kind === 'stats-order')
    return <OrderedCards {...diagram} mode={mode} />;
  if (diagram.kind === 'chance-spinner')
    return <Spinner {...diagram} mode={mode} />;
  if (diagram.kind === 'chance-tokens')
    return <ChanceTokens {...diagram} mode={mode} />;
  if (diagram.kind === 'circle-parts')
    return <CircleParts {...diagram} mode={mode} />;
  if (diagram.kind === 'circle-sectors')
    return <CircleSectors {...diagram} mode={mode} />;
  if (diagram.kind === 'cylinder-net')
    return <CylinderNet {...diagram} mode={mode} />;
  if (diagram.kind === 'algebra-groups')
    return <AlgebraGroups {...diagram} mode={mode} />;
  if (isGeometryDiagram(diagram))
    return <GeometryDiagram diagram={diagram} mode={mode} />;
  if (diagram.kind === 'signed-thermometer')
    return <Thermometer {...diagram} mode={mode} />;
  if (diagram.kind === 'signed-axis')
    return <SignedAxis {...diagram} mode={mode} />;
  if (diagram.kind === 'ratio-counters')
    return <RatioCounters {...diagram} mode={mode} />;
  if (diagram.kind === 'ratio-shares')
    return <RatioShares {...diagram} mode={mode} />;
  if (diagram.kind === 'ratio-map')
    return <RatioMap {...diagram} mode={mode} />;
  if (diagram.kind === 'ratio-graph')
    return (
      <ProportionGraph
        kind={diagram.curve}
        rate={diagram.rate}
        wide={diagram.wide}
        mode={mode}
      />
    );
  if (diagram.kind === 'percent-grid')
    return <PercentGrid value={diagram.value} mode={mode} />;
  if (diagram.kind === 'percent-source')
    return <PercentSource {...diagram} mode={mode} />;
  if (diagram.kind === 'percent-axis')
    return <PercentAxis {...diagram} mode={mode} />;
  if (diagram.kind === 'product-repeat')
    return <RepeatedFraction {...diagram} mode={mode} />;
  if (diagram.kind === 'product-share')
    return <SharedFraction {...diagram} mode={mode} />;
  if (diagram.kind === 'product-area')
    return <FractionProductArea {...diagram} mode={mode} />;
  if (diagram.kind === 'product-groups')
    return <GroupedMeasure {...diagram} mode={mode} />;
  if (diagram.kind === 'data-mean')
    return <MeanPiles {...diagram} mode={mode} />;
  if (diagram.kind === 'data-line')
    return <TimeLine {...diagram} mode={mode} />;
  if (diagram.kind === 'equation-board')
    return <EquationBoard {...diagram} mode={mode} />;
  if (diagram.kind === 'growing-pattern')
    return <GrowingPatternView {...diagram} mode={mode} />;
  if (diagram.kind === 'fraction-operation')
    return <FractionOperands {...diagram} mode={mode} />;
  if (diagram.kind === 'integer-array')
    return <FactorArray {...diagram} mode={mode} />;
  if (diagram.kind === 'integer-common')
    return (
      <CommonLists
        a={diagram.a}
        b={diagram.b}
        kind={diagram.mode}
        mode={mode}
      />
    );
  if (diagram.kind === 'problem-bars')
    return <ProblemBars {...diagram} mode={mode} />;
  if (diagram.kind === 'calculation-area')
    return <ProductArea a={diagram.a} b={diagram.b} mode={mode} />;
  if (diagram.kind === 'measurement-ruler')
    return <Ruler {...diagram} mode={mode} />;
  if (diagram.kind === 'measurement-grid')
    return <TileGrid {...diagram} mode={mode} />;
  if (diagram.kind === 'measurement-bars')
    return <BarChart {...diagram} mode={mode} />;
  if (diagram.kind === 'decimal-place')
    return <DecimalPlaceChart milli={diagram.milli} mode={mode} />;
  if (diagram.kind === 'fraction-bars')
    return <FractionDiagram values={diagram.values} mode={mode} />;
  if (diagram.kind === 'operation-counters')
    return (
      <PartCounters
        a={diagram.a}
        b={diagram.b}
        kind={diagram.mode}
        mode={mode}
        explain={false}
      />
    );
  if (diagram.kind === 'operation-array')
    return (
      <GroupCounters
        groups={diagram.groups}
        perGroup={diagram.perGroup}
        mode={mode}
        array
        explain={false}
      />
    );
  if (diagram.kind === 'operation-sharing')
    return (
      <SharedCounters
        total={diagram.total}
        divisor={diagram.divisor}
        kind={diagram.mode}
        mode={mode}
        explain={false}
      />
    );
  return diagram.kind === 'place' ? (
    <PlaceChart
      value={diagram.value}
      places={diagram.places ?? 7}
      mode={mode}
    />
  ) : (
    <NumberAxis
      start={diagram.start}
      end={diagram.end}
      divisions={diagram.divisions}
      point={diagram.point}
      label={diagram.label ?? 'P'}
      mode={mode}
    />
  );
}

function isGeometryDiagram(
  diagram: NumberDiagram,
): diagram is Extract<NumberDiagram, { kind: `geo-${string}` }> {
  return diagram.kind.startsWith('geo-');
}
