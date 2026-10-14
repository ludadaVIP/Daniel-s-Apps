import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text } from './ui';
import {
  Ruler,
  Boundary,
  TileGrid,
  AnglePicture,
  BarChart,
} from './MeasurementVisuals';
import {
  rectangleBoundary,
  tileCoverage,
  fullTiles,
  rotateCoverage,
  angleKind,
  barGeometry,
} from './measurementModels';
export type MeasurementLabKind =
  | 'measurement-length'
  | 'measurement-perimeter'
  | 'measurement-area'
  | 'measurement-angle'
  | 'measurement-bars';
export const isMeasurementLab = (
  kind: Lesson['lab'],
): kind is MeasurementLabKind => kind.startsWith('measurement-');
function Range({
  label,
  value,
  min = 0,
  max,
  mode,
  set,
}: {
  label: LocalizedText;
  value: number;
  min?: number;
  max: number;
  mode: LanguageMode;
  set: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={label} />
      <input
        type="range"
        aria-label={mode === 'en' ? label.en : label.zh}
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(e) => set(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Length({ mode }: { mode: LanguageMode }) {
  const [start, setStart] = useState(3),
    [length, setLength] = useState(7),
    [unit, setUnit] = useState<'cm' | 'mm'>('cm'),
    [reveal, setReveal] = useState(false);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测两端相减的长度。移动起点不会改变物体长度；切换单位只改变刻度数字。屏幕是示意尺，不是实际尺寸的尺。',
            'Predict length by subtracting endpoints. Moving the start preserves object length; changing units changes labels. This is a schematic ruler, not an actual-size measuring tool.',
          )}
        />
      </p>
      <div className="math-measure-controls">
        <Range
          label={t('起点（cm）', 'Start (cm)')}
          value={start}
          max={10}
          mode={mode}
          set={(n) => {
            setStart(n);
            setReveal(false);
          }}
        />
        <Range
          label={t('物体长度（cm）', 'Object length (cm)')}
          value={length}
          max={18}
          mode={mode}
          set={(n) => {
            setLength(n);
            setReveal(false);
          }}
        />
      </div>
      <div className="math-lab-presets">
        {(['cm', 'mm'] as const).map((u) => (
          <button
            className="math-button secondary"
            key={u}
            aria-pressed={unit === u}
            onClick={() => {
              setUnit(u);
              setReveal(false);
            }}
          >
            <Text
              mode={mode}
              text={
                u === 'cm'
                  ? t('厘米刻度 cm', 'Centimetre scale cm')
                  : t('毫米刻度 mm', 'Millimetre scale mm')
              }
            />
          </button>
        ))}
      </div>
      <Ruler
        startMm={start * 10}
        endMm={(start + length) * 10}
        unit={unit}
        mode={mode}
        reveal={reveal}
      />
      <button
        className="math-button secondary"
        aria-expanded={reveal}
        onClick={() => setReveal(!reveal)}
      >
        <Text
          mode={mode}
          text={t(
            '我已读两端，核对长度',
            'I read both endpoints; check length',
          )}
        />
      </button>
    </>
  );
}
function Perimeter({ mode }: { mode: LanguageMode }) {
  const [width, setWidth] = useState(8),
    [height, setHeight] = useState(5),
    [walked, setWalked] = useState(0),
    m = rectangleBoundary(width, height);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测绕一圈需要几个 1 cm。金色只沿边走，不覆盖内部；回到起点后才走完一圈。',
            'Predict the number of 1 cm steps around the boundary. Gold traces edges rather than covering the interior; finish by returning to the start.',
          )}
        />
      </p>
      <div className="math-measure-controls">
        <Range
          label={t('宽（cm）', 'Width (cm)')}
          value={width}
          min={1}
          max={12}
          mode={mode}
          set={(n) => {
            setWidth(n);
            setWalked(0);
          }}
        />
        <Range
          label={t('高（cm）', 'Height (cm)')}
          value={height}
          min={1}
          max={12}
          mode={mode}
          set={(n) => {
            setHeight(n);
            setWalked(0);
          }}
        />
      </div>
      <Boundary width={width} height={height} walked={walked} mode={mode} />
      <div className="math-measure-readout">
        <Text
          mode={mode}
          text={t(
            `已沿边走 ${walked} cm${walked === m.perimeter ? '，回到起点' : ''}`,
            `Walked ${walked} cm along edges${walked === m.perimeter ? ', back at the start' : ''}`,
          )}
        />
      </div>
      <div className="math-lab-presets">
        <button
          className="math-button secondary"
          disabled={walked === m.perimeter}
          onClick={() => setWalked(walked + 1)}
        >
          <Text
            mode={mode}
            text={t('沿边走一个单位', 'Walk one boundary unit')}
          />
        </button>
        <button
          className="math-button secondary"
          disabled={walked === m.perimeter}
          onClick={() => setWalked(m.perimeter)}
        >
          <Text
            mode={mode}
            text={t('我已预测，走完一圈', 'I predicted; finish the circuit')}
          />
        </button>
        {[
          [8, 5],
          [7, 6],
        ].map(([w, h]) => (
          <button
            className="math-button secondary"
            key={`${w}-${h}`}
            onClick={() => {
              setWidth(w!);
              setHeight(h!);
              setWalked(0);
            }}
          >
            {w} × {h}
          </button>
        ))}
      </div>
      {walked === m.perimeter && (
        <p className="math-hint">
          {width} + {height} + {width} + {height} = {m.perimeter} cm
          <Text
            mode={mode}
            text={t(
              '四条边都计一次。换成 7×6 与 8×5，周长可能相同，内部覆盖量却不同。',
              'Count each of the four sides once. The 7×6 and 8×5 rectangles can share a perimeter while covering different amounts.',
            )}
          />
        </p>
      )}
    </>
  );
}
function Area({ mode }: { mode: LanguageMode }) {
  const [board, setBoard] = useState(() => ({
      width: 6,
      height: 4,
      selected: fullTiles(6, 4),
    })),
    m = tileCoverage(board.width, board.height, board.selected);
  const shape = (width: number, height: number) =>
    setBoard({ width, height, selected: fullTiles(width, height) });
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先数覆盖了几个单位方格。去掉一格会减少覆盖面积；转动整个覆盖图只改变位置，不改变方格数量。',
            'Count covered unit squares. Removing one reduces covered area; rotating the whole coverage changes position, not square count.',
          )}
        />
      </p>
      <div className="math-measure-controls">
        <Range
          label={t('列数', 'Column count')}
          value={board.width}
          min={1}
          max={10}
          mode={mode}
          set={(n) => shape(n, board.height)}
        />
        <Range
          label={t('行数', 'Row count')}
          value={board.height}
          min={1}
          max={10}
          mode={mode}
          set={(n) => shape(board.width, n)}
        />
      </div>
      <TileGrid
        {...board}
        mode={mode}
        onToggle={(i) =>
          setBoard({
            ...board,
            selected: board.selected.includes(i)
              ? board.selected.filter((j) => j !== i)
              : [...board.selected, i],
          })
        }
      />
      <div className="math-measure-readout">
        <Text
          mode={mode}
          text={t(`已覆盖 ${m.area} cm²`, `Covered ${m.area} cm²`)}
        />
      </div>
      <div className="math-lab-presets">
        <button
          className="math-button secondary"
          onClick={() =>
            setBoard(rotateCoverage(board.width, board.height, board.selected))
          }
        >
          <Text
            mode={mode}
            text={t('转动整幅覆盖图', 'Rotate the whole coverage')}
          />
        </button>
        <button
          className="math-button secondary"
          onClick={() => shape(board.width, board.height)}
        >
          <Text mode={mode} text={t('铺满长方形', 'Fill the rectangle')} />
        </button>
        <button
          className="math-button secondary"
          onClick={() => setBoard({ ...board, selected: [] })}
        >
          <Text mode={mode} text={t('清除覆盖', 'Clear coverage')} />
        </button>
        {[
          [6, 4],
          [8, 3],
        ].map(([w, h]) => (
          <button
            className="math-button secondary"
            key={`${w}-${h}`}
            onClick={() => shape(w!, h!)}
          >
            {w} × {h}
          </button>
        ))}
      </div>
      <p className="math-hint">
        <Text
          mode={mode}
          text={
            m.full
              ? t(
                  `完整长方形：${board.width}×${board.height}=${m.area} cm²。相同面积不保证周长相同。`,
                  `Complete rectangle: ${board.width}×${board.height}=${m.area} cm². Equal area does not ensure equal perimeter.`,
                )
              : t(
                  '有空格，只计已覆盖格。外框的列数×行数会把空格也算进去，不能当成当前覆盖面积。',
                  'There are gaps: count covered cells only. Bounding width times height includes gaps and does not give the current covered area.',
                )
          }
        />
      </p>
    </>
  );
}
const angleNames = {
  zero: t('零角', 'zero angle'),
  acute: t('锐角', 'acute angle'),
  right: t('直角', 'right angle'),
  obtuse: t('钝角', 'obtuse angle'),
  straight: t('平角', 'straight angle'),
};
const shapes = [
  {
    id: 'square',
    name: t('正方形', 'Square'),
    fact: t(
      '四条相等直边、四个直角。它也符合长方形的定义。',
      'Four equal straight sides and four right angles. It also meets the rectangle definition.',
    ),
  },
  {
    id: 'rectangle',
    name: t('长方形', 'Rectangle'),
    fact: t(
      '四条直边、四个直角；不要求四边都相等。',
      'Four straight sides and four right angles; all four sides need not be equal.',
    ),
  },
  {
    id: 'triangle',
    name: t('三角形', 'Triangle'),
    fact: t(
      '三条直边围成封闭图形。这个例子有一个直角，但三角形不必都有直角。',
      'Three straight sides form a closed figure. This example has a right angle, but not every triangle does.',
    ),
  },
  {
    id: 'circle',
    name: t('圆', 'Circle'),
    fact: t(
      '曲线边界，没有直边；圆不是多边形。',
      'A curved boundary with no straight sides; a circle is not a polygon.',
    ),
  },
];
function Angles({ mode }: { mode: LanguageMode }) {
  const [angle, setAngle] = useState(60),
    [length, setLength] = useState(110),
    [rotation, setRotation] = useState(0),
    [shape, setShape] = useState(0);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '角比较的是开口，不是线臂长短。固定开口，再把两臂同时转动；直角与图形定义不会随朝向改变。',
            'An angle measures opening rather than arm length. Keep the opening fixed while rotating both arms; right angles and shape definitions do not depend on orientation.',
          )}
        />
      </p>
      <Range
        label={t('开口（度）', 'Opening (degrees)')}
        value={angle}
        max={180}
        mode={mode}
        set={setAngle}
      />
      <div className="math-measure-controls">
        <Range
          label={t('线臂图示长度', 'Drawing arm length')}
          value={length}
          min={40}
          max={130}
          mode={mode}
          set={setLength}
        />
        <Range
          label={t('整图旋转（度）', 'Whole drawing rotation (degrees)')}
          value={rotation}
          max={359}
          mode={mode}
          set={setRotation}
        />
      </div>
      <AnglePicture
        angle={angle}
        length={length}
        rotation={rotation}
        mode={mode}
      />
      <div className="math-measure-readout">
        {angle}° · <Text mode={mode} text={angleNames[angleKind(angle)]} />
      </div>
      <div className="math-lab-presets">
        {[0, 45, 90, 120, 180].map((a) => (
          <button
            className="math-button secondary"
            key={a}
            onClick={() => setAngle(a)}
          >
            {a}°
          </button>
        ))}
      </div>
      <div className="math-lab-presets">
        {shapes.map((s, i) => (
          <button
            key={s.id}
            className="math-button secondary"
            aria-pressed={i === shape}
            onClick={() => setShape(i)}
          >
            <Text mode={mode} text={s.name} />
          </button>
        ))}
      </div>
      <svg
        className="math-measure-shape"
        viewBox="0 0 400 340"
        role="img"
        aria-label={
          mode === 'en'
            ? `${shapes[shape]!.name.en}, rotated ${rotation} degrees. ${shapes[shape]!.fact.en}`
            : `${shapes[shape]!.name.zh}，旋转 ${rotation} 度。${shapes[shape]!.fact.zh}`
        }
      >
        <g transform={`rotate(${-rotation} 200 170)`}>
          {shape === 0 ? (
            <rect
              x="120"
              y="90"
              width="160"
              height="160"
              fill="#dfd7ed"
              stroke="#8573a4"
              strokeWidth="3"
            />
          ) : shape === 1 ? (
            <rect
              x="90"
              y="110"
              width="220"
              height="120"
              fill="#dfd7ed"
              stroke="#8573a4"
              strokeWidth="3"
            />
          ) : shape === 2 ? (
            <polygon
              points="80,80 80,260 320,260"
              fill="#dfd7ed"
              stroke="#8573a4"
              strokeWidth="3"
            />
          ) : (
            <circle
              cx="200"
              cy="170"
              r="90"
              fill="#dfd7ed"
              stroke="#8573a4"
              strokeWidth="3"
            />
          )}
        </g>
      </svg>
      <p className="math-hint">
        <Text mode={mode} text={shapes[shape]!.fact} />
      </p>
    </>
  );
}
export const transportLabels = [
  t('步行', 'Walk'),
  t('骑车', 'Bike'),
  t('公交', 'Bus'),
];
function Charts({ mode }: { mode: LanguageMode }) {
  const [counts, setCounts] = useState([8, 6, 10]),
    [axis, setAxis] = useState(0),
    [table, setTable] = useState(false),
    axes = [
      { max: 20, step: 2 },
      { max: 20, step: 5 },
      { max: 40, step: 5 },
    ],
    scale = axes[axis]!,
    m = barGeometry(counts, scale.max, scale.step),
    values = counts.map((count, i) => ({ count, label: transportLabels[i]! }));
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '假想班级中，每人只记一种主要交通方式。先读零起点、单位与刻度间隔，再比较。换刻度或纵轴上限，不会改变表中人数。',
            'In this illustrative class, each person records one main travel mode. Read the zero baseline, unit and tick interval before comparing. Changing ticks or the axis maximum does not change the counts.',
          )}
        />
      </p>
      <div className="math-measure-controls">
        {counts.map((v, i) => (
          <Range
            key={i}
            label={t(
              `${transportLabels[i]!.zh}人数`,
              `${transportLabels[i]!.en} people`,
            )}
            value={v}
            max={20}
            mode={mode}
            set={(n) => {
              setCounts(counts.map((c, j) => (i === j ? n : c)));
              setTable(false);
            }}
          />
        ))}
      </div>
      <div className="math-lab-presets">
        {axes.map((a, i) => (
          <button
            key={i}
            className="math-button secondary"
            aria-pressed={i === axis}
            onClick={() => setAxis(i)}
          >
            <Text
              mode={mode}
              text={t(
                `上限 ${a.max} · 间隔 ${a.step}`,
                `Max ${a.max} · interval ${a.step}`,
              )}
            />
          </button>
        ))}
      </div>
      <BarChart values={values} {...scale} mode={mode} />
      <button
        className="math-button secondary"
        aria-expanded={table}
        onClick={() => setTable(!table)}
      >
        <Text
          mode={mode}
          text={t(
            '我已读图，展开表格核对',
            'I read the chart; check the table',
          )}
        />
      </button>
      {table && (
        <>
          <table className="math-measure-table">
            <caption>
              <Text
                mode={mode}
                text={t(
                  '假想数据 · 非真实班级调查',
                  'Illustrative data · not a real class survey',
                )}
              />
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  <Text mode={mode} text={t('方式', 'Mode')} />
                </th>
                <th scope="col">
                  <Text mode={mode} text={t('人数', 'People')} />
                </th>
              </tr>
            </thead>
            <tbody>
              {values.map((v, i) => (
                <tr key={i}>
                  <th scope="row">
                    <Text mode={mode} text={v.label} />
                  </th>
                  <td>{v.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="math-measure-readout">
            {counts.join(' + ')} = {m.total}
            <p className="math-measure-caption">
              <Text
                mode={mode}
                text={t(
                  '每人只计一次时，可相加求总人数。这里不能推断哪种方式“更好”。',
                  'With one record per person, add to find the total. These data do not show which mode is better.',
                )}
              />
            </p>
          </div>
        </>
      )}
    </>
  );
}
export function MeasurementLab({
  kind,
  mode,
}: {
  kind: MeasurementLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-measure-lab">
      <div className="math-row">
        <span className="math-eyebrow">
          <Text
            mode={mode}
            text={t(
              '测量与读图工作台 · 先确认单位',
              'MEASUREMENT WORKSHOP · IDENTIFY THE UNIT',
            )}
          />
        </span>
        <span className="math-live">
          <Text
            mode={mode}
            text={t('图、量、单位同步', 'DIAGRAM, QUANTITY AND UNIT')}
          />
        </span>
      </div>
      {kind === 'measurement-length' ? (
        <Length mode={mode} />
      ) : kind === 'measurement-perimeter' ? (
        <Perimeter mode={mode} />
      ) : kind === 'measurement-area' ? (
        <Area mode={mode} />
      ) : kind === 'measurement-angle' ? (
        <Angles mode={mode} />
      ) : (
        <Charts mode={mode} />
      )}
      <div className="math-lab-reflect">
        <span>↳</span>
        <Text
          mode={mode}
          text={t(
            '解释：在计长度、覆盖量、开口还是人数？换位置、单位或标尺后，哪些量改变、哪些量保留？',
            'Explain whether you count length, coverage, opening or people. Which quantities change or remain when position, units or scale change?',
          )}
        />
      </div>
    </section>
  );
}
export function MeasurementHookArt({
  kind,
  mode,
}: {
  kind: MeasurementLabKind;
  mode: LanguageMode;
}) {
  return (
    <div className="math-number-hook">
      {kind === 'measurement-length' ? (
        <Ruler startMm={30} endMm={100} unit="cm" mode={mode} />
      ) : kind === 'measurement-perimeter' ? (
        <Boundary width={8} height={5} walked={3} mode={mode} />
      ) : kind === 'measurement-area' ? (
        <TileGrid width={6} height={4} selected={fullTiles(6, 4)} mode={mode} />
      ) : kind === 'measurement-angle' ? (
        <AnglePicture angle={90} length={110} rotation={45} mode={mode} />
      ) : (
        <BarChart
          values={[8, 6, 10].map((count, i) => ({
            count,
            label: transportLabels[i]!,
          }))}
          max={20}
          step={2}
          mode={mode}
        />
      )}
    </div>
  );
}
