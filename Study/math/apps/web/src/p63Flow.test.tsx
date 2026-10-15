// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { RatioLab } from './RatioLabs';
import { ProportionGraph } from './RatioVisuals';
import { App } from './App';
import { p63Lessons } from './content/P63';
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
const click = (name: string) =>
  fireEvent.click(screen.getByRole('button', { name }));
const slide = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('slider', { name }), { target: { value } });
const select = (name: string, value: string) =>
  fireEvent.change(screen.getByRole('combobox', { name }), {
    target: { value },
  });
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
describe('P63 interactive mathematical evidence', () => {
  it('keeps actual counts while changing order or comparing a part with the total', () => {
    const v = render(<RatioLab kind="ratio-compare" mode="en" />);
    expect(v.container.querySelectorAll('[data-ratio-counter]')).toHaveLength(
      10,
    );
    click('I identified the order; check the ratio');
    expect(screen.getByText(/A:B=4:6.*quotient is 2\/3/)).toBeTruthy();
    select('Comparison and order', 'whole');
    expect(v.container.querySelector('p[role=status]')).toBeNull();
    click('I identified the order; check the ratio');
    expect(screen.getByText(/A:total=4:10.*quotient is 2\/5/)).toBeTruthy();
    select('Comparison and order', 'reverse');
    click('I identified the order; check the ratio');
    expect(screen.getByText(/B:A=6:4.*quotient is 3\/2/)).toBeTruthy();
    expect(v.container.querySelectorAll('[data-ratio-counter]')).toHaveLength(
      10,
    );
  });
  it('preserves original counters when grouping and distinguishes invalid, equivalent and simplest divisors', () => {
    const v = render(<RatioLab kind="ratio-simplify" mode="en" />);
    click('I used equal small units; check integer terms');
    select('Divide both terms by', '2');
    click('Check equal division and simplest terms');
    expect(screen.getByText(/not an integer factor of both/)).toBeTruthy();
    expect(v.container.querySelectorAll('[data-ratio-group]')).toHaveLength(0);
    select('Divide both terms by', '1');
    click('Check equal division and simplest terms');
    expect(screen.getByText(/not simplest yet/)).toBeTruthy();
    select('Divide both terms by', '3');
    click('Check equal division and simplest terms');
    expect(screen.getByText(/6:9=2:3.*coprime/)).toBeTruthy();
    expect(v.container.querySelectorAll('[data-ratio-counter]')).toHaveLength(
      15,
    );
    expect(v.container.querySelectorAll('[data-ratio-group]')).toHaveLength(5);
    select('Ratio to simplify', '0.6:0.9');
    expect(v.container.querySelector('p[role=status]')).toBeNull();
    click('I used equal small units; check integer terms');
    expect(
      screen.getByText(/1\/10 units, 0.6:0.9 corresponds to 6:9/),
    ).toBeTruthy();
  });
  it('allocates fractional litres without losing quantity and keeps a zero-total weight plan empty', () => {
    const v = render(<RatioLab kind="ratio-share" mode="en" />);
    expect(v.container.querySelectorAll('[data-ratio-share]')).toHaveLength(5);
    click('I found all the parts; check the allocation');
    expect(
      screen.getByText(/A gets 10 L and B gets 15 L, totaling 25 L/),
    ).toBeTruthy();
    slide('Total to share (L)', '7');
    expect(v.container.querySelector('p[role=status]')).toBeNull();
    click('I found all the parts; check the allocation');
    expect(
      screen.getByText(/A gets 14\/5 L and B gets 21\/5 L, totaling 7 L/),
    ).toBeTruthy();
    slide('Total to share (L)', '0');
    click('I found all the parts; check the allocation');
    expect(
      screen.getByText(/observed 0:0 has no defined quotient/),
    ).toBeTruthy();
    expect(v.container.querySelectorAll('.ratio-empty')).toHaveLength(5);
  });
  it('rejects an equal-difference row, accepts common scaling and interprets zero without dividing', () => {
    const v = render(<RatioLab kind="ratio-table" mode="en" />);
    expect(screen.getAllByRole('row')).toHaveLength(5);
    click('I compared both terms; check the row');
    expect(
      screen.getByText(/unequal products show a different ratio/),
    ).toBeTruthy();
    slide('Candidate B (L)', '6');
    expect(v.container.querySelector('p[role=status]')).toBeNull();
    click('I compared both terms; check the row');
    expect(screen.getByText(/4×3=6×2=12/)).toBeTruthy();
    slide('Candidate A (L)', '0');
    slide('Candidate B (L)', '0');
    click('I compared both terms; check the row');
    expect(screen.getByText(/0:0 has no defined quotient/)).toBeTruthy();
  });
  it('keeps ground distance fixed while route and graphic scale bar zoom together and the printed numerical scale updates', () => {
    const v = render(<RatioLab kind="ratio-map" mode="en" />);
    const bar = () => v.container.querySelector('[data-map-scale-bar]')!;
    expect(
      Number(bar().getAttribute('x2')) - Number(bar().getAttribute('x1')),
    ).toBe(80);
    click('I matched units; check the route distance');
    expect(
      screen.getByText(/3\+2=5 cm: 250000 real cm=2500 m=2.5 km/),
    ).toBeTruthy();
    select('Display zoom', '2');
    expect(v.container.querySelector('p[role=status]')).toBeNull();
    expect(
      Number(bar().getAttribute('x2')) - Number(bar().getAttribute('x1')),
    ).toBe(160);
    expect(screen.getByText(/new numerical scale is 1:25000/)).toBeTruthy();
    expect(
      v.container.querySelector('[data-map-route]')!.getAttribute('points'),
    ).toBe('50,40 290,40 290,200');
    click('I matched units; check the route distance');
    expect(
      screen.getByText(/3\+2=5 cm: 250000 real cm=2500 m=2.5 km/),
    ).toBeTruthy();
  });
  it('tests constant quotients and the zero point instead of declaring every line or origin-crossing curve proportional', () => {
    const v = render(<RatioLab kind="ratio-graph" mode="en" />);
    click('I checked zero and quotients; check the relationship');
    expect(
      screen.getByText(/constant y\/x=3 NZ\$\/L.*is direct proportion/),
    ).toBeTruthy();
    select('Given relationship', 'fee');
    expect(v.container.querySelector('p[role=status]')).toBeNull();
    click('I checked zero and quotients; check the relationship');
    expect(
      screen.getByText(/zero litres costs four dollars.*7 and 5 NZ\$\/L/),
    ).toBeTruthy();
    select('Given relationship', 'square');
    click('I checked zero and quotients; check the relationship');
    expect(
      screen.getByText(
        /passes through the origin.*1, 2 and 4 NZ\$\/L.*not direct proportion/,
      ),
    ).toBeTruthy();
  });
  it('draws an exact quadratic, preserves values under axis rescaling, and exposes bilingual focusable figure regions', () => {
    const v = render(
      <ProportionGraph kind="square" rate={3} mode="bilingual" />,
    );
    const path = v.container.querySelector('path[data-proportion-line]')!;
    expect(path.getAttribute('d')).toBe('M60,300 Q280,300 500,108');
    // At t=1/2 the quadratic Bezier is x=4 L, y=16: screen (280,252).
    expect(0.25 * 300 + 0.5 * 300 + 0.25 * 108).toBe(252);
    expect(
      v.container.querySelector('[data-graph-x="4"]')!.getAttribute('cy'),
    ).toBe('252');
    expect(screen.getByRole('region').getAttribute('tabindex')).toBe('0');
    expect(screen.getByText(/假想价格规则已经给定/)).toBeTruthy();
    expect(screen.getByText(/fictional price rule is given/)).toBeTruthy();
    v.rerender(
      <ProportionGraph kind="square" rate={3} wide mode="bilingual" />,
    );
    expect(
      v.container
        .querySelector('[data-graph-x="8"]')!
        .getAttribute('data-graph-y'),
    ).toBe('64');
    expect(
      v.container.querySelector('[data-graph-x="8"]')!.getAttribute('cy'),
    ).toBe('204');
  });
});
describe('P63 authored learning and persistent evidence', () => {
  it('opens every lesson with two English examples and preserves both languages in bilingual mode', () => {
    for (const l of p63Lessons) {
      const v = mount(`/math/lesson/${l.id}`);
      expect(screen.getByRole('heading', { name: l.title.en })).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: /03 Understand/ }));
      expect(
        screen.getAllByRole('heading', { name: /^Example [12]/ }),
      ).toHaveLength(2);
      v.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    mount('/math/lesson/P63-L06');
    fireEvent.click(screen.getByRole('button', { name: /03.*Understand/ }));
    expect(screen.getAllByRole('heading', { name: /^例 [12]/ })).toHaveLength(
      2,
    );
    expect(
      screen.getAllByRole('heading', { name: /^Example [12]/ }),
    ).toHaveLength(2);
  });
  it('distinguishes A:total from A:B, accepts a full-width colon and restores answer and practice position', () => {
    const v = mount('/math/lesson/P63-L01');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 3');
    enter('2:3');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('2：5');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    v.unmount();
    mount('/math/lesson/P63-L01');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('2：5');
    expect(
      screen
        .getByRole('button', { name: 'Question 3' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });
  it('reports equivalent but unfinished simplest terms, rejects reversed order and keeps a correct ratio after remounting', () => {
    const v = mount('/math/lesson/P63-L02');
    fireEvent.click(screen.getByRole('button', { name: /04 Together/ }));
    expect(screen.getByText(/Use a simplest integer ratio/)).toBeTruthy();
    enter('4:6');
    check();
    expect(
      screen.getByText(/The value matches; finish the requested form/),
    ).toBeTruthy();
    enter('3:2');
    check();
    expect(screen.getByText(/Nearly there/)).toBeTruthy();
    enter('2:3');
    check();
    v.unmount();
    mount('/math/lesson/P63-L02');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('2:3');
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('restores exact fractional sharing with litres and does not accept a rounded-down whole amount', () => {
    const v = mount('/math/lesson/P63-L03');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 3');
    enter('2 L');
    check();
    enter('14/5 升');
    check();
    v.unmount();
    mount('/math/lesson/P63-L03');
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('14/5 升');
    expect(
      screen
        .getByRole('button', { name: 'Question 3' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });
  it('keeps map numbers paired with the requested ground unit and records an exact kilometre answer', () => {
    mount('/math/lesson/P63-L05');
    fireEvent.click(screen.getByRole('button', { name: /04 Together/ }));
    enter('2.5 m');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('5/2 千米');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('retains parent-reviewed proportionality reasoning without marking an unfinished lesson mastered', () => {
    const v = mount('/math/lesson/P63-L06');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 6');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'The given y=3x rule has quotient three for positive inputs and maps zero to zero. The fixed-fee line misses the origin and has changing quotients. The square curve goes through the origin but has changing quotients too. Do not divide zero by zero or infer a universal rule from a few points.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    v.unmount();
    mount('/math/lesson/P63-L06');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P63-L06']
        .completedAt,
    ).toBeUndefined();
  });
  it('records all eight unit-check answers including simplest ratios, quantities and manual explanation separately from lesson progress', () => {
    const v = mount('/math/unit/P63/check');
    for (const [n, text] of Object.entries({
      1: '2：3',
      2: '30 升',
      3: '12 L',
      4: '800 米',
      5: 'NZ$10',
      7: '4:5',
    })) {
      click(`Question ${n}`);
      enter(text);
      check();
    }
    click('Question 6');
    fireEvent.click(screen.getByRole('button', { name: /^B 4 L and 6 L/ }));
    check();
    click('Question 8');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'A is two fifths of the whole, not two thirds. A fixed fee changes the positive-input quotient and maps zero to four. Screen zoom preserves original coordinates and changes the scale bar together with the route; an enlarged print requires an updated numerical scale.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/P63/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['P63-L06'],
    ).toBeUndefined();
  });
  it('changes ratio retrieval numbers after a saved review and clears the preceding colon answer', () => {
    const v = mount('/math/lesson/P63-L01');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 2');
    enter('2:3');
    check();
    enter('3:2');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(screen.getByText('A has 2 cards and B 3. Write A:B.')).toBeTruthy();
    enter('2:3');
    check();
    fireEvent.click(screen.getByRole('button', { name: /Save this review/ }));
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['P63-L01'].round).toBe(1);
    saved.sessions['P63-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(screen.getByText('A has 3 cards and B 3. Write A:B.')).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
  });
});
