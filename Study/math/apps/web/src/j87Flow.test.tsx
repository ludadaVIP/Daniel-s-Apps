// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { PythagoreanLab, PythagoreanHookArt } from './PythagoreanLabs';
import { j87Lessons } from './content/J87';
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
const task = 'My transformation or length conclusion';
const submit = () => click('Check this conclusion');
const feedback = () =>
  screen.getByRole('status', { name: 'Transformation and Pythagoras feedback' })
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
describe('J87 transformations, dissection and premise-sensitive investigations', () => {
  it('preserves writing on display changes and clears it when the translation changes', () => {
    const v = render(<PythagoreanLab kind="pyth-translate" mode="en" />);
    expect(v.container.querySelector('[data-rigid-image]')).toBeNull();
    enter(task, '(0,0)');
    submit();
    expect(feedback()).toContain('matches');
    click('Show or hide the first image');
    click('Change equal-unit window');
    expect(field(task)).toBe('(0,0)');
    expect(feedback()).toContain('matches');
    expect(v.container.querySelector('[data-rigid-image]')).toBeTruthy();
    slide('Horizontal translation', '-3');
    expect(field(task)).toBe('');
    expect(v.container.querySelector('[data-rigid-image]')).toBeNull();
    enter(task, '(-5,0)');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('uses the actual reflection axis and retains coincident source/image labels', () => {
    const v = render(<PythagoreanLab kind="pyth-translate" mode="en" />);
    for (const [rule, answer] of [
      ['x-axis', '(-2,1)'],
      ['y-axis', '(2,-1)'],
      ['x=1', '(4,-1)'],
      ['y=x', '(-1,-2)'],
    ]) {
      choose('Translation or reflection rule', rule!);
      enter(task, answer!);
      submit();
      expect(feedback()).toContain('matches');
    }
    choose('Translation or reflection rule', 'y-axis');
    choose('Vertex whose image is requested', '1');
    enter(task, '(0,-1)');
    submit();
    click('Show or hide the first image');
    expect(feedback()).toContain('matches');
    expect(
      [...v.container.querySelectorAll('[data-transform-label]')].some(
        (e) => e.textContent?.includes('B') && e.textContent.includes('B′'),
      ),
    ).toBe(true);
  });
  it('rotates around the selected centre and distinguishes the first image from two half-turns', () => {
    render(<PythagoreanLab kind="pyth-rotate" mode="en" />);
    enter(task, '(1,-2)');
    submit();
    expect(feedback()).toContain('matches');
    choose('Rotation centre', '1');
    expect(field(task)).toBe('');
    enter(task, '(3,-2)');
    submit();
    expect(feedback()).toContain('matches');
    choose('Rotation direction and angle', '2');
    enter(task, '(4,3)');
    submit();
    click('Check two half-turns about the same centre');
    expect(
      screen.getByRole('status', { name: 'Two half-turns' }).textContent,
    ).toContain('(-2, -1) → (4, 3) → (-2, -1)');
    expect(field(task)).toBe('(4,3)');
    expect(feedback()).toContain('matches');
    choose('Rotation direction and angle', '3');
    expect(screen.queryByRole('status', { name: 'Two half-turns' })).toBeNull();
    enter(task, '(-1,4)');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('provides a square equal-unit board and a focusable local scrolling region', () => {
    const v = render(<PythagoreanLab kind="pyth-rotate" mode="en" />);
    const svg = v.container.querySelector('svg')!;
    const bounds = svg.getAttribute('viewBox')!.split(' ').map(Number);
    expect(bounds[2]).toBe(bounds[3]);
    expect(
      screen
        .getByRole('region', {
          name: 'Transformation or area diagram; scroll locally',
        })
        .getAttribute('tabindex'),
    ).toBe('0');
    click('Show or hide the first image');
    expect(
      v.container
        .querySelector('[data-rigid-image]')!
        .getAttribute('stroke-dasharray'),
    ).toBe('7 4');
  });
  it('rearranges the same four pieces, exposes square-gap reasoning and reverses the justification steps', () => {
    const v = render(<PythagoreanLab kind="pyth-proof" mode="en" />);
    expect(v.container.querySelectorAll('[data-puzzle-piece]')).toHaveLength(4);
    enter(task, '5');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '25');
    submit();
    click('Rearrange or restore the same four pieces');
    expect(v.container.querySelectorAll('[data-puzzle-piece]')).toHaveLength(8);
    expect(v.container.querySelectorAll('[data-puzzle-gap]')).toHaveLength(3);
    for (let i = 0; i < 3; i++) click('Next area justification');
    expect(v.container.querySelectorAll('[data-area-step]')).toHaveLength(3);
    expect(
      v.container.querySelector('[data-area-step="1"]')!.textContent,
    ).toContain('right angles');
    click('Undo area justification');
    expect(v.container.querySelectorAll('[data-area-step]')).toHaveLength(2);
    expect(field(task)).toBe('25');
    expect(feedback()).toContain('matches');
    slide('Leg a', '2');
    expect(field(task)).toBe('');
    expect(v.container.querySelectorAll('[data-area-step]')).toHaveLength(0);
    expect(v.container.querySelectorAll('[data-puzzle-piece]')).toHaveLength(4);
    enter(task, '20');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('solves both kinds of unknown side and retains answers while revealing the equation', () => {
    render(<PythagoreanLab kind="pyth-apply" mode="en" />);
    enter(task, '5');
    submit();
    click('Show or hide the equation audit');
    expect(field(task)).toBe('5');
    expect(feedback()).toContain('matches');
    choose('Right-angle and length case', '1');
    expect(field(task)).toBe('');
    enter(task, 'sqrt(194)');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, '12');
    submit();
    expect(feedback()).toContain('matches');
    click('Show or hide the equation audit');
    expect(
      screen.getByRole('status', { name: 'Pythagorean equation audit' })
        .textContent,
    ).toContain('13²−(5)²=144');
  });
  it('accepts exact radical and fractional lengths while rejecting truncated or negative roots', () => {
    render(<PythagoreanLab kind="pyth-apply" mode="en" />);
    choose('Right-angle and length case', '2');
    for (const raw of ['3.61', '-√13']) {
      enter(task, raw);
      submit();
      expect(feedback()).not.toContain('matches');
    }
    enter(task, 'sqrt(13)');
    submit();
    expect(feedback()).toContain('matches');
    choose('Right-angle and length case', '3');
    enter(task, '5/4');
    submit();
    expect(feedback()).toContain('matches');
    click('Show or hide the equation audit');
    expect(
      screen.getByRole('status', { name: 'Pythagorean equation audit' })
        .textContent,
    ).toContain('(3/4)²+(1)²=25/16');
  });
  it('does not supply a right angle when only two side lengths are given', () => {
    const v = render(<PythagoreanLab kind="pyth-apply" mode="en" />);
    choose('Right-angle and length case', '4');
    expect(v.container.querySelector('[data-right-angle]')).toBeNull();
    enter(task, '5');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, 'insufficient');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('sorts sides, reveals the converse only on request and resets the conclusion on side edits', () => {
    const v = render(<PythagoreanLab kind="pyth-converse" mode="en" />);
    expect(v.container.querySelector('[data-right-angle]')).toBeNull();
    enter(task, 'right');
    submit();
    click('Show or hide the side test');
    expect(v.container.querySelector('[data-right-angle]')).toBeTruthy();
    expect(
      screen.getByRole('status', { name: 'Converse audit' }).textContent,
    ).toContain('3 ≤ 4 ≤ 5');
    enter('Input side 1', '2');
    expect(field(task)).toBe('');
    expect(v.container.querySelector('[data-right-angle]')).toBeNull();
    enter(task, 'obtuse');
    submit();
    expect(feedback()).toContain('matches');
    enter('Input side 1', '1');
    enter('Input side 2', '2');
    enter('Input side 3', '3');
    expect(v.container.querySelector('svg')).toBeNull();
    enter(task, 'impossible');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('handles exact fractions, thin triangles and invalid inputs without inventing geometry', () => {
    const v = render(<PythagoreanLab kind="pyth-converse" mode="en" />);
    for (const [i, s] of ['3/5', '1', '4/5'].entries())
      enter(`Input side ${i + 1}`, s);
    enter(task, 'right');
    submit();
    expect(feedback()).toContain('matches');
    for (const [i, s] of ['0.000000000001', '1', '1'].entries())
      enter(`Input side ${i + 1}`, s);
    enter(task, 'acute');
    submit();
    expect(feedback()).toContain('matches');
    expect(v.container.textContent).toMatch(/resolution/);
    enter('Input side 1', 'x');
    expect(screen.queryByRole('textbox', { name: task })).toBeNull();
    expect(v.container.textContent).toContain('three valid numbers');
  });
  it('opens each lesson with a question', () => {
    for (const l of j87Lessons) {
      const v = render(
        <PythagoreanHookArt
          kind={l.lab as Parameters<typeof PythagoreanHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(v.container.textContent).toContain('?');
      v.unmount();
    }
  });
});
describe('J87 formal lessons, persistence and human reasoning', () => {
  it('renders five English bodies and two examples in each bilingual section', () => {
    for (const l of j87Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J87-L03');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
  it('restores supported retries and exact original writing without completing unworked lessons', () => {
    for (const [id, wrong, right] of [
      ['J87-L01', '(1,1)', '(1,-1)'],
      ['J87-L02', '(1,2)', '(-1,2)'],
      ['J87-L03', '5', '25'],
      ['J87-L04', '7', '5'],
      ['J87-L05', 'obtuse', 'right'],
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
  it('persists exact root input after a rejected approximation', () => {
    const v = mount('/math/lesson/J87-L04');
    click(/05 Practice/);
    click('Question 3');
    enter('Your answer', '3.61');
    check();
    enter('Your answer', 'sqrt(13)');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J87-L04');
    expect(field('Your answer')).toBe('sqrt(13)');
  });
  it('leaves square-gap and converse arguments for human review rather than matching keywords', () => {
    for (const [id, n, text] of [
      [
        'J87-L03',
        '4',
        'Congruent right triangles have complementary acute angles; the central four sides are c and its angles are right, so the gap is a square.',
      ],
      [
        'J87-L05',
        '5',
        'Construct a separate right triangle with legs a,b. The forward theorem gives hypotenuse c; SSS matches it to the given triangle, then the corresponding angle is right.',
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
      expect(
        screen.getByText('✓ Reasoning reviewed by a parent.'),
      ).toBeTruthy();
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
  it('records eight unit items with radical equivalence and separate proof reviews', () => {
    const v = mount('/math/unit/J87/check');
    for (const [n, value] of Object.entries({
      1: '(-1,2)',
      2: '(-1,-3)',
      3: '8',
      4: '2√5',
      5: 'obtuse',
    })) {
      click(`Question ${n}`);
      enter('Your answer', value);
      check();
    }
    click('Question 6');
    enter(
      'Your reasoning',
      'First check existence. Construct a right triangle, apply the forward theorem and then SSS to transfer its right angle.',
    );
    parent();
    click('Question 7');
    click(/^C /);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'Name the transformation centre and direction; check a right angle, identify the hypotenuse, retain exact roots and reject degenerate side triples before applying the converse.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J87/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J87-L05'],
    ).toBeUndefined();
  });
  it('generates a new root retrieval question without retaining the preceding answer', () => {
    const v = mount('/math/lesson/J87-L04');
    click(/05 Practice/);
    click('Question 3');
    enter('Your answer', '3.61');
    check();
    enter('Your answer', '√13');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '√2');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J87-L04'].round).toBe(1);
    saved.sessions['J87-L04'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '2√2');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
