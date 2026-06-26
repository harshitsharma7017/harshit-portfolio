export function hash(n: number): number {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export function noise1D(x: number): number {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerpHash(i, i + 1, u);
}

function lerpHash(a: number, b: number, t: number): number {
  return hash(a) * (1 - t) + hash(b) * t;
}

export function driftOffset(time: number, seed: number, amplitude: number): number {
  return (noise1D(time * 0.1 + seed) - 0.5) * 2 * amplitude;
}
