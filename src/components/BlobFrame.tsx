import { useId } from 'react';

/* Ripped directly from the figma vector */
const BLOB_PATH =
    'M338.158 49.1338C454.094 39.603 487.302 20.6023 567.636 89.7974C650.118 160.843 720.266 131.913 749.254 205.227C778.242 278.542 743.788 384.82 678.92 445.009C622.091 497.739 523.303 454.854 432.092 459.248C326.1 464.353 284.804 527.724 170.272 494.885C55.7397 462.046 119.774 376.012 44.6241 285.173C-30.526 194.334 16.2229 70.1931 102.259 21.9524C188.295 -26.2883 222.221 58.6645 338.158 49.1338Z';

const WIDTH = 767;
const HEIGHT = 512;
const STROKE_WIDTH = 14;

type BlobFrameProps = {
    src: string;
    alt: string;
    className?: string;
};

/** A blob-shaped frame for displaying images like the one in About Us */
function BlobFrame({ src, alt, className = '' }: BlobFrameProps) {
    // Strip the characters React pads ids with as they are not safe inside url(#…)
    const clipId = `blob-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

    return (
        <svg
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={alt}
            className={`h-auto w-full ${className}`}
        >
            <clipPath id={clipId}>
                <path d={BLOB_PATH} />
            </clipPath>
            <image
                href={src}
                width={WIDTH}
                height={HEIGHT}
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#${clipId})`}
            />
            <path d={BLOB_PATH} fill="none" strokeWidth={STROKE_WIDTH} className="stroke-accent" />
        </svg>
    );
}

export default BlobFrame;
