// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { b04CheckQuestions } from './content/B04Review';
import { unitChecks } from './content';
import { checkAnswer } from './model';
import { App } from './App';
import { Question } from './Question';
import { STORAGE_KEY } from './progress';
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('study-language', 'en');
  vi.stubGlobal('scrollTo', vi.fn());
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
const click = (name: string | RegExp) =>
  fireEvent.click(screen.getByRole('button', { name }));
const enter = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name }), {
    target: { value },
  });
const mount = () =>
  render(
    <MemoryRouter initialEntries={['/math/unit/B04/check']}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
describe('B04 missing unit-review closure', () => {
  it('keeps a generic fraction format example from being a correct answer or an equivalent answer', () => {
    for (const value of ['3/8', '6/16', '2/5', '5/12', '0']) {
      const q = {
        ...b04CheckQuestions[0]!,
        answer: { kind: 'number' as const, value },
      };
      const v = render(<Question question={q} mode="en" onChange={() => {}} />);
      const label = screen.getByText(
        /Your answer \(fractions can use/,
      ).textContent!;
      const sample = label.match(/use ([0-9]+\/[0-9]+)/)![1]!;
      expect(checkAnswer(sample, q.answer), value + ':' + sample).toBe(false);
      expect(
        (
          screen.getByRole('textbox', {
            name: 'Your answer',
          }) as HTMLInputElement
        ).value,
      ).toBe('');
      v.unmount();
    }
    render(
      <Question
        question={b04CheckQuestions[3]!}
        mode="en"
        onChange={() => {}}
      />,
    );
    expect(
      screen.getByText('Use a decimal or whole number without a percent sign'),
    ).toBeTruthy();
    expect(screen.queryByText(/fractions can use/)).toBeNull();
  });

  it('covers all five existing lessons with six exact generated answers and two human arguments', () => {
    expect(unitChecks.B04.questions).toBe(b04CheckQuestions);
    expect(b04CheckQuestions).toHaveLength(8);
    for (const q of b04CheckQuestions) {
      expect(
        q.stem.zh && q.stem.en && q.solution.zh && q.solution.en,
      ).toBeTruthy();
      expect(q.hints).toHaveLength(2);
      if (q.answer.kind === 'explain')
        expect(checkAnswer('same whole place value zero', q.answer)).toBeNull();
      else {
        q.answerChecks!.accepted.forEach((a) =>
          expect(checkAnswer(a, q.answer), q.id + ':' + a).toBe(true),
        );
        q.answerChecks!.rejected.forEach((a) =>
          expect(checkAnswer(a, q.answer), q.id + ':' + a).toBe(false),
        );
      }
    }
    expect(checkAnswer('0.6', b04CheckQuestions[2]!.answer)).toBe(true);
    expect(checkAnswer('38/100', b04CheckQuestions[3]!.answer)).toBe(false);
    expect(checkAnswer('NZ$5.20', b04CheckQuestions[5]!.answer)).toBe(true);
  });
  it('makes the real route available, retains exact work and requires both human reviews before eight are recorded', () => {
    const v = mount();
    expect(
      screen.getByText('A small fractions and decimals review'),
    ).toBeTruthy();
    ['6/16', '1/4', '6/10', '0.38', '7', 'NZ$5.20'].forEach((a, i) => {
      click(`Question ${i + 1}`);
      enter('Your answer', a);
      click(/Check answer/);
    });
    const reports = [
      'Engineering review example: Use equal-sized sheets. Half is two quarters, so 1/2=2/4>1/4. Different starting sheet sizes need a common whole or actual areas; denominators alone cannot compare physical pieces.',
      'Engineering review example: Both prices have two dollars, but 2.07 adds seven cents and 2.70 adds seventy, differing by 63 cents. The internal zero holds tenths and cannot be removed. The trailing zero in 2.70 keeps value, so 2.7 equals 2.70.',
    ];
    reports.forEach((r, i) => {
      click(`Question ${i + 7}`);
      enter('Your reasoning', r);
      expect(screen.getByText(new RegExp(`Recorded ${i + 6}/8`))).toBeTruthy();
      fireEvent.click(
        screen.getByText('Parent review · look at the reasoning'),
      );
      click('Parent confirms: reasoning makes sense');
    });
    expect(screen.getByText(/Recorded 8\/8/)).toBeTruthy();
    v.unmount();
    mount();
    expect(screen.getByText(/Recorded 8\/8/)).toBeTruthy();
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['B04-L01'],
    ).toBeUndefined();
  });
});
