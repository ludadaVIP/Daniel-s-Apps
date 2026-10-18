// @vitest-environment jsdom
import { beforeEach, afterEach, describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { IntegrationLab, IntegrationHookArt } from './IntegrationLabs';
import { RectangleLinkView, RampView } from './IntegrationVisuals';
import { defaultRamp, RAMP_DRAFT_KEY } from './integrationModels';
import { j98Lessons } from './content/J98';
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
  vi.useRealTimers();
  vi.restoreAllMocks();
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
const task = 'My integration conclusion',
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
describe('J98 linked representations, dependent strategies and paper project state', () => {
  it('preserves a general relationship across instance and view changes but resets its numerical instance', () => {
    render(<IntegrationLab kind="integration-geometry" mode="en" />);
    enter(task, 'x²+2x');
    submit();
    enter('Current instance value', '15');
    slide('Instance side x', '4');
    expect(field(task)).toBe('x²+2x');
    expect(field('Current instance value')).toBe('');
    expect(feedback()).toContain('matches');
    click('Change geometry display zoom only');
    expect(field(task)).toBe('x²+2x');
    slide('Fixed extra length d', '3');
    expect(field(task)).toBe('');
  });
  it('distinguishes an equivalent unfinished expression from the requested collected perimeter', () => {
    render(<IntegrationLab kind="integration-geometry" mode="en" />);
    enter(task, 'x(x+2)');
    submit();
    expect(feedback()).not.toContain('matches');
    choose('Requested geometry quantity', 'perimeter');
    enter(task, '4x+4');
    submit();
    expect(feedback()).toContain('matches');
    enter('Current instance value', '16');
    click('Check: Current instance value');
    expect(
      screen.getByRole('status', { name: 'Current instance value feedback' })
        .textContent,
    ).toContain('matches');
  });
  it('retains the general affine rule under query and window changes then follows actual water segments', () => {
    render(<IntegrationLab kind="integration-graph" mode="en" />);
    enter(task, '2x+3');
    submit();
    slide('Queried input', '3');
    click('Change graph window only');
    expect(field(task)).toBe('2x+3');
    expect(feedback()).toContain('matches');
    choose('Graph model source', 'drain');
    enter(task, '6 L');
    submit();
    expect(feedback()).toContain('matches');
    slide('Queried input', '7');
    expect(field(task)).toBe('');
    enter(task, '4 L');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('separates excluded half-card inputs from underdetermined observations without joining count points', () => {
    const v = render(<IntegrationLab kind="integration-graph" mode="en" />);
    choose('Graph model source', 'count');
    slide('Queried input', '1.5');
    expect(v.container.querySelectorAll('[data-curve]')).toHaveLength(0);
    enter(task, 'outside-domain');
    submit();
    expect(feedback()).toContain('matches');
    choose('Graph model source', 'observations');
    enter(task, 'insufficient');
    submit();
    click('Show two possible extensions');
    expect(v.container.querySelectorAll('[data-curve]')).toHaveLength(2);
    expect(field(task)).toBe('insufficient');
    expect(feedback()).toContain('matches');
  });
  it('blocks an early final answer and a trap, then supports justified steps and undo without erasing prose', () => {
    render(<IntegrationLab kind="integration-strategy" mode="en" />);
    click('Try this strategy step');
    expect(
      screen.getByRole('status', { name: 'Strategy step feedback' })
        .textContent,
    ).toContain('before using');
    choose('Next strategy card', 'trap');
    click('Try this strategy step');
    expect(
      screen.getByRole('status', { name: 'Strategy step feedback' })
        .textContent,
    ).toContain('cannot be added');
    for (const id of ['model', 'solve', 'domain', 'target']) {
      choose('Next strategy card', id);
      click('Try this strategy step');
    }
    enter(task, '28 m');
    submit();
    expect(feedback()).toContain('matches');
    enter(
      'Temporary plan draft',
      'Area first, positive length next, then perimeter.',
    );
    click('Undo the last step');
    expect(field('Temporary plan draft')).toBe(
      'Area first, positive length next, then perimeter.',
    );
    expect(field(task)).toBe('28 m');
  });
  it('accepts an independent total-distance preparation before the journey time chain', () => {
    const v = render(<IntegrationLab kind="integration-strategy" mode="en" />);
    choose('Mixed problem task', 'journey');
    for (const id of ['distance', 'times', 'total-time', 'target']) {
      choose('Next strategy card', id);
      click('Try this strategy step');
      expect(
        screen.getByRole('status', { name: 'Strategy step feedback' })
          .textContent,
      ).toContain('established');
    }
    expect(
      v.container.querySelectorAll('.math-integration-plan li'),
    ).toHaveLength(4);
    enter(task, '24/5 km/h');
    submit();
    expect(feedback()).toContain('matches');
  });
  it('repairs an incomplete root set and preserves an insufficient-evidence verdict through possible extensions', () => {
    render(<IntegrationLab kind="integration-audit" mode="en" />);
    enter(task, 'invalid');
    submit();
    enter('Checked replacement quantity', '±3');
    click('Check: Checked replacement quantity');
    expect(
      screen.getByRole('status', {
        name: 'Checked replacement quantity feedback',
      }).textContent,
    ).toContain('matches');
    choose('Answer claim to audit', '3');
    enter(task, 'insufficient');
    submit();
    click('Show another observation-compatible extension only');
    expect(field(task)).toBe('insufficient');
    expect(feedback()).toContain('matches');
  });
  it('distinguishes wrong area units and percentage-angle confusion from corrected quantities', () => {
    render(<IntegrationLab kind="integration-audit" mode="en" />);
    choose('Answer claim to audit', '2');
    enter('Checked replacement quantity', '15 m');
    click('Check: Checked replacement quantity');
    expect(
      screen.getByRole('status', {
        name: 'Checked replacement quantity feedback',
      }).textContent,
    ).not.toContain('matches');
    enter('Checked replacement quantity', '15 m²');
    click('Check: Checked replacement quantity');
    expect(
      screen.getByRole('status', {
        name: 'Checked replacement quantity feedback',
      }).textContent,
    ).toContain('matches');
    choose('Answer claim to audit', '1');
    enter('Checked replacement quantity', '36.9°');
    click('Check: Checked replacement quantity');
    expect(
      screen.getByRole('status', {
        name: 'Checked replacement quantity feedback',
      }).textContent,
    ).toContain('matches');
  });
  it('preserves exact incline on a width-only change while resetting cost and overall feasibility', () => {
    const v = render(<IntegrationLab kind="integration-ramp" mode="en" />);
    enter(task, 'valid');
    submit();
    enter('Exact inclined length', '3√17/5');
    click('Check: Exact inclined length');
    enter('Fictional surface cost', '148.43');
    choose('Paper design preset', 'wide');
    expect(field(task)).toBe('');
    expect(field('Exact inclined length')).toBe('3√17/5');
    expect(field('Fictional surface cost')).toBe('');
    enter(task, 'invalid');
    submit();
    click('Show or hide integration audit');
    expect(
      v.container.querySelector('[data-ramp-constraint="area"]')?.textContent,
    ).toContain('Meets');
    expect(
      v.container.querySelector('[data-ramp-constraint="budget"]')?.textContent,
    ).toContain('Not met');
    enter('Fictional surface cost', '178.12');
    click('Check: Fictional surface cost');
    expect(
      screen.getByRole('status', { name: 'Fictional surface cost feedback' })
        .textContent,
    ).toContain('matches');
  });
  it('keeps cost and incline under a budget/view change but resets length when the side changes', () => {
    render(<IntegrationLab kind="integration-ramp" mode="en" />);
    enter('Exact inclined length', '3√17/5');
    enter('Fictional surface cost', '148.43');
    enter(task, 'valid');
    submit();
    slide('Fictional budget in NZD', '149');
    expect(field(task)).toBe('');
    expect(field('Fictional surface cost')).toBe('148.43');
    expect(field('Exact inclined length')).toBe('3√17/5');
    click('Change side-view display scale only');
    expect(field('Exact inclined length')).toBe('3√17/5');
    slide('Rise in centimetres', '61');
    expect(field('Exact inclined length')).toBe('');
    expect(field('Fictional surface cost')).toBe('');
  });
  it('saves and restores project parameters and original notes separately from lesson progress', () => {
    const v = render(<IntegrationLab kind="integration-ramp" mode="en" />);
    slide('Surface width in centimetres', '120');
    enter(
      'Ramp project draft',
      'The wider surface passes area but fails budget; preserve exact length.',
    );
    click('Save project draft locally');
    expect(
      JSON.parse(localStorage.getItem(RAMP_DRAFT_KEY)!).params.widthCm,
    ).toBe(120);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    v.unmount();
    render(<IntegrationLab kind="integration-ramp" mode="en" />);
    expect(field('Ramp project draft')).toBe(
      'The wider surface passes area but fails budget; preserve exact length.',
    );
    expect(
      (
        screen.getByRole('slider', {
          name: 'Surface width in centimetres',
        }) as HTMLInputElement
      ).value,
    ).toBe('120');
  });
  it('does not overwrite an unreadable stored project draft', () => {
    localStorage.setItem(RAMP_DRAFT_KEY, '{corrupt');
    render(<IntegrationLab kind="integration-ramp" mode="en" />);
    expect(screen.getByRole('alert').textContent).toContain('preserved');
    expect(
      (
        screen.getByRole('button', {
          name: 'Save project draft locally',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    enter('Ramp project draft', 'I can still export my current argument.');
    expect(
      (
        screen.getByRole('button', {
          name: 'Download paper-project Markdown report',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(false);
    expect(localStorage.getItem(RAMP_DRAFT_KEY)).toBe('{corrupt');
  });
  it('downloads a Markdown argument only after writing, without awarding course completion', () => {
    vi.useFakeTimers();
    const make = vi.fn((blob: Blob) => {
        expect(blob.type).toContain('text/markdown');
        return 'blob:paper-ramp';
      }),
      revoke = vi.fn();
    vi.stubGlobal('URL', { createObjectURL: make, revokeObjectURL: revoke });
    let name = '';
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      name = this.download;
    });
    render(<IntegrationLab kind="integration-ramp" mode="en" />);
    expect(
      (
        screen.getByRole('button', {
          name: 'Download paper-project Markdown report',
        }) as HTMLButtonElement
      ).disabled,
    ).toBe(true);
    enter(
      'Ramp project draft',
      'My units and every worksheet constraint are explicit.',
    );
    click('Download paper-project Markdown report');
    expect(name).toBe('J98-paper-ramp-report.md');
    expect(make.mock.calls[0]![0]).toBeInstanceOf(Blob);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    vi.runAllTimers();
    expect(revoke).toHaveBeenCalledWith('blob:paper-ramp');
  });
  it('renders native SVG partitions, paper surfaces and every bilingual worked example', () => {
    const a = render(<RectangleLinkView mode="bilingual" reveal />);
    expect(a.container.querySelector('svg span')).toBeNull();
    expect(a.container.querySelector('[data-integration-strip]')).toBeTruthy();
    a.rerender(<RampView mode="bilingual" params={defaultRamp} reveal />);
    expect(a.container.querySelector('svg span')).toBeNull();
    expect(a.container.querySelector('[data-ramp-surface]')).toBeTruthy();
    a.unmount();
    for (const l of j98Lessons) {
      const h = render(
        <IntegrationHookArt
          kind={l.lab as Parameters<typeof IntegrationHookArt>[0]['kind']}
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
    const v = mount('/math/lesson/J98-L05');
    click(/03/);
    for (const lang of ['zh', 'en'])
      expect(
        v.container.querySelectorAll(`.math-prose section[lang="${lang}"] h3`),
      ).toHaveLength(2);
  });
});
describe('J98 formal answers, parent reasoning and retrieval', () => {
  it('restores supported retries across all five courses without completing unfinished lessons', () => {
    for (const [id, wrong, right] of [
      ['J98-L01', 'x(x+2)', 'x²+2x'],
      ['J98-L02', '2x', '2x+3'],
      ['J98-L03', '6', '28 m'],
      ['J98-L04', 'valid', 'invalid'],
      ['J98-L05', '2.47', '3√17/5'],
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
  it('keeps a full paper-project exit human-reviewed and distinct from the separately saved draft', () => {
    localStorage.setItem(
      RAMP_DRAFT_KEY,
      JSON.stringify({
        version: 1,
        params: defaultRamp,
        notes: 'Saved lab notes are not a reviewed lesson.',
      }),
    );
    const v = mount('/math/lesson/J98-L05');
    click(/06 Reflect/);
    const text =
      'Convert centimetres to metres, use the given right angle, keep s=3√17/5 and cost 36√17 until final rounding. Check all five constraints. Width 1.2 preserves grade but exceeds budget. The worksheet omits actual construction conditions.';
    enter('Your reasoning', text);
    parent();
    v.unmount();
    mount('/math/lesson/J98-L05');
    expect(field('Your reasoning')).toBe(text);
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J98-L05']
        .completedAt,
    ).toBeUndefined();
    expect(JSON.parse(localStorage.getItem(RAMP_DRAFT_KEY)!).notes).toBe(
      'Saved lab notes are not a reviewed lesson.',
    );
  });
  it('records eight independent unit items with two human reviews, without changing individual lesson mastery', () => {
    const v = mount('/math/unit/J98/check');
    for (const [n, a] of Object.entries({
      1: 'x²+2x',
      2: '2x+3',
      3: '24/5 km/h',
      4: 'insufficient',
      5: '148.43',
    })) {
      click(`Question ${n}`);
      enter('Your answer', a);
      check();
    }
    click('Question 6');
    enter(
      'Your reasoning',
      'Build the area relation before solving, keep all roots then filter positive length and return to perimeter. For the journey, total distance can be prepared separately from total time, but both are needed before average speed.',
    );
    parent();
    click('Question 7');
    click(/^A Compare exact positive quantities/);
    check();
    click('Question 8');
    enter(
      'Your reasoning',
      'Default side gives exact incline 3√17/5, grade one quarter, surface area 3√17/5 and cost 36√17. All worksheet constraints pass. Width 1.2 changes area and cost only and fails budget. These are fictional conditions excluding real construction.',
    );
    parent();
    expect(
      screen.getByText(/Recorded 8\/8; 8 independently completed/),
    ).toBeTruthy();
    v.unmount();
    mount('/math/unit/J98/check');
    expect(
      screen
        .getByRole('button', { name: 'Question 8' })
        .getAttribute('aria-pressed'),
    ).toBe('true');
    expect(
      JSON.parse(localStorage.getItem(STORAGE_KEY)!).sessions['J98-L05'],
    ).toBeUndefined();
  });
  it('changes a retrieval target without retaining the preceding expression or success', () => {
    const v = mount('/math/lesson/J98-L01');
    click(/05 Practice/);
    click('Question 2');
    enter('Your answer', '2x+2');
    check();
    enter('Your answer', '4x+4');
    check();
    fireEvent.click(screen.getByRole('link', { name: 'Review' }));
    enter('Your answer', 'x²+x');
    check();
    click(/Save this review/);
    v.unmount();
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.reviews['J98-L01'].round).toBe(1);
    saved.sessions['J98-L01'].nextReview = '2000-01-01T00:00:00.000Z';
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    mount('/math/review');
    expect(field('Your answer')).toBe('');
    enter('Your answer', '4x+4');
    check();
    expect(screen.getByText('✓ You found it independently.')).toBeTruthy();
  });
});
