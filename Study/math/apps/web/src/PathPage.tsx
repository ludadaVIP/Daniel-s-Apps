import { PostRouteEntry } from './PostRoute';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { curriculum, lessons } from './content';
import { t } from './model';
import { Text } from './ui';
import { Intro, words, status, statuses, type Props } from './pageSupport';
export function PathPage({ mode, store }: Props) {
  const [params, setParams] = useSearchParams();
  const selected = params.get('stage') ?? 'B00',
    stage = curriculum.find((s) => s.id === selected) ?? curriculum[0]!;
  const [search, setSearch] = useState('');
  const filtered = stage.units
    .map((u) => ({
      ...u,
      lessons: u.lessons.filter((l) =>
        (l.id + ' ' + l.title.zh + ' ' + l.title.en)
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    }))
    .filter((u) => u.lessons.length);
  return (
    <>
      <Intro
        mode={mode}
        kicker="YOUR LEARNING MAP"
        title={t('一条路线，很多种起点。', 'One map. Many starting points.')}
        body={t(
          `按技能选择起点。目前 ${lessons.length} 节课可学习，完整路线 ${curriculum.flatMap((s) => s.units.flatMap((u) => u.lessons)).length} 节；其余内容继续逐单元加入。`,
          `Choose a starting point by skill. ${lessons.length} lessons are available across a ${curriculum.flatMap((s) => s.units.flatMap((u) => u.lessons)).length}-lesson roadmap; further units are being added.`,
        )}
      />
      <div
        className="math-stage-tabs"
        role="group"
        aria-label={words(mode, '课程阶段', 'Curriculum stages')}
      >
        {curriculum.map((s) => (
          <button
            key={s.id}
            aria-pressed={stage.id === s.id}
            onClick={() => setParams({ stage: s.id })}
          >
            <b>{s.id}</b>
            <span>
              {words(
                mode,
                s.title.zh.split('：')[0]!,
                s.title.en.split('—')[0]!,
              )}
            </span>
          </button>
        ))}
      </div>
      <label className="math-search">
        <Text
          mode={mode}
          text={t('查找本阶段课程', 'Find a lesson in this stage')}
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="B04 / 分数 / fractions"
        />
      </label>
      <h2>
        <Text mode={mode} text={stage.title} />
      </h2>
      {filtered.map((u) => (
        <section className="math-curriculum-unit" key={u.id}>
          <div className="math-row">
            <h3>
              {u.id} · <Text mode={mode} text={u.title} />
            </h3>
            <span className="math-badge">
              <Text
                mode={mode}
                text={t(
                  `${u.lessons.filter((l) => l.available).length} 节已开放`,
                  `${u.lessons.filter((l) => l.available).length} open`,
                )}
              />
            </span>
          </div>
          <div className="math-curriculum-list">
            {u.lessons.map((l) =>
              l.available ? (
                <Link key={l.id} to={`/math/lesson/${l.id}`}>
                  <span className="math-eyebrow">{l.id}</span>
                  <Text mode={mode} text={l.title} />
                  <span className="math-status">
                    <Text mode={mode} text={statuses[status(l.id, store)]} /> ↗
                  </span>
                </Link>
              ) : (
                <div key={l.id} className="planned">
                  <span className="math-eyebrow">{l.id}</span>
                  <Text mode={mode} text={l.title} />
                  <small>
                    <Text mode={mode} text={t('规划中', 'Planned')} />
                  </small>
                </div>
              ),
            )}
          </div>
        </section>
      ))}
      <PostRouteEntry mode={mode} />
      {!filtered.length && (
        <p className="math-empty">
          <Text
            mode={mode}
            text={t(
              '本阶段没有匹配课程。试试其他关键词。',
              'No match in this stage. Try another keyword.',
            )}
          />
        </p>
      )}
    </>
  );
}
