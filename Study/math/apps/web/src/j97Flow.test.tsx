// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProbabilityLab, ProbabilityHookArt } from './ProbabilityLabs';
import { FrequencyPlot } from './ProbabilityVisuals';
import { simulatePairs } from './probabilityModels';
import { j97Lessons } from './content/J97';
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
const task = 'My probability conclusion',
  submit = () => click(`Check: ${task}`),
  feedback = () =>
    screen.getByRole('status', { name: `${task} feedback` }).textContent;
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
describe('J97 experiments, conditional denominators and preserved records', () => {
  it('preserves independent predictions across table transposition and resets a changed model', () => {
    const v = render(
      <ProbabilityLab kind="probability-independent" mode="en" />,
    );
    enter(task, 'independent');
    submit();
    enter('Joint probability', '1/4');
    click('Transpose table view only');
    expect(field(task)).toBe('independent');
    expect(field('Joint probability')).toBe('1/4');
    expect(feedback()).toContain('matches');
    expect(v.container.querySelectorAll('[data-joint-cell]')).toHaveLength(4);
    choose('Independence model', '2');
    expect(field(task)).toBe('');
    enter(task, 'dependent');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('distinguishes disjoint dependence and an impossible conditioning event without zero division', () => {
    render(<ProbabilityLab kind="probability-independent" mode="en" />);
    choose('Independence model', '1');
    enter(task, 'dependent');
    submit();
    click('Show or hide probability audit');
    expect(
      screen.getByRole('status', { name: 'Probability audit' }).textContent,
    ).toContain('P(B|A)=0');
    choose('Independence model', '4');
    enter(task, 'independent');
    submit();
    click('Show or hide probability audit');
    expect(
      screen.getByRole('status', { name: 'Probability audit' }).textContent,
    ).toContain('P(B|A) is undefined');
    expect(feedback()).toContain('matches');
  });
  it('separates complete path from conditional probability and updates removal rules', () => {
    render(<ProbabilityLab kind="probability-tree" mode="en" />);
    enter(task, '9/25');
    submit();
    enter('Second-step conditional probability', '3/5');
    click('Switch ID-grid and tree view only');
    expect(field(task)).toBe('9/25');
    expect(feedback()).toContain('matches');
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Replace before second draw' }),
    );
    expect(field(task)).toBe('');
    expect(field('Second-step conditional probability')).toBe('');
    enter(task, '3/10');
    submit();
    enter('Second-step conditional probability', '1/2');
    click('Check: Second-step conditional probability');
    expect(
      screen.getByRole('status', {
        name: 'Second-step conditional probability feedback',
      }).textContent,
    ).toContain('matches');
  });
  it('highlights twelve different-colour ID pairs out of twenty and retains prediction in tree view', () => {
    const v = render(<ProbabilityLab kind="probability-without" mode="en" />);
    expect(
      v.container.querySelectorAll('[data-pair-possible="true"]'),
    ).toHaveLength(20);
    expect(
      v.container.querySelectorAll('[data-pair-possible="false"]'),
    ).toHaveLength(5);
    enter(task, '3/5');
    submit();
    click('Show or hide probability audit');
    expect(v.container.querySelectorAll('.is-hit')).toHaveLength(12);
    click('Switch ID-grid and tree view only');
    expect(field(task)).toBe('3/5');
    expect(feedback()).toContain('matches');
    expect(v.container.querySelectorAll('[data-tree-path]')).toHaveLength(4);
  });
  it('retains different same-colour IDs but accepts impossible RR for a sole red', () => {
    const v = render(<ProbabilityLab kind="probability-without" mode="en" />);
    expect(
      v.container
        .querySelector('[data-pair="R1-R2"]')
        ?.getAttribute('data-pair-possible'),
    ).toBe('true');
    slide('Red token count', '1');
    choose('Requested event', 'two-red');
    enter(task, '0');
    submit();
    expect(feedback()).toContain('matches');
    click('Switch ID-grid and tree view only');
    expect(
      v.container
        .querySelector('[data-tree-path="RR"]')
        ?.getAttribute('data-path-possible'),
    ).toBe('false');
  });
  it('keeps the nearby frame distinct from the population and preserves answers through display changes', () => {
    render(<ProbabilityLab kind="probability-bias" mode="en" />);
    enter(task, 'insufficient');
    submit();
    enter('Proportion among respondents', '1/4');
    click('Reverse record display only');
    expect(field(task)).toBe('insufficient');
    expect(field('Proportion among respondents')).toBe('1/4');
    expect(feedback()).toContain('matches');
    expect(
      screen.getByText(/Frame 8\/24; invited 8; responses 8; yes 2; missing 0/),
    ).toBeTruthy();
    click('Use next reproducible sampling seed');
    expect(field(task)).toBe('');
  });
  it('records all eight C nonresponses and enables exact census only for 24 complete responses', () => {
    const v = render(<ProbabilityLab kind="probability-bias" mode="en" />);
    choose('Sampling method', 'nonresponse');
    slide('Invited count', '24');
    expect(screen.getByText(/responses 16; yes 6; missing 8/)).toBeTruthy();
    expect(
      [...v.container.querySelectorAll('[data-survey-id^="C"]')].every((e) =>
        e.textContent?.includes('No response'),
      ),
    ).toBe(true);
    enter('Proportion among respondents', '3/8');
    click('Check: Proportion among respondents');
    expect(
      screen.getByRole('status', {
        name: 'Proportion among respondents feedback',
      }).textContent,
    ).toContain('matches');
    choose('Sampling method', 'all');
    expect(field('Proportion among respondents')).toBe('');
    enter(task, 'sufficient');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('keeps zero-trial frequency undefined and starts plotting only actual trials', () => {
    const v = render(
      <ProbabilityLab kind="probability-simulation" mode="en" />,
    );
    expect(
      v.container.querySelector('[data-probability-frequency]'),
    ).toBeNull();
    enter(task, 'insufficient');
    submit();
    expect(feedback()).toContain('matches');
    click('Append 1 trial');
    expect(field(task)).toBe('');
    expect(
      v.container.querySelector('[data-probability-frequency]'),
    ).toBeTruthy();
    const m = simulatePairs(3, 2, false, 'different', 37, 1);
    enter(task, String(m.hits));
    submit();
    expect(feedback()).toContain('matches');
  });
  it('extends one run while retaining theory prediction and invalidating the preceding frequency', () => {
    render(<ProbabilityLab kind="probability-simulation" mode="en" />);
    enter('Theoretical probability prediction', '3/5');
    click('Check: Theoretical probability prediction');
    click('Append 10 trials');
    const m = simulatePairs(3, 2, false, 'different', 37, 10);
    enter(task, `${m.hits}/10`);
    submit();
    click('Switch first/latest 10 records only');
    expect(field(task)).toBe(`${m.hits}/10`);
    click('Append 10 trials');
    expect(field(task)).toBe('');
    expect(field('Theoretical probability prediction')).toBe('3/5');
    const n = simulatePairs(3, 2, false, 'different', 37, 20);
    enter(task, `${n.hits}/20`);
    submit();
    expect(feedback()).toContain('matches');
  });
  it('replays the same seed and resets a changed rule without merging unlike records', () => {
    const v = render(
      <ProbabilityLab kind="probability-simulation" mode="en" />,
    );
    click('Append 10 trials');
    const first = [...v.container.querySelectorAll('[data-trial]')].map(
      (e) => e.textContent,
    );
    click('Restart with the same seed');
    expect(v.container.querySelectorAll('[data-trial]')).toHaveLength(0);
    click('Append 10 trials');
    expect(
      [...v.container.querySelectorAll('[data-trial]')].map(
        (e) => e.textContent,
      ),
    ).toEqual(first);
    enter('Theoretical probability prediction', '3/5');
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Simulation replacement' }),
    );
    expect(v.container.querySelectorAll('[data-trial]')).toHaveLength(0);
    expect(field('Theoretical probability prediction')).toBe('');
    click('Append 10 trials');
    expect(
      [...v.container.querySelectorAll('[data-trial]')].map(
        (e) => e.textContent,
      ),
    ).not.toEqual(first);
  });
  it('plots actual cumulative values with a fixed vertical domain and no HTML spans inside SVG', () => {
    const m = simulatePairs(3, 2, false, 'different', 37, 10),
      v = render(
        <FrequencyPlot
          mode="bilingual"
          records={m.records}
          theory={m.theory}
        />,
      );
    expect(v.container.querySelector('svg span')).toBeNull();
    const path = v.container.querySelector('[data-probability-frequency]')!,
      pts = path.getAttribute('points')!.split(' ');
    expect(pts).toHaveLength(10);
    expect(Number(pts[0]!.split(',')[1])).toBe(270 - 220 * m.records[0]!.hits);
    expect(
      v.container
        .querySelector('[data-probability-theory]')
        ?.getAttribute('y1'),
    ).toBe('138');
  });
  it('renders all five hooks and two complete worked examples per language', () => {
    for (const l of j97Lessons) {
      const h = render(
        <ProbabilityHookArt
          kind={l.lab as Parameters<typeof ProbabilityHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(h.container.textContent).toContain('?');
      h.unmount();
      const v = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        v.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J97-L05');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
});
describe('J97 formal learning evidence and parent-reviewed reasoning', () => {
  it('restores supported retries in all five lessons without awarding unfinished course mastery', () => {
    for (const [id, wrong, right] of [
      ['J97-L01', 'dependent', 'independent'],
      ['J97-L02', '9/25', '3/10'],
      ['J97-L03', '1/2', '3/5'],
      ['J97-L04', '1/2', '1/4'],
      ['J97-L05', '3/5', '11/20'],
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
  it('preserves a human-reviewed finite-simulation explanation across refresh', () => {
    const v = mount('/math/lesson/J97-L05');
    click(/06 Reflect/);
    const text =
      'Restore the original bag each trial but do not replace the first token within it. Theory is 3/5; finite frequency need not improve monotonically or match exactly. Keep counts, seed and model parameters; seeded records are not real measurements and cannot prove reality.';
    enter('Your reasoning', text);
    parent();
    v.unmount();
    mount('/math/lesson/J97-L05');
    expect(field('Your reasoning')).toBe(text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J97-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('saves all eight unit records with two separate human reviews without changing lesson mastery', () => {
    const v = mount('/math/unit/J97/check');
    for (const [n, a] of Object.entries({
      1: 'independent',
      2: '3/10',
      3: '3/5',
      4: '3/4',
      5: '61/110',
    })) {
      click(`Question ${n}`);
      enter('Your answer', a);
      check();
    }
    click('Question 6');
    enter(
      'Your reasoning',
      'A sample matching one half is one outcome. Audit full-frame selection and response; random samples still vary, while restricted methods can match by chance.',
    );
    parent();
    click('Question 7');
    click(/^C Under the same independently reset/);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'The model resets the bag each complete trial. Finite frequency can move away from theory; no result proves the real model. Preserve the seed, parameters and all records without cherry-picking.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J97/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J97-L05'],
    ).toBeUndefined();
  });
  it('advances an independence retrieval without carrying an old classification or successful feedback', () => {
    const v = mount('/math/lesson/J97-L01');
    click(/05 Practice/);
    click('Question 4');
    enter('Your answer', 'independent');
    check();
    enter('Your answer', 'dependent');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', 'independent');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J97-L01'].round).toBe(1);
    saved.sessions['J97-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', 'dependent');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
