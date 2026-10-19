// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ComplexLab, ComplexHookArt } from './ComplexLabs';
import { VectorPlot } from './VectorVisuals';
import { h21Lessons } from './content/H21';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { t } from './model';
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
describe('H21 complex workbenches and independent learning records', () => {
  it('changes root domains independently of powers and keeps complete opposite roots', () => {
    const v = render(<ComplexLab kind="complex-roots" mode="en" />),
      root = 'Predict all roots (∅ if none)',
      power = 'Predict the simplified value of i^n';
    enter(root, '2i');
    check(root);
    expect(feedback(root)).not.toContain('matches');
    enter(root, '±2i');
    check(root);
    enter(power, '-i');
    check(power);
    expect(feedback(power)).toContain('matches');
    select('Integer exponent n for i', '10');
    expect(field(root)).toBe('±2i');
    expect(field(power)).toBe('');
    enter(power, '-1');
    check(power);
    select('Allowed number domain', 'real');
    expect(field(root)).toBe('');
    expect(field(power)).toBe('-1');
    enter(root, '∅');
    check(root);
    click('Show/hide audit');
    expect(v.container.querySelectorAll('[data-vector-point]')).toHaveLength(0);
    select('Equation RHS r: z²=r', '0');
    enter(root, '0');
    check(root);
    expect(feedback(root)).toContain('matches');
  });
  it('reads real-valued imaginary coefficients and preserves unaffected components and classifications', () => {
    const v = render(<ComplexLab kind="complex-components" mode="en" />),
      im = 'Predict Im(z), not bi',
      kind = 'Predict real or nonreal',
      pure = 'Predict pure-imaginary or not-pure-imaginary';
    enter('Predict Re(z)', '3');
    check('Predict Re(z)');
    enter(im, '-2i');
    check(im);
    expect(feedback(im)).not.toContain('matches');
    enter(im, '-2');
    check(im);
    enter(kind, 'nonreal');
    check(kind);
    select('Real coefficient a', '0');
    expect(field('Predict Re(z)')).toBe('');
    expect(field(im)).toBe('-2');
    expect(field(kind)).toBe('nonreal');
    enter(pure, 'pure-imaginary');
    check(pure);
    click('Show/hide component projections');
    click('Show/hide audit');
    expect(feedback(pure)).toContain('matches');
    expect(
      v.container.querySelector('[data-coordinate="(0, -2)"]'),
    ).toBeTruthy();
    select('Imaginary coefficient b', '0');
    enter(kind, 'real');
    check(kind);
    enter(pure, 'not-pure-imaginary');
    check(pure);
    expect(feedback(kind)).toContain('matches');
    expect(feedback(pure)).toContain('matches');
    select('Imaginary coefficient b', '1/2');
    enter(im, '1/2');
    check(im);
    expect(feedback(im)).toContain('matches');
  });
  it('distributes all four products and retains an unchanged imaginary-product contribution', () => {
    const v = render(<ComplexLab kind="complex-operations" mode="en" />),
      result = 'Predict the simplified result',
      cross =
        'Predict the real contribution from imaginary-term multiplication';
    enter(result, '(2+i)(3-2i)');
    check(result);
    expect(feedback(result)).not.toContain('matches');
    enter(result, '8-i');
    check(result);
    enter(cross, '2');
    check(cross);
    click('Show/hide audit');
    expect(feedback(result)).toContain('matches');
    expect(screen.getByText('bi·di = −bd')).toBeTruthy();
    expect(
      v.container.querySelector('[data-vector-head="(8, -1)"]'),
    ).toBeTruthy();
    click('Change window');
    expect(field(result)).toBe('8-i');
    select('First complex number u', '3');
    expect(field(result)).toBe('');
    expect(field(cross)).toBe('2');
    enter(result, '1/2+4i');
    check(result);
    expect(feedback(result)).toContain('matches');
    select('Operation', 'subtract');
    expect(screen.queryByRole('textbox', { name: cross })).toBeNull();
    enter(result, '-7/2+3i');
    check(result);
    expect(feedback(result)).toContain('matches');
  });
  it('distinguishes conjugation from negation and preserves modulus under sign reflection', () => {
    const v = render(<ComplexLab kind="complex-conjugate" mode="en" />),
      conj = 'Predict the simplified conjugate',
      square = 'Predict |z|²',
      norm = 'Predict exact modulus |z|';
    enter(conj, '3+4i');
    check(conj);
    enter(square, '25');
    check(square);
    enter(norm, '5');
    check(norm);
    select('Imaginary part b', '4');
    expect(field(conj)).toBe('');
    expect(field(square)).toBe('25');
    expect(field(norm)).toBe('5');
    enter(conj, '3-4i');
    check(conj);
    click('Show/hide conjugate reflection');
    click('Show/hide audit');
    expect(
      v.container.querySelector('[data-coordinate="(3, -4)"]'),
    ).toBeTruthy();
    expect(
      v.container.querySelector('[data-coordinate="(3, 4)"]'),
    ).toBeTruthy();
    expect(feedback(norm)).toContain('matches');
    select('Real part a', '0');
    select('Imaginary part b', '0');
    enter(conj, '0');
    check(conj);
    enter(norm, '0');
    check(norm);
    expect(feedback(conj)).toContain('matches');
    expect(feedback(norm)).toContain('matches');
  });
  it('retains unused-centre changes and computes a genuine turn about a nonzero centre', () => {
    const v = render(<ComplexLab kind="complex-geometry" mode="en" />),
      image = 'Predict the simplified image w',
      coords = 'Predict image coordinates (Re,Im)',
      distance = 'Predict image distance from reference centre';
    enter(image, '-1+2i');
    check(image);
    enter(coords, '(-1,2)');
    check(coords);
    enter(distance, 'sqrt(5)');
    check(distance);
    select('Centre c (used only for about-c turns)', '1');
    expect(field(image)).toBe('-1+2i');
    expect(field(coords)).toBe('(-1,2)');
    expect(field(distance)).toBe('sqrt(5)');
    select('Complex-plane action', 'turn-centre');
    expect(field(image)).toBe('');
    enter(image, '1+2i');
    check(image);
    enter(distance, '1');
    check(distance);
    select('Centre c (used only for about-c turns)', '2');
    expect(field(image)).toBe('');
    enter(image, '-i');
    check(image);
    enter(coords, '(0,-1)');
    check(coords);
    enter(distance, '2');
    check(distance);
    click('Show/hide audit');
    expect(feedback(image)).toContain('matches');
    expect(
      v.container
        .querySelector('[data-vector-arrow="c→z"]')
        ?.getAttribute('data-vector-tail'),
    ).toBe('(2, -1)');
    expect(
      v.container
        .querySelector('[data-vector-arrow="c→w"]')
        ?.getAttribute('data-vector-value'),
    ).toBe('(-2, 0)');
    expect(
      v.container
        .querySelector('[data-vector-arrow="c→w"]')
        ?.getAttribute('data-vector-head'),
    ).toBe('(0, -1)');
  });
  it('keeps a fixed centre point and its image while leaving zero-vector angles undefined', () => {
    const v = render(<ComplexLab kind="complex-geometry" mode="en" />);
    select('Complex-plane action', 'turn-centre');
    select('Centre c (used only for about-c turns)', '1');
    select('Choose original point z', '3');
    expect(
      screen.getByText(/Zero relative displacement has no direction or angle/),
    ).toBeTruthy();
    enter('Predict the simplified image w', '1+i');
    check('Predict the simplified image w');
    enter('Predict image distance from reference centre', '0');
    check('Predict image distance from reference centre');
    click('Show/hide audit');
    expect(v.container.querySelectorAll('[data-zero-vector]')).toHaveLength(2);
    expect(v.container.querySelectorAll('[data-vector-arrow]')).toHaveLength(0);
    expect(v.container.querySelectorAll('[data-vector-point]')).toHaveLength(1);
    expect(feedback('Predict the simplified image w')).toContain('matches');
  });
  it('renders all bilingual explanations and hooks with genuine Re/Im axes and valid SVG paint', () => {
    for (const l of h21Lessons) {
      localStorage.setItem('study-language', 'en');
      const v = mount(`/math/lesson/${l.id}`);
      click(/^03 Understand/);
      expect(
        v.container.querySelector('.math-prose section[lang="en"]')?.textContent
          ?.length,
      ).toBeGreaterThan(1800);
      fireEvent.click(screen.getByRole('button', { name: '双语' }));
      for (const lang of ['zh', 'en'])
        expect(
          v.container.querySelectorAll(
            `.math-prose section[lang="${lang}"] h3`,
          ),
        ).toHaveLength(2);
      v.unmount();
      const w = render(
        <ComplexHookArt
          kind={l.lab as Parameters<typeof ComplexHookArt>[0]['kind']}
          mode="bilingual"
        />,
      );
      expect(w.container.querySelector('foreignObject')).toBeNull();
      expect(w.container.querySelector('input')).toBeNull();
      if (l.id !== 'H21-L01') {
        expect(
          Array.from(w.container.querySelectorAll('svg text')).some(
            (e) => e.textContent === 'Re',
          ),
        ).toBe(true);
        expect(
          Array.from(w.container.querySelectorAll('svg text')).some(
            (e) => e.textContent === 'Im',
          ),
        ).toBe(true);
      }
      for (const node of w.container.querySelectorAll(
        'svg [fill],svg [stroke]',
      ))
        for (const attr of ['fill', 'stroke']) {
          const value = node.getAttribute(attr);
          if (value?.startsWith('#'))
            expect(value).toMatch(
              /^#(?:[0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i,
            );
        }
      w.unmount();
    }
  });
  it('reports equivalent but unfinished complex expressions separately from wrong values', () => {
    mount('/math/lesson/H21-L03');
    click(/^04 Together/);
    enter('Your answer', '(2+i)(3-2i)');
    click(/Check answer/);
    expect(
      screen.getByText('↳ The value matches; finish the requested form.'),
    ).toBeTruthy();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '-i+8');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('restores all five corrected guided answers without completing unfinished independent practice', () => {
    for (const [id, value] of [
      ['H21-L01', '±2i'],
      ['H21-L02', '-2'],
      ['H21-L03', '8-i'],
      ['H21-L04', '3+4i'],
      ['H21-L05', '-1+2i'],
    ]) {
      const v = mount(`/math/lesson/${id}`);
      click(/^04 Together/);
      enter('Your answer', '999');
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
  it('leaves the principal-root counterexample to human review and preserves the original explanation', () => {
    const v = mount('/math/lesson/H21-L01');
    click(/^06 Reflect/);
    const text =
      'With the stated principal roots, sqrt(-1)=i so the left product is i*i=-1. The proposed right side sqrt(1)=1 differs. The real root-product rule needs nonnegative real inputs; using it for two negative principal roots is unjustified, not a failure of i²=-1 or distribution.';
    enter('Your reasoning', text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H21-L01']
        .answers['H21-L01-X']?.correct,
    ).not.toBe(true);
    parent();
    v.unmount();
    mount('/math/lesson/H21-L01');
    expect(field('Your reasoning')).toBe(text);
    expect(
      (
        screen.getByRole('textbox', {
          name: 'Your reasoning',
        }) as HTMLTextAreaElement
      ).disabled,
    ).toBe(true);
  });
  it('stores eight independent unit answers including full root-law and nonzero-centre arguments', () => {
    const v = mount('/math/unit/H21/check');
    for (const [n, value] of [
      ['1', '±2i'],
      ['2', '-2'],
      ['3', '8-i'],
      ['4', 'sqrt(2)'],
      ['5', '1+2i'],
    ]) {
      click(`Question ${n}`);
      enter('Your answer', value!);
      click(/Check answer/);
    }
    click('Question 6');
    click(
      'C It turns 90° anticlockwise about the origin; zero stays fixed but zero arrows have no angle',
    );
    click(/Check answer/);
    click('Question 7');
    enter(
      'Your reasoning',
      'Using the stated principal roots, i*i=-1 while sqrt(1)=1. The real product-of-roots law requires nonnegative real inputs and cannot be copied to these two negative inputs.',
    );
    expect(screen.getByText(/Recorded 6\/8/)).toBeTruthy();
    parent();
    click('Question 8');
    enter(
      'Your reasoning',
      'For z=2+i, A=iz=-1+2i at (-1,2), |A|=sqrt(5)=|z| about the origin. For c=2-i, z-c=2i turns to -2, hence B=c-2=-i at (0,-1). Its distance from c is two, matching |z-c|, but origin-distance is one. The two turns differ because the centre must be subtracted and restored.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/H21/check');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['H21-L01'],
    ).toBeUndefined();
  });
  it('changes due complex retrievals without retaining the previous numerical or imaginary answer', () => {
    const v = mount('/math/lesson/H21-L03');
    click(/^05 Practice/);
    click('Question 2');
    enter('Your answer', '0');
    click(/Check answer/);
    enter('Your answer', '2+2i');
    click(/Check answer/);
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', '-1');
    click(/Check answer/);
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['H21-L03'].round).toBe(1);
    saved.sessions['H21-L03'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '-1');
    click(/Check answer/);
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('Your answer', '-2');
    click(/Check answer/);
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
  });
  it('keeps the existing vector grid on its original x/y axes by default', () => {
    const v = render(
        <VectorPlot mode="en" caption={t('原向量', 'Original vector')} />,
      ),
      labels = Array.from(v.container.querySelectorAll('svg text')).map(
        (e) => e.textContent,
      );
    expect(labels).toContain('x');
    expect(labels).toContain('y');
    expect(labels).not.toContain('Re');
    expect(
      screen.getByRole('img', { name: /Vector grid, equal axis units/ }),
    ).toBeTruthy();
  });
});
