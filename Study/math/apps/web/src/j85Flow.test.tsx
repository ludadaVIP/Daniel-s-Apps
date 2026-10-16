// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { FunctionLab, FunctionHookArt } from './FunctionLabs';
import { j85Lessons } from './content/J85';
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
const slide = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
const choose = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const field = (name: string) =>
  (screen.getByRole('textbox', { name }) as HTMLInputElement).value;
const task = 'My function answer',
  submit = () => click('Check my conclusion'),
  feedback = () =>
    screen.getByRole('status', { name: 'Function feedback' }).textContent;
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const check = () => click(/Check answer/);
describe('J85 six function investigations', () => {
  it('distinguishes moving the input from changing parameters and retains a general answer across view changes', () => {
    const v = render(<FunctionLab kind="function-form" mode="en" />);
    enter(task, '5');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '3+2x');
    submit();
    expect(feedback()).toContain('matches');
    slide('Input x', '4');
    click('Change function window');
    expect(field(task)).toBe('3+2x');
    expect(feedback()).toContain('matches');
    expect(v.container.textContent).toContain('y=11');
    slide('Intercept b', '4');
    expect(field(task)).toBe('');
    expect(
      screen.queryByRole('status', { name: 'Function feedback' }),
    ).toBeNull();
    enter(task, '2x+4');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('accepts the constant expression at zero slope while stating the nonzero first-degree convention', () => {
    const v = render(<FunctionLab kind="function-form" mode="en" />);
    slide('Slope m', '0');
    enter(task, '3');
    submit();
    expect(feedback()).toContain('matches');
    expect(v.container.textContent).toContain('m=0 is a constant function');
    expect(v.container.querySelectorAll('[data-curve]')).toHaveLength(1);
  });
  it('reveals Δy/Δx on request and preserves slope and entered evidence when swapping both points or rescaling', () => {
    const v = render(<FunctionLab kind="function-slope" mode="en" />);
    expect(
      screen.queryByRole('status', { name: 'Change calculation' }),
    ).toBeNull();
    enter(task, '2');
    submit();
    click('Show or hide change triangle');
    expect(
      screen.getByRole('status', { name: 'Change calculation' }).textContent,
    ).toContain('Δx=3; Δy=6; m=Δy/Δx=2');
    expect(
      v.container
        .querySelector('[data-curve="Δx → Δy"]')!
        .getAttribute('stroke-dasharray'),
    ).toBe('6 4');
    click('Swap P and Q');
    expect(
      screen.getByRole('status', { name: 'Change calculation' }).textContent,
    ).toContain('Δx=-3; Δy=-6; m=Δy/Δx=2');
    click('Change vertical display range');
    expect(field(task)).toBe('2');
    expect(feedback()).toContain('matches');
  });
  it('retains exact fractional and zero slopes with fresh answers for new point pairs', () => {
    render(<FunctionLab kind="function-slope" mode="en" />);
    choose('Slope point pair', '2');
    enter(task, '0.67');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '4/6');
    submit();
    expect(feedback()).toContain('matches');
    choose('Slope point pair', '3');
    expect(field(task)).toBe('');
    enter(task, '0');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('uses (0,b), keeps the intercept independent of slope/input, and handles an off-window intercept', () => {
    const v = render(<FunctionLab kind="function-intercept" mode="en" />);
    enter(task, '(3,0)');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '(0,3)');
    submit();
    slide('Input x', '4');
    expect(field(task)).toBe('(0,3)');
    slide('Slope m', '2');
    expect(field(task)).toBe('');
    enter(task, '(0,3)');
    submit();
    expect(feedback()).toContain('matches');
    slide('Intercept b', '8');
    expect(v.container.querySelector('[data-plot-label="B"]')).toBeNull();
    enter(task, '(0,8)');
    submit();
    click('Change function window');
    expect(
      v.container
        .querySelector('[data-plot-label="B"]')!
        .getAttribute('data-coordinate'),
    ).toBe('0,8');
    expect(field(task)).toBe('(0,8)');
    expect(feedback()).toContain('matches');
  });
  it('delays the two-point rule reveal, validates both constraints and preserves input across window changes', () => {
    const v = render(<FunctionLab kind="function-points" mode="en" />);
    expect(v.container.querySelectorAll('[data-curve]')).toHaveLength(0);
    enter(task, 'x+3');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '2x+1');
    submit();
    click('Show or hide line audit');
    expect(
      screen.getByRole('status', { name: 'Two-point audit' }).textContent,
    ).toContain('m=2; b=1');
    expect(v.container.querySelectorAll('[data-curve]')).toHaveLength(1);
    click('Change function window');
    expect(field(task)).toBe('2x+1');
    expect(feedback()).toContain('matches');
    choose('Two-point case', '1');
    expect(field(task)).toBe('');
    expect(
      screen.queryByRole('status', { name: 'Two-point audit' }),
    ).toBeNull();
    enter(task, '(x+1)/2');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('separates horizontal constants, vertical undefined slopes and coincident underdetermined point data', () => {
    const v = render(<FunctionLab kind="function-points" mode="en" />);
    choose('Two-point case', '2');
    enter(task, '3');
    submit();
    expect(feedback()).toContain('matches');
    choose('Two-point case', '3');
    enter(task, '0');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, 'vertical line');
    submit();
    click('Show or hide line audit');
    expect(
      screen.getByRole('status', { name: 'Two-point audit' }).textContent,
    ).toContain('undefined, not zero');
    choose('Two-point case', '4');
    expect(v.container.querySelectorAll('[data-plot-label]')).toHaveLength(1);
    expect(v.container.querySelector('[data-plot-label="P=Q"]')).toBeTruthy();
    enter(task, 'undetermined');
    submit();
    click('Show or hide line audit');
    expect(
      screen.getByRole('status', { name: 'Two-point audit' }).textContent,
    ).toContain('rather than inconsistent');
  });
  it('compares direct, shifted, constant, nonlinear and zero rules without dividing by zero in the ratio table', () => {
    const v = render(<FunctionLab kind="function-compare" mode="en" />);
    enter(task, 'direct proportion');
    submit();
    expect(feedback()).toContain('matches');
    expect(v.container.querySelector('table')!.textContent).toContain(
      'undefined (zero divisor)',
    );
    choose('Relationship comparison', '1');
    enter(task, 'direct');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, 'linear but not direct');
    submit();
    expect(feedback()).toContain('matches');
    choose('Relationship comparison', '3');
    expect(
      v.container
        .querySelector('[data-curve]')!
        .getAttribute('points')!
        .split(' ').length,
    ).toBeGreaterThan(10);
    enter(task, 'nonlinear');
    submit();
    expect(feedback()).toContain('matches');
    choose('Relationship comparison', '4');
    enter(task, 'direct');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, 'constant');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('audits contextual units and ranges separately and clips draining at emptying rather than drawing negative water', () => {
    const v = render(<FunctionLab kind="function-context" mode="en" />);
    enter(task, '2x+5');
    submit();
    enter('Context candidate x', '10');
    enter('Predicted output y', '25');
    click('Audit relationship, units and domain');
    expect(
      screen.getByRole('status', { name: 'Linear context audit' }).textContent,
    ).toContain('Relationship: passes; stated range: fails');
    choose('Fictional linear context', 'drain');
    expect(field(task)).toBe('');
    expect(
      screen.queryByRole('status', { name: 'Linear context audit' }),
    ).toBeNull();
    enter('Context candidate x', '7');
    enter('Predicted output y', '-2');
    click('Audit relationship, units and domain');
    expect(
      screen.getByRole('status', { name: 'Linear context audit' }).textContent,
    ).toContain('stated range: fails');
    expect(v.container.textContent).toContain('L/min');
    enter('Context candidate x', '6');
    enter('Predicted output y', '0');
    click('Audit relationship, units and domain');
    expect(
      screen.getByRole('status', { name: 'Linear context audit' }).textContent,
    ).toContain('Allowed within the model');
  });
  it('draws five discrete pack points and rejects fractional pack inputs even when their algebraic output matches', () => {
    const v = render(<FunctionLab kind="function-context" mode="en" />);
    choose('Fictional linear context', 'cards');
    expect(v.container.querySelectorAll('[data-plot-label]')).toHaveLength(5);
    expect(v.container.querySelectorAll('[data-curve]')).toHaveLength(0);
    enter('Context candidate x', '1/2');
    enter('Predicted output y', '7/2');
    click('Audit relationship, units and domain');
    expect(
      screen.getByRole('status', { name: 'Linear context audit' }).textContent,
    ).toContain('integer restriction: fails');
    enter('Context candidate x', '4');
    enter('Predicted output y', '14');
    click('Audit relationship, units and domain');
    expect(
      screen.getByRole('status', { name: 'Linear context audit' }).textContent,
    ).toContain('Allowed within the model');
    enter(task, '3x+2');
    submit();
    click('Change function window');
    expect(field(task)).toBe('3x+2');
    expect(feedback()).toContain('matches');
  });
  it('keeps all six opening prompts as investigations', () => {
    for (const l of j85Lessons) {
      const v = render(
        <FunctionHookArt
          kind={l.lab as Parameters<typeof FunctionHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(v.container.textContent).toContain('?');
      v.unmount();
    }
  });
});
describe('J85 bilingual lesson, exact answers and persistence flows', () => {
  it('renders six English bodies and both bilingual languages with two full examples each', () => {
    for (const l of j85Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J85-L06');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
  it('restores supported retries and original equivalent representations in all six lessons', () => {
    for (const [id, wrong, right] of [
      ['J85-L01', '5', '3+2x'],
      ['J85-L02', '6', '4/2'],
      ['J85-L03', '(3,0)', '（0，3）'],
      ['J85-L04', 'x+3', '1+2*x'],
      ['J85-L05', 'constant', '正比例'],
      ['J85-L06', '7', '5+2x'],
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
  it('rejects truncated exact slopes and restores the entered fraction after refresh', () => {
    const v = mount('/math/lesson/J85-L02');
    click(/05 Practice/);
    click('Question 3');
    enter('Your answer', '0.67');
    check();
    enter('Your answer', '4/6');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J85-L02');
    expect(field('Your answer')).toBe('4/6');
  });
  it('distinguishes vertical from undetermined in formal tasks and does not complete unrelated practice', () => {
    mount('/math/lesson/J85-L04');
    click(/05 Practice/);
    click('Question 4');
    enter('Your answer', 'constant');
    check();
    enter('Your answer', 'vertical line');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    click('Question 5');
    enter('Your answer', 'no solution');
    check();
    enter('Your answer', '无法唯一确定');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J85-L04']
        .completedAt,
    ).toBeUndefined();
  });
  it('keeps function-domain explanations human-reviewed', () => {
    mount('/math/lesson/J85-L06');
    click(/05 Practice/);
    click('Question 6');
    enter(
      'Your reasoning',
      'Slope has output units per input unit, and the intercept shares the output unit. A draining tank uses the rule only until six minutes; seven gives an algebraic negative outside that domain. Whole packs require integer inputs and unjoined points. Neither a screen window nor two observations proves an unlimited model.',
    );
    expect(screen.queryByText('✓ Reasoning reviewed by a parent.')).toBeNull();
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J85-L06']
        .completedAt,
    ).toBeUndefined();
  });
  it('saves all eight unit-check results independently across expressions, numbers, points and classifications', () => {
    const v = mount('/math/unit/J85/check');
    for (const [n, value] of Object.entries({
      1: '3-2x',
      2: '3/2',
      3: '(0,-4)',
      4: '2x-3',
      5: 'vertical line',
      6: 'nonlinear',
    })) {
      click(`Question ${n}`);
      enter('Your answer', value);
      check();
    }
    click('Question 7');
    click(/^B /);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'Compute signed Δy/Δx and substitute both points. The y intercept is (0,b). Duplicate points are underdetermined, vertical lines are not functions of x, and constants use a separate convention. Model units and domains matter: a draining line stops at six minutes and whole packs need integers.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J85/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J85-L06'],
    ).toBeUndefined();
  });
  it('changes review rates and clears prior inputs and success evidence', () => {
    const v = mount('/math/lesson/J85-L02');
    click(/05 Practice/);
    click('Question 3');
    enter('Your answer', '0.67');
    check();
    enter('Your answer', '2/3');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '-4');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J85-L02'].round).toBe(1);
    saved.sessions['J85-L02'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '-3/2');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
