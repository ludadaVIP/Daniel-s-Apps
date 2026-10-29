// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { logicMeaningRetrieval } from './content/logicMeaningRetrieval';
import { maintenanceHref, maintenanceSets } from './content/maintenance';
const sets = Object.values(logicMeaningRetrieval);
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
const saved = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!);
describe('H01 independent supplement navigation and review isolation', () => {
  for (const s of sets)
    it(
      s.unit +
        ': saves five distinct cards, restores the last and preserves old records',
      () => {
        const p = emptyProgress(),
          fixture = {
            ...newSession(),
            note: 'Engineering fixture: preserve old work',
            answers: {
              [s.unit + '-MAINT-LOGIC-FUNCTION-Q1']: {
                input: 'Engineering fixture old checked',
                tries: 1,
                hints: 0,
                correct: true,
                independent: true,
                checked: true,
              },
            },
          };
        const protectedIds = [
          s.unit + '-MAINT-LOGIC-FUNCTION',
          s.unit + '-MAINT',
          s.unit + '-CHECK',
          'H01-CHECK',
          'J98-CHECK',
          'P51-MAINT',
        ];
        for (const k of protectedIds) p.sessions[k] = structuredClone(fixture);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
        for (const [i, q] of s.questions.entries()) {
          const view = mount(maintenanceHref(s, q.id));
          expect(
            (
              screen.getByRole('textbox', {
                name: 'Your reasoning',
              }) as HTMLTextAreaElement
            ).value,
          ).toBe('');
          expect(
            screen.getByText(new RegExp('Recorded ' + i + '/5')),
          ).toBeTruthy();
          expect(saved().sessions[s.id].answers[q.id]).toBeUndefined();
          expect(
            screen
              .getByRole('link', { name: /Revisit H01 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/H01-L0' + (i + 1) + '?step=1');
          fireEvent.change(
            screen.getByRole('textbox', { name: 'Your reasoning' }),
            {
              target: { value: 'Engineering review fixture: ' + q.solution.en },
            },
          );
          expect(saved().sessions[s.id].answers[q.id].checked).toBe(false);
          if (i === 4)
            fireEvent.click(
              screen.getByRole('button', { name: 'A little hint' }),
            );
          fireEvent.click(
            screen.getByText('Parent review · look at the reasoning'),
          );
          fireEvent.click(
            screen.getByRole('button', {
              name: 'Parent confirms: reasoning makes sense',
            }),
          );
          expect(
            screen.getByText(new RegExp('Recorded ' + (i + 1) + '/5')),
          ).toBeTruthy();
          for (const k of protectedIds)
            expect(saved().sessions[k]).toEqual(fixture);
          view.unmount();
        }
        mount(maintenanceHref(s));
        expect(
          screen.getByText(/Recorded 5\/5; 4 independently completed/),
        ).toBeTruthy();
        expect(
          (
            screen.getByRole('textbox', {
              name: 'Your reasoning',
            }) as HTMLTextAreaElement
          ).value,
        ).toBe('Engineering review fixture: ' + s.questions[4]!.solution.en);
        expect(saved().sessions[s.id].completedAt).toBeUndefined();
        for (let n = 1; n <= 5; n++)
          expect(saved().sessions['H01-L0' + n]).toBeUndefined();
      },
    );
  it('renders all ten bilingual tables with blank explanations and closed reference answers', () => {
    localStorage.setItem('study-language', 'bilingual');
    for (const s of sets)
      for (const q of s.questions) {
        const view = mount(maintenanceHref(s, q.id));
        expect(screen.getByText(q.stem.zh)).toBeTruthy();
        expect(screen.getByText(q.stem.en)).toBeTruthy();
        expect(screen.getAllByRole('row')).toHaveLength(
          q.contextTable!.rows.length + 1,
        );
        expect(
          (
            screen.getByRole('textbox', {
              name: '我的解释',
            }) as HTMLTextAreaElement
          ).value,
        ).toBe('');
        expect(screen.getByText(q.solution.en).closest('details')?.open).toBe(
          false,
        );
        expect(screen.getByText(/Recorded 0\/5/)).toBeTruthy();
        view.unmount();
      }
  });
  it('opens each exact new card from its source parent guide while preserving the original two references', () => {
    for (let n = 1; n <= 5; n++)
      for (const s of sets) {
        const view = mount('/math/lesson/H01-L0' + n);
        fireEvent.click(screen.getByText('A small guide for parents'));
        const links = screen.getAllByRole('link'),
          oldN = n <= 2 ? 1 : n - 1;
        for (const u of ['H25', 'H26'])
          expect(
            links.some((a) =>
              a
                .getAttribute('href')
                ?.includes('question=' + u + '-MAINT-LOGIC-FUNCTION-Q' + oldN),
            ),
          ).toBe(true);
        fireEvent.click(
          links.find(
            (a) =>
              a.getAttribute('href') ===
              maintenanceHref(s, s.questions[n - 1]!.id),
          )!,
        );
        expect(screen.getByText(s.questions[n - 1]!.stem.en)).toBeTruthy();
        expect(saved().sessions['H01-L0' + n]).toBeUndefined();
        view.unmount();
      }
  });
  it('retains every original primary bridge instead of redirecting shared evidence', () => {
    for (const u of ['H25', 'H26'])
      for (let n = 1; n <= 4; n++) {
        const id = u + '-MAINT-LOGIC-FUNCTION-Q' + n,
          set = Object.values(maintenanceSets).find((s) =>
            s.questions.some((q) => q.id === id),
          )!;
        const view = mount(maintenanceHref(set, id));
        expect(
          screen
            .getByRole('link', { name: /Revisit H01 foundation models/ })
            .getAttribute('href'),
        ).toBe('/math/lesson/H01-L0' + (n + 1) + '?step=1');
        expect(
          (
            screen.getByRole('textbox', {
              name: 'Your reasoning',
            }) as HTMLTextAreaElement
          ).value,
        ).toBe('');
        view.unmount();
      }
  });
});
