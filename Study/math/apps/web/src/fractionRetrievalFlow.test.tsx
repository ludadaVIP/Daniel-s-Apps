// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { fractionRetrieval } from './content/fractionRetrieval';
import { newSession, emptyProgress } from './model';
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
describe('fraction maintenance entry and persistence', () => {
  for (const s of Object.values(fractionRetrieval))
    it(`${s.unit}: keeps representation constraints and human review across reloads`, async () => {
      const p = emptyProgress(),
        before = {
          ...newSession(),
          note: 'Engineering fixture: preserve canonical review',
        };
      p.sessions[`${s.unit}-CHECK`] = before;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
      for (const [i, q] of s.questions.entries()) {
        const view = mount(`/math/unit/${s.unit}/maintenance?question=${q.id}`);
        expect(screen.getByText(q.stem.en)).toBeTruthy();
        expect(
          screen
            .getByRole('link', { name: /Revisit P53 foundation models/ })
            .getAttribute('href'),
        ).toBe(`/math/lesson/${s.bridgeByQuestion[q.id]}?step=1`);
        if (q.answer.kind === 'explain') {
          if (i === 1) click('A little hint');
          fireEvent.change(
            screen.getByRole('textbox', { name: 'Your reasoning' }),
            {
              target: { value: `Engineering review example: ${q.solution.en}` },
            },
          );
          expect(screen.getByText(new RegExp(`Recorded ${i}/4`))).toBeTruthy();
          fireEvent.click(
            screen.getByText('Parent review · look at the reasoning'),
          );
          click('Parent confirms: reasoning makes sense');
        } else {
          const wrong = s.unit === 'P61' ? '6/8' : '6/10',
            right = s.unit === 'P61' ? '3/4' : '3/5';
          fireEvent.change(
            screen.getByRole('textbox', { name: 'Your answer' }),
            { target: { value: wrong } },
          );
          click(/Check answer/);
          expect(saved().sessions[s.id].answers[q.id].correct).toBe(false);
          fireEvent.change(
            screen.getByRole('textbox', { name: 'Your answer' }),
            { target: { value: right } },
          );
          click(/Check answer/);
          expect(saved().sessions[s.id].answers[q.id].correct).toBe(true);
        }
        expect(
          screen.getByText(new RegExp(`Recorded ${i + 1}/4`)),
        ).toBeTruthy();
        view.unmount();
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      mount(`/math/unit/${s.unit}/maintenance`);
      expect(
        screen.getByText(/Recorded 4\/4; 2 independently completed/),
      ).toBeTruthy();
      expect(
        (
          screen.getByRole('textbox', {
            name: 'Your reasoning',
          }) as HTMLTextAreaElement
        ).value,
      ).toContain('Engineering review example:');
      expect(saved().sessions[`${s.unit}-CHECK`]).toEqual(before);
      for (const id of Object.values(s.bridgeByQuestion))
        expect(saved().sessions[id]).toBeUndefined();
      fireEvent.click(screen.getByRole('link', { name: /Open unit review/ }));
      expect(
        screen.getByRole('link', { name: /Open 4 cross-unit retrieval tasks/ }),
      ).toBeTruthy();
    });
});
