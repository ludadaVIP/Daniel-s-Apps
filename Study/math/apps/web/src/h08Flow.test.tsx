// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DataModellingLab, DataModellingHookArt } from './DataModellingLabs';
import { h08Lessons } from './content/H08';
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
const feedback = (name: string) =>
  screen.getByRole('status', { name: `${name} feedback` }).textContent;
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
describe('H08 data workbenches and durable learning records', () => {
  it('preserves identities and original values while adopting a sourced correction', () => {
    render(<DataModellingLab kind="data-cleaning" mode="en" />);
    enter('Predict distinct record count', '6');
    check('Predict distinct record count');
    enter('Predict current length mean (cm)', '66');
    check('Predict current length mean (cm)');
    expect(feedback('Predict current length mean (cm)')).toContain('matches');
    expect(screen.getByText(/not the final conclusion/)).toBeTruthy();
    click('Apply/revert source correction');
    expect(field('Predict current length mean (cm)')).toBe('');
    expect(field('Predict distinct record count')).toBe('6');
    enter('Predict current length mean (cm)', '21');
    check('Predict current length mean (cm)');
    click('Show/hide audit');
    expect(feedback('Predict current length mean (cm)')).toContain('matches');
    expect(
      screen.getByText(/two distinct records at 20 cm both remain/),
    ).toBeTruthy();
    select('Variable to classify', 'length');
    enter('Predict variable type', 'continuous');
    check('Predict variable type');
    expect(feedback('Predict variable type')).toContain('matches');
    select('Variable to classify', 'rating');
    expect(field('Predict variable type')).toBe('');
    expect(field('Predict current length mean (cm)')).toBe('21');
    enter('Predict variable type', 'ordinal');
    check('Predict variable type');
    expect(feedback('Predict variable type')).toContain('matches');
  });
  it('changes bins without changing observations, means or saved shape predictions', () => {
    const v = render(<DataModellingLab kind="data-shape" mode="en" />);
    enter('Predict shape code', 'right-skew');
    check('Predict shape code');
    enter('Predict mean', '3');
    check('Predict mean');
    select('Histogram bin width', '4');
    expect(field('Predict shape code')).toBe('right-skew');
    expect(feedback('Predict mean')).toContain('matches');
    expect(v.container.querySelectorAll('[data-observation]')).toHaveLength(7);
    expect(
      Array.from(v.container.querySelectorAll('[data-bin-count]')).map((x) =>
        x.getAttribute('data-bin-count'),
      ),
    ).toEqual(['6', '0', '0', '1']);
    select('Distribution case', '4');
    expect(field('Predict shape code')).toBe('');
    enter('Predict mean', '2');
    enter('Predict median', '2');
    check('Predict median');
    enter('Predict shape code', 'symmetric');
    check('Predict shape code');
    expect(feedback('Predict shape code')).not.toContain('matches');
    enter('Predict shape code', 'asymmetric');
    check('Predict shape code');
    expect(feedback('Predict shape code')).toContain('matches');
  });
  it('separates squared sums, divisor choices and translation invariance', () => {
    const v = render(<DataModellingLab kind="data-spread" mode="en" />),
      sd = 'Predict SD (exact; undefined if needed)';
    enter('Predict mean', '4');
    enter('Predict squared deviation sum', '8');
    check('Predict squared deviation sum');
    enter(sd, 'sqrt(2)');
    check(sd);
    expect(feedback(sd)).toContain('matches');
    select('Common shift', '10');
    expect(field(sd)).toBe('sqrt(2)');
    expect(field('Predict squared deviation sum')).toBe('8');
    expect(field('Predict mean')).toBe('');
    select('Variance divisor convention', 'sample');
    expect(field(sd)).toBe('');
    expect(field('Predict squared deviation sum')).toBe('8');
    enter(sd, 'sqrt(8/3)');
    check(sd);
    expect(feedback(sd)).toContain('matches');
    click('Show/hide audit');
    expect(v.container.querySelectorAll('[data-square="4"]')).toHaveLength(2);
    select('Common scale factor', '-1');
    expect(field(sd)).toBe('sqrt(8/3)');
    expect(feedback(sd)).toContain('matches');
    select('Common scale factor', '2');
    expect(field(sd)).toBe('');
    enter(sd, 'sqrt(32/3)');
    check(sd);
    expect(feedback(sd)).toContain('matches');
  });
  it('keeps singleton sample SD undefined while allowing singleton population and constant-data zeros', () => {
    render(<DataModellingLab kind="data-spread" mode="en" />);
    const sd = 'Predict SD (exact; undefined if needed)';
    select('Spread case', '2');
    select('Variance divisor convention', 'sample');
    enter(sd, '0');
    check(sd);
    expect(feedback(sd)).not.toContain('matches');
    enter(sd, 'undefined');
    check(sd);
    expect(feedback(sd)).toContain('matches');
    select('Variance divisor convention', 'population');
    expect(field(sd)).toBe('');
    enter(sd, '0');
    check(sd);
    expect(feedback(sd)).toContain('matches');
    select('Spread case', '1');
    select('Variance divisor convention', 'sample');
    enter(sd, '0');
    check(sd);
    expect(feedback(sd)).toContain('matches');
  });
  it('preserves z under positive unit conversion and changes only the affected reference', () => {
    const v = render(<DataModellingLab kind="data-standard" mode="en" />),
      b = 'Predict z for B (undefined if needed)';
    enter('Predict z for A', '2');
    check('Predict z for A');
    enter(b, '1');
    check(b);
    click('Change units: x′=10x+100');
    expect(field('Predict z for A')).toBe('2');
    expect(field(b)).toBe('1');
    expect(feedback(b)).toContain('matches');
    expect(screen.getByText(/x=800, μ=600, σ=100/)).toBeTruthy();
    click('Toggle zero spread in reference B');
    expect(field(b)).toBe('');
    expect(field('Predict z for A')).toBe('2');
    select('Observation B', '80');
    enter(b, '0');
    check(b);
    expect(feedback(b)).not.toContain('matches');
    enter(b, 'undefined');
    check(b);
    click('Show/hide audit');
    expect(feedback(b)).toContain('matches');
    expect(v.container.querySelector('[data-z-group="B"]')).toBeNull();
    expect(screen.getByText('Undefined: zero SD')).toBeTruthy();
  });
  it('retains independent fitted-line predictions when only a candidate or display changes', () => {
    const v = render(<DataModellingLab kind="data-regression" mode="en" />),
      slope = 'Predict least-squares slope (not-identified if nonunique)',
      pred = 'Predict least-squares fitted y (not-identified if needed)',
      scope = 'Predict interpolation/extrapolation code',
      ss = 'Predict candidate residual sum of squares';
    enter(ss, '5');
    check(ss);
    enter(slope, '1.5');
    check(slope);
    enter(pred, '4');
    check(pred);
    enter(scope, 'interpolation');
    check(scope);
    select('Candidate slope b', '1.5');
    expect(field(ss)).toBe('');
    expect(field(slope)).toBe('1.5');
    expect(field(pred)).toBe('4');
    enter(ss, '1.5');
    check(ss);
    click('Show/hide candidate residuals');
    click('Show/hide audit');
    expect(feedback(ss)).toContain('matches');
    expect(
      v.container
        .querySelector('[data-residual-id="P2"]')
        ?.getAttribute('data-residual'),
    ).toBe('-1');
    expect(
      v.container.querySelector('[data-residual-id="P2"]')?.getAttribute('x1'),
    ).toBe(
      v.container.querySelector('[data-residual-id="P2"]')?.getAttribute('x2'),
    );
    select('Query x', '4');
    expect(field(pred)).toBe('');
    expect(field(scope)).toBe('');
    expect(field(slope)).toBe('1.5');
    expect(field(ss)).toBe('1.5');
    enter(pred, '7');
    check(pred);
    enter(scope, 'extrapolation');
    check(scope);
    expect(feedback(pred)).toContain('matches');
  });
  it('distinguishes a nonunique slope from the unique common-x fitted value and a curved zero-slope fit', () => {
    render(<DataModellingLab kind="data-regression" mode="en" />);
    const slope = 'Predict least-squares slope (not-identified if nonunique)',
      pred = 'Predict least-squares fitted y (not-identified if needed)';
    select('Paired case', '3');
    enter(slope, '0');
    check(slope);
    expect(feedback(slope)).not.toContain('matches');
    enter(slope, 'not-identified');
    check(slope);
    enter(pred, '13/3');
    check(pred);
    expect(feedback(pred)).toContain('matches');
    select('Query x', '4');
    enter(pred, 'not-identified');
    check(pred);
    expect(feedback(pred)).toContain('matches');
    select('Paired case', '4');
    enter(slope, '0');
    check(slope);
    expect(feedback(slope)).toContain('matches');
    click('Show/hide audit');
    expect(screen.getByText(/SSE=14/)).toBeTruthy();
  });
  it('renders both authored languages and hooks without hidden answers or invalid SVG paints', () => {
    for (const l of h08Lessons) {
      localStorage.setItem('study-language', 'en');
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 Understand/);
      expect(
        v.container.querySelector('.math-prose section[lang="en"]')?.textContent
          ?.length,
      ).toBeGreaterThan(1800);
      fireEvent.click(screen.getByRole('button', { name: '双语' }));
      for (const lang of ['zh', 'en'])
        expect(
          v.container.querySelectorAll(
            `.math-prose section[lang="${lang}"] h3`,
          ),
        ).toHaveLength(2);
      v.unmount();
      const w = render(
        <DataModellingHookArt
          kind={l.lab as Parameters<typeof DataModellingHookArt>[0]['kind']}
          mode="bilingual"
        />,
      );
      expect(w.container.querySelector('foreignObject')).toBeNull();
      expect(w.container.querySelector('input')).toBeNull();
      for (const node of w.container.querySelectorAll(
        'svg [fill],svg [stroke]',
      ))
        for (const attr of ['fill', 'stroke']) {
          const value = node.getAttribute(attr);
          if (value?.startsWith('#'))
            expect(value).toMatch(
              /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i,
            );
        }
      w.unmount();
    }
  });
  it('restores corrected guided answers across all five lessons without completing independent practice', () => {
    for (const [id, a] of [
      ['H08-L01', '20'],
      ['H08-L02', '3'],
      ['H08-L03', 'sqrt(2)'],
      ['H08-L04', '2'],
      ['H08-L05', '3/2'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/^04 Together/);
      enter('Your answer', '999');
      click(/Check answer/);
      enter('Your answer', a!);
      click(/Check answer/);
      expect(
        screen.getByText(
          '✓ Completed with support. Your understanding is growing.',
        ),
      ).toBeTruthy();
      v.unmount();
      const w = mount(`/math/lesson/${id}`);
      expect(field('Your answer')).toBe(a);
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id!]
          .completedAt,
      ).toBeUndefined();
      w.unmount();
    }
  });
  it('keeps the full data-cleaning explanation human-reviewed and preserves its original text', () => {
    const v = mount('/math/lesson/H08-L01');
    click(/^06 Reflect/);
    const text =
      'Retain original values and source evidence. Convert 200 mm to 20 cm and correct the confirmed 200 cm entry to 20 cm. Merge only the confirmed repeated ID. Keep equal lengths from distinct IDs and a real count of zero. Exclude missing and invalid length fields without inventing zero or deleting valid counts. Four lengths 20,20,20,24 give mean 21 cm; report n=4 and exclusions.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H08-L01']
        .answers['H08-L01-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H08-L01');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('stores all eight unit answers with independently reviewed zero-spread and residual arguments', () => {
    const v = mount('/math/unit/H08/check');
    for (const [n, a] of [
      ['1', 'discrete'],
      ['2', 'right-skew'],
      ['3', 'sqrt(2)'],
      ['4', '2'],
      ['5', '4'],
    ]) {
      click(`Question ${n}`);
      enter('Your answer', a!);
      click(/Check answer/);
    }
    click('Question 6');
    click('C Sum of squared vertical residuals at the same x');
    click(/Check answer/);
    click('Question 7');
    enter(
      'Your reasoning',
      'Four fours have mean four and all deviations zero, so population variance and SD are zero. Conversely a sum of nonnegative squared deviations can vanish only if every deviation is zero, so every value equals the mean; a signed sum alone would not prove this.',
    );
    expect(screen.getByText(/Recorded 6\/8/)).toBeTruthy();
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'Fitted values 2.5,4,5.5 give residuals 0.5,-1,0.5 and squared sum 1.5, despite signed sum zero. At x=4 the fit is seven, extrapolating beyond [1,3], not guaranteeing y=7. Observational fictional data do not prove causation. Check source validity, residual shape and new data; retain genuine distant observations and report sensitivity.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H08/check');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H08-L01'],
    ).toBeUndefined();
  });
  it('changes a due cleaning retrieval without inheriting the old numerical input or success', () => {
    const v = mount('/math/lesson/H08-L01');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', 'continuous');
    click(/Check answer/);
    enter('Your answer', 'discrete');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '5');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H08-L01'].round).toBe(1);
    saved.sessions['H08-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '5');
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
