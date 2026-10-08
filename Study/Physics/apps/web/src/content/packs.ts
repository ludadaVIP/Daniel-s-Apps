import type { Lesson } from './schema';
import type { LessonPack } from './catalogEntry';

export const lessonPacks: Record<LessonPack, () => Promise<Lesson[]>> = {
  foundations: () => import('./foundations').then((m) => m.originalLessons),
  measurement: () => import('./measurement').then((m) => m.measurementLessons),
  mysteries: () => import('./mysteries').then((m) => m.mysteryLessons),
  discoveries: () =>
    import('./discoveries').then((m) => [m.causeLesson, ...m.discoveryLessons]),
  measurementSkills: () =>
    import('./measurementSkills').then((m) => m.measurementSkillsLessons),
  motion: () => import('./motion').then((m) => m.motionLessons),
  forces: () => import('./forces').then((m) => m.forceLessons),
  gravity: () => import('./gravity').then((m) => m.gravityLessons),
  density: () => import('./density').then((m) => m.densityLessons),
  energy: () => import('./energy').then((m) => m.energyLessons),
  work: () => import('./work').then((m) => m.workLessons),
  thermal: () => import('./thermal').then((m) => m.thermalLessons),
  phase: () => import('./phase').then((m) => m.phaseLessons),
  sound: () => import('./sound').then((m) => m.soundLessons),
  light: () => import('./light').then((m) => m.lightLessons),
  pressure: () => import('./pressure').then((m) => m.pressureLessons),
  buoyancy: () => import('./buoyancy').then((m) => m.buoyancyLessons),
  machines: () => import('./machines').then((m) => m.machineLessons),
  electricity: () => import('./electricity').then((m) => m.electricityLessons),
};
