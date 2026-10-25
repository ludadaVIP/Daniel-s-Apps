// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { operationMeaningRetrieval } from './content/operationMeaningRetrieval';
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
const sets = Object.values(operationMeaningRetrieval);
describe('B02 later-unit meanings through real learning routes', () => {
  for (const s of sets)
    it(
      s.unit +
        ': separately reviews all five meanings and restores without overwriting source, original check or older retrieval',
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
            note: 'Preserve B02 check',
          };
        const other =
          maintenanceForUnit(s.unit).find((g) => g.id !== s.id) ??
          maintenanceSets.B03;
        const older = {
          ...newSession(),
          practiceIndex: 8,
          note: 'Keep earlier nine-task group',
          answers: {
            [other.questions[8]!.id]: {
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
        p.sessions['B02-CHECK'] = source;
        p.sessions[other.id] = older;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
        for (const [i, q] of s.questions.entries()) {
          const view = mount(maintenanceHref(s, q.id));
          expect(screen.getByText(q.stem.en)).toBeTruthy();
          expect(
            screen
              .getByRole('link', { name: /Revisit B02 foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/B02-L0' + (i + 1) + '?step=1');
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
          expect(saved().sessions['B02-CHECK']).toEqual(source);
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
          expect(saved().sessions['B02-L0' + i]).toBeUndefined();
        if (s.unit === 'P51') {
          fireEvent.click(
            screen.getByRole('link', { name: other.title.en + ' (9)' }),
          );
          expect(screen.getByText(/Recorded 1\/9/)).toBeTruthy();
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
        expect(
          screen.getAllByRole('rowheader').map((e) => e.textContent),
        ).toEqual(q.contextTable!.rows.map((r) => r[0]!.en));
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
        const source = 'B02-L0' + i,
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
  it('resolves a secondary P51 question without a set, retains its set after consuming the question and rejects a foreign group', () => {
    const s = operationMeaningRetrieval.P51_OPERATIONS,
      q = s.questions[2]!;
    const view = mount('/math/unit/P51/maintenance?question=' + q.id);
    expect(screen.getByText(q.stem.en)).toBeTruthy();
    expect(screen.getByLabelText('Current route').textContent).toBe(
      maintenanceHref(s),
    );
    expect(saved().sessions[maintenanceSets.P51.id]).toBeUndefined();
    view.unmount();
    const restored = mount(maintenanceHref(s));
    expect(screen.getByText(q.stem.en)).toBeTruthy();
    restored.unmount();
    mount(
      '/math/unit/P51/maintenance?set=B06-MAINT-OPERATIONS&question=' + q.id,
    );
    expect(
      screen.getByText('Cross-unit retrieval for this unit is being prepared.'),
    ).toBeTruthy();
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(saved().sessions[maintenanceSets.P51.id]).toBeUndefined();
  });
});
