// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AppliedLab } from './AppliedLabs';
import { App } from './App';
import { p68Lessons } from './content/P68';
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
const slide = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
const choose = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
const enter = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('textbox', { name }), {
    target: { value },
  });
const check = () => click(/Check answer/);
const mount = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/math/*" element={<App />} />
      </Routes>
    </MemoryRouter>,
  );
describe('P68 applied workshops', () => {
  it('uses a consistent minute axis and includes stop time, clearing stale predictions after a change', () => {
    const v = render(<AppliedLab kind="applied-travel" mode="en" />);
    expect(
      v.container.querySelector('[data-moving-path]')!.getAttribute('points'),
    ).toBe('45,175 225,35 315,35');
    enter('My whole-trip average (km/h)', '6');
    click('Check the relationship');
    expect(document.querySelector('p[role="status"]')!.textContent).toContain(
      'Recheck',
    );
    enter('My whole-trip average (km/h)', '4 km/h');
    click('Check the relationship');
    expect(document.querySelector('p[role="status"]')!.textContent).toContain(
      'Correct: 4 km/h',
    );
    slide('Stop time (min)', '0');
    expect(document.querySelector('p[role="status"]')).toBeNull();
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
    enter('My whole-trip average (km/h)', '6');
    click('Check the relationship');
    expect(document.querySelector('p[role="status"]')!.textContent).toContain(
      'Correct: 6',
    );
    expect(screen.getByRole('region').getAttribute('tabindex')).toBe('0');
  });
  it('adds rates, caps work at capacity and explains the zero-rate undefined completion time', () => {
    const v = render(<AppliedLab kind="applied-work" mode="en" />);
    expect(
      v.container.querySelector('[data-work-done]')!.getAttribute('width'),
    ).toBe('140');
    enter('My remaining work (L)', '40 L');
    click('Check the relationship');
    expect(document.querySelector('p[role="status"]')!.textContent).toContain(
      'Correct: 40 L',
    );
    slide('Elapsed time (min)', '30');
    expect(
      v.container.querySelector('[data-work-done]')!.getAttribute('width'),
    ).toBe('420');
    slide('Pump A (L/min)', '0');
    slide('Pump B (L/min)', '0');
    expect(screen.getByText(/Both rates are zero/)).toBeTruthy();
    expect(
      v.container.querySelector('[data-work-done]')!.getAttribute('width'),
    ).toBe('0');
    enter('My remaining work (L)', '60');
    click('Check the relationship');
    expect(document.querySelector('p[role="status"]')!.textContent).toContain(
      'Correct: 60',
    );
  });
  it('discounts only tickets, protects reserves and handles zero and full discounts', () => {
    render(<AppliedLab kind="applied-budget" mode="en" />);
    expect(document.querySelector('p[role="status"]')!.textContent).toContain(
      'NZ$10.00 remains',
    );
    enter('My total spending (NZD)', '75');
    click('Check the relationship');
    expect(
      document.querySelectorAll('p[role="status"]')[1]!.textContent,
    ).toContain('Recheck');
    slide('Budget (NZD)', '80');
    expect(document.querySelector('p[role="status"]')!.textContent).toContain(
      'shortfall of NZ$8.00',
    );
    slide('Ticket discount (%)', '100');
    enter('My total spending (NZD)', '20');
    click('Check the relationship');
    expect(
      document.querySelectorAll('p[role="status"]')[1]!.textContent,
    ).toContain('Correct: 20');
    slide('Ticket discount (%)', '0');
    enter('My total spending (NZD)', '100');
    click('Check the relationship');
    expect(
      document.querySelectorAll('p[role="status"]')[1]!.textContent,
    ).toContain('Correct: 100');
  });
  it('preserves chart records when rescaling and does not replace missing Wednesday with zero', () => {
    const v = render(<AppliedLab kind="applied-chart" mode="en" />);
    expect(
      screen.getByText(
        /Original records: Monday 12 visits, Tuesday 18, Wednesday missing, Thursday 24/,
      ),
    ).toBeTruthy();
    const heights = () =>
      Array.from(v.container.querySelectorAll('[data-count]')).map((e) =>
        Number(e.getAttribute('height')),
      );
    expect(heights()).toEqual([72, 108, 144]);
    choose('Axis maximum (people)', '60');
    expect(heights()).toEqual([36, 54, 72]);
    enter('My group total cost (NZD)', '82');
    click('Check the relationship');
    expect(document.querySelector('p[role="status"]')!.textContent).toContain(
      'Correct: 82',
    );
    choose('Select day', '2');
    expect(screen.queryByRole('textbox')).toBeNull();
    expect(document.querySelector('p[role="status"]')!.textContent).toContain(
      'cannot be determined',
    );
    expect(v.container.querySelectorAll('[data-count]')).toHaveLength(3);
    choose('Select day', '3');
    expect((screen.getByRole('textbox') as HTMLInputElement).value).toBe('');
    enter('My group total cost (NZD)', '106');
    click('Check the relationship');
    expect(document.querySelector('p[role="status"]')!.textContent).toContain(
      'Correct: 106',
    );
  });
  it('requires both constraints and permits equality at the exact protected limit', () => {
    const v = render(<AppliedLab kind="applied-trip" mode="en" />);
    expect(
      screen.getByText(/Spending \/ reserve \/ available/).closest('p')!
        .textContent,
    ).toContain('NZ$100.00 / NZ$16.00 / NZ$144.00');
    expect(v.container.querySelectorAll('[data-segment]')).toHaveLength(5);
    expect(screen.getByText('12:20–12:50')).toBeTruthy();
    slide('Budget (NZD)', '80');
    expect(document.querySelector('p[role="status"]')!.textContent).toContain(
      'infeasible',
    );
    choose('Route', 'scenic');
    choose('Activity', 'garden');
    slide('Allowed duration (min)', '240');
    expect(document.querySelector('p[role="status"]')!.textContent).toContain(
      'Both constraints met',
    );
    expect(screen.getByText(/Money headroom/).textContent).toContain('NZ$0.00');
    slide('Allowed duration (min)', '210');
    expect(document.querySelector('p[role="status"]')!.textContent).toContain(
      'infeasible',
    );
    expect(screen.getByText(/time shortfall 30 min/)).toBeTruthy();
  });
  it('does not call the cheapest itinerary feasible when it is late; changing people leaves group fares fixed', () => {
    render(<AppliedLab kind="applied-trip" mode="en" />);
    slide('Budget (NZD)', '80');
    slide('Allowed duration (min)', '240');
    choose('Route', 'scenic');
    choose('Activity', 'trail');
    expect(
      screen.getByText(/Spending \/ reserve \/ available/).closest('p')!
        .textContent,
    ).toContain('NZ$48.00');
    expect(document.querySelector('p[role="status"]')!.textContent).toContain(
      'infeasible',
    );
    choose('Route', 'direct');
    expect(document.querySelector('p[role="status"]')!.textContent).toContain(
      'Both constraints met',
    );
    expect(
      screen.getByText(/Spending \/ reserve \/ available/).closest('p')!
        .textContent,
    ).toContain('NZ$64.00');
    slide('People', '5');
    expect(
      screen.getByText(/Spending \/ reserve \/ available/).closest('p')!
        .textContent,
    ).toContain('NZ$70.00');
  });
});
describe('P68 bilingual lessons and durable formal learning evidence', () => {
  it('switches capstone retrieval from money to time without carrying the previous answer or success', () => {
    const v = mount('/math/lesson/P68-L05');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '200');
    check();
    enter('Your answer', '230');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(
      screen.getByText(/budget NZ\$120, 10% protected and spending NZ\$50/),
    ).toBeTruthy();
    enter('Your answer', '58 NZD');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['P68-L05'].round).toBe(1);
    saved.sessions['P68-L05'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(
      screen.getByText(
        /Allow three hundred minutes, with 30 each way, a 40-minute visit/,
      ),
    ).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
    enter('Your answer', '140 NZD');
    check();
    enter('Your answer', '140 min');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('labels the project draft as temporary and clears it on remount', () => {
    const v = render(<AppliedLab kind="applied-trip" mode="en" />);
    enter(
      'My plan justification (temporary workshop draft)',
      'Compare scenic garden with direct trail.',
    );
    expect(
      screen.getByText(/this temporary draft clears on reload/),
    ).toBeTruthy();
    v.unmount();
    render(<AppliedLab kind="applied-trip" mode="en" />);
    expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('');
  });
  it('opens all five hooks and two English examples per lesson, plus both languages', () => {
    for (const l of p68Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      expect(screen.getByRole('heading', { name: l.title.en })).toBeTruthy();
      expect(
        v.container.querySelector('.math-applied-hook')!.textContent,
      ).toContain('?');
      click(/03 Understand/);
      expect(
        screen.getAllByRole('heading', { name: /^Example [12]/ }),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    mount('/math/lesson/P68-L05');
    click(/03.*Understand/);
    expect(screen.getAllByRole('heading', { name: /^例 [12]/ })).toHaveLength(
      2,
    );
    expect(
      screen.getAllByRole('heading', { name: /^Example [12]/ }),
    ).toHaveLength(2);
  });
  it('rejects moving-speed and wrong-unit answers, then restores exact full-trip speed', () => {
    const v = mount('/math/lesson/P68-L01');
    click(/04 Together/);
    enter('Your answer', '6 km/h');
    check();
    enter('Your answer', '4 min');
    check();
    enter('Your answer', '4 千米/小时');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/P68-L01');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('4 千米/小时');
  });
  it('restores a fractional work time without accepting a sum of individual times', () => {
    const v = mount('/math/lesson/P68-L02');
    click(/05 Practice/);
    click('Question 4');
    enter('Your answer', '10');
    check();
    enter('Your answer', '12/5 min');
    check();
    v.unmount();
    mount('/math/lesson/P68-L02');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('12/5 min');
  });
  it('restores currency evidence without discounting ineligible costs', () => {
    const v = mount('/math/lesson/P68-L03');
    click(/04 Together/);
    enter('Your answer', '75');
    check();
    enter('Your answer', 'NZ$80.00');
    check();
    v.unmount();
    mount('/math/lesson/P68-L03');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('NZ$80.00');
  });
  it('requires whole purchase packs and saves the selected practice position', () => {
    const v = mount('/math/lesson/P68-L04');
    click(/05 Practice/);
    click('Question 4');
    enter('Your answer', '54');
    check();
    enter('Your answer', '60 NZD');
    check();
    v.unmount();
    mount('/math/lesson/P68-L04');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('60 NZD');
    expect(
      screen
        .getByRole('button', { name: 'Question 4' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });
  it('persists reviewed joint-constraint reasoning without marking an unfinished lesson complete', () => {
    mount('/math/lesson/P68-L05');
    click(/05 Practice/);
    click('Question 6');
    enter(
      'Your reasoning',
      'Scenic garden costs 24 transport plus 24 discounted tickets plus 24 lunches, total 72. Reserve eight from eighty leaves exactly seventy-two. Total time 240 minutes includes both journeys, lunch and buffer, finishing 13:00. Shortening the deadline by thirty minutes breaks feasibility; direct trail is another feasible activity if a garden is not required.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P68-L05']
        .completedAt,
    ).toBeUndefined();
  });
  it('stores eight unit-review records independently of lesson completion', () => {
    const v = mount('/math/unit/P68/check');
    for (const [n, input] of Object.entries({
      1: '6 km/h',
      2: '6 min',
      3: 'NZ$60',
      4: '9',
      5: '60',
      7: '200 min',
    })) {
      click(`Question ${n}`);
      enter('Your answer', input);
      check();
    }
    click('Question 6');
    click(/^B The three recorded days/);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'Scenic garden: transport24 + tickets32 times75% + lunch24 =72. Reserve8 protects ten percent of80; money fits exactly. Time60+60+30+60+30=240 minutes, ending13:00. Cheap scenic trail needs270 and fails, whereas direct trail costs64 and needs230 if that activity is acceptable.',
    );
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/P68/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P68-L05'],
    ).toBeUndefined();
  });
});
