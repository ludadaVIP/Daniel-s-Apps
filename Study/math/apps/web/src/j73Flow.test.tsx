// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  within,
} from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LinearLab, LinearHookArt } from './LinearLabs';
import { App } from './App';
import { j73Lessons } from './content/J73';
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
const verify = (group: string) =>
  fireEvent.click(
    within(screen.getByRole('group', { name: group })).getByRole('button', {
      name: 'Check my reasoning result',
    }),
  );
const feedback = (group: string) =>
  within(screen.getByRole('group', { name: group })).getByRole('status', {
    name: 'Solution feedback',
  }).textContent;
const audit = () =>
  screen.getByRole('status', { name: 'Candidate audit' }).textContent;
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const check = () => click(/Check answer/);
describe('J73 linear reasoning workshops', () => {
  it('checks both original sides, clears stale evidence and rejects malformed scalar candidates', () => {
    const v = render(<LinearLab kind="linear-check" mode="en" />);
    enter('My candidate x', '3');
    click('Check original equation and conditions');
    expect(audit()).toContain('rejected');
    expect(v.container.querySelector('[data-algebra-left]')!.textContent).toBe(
      '9',
    );
    expect(v.container.querySelector('[data-algebra-right]')!.textContent).toBe(
      '11',
    );
    enter('My candidate x', '4');
    expect(
      screen.queryByRole('status', { name: 'Candidate audit' }),
    ).toBeNull();
    click('Check original equation and conditions');
    expect(audit()).toContain('accepted');
    enter('My candidate x', 'x=4');
    click('Check original equation and conditions');
    expect(audit()).toContain('without units or an equal sign');
    choose('Choose original equation', '1');
    expect(
      (
        screen.getByRole('textbox', {
          name: 'My candidate x',
        }) as HTMLInputElement
      ).value,
    ).toBe('');
    enter('My candidate x', '-1/3');
    click('Check original equation and conditions');
    expect(audit()).toContain('Left -3, right -3');
  });
  it('distinguishes the unique zero, an identity and a contradiction with complete-solution answers', () => {
    render(<LinearLab kind="linear-check" mode="en" />);
    choose('Choose original equation', '2');
    enter('My complete solution set', '0');
    verify('My complete solution set');
    expect(feedback('My complete solution set')).toContain('Matches');
    choose('Choose original equation', '3');
    enter('My complete solution set', '0');
    verify('My complete solution set');
    expect(feedback('My complete solution set')).toContain('Recheck');
    enter('My complete solution set', 'all');
    verify('My complete solution set');
    expect(feedback('My complete solution set')).toContain('Matches');
    choose('Choose original equation', '4');
    enter('My complete solution set', 'none');
    verify('My complete solution set');
    expect(feedback('My complete solution set')).toContain('Matches');
  });
  it('records equal reversible steps from the original and validates the final candidate in that original', () => {
    const v = render(<LinearLab kind="linear-balance" mode="en" />);
    click('Apply and record one step');
    enter('Term or constant to apply', '2');
    click('Apply and record one step');
    choose('Operation', '÷');
    enter('Term or constant to apply', '3');
    click('Apply and record one step');
    expect(
      v.container.querySelector('[data-current-equation]')!.textContent,
    ).toContain('x = 3');
    expect(v.container.querySelectorAll('[data-transform-step]')).toHaveLength(
      3,
    );
    expect(v.container.querySelectorAll('[data-safe="true"]')).toHaveLength(3);
    enter('My solution of the original', '3');
    verify('My solution of the original');
    expect(
      v.container.querySelector('[data-original-check]')!.textContent,
    ).toContain('17 = 17');
  });
  it('does not divide by zero and exposes lost restrictions after multiplying by zero', () => {
    const v = render(<LinearLab kind="linear-balance" mode="en" />);
    const current = () =>
      v.container.querySelector('[data-current-equation]')!.textContent;
    const original = current();
    choose('Operation', '÷');
    enter('Term or constant to apply', '0');
    click('Apply and record one step');
    expect(current()).toBe(original);
    expect(
      screen.getByRole('status', { name: 'Transformation feedback' })
        .textContent,
    ).toContain('Cannot divide by zero');
    expect(v.container.querySelectorAll('[data-transform-step]')).toHaveLength(
      0,
    );
    choose('Operation', '×');
    click('Apply and record one step');
    expect(current()).toContain('0 = 0');
    expect(screen.getByText(/Current solution set differs/)).toBeTruthy();
    expect(v.container.querySelector('[data-safe="false"]')).toBeTruthy();
    click('Return to original equation');
    expect(current()).toBe(original);
    expect(v.container.querySelectorAll('[data-transform-step]')).toHaveLength(
      0,
    );
    enter('Term or constant to apply', 'x');
    click('Apply and record one step');
    expect(current()).toBe(original);
    expect(
      screen.getByRole('status', { name: 'Transformation feedback' })
        .textContent,
    ).toContain('variable factor');
  });
  it('flags a one-sided step and caps history without losing the reset control', () => {
    const v = render(<LinearLab kind="linear-balance" mode="en" />);
    choose('Operation scope', 'left');
    enter('Term or constant to apply', '2');
    click('Apply and record one step');
    expect(
      screen.getByRole('status', { name: 'Transformation feedback' })
        .textContent,
    ).toContain('one-sided');
    for (let i = 1; i < 8; i++) click('Apply and record one step');
    expect(v.container.querySelectorAll('[data-transform-step]')).toHaveLength(
      8,
    );
    expect(
      (
        screen.getByRole('button', {
          name: 'Apply and record one step',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    click('Return to original equation');
    expect(
      (
        screen.getByRole('button', {
          name: 'Apply and record one step',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(false);
  });
  it('reveals every negative-factor step and does not divide when bracket coefficients cancel', () => {
    const v = render(<LinearLab kind="linear-brackets" mode="en" />);
    choose('Equation case', '1');
    click('Reveal next step and reason');
    expect(
      v.container.querySelector('[data-linear-step]')!.textContent,
    ).toContain('6');
    while (
      !(
        screen.getByRole('button', {
          name: 'Reveal next step and reason',
        }) as HTMLButtonElement
      ).disabled
    )
      click('Reveal next step and reason');
    enter('My exact solution or solution set', '1');
    verify('My exact solution or solution set');
    expect(feedback('My exact solution or solution set')).toContain('Matches');
    choose('Equation case', '3');
    expect(v.container.querySelectorAll('[data-linear-step]')).toHaveLength(0);
    while (
      !(
        screen.getByRole('button', {
          name: 'Reveal next step and reason',
        }) as HTMLButtonElement
      ).disabled
    )
      click('Reveal next step and reason');
    expect(
      screen.getByText(/After x terms cancel, an identity remains/),
    ).toBeTruthy();
    expect(v.container.textContent).not.toContain(
      'Divide both sides by the known',
    );
    enter('My exact solution or solution set', 'all');
    verify('My exact solution or solution set');
    expect(feedback('My exact solution or solution set')).toContain('Matches');
  });
  it('clears every fraction term, includes the integer and retains a fractional exact root', () => {
    const v = render(<LinearLab kind="linear-fractions" mode="en" />);
    click('Reveal next step and reason');
    expect(
      v.container.querySelector('[data-linear-step]')!.textContent,
    ).toContain('6((x-1)/2-(x+2)/3) = 6(1/6)');
    click('Reveal next step and reason');
    expect(v.container.textContent).toContain('3(x-1)-2(x+2) = 1');
    choose('Equation case', '1');
    click('Reveal next step and reason');
    click('Reveal next step and reason');
    expect(v.container.textContent).toContain('2(x+1) = 3x-6');
    choose('Equation case', '3');
    enter('My exact solution or solution set', '1/2');
    verify('My exact solution or solution set');
    expect(feedback('My exact solution or solution set')).toContain('Matches');
    expect(
      v.container.querySelector('[data-original-check]')!.textContent,
    ).toContain('1/6 = 1/6');
  });
  it('separates original modelling from equivalent solutions and resets changed age parameters', () => {
    render(<LinearLab kind="linear-model" mode="en" />);
    enter('My original-quantity equation', 'x=11');
    verify('My original-quantity equation');
    expect(feedback('My original-quantity equation')).toContain(
      'solution set matches',
    );
    enter('My original-quantity equation', '30=2(x+4)');
    verify('My original-quantity equation');
    expect(feedback('My original-quantity equation')).toContain('Matches');
    enter('My candidate x', '11');
    click('Check original equation and conditions');
    expect(audit()).toContain('accepted');
    slide('Age sum', '29');
    expect(
      (
        screen.getByRole('textbox', {
          name: 'My original-quantity equation',
        }) as HTMLInputElement
      ).value,
    ).toBe('');
    expect(
      screen.queryByRole('status', { name: 'Candidate audit' }),
    ).toBeNull();
    enter('My candidate x', '21/2');
    click('Check original equation and conditions');
    expect(audit()).toContain('accepted');
    slide('Age sum', '0');
    enter('My candidate x', '-4');
    click('Check original equation and conditions');
    expect(audit()).toContain(
      'Original equation: met; context conditions: not met',
    );
  });
  it('keeps the fixed two extras outside the repeated whole-bag amount', () => {
    render(<LinearLab kind="linear-model" mode="en" />);
    choose('Fictional context', 'groups');
    enter('My original-quantity equation', '5x=20');
    verify('My original-quantity equation');
    expect(feedback('My original-quantity equation')).toContain('Recheck');
    enter('My original-quantity equation', '20=3x+2');
    verify('My original-quantity equation');
    expect(feedback('My original-quantity equation')).toContain('Matches');
    slide('Total pencils', '21');
    enter('My candidate x', '19/3');
    click('Check original equation and conditions');
    expect(audit()).toContain(
      'Original equation: met; context conditions: not met',
    );
  });
  it('distinguishes failed equality from failed count domain, then accepts fractional length, negative reading and zero', () => {
    render(<LinearLab kind="linear-context" mode="en" />);
    enter('My candidate x', '8/3');
    click('Check original equation and conditions');
    expect(audit()).toContain(
      'Original equation: met; context conditions: not met',
    );
    enter('My candidate x', '3');
    click('Check original equation and conditions');
    expect(audit()).toContain(
      'Original equation: not met; context conditions: met',
    );
    enter('My final allowed solution', 'none');
    verify('My final allowed solution');
    expect(feedback('My final allowed solution')).toContain('Matches');
    for (const [index, value] of [
      ['2', '1/3'],
      ['3', '-3'],
      ['4', '0'],
    ]) {
      choose('Audit context', index!);
      enter('My candidate x', value!);
      click('Check original equation and conditions');
      expect(audit()).toContain('candidate accepted');
      enter('My final allowed solution', value!);
      verify('My final allowed solution');
      expect(feedback('My final allowed solution')).toContain('Matches');
    }
  });
  it('keeps every hook a question rather than displaying a solved answer', () => {
    for (const l of j73Lessons) {
      const v = render(
        <LinearHookArt
          kind={l.lab as Parameters<typeof LinearHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(v.container.textContent).toContain('?');
      v.unmount();
    }
  });
});
describe('J73 authored lesson and persistence flows', () => {
  it('renders all six English lessons with both examples and bilingual versions when requested', () => {
    for (const l of j73Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J73-L05');
    click(/03/);
    expect(
      v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
    ).toHaveLength(2);
    expect(
      v.container.querySelectorAll('.math-prose section[lang="zh"] h3'),
    ).toHaveLength(2);
  });
  it('restores exact signed and fractional numerical solutions after retrying and refreshing', () => {
    for (const [id, wrong, right] of [
      ['J73-L02', '9', '3'],
      ['J73-L03', '-7', '7'],
      ['J73-L04', '7', '8'],
      ['J73-L05', '19', '11 years'],
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
      expect(
        (
          screen.getByRole('textbox', {
            name: 'Your answer',
          }) as HTMLInputElement
        ).value,
      ).toBe(right);
      w.unmount();
    }
  });
  it('restores explicit all/none classification without confusing zero or automatically grading an explanation', () => {
    const v = mount('/math/lesson/J73-L01');
    click(/05 Practice/);
    click('Question 4');
    enter('Your answer', '0');
    check();
    enter('Your answer', 'all');
    check();
    v.unmount();
    const w = mount('/math/lesson/J73-L01');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('all');
    w.unmount();
    mount('/math/lesson/J73-L06');
    click(/04 Together/);
    enter('Your answer', '8/3');
    check();
    enter('Your answer', 'no allowed solution');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('gives original-model form feedback and restores an expanded reversed quantity equation', () => {
    const v = mount('/math/lesson/J73-L05');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', 'x=11');
    check();
    expect(
      screen.getByText(
        '↳ The solution set matches; retain the two original quantities in the modelling equation.',
      ),
    ).toBeTruthy();
    enter('Your answer', '30=2(x+4)');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J73-L05');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('30=2(x+4)');
  });
  it('requires human reasoning review and leaves unfinished practice incomplete', () => {
    mount('/math/lesson/J73-L06');
    click(/05 Practice/);
    click('Question 6');
    enter(
      'Your reasoning',
      '8/3 passes the original equality but fails the integer whole-group domain. A positive third of a centimetre is allowed; negative three Celsius is allowed. Zero pencils is a valid non-negative integer. Each candidate needs both original equality and the explicitly defined domain.',
    );
    expect(screen.queryByText('✓ Reasoning reviewed by a parent.')).toBeNull();
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J73-L06']
        .completedAt,
    ).toBeUndefined();
  });
  it('saves all eight unit-review answers including equation modelling and no contextual solution', () => {
    const v = mount('/math/unit/J73/check');
    for (const [n, value] of Object.entries({
      1: '3',
      2: '-4',
      3: '7/2',
      4: '1/3',
      5: '26=2x+6',
      6: 'none',
    })) {
      click(`Question ${n}`);
      enter('Your answer', value);
      check();
    }
    click('Question 7');
    click(/^C Multiply both sides by zero/);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'Expand every term, apply equal reversible operations using nonzero constants, then check the original. A positive fractional length can be valid; a whole-bag count must be a non-negative integer, so the same fraction may fail that context.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J73/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J73-L05'],
    ).toBeUndefined();
  });
  it('changes retrieval from an identity to a contradiction and clears old input and success evidence', () => {
    const v = mount('/math/lesson/J73-L01');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '0');
    check();
    enter('Your answer', '2');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(screen.getByText(/1\(x\+1\)=1x\+1/)).toBeTruthy();
    enter('Your answer', 'all');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J73-L01'].round).toBe(1);
    saved.sessions['J73-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(screen.getByText(/1x\+\(-1\)=1x\+\(0\)/)).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
    enter('Your answer', 'none');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
