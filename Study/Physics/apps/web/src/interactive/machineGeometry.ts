import { ropeHoist } from './machineModels';
/** View coordinates for an illustrative continuous rope, with a fixed 40 px full lift. */
export function hoistDrawing(
  strands: number,
  height: number,
  progress: number,
) {
  const motion = ropeHoist(strands, 40, height, 1, progress),
    positionScale = 40 / height,
    rise = motion.lift * positionScale,
    descent = motion.pull * positionScale,
    cy = 180 - rise;
  let endX: number,
    endY: number,
    loadX: number,
    loadY: number,
    rope: string,
    straightLength: number,
    arcLength: number;
  if (strands === 1) {
    endX = 232;
    endY = 150 + descent;
    loadX = 188;
    loadY = 260 - rise;
    rope = `M188 ${loadY}V70a22 22 0 0 1 44 0V${endY}`;
    straightLength = loadY - 70 + (endY - 70);
    arcLength = Math.PI * 22;
  } else if (strands === 2) {
    endX = 290;
    endY = 130 + descent;
    loadX = 215;
    loadY = 260 - rise;
    rope = `M190 28V${cy}a25 25 0 0 0 50 0V70a25 25 0 0 1 50 0V${endY}`;
    straightLength = cy - 28 + (cy - 70) + (endY - 70);
    arcLength = 2 * Math.PI * 25;
  } else {
    endX = 370;
    endY = 110 + descent;
    loadX = 245;
    loadY = 260 - rise;
    rope = `M170 28V${cy}a25 25 0 0 0 50 0V70a25 25 0 0 1 50 0V${cy}a25 25 0 0 0 50 0V70a25 25 0 0 1 50 0V${endY}`;
    straightLength = cy - 28 + 3 * (cy - 70) + (endY - 70);
    arcLength = 4 * Math.PI * 25;
  }
  return {
    strands,
    height,
    progress,
    positionScale,
    rise,
    descent,
    cy,
    endX,
    endY,
    loadX,
    loadY,
    rope,
    ropeLength: straightLength + arcLength,
  };
}
