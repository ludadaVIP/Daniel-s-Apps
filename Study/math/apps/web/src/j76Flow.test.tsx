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
import { InferenceLab, InferenceHookArt } from './InferenceLabs';
import { App } from './App';
import { j76Lessons } from './content/J76';
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
      name: 'Check my result',
    }),
  );
const feedback = (name: string) =>
  within(screen.getByRole('group', { name })).getByRole('status', {
    name: 'Reasoning feedback',
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
describe('J76 evidence and conditional-probability workshops', () => {
  it('separates the frame from the realised sample, and keeps all sampled IDs distinct', () => {
    const v = render(<InferenceLab kind="infer-sample" mode="en" />);
    expect(
      (
        screen.getByRole('button', {
          name: 'Switch to random to resample',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    expect(v.container.querySelectorAll('[data-sample-id]')).toHaveLength(6);
    expect(
      screen.getByText(/frame covers 8 records; this sample has 6/),
    ).toBeTruthy();
    enter('Mean of this sample (minutes)', '4');
    verify('Mean of this sample (minutes)');
    expect(feedback('Mean of this sample (minutes)')).toContain('matches');
    choose('Sampling method', 'random');
    expect(field('Mean of this sample (minutes)')).toBe('');
    expect(
      screen.getByText(/frame covers 24 records; this sample has 6/),
    ).toBeTruthy();
    const ids = () =>
      [...v.container.querySelectorAll('[data-sample-id]')].map((e) =>
        e.getAttribute('data-sample-id'),
      );
    const first = ids();
    expect(new Set(first).size).toBe(6);
    click('Next reproducible simulation');
    expect(ids()).not.toEqual(first);
    slide('Sample size', '8');
    expect(ids()).toHaveLength(8);
  });
  it('shows a reproducible random sample farther from the population than the same-size convenience comparison', () => {
    const v = render(<InferenceLab kind="infer-sample" mode="en" />);
    click('Compare a two-record simulation');
    expect(
      [...v.container.querySelectorAll('[data-sample-id]')].map((e) =>
        e.getAttribute('data-sample-id'),
      ),
    ).toEqual(['C8', 'C2']);
    enter('Mean of this sample (minutes)', '13');
    verify('Mean of this sample (minutes)');
    expect(feedback('Mean of this sample (minutes)')).toContain('matches');
    click('Show or hide the population comparison');
    expect(v.container.querySelectorAll('[data-population-id]')).toHaveLength(
      24,
    );
    expect(
      screen.getByText(/population mean is/).parentElement!.textContent,
    ).toContain('8 min');
    expect(
      screen.getByText(/same-size A-only comparison mean/).parentElement!
        .textContent,
    ).toContain('4 min');
    enter('Mean of this sample (minutes)', '12');
    expect(
      screen.queryByRole('status', { name: 'Reasoning feedback' }),
    ).toBeNull();
    click('Next reproducible simulation');
    expect(field('Mean of this sample (minutes)')).toBe('');
    expect(v.container.querySelectorAll('[data-population-id]')).toHaveLength(
      0,
    );
  });
  it('plots every duplicate on common scales and distinguishes spread from a shifted centre', () => {
    const v = render(<InferenceLab kind="infer-distribution" mode="en" />);
    const dots = [...v.container.querySelectorAll('[data-record-id]')];
    expect(dots).toHaveLength(12);
    expect(
      new Set(dots.slice(0, 6).map((e) => e.getAttribute('cx'))).size,
    ).toBe(1);
    expect(
      new Set(dots.slice(0, 6).map((e) => e.getAttribute('cy'))).size,
    ).toBe(6);
    enter('Range of group B', '6');
    verify('Range of group B');
    expect(feedback('Range of group B')).toContain('matches');
    click('Show or hide summaries');
    expect(v.container.querySelectorAll('[data-mean-marker]')).toHaveLength(2);
    choose('Distribution comparison', '1');
    expect(field('Range of group B')).toBe('');
    expect(v.container.querySelectorAll('[data-mean-marker]')).toHaveLength(0);
    enter('Range of group B', '3');
    verify('Range of group B');
    expect(feedback('Range of group B')).toContain('matches');
  });
  it('retains five records when checking an unusual observation and when replacing it with zero', () => {
    const v = render(<InferenceLab kind="infer-outlier" mode="en" />);
    enter('Changed mean', '14.4');
    verify('Changed mean');
    expect(feedback('Changed mean')).toContain('matches');
    enter('Changed median', '6');
    verify('Changed median');
    expect(feedback('Changed median')).toContain('matches');
    fireEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByText(/checked record remains valid/)).toBeTruthy();
    expect(v.container.querySelectorAll('[data-record-id]')).toHaveLength(10);
    slide('Replacement final value', '0');
    expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(
      false,
    );
    expect(field('Changed mean')).toBe('');
    expect(field('Changed median')).toBe('');
    expect(
      v.container.querySelectorAll('[data-record-value="0"]'),
    ).toHaveLength(1);
    enter('Changed mean', '22/5');
    verify('Changed mean');
    expect(feedback('Changed mean')).toContain('matches');
    enter('Changed median', '5');
    verify('Changed median');
    expect(feedback('Changed median')).toContain('matches');
  });
  it('requires a complete distinct ordered sample space and accepts a percentage probability', () => {
    const v = render(<InferenceLab kind="infer-space" mode="en" />);
    const name = 'Complete sample-space codes';
    for (const input of ['HH,HT,TT', 'HH,HT,TH,TH', 'H,T']) {
      enter(name, input);
      verify(name);
      expect(feedback(name)).toContain('Recheck');
    }
    enter(name, '{tt，th，ht，hh}');
    verify(name);
    expect(feedback(name)).toContain('matches');
    enter('Probability of the specified event', '50%');
    verify('Probability of the specified event');
    expect(feedback('Probability of the specified event')).toContain('matches');
    click('Show or hide the systematic list');
    expect(v.container.querySelectorAll('[data-outcome]')).toHaveLength(4);
    expect(
      v.container.querySelectorAll('[data-event-hit="true"]'),
    ).toHaveLength(2);
    choose('Supplied equally likely experiment', 'coin-spinner');
    expect(field(name)).toBe('');
    expect(v.container.querySelectorAll('[data-outcome]')).toHaveLength(0);
    enter(name, 'H1,H2,H3,T1,T2,T3');
    verify(name);
    expect(feedback(name)).toContain('matches');
  });
  it('counts thirty-six dice basics and six sum-seven outcomes, rather than eleven equal sums', () => {
    const v = render(<InferenceLab kind="infer-space" mode="en" />);
    choose('Supplied equally likely experiment', 'dice');
    click('Show or hide the systematic list');
    expect(v.container.querySelectorAll('[data-outcome]')).toHaveLength(36);
    expect(
      v.container.querySelectorAll('[data-event-hit="true"]'),
    ).toHaveLength(6);
    const name = 'Probability of the specified event';
    enter(name, '1/11');
    verify(name);
    expect(feedback(name)).toContain('Recheck');
    enter(name, '1/6');
    verify(name);
    expect(feedback(name)).toContain('matches');
  });
  it('updates both conditional count and denominator, displaying zero-probability branches accessibly', () => {
    const v = render(<InferenceLab kind="infer-tree" mode="en" />);
    const name = 'Event probability from paths';
    expect(
      v.container
        .querySelector('[data-tree-path="BB"]')
        ?.getAttribute('data-path-possible'),
    ).toBe('false');
    expect(within(screen.getByRole('table')).getAllByRole('row')).toHaveLength(
      5,
    );
    enter(name, '4/9');
    verify(name);
    expect(feedback(name)).toContain('Recheck');
    enter(name, '1/3');
    verify(name);
    expect(feedback(name)).toContain('matches');
    click('Inspect numbered-token outcomes');
    expect(
      v.container.querySelectorAll('[data-numbered-outcome]'),
    ).toHaveLength(6);
    choose('Between draws', 'replace');
    expect(field(name)).toBe('');
    expect(
      v.container
        .querySelector('[data-tree-path="BB"]')
        ?.getAttribute('data-path-possible'),
    ).toBe('true');
    expect(
      v.container.querySelectorAll('[data-numbered-outcome]'),
    ).toHaveLength(0);
    enter(name, '4/9');
    verify(name);
    expect(feedback(name)).toContain('matches');
    choose('Target event', 'at-least-blue');
    expect(field(name)).toBe('');
    enter(name, '5/9');
    verify(name);
    expect(feedback(name)).toContain('matches');
  });
  it('adds mutually exclusive different-colour paths and resets an altered experiment', () => {
    const v = render(<InferenceLab kind="infer-tree" mode="en" />);
    slide('Red tokens', '3');
    choose('Target event', 'different');
    enter('Event probability from paths', '1/2');
    verify('Event probability from paths');
    expect(feedback('Event probability from paths')).toContain('matches');
    click('Inspect numbered-token outcomes');
    expect(
      v.container.querySelectorAll('[data-numbered-outcome]'),
    ).toHaveLength(12);
    slide('Blue tokens', '2');
    expect(field('Event probability from paths')).toBe('');
    expect(
      v.container.querySelectorAll('[data-numbered-outcome]'),
    ).toHaveLength(0);
    enter('Event probability from paths', '3/5');
    verify('Event probability from paths');
    expect(feedback('Event probability from paths')).toContain('matches');
  });
  it('keeps five opening investigations as questions', () => {
    for (const l of j76Lessons) {
      const v = render(
        <InferenceHookArt
          kind={l.lab as Parameters<typeof InferenceHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(v.container.textContent).toContain('?');
      v.unmount();
    }
  });
});
describe('J76 complete lesson and record flows', () => {
  it('renders two complete examples in every English body and in both bilingual sections', () => {
    for (const l of j76Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J76-L05');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
  it('restores retries for all five new lessons without completing unfinished practice', () => {
    for (const [id, wrong, right] of [
      ['J76-L01', '24', '6'],
      ['J76-L02', '3', '0'],
      ['J76-L03', '6', '72/5'],
      ['J76-L04', 'HH,HT,TT', 'TT,TH,HT,HH'],
      ['J76-L05', '4/9', '1/3'],
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
  it('preserves the entered numbered outcome representation after refresh', () => {
    const v = mount('/math/lesson/J76-L05');
    click(/05 Practice/);
    click('Question 4');
    enter('Your answer', 'R1-R2,R2-R1');
    check();
    const input = '{B1−R2，B1−R1，R2−B1，R2−R1，R1−B1，R1−R2}';
    enter('Your answer', input);
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/J76-L05');
    expect(field('Your answer')).toBe(input);
  });
  it('requires human reasoning review and leaves unfinished lessons incomplete', () => {
    mount('/math/lesson/J76-L05');
    click(/05 Practice/);
    click('Question 6');
    enter(
      'Your reasoning',
      'Numbered tokens are equally likely. With two red and one blue, RR without replacement is 2/3 times 1/2, but with replacement it is 2/3 times 2/3. Colour paths do not all have equal probabilities. At least one blue is the complement of two red.',
    );
    expect(screen.queryByText('✓ Reasoning reviewed by a parent.')).toBeNull();
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J76-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('records eight unit-check answers independently and restores the check without creating lesson success', () => {
    const v = mount('/math/unit/J76/check');
    for (const [n, input] of Object.entries({
      1: '8',
      2: '9',
      3: '6',
      4: 'LL,LR,RL,RR',
      5: '1/6',
      6: '1/10',
    })) {
      click(`Question ${n}`);
      enter('Your answer', input);
      check();
    }
    click('Question 7');
    click(/^C /);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'A sample can miss a group or vary randomly. Dice sums have different numbers of equally likely numbered pairs. Replacement restores the original counts; without it both remaining count and denominator change. Multiply conditional path probabilities and add disjoint paths.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J76/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J76-L05'],
    ).toBeUndefined();
  });
  it('changes sample-space retrieval variants and clears preceding input and success', () => {
    const v = mount('/math/lesson/J76-L04');
    click(/05 Practice/);
    click('Question 3');
    enter('Your answer', 'H1,H2,H3,T1,T2');
    check();
    enter('Your answer', 'H1,H2,H3,T1,T2,T3');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', 'H1,H2,T1,T2');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J76-L04'].round).toBe(1);
    saved.sessions['J76-L04'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', 'H1,H2,H3,T1,T2,T3');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
