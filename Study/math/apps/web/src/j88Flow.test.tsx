// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ResearchLab, ResearchHookArt } from './ResearchLabs';
import { ResearchBoxes, ResearchScatter } from './ResearchVisuals';
import { j88Lessons } from './content/J88';
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
const field = (name: string) =>
  (screen.getByRole('textbox', { name }) as HTMLInputElement).value;
const task = 'My data conclusion',
  submit = () => click('Check data conclusion'),
  feedback = () =>
    screen.getByRole('status', { name: 'Data conclusion feedback' })
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
describe('J88 active data workshops and evidence limits', () => {
  it('merges coincident five-number labels and reserves height for all repeated observations', () => {
    const v = render(
      <ResearchBoxes
        groups={[{ name: 'D', values: Array(40).fill('4') }]}
        mode="en"
        reveal
      />,
    );
    expect(v.container.querySelectorAll('[data-box-label]')).toHaveLength(1);
    expect(v.container.querySelector('[data-box-label]')!.textContent).toBe(
      'min/Q1/median/Q3/max=4',
    );
    const svg = v.container.querySelector('svg')!,
      height = Number(svg.getAttribute('viewBox')!.split(' ')[3]);
    for (const p of v.container.querySelectorAll('[data-observation]'))
      expect(Number(p.getAttribute('cy'))).toBeLessThan(height - 40);
  });

  it('sorts whole records, preserves answers across display changes and resets when the convention changes', () => {
    render(<ResearchLab kind="research-quartiles" mode="en" />);
    enter(task, '3');
    submit();
    expect(feedback()).toContain('matches');
    click('Sort or restore original order');
    click('Change common axis window');
    click('Show or hide halves and five numbers');
    expect(field(task)).toBe('3');
    expect(feedback()).toContain('matches');
    expect(
      screen.getByRole('status', { name: 'Halves audit' }).textContent,
    ).toContain('1, 2, 4, 4 | 6, 7, 8, 9');
    choose('Quartile convention', 'include');
    expect(field(task)).toBe('');
    enter(task, '4');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('handles even, equal and signed-fraction data without dropping duplicate observations', () => {
    const v = render(<ResearchLab kind="research-quartiles" mode="en" />);
    for (const [index, right] of [
      ['1', '3'],
      ['2', '4'],
      ['3', '-5/4'],
    ]) {
      choose('Data set', index!);
      expect(field(task)).toBe('');
      enter(task, right!);
      submit();
      expect(feedback()).toContain('matches');
    }
    expect(v.container.querySelectorAll('[data-observation]')).toHaveLength(5);
  });
  it('draws box positions from numerical values on the same axis and retains all original points', () => {
    const v = render(
      <ResearchBoxes
        groups={[
          { name: 'A', values: ['1', '2', '3', '4', '5'] },
          { name: 'B', values: ['1', '2', '3', '4', '9'] },
        ]}
        mode="en"
        max={10}
        step={2}
      />,
    );
    const boxes = v.container.querySelectorAll('[data-box-body]');
    expect(Number(boxes[0]!.getAttribute('x'))).toBe(146);
    expect(Number(boxes[0]!.getAttribute('width'))).toBe(132);
    expect(v.container.querySelectorAll('[data-observation]')).toHaveLength(10);
    expect(
      screen
        .getByRole('region', { name: 'Data display; scroll locally' })
        .getAttribute('tabindex'),
    ).toBe('0');
  });
  it('separates unchanged IQR from a changed range and resets only when records change', () => {
    const v = render(<ResearchLab kind="research-spread" mode="en" />);
    enter(task, '2');
    submit();
    click('Change common axis window');
    click('Show or hide spread comparison');
    expect(field(task)).toBe('2');
    expect(feedback()).toContain('matches');
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Change A9 from 6 to 30' }),
    );
    expect(field(task)).toBe('');
    enter(task, '26');
    submit();
    click('Show or hide spread comparison');
    expect(
      screen.getByRole('status', { name: 'Spread audit' }).textContent,
    ).toContain('A: median=5; range=26; IQR=3/2');
    expect(v.container.querySelectorAll('[data-observation]')).toHaveLength(18);
  });
  it('locates one row without re-pairing data, keeps the missing row and does not connect points', () => {
    const v = render(<ResearchLab kind="research-scatter" mode="en" />);
    expect(v.container.querySelectorAll('[data-scatter-point]')).toHaveLength(
      5,
    );
    expect(v.container.querySelectorAll('polyline')).toHaveLength(0);
    enter(task, 'positive');
    submit();
    click('P3');
    expect(
      v.container
        .querySelector('[data-scatter-point="P3"]')!
        .getAttribute('data-selected'),
    ).toBe('true');
    expect(
      v.container.querySelector('[data-scatter-point="P3"] title')!.textContent,
    ).toContain('(3, 2)');
    click('Change x-axis window');
    expect(field(task)).toBe('positive');
    click('P6');
    expect(v.container.querySelector('[data-scatter-point="P6"]')).toBeNull();
    expect(feedback()).toContain('matches');
  });
  it('distinguishes falling, balanced and curved cases and clears obsolete conclusions', () => {
    render(<ResearchLab kind="research-scatter" mode="en" />);
    for (const [i, raw] of [
      ['1', 'negative'],
      ['2', 'no-clear-linear'],
      ['3', 'curved'],
    ]) {
      choose('Paired-record case', i!);
      expect(field(task)).toBe('');
      enter(task, raw!);
      submit();
      expect(feedback()).toContain('matches');
    }
  });
  it('retains coincident record identities instead of silently deduplicating them', () => {
    const v = render(
      <ResearchScatter
        records={[
          { id: 'A', x: '2', y: '3' },
          { id: 'B', x: '2', y: '3' },
          { id: 'C', x: '4', y: null },
        ]}
        mode="en"
      />,
    );
    expect(v.container.querySelectorAll('[data-scatter-point]')).toHaveLength(
      1,
    );
    expect(
      v.container.querySelector('[data-scatter-point="A/B"]'),
    ).toBeTruthy();
    expect(v.container.textContent).toContain('A/B');
  });
  it('stratifies the same causal records while preserving the evidence verdict and distinguishes a design from a result', () => {
    const v = render(<ResearchLab kind="research-cause" mode="en" />);
    enter(task, 'insufficient');
    submit();
    expect(v.container.querySelectorAll('[data-scatter-point]')).toHaveLength(
      8,
    );
    choose('View the same records by weather', 'cool');
    expect(v.container.querySelectorAll('[data-scatter-point]')).toHaveLength(
      4,
    );
    choose('View the same records by weather', 'warm');
    expect(
      v.container.querySelectorAll('[data-scatter-point] rect'),
    ).toHaveLength(4);
    expect(field(task)).toBe('insufficient');
    expect(feedback()).toContain('matches');
    choose('Next evidence design', 'random');
    click('Audit or hide the design');
    expect(
      screen.getByRole('status', { name: 'Causal evidence audit' }).textContent,
    ).toContain('not running it or obtaining results');
    expect(field(task)).toBe('insufficient');
  });
  it('requires scoped questions, a missingness plan, source correction and checked analysis before exporting a draft', () => {
    render(<ResearchLab kind="research-investigate" mode="en" />);
    click('Next investigation stage');
    expect(
      screen.getByRole('status', { name: 'Investigation step feedback' })
        .textContent,
    ).toContain('scope exceeds');
    choose('Scope of the question', 'records');
    click('Next investigation stage');
    click('Next investigation stage');
    expect(
      screen.getByRole('status', { name: 'Investigation step feedback' })
        .textContent,
    ).toContain('Missing is not zero');
    choose('Record and missing-value plan', 'retain');
    click('Next investigation stage');
    click('Next investigation stage');
    expect(
      screen.getByRole('status', { name: 'Investigation step feedback' })
        .textContent,
    ).toContain('source card');
    click('Correct A6 from its source card');
    expect(
      screen.getByRole('status', { name: 'Correction record' }).textContent,
    ).toContain('27 → 7');
    click('Next investigation stage');
    enter('Median for group A', '4.5');
    click('Check analysis value');
    expect(
      screen.getByRole('status', { name: 'Investigation step feedback' })
        .textContent,
    ).toContain('five observed');
    enter('Median for group A', '5');
    click('Check analysis value');
    click('Next investigation stage');
    expect(
      screen.queryByRole('link', { name: 'Download my fictional-data report' }),
    ).toBeNull();
    enter(
      'My investigation conclusion draft',
      'These records have A median 5 and B 4.5; n=5/6, one missing, and different desks limit a fold-causation claim.',
    );
    const link = screen.getByRole('link', {
      name: 'Download my fictional-data report',
    });
    const report = decodeURIComponent(
      link.getAttribute('href')!.split(',').slice(1).join(','),
    );
    expect(report).toContain('A5\tA\tmissing');
    expect(report).toContain('A6\tA\t7');
    expect(report).toContain('These records have A median');
    expect(report).toContain('not automatically reviewed');
    expect(link.getAttribute('download')).toBe('J88-investigation.txt');
    click('Previous investigation stage');
    expect(field('Median for group A')).toBe('5');
    click('Next investigation stage');
    expect(field('My investigation conclusion draft')).toContain(
      'different desks',
    );
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
  it('keeps five opening investigations as questions', () => {
    for (const l of j88Lessons) {
      const v = render(
        <ResearchHookArt
          kind={l.lab as Parameters<typeof ResearchHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(v.container.textContent).toContain('?');
      v.unmount();
    }
  });
});
describe('J88 formal bilingual content and reviewed enquiry', () => {
  it('renders every English body and two complete examples per language in bilingual mode', () => {
    for (const l of j88Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J88-L05');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
  it('restores supported numeric/fraction/association retries without completing unworked lessons', () => {
    for (const [id, wrong, right] of [
      ['J88-L01', '4', '3'],
      ['J88-L02', '2', '3/2'],
      ['J88-L03', 'negative', '正相关'],
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
  it('accepts exact fractional quartiles and signed values in formal practice', () => {
    mount('/math/lesson/J88-L01');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '7.5');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
    click('Question 5');
    enter('Your answer', '-5/4');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
  it('requires human review for both causal and investigation introductions, preserving original explanations', () => {
    for (const [id, text] of [
      [
        'J88-L04',
        'Weather may affect both snacks and rentals; pooled association alone does not determine causal direction.',
      ],
      [
        'J88-L05',
        'Compare typical distances and spread in these twelve fictional records, using cm and reporting missingness and desk differences.',
      ],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/04 Together/);
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
  it('keeps a scoped investigation conclusion human-reviewed without treating a draft as a completed course', () => {
    const v = mount('/math/lesson/J88-L05');
    click(/06 Reflect/);
    enter(
      'Your reasoning',
      'Within observed records A median 5 exceeds B 9/2, with IQR 2 versus 1 and n=5/6. Retain missing A5 and log A6 correction. Different desks and no assignment limit causation and generalisation.',
    );
    parent();
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J88-L05');
    expect(field('Your reasoning')).toContain('Different desks');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J88-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('records eight separate unit-check items including two human explanations', () => {
    const v = mount('/math/unit/J88/check');
    for (const [n, raw] of Object.entries({
      1: '6',
      2: '17',
      3: '(4,7)',
      4: 'curved',
      5: 'insufficient',
    })) {
      click(`Question ${n}`);
      enter('Your answer', raw);
      check();
    }
    click('Question 6');
    enter(
      'Your reasoning',
      'Retain missing A5 and correct A6 from 27 to source seven. Keep twelve rows and observed n=5/6, documenting source and old/new values.',
    );
    parent();
    click('Question 7');
    click(/^B /);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'Scope the comparison to these records, retain missingness, log the source correction, compare common-scale medians 5 and 4.5 with IQRs 2 and 1, and report different desks and no assignment as limits.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J88/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J88-L05'],
    ).toBeUndefined();
  });
  it('changes retrieval quartile targets without inheriting the preceding answer', () => {
    const v = mount('/math/lesson/J88-L01');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '7');
    check();
    enter('Your answer', '15/2');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '-1');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J88-L01'].round).toBe(1);
    saved.sessions['J88-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '4');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
