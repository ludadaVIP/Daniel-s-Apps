// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ChanceLab } from './ChanceLabs';
import { FrequencyPlot } from './ChanceVisuals';
import { spinnerModel } from './chanceModels';
import { App } from './App';
import { p67Lessons } from './content/P67';
import { STORAGE_KEY } from './progress';
vi.setConfig({ testTimeout: 20000 });
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
const slide = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
const select = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const feedback = () =>
  screen.getByRole('status', { name: 'Workshop feedback' }).textContent;
const check = () => click(/Check answer/);
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
describe('P67 statistics and probability workshops', () => {
  it('sorts every observation, highlights the middle pair and clears preceding answers on a dataset change', () => {
    const v = render(<ChanceLab kind="chance-order" mode="en" />);
    expect(v.container.querySelectorAll('[data-observation-id]')).toHaveLength(
      5,
    );
    click('Sort while retaining every observation');
    expect(v.container.querySelectorAll('[data-middle=true]')).toHaveLength(1);
    enter('My median', '3');
    enter('All modes (commas, or no mode)', '3');
    click('Check middle positions and highest frequency');
    expect(feedback()).toContain('Median correct; modes complete');
    select('Observation set', 'even');
    expect(
      (screen.getByRole('textbox', { name: 'My median' }) as HTMLInputElement)
        .value,
    ).toBe('');
    expect(
      screen.queryByRole('status', { name: 'Workshop feedback' }),
    ).toBeNull();
    click('Sort while retaining every observation');
    expect(v.container.querySelectorAll('[data-middle=true]')).toHaveLength(2);
    enter('My median', '5');
    enter('All modes (commas, or no mode)', 'no mode');
    click('Check middle positions and highest frequency');
    expect(feedback()).toContain('median 5');
    expect(feedback()).toContain('no mode');
    expect(screen.getByRole('region').getAttribute('tabindex')).toBe('0');
  });
  it('requires the complete tied modes and distinguishes actual zero from no mode', () => {
    render(<ChanceLab kind="chance-order" mode="en" />);
    select('Observation set', 'ties');
    enter('My median', '2');
    enter('All modes (commas, or no mode)', '1');
    click('Check middle positions and highest frequency');
    expect(feedback()).toContain('recheck all highest frequencies');
    enter('All modes (commas, or no mode)', '2,1');
    click('Check middle positions and highest frequency');
    expect(feedback()).toContain('modes complete');
    select('Observation set', 'zero');
    enter('My median', '0');
    enter('All modes (commas, or no mode)', 'no mode');
    click('Check middle positions and highest frequency');
    expect(feedback()).toContain('recheck all highest frequencies');
    enter('All modes (commas, or no mode)', '0');
    click('Check middle positions and highest frequency');
    expect(feedback()).toContain('modes complete');
  });
  it('matches mean, median or mode to the stated question while retaining a large observation', () => {
    render(<ChanceLab kind="chance-summary" mode="en" />);
    click('Check the choice against the question');
    expect(feedback()).toContain('Reread');
    expect(feedback()).toContain('mean 8, median 3');
    select('Choose a summary', 'median');
    click('Check the choice against the question');
    expect(feedback()).toContain('choice matches');
    slide('Last wait (minutes)', '8');
    click('Check the choice against the question');
    expect(feedback()).toContain('mean 4, median 3');
    select('Question to answer', 'share');
    select('Choose a summary', 'mean');
    click('Check the choice against the question');
    expect(feedback()).toContain('complete total');
    select('Question to answer', 'category');
    select('Choose a summary', 'mode');
    click('Check the choice against the question');
    expect(feedback()).toContain('category mode A');
  });
  it('separates impossible, uncertain and certain events from equal sector versus equal label chances', () => {
    const v = render(<ChanceLab kind="chance-equal" mode="en" />);
    click('Check the event and equal-likelihood conditions');
    expect(feedback()).toContain('probability 1/2');
    expect(feedback()).toContain('not equally likely');
    select('Observed event', 'D');
    select('Event classification', 'impossible');
    click('Check the event and equal-likelihood conditions');
    expect(feedback()).toContain('probability 0');
    select('Observed event', 'all');
    select('Event classification', 'certain');
    click('Check the event and equal-likelihood conditions');
    expect(feedback()).toContain('probability 1');
    select('Spinner structure', 'repeated');
    select('Observed event', 'B');
    select('Event classification', 'possible');
    click('Check the event and equal-likelihood conditions');
    expect(v.container.querySelectorAll('[data-chance-sector]')).toHaveLength(
      4,
    );
    expect(feedback()).toContain('probability 1/4');
    expect(feedback()).toContain('A=2/4');
    select('Spinner structure', 'thirds');
    click('Check the event and equal-likelihood conditions');
    expect(feedback()).toContain('probability 1/3');
    expect(feedback()).toContain('are equally likely');
  });
  it('counts individual bag objects, accepts exact percentage equivalence and combines event labels', () => {
    const v = render(<ChanceLab kind="chance-event" mode="en" />);
    expect(v.container.querySelectorAll('[data-chance-token]')).toHaveLength(6);
    expect(v.container.querySelectorAll('[data-selected=true]')).toHaveLength(
      3,
    );
    enter('My probability (fraction, decimal or percent)', '1/3');
    click('Check favourable and total objects');
    expect(feedback()).toContain('Recount');
    enter('My probability (fraction, decimal or percent)', '50%');
    click('Check favourable and total objects');
    expect(feedback()).toContain('Probability correct');
    select('Drawing event', 'AB');
    expect(v.container.querySelectorAll('[data-selected=true]')).toHaveLength(
      5,
    );
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
    enter('My probability (fraction, decimal or percent)', '5/6');
    click('Check favourable and total objects');
    expect(feedback()).toContain('5 favourable out of 6');
  });
  it('does not equate an empty bag with probability zero in a nonempty model', () => {
    render(<ChanceLab kind="chance-event" mode="en" />);
    select('Drawing event', 'D');
    enter('My probability (fraction, decimal or percent)', '0');
    click('Check favourable and total objects');
    expect(feedback()).toContain('Probability correct');
    for (const letter of ['A', 'B', 'C']) slide(`${letter} token count`, '0');
    expect(
      screen
        .getByRole('button', { name: 'Check favourable and total objects' })
        .hasAttribute('disabled'),
    ).toBe(true);
    expect(
      screen.getByText(/An empty bag has no drawing outcome/),
    ).toBeTruthy();
    expect(
      screen.queryByRole('status', { name: 'Workshop feedback' }),
    ).toBeNull();
  });
  it('starts frequency undefined, records a seeded batch, replays it and recounts a changed event', () => {
    const v = render(<ChanceLab kind="chance-frequency" mode="en" />);
    expect(screen.getByText(/frequency undefined \(no trials\)/)).toBeTruthy();
    expect(v.container.querySelector('[data-frequency-point]')).toBeNull();
    click('Simulate 10 trials');
    expect(
      screen.getByText(/10 trials, 5 hits; experimental frequency 5\/10=1\/2/),
    ).toBeTruthy();
    const history = screen.getByRole('list', {
      name: 'Latest simulated outcomes',
    }).textContent;
    expect(
      screen.getByRole('list', { name: 'Latest simulated outcomes' }).children,
    ).toHaveLength(8);
    select('Count letter', 'B');
    expect(
      screen.getByText(/10 trials, 1 hit; experimental frequency 1\/10=1\/10/),
    ).toBeTruthy();
    expect(
      screen.getByRole('list', { name: 'Latest simulated outcomes' })
        .textContent,
    ).toBe(history);
    click('Explain frequency and the next trial');
    expect(feedback()).toContain('does not force the next to compensate');
    click('Clear and replay this seed');
    expect(v.container.querySelector('[data-frequency-trace]')).toBeNull();
    click('Simulate 10 trials');
    expect(
      screen.getByRole('list', { name: 'Latest simulated outcomes' })
        .textContent,
    ).toBe(history);
    select('Spinner structure', 'thirds');
    expect(
      screen.getByText(/0 trials, 0 hits; experimental frequency undefined/),
    ).toBeTruthy();
    slide('Demonstration seed', '8');
    expect(screen.getByText(/undefined \(no trials\)/)).toBeTruthy();
  });
  it('plots cumulative counts proportionally and draws no invented zero observation before the first trial', () => {
    const model = spinnerModel(['A', 'B', 'C'], [2, 1, 1]),
      v = render(
        <FrequencyPlot outcomes={[]} event={['A']} model={model} mode="en" />,
      );
    expect(v.container.querySelector('[data-frequency-trace]')).toBeNull();
    v.rerender(
      <FrequencyPlot outcomes={['A']} event={['A']} model={model} mode="en" />,
    );
    expect(v.container.querySelector('[data-frequency-trace]')).toBeNull();
    expect(
      Number(
        v.container.querySelector('[data-frequency-point]')!.getAttribute('cy'),
      ),
    ).toBe(60);
    v.rerender(
      <FrequencyPlot
        outcomes={['A', 'B', 'A']}
        event={['A']}
        model={model}
        mode="en"
      />,
    );
    const points = v.container
      .querySelector('[data-frequency-trace]')!
      .getAttribute('points')!
      .split(' ')
      .map((s) => s.split(',').map(Number));
    expect(points[0]).toEqual([180, 60]);
    expect(points[1]).toEqual([310, 145]);
    expect(points[2]![0]).toBe(440);
    expect(points[2]![1]).toBeCloseTo(230 - (170 * 2) / 3, 10);
    expect(
      Number(
        v.container
          .querySelector('[data-theoretical-line]')!
          .getAttribute('y1'),
      ),
    ).toBe(145);
  });
});
describe('P67 simulation batch boundary', () => {
  it('retains the complete thousand-trial count, limits new trials and clears the batch when structure changes', () => {
    render(<ChanceLab kind="chance-frequency" mode="en" />);
    for (let i = 0; i < 10; i++) click('Simulate 100 trials');
    expect(screen.getByText(/1000 trials,/)).toBeTruthy();
    expect(
      screen
        .getByRole('list', { name: 'Latest simulated outcomes' })
        .getAttribute('start'),
    ).toBe('993');
    expect(
      document
        .querySelector('[data-trial-index]')!
        .getAttribute('data-trial-index'),
    ).toBe('993');
    expect(
      screen.getByRole('list', { name: 'Latest simulated outcomes' }).children,
    ).toHaveLength(8);
    for (const name of [
      'Simulate 1 trial',
      'Simulate 10 trials',
      'Simulate 100 trials',
    ])
      expect(
        screen.getByRole('button', { name }).hasAttribute('disabled'),
      ).toBe(true);
    select('Spinner structure', 'repeated');
    expect(
      screen.getByText(/0 trials, 0 hits; experimental frequency undefined/),
    ).toBeTruthy();
    expect(
      screen
        .getByRole('button', { name: 'Simulate 100 trials' })
        .hasAttribute('disabled'),
    ).toBe(false);
  });
});
describe('P67 bilingual lessons and independent records', () => {
  it('opens all five planned lessons with two English examples and both language versions', () => {
    for (const l of p67Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      expect(screen.getByRole('heading', { name: l.title.en })).toBeTruthy();
      expect(
        document.querySelector('.math-chance-hook')!.textContent,
      ).toContain('?');
      click(/03 Understand/);
      expect(
        screen.getAllByRole('heading', { name: /^Example [12]/ }),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    mount('/math/lesson/P67-L05');
    click(/03.*Understand/);
    expect(screen.getAllByRole('heading', { name: /^例 [12]/ })).toHaveLength(
      2,
    );
    expect(
      screen.getAllByRole('heading', { name: /^Example [12]/ }),
    ).toHaveLength(2);
  });
  it('rejects an incomplete tied mode and restores an order-independent complete set', () => {
    const v = mount('/math/lesson/P67-L01');
    click(/05 Practice/);
    click('Question 3');
    enter('Your answer', '1');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '2，1');
    check();
    v.unmount();
    mount('/math/lesson/P67-L01');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('2，1');
    expect(
      screen
        .getByRole('button', { name: 'Question 3' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });
  it('persists no-mode reasoning separately from a genuine zero mode', () => {
    const v = mount('/math/lesson/P67-L01');
    click(/05 Practice/);
    click('Question 4');
    enter('Your answer', '0');
    check();
    enter('Your answer', '无众数');
    check();
    click('Question 5');
    enter('Your answer', '0');
    check();
    v.unmount();
    mount('/math/lesson/P67-L01');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('0');
    click('Question 4');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('无众数');
  });
  it('rejects a category-count probability or wrong unit and restores an equivalent percentage', () => {
    const v = mount('/math/lesson/P67-L04');
    click(/04 Together/);
    enter('Your answer', '1/3');
    check();
    enter('Your answer', '1/2 cards');
    check();
    enter('Your answer', '50%');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/P67-L04');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('50%');
  });
  it('checks frequency from records instead of substituting theory and retains it on reload', () => {
    const v = mount('/math/lesson/P67-L05');
    click(/04 Together/);
    enter('Your answer', '1/2');
    check();
    enter('Your answer', '60%');
    check();
    v.unmount();
    mount('/math/lesson/P67-L05');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('60%');
  });
  it('records parent evidence without marking an unfinished statistics lesson mastered', () => {
    mount('/math/lesson/P67-L02');
    click(/05 Practice/);
    click('Question 6');
    enter(
      'Your reasoning',
      'Mean eight shares the full total forty into five parts, while median three describes the ordered middle. Retain the large value twenty-eight. Categories use frequency rather than numerical averages, and five waits do not predict every future wait.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P67-L02']
        .completedAt,
    ).toBeUndefined();
  });
  it('stores all eight review items including complete modes, theoretical chance and recorded frequency', () => {
    const v = mount('/math/unit/P67/check');
    for (const [n, input] of Object.entries({
      1: '4',
      2: '4,2',
      3: '25%',
      4: '2/3',
      5: '35%',
      7: '3',
    })) {
      click(`Question ${n}`);
      enter('Your answer', input);
      check();
    }
    click('Question 6');
    click(/^C This batch frequency is zero/);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'The waits have full-total mean eight and ordered median three. Retain twenty-eight. Six A outcomes in ten simulated trials give frequency three fifths, while the uniform-angle ideal chance remains one half and does not require compensation next.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/P67/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P67-L05'],
    ).toBeUndefined();
  });
  it('changes a saved retrieval from median to all modes and clears the previous numerical input', () => {
    const v = mount('/math/lesson/P67-L01');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '4');
    check();
    enter('Your answer', '5');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(screen.getByText('Find the median of 8, 0, 2, 6.')).toBeTruthy();
    enter('Your answer', '4');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['P67-L01'].round).toBe(1);
    saved.sessions['P67-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(screen.getByText('Give all modes of 1,1,2,2,4.')).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
    enter('Your answer', '2,1');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
