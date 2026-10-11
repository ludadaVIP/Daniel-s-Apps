import type { Assessment, Exercise } from './content/schema';

export function chineseCharacters(value: string) {
  return [...value].filter((c) => /\p{Script=Han}/u.test(c));
}
export function textAccuracy(expected: string, actual: string) {
  const target = chineseCharacters(expected);
  const text = chineseCharacters(actual);
  let row = target.map((_, i) => i + 1);
  row.unshift(0);
  text.forEach((character, i) => {
    const next = [i + 1];
    target.forEach((letter, j) => {
      next[j + 1] = Math.min(
        next[j]! + 1,
        row[j + 1]! + 1,
        row[j]! + (letter === character ? 0 : 1),
      );
    });
    row = next;
  });
  const total = Math.max(target.length, text.length);
  const correct = Math.max(0, total - row[target.length]!);
  return { correct, total, accuracy: total ? correct / total : 0 };
}
export function readCounts(q: Exercise, response: string) {
  const total = q.wordIds?.length ?? q.readingTotal;
  if (!total) return undefined;
  try {
    const counts: unknown = JSON.parse(response);
    if (typeof counts !== 'object' || counts === null) return undefined;
    const { correctCount, totalCount } = counts as {
      correctCount: unknown;
      totalCount: unknown;
    };
    if (
      totalCount !== total ||
      typeof correctCount !== 'number' ||
      !Number.isInteger(correctCount) ||
      correctCount < 0 ||
      correctCount > total
    )
      return undefined;
    return { correct: correctCount, total, accuracy: correctCount / total };
  } catch {
    return undefined;
  }
}

export function normalizePinyin(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '');
}
export function normalizeHanzi(value: string) {
  return value
    .normalize('NFC')
    .trim()
    .replace(/[,，]/g, '，')
    .replace(/[.。]/g, '。')
    .replace(/[?？]/g, '？')
    .replace(/[!！]/g, '！')
    .replace(/\s+/g, '');
}
export function gradeAnswer(
  q: Exercise,
  value: string,
  composing = false,
): { correct: boolean; message: string } {
  if (composing)
    return { correct: false, message: '请先从输入法候选框选好汉字，再提交。' };
  if (q.type === 'type_hanzi_ime') {
    const normalized = normalizeHanzi(value);
    if (/[a-z]/i.test(normalized))
      return {
        correct: false,
        message: '还有未转换的字母。请用系统中文输入法选出汉字。',
      };
    if (q.freeWriting) {
      const length = chineseCharacters(normalized).length;
      const correct =
        length >= q.freeWriting.minChars && length <= q.freeWriting.maxChars;
      return {
        correct,
        message: correct
          ? `${length} 个汉字，字数范围合适；内容、错字和标点还需要你或家长核对。`
          : `当前 ${length} 个汉字，请写 ${q.freeWriting.minChars}–${q.freeWriting.maxChars} 个汉字。`,
      };
    }
    if (q.minAccuracy !== undefined) {
      const score = textAccuracy(q.acceptedAnswers[0]!, normalized);
      const punctuation = (s: string) =>
        normalizeHanzi(s).replace(/\p{Script=Han}/gu, '');
      const correct =
        score.accuracy >= q.minAccuracy &&
        punctuation(normalized) === punctuation(q.acceptedAnswers[0]!);
      return {
        correct,
        message: `汉字准确率 ${Math.round(score.accuracy * 100)}%（要求 ${Math.round(q.minAccuracy * 100)}%），还需检查句子的标点。`,
      };
    }
    const correct = q.acceptedAnswers.some(
      (answer) => normalizeHanzi(answer) === normalized,
    );
    return {
      correct,
      message: correct
        ? '最终汉字和标点都正确。'
        : '检查候选词是否选对、有没有漏字，以及句末标点。',
    };
  }
  if (q.type === 'read_aloud' && (q.wordIds || q.readingTotal)) {
    const counts = readCounts(q, value);
    return {
      correct: !!counts && counts.accuracy >= 0.85,
      message: counts
        ? `记录独立读对 ${counts.correct} / ${counts.total}，结果来自学生或家长核对。`
        : '请完整记录这一组的独立朗读情况。',
    };
  }
  const normalize =
    q.type === 'type_pinyin' ? normalizePinyin : (v: string) => v;
  const correct = q.acceptedAnswers.some(
    (answer) => normalize(answer) === normalize(value),
  );
  return { correct, message: correct ? '这条线索找对了。' : q.feedback };
}

export interface Attempt {
  questionId: string;
  correct: boolean;
  response: string;
  at: string;
  durationMs: number;
  context: 'lesson' | 'review' | 'lab';
  source: 'automatic' | 'self' | 'parent';
}

export function assessmentOutcome(
  assessment: Assessment,
  questions: Exercise[],
  answers: Record<string, Result>,
) {
  const byId = Object.fromEntries(questions.map((q) => [q.id, q]));
  const groups = assessment.groups.map((group) => {
    let correct = 0;
    let total = 0;
    const complete = group.questionIds.every(
      (id) => !!answers[id] && !!byId[id],
    );
    let textValid = true;
    group.questionIds.forEach((id) => {
      const q = byId[id];
      const result = answers[id];
      if (!q) return;
      const count =
        q.wordIds?.length ??
        q.readingTotal ??
        (q.minAccuracy !== undefined
          ? chineseCharacters(q.acceptedAnswers[0]!).length
          : 1);
      if (q.minAccuracy !== undefined && result) {
        const score = textAccuracy(q.acceptedAnswers[0]!, result.response);
        total += score.total;
        correct += score.correct;
        textValid &&= gradeAnswer(q, result.response).correct;
        return;
      }
      total += count;
      if (!result) return;
      if (q.type === 'read_aloud' && (q.wordIds || q.readingTotal))
        correct += readCounts(q, result.response)?.correct ?? 0;
      else if (result.correct) correct += 1;
    });
    const accuracy = total ? correct / total : 0;
    const passed =
      complete &&
      textValid &&
      total > 0 &&
      (group.minCorrect === undefined || correct >= group.minCorrect) &&
      (group.minAccuracy === undefined || accuracy >= group.minAccuracy);
    return { ...group, correct, total, accuracy, complete, passed };
  });
  const complete = assessment.questionIds.every((id) => !!answers[id]);
  return {
    complete,
    passed: complete && groups.length > 0 && groups.every((g) => g.passed),
    groups,
  };
}
export interface CardProgress {
  questionId: string;
  stage: number;
  due: string;
  lastCorrect?: string;
  wrongStreak: number;
}
export function scheduleCard(
  previous: CardProgress | undefined,
  attempt: Attempt,
): CardProgress {
  const now = new Date(attempt.at);
  if (!attempt.correct)
    return {
      questionId: attempt.questionId,
      stage: 0,
      due: attempt.at,
      lastCorrect: previous?.lastCorrect,
      wrongStreak: (previous?.wrongStreak ?? 0) + 1,
    };
  // Only successes on a later calendar day advance the review interval.
  const isLaterDay =
    previous?.lastCorrect &&
    new Date(previous.lastCorrect).toDateString() !== now.toDateString();
  const stage = Math.min(
    2,
    previous && isLaterDay && previous.wrongStreak === 0
      ? previous.stage + 1
      : (previous?.stage ?? 0),
  );
  const due = new Date(now);
  due.setDate(due.getDate() + [1, 3, 7][stage]!);
  return {
    questionId: attempt.questionId,
    stage,
    due: due.toISOString(),
    lastCorrect: attempt.at,
    wrongStreak: 0,
  };
}
export interface Result {
  correct: boolean;
  response: string;
  source: Attempt['source'];
}
export function lessonOutcome(
  questions: Exercise[],
  answers: Record<string, Result>,
) {
  const independent = questions.filter((q) => q.phase === 'challenge');
  const total = independent.length;
  const correct = independent.filter((q) => answers[q.id]?.correct).length;
  const streaks: Record<string, number> = {};
  let repeatedError = false;
  independent.forEach((q) => {
    if (!answers[q.id]) return;
    q.skillIds.forEach((skill) => {
      streaks[skill] = answers[q.id]!.correct ? 0 : (streaks[skill] ?? 0) + 1;
      if (streaks[skill]! >= 2) repeatedError = true;
    });
  });
  return {
    total,
    correct,
    percent: total ? Math.round((correct / total) * 100) : 0,
    mastered:
      total > 0 &&
      independent.every((q) => answers[q.id]) &&
      correct / total >= 0.85 &&
      !repeatedError,
  };
}
