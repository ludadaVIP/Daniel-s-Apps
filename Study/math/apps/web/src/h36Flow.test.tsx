// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import {
  AnalyticGeometryLab,
  AnalyticGeometryHookArt,
} from './AnalyticGeometryLabs';
import { h36Lessons } from './content/H36';
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
describe('H36 exact point sets, geometric restrictions and durable learning evidence', () => {
  it('solves complete intersections and distinguishes quadratic tangency from degree reductions', () => {
    const v = render(
      <AnalyticGeometryLab kind="analytic-intersections" mode="en" />,
    );
    enter('All finite intersection points', '{(4,3)}');
    check('All finite intersection points');
    expect(screen.getByRole('status').textContent).not.toContain('matches');
    enter('All finite intersection points', '{(-4,3);(4,3)}');
    check('All finite intersection points');
    matched('All finite intersection points');
    select('Line constant c', '5');
    expect(field('All finite intersection points')).toBe('');
    enter('All finite intersection points', '{(0,5)}');
    check('All finite intersection points');
    matched('All finite intersection points');
    select('Conic', 'parabola');
    select('Line direction', 'vertical');
    select('Line constant c', '2');
    enter('All finite intersection points', '{(2,4)}');
    check('All finite intersection points');
    matched('All finite intersection points');
    enter('Substituted degree', '1');
    check('Substituted degree');
    matched('Substituted degree');
    select('Conic', 'hyperbola');
    select('Line direction', 'diagonal');
    enter('All finite intersection points', '∅');
    check('All finite intersection points');
    matched('All finite intersection points');
    click('Show/hide audit');
    expect(screen.getByText('not quadratic')).toBeTruthy();
    expect(
      v.container.querySelectorAll('[data-function-point^="S"]'),
    ).toHaveLength(0);
  });
  it('retains the locus equation while motion restrictions reject reconstructed points and preserve open endpoints', () => {
    const v = render(<AnalyticGeometryLab kind="analytic-locus" mode="en" />);
    enter('Algebraic midpoint candidate M', '(1,2)');
    check('Algebraic midpoint candidate M');
    matched('Algebraic midpoint candidate M');
    enter('Circle equation satisfied by M', '(x-1)^2+y^2=4');
    check('Circle equation satisfied by M');
    matched('Circle equation satisfied by M');
    select('Allowed source motion', 'upper');
    expect(field('Circle equation satisfied by M')).toBe('(x-1)^2+y^2=4');
    select('Source candidate P', '1');
    enter('M belongs to original geometric locus', 'out');
    check('M belongs to original geometric locus');
    matched('M belongs to original geometric locus');
    select('Allowed source motion', 'upper-excluded');
    select('Source candidate P', '2');
    expect(
      v.container.querySelector(
        '[data-function-end="3,0"][data-closed="false"]',
      ),
    ).toBeTruthy();
    expect(v.container.querySelector('[data-coordinate="3,0"]')).toBeNull();
    click('Show/hide audit');
    expect(screen.getByText('y≥0; M≠(3,0)')).toBeTruthy();
  });
  it('keeps a parameter point separate from domain admission and from the omitted reference-circle point', () => {
    const v = render(
      <AnalyticGeometryLab kind="analytic-parameter" mode="en" />,
    );
    enter('Algebraic parameter point P', '(3,4)');
    check('Algebraic parameter point P');
    matched('Algebraic parameter point P');
    enter('Omitted circle point E', '(-5,0)');
    check('Omitted circle point E');
    matched('Omitted circle point E');
    select('Parameter domain', 'arc');
    expect(field('Algebraic parameter point P')).toBe('(3,4)');
    select('Parameter t', '2');
    expect(field('Algebraic parameter point P')).toBe('');
    enter('Current t is allowed', 'out');
    check('Current t is allowed');
    matched('Current t is allowed');
    expect(
      v.container.querySelector(
        '[data-function-end="-5,0"][data-closed="false"]',
      ),
    ).toBeTruthy();
    click('Show/hide audit');
    expect(screen.getAllByText('outside-domain')).toHaveLength(2);
  });
  it('preserves a true zero dot product while changing angle eligibility at a zero-vector endpoint', () => {
    const v = render(<AnalyticGeometryLab kind="analytic-vectors" mode="en" />);
    enter('Vector dot product', '0');
    check('Vector dot product');
    matched('Vector dot product');
    enter('Angle APB classification', 'right');
    check('Angle APB classification');
    matched('Angle APB classification');
    select('Point P case', 'A');
    expect(field('Vector dot product')).toBe('0');
    expect(field('Angle APB classification')).toBe('');
    enter('Angle APB classification', 'undefined');
    check('Angle APB classification');
    matched('Angle APB classification');
    click('Show/hide audit');
    expect(
      screen.getByRole('region', { name: 'Exact data audit table' })
        .textContent,
    ).toContain('Satisfies circle equationtrue');
    expect(
      screen.getByRole('region', { name: 'Exact data audit table' })
        .textContent,
    ).toContain('Satisfies the nonzero right-angle conditionfalse');
    expect(
      v.container.querySelectorAll('[data-function-end][data-closed="false"]'),
    ).toHaveLength(2);
  });
  it('keeps full width distinct from half-width, a zero-width singleton and an infeasible roof', () => {
    const v = render(
      <AnalyticGeometryLab kind="analytic-modelling" mode="en" />,
    );
    enter('Feasible x set at clearance', '[-4,4]');
    check('Feasible x set at clearance');
    matched('Feasible x set at clearance');
    enter('Full width in metres (empty if infeasible)', '8');
    check('Full width in metres (empty if infeasible)');
    matched('Full width in metres (empty if infeasible)');
    select('Prespecified clearance', 'apex');
    enter('Full width in metres (empty if infeasible)', '0');
    check('Full width in metres (empty if infeasible)');
    matched('Full width in metres (empty if infeasible)');
    expect(
      v.container.querySelectorAll('[data-function-point^="C"]'),
    ).toHaveLength(1);
    select('Prespecified clearance', 'above');
    expect(field('Full width in metres (empty if infeasible)')).toBe('');
    enter('Full width in metres (empty if infeasible)', 'empty');
    check('Full width in metres (empty if infeasible)');
    matched('Full width in metres (empty if infeasible)');
    enter('All roof intersections at clearance', '{}');
    check('All roof intersections at clearance');
    matched('All roof intersections at clearance');
    expect(
      v.container.querySelectorAll('[data-function-point^="C"]'),
    ).toHaveLength(0);
  });
  it('renders five meaningful hook diagrams and both complete worked examples on actual reading routes', () => {
    for (const l of h36Lessons) {
      const art = render(
        <AnalyticGeometryHookArt
          kind={l.lab as Parameters<typeof AnalyticGeometryHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(art.container.querySelector('svg')).toBeTruthy();
      expect(art.container.querySelector('foreignObject')).toBeNull();
      if (l.id === 'H36-L01') {
        expect(
          art.container.querySelector('[data-coordinate="-4,3"]'),
        ).toBeTruthy();
        expect(
          art.container.querySelector('[data-coordinate="4,3"]'),
        ).toBeTruthy();
      }
      if (l.id === 'H36-L02')
        expect(
          art.container.querySelector(
            '[data-function-end="3,0"][data-closed="false"]',
          ),
        ).toBeTruthy();
      if (l.id === 'H36-L03')
        expect(
          art.container.querySelector('[data-coordinate="3,4"]'),
        ).toBeTruthy();
      if (l.id === 'H36-L04')
        expect(
          art.container.querySelectorAll(
            '[data-function-end][data-closed="false"]',
          ),
        ).toHaveLength(2);
      if (l.id === 'H36-L05')
        expect(
          art.container.querySelectorAll('[data-function-point^="C"]'),
        ).toHaveLength(2);
      art.unmount();
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 Understand/);
      expect(v.container.textContent).toContain('Example 1');
      expect(v.container.textContent).toContain('Example 2');
      v.unmount();
    }
  });
  it('restores supported point sets, locus equations, coordinates and numerical answers without completing unfinished lessons', () => {
    for (const [id, answer] of [
      ['H36-L01', '{(-4,3);(4,3)}'],
      ['H36-L02', '(x-1)^2+y^2=4'],
      ['H36-L03', '(3,4)'],
      ['H36-L04', '0'],
      ['H36-L05', '8'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/^04 Together/);
      if (id === 'H36-L01') {
        expect(
          screen.getByText(/Enter all distinct points/).textContent,
        ).not.toContain('(-4,3);(4,3)');
      }
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
  it('requires explicit human review before preserving a completed locus proof', () => {
    const v = mount('/math/lesson/H36-L02');
    click(/^06 Reflect/);
    const report =
      'Engineering example: Reconstruct P=(2x−2,2y) from candidate M. The candidate equation proves source-circle membership and the midpoint formula recovers M. For an upper source require y≥0; excluding P=(4,0) excludes M=(3,0). Necessity alone does not prove every point of the full circle is attainable.';
    enter('Your reasoning', report);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H36-L02']
        .answers['H36-L02-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H36-L02');
    expect(field('Your reasoning')).toBe(report);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('saves five constructed tasks and three human proofs independently of lesson mastery, then restores them', () => {
    const v = mount('/math/unit/H36/check');
    ['{(-4,3);(4,3)}', '(x-1)^2+y^2=4', '(3,4)', '0', '8'].forEach(
      (answer, i) => {
        click(`Question ${i + 1}`);
        enter('Your answer', answer);
        click(/Check answer/);
      },
    );
    const reports = [
      'Engineering example: For the midpoint locus, reconstruct P=(2x−2,2y). Verify the source circle and recover M by averaging. Upper motion requires y≥0; excluding source endpoint (4,0) excludes midpoint (3,0). State necessity and sufficiency, not just a candidate equation.',
      'Engineering example: The dot product is x²+y²−a². On the circle excluding A/B both vectors are nonzero, giving a right angle in both directions. At endpoints the equation still holds but the angle is undefined. The diameter-circle theorem supplies a geometric cross-check with the same exclusions.',
      'Engineering example: The roof is x²/25+y²/9=1 with y≥0, in metres over a level floor. Clearance 9/5 gives x∈[-4,4], width eight, while 12/5 gives [-3,3], width six. At height three only the apex remains with zero width; height four is infeasible. Retain units, full rather than half-width and geometric modelling assumptions.',
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
    mount('/math/unit/H36/check');
    expect(screen.getByText(/Recorded 8\/8/)).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H36-L01'],
    ).toBeUndefined();
  });
  it('changes due intersection retrievals without retaining the previous point set or success', () => {
    const v = mount('/math/lesson/H36-L01');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '999');
    click(/Check answer/);
    enter('Your answer', '1');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '{(-3,4);(5,4)}');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H36-L01'].round).toBe(1);
    saved.sessions['H36-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '{(-3,4);(5,4)}');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '{(-2,4);(6,4)}');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
});
