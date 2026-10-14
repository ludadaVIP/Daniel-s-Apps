// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProblemLab } from './ProblemLabs';
import { ProblemBars } from './ProblemVisuals';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
import { t } from './model';
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
describe('B06 model workshop', () => {
  it('sorts relevant knowns, the unknown and unused facts without printing the unknown answer', () => {
    const view = render(<ProblemLab kind="problem-information" mode="en" />);
    click('Check information roles');
    expect(screen.getByText(/Recheck roles/)).toBeTruthy();
    ['0', '0', '1', '2'].forEach((value, i) =>
      select(`Role of card ${i + 1}`, value),
    );
    click('Check information roles');
    expect(screen.getByText(/Known full and walked lengths/)).toBeTruthy();
    expect(
      view.container.querySelector('svg')!.getAttribute('aria-label'),
    ).toContain('Parts 7 and ?; whole 18');
    expect(view.container.querySelector('svg')!.textContent).not.toContain(
      '11',
    );
    select('Role of card 4', '0');
    expect(screen.queryByText(/Known full and walked lengths/)).toBeNull();
  });
  it('moves the unknown while preserving bar scale and resets the check when quantities change', () => {
    const view = render(<ProblemLab kind="problem-represent" mode="en" />);
    const width = view.container
      .querySelector('.problem-part-a')!
      .getAttribute('width');
    select('Quantity to find', 'component');
    expect(
      screen.queryByRole('slider', { name: 'Second part (m)' }),
    ).toBeNull();
    expect(
      screen.getByRole('slider', { name: 'Whole (m)' }).getAttribute('value'),
    ).toBe('15');
    expect(
      view.container.querySelector('.problem-part-a')!.getAttribute('width'),
    ).toBe(width);
    click('I made an expression; check the relationship');
    expect(screen.getByText(/15−9=6/)).toBeTruthy();
    slide('First part (m)', '12');
    expect(screen.queryByText(/15−9=6/)).toBeNull();
    expect(
      screen.getByRole('slider', { name: 'Whole (m)' }).getAttribute('value'),
    ).toBe('15');
    click('I made an expression; check the relationship');
    expect(screen.getByText(/15−12=3/)).toBeTruthy();
    slide('Whole (m)', '20');
    click('I made an expression; check the relationship');
    expect(screen.getByText(/20−12=8/)).toBeTruthy();
    click('Two quantities and a difference');
    click('I made an expression; check the relationship');
    expect(screen.getByText(/17−9=8/)).toBeTruthy();
    select('Quantity to find', 'component');
    expect(
      screen.queryByRole('slider', { name: 'Larger quantity (m)' }),
    ).toBeNull();
    expect(
      screen
        .getByRole('slider', { name: 'Difference (m)' })
        .getAttribute('value'),
    ).toBe('8');
    slide('Difference (m)', '5');
    slide('Smaller quantity (m)', '10');
    click('I made an expression; check the relationship');
    expect(screen.getByText(/10\+5=15/)).toBeTruthy();
    select('Quantity to find', 'result');
    slide('Larger quantity (m)', '0');
    expect(
      screen
        .getByRole('slider', { name: 'Smaller quantity (m)' })
        .getAttribute('value'),
    ).toBe('0');
    expect(screen.queryByText(/17−9=8/)).toBeNull();
    expect(
      view.container.querySelector('.problem-gap')!.getAttribute('width'),
    ).toBe('0');
    click('I made an expression; check the relationship');
    expect(screen.getByText(/0−0=0/)).toBeTruthy();
    click('Equal groups');
    expect(view.container.querySelectorAll('.problem-group')).toHaveLength(3);
    click('I made an expression; check the relationship');
    expect(screen.getByText(/3×4=12/)).toBeTruthy();
  });
  it('requires a valid plan, names the intermediate, and clamps removal when the available cards shrink', () => {
    render(<ProblemLab kind="problem-two-step" mode="en" />);
    select('First operation', '+');
    select('Second operation', '−');
    click('Check the two-step plan');
    expect(
      screen.queryByRole('button', { name: 'Expand step one' }),
    ).toBeNull();
    expect(
      screen.getByText(/box count and cards per box cannot be added/),
    ).toBeTruthy();
    select('First operation', '×');
    click('Check the two-step plan');
    click('Expand step one');
    expect(screen.getByText('Original: 4×6=24 cards.')).toBeTruthy();
    expect(screen.queryByText(/Remaining: 24−5/)).toBeNull();
    click('Expand step two');
    expect(
      screen.getByText('Remaining: 24−5=19 cards. Check 19+5=24.'),
    ).toBeTruthy();
    slide('Cards per box', '1');
    expect(screen.queryByText(/Remaining: 24−5/)).toBeNull();
    expect(
      screen
        .getByRole('slider', { name: 'Cards given away' })
        .getAttribute('value'),
    ).toBe('4');
    click('Check the two-step plan');
    click('Expand step one');
    click('Expand step two');
    expect(
      screen.getByText('Remaining: 4−4=0 cards. Check 0+4=4.'),
    ).toBeTruthy();
  });
  it('changes necessary facts with the requested quantity and refuses to invent a mass', () => {
    render(<ProblemLab kind="problem-relevance" mode="en" />);
    ['Budget NZ$30', 'Buy 4 notebooks', 'NZ$5 per notebook'].forEach(click);
    click('Check whether the information is sufficient');
    expect(screen.getByText(/30−20=NZ\$10/)).toBeTruthy();
    click('Total notebook cost');
    ['Buy 4 notebooks', 'NZ$5 per notebook'].forEach(click);
    click('Check whether the information is sufficient');
    expect(
      screen.getByText(/Budget does not affect this total cost/),
    ).toBeTruthy();
    click('NZ$3 per pencil pack');
    click('Check whether the information is sufficient');
    expect(screen.getByText(/No pencils are bought/)).toBeTruthy();
    click('Total notebook mass');
    click('Check whether the information is sufficient');
    expect(
      screen.getByText(/Insufficient information: mass per notebook/),
    ).toBeTruthy();
    expect(screen.queryByText('20 kg')).toBeNull();
  });
  it('distinguishes a correct final number from invalid reasoning and leaves learner writing for parent review', () => {
    render(<ProblemLab kind="problem-explain" mode="en" />);
    select('Explanation check', '0');
    click('Compare with the reasoning guide');
    expect(
      screen.getByText(/route to 17 and verification are missing/),
    ).toBeTruthy();
    click('Explanation 2');
    select('Explanation check', '1');
    click('Compare with the reasoning guide');
    expect(screen.getByText(/actually equals 6, not 17/)).toBeTruthy();
    click('Explanation 3');
    select('Explanation check', '2');
    click('Compare with the reasoning guide');
    expect(screen.getByText(/Use your own words for a new story/)).toBeTruthy();
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
  it('gives zero quantities zero widths and does not leak a hidden component in text or alternative descriptions', () => {
    const view = render(
      <ProblemBars
        relation="parts"
        a={0}
        b={0}
        unknown="result"
        unit={t('张', 'cards')}
        mode="en"
      />,
    );
    expect(
      view.container.querySelector('.problem-part-a')!.getAttribute('width'),
    ).toBe('0');
    expect(
      view.container.querySelector('.problem-part-b')!.getAttribute('width'),
    ).toBe('0');
    expect(view.container.querySelector('path')!.getAttribute('d')).toContain(
      'h0',
    );
    view.rerender(
      <ProblemBars
        relation="parts"
        a={9}
        b={15}
        unknown="component"
        unit={t('米', 'metres')}
        mode="en"
      />,
    );
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(
      'Parts 9 and ?; whole 24',
    );
    expect(view.container.querySelector('svg')!.textContent).not.toContain(
      '15',
    );
  });
  it('keeps bilingual relationship legends and native controls labelled', () => {
    render(<ProblemLab kind="problem-information" mode="bilingual" />);
    expect(
      screen.getAllByRole('option', {
        name: '相关已知 / Relevant known',
      }),
    ).toHaveLength(4);
    expect(
      screen.getByRole('combobox', { name: '信息卡 1 的角色' }),
    ).toBeTruthy();
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain('米');
  });
});
describe('B06 learner records and published integration', () => {
  it('restores a supported area answer with correct units after a wrong length suffix', () => {
    const view = mount('/math/lesson/B06-L05');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 4');
    enter('12 cm');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('12 cm²');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    view.unmount();
    mount('/math/lesson/B06-L05');
    expect(
      screen
        .getByRole('button', { name: 'Question 4' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('12 cm²');
  });
  it('preserves sixth-question original reasoning after parent review without completing the lesson', () => {
    const view = mount('/math/lesson/B06-L05');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 6');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Five bags of four give twenty cards. Three given away leaves seventeen, and seventeen plus three recovers twenty. Adding five and four does not count the cards.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    view.unmount();
    mount('/math/lesson/B06-L05');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      screen
        .getByRole('button', { name: 'Question 6' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['B06-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('restores all eight unit review items while keeping course mastery independent', () => {
    const view = mount('/math/unit/B06/check');
    for (const [index, value] of Object.entries({
      1: '17 m',
      2: '16 cm',
      3: '8 cards',
      4: '26 cards',
      6: '21 NZD',
      7: '19 NZD',
    })) {
      click(`Question ${index}`);
      enter(value);
      check();
    }
    click('Question 5');
    click('A Counter height');
    check();
    click('Question 8');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'We need five tickets, but their price is missing. Five tickets cannot be treated as five dollars, so we cannot determine cost, remaining money or whether the budget is enough.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    view.unmount();
    mount('/math/unit/B06/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.sessions['B06-CHECK'].answers['B06-CHECK-Q7'].input).toBe(
      '19 NZD',
    );
    expect(saved.sessions['B06-L01']).toBeUndefined();
  });
  it('uses new givens and unknown positions after a saved bar-model review becomes due', () => {
    const view = mount('/math/lesson/B06-L02');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 5');
    enter('13');
    check();
    enter('5');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(
      screen.getByText(
        'Whole 6 cm, first part 4 cm. How many cm is the other part?',
      ),
    ).toBeTruthy();
    enter('2 cm');
    check();
    fireEvent.click(screen.getByRole('button', { name: /Save this review/ }));
    view.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['B06-L02'].round).toBe(1);
    saved.sessions['B06-L02'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(
      screen.getByText('Two strips are 8 cm and 5 cm. What difference in cm?'),
    ).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
  });
  it('adds a completed D04 bridge while keeping pattern and equation content explicitly later', () => {
    mount('/math/check');
    fireEvent.click(screen.getByRole('button', { name: /D04/ }));
    expect(
      screen.queryByRole('link', {
        name: /Explore problem-solving relationships first/,
      }),
    ).toBeNull();
    for (let i = 0; i < 6; i++) click('Skip for now');
    expect(
      screen
        .getByRole('link', {
          name: /Explore problem-solving relationships first/,
        })
        .getAttribute('href'),
    ).toBe('/math/lesson/B06-L01');
    expect(
      screen.getByText(/patterns and equations continue in later lessons/),
    ).toBeTruthy();
  });
  it('publishes exactly the planned five lessons with retrieval and unit review while preserving all prior 37', () => {
    const unit = lessons.filter((l) => l.unit === 'B06');
    expect(unit).toHaveLength(5);
    expect(unitChecks.B06.questions).toHaveLength(8);
    unit.forEach((l) => {
      expect(l.contentStatus).toBe('ready');
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
      expect(reviewQuestionFor(l.id, 1).stem).not.toEqual(
        reviewQuestionFor(l.id, 0).stem,
      );
    });
    expect(
      lessons.filter((l) =>
        ['B01', 'B02', 'B03', 'B04', 'B05', 'P52', 'P53'].includes(l.unit!),
      ),
    ).toHaveLength(37);
    const planned = curriculum.flatMap((s) =>
      s.units.flatMap((u) => u.lessons),
    );
    expect(planned).toHaveLength(358);
    expect(
      planned
        .filter((l) => l.available)
        .map((l) => l.id)
        .sort(),
    ).toEqual(lessons.map((l) => l.id).sort());
  });
});
