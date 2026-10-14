import type { ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { assets, t, words } from './content';
import { Text } from './ui';
import {
  compressedBlock,
  particlePositions,
  rockEdges,
  rockStates,
  surfaceBudget,
  type RockState,
} from './landscapeModels';

function Figure({
  mode,
  description,
  caption,
  children,
}: {
  mode: LanguageMode;
  description: LocalizedText;
  caption: LocalizedText;
  children: ReactNode;
}) {
  return (
    <figure className="geo-skill-figure geo-landscape-figure">
      <div
        className="geo-model-scroll"
        tabIndex={0}
        role="region"
        aria-label={words(
          mode,
          '可左右滚动的地貌图示',
          'Landscape diagram, scroll horizontally',
        )}
      >
        <svg
          viewBox="0 0 640 420"
          role="img"
          aria-label={
            mode === 'bilingual'
              ? `${description.zh} / ${description.en}`
              : words(mode, description.zh, description.en)
          }
        >
          <rect width="640" height="420" rx="12" fill="#eef2e8" />
          {children}
        </svg>
      </div>
      <p className="geo-swipe-hint">
        <Text
          mode={mode}
          text={t(
            '小屏左右滑动看全图；键盘可聚焦图框后用方向键滚动。',
            'On small screens, swipe sideways; keyboard users can focus the frame and scroll with arrow keys.',
          )}
        />
      </p>
      <figcaption>
        <Text mode={mode} text={caption} />
      </figcaption>
    </figure>
  );
}
export function MountainSection({
  mode,
  frame,
}: {
  mode: LanguageMode;
  frame: number;
}) {
  const block = compressedBlock(frame),
    left = (640 - block.width) / 2,
    top = 205 - (block.thickness - 40) * 0.6;
  return (
    <Figure
      mode={mode}
      description={t(
        `挤压帧${frame}：同量材料变窄变厚，抬升与深部根同时出现。`,
        `Compression frame ${frame}: the same amount of material becomes narrower and thicker, rising above and extending below.`,
      )}
      caption={t(
        'Study原创剖面类比：同一矩形截面积不变，宽度缩短、厚度增加。真实岩层可褶皱、断裂；矩形、竖向夸大与四帧不是实际山形、地壳尺寸或时间。',
        'Study original section analogy: constant rectangular area, shorter width and greater thickness. Real rocks can fold and fault. The rectangle, exaggerated vertical dimension and four frames are not an actual mountain profile, crustal size or time scale.',
      )}
    >
      <text x="30" y="40" fontSize="21" fill="#315f69">
        {words(
          mode,
          '同量材料 → 变窄、变厚',
          'Same material → narrower, thicker',
        )}
      </text>
      <path d="M35 205H605" stroke="#78918d" strokeDasharray="6 6" />
      <rect
        x={left}
        y={top}
        width={block.width}
        height={block.thickness}
        fill="#c7b28d"
        stroke="#806b52"
        strokeWidth="2"
      />
      {[0.25, 0.5, 0.75].map((f) => (
        <path
          key={f}
          d={`M${left} ${top + block.thickness * f}H${left + block.width}`}
          stroke="#967c5b"
          strokeWidth="3"
        />
      ))}
      <path
        d={`M40 ${top + 20}H${left - 12}m-14 -9 14 9 -14 9 M600 ${top + 20}H${left + block.width + 12}m14 -9 -14 9 14 9`}
        fill="none"
        stroke="#bd7658"
        strokeWidth="4"
      />
      {frame > 0 && (
        <>
          <path
            d={`M320 180V${top - 10}m-8 10 8 -10 8 10`}
            fill="none"
            stroke="#315f69"
            strokeWidth="3"
          />
          <text x="340" y="150" fontSize="18">
            {words(mode, '抬升', 'Uplift')}
          </text>
          <text x="265" y="300" fontSize="18">
            {words(mode, '深部也增厚', 'Thicker at depth too')}
          </text>
        </>
      )}
      <text x="40" y="355" fontSize="17">
        {words(
          mode,
          '截面只显示挤压分量；沿断层错动另看上方视角。',
          'Section shows compression; along-fault slip needs a plan view.',
        )}
      </text>
      <text x="40" y="390" fontSize="17">
        {words(
          mode,
          '不加入熔岩；造山不需要把岩石熔化。',
          'No lava added; mountain building need not melt rock.',
        )}
      </text>
    </Figure>
  );
}
export function ObliqueMotion({ mode }: { mode: LanguageMode }) {
  return (
    <Figure
      mode={mode}
      description={t(
        '上方视角：边界两侧既靠近，也沿边界相互滑过。',
        'Plan view: two sides approach and also slide past along the boundary.',
      )}
      caption={t(
        'Study原创运动分量图；不是南岛精确板块图。阿尔卑斯断层的相对运动含错动与挤压，故不能只套“纯平移”或“纯碰撞”。箭头没有速度比例。',
        'Study original components diagram, not a precise South Island plate map. Relative motion at the Alpine Fault includes sideways slip and compression; neither pure sliding nor pure collision captures both. Arrows have no speed scale.',
      )}
    >
      <rect x="45" y="75" width="250" height="260" rx="12" fill="#c7d3b5" />
      <rect x="345" y="75" width="250" height="260" rx="12" fill="#d8bc95" />
      <path d="M320 60V350" stroke="#806b52" strokeWidth="5" />
      <path
        d="M135 275L265 130m-35 6 35 -6 -6 35 M505 135L375 280m6 -35 -6 35 35 -6"
        stroke="#315f69"
        strokeWidth="7"
        fill="none"
      />
      <text x="70" y="60" fontSize="18">
        {words(mode, '沿边界 + 向边界', 'Along + towards boundary')}
      </text>
      <text x="105" y="365" fontSize="19">
        {words(mode, '上方视角', 'PLAN VIEW')}
      </text>
      <text x="70" y="397" fontSize="17">
        {words(
          mode,
          '本图不画地下俯冲板片，也不显示地震发生时间。',
          'No underground slab or earthquake timing shown here.',
        )}
      </text>
    </Figure>
  );
}
export function MountainBudget({
  mode,
  removal,
  frame,
}: {
  mode: LanguageMode;
  removal: number;
  frame: number;
}) {
  const height = surfaceBudget(removal, frame),
    peakY = 320 - height * 9;
  return (
    <Figure
      mode={mode}
      description={t(
        `虚构模型：抬升每段3单位，移除${removal}单位，${frame}段后高度${height}单位。`,
        `Fictional model: uplift 3, removal ${removal} per interval; height ${height} after ${frame} intervals.`,
      )}
      caption={t(
        '虚构“地表高度收支”模型：初值10，每段抬升3，移除1／3／5；单位任意，不是米／年。两过程同时计算，底部设为0。它只演示相对大小，不模拟侵蚀反馈、均衡调整或预测南阿尔卑斯山。',
        'Fictional surface-height budget: start 10, uplift 3 and removal 1/3/5 per interval in arbitrary units, not metres/year. Processes act together with a zero floor. This only compares their relative size; it omits erosion feedback/isostatic adjustment and does not forecast the Southern Alps.',
      )}
    >
      <path
        d={`M90 320L320 ${peakY}L550 320Z`}
        fill="#c7b28d"
        stroke="#806b52"
        strokeWidth="2"
      />
      <path
        d="M90 320L320 230L550 320"
        stroke="#78918d"
        strokeDasharray="7 6"
        fill="none"
        strokeWidth="2"
      />
      <text x="40" y="42" fontSize="19">
        {words(
          mode,
          `帧 ${frame} · 地表高度 ${height}`,
          `Frame ${frame} · surface height ${height}`,
        )}
      </text>
      <text x="40" y="78" fontSize="18">
        {words(
          mode,
          `+3 抬升 / −${removal} 移除（每段）`,
          `+3 uplift / −${removal} removal (per interval)`,
        )}
      </text>
      <text x="410" y="208" fontSize="17">
        {words(mode, '虚线：初始高度10', 'Dashed: initial height 10')}
      </text>
      <path
        d="M320 330V275m-9 12 9 -12 9 12"
        stroke="#315f69"
        strokeWidth="4"
        fill="none"
      />
      <text x="40" y="388" fontSize="18">
        {words(
          mode,
          '抬升仍可进行，而山顶高度减小。',
          'Uplift can continue while summit height decreases.',
        )}
      </text>
    </Figure>
  );
}
export function RockNetwork({
  mode,
  current,
  reveal = true,
}: {
  mode: LanguageMode;
  current: RockState;
  reveal?: boolean;
}) {
  return (
    <Figure
      mode={mode}
      description={t(
        '五个状态以多条过程相连；不是每块石头必须走的一圈。',
        'Five states connect through several processes; each rock need not travel one full loop.',
      )}
      caption={t(
        'Study原创过程网络，箭头没有时间比例。A–E是一条可行路径；虚线显示火成岩可直接变质，其他岩石也可风化或熔融。图省略溶液沉淀／生物成岩等分支，热压变质保持固态；出现熔体的部分转入岩浆。',
        'Study original process network without a time scale. A–E form one possible path; the dashed shortcut shows igneous rock directly metamorphosing, while other rocks can weather or melt too. Solution/biological sedimentary branches are omitted. Metamorphism remains solid; a melted portion enters magma.',
      )}
    >
      <defs>
        <marker
          id="land-rock-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0L10 5L0 10Z" fill="#78918d" />
        </marker>
      </defs>
      {rockEdges.map((e) => {
        const from = rockStates.find((s) => s.id === e.from)!,
          to = rockStates.find((s) => s.id === e.to)!;
        const dx = to.x - from.x,
          dy = to.y - from.y,
          length = Math.hypot(dx, dy),
          edgeDistance =
            length / Math.max(Math.abs(dx) / 82, Math.abs(dy) / 28),
          a = {
            x: from.x + (dx / length) * (edgeDistance + 6),
            y: from.y + (dy / length) * (edgeDistance + 6),
          },
          b = {
            x: to.x - (dx / length) * (edgeDistance + 8),
            y: to.y - (dy / length) * (edgeDistance + 8),
          };
        return (
          <g key={e.id}>
            <path
              d={`M${a.x} ${a.y}L${b.x} ${b.y}`}
              fill="none"
              stroke="#78918d"
              strokeWidth="3"
              markerEnd="url(#land-rock-arrow)"
            />
            <circle
              cx={(a.x + b.x) / 2}
              cy={(a.y + b.y) / 2}
              r="15"
              fill="#fff"
            />
            <text
              x={(a.x + b.x) / 2}
              y={(a.y + b.y) / 2 + 6}
              textAnchor="middle"
              fontSize="19"
            >
              {e.id}
            </text>
          </g>
        );
      })}
      <path
        d="M445 125Q295 175 176 233"
        fill="none"
        stroke="#bc896a"
        strokeWidth="3"
        strokeDasharray="7 5"
        markerEnd="url(#land-rock-arrow)"
      />
      <text x="235" y="192" fontSize="16">
        {words(mode, '可直接变质', 'Can metamorphose directly')}
      </text>
      {rockStates.map((s) => (
        <g key={s.id}>
          <rect
            x={s.x - 82}
            y={s.y - 28}
            width="164"
            height="56"
            rx="10"
            fill={current === s.id ? '#315f69' : '#d8dfcb'}
            stroke="#78918d"
          />
          <text
            x={s.x}
            y={s.y + (mode === 'bilingual' ? -3 : 6)}
            textAnchor="middle"
            fill={current === s.id ? '#fff' : '#294f56'}
            fontSize="17"
          >
            {words(mode, s.zh, s.en)}
          </text>
          {mode === 'bilingual' && (
            <text
              x={s.x}
              y={s.y + 17}
              textAnchor="middle"
              fill={current === s.id ? '#fff' : '#294f56'}
              fontSize="13"
            >
              {s.en}
            </text>
          )}
        </g>
      ))}
      <text x="30" y="405" fontSize="17">
        {words(
          mode,
          reveal
            ? '冷却 ≠ 风化 ≠ 胶结 ≠ 固态变质 ≠ 熔融'
            : '把过程卡放到 A–E；再走一条捷径。',
          reveal
            ? 'Cooling ≠ weathering ≠ cementing ≠ solid change ≠ melting'
            : 'Place process cards on A–E; then try a shortcut.',
        )}
      </text>
    </Figure>
  );
}
export function SurfaceParticles({
  mode,
  frame,
}: {
  mode: LanguageMode;
  frame: number;
}) {
  const particles = particlePositions(frame);
  return (
    <Figure
      mode={mode}
      description={t(
        `帧${frame}，八个固体颗粒在岩块、原地碎片、水中搬运或沉积位置。`,
        `Frame ${frame}: eight solid particles in bedrock, loose in place, transported or deposited.`,
      )}
      caption={t(
        'Study原创：选取一次物理破碎→水搬运→沉积，八个符号始终保留；它们不是实测质量或速度。真实过程可同时发生，化学风化还可生成溶解物；本图未画溶液、风或冰的搬运。',
        'Study original: one selected sequence of physical breakup → water transport → deposition retains all eight symbols, without measured mass/speed. Real processes may overlap, and chemical weathering also produces dissolved material. Solutes, wind and ice are omitted.',
      )}
    >
      <text x="30" y="43" fontSize="21">
        {words(
          mode,
          ['岩块', '原地碎片', '水流搬运', '沉积下来'][frame]!,
          ['Bedrock', 'Loose in place', 'Water transport', 'Deposited'][frame]!,
        )}
      </text>
      <path d="M35 275H605V325H35Z" fill="#d8c4a0" />
      {frame === 0 && (
        <rect
          x="88"
          y="138"
          width="96"
          height="68"
          fill="#aa9374"
          stroke="#806b52"
        />
      )}
      {frame >= 2 && (
        <>
          <path d="M230 200H580V247H230Z" fill="#b6d8de" />
          <path
            d="M250 215H385m-14 -8 14 8 -14 8"
            stroke="#568391"
            strokeWidth="3"
            fill="none"
          />
        </>
      )}
      {particles.map((p, i) => (
        <rect
          key={i}
          x={p.x}
          y={p.y}
          width="16"
          height="16"
          rx="2"
          fill="#967c5b"
          stroke="#655c4a"
        />
      ))}
      <text x="40" y="362" fontSize="18">
        {words(
          mode,
          '比较：变碎？位置改变？停下累积？',
          'Compare: broken up? moved? settled and accumulated?',
        )}
      </text>
      <text x="40" y="397" fontSize="17">
        {words(
          mode,
          '图中颗粒数：8；搬走不等于消失。',
          'Drawn particles: 8. Removed does not mean vanished.',
        )}
      </text>
    </Figure>
  );
}
export function PadmaComparison({
  mode,
  value,
}: {
  mode: LanguageMode;
  value: number;
}) {
  const before = assets.find((a) => a.id === 'padma-1988')!,
    after = assets.find((a) => a.id === 'padma-2018')!;
  const description =
    value === 0
      ? t('同范围帕德玛河：只显示2018年。', 'Matched Padma extent: 2018 only.')
      : value === 100
        ? t(
            '同范围帕德玛河：只显示1988年。',
            'Matched Padma extent: 1988 only.',
          )
        : t(
            `帕德玛河同幅范围比较，左侧1988，右侧2018；分界在${value}%。`,
            `Same Padma extent, 1988 left and 2018 right; divider at ${value}%.`,
          );
  return (
    <figure className="geo-photo">
      <div
        className="geo-before-after"
        role="img"
        aria-label={
          mode === 'bilingual'
            ? `${description.zh} / ${description.en}`
            : words(mode, description.zh, description.en)
        }
      >
        <img src={after.path} alt="" />
        <img
          className="geo-before-overlay"
          src={before.path}
          alt=""
          style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}
        />
        <div className="geo-compare-line" style={{ left: `${value}%` }} />
        {value > 0 && <span className="geo-compare-year before">1988</span>}
        {value < 100 && <span className="geo-compare-year after">2018</span>}
      </div>
      <figcaption>
        <Text
          mode={mode}
          text={t(
            '同一NASA系列、相同720×480范围：1988-01-02（Landsat 5 TM）与2018-01-20（Landsat 8 OLI）。滑块只揭示旧图，不生成中间年份。观察Harirampur附近的河岸／河道位置，不能仅凭水域颜色或两张影像量出侵蚀速率、全部原因或居民损失。',
            'Same NASA series and 720×480 extent: 2 January 1988 (Landsat 5 TM) and 20 January 2018 (Landsat 8 OLI). The slider reveals the earlier image, without generating intervening years. Compare bank/channel positions near Harirampur; water colour and two images alone cannot measure erosion rate, all causes or household losses.',
          )}
        />
        <small>
          NASA Earth Observatory · USGS Landsat ·{' '}
          <a href={before.source_page_url} target="_blank" rel="noreferrer">
            {words(
              mode,
              '原始系列与图像处理说明',
              'Original series and image processing',
            )}
          </a>
        </small>
      </figcaption>
    </figure>
  );
}
export function RiverSetting({
  mode,
  setting,
}: {
  mode: LanguageMode;
  setting: string;
}) {
  const steep = setting === 'steep',
    braided = setting === 'gravel';
  return (
    <Figure
      mode={mode}
      description={t(
        steep
          ? '岩质陡谷剖面与下切箭头。'
          : braided
            ? '俯视较多砂砾的多条分叉重汇河道。'
            : '俯视宽谷中弯曲的单一河道。',
        steep
          ? 'Section of a steep bedrock valley with an incision arrow.'
          : braided
            ? 'Plan view of splitting/rejoining channels among abundant gravel.'
            : 'Plan view of a single sinuous channel in a wide valley.',
      )}
      caption={t(
        'Study原创条件示意：陡坡岩谷突出下切；宽谷单一河道可发展曲流；砂砾供应多、河岸易变时可能辫状。后两图是俯视，第一图是剖面，不是同一镜头。形态还受流量、粒径、岩性、植被与工程影响，模型不预测真实河流或流速。',
        'Study original conditions: steep bedrock valleys highlight incision; a single channel in a wide valley may meander; abundant gravel and changing banks can favour braiding. The latter two are plan views, the first a section. Discharge, grain size, geology, vegetation and engineering also matter; no real-river or velocity forecast is made.',
      )}
    >
      <text x="30" y="42" fontSize="21">
        {words(
          mode,
          steep
            ? '剖面 / 下切'
            : braided
              ? '俯视 / 分叉与重汇'
              : '俯视 / 弯曲河道',
          steep
            ? 'SECTION / incision'
            : braided
              ? 'PLAN / split & rejoin'
              : 'PLAN / bends',
        )}
      </text>
      {steep ? (
        <>
          <path
            d="M50 95L315 300L590 95V350H50Z"
            fill="#c7b28d"
            stroke="#806b52"
            strokeWidth="2"
          />
          <path
            d="M287 280Q315 304 343 280"
            stroke="#5b91a2"
            strokeWidth="10"
            fill="none"
          />
          <path
            d="M315 175V250m-10 -13 10 13 10 -13"
            stroke="#315f69"
            strokeWidth="4"
            fill="none"
          />
        </>
      ) : (
        <>
          <rect x="40" y="80" width="560" height="270" fill="#d8dfbf" rx="8" />
          {braided ? (
            <>
              <path
                d="M40 170Q200 330 355 145T600 230 M40 170Q190 85 315 270T600 230 M40 170Q240 210 350 205T600 230"
                stroke="#83b3bd"
                strokeWidth="22"
                fill="none"
              />
              {[140, 260, 410, 490].map((x, i) => (
                <ellipse
                  key={x}
                  cx={x}
                  cy={150 + (i % 2) * 95}
                  rx="24"
                  ry="12"
                  fill="#c7b28d"
                />
              ))}
            </>
          ) : (
            <path
              d="M40 210C155 50 195 350 295 210S445 70 510 210S560 290 600 210"
              stroke="#83b3bd"
              strokeWidth="28"
              fill="none"
            />
          )}
          <path
            d="M75 320H160m-13 -8 13 8 -13 8"
            stroke="#315f69"
            strokeWidth="3"
            fill="none"
          />
        </>
      )}
      <text x="40" y="395" fontSize="18">
        {words(
          mode,
          '形态提示条件，不等于给出“上中下游”唯一标签。',
          'Form suggests conditions, not a unique reach label.',
        )}
      </text>
    </Figure>
  );
}
