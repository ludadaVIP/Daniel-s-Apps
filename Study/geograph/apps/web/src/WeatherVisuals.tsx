import { useId, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t, words } from './content';
import { Text } from './ui';
import {
  weather,
  layers,
  energyBudget,
  windCase,
  cloudParcel,
} from './weatherModels';

export function WeatherFigure({
  mode,
  description,
  caption,
  children,
  viewBox = '0 0 900 570',
  interactive = false,
}: {
  mode: LanguageMode;
  description: LocalizedText;
  caption: LocalizedText;
  children: ReactNode;
  viewBox?: string;
  interactive?: boolean;
}) {
  return (
    <figure className="geo-skill-figure geo-weather-figure">
      <div
        className="geo-model-scroll"
        tabIndex={0}
        role="region"
        aria-label={words(
          mode,
          '可左右滚动的天气图示',
          'Weather diagram, scroll horizontally',
        )}
      >
        <svg
          viewBox={viewBox}
          role={interactive ? 'group' : 'img'}
          aria-label={
            mode === 'bilingual'
              ? `${description.zh} / ${description.en}`
              : words(mode, description.zh, description.en)
          }
        >
          {children}
        </svg>
      </div>
      <figcaption>
        <Text mode={mode} text={caption} />
      </figcaption>
    </figure>
  );
}
export function ClimateChart({
  mode,
  pointId,
}: {
  mode: LanguageMode;
  pointId: string;
}) {
  const p = weather.points.find((p) => p.id === pointId) ?? weather.points[0]!;
  const tx = (n: number) => 105 + n * 60,
    ty = (v: number) => 270 - (v + 5) * 6,
    ry = (v: number) => 500 - v * 25;
  return (
    <WeatherFigure
      mode={mode}
      viewBox="0 0 900 590"
      description={t(
        `${p.zh}，1991–2020月平均温度与月平均每日降水率，两张独立纵轴图`,
        `${p.en}, 1991–2020 monthly temperature and mean daily precipitation rate on separate plots`,
      )}
      caption={t(
        'NOAA PSL / NCEP–NCAR R1再分析估计；30年，每月有效年份30。温度为模型地表上2 m，雨为液态水当量。粗网格不是城市气象站，平均值不是每天都会发生的值。',
        'NOAA PSL / NCEP–NCAR R1 reanalysis estimates; 30 valid years/month. Temperature at 2 m above model surface; precipitation in liquid-water equivalent. Coarse cells are not city stations; means are not values expected every day.',
      )}
    >
      <text x="55" y="32" fontSize="24">
        {words(mode, p.zh, p.en)} · 1991–2020
      </text>
      <text x="55" y="62">
        {Math.abs(p.lat)}°{p.lat < 0 ? 'S' : 'N'}, {p.lon}°E ·{' '}
        {words(mode, '月平均', 'Monthly means')}
      </text>
      <text x="55" y="95">
        {words(mode, '温度', 'Temperature')} · °C
      </text>
      {[-5, 0, 5, 10, 15, 20].map((v) => (
        <g key={v}>
          <line x1="80" x2="800" y1={ty(v)} y2={ty(v)} stroke="#d3dfd9" />
          <text x="40" y={ty(v) + 6}>
            {v}
          </text>
        </g>
      ))}
      <polyline
        points={p.temperature.map((v, i) => `${tx(i)},${ty(v)}`).join(' ')}
        fill="none"
        stroke="#b96450"
        strokeWidth="4"
      />
      {p.temperature.map((v, i) => (
        <g key={i}>
          <circle cx={tx(i)} cy={ty(v)} r="5" fill="#b96450" />
          <text x={tx(i)} y={ty(v) - 13} textAnchor="middle" fontSize="16">
            {v}
          </text>
          <text x={tx(i)} y="304" textAnchor="middle">
            {i + 1}
          </text>
        </g>
      ))}
      <text x="55" y="350">
        {words(
          mode,
          '月平均每日降水率',
          'Monthly mean daily precipitation rate',
        )}{' '}
        · mm/day
      </text>
      {[0, 1, 2, 3, 4, 5].map((v) => (
        <g key={v}>
          <line x1="80" x2="800" y1={ry(v)} y2={ry(v)} stroke="#d3dfd9" />
          <text x="40" y={ry(v) + 6}>
            {v}
          </text>
        </g>
      ))}
      {p.rain.map((v, i) => (
        <g key={i}>
          <rect
            x={tx(i) - 16}
            y={ry(v)}
            width="32"
            height={v * 25}
            fill="#557f90"
          />
          <text x={tx(i)} y={ry(v) - 8} textAnchor="middle" fontSize="16">
            {v.toFixed(2)}
          </text>
          <text x={tx(i)} y="530" textAnchor="middle">
            {i + 1}
          </text>
        </g>
      ))}
      <text x="450" y="558" textAnchor="middle">
        {words(
          mode,
          '月份1–12；不是随年份变化的趋势图',
          'Months 1–12; not a year-by-year trend',
        )}
      </text>
      <text x="55" y="582" fontSize="17">
        {words(
          mode,
          '降水不是月总量，也没有表示雨天个数。',
          'Precipitation is not a monthly total or a count of rainy days.',
        )}
      </text>
    </WeatherFigure>
  );
}
export function AtmosphereLayers({
  mode,
  selected,
}: {
  mode: LanguageMode;
  selected: string;
}) {
  return (
    <WeatherFigure
      mode={mode}
      description={t(
        '大气五层从地面到外逸层，约略高度、现象与选中层',
        'Five atmospheric layers from ground to exosphere, approximate heights, phenomena and selected layer',
      )}
      caption={t(
        '教学剖面：高度轴不按比例。12 km只是选定示例，真实对流层顶约6–20 km；高层边界也会变化。大气越高通常越稀薄，图块大小不表示空气质量。',
        'Teaching section: height is not to scale. 12 km is one selected example; actual tropopause roughly 6–20 km. Higher boundaries also vary. Air generally thins upward; band size does not represent air mass.',
      )}
    >
      {layers.map((l, i) => {
        const y = 405 - i * 82;
        return (
          <g key={l.id}>
            <rect
              x="55"
              y={y}
              width="790"
              height="78"
              rx="9"
              fill={['#d5e6de', '#d5e5e9', '#bfcfdd', '#8a9eb5', '#51647e'][i]}
              stroke={selected === l.id ? '#b96450' : 'transparent'}
              strokeWidth="5"
            />
            <text
              x="75"
              y={y + 29}
              fill={i > 2 ? '#fff' : '#263c37'}
              fontSize="23"
            >
              {words(mode, l.zh, l.en)} · {l.range}
            </text>
            <text
              x="75"
              y={y + 58}
              fill={i > 2 ? '#fff' : '#263c37'}
              fontSize="18"
            >
              {words(mode, l.clueZh, l.clueEn)}
            </text>
          </g>
        );
      })}
      <path d="M55 488H845" stroke="#456553" strokeWidth="8" />
      <text x="55" y="527">
        {words(
          mode,
          '地表／海拔0 km；云主要在低层，月球不在大气中。',
          'Surface / 0 km; most clouds low; the Moon is outside the atmosphere.',
        )}
      </text>
    </WeatherFigure>
  );
}
export function RadiationModel({
  mode,
  absorbing,
}: {
  mode: LanguageMode;
  absorbing: boolean;
}) {
  const a = energyBudget(absorbing),
    id = useId();
  return (
    <WeatherFigure
      mode={mode}
      description={t(
        `辐射平衡示例：太阳输入7，地面发出${a.surfaceOut}，大气向下${a.down}，太空输出7`,
        `Radiative equilibrium example: solar input 7, surface emission ${a.surfaceOut}, downward atmosphere ${a.down}, space output 7`,
      )}
      caption={t(
        '自创稳态辐射思想模型，任意能量单位／同一时间间隔。太阳透过；吸收例为一层完全吸收地面红外、等量向上和向下发射。省略反射、对流、潜热与真实光谱；7/14不是地球实测通量或温度。',
        'Original steady radiative thought model, arbitrary energy units per equal interval. Solar-transparent; absorbing case has one layer absorbing all surface IR and emitting equally up/down. Reflection, convection, latent heat and real spectra omitted; 7/14 are not measured Earth fluxes or temperatures.',
      )}
    >
      <defs>
        <marker
          id={id}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0 0L8 4L0 8Z" fill="#b96450" />
        </marker>
      </defs>
      <text x="50" y="35" fontSize="24">
        {words(
          mode,
          '太阳光与地面红外，追踪能量',
          'Sunlight and surface infrared: trace energy',
        )}
      </text>
      <text x="590" y="78">
        {words(mode, '太空', 'Space')} · {a.spaceOut}
      </text>
      <rect
        x="50"
        y="220"
        width="795"
        height="60"
        rx="15"
        fill={absorbing ? '#bdd7dc' : '#f1eee3'}
      />
      <text x="80" y="257">
        {absorbing
          ? words(mode, '单层吸收并发射红外', 'One layer absorbs and emits IR')
          : words(
              mode,
              '对红外透明的假想空气',
              'Hypothetical IR-transparent air',
            )}
      </text>
      <rect x="50" y="452" width="795" height="60" rx="10" fill="#6c8c74" />
      <text x="70" y="490" fill="white">
        {words(mode, '地面', 'Surface')}
      </text>
      <path d="M160 85V440" stroke="#c6a44d" strokeWidth="8" />
      <text x="55" y="138">
        {words(mode, '太阳输入', 'Solar in')} {a.solar}
      </text>
      <text x="55" y="170">
        {words(mode, '短波为主', 'Mostly shortwave')}
      </text>
      <path
        d={`M440 440V${absorbing ? 290 : 85}`}
        stroke="#b96450"
        strokeWidth="7"
        markerEnd={`url(#${id})`}
      />
      <text x="245" y="387">
        {words(mode, '地面红外', 'Surface IR')} {a.surfaceOut}
      </text>
      {absorbing && (
        <>
          <path
            d="M650 215V95M700 290V440"
            stroke="#b96450"
            strokeWidth="6"
            markerEnd={`url(#${id})`}
          />
          <text x="680" y="164">
            7 ↑
          </text>
          <text x="735" y="370">
            7 ↓
          </text>
        </>
      )}
      <text x="55" y="550">
        {words(
          mode,
          `整体：入7 = 出7；地面：入7 + ${a.down} = 出${a.surfaceOut}`,
          `Whole: in 7 = out 7; surface: in 7 + ${a.down} = out ${a.surfaceOut}`,
        )}
      </text>
    </WeatherFigure>
  );
}
export function WindModel({
  mode,
  reverse,
  hemisphere,
  difference,
}: {
  mode: LanguageMode;
  reverse: boolean;
  hemisphere: string;
  difference: number;
}) {
  const a = windCase(reverse, hemisphere, difference),
    id = useId(),
    start = reverse ? 700 : 200,
    end = reverse ? 200 : 700,
    bend = 100 * a.deflection;
  return (
    <WeatherFigure
      mode={mode}
      description={t(
        `左右气压${a.left}/${a.right} hPa；压力差${a.delta}；${hemisphere}模式`,
        `Left/right pressures ${a.left}/${a.right} hPa; difference ${a.delta}; ${hemisphere} mode`,
      )}
      caption={t(
        '虚构同距离气压场；hPa为百帕。蓝线是2 hPa间隔等压线，红色直箭头仅表示气压梯度力；曲线展示相对运动方向的偏转规则，不解真实风轨迹。初始静止，省略其他驱动、摩擦与完整力平衡；不输出m/s。',
        'Invented pressure field at fixed distance; hPa = hectopascals. Blue isobars spaced by 2 hPa. Red straight arrow shows pressure-gradient force; curve illustrates deflection relative to motion, not a solved wind trajectory. Starts at rest; other drivers, friction and full force balance omitted; no m/s output.',
      )}
    >
      <defs>
        <marker
          id={id}
          markerWidth="8"
          markerHeight="8"
          refX="7"
          refY="4"
          orient="auto"
        >
          <path d="M0 0L8 4L0 8Z" fill="#b96450" />
        </marker>
        <marker
          id={`${id}-motion`}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0 0L6 3L0 6Z" fill="#557e89" />
        </marker>
      </defs>
      <text x="55" y="38" fontSize="24">
        {words(
          mode,
          '同距离，先比较压力差',
          'Fixed distance: compare pressure difference',
        )}
      </text>
      {Array.from({ length: a.delta === 0 ? 0 : a.delta / 2 + 1 }, (_, i) => {
        const x = 200 + (i * 500) / Math.max(1, a.delta / 2);
        return (
          <g key={i}>
            <line
              x1={x}
              x2={x}
              y1="105"
              y2="345"
              stroke="#afc7cd"
              strokeWidth="2"
            />
            <text x={x} y="90" textAnchor="middle">
              {a.left + ((a.right - a.left) * i) / Math.max(1, a.delta / 2)}
            </text>
          </g>
        );
      })}
      <text x="70" y="200" fontSize="30">
        {a.left} hPa
      </text>
      <text x="725" y="200" fontSize="30">
        {a.right} hPa
      </text>
      <path
        d="M850 135V80L843 94M850 80L857 94"
        stroke="#425f55"
        strokeWidth="3"
        fill="none"
      />
      <text x="840" y="69">
        N
      </text>
      {a.moving ? (
        <>
          <path
            d={`M${start} 210Q450 210 ${end} ${210 + bend}`}
            stroke="#557e89"
            strokeWidth="8"
            fill="none"
            markerEnd={`url(#${id}-motion)`}
          />
          <path
            d={`M${start} 395H${end}`}
            stroke="#b96450"
            strokeWidth="5"
            markerEnd={`url(#${id})`}
          />
        </>
      ) : (
        <text x="280" y="228">
          {words(
            mode,
            '本模型中没有气压梯度加速',
            'No pressure-gradient acceleration here',
          )}
        </text>
      )}
      <text x="55" y="445">
        {words(
          mode,
          '红箭头：高压 → 低压的力；蓝线：运动偏转规则',
          'Red: force high → low; blue: motion-deflection rule',
        )}
      </text>
      <text x="55" y="492">
        {hemisphere === 'north'
          ? words(
              mode,
              '北半球：沿运动方向看，偏右',
              'Northern Hemisphere: right relative to motion',
            )
          : hemisphere === 'south'
            ? words(
                mode,
                '南半球：沿运动方向看，偏左',
                'Southern Hemisphere: left relative to motion',
              )
            : words(
                mode,
                '仅气压梯度力示例；先忽略自转',
                'Pressure-gradient force alone; rotation omitted',
              )}
      </text>
      <text x="55" y="535">
        {words(
          mode,
          '真实大尺度风还受自转、摩擦等影响，常不会笔直吹向低压中心。',
          'Real large-scale winds also depend on rotation/friction, often not straight into a low.',
        )}
      </text>
    </WeatherFigure>
  );
}
export function CloudModel({
  mode,
  wet,
  height,
  grow,
}: {
  mode: LanguageMode;
  wet: boolean;
  height: number;
  grow: boolean;
}) {
  const a = cloudParcel(wet, height, grow),
    py = 460 - a.height * 180,
    by = 460 - a.base * 180;
  return (
    <WeatherFigure
      mode={mode}
      description={t(
        `气块上升${a.height.toFixed(2)} km，温度${a.temperature.toFixed(1)}°C，估计云底${a.base.toFixed(2)} km；${a.cloud ? '有云' : '未成云'}，${a.rain ? '大滴降水示意' : '无降水示意'}`,
        `Parcel at ${a.height.toFixed(2)} km, ${a.temperature.toFixed(1)}°C; estimated cloud base ${a.base.toFixed(2)} km; ${a.cloud ? 'cloud' : 'no cloud'}, ${a.rain ? 'grown-drop precipitation' : 'no precipitation shown'}`,
      )}
      caption={t(
        '虚构气块：地面20°C，露点16°C或6°C；强制抬升，干绝热冷却9.8°C/km、露点约降2°C/km。估计云底后采用6°C/km示例，真实湿绝热率会变化。假设有凝结核；省略混合、稳定度、冰晶与真实降水增长时间。',
        'Invented parcel: surface 20°C, dew point 16°C or 6°C; imposed lift. Dry cooling 9.8°C/km, dew point falls about 2°C/km. After estimated cloud base, a chosen 6°C/km is used; actual moist lapse varies. Nuclei assumed; mixing, stability, ice and growth times omitted.',
      )}
    >
      <text x="55" y="35" fontSize="24">
        {words(
          mode,
          '抬升 → 膨胀冷却 → 凝结；成云 ≠ 必定下雨',
          'Lift → expansion/cooling → condensation; cloud ≠ certain rain',
        )}
      </text>
      {[0, 0.5, 1, 1.5, 2].map((z) => (
        <g key={z}>
          <line
            x1="130"
            x2="580"
            y1={460 - z * 180}
            y2={460 - z * 180}
            stroke="#d8e2dc"
          />
          <text x="55" y={466 - z * 180}>
            {z} km
          </text>
        </g>
      ))}
      <line
        x1="130"
        x2="580"
        y1={by}
        y2={by}
        stroke="#b96450"
        strokeDasharray="8 5"
      />
      <text x="600" y={by + 5}>
        {words(mode, '估计云底', 'Estimated base')} {a.base.toFixed(2)} km
      </text>
      <path
        d="M315 445V85L308 99M315 85L322 99"
        fill="none"
        stroke="#87aca7"
        strokeWidth="4"
      />
      <ellipse
        cx="360"
        cy={py}
        rx={65 + a.height * 24}
        ry={30 + a.height * 12}
        fill={a.cloud ? '#c9dfe3' : '#f5e7c5'}
        stroke="#587e83"
        strokeWidth="3"
      />
      {a.cloud &&
        [0, 1, 2, 3, 4].map((i) => (
          <circle
            key={i}
            cx={320 + i * 20}
            cy={py}
            r={grow ? 7 : 3}
            fill="#557f90"
          />
        ))}
      {a.rain &&
        [0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M${340 + i * 25} ${py + 40}v50`}
            stroke="#557f90"
            strokeWidth="3"
          />
        ))}
      <text x="600" y="92">
        T = {a.temperature.toFixed(1)}°C
      </text>
      <text x="600" y="123">
        {words(mode, '地面露点', 'Surface dew point')}: {a.dewpoint}°C
      </text>
      <text x="55" y="512">
        {a.cloud
          ? words(
              mode,
              '液滴／冰晶散射光，水汽气体本身看不见。',
              'Droplets/ice scatter light; vapour gas itself is invisible.',
            )
          : words(
              mode,
              '尚未到云底；较干气块需抬升更高。',
              'Below cloud base; a drier parcel needs greater lift.',
            )}
      </text>
      <text x="55" y="552">
        {a.rain
          ? words(
              mode,
              '降水条件示意：粒子增长；不保证一定到达地面。',
              'Precipitation-condition sketch: particle growth; may not reach ground.',
            )
          : words(
              mode,
              '小云滴可悬浮；要形成雨还需要增长等条件。',
              'Tiny cloud droplets can remain aloft; rain needs growth and other conditions.',
            )}
      </text>
    </WeatherFigure>
  );
}
