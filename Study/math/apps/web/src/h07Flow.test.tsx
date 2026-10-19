// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SequenceLab, SequenceHookArt } from './SequenceLabs';
import { h07Lessons } from './content/H07';
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
describe('H07 sequence workbenches and learning records', () => {
  it('separates finite evidence from complete rules and preserves insufficient predictions across extension displays', () => {
    const v = render(<SequenceLab kind="sequence-rules" mode="en" />),
      name = 'Predict a_n (insufficient/outside-domain if needed)';
    enter(name, '8');
    check(name);
    expect(feedback(name)).toContain('matches');
    select('Information and rule', 'observed');
    expect(field(name)).toBe('');
    enter(name, '8');
    check(name);
    expect(feedback(name)).not.toContain('matches');
    enter(name, 'insufficient');
    check(name);
    click('Compare two possible extensions');
    expect(field(name)).toBe('insufficient');
    expect(feedback(name)).toContain('matches');
    expect(
      v.container
        .querySelector(
          '[data-sequence-series="2n+(n−1)(n−2)(n−3)"][data-sequence-index="4"]',
        )
        ?.getAttribute('data-sequence-value'),
    ).toBe('14');
    click('Change window');
    expect(field(name)).toBe('insufficient');
    expect(screen.queryByText(/Some points lie outside/)).toBeNull();
    select('Requested index n', '3');
    enter(name, '6');
    check(name);
    expect(feedback(name)).toContain('matches');
  });
  it('honours the positive integer domain instead of silently adding a zeroth term or continuous interpolation', () => {
    const v = render(<SequenceLab kind="sequence-rules" mode="en" />),
      name = 'Predict a_n (insufficient/outside-domain if needed)';
    select('Requested index n', '0');
    enter(name, '0');
    check(name);
    expect(feedback(name)).not.toContain('matches');
    enter(name, 'outside-domain');
    check(name);
    expect(feedback(name)).toContain('matches');
    expect(v.container.querySelector('[data-sequence-index="0"]')).toBeNull();
    expect(v.container.querySelector('polyline')).toBeNull();
    select('Information and rule', 'square');
    select('Requested index n', '6');
    enter(name, '37');
    check(name);
    expect(feedback(name)).toContain('matches');
  });
  it('recovers an arithmetic rule and resets only the requested term when its index changes', () => {
    render(<SequenceLab kind="sequence-arithmetic" mode="en" />);
    enter('Predict d (insufficient/inconsistent if needed)', '3');
    enter('Predict a_1 (insufficient/inconsistent if needed)', '5');
    enter('Predict requested a_n', '20');
    check('Predict requested a_n');
    expect(feedback('Predict requested a_n')).toContain('matches');
    select('Requested index n', '3');
    expect(field('Predict d (insufficient/inconsistent if needed)')).toBe('3');
    expect(field('Predict a_1 (insufficient/inconsistent if needed)')).toBe(
      '5',
    );
    expect(field('Predict requested a_n')).toBe('');
    enter('Predict requested a_n', '11');
    check('Predict requested a_n');
    expect(feedback('Predict requested a_n')).toContain('matches');
    select('Indexed givens case', 'fraction');
    enter('Predict d (insufficient/inconsistent if needed)', '1/2');
    enter('Predict a_1 (insufficient/inconsistent if needed)', '0');
    select('Requested index n', '6');
    enter('Predict requested a_n', '5/2');
    check('Predict requested a_n');
    expect(feedback('Predict requested a_n')).toContain('matches');
  });
  it('distinguishes a known repeated point from insufficient rules and inconsistent conditions', () => {
    render(<SequenceLab kind="sequence-arithmetic" mode="en" />);
    select('Indexed givens case', 'repeated');
    enter('Predict d (insufficient/inconsistent if needed)', 'insufficient');
    check('Predict d (insufficient/inconsistent if needed)');
    expect(
      feedback('Predict d (insufficient/inconsistent if needed)'),
    ).toContain('matches');
    enter('Predict requested a_n', 'insufficient');
    check('Predict requested a_n');
    expect(feedback('Predict requested a_n')).toContain('matches');
    select('Requested index n', '3');
    enter('Predict requested a_n', '7');
    check('Predict requested a_n');
    expect(feedback('Predict requested a_n')).toContain('matches');
    select('Indexed givens case', 'conflict');
    enter('Predict requested a_n', 'inconsistent');
    check('Predict requested a_n');
    expect(feedback('Predict requested a_n')).toContain('matches');
  });
  it('pairs two complete odd-length copies and retains signed sums without extra middle-term adjustment', () => {
    const v = render(<SequenceLab kind="sequence-arithmetic-sum" mode="en" />);
    enter('Predict final term a_n', '14');
    enter('Predict one paired-column total', '16');
    enter('Predict S_n', '40');
    check('Predict S_n');
    click('Toggle reverse-copy pairing');
    click('Show/hide audit');
    expect(field('Predict S_n')).toBe('40');
    expect(feedback('Predict S_n')).toContain('matches');
    expect(
      v.container.querySelectorAll('[data-pair-row="forward"]'),
    ).toHaveLength(5);
    expect(
      v.container.querySelectorAll('[data-pair-row="reverse"]'),
    ).toHaveLength(5);
    expect(
      v.container.querySelectorAll('[data-original-index="3"]'),
    ).toHaveLength(2);
    select('First term a_1', '5');
    select('Common difference d', '-2');
    select('Term count n', '6');
    enter('Predict S_n', '0');
    check('Predict S_n');
    expect(feedback('Predict S_n')).toContain('matches');
  });
  it('preserves signed geometric values when comparing magnitudes and handles a negative first term separately', () => {
    const v = render(<SequenceLab kind="sequence-geometric" mode="en" />);
    enter('Predict a_n', '-24');
    check('Predict a_n');
    enter('Predict geometric status (geometric/not-geometric)', 'geometric');
    check('Predict geometric status (geometric/not-geometric)');
    click('Compare magnitude dots');
    expect(field('Predict a_n')).toBe('-24');
    expect(
      v.container
        .querySelector('[data-sequence-series="aₙ"][data-sequence-index="4"]')
        ?.getAttribute('data-sequence-value'),
    ).toBe('-24');
    expect(
      v.container
        .querySelector('[data-sequence-series="|aₙ|"][data-sequence-index="4"]')
        ?.getAttribute('data-sequence-value'),
    ).toBe('24');
    select('Requested index n', '6');
    expect(field('Predict geometric status (geometric/not-geometric)')).toBe(
      'geometric',
    );
    select('First term a_1', '-2');
    select('Multiplier q', '2');
    select('Requested index n', '4');
    enter('Predict a_n', '-16');
    check('Predict a_n');
    expect(feedback('Predict a_n')).toContain('matches');
  });
  it('calculates zero recurrences without fabricating adjacent quotients or classifying them as geometric', () => {
    render(<SequenceLab kind="sequence-geometric" mode="en" />);
    select('Multiplier q', '0');
    enter('Predict a_n', '0');
    enter('Predict a_(n+1)/a_n (zero denominator: undefined)', 'undefined');
    enter(
      'Predict geometric status (geometric/not-geometric)',
      'not-geometric',
    );
    check('Predict a_(n+1)/a_n (zero denominator: undefined)');
    check('Predict geometric status (geometric/not-geometric)');
    expect(
      feedback('Predict a_(n+1)/a_n (zero denominator: undefined)'),
    ).toContain('matches');
    select('Requested index n', '1');
    enter('Predict a_(n+1)/a_n (zero denominator: undefined)', '0');
    check('Predict a_(n+1)/a_n (zero denominator: undefined)');
    expect(
      feedback('Predict a_(n+1)/a_n (zero denominator: undefined)'),
    ).toContain('matches');
    expect(field('Predict geometric status (geometric/not-geometric)')).toBe(
      'not-geometric',
    );
    select('First term a_1', '0');
    select('Multiplier q', '1');
    enter('Predict a_(n+1)/a_n (zero denominator: undefined)', 'undefined');
    check('Predict a_(n+1)/a_n (zero denominator: undefined)');
    expect(
      feedback('Predict a_(n+1)/a_n (zero denominator: undefined)'),
    ).toContain('matches');
  });
  it('keeps the shifted tail and treats the unit ratio directly rather than dividing by zero', () => {
    const v = render(<SequenceLab kind="sequence-geometric-sum" mode="en" />);
    enter('Predict S_n', '45');
    enter('Predict shifted tail a_1 q^n', '48');
    enter('Predict (1−q)S_n', '-45');
    check('Predict shifted tail a_1 q^n');
    expect(feedback('Predict shifted tail a_1 q^n')).toContain('matches');
    click('Show/hide audit');
    expect(
      v.container
        .querySelector('[data-geometric-power="4"]')
        ?.getAttribute('data-geometric-value'),
    ).toBe('48');
    select('First term a_1', '5');
    select('Multiplier q', '1');
    select('Term count n', '6');
    enter('Predict S_n', '30');
    enter('Predict (1−q)S_n', '0');
    check('Predict S_n');
    check('Predict (1−q)S_n');
    expect(feedback('Predict S_n')).toContain('matches');
    expect(feedback('Predict (1−q)S_n')).toContain('matches');
    select('First term a_1', '4');
    select('Multiplier q', '1/2');
    select('Term count n', '4');
    enter('Predict S_n', '15/2');
    enter('Predict shifted tail a_1 q^n', '1/4');
    check('Predict S_n');
    check('Predict shifted tail a_1 q^n');
    expect(feedback('Predict S_n')).toContain('matches');
    expect(feedback('Predict shifted tail a_1 q^n')).toContain('matches');
  });
  it('separates deposit timing, contributions and period zero while retaining independent first-target work', () => {
    render(<SequenceLab kind="sequence-savings" mode="en" />);
    enter('Predict B_n (NZD)', '142');
    enter('Predict contributions including initial balance (NZD)', '120');
    enter(
      'Predict first target period within 0–6 (otherwise not-reached)',
      '5',
    );
    check('Predict B_n (NZD)');
    select('Elapsed period count n', '3');
    expect(field('Predict B_n (NZD)')).toBe('');
    expect(
      field('Predict first target period within 0–6 (otherwise not-reached)'),
    ).toBe('5');
    select('Elapsed period count n', '0');
    enter('Predict B_n (NZD)', '100');
    enter('Predict contributions including initial balance (NZD)', '100');
    select('Deposit timing', 'start');
    expect(field('Predict B_n (NZD)')).toBe('100');
    expect(field('Predict contributions including initial balance (NZD)')).toBe(
      '100',
    );
    select('Elapsed period count n', '2');
    enter('Predict B_n (NZD)', '144.1 NZD');
    check('Predict B_n (NZD)');
    expect(feedback('Predict B_n (NZD)')).toContain('matches');
    enter('Predict contributions including initial balance (NZD)', '120');
    click('Compare other deposit timing');
    expect(field('Predict B_n (NZD)')).toBe('144.1 NZD');
  });
  it('keeps exact ideal money distinct from approximate displays and per-period cent postings', () => {
    const v = render(<SequenceLab kind="sequence-savings" mode="en" />);
    select('Savings case', 'tiny');
    enter('Predict B_n (NZD)', '0.0605');
    enter('Predict contributions including initial balance (NZD)', '0.05');
    check('Predict B_n (NZD)');
    expect(feedback('Predict B_n (NZD)')).toContain('matches');
    click('Show/hide audit');
    expect(v.container.textContent).toContain('121/2000 (≈NZ$0.06)');
    select('Posting policy', 'cents');
    expect(field('Predict B_n (NZD)')).toBe('');
    expect(field('Predict contributions including initial balance (NZD)')).toBe(
      '0.05',
    );
    enter('Predict B_n (NZD)', '0.06');
    check('Predict B_n (NZD)');
    expect(feedback('Predict B_n (NZD)')).not.toContain('matches');
    enter('Predict B_n (NZD)', '0.07');
    check('Predict B_n (NZD)');
    expect(feedback('Predict B_n (NZD)')).toContain('matches');
    expect(v.container.textContent).toContain('7/100 (NZ$0.07)');
  });
  it('reports only a bounded target miss, preserves no-deposit timing invariants and admits period-zero success', () => {
    render(<SequenceLab kind="sequence-savings" mode="en" />);
    select('Savings case', 'beyond');
    enter(
      'Predict first target period within 0–6 (otherwise not-reached)',
      'not-reached',
    );
    check('Predict first target period within 0–6 (otherwise not-reached)');
    expect(
      feedback(
        'Predict first target period within 0–6 (otherwise not-reached)',
      ),
    ).toContain('matches');
    enter('Predict B_n (NZD)', '121');
    select('Deposit timing', 'start');
    expect(field('Predict B_n (NZD)')).toBe('121');
    expect(
      field('Predict first target period within 0–6 (otherwise not-reached)'),
    ).toBe('not-reached');
    select('Savings case', 'already');
    enter(
      'Predict first target period within 0–6 (otherwise not-reached)',
      '0',
    );
    check('Predict first target period within 0–6 (otherwise not-reached)');
    expect(
      feedback(
        'Predict first target period within 0–6 (otherwise not-reached)',
      ),
    ).toContain('matches');
    select('Elapsed period count n', '6');
    expect(
      field('Predict first target period within 0–6 (otherwise not-reached)'),
    ).toBe('0');
  });
  it('renders every bilingual body and matches hook data to the actual sequence or timing scenario', () => {
    localStorage.setItem('study-language', 'bilingual');
    for (const l of h07Lessons) {
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
        <SequenceHookArt
          kind={l.lab as Parameters<typeof SequenceHookArt>[0]['kind']}
          mode="bilingual"
        />,
      );
      expect(w.container.querySelector('svg')).toBeTruthy();
      expect(w.container.querySelector('foreignObject')).toBeNull();
      expect(w.container.querySelector('input')).toBeNull();
      if (l.id === 'H07-L01')
        expect(
          w.container.querySelectorAll('[data-sequence-index]'),
        ).toHaveLength(3);
      if (l.id === 'H07-L02') {
        expect(
          w.container.querySelectorAll('[data-sequence-index]'),
        ).toHaveLength(2);
        expect(
          w.container
            .querySelector('[data-sequence-index="2"]')
            ?.getAttribute('data-sequence-value'),
        ).toBe('8');
        expect(
          w.container
            .querySelector('[data-sequence-index="5"]')
            ?.getAttribute('data-sequence-value'),
        ).toBe('17');
      }
      if (l.id === 'H07-L05')
        expect(
          w.container
            .querySelector('[data-geometric-power="4"]')
            ?.getAttribute('data-geometric-value'),
        ).toBe('48');
      w.unmount();
    }
  });
  it('restores corrected guided work in all six lessons without completing unworked independent practice', () => {
    for (const [id, a] of [
      ['H07-L01', '8'],
      ['H07-L02', '20'],
      ['H07-L03', '40'],
      ['H07-L04', '-24'],
      ['H07-L05', '45'],
      ['H07-L06', '142 NZD'],
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
  it('leaves the initial-condition and arbitrary-index recurrence proof for human review and preserves its original text', () => {
    const v = mount('/math/lesson/H07-L01');
    click(/^06 Reflect/);
    const text =
      'The first term1 agrees with1². For every positive integer n, (n+1)²−n²=2n+1, the stated increment. The same initial value and deterministic next-step rule determine each term. Four successful observations alone do not prove a rule.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H07-L01']
        .answers['H07-L01-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H07-L01');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('stores all eight unit answers with independent finite-tail and timed-savings arguments', () => {
    const v = mount('/math/unit/H07/check');
    for (const [n, a] of [
      ['1', 'insufficient'],
      ['2', '3'],
      ['3', '40'],
      ['4', '-24'],
      ['5', '45'],
    ]) {
      click(`Question ${n}`);
      enter('Your answer', a!);
      click(/Check answer/);
    }
    click('Question 6');
    click('B Bₖ=q(Bₖ₋₁+c)');
    click(/Check answer/);
    click('Question 7');
    enter(
      'Your reasoning',
      'The finite three-term sum is7/4. Subtracting half the sum leaves1−1/8=7/8, hence S3=7/4. The tail1/8 cannot be dropped; an infinite sum would be a different question.',
    );
    expect(screen.getByText(/Recorded 6\/8/)).toBeTruthy();
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'Before first-period actions B0=100, one deposit10 per period, ideal multiplier1.1 with no per-period rounding or fees. End balances120,142,166.2; start121,144.1,169.51. Contributions130, gains36.2/39.51. End periods4/5=192.82/222.102, start197.461/228.2071, so both first reach200 at period5, despite different balances.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H07/check');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H07-L01'],
    ).toBeUndefined();
  });
  it('advances a due savings retrieval without retaining the old numerical answer or success', () => {
    const v = mount('/math/lesson/H07-L06');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '142');
    click(/Check answer/);
    enter('Your answer', '144.1');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '60');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H07-L06'].round).toBe(1);
    saved.sessions['H07-L06'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '60');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '71');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
});
