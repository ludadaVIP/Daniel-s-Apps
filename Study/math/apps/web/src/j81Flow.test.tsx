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
import { IdentityLab, IdentityHookArt } from './IdentityLabs';
import { App } from './App';
import { j81Lessons } from './content/J81';
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
const verify = (name: string) =>
  fireEvent.click(
    within(screen.getByRole('group', { name })).getByRole('button', {
      name: 'Check my expansion',
    }),
  );
const feedback = (name: string) =>
  within(screen.getByRole('group', { name })).getByRole('status', {
    name: 'Multiplication feedback',
  }).textContent;
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
const check = () => click(/Check answer/);
const name = 'My expanded and collected result';
describe('J81 structure and conserved-area workshops', () => {
  it('requires a finished monomial product and reveals all repeated factors without filling the answer', () => {
    const v = render(<IdentityLab kind="identity-monomial" mode="en" />);
    enter(name, '-6x^2*x');
    verify(name);
    expect(feedback(name)).toContain('Already equivalent');
    enter(name, '-6x^3');
    verify(name);
    expect(feedback(name)).toContain('matches');
    click('Show or hide repeated factors');
    expect(
      v.container.querySelector('[data-repeated-factors]')!.textContent,
    ).toContain('x × x × x');
    slide('First exponent', '1');
    expect(field(name)).toBe('');
    expect(v.container.querySelector('[data-repeated-factors]')).toBeNull();
    enter(name, '-6x^2');
    verify(name);
    expect(feedback(name)).toContain('matches');
  });
  it('retains different bases and a valid zero without accepting a redundant zero letter term', () => {
    render(<IdentityLab kind="identity-monomial" mode="en" />);
    fireEvent.click(screen.getByRole('checkbox'));
    enter(name, '-6x^3');
    verify(name);
    expect(feedback(name)).toContain('Recheck');
    enter(name, '-6x²y');
    verify(name);
    expect(feedback(name)).toContain('matches');
    slide('First coefficient', '0');
    enter(name, '0x²y');
    verify(name);
    expect(feedback(name)).toContain('Already equivalent');
    enter(name, '0');
    verify(name);
    expect(feedback(name)).toContain('matches');
  });
  it('reveals every outside-factor pair and resets a fractional or zero experiment', () => {
    const v = render(<IdentityLab kind="identity-distribute" mode="en" />);
    expect(v.container.querySelectorAll('[data-product-cell]')).toHaveLength(2);
    click('Reveal pair 1,1');
    click('Reveal pair 1,2');
    expect(
      screen.getByRole('button', { name: 'Reveal pair 1,2' }).textContent,
    ).toBe('6x');
    enter(name, '2x²+6x');
    verify(name);
    expect(feedback(name)).toContain('matches');
    choose('Outside-factor experiment', '2');
    expect(field(name)).toBe('');
    expect(v.container.querySelectorAll('[aria-pressed="true"]')).toHaveLength(
      0,
    );
    expect(v.container.querySelectorAll('[data-area-cell]')).toHaveLength(0);
    enter(name, '2x²-3x');
    verify(name);
    expect(feedback(name)).toContain('matches');
    choose('Outside-factor experiment', '3');
    expect(v.container.querySelectorAll('[data-product-cell]')).toHaveLength(3);
    enter(name, '0');
    verify(name);
    expect(feedback(name)).toContain('matches');
  });
  it('draws the four actual positive-length partition areas before collecting the two cross terms', () => {
    const v = render(<IdentityLab kind="identity-binomial" mode="en" />);
    expect(
      [...v.container.querySelectorAll('[data-area-value]')].map((e) =>
        Number(e.getAttribute('data-area-value')),
      ),
    ).toEqual([16, 12, 8, 6]);
    expect(v.container.querySelectorAll('[data-product-cell]')).toHaveLength(4);
    enter(name, 'x²+3x+2x+6');
    verify(name);
    expect(feedback(name)).toContain('Already equivalent');
    enter(name, 'x²+5x+6');
    verify(name);
    expect(feedback(name)).toContain('matches');
    slide('Offset a', '-2');
    expect(v.container.querySelectorAll('[data-area-cell]')).toHaveLength(0);
    expect(field(name)).toBe('');
    expect(
      screen.getByText(/negative offset calls for the signed/),
    ).toBeTruthy();
    enter(name, 'x²+x-6');
    verify(name);
    expect(feedback(name)).toContain('matches');
  });
  it('omits a cancelled middle term while retaining its two source pairs', () => {
    const v = render(<IdentityLab kind="identity-binomial" mode="en" />);
    slide('Offset a', '-3');
    click('Reveal pair 1,2');
    click('Reveal pair 2,1');
    expect(v.container.querySelectorAll('[data-product-cell]')).toHaveLength(4);
    enter(name, 'x²+3x-3x-9');
    verify(name);
    expect(feedback(name)).toContain('Already equivalent');
    enter(name, 'x²-9');
    verify(name);
    expect(feedback(name)).toContain('matches');
  });
  it('retains both square cross products and separates equality at zero from a counterexample at one', () => {
    render(<IdentityLab kind="identity-square" mode="en" />);
    enter(name, 'x²+4');
    verify(name);
    expect(feedback(name)).toContain('Recheck');
    enter(name, '(x+2)²');
    verify(name);
    expect(feedback(name)).toContain('Already equivalent');
    enter(name, 'x²+4x+4');
    verify(name);
    expect(feedback(name)).toContain('matches');
    click('Test x=0');
    expect(
      screen.getByRole('status', { name: 'Counterexample observation' })
        .textContent,
    ).toContain('does not prove');
    click('Test x=1');
    expect(
      screen.getByRole('status', { name: 'Counterexample observation' })
        .textContent,
    ).toContain('square is 9');
    expect(
      screen.getByRole('status', { name: 'Counterexample observation' })
        .textContent,
    ).toContain('disproves');
  });
  it('shows the overlap restoration for a squared difference and resets a changed sign or constant', () => {
    const v = render(<IdentityLab kind="identity-square" mode="en" />);
    click('Test x=1');
    choose('Square sign', 'minus');
    expect(
      screen.queryByRole('status', { name: 'Counterexample observation' }),
    ).toBeNull();
    expect(v.container.querySelectorAll('[data-removal-strip]')).toHaveLength(
      2,
    );
    expect(
      v.container.querySelectorAll('[data-restored-overlap]'),
    ).toHaveLength(1);
    enter(name, 'x²-4x+4');
    verify(name);
    expect(feedback(name)).toContain('matches');
    click('Test x=1');
    expect(
      screen.getByRole('status', { name: 'Counterexample observation' })
        .textContent,
    ).toContain('square is 1');
    slide('Constant b', '3');
    expect(field(name)).toBe('');
    expect(
      screen.queryByRole('status', { name: 'Counterexample observation' }),
    ).toBeNull();
    enter(name, 'x²-6x+9');
    verify(name);
    expect(feedback(name)).toContain('matches');
  });
  it('rearranges exactly the same two areas and preserves the symbolic answer when only the illustration changes', () => {
    const v = render(<IdentityLab kind="identity-difference" mode="en" />);
    const pieces = () =>
      [...v.container.querySelectorAll('[data-preserved-piece]')].map((e) => [
        e.getAttribute('data-preserved-piece'),
        e.getAttribute('data-piece-area'),
      ]);
    expect(pieces()).toEqual([
      ['A', '15'],
      ['B', '6'],
    ]);
    const before = v.container.querySelector(
      '[data-preserved-piece="B"] rect',
    )!;
    expect(Number(before.getAttribute('width'))).toBeGreaterThan(
      Number(before.getAttribute('height')),
    );
    enter(name, 'x²-4');
    verify(name);
    click('Rearrange the same two pieces');
    expect(pieces()).toEqual([
      ['A', '15'],
      ['B', '6'],
    ]);
    expect(v.container.querySelector('[data-removed-square]')).toBeNull();
    const after = v.container.querySelector('[data-preserved-piece="B"] rect')!;
    expect(Number(after.getAttribute('width'))).toBeLessThan(
      Number(after.getAttribute('height')),
    );
    slide('Illustration x only', '6');
    expect(field(name)).toBe('x²-4');
    expect(feedback(name)).toContain('matches');
    expect(pieces()).toEqual([
      ['A', '24'],
      ['B', '8'],
    ]);
    slide('Constant b', '3');
    expect(field(name)).toBe('');
    expect(
      screen.getByRole('button', { name: 'Rearrange the same two pieces' }),
    ).toBeTruthy();
  });
  it('keeps all five opening investigations as questions', () => {
    for (const l of j81Lessons) {
      const v = render(
        <IdentityHookArt
          kind={l.lab as Parameters<typeof IdentityHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(v.container.textContent).toContain('?');
      v.unmount();
    }
  });
});
describe('J81 full lesson and persistence flows', () => {
  it('renders all five English bodies and both bilingual sections with two complete examples each', () => {
    for (const l of j81Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J81-L04');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
  it('restores supported retries across all five lessons while leaving unfinished lessons incomplete', () => {
    for (const [id, wrong, right] of [
      ['J81-L01', '-6x²', '−6x³'],
      ['J81-L02', '2x²+3', '2x²+6x'],
      ['J81-L03', 'x²+6', 'x²+5x+6'],
      ['J81-L04', 'x²+9', 'x²+6x+9'],
      ['J81-L05', 'x²+9', 'x²-9'],
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
  it('recognises an equivalent unfinished monomial as a form retry rather than a false relationship', () => {
    const v = mount('/math/lesson/J81-L01');
    click(/04 Together/);
    enter('Your answer', '(-2x²)(3x)');
    check();
    expect(
      screen.getByText('↳ The value matches; finish the requested form.'),
    ).toBeTruthy();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '-6x³');
    check();
    v.unmount();
    mount('/math/lesson/J81-L01');
    expect(field('Your answer')).toBe('-6x³');
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('accepts a completed fractional coefficient and restores its actual Unicode representation', () => {
    const v = mount('/math/lesson/J81-L04');
    click(/05 Practice/);
    click('Question 5');
    enter('Your answer', 'x²/4+2x+4');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J81-L04');
    expect(field('Your answer')).toBe('x²/4+2x+4');
  });
  it('requires parent review of derivation and geometric assumptions without completing unworked practice', () => {
    mount('/math/lesson/J81-L05');
    click(/05 Practice/);
    click('Question 6');
    enter(
      'Your reasoning',
      'The four products are A²,-AB,+AB,-B². Opposite cross terms cancel. A squared difference has two negative cross terms. For x>b>0, two remaining pieces have areas x(x-b) and b(x-b); rotate the second without stretching. The algebraic proof extends to all real inputs and does not depend on finite test values.',
    );
    expect(screen.queryByText('✓ Reasoning reviewed by a parent.')).toBeNull();
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J81-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('records and restores eight independent unit-check answers without creating lesson completion', () => {
    const v = mount('/math/unit/J81/check');
    for (const [n, input] of Object.entries({
      1: '6x²y',
      2: '-2x²+8x',
      3: 'x²-3x-4',
      4: '4x²-4x+1',
      5: '9x²-16',
      6: '9996',
    })) {
      click(`Question ${n}`);
      enter('Your answer', input);
      check();
    }
    click('Question 7');
    click(/^B /);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'The three results are x²+4x+4, x²-4x+4 and x²-4. Same-sign cross terms add in squares; opposite cross terms cancel in conjugates. The positive-length diagrams need their own domain, while distribution proves identities. A counterexample disproves a claim but a few agreements cannot prove one.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J81/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J81-L05'],
    ).toBeUndefined();
  });
  it('changes square retrieval coefficients and clears previous input and success evidence', () => {
    const v = mount('/math/lesson/J81-L04');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', 'x²-16');
    check();
    enter('Your answer', 'x²-8x+16');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', 'x²+2x+1');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J81-L04'].round).toBe(1);
    saved.sessions['J81-L04'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '4x²-4x+1');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
