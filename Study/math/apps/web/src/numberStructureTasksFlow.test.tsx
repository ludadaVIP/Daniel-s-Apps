// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { maintenanceSets, maintenanceHref } from './content/maintenance';
import { NumberDiagramView } from './NumberVisuals';
vi.setConfig({ testTimeout: 60000 });
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
const sets = [maintenanceSets.B03, maintenanceSets.B05];
describe('later number-structure subskill learning', () => {
  for (const s of sets)
    it(
      s.unit +
        ': preserves the already-reviewed original five, separately reviews four new tasks and restores question nine',
      () => {
        const p = emptyProgress(),
          oldAnswers = Object.fromEntries(
            s.questions.slice(0, 5).map((q) => [
              q.id,
              {
                input: 'Engineering prior-version fixture: ' + q.solution.en,
                tries: 0,
                hints: 0,
                correct: true,
                checked: true,
                independent: true,
              },
            ]),
          );
        const oldCheck = {
            ...newSession(),
            practiceIndex: 2,
            note: 'Preserve original formal check',
          },
          other = sets.find((x) => x.unit !== s.unit)!;
        p.sessions[s.id] = {
          ...newSession(),
          practiceIndex: 4,
          answers: oldAnswers,
          note: 'Keep earlier five-task work',
        };
        p.sessions[s.unit + '-CHECK'] = oldCheck;
        p.sessions[other.id] = {
          ...newSession(),
          practiceIndex: 1,
          note: 'Preserve other unit',
        };
        const otherBefore = p.sessions[other.id];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
        const initial = mount(maintenanceHref(s));
        expect(screen.getByText(/Recorded 5\/9/)).toBeTruthy();
        expect(saved().sessions[s.id].answers).toEqual(oldAnswers);
        for (const q of s.questions.slice(5))
          expect(saved().sessions[s.id].answers[q.id]).toBeUndefined();
        initial.unmount();
        for (const [index, q] of s.questions.slice(5).entries()) {
          const view = mount(maintenanceHref(s, q.id));
          expect(screen.getByText(q.stem.en)).toBeTruthy();
          expect(screen.getByText(s.intro.en)).toBeTruthy();
          expect(
            screen
              .getByRole('link', { name: /Revisit B01 number models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/' + s.bridgeByQuestion[q.id] + '?step=1');
          fireEvent.change(
            screen.getByRole('textbox', { name: 'Your reasoning' }),
            {
              target: {
                value: 'Engineering reviewed example: ' + q.solution.en,
              },
            },
          );
          expect(
            screen.getByText(new RegExp('Recorded ' + (5 + index) + '/9')),
          ).toBeTruthy();
          if (index === 1)
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
            screen.getByText(new RegExp('Recorded ' + (6 + index) + '/9')),
          ).toBeTruthy();
          for (const old of s.questions.slice(0, 5))
            expect(saved().sessions[s.id].answers[old.id]).toEqual(
              oldAnswers[old.id],
            );
          expect(saved().sessions[s.unit + '-CHECK']).toEqual(oldCheck);
          expect(saved().sessions[other.id]).toEqual(otherBefore);
          view.unmount();
        }
        mount(maintenanceHref(s));
        expect(
          screen.getByText(/Recorded 9\/9; 8 independently completed/),
        ).toBeTruthy();
        expect(saved().sessions[s.id].practiceIndex).toBe(8);
        expect(
          (
            screen.getByRole('textbox', {
              name: 'Your reasoning',
            }) as HTMLTextAreaElement
          ).value,
        ).toContain(s.questions[8]!.solution.en);
        expect(saved().sessions[s.id].note).toBe('Keep earlier five-task work');
        expect(saved().sessions[s.id].completedAt).toBeUndefined();
        for (let i = 1; i <= 5; i++)
          expect(saved().sessions['B01-L0' + i]).toBeUndefined();
        fireEvent.click(screen.getByRole('link', { name: /Open unit review/ }));
        expect(saved().sessions[s.unit + '-CHECK']).toEqual(oldCheck);
      },
    );
  it('shows only the original P diagram and complete two-window givens in all language modes without the requested coordinate label', () => {
    for (const s of sets)
      for (const mode of ['zh', 'en', 'bilingual']) {
        localStorage.clear();
        localStorage.setItem('study-language', mode);
        const q = s.questions[6]!,
          d = q.diagram!;
        if (d.kind !== 'axis')
          throw Error('Original number-line diagram needed');
        const view = mount(maintenanceHref(s, q.id));
        const img = screen.getByRole('img'),
          labels = [...img.querySelectorAll('text')].map((e) => e.textContent);
        expect(labels).toEqual([String(d.start), String(d.end), 'P']);
        expect(img.getAttribute('aria-label')).not.toContain(String(d.point));
        expect(screen.getAllByRole('row')).toHaveLength(3);
        expect(
          screen.getAllByRole('rowheader').map((e) => e.textContent),
        ).toEqual(['A', 'B']);
        expect(img.querySelectorAll('g path')).toHaveLength(21);
        expect(screen.queryByText(/100 per interval|每格 100/)).toBeNull();
        if (mode !== 'zh')
          expect(screen.getByText(q.contextTable!.caption.en)).toBeTruthy();
        if (mode !== 'en')
          expect(screen.getByText(q.contextTable!.caption.zh)).toBeTruthy();
        expect(saved().sessions[s.id].answers[q.id]).toBeUndefined();
        expect(
          screen
            .getByText(mode === 'zh' ? q.solution.zh : q.solution.en)
            .closest('details')?.open,
        ).toBe(false);
        view.unmount();
        if (mode === 'en') {
          const legacy = render(
            <NumberDiagramView
              diagram={{ ...d, showIntervalValue: undefined }}
              mode="en"
            />,
          );
          expect(screen.getByText('100 per interval')).toBeTruthy();
          legacy.unmount();
        }
      }
  });
  it('opens each new subskill directly from both appropriate B01 parent cards without changing source mastery', () => {
    for (const source of [
      'B01-L01',
      'B01-L02',
      'B01-L03',
      'B01-L04',
      'B01-L05',
    ]) {
      const qIndex =
        source.endsWith('01') || source.endsWith('02')
          ? 5
          : source.endsWith('03')
            ? 6
            : source.endsWith('04')
              ? 7
              : 8;
      for (const s of sets) {
        const view = mount('/math/lesson/' + source);
        fireEvent.click(screen.getByText('A small guide for parents'));
        const href = maintenanceHref(s, s.questions[qIndex]!.id);
        const link = screen
          .getAllByRole('link')
          .find((a) => a.getAttribute('href') === href)!;
        expect(link).toBeDefined();
        fireEvent.click(link);
        expect(screen.getByText(s.questions[qIndex]!.stem.en)).toBeTruthy();
        expect(saved().sessions[source]).toBeUndefined();
        view.unmount();
      }
    }
  });
});
