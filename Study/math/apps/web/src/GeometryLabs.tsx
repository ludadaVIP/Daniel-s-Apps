import { useState } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, type Lesson } from './model';
import { Text } from './ui';
import {
  convertGeometryUnit,
  conversionText,
  rectangleArea,
  triangleRearrangement,
  parallelogramCut,
  trapezoidRearrangement,
  cuboid,
  cuboidNet,
  type GeoUnit,
  type NetFaceId,
} from './geometryModels';
import {
  RectangleGrid,
  AreaRearrangement,
  CuboidView,
  CubeLayer,
  SurfaceNet,
  UnitTilingView,
  faceNames,
  faceLetters,
  type RearrangementStage,
} from './GeometryVisuals';
export type GeometryLabKind = Extract<Lesson['lab'], `geo-${string}`>;
export const isGeometryLab = (kind: Lesson['lab']): kind is GeometryLabKind =>
  kind.startsWith('geo-');
const primary = (mode: LanguageMode, copy: LocalizedText) =>
  mode === 'en' ? copy.en : copy.zh;
function Range({
  label,
  value,
  min = 1,
  max,
  mode,
  onChange,
}: {
  label: LocalizedText;
  value: number;
  min?: number;
  max: number;
  mode: LanguageMode;
  onChange: (n: number) => void;
}) {
  return (
    <label>
      <Text mode={mode} text={label} />
      <input
        type="range"
        aria-label={primary(mode, label)}
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <output>{value}</output>
    </label>
  );
}
function Units({ mode }: { mode: LanguageMode }) {
  const [dimension, setDimension] = useState<1 | 2 | 3>(1),
    [large, setLarge] = useState<'m' | 'dm'>('m'),
    [step, setStep] = useState(0),
    [layer, setLayer] = useState(1);
  const suffix = dimension === 1 ? '' : dimension === 2 ? '²' : '³',
    from = `${large}${suffix}` as GeoUnit,
    to = `${large === 'm' ? 'dm' : 'cm'}${suffix}` as GeoUnit;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '以一个大单位为共同整体。每条棱换小一级为十段，面积有两方向，体积有三方向；先预测单位数，实际长度、面积或体积都不改变。',
            'Use one large unit as the reference. A one-step edge conversion makes ten segments; area has two directions and volume three. Predict the count; the actual quantity stays fixed.',
          )}
        />
      </p>
      <div className="math-geometry-controls">
        <label>
          <Text mode={mode} text={t('测量什么', 'What is measured?')} />
          <select
            aria-label={mode === 'en' ? 'Quantity dimension' : '测量维度'}
            value={dimension}
            onChange={(e) => {
              setDimension(Number(e.target.value) as 1 | 2 | 3);
              setStep(0);
              setLayer(1);
            }}
          >
            <option value="1">{mode === 'en' ? 'Length' : '长度'}</option>
            <option value="2">{mode === 'en' ? 'Area' : '面积'}</option>
            <option value="3">{mode === 'en' ? 'Volume' : '体积'}</option>
          </select>
        </label>
        <label>
          <Text mode={mode} text={t('示范的大单位', 'Demonstration whole')} />
          <select
            aria-label={mode === 'en' ? 'Large unit' : '大单位'}
            value={large}
            onChange={(e) => {
              setLarge(e.target.value as 'm' | 'dm');
              setStep(0);
              setLayer(1);
            }}
          >
            <option value="m">m{suffix}</option>
            <option value="dm">dm{suffix}</option>
          </select>
        </label>
      </div>
      <p className="math-muted">
        <Text
          mode={mode}
          text={
            step >= 2 && large === 'm'
              ? t(
                  `现在仅放大其中一个 1 dm${suffix}，不是整个 1 m${suffix}；整体包含许多这样的子单位。`,
                  `Now zoom into just one 1 dm${suffix}, not the entire 1 m${suffix}; the whole contains many such subunits.`,
                )
              : t(
                  `图中示范 1 ${from}，换算不是把它拉大。`,
                  `The diagram represents 1 ${from}; conversion does not enlarge it.`,
                )
          }
        />
      </p>
      {dimension === 3 && (
        <Range
          label={t('查看第几层', 'Layer to inspect')}
          value={layer}
          min={1}
          max={10}
          mode={mode}
          onChange={setLayer}
        />
      )}
      <UnitTilingView
        dimension={dimension}
        large={large}
        level={step >= 2 && large === 'm' ? 1 : 0}
        layer={layer}
        mode={mode}
      />
      {step < (large === 'm' ? 2 : 1) && (
        <button
          type="button"
          className="math-button"
          onClick={() => setStep((s) => s + 1)}
        >
          <Text
            mode={mode}
            text={
              step === 0
                ? t(
                    '我已预测，核对第一级单位数',
                    'I predicted; check the first-level count',
                  )
                : t(
                    '再细分一级，核对厘米单位',
                    'Refine one more level; check centimetre units',
                  )
            }
          />
        </button>
      )}
      {step >= 1 && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `1 ${from}=${conversionText(convertGeometryUnit('1', from, to))} ${to}。每条棱进率十，单位数用 10${suffix || ''}${dimension === 1 ? '' : ' 的乘积'}，不是所有量都只乘十。`,
              `1 ${from}=${conversionText(convertGeometryUnit('1', from, to))} ${to}. Each edge factor is ten; the unit count uses ${dimension === 1 ? '10' : dimension === 2 ? '10×10' : '10×10×10'}, not one factor of ten for every quantity.`,
            )}
          />
        </p>
      )}
      {step >= 2 && large === 'm' && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `1 ${from}=${conversionText(convertGeometryUnit('1', from, `cm${suffix}` as GeoUnit))} cm${suffix}。先把 m 变 dm，再把每个 dm 单位变 cm 单位；两级单位数相乘。`,
              `1 ${from}=${conversionText(convertGeometryUnit('1', from, `cm${suffix}` as GeoUnit))} cm${suffix}. Convert metres to decimetres, then each decimetre unit to centimetre units; multiply the counts across levels.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Rectangles({ mode }: { mode: LanguageMode }) {
  const [w, setW] = useState(6),
    [h, setH] = useState(4),
    [square, setSquare] = useState(false),
    [reveal, setReveal] = useState(false);
  const m = rectangleArea(w, h);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测几行、每行几格。正方形仍是长方形的特殊情况；旋转交换边长而不改变单位格总量。周长作为不同量对照。',
            'Predict rows and cells per row. A square is a special rectangle; rotation swaps edge lengths without changing cell count. Perimeter is a different quantity.',
          )}
        />
      </p>
      <label>
        <input
          type="checkbox"
          checked={square}
          onChange={(e) => {
            setSquare(e.target.checked);
            if (e.target.checked) setH(w);
            setReveal(false);
          }}
        />
        <Text mode={mode} text={t('联动成正方形', 'Link edges as a square')} />
      </label>
      <div className="math-geometry-controls">
        <Range
          label={t('横边（cm）', 'Horizontal edge (cm)')}
          value={w}
          max={12}
          mode={mode}
          onChange={(v) => {
            setW(v);
            if (square) setH(v);
            setReveal(false);
          }}
        />
        {!square && (
          <Range
            label={t('纵边（cm）', 'Vertical edge (cm)')}
            value={h}
            max={12}
            mode={mode}
            onChange={(v) => {
              setH(v);
              setReveal(false);
            }}
          />
        )}
      </div>
      <RectangleGrid w={w} h={h} mode={mode} />
      <div className="math-geometry-actions">
        <button
          type="button"
          className="math-button secondary"
          onClick={() => {
            setW(h);
            setH(w);
            setReveal(false);
          }}
        >
          <Text
            mode={mode}
            text={t('旋转，交换两条边', 'Rotate; swap the edges')}
          />
        </button>
        <button
          type="button"
          className="math-button"
          onClick={() => setReveal(true)}
        >
          <Text
            mode={mode}
            text={t('我已数好，核对面积', 'I counted; check the area')}
          />
        </button>
      </div>
      {reveal && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `面积 ${w}×${h}=${m.area} cm²，${h} 行各 ${w} 格。周长 2×(${w}+${h})=${m.perimeter} cm；两者单位不同，不能把数值当同类量比较。`,
              `Area ${w}×${h}=${m.area} cm²: ${h} rows of ${w} cells. Perimeter 2×(${w}+${h})=${m.perimeter} cm. The units differ; their numbers are not directly comparable quantities.`,
            )}
          />
        </p>
      )}
    </>
  );
}
const stepCopy = {
  mirror: t(
    '反射到另一侧，保留底与高',
    'Reflect to the other side, retaining base and height',
  ),
  pair: t(
    '旋转一份相同的图形，拼成平行四边形',
    'Rotate an identical copy to form a parallelogram',
  ),
  cut: t('沿垂线切下一块', 'Cut a piece along a perpendicular'),
  move: t('平移切块，补成矩形', 'Translate the piece to complete a rectangle'),
  area: t('用矩形核对原图面积', 'Use the rectangle to check the original area'),
};
function Rearrange({
  mode,
  triangle = false,
}: {
  mode: LanguageMode;
  triangle?: boolean;
}) {
  const [shape, setShape] = useState<'triangle' | 'parallel' | 'trapezoid'>(
      triangle ? 'triangle' : 'parallel',
    ),
    [b, setB] = useState(6),
    [h, setH] = useState(4),
    [a, setA] = useState(3),
    [shift, setShift] = useState(2),
    [step, setStep] = useState(0);
  const m =
    shape === 'triangle'
      ? triangleRearrangement(b, h, shift)
      : shape === 'trapezoid'
        ? trapezoidRearrangement(a, b, h, shift)
        : parallelogramCut(b, h, shift);
  const needsCut = 'pair' in m ? m.pair.cutArea > 0 : m.cutArea > 0;
  const cutSteps: ('cut' | 'move')[] = needsCut ? ['cut', 'move'] : [];
  const steps: ('mirror' | 'pair' | 'cut' | 'move' | 'area')[] =
    shape === 'triangle'
      ? [
          ...(triangleRearrangement(b, h, shift).mirror
            ? ['mirror' as const]
            : []),
          'pair',
          ...cutSteps,
          'area',
        ]
      : shape === 'trapezoid'
        ? ['pair', ...cutSteps, 'area']
        : [...cutSteps, 'area'];
  const current = step === 0 ? 'original' : steps[step - 1]!,
    stage: RearrangementStage = current === 'area' ? 'move' : current;
  const change = (set: (v: number) => void, v: number) => {
    set(v);
    setStep(0);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测每一步怎样保持面积。高必须与所选底垂直；切块平移不拉伸。两份图形拼成的面积，最后要分回一份。',
            'Predict how each step retains area. Height is perpendicular to the chosen base; translating a cut piece does not stretch it. A pair’s area must finally be divided back into one copy.',
          )}
        />
      </p>
      {!triangle && (
        <div className="math-geometry-actions">
          {(['parallel', 'trapezoid'] as const).map((s) => (
            <button
              key={s}
              type="button"
              className="math-button secondary"
              aria-pressed={shape === s}
              onClick={() => {
                setShape(s);
                setShift(Math.max(-b, Math.min(b, shift)));
                setStep(0);
              }}
            >
              <Text
                mode={mode}
                text={
                  s === 'parallel'
                    ? t('平行四边形', 'Parallelogram')
                    : t('梯形', 'Trapezoid')
                }
              />
            </button>
          ))}
        </div>
      )}
      <div className="math-geometry-controls">
        {shape === 'trapezoid' && (
          <Range
            label={t('上底（cm）', 'Top base (cm)')}
            value={a}
            max={12}
            mode={mode}
            onChange={(v) => change(setA, v)}
          />
        )}
        <Range
          label={t(
            shape === 'trapezoid' ? '下底（cm）' : '底（cm）',
            shape === 'trapezoid' ? 'Bottom base (cm)' : 'Base (cm)',
          )}
          value={b}
          max={12}
          mode={mode}
          onChange={(v) => {
            setB(v);
            setShift((s) =>
              Math.max(-v, Math.min(shape === 'triangle' ? 2 * v : v, s)),
            );
            setStep(0);
          }}
        />
        <Range
          label={t('垂直高（cm）', 'Perpendicular height (cm)')}
          value={h}
          max={10}
          mode={mode}
          onChange={(v) => change(setH, v)}
        />
        <Range
          label={t(
            shape === 'triangle'
              ? '顶点的水平位置（cm）'
              : '上边的水平错移（cm）',
            shape === 'triangle'
              ? 'Apex horizontal position (cm)'
              : 'Top-edge horizontal shear (cm)',
          )}
          value={shift}
          min={-b}
          max={shape === 'triangle' ? 2 * b : b}
          mode={mode}
          onChange={(v) => change(setShift, v)}
        />
      </div>
      {shape === 'trapezoid' && a === b && (
        <p className="math-muted">
          <Text
            mode={mode}
            text={t(
              '上下底相等时，这幅图是平行四边形；两平行底的面积式仍有效。',
              'Equal parallel bases make this a parallelogram; the general parallel-base area formula still works.',
            )}
          />
        </p>
      )}
      <AreaRearrangement
        shape={shape}
        b={b}
        h={h}
        a={a}
        apex={shift}
        stage={stage}
        mode={mode}
      />
      {step > 0 && (
        <p>
          <Text mode={mode} text={stepCopy[current as keyof typeof stepCopy]} />
        </p>
      )}
      {step < steps.length && (
        <button
          type="button"
          className="math-button"
          onClick={() => setStep((v) => v + 1)}
        >
          <Text
            mode={mode}
            text={t(
              '我已预测，展开下一步',
              'I predicted; reveal the next step',
            )}
          />
        </button>
      )}
      {current === 'area' && (
        <p role="status">
          <Text
            mode={mode}
            text={
              shape === 'parallel'
                ? t(
                    `矩形底 ${b} cm、高 ${h} cm，面积 ${b}×${h}=${m.area} cm²；原图切拼后同量。斜边不能当高。`,
                    `Rectangle base ${b} cm and height ${h} cm give ${b}×${h}=${m.area} cm², retained by the original cut pieces. The slanted side is not the height.`,
                  )
                : shape === 'triangle'
                  ? t(
                      `两份相同三角形拼切成底 ${b}、高 ${h} 的矩形；一份面积 ${b}×${h}÷2=${m.area} cm²。`,
                      `Two identical triangles rearrange into a rectangle of base ${b} and height ${h}; one area is ${b}×${h}÷2=${m.area} cm².`,
                    )
                  : t(
                      `两份梯形拼切成底 ${a}+${b}、高 ${h} 的矩形；一份面积 (${a}+${b})×${h}÷2=${m.area} cm²。`,
                      `Two trapezoids rearrange into a rectangle of base ${a}+${b} and height ${h}; one area is (${a}+${b})×${h}÷2=${m.area} cm².`,
                    )
            }
          />
        </p>
      )}
    </>
  );
}
function Volume({ mode }: { mode: LanguageMode }) {
  const [w, setW] = useState(4),
    [d, setD] = useState(3),
    [h, setH] = useState(2),
    [cube, setCube] = useState(false),
    [layer, setLayer] = useState(1),
    [view, setView] = useState<'solid' | 'layers'>('solid'),
    [all, setAll] = useState(false),
    [reveal, setReveal] = useState(false);
  const m = cuboid(w, d, h);
  const change = (set: (n: number) => void, n: number) => {
    set(n);
    if (cube) {
      setW(n);
      setD(n);
      setH(n);
    }
    setLayer(1);
    setReveal(false);
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测底层有多少颗，再有几层。每颗是 1 cm³ 小正方体。外表看到的块不一定是全部；内部容积题要用内部尺寸。',
            'Predict cubes in a bottom layer, then the number of layers. Each cube is 1 cm³. Visible outside cubes need not be all cubes; capacity problems require internal dimensions.',
          )}
        />
      </p>
      <label>
        <input
          type="checkbox"
          checked={cube}
          onChange={(e) => {
            setCube(e.target.checked);
            if (e.target.checked) {
              setD(w);
              setH(w);
            }
            setLayer(1);
            setReveal(false);
          }}
        />
        <Text
          mode={mode}
          text={t('联动成正方体', 'Link all edges as a cube')}
        />
      </label>
      <div className="math-geometry-controls">
        <Range
          label={t('长（cm）', 'Length (cm)')}
          value={w}
          max={6}
          mode={mode}
          onChange={(n) => change(setW, n)}
        />
        {!cube && (
          <>
            <Range
              label={t('宽（cm）', 'Depth (cm)')}
              value={d}
              max={6}
              mode={mode}
              onChange={(n) => change(setD, n)}
            />
            <Range
              label={t('高（cm）', 'Height (cm)')}
              value={h}
              max={6}
              mode={mode}
              onChange={(n) => change(setH, n)}
            />
          </>
        )}
      </div>
      <div className="math-geometry-actions">
        {(['solid', 'layers'] as const).map((v) => (
          <button
            key={v}
            type="button"
            className="math-button secondary"
            aria-pressed={view === v}
            onClick={() => setView(v)}
          >
            <Text
              mode={mode}
              text={
                v === 'solid'
                  ? t('立体示意', 'Solid view')
                  : t('逐层看', 'Inspect layers')
              }
            />
          </button>
        ))}
      </div>
      {view === 'solid' ? (
        <CuboidView w={w} d={d} h={h} mode={mode} />
      ) : (
        <>
          <label>
            <input
              type="checkbox"
              checked={all}
              onChange={(e) => setAll(e.target.checked)}
            />
            <Text
              mode={mode}
              text={t('显示所有层的位置图', 'Show position maps of all layers')}
            />
          </label>
          {!all && (
            <Range
              label={t('查看第几层', 'Layer to inspect')}
              value={layer}
              min={1}
              max={h}
              mode={mode}
              onChange={setLayer}
            />
          )}{' '}
          {(all ? Array.from({ length: h }, (_, i) => i + 1) : [layer]).map(
            (i) => (
              <CubeLayer key={i} w={w} d={d} layer={i} total={h} mode={mode} />
            ),
          )}
        </>
      )}
      <button
        type="button"
        className="math-button"
        onClick={() => setReveal(true)}
      >
        <Text
          mode={mode}
          text={t('我已数层，核对体积', 'I counted layers; check the volume')}
        />
      </button>
      {reveal && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `每层 ${w}×${d}=${m.layerCount} 颗，共 ${h} 层，体积 ${w}×${d}×${h}=${m.volume} cm³。面积单位 cm² 不能当体积单位。`,
              `Each layer has ${w}×${d}=${m.layerCount} cubes; ${h} layers give ${w}×${d}×${h}=${m.volume} cm³. Area units cm² are not volume units.`,
            )}
          />
        </p>
      )}
    </>
  );
}
function Surface({ mode }: { mode: LanguageMode }) {
  const [w, setW] = useState(4),
    [d, setD] = useState(3),
    [h, setH] = useState(2),
    [lid, setLid] = useState(true),
    [selected, setSelected] = useState<NetFaceId>('front'),
    [faceChecked, setFaceChecked] = useState(false),
    [showBounds, setShowBounds] = useState(false),
    [totalChecked, setTotalChecked] = useState(false);
  const m = cuboidNet(w, d, h, lid),
    face = m.faces.find((f) => f.id === selected)!;
  const reset = () => {
    setFaceChecked(false);
    setTotalChecked(false);
    setSelected('front');
  };
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先逐面预测，再合计理想纸面。表面积数外面的单位正方形，不数内部小正方体。接缝、重叠和裁切余量需要另给资料。',
            'Predict each face before summing ideal panels. Surface area counts outside unit squares, not inside cubes. Seams, overlap and cutting allowances need additional information.',
          )}
        />
      </p>
      <div className="math-geometry-controls">
        <Range
          label={t('长（cm）', 'Length (cm)')}
          value={w}
          max={8}
          mode={mode}
          onChange={(n) => {
            setW(n);
            reset();
          }}
        />
        <Range
          label={t('宽（cm）', 'Depth (cm)')}
          value={d}
          max={8}
          mode={mode}
          onChange={(n) => {
            setD(n);
            reset();
          }}
        />
        <Range
          label={t('高（cm）', 'Height (cm)')}
          value={h}
          max={8}
          mode={mode}
          onChange={(n) => {
            setH(n);
            reset();
          }}
        />
      </div>
      <label>
        <input
          type="checkbox"
          checked={lid}
          onChange={(e) => {
            setLid(e.target.checked);
            reset();
          }}
        />
        <Text
          mode={mode}
          text={t('有盖，计顶面', 'Include a lid and its top face')}
        />
      </label>
      <label>
        <input
          type="checkbox"
          checked={showBounds}
          onChange={(e) => setShowBounds(e.target.checked)}
        />
        <Text
          mode={mode}
          text={t(
            '显示这张网的纸张外接框',
            'Show this net’s bounding-sheet frame',
          )}
        />
      </label>
      <SurfaceNet
        w={w}
        d={d}
        h={h}
        lid={lid}
        selected={selected}
        mode={mode}
        showBounds={showBounds}
      />
      {showBounds && (
        <p>
          <Text
            mode={mode}
            text={t(
              `本排版的外接矩形 ${m.bounds.width}×${m.bounds.height}=${m.bounds.area} cm²，包含空白裁切区；不是所有排版的最小用纸量，也未计接缝。`,
              `This layout’s bounding rectangle is ${m.bounds.width}×${m.bounds.height}=${m.bounds.area} cm², including blank cutting regions. This is not a universal minimum and excludes seams.`,
            )}
          />
        </p>
      )}
      <div className="math-geometry-face-buttons">
        {m.faces.map((f) => (
          <button
            key={f.id}
            type="button"
            className="math-button secondary"
            aria-pressed={selected === f.id}
            onClick={() => {
              setSelected(f.id);
              setFaceChecked(false);
            }}
          >
            <Text
              mode={mode}
              text={t(
                `${faceLetters[f.id]} · ${faceNames[f.id].zh}`,
                `${faceLetters[f.id]} · ${faceNames[f.id].en}`,
              )}
            />
          </button>
        ))}
      </div>
      <p>
        <Text
          mode={mode}
          text={t(
            `选中${faceNames[selected].zh}，两条边 ${face.w} cm 与 ${face.h} cm。先算这一面。`,
            `Selected ${faceNames[selected].en.toLowerCase()}: edges ${face.w} cm and ${face.h} cm. Calculate this face first.`,
          )}
        />
      </p>
      <div className="math-geometry-actions">
        <button
          type="button"
          className="math-button secondary"
          onClick={() => setFaceChecked(true)}
        >
          <Text mode={mode} text={t('核对这一面', 'Check this face')} />
        </button>
        <button
          type="button"
          className="math-button"
          onClick={() => setTotalChecked(true)}
        >
          <Text
            mode={mode}
            text={t(
              '我已合计，核对表面积',
              'I summed the faces; check surface area',
            )}
          />
        </button>
      </div>
      {faceChecked && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `这一面 ${face.w}×${face.h}=${face.w * face.h} cm²。`,
              `This face: ${face.w}×${face.h}=${face.w * face.h} cm².`,
            )}
          />
        </p>
      )}
      {totalChecked && (
        <p role="status">
          <Text
            mode={mode}
            text={t(
              `${lid ? '六面' : '无顶五面'}面积和 ${m.faces.map((f) => f.w * f.h).join('+')}=${m.surface} cm²。${lid ? '有三对相等面。' : '只少顶面，不少底面。'} 不把 ${w * d * h} cm³ 的体积当作包装纸面积。`,
              `${lid ? 'Six faces' : 'Five faces without a top'} sum to ${m.faces.map((f) => f.w * f.h).join('+')}=${m.surface} cm². ${lid ? 'There are three equal face pairs.' : 'Remove only the top, not the bottom.'} Volume ${w * d * h} cm³ is not wrapping-paper area.`,
            )}
          />
        </p>
      )}
    </>
  );
}
export function GeometryLab({
  kind,
  mode,
}: {
  kind: GeometryLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab math-geometry-lab">
      <div className="math-row">
        <span className="math-eyebrow">
          <Text
            mode={mode}
            text={t(
              '动手数学 · 单位、拼接与逐层核查',
              'HANDS-ON MATHS · UNITS, REARRANGEMENT, LAYERS',
            )}
          />
        </span>
        <span className="math-live">
          <Text mode={mode} text={t('准确构造', 'ACCURATE CONSTRUCTION')} />
        </span>
      </div>
      {kind === 'geo-units' ? (
        <Units mode={mode} />
      ) : kind === 'geo-rectangle' ? (
        <Rectangles mode={mode} />
      ) : kind === 'geo-triangle' ? (
        <Rearrange mode={mode} triangle />
      ) : kind === 'geo-parallel-trapezoid' ? (
        <Rearrange mode={mode} />
      ) : kind === 'geo-volume' ? (
        <Volume mode={mode} />
      ) : (
        <Surface mode={mode} />
      )}
    </section>
  );
}
export function GeometryHookArt({
  kind,
  mode,
}: {
  kind: GeometryLabKind;
  mode: LanguageMode;
}) {
  return kind === 'geo-units' ? (
    <UnitTilingView dimension={2} large="m" mode={mode} />
  ) : kind === 'geo-rectangle' ? (
    <RectangleGrid w={6} h={4} mode={mode} />
  ) : kind === 'geo-triangle' ? (
    <AreaRearrangement shape="triangle" b={6} h={4} apex={2} mode={mode} />
  ) : kind === 'geo-parallel-trapezoid' ? (
    <AreaRearrangement
      shape="trapezoid"
      a={3}
      b={7}
      h={4}
      apex={2}
      mode={mode}
    />
  ) : kind === 'geo-volume' ? (
    <CuboidView w={4} d={3} h={2} mode={mode} />
  ) : (
    <SurfaceNet w={4} d={3} h={2} lid mode={mode} />
  );
}
