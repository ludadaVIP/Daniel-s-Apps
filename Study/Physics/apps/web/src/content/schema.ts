import type { LocalizedText } from '@study/shared';
export const t = (zh: string, en: string): LocalizedText => ({ zh, en });
export type Question = {
  prompt: LocalizedText;
  options: LocalizedText[];
  correct: number;
  explanation: LocalizedText;
};
export type Lesson = {
  id: string;
  title: LocalizedText;
  subtitle: LocalizedText;
  minutes: number;
  stage: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  unit:
    | 'curiosity'
    | 'measurement'
    | 'patterns'
    | 'mysteries'
    | 'motion'
    | 'forces'
    | 'gravity'
    | 'density'
    | 'energy'
    | 'work'
    | 'thermal'
    | 'sound'
    | 'light'
    | 'pressure'
    | 'buoyancy'
    | 'machines'
    | 'electricity';
  kind:
    | 'friction'
    | 'variables'
    | 'observation'
    | 'length'
    | 'speed'
    | 'quantities'
    | 'units'
    | 'time'
    | 'mass'
    | 'temperature'
    | 'data'
    | 'graph'
    | 'floating'
    | 'boats'
    | 'bounce'
    | 'echo'
    | 'mirror'
    | 'static'
    | 'seatbelt'
    | 'fair-test'
    | 'volume'
    | 'accuracy'
    | 'repeats'
    | 'paper'
    | 'reference'
    | 'journey'
    | 'average'
    | 'motion-graph'
    | 'force-effects'
    | 'force-balance'
    | 'grip-friction'
    | 'paper-drag'
    | 'mass-weight'
    | 'moon-weight'
    | 'gravity-fall'
    | 'density-compare'
    | 'density-block'
    | 'density-displacement'
    | 'density-float'
    | 'energy-lamp'
    | 'energy-kinetic'
    | 'energy-height'
    | 'energy-spring'
    | 'energy-track'
    | 'energy-dissipation'
    | 'work-direction'
    | 'work-area'
    | 'work-power'
    | 'work-human'
    | 'work-ramp'
    | 'thermal-particles'
    | 'thermal-heating'
    | 'thermal-paths'
    | 'thermal-cups'
    | 'thermal-wet'
    | 'phase-fusion'
    | 'phase-boiling'
    | 'phase-condensation'
    | 'phase-curve'
    | 'sound-source'
    | 'sound-medium'
    | 'sound-pitch'
    | 'sound-amplitude'
    | 'sound-ranging'
    | 'light-shadow'
    | 'light-reflection'
    | 'light-mirror'
    | 'light-refraction'
    | 'light-lens'
    | 'light-colour'
    | 'light-eye'
    | 'pressure-contact'
    | 'pressure-shoes'
    | 'pressure-liquid'
    | 'pressure-air'
    | 'pressure-straw'
    | 'pressure-syringe'
    | 'buoyancy-release'
    | 'buoyancy-pressure'
    | 'buoyancy-displacement'
    | 'buoyancy-archimedes'
    | 'buoyancy-ship'
    | 'buoyancy-submarine'
    | 'buoyancy-balloon'
    | 'machine-lever'
    | 'machine-turning'
    | 'machine-pulley'
    | 'machine-gears'
    | 'machine-advantage'
    | 'machine-real'
    | 'electric-charge'
    | 'electric-interaction'
    | 'electric-current'
    | 'electric-circuit'
    | 'electric-battery'
    | 'electric-lamp'
    | 'electric-switch'
    | 'electric-materials'
    | 'electric-series'
    | 'electric-parallel';
  hook: LocalizedText;
  prediction: LocalizedText;
  predictions: LocalizedText[];
  explore: LocalizedText;
  concept: LocalizedText;
  example: LocalizedText;
  misconception: LocalizedText;
  realWorld: LocalizedText;
  summary: LocalizedText;
  homeExperiment: LocalizedText;
  vocabulary: LocalizedText[];
  formula?: LocalizedText;
  questions: Question[];
  exit: Question;
};
export const q = (
  zh: string,
  en: string,
  options: [string, string][],
  correct: number,
  explanationZh: string,
  explanationEn: string,
): Question => ({
  prompt: t(zh, en),
  options: options.map(([a, b]) => t(a, b)),
  correct,
  explanation: t(explanationZh, explanationEn),
});
