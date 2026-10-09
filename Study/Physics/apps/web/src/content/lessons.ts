import type { Lesson } from './schema';
import { originalLessons } from './foundations';
export { units, stages } from './curriculum';
import { motionLessons } from './motion';
import { forceLessons } from './forces';
import { gravityLessons } from './gravity';
import { densityLessons } from './density';
import { energyLessons } from './energy';
import { workLessons } from './work';
import { thermalLessons } from './thermal';
import { soundLessons } from './sound';
import { lightLessons } from './light';
import { pressureLessons } from './pressure';
import { buoyancyLessons } from './buoyancy';
import { machineLessons } from './machines';
import { electricQuantLessons } from './electricQuant';
import { magnetismLessons } from './magnetism';
import { spaceLessons } from './space';
import { electricityLessons } from './electricity';
import { phaseLessons } from './phase';
import { measurementSkillsLessons } from './measurementSkills';
import { measurementLessons } from './measurement';
import { mysteryLessons } from './mysteries';
import { causeLesson, discoveryLessons } from './discoveries';
export { t, q } from './schema';
export type { Lesson, Question } from './schema';
export const lessons: Lesson[] = [
  ...originalLessons.slice(0, 3),
  ...measurementLessons.slice(0, 2),
  originalLessons[3]!,
  ...measurementLessons.slice(2),
  causeLesson,
  ...mysteryLessons,
  ...discoveryLessons,
  ...measurementSkillsLessons,
  ...motionLessons.slice(0, 2),
  originalLessons[4]!,
  ...motionLessons.slice(2),
  ...forceLessons,
  ...gravityLessons,
  ...densityLessons,
  ...energyLessons,
  ...workLessons,
  ...thermalLessons,
  ...phaseLessons,
  ...soundLessons,
  ...lightLessons,
  ...pressureLessons,
  ...buoyancyLessons,
  ...machineLessons,
  ...electricityLessons,
  ...electricQuantLessons,
  ...magnetismLessons,
  ...spaceLessons,
];
// Used by catalog generation and integrity tests, never by the app's entry.
export const lessonCollections = {
  foundations: originalLessons,
  measurement: measurementLessons,
  mysteries: mysteryLessons,
  discoveries: [causeLesson, ...discoveryLessons],
  measurementSkills: measurementSkillsLessons,
  motion: motionLessons,
  forces: forceLessons,
  gravity: gravityLessons,
  density: densityLessons,
  energy: energyLessons,
  work: workLessons,
  thermal: thermalLessons,
  phase: phaseLessons,
  sound: soundLessons,
  light: lightLessons,
  pressure: pressureLessons,
  buoyancy: buoyancyLessons,
  machines: machineLessons,
  electricity: electricityLessons,
  electricQuant: electricQuantLessons,
  magnetism: magnetismLessons,
  space: spaceLessons,
};
