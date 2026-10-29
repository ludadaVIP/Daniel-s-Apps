// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QuadraticLab, QuadraticHookArt } from './QuadraticLabs';
import { CompletingArea, QuadraticGraph } from './QuadraticVisuals';
import { j92Lessons } from './content/J92';
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
const task = 'My quadratic conclusion',
  submit = () => click(`Check: ${task}`),
  feedback = () =>
    screen.getByRole('status', { name: `${task} feedback` }).textContent;
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
describe('J92 six experiments and original equation checks', () => {
  it('requires complete roots, retains answers through graph changes and resets changed equations', () => {
    const v = render(<QuadraticLab kind="quadratic-meaning" mode="en" />);
    enter(task, '2');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '3,2');
    submit();
    click('Show or hide zero audit');
    click('Change graph window');
    expect(field(task)).toBe('3,2');
    expect(feedback()).toContain('matches');
    expect(v.container.querySelectorAll('[data-quadratic-zero]')).toHaveLength(
      2,
    );
    choose('Original equation case', '4');
    expect(field('Equation type after collecting')).toBe('');
    expect(screen.queryByRole('textbox', { name: task })).toBeNull();
    enter('Equation type after collecting', 'linear');
    click('Check: Equation type after collecting');
    expect(
      screen.getByRole('status', {
        name: 'Equation type after collecting feedback',
      }).textContent,
    ).toContain('matches');
  });
  it('checks factor identity, nonzero right sides and a retained zero root', () => {
    render(<QuadraticLab kind="quadratic-factor" mode="en" />);
    choose('Factoring solution case', '1');
    enter('Factored zero expression', 'x(x-3)');
    click('Check factors against the original');
    expect(
      screen.getByRole('status', { name: 'Factoring solution feedback' })
        .textContent,
    ).toContain('matches');
    enter(task, '3');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '0,3');
    submit();
    expect(feedback()).toContain('matches');
    choose('Factoring solution case', '4');
    expect(field(task)).toBe('');
    enter(task, '0,3');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '-1,4');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('requires dependent completing steps and keeps illustration changes separate from equation changes', () => {
    const v = render(<QuadraticLab kind="quadratic-complete" mode="en" />);
    click('Take all real branches');
    expect(
      screen.getByRole('status', { name: 'Completing dependency feedback' }),
    ).toBeTruthy();
    expect(v.container.querySelectorAll('[data-completing-step]')).toHaveLength(
      0,
    );
    enter('Completing term to add', '9');
    click('Check: Completing term to add');
    click('Add completing term to both sides');
    click('Rewrite as a complete square');
    click('Take all real branches');
    expect(v.container.querySelectorAll('[data-completing-step]')).toHaveLength(
      3,
    );
    enter(task, '-7,1');
    submit();
    slide('Illustration x only', '5');
    expect(field(task)).toBe('-7,1');
    expect(feedback()).toContain('matches');
    click('Undo final completing step');
    expect(v.container.querySelectorAll('[data-completing-step]')).toHaveLength(
      2,
    );
    choose('Completing-square case', '1');
    expect(field(task)).toBe('');
    expect(field('Completing term to add')).toBe('');
    expect(v.container.querySelectorAll('[data-completing-step]')).toHaveLength(
      0,
    );
    enter(task, '(-3±√13)/2');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('does not fabricate negative-width area pieces or real roots of a negative square', () => {
    const v = render(<QuadraticLab kind="quadratic-complete" mode="en" />);
    choose('Completing-square case', '2');
    expect(v.container.querySelector('[data-complete-piece]')).toBeNull();
    enter(task, '2±√5');
    submit();
    expect(feedback()).toContain('matches');
    choose('Completing-square case', '3');
    click('Take all real branches');
    expect(
      screen.getByRole('status', { name: 'Completing dependency feedback' })
        .textContent,
    ).toContain('none for a negative target');
    click('Add completing term to both sides');
    click('Rewrite as a complete square');
    click('Take all real branches');
    expect(v.container.textContent).toContain('no real roots');
    enter(task, '∅');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('constructs two nonoverlapping equal-scale strips and a real square corner', () => {
    const v = render(<CompletingArea source="x²+6x=7" mode="en" xValue={2} />),
      square = v.container.querySelector('[data-complete-piece="square"]')!,
      right = v.container.querySelector('[data-complete-piece="right"]')!,
      bottom = v.container.querySelector('[data-complete-piece="bottom"]')!,
      corner = v.container.querySelector('[data-completing-corner]')!;
    const n = (e: Element, k: string) => Number(e.getAttribute(k));
    expect(n(right, 'x')).toBeCloseTo(n(square, 'x') + n(square, 'width'));
    expect(n(bottom, 'y')).toBeCloseTo(n(square, 'y') + n(square, 'height'));
    expect(n(right, 'width') / 3).toBeCloseTo(n(square, 'width') / 2);
    expect(n(bottom, 'height')).toBeCloseTo(n(right, 'width'));
    expect(n(corner, 'width')).toBe(n(corner, 'height'));
    expect(n(corner, 'x')).toBe(n(right, 'x'));
    expect(n(corner, 'y')).toBe(n(bottom, 'y'));
    expect(corner.getAttribute('fill')).toBe('none');
    v.rerender(<CompletingArea source="x²+6x=7" mode="en" xValue={2} filled />);
    expect(
      v.container
        .querySelector('[data-completing-corner]')!
        .getAttribute('fill'),
    ).not.toBe('none');
    expect(v.container.textContent).toContain('p²=9');
  });
  it('reveals the formula derivation, handles negative a and classifies a=0', () => {
    const v = render(<QuadraticLab kind="quadratic-formula" mode="en" />);
    enter(task, '(3±√5)/2');
    submit();
    expect(feedback()).toContain('matches');
    for (let i = 0; i < 4; i++) click('Next formula derivation');
    expect(v.container.querySelectorAll('[data-formula-step]')).toHaveLength(4);
    expect(v.container.textContent).toContain('2|a|');
    click('Undo formula derivation');
    expect(v.container.querySelectorAll('[data-formula-step]')).toHaveLength(3);
    slide('Coefficient a', '-2');
    slide('Coefficient b', '3');
    slide('Coefficient c', '2');
    expect(field(task)).toBe('');
    expect(v.container.querySelectorAll('[data-formula-step]')).toHaveLength(0);
    enter(task, '2,-1/2');
    submit();
    expect(feedback()).toContain('matches');
    slide('Coefficient a', '0');
    expect(
      screen.queryByRole('button', { name: 'Next formula derivation' }),
    ).toBeNull();
    enter(task, 'linear');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('counts positive, zero and negative discriminants and reveals off-window roots only in the wider view', () => {
    const v = render(<QuadraticLab kind="quadratic-discriminant" mode="en" />);
    enter(task, '2');
    submit();
    expect(feedback()).toContain('matches');
    slide('Constant c', '1');
    expect(field(task)).toBe('');
    enter(task, '2');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '1');
    submit();
    click('Show or hide discriminant audit');
    expect(v.container.querySelectorAll('[data-quadratic-zero]')).toHaveLength(
      1,
    );
    slide('Constant c', '2');
    enter(task, '0');
    submit();
    expect(feedback()).toContain('matches');
    choose('Discriminant case', '1');
    click('Show or hide discriminant audit');
    expect(v.container.querySelectorAll('[data-quadratic-zero]')).toHaveLength(
      0,
    );
    enter(task, '2');
    submit();
    click('Change graph window');
    expect(field(task)).toBe('2');
    expect(v.container.querySelectorAll('[data-quadratic-zero]')).toHaveLength(
      2,
    );
    choose('Discriminant case', '2');
    enter(task, 'linear');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('separates model form, equality audit and positive-width admissibility', () => {
    render(<QuadraticLab kind="quadratic-apply" mode="en" />);
    enter('My original quadratic model', 'x²+3x-40=0');
    click('Check: My original quadratic model');
    expect(
      screen.getByRole('status', {
        name: 'My original quadratic model feedback',
      }).textContent,
    ).toContain('solution set matches');
    enter('My original quadratic model', '40=x²+3x');
    click('Check: My original quadratic model');
    expect(
      screen.getByRole('status', {
        name: 'My original quadratic model feedback',
      }).textContent,
    ).toContain('conclusion matches');
    enter('Candidate for original equation and domain', '-8');
    click('Check original equation and domain');
    expect(
      screen.getByRole('status', { name: 'Candidate double audit' })
        .textContent,
    ).toContain('equation passes');
    expect(
      screen.getByRole('status', { name: 'Candidate double audit' })
        .textContent,
    ).toContain('Context fails');
    enter(task, '-8,5');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '5');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('distinguishes no integer arrangement from no real roots and resets all tasks on context change', () => {
    render(<QuadraticLab kind="quadratic-apply" mode="en" />);
    enter(task, '5');
    choose('Quadratic application case', '1');
    expect(field(task)).toBe('');
    expect(field('My original quadratic model')).toBe('');
    expect(field('Candidate for original equation and domain')).toBe('');
    enter('Candidate for original equation and domain', '√10/2');
    click('Check original equation and domain');
    expect(
      screen.getByRole('status', { name: 'Candidate double audit' })
        .textContent,
    ).toContain('equation passes');
    expect(
      screen.getByRole('status', { name: 'Candidate double audit' })
        .textContent,
    ).toContain('Context fails');
    enter(task, '∅');
    submit();
    expect(feedback()).toContain('matches');
    click('Show or hide original-model root audit');
    expect(
      screen.getByRole('status', { name: 'Quadratic model audit' }).textContent,
    ).toContain('does not mean no algebraic real roots');
    choose('Quadratic application case', '2');
    enter(task, '1');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('uses one marker for a repeated root and all-real text for an identity', () => {
    const v = render(<QuadraticGraph source="(x-2)²=0" mode="en" shown />);
    expect(v.container.querySelectorAll('[data-quadratic-zero]')).toHaveLength(
      1,
    );
    expect(v.container.querySelector('clipPath')).toBeTruthy();
    v.rerender(<QuadraticGraph source="x²=x²" mode="en" shown />);
    expect(v.container.querySelectorAll('[data-quadratic-zero]')).toHaveLength(
      0,
    );
    expect(v.container.textContent).toContain('every real number');
  });
  it('renders six question hooks and every English/bilingual worked example', () => {
    for (const l of j92Lessons) {
      const v = render(
        <QuadraticHookArt
          kind={l.lab as Parameters<typeof QuadraticHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(v.container.textContent).toContain('?');
      v.unmount();
      const w = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        w.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      w.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J92-L04');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
});
describe('J92 formal answer persistence and human reasoning', () => {
  it('restores retries in all six lessons without completing unfinished courses', () => {
    for (const [id, wrong, right] of [
      ['J92-L01', '2', '3,2'],
      ['J92-L02', '3', '0,3'],
      ['J92-L03', '3', '9'],
      ['J92-L04', '3±√5', '(3±√5)/2'],
      ['J92-L05', '1', '2'],
      ['J92-L06', 'x=5', '40=x(x+3)'],
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
  it('gives a form-specific hint for an equivalent zero model, then saves the accepted original equation', () => {
    const v = mount('/math/lesson/J92-L06');
    click(/04 Together/);
    enter('Your answer', 'x²+3x-40=0');
    check();
    expect(
      screen.getByText(
        '↳ The solution set matches; retain the two original quantities in the modelling equation.',
      ),
    ).toBeTruthy();
    enter('Your answer', 'x²+3x=40');
    check();
    v.unmount();
    mount('/math/lesson/J92-L06');
    expect(field('Your answer')).toBe('x²+3x=40');
  });
  it('keeps negative-a and contextual explanations human-reviewed and restores their writing', () => {
    for (const [id, step, question, text] of [
      [
        'J92-L04',
        /05 Practice/,
        'Question 6',
        'The square-root denominator is two times absolute a. Negative a swaps both branches; it does not make absolute a equal a.',
      ],
      [
        'J92-L06',
        /06 Reflect/,
        null,
        'Model x(x+1)=2 with positive x. Roots one and minus two both satisfy area two; only one is a positive width, giving one cm by two cm.',
      ],
    ] as const) {
      const v = mount(`/math/lesson/${id}`);
      click(step);
      if (question) click(question);
      enter('Your reasoning', text);
      expect(
        screen.queryByText('✓ Reasoning reviewed by a parent.'),
      ).toBeNull();
      parent();
      v.unmount();
      const w = mount(`/math/lesson/${id}`);
      expect(field('Your reasoning')).toBe(text);
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id].completedAt,
      ).toBeUndefined();
      w.unmount();
    }
  });
  it('records and restores all eight unit answers with two separate parent reviews', () => {
    const v = mount('/math/unit/J92/check');
    for (const [n, raw] of Object.entries({
      1: 'linear',
      2: '0,5',
      3: '-2±√5',
      4: '2,-1/2',
      5: '1',
    })) {
      click(`Question ${n}`);
      enter('Your answer', raw);
      check();
    }
    click('Question 6');
    enter(
      'Your reasoning',
      'Real roots exist but neither is a nonnegative integer. Rounding to two uses eight cards instead of five.',
    );
    parent();
    click('Question 7');
    click(/^B /);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'For x(x+3)=40 require positive width. Zero form has discriminant 169 and roots five and minus eight. Both pass the equation but only five passes the domain, giving width five metres.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J92/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J92-L06'],
    ).toBeUndefined();
  });
  it('advances retrieval rounds without carrying the old answer or success feedback', () => {
    const v = mount('/math/lesson/J92-L03');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '1');
    check();
    enter('Your answer', '-7,1');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '1');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J92-L03'].round).toBe(1);
    saved.sessions['J92-L03'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '-2±√6');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
