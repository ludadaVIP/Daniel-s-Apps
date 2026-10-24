// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { emptyProgress, newSession } from './model';
import { postRouteUnits } from './content/retrievalUnits';
import { postRouteExtensionRetrieval } from './content/postRouteExtensionRetrieval';
import { postRouteCapstoneRetrieval } from './content/postRouteCapstoneRetrieval';
import { maintenanceHref } from './content/maintenance';
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
const sets = [
  ...Object.values(postRouteExtensionRetrieval),
  ...Object.values(postRouteCapstoneRetrieval),
];
const groupLink = (title: string) =>
  screen
    .getAllByRole('link')
    .find((link) => link.textContent?.startsWith(title))!;
describe('actual post-capstone retrieval learning routes', () => {
  it('discovers two real units and all four groups from Home and Path without manufacturing formal lessons', () => {
    for (const path of ['/math', '/math/path']) {
      const view = mount(path);
      const entry = screen.getByRole('link', {
        name: /Open later retrieval units/,
      });
      expect(entry.getAttribute('href')).toBe('/math/retrieval');
      fireEvent.click(entry);
      for (const unit of postRouteUnits)
        expect(
          screen.getByRole('heading', {
            name: unit.id + ' · ' + unit.title.en,
          }),
        ).toBeTruthy();
      expect(screen.getAllByText(/5 tasks · reviewed 0\/5/)).toHaveLength(4);
      for (const s of sets)
        expect(groupLink(s.title.en).getAttribute('href')).toBe(
          maintenanceHref(s),
        );
      expect(Object.keys(saved().sessions)).toHaveLength(0);
      view.unmount();
    }
  });
  for (const s of sets)
    it(
      s.id +
        ': opens exact tasks, explicitly reviews each and restores only this group',
      () => {
        const p = emptyProgress();
        const original = {
          ...newSession(),
          practiceIndex: 2,
          note: 'Engineering fixture: preserve source learning',
        };
        p.sessions['H37-CHECK'] = original;
        p.sessions['H38-CHECK'] = original;
        const other = sets.find((x) => x.unit === s.unit && x.id !== s.id)!;
        p.sessions[other.id] = {
          ...newSession(),
          practiceIndex: 1,
          note: 'Keep sibling reasoning',
        };
        const sibling = p.sessions[other.id];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
        for (const [i, q] of s.questions.entries()) {
          const view = mount(maintenanceHref(s, q.id));
          expect(screen.getByText(q.stem.en)).toBeTruthy();
          expect(screen.getByText(s.intro.en)).toBeTruthy();
          expect(
            screen.queryByRole('link', { name: /Open unit review/ }),
          ).toBeNull();
          expect(
            screen
              .getByRole('link', { name: /Back to later retrieval/ })
              .getAttribute('href'),
          ).toBe('/math/retrieval');
          expect(
            screen
              .getByRole('link', { name: /Revisit .* foundation models/ })
              .getAttribute('href'),
          ).toBe('/math/lesson/' + s.bridgeByQuestion[q.id] + '?step=1');
          const route = screen.getByLabelText('Current route').textContent!;
          expect(
            new URL(route, 'http://localhost').searchParams.get('question'),
          ).toBeNull();
          expect(
            new URL(route, 'http://localhost').searchParams.get('set'),
          ).toBe(s.id);
          fireEvent.change(
            screen.getByRole('textbox', { name: 'Your reasoning' }),
            {
              target: { value: 'Engineering review fixture: ' + q.solution.en },
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
          expect(saved().sessions['H37-CHECK']).toEqual(original);
          expect(saved().sessions['H38-CHECK']).toEqual(original);
          expect(saved().sessions[other.id]).toEqual(sibling);
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
        expect(saved().sessions[s.unit + '-CHECK']).toBeUndefined();
        expect(saved().sessions[s.id].completedAt).toBeUndefined();
        for (const source of Object.values(s.bridgeByQuestion))
          expect(saved().sessions[source]).toBeUndefined();
        fireEvent.click(
          screen.getByRole('link', { name: /Back to later retrieval/ }),
        );
        expect(groupLink(s.title.en).textContent).toContain(
          '5 tasks · reviewed 5/5',
        );
        expect(screen.getAllByText(/5 tasks · reviewed 0\/5/)).toHaveLength(3);
      },
    );
  it('keeps complete bilingual givens and single actual tables/plots on all twenty tasks without exposing a solution', () => {
    localStorage.setItem('study-language', 'bilingual');
    for (const s of sets)
      for (const q of s.questions) {
        const view = mount(maintenanceHref(s, q.id));
        expect(screen.getByText(q.stem.en)).toBeTruthy();
        expect(screen.getByText(q.stem.zh)).toBeTruthy();
        expect(screen.getByText(q.solution.en).closest('details')?.open).toBe(
          false,
        );
        expect(screen.getByText(/Recorded 0\/5/)).toBeTruthy();
        if (q.contextTable) {
          const table = screen.getByRole('table');
          expect(within(table).getAllByRole('row')).toHaveLength(
            q.contextTable.rows.length + 1,
          );
          expect(screen.getByText(q.contextTable.caption.en)).toBeTruthy();
        } else expect(screen.queryByRole('table')).toBeNull();
        if (q.diagram?.kind === 'cartesian') {
          const img = screen.getByRole('img');
          expect(img.querySelectorAll('polyline')).toHaveLength(1);
          expect(img.querySelectorAll('circle')).toHaveLength(2);
          expect(screen.getByText(q.diagram.caption!.en)).toBeTruthy();
        }
        expect(saved().sessions[s.id].answers[q.id]).toBeUndefined();
        view.unmount();
      }
  });
  it('keeps R units maintenance-only and rejects unknown owners or foreign group IDs', () => {
    for (const unit of postRouteUnits) {
      const view = mount('/math/unit/' + unit.id + '/check');
      expect(
        screen.getByText('This unit contains later retrieval.'),
      ).toBeTruthy();
      fireEvent.click(
        screen.getByRole('link', { name: 'Open this retrieval unit' }),
      );
      expect(
        screen.getByText(
          sets.find((s) => s.unit === unit.id)!.questions[0]!.stem.en,
        ),
      ).toBeTruthy();
      expect(
        screen.queryByRole('link', { name: /Open unit review/ }),
      ).toBeNull();
      view.unmount();
    }
    for (const path of [
      '/math/unit/R99/maintenance',
      '/math/unit/R01/maintenance?set=R02-MAINT-PROJECT',
      '/math/unit/R02/maintenance?set=__proto__',
    ]) {
      const view = mount(path);
      expect(
        screen.getByText(
          'Cross-unit retrieval for this unit is being prepared.',
        ),
      ).toBeTruthy();
      expect(screen.queryByRole('textbox')).toBeNull();
      view.unmount();
    }
    expect(
      Object.keys(saved().sessions).every((id) =>
        sets.some((s) => s.id === id),
      ),
    ).toBe(true);
  });
});
