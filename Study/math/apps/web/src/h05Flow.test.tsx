// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { VectorLab, VectorHookArt } from './VectorLabs';
import { VectorPlot, originPoint } from './VectorVisuals';
import { readVector, vectorZero } from './vectorModels';
import { h05Lessons } from './content/H05';
import { t } from './model';
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
describe('H05 vector workbenches and learning evidence', () => {
  it('separates vector value from arrow position and uses equal horizontal and vertical units', () => {
    const v = render(<VectorLab kind="vector-meaning" mode="en" />);
    enter('Predict equality (equal/different)', 'equal');
    check('Predict equality (equal/different)');
    enter('Predict direction relation', 'same-direction');
    check('Predict direction relation');
    enter('Predict magnitude of u', '5');
    check('Predict magnitude of u');
    select('Tail of arrow v', '(2,-1)');
    expect(field('Predict equality (equal/different)')).toBe('equal');
    expect(field('Predict direction relation')).toBe('same-direction');
    expect(field('Predict magnitude of u')).toBe('5');
    expect(
      v.container
        .querySelector('[data-vector-arrow="v"]')
        ?.getAttribute('data-vector-tail'),
    ).toBe('(2, -1)');
    const numbers =
      (
        v.container
          .querySelector('[data-vector-arrow="u"]')
          ?.getAttribute('d') ?? ''
      )
        .match(/-?\d+(?:\.\d+)?/g)
        ?.map(Number) ?? [];
    expect(numbers).toHaveLength(4);
    expect((numbers[2]! - numbers[0]!) / (numbers[1]! - numbers[3]!)).toBe(
      0.75,
    );
    select('Comparison case', 'scaled');
    expect(field('Predict equality (equal/different)')).toBe('');
    expect(field('Predict magnitude of u')).toBe('5');
    enter('Predict equality (equal/different)', 'different');
    check('Predict equality (equal/different)');
    expect(feedback('Predict equality (equal/different)')).toContain('matches');
  });
  it('compares zero vectors as equal without inventing their direction or a nonzero arrow', () => {
    const v = render(<VectorLab kind="vector-meaning" mode="en" />);
    select('Comparison case', 'zero');
    enter('Predict equality (equal/different)', 'equal');
    check('Predict equality (equal/different)');
    enter('Predict direction relation', 'undefined');
    check('Predict direction relation');
    expect(feedback('Predict equality (equal/different)')).toContain('matches');
    expect(feedback('Predict direction relation')).toContain('matches');
    expect(v.container.querySelectorAll('[data-zero-vector]')).toHaveLength(2);
    expect(v.container.querySelectorAll('[data-vector-arrow]')).toHaveLength(0);
    select('Comparison case', 'other');
    enter('Predict equality (equal/different)', 'different');
    check('Predict equality (equal/different)');
    enter('Predict direction relation', 'not-parallel');
    check('Predict direction relation');
    expect(feedback('Predict direction relation')).toContain('matches');
  });
  it('preserves sums across route order and translation while resetting only endpoint position', () => {
    const v = render(<VectorLab kind="vector-addition" mode="en" />);
    enter('Predict result vector', '(2,6)');
    enter('Predict final position from A', '(2,6)');
    select('Head-to-tail order', 'vu');
    expect(field('Predict result vector')).toBe('(2,6)');
    expect(field('Predict final position from A')).toBe('(2,6)');
    select('Start A', '(-3,-2)');
    expect(field('Predict result vector')).toBe('(2,6)');
    expect(field('Predict final position from A')).toBe('');
    enter('Predict final position from A', '(-1,4)');
    check('Predict final position from A');
    expect(feedback('Predict final position from A')).toContain('matches');
    expect(
      v.container
        .querySelector('[data-vector-arrow="u+v"]')
        ?.getAttribute('data-vector-value'),
    ).toBe('(2, 6)');
    click('Show/hide exact audit');
    click('Change window');
    expect(field('Predict result vector')).toBe('(2,6)');
  });
  it('draws u−v from the head of v to u and handles a zero resultant without removing the journey', () => {
    const v = render(<VectorLab kind="vector-addition" mode="en" />);
    select('Operation', 'subtract');
    enter('Predict result vector', '(4,-2)');
    check('Predict result vector');
    expect(feedback('Predict result vector')).toContain('matches');
    const arrow = v.container.querySelector('[data-vector-arrow="u-v"]');
    expect(arrow?.getAttribute('data-vector-tail')).toBe('(-1, 4)');
    expect(arrow?.getAttribute('data-vector-head')).toBe('(3, 2)');
    select('Operation', 'add');
    select('Displacement case', 'cancel');
    enter('Predict result vector', '(0,0)');
    check('Predict result vector');
    expect(feedback('Predict result vector')).toContain('matches');
    expect(v.container.querySelector('[data-zero-vector="u+v"]')).toBeTruthy();
    expect(v.container.querySelectorAll('[data-vector-arrow]')).toHaveLength(2);
  });
  it('scales every component, keeps magnitude nonnegative and treats zero sources separately', () => {
    const v = render(<VectorLab kind="vector-scaling" mode="en" />);
    enter('Predict ku', '(-6,2)');
    check('Predict ku');
    enter('Predict |ku|', '2sqrt(10)');
    check('Predict |ku|');
    expect(feedback('Predict |ku|')).toContain('matches');
    select('Scalar k', '-1/2');
    enter('Predict ku', '(-3/2,1/2)');
    check('Predict ku');
    enter('Predict |ku|', 'sqrt(10)/2');
    check('Predict |ku|');
    enter('Predict direction of ku relative to u', 'opposite-direction');
    check('Predict direction of ku relative to u');
    expect(feedback('Predict ku')).toContain('matches');
    expect(feedback('Predict |ku|')).toContain('matches');
    select('Source vector u', '(0,0)');
    enter('Predict ku', '(0,0)');
    check('Predict ku');
    enter('Predict direction of ku relative to u', 'undefined');
    check('Predict direction of ku relative to u');
    expect(feedback('Predict direction of ku relative to u')).toContain(
      'matches',
    );
    expect(v.container.querySelectorAll('[data-vector-arrow]')).toHaveLength(0);
  });
  it('distinguishes moving midpoints from unchanged differences and reverses only the directed task', () => {
    const v = render(<VectorLab kind="vector-components" mode="en" />);
    enter('Predict current vector components', '(5,3)');
    enter('Predict current midpoint position', '(1/2,5/2)');
    select('Common translation t', '(2,-1)');
    expect(field('Predict current vector components')).toBe('(5,3)');
    expect(field('Predict current midpoint position')).toBe('');
    enter('Predict current midpoint position', '(5/2,3/2)');
    check('Predict current midpoint position');
    expect(feedback('Predict current midpoint position')).toContain('matches');
    select('Arrow direction', 'BA');
    expect(field('Predict current vector components')).toBe('');
    expect(field('Predict current midpoint position')).toBe('(5/2,3/2)');
    enter('Predict current vector components', '(-5,-3)');
    check('Predict current vector components');
    expect(feedback('Predict current vector components')).toContain('matches');
    expect(
      v.container
        .querySelector('[data-vector-arrow="BA"]')
        ?.getAttribute('data-vector-tail'),
    ).toBe('(5, 3)');
    select('Original endpoint B', '(-2,1)');
    expect(v.container.querySelector('[data-zero-vector="BA"]')).toBeTruthy();
  });
  it('separates scalar dot products from angles and preserves strict zero/straight endpoint classes', () => {
    render(<VectorLab kind="vector-dot" mode="en" />);
    enter('Predict u·v (scalar)', '0');
    check('Predict u·v (scalar)');
    enter('Predict cosθ (zero vector: undefined)', '0');
    check('Predict cosθ (zero vector: undefined)');
    enter('Predict angle class', 'right');
    check('Predict angle class');
    expect(feedback('Predict angle class')).toContain('matches');
    select('Vector v', '(2,1)');
    enter('Predict angle class', 'acute');
    check('Predict angle class');
    expect(feedback('Predict angle class')).not.toContain('matches');
    enter('Predict angle class', 'zero-angle');
    check('Predict angle class');
    expect(feedback('Predict angle class')).toContain('matches');
    select('Vector v', '(-2,-1)');
    enter('Predict angle class', 'straight');
    check('Predict angle class');
    expect(feedback('Predict angle class')).toContain('matches');
    select('Vector u', '(0,0)');
    enter('Predict u·v (scalar)', '0');
    check('Predict u·v (scalar)');
    enter('Predict cosθ (zero vector: undefined)', 'undefined');
    check('Predict cosθ (zero vector: undefined)');
    enter('Predict angle class', 'undefined');
    check('Predict angle class');
    expect(feedback('Predict u·v (scalar)')).toContain('matches');
    expect(feedback('Predict cosθ (zero vector: undefined)')).toContain(
      'matches',
    );
  });
  it('keeps a translated shape class but resets vertex positions and rejects collinear degeneracy', () => {
    const v = render(<VectorLab kind="vector-geometry" mode="en" />);
    select('Adjacent-side case', 'square');
    enter('Predict fourth vertex C', '(0,3)');
    enter('Predict common diagonal midpoint', '(-1,1)');
    enter('Predict most specific shape class', 'square');
    check('Predict most specific shape class');
    select('Common site translation', '(2,-1)');
    expect(field('Predict most specific shape class')).toBe('square');
    expect(field('Predict fourth vertex C')).toBe('');
    expect(field('Predict common diagonal midpoint')).toBe('');
    enter('Predict fourth vertex C', '(2,2)');
    check('Predict fourth vertex C');
    expect(feedback('Predict fourth vertex C')).toContain('matches');
    select('Adjacent-side case', 'degenerate');
    enter('Predict most specific shape class', 'parallelogram');
    check('Predict most specific shape class');
    expect(feedback('Predict most specific shape class')).not.toContain(
      'matches',
    );
    enter('Predict most specific shape class', 'degenerate');
    check('Predict most specific shape class');
    expect(feedback('Predict most specific shape class')).toContain('matches');
    click('Show/hide exact audit');
    expect(screen.getByText(/area=0/)).toBeTruthy();
    expect(v.container.querySelector('[data-vector-polygon]')).toBeTruthy();
  });
  it('clips outside the window without changing exact vector data and never creates a heading for zero', () => {
    const props = {
        mode: 'en' as const,
        arrows: [
          { name: 'u', tail: vectorZero, value: readVector('(12,0)') },
          { name: 'zero', tail: vectorZero, value: vectorZero },
        ],
        points: [originPoint, { name: 'U', position: readVector('(12,0)') }],
        reveal: true,
        caption: t('核验', 'Audit'),
      },
      v = render(<VectorPlot {...props} />);
    expect(screen.getByRole('status').textContent).toContain(
      'outside the window',
    );
    expect(v.container.querySelector('[data-vector-point="U"]')).toBeNull();
    expect(
      v.container
        .querySelector('[data-vector-arrow="u"]')
        ?.getAttribute('data-vector-value'),
    ).toBe('(12, 0)');
    expect(v.container.querySelector('[data-zero-vector="zero"]')).toBeTruthy();
    expect(v.container.querySelector('[data-vector-arrow="zero"]')).toBeNull();
    v.rerender(<VectorPlot {...props} wide />);
    expect(screen.queryByRole('status')).toBeNull();
    expect(v.container.querySelector('[data-vector-point="U"]')).toBeTruthy();
    expect(v.container.querySelector('foreignObject')).toBeNull();
  });
  it('renders every bilingual body and makes hook arrows agree with their actual mathematical scenario', () => {
    localStorage.setItem('study-language', 'bilingual');
    for (const l of h05Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 .*Understand/);
      for (const lang of ['zh', 'en'])
        expect(
          v.container.querySelectorAll(
            `.math-prose section[lang="${lang}"] h3`,
          ),
        ).toHaveLength(2);
      v.unmount();
      const w = render(
        <VectorHookArt
          kind={l.lab as Parameters<typeof VectorHookArt>[0]['kind']}
          mode="bilingual"
        />,
      );
      expect(w.container.querySelector('svg')).toBeTruthy();
      expect(w.container.querySelector('foreignObject')).toBeNull();
      if (l.lab === 'vector-scaling') {
        expect(
          w.container
            .querySelector('[data-vector-arrow="u"]')
            ?.getAttribute('data-vector-value'),
        ).toBe('(3, -1)');
        expect(
          w.container
            .querySelector('[data-vector-arrow="v"]')
            ?.getAttribute('data-vector-value'),
        ).toBe('(-6, 2)');
      }
      if (l.lab === 'vector-dot')
        expect(
          w.container.querySelector('[data-zero-vector="v"]'),
        ).toBeTruthy();
      if (l.lab === 'vector-components')
        expect(
          w.container
            .querySelector('[data-vector-arrow="AB"]')
            ?.getAttribute('data-vector-value'),
        ).toBe('(5, 3)');
      w.unmount();
    }
  });
  it('restores corrected guided work in all six lessons without completing their unworked practice', () => {
    for (const [id, a] of [
      ['H05-L01', '5'],
      ['H05-L02', '(2,6)'],
      ['H05-L03', '(-6,2)'],
      ['H05-L04', '(5,3)'],
      ['H05-L05', '1'],
      ['H05-L06', '(5,3)'],
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
  it('requires review of endpoint-angle reasoning and preserves the original explanation', () => {
    const v = mount('/math/lesson/H05-L05');
    click(/^06 Reflect/);
    const text =
      'The dot product is −6, a scalar. Both vectors are nonzero and opposite, giving 180°=π, a straight angle. Obtuse excludes the 180° endpoint, so a negative dot product alone is not enough to call it obtuse.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H05-L05']
        .answers['H05-L05-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H05-L05');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('saves eight independent unit answers with two human arguments and restores the final reviewed item', () => {
    const v = mount('/math/unit/H05/check');
    for (const [n, a] of [
      ['1', '5'],
      ['2', '(4,-2)'],
      ['3', '-3'],
      ['4', '(5,3)'],
      ['5', 'sqrt(2)/2'],
    ]) {
      click(`Question ${n}`);
      enter('Your answer', a!);
      click(/Check answer/);
    }
    click('Question 6');
    click(/^B Both u and v are nonzero/);
    click(/Check answer/);
    click('Question 7');
    enter(
      'Your reasoning',
      'A′=(0,0), B′=(5,3) retain AB=(5,3) because common translations cancel. The midpoint moves from (1/2,5/2) to (5/2,3/2), so a position and a free vector behave differently.',
    );
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'C=(2,4). Adjacent vectors (3,1) and (−1,3) are non-collinear, have dot product zero and equal squared magnitudes ten. Under the parallelogram relation this is a square; both diagonal midpoints are (1,2).',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H05/check');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H05-L01'],
    ).toBeUndefined();
  });
  it('changes a due retrieval from a displacement to a midpoint without carrying old input or success', () => {
    const v = mount('/math/lesson/H05-L04');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '(5,3)');
    click(/Check answer/);
    enter('Your answer', '(-5,-3)');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '(-1,1)');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H05-L04'].round).toBe(1);
    saved.sessions['H05-L04'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '(-1,-1/2)');
    click(/Check answer/);
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
