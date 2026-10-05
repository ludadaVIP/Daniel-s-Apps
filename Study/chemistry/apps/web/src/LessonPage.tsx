import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import type { LanguageMode } from '@study/shared';
import { Localized } from '@study/ui';
import { getLesson, lessons, type Lesson } from './content/lessons';

function MatterSort({ mode }: { mode: LanguageMode }) {
  const items = [
    {
      icon: '🫧',
      name: { zh: '泡泡里的空气', en: 'Air in a bubble' },
      matter: true,
    },
    { icon: '🔊', name: { zh: '音乐', en: 'Music' }, matter: false },
    { icon: '🌫️', name: { zh: '水蒸气', en: 'Water vapour' }, matter: true },
    {
      icon: '🌈',
      name: { zh: '彩虹的光', en: 'Rainbow light' },
      matter: false,
    },
  ];
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  return (
    <div className="matter-sort">
      <p>
        {mode === 'en'
          ? 'Matter or not? Make a call.'
          : '是物质，还是不是？请你来判断。'}
      </p>
      <div className="sort-grid">
        {items.map((item, index) => {
          const chosen = answers[index];
          const correct = chosen === item.matter;
          return (
            <div className="sort-item" key={item.name.en}>
              <span className="sort-icon" aria-hidden="true">
                {item.icon}
              </span>
              <strong>
                <Localized text={item.name} mode={mode} />
              </strong>
              <div className="sort-actions">
                <button
                  type="button"
                  onClick={() =>
                    setAnswers((old) => ({ ...old, [index]: true }))
                  }
                >
                  {mode === 'en' ? 'Matter' : '是物质'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAnswers((old) => ({ ...old, [index]: false }))
                  }
                >
                  {mode === 'en' ? 'Not matter' : '不是物质'}
                </button>
              </div>
              {chosen !== undefined && (
                <span
                  className={
                    correct ? 'mini-result correct' : 'mini-result wrong'
                  }
                >
                  {correct
                    ? mode === 'en'
                      ? 'Exactly!'
                      : '判断正确！'
                    : mode === 'en'
                      ? 'Think: mass + space.'
                      : '再想想：质量 + 空间。'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ParticleField({
  spread,
  warm = false,
}: {
  spread: number;
  warm?: boolean;
}) {
  const dots = Array.from({ length: 24 }, (_, index) => {
    const angle = (index * 137.5 * Math.PI) / 180;
    const radius = 8 + ((index * 17) % 42) * (spread / 100);
    return {
      left: 50 + Math.cos(angle) * radius,
      top: 50 + Math.sin(angle) * radius,
      delay: `${-(index % 7) * 0.16}s`,
    };
  });
  return (
    <div
      className={`particle-field ${warm ? 'is-warm' : ''}`}
      aria-hidden="true"
    >
      {dots.map((dot, index) => (
        <i
          key={index}
          style={{
            left: `${dot.left}%`,
            top: `${dot.top}%`,
            animationDelay: dot.delay,
          }}
        />
      ))}
    </div>
  );
}

function ParticleZoom({ mode }: { mode: LanguageMode }) {
  const [spread, setSpread] = useState(18);
  return (
    <div className="particle-lab">
      <ParticleField spread={spread} warm={spread > 65} />
      <div className="lab-control">
        <label htmlFor="particle-spread">
          {mode === 'en' ? 'Let time pass' : '让时间向前走'}
          <strong>{spread}%</strong>
        </label>
        <input
          id="particle-spread"
          type="range"
          min="12"
          max="92"
          value={spread}
          onChange={(event) => setSpread(Number(event.target.value))}
        />
        <p>
          {spread < 45
            ? mode === 'en'
              ? 'The scent begins crowded near its source.'
              : '气味粒子一开始挤在来源附近。'
            : mode === 'en'
              ? 'Random motion spreads the particles through the room.'
              : '随机运动让粒子逐渐散到整个房间。'}
        </p>
      </div>
    </div>
  );
}

function StateLab({ mode }: { mode: LanguageMode }) {
  const states = [
    {
      id: 'solid',
      zh: '冰 · 固体',
      en: 'Ice · solid',
      spread: 35,
      temperature: '−10°C',
    },
    {
      id: 'liquid',
      zh: '水 · 液体',
      en: 'Water · liquid',
      spread: 52,
      temperature: '20°C',
    },
    {
      id: 'gas',
      zh: '水蒸气 · 气体',
      en: 'Vapour · gas',
      spread: 90,
      temperature: '110°C',
    },
  ] as const;
  const [active, setActive] = useState(0);
  const state = states[active]!;
  return (
    <div className="state-lab">
      <div className={`state-vessel state-${state.id}`}>
        <span className="temperature">{state.temperature}</span>
        <ParticleField spread={state.spread} warm={active === 2} />
      </div>
      <div
        className="state-buttons"
        role="group"
        aria-label={mode === 'en' ? 'Choose a state' : '选择物态'}
      >
        {states.map((item, index) => (
          <button
            className={active === index ? 'active' : ''}
            type="button"
            key={item.id}
            onClick={() => setActive(index)}
          >
            {mode === 'en' ? item.en : item.zh}
          </button>
        ))}
      </div>
      <p>
        {active === 0
          ? mode === 'en'
            ? 'Close, ordered, vibrating in fixed positions.'
            : '紧密、有序，在固定位置附近振动。'
          : active === 1
            ? mode === 'en'
              ? 'Still close, but able to slide past each other.'
              : '仍然靠近，但可以互相滑过。'
            : mode === 'en'
              ? 'Far apart, fast and moving in every direction.'
              : '相隔很远、速度快、向各个方向运动。'}
      </p>
    </div>
  );
}

function PhaseChangeLab({ mode }: { mode: LanguageMode }) {
  const [energy, setEnergy] = useState(8);
  const stage =
    energy < 20
      ? {
          id: 'solid',
          zh: '固体升温',
          en: 'Solid warming',
          temperature: -20 + energy,
          spread: 28,
        }
      : energy < 37
        ? {
            id: 'melting',
            zh: '正在熔化',
            en: 'Melting',
            temperature: 0,
            spread: 38,
          }
        : energy < 68
          ? {
              id: 'liquid',
              zh: '液体升温',
              en: 'Liquid warming',
              temperature: Math.round(((energy - 37) / 31) * 100),
              spread: 52,
            }
          : energy < 84
            ? {
                id: 'boiling',
                zh: '正在沸腾',
                en: 'Boiling',
                temperature: 100,
                spread: 72,
              }
            : {
                id: 'gas',
                zh: '气体升温',
                en: 'Gas warming',
                temperature: Math.round(100 + (energy - 84) * 1.25),
                spread: 92,
              };
  const plateau = stage.id === 'melting' || stage.id === 'boiling';

  return (
    <div className="phase-lab">
      <div className={`phase-scene phase-${stage.id}`}>
        <ParticleField spread={stage.spread} warm={energy > 67} />
        <div className="phase-readout">
          <span>{mode === 'en' ? stage.en : stage.zh}</span>
          <strong>{stage.temperature}°C</strong>
        </div>
      </div>
      <div className="phase-controls">
        <label htmlFor="heat-energy">
          <span>{mode === 'en' ? 'Energy added' : '加入的能量'}</span>
          <b>{energy}%</b>
        </label>
        <input
          id="heat-energy"
          type="range"
          min="0"
          max="100"
          value={energy}
          onChange={(event) => setEnergy(Number(event.target.value))}
        />
        <div className="phase-track" aria-hidden="true">
          <i style={{ width: `${energy}%` }} />
          <span className="mark-melt">0°C</span>
          <span className="mark-boil">100°C</span>
        </div>
        <p className={plateau ? 'plateau-note active' : 'plateau-note'}>
          {plateau
            ? mode === 'en'
              ? 'Temperature pauses: energy is loosening particle attractions.'
              : '温度暂时不升：能量正在松开粒子间的吸引。'
            : mode === 'en'
              ? 'Temperature rises as particles gain motion energy.'
              : '粒子运动得更快，温度随之上升。'}
        </p>
        <small>
          {mode === 'en'
            ? 'Model: pure water at ordinary atmospheric pressure.'
            : '模型条件：普通大气压下的纯水。'}
        </small>
      </div>
    </div>
  );
}

function ChangeDetective({ mode }: { mode: LanguageMode }) {
  const cases = [
    {
      icon: '🕯️',
      title: { zh: '蜡烛边缘的蜡融化', en: 'Wax melts beside a candle flame' },
      chemical: false,
      reason: {
        zh: '蜡只改变状态，冷却后仍是蜡。',
        en: 'The wax changes state and is still wax when cooled.',
      },
    },
    {
      icon: '🔥',
      title: { zh: '蜡烛芯附近的蜡燃烧', en: 'Wax burns near the wick' },
      chemical: true,
      reason: {
        zh: '蜡与氧气反应，生成二氧化碳和水等新物质。',
        en: 'Wax reacts with oxygen, making new substances including carbon dioxide and water.',
      },
    },
    {
      icon: '🥤',
      title: {
        zh: '小苏打加入醋后冒泡',
        en: 'Baking soda bubbles in vinegar',
      },
      chemical: true,
      reason: {
        zh: '反应产生了新的二氧化碳气体；这不是沸腾。',
        en: 'The reaction forms new carbon dioxide gas; this is not boiling.',
      },
    },
    {
      icon: '✂️',
      title: { zh: '把铝箔剪成细条', en: 'Aluminium foil is cut into strips' },
      chemical: false,
      reason: {
        zh: '形状和大小改变，但每一片仍是铝。',
        en: 'Shape and size change, but every piece is still aluminium.',
      },
    },
  ];
  const [answers, setAnswers] = useState<Record<number, boolean>>({});

  return (
    <div className="detective-lab">
      <div className="detective-intro">
        <span aria-hidden="true">⌕</span>
        <p>
          {mode === 'en'
            ? 'Do not judge by drama. Follow the substances and decide whether anything new formed.'
            : '别被热闹的现象带跑。追踪物质身份，判断有没有新物质生成。'}
        </p>
      </div>
      <div className="case-grid">
        {cases.map((item, index) => {
          const chosen = answers[index];
          const correct = chosen === item.chemical;
          return (
            <article className="detective-case" key={item.title.en}>
              <span aria-hidden="true">{item.icon}</span>
              <h3>
                <Localized text={item.title} mode={mode} />
              </h3>
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setAnswers((old) => ({ ...old, [index]: false }))
                  }
                >
                  {mode === 'en' ? 'Physical' : '物理变化'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAnswers((old) => ({ ...old, [index]: true }))
                  }
                >
                  {mode === 'en' ? 'Chemical' : '化学变化'}
                </button>
              </div>
              {chosen !== undefined && (
                <p
                  className={
                    correct ? 'case-result correct' : 'case-result wrong'
                  }
                >
                  <b>
                    {correct
                      ? mode === 'en'
                        ? 'Evidence fits.'
                        : '证据吻合。'
                      : mode === 'en'
                        ? 'Recheck the substance identity.'
                        : '再追踪一次物质身份。'}
                  </b>{' '}
                  <Localized text={item.reason} mode={mode} />
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function SeparationLab({ mode }: { mode: LanguageMode }) {
  const stages = [
    {
      zh: '铁粉、沙和盐混在一起',
      en: 'Iron, sand and salt are mixed',
      icon: '⚫ ◌ ✦',
      correct: 'magnet',
      clueZh: '先利用只有铁才有的性质。',
      clueEn: 'First use a property only iron has.',
    },
    {
      zh: '铁已取出，还剩沙和盐',
      en: 'Iron is removed; sand and salt remain',
      icon: '◌ ✦',
      correct: 'water',
      clueZh: '让其中一种物质进入溶液。',
      clueEn: 'Make one substance enter a solution.',
    },
    {
      zh: '盐已溶于水，沙不溶',
      en: 'Salt is dissolved; sand is insoluble',
      icon: '◌ ≋',
      correct: 'filter',
      clueZh: '现在可以利用颗粒大小差异。',
      clueEn: 'Now use the difference in particle size.',
    },
    {
      zh: '滤液是盐水',
      en: 'The filtrate is salt solution',
      icon: '≋',
      correct: 'evaporate',
      clueZh: '最后利用水容易汽化的性质。',
      clueEn: 'Finally use water’s ability to vaporise.',
    },
    {
      zh: '铁、沙、盐分别取回',
      en: 'Iron, sand and salt are recovered',
      icon: '✓  ✓  ✓',
      correct: 'done',
      clueZh: '四种方法接力，完成分离。',
      clueEn: 'Four methods worked together to finish the separation.',
    },
  ];
  const methods = [
    { id: 'magnet', zh: '用磁铁', en: 'Use magnet' },
    { id: 'water', zh: '加水溶解', en: 'Add water' },
    { id: 'filter', zh: '过滤', en: 'Filter' },
    { id: 'evaporate', zh: '蒸发结晶', en: 'Evaporate' },
  ];
  const [stage, setStage] = useState(0);
  const [message, setMessage] = useState<'correct' | 'wrong' | null>(null);
  const current = stages[stage]!;

  return (
    <div className="separation-lab">
      <div className="separation-sample">
        <span>
          {mode === 'en' ? `STEP ${stage + 1}` : `第 ${stage + 1} 步`}
        </span>
        <div aria-hidden="true">{current.icon}</div>
        <h3>{mode === 'en' ? current.en : current.zh}</h3>
        <p>{mode === 'en' ? current.clueEn : current.clueZh}</p>
      </div>
      {stage < stages.length - 1 ? (
        <div className="method-panel">
          <strong>
            {mode === 'en' ? 'Choose the next move' : '选择下一步'}
          </strong>
          <div>
            {methods.map((method) => (
              <button
                type="button"
                key={method.id}
                onClick={() => {
                  if (method.id === current.correct) {
                    setStage((value) => value + 1);
                    setMessage('correct');
                  } else {
                    setMessage('wrong');
                  }
                }}
              >
                {mode === 'en' ? method.en : method.zh}
              </button>
            ))}
          </div>
          {message && (
            <p className={message}>
              {message === 'correct'
                ? mode === 'en'
                  ? 'Good match—the method uses a real property difference.'
                  : '选择合理——这种方法利用了真实的性质差异。'
                : mode === 'en'
                  ? 'That method cannot separate the substances at this stage. Use the clue.'
                  : '这个阶段无法用该方法分开物质，再看看线索。'}
            </p>
          )}
        </div>
      ) : (
        <button
          type="button"
          className="restart-lab"
          onClick={() => {
            setStage(0);
            setMessage(null);
          }}
        >
          {mode === 'en' ? 'Run the separation again ↻' : '重新完成一次 ↻'}
        </button>
      )}
    </div>
  );
}

function ElementGallery({ mode }: { mode: LanguageMode }) {
  const elements = [
    {
      symbol: 'C',
      zh: '碳',
      en: 'Carbon',
      number: 6,
      objectZh: '铅笔芯、钻石、生命分子',
      objectEn: 'Pencil cores, diamonds, molecules of life',
      colour: '#343d3c',
    },
    {
      symbol: 'O',
      zh: '氧',
      en: 'Oxygen',
      number: 8,
      objectZh: '呼吸、燃烧和水的一部分',
      objectEn: 'Breathing, burning and part of water',
      colour: '#df8268',
    },
    {
      symbol: 'Cu',
      zh: '铜',
      en: 'Copper',
      number: 29,
      objectZh: '电线、硬币和青铜的一部分',
      objectEn: 'Wires, coins and part of bronze',
      colour: '#bd724d',
    },
  ];
  const [selected, setSelected] = useState(0);
  const item = elements[selected]!;
  return (
    <div className="element-gallery">
      <div
        className="element-tile"
        style={{ '--element-colour': item.colour } as CSSProperties}
      >
        <span>{item.number}</span>
        <strong>{item.symbol}</strong>
        <b>{mode === 'en' ? item.en : item.zh}</b>
      </div>
      <div className="element-story">
        <p>{mode === 'en' ? item.objectEn : item.objectZh}</p>
        <div
          className="same-atoms"
          aria-label={
            mode === 'en' ? 'One atom type repeated' : '同一种原子重复出现'
          }
        >
          {Array.from({ length: 12 }, (_, index) => (
            <i key={index} style={{ background: item.colour }}>
              {item.symbol}
            </i>
          ))}
        </div>
        <small>
          {mode === 'en'
            ? 'Every circle has the same identity → one element'
            : '每个圆点身份相同 → 一种元素'}
        </small>
      </div>
      <div className="element-tabs">
        {elements.map((element, index) => (
          <button
            type="button"
            className={selected === index ? 'active' : ''}
            key={element.symbol}
            onClick={() => setSelected(index)}
          >
            {element.symbol} · {mode === 'en' ? element.en : element.zh}
          </button>
        ))}
      </div>
    </div>
  );
}

function AtomDot({ kind, label }: { kind: 'a' | 'b'; label: string }) {
  return <i className={`atom-dot atom-${kind}`}>{label}</i>;
}

function CompoundBuilder({ mode }: { mode: LanguageMode }) {
  const compounds = [
    {
      formula: 'H₂O',
      zh: '水',
      en: 'Water',
      a: 2,
      b: 1,
      aLabel: 'H',
      bLabel: 'O',
      noteZh: '2 个氢 + 1 个氧，固定组成每个水粒子。',
      noteEn: '2 hydrogen + 1 oxygen in every water particle.',
    },
    {
      formula: 'CO₂',
      zh: '二氧化碳',
      en: 'Carbon dioxide',
      a: 1,
      b: 2,
      aLabel: 'C',
      bLabel: 'O',
      noteZh: '1 个碳 + 2 个氧，组成呼出气体的一部分。',
      noteEn: '1 carbon + 2 oxygen, part of exhaled air.',
    },
    {
      formula: 'NaCl',
      zh: '氯化钠',
      en: 'Sodium chloride',
      a: 1,
      b: 1,
      aLabel: 'Na',
      bLabel: 'Cl',
      noteZh: '钠与氯按 1:1 组成晶体，不再保留单质性质。',
      noteEn: 'Sodium and chlorine form a 1:1 crystal with new properties.',
    },
  ];
  const [selected, setSelected] = useState(0);
  const item = compounds[selected]!;
  return (
    <div className="compound-builder">
      <div className="formula-stage">
        <span>{mode === 'en' ? 'CHEMICAL RECIPE' : '化学配方'}</span>
        <strong>{item.formula}</strong>
        <div className="molecule-model" aria-label={item.formula}>
          {Array.from({ length: item.a }, (_, index) => (
            <AtomDot key={`a-${index}`} kind="a" label={item.aLabel} />
          ))}
          {Array.from({ length: item.b }, (_, index) => (
            <AtomDot key={`b-${index}`} kind="b" label={item.bLabel} />
          ))}
        </div>
      </div>
      <div className="compound-story">
        <h3>{mode === 'en' ? item.en : item.zh}</h3>
        <p>{mode === 'en' ? item.noteEn : item.noteZh}</p>
        <div>
          {compounds.map((compound, index) => (
            <button
              type="button"
              className={selected === index ? 'active' : ''}
              key={compound.formula}
              onClick={() => setSelected(index)}
            >
              {compound.formula}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ParticleClassifier({ mode }: { mode: LanguageMode }) {
  const samples = [
    {
      particles: [['a'], ['a'], ['a'], ['a'], ['a'], ['a']],
      answer: 'element',
      zh: '所有粒子都是同一种单原子',
      en: 'Every particle is the same single atom',
    },
    {
      particles: [
        ['a', 'a'],
        ['a', 'a'],
        ['a', 'a'],
        ['a', 'a'],
      ],
      answer: 'element',
      zh: '每个粒子有两个相同原子',
      en: 'Every particle has two identical atoms',
    },
    {
      particles: [
        ['a', 'b'],
        ['a', 'b'],
        ['a', 'b'],
        ['a', 'b'],
      ],
      answer: 'compound',
      zh: '每个相同粒子含两种原子',
      en: 'Each identical particle has two atom types',
    },
    {
      particles: [
        ['a', 'a'],
        ['a', 'b'],
        ['a', 'a'],
        ['a', 'b'],
      ],
      answer: 'mixture',
      zh: 'A₂ 与 AB 两种粒子同时存在',
      en: 'Two particle types, A₂ and AB, are present',
    },
  ] as const;
  const [sampleIndex, setSampleIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const sample = samples[sampleIndex]!;
  const choices = [
    { id: 'element', zh: '元素', en: 'Element' },
    { id: 'compound', zh: '化合物', en: 'Compound' },
    { id: 'mixture', zh: '混合物', en: 'Mixture' },
  ];
  const correct = choice === sample.answer;
  return (
    <div className="classifier-lab">
      <div className="particle-card">
        <span>
          {mode === 'en'
            ? `SAMPLE ${sampleIndex + 1}`
            : `样品 ${sampleIndex + 1}`}
        </span>
        <div>
          {sample.particles.map((particle, particleIndex) => (
            <b className="particle-token" key={particleIndex}>
              {particle.map((atom, atomIndex) => (
                <AtomDot
                  key={atomIndex}
                  kind={atom as 'a' | 'b'}
                  label={atom.toUpperCase()}
                />
              ))}
            </b>
          ))}
        </div>
      </div>
      <div className="classifier-answer">
        <strong>
          {mode === 'en' ? 'What is in the bottle?' : '瓶中装的是什么？'}
        </strong>
        <div>
          {choices.map((item) => (
            <button
              type="button"
              className={choice === item.id ? 'selected' : ''}
              key={item.id}
              onClick={() => setChoice(item.id)}
            >
              {mode === 'en' ? item.en : item.zh}
            </button>
          ))}
        </div>
        {choice && (
          <p className={correct ? 'correct' : 'wrong'}>
            <b>
              {correct
                ? mode === 'en'
                  ? 'Correct. '
                  : '判断正确。'
                : mode === 'en'
                  ? 'Look again. '
                  : '再观察一次。'}
            </b>
            {mode === 'en' ? sample.en : sample.zh}
          </p>
        )}
        {correct && (
          <button
            type="button"
            className="next-sample"
            onClick={() => {
              setSampleIndex((value) => (value + 1) % samples.length);
              setChoice(null);
            }}
          >
            {mode === 'en' ? 'Next sample →' : '下一个样品 →'}
          </button>
        )}
      </div>
    </div>
  );
}

function AtomZoom({ mode }: { mode: LanguageMode }) {
  const stops = [
    {
      labelZh: '一粒沙',
      labelEn: 'A grain of sand',
      value: 0,
      noteZh: '由数量惊人的原子组合而成。',
      noteEn: 'Built from an astonishing number of atoms.',
    },
    {
      labelZh: '一根头发宽度',
      labelEn: 'A hair’s width',
      value: 33,
      noteZh: '大约可排下数十万个原子。',
      noteEn: 'Roughly hundreds of thousands of atoms can fit across.',
    },
    {
      labelZh: '一个原子',
      labelEn: 'One atom',
      value: 66,
      noteZh: '化学身份由核内质子数决定。',
      noteEn: 'Chemical identity comes from nucleus proton count.',
    },
    {
      labelZh: '原子核',
      labelEn: 'The nucleus',
      value: 100,
      noteZh: '很小，却集中了几乎全部质量。',
      noteEn: 'Tiny, but home to almost all the mass.',
    },
  ];
  const [zoom, setZoom] = useState(0);
  const selected = stops.reduce(
    (closest, stop) =>
      Math.abs(stop.value - zoom) < Math.abs(closest.value - zoom)
        ? stop
        : closest,
    stops[0]!,
  );
  const inAtom = zoom >= 55;
  return (
    <div className="atom-zoom-lab">
      <div className={`zoom-scene ${inAtom ? 'in-atom' : ''}`}>
        {!inAtom ? (
          <div className="zoom-material" aria-hidden="true">
            {Array.from({ length: 55 }, (_, index) => (
              <i key={index} />
            ))}
          </div>
        ) : (
          <div className="zoom-atom" aria-hidden="true">
            <span className="electron-path path-a">
              <i>e⁻</i>
            </span>
            <span className="electron-path path-b">
              <i>e⁻</i>
            </span>
            <b className="zoom-nucleus">
              p⁺<em>n⁰</em>
            </b>
          </div>
        )}
        <span className="zoom-label">
          {mode === 'en' ? selected.labelEn : selected.labelZh}
        </span>
      </div>
      <div className="zoom-controls">
        <label htmlFor="atom-zoom">
          {mode === 'en' ? 'Zoom inward' : '向内放大'}
          <strong>{zoom}%</strong>
        </label>
        <input
          id="atom-zoom"
          type="range"
          min="0"
          max="100"
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
        />
        <div className="zoom-stops">
          {stops.map((stop) => (
            <button
              type="button"
              key={stop.value}
              className={selected.value === stop.value ? 'active' : ''}
              onClick={() => setZoom(stop.value)}
            >
              {mode === 'en' ? stop.labelEn : stop.labelZh}
            </button>
          ))}
        </div>
        <p>{mode === 'en' ? selected.noteEn : selected.noteZh}</p>
      </div>
    </div>
  );
}

function ProtonID({ mode }: { mode: LanguageMode }) {
  const elements = [
    {
      count: 1,
      symbol: 'H',
      zh: '氢',
      en: 'Hydrogen',
      useZh: '水和燃料的一部分',
      useEn: 'Part of water and fuels',
    },
    {
      count: 6,
      symbol: 'C',
      zh: '碳',
      en: 'Carbon',
      useZh: '生命分子和铅笔芯',
      useEn: 'Life molecules and pencil cores',
    },
    {
      count: 7,
      symbol: 'N',
      zh: '氮',
      en: 'Nitrogen',
      useZh: '空气的主要成分',
      useEn: 'Most of the air',
    },
    {
      count: 8,
      symbol: 'O',
      zh: '氧',
      en: 'Oxygen',
      useZh: '呼吸和燃烧',
      useEn: 'Breathing and burning',
    },
    {
      count: 11,
      symbol: 'Na',
      zh: '钠',
      en: 'Sodium',
      useZh: '食盐的一部分',
      useEn: 'Part of table salt',
    },
  ];
  const [protons, setProtons] = useState(6);
  const element = elements.find((item) => item.count === protons);
  const dots = Array.from({ length: protons }, (_, index) => index);
  return (
    <div className="proton-lab">
      <div
        className="proton-nucleus"
        aria-label={mode === 'en' ? `${protons} protons` : `${protons} 个质子`}
      >
        {dots.map((index) => (
          <i key={index}>p⁺</i>
        ))}
      </div>
      <div className="proton-controls">
        <label htmlFor="proton-count">
          {mode === 'en' ? 'Protons in the nucleus' : '原子核中的质子'}
          <strong>{protons}</strong>
        </label>
        <input
          id="proton-count"
          type="range"
          min="1"
          max="12"
          value={protons}
          onChange={(event) => setProtons(Number(event.target.value))}
        />
        {element ? (
          <div className="identity-card">
            <span>{mode === 'en' ? 'ELEMENT ID' : '元素身份证'}</span>
            <b>{element.symbol}</b>
            <strong>{mode === 'en' ? element.en : element.zh}</strong>
            <p>{mode === 'en' ? element.useEn : element.useZh}</p>
          </div>
        ) : (
          <div className="identity-card unknown">
            <span>{mode === 'en' ? 'ELEMENT ID' : '元素身份证'}</span>
            <b>?</b>
            <strong>
              {mode === 'en' ? 'Try 1, 6, 7, 8 or 11' : '试试 1、6、7、8 或 11'}
            </strong>
            <p>
              {mode === 'en'
                ? 'Every whole proton count maps to one element.'
                : '每个整数质子数都对应一种元素。'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function NeutronMass({ mode }: { mode: LanguageMode }) {
  const [neutrons, setNeutrons] = useState(6);
  const protons = 6;
  const mass = protons + neutrons;
  return (
    <div className="nuclear-lab">
      <div className="isotope-stage">
        <div
          className="isotope-nucleus"
          aria-label={
            mode === 'en'
              ? `6 protons and ${neutrons} neutrons`
              : `6 个质子和 ${neutrons} 个中子`
          }
        >
          {Array.from({ length: protons }, (_, index) => (
            <i key={`p-${index}`} className="proton">
              p⁺
            </i>
          ))}
          {Array.from({ length: neutrons }, (_, index) => (
            <i key={`n-${index}`} className="neutron">
              n⁰
            </i>
          ))}
        </div>
        <div className="isotope-name">
          <b>
            <sup>{mass}</sup>C
          </b>
          <strong>{mode === 'en' ? 'Carbon isotope' : '碳的同位素'}</strong>
        </div>
      </div>
      <div className="isotope-controls">
        <div className="nuclear-stat">
          <span>{mode === 'en' ? 'Protons' : '质子'}</span>
          <strong>6</strong>
          <small>{mode === 'en' ? 'identity: carbon' : '身份：碳'}</small>
        </div>
        <label htmlFor="neutron-count">
          {mode === 'en' ? 'Neutrons' : '中子'}
          <strong>{neutrons}</strong>
        </label>
        <input
          id="neutron-count"
          type="range"
          min="5"
          max="9"
          value={neutrons}
          onChange={(event) => setNeutrons(Number(event.target.value))}
        />
        <div className="mass-equation">
          <span>{mode === 'en' ? 'Mass number' : '质量数'}</span>
          <b>{protons}</b>
          <i>+</i>
          <b>{neutrons}</b>
          <i>=</i>
          <strong>{mass}</strong>
        </div>
        <p>
          {mode === 'en'
            ? `This is carbon-${mass}: it stays carbon because it still has 6 protons.`
            : `这是碳-${mass}：它仍是碳，因为质子数仍然是 6。`}
        </p>
      </div>
    </div>
  );
}

function ElectronCharge({ mode }: { mode: LanguageMode }) {
  const protons = 8;
  const [electrons, setElectrons] = useState(8);
  const charge = protons - electrons;
  const description =
    charge === 0
      ? mode === 'en'
        ? 'Neutral oxygen atom'
        : '中性氧原子'
      : charge > 0
        ? mode === 'en'
          ? `Positive oxygen ion (${charge}+)`
          : `带 ${charge}+ 电的氧离子`
        : mode === 'en'
          ? `Negative oxygen ion (${Math.abs(charge)}−)`
          : `带 ${Math.abs(charge)}− 电的氧离子`;
  return (
    <div className="electron-lab">
      <div className="charge-atom" aria-label={description}>
        <span className="charge-shell shell-one">
          {Array.from({ length: Math.min(electrons, 2) }, (_, index) => (
            <i key={`a-${index}`}>e⁻</i>
          ))}
        </span>
        <span className="charge-shell shell-two">
          {Array.from({ length: Math.max(0, electrons - 2) }, (_, index) => (
            <i key={`b-${index}`}>e⁻</i>
          ))}
        </span>
        <b>8 p⁺</b>
        <strong>
          {charge === 0
            ? '0'
            : charge > 0
              ? `${charge}+`
              : `${Math.abs(charge)}−`}
        </strong>
      </div>
      <div className="charge-controls">
        <div className="charge-row">
          <span>{mode === 'en' ? 'Protons' : '质子'}</span>
          <b>8</b>
          <em>+</em>
        </div>
        <label htmlFor="electron-count">
          {mode === 'en' ? 'Electrons' : '电子'}
          <strong>{electrons}</strong>
        </label>
        <input
          id="electron-count"
          type="range"
          min="6"
          max="10"
          value={electrons}
          onChange={(event) => setElectrons(Number(event.target.value))}
        />
        <div className="charge-result">
          <span>{mode === 'en' ? 'Overall charge' : '整体电荷'}</span>
          <strong>
            {charge === 0
              ? '0'
              : charge > 0
                ? `${charge}+`
                : `${Math.abs(charge)}−`}
          </strong>
        </div>
        <p>
          {description}.{' '}
          {mode === 'en'
            ? 'The proton count stays 8, so the element is still oxygen.'
            : '质子数仍为 8，因此元素身份仍是氧。'}
        </p>
      </div>
    </div>
  );
}

function AtomicNumberMap({ mode }: { mode: LanguageMode }) {
  const elements = [
    { number: 1, symbol: 'H', zh: '氢', en: 'Hydrogen', tone: 'sky' },
    { number: 6, symbol: 'C', zh: '碳', en: 'Carbon', tone: 'ink' },
    { number: 7, symbol: 'N', zh: '氮', en: 'Nitrogen', tone: 'violet' },
    { number: 8, symbol: 'O', zh: '氧', en: 'Oxygen', tone: 'coral' },
    { number: 11, symbol: 'Na', zh: '钠', en: 'Sodium', tone: 'gold' },
    { number: 17, symbol: 'Cl', zh: '氯', en: 'Chlorine', tone: 'mint' },
  ];
  const [selectedNumber, setSelectedNumber] = useState(8);
  const element = elements.find((item) => item.number === selectedNumber)!;

  return (
    <div className="atomic-number-lab">
      <div
        className="number-map"
        aria-label={mode === 'en' ? 'Element number map' : '元素数字地图'}
      >
        <span className="map-caption">
          {mode === 'en' ? 'Tap an address' : '点一个门牌号'}
        </span>
        <div className="number-tiles">
          {elements.map((item) => (
            <button
              type="button"
              key={item.symbol}
              className={`${item.tone} ${item.number === selectedNumber ? 'active' : ''}`}
              onClick={() => setSelectedNumber(item.number)}
              aria-pressed={item.number === selectedNumber}
            >
              <small>{item.number}</small>
              <b>{item.symbol}</b>
            </button>
          ))}
        </div>
      </div>
      <div className="number-decoder">
        <p>{mode === 'en' ? 'READ THE ELEMENT CARD' : '读懂元素卡片'}</p>
        <div className={`element-address ${element.tone}`}>
          <strong>{element.number}</strong>
          <span>{element.symbol}</span>
          <b>{mode === 'en' ? element.en : element.zh}</b>
        </div>
        <div
          className="number-chain"
          aria-label={
            mode === 'en' ? 'Atomic number meaning' : '原子序数的含义'
          }
        >
          <span>{mode === 'en' ? 'atomic number' : '原子序数'}</span>
          <i>＝</i>
          <strong>{element.number}</strong>
          <i>＝</i>
          <span>{mode === 'en' ? 'protons' : '质子数'}</span>
        </div>
        <p className="number-note">
          {mode === 'en'
            ? `${element.symbol} always has ${element.number} protons. Change that number and you land at another element.`
            : `${element.symbol} 永远有 ${element.number} 个质子；改变这个数字，就会走到另一种元素。`}
        </p>
      </div>
    </div>
  );
}

function MassNumberCalc({ mode }: { mode: LanguageMode }) {
  const protons = 11;
  const [neutrons, setNeutrons] = useState(12);
  const mass = protons + neutrons;
  return (
    <div className="mass-number-lab">
      <div className="mass-card">
        <span>{mode === 'en' ? 'NUCLEUS SNAPSHOT' : '原子核快照'}</span>
        <div
          className="mass-symbol"
          aria-label={mode === 'en' ? `Sodium ${mass}` : `钠 ${mass}`}
        >
          <sup>{mass}</sup>
          <sub>{protons}</sub>
          <b>Na</b>
        </div>
        <p>
          {mode === 'en'
            ? 'Sodium: 11 protons fixes the identity.'
            : '钠：11 个质子锁定元素身份。'}
        </p>
      </div>
      <div className="mass-controls">
        <div className="mass-counts">
          <span>
            <b>{protons}</b>
            {mode === 'en' ? 'protons' : '个质子'}
          </span>
          <i>+</i>
          <span>
            <b>{neutrons}</b>
            {mode === 'en' ? 'neutrons' : '个中子'}
          </span>
          <i>＝</i>
          <strong>{mass}</strong>
        </div>
        <label htmlFor="mass-neutron-count">
          {mode === 'en' ? 'Adjust the neutron count' : '调整中子数量'}
          <strong>{neutrons}</strong>
        </label>
        <input
          id="mass-neutron-count"
          type="range"
          min="10"
          max="14"
          value={neutrons}
          onChange={(event) => setNeutrons(Number(event.target.value))}
        />
        <div className="mass-answer">
          <span>{mode === 'en' ? 'Mass number' : '质量数'}</span>
          <b>{mass}</b>
          <p>
            {mode === 'en'
              ? `${protons} + ${neutrons} = ${mass}. Electrons are not counted here because their mass is tiny.`
              : `${protons} + ${neutrons} = ${mass}。这里不计电子，因为电子的质量极小。`}
          </p>
        </div>
      </div>
    </div>
  );
}

function IsotopeDetective({ mode }: { mode: LanguageMode }) {
  const atoms = [
    { id: 'A', protons: 6, neutrons: 6 },
    { id: 'B', protons: 6, neutrons: 8 },
    { id: 'C', protons: 7, neutrons: 7 },
  ];
  const [choice, setChoice] = useState<string | null>(null);
  const correct = choice === 'AB';
  const explanation =
    choice === 'AB'
      ? mode === 'en'
        ? 'Exactly: A and B both have 6 protons (carbon), but their neutron counts differ.'
        : '正确：A、B 都有 6 个质子（都是碳），但中子数不同。'
      : mode === 'en'
        ? 'Look for same protons and different neutrons. A different proton count means a different element.'
        : '寻找“质子数相同、中子数不同”。质子数不同，就已经是不同元素。';
  return (
    <div className="isotope-detective-lab">
      <div className="isotope-brief">
        <span>⌕</span>
        <p>
          {mode === 'en'
            ? 'Detective rule: first compare protons. Then compare neutrons.'
            : '侦探口诀：先比质子数，再比中子数。'}
        </p>
      </div>
      <div className="isotope-id-grid">
        {atoms.map((atom) => (
          <article key={atom.id}>
            <b>Atom {atom.id}</b>
            <span>
              {mode === 'en' ? 'protons' : '质子'}{' '}
              <strong>{atom.protons}</strong>
            </span>
            <span>
              {mode === 'en' ? 'neutrons' : '中子'}{' '}
              <strong>{atom.neutrons}</strong>
            </span>
            <small>
              {mode === 'en' ? 'mass' : '质量数'} {atom.protons + atom.neutrons}
            </small>
          </article>
        ))}
      </div>
      <div className="isotope-choice">
        <strong>
          {mode === 'en' ? 'Which pair are isotopes?' : '哪一对互为同位素？'}
        </strong>
        <div>
          {['AB', 'AC', 'BC'].map((pair) => (
            <button
              type="button"
              key={pair}
              className={choice === pair ? (correct ? 'correct' : 'wrong') : ''}
              onClick={() => setChoice(pair)}
            >
              {pair[0]} + {pair[1]}
            </button>
          ))}
        </div>
        {choice && (
          <p className={correct ? 'correct' : 'wrong'}>{explanation}</p>
        )}
      </div>
    </div>
  );
}

function IonTransfer({ mode }: { mode: LanguageMode }) {
  const [transferred, setTransferred] = useState(false);
  return (
    <div className={`ion-transfer-lab ${transferred ? 'transferred' : ''}`}>
      <div className="ion-scene" aria-live="polite">
        <div className="ion-atom sodium">
          <span className="ion-symbol">Na</span>
          <b>{transferred ? 'Na⁺' : 'Na'}</b>
          <small>
            {transferred
              ? mode === 'en'
                ? '11p · 10e'
                : '11质子 · 10电子'
              : mode === 'en'
                ? '11p · 11e'
                : '11质子 · 11电子'}
          </small>
        </div>
        <div className="electron-flight" aria-hidden="true">
          e⁻
        </div>
        <div className="ion-atom chlorine">
          <span className="ion-symbol">Cl</span>
          <b>{transferred ? 'Cl⁻' : 'Cl'}</b>
          <small>
            {transferred
              ? mode === 'en'
                ? '17p · 18e'
                : '17质子 · 18电子'
              : mode === 'en'
                ? '17p · 17e'
                : '17质子 · 17电子'}
          </small>
        </div>
        {transferred && (
          <i className="attraction-line" aria-hidden="true">
            ↔
          </i>
        )}
      </div>
      <div className="ion-controls">
        <p className="ion-state-label">
          {transferred
            ? mode === 'en'
              ? 'One electron has moved from Na to Cl.'
              : '一颗电子已从 Na 转移到 Cl。'
            : mode === 'en'
              ? 'Both atoms begin neutral. Send Na’s outer electron across.'
              : '两个原子一开始都中性。把 Na 的最外层电子送过去。'}
        </p>
        <button type="button" onClick={() => setTransferred((value) => !value)}>
          {transferred
            ? mode === 'en'
              ? 'Reset the model'
              : '重置模型'
            : mode === 'en'
              ? 'Move one electron →'
              : '转移一颗电子 →'}
        </button>
        <div className="ion-explanation">
          <span>{mode === 'en' ? 'What changed?' : '什么改变了？'}</span>
          <p>
            {transferred
              ? mode === 'en'
                ? 'Only electron numbers changed. Na is now positive, Cl negative, and opposite charges pull together.'
                : '改变的只有电子数。Na 现在带正电，Cl 带负电，异号电荷会彼此吸引。'
              : mode === 'en'
                ? 'For every neutral atom, protons and electrons balance. The next step will unbalance both in opposite directions.'
                : '中性原子的质子数与电子数相等。下一步会让两者朝相反方向失去平衡。'}
          </p>
        </div>
      </div>
    </div>
  );
}

function PeriodicTableExplorer({ mode }: { mode: LanguageMode }) {
  const elements = [
    {
      symbol: 'H',
      number: 1,
      zh: '氢',
      en: 'Hydrogen',
      group: 1,
      period: 1,
      column: 1,
      kind: 'nonmetal',
      useZh: '水和燃料的一部分',
      useEn: 'Part of water and fuels',
    },
    {
      symbol: 'He',
      number: 2,
      zh: '氦',
      en: 'Helium',
      group: 18,
      period: 1,
      column: 8,
      kind: 'noble',
      useZh: '气球和低温设备',
      useEn: 'Balloons and cold equipment',
    },
    {
      symbol: 'Li',
      number: 3,
      zh: '锂',
      en: 'Lithium',
      group: 1,
      period: 2,
      column: 1,
      kind: 'metal',
      useZh: '可充电电池',
      useEn: 'Rechargeable batteries',
    },
    {
      symbol: 'C',
      number: 6,
      zh: '碳',
      en: 'Carbon',
      group: 14,
      period: 2,
      column: 4,
      kind: 'nonmetal',
      useZh: '生命和铅笔芯',
      useEn: 'Life and pencil cores',
    },
    {
      symbol: 'N',
      number: 7,
      zh: '氮',
      en: 'Nitrogen',
      group: 15,
      period: 2,
      column: 5,
      kind: 'nonmetal',
      useZh: '空气的大部分',
      useEn: 'Most of the air',
    },
    {
      symbol: 'O',
      number: 8,
      zh: '氧',
      en: 'Oxygen',
      group: 16,
      period: 2,
      column: 6,
      kind: 'nonmetal',
      useZh: '呼吸和燃烧',
      useEn: 'Breathing and burning',
    },
    {
      symbol: 'Ne',
      number: 10,
      zh: '氖',
      en: 'Neon',
      group: 18,
      period: 2,
      column: 8,
      kind: 'noble',
      useZh: '霓虹灯的光',
      useEn: 'Neon-sign glow',
    },
    {
      symbol: 'Na',
      number: 11,
      zh: '钠',
      en: 'Sodium',
      group: 1,
      period: 3,
      column: 1,
      kind: 'metal',
      useZh: '食盐的一部分',
      useEn: 'Part of table salt',
    },
    {
      symbol: 'Mg',
      number: 12,
      zh: '镁',
      en: 'Magnesium',
      group: 2,
      period: 3,
      column: 2,
      kind: 'metal',
      useZh: '运动和植物叶绿素',
      useEn: 'Movement and leaf chlorophyll',
    },
    {
      symbol: 'Si',
      number: 14,
      zh: '硅',
      en: 'Silicon',
      group: 14,
      period: 3,
      column: 4,
      kind: 'metalloid',
      useZh: '电脑芯片',
      useEn: 'Computer chips',
    },
    {
      symbol: 'Cl',
      number: 17,
      zh: '氯',
      en: 'Chlorine',
      group: 17,
      period: 3,
      column: 7,
      kind: 'nonmetal',
      useZh: '食盐和泳池消毒',
      useEn: 'Salt and pool treatment',
    },
    {
      symbol: 'Ar',
      number: 18,
      zh: '氩',
      en: 'Argon',
      group: 18,
      period: 3,
      column: 8,
      kind: 'noble',
      useZh: '灯泡和焊接保护气',
      useEn: 'Bulbs and welding shields',
    },
  ];
  const [selectedSymbol, setSelectedSymbol] = useState('O');
  const selected = elements.find(
    (element) => element.symbol === selectedSymbol,
  )!;
  const typeLabel = {
    metal: { zh: '金属', en: 'metal' },
    nonmetal: { zh: '非金属', en: 'non-metal' },
    metalloid: { zh: '类金属', en: 'metalloid' },
    noble: { zh: '稀有气体', en: 'noble gas' },
  }[selected.kind] ?? { zh: '元素', en: 'element' };
  return (
    <div className="periodic-explorer">
      <div className="periodic-map-wrap">
        <div className="periodic-map-caption">
          <span>
            {mode === 'en'
              ? 'A small, readable slice of the table'
              : '先读懂周期表的一小部分'}
          </span>
          <b>{mode === 'en' ? 'Group →' : '族 →'}</b>
        </div>
        <div
          className="periodic-map"
          aria-label={
            mode === 'en' ? 'Interactive periodic table' : '可互动的元素周期表'
          }
        >
          {elements.map((element) => (
            <button
              type="button"
              key={element.symbol}
              className={`${element.kind} ${selectedSymbol === element.symbol ? 'active' : ''}`}
              style={
                {
                  gridColumn: element.column,
                  gridRow: element.period,
                } as CSSProperties
              }
              onClick={() => setSelectedSymbol(element.symbol)}
              aria-pressed={selectedSymbol === element.symbol}
              aria-label={`${element.number} ${element.symbol}`}
            >
              <small>{element.number}</small>
              <strong>{element.symbol}</strong>
            </button>
          ))}
        </div>
        <p className="periodic-legend">
          <span className="metal">{mode === 'en' ? 'metal' : '金属'}</span>
          <span className="nonmetal">
            {mode === 'en' ? 'non-metal' : '非金属'}
          </span>
          <span className="noble">
            {mode === 'en' ? 'noble gas' : '稀有气体'}
          </span>
        </p>
      </div>
      <div className="element-inspector">
        <p>{mode === 'en' ? 'READ THIS SQUARE' : '读懂这个格子'}</p>
        <div className={`inspector-symbol ${selected.kind}`}>
          <small>{selected.number}</small>
          <b>{selected.symbol}</b>
          <strong>{mode === 'en' ? selected.en : selected.zh}</strong>
        </div>
        <div className="element-position">
          <span>
            {mode === 'en' ? 'Group' : '第几族'} <b>{selected.group}</b>
          </span>
          <span>
            {mode === 'en' ? 'Period' : '第几周期'} <b>{selected.period}</b>
          </span>
          <span>
            {mode === 'en' ? 'Type' : '类别'}{' '}
            <b>{mode === 'en' ? typeLabel.en : typeLabel.zh}</b>
          </span>
        </div>
        <p className="element-use">
          {mode === 'en'
            ? `${selected.symbol} appears in: ${selected.useEn}.`
            : `${selected.symbol} 能在生活中找到：${selected.useZh}。`}
        </p>
      </div>
    </div>
  );
}

function GroupFamilyMatch({ mode }: { mode: LanguageMode }) {
  const rounds = [
    {
      symbol: 'Na',
      zh: '钠',
      en: 'Sodium',
      group: 1,
      clueZh: '最外层有 1 个电子，常形成 +1 离子。',
      clueEn: 'One outer electron; often makes a +1 ion.',
      choices: [
        { id: 'K', zh: 'K · 钾', en: 'K · Potassium', correct: true },
        { id: 'Cl', zh: 'Cl · 氯', en: 'Cl · Chlorine', correct: false },
        { id: 'Ne', zh: 'Ne · 氖', en: 'Ne · Neon', correct: false },
      ],
    },
    {
      symbol: 'Cl',
      zh: '氯',
      en: 'Chlorine',
      group: 17,
      clueZh: '最外层有 7 个电子，常得到 1 个电子。',
      clueEn: 'Seven outer electrons; often gains one electron.',
      choices: [
        { id: 'Na', zh: 'Na · 钠', en: 'Na · Sodium', correct: false },
        { id: 'Br', zh: 'Br · 溴', en: 'Br · Bromine', correct: true },
        { id: 'Ar', zh: 'Ar · 氩', en: 'Ar · Argon', correct: false },
      ],
    },
    {
      symbol: 'Ne',
      zh: '氖',
      en: 'Neon',
      group: 18,
      clueZh: '最外层电子层已满，因此通常不活泼。',
      clueEn: 'Its outer shell is full, so it is usually unreactive.',
      choices: [
        { id: 'He', zh: 'He · 氦', en: 'He · Helium', correct: true },
        { id: 'O', zh: 'O · 氧', en: 'O · Oxygen', correct: false },
        { id: 'Mg', zh: 'Mg · 镁', en: 'Mg · Magnesium', correct: false },
      ],
    },
  ];
  const [roundIndex, setRoundIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const round = rounds[roundIndex]!;
  const selected = round.choices.find((item) => item.id === choice);
  const correct = selected?.correct;
  return (
    <div className="group-match-lab">
      <div className="family-card">
        <span>{mode === 'en' ? 'FIND A FAMILY MEMBER' : '找同一家族成员'}</span>
        <b>{round.symbol}</b>
        <strong>{mode === 'en' ? round.en : round.zh}</strong>
        <p>{mode === 'en' ? `Group ${round.group}` : `第 ${round.group} 族`}</p>
        <small>{mode === 'en' ? round.clueEn : round.clueZh}</small>
      </div>
      <div className="family-choices">
        <strong>
          {mode === 'en'
            ? 'Which one belongs in the same group?'
            : '哪一个与它在同一族？'}
        </strong>
        <div>
          {round.choices.map((item) => (
            <button
              type="button"
              key={item.id}
              className={
                choice === item.id ? (correct ? 'correct' : 'wrong') : ''
              }
              onClick={() => setChoice(item.id)}
            >
              {mode === 'en' ? item.en : item.zh}
            </button>
          ))}
        </div>
        {choice && (
          <p className={correct ? 'correct' : 'wrong'}>
            <b>
              {correct
                ? mode === 'en'
                  ? 'Same family. '
                  : '找对了。'
                : mode === 'en'
                  ? 'Check the column. '
                  : '再看看竖列。'}
            </b>
            {correct
              ? mode === 'en'
                ? `${round.symbol} and ${selected?.id} share Group ${round.group}, so their outer-electron patterns are similar.`
                : `${round.symbol} 与 ${selected?.id} 都在第 ${round.group} 族，最外层电子规律相近。`
              : mode === 'en'
                ? 'Same group means same vertical column, not simply a nearby element.'
                : '同一族指同一竖列，不只是位置靠近。'}
          </p>
        )}
        {correct && (
          <button
            type="button"
            className="family-next"
            onClick={() => {
              setRoundIndex((index) => (index + 1) % rounds.length);
              setChoice(null);
            }}
          >
            {mode === 'en' ? 'Try another family →' : '换一个家族 →'}
          </button>
        )}
      </div>
    </div>
  );
}

function PeriodShellViewer({ mode }: { mode: LanguageMode }) {
  const atoms = [
    {
      symbol: 'Li',
      zh: '锂',
      en: 'Lithium',
      period: 2,
      electrons: [2, 1],
      useZh: '可充电电池',
      useEn: 'rechargeable batteries',
    },
    {
      symbol: 'Na',
      zh: '钠',
      en: 'Sodium',
      period: 3,
      electrons: [2, 8, 1],
      useZh: '食盐的一部分',
      useEn: 'table salt',
    },
    {
      symbol: 'K',
      zh: '钾',
      en: 'Potassium',
      period: 4,
      electrons: [2, 8, 8, 1],
      useZh: '香蕉和人体电解质',
      useEn: 'bananas and body electrolytes',
    },
  ];
  const [activeIndex, setActiveIndex] = useState(1);
  const atom = atoms[activeIndex]!;
  return (
    <div className="period-shell-lab">
      <div
        className={`shell-atom shells-${atom.period}`}
        aria-label={
          mode === 'en'
            ? `${atom.symbol} with ${atom.period} electron shells`
            : `${atom.symbol} 有 ${atom.period} 层电子`
        }
      >
        {atom.electrons.map((count, shellIndex) => (
          <span
            className={`period-shell shell-${shellIndex + 1}`}
            key={shellIndex}
          >
            {Array.from({ length: count }, (_, electronIndex) => (
              <i key={electronIndex}>e⁻</i>
            ))}
          </span>
        ))}
        <b>{atom.symbol}</b>
      </div>
      <div className="period-shell-controls">
        <span>
          {mode === 'en'
            ? 'SAME GROUP 1, DIFFERENT PERIODS'
            : '同属第 1 族，不同周期'}
        </span>
        <div className="period-element-tabs">
          {atoms.map((item, index) => (
            <button
              type="button"
              key={item.symbol}
              className={index === activeIndex ? 'active' : ''}
              onClick={() => setActiveIndex(index)}
            >
              {item.symbol}
            </button>
          ))}
        </div>
        <div className="period-readout">
          <strong>
            {mode === 'en' ? atom.en : atom.zh} · {atom.symbol}
          </strong>
          <p>
            {mode === 'en'
              ? `Period ${atom.period} → ${atom.period} electron shells.`
              : `第 ${atom.period} 周期 → ${atom.period} 层电子活动区域。`}
          </p>
          <p>
            {mode === 'en'
              ? `Outer shell: 1 electron. You meet it in ${atom.useEn}.`
              : `最外层：1 个电子。生活中可在${atom.useZh}里遇见它。`}
          </p>
        </div>
        <p className="period-insight">
          {mode === 'en'
            ? 'Tap Li, Na and K: the outer pattern stays alike, while a new shell appears as you move down.'
            : '依次点 Li、Na、K：最外层规律相似，但向下会多出一层电子活动区域。'}
        </p>
      </div>
    </div>
  );
}

function MetalPropertyLab({ mode }: { mode: LanguageMode }) {
  const jobs = [
    {
      icon: '🔌',
      zh: '为房间送电的电线',
      en: 'A wire carrying power',
      property: 'conduct',
      answerZh: '它需要让电荷顺畅通过，还要能拉成细丝。',
      answerEn:
        'It must let charge move through and be drawn into a thin wire.',
    },
    {
      icon: '🍳',
      zh: '让食物受热的锅底',
      en: 'A pan base heating food',
      property: 'heat',
      answerZh: '它需要迅速传递热量，才能把炉火能量送进食物。',
      answerEn: 'It needs to pass heat quickly from the stove to the food.',
    },
    {
      icon: '🥫',
      zh: '压成薄薄包装层的铝箔',
      en: 'Aluminium foil pressed thin',
      property: 'shape',
      answerZh: '它需要容易压成薄片而不轻易碎裂。',
      answerEn: 'It needs to flatten into a sheet without easily breaking.',
    },
  ];
  const choices = [
    { id: 'conduct', zh: '导电', en: 'Conduct electricity' },
    { id: 'heat', zh: '导热', en: 'Conduct heat' },
    { id: 'shape', zh: '可压成薄片', en: 'Flatten into sheets' },
  ];
  const [jobIndex, setJobIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const job = jobs[jobIndex]!;
  const correct = choice === job.property;
  return (
    <div className="metal-property-lab">
      <div className="metal-job-tabs">
        {jobs.map((item, index) => (
          <button
            type="button"
            key={item.en}
            className={index === jobIndex ? 'active' : ''}
            onClick={() => {
              setJobIndex(index);
              setChoice(null);
            }}
          >
            <span>{item.icon}</span>
            {mode === 'en' ? item.en : item.zh}
          </button>
        ))}
      </div>
      <div className="metal-job-card">
        <span>{job.icon}</span>
        <div>
          <p>
            {mode === 'en' ? 'MATERIAL DESIGN CHALLENGE' : '材料设计小挑战'}
          </p>
          <strong>{mode === 'en' ? job.en : job.zh}</strong>
        </div>
      </div>
      <div className="metal-choice">
        <strong>
          {mode === 'en'
            ? 'Which metal property matters most here?'
            : '这里最需要哪种金属性质？'}
        </strong>
        <div>
          {choices.map((item) => (
            <button
              type="button"
              key={item.id}
              className={
                choice === item.id ? (correct ? 'correct' : 'wrong') : ''
              }
              onClick={() => setChoice(item.id)}
            >
              {mode === 'en' ? item.en : item.zh}
            </button>
          ))}
        </div>
        {choice && (
          <p className={correct ? 'correct' : 'wrong'}>
            <b>
              {correct
                ? mode === 'en'
                  ? 'Good material match. '
                  : '材料选对了。'
                : mode === 'en'
                  ? 'Try the job again. '
                  : '再想想它要完成的工作。'}
            </b>
            {correct
              ? mode === 'en'
                ? job.answerEn
                : job.answerZh
              : mode === 'en'
                ? 'Start with what must move: charge, heat, or the material’s shape.'
                : '先想想需要移动的是什么：电荷、热量，还是材料本身的形状。'}
          </p>
        )}
      </div>
    </div>
  );
}

function NonmetalEvidenceSort({ mode }: { mode: LanguageMode }) {
  const samples = [
    { symbol: 'O', nameZh: '氧', nameEn: 'Oxygen', clueZh: '空气中的气体；常与其他元素形成分子。', clueEn: 'A gas in air; often forms molecules with other elements.', answer: 'nonmetal', reasonZh: '氧位于周期表右侧，是非金属。', reasonEn: 'Oxygen sits on the right side of the periodic table and is a non-metal.' },
    { symbol: 'Cu', nameZh: '铜', nameEn: 'Copper', clueZh: '可拉成电线，导电良好。', clueEn: 'Can be drawn into wire and conducts well.', answer: 'metal', reasonZh: '这是典型金属的性质组合。', reasonEn: 'This is a classic combination of metal properties.' },
    { symbol: 'Si', nameZh: '硅', nameEn: 'Silicon', clueZh: '用于芯片；导电能力介于金属和非金属之间。', clueEn: 'Used in chips; its conductivity sits between metal and non-metal.', answer: 'metalloid', reasonZh: '硅是类金属，正是“不是非此即彼”的提醒。', reasonEn: 'Silicon is a metalloid—a reminder that categories are not always either-or.' },
  ];
  const labels = [
    { id: 'metal', zh: '金属', en: 'Metal' },
    { id: 'nonmetal', zh: '非金属', en: 'Non-metal' },
    { id: 'metalloid', zh: '类金属', en: 'Metalloid' },
  ];
  const [sampleIndex, setSampleIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const sample = samples[sampleIndex]!;
  const correct = choice === sample.answer;
  return (
    <div className="nonmetal-sort-lab">
      <div className={`evidence-sample ${sample.answer}`}>
        <span>{sample.symbol}</span>
        <div><strong>{mode === 'en' ? sample.nameEn : sample.nameZh}</strong><p>{mode === 'en' ? sample.clueEn : sample.clueZh}</p></div>
      </div>
      <div className="evidence-controls">
        <strong>{mode === 'en' ? 'Use the clues. Which label fits best?' : '用证据判断：最适合哪个标签？'}</strong>
        <div>
          {labels.map((label) => <button type="button" key={label.id} className={choice === label.id ? (correct ? 'correct' : 'wrong') : ''} onClick={() => setChoice(label.id)}>{mode === 'en' ? label.en : label.zh}</button>)}
        </div>
        {choice && <p className={correct ? 'correct' : 'wrong'}><b>{correct ? (mode === 'en' ? 'Evidence fits. ' : '证据吻合。') : mode === 'en' ? 'Not quite. ' : '还不完全对。'}</b>{mode === 'en' ? sample.reasonEn : sample.reasonZh}</p>}
        {correct && <button type="button" className="evidence-next" onClick={() => { setSampleIndex((index) => (index + 1) % samples.length); setChoice(null); }}>{mode === 'en' ? 'Next sample →' : '下一个样品 →'}</button>}
      </div>
    </div>
  );
}

function Interactive({ lesson, mode }: { lesson: Lesson; mode: LanguageMode }) {
  return (
    <section className="lesson-panel interactive-panel">
      <div className="section-number">03</div>
      <div>
        <p className="section-kicker">
          {mode === 'en' ? 'TRY THE MODEL' : '动手玩模型'}
        </p>
        <h2>
          {mode === 'en'
            ? 'Change one thing. Watch what follows.'
            : '改变一个条件，看看接下来发生什么。'}
        </h2>
      </div>
      {lesson.interactive === 'matter-sort' && <MatterSort mode={mode} />}
      {lesson.interactive === 'particle-zoom' && <ParticleZoom mode={mode} />}
      {lesson.interactive === 'state-lab' && <StateLab mode={mode} />}
      {lesson.interactive === 'phase-change-lab' && (
        <PhaseChangeLab mode={mode} />
      )}
      {lesson.interactive === 'change-detective' && (
        <ChangeDetective mode={mode} />
      )}
      {lesson.interactive === 'separation-lab' && <SeparationLab mode={mode} />}
      {lesson.interactive === 'element-gallery' && (
        <ElementGallery mode={mode} />
      )}
      {lesson.interactive === 'compound-builder' && (
        <CompoundBuilder mode={mode} />
      )}
      {lesson.interactive === 'particle-classifier' && (
        <ParticleClassifier mode={mode} />
      )}
      {lesson.interactive === 'atom-zoom' && <AtomZoom mode={mode} />}
      {lesson.interactive === 'proton-id' && <ProtonID mode={mode} />}
      {lesson.interactive === 'neutron-mass' && <NeutronMass mode={mode} />}
      {lesson.interactive === 'electron-charge' && (
        <ElectronCharge mode={mode} />
      )}
      {lesson.interactive === 'atomic-number-map' && (
        <AtomicNumberMap mode={mode} />
      )}
      {lesson.interactive === 'mass-number-calc' && (
        <MassNumberCalc mode={mode} />
      )}
      {lesson.interactive === 'isotope-detective' && (
        <IsotopeDetective mode={mode} />
      )}
      {lesson.interactive === 'ion-transfer' && <IonTransfer mode={mode} />}
      {lesson.interactive === 'periodic-table-explorer' && (
        <PeriodicTableExplorer mode={mode} />
      )}
      {lesson.interactive === 'group-family-match' && (
        <GroupFamilyMatch mode={mode} />
      )}
      {lesson.interactive === 'period-shell-viewer' && (
        <PeriodShellViewer mode={mode} />
      )}
      {lesson.interactive === 'metal-property-lab' && (
        <MetalPropertyLab mode={mode} />
      )}
      {lesson.interactive === 'nonmetal-evidence-sort' && (
        <NonmetalEvidenceSort mode={mode} />
      )}
    </section>
  );
}

function Quiz({ lesson, mode }: { lesson: Lesson; mode: LanguageMode }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const correct = useMemo(
    () => lesson.questions.filter((q) => answers[q.id] === q.answer).length,
    [answers, lesson.questions],
  );
  const answeredCount = Object.keys(answers).length;
  const complete = answeredCount === lesson.questions.length;

  useEffect(() => {
    if (!complete) return;
    try {
      const key = 'chemistry-path-progress-v1';
      const previous = JSON.parse(
        window.localStorage.getItem(key) ?? '{}',
      ) as Record<string, unknown>;
      window.localStorage.setItem(
        key,
        JSON.stringify({
          ...previous,
          [lesson.id]: {
            score: correct / lesson.questions.length,
            completedAt: new Date().toISOString(),
          },
        }),
      );
    } catch {
      // The lesson remains fully usable when storage is unavailable.
    }
  }, [complete, correct, lesson.id, lesson.questions.length]);

  return (
    <section className="lesson-panel quiz-panel">
      <div className="section-number">05</div>
      <div>
        <p className="section-kicker">
          {mode === 'en' ? 'MASTERY CHECK' : '掌握检查'}
        </p>
        <h2>
          {mode === 'en' ? 'Can you use the idea?' : '你能把这个想法用起来吗？'}
        </h2>
      </div>
      <div className="quiz-list">
        {lesson.questions.map((question, questionIndex) => (
          <article className="quiz-question" key={question.id}>
            <h3>
              <span>{questionIndex + 1}</span>
              <Localized text={question.prompt} mode={mode} />
            </h3>
            <div className="quiz-options">
              {question.options.map((option, optionIndex) => {
                const selected = answers[question.id] === optionIndex;
                const answered = answers[question.id] !== undefined;
                const reveal =
                  answered && (selected || optionIndex === question.answer);
                const className = `${selected ? 'selected' : ''} ${reveal ? (optionIndex === question.answer ? 'answer-correct' : 'answer-wrong') : ''}`;
                return (
                  <button
                    type="button"
                    className={className}
                    key={option.en}
                    onClick={() => {
                      setAnswers((old) => ({
                        ...old,
                        [question.id]: optionIndex,
                      }));
                    }}
                  >
                    <span>{String.fromCharCode(65 + optionIndex)}</span>
                    <Localized text={option} mode={mode} />
                  </button>
                );
              })}
            </div>
            {answers[question.id] !== undefined && (
              <div
                className={
                  answers[question.id] === question.answer
                    ? 'question-feedback correct'
                    : 'question-feedback wrong'
                }
              >
                <strong>
                  {answers[question.id] === question.answer
                    ? mode === 'en'
                      ? 'Correct'
                      : '回答正确'
                    : mode === 'en'
                      ? 'Not quite—look at the clue'
                      : '再想一下——看看关键证据'}
                </strong>
                <p className="quiz-explanation">
                  <b>{mode === 'en' ? 'Explanation: ' : '解析：'}</b>
                  <Localized text={question.explanation} mode={mode} />
                </p>
              </div>
            )}
          </article>
        ))}
      </div>
      <div className="quiz-finish">
        {complete ? (
          <div
            className={
              correct === lesson.questions.length ? 'score perfect' : 'score'
            }
          >
            <strong>
              {correct}/{lesson.questions.length}
            </strong>
            <span>
              {correct === lesson.questions.length
                ? mode === 'en'
                  ? 'Excellent—you can explain it, not just recall it.'
                  : '真棒——你已经能解释，而不只是记住。'
                : mode === 'en'
                  ? 'Read each explanation, then revise any answer that needs another look.'
                  : '读一读每题解析，再修改需要重新思考的答案。'}
            </span>
          </div>
        ) : (
          <span className="quiz-progress">
            {mode === 'en'
              ? `${answeredCount}/${lesson.questions.length} answered · every answer is checked instantly`
              : `已回答 ${answeredCount}/${lesson.questions.length} · 每题都会立即判定`}
          </span>
        )}
      </div>
    </section>
  );
}

export function LessonPage({ mode }: { mode: LanguageMode }) {
  const { lessonId } = useParams();
  const lesson = getLesson(lessonId);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [lessonId]);
  if (!lesson) return <Navigate to="/chemistry/path" replace />;
  const next = lessons.find((item) => item.order === lesson.order + 1);

  return (
    <article className="lesson-page page-enter">
      <div className="lesson-topbar">
        <Link to="/chemistry/path">
          ← {mode === 'en' ? 'Learning path' : '学习路径'}
        </Link>
        <span>
          {lesson.estimatedMinutes} {mode === 'en' ? 'min' : '分钟'}
        </span>
      </div>
      <header className="lesson-hero">
        <div>
          <p className="lesson-eyebrow">
            <Localized text={lesson.eyebrow} mode={mode} />
          </p>
          <h1>
            <Localized
              text={lesson.title}
              mode={mode}
              secondaryClassName="block lesson-title-en"
            />
          </h1>
          <p className="lesson-hook">
            <Localized text={lesson.hook} mode={mode} />
          </p>
          <div className="hook-clue">
            <span>?</span>
            <Localized text={lesson.hookHint} mode={mode} />
          </div>
        </div>
        <div
          className="hero-orbit"
          aria-label={
            mode === 'en' ? 'Animated particle model' : '动态粒子模型'
          }
        >
          <span className="orbit orbit-one">
            <i />
          </span>
          <span className="orbit orbit-two">
            <i />
          </span>
          <span className="orbit-core" />
          <b>{lesson.order.toString().padStart(2, '0')}</b>
        </div>
      </header>

      <section className="big-idea">
        <span>
          {mode === 'en' ? 'THE ONE IDEA TO KEEP' : '今天最值得带走的一句话'}
        </span>
        <h2>
          <Localized text={lesson.bigIdea} mode={mode} />
        </h2>
      </section>

      <section className="lesson-section">
        <div className="section-number">01</div>
        <div>
          <p className="section-kicker">
            {mode === 'en' ? 'FIND IT IN REAL LIFE' : '先在生活里找到它'}
          </p>
          <h2>
            {mode === 'en'
              ? 'Chemistry was already around you.'
              : '原来化学一直就在你身边。'}
          </h2>
        </div>
        <div className="example-grid">
          {lesson.everydayExamples.map((example) => (
            <article key={example.title.en}>
              <span>{example.icon}</span>
              <h3>
                <Localized text={example.title} mode={mode} />
              </h3>
              <p>
                <Localized text={example.body} mode={mode} />
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section explanation-section">
        <div className="section-number">02</div>
        <div>
          <p className="section-kicker">
            {mode === 'en' ? 'BUILD THE IDEA' : '一步步建立模型'}
          </p>
          <h2>
            {mode === 'en'
              ? 'Three steps, one useful model.'
              : '三个台阶，搭起一个有用的模型。'}
          </h2>
        </div>
        <div className="step-list">
          {lesson.steps.map((step, index) => (
            <article key={step.title.en}>
              <b>{index + 1}</b>
              <div>
                <h3>
                  <Localized text={step.title} mode={mode} />
                </h3>
                <p>
                  <Localized text={step.body} mode={mode} />
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Interactive lesson={lesson} mode={mode} />

      <section className="lesson-section remember-section">
        <div className="section-number">04</div>
        <div>
          <p className="section-kicker">
            {mode === 'en' ? 'AVOID THE TRAP' : '绕开一个常见误区'}
          </p>
          <h2>
            {mode === 'en'
              ? 'A tempting idea—but not quite.'
              : '这个想法很自然，但不准确。'}
          </h2>
        </div>
        <div className="misconception">
          <span>!</span>
          <p>
            <Localized text={lesson.misconception} mode={mode} />
          </p>
        </div>
        <div className="home-mission">
          <span>🏠</span>
          <div>
            <strong>
              {mode === 'en' ? 'Tiny mission after class' : '下课后的微型任务'}
            </strong>
            <p>
              <Localized text={lesson.mission} mode={mode} />
            </p>
          </div>
        </div>
        <div className="vocabulary-row">
          {lesson.vocabulary.map((word) => (
            <span key={word.en}>
              <b>{word.en}</b>
              {word.zh}
            </span>
          ))}
        </div>
      </section>

      <Quiz key={lesson.id} lesson={lesson} mode={mode} />

      <nav className="lesson-next">
        <Link to="/chemistry/path">
          ← {mode === 'en' ? 'All lessons' : '全部课程'}
        </Link>
        {next && (
          <Link to={`/chemistry/lesson/${next.id}`}>
            <span>{mode === 'en' ? 'NEXT LESSON' : '下一课'}</span>
            <strong>
              <Localized text={next.title} mode={mode} />
            </strong>{' '}
            →
          </Link>
        )}
      </nav>
    </article>
  );
}
