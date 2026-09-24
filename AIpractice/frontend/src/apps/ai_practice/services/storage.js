export function blankQuizState() {
  return {
    currentIndex: -1,
    answers: {},
    startedAt: new Date().toISOString(),
    finishedAt: null,
    savedAttemptId: null
  };
}

export function mergeQuizState(state) {
  return {
    ...blankQuizState(),
    ...(state || {}),
    answers: state?.answers && typeof state.answers === 'object' ? state.answers : {}
  };
}

export function removeAnswerFromState(state, questionId) {
  const nextState = mergeQuizState(state);
  const answers = { ...(nextState.answers || {}) };
  if (Object.prototype.hasOwnProperty.call(answers, String(questionId))) {
    delete answers[String(questionId)];
  } else if (Object.prototype.hasOwnProperty.call(answers, questionId)) {
    delete answers[questionId];
  }
  return { ...nextState, answers };
}
