import { useCallback, useEffect, useRef, useState } from 'react';
import { getTtsAudioUrl } from './api';

// New regex on each call so global-flag lastIndex never leaks between callers.
function dashRegex() {
  return /[_]{2,}|[–—]{2,}/g;
}

export function readableQuestionSentence(question) {
  if (!question?.question) return '';
  // Replace blank runs with a natural pause so TTS doesn't read "underscore".
  return question.question.replace(dashRegex(), '... ').replace(/\s{2,}/g, ' ').trim();
}

export function completeSentenceForAnswer(question, answer) {
  if (!question || !answer) return '';
  const correct = answer.correctText || '';
  if (question.type === 'mc' || question.type === 'fill') {
    const text = question.question || '';
    const replaced = text.replace(dashRegex(), correct);
    if (replaced !== text) {
      return replaced.replace(/\s{2,}/g, ' ').trim();
    }
    return `${text} ${correct}`.replace(/\s{2,}/g, ' ').trim();
  }
  return correct;
}

/**
 * Speech text for the per-question "Speak" button — reading passage (if any),
 * followed by the complete sentence with the correct answer filled in.
 * Returns an empty string when the question hasn't been answered yet.
 */
export function speechForCurrentQuestion(question, answer) {
  if (!question || !answer) return '';
  const sentence = completeSentenceForAnswer(question, answer);
  const reading = (question.reading || '').trim();
  if (!reading) return sentence;
  // Insert a natural pause between the passage and the question sentence.
  return `${reading}. ... ${sentence}`.replace(/\s{2,}/g, ' ').trim();
}

class TtsCancelled extends Error {
  constructor() {
    super('Speech cancelled.');
    this.name = 'TtsCancelled';
  }
}

export function isTtsCancelled(err) {
  return err instanceof TtsCancelled || err?.name === 'TtsCancelled';
}

/**
 * useTts — owns a single Audio element so only one line plays at a time.
 *
 * playing.kind:  'question' | 'explanation' | 'readAll' | null
 * playing.key:   string identifier (question id, "readAll-3", ...)
 */
export function useTts() {
  const audioRef = useRef(null);
  const cancelTokenRef = useRef(0);
  const pendingRejectRef = useRef(null);
  const [playing, setPlaying] = useState({ kind: null, key: null });
  const [loading, setLoading] = useState({ kind: null, key: null });
  const [error, setError] = useState('');

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio();
      audio.preload = 'auto';
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const stop = useCallback(() => {
    cancelTokenRef.current += 1;
    const audio = audioRef.current;
    if (audio) {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch (_) {
        /* ignore */
      }
    }
    // Reject any in-flight playText so the caller's await unblocks.
    const reject = pendingRejectRef.current;
    pendingRejectRef.current = null;
    if (reject) reject(new TtsCancelled());
    setPlaying({ kind: null, key: null });
    setLoading({ kind: null, key: null });
  }, []);

  const playText = useCallback(
    async ({ text, quizId = '', kind = 'question', key = '' }) => {
      const trimmed = (text || '').trim();
      if (!trimmed) return;
      // Cancel any previous play in flight.
      const previousReject = pendingRejectRef.current;
      pendingRejectRef.current = null;
      if (previousReject) previousReject(new TtsCancelled());

      cancelTokenRef.current += 1;
      const ownToken = cancelTokenRef.current;
      const audio = getAudio();
      try {
        audio.pause();
      } catch (_) {
        /* ignore */
      }
      setError('');
      setLoading({ kind, key });
      try {
        const url = await getTtsAudioUrl(trimmed, { quizId });
        if (ownToken !== cancelTokenRef.current) throw new TtsCancelled();
        audio.src = url;
        setPlaying({ kind, key });
        setLoading({ kind: null, key: null });
        await new Promise((resolve, reject) => {
          pendingRejectRef.current = reject;
          const finish = (err) => {
            cleanup();
            if (pendingRejectRef.current === reject) pendingRejectRef.current = null;
            if (err) reject(err);
            else resolve();
          };
          const onEnded = () => finish();
          const onError = () => finish(new Error('Audio playback failed.'));
          const cleanup = () => {
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('error', onError);
          };
          audio.addEventListener('ended', onEnded);
          audio.addEventListener('error', onError);
          audio.play().catch((err) => finish(err));
        });
        if (ownToken !== cancelTokenRef.current) throw new TtsCancelled();
        setPlaying({ kind: null, key: null });
      } catch (err) {
        if (ownToken === cancelTokenRef.current && !isTtsCancelled(err)) {
          setError(err?.message || 'Could not play audio.');
        }
        setPlaying({ kind: null, key: null });
        setLoading({ kind: null, key: null });
        throw err;
      }
    },
    [getAudio]
  );

  useEffect(() => stop, [stop]);

  return { playText, stop, playing, loading, error };
}
