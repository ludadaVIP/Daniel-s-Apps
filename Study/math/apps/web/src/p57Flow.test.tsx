// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { DataLab } from './DataLabs';
import { TimeLine } from './DataVisuals';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { p57Lessons } from './content/P57';
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
const click = (name: string) =>
  fireEvent.click(screen.getByRole('button', { name }));
const select = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const tick = (name: string) =>
  fireEvent.click(screen.getByRole('checkbox', { name }));
const slide = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
const enter = (value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name: 'Your answer' }), {
    target: { value },
  });
const check = () =>
  fireEvent.click(screen.getByRole('button', { name: /Check answer/ }));
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
describe('P57 data workshops', () => {
  it('classifies each raw response once, keeps missing apart from zero and rejects an incorrect category', () => {
    const view = render(<DataLab kind="data-frequency" mode="en" />);
    expect(
      (
        screen.getByRole('button', {
          name: 'Check and record this response',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    select('Response category', 'bus');
    click('Check and record this response');
    expect(screen.getByText(/Reread the raw response/)).toBeTruthy();
    expect(
      view.container.querySelector('[data-frequency=bus]')!.textContent,
    ).toBe('0');
    expect(screen.getByText('Raw response 1/7: Walk')).toBeTruthy();
    for (const category of [
      'walk',
      'bus',
      'walk',
      'bike',
      'bus',
      'walk',
      'missing',
    ]) {
      select('Response category', category);
      click('Check and record this response');
    }
    expect(
      screen.queryByRole('button', { name: 'Check and record this response' }),
    ).toBeNull();
    for (const [category, count] of Object.entries({
      walk: 3,
      bike: 1,
      bus: 2,
      other: 0,
      missing: 1,
    }))
      expect(
        view.container.querySelector(`[data-frequency=${category}]`)!
          .textContent,
      ).toBe(String(count));
    click('I added the counts; check records');
    expect(
      screen.getByText(/Recorded 7\/7: 6 answered, 1 missing/),
    ).toBeTruthy();
    click('Sort the seven records again');
    expect(screen.getByText('Raw response 1/7: Walk')).toBeTruthy();
    expect(screen.queryByText(/Recorded 7\/7/)).toBeNull();
  });
  it('conserves every card while sharing and distinguishes an exact fractional mean from whole-card equality', () => {
    const view = render(<DataLab kind="data-mean" mode="en" />);
    expect(view.container.querySelectorAll('.math-data-counter')).toHaveLength(
      16,
    );
    expect(view.container.querySelector('[role=status]')).toBeNull();
    for (let i = 0; i < 4; i++) click('Move one card from most to least');
    for (let i = 0; i < 4; i++)
      expect(
        view.container.querySelectorAll(`[data-pile="${i}"]`),
      ).toHaveLength(4);
    expect(
      (
        screen.getByRole('button', {
          name: 'Move one card from most to least',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    click('I predicted; check the mean');
    expect(screen.getByText(/mean 16÷4=4 cards/)).toBeTruthy();
    select('Card-pile data', '1');
    expect(screen.queryByText(/mean 16÷4/)).toBeNull();
    click('I predicted; check the mean');
    expect(screen.getByText(/mean 5÷3=5\/3 cards/)).toBeTruthy();
    expect(view.container.querySelectorAll('.math-data-counter')).toHaveLength(
      5,
    );
    select('Card-pile data', '2');
    click('I predicted; check the mean');
    expect(screen.getByText(/mean 0÷3=0 cards/)).toBeTruthy();
    select('Card-pile data', '3');
    click('I predicted; check the mean');
    expect(screen.getByText(/mean 24÷4=6 cards/)).toBeTruthy();
  });
  it('plots unequal time gaps proportionally, rescales without changing data and leaves a genuine missing gap', () => {
    const view = render(<DataLab kind="data-line" mode="en" />);
    expect(
      [...view.container.querySelectorAll('circle')].map((e) =>
        e.getAttribute('cx'),
      ),
    ).toEqual(['60', '130', '270', '480']);
    expect(view.container.querySelectorAll('[data-time-segment]')).toHaveLength(
      3,
    );
    click('I read the chart; check the changes');
    expect(screen.getByText(/Changes are \+4, −2 and \+6/)).toBeTruthy();
    tick('Change vertical maximum from 24 to 40 °C');
    expect(screen.queryByText(/Changes are/)).toBeNull();
    expect(
      view.container
        .querySelector('[data-observation="1"]')!
        .getAttribute('cy'),
    ).toBe('176');
    tick('Mark hour 3 as missing');
    expect(view.container.querySelectorAll('[data-time-segment]')).toHaveLength(
      1,
    );
    expect(view.container.querySelectorAll('circle')).toHaveLength(3);
    expect(screen.getByText('Missing')).toBeTruthy();
    click('I read the chart; check the changes');
    expect(screen.getByText(/Hour 3 is missing: neither zero/)).toBeTruthy();
  });
  it('shows the axis break, preserves original counts and challenges unsupported ratio and population claims', () => {
    const view = render(<DataLab kind="data-chart" mode="en" />);
    expect(view.container.querySelector('[data-axis-break]')).toBeNull();
    tick('Truncate the axis at 38 people');
    expect(view.container.querySelector('[data-axis-break]')).toBeTruthy();
    const heights = [
      ...view.container.querySelectorAll('[data-chart-bar]'),
    ].map((e) => Number(e.getAttribute('height')));
    expect(heights[1]! / heights[0]!).toBe(3);
    select('Data claim', 'triple');
    click('Check the claim and evidence');
    expect(
      screen.getByText(/Forty-four is not three times forty/),
    ).toBeTruthy();
    select('Data claim', 'all');
    click('Check the claim and evidence');
    expect(screen.getByText(/Without representative sampling/)).toBeTruthy();
    select('Data claim', 'difference');
    click('Check the claim and evidence');
    expect(screen.getByText(/Supported: 44−40=4 people/)).toBeTruthy();
    tick('Truncate the axis at 38 people');
    expect(view.container.querySelector('[role=status]')).toBeNull();
  });
  it('separates recipe consumption, purchased packs, leftovers and positive budget shortfall', () => {
    const view = render(<DataLab kind="data-recipe" mode="en" />);
    expect(view.container.querySelector('[role=status]')).toBeNull();
    slide('Servings to make', '10');
    click('I planned; check quantities and whole-pack cost');
    expect(screen.getByText(/10 servings need 500 g and 750 mL/)).toBeTruthy();
    expect(
      screen.getByText(
        /Budget remaining NZ\$0.60; leftovers: 0 g flour and 250 mL milk/,
      ),
    ).toBeTruthy();
    slide('Servings to make', '12');
    expect(view.container.querySelector('[role=status]')).toBeNull();
    select('Fictional budget', '500');
    click('I planned; check quantities and whole-pack cost');
    expect(screen.getByText(/costing NZ\$7.80/)).toBeTruthy();
    expect(screen.getByText(/Budget is insufficient by NZ\$2.80/)).toBeTruthy();
    select('Fictional budget', '800');
    expect(view.container.querySelector('[role=status]')).toBeNull();
    click('I planned; check quantities and whole-pack cost');
    expect(screen.getByText(/Budget remaining NZ\$0.20/)).toBeTruthy();
  });
  it('provides bilingual captions, a focusable local scroll region and an explicit missing reading', () => {
    render(
      <TimeLine
        mode="bilingual"
        maxY={24}
        points={[
          { time: 0, value: 12 },
          { time: 3, value: null },
          { time: 6, value: 20 },
        ]}
      />,
    );
    expect(screen.getByRole('region').getAttribute('tabindex')).toBe('0');
    expect(screen.getByText(/假想观察/)).toBeTruthy();
    expect(screen.getByText(/Fictional observations/)).toBeTruthy();
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(
      '缺测',
    );
  });
});
describe('P57 lesson records and delivery', () => {
  it('opens all five lessons with their English examples and displays both languages on demand', () => {
    for (const l of p57Lessons) {
      const view = mount(`/math/lesson/${l.id}`);
      expect(screen.getByRole('heading', { name: l.title.en })).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: /03 Understand/ }));
      expect(
        screen.getAllByRole('heading', { name: /Example [12]/ }),
      ).toHaveLength(2);
      view.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    mount('/math/lesson/P57-L02');
    fireEvent.click(screen.getByRole('button', { name: /03.*Understand/ }));
    expect(screen.getAllByRole('heading', { name: /^例 [12]/ })).toHaveLength(
      2,
    );
    expect(
      screen.getAllByRole('heading', { name: /^Example [12]/ }),
    ).toHaveLength(2);
  });
  it('restores the exact fractional mean after a rejected rounded answer and retains support status', () => {
    const view = mount('/math/lesson/P57-L02');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 3');
    enter('1.67');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('10/6 张卡');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    view.unmount();
    mount('/math/lesson/P57-L02');
    expect(
      screen
        .getByRole('button', { name: 'Question 3' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('10/6 张卡');
  });
  it('keeps temperature units distinct from time and restores a supported correct observation change', () => {
    const view = mount('/math/lesson/P57-L03');
    fireEvent.click(screen.getByRole('button', { name: /04 Together/ }));
    enter('6 min');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('6 摄氏度');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    view.unmount();
    mount('/math/lesson/P57-L03');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('6 摄氏度');
  });
  it('requires a parent to review evidence without marking an otherwise unpractised lesson mastered', () => {
    const view = mount('/math/lesson/P57-L04');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 6');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'The counts forty and forty-four differ by four, not triple. The truncated bars start at thirty-eight. Two days cannot establish a full year, and missing periods and consistent populations must be checked.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    view.unmount();
    mount('/math/lesson/P57-L04');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P57-L04']
        .completedAt,
    ).toBeUndefined();
  });
  it('records all eight unit questions and restores the final reviewed explanation separately from lesson mastery', () => {
    const view = mount('/math/unit/P57/check');
    for (const [n, v] of Object.entries({
      1: '2 people',
      2: '4 cards',
      3: '8℃',
      5: '6',
      6: '300 克',
      7: 'NZ$7.80',
    })) {
      click(`Question ${n}`);
      enter(v);
      check();
    }
    click('Question 4');
    fireEvent.click(
      screen.getByRole('button', { name: /^B Retain a missing label/ }),
    );
    check();
    click('Question 8');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Ten servings consume seven hundred fifty millilitres of milk, but the shop only sells whole one-litre cartons. Starting with no stock means paying three dollars and retaining two hundred fifty millilitres, rather than paying for just the consumed portion.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    view.unmount();
    mount('/math/unit/P57/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P57-L02'],
    ).toBeUndefined();
  });
  it('changes a later due retrieval from missing count to respondent count and clears old input', () => {
    const view = mount('/math/lesson/P57-L01');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 2');
    enter('10');
    check();
    enter('9');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(
      screen.getByText(/Of 6 invitations, 2 walk, 1 bike and 2 use a bus/),
    ).toBeTruthy();
    enter('1');
    check();
    fireEvent.click(screen.getByRole('button', { name: /Save this review/ }));
    view.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['P57-L01'].round).toBe(1);
    saved.sessions['P57-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(
      screen.getByText(/Of 7 invitations, 3 walk, 1 bike and 2 use a bus/),
    ).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
  });
});
