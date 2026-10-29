// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { integrationMeaningRetrieval } from './content/integrationMeaningRetrieval';
import { RAMP_DRAFT_KEY, defaultRamp } from './integrationModels';
import { maintenanceHref, maintenanceSets } from './content/maintenance';
const sets = Object.values(integrationMeaningRetrieval);
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('study-language', 'en');
  localStorage.setItem(
    RAMP_DRAFT_KEY,
    JSON.stringify({
      version: 1,
      params: defaultRamp,
      notes: 'Engineering fixture: preserve separate ramp draft',
    }),
  );
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
describe('J98 independent supplement routes', () => {
  for (const s of sets)
    it(
      s.unit +
        ': reviews two independent cards without inheriting old checked answers',
      () => {
        const p = emptyProgress(),
          fixture = {
            ...newSession(),
            note: 'Engineering fixture: preserve old work',
            answers: {
              [s.unit + '-MAINT-INTEGRATION-AUDIT-Q1']: {
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
          s.unit + '-MAINT-INTEGRATION-AUDIT',
          'H01-MAINT-FUNCTION-MEANING',
          'H03-MAINT-ROOT-QUAD',
          'J97-CHECK',
          s.unit + '-CHECK',
          'J98-CHECK',
          'P51-MAINT',
        ];
        for (const key of protectedIds)
          p.sessions[key] = structuredClone(fixture);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
        for (const [i, q] of s.questions.entries()) {
          const view = mount(maintenanceHref(s, q.id));
          expect(screen.getByText(q.stem.en)).toBeTruthy();
          expect(
            (
              screen.getByRole('textbox', {
                name: 'Your reasoning',
              }) as HTMLTextAreaElement
            ).value,
          ).toBe('');
          expect(saved().sessions[s.id].answers[q.id]).toBeUndefined();
          expect(
            screen.getByText(new RegExp('Recorded ' + i + '/2')),
          ).toBeTruthy();
          expect(
            screen
              .getByRole('link', { name: /Revisit J98 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/' + s.bridgeByQuestion[q.id] + '?step=1');
          fireEvent.change(
            screen.getByRole('textbox', { name: 'Your reasoning' }),
            {
              target: { value: 'Engineering review fixture: ' + q.solution.en },
            },
          );
          expect(saved().sessions[s.id].answers[q.id].checked).toBe(false);
          if (i === 1)
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
            screen.getByText(new RegExp('Recorded ' + (i + 1) + '/2')),
          ).toBeTruthy();
          for (const key of protectedIds)
            expect(saved().sessions[key]).toEqual(fixture);
          expect(JSON.parse(localStorage.getItem(RAMP_DRAFT_KEY)!).notes).toBe(
            'Engineering fixture: preserve separate ramp draft',
          );
          view.unmount();
        }
        mount(maintenanceHref(s));
        expect(
          screen.getByText(/Recorded 2\/2; 1 independently completed/),
        ).toBeTruthy();
        expect(
          (
            screen.getByRole('textbox', {
              name: 'Your reasoning',
            }) as HTMLTextAreaElement
          ).value,
        ).toBe('Engineering review fixture: ' + s.questions[1]!.solution.en);
        expect(saved().sessions[s.id].completedAt).toBeUndefined();
        for (let n = 1; n <= 5; n++)
          expect(saved().sessions['J98-L0' + n]).toBeUndefined();
      },
    );
  it('renders all four bilingual tables with blank explanations and closed references', () => {
    localStorage.setItem('study-language', 'bilingual');
    for (const s of sets)
      for (const q of s.questions) {
        const view = mount(maintenanceHref(s, q.id));
        expect(screen.getByText(q.stem.zh)).toBeTruthy();
        expect(screen.getByText(q.stem.en)).toBeTruthy();
        expect(screen.getAllByRole('row')).toHaveLength(
          q.contextTable!.rows.length + 1,
        );
        for (const [i, row] of q.contextTable!.rows.entries())
          expect(screen.getAllByRole('rowheader')[i]!.textContent).toBe(
            row[0]!.en,
          );
        expect(screen.getByText(q.solution.en).closest('details')?.open).toBe(
          false,
        );
        expect(
          (
            screen.getByRole('textbox', {
              name: '我的解释',
            }) as HTMLTextAreaElement
          ).value,
        ).toBe('');
        expect(screen.getByText(/Recorded 0\/2/)).toBeTruthy();
        view.unmount();
      }
  });
  it('opens shared cards from L01/L03/L04/L05 and preserves every original task', () => {
    for (const [lesson, n] of [
      [1, 1],
      [3, 1],
      [4, 1],
      [5, 2],
    ] as const)
      for (const set of sets) {
        const view = mount('/math/lesson/J98-L0' + lesson);
        fireEvent.click(screen.getByText('A small guide for parents'));
        const links = screen.getAllByRole('link');
        const old =
          lesson === 1
            ? ['H05-MAINT-CONG-MOTION-Q8', 'H06-MAINT-CONG-MOTION-Q8']
            : lesson === 5
              ? [
                  'H22-MAINT-SIM-CIRCLE-TRIG-Q10',
                  'H23-MAINT-SIM-CIRCLE-TRIG-Q10',
                ]
              : [
                  `H28-MAINT-INTEGRATION-AUDIT-Q${lesson === 3 ? 2 : 3}`,
                  `H38-MAINT-INTEGRATION-AUDIT-Q${lesson === 3 ? 2 : 3}`,
                ];
        if (lesson === 1)
          for (const unit of ['H28', 'H38'])
            expect(
              links.some((l) =>
                l
                  .getAttribute('href')
                  ?.includes(
                    'question=' + unit + '-MAINT-INTEGRATION-AUDIT-Q2',
                  ),
              ),
            ).toBe(true);
        for (const id of old)
          expect(
            links.some((l) =>
              l.getAttribute('href')?.includes('question=' + id),
            ),
          ).toBe(true);
        fireEvent.click(
          links.find(
            (l) =>
              l.getAttribute('href') ===
              maintenanceHref(set, set.questions[n - 1]!.id),
          )!,
        );
        expect(screen.getByText(set.questions[n - 1]!.stem.en)).toBeTruthy();
        expect(saved().sessions['J98-L0' + lesson]).toBeUndefined();
        view.unmount();
      }
  });
  it('opens exact reused affine, precision, grade and journey cards without replacing their original primary bridges', () => {
    const cases = [
      ...['H01', 'H02'].map((u) => [
        2,
        u + '-MAINT-FUNCTION-MEANING-Q2',
        'J85-L06',
      ]),
      ...['H03', 'H04'].map((u) => [4, u + '-MAINT-ROOT-QUAD-Q3', 'J91-L05']),
      ...['H22', 'H23'].map((u) => [
        4,
        u + '-MAINT-SIM-CIRCLE-TRIG-Q10',
        'J96-L05',
      ]),
      ...['H28', 'H38'].map((u) => [
        4,
        u + '-MAINT-INTEGRATION-AUDIT-Q2',
        'J98-L03',
      ]),
    ] as [number, string, string][];
    for (const [l, id, bridge] of cases) {
      const view = mount('/math/lesson/J98-L0' + l);
      fireEvent.click(screen.getByText('A small guide for parents'));
      const set = Object.values(maintenanceSets).find((s) =>
        s.questions.some((q) => q.id === id),
      )!;
      fireEvent.click(
        screen
          .getAllByRole('link')
          .find((a) => a.getAttribute('href') === maintenanceHref(set, id))!,
      );
      expect(
        screen
          .getByRole('link', { name: /Revisit .* foundation models/ })
          .getAttribute('href'),
      ).toBe('/math/lesson/' + bridge + '?step=1');
      expect(
        (
          screen.getByRole('textbox', {
            name: 'Your reasoning',
          }) as HTMLTextAreaElement
        ).value,
      ).toBe('');
      expect(saved().sessions['J98-L0' + l]).toBeUndefined();
      view.unmount();
    }
  });
});
