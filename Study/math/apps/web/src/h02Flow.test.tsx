// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import {
  FunctionConceptLab,
  FunctionConceptHookArt,
} from './FunctionConceptLabs';
import {
  ConceptPlot,
  MappingView,
  InverseView,
  PiecewiseView,
} from './FunctionConceptVisuals';
import { NumberDiagramView } from './NumberVisuals';
import { t } from './model';
import { h02Lessons } from './content/H02';
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
const submit = (name: string) => click(`Check: ${name}`);
const feedback = (name: string) =>
  screen.getByRole('status', { name: `${name} feedback` }).textContent;
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
describe('H02 domain-aware experiments and preserved mathematical targets', () => {
  it('accepts many-to-one mappings but separates codomain, actual range and query admissibility', () => {
    render(<FunctionConceptLab kind="concept-mapping" mode="en" />);
    enter('Function status', 'function');
    submit('Function status');
    enter('Actual range', '{0,1,4,9}');
    submit('Actual range');
    expect(feedback('Actual range')).not.toContain('matches');
    enter('Actual range', '4,1,0');
    submit('Actual range');
    expect(feedback('Actual range')).toContain('matches');
    slide('Query input', '.5');
    expect(field('Function status')).toBe('function');
    enter('Output at current input', 'outside-domain');
    submit('Output at current input');
    expect(feedback('Output at current input')).toContain('matches');
    choose('Mapping rule', 'interval');
    expect(field('Function status')).toBe('');
    enter('Actual range', '[0,9]');
    submit('Actual range');
    enter('Output at current input', '.25');
    submit('Output at current input');
    expect(feedback('Output at current input')).toContain('matches');
  });
  it('rejects a missing output and a split input without incorrectly rejecting all valid local queries', () => {
    const v = render(<FunctionConceptLab kind="concept-mapping" mode="en" />);
    choose('Mapping rule', 'missing');
    slide('Query input', '2');
    enter('Function status', 'not-function');
    submit('Function status');
    enter('Output at current input', 'not-function');
    submit('Output at current input');
    expect(feedback('Output at current input')).toContain('matches');
    expect(screen.queryByRole('textbox', { name: 'Actual range' })).toBeNull();
    choose('Mapping rule', 'split');
    slide('Query input', '0');
    enter('Output at current input', 'not-function');
    submit('Output at current input');
    click('Show/hide model');
    expect(v.container.querySelectorAll('[data-mapping-edge]')).toHaveLength(6);
  });
  it('links the same row and point while preserving predictions under view/window changes', () => {
    const v = render(
      <FunctionConceptLab kind="concept-representations" mode="en" />,
    );
    enter('Function value prediction', '-1');
    submit('Function value prediction');
    enter('Coordinates of the same row', '(1,-1)');
    choose('Representation view', 'table');
    expect(field('Function value prediction')).toBe('-1');
    click('Change window only');
    expect(feedback('Function value prediction')).toContain('matches');
    click('Inspect row x=2');
    expect(field('Function value prediction')).toBe('');
    expect(field('Coordinates of the same row')).toBe('');
    choose('Representation view', 'both');
    expect(
      v.container
        .querySelector('[data-function-point="P"]')!
        .getAttribute('data-coordinate'),
    ).toBe('2,2');
  });
  it('keeps discrete inputs unjoined and distinguishes exclusion from unknown intermediate values', () => {
    const v = render(
      <FunctionConceptLab kind="concept-representations" mode="en" />,
    );
    choose('Rule evidence', 'discrete');
    slide('Query input', '.5');
    expect(v.container.querySelectorAll('[data-function-curve]')).toHaveLength(
      0,
    );
    enter('Function value prediction', 'outside-domain');
    submit('Function value prediction');
    expect(feedback('Function value prediction')).toContain('matches');
    choose('Rule evidence', 'observations');
    enter('Function value prediction', 'undetermined');
    submit('Function value prediction');
    click('Show/hide two possible rules');
    expect(v.container.querySelectorAll('[data-function-curve]')).toHaveLength(
      2,
    );
    expect(field('Function value prediction')).toBe('undetermined');
    slide('Query input', '1');
    enter('Function value prediction', '1');
    submit('Function value prediction');
    expect(feedback('Function value prediction')).toContain('matches');
  });
  it('changes the study interval without redefining original parity and refuses invalid ordered pairs', () => {
    render(<FunctionConceptLab kind="concept-properties" mode="en" />);
    enter('Strict monotonicity', 'neither-strict');
    submit('Strict monotonicity');
    enter('Parity of original function', 'even');
    submit('Parity of original function');
    choose('Interval for monotonicity', 'right');
    expect(field('Strict monotonicity')).toBe('');
    expect(field('Parity of original function')).toBe('even');
    expect(
      screen.getByRole('status', { name: 'Ordered-pair audit' }).textContent,
    ).toContain('outside the study interval');
    slide('Test input x1', '1');
    slide('Test input x2', '1');
    expect(
      screen.getByRole('status', { name: 'Ordered-pair audit' }).textContent,
    ).toContain('requires x1<x2');
    slide('Test input x2', '2');
    enter('Strict monotonicity', 'increasing');
    submit('Strict monotonicity');
    click('Change window only');
    expect(feedback('Strict monotonicity')).toContain('matches');
  });
  it('rechecks parity when the original domain changes and distinguishes the zero function strict convention', () => {
    render(<FunctionConceptLab kind="concept-properties" mode="en" />);
    choose('Given function and domain', 'restricted-square');
    enter('Parity of original function', 'even');
    submit('Parity of original function');
    expect(feedback('Parity of original function')).not.toContain('matches');
    enter('Parity of original function', 'neither');
    submit('Parity of original function');
    expect(feedback('Parity of original function')).toContain('matches');
    choose('Given function and domain', 'zero');
    enter('Parity of original function', 'both');
    submit('Parity of original function');
    enter('Strict monotonicity', 'neither-strict');
    submit('Strict monotonicity');
    expect(feedback('Strict monotonicity')).toContain('matches');
  });
  it('tracks source points separately from a fixed transformed query and applies the inner factor reciprocally', () => {
    render(<FunctionConceptLab kind="concept-transformations" mode="en" />);
    enter('Transformed coordinates', '(4,1)');
    submit('Transformed coordinates');
    enter('Transformed function value', '1');
    submit('Transformed function value');
    slide('Source-point input u', '2');
    expect(field('Transformed coordinates')).toBe('');
    expect(field('Transformed function value')).toBe('1');
    click('Change window only');
    expect(feedback('Transformed function value')).toContain('matches');
    choose('Inner factor b', '2');
    enter('Transformed coordinates', '(4,7)');
    submit('Transformed coordinates');
    expect(feedback('Transformed coordinates')).toContain('matches');
    choose('Source domain', 'restricted');
    slide('Query transformed input x', '4.5');
    enter('Transformed function value', 'outside-domain');
    submit('Transformed function value');
    expect(feedback('Transformed function value')).toContain('matches');
  });
  it('keeps source-point and transformed-value tasks distinct when their input numbers coincide', () => {
    render(<FunctionConceptLab kind="concept-transformations" mode="en" />);
    slide('Query transformed input x', '1');
    enter('Transformed coordinates', '(4,1)');
    submit('Transformed coordinates');
    enter('Transformed function value', '7');
    submit('Transformed function value');
    slide('Source-point input u', '1.5');
    expect(field('Transformed coordinates')).toBe('');
    expect(field('Transformed function value')).toBe('7');
    expect(feedback('Transformed function value')).toContain('matches');
  });
  it('reflects a cubic source point and retains a restricted domain after vertical collapse', () => {
    render(<FunctionConceptLab kind="concept-transformations" mode="en" />);
    choose('Source function', 'cube');
    slide('Vertical factor a', '1');
    slide('Horizontal shift h', '0');
    slide('Vertical shift k', '0');
    choose('Inner factor b', '-1');
    slide('Source-point input u', '2');
    enter('Transformed coordinates', '(-2,8)');
    submit('Transformed coordinates');
    expect(feedback('Transformed coordinates')).toContain('matches');
    choose('Source domain', 'restricted');
    slide('Vertical factor a', '0');
    slide('Query transformed input x', '3');
    enter('Transformed function value', 'outside-domain');
    submit('Transformed function value');
    expect(feedback('Transformed function value')).toContain('matches');
  });
  it('does not infer invertibility from the unique zero preimage and selects negative/positive square branches', () => {
    render(<FunctionConceptLab kind="concept-inverse" mode="en" />);
    enter('Inverse function status', 'not-invertible');
    submit('Inverse function status');
    slide('Recover input from output y', '0');
    enter('Preimage prediction', '0');
    submit('Preimage prediction');
    expect(feedback('Preimage prediction')).toContain('matches');
    expect(field('Inverse function status')).toBe('not-invertible');
    choose('Original function and restriction', 'square-negative');
    slide('Recover input from output y', '4');
    enter('Preimage prediction', '-2');
    submit('Preimage prediction');
    expect(feedback('Preimage prediction')).toContain('matches');
    enter('Inverse domain', '[0,9]');
    submit('Inverse domain');
    choose('Original function and restriction', 'square-positive');
    slide('Recover input from output y', '2');
    enter('Preimage prediction', '1.41');
    submit('Preimage prediction');
    expect(feedback('Preimage prediction')).not.toContain('matches');
    enter('Preimage prediction', '√2');
    submit('Preimage prediction');
    expect(feedback('Preimage prediction')).toContain('matches');
    slide('Recover input from output y', '10');
    enter('Preimage prediction', 'outside-domain');
    submit('Preimage prediction');
    expect(feedback('Preimage prediction')).toContain('matches');
  });
  it('exchanges affine domain and range without treating inverse as a reciprocal', () => {
    render(<FunctionConceptLab kind="concept-inverse" mode="en" />);
    choose('Original function and restriction', 'affine');
    slide('Recover input from output y', '7');
    enter('Preimage prediction', '1/17');
    submit('Preimage prediction');
    expect(feedback('Preimage prediction')).not.toContain('matches');
    enter('Preimage prediction', '2');
    submit('Preimage prediction');
    enter('Inverse domain', '[-1,11]');
    submit('Inverse domain');
    click('Change window only');
    expect(feedback('Inverse domain')).toContain('matches');
  });
  it('separates a current charge from the complete budget set under independent control changes', () => {
    render(<FunctionConceptLab kind="concept-piecewise" mode="en" />);
    enter('Current charge prediction', '4 NZD');
    submit('Current charge prediction');
    enter('Inputs meeting the budget', '[0,3]');
    submit('Inputs meeting the budget');
    slide('Current input', '4');
    expect(field('Current charge prediction')).toBe('');
    expect(field('Inputs meeting the budget')).toBe('[0,3]');
    enter('Current charge prediction', '7');
    submit('Current charge prediction');
    slide('Worksheet budget NZD', '7');
    expect(field('Current charge prediction')).toBe('7');
    expect(field('Inputs meeting the budget')).toBe('');
    click('Change window only');
    expect(feedback('Current charge prediction')).toContain('matches');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
  it('assigns jump endpoints once and does not replace started hours with proportional billing', () => {
    const v = render(<FunctionConceptLab kind="concept-piecewise" mode="en" />);
    choose('Fictional tariff rule', 'parcel');
    slide('Current input', '1');
    enter('Current charge prediction', '4');
    submit('Current charge prediction');
    expect(feedback('Current charge prediction')).toContain('matches');
    click('Show/hide model');
    expect(v.container.querySelectorAll('[data-function-curve]')).toHaveLength(
      3,
    );
    expect(
      v.container
        .querySelector('[data-function-end="1,7"]')!
        .getAttribute('data-closed'),
    ).toBe('false');
    slide('Current input', '0');
    enter('Current charge prediction', 'outside-domain');
    submit('Current charge prediction');
    expect(feedback('Current charge prediction')).toContain('matches');
    choose('Fictional tariff rule', 'started-hour');
    slide('Current input', '1.5');
    enter('Current charge prediction', '6');
    submit('Current charge prediction');
    expect(feedback('Current charge prediction')).toContain('matches');
    slide('Worksheet budget NZD', '7');
    enter('Inputs meeting the budget', '[0,2]');
    submit('Inputs meeting the budget');
    expect(feedback('Inputs meeting the budget')).toContain('matches');
  });
  it('renders equal-unit clipped graphs, rational query coordinates and native SVG without invented jump connectors', () => {
    const v = render(<MappingView mode="bilingual" kind="split" />);
    expect(v.container.querySelector('svg span')).toBeNull();
    v.rerender(<InverseView mode="en" kind="square-full" />);
    expect(
      v.container.querySelector('clipPath rect')!.getAttribute('width'),
    ).toBe(v.container.querySelector('clipPath rect')!.getAttribute('height'));
    expect(v.container.querySelectorAll('[data-function-curve]')).toHaveLength(
      3,
    );
    v.rerender(<PiecewiseView mode="en" kind="parcel" />);
    expect(v.container.querySelectorAll('[data-function-curve]')).toHaveLength(
      3,
    );
    v.rerender(
      <NumberDiagramView
        mode="en"
        diagram={{ kind: 'concept-piecewise', source: 'parcel', query: '1/2' }}
      />,
    );
    expect(
      v.container
        .querySelector('[data-function-point="P"]')!
        .getAttribute('data-coordinate'),
    ).toBe('0.5,4');
    v.rerender(
      <ConceptPlot
        mode="en"
        points={[
          { x: 0, y: 0, label: 'P' },
          { x: 0, y: 0, label: 'Q' },
          { x: 0, y: 0 },
          { x: 12, y: 12, label: 'R' },
        ]}
        caption={t('测试', 'Test')}
      />,
    );
    expect(
      v.container.querySelector('[data-function-point="P/Q"]'),
    ).toBeTruthy();
    expect(v.container.querySelector('[data-function-point="R"]')).toBeNull();
    expect(screen.getByRole('status').textContent).toContain(
      'outside this window',
    );
    v.rerender(
      <ConceptPlot
        mode="en"
        points={[
          { x: 1.5, y: 2.25, label: 'P' },
          { x: 1.75, y: 2.25, label: 'Q' },
        ]}
        caption={t('相近点', 'Nearby points')}
      />,
    );
    const labels = v.container.querySelectorAll('[data-function-point] text');
    expect(labels[0]!.getAttribute('y')).not.toBe(labels[1]!.getAttribute('y'));
  });
  it('renders all six hooks and two complete examples in each language', () => {
    for (const l of h02Lessons) {
      const h = render(
        <FunctionConceptHookArt
          kind={l.lab as Parameters<typeof FunctionConceptHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(h.container.querySelector('svg')).toBeTruthy();
      expect(h.container.querySelector('svg span')).toBeNull();
      h.unmount();
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 Understand/);
      expect(
        v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/H02-L06');
    click(/^03 .*Understand/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
});
describe('H02 formal evidence, parent review and changed retrieval', () => {
  it('restores supported answers across all six lessons without completing unfinished practice', () => {
    for (const [id, wrong, right] of [
      ['H02-L01', 'ℝ', 'x<2 or x>2'],
      ['H02-L02', '.5', '.25'],
      ['H02-L03', 'odd', 'even'],
      ['H02-L04', '(-2,1)', '(4,1)'],
      ['H02-L05', '1/17', '2'],
      ['H02-L06', '6', '4'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/^04 Together/);
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
  it('keeps inverse-branch explanations human-reviewed and preserves the learner writing', () => {
    const v = mount('/math/lesson/H02-L05');
    click(/^06 Reflect/);
    const text =
      'Four has two preimages on [−3,3]. Restricting to [0,3] gives sqrt(y), and to [−3,0] gives -sqrt(y), both with inverse domain [0,9]. This reverses the mapping rather than taking a reciprocal.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H02-L05']
        .answers['H02-L05-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H02-L05');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('records eight unit answers including two parent arguments independently of lesson mastery', () => {
    const v = mount('/math/unit/H02/check');
    for (const [n, a] of Object.entries({
      1: 'x<2 or x>2',
      2: '(3/2,1/4)',
      3: 'neither',
      4: '2x²-12x+17',
      5: '2',
    })) {
      click(`Question ${n}`);
      enter('Your answer', a);
      check();
    }
    click('Question 6');
    enter(
      'Your reasoning',
      'State the total domain, partition it into disjoint exhaustive branches, retain earlier marginal charges and distinguish whole-item bands. Solve each budget inequality within its branch domain then union and audit endpoints.',
    );
    parent();
    click('Question 7');
    click(/^C D symmetric about zero/);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'The full square relation is many-to-one. Positive and negative restrictions select sqrt(y) and -sqrt(y), each with domain [0,9] but different ranges. A reciprocal changes output, not direction.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H02/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H02-L01'],
    ).toBeUndefined();
  });
  it('advances retrieval from a function value to a coordinate without retaining old success', () => {
    const v = mount('/math/lesson/H02-L02');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '(1/4,3/2)');
    check();
    enter('Your answer', '(3/2,1/4)');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '2');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H02-L02'].round).toBe(1);
    saved.sessions['H02-L02'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '(-3/2,1/4)');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
