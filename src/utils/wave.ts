/* The wave that every section divider on the site is cropped to.
 *
 * It is a sine wave whose amplitude is damped by sqrt(t) and then
 * rotated very slightly clockwise
 *
 *   f(t) = (1/a) · sin(b*t) · sqrt(t) / c
 *   X(t) = t*cos(k) − f(t)*sin(k)
 *   Y(t) = t*sin(k) + f(t)*cos(k)        for t \in [0, 1]
 *
 * Everything is computed in the plotted (y-up) coordinate space and flipped
 * once, at the end, when it is written out as SVG path data.
 */

export type WaveOptions = {
  amplitude: number;  /** Amplitude divisor, larger values give a flatter wave */
  frequency: number;  /** Angular frequency, 3*pi is one and a half periods across the width */
  damping: number;    /** Amplitude damping relative to t, makes the wave change amplitude */
  tilt: number;       /** Rotation of the whole curve in radians */
};

export const waveDefaults: WaveOptions = {
  amplitude: 30,
  frequency: 3 * Math.PI,
  damping: 1.5,
  tilt: -Math.PI / 180,
};

export type WavePoint = { x: number; y: number };

/** f(t): the un-rotated wave */
export function waveOffset(t: number, options: WaveOptions = waveDefaults): number {
  const { amplitude, frequency, damping } = options;
  return (Math.sin(frequency * t) * Math.sqrt(t)) / (amplitude * damping);
}

/** (X(t), Y(t)): the wave after rotation by k */
export function wavePoint(t: number, options: WaveOptions = waveDefaults): WavePoint {
  const f = waveOffset(t, options);
  const cos = Math.cos(options.tilt);
  const sin = Math.sin(options.tilt);
  return { x: t * cos - f * sin, y: t * sin + f * cos };
}

/** The curve sampled at `samples + 1` evenly spaced values of t */
export function waveCurve(samples = 96, options: WaveOptions = waveDefaults): WavePoint[] {
  return Array.from({ length: samples + 1 }, (_, i) => wavePoint(i / samples, options));
}

export type WaveGeometry = {
  d: string;
  viewBox: string;
  aspectRatio: number;
};

const VIEWBOX_WIDTH = 1000;

/**
 * Build the divider shape as an SVG path, closed off along the bottom of the
 * viewBox so it can be filled with the colour of the section underneath
 */
export function waveDivider(samples = 96, options: WaveOptions = waveDefaults): WaveGeometry {
  // Negate y: SVG's y axis points down
  const curve = waveCurve(samples, options).map(({ x, y }) => ({ x, y: -y }));

  const xs = curve.map((p) => p.x);
  const ys = curve.map((p) => p.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const width = Math.max(...xs) - minX;
  const height = Math.max(...ys) - minY;

  const scale = VIEWBOX_WIDTH / width;
  const round = (n: number) => Number(n.toFixed(2));
  const bottom = round(height * scale);

  const points = curve.map((p) => `${round((p.x - minX) * scale)} ${round((p.y - minY) * scale)}`);
  const d = `M ${points.join(' L ')} L ${VIEWBOX_WIDTH} ${bottom} L 0 ${bottom} Z`;

  return {
    d,
    viewBox: `0 0 ${VIEWBOX_WIDTH} ${bottom}`,
    aspectRatio: width / height,
  };
}
