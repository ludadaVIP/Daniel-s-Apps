// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ConicLab, ConicHookArt } from './ConicLabs';
import { h22Lessons } from './content/H22';
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
describe('H22 geometric workbenches and persistent independent reasoning', () => {
  it('constructs equivalent line equations and distinguishes vertical from horizontal slope', () => {
    render(<ConicLab kind="conic-line" mode="en" />);
    const eq = 'Write this line equation',
      slope = 'Predict slope or undefined';
    enter(eq, 'y=2x+3');
    check(eq);
    expect(feedback(eq)).not.toContain('matches');
    enter(eq, '-4x+2y-2=0');
    check(eq);
    expect(feedback(eq)).toContain('matches');
    enter(slope, '2');
    check(slope);
    click('Change window');
    expect(field(eq)).toBe('-4x+2y-2=0');
    select('Choose a line', '1');
    expect(field(eq)).toBe('');
    enter(eq, 'x=2');
    check(eq);
    enter(slope, '0');
    check(slope);
    expect(feedback(slope)).not.toContain('matches');
    enter(slope, 'undefined');
    check(slope);
    expect(feedback(slope)).toContain('matches');
    select('Choose a line', '2');
    enter(eq, 'y=-3');
    check(eq);
    enter(slope, '0');
    check(slope);
    expect(feedback(slope)).toContain('matches');
  });
  it('audits a real perpendicular foot and retains distance under negative equation scaling', () => {
    const v = render(<ConicLab kind="conic-distance" mode="en" />),
      foot = 'Predict foot H coordinates',
      distance = 'Predict exact point-to-line distance';
    enter(foot, '(-1/5,7/5)');
    check(foot);
    enter(distance, '2');
    check(distance);
    click('Show/hide audit');
    expect(
      v.container
        .querySelector('[data-distance-name="PH"]')
        ?.getAttribute('data-to'),
    ).toBe('(-1/5, 7/5)');
    select('Choose a line', '1');
    expect(field(distance)).toBe('2');
    expect(field(foot)).toBe('');
    expect(feedback(distance)).toContain('matches');
    click('Change window');
    expect(field(distance)).toBe('2');
    select('Choose a line', '2');
    select('Choose point P', '1');
    enter(distance, '0');
    check(distance);
    enter(foot, '(2,0)');
    check(foot);
    click('Show/hide audit');
    expect(v.container.querySelector('[data-point-names="P/H"]')).toBeTruthy();
    expect(feedback(distance)).toContain('matches');
  });
  it('distinguishes circumference, singleton and empty locus without inventing a circle', () => {
    const v = render(<ConicLab kind="conic-circle" mode="en" />),
      eq = 'Write the locus equation',
      kind = 'Predict circle, point or empty',
      pos = 'Predict on, inside, outside or empty';
    enter(eq, 'x²+y²-2x+4y-20=0');
    check(eq);
    expect(feedback(eq)).toContain('matches');
    enter(kind, 'circle');
    check(kind);
    enter(pos, 'on');
    check(pos);
    expect(feedback(pos)).toContain('matches');
    select('Centre x-coordinate h', '0');
    expect(field(eq)).toBe('');
    expect(field(kind)).toBe('circle');
    select('Right side r²', '0');
    expect(v.container.querySelector('[data-circle-radius]')).toBeNull();
    enter(kind, 'point');
    check(kind);
    expect(feedback(kind)).toContain('matches');
    select('Right side r²', '-1');
    enter(kind, 'empty');
    check(kind);
    enter(pos, 'empty');
    check(pos);
    expect(feedback(pos)).toContain('matches');
    expect(screen.getByText(/No real points: no circle is drawn/)).toBeTruthy();
  });
  it('keeps signed half-parameter focus and directrix on opposite sides of a translated vertex', () => {
    const v = render(<ConicLab kind="conic-parabola" mode="en" />),
      eq = 'Write this curve equation',
      pf = 'Predict PF distance',
      pd = 'Predict perpendicular distance PD';
    enter(eq, 'y²=4x');
    check(eq);
    enter(pf, '5/4');
    check(pf);
    enter(pd, '5/4');
    check(pd);
    expect(feedback(pd)).toContain('matches');
    select('Centre or vertex', '1');
    select('Axis orientation', 'vertical');
    select('Focal parameter p', '-1/2');
    expect(field(eq)).toBe('');
    enter(eq, '(x-1)^2=-2(y+2)');
    check(eq);
    enter(pf, '5/8');
    check(pf);
    enter(pd, '5/8');
    check(pd);
    click('Show/hide audit');
    expect(feedback(pf)).toContain('matches');
    expect(
      v.container
        .querySelector('[data-directrix-axis="y"]')
        ?.getAttribute('data-directrix-value'),
    ).toBe('-1.5');
    const pfLine = v.container.querySelector('[data-distance-name="PF"]'),
      pdLine = v.container.querySelector('[data-distance-name="PD"]');
    expect(pfLine?.getAttribute('data-from')).toBe(
      pdLine?.getAttribute('data-from'),
    );
    expect(pdLine?.getAttribute('data-to')).toContain('-3/2');
  });
  it('preserves the ellipse sum while individual lengths and axis orientation change', () => {
    render(<ConicLab kind="conic-ellipse" mode="en" />);
    const sum = 'Predict sum PF1+PF2',
      pf = 'Predict PF1 distance',
      eq = 'Write this curve equation';
    enter(eq, 'x²/25+y²/16=1');
    check(eq);
    enter(sum, '10');
    check(sum);
    enter(pf, '34/5');
    check(pf);
    expect(feedback(pf)).toContain('matches');
    select('Trace parameter t (not x-coordinate)', '0');
    expect(field(sum)).toBe('10');
    expect(field(pf)).toBe('');
    enter(pf, '8');
    check(pf);
    select('Centre or vertex', '1');
    select('Axis orientation', 'vertical');
    expect(field(sum)).toBe('10');
    expect(field(pf)).toBe('8');
    expect(field(eq)).toBe('');
    select('Choose a and c', '2');
    expect(field(sum)).toBe('');
    enter(sum, '26');
    check(sum);
    expect(feedback(sum)).toContain('matches');
    expect(screen.getByText(/Outside this viewing window/)).toBeTruthy();
    click('Change window');
    expect(field(sum)).toBe('26');
    expect(screen.queryByText(/Outside this viewing window/)).toBeNull();
  });
  it('draws both hyperbola branches and reverses only the labelled signed difference', () => {
    const v = render(<ConicLab kind="conic-hyperbola" mode="en" />),
      abs = 'Predict absolute difference |PF1−PF2|',
      signed = 'Predict signed difference PF1−PF2',
      pf = 'Predict PF1 distance';
    expect(v.container.querySelectorAll('[data-conic-branch]')).toHaveLength(2);
    enter(abs, '6');
    check(abs);
    enter(signed, '6');
    check(signed);
    enter(pf, '34/3');
    check(pf);
    expect(feedback(pf)).toContain('matches');
    select('Hyperbola branch', '-1');
    expect(field(abs)).toBe('6');
    expect(field(signed)).toBe('');
    expect(field(pf)).toBe('');
    enter(signed, '-6');
    check(signed);
    enter(pf, '16/3');
    check(pf);
    expect(feedback(pf)).toContain('matches');
    expect(feedback(signed)).toContain('matches');
    click('Show/hide audit');
    expect(
      screen.getByRole('region', { name: 'Focal distance audit' }).textContent,
    ).toContain('-6');
    select('Axis orientation', 'vertical');
    expect(field(signed)).toBe('-6');
    expect(field(abs)).toBe('6');
  });
  it('renders all six hooks and both lesson languages with readable semantic SVG and valid colours', () => {
    for (const l of h22Lessons) {
      const v = render(
        <ConicHookArt
          mode="en"
          kind={l.lab as Parameters<typeof ConicHookArt>[0]['kind']}
        />,
      );
      expect(
        screen.getByRole('img', { name: /Equal-unit coordinate plane/ }),
      ).toBeTruthy();
      for (const el of v.container.querySelectorAll('[stroke],[fill]'))
        for (const attr of ['stroke', 'fill']) {
          const value = el.getAttribute(attr);
          if (value?.startsWith('#'))
            expect(value).toMatch(/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i);
        }
      v.unmount();
      const w = mount(`/math/lesson/${l.id}`);
      click(/^03 Understand/);
      expect(screen.getByRole('heading', { name: /Example 1:/ })).toBeTruthy();
      expect(screen.getByRole('heading', { name: /Example 2:/ })).toBeTruthy();
      click('中文');
      expect(screen.getByRole('heading', { name: /例1/ })).toBeTruthy();
      w.unmount();
      localStorage.setItem('study-language', 'en');
    }
  });
  it('restores six wrong-then-correct guided answers without completing unfinished practice', () => {
    for (const [id, value] of [
      ['H22-L01', '2x-y+1=0'],
      ['H22-L02', '2'],
      ['H22-L03', 'x²+y²-2x+4y-20=0'],
      ['H22-L04', 'y²=8x'],
      ['H22-L05', '16x²+25y²=400'],
      ['H22-L06', '16x²-9y²=144'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/^04 Together/);
      enter('Your answer', '0=0');
      click(/Check answer/);
      enter('Your answer', value!);
      click(/Check answer/);
      expect(
        screen.getByText(
          '✓ Completed with support. Your understanding is growing.',
        ),
      ).toBeTruthy();
      v.unmount();
      const w = mount(`/math/lesson/${id}`);
      expect(field('Your answer')).toBe(value);
      expect(
        JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions[id!]
          .completedAt,
      ).toBeUndefined();
      w.unmount();
    }
  });
  it('requires human review of squared distance equivalence and preserves the original explanation', () => {
    const v = mount('/math/lesson/H22-L04');
    click(/^06 Reflect/);
    const text =
      'PF=sqrt((x-1)^2+y^2), PD=|x+1|. Both distances are nonnegative. Squaring and subtracting gives y²=4x. Conversely x=y²/4>=0 and equality of squared nonnegative distances restores PF=PD, so no extra points were introduced.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H22-L04']
        .answers['H22-L04-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H22-L04');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('stores all eight unit answers including two human proofs separately from lesson mastery', () => {
    const v = mount('/math/unit/H22/check');
    for (const [n, value] of [
      ['1', 'y=2x+1'],
      ['2', '2'],
      ['3', '(x-1)^2+(y+2)^2=25'],
      ['4', 'y²=8x'],
      ['5', 'x²/25+y²/16=1'],
      ['6', 'x²/9-y²/16=1'],
    ]) {
      click(`Question ${n}`);
      enter('Your answer', value!);
      click(/Check answer/);
    }
    click('Question 7');
    enter(
      'Your reasoning',
      'PF=sqrt((x-1)^2+y^2), PD=|x+1|, both nonnegative. Squaring gives y²=4x; conversely equality of squared distances restores equality of their nonnegative roots.',
    );
    expect(screen.getByText(/Recorded 6\/8/)).toBeTruthy();
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'Foci are ten apart. The reverse triangle inequality bounds the absolute difference by ten: twelve is empty; ten gives the outer two closed rays including the foci; zero gives x=0; six is a nondegenerate two-branch hyperbola with a=3,c=5 and x²/9-y²/16=1.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H22/check');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H22-L01'],
    ).toBeUndefined();
  });
  it('changes due equation retrievals and clears preceding input and success evidence', () => {
    const v = mount('/math/lesson/H22-L01');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', 'y=2');
    click(/Check answer/);
    enter('Your answer', 'x=2');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', 'y=x-2');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H22-L01'].round).toBe(1);
    saved.sessions['H22-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', 'y=x-2');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', 'y=x-1');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
});
