// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { primaryCapstoneRetrieval } from './content/primaryCapstoneRetrieval';
import { emptyProgress, newSession } from './model';
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
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const click = (name: string | RegExp) =>
  fireEvent.click(screen.getByRole('button', { name }));
const saved = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!);
describe('primary capstone retrieval routes', () => {
  for (const s of Object.values(primaryCapstoneRetrieval))
    it(`${s.unit}: opens all ten arguments, requires explicit review and restores its own session`, async () => {
      const p = emptyProgress(),
        original = {
          ...newSession(),
          practiceIndex: 2,
          note: 'Engineering fixture: preserve original check',
        };
      p.sessions[`${s.unit}-CHECK`] = original;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
      for (const [i, q] of s.questions.entries()) {
        const view = mount(`/math/unit/${s.unit}/maintenance?question=${q.id}`);
        expect(screen.getByText(q.stem.en)).toBeTruthy();
        expect(screen.getByText(s.intro.en)).toBeTruthy();
        if (i === 9) {
          const table = screen.getByRole('table', {
            name: /Fictional trip data/,
          });
          expect(within(table).getAllByRole('row')).toHaveLength(7);
          expect(within(table).getAllByRole('columnheader')).toHaveLength(3);
          expect(within(table).getAllByRole('rowheader')).toHaveLength(6);
          expect(
            within(table).getByText(
              s.unit === 'J91' ? '32 per group return' : '36 per group return',
            ),
          ).toBeTruthy();
          expect(within(table).queryByText('108')).toBeNull();
        } else expect(screen.queryByRole('table')).toBeNull();
        expect(
          screen
            .getByRole('link', { name: /Revisit .* foundation models/ })
            .getAttribute('href'),
        ).toBe(`/math/lesson/${s.bridgeByQuestion[q.id]}?step=1`);
        fireEvent.change(
          screen.getByRole('textbox', { name: 'Your reasoning' }),
          { target: { value: `Engineering review example: ${q.solution.en}` } },
        );
        expect(screen.getByText(new RegExp(`Recorded ${i}/10`))).toBeTruthy();
        if (i === 2) click('A little hint');
        fireEvent.click(
          screen.getByText('Parent review · look at the reasoning'),
        );
        click('Parent confirms: reasoning makes sense');
        expect(
          screen.getByText(new RegExp(`Recorded ${i + 1}/10`)),
        ).toBeTruthy();
        view.unmount();
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      mount(`/math/unit/${s.unit}/maintenance`);
      expect(
        screen.getByText(/Recorded 10\/10; 9 independently completed/),
      ).toBeTruthy();
      expect(
        (
          screen.getByRole('textbox', {
            name: 'Your reasoning',
          }) as HTMLTextAreaElement
        ).value,
      ).toBe(`Engineering review example: ${s.questions[9]!.solution.en}`);
      expect(saved().sessions[`${s.unit}-CHECK`]).toEqual(original);
      for (const id of Object.values(s.bridgeByQuestion))
        expect(saved().sessions[id]).toBeUndefined();
      expect(saved().sessions[s.id].completedAt).toBeUndefined();
      fireEvent.click(screen.getByRole('link', { name: /Open unit review/ }));
      expect(
        screen.getByRole('link', {
          name: /Open 10 cross-unit retrieval tasks/,
        }),
      ).toBeTruthy();
      expect(saved().sessions[`${s.unit}-CHECK`]).toEqual(original);
    });
});

describe('bilingual trip givens', () => {
  for (const s of Object.values(primaryCapstoneRetrieval))
    it(`${s.unit}: renders labelled givens in both languages without recording an unreviewed task`, () => {
      localStorage.setItem('study-language', 'bilingual');
      mount(`/math/unit/${s.unit}/maintenance?question=${s.questions[9]!.id}`);
      const table = screen.getByRole('table', { name: /Fictional trip data/ });
      expect(
        within(table).getByRole('columnheader', { name: /费用条件/ }),
      ).toBeTruthy();
      expect(within(table).getByText('Price conditions')).toBeTruthy();
      expect(within(table).getByText('必留机动')).toBeTruthy();
      expect(within(table).getByText('No extra charge')).toBeTruthy();
      expect(
        within(table).getByText(
          s.unit === 'J91'
            ? '原价每人12，付原票价75%'
            : '原价每人16，付原票价75%',
        ),
      ).toBeTruthy();
      expect(screen.getByText(/Recorded 0\/10/)).toBeTruthy();
      expect(saved().sessions[s.id].answers).toEqual({});
    });
});
