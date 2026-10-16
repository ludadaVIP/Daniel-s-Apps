// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RadicalLab, RadicalHookArt } from './RadicalLabs';
import { RadicalTiles } from './RadicalVisuals';
import { j91Lessons } from './content/J91';
import { App } from './App';
import { STORAGE_KEY } from './progress';
beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('study-language', 'en');
  vi.stubGlobal('scrollTo', vi.fn());
  Element.prototype.scrollIntoView = vi.fn();
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(0);
    return 0;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const click = (name: string | RegExp) =>
  fireEvent.click(screen.getByRole('button', { name }));
const enter = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name }), {
    target: { value },
  });
const choose = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const slide = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
const field = (name: string) =>
  (screen.getByRole('textbox', { name }) as HTMLInputElement).value;
const task = 'My radical or real-number conclusion',
  submit = () => click('Check radical conclusion'),
  feedback = () =>
    screen.getByRole('status', { name: 'Radical conclusion feedback' })
      .textContent;
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const check = () => click(/Check answer/);
const parent = () => {
  fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
  click('Parent confirms: reasoning makes sense');
};
describe('J91 root sets, real lines and exact operations', () => {
  it('distinguishes the principal value from both roots and preserves writing through display changes', () => {
    const v = render(<RadicalLab kind="radical-meaning" mode="en" />);
    enter(task, '±3');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '3');
    submit();
    click('Show or hide roots and substitution');
    click('Change real-line window');
    expect(field(task)).toBe('3');
    expect(feedback()).toContain('matches');
    expect(v.container.querySelectorAll('[data-real-point]')).toHaveLength(1);
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Ask for all square roots' }),
    );
    expect(field(task)).toBe('');
    enter(task, '3');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '±3');
    submit();
    click('Show or hide roots and substitution');
    expect(v.container.querySelectorAll('[data-real-point]')).toHaveLength(2);
    expect(feedback()).toContain('matches');
  });
  it('treats zero, negative radicands and fractional roots without false real-line points', () => {
    const v = render(<RadicalLab kind="radical-meaning" mode="en" />);
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Ask for all square roots' }),
    );
    choose('Radicand', '1');
    enter(task, '0');
    submit();
    expect(feedback()).toContain('matches');
    choose('Radicand', '3');
    enter(task, '-1/2,1/2');
    submit();
    expect(feedback()).toContain('matches');
    choose('Radicand', '4');
    enter(task, '0');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, 'no real roots');
    submit();
    click('Show or hide roots and substitution');
    expect(v.container.querySelectorAll('[data-real-point]')).toHaveLength(0);
    expect(
      screen.getByRole('status', { name: 'Square-root audit' }).textContent,
    ).toContain('no real roots');
  });
  it('classifies exact radicals, repeating decimals and finite literal approximations separately', () => {
    render(<RadicalLab kind="radical-real" mode="en" />);
    for (const [i, raw] of [
      ['0', 'irrational'],
      ['1', 'rational'],
      ['2', 'irrational'],
      ['3', 'rational'],
      ['4', 'rational'],
      ['5', 'not-real'],
    ]) {
      choose('Exact number to classify', i!);
      enter(task, raw!);
      submit();
      expect(feedback()).toContain('matches');
    }
    click('Show or hide position and classification');
    expect(
      screen.getByRole('status', { name: 'Real-number classification audit' })
        .textContent,
    ).toContain('no real principal root');
  });
  it('positions a negative irrational on the negative half-line while keeping display changes independent of the answer', () => {
    const v = render(<RadicalLab kind="radical-real" mode="en" />);
    choose('Exact number to classify', '2');
    enter(task, 'irrational');
    submit();
    click('Show or hide position and classification');
    expect(
      Number(
        v.container
          .querySelector('[data-real-point] circle')!
          .getAttribute('cx'),
      ),
    ).toBeLessThan(300);
    click('Change real-line window');
    expect(field(task)).toBe('irrational');
    expect(feedback()).toContain('matches');
    expect(
      screen
        .getByRole('region', {
          name: 'Real-number or root diagram; scroll locally',
        })
        .getAttribute('tabindex'),
    ).toBe('0');
  });
  it('constructs an actual square array and distinguishes area labels from side length', () => {
    const v = render(<RadicalTiles radicand="12" mode="en" reveal />);
    const tiles = v.container.querySelectorAll('[data-root-tile] rect');
    expect(tiles).toHaveLength(4);
    expect(
      [...tiles].map((e) => [
        e.getAttribute('width'),
        e.getAttribute('height'),
      ]),
    ).toEqual(Array(4).fill(['125', '125']));
    expect(v.container.textContent).toContain('2×√3');
    expect(v.container.textContent).toContain('area=12');
    v.unmount();
    const w = render(<RadicalTiles radicand="0" mode="en" />);
    expect(w.container.querySelector('svg')).toBeNull();
    expect(w.container.textContent).toContain('zero side');
  });
  it('reports equivalent-but-unfinished simplification and retains the answer when factors are revealed', () => {
    const v = render(<RadicalLab kind="radical-simplify" mode="en" />);
    enter(task, '√12');
    submit();
    expect(feedback()).toContain('Equivalent in value');
    enter(task, '2√3');
    submit();
    click('Show or hide the factor audit');
    expect(field(task)).toBe('2√3');
    expect(feedback()).toContain('matches');
    choose('Simplification case', '3');
    expect(v.container.querySelectorAll('[data-root-tile]')).toHaveLength(36);
    expect(field(task)).toBe('');
    enter(task, '3√8');
    submit();
    expect(feedback()).toContain('Equivalent in value');
    enter(task, '6√2');
    submit();
    expect(feedback()).toContain('matches');
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Put a minus outside the root' }),
    );
    expect(field(task)).toBe('');
    enter(task, '-6√2');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('finishes fractional radicands and rational denominators rather than accepting the original equivalent form', () => {
    render(<RadicalLab kind="radical-simplify" mode="en" />);
    choose('Simplification case', '5');
    enter(task, '√(8/9)');
    submit();
    expect(feedback()).toContain('Equivalent in value');
    enter(task, '(2/3)√2');
    submit();
    expect(feedback()).toContain('matches');
    choose('Simplification case', '6');
    enter(task, '√3/(2√2)');
    submit();
    expect(feedback()).toContain('Equivalent in value');
    enter(task, '√6/4');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('collects signed sums and computes products and quotients under valid conditions', () => {
    render(<RadicalLab kind="radical-operations" mode="en" />);
    for (const [i, raw] of [
      ['0', '5√2'],
      ['1', '-√3'],
      ['2', '6'],
      ['3', '3'],
      ['4', '√2/2'],
      ['6', '√2+√3'],
    ]) {
      choose('Radical operation case', i!);
      enter(task, raw!);
      submit();
      expect(feedback()).toContain('matches');
    }
  });
  it('rationalises a conjugate denominator, supports undo and resets steps only for a new source', () => {
    const v = render(<RadicalLab kind="radical-operations" mode="en" />);
    choose('Radical operation case', '5');
    enter(task, '1/(√3+√2)');
    submit();
    expect(feedback()).toContain('Equivalent in value');
    enter(task, '-√2+√3');
    submit();
    click('Next operation justification');
    click('Next operation justification');
    expect(v.container.querySelectorAll('[data-radical-step]')).toHaveLength(2);
    expect(field(task)).toBe('-√2+√3');
    expect(feedback()).toContain('matches');
    click('Undo operation justification');
    expect(v.container.querySelectorAll('[data-radical-step]')).toHaveLength(1);
    choose('Radical operation case', '4');
    expect(v.container.querySelectorAll('[data-radical-step]')).toHaveLength(0);
    expect(field(task)).toBe('');
  });
  it('requires conditions instead of computing a false real result for negative roots or zero denominators', () => {
    render(<RadicalLab kind="radical-operations" mode="en" />);
    for (const i of ['7', '8']) {
      choose('Radical operation case', i);
      enter(task, '1');
      submit();
      expect(feedback()).not.toContain('matches');
      enter(task, 'insufficient');
      submit();
      expect(feedback()).toContain('matches');
      click('Next operation justification');
      click('Next operation justification');
    }
  });
  it('uses midpoint rounding and required precision, retaining writing when exact bounds are revealed', () => {
    render(<RadicalLab kind="radical-estimate" mode="en" />);
    enter(task, '1.4');
    submit();
    click('Show or hide squared bounds and rounding');
    expect(field(task)).toBe('1.4');
    expect(feedback()).toContain('matches');
    slide('Decimal places', '2');
    expect(field(task)).toBe('');
    enter(task, '1.410');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '1.41');
    submit();
    expect(feedback()).toContain('matches');
    choose('Radicand to estimate', '5');
    enter(task, '1');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '1.00');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('handles an exact halfway root, exact-grid equality and zero without false strict bounds', () => {
    const v = render(<RadicalLab kind="radical-estimate" mode="en" />);
    choose('Radicand to estimate', '6');
    enter(task, '1.2');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '1.3');
    submit();
    expect(feedback()).toContain('matches');
    slide('Decimal places', '2');
    enter(task, '1.25');
    submit();
    click('Show or hide squared bounds and rounding');
    expect(
      screen.getByRole('status', { name: 'Squared-bound audit' }).textContent,
    ).toContain('√(25/16)=5/4');
    expect(v.container.querySelector('[data-root-location]')).toBeTruthy();
    choose('Radicand to estimate', '7');
    enter(task, '0.00');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('keeps all five hooks as questions', () => {
    for (const l of j91Lessons) {
      const v = render(
        <RadicalHookArt
          kind={l.lab as Parameters<typeof RadicalHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(v.container.textContent).toContain('?');
      v.unmount();
    }
  });
});
describe('J91 complete lessons and saved reasoning', () => {
  it('renders all English bodies and two complete examples in each bilingual section', () => {
    for (const l of j91Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J91-L04');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
  it('restores supported retries across all five new answer modes without completing unfinished lessons', () => {
    for (const [id, wrong, right] of [
      ['J91-L01', '3', '±3'],
      ['J91-L02', 'rational', '无理数'],
      ['J91-L03', '√12', '2√3'],
      ['J91-L04', '√26', '5√2'],
      ['J91-L05', '1.5', '1.4'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/04 Together/);
      enter('Your answer', wrong!);
      check();
      enter('Your answer', right!);
      check();
      expect(
        screen.getByText(
          '✓ Completed with support. Your understanding is growing.',
        ),
      ).toBeTruthy();
      v.unmount();
      const w = mount(`/math/lesson/${id}`);
      expect(field('Your answer')).toBe(right);
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id!]
          .completedAt,
      ).toBeUndefined();
      w.unmount();
    }
  });
  it('distinguishes formal equivalence from finished simplification and saves the original accepted form', () => {
    const v = mount('/math/lesson/J91-L03');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '3√8');
    check();
    expect(
      screen.getByText('↳ The value matches; finish the requested form.'),
    ).toBeTruthy();
    enter('Your answer', '6sqrt(2)');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J91-L03');
    expect(field('Your answer')).toBe('6sqrt(2)');
  });
  it('requires the specified trailing zeros in an exit without confusing value mismatch with form mismatch', () => {
    const v = mount('/math/lesson/J91-L05');
    click(/06 Reflect/);
    enter('Your answer', '1');
    check();
    expect(
      screen.getByText('↳ The value matches; finish the requested form.'),
    ).toBeTruthy();
    enter('Your answer', '1.00');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J91-L05');
    expect(field('Your answer')).toBe('1.00');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J91-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('keeps irrationality and midpoint arguments human-reviewed and restores their original text', () => {
    for (const [id, n, text] of [
      [
        'J91-L02',
        '5',
        'Assume sqrt two equals p/q in lowest terms. p squared even makes p even; substitution makes q even too, contradicting coprimality. A finite display is not proof.',
      ],
      [
        'J91-L05',
        '5',
        'The interval straddles midpoint 1.415. Its exact square 2.002225 exceeds two, so the nonnegative root is below it and rounds to 1.41, an approximation.',
      ],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/05 Practice/);
      click(`Question ${n}`);
      enter('Your reasoning', text!);
      expect(
        screen.queryByText('✓ Reasoning reviewed by a parent.'),
      ).toBeNull();
      parent();
      v.unmount();
      const w = mount(`/math/lesson/${id}`);
      expect(field('Your reasoning')).toBe(text);
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id!]
          .completedAt,
      ).toBeUndefined();
      w.unmount();
    }
  });
  it('saves eight independent unit-check answers with separate domain and integration reviews', () => {
    const v = mount('/math/unit/J91/check');
    for (const [n, raw] of Object.entries({
      1: '±4',
      2: 'rational',
      3: '5√2',
      4: '3√2',
      5: '1.73',
    })) {
      click(`Question ${n}`);
      enter('Your answer', raw);
      check();
    }
    click('Question 6');
    enter(
      'Your reasoning',
      'In the real domain negative radicands are undefined and sqrt zero is zero, so neither given operation is valid. Also sqrt one plus sqrt one is two, not sqrt two.',
    );
    parent();
    click('Question 7');
    click(/^B /);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'Distinguish ±3 from the principal value three, irrational sqrt two from a finite rational approximation, extract square factors and collect like roots, check nonnegative radicands and nonzero denominators, then compare squared bounds and midpoint for rounding.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J91/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J91-L05'],
    ).toBeUndefined();
  });
  it('changes retrieval radical and sign without carrying the prior input or successful feedback', () => {
    const v = mount('/math/lesson/J91-L03');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '√72');
    check();
    enter('Your answer', '6√2');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '√2');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J91-L03'].round).toBe(1);
    saved.sessions['J91-L03'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '-2√3');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
