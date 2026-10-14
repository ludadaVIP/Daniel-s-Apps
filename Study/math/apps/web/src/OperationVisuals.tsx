import type { LanguageMode, LocalizedText } from '@study/shared';
import { Text } from './ui';
import { t } from './model';
import { partWhole, equalGroups, divideObjects } from './operationModels';
export function CounterRow({
  count,
  label,
  mode,
  removed = 0,
  paired = count,
}: {
  count: number;
  label: LocalizedText;
  mode: LanguageMode;
  removed?: number;
  paired?: number;
}) {
  return (
    <div className="math-op-counter-row">
      <strong>
        <Text mode={mode} text={label} />
      </strong>
      <div
        className="math-op-counters"
        role="img"
        aria-label={
          mode === 'en'
            ? `${count} counters, ${removed} marked as removed`
            : `${count} 个小球，其中 ${removed} 个标记为取走`
        }
      >
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={`math-op-token ${i >= count - removed ? 'is-removed' : ''} ${i >= paired ? 'is-unpaired' : ''}`}
          />
        ))}
        {count === 0 && (
          <span className="math-op-empty">
            <Text mode={mode} text={t('0 个', '0 counters')} />
          </span>
        )}
      </div>
    </div>
  );
}
export function PartCounters({
  a,
  b,
  kind,
  mode,
  explain = true,
}: {
  a: number;
  b: number;
  kind: 'join' | 'take' | 'compare';
  mode: LanguageMode;
  explain?: boolean;
}) {
  const model = partWhole(a, b);
  return (
    <div className="math-op-visual">
      {kind === 'take' ? (
        <>
          <CounterRow
            count={model.total}
            removed={b}
            label={t(`原有 ${model.total}`, `Start with ${model.total}`)}
            mode={mode}
          />
          <p className="math-muted">
            <Text
              mode={mode}
              text={t(
                `划去 ${b} 个，留下 ${a} 个；划线与文字共同表示取走。`,
                `Cross out ${b}, leaving ${a}; crossing marks and text both identify removal.`,
              )}
            />
          </p>
        </>
      ) : (
        <>
          <CounterRow
            count={a}
            paired={kind === 'compare' ? model.smaller : a}
            label={t(`A：${a}`, `A: ${a}`)}
            mode={mode}
          />
          <CounterRow
            count={b}
            paired={kind === 'compare' ? model.smaller : b}
            label={t(`B：${b}`, `B: ${b}`)}
            mode={mode}
          />
          {explain && (
            <p className="math-muted">
              <Text
                mode={mode}
                text={
                  kind === 'join'
                    ? t(
                        '两组一起计数，每个小球只数一次。',
                        'Count both groups together, counting each counter once.',
                      )
                    : t(
                        `两组一一对应后，有 ${model.difference} 个未配对。比较差距没有取走任何物体。`,
                        `Pair counters one to one: ${model.difference} remain unpaired. Comparing a difference removes no objects.`,
                      )
                }
              />
            </p>
          )}
        </>
      )}
    </div>
  );
}
export function GroupCounters({
  groups,
  perGroup,
  mode,
  array = false,
}: {
  groups: number;
  perGroup: number;
  mode: LanguageMode;
  array?: boolean;
}) {
  const m = equalGroups(groups, perGroup);
  return (
    <div
      className="math-op-visual"
      role="img"
      aria-label={
        mode === 'en'
          ? `${groups} equal groups of ${perGroup}; total ${m.total}`
          : `${groups} 个等组，每组 ${perGroup} 个，合计 ${m.total} 个`
      }
    >
      {array ? (
        <div
          className="math-op-array"
          style={{
            gridTemplateColumns: `repeat(${Math.max(1, perGroup)},18px)`,
          }}
          aria-hidden="true"
        >
          {Array.from({ length: m.total }, (_, i) => (
            <span className="math-op-token" key={i} />
          ))}
        </div>
      ) : (
        <div className="math-op-groups">
          {Array.from({ length: groups }, (_, i) => (
            <div key={i}>
              <small>
                <Text mode={mode} text={t(`组 ${i + 1}`, `Group ${i + 1}`)} />
              </small>
              <div className="math-op-counters">
                {Array.from({ length: perGroup }, (_, j) => (
                  <span className="math-op-token" key={j} aria-hidden="true" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      {!m.total && (
        <p className="math-muted">
          <Text
            mode={mode}
            text={t(
              '总量为 0，没有涂色小球。',
              'The total is zero: no counters are shaded.',
            )}
          />
        </p>
      )}
    </div>
  );
}
export function SharedCounters({
  total,
  divisor,
  kind,
  mode,
}: {
  total: number;
  divisor: number;
  kind: 'share' | 'group';
  mode: LanguageMode;
}) {
  const m = divideObjects(total, divisor, kind);
  return (
    <div className="math-op-visual">
      <div
        className={`math-op-groups ${m.perGroup === 1 ? 'is-singles' : ''}`}
        role="img"
        aria-label={
          mode === 'en'
            ? `${total} counters; ${m.groupCount} groups of ${m.perGroup}; ${m.remainder} left outside`
            : `${total} 个小球；${m.groupCount} 组，每组 ${m.perGroup} 个；外面余下 ${m.remainder} 个`
        }
      >
        {Array.from({ length: m.groupCount }, (_, i) => (
          <div key={i}>
            <small>
              <Text mode={mode} text={t(`组 ${i + 1}`, `Group ${i + 1}`)} />
            </small>
            <div className="math-op-counters">
              {Array.from({ length: m.perGroup }, (_, j) => (
                <span className="math-op-token" key={j} aria-hidden="true" />
              ))}
            </div>
          </div>
        ))}
        {m.groupCount === 0 && (
          <p>
            <Text mode={mode} text={t('没有完整组', 'No complete groups')} />
          </p>
        )}
      </div>
      <CounterRow
        count={m.remainder}
        label={t('余下另放', 'Left outside')}
        mode={mode}
      />
    </div>
  );
}
