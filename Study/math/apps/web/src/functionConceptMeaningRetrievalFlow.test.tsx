// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { functionConceptMeaningRetrieval } from './content/functionConceptMeaningRetrieval';
import { maintenanceHref, maintenanceSets } from './content/maintenance';
const sets = Object.values(functionConceptMeaningRetrieval);
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
describe('H02 independent concept supplement routes', () => {
  for (const s of sets)
    it(
      s.unit +
        ': preserves old reviewed work and records five independent cards',
      () => {
        const p = emptyProgress(),
          fixture = {
            ...newSession(),
            note: 'Engineering fixture: old reviewed work',
            answers: {
              [s.unit + '-MAINT-LOGIC-FUNCTION-Q5']: {
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
          s.unit + '-MAINT-LOGIC-MEANING',
          s.unit + '-CHECK',
          'H01-CHECK',
          'H02-CHECK',
          'H36-MAINT-ADVANCED-EQUATION',
          'H38-MAINT-INTEGRATION-AUDIT',
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
              .getByRole('link', { name: /Revisit H02 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/H02-L0' + (i + 2) + '?step=1');
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
        for (let n = 1; n <= 6; n++)
          expect(saved().sessions['H02-L0' + n]).toBeUndefined();
      },
    );
  it('renders all ten bilingual tables blank with human confirmation disabled', () => {
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
        fireEvent.click(
          screen.getByText('Parent review · look at the reasoning'),
        );
        expect(
          (
            screen.getByRole('button', {
              name: /Parent confirms: reasoning makes sense/,
            }) as HTMLButtonElement
          ).disabled,
        ).toBe(true);
        expect(screen.getByText(/Recorded 0\/5/)).toBeTruthy();
        view.unmount();
      }
  });
  it('opens all six source parent routes with original links and shared card primary bridge intact', () => {
    for (let n = 1; n <= 6; n++)
      for (const s of sets) {
        const view = mount('/math/lesson/H02-L0' + n);
        fireEvent.click(screen.getByText('A small guide for parents'));
        const links = screen.getAllByRole('link'),
          oldN = [5, 0, 6, 7, 5, 8][n - 1]!;
        for (const u of oldN ? ['H25', 'H26'] : ['H28', 'H38']) {
          const id = oldN
            ? `${u}-MAINT-LOGIC-FUNCTION-Q${oldN}`
            : `${u}-MAINT-INTEGRATION-AUDIT-Q1`;
          expect(
            links.some((a) =>
              a.getAttribute('href')?.includes('question=' + id),
            ),
          ).toBe(true);
        }
        const q = s.questions[n <= 2 ? 0 : n - 2]!;
        fireEvent.click(
          links.find(
            (a) => a.getAttribute('href') === maintenanceHref(s, q.id),
          )!,
        );
        expect(screen.getByText(q.stem.en)).toBeTruthy();
        expect(
          screen
            .getByRole('link', { name: /Revisit H02 foundation models/ })
            .getAttribute('href'),
        ).toBe('/math/lesson/H02-L0' + (n <= 2 ? 2 : n) + '?step=1');
        expect(saved().sessions['H02-L0' + n]).toBeUndefined();
        view.unmount();
      }
  });
  it('opens every reused natural-domain, transform and inverse task while retaining its H35 primary bridge', () => {
    for (const [source, qNo] of [
      [1, 5],
      [4, 4],
      [5, 1],
    ])
      for (const u of ['H36', 'H38']) {
        const view = mount('/math/lesson/H02-L0' + source);
        fireEvent.click(screen.getByText('A small guide for parents'));
        const id = `${u}-MAINT-ADVANCED-EQUATION-Q${qNo}`,
          set = Object.values(maintenanceSets).find((s) =>
            s.questions.some((q) => q.id === id),
          )!;
        fireEvent.click(
          screen
            .getAllByRole('link')
            .find((a) => a.getAttribute('href') === maintenanceHref(set, id))!,
        );
        expect(
          screen
            .getByRole('link', { name: /Revisit H35 foundation models/ })
            .getAttribute('href'),
        ).toBe('/math/lesson/H35-L0' + qNo + '?step=1');
        expect(
          (
            screen.getByRole('textbox', {
              name: 'Your reasoning',
            }) as HTMLTextAreaElement
          ).value,
        ).toBe('');
        expect(screen.getByText(/Recorded 0\/5/)).toBeTruthy();
        view.unmount();
      }
  });
});
