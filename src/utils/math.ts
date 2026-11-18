/**
 *  Radians
 */

export function toRadian(deg: number): number {
  return deg * (Math.PI / 180);
}

export function toDeg(rad: number): number {
  return rad * (180 / Math.PI);
}

export function clamp(number: number, min: number, max: number) {
  return Math.max(min, Math.min(number, max))
}