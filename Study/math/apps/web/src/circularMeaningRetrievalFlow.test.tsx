// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { circularMeaningRetrieval } from './content/circularMeaningRetrieval';
import { lessons } from './content';
import { maintenanceHref } from './content/maintenance';
const sets = Object.values(circularMeaningRetrieval);
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
describe('H04 independent circular supplement routes', () => {
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
              [s.unit + '-MAINT-CIRCULAR-Q3']: {
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
          s.unit + '-MAINT-CIRCULAR',
          (s.unit === 'H32' ? 'H36' : 'H32') + '-MAINT-CIRCULAR-MEANING',
          s.unit + '-CHECK',
          'H02-CHECK',
          'H04-CHECK',
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
              .getByRole('link', { name: /Revisit H04 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/H04-L0' + [1, 3, 5, 4, 6][i] + '?step=1');
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
          expect(saved().sessions['H04-L0' + n]).toBeUndefined();
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
  it('opens all six source parents with old tasks, exact shared new cards and unchanged primary bridges', () => {
    const mapping = [[1], [2], [2], [4], [3], [4, 5]];
    for (let n = 1; n <= 6; n++)
      for (const s of sets)
        for (const next of mapping[n - 1]!) {
          const view = mount('/math/lesson/H04-L0' + n);
          fireEvent.click(screen.getByText('A small guide for parents'));
          const links = screen.getAllByRole('link');
          for (const u of ['H32', 'H36'])
            expect(
              links.some((a) =>
                a
                  .getAttribute('href')
                  ?.includes(`question=${u}-MAINT-CIRCULAR-Q${n}`),
              ),
            ).toBe(true);
          const q = s.questions[next - 1]!;
          fireEvent.click(
            links.find(
              (a) => a.getAttribute('href') === maintenanceHref(s, q.id),
            )!,
          );
          expect(screen.getByText(q.stem.en)).toBeTruthy();
          expect(
            screen
              .getByRole('link', { name: /Revisit H04 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/' + s.bridgeByQuestion[q.id] + '?step=1');
          expect(saved().sessions['H04-L0' + n]).toBeUndefined();
          view.unmount();
        }
  });
  it('opens all five reused tasks from L05, preserving existing maintenance bridges and formal question selection', () => {
    for (const id of [
      'H36-MAINT-ADVANCED-EQUATION-Q3',
      'H38-MAINT-ADVANCED-EQUATION-Q3',
      'H35-L03-Q3',
      'H35-L03-Q4',
      'H35-L03-Q5',
    ]) {
      const view = mount('/math/lesson/H04-L05');
      fireEvent.click(screen.getByText('A small guide for parents'));
      fireEvent.click(
        screen
          .getAllByRole('link')
          .find(
            (a) =>
              new URL(
                a.getAttribute('href')!,
                'http://localhost',
              ).searchParams.get('question') === id,
          )!,
      );
      if (id.includes('MAINT')) {
        expect(screen.getByText(/Recorded 0\/5/)).toBeTruthy();
        expect(
          screen
            .getByRole('link', { name: /Revisit H35 foundation models/ })
            .getAttribute('href'),
        ).toBe('/math/lesson/H35-L03?step=1');
        expect(
          (
            screen.getByRole('textbox', {
              name: 'Your reasoning',
            }) as HTMLTextAreaElement
          ).value,
        ).toBe('');
      } else {
        const task = lessons
          .find((l) => l.id === 'H35-L03')!
          .questions.find((q) => q.id === id)!;
        expect(screen.getByText(task.stem.en)).toBeTruthy();
      }
      expect(saved()?.sessions['H04-L05']).toBeUndefined();
      view.unmount();
    }
  });
});
