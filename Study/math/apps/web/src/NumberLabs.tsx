import { useState } from 'react';
import type { LanguageMode } from '@study/shared';
import { t, type Lesson } from './model';
import {
  blockValue,
  exchangeHundred,
  placeValues,
  readWholeNumber,
  roundingModel,
  type Blocks,
} from './numberModels';
import { BaseTenBlocks, NumberAxis, PlaceChart } from './NumberVisuals';
import { Text } from './ui';
export type NumberLabKind =
  'number-reader' | 'place-value' | 'whole-line' | 'rounding' | 'regroup';
export const isNumberLab = (kind: Lesson['lab']): kind is NumberLabKind =>
  [
    'number-reader',
    'place-value',
    'whole-line',
    'rounding',
    'regroup',
  ].includes(kind);
function Reader({
  kind,
  mode,
}: {
  kind: 'number-reader' | 'place-value';
  mode: LanguageMode;
}) {
  const [value, setValue] = useState(kind === 'number-reader' ? 10005 : 62407),
    [reveal, setReveal] = useState(false);
  const reading = readWholeNumber(value),
    parts = placeValues(value).filter((p) => p.digit);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={
            kind === 'number-reader'
              ? t(
                  '先自己读这个数，指出零所在的位置，再展开读法核对。',
                  'Read the number yourself, point to its zero places, then reveal the names to check.',
                )
              : t(
                  '先猜：只把百位数字加一，总数会增加多少？改动一列，再看每一列的贡献。',
                  'Predict: if only hundreds increases by one, how much does the total grow? Change a column and inspect its contribution.',
                )
          }
        />
      </p>
      <div className="math-number-readout">{value.toLocaleString('en-NZ')}</div>
      <PlaceChart
        value={value}
        mode={mode}
        onDigit={(unit, digit) => {
          const old = placeValues(value).find((p) => p.unit === unit)!.digit;
          setValue(value + (digit - old) * unit);
          setReveal(false);
        }}
      />
      <div className="math-lab-presets">
        {[10005, 207040, 340601, 44444].map((n) => (
          <button
            className="math-button secondary"
            key={n}
            onClick={() => {
              setValue(n);
              setReveal(false);
            }}
          >
            {n.toLocaleString('en-NZ')}
          </button>
        ))}
      </div>
      {kind === 'number-reader' ? (
        <>
          <button
            className="math-button secondary"
            aria-expanded={reveal}
            onClick={() => setReveal(!reveal)}
          >
            <Text
              mode={mode}
              text={
                reveal
                  ? t('收起读法', 'Hide number names')
                  : t('我已试读，展开核对', 'I tried reading; show the names')
              }
            />
          </button>
          {reveal && (
            <p className="math-number-reading">
              <Text mode={mode} text={reading} />
            </p>
          )}
          <p className="math-muted">
            <Text
              mode={mode}
              text={t(
                '中文常按“万”分组，英文按 thousand / million 分组；位值表表示同一个数。',
                'Chinese often groups around 万 (ten thousand); English around thousand and million. The chart represents the same value.',
              )}
            />
          </p>
        </>
      ) : (
        <div className="math-expanded-form">
          <Text
            mode={mode}
            text={t('各数位的贡献', 'Contributions by place')}
          />
          <strong>
            {parts.length
              ? parts
                  .map((p) => p.contribution.toLocaleString('en-NZ'))
                  .join(' + ')
              : '0'}{' '}
            = {value.toLocaleString('en-NZ')}
          </strong>
          <ul>
            {parts.map((p) => (
              <li key={p.unit}>
                <Text mode={mode} text={p.name} /> {p.digit} ×{' '}
                {p.unit.toLocaleString('en-NZ')} ={' '}
                {p.contribution.toLocaleString('en-NZ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
function WholeLine({ mode }: { mode: LanguageMode }) {
  const [point, setPoint] = useState(512),
    [window, setWindow] = useState(0),
    windows = [
      [0, 1000, 10],
      [400, 600, 10],
      [500, 520, 10],
    ] as const;
  const [start, end, divisions] = windows[window]!;
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先比较 512 和 516。再切换视窗：同一个点在图上的位置会变，但数值与大小关系会变吗？',
            'Compare 512 and 516. Switch windows: the drawn location changes, but do the value and order change?',
          )}
        />
      </p>
      <div
        className="math-lab-presets"
        role="group"
        aria-label={mode === 'en' ? 'Number-line window' : '数轴视窗'}
      >
        {windows.map(([left, right], i) => (
          <button
            className="math-button secondary"
            aria-pressed={i === window}
            key={i}
            onClick={() => setWindow(i)}
          >
            {left}–{right}
          </button>
        ))}
      </div>
      <div className="math-number-readout">{point}</div>
      <NumberAxis
        start={start}
        end={end}
        divisions={divisions}
        point={point}
        mode={mode}
      />
      <label>
        <Text
          mode={mode}
          text={t(
            '定位 500 到 520 之间的数',
            'Locate a number between 500 and 520',
          )}
        />
        <input
          type="range"
          min="500"
          max="520"
          step="1"
          value={point}
          aria-label={mode === 'en' ? 'Number to locate' : '要定位的数'}
          onChange={(e) => setPoint(Number(e.target.value))}
        />
        <output>{point}</output>
      </label>
      <p className="math-hint">
        <Text
          mode={mode}
          text={t(
            `这个点是 ${point}。它${point < 516 ? '在 516 左边' : point === 516 ? '就是 516' : '在 516 右边'}；放大没有改变顺序。`,
            `The point is ${point}. It is ${point < 516 ? 'to the left of 516' : point === 516 ? 'exactly 516' : 'to the right of 516'}; zoom does not change the order.`,
          )}
        />
      </p>
    </>
  );
}
function Rounding({ mode }: { mode: LanguageMode }) {
  const [value, setValue] = useState(3465),
    [unit, setUnit] = useState(100);
  const m = roundingModel(value, unit);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先预测结果。选择要保留到十、百或千，再比较邻居、中点和两边的距离。',
            'Predict the result. Choose tens, hundreds or thousands, then compare neighbours, midpoint and both distances.',
          )}
        />
      </p>
      <div
        className="math-lab-presets"
        role="group"
        aria-label={mode === 'en' ? 'Rounding unit' : '保留到哪一位'}
      >
        {[10, 100, 1000].map((n) => (
          <button
            className="math-button secondary"
            key={n}
            aria-pressed={unit === n}
            onClick={() => setUnit(n)}
          >
            <Text
              mode={mode}
              text={t(
                n === 10 ? '最近的十' : n === 100 ? '最近的百' : '最近的千',
                n === 10
                  ? 'Nearest ten'
                  : n === 100
                    ? 'Nearest hundred'
                    : 'Nearest thousand',
              )}
            />
          </button>
        ))}
      </div>
      <div className="math-number-readout">
        {value.toLocaleString('en-NZ')} ≈ {m.rounded.toLocaleString('en-NZ')}
      </div>
      <NumberAxis
        start={m.lower}
        end={m.upper}
        divisions={2}
        point={value}
        mode={mode}
      />
      <div className="math-round-distances">
        <div>
          <Text
            mode={mode}
            text={t(
              `到 ${m.lower.toLocaleString('en-NZ')} 的距离`,
              `Distance to ${m.lower.toLocaleString('en-NZ')}`,
            )}
          />
          <strong>{m.distanceLower}</strong>
        </div>
        <div>
          <Text
            mode={mode}
            text={t(
              `到 ${m.upper.toLocaleString('en-NZ')} 的距离`,
              `Distance to ${m.upper.toLocaleString('en-NZ')}`,
            )}
          />
          <strong>{m.distanceUpper}</strong>
        </div>
      </div>
      <label>
        <Text mode={mode} text={t('原来的精确数', 'Original exact value')} />
        <input
          aria-label={mode === 'en' ? 'Exact value' : '精确数'}
          type="range"
          min="0"
          max="10000"
          step="1"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <output>{value.toLocaleString('en-NZ')}</output>
      </label>
      <div className="math-lab-presets">
        {[3450, 4499, 9995].map((n) => (
          <button
            key={n}
            className="math-button secondary"
            onClick={() => setValue(n)}
          >
            {n.toLocaleString('en-NZ')}
          </button>
        ))}
      </div>
      <p className="math-hint">
        <Text
          mode={mode}
          text={
            m.distanceLower === m.distanceUpper
              ? t(
                  '正好在中点：本课使用非负数的“四舍五入”约定，取较大的邻居。',
                  'Exactly halfway: this lesson’s half-up convention for non-negative values selects the upper neighbour.',
                )
              : t(
                  '选离原数较近的邻居。近似数用于估算，原始精确值仍要保留。',
                  'Choose the closer neighbour. Use the rounded value for an estimate and keep the original exact value.',
                )
          }
        />
      </p>
    </>
  );
}
function Regroup({ mode }: { mode: LanguageMode }) {
  const [blocks, setBlocks] = useState<Blocks>({
    hundreds: 2,
    tens: 4,
    ones: 3,
  });
  const total = blockValue(blocks);
  return (
    <>
      <p>
        <Text
          mode={mode}
          text={t(
            '先猜：块数变多，数量一定变多吗？每个小格表示一个单位；一条有 10 格，百方格有 100 格。',
            'Predict: do more blocks always mean more value? Each small square is one unit; a rod has ten and a hundred square has one hundred.',
          )}
        />
      </p>
      <div className="math-number-readout">
        {blocks.hundreds} × 100 + {blocks.tens} × 10 + {blocks.ones} = {total}
      </div>
      <BaseTenBlocks blocks={blocks} mode={mode} />
      <div className="math-lab-presets">
        <button
          className="math-button secondary"
          disabled={blocks.hundreds === 0}
          onClick={() => setBlocks((old) => exchangeHundred(old, 'to-tens'))}
        >
          <Text
            mode={mode}
            text={t('一个百 → 十个十', 'One hundred → ten tens')}
          />
        </button>
        <button
          className="math-button secondary"
          disabled={blocks.tens < 10}
          onClick={() => setBlocks((old) => exchangeHundred(old, 'to-hundred'))}
        >
          <Text
            mode={mode}
            text={t('十个十 → 一个百', 'Ten tens → one hundred')}
          />
        </button>
      </div>
      <div className="math-lab-presets">
        {[203, 230, 243].map((n) => (
          <button
            key={n}
            className="math-button secondary"
            onClick={() =>
              setBlocks({
                hundreds: Math.floor(n / 100),
                tens: Math.floor(n / 10) % 10,
                ones: n % 10,
              })
            }
          >
            {n}
          </button>
        ))}
      </div>
      <p className="math-hint">
        <Text
          mode={mode}
          text={t(
            `现在有 ${blocks.hundreds + blocks.tens + blocks.ones} 块积木，总单位数为 ${total}。交换前后要检查总单位数，不只数块。`,
            `There are ${blocks.hundreds + blocks.tens + blocks.ones} blocks with a total value of ${total}. An exchange must preserve total units, not block count.`,
          )}
        />
      </p>
    </>
  );
}
export function NumberLab({
  kind,
  mode,
}: {
  kind: NumberLabKind;
  mode: LanguageMode;
}) {
  return (
    <section className="math-lab">
      <div className="math-row">
        <span className="math-eyebrow">
          <Text
            mode={mode}
            text={t(
              '数感工作台 · 先预测，再操作',
              'NUMBER WORKSHOP · PREDICT, THEN EXPLORE',
            )}
          />
        </span>
        <span className="math-live">
          <Text mode={mode} text={t('实时模型', 'LIVE MODEL')} />
        </span>
      </div>
      {kind === 'number-reader' || kind === 'place-value' ? (
        <Reader kind={kind} mode={mode} />
      ) : kind === 'whole-line' ? (
        <WholeLine mode={mode} />
      ) : kind === 'rounding' ? (
        <Rounding mode={mode} />
      ) : (
        <Regroup mode={mode} />
      )}
      <div className="math-lab-reflect">
        <span>↳</span>
        <Text
          mode={mode}
          text={t(
            '用自己的话说：改了什么？哪些量没有变？这个图为什么能表示这个数？',
            'Explain in your own words: what changed, what stayed the same, and why does this model represent this number?',
          )}
        />
      </div>
    </section>
  );
}
export function NumberHookArt({
  kind,
  mode,
}: {
  kind: NumberLabKind;
  mode: LanguageMode;
}) {
  return (
    <div
      className="math-number-hook"
      aria-label={
        mode === 'en' ? 'A preview of the number idea' : '数感模型预览'
      }
    >
      {kind === 'rounding' ? (
        <NumberAxis
          start={3400}
          end={3500}
          divisions={2}
          point={3465}
          mode={mode}
        />
      ) : kind === 'whole-line' ? (
        <NumberAxis
          start={500}
          end={600}
          divisions={5}
          point={560}
          mode={mode}
        />
      ) : kind === 'regroup' ? (
        <BaseTenBlocks blocks={{ hundreds: 2, tens: 4, ones: 3 }} mode={mode} />
      ) : (
        <PlaceChart
          value={kind === 'number-reader' ? 10005 : 44444}
          places={5}
          mode={mode}
        />
      )}
    </div>
  );
}
