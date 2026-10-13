import { useId, useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { microscopeView, particlePosition, type Objective } from './models';
import { useFrames, Playback } from './LabPlayback';
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
const word = (mode: LanguageMode, zh: string, en: string) =>
  mode === 'en' ? en : zh;
function Cells({
  count = 10,
  size = 34,
  offsetX = 40,
  offsetY = 55,
}: {
  count?: number;
  size?: number;
  offsetX?: number;
  offsetY?: number;
}) {
  return (
    <>
      {Array.from({ length: count * 4 }, (_, i) => {
        const x = offsetX + (i % count) * size,
          y = offsetY + Math.floor(i / count) * size;
        return (
          <g key={i}>
            <rect
              x={x + 1}
              y={y + 1}
              width={size - 2}
              height={size - 2}
              rx={Math.min(6, size / 6)}
              fill="#e1ecd4"
              stroke="#829f72"
              strokeWidth="1"
            />
            <circle
              cx={x + size * 0.7}
              cy={y + size * 0.35}
              r={Math.max(1, size * 0.09)}
              fill="#a786b4"
            />
          </g>
        );
      })}
    </>
  );
}
function Cell({
  bacteria = false,
  part = 0,
}: {
  bacteria?: boolean;
  part?: number;
}) {
  return (
    <>
      <rect
        x="100"
        y="52"
        width="222"
        height="175"
        rx={bacteria ? 80 : 15}
        fill="#e2ead4"
        stroke={part === 3 ? '#456440' : '#9caf82'}
        strokeWidth={part === 3 ? 7 : 4}
      />
      <rect
        x="111"
        y="63"
        width="200"
        height="153"
        rx={bacteria ? 72 : 10}
        fill={part === 1 ? '#cbdcaa' : '#e4edd7'}
        stroke={part === 0 ? '#476d52' : '#8da678'}
        strokeWidth={part === 0 ? 4 : 2}
      />
      {!bacteria && (
        <>
          <rect
            x="160"
            y="90"
            width="130"
            height="109"
            rx="25"
            fill="#f5f8ed"
            stroke="#c1d1ab"
            strokeWidth="2"
          />
          <ellipse
            cx="140"
            cy="134"
            rx="18"
            ry="25"
            fill={part === 2 ? '#8f699f' : '#bda6c8'}
            stroke="#8e719e"
            strokeWidth="2"
          />
          <path
            d="m130 127 10-5 9 14-9 9"
            stroke="#f4e9f6"
            fill="none"
            strokeWidth="2"
          />
        </>
      )}
      {bacteria && (
        <path
          d="M160 107q45-34 46 25t55-4q-10 60-46 21t-55 27"
          fill="none"
          stroke={part === 2 ? '#805393' : '#af89ba'}
          strokeWidth={part === 2 ? 7 : 4}
        />
      )}
      {[145, 205, 264].map((x, i) => (
        <circle
          key={x}
          cx={x}
          cy={bacteria ? 89 + i * 43 : 190 + (i % 2) * 9}
          r="4"
          fill="#91ad77"
        />
      ))}
    </>
  );
}
function Yeast({
  cx = 200,
  cy = 143,
  scale = 1,
  bud = false,
}: {
  cx?: number;
  cy?: number;
  scale?: number;
  bud?: boolean;
}) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <ellipse
        rx="36"
        ry="48"
        fill="#ecdcc0"
        stroke="#b4966a"
        strokeWidth="3"
      />
      <ellipse cx="7" cy="-5" rx="12" ry="17" fill="#baa2c8" />
      <ellipse cx="-12" cy="15" rx="10" ry="14" fill="#f6ecda" />
      {bud && (
        <>
          <ellipse
            cx="35"
            cy="-36"
            rx="18"
            ry="23"
            fill="#ecdcc0"
            stroke="#b4966a"
            strokeWidth="2"
          />
          <circle cx="38" cy="-39" r="6" fill="#baa2c8" />
        </>
      )}
    </g>
  );
}
export function MicroDiagram({ id, mode }: { id: string; mode: LanguageMode }) {
  const [part, setPart] = useState(0);
  const labels =
    id === 'L005'
      ? [
          t(
            '个体：不同器官协作，维持整株植物。',
            'Organism: organs cooperate to maintain the plant.',
          ),
          t(
            '器官：叶片包含不同的组织。',
            'Organ: a leaf contains different tissues.',
          ),
          t(
            '组织：相关细胞和物质一起承担功能。',
            'Tissue: cells and associated material contribute to related functions.',
          ),
          t(
            '细胞：基本结构与功能单位，不是缩小的整株植物。',
            'Cell: a basic unit of structure and function, not a tiny complete plant.',
          ),
        ]
      : id === 'L006'
        ? [
            t(
              '两组透镜：总倍数为目镜×物镜。',
              'Two lens groups: total power is eyepiece × objective.',
            ),
            t(
              '分辨率：两个相近小点是否能区分开。',
              'Resolution: can two close dots be distinguished?',
            ),
            t(
              '对焦：让目标平面清晰，不是制造新细节。',
              'Focus: make the target plane sharp; it does not create detail.',
            ),
          ]
        : id === 'L007'
          ? [
              t(
                '细胞膜：位于壁内侧，帮助调节进出。',
                'Membrane: inside the wall, helps regulate exchange.',
              ),
              t(
                '细胞质：细胞内部进行活动的物质与结构。',
                'Cytoplasm: internal substances and structures involved in activity.',
              ),
              t(
                '细胞核：此洋葱细胞模型中包围大部分DNA。',
                'Nucleus: encloses most DNA in this onion-cell model.',
              ),
              t(
                '细胞壁：膜外的支持结构，不等于膜。',
                'Wall: a supporting layer outside the membrane, distinct from it.',
              ),
            ]
          : [
              t(
                '一个酵母细胞可以是一个完整的单细胞个体。',
                'One yeast cell can be a complete unicellular organism.',
              ),
              t(
                '洋葱表皮的多格细胞，属于植物的一部分组织。',
                'Onion epidermal cells form tissue within a plant.',
              ),
              t(
                '判断一个个体是否多细胞，要联系组成和生命活动；只数图中格子不够。',
                'To identify a multicellular organism, consider organisation and functions, not just cells in a picture.',
              ),
            ];
  return (
    <figure className="bio-diagram">
      <span className="bio-eyebrow">
        <Text mode={mode} text={t('看图找线索', 'LOOK FOR CLUES')} />
      </span>
      <svg
        viewBox="0 0 420 270"
        role="img"
        aria-label={word(
          mode,
          id === 'L005'
            ? '植物、叶片、组织和细胞组成层次'
            : id === 'L006'
              ? '显微镜透镜、相近小点和对焦示意'
              : id === 'L007'
                ? '洋葱细胞剖面：壁、膜、质、核'
                : '左为一个酵母个体，右为洋葱表皮组织',
          id === 'L005'
            ? 'Plant, leaf, tissue and cell organisation'
            : id === 'L006'
              ? 'Lens groups, nearby dots and focus'
              : id === 'L007'
                ? 'Onion cell schematic: wall, membrane, cytoplasm and nucleus'
                : 'Left: yeast organism; right: onion epidermal tissue',
        )}
      >
        {id === 'L005' ? (
          <>
            <path
              d="M53 210V91m0 52q-62-54-31-62t31 62q54-54 64-39t-64 39m0 67-17 18m17-18 16 18"
              fill="#9abd78"
              stroke="#577851"
              strokeWidth="3"
            />
            <path
              d="M142 171q-22-90 66-97q12 95-66 97Z"
              fill="#b3cf8f"
              stroke="#789c64"
              strokeWidth="2"
            />
            <path d="m142 171 51-79" stroke="#759866" fill="none" />
            <g transform="translate(207 31) scale(.45)">
              <Cells count={5} size={44} />
            </g>
            <ellipse
              cx="345"
              cy="163"
              rx="41"
              ry="35"
              fill="#e2ecd8"
              stroke="#7d9f69"
              strokeWidth="3"
            />
            <circle cx="352" cy="159" r="12" fill="#b5a0c4" />
            {[99, 228, 281].map((x, i) => (
              <path
                key={x}
                d={`M${x} ${i === 1 ? 160 : 142}h18m-5-5 5 5-5 5`}
                stroke="#b5c3a0"
                fill="none"
                strokeWidth="2"
              />
            ))}
          </>
        ) : id === 'L006' ? (
          <>
            <ellipse
              cx="85"
              cy="63"
              rx="46"
              ry="10"
              fill="#d9e8df"
              stroke="#779a89"
              strokeWidth="3"
            />
            <path d="M56 73v88m57-88v88" stroke="#aec2b4" strokeWidth="4" />
            <ellipse
              cx="85"
              cy="172"
              rx="31"
              ry="11"
              fill="#d9e8df"
              stroke="#779a89"
              strokeWidth="3"
            />
            <rect x="44" y="211" width="88" height="8" rx="3" fill="#b1c4a1" />
            <text x="147" y="65" fill="#72876a" fontSize="16">
              10×
            </text>
            <text x="132" y="180" fill="#72876a" fontSize="16">
              40×
            </text>
            <text x="225" y="226" fill="#59754e" fontSize="20">
              10 × 40 = 400
            </text>
            <circle cx="280" cy="75" r="14" fill="#ac8dbc" />
            <circle cx="319" cy="75" r="14" fill="#ac8dbc" />
            <ellipse cx="300" cy="146" rx="38" ry="19" fill="#c7b2d1" />
            <path
              d="M258 177h83"
              stroke="#ddcba4"
              strokeWidth="2"
              strokeDasharray="4 5"
            />
          </>
        ) : id === 'L007' ? (
          <Cell part={part} />
        ) : (
          <>
            <Yeast cx={105} cy={135} scale={1.1} />
            <g transform="translate(189 40) scale(.75)">
              <Cells count={4} size={50} />
            </g>
            <text x="60" y="233" fill="#8b795b" fontSize="13">
              {word(mode, '一个个体', 'One organism')}
            </text>
            <text x="249" y="233" fill="#688460" fontSize="13">
              {word(mode, '组织的一部分', 'Part of a tissue')}
            </text>
          </>
        )}
      </svg>
      <div className="bio-hotspots">
        {labels.map((label, i) => (
          <button
            key={label.en}
            aria-pressed={part === i}
            aria-label={word(
              mode,
              `查看线索${i + 1}：${label.zh}`,
              `Inspect clue ${i + 1}: ${label.en}`,
            )}
            aria-controls={`${id}-caption`}
            onClick={() => setPart(i)}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <figcaption id={`${id}-caption`} aria-live="polite">
        <Text mode={mode} text={labels[part]!} />
      </figcaption>
      <small>
        <Text
          mode={mode}
          text={t(
            '原创教学图 · 非按比例绘制；色彩用于标注',
            'Original schematic · Not to scale; colours are explanatory',
          )}
        />
      </small>
    </figure>
  );
}
export function MicroHookArt({ id, mode }: { id: string; mode: LanguageMode }) {
  return (
    <svg
      viewBox="0 0 420 270"
      role="img"
      aria-label={word(
        mode,
        '微观世界教学示意，非按比例',
        'Microscopic-world schematic, not to scale',
      )}
    >
      {id === 'L007' ? (
        <Cell />
      ) : id === 'L008' ? (
        <>
          <Yeast cx={107} cy={137} />
          <g transform="translate(195 45) scale(.7)">
            <Cells count={4} size={49} />
          </g>
        </>
      ) : id === 'L006' ? (
        <>
          <circle
            cx="210"
            cy="123"
            r="68"
            fill="#e4edda"
            stroke="#6f9365"
            strokeWidth="8"
          />
          <path
            d="m256 176 41 49"
            stroke="#6f9365"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <g transform="translate(156 82) scale(.55)">
            <Cells count={4} size={43} />
          </g>
        </>
      ) : (
        <>
          <path
            d="M94 219Q79 91 316 44Q302 221 94 219Z"
            fill="#b6cf8f"
            stroke="#749361"
            strokeWidth="3"
          />
          <path d="m94 219 204-155" stroke="#749361" strokeWidth="2" />
          <circle
            cx="245"
            cy="136"
            r="37"
            fill="#edf3e1"
            stroke="#8fa879"
            strokeWidth="2"
          />
          <g transform="translate(204 93) scale(.4)">
            <Cells count={4} size={43} />
          </g>
        </>
      )}
    </svg>
  );
}
export function MicroExplore(props: Props) {
  return (
    <div className="bio-lab">
      <div className="bio-lab-top">
        <span className="bio-eyebrow">
          <Text mode={props.mode} text={t('你的微型实验室', 'YOUR MINI LAB')} />
        </span>
        <span className="bio-model-tag">
          <Text mode={props.mode} text={t('教学模型', 'MODEL')} />
        </span>
      </div>
      {props.id === 'L005' ? (
        <ScaleLab {...props} />
      ) : props.id === 'L006' ? (
        <MicroscopeLab {...props} />
      ) : props.id === 'L007' ? (
        <CellLab {...props} />
      ) : (
        <CommunityLab {...props} />
      )}
    </div>
  );
}
function ScaleLab({ mode, onExplore }: Props) {
  const flow = useFrames(2, onExplore);
  const names = [t('叶片', 'Leaf'), t('组织', 'Tissue'), t('细胞', 'Cell')];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '同一片叶子，换三个观察尺度。',
            'One leaf, three observation scales.',
          )}
        />
      </h3>
      <div className="bio-choice-row bio-micro-choice">
        {names.map((name, i) => (
          <button
            key={name.en}
            aria-pressed={flow.frame === i}
            onClick={() => flow.choose(i)}
          >
            <Text mode={mode} text={name} />
          </button>
        ))}
      </div>
      <div className="bio-micro-window">
        <svg
          viewBox="0 0 400 270"
          role="img"
          aria-label={word(
            mode,
            `当前模型视野：${names[flow.frame]!.zh}`,
            `Current model view: ${names[flow.frame]!.en}`,
          )}
        >
          {flow.frame === 0 ? (
            <>
              <path
                d="M89 218q-3-131 229-181q-6 190-229 181Z"
                fill="#bed795"
                stroke="#789b61"
                strokeWidth="3"
              />
              <path
                d="m89 218 210-160m-74 101-80-29m124-31-3 51"
                stroke="#7f9e67"
                fill="none"
                strokeWidth="2"
              />
              <rect
                x="215"
                y="107"
                width="40"
                height="40"
                stroke="#a08853"
                strokeDasharray="4 4"
                strokeWidth="2"
                fill="#ffffff44"
              />
            </>
          ) : flow.frame === 1 ? (
            <>
              <Cells count={10} size={36} offsetX={20} offsetY={55} />
              <path
                d="M20 235h144m-144-5v10m144-10v10"
                stroke="#6d8257"
                strokeWidth="3"
              />
              <text x="178" y="240" fontSize="13" fill="#6d8257">
                200 µm
              </text>
            </>
          ) : (
            <>
              <g transform="translate(0 -20)">
                <Cell />
              </g>
              <path
                d="M100 235h222m-222-5v10m222-10v10"
                stroke="#6d8257"
                strokeWidth="3"
              />
              <text x="159" y="259" fontSize="13" fill="#6d8257">
                50 µm
              </text>
            </>
          )}
        </svg>
      </div>
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text
          mode={mode}
          text={
            [
              t(
                '这是长约5cm的假想叶片示意。小框是下一步查看的区域；叶片没有变成细胞。',
                'A schematic of an assumed 5cm leaf. The box marks a region to inspect; the leaf does not turn into a cell.',
              ),
              t(
                '模型组织区域宽500µm，10格每格宽50µm。比例尺的一段表示200µm。',
                'The model tissue region is 500µm wide, with ten 50µm cells across. The bar represents 200µm.',
              ),
              t(
                '单个模型细胞宽50µm=0.05mm。细胞壁宽度对应50µm比例尺，不能用屏幕厘米当作真实大小。',
                'This model cell is 50µm=0.05mm wide. Its wall-to-wall width matches the 50µm bar; screen centimetres are not real specimen size.',
              ),
            ][flow.frame]!
          }
        />
      </p>
      <details className="bio-static">
        <summary>
          <Text
            mode={mode}
            text={t('文字版与尺度说明', 'Text version & scale notes')}
          />
        </summary>
        <p>
          <Text
            mode={mode}
            text={t(
              '个体→器官→组织→细胞，是组成层次。叶片为非按比例示意；组织与细胞面板的比例尺仅适用于各自模型，不能跨面板直接量屏幕。模型格子50µm宽，组织区域500µm；真实细胞大小、形状和排列各不相同。',
              'Organism → organ → tissue → cell describes organisation. The leaf is schematic. Tissue and cell bars apply only within their own model panels; do not compare screen measurements across panels. Model cells are 50µm wide in a 500µm tissue region; real sizes, shapes and arrangements vary.',
            )}
          />
        </p>
      </details>
    </>
  );
}
function MicroscopeLab({ mode, onExplore }: Props) {
  const [objective, setObjective] = useState<Objective>(4),
    [focus, setFocus] = useState(20),
    [resolved, setResolved] = useState(true),
    [zoom, setZoom] = useState(false);
  const view = microscopeView(objective),
    clip = useId(),
    blur = useId();
  const size = (240 / view.fieldMicrometres) * 50;
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '先低倍定位，再试着看清。',
            'Locate at low power, then improve the view.',
          )}
        />
      </h3>
      <p className="bio-caption">
        <Text
          mode={mode}
          text={t(
            `目镜10× · 总倍数${view.magnification}× · 假设视野直径${view.fieldMm}mm`,
            `10× eyepiece · Total ${view.magnification}× · Assumed field diameter ${view.fieldMm}mm`,
          )}
        />
      </p>
      <div className="bio-choice-row">
        {([4, 10, 40] as const).map((n) => (
          <button
            key={n}
            aria-pressed={objective === n}
            onClick={() => {
              setObjective(n);
              onExplore();
            }}
          >
            {n}× <Text mode={mode} text={t('物镜', 'objective')} />
          </button>
        ))}
      </div>
      <label className="bio-range bio-micro-range">
        <Text mode={mode} text={t('对焦', 'Focus')} />
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={focus}
          aria-label={word(mode, '模型对焦', 'Model focus')}
          onChange={(e) => {
            setFocus(Number(e.target.value));
            onExplore();
          }}
        />
        <strong>
          {Math.abs(focus - 50) <= 5
            ? word(mode, '清晰', 'Sharp')
            : word(mode, '模糊', 'Blurred')}
        </strong>
      </label>
      <div className="bio-micro-window">
        <svg
          viewBox="0 0 400 290"
          role="img"
          aria-label={word(
            mode,
            '模型显微镜视野与比例尺',
            'Model microscope field and scale bar',
          )}
        >
          <defs>
            <clipPath id={clip}>
              <circle cx="200" cy="132" r="120" />
            </clipPath>
            <filter id={blur} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation={Math.abs(focus - 50) / 12} />
            </filter>
          </defs>
          <circle
            cx="200"
            cy="132"
            r="120"
            fill="#f8f9f1"
            stroke="#bacbb0"
            strokeWidth="3"
          />
          <g clipPath={`url(#${clip})`}>
            <g filter={`url(#${blur})`}>
              <Cells
                count={12}
                size={size}
                offsetX={200 - 6 * size}
                offsetY={132 - 2 * size}
              />
            </g>
            <path
              d={`M120 217h${(240 / view.fieldMicrometres) * 100}`}
              stroke="#5a7955"
              strokeWidth="3"
            />
            <text x="120" y="234" fontSize="11" fill="#5a7955">
              100 µm
            </text>
          </g>
        </svg>
      </div>
      <details className="bio-resolution" open>
        <summary>
          <Text
            mode={mode}
            text={t(
              '再试一次：放大与分辨率',
              'Try another comparison: size and resolution',
            )}
          />
        </summary>
        <div className="bio-choice-row">
          {[true, false].map((value) => (
            <button
              key={String(value)}
              aria-pressed={resolved === value}
              onClick={() => {
                setResolved(value);
                onExplore();
              }}
            >
              <Text
                mode={mode}
                text={
                  value
                    ? t('原图是两个点', 'Original: two dots')
                    : t('原图细节已合并', 'Original detail merged')
                }
              />
            </button>
          ))}
        </div>
        <div className="bio-dots-demo">
          <svg
            viewBox="0 0 300 90"
            role="img"
            aria-label={word(
              mode,
              resolved ? '两个相近点可区分' : '原始图像的细节合并',
              resolved
                ? 'Two nearby dots remain distinct'
                : 'Detail is merged in the original image',
            )}
          >
            <g transform={`translate(150 45) scale(${zoom ? 2 : 1})`}>
              {resolved ? (
                <>
                  <circle cx="-14" r="9" fill="#9b7aac" />
                  <circle cx="14" r="9" fill="#9b7aac" />
                </>
              ) : (
                <ellipse rx="32" ry="13" fill="#b6a0c0" />
              )}
            </g>
          </svg>
          <button
            aria-pressed={zoom}
            onClick={() => {
              setZoom(!zoom);
              onExplore();
            }}
          >
            <Text
              mode={mode}
              text={
                zoom
                  ? t('还原图片', 'Reset image size')
                  : t('只把图片放大2倍', 'Resize image only: 2×')
              }
            />
          </button>
        </div>
        <p className="bio-caption">
          <Text
            mode={mode}
            text={
              resolved
                ? t(
                    '原来分开的点，放大后仍是两个点。',
                    'Previously separate dots remain two dots when resized.',
                  )
                : t(
                    '原图缺少分开的细节，单纯放大只是得到更大的合并图形。',
                    'If the original lacks separated detail, resizing produces a larger merged shape.',
                  )
            }
          />
        </p>
      </details>
      <details className="bio-static">
        <summary>
          <Text
            mode={mode}
            text={t('文字版与模型说明', 'Text version & model notes')}
          />
        </summary>
        <p>
          <Text
            mode={mode}
            text={t(
              '4×/10×/40×物镜×10×目镜=40×/100×/400×。视野直径2/0.8/0.2mm是模型假设；比例尺代表标本100µm。滑块中点人为设为最佳焦平面。小点比较用几何图形示范分辨率，不模拟真实衍射或显微镜规格。可以按方向键操作滑块；没有自动播放。',
              '4×/10×/40× objectives with a 10× eyepiece give 40×/100×/400×. Field diameters of 2/0.8/0.2mm are model assumptions; the scale bar represents 100µm of specimen. The slider midpoint is the preset best focal plane. Dot shapes illustrate resolution, not real diffraction or instrument specifications. Use arrow keys for the slider; there is no automatic playback.',
            )}
          />
        </p>
      </details>
    </>
  );
}
function CellLab({ mode, onExplore }: Props) {
  const [bacteria, setBacteria] = useState(false),
    [permeable, setPermeable] = useState(true);
  const flow = useFrames(3, onExplore);
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '壁与膜之间，一颗粒子的旅程。',
            'A particle’s journey through wall and membrane.',
          )}
        />
      </h3>
      <div className="bio-choice-row bio-micro-choice">
        {[false, true].map((b) => (
          <button
            key={String(b)}
            aria-pressed={bacteria === b}
            onClick={() => {
              setBacteria(b);
              flow.reset();
              onExplore();
            }}
          >
            <Text
              mode={mode}
              text={
                b
                  ? t('细菌细胞', 'Bacterial cell')
                  : t('洋葱细胞', 'Onion cell')
              }
            />
          </button>
        ))}
      </div>
      <div className="bio-choice-row">
        {[true, false].map((p) => (
          <button
            key={String(p)}
            aria-pressed={permeable === p}
            onClick={() => {
              setPermeable(p);
              flow.reset();
              onExplore();
            }}
          >
            <Text
              mode={mode}
              text={
                p
                  ? t(
                      'A：条件下可通过膜',
                      'A: can cross under these conditions',
                    )
                  : t(
                      'B：条件下不能通过膜',
                      'B: cannot cross under these conditions',
                    )
              }
            />
          </button>
        ))}
      </div>
      <div className="bio-micro-window">
        <svg
          viewBox="0 0 420 270"
          role="img"
          aria-label={word(
            mode,
            '假设颗粒与模型细胞边界',
            'Hypothetical particle and model cell boundaries',
          )}
        >
          <Cell bacteria={bacteria} part={flow.frame === 1 ? 3 : 0} />
          <circle
            cx={particlePosition(flow.frame, permeable)}
            cy="160"
            r="8"
            fill={permeable ? '#6dacc6' : '#cc9f58'}
            stroke="#fffef6"
            strokeWidth="2"
          />
          {!permeable && flow.frame === 3 && (
            <path
              d="m114 147 12 12m0-12-12 12"
              stroke="#b7894d"
              strokeWidth="2"
            />
          )}
        </svg>
      </div>
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text
          mode={mode}
          text={
            flow.frame === 3
              ? permeable
                ? t(
                    'A进入内部。模型示范交换，不表示所有真实分子走同一路径。',
                    'A reaches the inside. The model illustrates exchange, not a universal path for real molecules.',
                  )
                : t(
                    'B停在膜边界。一个例子不能说明细胞对所有物质都封闭。',
                    'B stops at the membrane. One example does not mean the cell blocks every substance.',
                  )
              : [
                  t('先观察外部与内部。', 'Begin with outside and inside.'),
                  t(
                    '壁是外部的支持层，不等于膜。',
                    'The wall is a support layer, distinct from the membrane.',
                  ),
                  t(
                    '到达细胞膜：进出需要符合条件。',
                    'At the membrane: exchange requires appropriate conditions.',
                  ),
                ][flow.frame]!
          }
        />
      </p>
      <p className="bio-caption">
        <Text
          mode={mode}
          text={
            bacteria
              ? t(
                  '图中曲线代表DNA，未被细胞核包围。这里选取有壁的细菌模型，不代表所有细菌。',
                  'The DNA line has no enclosing nucleus. This model bacterium has a wall; it does not represent every bacterium.',
                )
              : t(
                  '洋葱模型有壁、膜和核，省略大多数细胞器；图中大空区代表简化液泡。',
                  'The onion model has a wall, membrane and nucleus; most organelles are omitted. The large light area is a simplified vacuole.',
                )
          }
        />
      </p>
      <details className="bio-static">
        <summary>
          <Text
            mode={mode}
            text={t('文字版与模型说明', 'Text version & model notes')}
          />
        </summary>
        <p>
          <Text
            mode={mode}
            text={t(
              'A：外部→壁附近→膜→内部。B：外部→壁附近→膜，在此条件下不能进入。A/B不是某个真实分子。模型不模拟扩散、渗透、通道蛋白、载体或能量消耗；不表示膜有意识判断。结构非按比例，颜色为标注。',
              'A: outside → wall → membrane → inside. B stops at the membrane under these preset conditions. A/B are not specific molecules. The model does not simulate diffusion, osmosis, channels, carriers or energy use, and does not imply a conscious membrane. Structures are not to scale; colours are explanatory.',
            )}
          />
        </p>
      </details>
    </>
  );
}
function CommunityLab({ mode, onExplore }: Props) {
  const [kind, setKind] = useState(0);
  const flow = useFrames(3, onExplore);
  const names = [
    t('一个酵母个体', 'One yeast organism'),
    t('多个酵母个体', 'Several yeast organisms'),
    t('植物合作', 'Plant cooperation'),
  ];
  const descriptions =
    kind === 2
      ? [
          t(
            '一株植物由不同细胞、组织和器官协作。',
            'A plant has cooperating cells, tissues and organs.',
          ),
          t(
            '根吸收水分，运输组织把水送往叶片等部位。',
            'Roots take up water; transport tissues supply leaves and other parts.',
          ),
          t(
            '叶片光合作用制造糖，不是直接从土壤吃到糖。',
            'Leaves make sugars by photosynthesis, rather than obtaining them directly from soil.',
          ),
          t(
            '糖运往需要的部位，细胞呼吸释放可用能量。根与叶等部位相互依赖。',
            'Sugars reach parts that need them; cellular respiration releases usable energy. Roots, leaves and other parts depend on one another.',
          ),
        ]
      : [
          t(
            '模型中的每个酵母细胞代表一个个体，不只是植物组织的一小格。',
            'Each model yeast cell represents an organism, rather than a cell within plant tissue.',
          ),
          t(
            '每个个体能从环境获取物质。',
            'Each organism can obtain substances from its surroundings.',
          ),
          t(
            '利用物质释放可用能量，并生长。',
            'It releases usable energy from substances and grows.',
          ),
          t(
            '适合条件下，面包酵母可出芽繁殖。这是简化过程，不表示真实所需时间。',
            'Under suitable conditions baking yeast can reproduce by budding. Timing is compressed, not predictive.',
          ),
        ];
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '同样是许多细胞，组织方式不同。',
            'Many cells, different organisation.',
          )}
        />
      </h3>
      <div className="bio-choice-row bio-micro-choice">
        {names.map((n, i) => (
          <button
            key={n.en}
            aria-pressed={kind === i}
            onClick={() => {
              setKind(i);
              flow.reset();
              onExplore();
            }}
          >
            <Text mode={mode} text={n} />
          </button>
        ))}
      </div>
      <div className="bio-micro-window">
        <svg
          viewBox="0 0 420 270"
          role="img"
          aria-label={word(
            mode,
            kind === 2
              ? '根和叶之间的水与糖协作'
              : '面包酵母细胞的生命活动示意',
            kind === 2
              ? 'Water and sugar cooperation between roots and leaves'
              : 'Baking yeast life-process schematic',
          )}
        >
          {kind === 2 ? (
            <>
              <path
                d="M212 196V71m0 65q-80-69-82-32t82 32q74-78 91-44t-91 44m0 60-36 38m36-38 31 38m-31-38-9 45"
                fill="#bad191"
                stroke="#6d915e"
                strokeWidth="4"
              />
              {flow.frame >= 1 && (
                <>
                  <path
                    d="M175 220V112m-5 8 5-8 5 8"
                    stroke="#70aabc"
                    strokeWidth="4"
                    fill="none"
                  />
                  <text x="30" y="189" fontSize="13" fill="#639dad">
                    {word(mode, '水 → 叶', 'Water → leaves')}
                  </text>
                </>
              )}
              {flow.frame >= 2 && (
                <>
                  <path
                    d="M252 112v108m-5-8 5 8 5-8"
                    stroke="#c5a15d"
                    strokeWidth="4"
                    fill="none"
                  />
                  <text x="277" y="189" fontSize="13" fill="#b69756">
                    {word(mode, '糖 → 其他部位', 'Sugars → other parts')}
                  </text>
                </>
              )}
            </>
          ) : kind === 0 ? (
            <>
              <Yeast
                scale={flow.frame >= 2 ? 1.25 : 1}
                bud={flow.frame === 3}
              />
              {flow.frame === 1 && (
                <>
                  <circle cx="105" cy="130" r="7" fill="#7eacc4" />
                  <path
                    d="M116 130h39m-7-5 7 5-7 5"
                    stroke="#7eacc4"
                    strokeWidth="2"
                    fill="none"
                  />
                </>
              )}
              {flow.frame === 2 && (
                <text x="288" y="144" fill="#b99b57" fontSize="26">
                  ✧
                </text>
              )}
            </>
          ) : (
            <>
              {Array.from({ length: 6 }, (_, i) => (
                <Yeast
                  key={i}
                  cx={91 + (i % 3) * 115}
                  cy={80 + Math.floor(i / 3) * 116}
                  scale={0.65}
                  bud={flow.frame === 3}
                />
              ))}
            </>
          )}
        </svg>
      </div>
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text mode={mode} text={descriptions[flow.frame]!} />
      </p>
      <details className="bio-static">
        <summary>
          <Text
            mode={mode}
            text={t('文字版与模型说明', 'Text version & model notes')}
          />
        </summary>
        <p>
          <Text
            mode={mode}
            text={t(
              '一个或多个面包酵母个体：获取物质→释放可用能量并生长→出芽。多个细胞同框，不自动意味着一个多细胞个体。植物：根吸水→水运输到叶等部位→叶制造糖→糖运输到需要的部位。箭头表示物质联系，不是完整食物网或运输解剖；各部分的需求不局限于图中画出的一条路径。非按比例，时间压缩，无实际培养。',
              'One or several yeast organisms: obtain substances → release usable energy and grow → bud. Several cells in one view do not automatically make one multicellular organism. Plant: roots take up water → transport to leaves and other parts → leaves make sugars → transport to parts needing them. Arrows show material connections, not a complete food web or transport anatomy. Needs are not limited to the drawn paths. Not to scale; time is compressed; no culturing is involved.',
            )}
          />
        </p>
      </details>
    </>
  );
}
