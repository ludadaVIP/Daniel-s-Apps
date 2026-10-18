// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SimilarityLab, SimilarityHookArt } from './SimilarityLabs';
import {
  ScaleAreaView,
  SimilarityPhoto,
  SimilarityMap,
} from './SimilarityVisuals';
import { j94Lessons } from './content/J94';
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
const task = 'My similarity conclusion',
  submit = () => click(`Check: ${task}`),
  feedback = () =>
    screen.getByRole('status', { name: `${task} feedback` }).textContent;
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
describe('J94 interactive similarity and evidence', () => {
  it('retains labels and predictions through rotation, reflection, zoom and a bad proposed order', () => {
    const v = render(<SimilarityLab kind="similarity-meaning" mode="en" />);
    enter(task, 'similar');
    submit();
    enter('Corresponding triangle for ABC', 'DEF');
    enter('Positive second-to-first factor', '1.5');
    choose('Rotate second diagram only', '3');
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Reflect second diagram only' }),
    );
    click('Change common diagram zoom');
    choose('Audit a proposed correspondence only', 'DFE');
    click('Show or hide correspondence audit');
    expect(field(task)).toBe('similar');
    expect(field('Corresponding triangle for ABC')).toBe('DEF');
    expect(feedback()).toContain('matches');
    expect(
      screen.getByRole('status', { name: 'Correspondence audit' }).textContent,
    ).toContain('Check other correspondences');
    expect(
      [...v.container.querySelectorAll('[data-similarity-vertex]')].map(
        (e) => e.textContent,
      ),
    ).toEqual(['A', 'B', 'C', 'D', 'E', 'F']);
    slide('Horizontal scale factor', '1');
    expect(field(task)).toBe('');
    enter(task, 'similar');
    submit();
    click('Show or hide correspondence audit');
    expect(
      screen.getByRole('status', { name: 'Correspondence audit' }).textContent,
    ).toContain('also congruent');
  });
  it('rejects a directional stretch and clears tasks when mathematical factors change', () => {
    render(<SimilarityLab kind="similarity-meaning" mode="en" />);
    enter(task, 'similar');
    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Use one scale in both directions',
      }),
    );
    expect(field(task)).toBe('');
    enter(task, 'not similar');
    submit();
    expect(feedback()).toContain('matches');
    expect(
      screen.queryByRole('textbox', {
        name: 'Positive second-to-first factor',
      }),
    ).toBeNull();
  });
  it('uses the given evidence and distinguishes nonincluded SSA from AA and congruence', () => {
    render(<SimilarityLab kind="similarity-tests" mode="en" />);
    enter(task, 'AA');
    submit();
    choose('Rotate second diagram only', '2');
    expect(field(task)).toBe('AA');
    choose('Similarity-evidence case', '3');
    expect(field(task)).toBe('');
    enter(task, 'SAS');
    submit();
    expect(feedback()).not.toContain('matches');
    enter(task, 'insufficient');
    submit();
    click('Show or hide criterion audit');
    expect(feedback()).toContain('matches');
    expect(
      screen.getByRole('status', { name: 'Similarity-criterion audit' })
        .textContent,
    ).toContain('3√3−√7');
    choose('Similarity-evidence case', '6');
    enter(task, 'AAA');
    submit();
    click('Show or hide criterion audit');
    expect(feedback()).toContain('matches');
    expect(
      screen.getByRole('status', { name: 'Similarity-criterion audit' })
        .textContent,
    ).toContain('does not establish congruence');
  });
  it('handles forward, reverse, whole nested sides and insufficient givens', () => {
    render(<SimilarityLab kind="similarity-sides" mode="en" />);
    for (const [index, value, factor] of [
      ['0', '7.5 cm', '1.5'],
      ['1', '3 cm', '3/2'],
      ['2', '8 cm', '2/3'],
    ]) {
      choose('Similar-side case', index!);
      enter(task, value!);
      submit();
      enter('Scale in the stated direction', factor!);
      click('Check: Scale in the stated direction');
      expect(feedback()).toContain('matches');
    }
    click('Show or hide side-correspondence audit');
    expect(
      screen.getByRole('status', { name: 'Side-correspondence audit' })
        .textContent,
    ).toContain('AD/DB=2 is not');
    choose('Similar-side case', '3');
    enter(task, 'insufficient');
    submit();
    click('Show another possible triangle only');
    expect(field(task)).toBe('insufficient');
    expect(feedback()).toContain('matches');
  });
  it('counts actual unit cells and original-area blocks, then tests nonuniform area', () => {
    const v = render(<SimilarityLab kind="similarity-area" mode="en" />);
    enter('Target-to-original area factor', '4');
    click('Check: Target-to-original area factor');
    enter('Target area', '24 cm²');
    click('Check: Target area');
    expect(v.container.querySelectorAll('[data-similarity-cell]')).toHaveLength(
      24,
    );
    click('Show or hide area-block audit');
    expect(
      v.container.querySelectorAll('[data-similarity-area-block]'),
    ).toHaveLength(4);
    expect(field('Target area')).toBe('24 cm²');
    fireEvent.click(
      screen.getByRole('checkbox', { name: 'Uniform area-diagram scale' }),
    );
    expect(field('Target area')).toBe('');
    expect(v.container.querySelectorAll('[data-similarity-cell]')).toHaveLength(
      12,
    );
    expect(
      v.container.querySelectorAll('[data-similarity-area-block]'),
    ).toHaveLength(0);
    enter(task, 'not similar');
    submit();
    expect(feedback()).toContain('matches');
    enter('Target-to-original area factor', '2');
    click('Check: Target-to-original area factor');
  });
  it('zooms map route and bar together while retaining real-distance predictions', () => {
    const v = render(
      <SimilarityLab kind="similarity-applications" mode="en" />,
    );
    enter(task, '1.5 km');
    submit();
    const before = v.container
      .querySelector('[data-map-route]')!
      .getAttribute('d');
    slide('Map screen zoom only', '1.5');
    expect(field(task)).toBe('1.5 km');
    expect(feedback()).toContain('matches');
    expect(
      v.container.querySelector('[data-map-route]')!.getAttribute('d'),
    ).not.toBe(before);
    expect(
      v.container.querySelector('[data-map-scale]')!.getAttribute('d'),
    ).toContain('280');
  });
  it('models real cropped content, stretched content and perspective insufficiency separately', () => {
    render(<SimilarityLab kind="similarity-applications" mode="en" />);
    choose('Similarity-application case', '1');
    enter(task, 'similar');
    submit();
    expect(feedback()).toContain('matches');
    choose('Image operation', 'crop');
    expect(field(task)).toBe('');
    enter(task, 'not similar');
    submit();
    expect(feedback()).toContain('matches');
    expect(
      screen.getByRole('img', {
        name: 'Uniform resize, stretch, crop or perspective comparison',
      }),
    ).toBeTruthy();
    choose('Image operation', 'perspective');
    enter(task, 'insufficient');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('requires explicit shadow premises and removes the assumed triangles when they are absent', () => {
    const v = render(
      <SimilarityLab kind="similarity-applications" mode="en" />,
    );
    choose('Similarity-application case', '2');
    enter(task, '4.5 m');
    submit();
    expect(feedback()).toContain('matches');
    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Parallel-light and level-upright premises supplied',
      }),
    );
    expect(field(task)).toBe('');
    expect(v.container.querySelector('svg')).toBeNull();
    enter(task, 'insufficient');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('changes the motif geometry for stretch and perspective and uses a real crop clip', () => {
    const v = render(<SimilarityPhoto mode="en" operation="uniform" />),
      original = v.container
        .querySelector('[data-photo-motif]')!
        .getAttribute('points');
    v.rerender(<SimilarityPhoto mode="en" operation="stretch" />);
    expect(
      v.container.querySelector('[data-photo-motif]')!.getAttribute('points'),
    ).not.toBe(original);
    v.rerender(<SimilarityPhoto mode="en" operation="crop" />);
    expect(
      v.container.querySelector('clipPath polygon')!.getAttribute('points'),
    ).toBe('380,100 580,100 580,200 380,200');
    const cropY = v.container
      .querySelector('[data-photo-motif]')!
      .getAttribute('points')!
      .split(' ')
      .map((p) => Number(p.split(',')[1]));
    expect(Math.max(...cropY)).toBeGreaterThan(200);
    expect(Math.max(...cropY) - Math.min(...cropY)).toBeCloseTo(80);
    v.rerender(<SimilarityPhoto mode="en" operation="perspective" />);
    expect(v.container.querySelector('clipPath polygon')).toBeTruthy();
  });
  it('validates area grid bounds instead of silently truncating fractional cell counts', () => {
    expect(() => ScaleAreaView({ mode: 'en', sx: 1.5 })).toThrow();
    const v = render(<ScaleAreaView mode="en" sx={3} shown />);
    expect(v.container.querySelectorAll('[data-similarity-cell]')).toHaveLength(
      54,
    );
    expect(
      v.container.querySelectorAll('[data-similarity-area-block]'),
    ).toHaveLength(9);
    v.rerender(<SimilarityMap mode="en" zoom={0.5} />);
    expect(
      v.container.querySelector('[data-map-route]')!.getAttribute('d'),
    ).toBe('M100 155H190');
  });
  it('renders bilingual annotations as visible SVG text rather than HTML spans', () => {
    const v = render(<ScaleAreaView mode="bilingual" sx={3} />);
    expect(v.container.querySelector('svg span')).toBeNull();
    expect(
      [...v.container.querySelectorAll('text tspan')].map((e) => e.textContent),
    ).toEqual(['横倍率3，纵倍率3', 'Horizontal factor 3, vertical factor 3']);
    v.rerender(<SimilarityMap mode="bilingual" />);
    expect(v.container.querySelector('svg span')).toBeNull();
    expect(
      [...v.container.querySelectorAll('text tspan')].map((e) => e.textContent),
    ).toEqual([
      '原参考图3 cm；实际距离待求',
      'Reference length 3 cm; find real distance',
    ]);
  });
  it('renders five hooks and two worked examples in each language', () => {
    for (const l of j94Lessons) {
      const v = render(
        <SimilarityHookArt
          kind={l.lab as Parameters<typeof SimilarityHookArt>[0]['kind']}
          mode="en"
        />,
      );
      expect(v.container.textContent).toContain('?');
      v.unmount();
      const w = mount(`/math/lesson/${l.id}`);
      click(/03 Understand/);
      expect(
        w.container.querySelectorAll('.math-prose section[lang="en"] h3'),
      ).toHaveLength(2);
      w.unmount();
    }
    localStorage.setItem('study-language', 'bilingual');
    const v = mount('/math/lesson/J94-L05');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
});
describe('J94 recorded learning and parent reasoning', () => {
  it('restores wrong-then-right answers in all five lessons without awarding whole-course completion', () => {
    for (const [id, wrong, right] of [
      ['J94-L01', 'FD', 'DE'],
      ['J94-L02', 'SSS', 'AA'],
      ['J94-L03', '10/3', '15/2'],
      ['J94-L04', '3', '9'],
      ['J94-L05', '1500', '1.5 km'],
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
  it('keeps an equal-area counterexample human-reviewed through refresh', () => {
    const v = mount('/math/lesson/J94-L04');
    click(/06 Reflect/);
    const text =
      'The rectangles 3 by 2 and 6 by 1 have equal area but different aspect ratios, so area ratio alone gives no similarity factor.';
    enter('Your reasoning', text);
    expect(screen.queryByText('✓ Reasoning reviewed by a parent.')).toBeNull();
    parent();
    v.unmount();
    mount('/math/lesson/J94-L04');
    expect(field('Your reasoning')).toBe(text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J94-L04']
        .completedAt,
    ).toBeUndefined();
  });
  it('stores eight unit answers and two reviewed explanations independently from lesson mastery', () => {
    const v = mount('/math/unit/J94/check');
    for (const [n, a] of Object.entries({
      1: 'DE',
      2: 'insufficient',
      3: '8',
      4: '√2',
      5: '4.5 m',
    })) {
      click(`Question ${n}`);
      enter('Your answer', a);
      check();
    }
    click('Question 6');
    enter(
      'Your reasoning',
      'Similarity is needed first. Rectangles 3 by 2 and 6 by 1 have equal areas but are not similar.',
    );
    parent();
    click('Question 7');
    click('A Double both map and scale-bar lengths');
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'On the original 1:50000 print, 3 cm represents 150000 cm or 1.5 km straight line. Zoom the map and bar together; a perspective photo needs more than one local calibration.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J94/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J94-L05'],
    ).toBeUndefined();
  });
  it('advances similarity retrieval and clears the previous response', () => {
    const v = mount('/math/lesson/J94-L03');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '1');
    check();
    enter('Your answer', '3');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '6');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J94-L03'].round).toBe(1);
    saved.sessions['J94-L03'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '4');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
