// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ExtensionLab, ExtensionHookArt } from './ExtensionLabs';
import { h37Lessons } from './content/H37';
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
const matched = (name: string) =>
  expect(
    screen.getByRole('status', { name: `${name} feedback` }).textContent,
  ).toContain('matches');
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

describe('H37 concept workbenches and durable reviewed evidence', () => {
  it('separates induction propagation, base and finite checks while preserving the actual next summand', () => {
    render(<ExtensionLab kind="extension-induction" mode="en" />);
    enter('Evidence proves every n≥1 (true/false)', 'true');
    check('Evidence proves every n≥1 (true/false)');
    matched('Evidence proves every n≥1 (true/false)');
    enter('New odd summand from k to k+1', '9');
    check('New odd summand from k to k+1');
    matched('New odd summand from k to k+1');
    select('Proof evidence', 'missing-base');
    expect(field('Evidence proves every n≥1 (true/false)')).toBe('');
    expect(field('New odd summand from k to k+1')).toBe('9');
    enter('Evidence proves every n≥1 (true/false)', 'false');
    check('Evidence proves every n≥1 (true/false)');
    matched('Evidence proves every n≥1 (true/false)');
    click('Show/hide audit');
    expect(
      screen.getByRole('region', { name: 'Exact data audit table' })
        .textContent,
    ).toContain('Base establishedfalse');
    select('Proof evidence', 'finite');
    expect(
      screen.getByRole('region', { name: 'Exact data audit table' })
        .textContent,
    ).toContain('Arbitrary-k implication establishedfalse');
    select('Displayed index k', '1');
    expect(field('New odd summand from k to k+1')).toBe('');
  });
  it('keeps the zero-index seed, counts updates and treats a missing second seed as non-uniqueness', () => {
    const v = render(<ExtensionLab kind="extension-recurrence" mode="en" />);
    expect(
      v.container.querySelector('[data-recurrence-index="4"]')?.textContent,
    ).toBe('u(4)?');
    enter('Requested term or insufficient', '31');
    check('Requested term or insufficient');
    matched('Requested term or insufficient');
    select('Requested index n', '0');
    enter('Requested term or insufficient', '1');
    check('Requested term or insufficient');
    matched('Requested term or insufficient');
    select('Recurrence type', 'missing-seed');
    enter('Requested term or insufficient', '0');
    check('Requested term or insufficient');
    matched('Requested term or insufficient');
    select('Requested index n', '4');
    enter('Requested term or insufficient', '3');
    check('Requested term or insufficient');
    expect(screen.getByRole('status').textContent).not.toContain('matches');
    enter('Requested term or insufficient', 'insufficient');
    check('Requested term or insufficient');
    matched('Requested term or insufficient');
    select('Recurrence type', 'fibonacci');
    select('Requested index n', '8');
    enter('Requested term or insufficient', '21');
    check('Requested term or insufficient');
    matched('Requested term or insufficient');
    click('Show/hide audit');
    expect(screen.getByRole('table').textContent).toContain('821');
  });
  it('accepts alternative minimum routes, rejects local traps and respects direction and disconnection', () => {
    const v = render(<ExtensionLab kind="extension-graphs" mode="en" />);
    enter('One shortest simple route', 'A-C-E');
    check('One shortest simple route');
    expect(screen.getByRole('status').textContent).not.toContain('matches');
    enter('One shortest simple route', 'A-B-C-D-E');
    check('One shortest simple route');
    matched('One shortest simple route');
    select('Network case', 'ties');
    expect(field('One shortest simple route')).toBe('');
    for (const route of ['A-B-E', 'A-C-E']) {
      enter('One shortest simple route', route);
      check('One shortest simple route');
      matched('One shortest simple route');
    }
    select('Network case', 'directed');
    enter('One shortest simple route', 'A-B-E');
    check('One shortest simple route');
    expect(screen.getByRole('status').textContent).not.toContain('matches');
    expect(
      v.container
        .querySelector('[data-edge="BA"] line')
        ?.getAttribute('marker-end'),
    ).toContain('url');
    enter('One shortest simple route', 'A-C-D-E');
    check('One shortest simple route');
    matched('One shortest simple route');
    select('Network case', 'disconnected');
    enter('One shortest simple route', 'unreachable');
    check('One shortest simple route');
    matched('One shortest simple route');
    click('Show/hide audit');
    expect(screen.getByRole('table').textContent).toContain('∞');
  });
  it('uses whole matrix columns for composition, reverses order and displays singular information loss', () => {
    const v = render(<ExtensionLab kind="extension-matrices" mode="en" />);
    expect(v.container.textContent).not.toContain('[0,-2;1,0]');
    enter('Composite matrix [a,b;c,d]', '[0,-2;1,0]');
    check('Composite matrix [a,b;c,d]');
    matched('Composite matrix [a,b;c,d]');
    enter('Transformed vector coordinates', '(-4,1)');
    check('Transformed vector coordinates');
    matched('Transformed vector coordinates');
    select('Composition order', 'BA');
    expect(field('Composite matrix [a,b;c,d]')).toBe('');
    enter('Composite matrix [a,b;c,d]', '[0,-1;2,0]');
    check('Composite matrix [a,b;c,d]');
    matched('Composite matrix [a,b;c,d]');
    enter('Transformed vector coordinates', '(-2,2)');
    check('Transformed vector coordinates');
    matched('Transformed vector coordinates');
    select('Transformation A', 'collapse');
    select('Transformation B', 'identity');
    enter('Transformed vector coordinates', '(1,0)');
    check('Transformed vector coordinates');
    matched('Transformed vector coordinates');
    click('Show/hide audit');
    expect(
      screen.getByRole('region', { name: 'Exact data audit table' })
        .textContent,
    ).toContain('Signed area factor det0');
    select('Transformation A', 'zero');
    enter('Transformed vector coordinates', '(0,0)');
    check('Transformed vector coordinates');
    matched('Transformed vector coordinates');
  });
  it('distinguishes tested midpoint, new midpoint and error bound and refuses uncertified cases', () => {
    const v = render(<ExtensionLab kind="extension-numerical" mode="en" />);
    expect(
      screen.getByRole('region', { name: 'Current interval zoom' }).textContent,
    ).toContain('(L+U)/2');
    enter('Current interval midpoint approximation', '11/8');
    check('Current interval midpoint approximation');
    expect(screen.getByRole('status').textContent).not.toContain('matches');
    enter('Current interval midpoint approximation', '23/16');
    check('Current interval midpoint approximation');
    matched('Current interval midpoint approximation');
    enter('Midpoint absolute-error bound', '1/16');
    check('Midpoint absolute-error bound');
    matched('Midpoint absolute-error bound');
    select('Bisection updates', '4');
    expect(field('Current interval midpoint approximation')).toBe('');
    enter('Current interval midpoint approximation', '45/32');
    check('Current interval midpoint approximation');
    matched('Current interval midpoint approximation');
    select('Function and initial interval', 'exact');
    enter('Current interval midpoint approximation', '2');
    check('Current interval midpoint approximation');
    matched('Current interval midpoint approximation');
    enter('Midpoint absolute-error bound', '0');
    check('Midpoint absolute-error bound');
    matched('Midpoint absolute-error bound');
    select('Function and initial interval', 'discontinuous');
    expect(
      screen.queryByRole('region', { name: 'Current interval zoom' }),
    ).toBeNull();
    expect(
      screen.queryByRole('textbox', { name: 'Midpoint absolute-error bound' }),
    ).toBeNull();
    enter('Certified enclosure obtained (true/false)', 'false');
    check('Certified enclosure obtained (true/false)');
    matched('Certified enclosure obtained (true/false)');
    expect(v.container.querySelectorAll('svg polyline')).toHaveLength(2);
    click('Show/hide audit');
    expect(screen.getByText('invalid-continuity')).toBeTruthy();
    select('Function and initial interval', 'even-root');
    expect(screen.getByText('invalid-sign')).toBeTruthy();
  });
  it('renders five distinct hook figures and both complete worked examples on real reading routes', () => {
    for (const l of h37Lessons) {
      const art = render(
        <ExtensionHookArt
          kind={l.lab as Parameters<typeof ExtensionHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(art.container.querySelector('svg')).toBeTruthy();
      expect(art.container.querySelector('foreignObject')).toBeNull();
      art.unmount();
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 Understand/);
      expect(v.container.textContent).toContain('Example 1');
      expect(v.container.textContent).toContain('Example 2');
      v.unmount();
    }
  });
  it('restores supported generated answers without completing unfinished lessons or leaking answers through format hints', () => {
    for (const [id, answer] of [
      ['H37-L01', '9'],
      ['H37-L02', '31'],
      ['H37-L03', 'A-B-C-D-E'],
      ['H37-L04', '[0,-2;1,0]'],
      ['H37-L05', '23/16'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/^04 Together/);
      if (id === 'H37-L03')
        expect(
          screen.getByText(/Enter vertices in order/).textContent,
        ).not.toContain(answer);
      if (id === 'H37-L04')
        expect(
          screen.getByText(/Enter a two-by-two matrix/).textContent,
        ).not.toContain(answer);
      enter('Your answer', '999');
      click(/Check answer/);
      enter('Your answer', answer!);
      click(/Check answer/);
      expect(
        screen.getByText(
          '✓ Completed with support. Your understanding is growing.',
        ),
      ).toBeTruthy();
      v.unmount();
      const w = mount(`/math/lesson/${id}`);
      expect(field('Your answer')).toBe(answer);
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id!]
          .completedAt,
      ).toBeUndefined();
      w.unmount();
    }
  });
  it('waits for explicit human review and restores a complete induction argument', () => {
    const v = mount('/math/lesson/H37-L01');
    click(/^06 Reflect/);
    const report =
      'Engineering review example: Define P(n) for integers n≥1. The base at one is true. For arbitrary k assume P(k); add 2k+1 to get k²+2k+1=(k+1)². This proves the implication, not an assumed universal conclusion. The n²+1 claim has false base; sum=n fails at two; finite checking is insufficient.';
    enter('Your reasoning', report);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H37-L01']
        .answers['H37-L01-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H37-L01');
    expect(field('Your reasoning')).toBe(report);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('records five constructions and three human arguments separately from lesson mastery and restores all eight', () => {
    const v = mount('/math/unit/H37/check');
    ['9', '31', 'A-B-C-D-E', '[0,-2;1,0]', '23/16'].forEach((answer, i) => {
      click(`Question ${i + 1}`);
      enter('Your answer', answer);
      click(/Check answer/);
    });
    const reports = [
      'Engineering review example: For integers n≥1 prove the base 1=1. Assume P(k) for arbitrary k, add 2k+1 and derive (k+1)². A propagating n²+1 claim fails its base, while sum=n fails at two. Finite checks supply no arbitrary-k implication.',
      'Engineering review example: Settle A then B2, C3, D4 and E6, relaxing labels from total cost. AB1 AC3 BE9 CD1 DE1 gives local A-B-E cost ten but A-C-D-E cost five. Tied minimum routes are valid, isolated E is unreachable, and settling requires nonnegative weights and permitted directions.',
      'Engineering review example: x²−2 is continuous and changes sign on [1,2]. Tests 3/2, 5/4, 11/8 retain [11/8,3/2]. Current midpoint is 23/16 with error at most 1/16. Width halves each update; residual is not coordinate error. 1/x fails continuity and x² has an even root despite same-sign endpoints; stop at exact or endpoint roots.',
    ];
    reports.forEach((report, i) => {
      click(`Question ${i + 6}`);
      enter('Your reasoning', report);
      expect(screen.getByText(new RegExp(`Recorded ${i + 5}/8`))).toBeTruthy();
      parent();
    });
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H37/check');
    expect(screen.getByText(/Recorded 8\/8/)).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H37-L01'],
    ).toBeUndefined();
  });
  it('changes retrieval mathematics and clears the previous answer and success on a new round', () => {
    const v = mount('/math/lesson/H37-L01');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '999');
    click(/Check answer/);
    enter('Your answer', '36');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '3');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H37-L01'].round).toBe(1);
    saved.sessions['H37-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '3');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '5');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
});
