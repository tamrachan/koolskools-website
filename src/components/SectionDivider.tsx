import { waveDivider } from '../utils/wave';

// This is the shallow squiggle built once from sin functions
// See utils/wave.ts to get the math
const wave = waveDivider();

type SectionDividerProps = {
  fill: string;   /** Background colour of the section this belongs to */
  flip?: boolean; /** Mirror the wave horizontally so repeated dividers don't look identical */
  className?: string;
};

/**
 * The wavy top edge of a section. Use it as the first child of a `relative`
 * section. It renders above the section's top edge. Make sure fill matches 
 * the section's background colour.
 */
export default function SectionDivider({ fill, flip = false, className = '' }: SectionDividerProps) {
  return (
    <svg
      viewBox={wave.viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      // -translate-y-full lifts it clear of the section, top-px then drops it
      // back by one to close the sub-pixel seam
      className={`pointer-events-none absolute inset-x-0 top-px z-10 w-full -translate-y-full ${
        flip ? '-scale-x-100' : ''
      } ${className}`}
      style={{ aspectRatio: wave.aspectRatio }}
    >
      <path d={wave.d} className={fill} />
    </svg>
  );
}
