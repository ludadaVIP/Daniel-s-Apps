// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MeasurementLab } from './MeasurementLabs';
import { App } from './App';
import { STORAGE_KEY } from './progress';
import { lessons, curriculum, unitChecks, reviewQuestionFor } from './content';
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
describe('B05 interactive measurement and learner records', () => {
  it('keeps object width when shifting endpoints or changing units, and hides the computed answer before prediction', () => {
    const view = render(<MeasurementLab kind="measurement-length" mode="en" />);
    const original = view.container
      .querySelector('.measurement-object')!
      .getAttribute('width');
    expect(view.container.querySelector('.math-measure-readout')).toBeNull();
    click('I read both endpoints; check length');
    expect(screen.getByText('10 − 3 = 7 cm')).toBeTruthy();
    slide('Start (cm)', '5');
    expect(
      view.container
        .querySelector('.measurement-object')!
        .getAttribute('width'),
    ).toBe(original);
    click('Millimetre scale mm');
    expect(
      view.container
        .querySelector('.measurement-object')!
        .getAttribute('width'),
    ).toBe(original);
    expect(screen.getByRole('img').getAttribute('aria-label')).toContain(
      'endpoints 50 and 120 mm',
    );
    click('I read both endpoints; check length');
    expect(screen.getByText('120 − 50 = 70 mm')).toBeTruthy();
    slide('Object length (cm)', '0');
    expect(
      view.container
        .querySelector('.measurement-object')!
        .getAttribute('width'),
    ).toBe('0');
  });
  it('walks each perimeter segment and returns to the start without counting interior area', () => {
    const view = render(
      <MeasurementLab kind="measurement-perimeter" mode="en" />,
    );
    click('Walk one boundary unit');
    expect(
      view.container.querySelectorAll('.measurement-edge.is-walked'),
    ).toHaveLength(1);
    click('I predicted; finish the circuit');
    expect(
      view.container.querySelectorAll('.measurement-edge.is-walked'),
    ).toHaveLength(26);
    expect(
      screen.getByText('Walked 26 cm along edges, back at the start'),
    ).toBeTruthy();
    const dot = view.container.querySelector('.measurement-walker')!;
    const start = view.container.querySelector('.measurement-edge')!;
    expect([dot.getAttribute('cx'), dot.getAttribute('cy')]).toEqual([
      start.getAttribute('x1'),
      start.getAttribute('y1'),
    ]);
    click('7 × 6');
    expect(view.container.querySelectorAll('.is-walked')).toHaveLength(0);
    click('I predicted; finish the circuit');
    expect(
      screen.getByText('Walked 26 cm along edges, back at the start'),
    ).toBeTruthy();
  });
  it('rotates a coverage and its missing cell together, and excludes every unfilled cell from area', () => {
    const view = render(<MeasurementLab kind="measurement-area" mode="en" />);
    click('Row 1, column 1');
    expect(screen.getByText('Covered 23 cm²')).toBeTruthy();
    click('Rotate the whole coverage');
    expect(
      view.container.querySelectorAll(
        '.math-measure-tiles [aria-pressed="true"]',
      ),
    ).toHaveLength(23);
    expect(
      screen
        .getByRole('button', { name: 'Row 1, column 4' })
        .getAttribute('aria-pressed'),
    ).toBe('false');
    expect(
      screen.getByText(/Bounding width times height includes gaps/),
    ).toBeTruthy();
    click('Clear coverage');
    expect(screen.getByText('Covered 0 cm²')).toBeTruthy();
    click('8 × 3');
    expect(screen.getByText('Covered 24 cm²')).toBeTruthy();
    expect(
      view.container.querySelectorAll(
        '.math-measure-tiles [aria-pressed="true"]',
      ),
    ).toHaveLength(24);
  });
  it('keeps angle opening fixed through arm and rotation changes and classifies exact boundaries', () => {
    const view = render(<MeasurementLab kind="measurement-angle" mode="en" />);
    click('90°');
    slide('Drawing arm length', '130');
    slide('Whole drawing rotation (degrees)', '45');
    expect(
      view.container
        .querySelector('.math-measure-angle')!
        .getAttribute('aria-label'),
    ).toContain('Opening 90 degrees');
    expect(
      view.container.querySelector('.measurement-right-mark'),
    ).toBeTruthy();
    expect(screen.getByText('right angle')).toBeTruthy();
    click('0°');
    expect(screen.getByText('zero angle')).toBeTruthy();
    expect(view.container.querySelector('.measurement-right-mark')).toBeNull();
    click('180°');
    expect(screen.getByText('straight angle')).toBeTruthy();
    click('Circle');
    expect(
      screen.getByText(/A curved boundary with no straight sides/),
    ).toBeTruthy();
  });
  it('preserves chart values under rescaling and gives a zero count zero height', () => {
    const view = render(<MeasurementLab kind="measurement-bars" mode="en" />);
    const heights = () =>
      [...view.container.querySelectorAll('.measurement-bar')].map((e) =>
        Number(e.getAttribute('height')),
      );
    expect(heights()).toEqual([100, 75, 125]);
    click('I read the chart; check the table');
    expect(screen.getByText('8 + 6 + 10 = 24')).toBeTruthy();
    click('Max 20 · interval 5');
    expect(heights()).toEqual([100, 75, 125]);
    click('Max 40 · interval 5');
    expect(heights()).toEqual([50, 37.5, 62.5]);
    expect(screen.getByText('8 + 6 + 10 = 24')).toBeTruthy();
    slide('Bus people', '0');
    expect(heights()[2]).toBe(0);
    expect(view.container.querySelector('.math-measure-table')).toBeNull();
    click('I read the chart; check the table');
    expect(screen.getByText('8 + 6 + 0 = 14')).toBeTruthy();
  });
  it('renders bilingual unit legends and accessible cell labels rather than relying on colour', () => {
    const view = render(
      <MeasurementLab kind="measurement-length" mode="bilingual" />,
    );
    expect(screen.getByText('起点（cm）')).toBeTruthy();
    expect(screen.getByText('Start (cm)')).toBeTruthy();
    expect(screen.getByText('刻度单位 cm；每个小间隔 1 cm。')).toBeTruthy();
    expect(
      screen.getByText('Scale unit cm; each small interval is 1 cm.'),
    ).toBeTruthy();
    view.unmount();
    render(<MeasurementLab kind="measurement-area" mode="bilingual" />);
    expect(
      screen
        .getByRole('button', { name: '第 1 行，第 1 列' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });
  it('restores a corrected unit-bearing answer and keeps support distinct from independence', () => {
    const view = mount('/math/lesson/B05-L03');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 3');
    enter('7 cm');
    check();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
    enter('7 cm²');
    check();
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    view.unmount();
    mount('/math/lesson/B05-L03');
    expect(
      screen
        .getByRole('button', { name: 'Question 3' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      screen.getByText(
        '✓ Completed with support. Your understanding is growing.',
      ),
    ).toBeTruthy();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.sessions['B05-L03'].answers['B05-L03-Q3'].input).toBe('7 cm²');
    expect(saved.sessions['B05-L03'].completedAt).toBeUndefined();
  });
  it('retains the sixth explanation after parent review without auto-grading its words', () => {
    const view = mount('/math/lesson/B05-L04');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 6');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Rotation preserves four equal sides and right angles, so it is still a square and also meets the rectangle definition.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    view.unmount();
    mount('/math/lesson/B05-L04');
    expect(screen.getByText('✓ Reasoning reviewed by a parent.')).toBeTruthy();
    expect(
      screen
        .getByRole('button', { name: 'Question 6' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
  });
  it('records and restores the eight-question unit review without changing any lesson mastery', () => {
    const view = mount('/math/unit/B05/check');
    for (const [index, value] of Object.entries({
      1: '8 cm',
      2: '340 cm',
      3: '22 cm',
      4: '10 cm²',
      6: '180 degrees',
      7: '8 people',
    })) {
      click(`Question ${index}`);
      enter(value);
      check();
    }
    click('Question 5');
    click('A Yes; its opening is still 90°');
    check();
    click('Question 8');
    fireEvent.change(screen.getByRole('textbox', { name: 'Your reasoning' }), {
      target: {
        value:
          'Both cover 24 square centimetres. Their boundary lengths are 20 and 22 centimetres, so equal area does not imply equal perimeter.',
      },
    });
    fireEvent.click(screen.getByText('Parent review · look at the reasoning'));
    click('Parent confirms: reasoning makes sense');
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    view.unmount();
    mount('/math/unit/B05/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(screen.queryByRole('alert')).toBeNull();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.sessions['B05-CHECK'].answers['B05-CHECK-Q6'].input).toBe(
      '180 degrees',
    );
    expect(saved.sessions['B05-L01']).toBeUndefined();
  });
  it('retrieves a new endpoint story and unit after a saved conversion review becomes due', () => {
    const view = mount('/math/lesson/B05-L01');
    fireEvent.click(screen.getByRole('button', { name: /05 Practice/ }));
    click('Question 3');
    enter('11 cm');
    check();
    enter('8 cm');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    expect(screen.getByText('Express 1 cm in mm.')).toBeTruthy();
    enter('10 mm');
    check();
    fireEvent.click(screen.getByRole('button', { name: /Save this review/ }));
    expect(screen.getByText('Nothing waiting for review.')).toBeTruthy();
    view.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['B05-L01'].round).toBe(1);
    saved.sessions['B05-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(
      screen.getByText('Endpoints are 1 and 2 cm. What is the length in cm?'),
    ).toBeTruthy();
    expect(
      (screen.getByRole('textbox', { name: 'Your answer' }) as HTMLInputElement)
        .value,
    ).toBe('');
  });
  it('offers the now-available geometry bridge after a completed low-pressure D03 group', () => {
    mount('/math/check');
    fireEvent.click(screen.getByRole('button', { name: /D03/ }));
    expect(
      screen.queryByRole('link', {
        name: /Explore measurement and shapes first/,
      }),
    ).toBeNull();
    for (let i = 0; i < 6; i++) click('Skip for now');
    expect(
      screen
        .getByRole('link', { name: /Explore measurement and shapes first/ })
        .getAttribute('href'),
    ).toBe('/math/lesson/B05-L01');
    expect(
      screen.getByText(/continue means in later statistics lessons/),
    ).toBeTruthy();
    expect(screen.queryByText('✓ You found it independently.')).toBeNull();
  });
  it('publishes the five planned lessons, eight review items and retrieval variations while preserving prior content', () => {
    const unit = lessons.filter((l) => l.unit === 'B05');
    expect(unit).toHaveLength(5);
    expect(unitChecks.B05.questions).toHaveLength(8);
    unit.forEach((l) => {
      expect(l.contentStatus).toBe('ready');
      expect(reviewQuestionFor(l.id, 0).id).toBe(`${l.id}-R0`);
      expect(reviewQuestionFor(l.id, 1).stem).not.toEqual(
        reviewQuestionFor(l.id, 0).stem,
      );
    });
    expect(
      lessons.filter((l) =>
        ['B01', 'B02', 'B03', 'B04', 'P52', 'P53'].includes(l.unit!),
      ),
    ).toHaveLength(32);
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
