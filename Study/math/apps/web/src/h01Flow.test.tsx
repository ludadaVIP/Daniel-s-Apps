// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LogicLab, LogicHookArt } from './LogicLabs';
import { SetRegions, UnionLine } from './LogicVisuals';
import { absoluteSolution } from './logicModels';
import { h01Lessons } from './content/H01';
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
  vi.restoreAllMocks();
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
const feedback = () =>
  screen.getByRole('status', { name: 'Prediction feedback' }).textContent;
const check = () => click(/Check answer/);
const parent = () => {
  fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
  click('Parent confirms: reasoning makes sense');
};
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
describe('H01 predictions, representation changes and conceptual boundaries', () => {
  it('preserves predictions under set reordering and distinguishes empty from singleton', () => {
    render(<LogicLab kind="logic-elements" mode="en" />);
    const inputs = screen.getAllByRole('textbox', { name: 'My prediction' });
    fireEvent.change(inputs[0]!, { target: { value: 'in' } });
    fireEvent.change(inputs[1]!, { target: { value: '3' } });
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Check prediction' })[0]!,
    );
    choose('Source list', '2,0,1');
    expect(
      (
        screen.getAllByRole('textbox', {
          name: 'My prediction',
        })[0] as HTMLInputElement
      ).value,
    ).toBe('in');
    expect(
      (
        screen.getAllByRole('textbox', {
          name: 'My prediction',
        })[1] as HTMLInputElement
      ).value,
    ).toBe('3');
    choose('Source list', '{}');
    expect(
      (
        screen.getAllByRole('textbox', {
          name: 'My prediction',
        })[0] as HTMLInputElement
      ).value,
    ).toBe('');
    click('Show/hide distinct element cards');
    expect(screen.getByText('∅')).toBeTruthy();
    choose('Relation type', 'subset');
    choose('Candidate number or subset list', '{}');
    fireEvent.change(
      screen.getAllByRole('textbox', { name: 'My prediction' })[0]!,
      { target: { value: 'subset' } },
    );
    fireEvent.click(
      screen.getAllByRole('button', { name: 'Check prediction' })[0]!,
    );
    expect(
      screen.getAllByRole('status', { name: 'Prediction feedback' })[0]!
        .textContent,
    ).toContain('matches');
  });
  it('keeps overlap in union and resets a prediction when the requested operation changes', () => {
    const v = render(<LogicLab kind="logic-operations" mode="en" />);
    enter('My prediction', '{2,4}');
    click('Check prediction');
    expect(feedback()).toContain('matches');
    click('Show/hide regions');
    expect(v.container.querySelectorAll('[data-set-region]')).toHaveLength(4);
    choose('Set operation', 'union');
    expect(field('My prediction')).toBe('');
    enter('My prediction', '{1,3}');
    click('Check prediction');
    expect(feedback()).not.toContain('matches');
    enter('My prediction', '{4,2,1,3,2}');
    click('Check prediction');
    expect(feedback()).toContain('matches');
  });
  it('recomputes complements after universe or membership changes and removes excluded elements', () => {
    render(<LogicLab kind="logic-operations" mode="en" />);
    choose('Set operation', 'complement');
    enter('My prediction', '{3,5,6}');
    click('Check prediction');
    expect(feedback()).toContain('matches');
    choose('Universe', '8');
    expect(field('My prediction')).toBe('');
    enter('My prediction', '3,5,6,7,8');
    click('Check prediction');
    expect(feedback()).toContain('matches');
    fireEvent.click(screen.getByRole('checkbox', { name: 'A: 8' }));
    expect(field('My prediction')).toBe('');
    choose('Universe', '6');
    choose('Universe', '8');
    expect(
      (screen.getByRole('checkbox', { name: 'A: 8' }) as HTMLInputElement)
        .checked,
    ).toBe(false);
  });
  it('rejects an inadmissible counterexample then accepts it after the domain changes', () => {
    render(<LogicLab kind="logic-statements" mode="en" />);
    enter('My prediction', 'true');
    click('Check prediction');
    expect(feedback()).toContain('matches');
    click('Test candidate counterexample');
    expect(
      screen.getByRole('status', { name: 'Counterexample feedback' })
        .textContent,
    ).toContain('Outside the integer domain');
    choose('Domain of x', 'reals');
    expect(field('My prediction')).toBe('');
    expect(
      screen.queryByRole('status', { name: 'Counterexample feedback' }),
    ).toBeNull();
    enter('My prediction', 'false');
    click('Check prediction');
    click('Test candidate counterexample');
    expect(
      screen.getByRole('status', { name: 'Counterexample feedback' })
        .textContent,
    ).toContain('valid counterexample');
    enter('Candidate counterexample x', '0');
    click('Test candidate counterexample');
    expect(
      screen.getByRole('status', { name: 'Counterexample feedback' })
        .textContent,
    ).toContain('not a counterexample');
  });
  it('separates commands and open sentences from unknown truth', () => {
    render(<LogicLab kind="logic-statements" mode="en" />);
    choose('Sentence', 'open');
    enter('My prediction', 'not-statement');
    click('Check prediction');
    expect(feedback()).toContain('matches');
    expect(
      screen.queryByRole('button', { name: 'Test candidate counterexample' }),
    ).toBeNull();
    choose('Sentence', 'command');
    expect(field('My prediction')).toBe('');
    enter('My prediction', 'false');
    click('Check prediction');
    expect(feedback()).not.toContain('matches');
  });
  it('reverses sufficient and necessary and audits both directions including an impossible premise', () => {
    render(<LogicLab kind="logic-conditions" mode="en" />);
    enter('My prediction', 'sufficient-only');
    click('Check prediction');
    expect(feedback()).toContain('matches');
    click('Show/hide two-direction audit');
    expect(screen.getByRole('table')).toBeTruthy();
    click('Exchange P and Q');
    expect(field('My prediction')).toBe('');
    enter('My prediction', 'necessary-only');
    click('Check prediction');
    expect(feedback()).toContain('matches');
    choose('Condition pair', '4');
    enter('My prediction', 'sufficient-only');
    click('Check prediction');
    expect(feedback()).toContain('matches');
    click('Show/hide two-direction audit');
    expect(screen.getByText(/If P has no solutions/)).toBeTruthy();
  });
  it('preserves a distance prediction under a window change but clears it for changed mathematics', () => {
    const v = render(<LogicLab kind="logic-absolute" mode="en" />);
    enter('My prediction', '(-1,5)');
    click('Check prediction');
    click('Show/hide solution');
    expect(v.container.querySelectorAll('[data-solution-part]')).toHaveLength(
      1,
    );
    click('Change line window only');
    expect(field('My prediction')).toBe('(-1,5)');
    expect(feedback()).toContain('matches');
    choose('Inequality sign', '>=');
    expect(field('My prediction')).toBe('');
    enter('My prediction', 'x<=-1 or x>=5');
    click('Check prediction');
    expect(feedback()).toContain('matches');
    click('Show/hide solution');
    expect(v.container.querySelectorAll('[data-solution-part]')).toHaveLength(
      2,
    );
    expect(
      v.container
        .querySelector('[data-endpoint="-1"]')!
        .getAttribute('data-closed'),
    ).toBe('true');
  });
  it('checks strict boundaries, negative thresholds and zero coefficients in the actual controls', () => {
    render(<LogicLab kind="logic-absolute" mode="en" />);
    click('Audit this number');
    expect(
      screen.getByRole('status', { name: 'Substitution feedback' }).textContent,
    ).toContain('Does not satisfy');
    slide('c', '-1');
    enter('My prediction', '∅');
    click('Check prediction');
    expect(feedback()).toContain('matches');
    choose('Inequality sign', '>=');
    enter('My prediction', 'ℝ');
    click('Check prediction');
    expect(feedback()).toContain('matches');
    slide('a', '0');
    slide('b', '2');
    slide('c', '2');
    choose('Inequality sign', '<=');
    enter('My prediction', 'ℝ');
    click('Check prediction');
    expect(feedback()).toContain('matches');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
  it('renders semantic SVG regions and exact two-ray endpoints in all language modes', () => {
    const v = render(
      <SetRegions mode="bilingual" u={['0', '1', '2']} a={['0']} b={['1']} />,
    );
    expect(v.container.querySelector('svg span')).toBeNull();
    expect(v.container.querySelectorAll('[data-set-region]')).toHaveLength(4);
    v.rerender(
      <UnionLine mode="bilingual" set={absoluteSolution('1', '1', '0', '>')} />,
    );
    expect(v.container.querySelectorAll('[data-solution-part]')).toHaveLength(
      2,
    );
    expect(
      v.container
        .querySelector('[data-endpoint="-1"]')!
        .getAttribute('data-closed'),
    ).toBe('false');
    v.unmount();
    for (const l of h01Lessons) {
      const h = render(
        <LogicHookArt
          kind={l.lab as Parameters<typeof LogicHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(h.container.querySelector('svg')).toBeTruthy();
      h.unmount();
      const w = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        w.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      w.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const w = mount('/math/lesson/H01-L05');
    click(/^03 .*Understand/);
    for (const lang of ['zh', 'en'])
      expect(
        w.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
});
describe('H01 formal persistence and parent-reviewed reasoning', () => {
  it('restores supported answers across all five lessons without awarding unfinished mastery', () => {
    for (const [id, wrong, right] of [
      ['H01-L01', '4', '3'],
      ['H01-L02', '{1,3}', '{2,4}'],
      ['H01-L03', 'true', 'false'],
      ['H01-L04', 'both', 'sufficient-only'],
      ['H01-L05', '[-1,5]', '(-1,5)'],
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
  it('requires actual parent review of a negation and preserves original writing on remount', () => {
    const v = mount('/math/lesson/H01-L03');
    click(/06 Reflect/);
    const text =
      'There exists an integer that is not even, witnessed by one. This does not mean every integer is odd; zero is even.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H01-L03']
        .answers['H01-L03-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H01-L03');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('records all eight unit items including two human arguments, separately from lesson mastery', () => {
    const v = mount('/math/unit/H01/check');
    for (const [n, a] of Object.entries({
      1: '3',
      2: '{2,4}',
      3: 'false',
      4: 'sufficient-only',
      5: '[-1,2]',
    })) {
      click(`Question ${n}`);
      enter('Your answer', a);
      check();
    }
    click('Question 6');
    enter(
      'Your reasoning',
      'No integer lies between zero and one, so n(n−1) is nonnegative. Half refutes the real version. Negating existence requires every integer square to differ from two.',
    );
    parent();
    click('Question 7');
    click(/^B u<−c or u>c/);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'P has an empty real truth set, so no P true and Q false counterexample exists. Zero refutes the reverse. Sufficient-only does not assert a real root of x²=−1.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H01/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H01-L01'],
    ).toBeUndefined();
  });
  it('advances a retrieval round and clears the preceding finite set', () => {
    const v = mount('/math/lesson/H01-L01');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '{0,2,4,6}');
    check();
    enter('Your answer', '{2,4,6}');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '{0}');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H01-L01'].round).toBe(1);
    saved.sessions['H01-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '{0,2}');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
