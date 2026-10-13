import { useId, useState, type ReactNode } from 'react';
import type { LanguageMode, LocalizedText } from '@study/shared';
import { t } from './schema';
import { Text } from './ui';
import { useFrames, Playback } from './LabPlayback';
import {
  localLife,
  specimenIds,
  keyNodes,
  keyPosition,
  keyCandidates,
  speciesComparison,
  interactionEvidence,
  habitatFocus,
  habitatConcern,
  type LocalLife,
  type KeyNode,
  type PairCase,
  type Interaction,
  type Habitat,
} from './diversityModel';
type Props = { id: string; mode: LanguageMode; onExplore: () => void };
const green = '#6e855a',
  blue = '#568998',
  gold = '#b59548',
  pink = '#b97770';
const word = (mode: LanguageMode, text: LocalizedText) =>
  mode === 'en' ? text.en : text.zh;
function Choices<T extends string>({
  mode,
  label,
  value,
  items,
  choose,
}: {
  mode: LanguageMode;
  label: LocalizedText;
  value: T;
  items: readonly { value: T; name: LocalizedText }[];
  choose: (v: T) => void;
}) {
  return (
    <div
      className="bio-choice-row bio-diversity-choices"
      role="group"
      aria-label={word(mode, label)}
    >
      {items.map((i) => (
        <button
          key={i.value}
          aria-pressed={value === i.value}
          onClick={() => choose(i.value)}
        >
          <Text mode={mode} text={i.name} />
        </button>
      ))}
    </div>
  );
}
function Notes({ mode, text }: { mode: LanguageMode; text: LocalizedText }) {
  return (
    <details className="bio-static">
      <summary>
        <Text
          mode={mode}
          text={t('文字线索与模型边界', 'Text clues & model limits')}
        />
      </summary>
      <p>
        <Text mode={mode} text={text} />
      </p>
    </details>
  );
}
function Scene({
  mode,
  title,
  children,
  height = 330,
}: {
  mode: LanguageMode;
  title: LocalizedText;
  children: ReactNode;
  height?: number;
}) {
  return (
    <svg
      viewBox={`0 0 420 ${height}`}
      role="img"
      aria-label={word(mode, title)}
    >
      <title>{word(mode, title)}</title>
      <rect
        x="10"
        y="10"
        width="400"
        height={height - 20}
        rx="23"
        fill="#eff1e6"
      />
      {children}
    </svg>
  );
}
function Label({
  mode,
  text,
  x,
  y,
  size = 13,
}: {
  mode: LanguageMode;
  text: LocalizedText;
  x: number;
  y: number;
  size?: number;
}) {
  return (
    <text x={x} y={y} textAnchor="middle" fontSize={size} fill="#354832">
      {word(mode, text)}
    </text>
  );
}
function Arrow({
  from,
  to,
  color = blue,
  active = true,
}: {
  from: readonly [number, number];
  to: readonly [number, number];
  color?: string;
  active?: boolean;
}) {
  const a = (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI;
  return (
    <g opacity={active ? 1 : 0.2}>
      <path
        d={`M${from[0]} ${from[1]}L${to[0]} ${to[1]}`}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={active ? undefined : '5 5'}
      />
      <path
        d="M0 0-9-5-9 5Z"
        fill={color}
        transform={`translate(${to[0]} ${to[1]}) rotate(${a})`}
      />
    </g>
  );
}
function Organism({ kind, dark = false }: { kind: LocalLife; dark?: boolean }) {
  if (kind === 'cabbage')
    return (
      <>
        <path
          d="M0 69V-25m0 15-22-27m22 16 22-28"
          stroke="#8a8969"
          strokeWidth="10"
        />
        {[-1, 1].map((s) => (
          <g key={s} transform={`translate(${s * 21} -37)`}>
            {[-52, -32, -12, 8, 28, 48].map((a) => (
              <path
                key={a}
                d="M0 8Q-5-27 0-67Q7-23 0 8Z"
                transform={`rotate(${a})`}
                fill="#a6b78a"
                stroke={green}
              />
            ))}
          </g>
        ))}
      </>
    );
  if (kind === 'fern')
    return (
      <>
        <path d="M0 72V-15" stroke="#8a8969" strokeWidth="12" />
        {[-1, 1].map((s) => (
          <g key={s}>
            <path
              d={`M0-10Q${s * 40}-70 ${s * 80}-49`}
              fill="none"
              stroke={green}
              strokeWidth="3"
            />
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <g
                key={i}
                transform={`translate(${s * (12 + i * 9)} ${-22 - i * 5 + (i > 4 ? (i - 4) * 7 : 0)}) rotate(${s * 14})`}
              >
                <path
                  d={`M0 0Q${s * 5}-28 ${s * 16}-23Q${s * 18}-12 0 0Z`}
                  fill={i === 6 ? '#e7eadf' : '#aabc8a'}
                  stroke={green}
                />
                <path
                  d={`M0 0 Q${s * 5} 18 ${s * 19} 15 Q${s * 15} 1 0 0Z`}
                  fill="#b7c799"
                  stroke={green}
                />
              </g>
            ))}
          </g>
        ))}
      </>
    );
  if (kind === 'tui' || kind === 'kereru') {
    const pigeon = kind === 'kereru';
    return (
      <g stroke="#445b55" strokeWidth="2">
        <path d="M-37 14-67 42-58 2" fill={dark ? '#424b48' : '#789986'} />
        <ellipse
          cx="-8"
          cy="10"
          rx={pigeon ? 44 : 37}
          ry={pigeon ? 48 : 33}
          fill={dark ? '#424b48' : '#789986'}
        />
        {pigeon && (
          <path
            d="M-43 17Q-6 0 30 20Q15 70-17 54Q-39 42-43 17Z"
            fill="#fffdf5"
            stroke="none"
          />
        )}
        <path
          d="M-32-6Q5-20 8 29Q-26 38-32-6Z"
          fill={dark ? '#4d5852' : '#568998'}
        />
        <circle cx="28" cy="-25" r="23" fill={dark ? '#424b48' : '#789986'} />
        <path
          d={pigeon ? 'M48-24 65-20 48-17' : 'M48-29Q70-25 69-15L49-19'}
          fill="#786d59"
        />
        <circle cx="34" cy="-30" r="3" fill="#263e33" stroke="#fff" />
        {!pigeon && (
          <g fill="#fffdf5" stroke="none">
            <circle cx="28" cy="-3" r="7" />
            <circle cx="37" cy="0" r="6" />
          </g>
        )}
        <path
          d={pigeon ? 'M-12 53v17m30-21v21' : 'M-10 39v26m22-29v26'}
          fill="none"
          strokeWidth="3"
        />
      </g>
    );
  }
  if (kind === 'weta')
    return (
      <g stroke="#876c48" strokeWidth="3" fill="none">
        {[-1, 1].map((s) => (
          <g key={s}>
            <path d={`M-24 0 -38 ${s * 25} -59 ${s * 34}`} />
            <path d={`M-5 0 -6 ${s * 31} 18 ${s * 39}`} />
            <path d={`M18 0 46 ${s * 32} 29 ${s * 55}`} strokeWidth="5" />
          </g>
        ))}
        <path d="M-41-5Q-73-38-94-22m53 24Q-79 32-97 20" />
        <ellipse cx="9" rx="34" ry="18" fill="#d4ba82" />
        {[-5, 8, 21].map((x) => (
          <path key={x} d={`M${x}-17v34`} />
        ))}
        <circle cx="-29" r="18" fill="#b89869" />
        <circle cx="-36" cy="-7" r="3" fill="#263e33" stroke="none" />
      </g>
    );
  return (
    <g stroke="#44564f" strokeWidth="3" fill="none">
      {[-1, 1].map((s) => (
        <g key={s}>
          {[-20, -7, 6, 19].map((x, i) => (
            <path
              key={x}
              d={`M${x} -4L${s * (46 + i * 5)} ${-34 + i * 21}L${s * (78 + i * 2)} ${-44 + i * 31}`}
            />
          ))}
        </g>
      ))}
      <ellipse cx="0" cy="17" rx="26" ry="33" fill="#44564f" />
      <circle cy="-15" r="16" fill="#52655b" />
      <path d="M0-4Q-9 14 0 37Q9 14 0-4Z" fill={pink} stroke="none" />
    </g>
  );
}
function SampleArt({
  mode,
  kind,
  anonymous = false,
}: {
  mode: LanguageMode;
  kind: LocalLife;
  anonymous?: boolean;
}) {
  return (
    <Scene
      mode={mode}
      title={
        anonymous
          ? t(
              '匿名教学样本，结构见图与文字线索',
              'Anonymous teaching sample; traits shown in picture and text',
            )
          : localLife[kind].name
      }
      height={300}
    >
      <g transform="translate(210 154) scale(1.25)">
        <Organism kind={kind} />
      </g>
      <Label
        mode={mode}
        text={t('原创示意 · 非比例', 'Original schematic · not to scale')}
        x={210}
        y={277}
        size={12}
      />
    </Scene>
  );
}
function FullKey({ mode }: { mode: LanguageMode }) {
  return (
    <details className="bio-static">
      <summary>
        <Text
          mode={mode}
          text={t('查看完整六样本检索表', 'View the full six-sample key')}
        />
      </summary>
      <ol className="bio-diversity-key">
        <li>
          <Text
            mode={mode}
            text={t(
              '有植物叶片→2；动物结构→3。',
              'Plant leaves → 2; animal structures → 3.',
            )}
          />
        </li>
        <li>
          <Text
            mode={mode}
            text={t(
              '分裂蕨叶→银蕨；带状成簇→卷心菜树。',
              'Divided fronds → silver fern; clustered straps → cabbage tree.',
            )}
          />
        </li>
        <li>
          <Text
            mode={mode}
            text={t(
              '羽毛→4；无羽毛、分节腿→5。',
              'Feathers → 4; no feathers and jointed legs → 5.',
            )}
          />
        </li>
        <li>
          <Text
            mode={mode}
            text={t(
              '喉部白羽簇→tūī；大片白胸腹→kererū。',
              'White throat tuft → tūī; broad white breast → kererū.',
            )}
          />
        </li>
        <li>
          <Text
            mode={mode}
            text={t(
              '完整图六腿与触角→惠灵顿树wētā；八腿→成年雌katipō。',
              'Complete six legs and antennae → Wellington tree wētā; eight legs → adult-female katipō.',
            )}
          />
        </li>
      </ol>
      <p>
        <Text
          mode={mode}
          text={t(
            '仅限这六幅已标定图；看不清或不匹配，保留未知。不是所有生物的分类或演化树。',
            'Only these six labelled pictures; unclear or unmatched samples stay unknown. This is not a classification or evolutionary tree of all life.',
          )}
        />
      </p>
    </details>
  );
}
function KeyLab({ mode, onExplore }: Props) {
  const [kind, setKind] = useState<LocalLife>('cabbage'),
    [answers, setAnswers] = useState<boolean[]>([]),
    [unknown, setUnknown] = useState(false),
    [mismatch, setMismatch] = useState(false);
  const position = keyPosition(answers),
    terminal = !(position in keyNodes),
    node = terminal ? null : keyNodes[position as KeyNode];
  const reset = () => {
    setAnswers([]);
    setUnknown(false);
    setMismatch(false);
  };
  const pick = (answer: boolean) => {
    onExplore();
    if (localLife[kind][position as KeyNode] !== answer) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    setAnswers([...answers, answer]);
  };
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t('每一步，少一点猜测。', 'One checkable step at a time.')}
        />
      </h3>
      <Choices
        mode={mode}
        label={t('匿名样本', 'Anonymous samples')}
        value={kind}
        items={specimenIds.map((id, i) => ({
          value: id,
          name: t(
            `样本 ${String.fromCharCode(65 + i)}`,
            `Sample ${String.fromCharCode(65 + i)}`,
          ),
        }))}
        choose={(v) => {
          setKind(v);
          reset();
          onExplore();
        }}
      />
      <div className="bio-diversity-window">
        <SampleArt mode={mode} kind={kind} anonymous />
      </div>
      <p>
        <Text mode={mode} text={localLife[kind].clue} />
      </p>
      <div className="bio-diversity-state" aria-live="polite">
        <strong>
          <Text
            mode={mode}
            text={
              unknown
                ? t('判断暂停：保留未知。', 'Conclusion paused: keep unknown.')
                : terminal
                  ? localLife[position as LocalLife].name
                  : t(
                      `候选还剩 ${keyCandidates(answers).length} 个`,
                      `Candidates remaining: ${keyCandidates(answers).length}`,
                    )
            }
          />
        </strong>
        {terminal && !unknown && (
          <p>
            <i>{localLife[position as LocalLife].scientific}</i>
          </p>
        )}
        {unknown && (
          <p>
            <Text
              mode={mode}
              text={t(
                '实际看不清时可以停下，补线索再重走。不要把未看见当不存在。',
                'Unclear real evidence can stay unresolved until more clues are available. Unseen does not mean absent.',
              )}
            />
          </p>
        )}
      </div>
      {!terminal && !unknown && node && (
        <>
          <p className="bio-diversity-question">
            <Text mode={mode} text={node.question} />
          </p>
          <div className="bio-choice-row bio-diversity-choices">
            <button onClick={() => pick(true)}>
              <Text mode={mode} text={node.yesLabel} />
            </button>
            <button onClick={() => pick(false)}>
              <Text mode={mode} text={node.noLabel} />
            </button>
          </div>
          {mismatch && (
            <p role="status">
              <Text
                mode={mode}
                text={t(
                  '这一步与图中线索不符，候选保持原样。再看结构与文字提示。',
                  'This branch does not match the illustrated clue, so candidates stay unchanged. Inspect the structure and text again.',
                )}
              />
            </p>
          )}
          <button
            className="bio-text-button"
            onClick={() => {
              setUnknown(true);
              onExplore();
            }}
          >
            <Text
              mode={mode}
              text={t('看不清，保留未知', 'Unclear: keep unknown')}
            />
          </button>
        </>
      )}
      {answers.length > 0 && (
        <p>
          <Text
            mode={mode}
            text={t(
              `已经核对 ${answers.length} 个分支。`,
              `Checked ${answers.length} ${answers.length === 1 ? 'branch' : 'branches'}.`,
            )}
          />
        </p>
      )}
      <div>
        <button
          className="bio-button"
          onClick={() => {
            reset();
            onExplore();
          }}
        >
          <Text mode={mode} text={t('↺ 重走这张图', '↺ Restart this sample')} />
        </button>
      </div>
      <FullKey mode={mode} />
      <Notes
        mode={mode}
        text={t(
          '样本A–F依次为卷心菜树、银蕨、tūī、kererū、惠灵顿树wētā和成年雌katipō。名称是资料给定，图示夸张可见特征，不做真实物种鉴定。不符支路不推进；未知出口停止具体标签，不删除样本。二分节点是实用辨认问题，不表示祖先先后分化顺序。幼体、缺腿、遮挡和表外生物需要更多证据。',
          'A–F are cabbage tree, silver fern, tūī, kererū, Wellington tree wētā and adult-female katipō. References supply identities; illustrations emphasise clues rather than identify real specimens. A mismatch does not advance; unknown pauses the label without removing the sample. Key order is practical, not ancestral branching. Immature, damaged, occluded and out-of-scope organisms need more evidence.',
        )}
      />
    </>
  );
}
const pairChoices = [
  {
    value: 'variation',
    name: t('同种不同视角', 'Same species, different views'),
  },
  { value: 'different', name: t('两种鸟', 'Two bird species') },
  { value: 'uncertain', name: t('只有局部', 'Only a partial view') },
] as const;
function PairArt({
  mode,
  pair,
  frame,
}: {
  mode: LanguageMode;
  pair: PairCase;
  frame: number;
}) {
  return (
    <Scene
      mode={mode}
      title={t(
        '外观、给定资料与分类层次的比较',
        'Appearance, supplied references and classification levels',
      )}
      height={300}
    >
      {pair === 'uncertain' ? (
        <>
          <path
            d="M112 225Q81 110 303 71Q312 173 112 225Z"
            fill="#789986"
            stroke={green}
            strokeWidth="3"
          />
          <path
            d="M111 234 276 98m-125 109 10-45m37 1 15-43m-28 38 49 9"
            stroke="#b4ccac"
            fill="none"
          />
          <Label
            mode={mode}
            text={t('局部羽色 ≠ 完整身份', 'Partial colour ≠ identity')}
            x={210}
            y={265}
          />
        </>
      ) : (
        <>
          <g transform="translate(118 147) scale(.9)">
            <Organism kind="tui" dark />
          </g>
          <g transform="translate(307 147) scale(.9)">
            <Organism kind={pair === 'variation' ? 'tui' : 'kereru'} />
          </g>
          {frame >= 1 && (
            <>
              <Label
                mode={mode}
                text={t('资料：tūī', 'Given: tūī')}
                x={112}
                y={253}
              />
              <Label
                mode={mode}
                text={
                  pair === 'variation'
                    ? t('资料：tūī', 'Given: tūī')
                    : t('资料：kererū', 'Given: kererū')
                }
                x={307}
                y={253}
              />
            </>
          )}
          <Label
            mode={mode}
            text={t(
              '已标定成鸟示意 · 非实测',
              'Labelled adults · not measured data',
            )}
            x={210}
            y={36}
            size={12}
          />
        </>
      )}
    </Scene>
  );
}
function PairLab({ mode, onExplore }: Props) {
  const [pair, setPair] = useState<PairCase>('variation');
  const flow = useFrames(3, onExplore),
    conclusion = speciesComparison(pair);
  const captions: Record<PairCase, LocalizedText[]> = {
    variation: [
      t(
        '看到不同明暗的羽色，两幅图都保留喉部白簇。单一颜色不够。',
        'Different colour views retain the white throat tuft; one colour is insufficient.',
      ),
      t(
        '课程资料把两幅标为成体tūī。这里改变观察明暗，不生成遗传测试。',
        'Lesson references label both as adult tūī. Viewing colours are changed, not genetic tests generated.',
      ),
      t(
        '这组已标定示意属于同一物种。观察条件可改变外观，也有真实个体差异。',
        'These supplied examples belong to one species. Viewing conditions can change appearance, and real individuals can vary too.',
      ),
      t(
        '不能把任何两幅相似鸟图都直接判为同种；要核对更多结构与资料。',
        'This does not make every similar pair one species. Additional traits and references need checking.',
      ),
    ],
    different: [
      t(
        '两种鸟都有羽毛和部分绿色光泽，但白羽位置等不同。',
        'Both have feathers and some green-toned plumage, with different white markings.',
      ),
      t(
        '可靠资料给定tūī与kererū两个名称。模型没有通过相似度计算生成物种。',
        'References supply tūī and kererū identities; the model does not calculate species from similarity.',
      ),
      t(
        '同为鸟类，却是不同物种。更大类群与具体物种是不同层次。',
        'Both are birds but different species. A broader group differs from a specific species.',
      ),
      t(
        '分类还结合亲缘与其他证据。共有特征不意味着同种，差异也不意味着毫无亲缘。',
        'Classification also considers relationships and other evidence. Shared traits do not mean one species, nor difference no relationship.',
      ),
    ],
    uncertain: [
      t(
        '只看到一小片绿羽，缺少完整结构。',
        'Only a small green feather patch is visible.',
      ),
      t(
        '没有给定具体身份，也没有新测量。不要把相似颜色当作补全的数据。',
        'No species identity or new measurement is supplied. Similar colour is not missing data.',
      ),
      t(
        '保留未知：可以描述所见，但不能确认具体鸟种。',
        'Keep unknown: describe what is seen without confirming the species.',
      ),
      t(
        '下一步可补观察时间、位置、完整结构与可靠图鉴。无需抓鸟或做繁殖实验。',
        'More time/location context, complete structures and reliable guides may help; no capture or breeding experiment is needed.',
      ),
    ],
  };
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t('相似到哪一层？', 'Similar at which level?')}
        />
      </h3>
      <Choices
        mode={mode}
        label={t('证据情境', 'Evidence case')}
        value={pair}
        items={pairChoices}
        choose={(v) => {
          setPair(v);
          flow.reset();
          onExplore();
        }}
      />
      <div className="bio-diversity-window">
        <PairArt mode={mode} pair={pair} frame={flow.frame} />
      </div>
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text mode={mode} text={captions[pair][flow.frame]!} />
      </p>
      {flow.frame >= 2 && (
        <div className="bio-diversity-state">
          <Text
            mode={mode}
            text={
              conclusion === 'same-species'
                ? t('给定身份：同一物种', 'Supplied identity: one species')
                : conclusion === 'different-species'
                  ? t(
                      '共同鸟类 · 不同物种',
                      'Shared bird group · different species',
                    )
                  : t(
                      '证据不足 · 具体物种未知',
                      'Insufficient evidence · species unknown',
                    )
            }
          />
        </div>
      )}
      <Notes
        mode={mode}
        text={t(
          '四格为观察→给定资料→层次判断→局限。两幅tūī只改变示意明暗；tūī/kererū是资料给定不同物种，局部视图始终不提供身份。无DNA、相似度百分比或繁殖数据；模型不能证明物种边界。科学研究还考虑生殖、遗传、行为与亲缘等多证据，并选择适合对象的物种概念。',
          'Four views: observation → supplied reference → layered conclusion → limits. Tūī views change illustrative colours only; tūī/kererū are supplied different identities, while the partial view remains unidentified. No DNA, similarity percentage or breeding data are generated; the model does not prove species boundaries. Research uses reproductive, genetic, behavioural and relationship evidence with suitable species concepts.',
        )}
      />
    </>
  );
}
function Flower({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M0 46V-12" stroke={green} strokeWidth="4" />
      <path
        d="M0 3Q-30-22-18-38Q-2-32 0 3Q4-31 22-30Q27-10 0 3Z"
        fill={pink}
        stroke="#957052"
        strokeWidth="2"
      />
      <path d="M0-12v-33m-6 15-6-12m18 12 6-12" stroke={gold} strokeWidth="3" />
      <circle cy="-45" r="4" fill={gold} />
    </g>
  );
}
function Fly() {
  return (
    <g stroke="#6a7869" strokeWidth="2">
      <ellipse cx="-6" cy="-12" rx="15" ry="7" fill="#d7e1de" />
      <ellipse cx="12" cy="-12" rx="15" ry="7" fill="#d7e1de" />
      <ellipse rx="8" ry="14" fill="#9baa90" />
      {[-1, 1].map((s) => (
        <path
          key={s}
          d={`M${s * 6} -5 L${s * 20} -15 M${s * 6} 0 L${s * 21} 7 M${s * 6} 6 L${s * 18} 20`}
          fill="none"
        />
      ))}
    </g>
  );
}
function RelationsArt({
  mode,
  kind,
  contact,
  frame,
}: {
  mode: LanguageMode;
  kind: Interaction;
  contact: boolean;
  frame: number;
}) {
  return (
    <Scene
      mode={mode}
      title={t(
        '资源与作用的独立例子，非种群预测',
        'Separate resource/effect examples, not population forecasts',
      )}
    >
      {kind === 'competition' ? (
        <>
          <circle cx="210" cy="55" r="21" fill="#e6cd89" />
          <path d="M45 276h330" stroke="#b8c6a6" strokeWidth="8" />
          {[142, 276].map((x, i) => (
            <g key={x}>
              <path
                d={`M${x} 276V${i ? 189 : 143}`}
                stroke={green}
                strokeWidth="5"
              />
              <path
                d={`M${x} ${i ? 222 : 195}q-57-52-68-14q21 44 68 14m0 14q43-57 67-23q-18 42-67 23`}
                fill="#b3c591"
                stroke={green}
              />
            </g>
          ))}
          <Arrow
            from={[197, 81]}
            to={[148, 156]}
            color={gold}
            active={frame >= 1}
          />
          <Arrow from={[231, 82]} to={[277, 188]} color={gold} active={false} />
          <Label
            mode={mode}
            text={t(
              '假设：共同需要有限的光',
              'Assumption: shared limited light',
            )}
            x={210}
            y={309}
          />
        </>
      ) : kind === 'predation' ? (
        <>
          <g transform="translate(307 176) scale(.65)">
            <Organism kind="katipo" />
          </g>
          {frame < 3 ? (
            <g transform={`translate(${100 + frame * 67} 178)`}>
              <Fly />
            </g>
          ) : (
            <circle cx="307" cy="191" r="6" fill={gold} />
          )}
          <Arrow
            from={[131, 234]}
            to={[281, 234]}
            color={gold}
            active={frame >= 1}
          />
          <Label
            mode={mode}
            text={t('猎物 → 捕食者', 'Prey → predator')}
            x={210}
            y={275}
          />
          <Label
            mode={mode}
            text={t(
              '虚拟蜘蛛与昆虫，不是实际捕获记录',
              'Fictional spider/insect, not a capture record',
            )}
            x={210}
            y={41}
            size={11}
          />
        </>
      ) : (
        <>
          <Flower x={100} y={174} />
          <Flower x={335} y={174} />
          <g transform={`translate(${frame >= 2 ? 287 : 52} 153) scale(.7)`}>
            <Organism kind="tui" />
            {contact && frame >= 1 && (
              <g fill={gold}>
                <circle cx="49" cy="-36" r="4" />
                <circle cx="42" cy="-42" r="3" />
              </g>
            )}
          </g>
          <Arrow
            from={[frame >= 2 ? 335 : 100, 210]}
            to={[frame >= 2 ? 290 : 55, 210]}
            color={gold}
            active={frame >= 1}
          />
          {contact && frame >= 2 && (
            <Arrow from={[100, 118]} to={[329, 125]} color={pink} />
          )}
          {contact && frame >= 3 && (
            <circle cx="335" cy="131" r="5" fill={gold} stroke="#fff" />
          )}
          <Label
            mode={mode}
            text={t(
              '花蜜 → 鸟；花粉递送需条件',
              'Nectar → bird; pollen delivery needs conditions',
            )}
            x={210}
            y={275}
            size={12}
          />
        </>
      )}
    </Scene>
  );
}
const relationChoices = [
  {
    value: 'competition',
    name: t('竞争：有限的光', 'Competition: limited light'),
  },
  { value: 'predation', name: t('捕食：蛛与昆虫', 'Predation: spider/insect') },
  {
    value: 'mutualism',
    name: t('访花：检查双方', 'Flower visit: check both sides'),
  },
] as const;
function RelationsLab({ mode, onExplore }: Props) {
  const [kind, setKind] = useState<Interaction>('competition'),
    [contact, setContact] = useState<'pollen' | 'nectar'>('pollen');
  const flow = useFrames(3, onExplore),
    state = interactionEvidence(kind, contact === 'pollen');
  const captions: Record<Interaction, LocalizedText[]> = {
    competition: [
      t(
        '两株幼苗都需要光。本例假设共享光照是限制性资源。',
        'Both seedlings need light, assumed limiting in this example.',
      ),
      t(
        '叶片遮挡可让另一株可用光减少，不需要直接打斗。',
        'Leaves can reduce another seedling’s available light without fighting.',
      ),
      t(
        '竞争看共同需求与资源限制，不只是两株靠得近。',
        'Competition concerns shared demand and limitation, not proximity alone.',
      ),
      t(
        '相对没有这种竞争的条件，机会受影响；模型不算高度、生存率或精确光量。',
        'Access differs relative to conditions without this competition; height, survival and exact light are not calculated.',
      ),
    ],
    predation: [
      t(
        '虚拟蜘蛛与昆虫示意，先分捕食者和猎物。',
        'A fictional spider/insect example: identify predator and prey.',
      ),
      t(
        '捕食提供取食关系；食物箭头从昆虫到蜘蛛。',
        'Feeding establishes a relationship; the food arrow runs insect → spider.',
      ),
      t(
        '猎物材料与化学能可进入捕食者，不是能量凭空出现。',
        'Prey materials and chemical energy can enter the predator; energy is not created.',
      ),
      t(
        '这说明资源递送，不给出真实捕食次数或未来种群数量。',
        'This explains a transfer rather than real capture counts or future populations.',
      ),
    ],
    mutualism: [
      t(
        '花蜜是tūī的食物。停在花旁还不是双方受益的证据。',
        'Nectar feeds tūī; simply being beside a flower is not evidence of both benefits.',
      ),
      contact === 'pollen'
        ? t(
            '此情境假设鸟接触花药，花粉粘在喙上方。',
            'This case assumes anther contact, with pollen on feathers above the bill.',
          )
        : t(
            '这里只确认鸟得到花蜜；没有给出花粉接触线索。',
            'Only nectar feeding is confirmed here, without supplied pollen-contact evidence.',
          ),
      contact === 'pollen'
        ? t(
            '携带花粉到另一花，并接触相容柱头，支持潜在传粉帮助。',
            'Pollen carried to another compatible stigma supports potential pollination benefit.',
          )
        : t(
            '没有确认递送相容花粉，花的受益暂未确认。',
            'Compatible pollen delivery and plant benefit remain unconfirmed.',
          ),
      contact === 'pollen'
        ? t(
            '鸟获食物、花获潜在传粉帮助；受精、种子与长期净利益仍未测量。',
            'The bird gains food and the plant potential pollination benefit; fertilisation, seeds and lifetime net benefit remain unmeasured.',
          )
        : t(
            '单方食物线索不能直接叫双方互利；需要补充花粉转移等证据。',
            'One side’s food evidence does not establish mutualism; pollen-transfer evidence is needed.',
          ),
    ],
  };
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '关系，来自作用而非站位。',
            'Relationships concern effects, not positions.',
          )}
        />
      </h3>
      <Choices
        mode={mode}
        label={t('关系例子', 'Relationship example')}
        value={kind}
        items={relationChoices}
        choose={(v) => {
          setKind(v);
          flow.reset();
          onExplore();
        }}
      />
      {kind === 'mutualism' && (
        <Choices
          mode={mode}
          label={t('访花证据', 'Flower-visit evidence')}
          value={contact}
          items={[
            {
              value: 'pollen',
              name: t('接触并递送花粉', 'Pollen contact and delivery'),
            },
            { value: 'nectar', name: t('只确认取蜜', 'Nectar feeding only') },
          ]}
          choose={(v) => {
            setContact(v);
            flow.reset();
            onExplore();
          }}
        />
      )}
      <div className="bio-diversity-window">
        <RelationsArt
          mode={mode}
          kind={kind}
          contact={contact === 'pollen'}
          frame={flow.frame}
        />
      </div>
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text mode={mode} text={captions[kind][flow.frame]!} />
      </p>
      {flow.frame >= 2 && (
        <div className="bio-diversity-state">
          <Text
            mode={mode}
            text={
              kind === 'competition'
                ? t(
                    '有限资源：双方的获取机会都可能受影响',
                    'Limited resource: access for both can be affected',
                  )
                : kind === 'predation'
                  ? t(
                      '捕食者得到材料/能量；猎物受损',
                      'Predator gains materials/energy; prey is harmed',
                    )
                  : state.pollenTransferred
                    ? t(
                        '鸟：得到食物 · 花：潜在传粉帮助',
                        'Bird: food · plant: potential pollination help',
                      )
                    : t(
                        '鸟：得到食物 · 花：受益未确认',
                        'Bird: food · plant: benefit unconfirmed',
                      )
            }
          />
        </div>
      )}
      <Notes
        mode={mode}
        text={t(
          '三个独立示例不表示同一群生物瞬间变换关系。幼苗共享光，假设光限制且遮挡影响机会，不推算生长；蜘蛛取食示意压缩过程，无实测次数。访花两支都有鸟获花蜜，只一支假设相容花粉接触与递送。花受潜在传粉帮助不等于结实；鸟花互利不要求长期同居，不能直接与狭义共生互换。没有数量、速率或道德评分。',
          'Three independent examples do not transform one population’s relationship instantly. Seedlings share assumed limiting light; shade changes access without calculated growth. Predation compresses a process without capture measurements. Both visit cases feed the bird; only one assumes compatible pollen contact and delivery. Potential pollination help is not fruit set. Bird–flower mutual benefit need not be persistent cohabitation and differs from narrow symbiosis. No counts, rates or moral scores are produced.',
        )}
      />
    </>
  );
}
const forestPositions: Partial<Record<LocalLife, readonly [number, number]>> = {
  cabbage: [65, 180],
  fern: [160, 263],
  tui: [266, 110],
  kereru: [343, 188],
  weta: [310, 280],
};
const coastPositions: Partial<Record<LocalLife, readonly [number, number]>> = {
  cabbage: [336, 133],
  katipo: [204, 258],
};
function HabitatArt({
  mode,
  habitat,
  selected,
  changed,
  frame,
  onSelect,
}: {
  mode: LanguageMode;
  habitat: Habitat;
  selected: LocalLife;
  changed: boolean;
  frame: number;
  onSelect?: (id: LocalLife) => void;
}) {
  const positions = habitat === 'forest' ? forestPositions : coastPositions,
    ids = habitatFocus[habitat],
    resources: Partial<Record<LocalLife, readonly [number, number]>> =
      habitat === 'forest'
        ? {
            cabbage: [95, 301],
            fern: [95, 301],
            tui: [229, 219],
            kereru: [350, 91],
            weta: [245, 259],
          }
        : { cabbage: [342, 277], katipo: [197, 226] };
  const resource = resources[selected]!;
  const affected =
    changed &&
    ((habitat === 'forest' && selected === 'tui') ||
      (habitat === 'coast' && selected === 'katipo'));
  return (
    <Scene
      mode={mode}
      title={t(
        '森林林缘与海岸的代表资源焦点图，不是分布地图',
        'Forest/edge and coastal resource focus, not a range map',
      )}
      height={360}
    >
      {habitat === 'forest' ? (
        <>
          <path d="M25 315V277q160-29 370 0v38Z" fill="#d7dfc3" />
          <path
            d="M245 295V71m0 63-39-24m39-20 73-34"
            stroke="#b2ba93"
            strokeWidth="9"
          />
          <ellipse cx="95" cy="301" rx="31" ry="9" fill="#bdd5cd" />
          <ellipse cx="245" cy="259" rx="10" ry="15" fill="#756d55" />
          {[0, 1, 2].map((i) => (
            <circle
              key={i}
              cx={350 + (i - 1) * 10}
              cy={91 + (i % 2) * 9}
              r="7"
              fill={pink}
            />
          ))}
          <path d="M202 280v-53m0 12 34 10" stroke={green} strokeWidth="4" />
          {[0, 1, 2].map((i) => (
            <g key={i} opacity={changed && i > 0 ? 0.18 : 1}>
              <Flower x={220 + i * 18} y={237 - i * 10} />
            </g>
          ))}
          <Label
            mode={mode}
            text={t('花蜜来源示意', 'Nectar sources')}
            x={205}
            y={330}
            size={11}
          />
        </>
      ) : (
        <>
          <path d="M23 183h95v132H23Z" fill="#c4dde0" />
          <path
            d="M91 236Q171 183 245 216Q331 239 397 190v125H91Z"
            fill="#e6d6b4"
          />
          <path
            d="M25 226q18-8 35 0t35 0"
            stroke={blue}
            fill="none"
            strokeWidth="3"
          />
          <ellipse cx="342" cy="277" rx="42" ry="18" fill="#bdd5cd" />
          <path
            d="M157 233 234 209m-54 13 27 13"
            stroke="#a38e6d"
            strokeWidth="10"
            opacity={changed ? 0.18 : 1}
          />
          {changed && (
            <path
              d="M157 233 234 209"
              stroke={pink}
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}
          <Label
            mode={mode}
            text={t('潮线', 'Tide line')}
            x={65}
            y={166}
            size={11}
          />
          <Label
            mode={mode}
            text={t('沙丘隐蔽处', 'Dune cover')}
            x={203}
            y={316}
            size={11}
          />
          <Label
            mode={mode}
            text={t('后方湿地', 'Moist ground behind dunes')}
            x={329}
            y={338}
            size={10}
          />
        </>
      )}
      {frame >= 2 && (
        <Arrow
          from={resource}
          to={positions[selected]!}
          active={!affected}
          color={gold}
        />
      )}
      {ids.map((id, i) => {
        const p = positions[id]!;
        return (
          <g key={id} transform={`translate(${p[0]} ${p[1]})`}>
            <g
              opacity={selected === id ? 1 : 0.6}
              transform={`scale(${id === 'cabbage' || id === 'fern' ? 0.52 : 0.47})`}
            >
              <Organism kind={id} />
            </g>
            <g
              role={onSelect ? 'button' : undefined}
              tabIndex={onSelect ? 0 : undefined}
              aria-label={onSelect ? word(mode, localLife[id].name) : undefined}
              aria-pressed={onSelect ? selected === id : undefined}
              onClick={onSelect ? () => onSelect(id) : undefined}
              onKeyDown={
                onSelect
                  ? (e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onSelect(id);
                      }
                    }
                  : undefined
              }
              transform="translate(-30 -42)"
            >
              <circle
                r="22"
                fill={selected === id ? green : '#fffdf4'}
                stroke={green}
              />
              <text
                y="5"
                textAnchor="middle"
                fontSize="15"
                fill={selected === id ? '#fff' : '#405937'}
              >
                {i + 1}
              </text>
            </g>
          </g>
        );
      })}
      <Label
        mode={mode}
        text={t(
          '教学选择 ≠ 完整分布 / 数量',
          'Teaching focus ≠ complete range / counts',
        )}
        x={210}
        y={39}
        size={11}
      />
    </Scene>
  );
}
const habitatResources: Record<LocalLife, LocalizedText> = {
  cabbage: t(
    '植物需光、水等；海岸示意放在沙丘后方湿地，不是海水里。',
    'The plant needs light and water; the coastal example is moist ground behind dunes, not seawater.',
  ),
  fern: t(
    '银蕨在森林/林缘示例中获得光、水与生长空间；不能说所有蕨类都需求相同。',
    'The fern example connects light, water and space in forest/edge; not every fern has identical needs.',
  ),
  tui: t(
    'tūī可从本地花取蜜，也有其他食物；花期与资源位置会变化。',
    'Tūī can take nectar from native flowers and has other foods; flowering and resource locations vary.',
  ),
  kereru: t(
    'kererū取食果实等植物材料，可能帮助种子传播；这幅图不跟踪吃下的种子。',
    'Kererū eats fruits and other plant materials and can aid seed dispersal; ingested seeds are not tracked here.',
  ),
  weta: t(
    '树wētā与植物材料、树洞等隐蔽空间相联系；本图只标一项资源。',
    'Tree wētā connects with plant material and refuges such as tree cavities; only one resource is highlighted.',
  ),
  katipo: t(
    'katipō与上方沙丘植被/枯木等隐蔽处相联系，不生活在图中海水里。',
    'Katipō connects with upper-dune cover such as vegetation or driftwood, not the illustrated seawater.',
  ),
};
function HabitatLab({ mode, onExplore }: Props) {
  const [habitat, setHabitat] = useState<Habitat>('forest'),
    [selected, setSelected] = useState<LocalLife>('tui'),
    [scenario, setScenario] = useState<'baseline' | 'changed'>('baseline');
  const flow = useFrames(3, onExplore),
    concern = habitatConcern(habitat, scenario === 'changed', selected),
    choose = (v: LocalLife) => {
      setSelected(v);
      flow.reset();
      onExplore();
    };
  const effect =
    concern === 'baseline'
      ? t(
          '基线仅展示一种资源联系，不推算数量。',
          'Baseline shows a resource connection without counts.',
        )
      : concern === 'nectar-options-reduced'
        ? t(
            '本图花蜜来源减少：可能改变tūī的觅食选项；其他食物与移动未算。',
            'Fewer drawn nectar sources can change tūī feeding options; other foods and movement are not calculated.',
          )
        : concern === 'shelter-reduced'
          ? t(
              '本图沙丘遮蔽物减少：隐蔽空间受影响；不推出即时消失或数量。',
              'Reduced dune cover affects shelter; it does not imply instant disappearance or a count.',
            )
          : t(
              '所改资源与这个焦点的直接影响未在本图评估；不能宣称完全没有影响。',
              'The changed resource’s direct effect on this focus is unassessed; that does not establish no effect.',
            );
  const cap = [
    localLife[selected].clue,
    habitatResources[selected],
    effect,
    t(
      '生物图始终保留。要判断实际种群变化，还需时间、季节、食物、移动与调查数据。',
      'Organism images remain. Actual population changes require time, seasons, foods, movement and survey data.',
    ),
  ][flow.frame]!;
  return (
    <>
      <h3>
        <Text
          mode={mode}
          text={t(
            '名字之后，问它需要什么。',
            'After a name, ask what it needs.',
          )}
        />
      </h3>
      <Choices
        mode={mode}
        label={t('场景', 'Scene')}
        value={habitat}
        items={[
          { value: 'forest', name: t('森林 / 林缘', 'Forest / edge') },
          { value: 'coast', name: t('海岸 / 沙丘', 'Coast / dunes') },
        ]}
        choose={(v) => {
          setHabitat(v);
          setSelected(v === 'forest' ? 'tui' : 'katipo');
          setScenario('baseline');
          flow.reset();
          onExplore();
        }}
      />
      <Choices
        mode={mode}
        label={t('选择焦点生物', 'Select a focus organism')}
        value={selected}
        items={habitatFocus[habitat].map((id) => ({
          value: id,
          name: localLife[id].name,
        }))}
        choose={choose}
      />
      <Choices
        mode={mode}
        label={t('单项资源比较', 'Single-resource comparison')}
        value={scenario}
        items={[
          { value: 'baseline', name: t('资源基线', 'Resource baseline') },
          {
            value: 'changed',
            name:
              habitat === 'forest'
                ? t('花蜜来源减少', 'Fewer nectar sources')
                : t('沙丘遮蔽物减少', 'Reduced dune cover'),
          },
        ]}
        choose={(v) => {
          setScenario(v);
          flow.reset();
          onExplore();
        }}
      />
      <div className="bio-diversity-window">
        <HabitatArt
          mode={mode}
          habitat={habitat}
          selected={selected}
          changed={scenario === 'changed'}
          frame={flow.frame}
          onSelect={choose}
        />
      </div>
      <p className="bio-diversity-selected">
        <Text mode={mode} text={localLife[selected].name} /> ·{' '}
        <i>{localLife[selected].scientific}</i>
      </p>
      <Playback flow={flow} mode={mode} />
      <p className="bio-caption" aria-live="polite">
        <Text mode={mode} text={cap} />
      </p>
      <Notes
        mode={mode}
        text={t(
          '森林/林缘选5种、海岸选2种，共6个本地样本；不是说它们只能在这一种场景出现。地图是原创教学选择，不是真实地点或普查。森林按钮仅改变花蜜来源示意，海岸按钮仅改变上方沙丘遮蔽物，生物图保留；不能把未评估影响当作零，也不能预测灭绝、数量或健康。植物与动物各需多类资源，箭头只强调当前联系。银蕨现名Alsophila dealbata，旧资料也可见Cyathea dealbata。',
          'Five forest/edge and two coastal selections total six local samples, not exclusive habitat ranges. The original map is neither a real location nor a census. Forest controls alter nectar-source illustrations; coastal controls alter upper-dune cover while organisms remain. Unassessed effects are not zero, and no extinction, counts or health are predicted. Organisms need multiple resources; arrows emphasise one connection. Silver fern’s current name is Alsophila dealbata; older references may use Cyathea dealbata.',
        )}
      />
    </>
  );
}
export function DiversityExplore(props: Props) {
  return (
    <div className="bio-diversity-lab">
      {props.id === 'L045' ? (
        <KeyLab {...props} />
      ) : props.id === 'L046' ? (
        <PairLab {...props} />
      ) : props.id === 'L047' ? (
        <RelationsLab {...props} />
      ) : (
        <HabitatLab {...props} />
      )}
    </div>
  );
}
export function DiversityHookArt({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  if (id === 'L046') return <PairArt mode={mode} pair="different" frame={0} />;
  if (id === 'L047')
    return <RelationsArt mode={mode} kind="mutualism" contact frame={2} />;
  if (id === 'L048')
    return (
      <HabitatArt
        mode={mode}
        habitat="coast"
        selected="katipo"
        changed={false}
        frame={1}
      />
    );
  return (
    <Scene
      mode={mode}
      title={t(
        '六个本地样本的结构比较',
        'Structural comparison of six local samples',
      )}
      height={280}
    >
      {specimenIds.map((id, i) => (
        <g
          key={id}
          transform={`translate(${80 + (i % 3) * 130} ${i < 3 ? 90 : 211}) scale(.48)`}
        >
          <Organism kind={id} />
        </g>
      ))}
    </Scene>
  );
}
const clues: Record<string, LocalizedText[]> = {
  L045: [
    t(
      '叶片与动物结构：本表的第一层线索。',
      'Leaves versus animal structures: the first clue in this key.',
    ),
    t(
      '每步缩小候选，不能把未知强迫成一个名字。',
      'Each choice narrows candidates; unknown need not become a forced name.',
    ),
    t(
      '检索顺序不是祖先分化的演化树。',
      'Key order is not an ancestral evolutionary tree.',
    ),
  ],
  L046: [
    t('都有羽毛：共同鸟类特征。', 'Shared feathers: a bird-group trait.'),
    t(
      '白羽位置不同：辨认线索之一，不是唯一物种证据。',
      'Different white markings: one identification clue, not sole species evidence.',
    ),
    t(
      '具体物种身份需多种线索与可靠资料。',
      'Species identity needs multiple clues and reliable references.',
    ),
  ],
  L047: [
    t('花蜜→鸟：食物递送。', 'Nectar → bird: food transfer.'),
    t(
      '花粉递送：潜在帮助传粉，不保证种子。',
      'Pollen delivery: potential pollination help, not guaranteed seeds.',
    ),
    t(
      '互利与共生不是完全同义。',
      'Mutualism and symbiosis are not exact synonyms.',
    ),
  ],
  L048: [
    t(
      '海岸包括潮线、沙丘与后方湿地，不是全在海水里。',
      'The coast includes tide lines, dunes and moist ground, not just seawater.',
    ),
    t(
      'katipō隐蔽处：沙丘上方的覆盖结构。',
      'Katipō shelter: cover on upper dunes.',
    ),
    t(
      '教学焦点地图不提供数量或完整分布。',
      'A teaching map gives neither counts nor complete ranges.',
    ),
  ],
};
export function DiversityDiagram({
  id,
  mode,
}: {
  id: string;
  mode: LanguageMode;
}) {
  const [clue, setClue] = useState(0),
    caption = useId();
  return (
    <figure className="bio-diversity-diagram" aria-describedby={caption}>
      <DiversityHookArt id={id} mode={mode} />
      <div className="bio-choice-row bio-diversity-choices">
        {clues[id]!.map((_, i) => (
          <button key={i} aria-pressed={clue === i} onClick={() => setClue(i)}>
            <Text mode={mode} text={t(`线索 ${i + 1}`, `Clue ${i + 1}`)} />
          </button>
        ))}
      </div>
      <figcaption id={caption} aria-live="polite">
        <Text mode={mode} text={clues[id]![clue]!} />
      </figcaption>
    </figure>
  );
}
