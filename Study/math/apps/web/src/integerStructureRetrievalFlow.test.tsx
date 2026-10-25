// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { integerStructureRetrieval } from './content/integerStructureRetrieval';
import {
  maintenanceSets,
  maintenanceForUnit,
  maintenanceHref,
} from './content/maintenance';
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
const Echo = () => {
  const l = useLocation();
  return <output aria-label="Current route">{l.pathname + l.search}</output>;
};
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Echo />
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const saved = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!);
const sets = Object.values(integerStructureRetrieval);
describe('P51 integer structures through real learning routes', () => {
  for (const s of sets)
    it(
      s.unit +
        ': reviews all five meanings and restores without overwriting source, original check or older retrieval',
      () => {
        const p = emptyProgress(),
          original = {
            ...newSession(),
            practiceIndex: 2,
            note: 'Engineering fixture: preserve original unit check',
          },
          source = {
            ...newSession(),
            practiceIndex: 1,
            note: 'Preserve P51 check',
          };
        const other = maintenanceForUnit(s.unit).find((g) => g.id !== s.id)!;
        const older = {
          ...newSession(),
          practiceIndex: other.questions.length - 1,
          note: 'Keep earlier two-task group',
          answers: {
            [other.questions.at(-1)!.id]: {
              input: 'Engineering earlier explanation',
              tries: 0,
              hints: 1,
              checked: true,
              correct: true,
              independent: false,
            },
          },
        };
        p.sessions[s.unit + '-CHECK'] = original;
        p.sessions['P51-CHECK'] = source;
        p.sessions[other.id] = older;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
        for (const [i, q] of s.questions.entries()) {
          const view = mount(maintenanceHref(s, q.id));
          expect(screen.getByText(q.stem.en)).toBeTruthy();
          expect(
            screen
              .getByRole('link', { name: /Revisit P51 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/P51-L0' + (i + 1) + '?step=1');
          expect(screen.getByText(s.intro.en)).toBeTruthy();
          expect(screen.getByLabelText('Current route').textContent).toBe(
            maintenanceHref(s),
          );
          fireEvent.change(
            screen.getByRole('textbox', { name: 'Your reasoning' }),
            {
              target: {
                value: 'Engineering reviewed reasoning: ' + q.solution.en,
              },
            },
          );
          expect(
            screen.getByText(new RegExp('Recorded ' + i + '/5')),
          ).toBeTruthy();
          if (i === 2)
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
          expect(saved().sessions[s.unit + '-CHECK']).toEqual(original);
          expect(saved().sessions['P51-CHECK']).toEqual(source);
          expect(saved().sessions[other.id]).toEqual(older);
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
        ).toContain(s.questions[4]!.solution.en);
        expect(saved().sessions[s.id].practiceIndex).toBe(4);
        expect(saved().sessions[s.id].completedAt).toBeUndefined();
        for (let i = 1; i <= 5; i++)
          expect(saved().sessions['P51-L0' + i]).toBeUndefined();
        if (other.questions.length === 2) {
          fireEvent.click(
            screen.getByRole('link', {
              name: other.title.en + ' (' + other.questions.length + ')',
            }),
          );
          expect(
            screen.getByText(
              new RegExp('Recorded 1/' + other.questions.length),
            ),
          ).toBeTruthy();
          expect(
            (
              screen.getByRole('textbox', {
                name: 'Your reasoning',
              }) as HTMLTextAreaElement
            ).value,
          ).toBe('Engineering earlier explanation');
          expect(
            saved().sessions[s.id].answers[s.questions[4]!.id].checked,
          ).toBe(true);
        } else {
          fireEvent.click(
            screen.getByRole('link', { name: /Open unit review/ }),
          );
          expect(saved().sessions[s.unit + '-CHECK']).toEqual(original);
        }
      },
    );
  it('renders complete original tables with one copy of every ID in bilingual mode while all explanations remain unreviewed', () => {
    localStorage.setItem('study-language', 'bilingual');
    for (const s of sets)
      for (const q of s.questions) {
        const view = mount(maintenanceHref(s, q.id));
        expect(screen.getByText(q.stem.zh)).toBeTruthy();
        expect(screen.getByText(q.stem.en)).toBeTruthy();
        expect(screen.getAllByRole('row')).toHaveLength(
          q.contextTable!.rows.length + 1,
        );
        const headers = screen.getAllByRole('rowheader');
        for (const [i, row] of q.contextTable!.rows.entries()) {
          const cell = row[0]!,
            value = headers[i]!.textContent;
          if (cell.zh === cell.en) expect(value).toBe(cell.en);
          else {
            expect(value).toContain(cell.zh);
            expect(value).toContain(cell.en);
          }
        }
        expect(screen.getByText(q.contextTable!.caption.zh)).toBeTruthy();
        expect(screen.getByText(q.contextTable!.caption.en)).toBeTruthy();
        expect(screen.getByText(q.solution.en).closest('details')?.open).toBe(
          false,
        );
        expect(screen.getByText(/Recorded 0\/5/)).toBeTruthy();
        expect(saved().sessions[s.id].answers[q.id]).toBeUndefined();
        view.unmount();
      }
  });
  it('opens exact new tasks from all five source parent cards without creating source mastery', () => {
    for (let i = 1; i <= 5; i++)
      for (const s of sets) {
        const source = 'P51-L0' + i,
          view = mount('/math/lesson/' + source);
        fireEvent.click(screen.getByText('A small guide for parents'));
        const q = s.questions[i - 1]!,
          link = screen
            .getAllByRole('link')
            .find((l) => l.getAttribute('href') === maintenanceHref(s, q.id))!;
        expect(link).toBeDefined();
        fireEvent.click(link);
        expect(screen.getByText(q.stem.en)).toBeTruthy();
        expect(saved().sessions[source]).toBeUndefined();
        expect(saved().sessions[s.id].completedAt).toBeUndefined();
        view.unmount();
      }
  });
  it('resolves a secondary P53 question without a set, retains its set after consuming the question and rejects a foreign group', () => {
    const s = integerStructureRetrieval.P53_INTEGER_STRUCTURE,
      q = s.questions[2]!;
    const view = mount('/math/unit/P53/maintenance?question=' + q.id);
    expect(screen.getByText(q.stem.en)).toBeTruthy();
    expect(screen.getByLabelText('Current route').textContent).toBe(
      maintenanceHref(s),
    );
    expect(saved().sessions[maintenanceSets.P53.id]).toBeUndefined();
    view.unmount();
    const restored = mount(maintenanceHref(s));
    expect(screen.getByText(q.stem.en)).toBeTruthy();
    restored.unmount();
    mount(
      '/math/unit/P53/maintenance?set=B06-MAINT-OPERATIONS&question=' + q.id,
    );
    expect(
      screen.getByText('Cross-unit retrieval for this unit is being prepared.'),
    ).toBeTruthy();
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(saved().sessions[maintenanceSets.P53.id]).toBeUndefined();
  });
  it('opens all five actual P51 hooks and the corresponding integer workshops through the shared dispatcher', () => {
    const controls = [
      ['button', 'I predicted; reveal the next step'],
      ['combobox', 'First rule'],
      ['slider', 'Positive integer to explore'],
      ['slider', 'Integer to classify'],
      ['slider', 'First positive integer a'],
    ];
    for (let i = 1; i <= 5; i++) {
      const hook = mount('/math/lesson/P51-L0' + i);
      expect(hook.container.querySelector('.math-number-hook')).not.toBeNull();
      hook.unmount();
      const explore = mount('/math/lesson/P51-L0' + i + '?step=1');
      expect(
        explore.container.querySelector('.math-integer-lab'),
      ).not.toBeNull();
      expect(
        screen.getByRole(controls[i - 1]![0]!, { name: controls[i - 1]![1]! }),
      ).toBeTruthy();
      expect(
        screen.queryByRole('combobox', { name: 'Horizontal variable' }),
      ).toBeNull();
      explore.unmount();
    }
  });
});
