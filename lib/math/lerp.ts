export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

export function damp(current: number, target: number, smoothing: number, dt: number): number {
  return lerp(current, target, 1 - Math.exp(-smoothing * dt));
}

export function lerpVec3(
  current: [number, number, number],
  target: [number, number, number],
  t: number
): [number, number, number] {
  return [
    lerp(current[0], target[0], t),
    lerp(current[1], target[1], t),
    lerp(current[2], target[2], t),
  ];
}
