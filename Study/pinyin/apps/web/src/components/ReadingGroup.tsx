import { useState } from 'react';
import { words } from '../content';
import { gradeAnswer, readCounts, type Result } from '../engine';
import type { Exercise } from '../content/schema';
import { SoundButton } from './ui';

export function ReadingGroup({
  question: q,
  result,
  parent,
  onAnswer,
}: {
  question: Exercise;
  result?: Result;
  parent: boolean;
  onAnswer: (correct: boolean, response: string) => void;
}) {
  const [revealed, setRevealed] = useState(!!result);
  const [scores, setScores] = useState<Record<string, boolean>>({});
  const [count, setCount] = useState('');
  const [notice, setNotice] = useState('');
  const ids = q.wordIds ?? (q.wordId ? [q.wordId] : []);
  const total = q.wordIds?.length ?? q.readingTotal ?? 1;
  function submit() {
    const complete = q.wordIds
      ? ids.every((id) => scores[id] !== undefined)
      : count !== '';
    const correctCount = q.wordIds
      ? Object.values(scores).filter(Boolean).length
      : Number(count);
    if (
      !complete ||
      !Number.isInteger(correctCount) ||
      correctCount < 0 ||
      correctCount > total
    ) {
      setNotice(`请完成每项记录，或填写 0–${total} 的整数。`);
      return;
    }
    const response = JSON.stringify({ correctCount, totalCount: total });
    onAnswer(gradeAnswer(q, response).correct, response);
  }
  return (
    <div className="py-reading-batch">
      <p className="py-muted">
        先独立尝试，不播放示范。核对后如实记录；结果由
        {parent ? '家长确认' : '学生自评'}。
      </p>
      <div className={q.wordIds ? 'py-reading-items' : 'py-reading-passage'}>
        {ids.map((id) => {
          const word = words[id]!;
          return (
            <div className="py-reading-item" key={id}>
              <div className="py-batch-pinyin">{word.pinyinMarked}</div>
              {revealed && (
                <>
                  <div className="py-revealed">{word.hanzi}</div>
                  <SoundButton word={word} label="核对这条读音" />
                  {q.wordIds && !result && (
                    <div className="py-reading-controls">
                      <button
                        className={scores[id] === true ? 'selected' : ''}
                        aria-pressed={scores[id] === true}
                        onClick={() =>
                          setScores((old) => ({ ...old, [id]: true }))
                        }
                      >
                        读对
                      </button>
                      <button
                        className={scores[id] === false ? 'selected' : ''}
                        aria-pressed={scores[id] === false}
                        onClick={() =>
                          setScores((old) => ({ ...old, [id]: false }))
                        }
                      >
                        需练
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
      {!revealed ? (
        <button
          className="py-button py-secondary"
          onClick={() => setRevealed(true)}
        >
          我已尝试朗读，开始核对
        </button>
      ) : (
        !result && (
          <>
            <p className="py-muted">
              按刚才独立读的情况记录。能够自我纠正的音节可以算读对；不能把听过示范后的跟读计入。
            </p>
            {!q.wordIds && (
              <label className="py-reading-count">
                这段对应 {total} 个汉字 / 音节，你独立读对多少个？
                <input
                  type="number"
                  min={0}
                  max={total}
                  step={1}
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                />
              </label>
            )}
            <button className="py-button" onClick={submit}>
              {parent ? '保存家长确认' : '保存我的朗读记录'}
            </button>
          </>
        )
      )}
      {result && (
        <p className="py-muted">
          已记录独立读对 {readCounts(q, result.response)?.correct ?? 0} /{' '}
          {total} · {result.source === 'parent' ? '家长确认' : '学生自评'}
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
    </div>
  );
}
