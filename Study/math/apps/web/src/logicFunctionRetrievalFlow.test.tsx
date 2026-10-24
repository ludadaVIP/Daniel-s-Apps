// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { logicFunctionRetrieval } from './content/logicFunctionRetrieval';
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
describe('logic and function retrieval routes', () => {
  it('renders both fictional tariff tables with complete bilingual rules and no automatic completion', async () => {
    for (const s of Object.values(logicFunctionRetrieval))
      for (const lang of ['en', 'bilingual']) {
        localStorage.clear();
        localStorage.setItem('study-language', lang);
        const q = s.questions[7]!;
        const view = mount(`/math/unit/${s.unit}/maintenance?question=${q.id}`);
        expect(
          screen.getByRole('table', {
            name:
              lang === 'en'
                ? 'Given fictional weight-cost rules'
                : /给定虚构重量计费规则/,
          }),
        ).toBeTruthy();
        expect(screen.getAllByRole('row')).toHaveLength(5);
        expect(screen.getAllByRole('columnheader')).toHaveLength(3);
        const headings = screen
          .getAllByRole('rowheader')
          .map((h) => h.textContent);
        expect(new Set(headings).size).toBe(4);
        for (const r of q.contextTable!.rows)
          for (const cell of r.slice(1))
            expect(screen.getAllByText(cell.en).length).toBeGreaterThan(0);
        if (lang === 'bilingual')
          expect(screen.getByText('给定虚构重量计费规则')).toBeTruthy();
        expect(screen.getByText(/Recorded 0\/8/)).toBeTruthy();
        view.unmount();
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
  });
  for (const s of Object.values(logicFunctionRetrieval))
    it(`${s.unit}: opens all eight arguments, requires explicit review and restores its own session`, async () => {
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
        expect(
          screen
            .getByRole('link', { name: /Revisit .* foundation models/ })
            .getAttribute('href'),
        ).toBe(`/math/lesson/${s.bridgeByQuestion[q.id]}?step=1`);
        fireEvent.change(
          screen.getByRole('textbox', { name: 'Your reasoning' }),
          { target: { value: `Engineering review example: ${q.solution.en}` } },
        );
        expect(screen.getByText(new RegExp(`Recorded ${i}/8`))).toBeTruthy();
        if (i === 2) click('A little hint');
        fireEvent.click(
          screen.getByText('Parent review · look at the reasoning'),
        );
        click('Parent confirms: reasoning makes sense');
        expect(
          screen.getByText(new RegExp(`Recorded ${i + 1}/8`)),
        ).toBeTruthy();
        view.unmount();
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
      mount(`/math/unit/${s.unit}/maintenance`);
      expect(
        screen.getByText(/Recorded 8\/8; 7 independently completed/),
      ).toBeTruthy();
      expect(
        (
          screen.getByRole('textbox', {
            name: 'Your reasoning',
          }) as HTMLTextAreaElement
        ).value,
      ).toBe(`Engineering review example: ${s.questions[7]!.solution.en}`);
      expect(saved().sessions[`${s.unit}-CHECK`]).toEqual(original);
      for (const id of Object.values(s.bridgeByQuestion))
        expect(saved().sessions[id]).toBeUndefined();
      expect(saved().sessions[s.id].completedAt).toBeUndefined();
      fireEvent.click(screen.getByRole('link', { name: /Open unit review/ }));
      expect(
        screen.getByRole('link', { name: /Open 8 cross-unit retrieval tasks/ }),
      ).toBeTruthy();
      expect(saved().sessions[`${s.unit}-CHECK`]).toEqual(original);
    });
});
