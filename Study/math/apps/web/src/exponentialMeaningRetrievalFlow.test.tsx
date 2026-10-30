// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { exponentialMeaningRetrieval } from './content/exponentialMeaningRetrieval';
import { maintenanceHref, maintenanceSets } from './content/maintenance';
const sets = Object.values(exponentialMeaningRetrieval);
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
describe('H03 independent exponential supplement routes', () => {
  for (const s of sets)
    it(
      s.unit +
        ': preserves old reviewed work and records six independent cards',
      () => {
        const p = emptyProgress(),
          fixture = {
            ...newSession(),
            note: 'Engineering fixture: old reviewed work',
            answers: {
              [s.unit + '-MAINT-EXP-LOG-Q3']: {
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
          s.unit + '-MAINT-EXP-LOG',
          (s.unit === 'H31' ? 'H35' : 'H31') + '-MAINT-EXPONENTIAL-MEANING',
          s.unit + '-CHECK',
          'H02-CHECK',
          'H03-CHECK',
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
            screen.getByText(new RegExp('Recorded ' + i + '/6')),
          ).toBeTruthy();
          expect(saved().sessions[s.id].answers[q.id]).toBeUndefined();
          expect(
            screen
              .getByRole('link', { name: /Revisit H03 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/H03-L0' + (i + 1) + '?step=1');
          fireEvent.change(
            screen.getByRole('textbox', { name: 'Your reasoning' }),
            {
              target: { value: 'Engineering review fixture: ' + q.solution.en },
            },
          );
          expect(saved().sessions[s.id].answers[q.id].checked).toBe(false);
          if (i === 5)
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
            screen.getByText(new RegExp('Recorded ' + (i + 1) + '/6')),
          ).toBeTruthy();
          for (const k of protectedIds)
            expect(saved().sessions[k]).toEqual(fixture);
          view.unmount();
        }
        mount(maintenanceHref(s));
        expect(
          screen.getByText(/Recorded 6\/6; 5 independently completed/),
        ).toBeTruthy();
        expect(
          (
            screen.getByRole('textbox', {
              name: 'Your reasoning',
            }) as HTMLTextAreaElement
          ).value,
        ).toBe('Engineering review fixture: ' + s.questions[5]!.solution.en);
        expect(saved().sessions[s.id].completedAt).toBeUndefined();
        for (let n = 1; n <= 6; n++)
          expect(saved().sessions['H03-L0' + n]).toBeUndefined();
      },
    );
  it('renders all twelve bilingual tables blank with human confirmation disabled', () => {
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
        expect(screen.getByText(/Recorded 0\/6/)).toBeTruthy();
        view.unmount();
      }
  });
  it('opens all six source parents with old shared Q3 and new individual bridges intact', () => {
    for (let n = 1; n <= 6; n++)
      for (const s of sets) {
        const view = mount('/math/lesson/H03-L0' + n);
        fireEvent.click(screen.getByText('A small guide for parents'));
        const links = screen.getAllByRole('link');
        for (const u of ['H31', 'H35'])
          expect(
            links.some((a) =>
              a
                .getAttribute('href')
                ?.includes(
                  `question=${u}-MAINT-EXP-LOG-Q${[1, 2, 3, 4, 5, 3][n - 1]}`,
                ),
            ),
          ).toBe(true);
        const q = s.questions[n - 1]!;
        fireEvent.click(
          links.find(
            (a) => a.getAttribute('href') === maintenanceHref(s, q.id),
          )!,
        );
        expect(screen.getByText(q.stem.en)).toBeTruthy();
        expect(
          screen
            .getByRole('link', { name: /Revisit H03 foundation models/ })
            .getAttribute('href'),
        ).toBe('/math/lesson/H03-L0' + n + '?step=1');
        expect(saved().sessions['H03-L0' + n]).toBeUndefined();
        view.unmount();
      }
  });
  it('reuses all eight source references with original geometry and advanced-equation bridges', () => {
    const cases = [
      ...['H05', 'H06'].map((u) => ({
        source: 2,
        id: `${u}-MAINT-PYTHAGOREAN-MEANING-Q3`,
        bridge: 'J87-L04',
        size: 3,
      })),
      ...['H36', 'H38'].map((u) => ({
        source: 2,
        id: `${u}-MAINT-ADVANCED-EQUATION-Q1`,
        bridge: 'H35-L01',
        size: 5,
      })),
      ...[4, 5].flatMap((source) =>
        ['H36', 'H38'].map((u) => ({
          source,
          id: `${u}-MAINT-ADVANCED-EQUATION-Q2`,
          bridge: 'H35-L02',
          size: 5,
        })),
      ),
    ];
    for (const c of cases) {
      const view = mount('/math/lesson/H03-L0' + c.source);
      fireEvent.click(screen.getByText('A small guide for parents'));
      const set = Object.values(maintenanceSets).find((s) =>
        s.questions.some((q) => q.id === c.id),
      )!;
      fireEvent.click(
        screen
          .getAllByRole('link')
          .find((a) => a.getAttribute('href') === maintenanceHref(set, c.id))!,
      );
      expect(
        screen
          .getByRole('textbox', { name: 'Your reasoning' })
          .getAttribute('value') || '',
      ).toBe('');
      expect(screen.getByText(new RegExp('Recorded 0/' + c.size))).toBeTruthy();
      expect(
        screen
          .getByRole('link', { name: /Revisit .* foundation models/ })
          .getAttribute('href'),
      ).toBe('/math/lesson/' + c.bridge + '?step=1');
      view.unmount();
    }
  });
});
