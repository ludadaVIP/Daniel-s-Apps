// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { labExercises, exercises } from '../content';
import { Question } from './Question';
afterEach(cleanup);
describe('IME and hidden-answer learning interactions', () => {
  it('does not submit an in-progress composition on Enter or button click', () => {
    const onAnswer = vi.fn();
    render(
      <Question
        question={labExercises.find((q) => q.type === 'type_hanzi_ime')!}
        onAnswer={onAnswer}
        onNext={vi.fn()}
      />,
    );
    const input = screen.getByRole('textbox');
    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: 'nihao' } });
    fireEvent.keyDown(input, { key: 'Enter', isComposing: true, keyCode: 229 });
    fireEvent.click(screen.getByRole('button', { name: '检查答案' }));
    expect(onAnswer).not.toHaveBeenCalled();
    fireEvent.compositionEnd(input, { target: { value: '你好' } });
    fireEvent.change(input, { target: { value: '你好' } });
    fireEvent.click(screen.getByRole('button', { name: '检查答案' }));
    expect(onAnswer).toHaveBeenCalledWith(
      true,
      '你好',
      'automatic',
      expect.any(Number),
    );
  });
  it('hides the hanzi and audio until a reading attempt, then attributes parent assessment', () => {
    const onAnswer = vi.fn();
    render(
      <Question
        question={exercises.find(
          (q) => q.type === 'read_aloud' && q.wordId === 'ma1',
        )!}
        parent
        onAnswer={onAnswer}
        onNext={vi.fn()}
      />,
    );
    expect(screen.queryByText('妈')).toBeNull();
    expect(screen.queryByRole('button', { name: '听示范' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: '揭示并核对' }));
    expect(screen.getByText('妈')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: '家长确认：读对' }));
    expect(onAnswer).toHaveBeenCalledWith(
      true,
      '读对',
      'parent',
      expect.any(Number),
    );
  });
});

describe('long-form and grouped reading evidence', () => {
  it('requires explicit content confirmation for original writing and resets it after editing', () => {
    const q = exercises.find((q) => q.freeWriting)!;
    const onAnswer = vi.fn();
    render(<Question question={q} onAnswer={onAnswer} onNext={vi.fn()} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '好'.repeat(60) } });
    fireEvent.click(screen.getByRole('button', { name: '检查答案' }));
    expect(onAnswer).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.change(input, { target: { value: '好'.repeat(61) } });
    fireEvent.click(screen.getByRole('button', { name: '检查答案' }));
    expect(onAnswer).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAnswer).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: '检查答案' }));
    expect(onAnswer).toHaveBeenCalledWith(
      true,
      '好'.repeat(61),
      'self',
      expect.any(Number),
    );
  });
  it('restores an editing answer rather than the originally wrong candidate', () => {
    const q = exercises.find((q) => q.initialText === '我再学校。')!;
    render(
      <Question
        question={q}
        result={{ correct: true, response: '我在学校。', source: 'automatic' }}
        onAnswer={vi.fn()}
        onNext={vi.fn()}
      />,
    );
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe(
      '我在学校。',
    );
  });
});
