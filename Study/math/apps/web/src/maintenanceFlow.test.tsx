// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { maintenanceSets } from './content/maintenance';
import { Question } from './Question';
import { NumberDiagramView } from './NumberVisuals';

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
const click = (name: string | RegExp) =>
  fireEvent.click(screen.getByRole('button', { name }));
const enter = (name: string, input: string) =>
  fireEvent.change(screen.getByRole('textbox', { name }), {
    target: { value: input },
  });
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );

describe('later-unit retrieval through real app routes', () => {
  it('does not print the requested coordinate on either retrieval diagram, while preserving default axis labels', () => {
    for (const set of Object.values(maintenanceSets)) {
      const q = set.questions[2]!;
      const diagram = q.diagram!;
      if (diagram.kind !== 'axis')
        throw new Error('Expected a number-line task');
      for (const mode of ['zh', 'en', 'bilingual'] as const) {
        const view = render(
          <Question question={q} mode={mode} onChange={() => {}} />,
        );
        const figure = screen.getByRole('img');
        expect(
          [...figure.querySelectorAll('text')].map((text) => text.textContent),
        ).toEqual([String(diagram.start), String(diagram.end), 'P']);
        expect(figure.getAttribute('aria-label')).not.toContain(
          String(diagram.point),
        );
        expect(figure.querySelectorAll('g path')).toHaveLength(
          diagram.divisions + 1,
        );
        view.unmount();
      }
      const legacy = render(
        <NumberDiagramView
          diagram={{ ...diagram, labelMode: undefined }}
          mode="en"
        />,
      );
      expect(
        [...screen.getByRole('img').querySelectorAll('text')].map(
          (text) => text.textContent,
        ),
      ).toContain(String(diagram.point));
      legacy.unmount();
    }
  });
  for (const [unit, firstCheck, answers, reports] of [
    [
      'B03',
      '701',
      ['40806', '600', '480'],
      [
        'Engineering review example: The original 4499 is 499 from 4000 and 501 from 5000, so nearest thousand is 4000. First rounding to hundreds produces 4500, a midpoint, then 5000. Round the original directly; the estimate does not prove an exact total.',
        'Engineering review example: Exchange one hundred into ten tens, then one ten into ten ones: 300+90+13=403. Keeping ten tens too would give 413. Subtracting 178 gives 200+20+5=225; 225+178=403. Regrouping preserves value.',
      ],
    ],
    [
      'B05',
      '8',
      ['60070', '1000', '450'],
      [
        'Engineering review example: 7849 is 49 from 7800 and 51 from 7900, so its nearest hundred is 7800. That count would leave 49 people without tickets. Exact one-per-person supply needs at least 7849; buying in hundreds would require 7900, a different constraint.',
        'Engineering review example: Four hundreds plus twelve tens plus six ones represents 526. Exchanging ten tens for one hundred leaves five hundreds, two tens and six ones, still 526. There were 22 cards and now 13; card count is not their represented value.',
      ],
    ],
  ] as const) {
    it(`${unit}: preserves unit-check work, requires human arguments and restores its own session`, () => {
      const view = mount(`/math/unit/${unit}/check`);
      enter('Your answer', firstCheck);
      click(/Check answer/);
      expect(screen.getByText(/Recorded 1\/8/)).toBeTruthy();
      fireEvent.click(
        screen.getByRole('link', {
          name: /Open five cross-unit retrieval tasks/,
        }),
      );
      expect(screen.getByText(/Recorded 0\/5/)).toBeTruthy();
      answers.forEach((answer, i) => {
        click(`Question ${i + 1}`);
        expect(
          screen
            .getByRole('link', { name: /Revisit B01 number models/ })
            .getAttribute('href'),
        ).toBe(`/math/lesson/B01-L0${i + 1}?step=1`);
        if (i === 1) click('A little hint');
        enter('Your answer', answer);
        click(/Check answer/);
      });
      expect(screen.getByText(/Recorded 3\/5/)).toBeTruthy();
      reports.forEach((report, i) => {
        click(`Question ${i + 4}`);
        expect(
          screen
            .getByRole('link', { name: /Revisit B01 number models/ })
            .getAttribute('href'),
        ).toBe(`/math/lesson/B01-L0${i + 4}?step=1`);
        enter('Your reasoning', report);
        expect(
          screen.getByText(new RegExp(`Recorded ${i + 3}/5`)),
        ).toBeTruthy();
        fireEvent.click(
          screen.getByText('Parent review · look at the reasoning'),
        );
        click('Parent confirms: reasoning makes sense');
      });
      expect(screen.getByText(/Recorded 5\/5/)).toBeTruthy();
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      expect(
        saved.sessions[`${unit}-CHECK`].answers[`${unit}-CHECK-Q1`].input,
      ).toBe(firstCheck);
      expect(
        saved.sessions[`${unit}-MAINT-B01`].answers[`${unit}-MAINT-B01-Q2`]
          .independent,
      ).toBe(false);
      expect(saved.sessions['B01-L01']).toBeUndefined();
      expect(saved.sessions['B01-CHECK']).toBeUndefined();
      view.unmount();
      mount(`/math/unit/${unit}/maintenance`);
      expect(screen.getByText(/Recorded 5\/5/)).toBeTruthy();
      expect(
        (
          screen.getByRole('textbox', {
            name: 'Your reasoning',
          }) as HTMLTextAreaElement
        ).value,
      ).toBe(reports[1]);
      fireEvent.click(screen.getByRole('link', { name: /Open unit review/ }));
      expect(screen.getByText(/Recorded 1\/8/)).toBeTruthy();
    });
  }
  it.each(['H38', 'constructor', '__proto__'])(
    'shows a clear fallback for unauthored maintenance %s, without making a session',
    (unit) => {
      mount(`/math/unit/${unit}/maintenance`);
      expect(
        screen.getByText(
          'Cross-unit retrieval for this unit is being prepared.',
        ),
      ).toBeTruthy();
      expect(screen.queryByRole('textbox')).toBeNull();
      expect(
        Object.keys(JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions),
      ).toHaveLength(0);
    },
  );
});
