// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import {
  StatisticalInferenceLab,
  StatisticalInferenceHookArt,
} from './StatisticalInferenceLabs';
import { h34Lessons } from './content/H34';
import { App } from './App';
import { STORAGE_KEY } from './progress';
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
const enter = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name }), {
    target: { value },
  });
const select = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const field = (name: string) =>
  (screen.getByRole('textbox', { name }) as HTMLInputElement).value;
const check = (name: string) => click(`Check: ${name}`);
const matched = (name: string) =>
  expect(
    screen.getByRole('status', { name: `${name} feedback` }).textContent,
  ).toContain('matches');
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const parent = () => {
  fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
  click('Parent confirms: reasoning makes sense');
};
describe('H34 inference investigations and preserved evidence', () => {
  it('distinguishes selected-sample error from target truth and the sampling frame', () => {
    const v = render(
      <StatisticalInferenceLab kind="stat-inference-population" mode="en" />,
    );
    enter('Target population mean', '3');
    enter('Selected sample mean', '0');
    enter('Signed sampling error', '-3');
    check('Signed sampling error');
    matched('Signed sampling error');
    select('Selected sample IDs', '2');
    expect(field('Target population mean')).toBe('3');
    expect(field('Selected sample mean')).toBe('');
    enter('Selected sample mean', '3');
    check('Selected sample mean');
    matched('Selected sample mean');
    select('Sampling frame', 'near');
    select('Sample size n', '3');
    expect(field('Target population mean')).toBe('3');
    expect([
      ...v.container.querySelectorAll('[data-in-frame="false"]'),
    ]).toHaveLength(3);
    click('Show/hide audit');
    expect(screen.getByText('Design expectation / bias')).toBeTruthy();
  });
  it('preserves theoretical predictions when repetitions or the seed change and rebuilds changed designs', () => {
    render(
      <StatisticalInferenceLab kind="stat-inference-sampling" mode="en" />,
    );
    const mean = 'Predict expected sample mean',
      variance = 'Predict sampling variance',
      se = 'Predict standard error (sqrt supported)';
    enter(mean, '3');
    enter(variance, '18/5');
    enter(se, '3sqrt(10)/5');
    check(se);
    matched(se);
    expect(screen.getByText(/average of means undefined/)).toBeTruthy();
    click('Draw ten more samples');
    select('Pseudorandom seed', '1234');
    expect(field(mean)).toBe('3');
    expect(field(variance)).toBe('18/5');
    select('Sample size n', '3');
    expect(field(mean)).toBe('3');
    expect(field(variance)).toBe('');
    select('Sampling frame', 'near');
    enter(mean, '0');
    check(mean);
    matched(mean);
    click('Show/hide audit');
    expect(screen.getByText('3 / -3')).toBeTruthy();
  });
  it('keeps interval construction separate from revealed truth and records n raw observations per group', () => {
    const v = render(
        <StatisticalInferenceLab kind="stat-inference-confidence" mode="en" />,
      ),
      se = 'Predict standard error',
      ci = 'Construct the closed confidence interval [a,b]';
    enter(se, '1');
    enter(ci, '[8,12]');
    check(ci);
    matched(ci);
    select('Demonstration fixed true μ', '20');
    expect(field(ci)).toBe('[8,12]');
    expect(field(se)).toBe('1');
    click('Construct ten more intervals');
    expect(v.container.querySelectorAll('[data-interval-round]')).toHaveLength(
      10,
    );
    click('Show/hide audit');
    expect(
      screen
        .getByRole('region', {
          name: 'First raw sample (display values approximate)',
        })
        .querySelectorAll('tbody tr'),
    ).toHaveLength(16);
    expect(
      screen
        .getByRole('region', { name: 'All repeated intervals audit' })
        .querySelectorAll('tbody tr'),
    ).toHaveLength(10);
    select('Prespecified critical z*', '1.96');
    expect(field(se)).toBe('1');
    expect(field(ci)).toBe('');
    expect(v.container.querySelectorAll('[data-interval-round]')).toHaveLength(
      0,
    );
  });
  it('keeps p independent of alpha, changes prespecified tails and blocks post-hoc procedure interpretations', () => {
    const v = render(
        <StatisticalInferenceLab kind="stat-inference-test" mode="en" />,
      ),
      p = 'Predict exact p-value',
      d = 'Decide reject or do-not-reject';
    enter(p, '1/16');
    enter(d, 'reject');
    check(d);
    matched(d);
    select('Prespecified α', '1/5');
    expect(field(p)).toBe('1/16');
    expect(field(d)).toBe('reject');
    select('Planned alternative', 'two-sided');
    enter(p, '1/8');
    check(p);
    matched(p);
    select('Prespecified α', '1/10');
    expect(field(p)).toBe('1/8');
    expect(field(d)).toBe('');
    enter(d, 'do-not-reject');
    check(d);
    matched(d);
    expect(
      [...v.container.querySelectorAll('[data-extreme="true"]')].map((e) =>
        e.getAttribute('data-null-count'),
      ),
    ).toEqual(['0', '4']);
    select('Analysis plan', 'peek');
    expect(screen.queryByRole('textbox', { name: p })).toBeNull();
    enter('Assess procedure conditions', 'not-justified');
    check('Assess procedure conditions');
    matched('Assess procedure conditions');
  });
  it('preserves significance while practical thresholds and effect sizes alter the interpretation', () => {
    const v = render(
        <StatisticalInferenceLab kind="stat-inference-importance" mode="en" />,
      ),
      d = 'Test decision against zero',
      m = 'Compare the interval with the practical target';
    enter(d, 'reject');
    enter(m, 'below-target');
    check(m);
    matched(m);
    click('Toggle single/all comparisons');
    expect(v.container.querySelectorAll('[data-evidence-case]')).toHaveLength(
      5,
    );
    expect(field(m)).toBe('below-target');
    select('Prespecified improvement target Δ (min)', '3/2');
    select('Evidence scenario', 'largePrecise');
    expect(field(d)).toBe('reject');
    expect(field(m)).toBe('');
    enter(m, 'uncertain');
    check(m);
    matched(m);
    select('Prespecified improvement target Δ (min)', '1');
    enter(m, 'meets-target');
    check(m);
    matched(m);
    select('Evidence scenario', 'harmful');
    click('Show/hide audit');
    expect(screen.getByText(/potentially indicating harm/)).toBeTruthy();
  });
  it('renders five meaningful hooks and both examples on every actual reading route', () => {
    for (const l of h34Lessons) {
      const art = render(
        <StatisticalInferenceHookArt
          kind={
            l.lab as Parameters<typeof StatisticalInferenceHookArt>[0]['kind']
          }
          mode="bilingual"
        />,
      );
      expect(art.container.querySelector('svg')).toBeTruthy();
      if (l.id === 'H34-L02')
        expect(
          [...art.container.querySelectorAll('[data-mass]')].map((e) =>
            e.getAttribute('data-mass'),
          ),
        ).toEqual(['1/5', '3/5', '1/5']);
      if (l.id === 'H34-L03') {
        const intervals = art.container.querySelectorAll(
          '[data-interval-round]',
        );
        expect(intervals).toHaveLength(10);
        intervals.forEach((e) =>
          expect(
            Number(e.getAttribute('data-upper')) -
              Number(e.getAttribute('data-lower')),
          ).toBeCloseTo(3.92, 10),
        );
      }
      if (l.id === 'H34-L04')
        expect(
          [...art.container.querySelectorAll('[data-null-count]')]
            .filter((e) => e.getAttribute('data-extreme') === 'true')
            .map((e) => e.getAttribute('data-null-count')),
        ).toEqual(['4']);
      art.unmount();
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 Understand/);
      expect(v.container.textContent).toContain('Example 1');
      expect(v.container.textContent).toContain('Example 2');
      v.unmount();
    }
  });
  it('restores five supported guided answers without completing unfinished lessons', () => {
    for (const [id, answer] of [
      ['H34-L01', '-3'],
      ['H34-L02', '3'],
      ['H34-L03', '[8,12]'],
      ['H34-L04', '1/16'],
      ['H34-L05', 'below-target'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/^04 Together/);
      enter('Your answer', '999');
      click(/Check answer/);
      enter('Your answer', answer!);
      click(/Check answer/);
      expect(
        screen.getByText(
          '✓ Completed with support. Your understanding is growing.',
        ),
      ).toBeTruthy();
      v.unmount();
      const w = mount(`/math/lesson/${id}`);
      expect(field('Your answer')).toBe(answer);
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id!]
          .completedAt,
      ).toBeUndefined();
      w.unmount();
    }
  });
  it('restores original confidence reasoning only after explicit human review', () => {
    const v = mount('/math/lesson/H34-L03');
    click(/^06 Reflect/);
    const text =
      'Engineering example: Under iid normal observations and genuinely known σ4 with n16, SE is1. A critical value2 gives observed-mean interval[8,12] at mean10 and theoretical coverage about95.45%, not exactly95%. Truth stays fixed while repeated sample intervals vary. Finite coverage fluctuates, and the mean interval is not an individual prediction interval or a posterior probability for fixed μ. Unknown σ, biased frames, dependence or finite-population designs need another method check.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H34-L03']
        .answers['H34-L03-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H34-L03');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('records five constructed items and three human inference reports independently of lesson mastery', () => {
    const v = mount('/math/unit/H34/check');
    ['-3', '3', '[8,12]', '1/16', 'below-target'].forEach((answer, i) => {
      click(`Question ${i + 1}`);
      enter('Your answer', answer);
      click(/Check answer/);
    });
    const reports = [
      'Engineering example: With iid normal observations and known σ, SE=σ/√n and the interval is mean±z*SE. Repeated intervals cover a fixed μ at the method rate; z2 gives about95.45%, not exact95%. A realised interval is not a posterior probability or an individual prediction interval. Finite hit rates fluctuate, and bias, unknown σ or dependence need another procedure.',
      'Engineering example: Under fixed fair independent four tosses, upper-tail p for four is1/16, whereas planned two-sided absolute distance also counts zero and gives1/8. Include the observation. α controls long-run type-I rejection under H0, with actual rate1/16 at α0.1 here. p is not P(H0|data). Non-rejection does not prove truth, and tail switching or optional peeking needs recalibration.',
      'Engineering example: A0.2-minute estimate with n10000 and known σ4 has SE0.04, z5 and tiny p, but interval[0.1216,0.2784] is below the prespecified one-minute benefit target. Estimate2 with n4 has wide interval[-1.92,5.92], while n100 gives[1.216,2.784]. Report effect, units, uncertainty, direction, threshold, design and costs; a negative precise effect can be harmful rather than no effect.',
    ];
    reports.forEach((text, i) => {
      click(`Question ${i + 6}`);
      enter('Your reasoning', text);
      expect(screen.getByText(new RegExp(`Recorded ${i + 5}/8`))).toBeTruthy();
      parent();
    });
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H34/check');
    expect(screen.getByText(/Recorded 8\/8/)).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H34-L01'],
    ).toBeUndefined();
  });
  it('changes a due sampling-distribution retrieval without inheriting its old expression or success', () => {
    const v = mount('/math/lesson/H34-L02');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '999');
    click(/Check answer/);
    enter('Your answer', '15');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '2');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H34-L02'].round).toBe(1);
    saved.sessions['H34-L02'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '2');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '3');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
});
