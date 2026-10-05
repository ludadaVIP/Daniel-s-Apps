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
    {
      symbol: 'O',
      nameZh: '氧',
      nameEn: 'Oxygen',
      clueZh: '空气中的气体；常与其他元素形成分子。',
      clueEn: 'A gas in air; often forms molecules with other elements.',
      answer: 'nonmetal',
      reasonZh: '氧位于周期表右侧，是非金属。',
      reasonEn:
        'Oxygen sits on the right side of the periodic table and is a non-metal.',
    },
    {
      symbol: 'Cu',
      nameZh: '铜',
      nameEn: 'Copper',
      clueZh: '可拉成电线，导电良好。',
      clueEn: 'Can be drawn into wire and conducts well.',
      answer: 'metal',
      reasonZh: '这是典型金属的性质组合。',
      reasonEn: 'This is a classic combination of metal properties.',
    },
    {
      symbol: 'Si',
      nameZh: '硅',
      nameEn: 'Silicon',
      clueZh: '用于芯片；导电能力介于金属和非金属之间。',
      clueEn:
        'Used in chips; its conductivity sits between metal and non-metal.',
      answer: 'metalloid',
      reasonZh: '硅是类金属，正是“不是非此即彼”的提醒。',
      reasonEn:
        'Silicon is a metalloid—a reminder that categories are not always either-or.',
    },
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
        <div>
          <strong>{mode === 'en' ? sample.nameEn : sample.nameZh}</strong>
          <p>{mode === 'en' ? sample.clueEn : sample.clueZh}</p>
        </div>
      </div>
      <div className="evidence-controls">
        <strong>
          {mode === 'en'
            ? 'Use the clues. Which label fits best?'
            : '用证据判断：最适合哪个标签？'}
        </strong>
        <div>
          {labels.map((label) => (
            <button
              type="button"
              key={label.id}
              className={
                choice === label.id ? (correct ? 'correct' : 'wrong') : ''
              }
              onClick={() => setChoice(label.id)}
            >
              {mode === 'en' ? label.en : label.zh}
            </button>
          ))}
        </div>
        {choice && (
          <p className={correct ? 'correct' : 'wrong'}>
            <b>
              {correct
                ? mode === 'en'
                  ? 'Evidence fits. '
                  : '证据吻合。'
                : mode === 'en'
                  ? 'Not quite. '
                  : '还不完全对。'}
            </b>
            {mode === 'en' ? sample.reasonEn : sample.reasonZh}
          </p>
        )}
        {correct && (
          <button
            type="button"
            className="evidence-next"
            onClick={() => {
              setSampleIndex((index) => (index + 1) % samples.length);
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

function Group1ReactivityLab({ mode }: { mode: LanguageMode }) {
  const metals = [
    {
      symbol: 'Li',
      zh: '锂',
      en: 'Lithium',
      period: 2,
      strength: 28,
      useZh: '锂离子电池',
      useEn: 'lithium-ion batteries',
    },
    {
      symbol: 'Na',
      zh: '钠',
      en: 'Sodium',
      period: 3,
      strength: 56,
      useZh: '食盐中的 Na⁺',
      useEn: 'Na⁺ in table salt',
    },
    {
      symbol: 'K',
      zh: '钾',
      en: 'Potassium',
      period: 4,
      strength: 82,
      useZh: '食物中的 K⁺',
      useEn: 'K⁺ in food',
    },
  ];
  const [selectedIndex, setSelectedIndex] = useState(1);
  const metal = metals[selectedIndex]!;
  return (
    <div className="group1-lab">
      <div className="group1-tabs">
        {metals.map((item, index) => (
          <button
            type="button"
            key={item.symbol}
            className={selectedIndex === index ? 'active' : ''}
            onClick={() => setSelectedIndex(index)}
          >
            {item.symbol}
          </button>
        ))}
      </div>
      <div
        className="group1-scene"
        aria-label={
          mode === 'en'
            ? `${metal.en}: Period ${metal.period}, Group 1`
            : `${metal.zh}：第 ${metal.period} 周期，第 1 族`
        }
      >
        <div className={`group1-atom period-${metal.period}`}>
          {Array.from({ length: metal.period }, (_, index) => (
            <i className={`g1-shell shell-${index + 1}`} key={index} />
          ))}
          <b>{metal.symbol}</b>
          <em>e⁻</em>
        </div>
        <div className="electron-distance">
          <span>{mode === 'en' ? 'outer electron' : '最外层电子'}</span>
          <i style={{ width: `${metal.strength}%` }} />
        </div>
      </div>
      <div className="group1-readout">
        <strong>
          {mode === 'en' ? metal.en : metal.zh} · {metal.symbol}
        </strong>
        <p>
          {mode === 'en'
            ? `Period ${metal.period}: ${metal.period} electron shells, but still 1 outer electron.`
            : `第 ${metal.period} 周期：${metal.period} 层电子活动区域，最外层仍是 1 个电子。`}
        </p>
        <div className="reactivity-meter">
          <span>
            {mode === 'en'
              ? 'General tendency to lose that electron'
              : '失去最外层电子的一般倾向'}
          </span>
          <i>
            <b style={{ width: `${metal.strength}%` }} />
          </i>
          <strong>
            {mode === 'en'
              ? selectedIndex === 0
                ? 'lower'
                : selectedIndex === 1
                  ? 'higher'
                  : 'highest of these three'
              : selectedIndex === 0
                ? '较低'
                : selectedIndex === 1
                  ? '较高'
                  : '三者中最高'}
          </strong>
        </div>
        <p className="group1-safe-note">
          ⚠️{' '}
          {mode === 'en'
            ? `Model only. Learn Group 1 water reactions from qualified demonstrations—never test metals at home. ${metal.symbol} is encountered safely in ${metal.useEn}.`
            : `仅为模型。第 1 族与水的反应只能通过合格演示学习，绝不在家测试。${metal.symbol} 可在${metal.useZh}中以安全的离子或化合物形式出现。`}
        </p>
      </div>
    </div>
  );
}

function Group17IonLab({ mode }: { mode: LanguageMode }) {
  const elements = [
    {
      symbol: 'F',
      zh: '氟',
      en: 'Fluorine',
      period: 2,
      strength: 86,
      ion: 'F⁻',
      useZh: '牙膏中的氟化物',
      useEn: 'fluoride toothpaste',
    },
    {
      symbol: 'Cl',
      zh: '氯',
      en: 'Chlorine',
      period: 3,
      strength: 59,
      ion: 'Cl⁻',
      useZh: '食盐中的氯离子',
      useEn: 'chloride in salt',
    },
    {
      symbol: 'Br',
      zh: '溴',
      en: 'Bromine',
      period: 4,
      strength: 32,
      ion: 'Br⁻',
      useZh: '受控的实验室化学品',
      useEn: 'controlled laboratory chemicals',
    },
  ];
  const [selectedIndex, setSelectedIndex] = useState(1);
  const [addedElectron, setAddedElectron] = useState(false);
  const element = elements[selectedIndex]!;
  return (
    <div className="group17-lab">
      <div className="group17-tabs">
        {elements.map((item, index) => (
          <button
            type="button"
            key={item.symbol}
            className={selectedIndex === index ? 'active' : ''}
            onClick={() => {
              setSelectedIndex(index);
              setAddedElectron(false);
            }}
          >
            {item.symbol}
          </button>
        ))}
      </div>
      <div
        className={`group17-scene ${addedElectron ? 'has-electron' : ''}`}
        aria-live="polite"
      >
        <div className={`group17-atom period-${element.period}`}>
          {Array.from({ length: element.period }, (_, index) => (
            <i className={`g17-shell shell-${index + 1}`} key={index} />
          ))}
          <b>{addedElectron ? element.ion : element.symbol}</b>
          {Array.from({ length: 7 }, (_, index) => (
            <em className={`outer-e outer-${index + 1}`} key={index}>
              e⁻
            </em>
          ))}
          {addedElectron && <em className="outer-e added-e">e⁻</em>}
        </div>
        <div className="incoming-electron">e⁻</div>
      </div>
      <div className="group17-readout">
        <strong>
          {mode === 'en' ? element.en : element.zh} · {element.symbol}
        </strong>
        <p>
          {addedElectron
            ? mode === 'en'
              ? `One electron joined the outer shell: ${element.symbol} is now ${element.ion}.`
              : `一颗电子加入最外层：${element.symbol} 现在是 ${element.ion}。`
            : mode === 'en'
              ? 'Seven outer electrons: one more would fill the beginner-model outer shell.'
              : '最外层已有 7 个电子：再加入 1 个，就会填满初学模型中的最外层。'}
        </p>
        <button
          type="button"
          onClick={() => setAddedElectron((value) => !value)}
        >
          {addedElectron
            ? mode === 'en'
              ? 'Reset atom'
              : '重置原子'
            : mode === 'en'
              ? 'Add one electron →'
              : '加入一颗电子 →'}
        </button>
        <div className="group17-meter">
          <span>
            {mode === 'en'
              ? 'General tendency to attract an electron'
              : '吸引一个电子的一般倾向'}
          </span>
          <i>
            <b style={{ width: `${element.strength}%` }} />
          </i>
          <strong>
            {mode === 'en'
              ? selectedIndex === 0
                ? 'highest of these three'
                : selectedIndex === 1
                  ? 'high'
                  : 'lower'
              : selectedIndex === 0
                ? '三者中最高'
                : selectedIndex === 1
                  ? '较高'
                  : '较低'}
          </strong>
        </div>
        <p className="group17-safe-note">
          ⚠️{' '}
          {mode === 'en'
            ? `Model only. Do not mix cleaners or handle reactive chemicals. ${element.symbol} is encountered safely in ${element.useEn}.`
            : `仅为模型。绝不混合清洁剂或接触活泼化学品。${element.symbol} 可在${element.useZh}中以安全的化合物或离子形式出现。`}
        </p>
      </div>
    </div>
  );
}

function NobleGasGlow({ mode }: { mode: LanguageMode }) {
  const gases = [
    {
      symbol: 'He',
      zh: '氦',
      en: 'Helium',
      shells: 1,
      outer: 2,
      colour: '#f4c86a',
      glow: '#ffe7a8',
      useZh: '气球与低温设备',
      useEn: 'balloons and low-temperature equipment',
    },
    {
      symbol: 'Ne',
      zh: '氖',
      en: 'Neon',
      shells: 2,
      outer: 8,
      colour: '#ec755b',
      glow: '#ff9a7d',
      useZh: '霓虹招牌',
      useEn: 'neon signs',
    },
    {
      symbol: 'Ar',
      zh: '氩',
      en: 'Argon',
      shells: 3,
      outer: 8,
      colour: '#7b9de1',
      glow: '#afc6ff',
      useZh: '灯泡与保温窗',
      useEn: 'bulbs and insulated windows',
    },
  ];
  const [gasIndex, setGasIndex] = useState(1);
  const [energized, setEnergized] = useState(false);
  const gas = gases[gasIndex]!;
  return (
    <div className="noble-glow-lab">
      <div className="noble-tabs">
        {gases.map((item, index) => (
          <button
            type="button"
            key={item.symbol}
            className={gasIndex === index ? 'active' : ''}
            onClick={() => {
              setGasIndex(index);
              setEnergized(false);
            }}
          >
            {item.symbol}
          </button>
        ))}
      </div>
      <div
        className={`noble-scene shells-${gas.shells} ${energized ? 'energized' : ''}`}
        style={
          {
            '--gas-colour': gas.colour,
            '--gas-glow': gas.glow,
          } as CSSProperties
        }
        aria-live="polite"
      >
        <span className="noble-tube-left" />
        <span className="noble-tube-right" />
        <div className="noble-atom">
          {Array.from({ length: gas.shells }, (_, index) => (
            <i className={`noble-shell shell-${index + 1}`} key={index} />
          ))}
          <b>{gas.symbol}</b>
          {Array.from({ length: gas.outer }, (_, index) => (
            <em className={`noble-electron e-${index + 1}`} key={index}>
              e⁻
            </em>
          ))}
        </div>
        {energized && (
          <span className="glow-label">
            {mode === 'en' ? 'energy in → light out' : '输入能量 → 放出光'}
          </span>
        )}
      </div>
      <div className="noble-readout">
        <strong>
          {mode === 'en' ? gas.en : gas.zh} · {gas.symbol}
        </strong>
        <p>
          {mode === 'en'
            ? `${gas.shells} shell${gas.shells > 1 ? 's' : ''}; outer shell has ${gas.outer} electron${gas.outer > 1 ? 's' : ''} and is stable in this model.`
            : `${gas.shells} 层电子活动区域；最外层有 ${gas.outer} 个电子，在此模型中处于稳定状态。`}
        </p>
        <button type="button" onClick={() => setEnergized((value) => !value)}>
          {energized
            ? mode === 'en'
              ? 'Turn energy off'
              : '关闭能量'
            : mode === 'en'
              ? 'Send in energy ✦'
              : '输入能量 ✦'}
        </button>
        <p className="noble-use">
          {mode === 'en'
            ? `Quiet chemistry, useful job: ${gas.useEn}.`
            : `安静的化学，也有实用工作：${gas.useZh}。`}
        </p>
        <p className="noble-safe-note">
          ⚠️{' '}
          {mode === 'en'
            ? 'This is an animation model. Do not open, break or modify lights, signs or gas containers.'
            : '这只是动画模型。不要拆开、砸开或改装灯具、招牌或气体容器。'}
        </p>
      </div>
    </div>
  );
}

function BondChoiceLab({ mode }: { mode: LanguageMode }) {
  const models = [
    {
      id: 'ionic',
      left: 'Na',
      right: 'Cl',
      typeZh: '电子转移 → 离子键',
      typeEn: 'electron transfer → ionic bond',
      resultZh:
        'Na 失去 1 个电子成为 Na⁺；Cl 得到它成为 Cl⁻。异号离子的吸引让它们靠在一起。',
      resultEn:
        'Na loses one electron to become Na⁺; Cl gains it to become Cl⁻. Opposite ions attract and hold together.',
      labelZh: '食盐模型',
      labelEn: 'table salt model',
    },
    {
      id: 'covalent',
      left: 'H',
      right: 'H',
      typeZh: '共享电子 → 共价键',
      typeEn: 'shared electrons → covalent bond',
      resultZh: '两个 H 各贡献 1 个电子，一起使用这对电子，形成 H—H。',
      resultEn:
        'Each H contributes one electron; the pair is used together to form H—H.',
      labelZh: '氢气模型',
      labelEn: 'hydrogen model',
    },
    {
      id: 'stable',
      left: 'Ne',
      right: 'Ne',
      typeZh: '最外层已稳定 → 通常不成键',
      typeEn: 'stable outer shell → usually no bond',
      resultZh:
        '氖原子的最外层在这个入门模型中已经稳定，通常不会为了补满外层而与另一个 Ne 形成键。',
      resultEn:
        'In this beginner model, neon already has a stable outer shell and does not usually form a bond with another Ne to fill it.',
      labelZh: '稀有气体对照',
      labelEn: 'noble-gas contrast',
    },
  ] as const;
  const [selected, setSelected] = useState(0);
  const model = models[selected]!;
  const linked = model.id !== 'stable';

  return (
    <div className="bond-choice-lab">
      <div
        className="bond-choice-tabs"
        role="group"
        aria-label={mode === 'en' ? 'Choose atom pair' : '选择原子组合'}
      >
        {models.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={selected === index ? 'active' : ''}
            onClick={() => setSelected(index)}
          >
            {item.left} + {item.right}
          </button>
        ))}
      </div>
      <div className={`bond-scene ${model.id}`} aria-live="polite">
        <div className="bond-orb left-orb">
          <b>{model.left}</b>
          <i>e⁻</i>
        </div>
        <div className="bond-bridge" aria-hidden="true">
          {model.id === 'ionic' && (
            <span className="travelling-electron">e⁻</span>
          )}
          {model.id === 'covalent' && (
            <span className="shared-electrons">e⁻ e⁻</span>
          )}
          {model.id === 'stable' && <span className="no-link">×</span>}
        </div>
        <div className="bond-orb right-orb">
          <b>{model.right}</b>
          <i>e⁻</i>
        </div>
        <span className="bond-caption">
          {mode === 'en' ? model.labelEn : model.labelZh}
        </span>
      </div>
      <div className="bond-readout">
        <strong>{mode === 'en' ? model.typeEn : model.typeZh}</strong>
        <p>{mode === 'en' ? model.resultEn : model.resultZh}</p>
        <p className="bond-energy-note">
          ✦{' '}
          {mode === 'en'
            ? 'Useful shortcut: compare the outer electrons, then ask whether transfer, sharing, or no easy bond fits the model.'
            : '实用捷径：先看最外层电子，再判断这个模型更像转移、共享，还是不容易成键。'}
        </p>
      </div>
    </div>
  );
}

function IonicLatticeLab({ mode }: { mode: LanguageMode }) {
  const [state, setState] = useState<'lattice' | 'shifted' | 'dissolved'>(
    'lattice',
  );
  const ions = Array.from({ length: 24 }, (_, index) => ({
    positive: (Math.floor(index / 6) + (index % 6)) % 2 === 0,
    row: Math.floor(index / 6),
    column: index % 6,
  }));
  const copy = {
    lattice: {
      titleZh: '排列整齐：异号离子相邻',
      titleEn: 'Ordered: opposite ions are neighbours',
      bodyZh:
        'Na⁺ 与 Cl⁻ 交替排列，吸引向各方向延伸。离子被固定在晶格位置，因此固态食盐不容易导电。',
      bodyEn:
        'Na⁺ and Cl⁻ alternate, so attraction extends in every direction. The ions are fixed in lattice positions, so solid salt does not conduct readily.',
    },
    shifted: {
      titleZh: '层已错位：同号离子面对面',
      titleEn: 'Layer shifted: like charges face each other',
      bodyZh:
        '受力后，上半层横向移动。同号离子靠近产生排斥，裂纹可能沿晶格扩展——这就是“硬但脆”的微观线索。',
      bodyEn:
        'Force shifts the upper layers sideways. Like charges meet and repel, so a crack can spread through the lattice—the particle clue behind “hard but brittle”.',
    },
    dissolved: {
      titleZh: '进入水中：离子分散并能移动',
      titleEn: 'In water: ions separate and can move',
      bodyZh:
        '水分子把离子从晶格中分散开。可移动的 Na⁺ 和 Cl⁻ 能携带电荷，所以盐水可以导电。',
      bodyEn:
        'Water molecules separate ions from the lattice. Mobile Na⁺ and Cl⁻ can carry charge, so salt water can conduct electricity.',
    },
  } as const;
  const message = copy[state];

  return (
    <div className="ionic-lattice-lab">
      <div
        className={`ionic-lattice-scene ${state}`}
        role="img"
        aria-label={mode === 'en' ? message.titleEn : message.titleZh}
      >
        <div className="ionic-grid">
          {ions.map((ion, index) => (
            <span
              key={index}
              className={`${ion.positive ? 'ion-positive' : 'ion-negative'} ion-row-${ion.row}`}
              style={
                {
                  '--ion-row': ion.row,
                  '--ion-column': ion.column,
                  '--scatter-x': `${((index * 37) % 92) + 4}%`,
                  '--scatter-y': `${((index * 61) % 84) + 8}%`,
                } as CSSProperties
              }
            >
              {ion.positive ? 'Na⁺' : 'Cl⁻'}
            </span>
          ))}
        </div>
        {state === 'shifted' && (
          <span className="lattice-crack" aria-hidden="true" />
        )}
        {state === 'dissolved' && (
          <span className="water-label">
            H₂O · {mode === 'en' ? 'ions mobile' : '离子可移动'}
          </span>
        )}
      </div>
      <div className="ionic-lattice-readout">
        <div
          className="lattice-actions"
          role="group"
          aria-label={
            mode === 'en' ? 'Change lattice condition' : '改变晶格状态'
          }
        >
          <button
            type="button"
            className={state === 'lattice' ? 'active' : ''}
            onClick={() => setState('lattice')}
          >
            {mode === 'en' ? 'Intact lattice' : '完整晶格'}
          </button>
          <button
            type="button"
            className={state === 'shifted' ? 'active' : ''}
            onClick={() => setState('shifted')}
          >
            {mode === 'en' ? 'Push a layer' : '推动一层'}
          </button>
          <button
            type="button"
            className={state === 'dissolved' ? 'active' : ''}
            onClick={() => setState('dissolved')}
          >
            {mode === 'en' ? 'Add water' : '加入水'}
          </button>
        </div>
        <strong>{mode === 'en' ? message.titleEn : message.titleZh}</strong>
        <p>{mode === 'en' ? message.bodyEn : message.bodyZh}</p>
        <p className="lattice-rule">
          {state === 'lattice'
            ? mode === 'en'
              ? 'Opposites attract → strong repeating structure'
              : '异号相吸 → 强而重复的结构'
            : state === 'shifted'
              ? mode === 'en'
                ? 'Likes repel → the crystal cleaves'
                : '同号相斥 → 晶体沿面裂开'
              : mode === 'en'
                ? 'Mobile charge → solution can conduct'
                : '电荷能移动 → 溶液可以导电'}
        </p>
      </div>
    </div>
  );
}

function CovalentSharingLab({ mode }: { mode: LanguageMode }) {
  type MoleculeModel = {
    id: string;
    formula: string;
    atoms: Array<{ symbol: string; x: number; y: number; colour: string }>;
    bonds: Array<{ a: number; b: number; pairs: number }>;
    lonePairs: Array<{ x: number; y: number }>;
    sharedPairs: number;
    titleZh: string;
    titleEn: string;
    bodyZh: string;
    bodyEn: string;
  };
  const models: MoleculeModel[] = [
    {
      id: 'h2',
      formula: 'H₂',
      atoms: [
        { symbol: 'H', x: 92, y: 120, colour: '#7b9db5' },
        { symbol: 'H', x: 228, y: 120, colour: '#7b9db5' },
      ],
      bonds: [{ a: 0, b: 1, pairs: 1 }],
      lonePairs: [],
      sharedPairs: 1,
      titleZh: 'H—H：一对共享电子',
      titleEn: 'H—H: one shared pair',
      bodyZh:
        '两个氢各带来一个电子，在两个原子核之间形成一对共享电子；一条线表示一个单键。',
      bodyEn:
        'Each hydrogen brings one electron, forming a shared pair between the nuclei; one line represents a single bond.',
    },
    {
      id: 'o2',
      formula: 'O₂',
      atoms: [
        { symbol: 'O', x: 92, y: 120, colour: '#dc8067' },
        { symbol: 'O', x: 228, y: 120, colour: '#dc8067' },
      ],
      bonds: [{ a: 0, b: 1, pairs: 2 }],
      lonePairs: [
        { x: 55, y: 82 },
        { x: 55, y: 158 },
        { x: 265, y: 82 },
        { x: 265, y: 158 },
      ],
      sharedPairs: 2,
      titleZh: 'O=O：两对共享电子',
      titleEn: 'O=O: two shared pairs',
      bodyZh:
        '两个氧共享两对电子，形成双键；每个氧还保留两对没有参与成键的孤电子对。',
      bodyEn:
        'The oxygens share two electron pairs in a double bond; each oxygen also keeps two lone pairs that are not in the bond.',
    },
    {
      id: 'h2o',
      formula: 'H₂O',
      atoms: [
        { symbol: 'O', x: 160, y: 86, colour: '#dc8067' },
        { symbol: 'H', x: 83, y: 174, colour: '#7b9db5' },
        { symbol: 'H', x: 237, y: 174, colour: '#7b9db5' },
      ],
      bonds: [
        { a: 0, b: 1, pairs: 1 },
        { a: 0, b: 2, pairs: 1 },
      ],
      lonePairs: [
        { x: 139, y: 43 },
        { x: 181, y: 43 },
      ],
      sharedPairs: 2,
      titleZh: 'H₂O：两条键，还有两对孤电子',
      titleEn: 'H₂O: two bonds plus two lone pairs',
      bodyZh:
        '氧与每个氢各共享一对电子。氧上的两对孤电子也占空间，使整个分子呈弯曲形。',
      bodyEn:
        'Oxygen shares one pair with each hydrogen. Its two lone pairs also occupy space, giving the molecule a bent shape.',
    },
  ];
  const [selected, setSelected] = useState(0);
  const model = models[selected]!;

  return (
    <div className="covalent-sharing-lab">
      <div
        className="covalent-tabs"
        role="group"
        aria-label={mode === 'en' ? 'Choose a molecule' : '选择分子'}
      >
        {models.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={selected === index ? 'active' : ''}
            onClick={() => setSelected(index)}
          >
            {item.formula}
          </button>
        ))}
      </div>
      <div className="covalent-scene">
        <svg
          viewBox="0 0 320 235"
          role="img"
          aria-label={mode === 'en' ? model.titleEn : model.titleZh}
        >
          {model.bonds.flatMap((bond, bondIndex) => {
            const first = model.atoms[bond.a]!;
            const second = model.atoms[bond.b]!;
            const dx = second.x - first.x;
            const dy = second.y - first.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            return Array.from({ length: bond.pairs }, (_, pairIndex) => {
              const offset = (pairIndex - (bond.pairs - 1) / 2) * 10;
              const offsetX = (-dy / length) * offset;
              const offsetY = (dx / length) * offset;
              const unitX = dx / length;
              const unitY = dy / length;
              const middleX = (first.x + second.x) / 2 + offsetX;
              const middleY = (first.y + second.y) / 2 + offsetY;
              return (
                <g key={`${bondIndex}-${pairIndex}`}>
                  <line
                    className="covalent-bond-line"
                    x1={first.x + unitX * 31 + offsetX}
                    y1={first.y + unitY * 31 + offsetY}
                    x2={second.x - unitX * 31 + offsetX}
                    y2={second.y - unitY * 31 + offsetY}
                  />
                  <circle
                    className="shared-dot"
                    cx={middleX - unitX * 4}
                    cy={middleY - unitY * 4}
                    r="3.1"
                  />
                  <circle
                    className="shared-dot"
                    cx={middleX + unitX * 4}
                    cy={middleY + unitY * 4}
                    r="3.1"
                  />
                </g>
              );
            });
          })}
          {model.lonePairs.map((pair, index) => (
            <g className="lone-pair" key={`${pair.x}-${pair.y}`}>
              <circle cx={pair.x - 4} cy={pair.y} r="3.1" />
              <circle cx={pair.x + 4} cy={pair.y} r="3.1" />
              <text x={pair.x} y={pair.y - 9} textAnchor="middle">
                {index === 0 ? (mode === 'en' ? 'lone pair' : '孤对') : ''}
              </text>
            </g>
          ))}
          {model.atoms.map((atom, index) => (
            <g className="covalent-atom" key={`${atom.symbol}-${index}`}>
              <circle cx={atom.x} cy={atom.y} r="28" fill={atom.colour} />
              <circle
                cx={atom.x - 7}
                cy={atom.y - 8}
                r="6"
                fill="rgba(255,255,255,.24)"
              />
              <text x={atom.x} y={atom.y + 6} textAnchor="middle">
                {atom.symbol}
              </text>
            </g>
          ))}
        </svg>
        <span className="covalent-formula">{model.formula}</span>
      </div>
      <div className="covalent-readout">
        <strong>{mode === 'en' ? model.titleEn : model.titleZh}</strong>
        <p>{mode === 'en' ? model.bodyEn : model.bodyZh}</p>
        <div className="shared-pair-count">
          <span>{mode === 'en' ? 'Shared pairs shown' : '图中共用电子对'}</span>
          <b>{model.sharedPairs}</b>
        </div>
        <p className="covalent-note">
          {mode === 'en'
            ? 'Dots are a map, not a photograph: real electrons form moving probability clouds.'
            : '点图是地图，不是照片：真实电子以不断变化的概率云分布。'}
        </p>
      </div>
    </div>
  );
}

function MetallicBondingLab({ mode }: { mode: LanguageMode }) {
  const [view, setView] = useState<'structure' | 'current' | 'shape'>(
    'structure',
  );
  const ions = Array.from({ length: 20 }, (_, index) => ({
    row: Math.floor(index / 5),
  }));
  const electrons = Array.from({ length: 18 }, (_, index) => ({
    x: 8 + ((index * 31) % 84),
    y: 10 + ((index * 47) % 78),
    delay: `${-(index % 6) * 0.19}s`,
  }));
  const messages = {
    structure: {
      titleZh: '正离子骨架 + 离域电子',
      titleEn: 'Positive-ion framework + delocalised electrons',
      bodyZh:
        '金属离子规则排列；外层电子分布在整个结构中。正负吸引维系晶格，整体电荷仍然平衡。',
      bodyEn:
        'Metal ions are ordered while outer electrons spread through the structure. Positive-negative attraction holds the lattice and total charge remains balanced.',
      ruleZh: '离域 ≠ 丢失：电子仍在金属内部',
      ruleEn: 'Delocalised ≠ lost: electrons remain in the metal',
    },
    current: {
      titleZh: '接入电场：电子产生净漂移',
      titleEn: 'Apply an electric field: electrons gain net drift',
      bodyZh:
        '电子本来就在快速无规则运动；电场让它们叠加一个有方向的微小净漂移，从而携带电荷形成电流。',
      bodyEn:
        'Electrons already move rapidly and randomly; an electric field adds a small directed net drift, carrying charge as current.',
      ruleZh: '可移动带电粒子 → 能导电',
      ruleEn: 'Mobile charged particles → conduction',
    },
    shape: {
      titleZh: '推动离子层：连接没有立刻断开',
      titleEn: 'Slide ion layers: bonding does not immediately fail',
      bodyZh:
        '离子层错位后，离域电子仍在新位置周围产生吸引。金属因此常能被弯折、压片或拉成细丝。',
      bodyEn:
        'After ion layers shift, delocalised electrons still attract ions in their new positions. Metals can therefore often bend, roll into sheets or draw into wire.',
      ruleZh: '层能滑动 → 可锻、可延展',
      ruleEn: 'Layers can slide → malleable and ductile',
    },
  } as const;
  const message = messages[view];

  return (
    <div className="metallic-bonding-lab">
      <div className={`metallic-scene ${view}`} aria-live="polite">
        <div className="metal-ion-grid" aria-hidden="true">
          {ions.map((ion, index) => (
            <span className={`metal-ion metal-row-${ion.row}`} key={index}>
              M⁺
            </span>
          ))}
        </div>
        <div className="electron-cloud" aria-hidden="true">
          {electrons.map((electron, index) => (
            <i
              key={index}
              style={
                {
                  left: `${electron.x}%`,
                  top: `${electron.y}%`,
                  animationDelay: electron.delay,
                } as CSSProperties
              }
            >
              e⁻
            </i>
          ))}
        </div>
        <span className="metal-scene-label">
          {view === 'current'
            ? mode === 'en'
              ? 'electron drift →'
              : '电子净漂移 →'
            : view === 'shape'
              ? mode === 'en'
                ? 'layers slide'
                : '离子层滑动'
              : mode === 'en'
                ? 'metal structure'
                : '金属结构'}
        </span>
      </div>
      <div className="metallic-readout">
        <div
          className="metallic-actions"
          role="group"
          aria-label={
            mode === 'en' ? 'Explore metal properties' : '探索金属性质'
          }
        >
          <button
            type="button"
            className={view === 'structure' ? 'active' : ''}
            onClick={() => setView('structure')}
          >
            {mode === 'en' ? 'Structure' : '看结构'}
          </button>
          <button
            type="button"
            className={view === 'current' ? 'active' : ''}
            onClick={() => setView('current')}
          >
            {mode === 'en' ? 'Switch on' : '接通电场'}
          </button>
          <button
            type="button"
            className={view === 'shape' ? 'active' : ''}
            onClick={() => setView('shape')}
          >
            {mode === 'en' ? 'Bend metal' : '弯折金属'}
          </button>
        </div>
        <strong>{mode === 'en' ? message.titleEn : message.titleZh}</strong>
        <p>{mode === 'en' ? message.bodyEn : message.bodyZh}</p>
        <p className="metallic-rule">
          {mode === 'en' ? message.ruleEn : message.ruleZh}
        </p>
        <p className="metallic-safe-note">
          ⚠️{' '}
          {mode === 'en'
            ? 'Animation only. Never test wires with a wall socket or live power source.'
            : '仅为动画模型。绝不使用插座或带电电源测试电线。'}
        </p>
      </div>
    </div>
  );
}

function StructureDetectiveLab({ mode }: { mode: LanguageMode }) {
  type StructureKind = 'metallic' | 'ionic' | 'molecular' | 'giant';
  const kinds: Array<{ id: StructureKind; zh: string; en: string }> = [
    { id: 'metallic', zh: '金属结构', en: 'Metallic' },
    { id: 'ionic', zh: '离子晶格', en: 'Ionic lattice' },
    { id: 'molecular', zh: '分子物质', en: 'Molecular' },
    { id: 'giant', zh: '巨型共价', en: 'Giant covalent' },
  ];
  const materials: Array<{
    id: string;
    icon: string;
    zh: string;
    en: string;
    kind: StructureKind;
    cluesZh: string[];
    cluesEn: string[];
    explanationZh: string;
    explanationEn: string;
  }> = [
    {
      id: 'copper',
      icon: '🔌',
      zh: '铜',
      en: 'Copper',
      kind: 'metallic',
      cluesZh: ['固态就能导电', '可以拉成细线', '有金属光泽'],
      cluesEn: [
        'conducts as a solid',
        'can be drawn into wire',
        'has metallic lustre',
      ],
      explanationZh:
        '固态导电说明有可移动电子；能拉丝说明离子层移动后吸引仍能维持。两条线索共同指向金属键。',
      explanationEn:
        'Solid conductivity suggests mobile electrons; drawing into wire shows attraction survives layer movement. Together they point to metallic bonding.',
    },
    {
      id: 'salt',
      icon: '🧂',
      zh: '食盐',
      en: 'Table salt',
      kind: 'ionic',
      cluesZh: ['晶体较硬而脆', '固态不易导电', '溶于水后溶液导电'],
      cluesEn: [
        'hard, brittle crystals',
        'solid conducts poorly',
        'solution conducts',
      ],
      explanationZh:
        '正负离子构成强晶格；固态时离子固定，溶解后离子可移动。整组证据与离子结构吻合。',
      explanationEn:
        'Positive and negative ions form a strong lattice. Ions are fixed in the solid but mobile after dissolving—the full evidence set matches an ionic structure.',
    },
    {
      id: 'wax',
      icon: '🕯️',
      zh: '蜡',
      en: 'Wax',
      kind: 'molecular',
      cluesZh: ['不导电', '受热较容易软化', '由许多独立分子组成'],
      cluesEn: [
        'does not conduct',
        'softens fairly easily',
        'contains many separate molecules',
      ],
      explanationZh:
        '蜡分子内部有强共价键，但软化主要克服较弱的分子间吸引，因此符合分子物质模型。',
      explanationEn:
        'Wax has strong covalent bonds inside each molecule, but softening mainly overcomes weaker attractions between molecules, fitting a molecular structure.',
    },
    {
      id: 'diamond',
      icon: '💎',
      zh: '钻石',
      en: 'Diamond',
      kind: 'giant',
      cluesZh: ['极硬', '耐高温', '每个碳都与网络相连'],
      cluesEn: [
        'extremely hard',
        'resists high temperature',
        'every carbon joins a network',
      ],
      explanationZh:
        '强共价键贯穿整个三维网络，移动一个原子就会牵动许多强键，因此钻石极硬且耐高温。',
      explanationEn:
        'Strong covalent bonds extend through a three-dimensional network, so moving one atom disrupts many strong bonds, making diamond hard and heat-resistant.',
    },
  ];
  const [materialIndex, setMaterialIndex] = useState(0);
  const [choice, setChoice] = useState<StructureKind | null>(null);
  const material = materials[materialIndex]!;
  const correct = choice === material.kind;
  const nodes = Array.from({ length: 16 }, (_, index) => index);

  return (
    <div className="structure-detective-lab">
      <div
        className="detective-tabs"
        role="group"
        aria-label={mode === 'en' ? 'Choose a material case' : '选择材料案件'}
      >
        {materials.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={materialIndex === index ? 'active' : ''}
            onClick={() => {
              setMaterialIndex(index);
              setChoice(null);
            }}
          >
            <span aria-hidden="true">{item.icon}</span>{' '}
            {mode === 'en' ? item.en : item.zh}
          </button>
        ))}
      </div>
      <div
        className={`detective-preview ${material.id}`}
        aria-label={
          mode === 'en'
            ? `${material.en} particle model`
            : `${material.zh}粒子模型`
        }
        role="img"
      >
        <div className="preview-network" aria-hidden="true">
          {nodes.map((index) => (
            <i
              key={index}
              className={`preview-node node-${index + 1} ${
                material.id === 'salt'
                  ? index % 2 === Math.floor(index / 4) % 2
                    ? 'positive'
                    : 'negative'
                  : ''
              }`}
            >
              {material.id === 'salt'
                ? index % 2 === Math.floor(index / 4) % 2
                  ? '+'
                  : '−'
                : material.id === 'diamond'
                  ? 'C'
                  : material.id === 'copper'
                    ? 'M⁺'
                    : index % 2 === 0
                      ? 'C'
                      : 'H'}
            </i>
          ))}
          {material.id === 'copper' &&
            Array.from({ length: 8 }, (_, index) => (
              <em
                key={index}
                className={`preview-electron electron-${index + 1}`}
              >
                e⁻
              </em>
            ))}
        </div>
        <span className="detective-material-name">
          {material.icon} {mode === 'en' ? material.en : material.zh}
        </span>
      </div>
      <div className="detective-console">
        <strong>{mode === 'en' ? 'Evidence collected' : '已收集的证据'}</strong>
        <ul>
          {(mode === 'en' ? material.cluesEn : material.cluesZh).map((clue) => (
            <li key={clue}>{clue}</li>
          ))}
        </ul>
        <p>
          {mode === 'en'
            ? 'Which structure fits all clues?'
            : '哪种结构能同时解释全部线索？'}
        </p>
        <div className="detective-answers">
          {kinds.map((kind) => {
            const selected = choice === kind.id;
            const revealCorrect = choice !== null && kind.id === material.kind;
            return (
              <button
                type="button"
                key={kind.id}
                className={`${selected ? 'selected' : ''} ${revealCorrect ? 'correct' : ''} ${selected && !correct ? 'wrong' : ''}`}
                onClick={() => setChoice(kind.id)}
              >
                {mode === 'en' ? kind.en : kind.zh}
              </button>
            );
          })}
        </div>
        {choice !== null && (
          <div
            className={`detective-feedback ${correct ? 'correct' : 'wrong'}`}
            aria-live="polite"
          >
            <b>
              {correct
                ? mode === 'en'
                  ? 'Case solved!'
                  : '破案成功！'
                : mode === 'en'
                  ? 'One clue does not fit yet.'
                  : '还有线索对不上。'}
            </b>
            <p>
              <strong>{mode === 'en' ? 'Explanation: ' : '解析：'}</strong>
              {mode === 'en' ? material.explanationEn : material.explanationZh}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function FormulaDecoderLab({ mode }: { mode: LanguageMode }) {
  const templates = [
    {
      id: 'water',
      formula: 'H₂O',
      zh: '水分子',
      en: 'water molecule',
      unitZh: '分子',
      unitEn: 'molecule',
      atoms: [
        { symbol: 'H', count: 2, colour: '#7e9fba' },
        { symbol: 'O', count: 1, colour: '#df8168' },
      ],
      noteZh: '下标 ₂ 只属于 H；O 没写下标，数量就是 1。',
      noteEn:
        'The subscript ₂ belongs only to H; O has no written subscript, so its count is one.',
    },
    {
      id: 'carbon-dioxide',
      formula: 'CO₂',
      zh: '二氧化碳分子',
      en: 'carbon dioxide molecule',
      unitZh: '分子',
      unitEn: 'molecule',
      atoms: [
        { symbol: 'C', count: 1, colour: '#65727b' },
        { symbol: 'O', count: 2, colour: '#df8168' },
      ],
      noteZh: 'C 没写下标，所以每份有 1 个 C；O₂ 表示 2 个 O。',
      noteEn:
        'C has no subscript, so each unit has one C; O₂ means two O atoms.',
    },
    {
      id: 'salt',
      formula: 'NaCl',
      zh: '氯化钠化学式单位',
      en: 'sodium chloride formula unit',
      unitZh: '化学式单位',
      unitEn: 'formula unit',
      atoms: [
        { symbol: 'Na', count: 1, colour: '#709b93' },
        { symbol: 'Cl', count: 1, colour: '#d58c69' },
      ],
      noteZh: '离子固体不用“分子”描述；NaCl 表示 Na⁺ 与 Cl⁻ 的最简比例 1∶1。',
      noteEn:
        'An ionic solid is not described as molecules; NaCl gives the simplest Na⁺:Cl⁻ ratio, 1:1.',
    },
    {
      id: 'peroxide',
      formula: 'H₂O₂',
      zh: '过氧化氢分子',
      en: 'hydrogen peroxide molecule',
      unitZh: '分子',
      unitEn: 'molecule',
      atoms: [
        { symbol: 'H', count: 2, colour: '#7e9fba' },
        { symbol: 'O', count: 2, colour: '#df8168' },
      ],
      noteZh: 'H₂O₂ 比 H₂O 多一个 O，已经是另一种物质；不要把产品当水使用。',
      noteEn:
        'H₂O₂ has one more O than H₂O and is a different substance; never treat the product as water.',
    },
  ];
  const [templateIndex, setTemplateIndex] = useState(0);
  const [coefficient, setCoefficient] = useState(1);
  const template = templates[templateIndex]!;
  const displayedFormula = `${coefficient > 1 ? coefficient : ''}${template.formula}`;

  return (
    <div className="formula-decoder-lab">
      <div
        className="formula-tabs"
        role="group"
        aria-label={mode === 'en' ? 'Choose a formula' : '选择化学式'}
      >
        {templates.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={templateIndex === index ? 'active' : ''}
            onClick={() => {
              setTemplateIndex(index);
              setCoefficient(1);
            }}
          >
            {item.formula}
          </button>
        ))}
      </div>
      <div className="formula-scene" aria-live="polite">
        <div className="formula-display">
          {coefficient > 1 && <b>{coefficient}</b>}
          <strong>{template.formula}</strong>
        </div>
        <div
          className="formula-units"
          aria-label={
            mode === 'en'
              ? `${coefficient} ${template.unitEn}${coefficient > 1 ? 's' : ''}`
              : `${coefficient} 个${template.unitZh}`
          }
        >
          {Array.from({ length: coefficient }, (_, unitIndex) => (
            <div className={`formula-unit ${template.id}`} key={unitIndex}>
              {template.atoms.flatMap((atom) =>
                Array.from({ length: atom.count }, (_, atomIndex) => (
                  <span
                    key={`${atom.symbol}-${atomIndex}`}
                    style={{ '--formula-atom': atom.colour } as CSSProperties}
                  >
                    {atom.symbol}
                  </span>
                )),
              )}
            </div>
          ))}
        </div>
        <span className="formula-unit-label">
          {coefficient} × {mode === 'en' ? template.unitEn : template.unitZh}
        </span>
      </div>
      <div className="formula-readout">
        <div className="coefficient-control">
          <span>{mode === 'en' ? 'Whole units' : '整份数量'}</span>
          <button
            type="button"
            disabled={coefficient === 1}
            onClick={() => setCoefficient((value) => Math.max(1, value - 1))}
            aria-label={mode === 'en' ? 'Remove one unit' : '减少一份'}
          >
            −
          </button>
          <b>{coefficient}</b>
          <button
            type="button"
            disabled={coefficient === 3}
            onClick={() => setCoefficient((value) => Math.min(3, value + 1))}
            aria-label={mode === 'en' ? 'Add one unit' : '增加一份'}
          >
            +
          </button>
        </div>
        <strong>
          {displayedFormula} · {mode === 'en' ? template.en : template.zh}
        </strong>
        <div className="formula-counts">
          {template.atoms.map((atom) => (
            <span key={atom.symbol}>
              <i style={{ background: atom.colour }} />
              {atom.symbol}: <b>{atom.count * coefficient}</b>
            </span>
          ))}
        </div>
        <p>{mode === 'en' ? template.noteEn : template.noteZh}</p>
        <p className="formula-rule">
          {mode === 'en'
            ? `Coefficient ${coefficient} multiplies every atom count; subscripts inside ${template.formula} stay unchanged.`
            : `系数 ${coefficient} 乘上每一种原子总数；${template.formula} 内部的下标保持不变。`}
        </p>
      </div>
    </div>
  );
}

function IonicFormulaBalanceLab({ mode }: { mode: LanguageMode }) {
  const pairs = [
    {
      id: 'salt',
      formula: 'NaCl',
      useZh: '餐桌盐',
      useEn: 'table salt',
      cation: {
        symbol: 'Na',
        ion: 'Na⁺',
        charge: 1,
        zh: '钠离子',
        en: 'sodium ion',
      },
      anion: {
        symbol: 'Cl',
        ion: 'Cl⁻',
        charge: -1,
        zh: '氯离子',
        en: 'chloride ion',
      },
      target: [1, 1],
    },
    {
      id: 'magnesium-chloride',
      formula: 'MgCl₂',
      useZh: '海水中的镁盐',
      useEn: 'a magnesium salt in seawater',
      cation: {
        symbol: 'Mg',
        ion: 'Mg²⁺',
        charge: 2,
        zh: '镁离子',
        en: 'magnesium ion',
      },
      anion: {
        symbol: 'Cl',
        ion: 'Cl⁻',
        charge: -1,
        zh: '氯离子',
        en: 'chloride ion',
      },
      target: [1, 2],
    },
    {
      id: 'calcium-oxide',
      formula: 'CaO',
      useZh: '石灰的主要成分',
      useEn: 'the main substance in quicklime',
      cation: {
        symbol: 'Ca',
        ion: 'Ca²⁺',
        charge: 2,
        zh: '钙离子',
        en: 'calcium ion',
      },
      anion: {
        symbol: 'O',
        ion: 'O²⁻',
        charge: -2,
        zh: '氧离子',
        en: 'oxide ion',
      },
      target: [1, 1],
    },
    {
      id: 'aluminium-oxide',
      formula: 'Al₂O₃',
      useZh: '铝表面的保护层',
      useEn: 'the protective layer on aluminium',
      cation: {
        symbol: 'Al',
        ion: 'Al³⁺',
        charge: 3,
        zh: '铝离子',
        en: 'aluminium ion',
      },
      anion: {
        symbol: 'O',
        ion: 'O²⁻',
        charge: -2,
        zh: '氧离子',
        en: 'oxide ion',
      },
      target: [2, 3],
    },
  ];
  const [pairIndex, setPairIndex] = useState(1);
  const [cationCount, setCationCount] = useState(1);
  const [anionCount, setAnionCount] = useState(1);
  const pair = pairs[pairIndex]!;
  const positiveTotal = cationCount * pair.cation.charge;
  const negativeTotal = anionCount * pair.anion.charge;
  const netCharge = positiveTotal + negativeTotal;
  const commonFactor = (a: number, b: number) => {
    let left = a;
    let right = b;
    while (right !== 0) {
      [left, right] = [right, left % right];
    }
    return left;
  };
  const balanced = netCharge === 0;
  const simplest = balanced && commonFactor(cationCount, anionCount) === 1;
  const subscript = (count: number) => ['', '', '₂', '₃'][count] ?? '';
  const builtFormula = `${pair.cation.symbol}${subscript(cationCount)}${pair.anion.symbol}${subscript(anionCount)}`;
  const meterPosition = 50 + Math.max(-6, Math.min(6, netCharge)) * 7;

  const choosePair = (index: number) => {
    setPairIndex(index);
    setCationCount(1);
    setAnionCount(1);
  };

  const countControl = (
    kind: 'cation' | 'anion',
    count: number,
    setCount: (value: number | ((old: number) => number)) => void,
  ) => {
    const ion = kind === 'cation' ? pair.cation : pair.anion;
    const name = mode === 'en' ? ion.en : ion.zh;
    return (
      <div className={`ion-count-control ${kind}`}>
        <span>
          {ion.ion} · {name}
        </span>
        <div>
          <button
            type="button"
            disabled={count === 1}
            onClick={() => setCount((old) => Math.max(1, old - 1))}
            aria-label={`${mode === 'en' ? 'Remove' : '减少'} ${name}`}
          >
            −
          </button>
          <b>{count}</b>
          <button
            type="button"
            disabled={count === 3}
            onClick={() => setCount((old) => Math.min(3, old + 1))}
            aria-label={`${mode === 'en' ? 'Add' : '增加'} ${name}`}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="ionic-formula-lab">
      <div
        className="ionic-pair-tabs"
        role="group"
        aria-label={mode === 'en' ? 'Choose an ion pair' : '选择离子组合'}
      >
        {pairs.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={pairIndex === index ? 'active' : ''}
            onClick={() => choosePair(index)}
          >
            {item.cation.ion} + {item.anion.ion}
          </button>
        ))}
      </div>
      <div className="ionic-balance-scene" aria-live="polite">
        <div className="ion-pile positive">
          {Array.from({ length: cationCount }, (_, index) => (
            <span key={index}>{pair.cation.ion}</span>
          ))}
        </div>
        <div className="charge-balance-meter">
          <div className="charge-meter-labels">
            <span>−</span>
            <b>{mode === 'en' ? 'net charge' : '净电荷'}</b>
            <span>+</span>
          </div>
          <div className="charge-meter-track">
            <i style={{ left: `${meterPosition}%` }} />
          </div>
          <strong className={balanced ? 'balanced' : ''}>
            {netCharge > 0 ? '+' : ''}
            {netCharge}
          </strong>
        </div>
        <div className="ion-pile negative">
          {Array.from({ length: anionCount }, (_, index) => (
            <span key={index}>{pair.anion.ion}</span>
          ))}
        </div>
        <span className="ionic-scene-caption">
          {positiveTotal > 0 ? '+' : ''}
          {positiveTotal} {negativeTotal < 0 ? '−' : '+'}{' '}
          {Math.abs(negativeTotal)}
          {' = '}
          {netCharge > 0 ? '+' : ''}
          {netCharge}
        </span>
      </div>
      <div className="ionic-formula-console">
        <p>
          {mode === 'en'
            ? 'Build the smallest neutral team'
            : '搭出最小的电中性组合'}
        </p>
        <div className="ion-count-controls">
          {countControl('cation', cationCount, setCationCount)}
          {countControl('anion', anionCount, setAnionCount)}
        </div>
        <div
          className={`ionic-formula-result ${simplest ? 'correct' : balanced ? 'reduce' : ''}`}
        >
          <span>{mode === 'en' ? 'Formula' : '化学式'}</span>
          <strong>
            {simplest
              ? pair.formula
              : balanced
                ? `${builtFormula} → ${pair.formula}`
                : '?'}
          </strong>
        </div>
        <p className="ionic-balance-feedback">
          {simplest
            ? mode === 'en'
              ? `Balanced and simplest: ${pair.formula} is ${pair.useEn}.`
              : `电荷归零，而且比例最简：${pair.formula} 是${pair.useZh}。`
            : balanced
              ? mode === 'en'
                ? 'The charge balances, but both counts share a factor. Reduce the ratio.'
                : '电荷已经归零，但两个数量还能同时约分；请化成最简比。'
              : netCharge > 0
                ? mode === 'en'
                  ? `Still ${netCharge} positive: add negative charge or remove positive charge.`
                  : `还多出 +${netCharge}：增加负电荷，或减少正电荷。`
                : mode === 'en'
                  ? `Still ${Math.abs(netCharge)} negative: add positive charge or remove negative charge.`
                  : `还多出 ${Math.abs(netCharge)} 份负电荷：增加正电荷，或减少负电荷。`}
        </p>
        <p className="ionic-balance-rule">
          {mode === 'en'
            ? `Target: ${pair.target[0]} ${pair.cation.ion} and ${pair.target[1]} ${pair.anion.ion}. Check charge first; write subscripts last.`
            : `目标：${pair.target[0]} 个 ${pair.cation.ion} 与 ${pair.target[1]} 个 ${pair.anion.ion}。先验电荷，最后才写下标。`}
        </p>
      </div>
    </div>
  );
}

function IonicNamingLab({ mode }: { mode: LanguageMode }) {
  const compounds = [
    {
      formula: 'NaCl',
      cationSymbol: 'Na',
      anionSymbol: 'Cl',
      cationIon: 'Na⁺',
      anionIon: 'Cl⁻',
      cationEn: 'sodium',
      cationZh: '钠',
      elementEn: 'chlorine',
      anionEn: 'chloride',
      anionZh: '氯化',
      answer: 0,
      options: [
        { zh: '氯化钠', en: 'sodium chloride' },
        { zh: '钠氯', en: 'sodium chlorine' },
        { zh: '一氯化钠', en: 'sodium monochloride' },
      ],
      useZh: '餐桌盐',
      useEn: 'table salt',
    },
    {
      formula: 'MgO',
      cationSymbol: 'Mg',
      anionSymbol: 'O',
      cationIon: 'Mg²⁺',
      anionIon: 'O²⁻',
      cationEn: 'magnesium',
      cationZh: '镁',
      elementEn: 'oxygen',
      anionEn: 'oxide',
      anionZh: '氧化',
      answer: 1,
      options: [
        { zh: '镁氧', en: 'magnesium oxygen' },
        { zh: '氧化镁', en: 'magnesium oxide' },
        { zh: '一氧化一镁', en: 'monomagnesium monoxide' },
      ],
      useZh: '耐火材料',
      useEn: 'heat-resistant materials',
    },
    {
      formula: 'CaCl₂',
      cationSymbol: 'Ca',
      anionSymbol: 'Cl₂',
      cationIon: 'Ca²⁺',
      anionIon: 'Cl⁻',
      cationEn: 'calcium',
      cationZh: '钙',
      elementEn: 'chlorine',
      anionEn: 'chloride',
      anionZh: '氯化',
      answer: 2,
      options: [
        { zh: '钙氯二', en: 'calcium chlorine' },
        { zh: '二氯化钙', en: 'calcium dichloride' },
        { zh: '氯化钙', en: 'calcium chloride' },
      ],
      useZh: '吸湿剂',
      useEn: 'moisture absorbers',
    },
    {
      formula: 'Al₂O₃',
      cationSymbol: 'Al₂',
      anionSymbol: 'O₃',
      cationIon: 'Al³⁺',
      anionIon: 'O²⁻',
      cationEn: 'aluminium',
      cationZh: '铝',
      elementEn: 'oxygen',
      anionEn: 'oxide',
      anionZh: '氧化',
      answer: 0,
      options: [
        { zh: '氧化铝', en: 'aluminium oxide' },
        { zh: '铝化氧', en: 'aluminium oxygen' },
        { zh: '三氧化二铝', en: 'dialuminium trioxide' },
      ],
      useZh: '铝的保护层',
      useEn: "aluminium's protective layer",
    },
  ];
  const [compoundIndex, setCompoundIndex] = useState(0);
  const [guess, setGuess] = useState<number | null>(null);
  const compound = compounds[compoundIndex]!;
  const answered = guess !== null;
  const correct = guess === compound.answer;
  const showName = (text: { zh: string; en: string }) => {
    if (mode === 'en') return text.en;
    if (mode === 'zh') return text.zh;
    return `${text.zh} · ${text.en}`;
  };

  return (
    <div className="ionic-naming-lab">
      <div
        className="naming-tabs"
        role="group"
        aria-label={
          mode === 'en' ? 'Choose a formula to name' : '选择要命名的化学式'
        }
      >
        {compounds.map((item, index) => (
          <button
            type="button"
            key={item.formula}
            className={compoundIndex === index ? 'active' : ''}
            onClick={() => {
              setCompoundIndex(index);
              setGuess(null);
            }}
          >
            {item.formula}
          </button>
        ))}
      </div>
      <div className="naming-machine">
        <span className="naming-machine-label">
          {mode === 'en'
            ? 'FORMULA → TWO IONS → NAME'
            : '化学式 → 两种离子 → 名称'}
        </span>
        <strong className="naming-formula">{compound.formula}</strong>
        <div className="naming-ion-parts">
          <span className="cation">
            <b>{compound.cationSymbol}</b>
            <small>{compound.cationIon}</small>
          </span>
          <i>+</i>
          <span className="anion">
            <b>{compound.anionSymbol}</b>
            <small>{compound.anionIon}</small>
          </span>
        </div>
        <div className={`naming-language-rails ${answered ? 'revealed' : ''}`}>
          <div>
            <span>EN</span>
            <p>
              <b>{compound.cationEn}</b>
              <i>+</i>
              <b>{answered ? compound.anionEn : `${compound.elementEn} → ?`}</b>
            </p>
            <strong>
              {answered ? `${compound.cationEn} ${compound.anionEn}` : '???'}
            </strong>
          </div>
          <div>
            <span>中文</span>
            <p>
              <b>{answered ? compound.anionZh : '？化'}</b>
              <i>+</i>
              <b>{compound.cationZh}</b>
            </p>
            <strong>
              {answered ? `${compound.anionZh}${compound.cationZh}` : '？？？'}
            </strong>
          </div>
        </div>
      </div>
      <div className="naming-challenge">
        <p>{mode === 'en' ? 'Choose the correct name' : '选出正确名称'}</p>
        <div className="naming-options">
          {compound.options.map((option, index) => (
            <button
              type="button"
              key={option.en}
              className={
                guess === index
                  ? index === compound.answer
                    ? 'correct'
                    : 'wrong'
                  : answered && index === compound.answer
                    ? 'correct-answer'
                    : ''
              }
              onClick={() => setGuess(index)}
            >
              {showName(option)}
            </button>
          ))}
        </div>
        <div
          className={`naming-feedback ${answered ? (correct ? 'correct' : 'wrong') : ''}`}
          aria-live="polite"
        >
          {!answered
            ? mode === 'en'
              ? 'Hint: keep the metal name; transform the non-metal name.'
              : '提示：金属保留原名，非金属换成对应的阴离子名称。'
            : correct
              ? mode === 'en'
                ? `Correct. ${compound.formula} is ${compound.useEn}.`
                : `命名成功。${compound.formula} 可见于${compound.useZh}。`
              : mode === 'en'
                ? `Try the rule again: ${compound.cationEn} + ${compound.anionEn}.`
                : `再按规则拆一次：${compound.anionZh} + ${compound.cationZh}。`}
        </div>
        <p className="naming-rule-note">
          {mode === 'en'
            ? 'Ionic subscripts balance charge; do not read them as mono-, di- or tri- prefixes.'
            : '离子化合物的下标负责平衡电荷，不直接读成“一、二、三”前缀。'}
        </p>
      </div>
    </div>
  );
}

function RomanChargeDetectiveLab({ mode }: { mode: LanguageMode }) {
  const cases = [
    {
      formula: 'FeCl₂',
      metal: 'Fe',
      metalCount: 1,
      anion: 'Cl⁻',
      anionCount: 2,
      anionCharge: -1,
      correctCharge: 2,
      roman: 'II',
      nameZh: '氯化亚铁',
      nameEn: 'iron(II) chloride',
      clueZh: '一些补铁配方使用 Fe²⁺ 盐',
      clueEn: 'some iron supplements use Fe²⁺ salts',
      colour: '#75888d',
    },
    {
      formula: 'FeCl₃',
      metal: 'Fe',
      metalCount: 1,
      anion: 'Cl⁻',
      anionCount: 3,
      anionCharge: -1,
      correctCharge: 3,
      roman: 'III',
      nameZh: '氯化铁',
      nameEn: 'iron(III) chloride',
      clueZh: 'Fe³⁺ 盐常呈黄棕色',
      clueEn: 'Fe³⁺ salts are often yellow-brown',
      colour: '#9c7658',
    },
    {
      formula: 'Cu₂O',
      metal: 'Cu',
      metalCount: 2,
      anion: 'O²⁻',
      anionCount: 1,
      anionCharge: -2,
      correctCharge: 1,
      roman: 'I',
      nameZh: '氧化亚铜',
      nameEn: 'copper(I) oxide',
      clueZh: '这种氧化物常呈红色',
      clueEn: 'this oxide is commonly red',
      colour: '#bc704f',
    },
    {
      formula: 'CuO',
      metal: 'Cu',
      metalCount: 1,
      anion: 'O²⁻',
      anionCount: 1,
      anionCharge: -2,
      correctCharge: 2,
      roman: 'II',
      nameZh: '氧化铜',
      nameEn: 'copper(II) oxide',
      clueZh: '这种氧化物常呈黑色',
      clueEn: 'this oxide is commonly black',
      colour: '#555d5b',
    },
  ];
  const [caseIndex, setCaseIndex] = useState(0);
  const [chargeGuess, setChargeGuess] = useState<number | null>(null);
  const selected = cases[caseIndex]!;
  const negativeTotal = selected.anionCount * selected.anionCharge;
  const guessedNet =
    chargeGuess === null
      ? null
      : selected.metalCount * chargeGuess + negativeTotal;
  const correct = chargeGuess === selected.correctCharge;

  return (
    <div className="roman-charge-lab">
      <div
        className="roman-case-tabs"
        role="group"
        aria-label={mode === 'en' ? 'Choose a formula' : '选择化学式'}
      >
        {cases.map((item, index) => (
          <button
            type="button"
            key={item.formula}
            className={caseIndex === index ? 'active' : ''}
            onClick={() => {
              setCaseIndex(index);
              setChargeGuess(null);
            }}
          >
            {item.formula}
          </button>
        ))}
      </div>
      <div className="roman-detective-scene" aria-live="polite">
        <span className="roman-case-label">
          {mode === 'en' ? 'CHARGE EVIDENCE' : '电荷证据'}
        </span>
        <strong>{selected.formula}</strong>
        <div className="roman-ion-cloud">
          <div>
            {Array.from({ length: selected.metalCount }, (_, index) => (
              <span
                className="metal"
                style={{ '--metal-ion': selected.colour } as CSSProperties}
                key={index}
              >
                {selected.metal}
                <sup>{chargeGuess === null ? '?+' : `${chargeGuess}+`}</sup>
              </span>
            ))}
          </div>
          <i>+</i>
          <div>
            {Array.from({ length: selected.anionCount }, (_, index) => (
              <span className="anion" key={index}>
                {selected.anion}
              </span>
            ))}
          </div>
        </div>
        <div className={`roman-equation ${correct ? 'balanced' : ''}`}>
          <span>
            {selected.metalCount} ×{' '}
            {chargeGuess === null ? '?' : `+${chargeGuess}`}
          </span>
          <i>+</i>
          <span>{negativeTotal}</span>
          <i>=</i>
          <b>
            {guessedNet === null
              ? '?'
              : `${guessedNet > 0 ? '+' : ''}${guessedNet}`}
          </b>
        </div>
      </div>
      <div className="roman-detective-console">
        <p>
          {mode === 'en'
            ? `What is the charge on each ${selected.metal} ion?`
            : `每个 ${selected.metal} 离子带多少正电荷？`}
        </p>
        <div className="roman-charge-options">
          {[1, 2, 3].map((charge) => (
            <button
              type="button"
              key={charge}
              className={
                chargeGuess === charge
                  ? charge === selected.correctCharge
                    ? 'correct'
                    : 'wrong'
                  : ''
              }
              onClick={() => setChargeGuess(charge)}
            >
              +{charge}
            </button>
          ))}
        </div>
        <div
          className={`roman-result ${chargeGuess === null ? '' : correct ? 'correct' : 'wrong'}`}
          aria-live="polite"
        >
          {chargeGuess === null ? (
            <p>
              {mode === 'en'
                ? `The anions total ${negativeTotal}. Make the whole formula equal zero.`
                : `阴离子合计 ${negativeTotal}。请选择能让整个化学式归零的金属电荷。`}
            </p>
          ) : correct ? (
            <>
              <span>{mode === 'en' ? 'Name unlocked' : '名称解锁'}</span>
              <strong>
                {mode === 'en' ? selected.nameEn : selected.nameZh}
              </strong>
              <p>
                {mode === 'en' ? `${selected.clueEn}.` : `${selected.clueZh}。`}
              </p>
            </>
          ) : (
            <p>
              {mode === 'en'
                ? `${selected.metalCount} × +${chargeGuess} plus ${negativeTotal} gives ${guessedNet}; a compound must total zero.`
                : `${selected.metalCount} × (+${chargeGuess}) 再加 ${negativeTotal} 等于 ${guessedNet}，还没有归零。`}
            </p>
          )}
        </div>
        <p className="roman-rule-note">
          {correct
            ? mode === 'en'
              ? `Write charge ${selected.correctCharge} as (${selected.roman}) in the English metal name—not as an atom count.`
              : `英语把电荷 ${selected.correctCharge} 写成名称中的 (${selected.roman})；它不是原子数量。`
            : mode === 'en'
              ? 'Roman numerals report charge per metal ion, not the number of metal atoms.'
              : '罗马数字记录每个金属离子的电荷，不表示金属原子的数量。'}
        </p>
      </div>
    </div>
  );
}

function PolyatomicPackageLab({ mode }: { mode: LanguageMode }) {
  const cases = [
    {
      id: 'chalk',
      tabZh: '蛋壳与粉笔',
      tabEn: 'Eggshell & chalk',
      cation: 'Ca²⁺',
      cationCount: 1,
      cationCharge: 2,
      group: 'CO₃²⁻',
      groupFormula: 'CO₃',
      groupCount: 1,
      groupCharge: -2,
      atoms: ['C', 'O', 'O', 'O'],
      formula: 'CaCO₃',
      nameZh: '碳酸钙',
      nameEn: 'calcium carbonate',
      options: ['CaCO₃', 'Ca(CO₃)', 'Ca₂CO₃'],
      answer: 0,
      factZh: '只有一组碳酸根，所以不用括号。',
      factEn:
        'There is only one carbonate group, so no parentheses are needed.',
    },
    {
      id: 'antacid',
      tabZh: '抗酸剂',
      tabEn: 'Antacid',
      cation: 'Mg²⁺',
      cationCount: 1,
      cationCharge: 2,
      group: 'OH⁻',
      groupFormula: 'OH',
      groupCount: 2,
      groupCharge: -1,
      atoms: ['O', 'H'],
      formula: 'Mg(OH)₂',
      nameZh: '氢氧化镁',
      nameEn: 'magnesium hydroxide',
      options: ['MgOH₂', 'Mg(OH)₂', 'Mg₂OH'],
      answer: 1,
      factZh: '两组 OH⁻ 必须各自保持完整，因此用括号。',
      factEn:
        'Two OH⁻ groups must each stay intact, so parentheses are required.',
    },
    {
      id: 'water-treatment',
      tabZh: '净水材料',
      tabEn: 'Water treatment',
      cation: 'Al³⁺',
      cationCount: 2,
      cationCharge: 3,
      group: 'SO₄²⁻',
      groupFormula: 'SO₄',
      groupCount: 3,
      groupCharge: -2,
      atoms: ['S', 'O', 'O', 'O', 'O'],
      formula: 'Al₂(SO₄)₃',
      nameZh: '硫酸铝',
      nameEn: 'aluminium sulfate',
      options: ['AlSO₄', 'Al₂SO₄₃', 'Al₂(SO₄)₃'],
      answer: 2,
      factZh: '三组硫酸根合计 −6，与两个 Al³⁺ 的 +6 抵消。',
      factEn: 'Three sulfate groups total −6, balancing +6 from two Al³⁺ ions.',
    },
    {
      id: 'garden',
      tabZh: '园艺标签',
      tabEn: 'Garden label',
      cation: 'Na⁺',
      cationCount: 1,
      cationCharge: 1,
      group: 'NO₃⁻',
      groupFormula: 'NO₃',
      groupCount: 1,
      groupCharge: -1,
      atoms: ['N', 'O', 'O', 'O'],
      formula: 'NaNO₃',
      nameZh: '硝酸钠',
      nameEn: 'sodium nitrate',
      options: ['Na(NO₃)', 'NaNO₃', 'Na₃NO'],
      answer: 1,
      factZh: '一组 NO₃⁻ 与一个 Na⁺ 已经平衡，不需要括号。',
      factEn:
        'One NO₃⁻ group balances one Na⁺, so parentheses are unnecessary.',
    },
  ];
  const [caseIndex, setCaseIndex] = useState(1);
  const [answerIndex, setAnswerIndex] = useState<number | null>(null);
  const selected = cases[caseIndex]!;
  const correct = answerIndex === selected.answer;
  const positiveTotal = selected.cationCount * selected.cationCharge;
  const negativeTotal = selected.groupCount * selected.groupCharge;

  return (
    <div className="polyatomic-package-lab">
      <div
        className="polyatomic-tabs"
        role="group"
        aria-label={
          mode === 'en' ? 'Choose an everyday context' : '选择生活场景'
        }
      >
        {cases.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={caseIndex === index ? 'active' : ''}
            onClick={() => {
              setCaseIndex(index);
              setAnswerIndex(null);
            }}
          >
            {mode === 'en' ? item.tabEn : item.tabZh}
          </button>
        ))}
      </div>
      <div className="polyatomic-scene" aria-live="polite">
        <span className="polyatomic-scene-label">
          {mode === 'en' ? 'KEEP EACH GROUP TOGETHER' : '每一组都要保持完整'}
        </span>
        <div className="polyatomic-parts">
          <div className="poly-cation-pile">
            {Array.from({ length: selected.cationCount }, (_, index) => (
              <span key={index}>{selected.cation}</span>
            ))}
          </div>
          <i>+</i>
          <div className="poly-group-pile">
            {Array.from({ length: selected.groupCount }, (_, groupIndex) => (
              <div className="poly-package" key={groupIndex}>
                <b>{selected.group}</b>
                <div>
                  {selected.atoms.map((atom, atomIndex) => (
                    <span className={atom} key={`${atom}-${atomIndex}`}>
                      {atom}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="poly-charge-line">
          <span>
            {selected.cationCount} × (+{selected.cationCharge})
          </span>
          <i>+</i>
          <span>
            {selected.groupCount} × ({selected.groupCharge})
          </span>
          <i>=</i>
          <b>{positiveTotal + negativeTotal}</b>
        </div>
      </div>
      <div className="polyatomic-console">
        <p>
          {mode === 'en'
            ? `Which formula keeps ${selected.groupFormula} together?`
            : `哪一个化学式让 ${selected.groupFormula} 始终保持为整组？`}
        </p>
        <div className="polyatomic-options">
          {selected.options.map((option, index) => (
            <button
              type="button"
              key={option}
              className={
                answerIndex === index
                  ? index === selected.answer
                    ? 'correct'
                    : 'wrong'
                  : ''
              }
              onClick={() => setAnswerIndex(index)}
            >
              {option}
            </button>
          ))}
        </div>
        <div
          className={`polyatomic-result ${answerIndex === null ? '' : correct ? 'correct' : 'wrong'}`}
          aria-live="polite"
        >
          {answerIndex === null
            ? mode === 'en'
              ? `You need ${selected.groupCount} complete ${selected.groupFormula} group${selected.groupCount > 1 ? 's' : ''}.`
              : `需要 ${selected.groupCount} 组完整的 ${selected.groupFormula}。`
            : correct
              ? mode === 'en'
                ? `${selected.formula} · ${selected.nameEn}. ${selected.factEn}`
                : `${selected.formula} · ${selected.nameZh}。${selected.factZh}`
              : mode === 'en'
                ? `That notation breaks the package or changes the ratio. Keep every ${selected.groupFormula} group intact.`
                : `这种写法拆散了原子团或改变了比例。${selected.groupFormula} 必须整组保留。`}
        </div>
        <p className="polyatomic-rule-note">
          {mode === 'en'
            ? 'Outside subscript = number of whole packages. It multiplies every atom inside the parentheses.'
            : '括号外下标＝整组的数量；它会乘括号里的每一种原子。'}
        </p>
      </div>
    </div>
  );
}

function MolecularPrefixLab({ mode }: { mode: LanguageMode }) {
  const molecules = [
    {
      formula: 'CO',
      firstSymbol: 'C',
      firstCount: 1,
      firstName: 'carbon',
      secondSymbol: 'O',
      secondCount: 1,
      secondElement: 'oxygen',
      secondName: 'monoxide',
      prefix: 'mono-',
      nameZh: '一氧化碳',
      nameEn: 'carbon monoxide',
      answer: 0,
      options: [
        { zh: '一氧化碳', en: 'carbon monoxide' },
        { zh: '碳氧', en: 'carbon oxide' },
        { zh: '一碳一氧化物', en: 'monocarbon monoxide' },
      ],
      factZh: 'CO 无色无味却有毒，安全警报器会直接使用缩写 CO。',
      factEn:
        'CO is colourless, odourless and poisonous; safety alarms use the abbreviation CO.',
    },
    {
      formula: 'CO₂',
      firstSymbol: 'C',
      firstCount: 1,
      firstName: 'carbon',
      secondSymbol: 'O',
      secondCount: 2,
      secondElement: 'oxygen',
      secondName: 'dioxide',
      prefix: 'di-',
      nameZh: '二氧化碳',
      nameEn: 'carbon dioxide',
      answer: 1,
      options: [
        { zh: '一氧化二碳', en: 'dicarbon monoxide' },
        { zh: '二氧化碳', en: 'carbon dioxide' },
        { zh: '碳化氧', en: 'carbon oxide' },
      ],
      factZh: '汽水开瓶时，溶解的 CO₂ 会形成看得见的气泡。',
      factEn: 'When a fizzy drink opens, dissolved CO₂ forms visible bubbles.',
    },
    {
      formula: 'NO₂',
      firstSymbol: 'N',
      firstCount: 1,
      firstName: 'nitrogen',
      secondSymbol: 'O',
      secondCount: 2,
      secondElement: 'oxygen',
      secondName: 'dioxide',
      prefix: 'di-',
      nameZh: '二氧化氮',
      nameEn: 'nitrogen dioxide',
      answer: 2,
      options: [
        { zh: '二氮化氧', en: 'dinitrogen oxide' },
        { zh: '氮氧', en: 'nitrogen oxygen' },
        { zh: '二氧化氮', en: 'nitrogen dioxide' },
      ],
      factZh: 'NO₂ 是刺激性空气污染物之一，交通繁忙处需要监测它。',
      factEn: 'NO₂ is an irritating air pollutant monitored near busy traffic.',
    },
    {
      formula: 'N₂O',
      firstSymbol: 'N',
      firstCount: 2,
      firstName: 'dinitrogen',
      secondSymbol: 'O',
      secondCount: 1,
      secondElement: 'oxygen',
      secondName: 'monoxide',
      prefix: 'mono-',
      nameZh: '一氧化二氮',
      nameEn: 'dinitrogen monoxide',
      answer: 0,
      options: [
        { zh: '一氧化二氮', en: 'dinitrogen monoxide' },
        { zh: '二氧化氮', en: 'nitrogen dioxide' },
        { zh: '一氮化二氧', en: 'mononitrogen dioxide' },
      ],
      factZh: 'N₂O 也是温室气体；di- 与 mono- 准确保留了 2∶1 的原子数。',
      factEn:
        'N₂O is also a greenhouse gas; di- and mono- preserve its exact 2:1 atom count.',
    },
  ];
  const [moleculeIndex, setMoleculeIndex] = useState(0);
  const [nameGuess, setNameGuess] = useState<number | null>(null);
  const molecule = molecules[moleculeIndex]!;
  const correct = nameGuess === molecule.answer;
  const optionText = (option: { zh: string; en: string }) => {
    if (mode === 'en') return option.en;
    if (mode === 'zh') return option.zh;
    return `${option.zh} · ${option.en}`;
  };

  return (
    <div className="molecular-prefix-lab">
      <div
        className="molecular-tabs"
        role="group"
        aria-label={mode === 'en' ? 'Choose a molecule' : '选择分子'}
      >
        {molecules.map((item, index) => (
          <button
            type="button"
            key={item.formula}
            className={moleculeIndex === index ? 'active' : ''}
            onClick={() => {
              setMoleculeIndex(index);
              setNameGuess(null);
            }}
          >
            {item.formula}
          </button>
        ))}
      </div>
      <div className="molecular-prefix-scene" aria-live="polite">
        <span className="molecular-scene-label">
          {mode === 'en'
            ? 'COUNT THE ATOMS IN ONE MOLECULE'
            : '数清一个分子里的原子'}
        </span>
        <strong>{molecule.formula}</strong>
        <div className="molecule-bubbles">
          {Array.from({ length: molecule.firstCount }, (_, index) => (
            <span className="first" key={`first-${index}`}>
              {molecule.firstSymbol}
            </span>
          ))}
          {Array.from({ length: molecule.secondCount }, (_, index) => (
            <span className="second" key={`second-${index}`}>
              {molecule.secondSymbol}
            </span>
          ))}
        </div>
        <div className="molecular-counts">
          <span>
            {molecule.firstSymbol} × <b>{molecule.firstCount}</b>
          </span>
          <span>
            {molecule.secondSymbol} × <b>{molecule.secondCount}</b>
          </span>
        </div>
        <div className="prefix-blueprint">
          <p>
            <span>1st</span>
            <b>{molecule.firstCount}</b>
            <i>→</i>
            <strong>{molecule.firstName}</strong>
          </p>
          <p>
            <span>2nd</span>
            <b>{molecule.secondCount}</b>
            <i>→</i>
            <strong>
              {molecule.prefix} + {molecule.secondElement} →{' '}
              {molecule.secondName}
            </strong>
          </p>
        </div>
      </div>
      <div className="molecular-prefix-console">
        <p>{mode === 'en' ? 'Choose the precise name' : '选出准确名称'}</p>
        <div className="molecular-name-options">
          {molecule.options.map((option, index) => (
            <button
              type="button"
              key={option.en}
              className={
                nameGuess === index
                  ? index === molecule.answer
                    ? 'correct'
                    : 'wrong'
                  : ''
              }
              onClick={() => setNameGuess(index)}
            >
              {optionText(option)}
            </button>
          ))}
        </div>
        <div
          className={`molecular-name-feedback ${nameGuess === null ? '' : correct ? 'correct' : 'wrong'}`}
          aria-live="polite"
        >
          {nameGuess === null
            ? mode === 'en'
              ? 'Use each subscript as a real atom count. Omitted subscript = one.'
              : '把每个下标当作真实原子数；没有下标就是 1。'
            : correct
              ? mode === 'en'
                ? `${molecule.nameEn}. ${molecule.factEn}`
                : `${molecule.nameZh}。${molecule.factZh}`
              : mode === 'en'
                ? `Recount: ${molecule.firstCount} ${molecule.firstSymbol} and ${molecule.secondCount} ${molecule.secondSymbol}.`
                : `重新数一次：${molecule.firstSymbol} 有 ${molecule.firstCount} 个，${molecule.secondSymbol} 有 ${molecule.secondCount} 个。`}
        </div>
        <p className="molecular-prefix-rule">
          {mode === 'en'
            ? 'Molecular formula: prefixes count atoms. Ionic formula: charge fixes the ratio.'
            : '分子化合物：前缀数原子；离子化合物：电荷定比例。'}
        </p>
      </div>
    </div>
  );
}

function ReactionRearrangementLab({ mode }: { mode: LanguageMode }) {
  const [stage, setStage] = useState<'before' | 'after'>('before');
  const [showCounts, setShowCounts] = useState(false);
  const after = stage === 'after';
  const reset = () => {
    setStage('before');
    setShowCounts(false);
  };
  const Atom = ({ type }: { type: 'H' | 'O' }) => (
    <span className={`reaction-atom ${type.toLowerCase()}`}>{type}</span>
  );
  const H2 = () => (
    <div className="reaction-molecule h2" aria-label="H₂">
      <Atom type="H" />
      <Atom type="H" />
      <small>H₂</small>
    </div>
  );
  const O2 = () => (
    <div className="reaction-molecule o2" aria-label="O₂">
      <Atom type="O" />
      <Atom type="O" />
      <small>O₂</small>
    </div>
  );
  const Water = () => (
    <div className="reaction-molecule water" aria-label="H₂O">
      <Atom type="H" />
      <Atom type="O" />
      <Atom type="H" />
      <small>H₂O</small>
    </div>
  );

  return (
    <div className="reaction-rearrangement-lab">
      <div
        className="reaction-tabs"
        role="group"
        aria-label={mode === 'en' ? 'Reaction stage' : '反应阶段'}
      >
        <button
          type="button"
          className={!after ? 'active' : ''}
          onClick={reset}
        >
          {mode === 'en' ? 'Before reaction' : '反应前'}
        </button>
        <button
          type="button"
          className={after ? 'active' : ''}
          onClick={() => setStage('after')}
        >
          {mode === 'en' ? 'Let atoms regroup' : '让原子重新组队'}
        </button>
      </div>
      <div
        className={`reaction-scene ${after ? 'after' : 'before'}`}
        aria-live="polite"
      >
        <span className="reaction-scene-label">
          {after
            ? mode === 'en'
              ? 'PRODUCTS: NEW CONNECTIONS'
              : '生成物：新的连接方式'
            : mode === 'en'
              ? 'REACTANTS: SAME ATOMS, OLD TEAMS'
              : '反应物：同一批原子，原先的队伍'}
        </span>
        <div className="reaction-equation-display">
          <strong>2H₂ + O₂</strong>
          <i>→</i>
          <strong>2H₂O</strong>
        </div>
        <div className="reaction-particle-stage">
          {!after ? (
            <>
              <div className="reaction-reactant-group">
                <H2 />
                <H2 />
              </div>
              <i className="reaction-plus">+</i>
              <div className="reaction-reactant-group">
                <O2 />
              </div>
            </>
          ) : (
            <div className="reaction-product-group">
              <Water />
              <Water />
            </div>
          )}
        </div>
        {after && (
          <span className="reaction-spark" aria-hidden="true">
            ✦
          </span>
        )}
        <span className="reaction-stage-caption">
          {after
            ? mode === 'en'
              ? 'Two new water molecules have formed.'
              : '两份新的水分子形成了。'
            : mode === 'en'
              ? 'Two hydrogen molecules meet one oxygen molecule.'
              : '两份氢分子遇上一份氧分子。'}
        </span>
      </div>
      <div className="reaction-console">
        <p>{mode === 'en' ? 'Check the atom inventory' : '核对原子清单'}</p>
        <div className="reaction-count-controls">
          <button
            type="button"
            className={showCounts ? 'active' : ''}
            onClick={() => setShowCounts((value) => !value)}
          >
            {showCounts
              ? mode === 'en'
                ? 'Hide count check'
                : '收起原子核对'
              : mode === 'en'
                ? 'Count atoms on both sides'
                : '数一数两边的原子'}
          </button>
        </div>
        <div className={`reaction-count-card ${showCounts ? 'revealed' : ''}`}>
          {showCounts ? (
            <>
              <div>
                <span>{mode === 'en' ? 'Reactants' : '反应物'}</span>
                <b>H: 4 · O: 2</b>
              </div>
              <i>＝</i>
              <div>
                <span>{mode === 'en' ? 'Products' : '生成物'}</span>
                <b>H: 4 · O: 2</b>
              </div>
            </>
          ) : (
            <p>
              {mode === 'en'
                ? 'Use the coefficients and subscripts to count every atom.'
                : '用系数和下标数清每一种原子。'}
            </p>
          )}
        </div>
        <p className="reaction-model-note">
          {after
            ? mode === 'en'
              ? 'The bonds changed, but no H or O atoms were created or lost.'
              : '化学键改变了，但没有任何 H 或 O 原子被创造或丢失。'
            : mode === 'en'
              ? 'The arrow means “becomes”—it does not mean the atoms vanish.'
              : '箭头表示“变成”，不表示原子消失。'}
        </p>
      </div>
    </div>
  );
}

function EquationReaderLab({ mode }: { mode: LanguageMode }) {
  const [focus, setFocus] = useState<'coefficient' | 'subscript' | 'arrow'>(
    'coefficient',
  );
  const copy = {
    coefficient: {
      zh: '系数：前面的 2 表示两份完整的 H₂O。它乘整份，所以总共有 4 个 H 和 2 个 O。',
      en: 'Coefficient: the front 2 means two whole H₂O particles. It multiplies the whole formula, making 4 H and 2 O atoms in total.',
    },
    subscript: {
      zh: '下标：右下角的 ₂ 只说明“一份 H₂O 里有 2 个 H”。没有下标的 O 默认是 1 个。',
      en: 'Subscript: the lower ₂ says one H₂O particle contains 2 H atoms. O has no subscript, so it means 1 O atom.',
    },
    arrow: {
      zh: '箭头：读作“生成”或“变成”。左边是反应物，右边是生成物；箭头不是数学等号。',
      en: 'Arrow: read it as “forms” or “becomes.” Reactants are on the left and products are on the right; it is not a mathematical equals sign.',
    },
  }[focus];
  const labels = {
    coefficient: mode === 'en' ? 'Spot the coefficient' : '找系数',
    subscript: mode === 'en' ? 'Spot the subscript' : '找下标',
    arrow: mode === 'en' ? 'Read the arrow' : '读箭头',
  };

  return (
    <div className="equation-reader-lab">
      <div className="equation-reader-scene" aria-live="polite">
        <span className="equation-reader-label">
          {mode === 'en' ? 'TAP A CLUE IN THE MAP' : '点亮反应地图里的线索'}
        </span>
        <div
          className="equation-reader-map"
          aria-label="2H₂ plus O₂ becomes 2H₂O"
        >
          <span className="equation-reactants">2H₂ + O₂</span>
          <button
            type="button"
            className={focus === 'arrow' ? 'active arrow-token' : 'arrow-token'}
            onClick={() => setFocus('arrow')}
            aria-label={mode === 'en' ? 'Arrow: forms' : '箭头：生成'}
          >
            →
          </button>
          <span className="equation-product">
            <button
              type="button"
              className={
                focus === 'coefficient'
                  ? 'active coefficient-token'
                  : 'coefficient-token'
              }
              onClick={() => setFocus('coefficient')}
              aria-label={mode === 'en' ? 'Coefficient 2' : '系数 2'}
            >
              2
            </button>
            H
            <button
              type="button"
              className={
                focus === 'subscript'
                  ? 'active subscript-token'
                  : 'subscript-token'
              }
              onClick={() => setFocus('subscript')}
              aria-label={mode === 'en' ? 'Subscript 2' : '下标 2'}
            >
              ₂
            </button>
            O
          </span>
        </div>
        <p className="equation-reader-story">
          {mode === 'en'
            ? 'Hydrogen and oxygen form water.'
            : '氢气和氧气生成水。'}
        </p>
      </div>
      <div className="equation-reader-console">
        <p>
          {mode === 'en'
            ? 'What do you want to inspect?'
            : '你想检查哪一个符号？'}
        </p>
        <div className="equation-reader-controls">
          {(Object.keys(labels) as Array<keyof typeof labels>).map((key) => (
            <button
              type="button"
              key={key}
              className={focus === key ? 'active' : ''}
              onClick={() => setFocus(key)}
            >
              {labels[key]}
            </button>
          ))}
        </div>
        <div className={`equation-reader-feedback ${focus}`}>
          <strong>
            {focus === 'coefficient'
              ? mode === 'en'
                ? 'Whole packages'
                : '整份来数'
              : focus === 'subscript'
                ? mode === 'en'
                  ? 'Inside one package'
                  : '打开一份来看'
                : mode === 'en'
                  ? 'The direction of change'
                  : '变化的方向'}
          </strong>
          <p>{mode === 'en' ? copy.en : copy.zh}</p>
        </div>
        <div className="equation-reader-count">
          <span>{mode === 'en' ? 'Count check:' : '快速核对：'}</span>
          <b>2 × H₂O</b>
          <i>＝</i>
          <strong>{mode === 'en' ? 'H: 4 · O: 2' : 'H：4 · O：2'}</strong>
        </div>
      </div>
    </div>
  );
}

function EquationBalanceLab({ mode }: { mode: LanguageMode }) {
  const [coefficients, setCoefficients] = useState({ h2: 1, o2: 1, h2o: 1 });
  const left = { h: coefficients.h2 * 2, o: coefficients.o2 * 2 };
  const right = { h: coefficients.h2o * 2, o: coefficients.h2o };
  const balanced = left.h === right.h && left.o === right.o;
  const change = (key: keyof typeof coefficients, amount: number) => {
    setCoefficients((current) => ({
      ...current,
      [key]: Math.max(1, Math.min(4, current[key] + amount)),
    }));
  };
  const Factor = ({
    id,
    formula,
  }: {
    id: keyof typeof coefficients;
    formula: string;
  }) => (
    <div className="balance-factor">
      <button
        type="button"
        aria-label={mode === 'en' ? `Decrease ${formula}` : `减少 ${formula}`}
        onClick={() => change(id, -1)}
        disabled={coefficients[id] === 1}
      >
        −
      </button>
      <strong>{coefficients[id] === 1 ? '' : coefficients[id]}</strong>
      <span>{formula}</span>
      <button
        type="button"
        aria-label={mode === 'en' ? `Increase ${formula}` : `增加 ${formula}`}
        onClick={() => change(id, 1)}
      >
        +
      </button>
    </div>
  );

  return (
    <div className="equation-balance-lab">
      <div className="balance-scene" aria-live="polite">
        <span className="balance-label">
          {mode === 'en' ? 'ADJUST COEFFICIENTS ONLY' : '只能调整前面的系数'}
        </span>
        <div className="balance-equation">
          <Factor id="h2" formula="H₂" />
          <i>+</i>
          <Factor id="o2" formula="O₂" />
          <i>→</i>
          <Factor id="h2o" formula="H₂O" />
        </div>
        <p>
          {balanced
            ? mode === 'en'
              ? 'Balanced! The atom ledger agrees on both sides.'
              : '配平成功！原子账本两边一致。'
            : mode === 'en'
              ? 'Not balanced yet. Let the atom ledger guide your next move.'
              : '还没配平。让原子账本告诉你下一步。'}
        </p>
      </div>
      <div className="balance-console">
        <p>{mode === 'en' ? 'Atom ledger' : '原子账本'}</p>
        <div className="balance-ledger">
          <div>
            <span>{mode === 'en' ? 'Reactants' : '反应物'}</span>
            <b>
              H: {left.h} · O: {left.o}
            </b>
          </div>
          <i>{balanced ? '＝' : '≠'}</i>
          <div>
            <span>{mode === 'en' ? 'Products' : '生成物'}</span>
            <b>
              H: {right.h} · O: {right.o}
            </b>
          </div>
        </div>
        <div className={`balance-feedback ${balanced ? 'balanced' : ''}`}>
          <strong>
            {balanced
              ? mode === 'en'
                ? '✓ Every atom is accounted for'
                : '✓ 每一种原子都核对上了'
              : mode === 'en'
                ? 'Look for a mismatched atom type'
                : '寻找哪一种原子还对不上'}
          </strong>
          <p>
            {balanced
              ? mode === 'en'
                ? 'You found 2H₂ + O₂ → 2H₂O. Notice that all formulas stayed the same; only the package counts changed.'
                : '你得到 2H₂ + O₂ → 2H₂O。所有化学式保持不变，改变的只是“拿几份”。'
              : mode === 'en'
                ? 'Use + to change a whole formula’s coefficient. Do not try to alter the small subscripts.'
                : '用 + 改整份化学式前的系数，绝不修改右下角的小下标。'}
          </p>
        </div>
        <button
          type="button"
          className="balance-reset"
          onClick={() => setCoefficients({ h2: 1, o2: 1, h2o: 1 })}
        >
          {mode === 'en' ? 'Restart puzzle' : '重新开始'}
        </button>
      </div>
    </div>
  );
}

function PhScaleLab({ mode }: { mode: LanguageMode }) {
  const samples = [
    {
      id: 'lemon',
      ph: 2,
      icon: '🍋',
      zh: '柠檬汁（约）',
      en: 'Lemon juice (about)',
      colour: '#dc4e52',
      noteZh: '已知食物的酸味是线索；不能用尝来检测未知液体。',
      noteEn:
        'Sourness is a clue for a known food; never taste an unknown liquid to test it.',
    },
    {
      id: 'water',
      ph: 7,
      icon: '💧',
      zh: '纯水（常温，约）',
      en: 'Pure water (room temperature, about)',
      colour: '#67a85f',
      noteZh: '接近 7 是中性：不偏酸也不偏碱，不代表自动安全饮用。',
      noteEn:
        'Near 7 is neutral: neither acidic nor basic, not automatically safe to drink.',
    },
    {
      id: 'bicarbonate',
      ph: 9,
      icon: '🥄',
      zh: '小苏打水（约）',
      en: 'Baking-soda solution (about)',
      colour: '#4389b7',
      noteZh: '这是偏碱的食物级示例；pH 会随浓度和水质变化。',
      noteEn:
        'This is a food-grade basic example; pH changes with concentration and water quality.',
    },
    {
      id: 'soap',
      ph: 10,
      icon: '🧼',
      zh: '肥皂水（约）',
      en: 'Soapy water (about)',
      colour: '#6955ad',
      noteZh: '清洁产品的 pH 不等于使用说明；按标签使用，绝不混合清洁剂。',
      noteEn:
        'A cleaner’s pH never replaces its directions; follow labels and never mix cleaners.',
    },
  ];
  const [activeId, setActiveId] = useState('water');
  const sample = samples.find((item) => item.id === activeId) ?? samples[1]!;
  const kind = sample.ph < 7 ? 'acidic' : sample.ph > 7 ? 'basic' : 'neutral';
  const kindText =
    kind === 'acidic'
      ? mode === 'en'
        ? 'Acidic'
        : '酸性'
      : kind === 'basic'
        ? mode === 'en'
          ? 'Basic / alkaline'
          : '碱性'
        : mode === 'en'
          ? 'Neutral'
          : '中性';

  return (
    <div className="ph-scale-lab">
      <div className="ph-scene">
        <span className="ph-scene-label">
          {mode === 'en'
            ? 'A SAFE MODEL, NOT A HOME TEST'
            : '安全模型，不是家庭实验指令'}
        </span>
        <div
          className="ph-scale"
          aria-label={
            mode === 'en'
              ? 'pH scale from zero to fourteen'
              : '从零到十四的 pH 标尺'
          }
        >
          <div className="ph-scale-line" aria-hidden="true" />
          {Array.from({ length: 15 }, (_, value) => (
            <span
              key={value}
              className={value === sample.ph ? 'active' : ''}
              style={{ left: `${(value / 14) * 100}%` }}
            >
              {value}
            </span>
          ))}
          <i
            style={
              {
                left: `${(sample.ph / 14) * 100}%`,
                '--ph-colour': sample.colour,
              } as CSSProperties
            }
          >
            {sample.ph}
          </i>
        </div>
        <div
          className="ph-indicator-drop"
          style={{ '--indicator-colour': sample.colour } as CSSProperties}
        >
          <b>{sample.icon}</b>
          <span>{sample.ph}</span>
        </div>
        <strong className={`ph-kind ${kind}`}>{kindText}</strong>
      </div>
      <div className="ph-console">
        <p>
          {mode === 'en'
            ? 'Choose a familiar reference'
            : '选择一个熟悉的参考物'}
        </p>
        <div className="ph-sample-tabs">
          {samples.map((item) => (
            <button
              type="button"
              key={item.id}
              className={item.id === sample.id ? 'active' : ''}
              onClick={() => setActiveId(item.id)}
            >
              <span>{item.icon}</span>
              {mode === 'en' ? item.en : item.zh}
            </button>
          ))}
        </div>
        <div className={`ph-reading ${kind}`}>
          <strong>
            {mode === 'en'
              ? `pH ${sample.ph} · ${kindText}`
              : `pH ${sample.ph} · ${kindText}`}
          </strong>
          <p>{mode === 'en' ? sample.noteEn : sample.noteZh}</p>
        </div>
        <p className="ph-rule">
          {mode === 'en'
            ? 'Rule of thumb: below 7 acidic · 7 neutral · above 7 basic. Real measurements need the right tool and chart.'
            : '初学口诀：小于 7 为酸性 · 7 为中性 · 大于 7 为碱性。真实测量要用合适工具并对照色卡。'}
        </p>
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
      {lesson.interactive === 'group1-reactivity-lab' && (
        <Group1ReactivityLab mode={mode} />
      )}
      {lesson.interactive === 'group17-ion-lab' && (
        <Group17IonLab mode={mode} />
      )}
      {lesson.interactive === 'noble-gas-glow' && <NobleGasGlow mode={mode} />}
      {lesson.interactive === 'bond-choice-lab' && (
        <BondChoiceLab mode={mode} />
      )}
      {lesson.interactive === 'ionic-lattice-lab' && (
        <IonicLatticeLab mode={mode} />
      )}
      {lesson.interactive === 'covalent-sharing-lab' && (
        <CovalentSharingLab mode={mode} />
      )}
      {lesson.interactive === 'metallic-bonding-lab' && (
        <MetallicBondingLab mode={mode} />
      )}
      {lesson.interactive === 'structure-detective-lab' && (
        <StructureDetectiveLab mode={mode} />
      )}
      {lesson.interactive === 'formula-decoder-lab' && (
        <FormulaDecoderLab mode={mode} />
      )}
      {lesson.interactive === 'ionic-formula-balance-lab' && (
        <IonicFormulaBalanceLab mode={mode} />
      )}
      {lesson.interactive === 'ionic-naming-lab' && (
        <IonicNamingLab mode={mode} />
      )}
      {lesson.interactive === 'roman-charge-detective-lab' && (
        <RomanChargeDetectiveLab mode={mode} />
      )}
      {lesson.interactive === 'polyatomic-package-lab' && (
        <PolyatomicPackageLab mode={mode} />
      )}
      {lesson.interactive === 'molecular-prefix-lab' && (
        <MolecularPrefixLab mode={mode} />
      )}
      {lesson.interactive === 'reaction-rearrangement-lab' && (
        <ReactionRearrangementLab mode={mode} />
      )}
      {lesson.interactive === 'equation-reader-lab' && (
        <EquationReaderLab mode={mode} />
      )}
      {lesson.interactive === 'equation-balance-lab' && (
        <EquationBalanceLab mode={mode} />
      )}
      {lesson.interactive === 'ph-scale-lab' && <PhScaleLab mode={mode} />}
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
