// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AssessmentPage, GraduationResult } from './Assessment';
import { Question } from './Question';
import { assessmentExercises, assessments } from '../content';
import {
  emptyProgress,
  newSession,
  useProgress,
  type ProgressStore,
} from '../progress';
import type { Result } from '../engine';
afterEach(() => {
  cleanup();
  localStorage.clear();
});
describe('checkpoint flows and certificate gating', () => {
  it('hides answers until attempted and requires a decision for each syllable', () => {
    const q = assessmentExercises.find((q) => q.id === 'A06-Q01')!;
    const onAnswer = vi.fn();
    const { container } = render(
      <Question question={q} parent onAnswer={onAnswer} onNext={vi.fn()} />,
    );
    expect(screen.queryByText('端')).toBeNull();
    expect(
      screen.queryAllByRole('button', { name: '核对这条读音' }),
    ).toHaveLength(0);
    fireEvent.click(
      screen.getByRole('button', { name: '我已尝试朗读，开始核对' }),
    );
    fireEvent.click(screen.getByRole('button', { name: '保存家长确认' }));
    expect(onAnswer).not.toHaveBeenCalled();
    const items = container.querySelectorAll('.py-reading-item');
    items.forEach((item, i) =>
      fireEvent.click(
        within(item as HTMLElement).getByRole('button', {
          name: i ? '读对' : '需练',
        }),
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: '保存家长确认' }));
    expect(onAnswer).toHaveBeenCalledWith(
      false,
      JSON.stringify({ correctCount: 4, totalCount: 5 }),
      'parent',
      expect.any(Number),
    );
  });
  it('persists checkpoint answers and resumes without replacing course progress', () => {
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    function Harness() {
      const store = useProgress();
      return <AssessmentPage store={store} parent={false} />;
    }
    function mount() {
      return render(
        <MemoryRouter initialEntries={['/pinyin/assessment/A00']}>
          <Routes>
            <Route
              path="/pinyin/assessment/:assessmentId"
              element={<Harness />}
            />
          </Routes>
        </MemoryRouter>,
      );
    }
    const first = mount();
    fireEvent.click(screen.getByRole('button', { name: /开始小侦查/ }));
    fireEvent.click(screen.getByRole('button', { name: /nǐ$/ }));
    fireEvent.click(screen.getByRole('button', { name: /下一组线索/ }));
    first.unmount();
    mount();
    expect(screen.getByText('看到「好」，你认识它对应的拼音吗？')).toBeTruthy();
    expect(screen.getByText('2 / 12')).toBeTruthy();
    vi.restoreAllMocks();
  });
  it('shows a certificate only after a finished attempt passes every final dimension', () => {
    const final = assessments.find((a) => a.id === 'A06')!;
    const answers: Record<string, Result> = Object.fromEntries(
      final.questionIds.map((id) => {
        const q = assessmentExercises.find((q) => q.id === id)!;
        const total = q.wordIds?.length ?? q.readingTotal;
        return [
          id,
          {
            correct: true,
            response: total
              ? JSON.stringify({ correctCount: total, totalCount: total })
              : q.acceptedAnswers[0]!,
            source: total ? 'parent' : 'automatic',
          },
        ];
      }),
    );
    const progress = {
      ...emptyProgress(),
      sessions: { A06: { ...newSession(), answers } },
    };
    const store: ProgressStore = {
      progress,
      error: '',
      patchSession: vi.fn(),
      answer: vi.fn(),
      reset: vi.fn(),
      setNotes: vi.fn(),
    };
    const view = render(<GraduationResult store={store} />);
    expect(screen.queryByRole('button', { name: /下载我的证书/ })).toBeNull();
    progress.sessions.A06.finishedAt = '2026-10-11T03:00:00Z';
    view.rerender(<GraduationResult store={store} />);
    expect(screen.getByRole('button', { name: /下载我的证书/ })).toBeTruthy();
    answers['A06-Q12']!.correct = false;
    view.rerender(<GraduationResult store={store} />);
    expect(screen.queryByRole('button', { name: /下载我的证书/ })).toBeNull();
  });
});
