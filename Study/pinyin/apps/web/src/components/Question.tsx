import { useRef, useState } from 'react';
import { words } from '../content';
import { typeLabels, type Exercise } from '../content/schema';
import { gradeAnswer, type Attempt, type Result } from '../engine';
import { SoundButton } from './ui';
import { ReadingGroup } from './ReadingGroup';

export function Question({
  question: q,
  result,
  onAnswer,
  onNext,
  nextLabel = '下一条线索',
  parent = false,
}: {
  question: Exercise;
  result?: Result;
  onAnswer: (
    correct: boolean,
    response: string,
    source: Attempt['source'],
    elapsed: number,
  ) => void;
  onNext: () => void;
  nextLabel?: string;
  parent?: boolean;
}) {
  const word = q.wordId ? words[q.wordId] : undefined;
  const [value, setValue] = useState(result?.response ?? q.initialText ?? '');
  const [parts, setParts] = useState(['', '', '']);
  const [revealed, setRevealed] = useState(false);
  const [notice, setNotice] = useState('');
  const [contentChecked, setContentChecked] = useState(false);
  const [pasted, setPasted] = useState(false);
  const composing = useRef(false);
  const started = useRef(Date.now());
  const isReading = q.type === 'read_aloud';
  const longInput = !!q.freeWriting || !!(word && word.hanzi.length > 40);
  const isInput = q.type === 'type_pinyin' || q.type === 'type_hanzi_ime';
  const response = q.type === 'assemble_syllable' ? parts.join('|') : value;
  const showAnswer = (
    correct: boolean,
    response: string,
    source: Attempt['source'] = 'automatic',
  ) => {
    if (!result)
      onAnswer(correct, response, source, Date.now() - started.current);
  };
  function submit() {
    if (composing.current) {
      setNotice('先选好候选汉字，完成组合输入，再提交。');
      return;
    }
    if (
      !response ||
      (q.type === 'assemble_syllable' && parts.some((p) => !p))
    ) {
      setNotice('先完成你的答案。');
      return;
    }
    const grade = gradeAnswer(q, response);
    setNotice(grade.message);
    if (q.freeWriting && grade.correct && !contentChecked) {
      setNotice(
        '字数合适。请先读一遍自己的文字，核对内容、错字与标点，再确认。',
      );
      return;
    }
    showAnswer(
      grade.correct,
      response,
      q.freeWriting ? (parent ? 'parent' : 'self') : 'automatic',
    );
  }
  return (
    <div className="py-question">
      <span className="py-pill">{typeLabels[q.type]}</span>
      <h2>{q.prompt}</h2>
      {isReading && (q.wordIds || q.readingTotal) && (
        <ReadingGroup
          question={q}
          result={result}
          parent={parent}
          onAnswer={(correct, response) =>
            showAnswer(correct, response, parent ? 'parent' : 'self')
          }
        />
      )}
      {isReading && word && !q.wordIds && !q.readingTotal && (
        <div className="py-read">
          <div className="py-large-pinyin">{word.pinyinMarked}</div>
          <p>先自己读一遍。读完再揭示汉字，核对声音。</p>
          {!revealed && !result ? (
            <button
              className="py-button py-secondary"
              onClick={() => setRevealed(true)}
            >
              揭示并核对
            </button>
          ) : (
            <>
              <div className="py-revealed">{word.hanzi}</div>
              <SoundButton word={word} />
              <div className="py-self-buttons">
                <button
                  disabled={!!result}
                  className="py-button"
                  onClick={() =>
                    showAnswer(true, '读对', parent ? 'parent' : 'self')
                  }
                >
                  {parent ? '家长确认：读对' : '我读对了'}
                </button>
                <button
                  disabled={!!result}
                  className="py-button py-secondary"
                  onClick={() =>
                    showAnswer(false, '需练', parent ? 'parent' : 'self')
                  }
                >
                  还需练
                </button>
              </div>
            </>
          )}
        </div>
      )}
      {!isReading && q.type !== 'pinyin_to_audio' && word && (
        <div
          className={`py-question-word ${longInput ? 'py-long-target' : ''}`}
        >
          {q.type !== 'audio_to_pinyin' && <strong>{word.hanzi}</strong>}
          <SoundButton
            word={word}
            label={q.type === 'audio_to_pinyin' ? '播放题目' : '听目标词'}
          />
        </div>
      )}
      {q.display && <div className="py-large-pinyin">{q.display}</div>}
      {q.options && (
        <div
          className={`py-options ${q.type === 'pinyin_to_audio' ? 'py-audio-options' : ''}`}
        >
          {q.options.map((option, i) => (
            <div
              key={option.value}
              className={`py-option-wrap ${result?.response === option.value ? (result.correct ? 'is-correct' : 'is-wrong') : ''}`}
            >
              {q.type === 'pinyin_to_audio' && option.wordId && (
                <SoundButton
                  word={words[option.wordId]!}
                  label={`试听声音 ${i + 1}`}
                />
              )}
              <button
                disabled={!!result}
                onClick={() =>
                  showAnswer(gradeAnswer(q, option.value).correct, option.value)
                }
              >
                <span className="py-option-letter">
                  {String.fromCharCode(65 + i)}
                </span>
                <span>
                  {q.type === 'pinyin_to_audio'
                    ? `选择声音 ${i + 1}`
                    : option.label}
                </span>
                {result?.response === option.value && (
                  <span>{result.correct ? '✓' : '↻'}</span>
                )}
              </button>
            </div>
          ))}
        </div>
      )}
      {q.type === 'assemble_syllable' && q.parts && (
        <div className="py-assemble">
          {(['initial', 'final', 'tone'] as const).map((kind, i) => (
            <label key={kind}>
              {['声母', '韵母', '声调'][i]}
              <select
                disabled={!!result}
                value={parts[i]}
                onChange={(e) =>
                  setParts((old) =>
                    old.map((p, j) => (j === i ? e.target.value : p)),
                  )
                }
              >
                <option value="">请选择</option>
                {q.parts![kind].map((part) => (
                  <option value={part} key={part}>
                    {kind === 'tone' ? `${part} 声` : part}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}
      {isInput && (
        <div className="py-input-area">
          <label htmlFor={`input-${q.id}`}>
            {q.type === 'type_pinyin'
              ? '英文键盘 · 只输入字母'
              : '中文输入法 · 输入最终汉字'}
          </label>
          <textarea
            id={`input-${q.id}`}
            rows={
              q.freeWriting || (word && word.hanzi.length > 40)
                ? 8
                : q.type === 'type_hanzi_ime'
                  ? 3
                  : 1
            }
            value={value}
            disabled={!!result}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            onCompositionStart={() => {
              composing.current = true;
            }}
            onCompositionEnd={(e) => {
              composing.current = false;
              setValue(e.currentTarget.value);
            }}
            onChange={(e) => {
              setValue(e.target.value);
              if (q.freeWriting) setContentChecked(false);
            }}
            onPaste={() => setPasted(true)}
            placeholder={
              q.type === 'type_pinyin'
                ? '在这里敲无调全拼…'
                : '用系统输入法在这里打中文…'
            }
            onKeyDown={(e) => {
              if (
                e.key === 'Enter' &&
                !e.shiftKey &&
                (!longInput || e.ctrlKey || e.metaKey)
              ) {
                if (
                  e.nativeEvent.isComposing ||
                  composing.current ||
                  e.keyCode === 229
                )
                  return;
                e.preventDefault();
                submit();
              }
            }}
          />
          <small>
            {q.type === 'type_hanzi_ime'
              ? '先选好候选字，再提交。标点的中英文宽度可以不同，但不能漏字或用同音字代替。'
              : '可忽略空格和大小写；声母、韵母必须拼对。女 / 绿通常用 nv / lv。'}
          </small>
          {q.freeWriting && (
            <>
              <p className="py-muted">
                主题：{q.freeWriting.topic}。写 {q.freeWriting.minChars}–
                {q.freeWriting.maxChars}{' '}
                个汉字；这道原创题由你或家长检查内容，不做机器语义打分。
              </p>
              <label className="py-toggle">
                <input
                  type="checkbox"
                  checked={contentChecked}
                  disabled={!!result}
                  onChange={(e) => setContentChecked(e.target.checked)}
                />
                {parent ? '家长确认' : '我已核对'}
                ：主题清楚，有自己的想法，错字和标点已检查
              </label>
            </>
          )}
          {pasted && (
            <p className="py-muted">
              本题使用过粘贴，可继续编辑。若要验收独立输入，请亲手敲一次。
            </p>
          )}
        </div>
      )}
      {(isInput || q.type === 'assemble_syllable') && !result && (
        <button className="py-button" onClick={submit}>
          检查答案
        </button>
      )}
      {notice && !result && <p role="status">{notice}</p>}
      {result && (
        <div
          className={`py-feedback ${result.correct ? 'is-correct' : 'is-wrong'}`}
          role="status"
        >
          <strong>
            {result.correct ? '线索找对了' : '这条线索再巩固一下'}
          </strong>
          {notice && <p>{notice}</p>}
          <p>{q.feedback}</p>
          {!result.correct && !isReading && !q.freeWriting && (
            <p>
              正确答案：
              {q.type === 'pinyin_to_audio'
                ? q.options?.find((o) => o.value === q.acceptedAnswers[0])
                    ?.label
                : q.type === 'assemble_syllable'
                  ? word?.pinyinMarked
                  : q.acceptedAnswers.join(' / ')}
            </p>
          )}
          <button className="py-button" onClick={onNext}>
            {nextLabel} <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
