import { useEffect, useState, type ReactNode, type TransitionEvent } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';

const TRANSITION_MS = 500;

type CarouselProps = {
    images: ReactNode[];    /** Images are stretched to cover the carousel */
    children?: ReactNode;   /** Overlaid on top of the slides, centred */
    label?: string;         /** Accessible name for the carousel region */
    className?: string;
};

function Carousel({ images, children, label = 'Highlights', className = '' }: CarouselProps) {
    const count = images.length;
    const loops = count > 1;

    /* For infinite looping the track is [last, 1..n, first]. Stepping off either
       end lands on a clone of the slide at the far end; once that transition
       finishes we jump to the real one with the animation switched off */
    const slides = loops ? [images[count - 1], ...images, images[0]] : images;
    const firstSlide = loops ? 1 : 0;
    const lastSlide = loops ? count : count - 1;

    const [index, setIndex] = useState(firstSlide);
    const [animated, setAnimated] = useState(true);

    /* Re-enable the transition only after the browser has painted the jump */
    useEffect(() => {
        if (animated) return;
        let inner = 0;
        const outer = requestAnimationFrame(() => {
            inner = requestAnimationFrame(() => setAnimated(true));
        });
        return () => {
            cancelAnimationFrame(outer);
            cancelAnimationFrame(inner);
        };
    }, [animated]);

    /* Input is ignored while jumping so a fast double-click doesn't break things */
    const step = (delta: number) => {
        if (!animated) return;
        setIndex((prev) => Math.min(lastSlide + 1, Math.max(firstSlide - 1, prev + delta)));
    };

    const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
        // Ignore transitions from anything rendered inside a slide
        if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;
        if (index > lastSlide) {
            setAnimated(false);
            setIndex(firstSlide);
        } else if (index < firstSlide) {
            setAnimated(false);
            setIndex(lastSlide);
        }
    };

    // Clones stand in for real slides, so number them by what they depict.
    const slideNumber = (i: number) => (loops ? ((i - 1 + count) % count) + 1 : i + 1);

    return (
        <div
            role="region"
            aria-roledescription="carousel"
            aria-label={label}
            className={`relative overflow-hidden ${className}`}
        >
            <div
                className="flex h-full"
                style={{
                    transform: `translateX(-${index * 100}%)`,
                    transition: animated ? `transform ${TRANSITION_MS}ms ease-in-out` : 'none',
                }}
                onTransitionEnd={handleTransitionEnd}
            >
                {slides.map((image, i) => (
                    <div
                        key={i}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${slideNumber(i)} of ${count}`}
                        aria-hidden={i !== index}
                        className="h-full w-full shrink-0 *:h-full *:w-full *:object-cover"
                    >
                        {image}
                    </div>
                ))}
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-8 px-16 max-md:px-6">
                {children}
            </div>

            {loops && (
                <>
                    <button
                        type="button"
                        aria-label="Previous slide"
                        onClick={() => step(-1)}
                        className="absolute top-1/2 left-4 z-20 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-surface/80 p-3 text-lg text-heading shadow-md shadow-accent-dark/10 transition-colors hover:bg-surface"
                    >
                        <FaChevronLeft />
                    </button>
                    <button
                        type="button"
                        aria-label="Next slide"
                        onClick={() => step(1)}
                        className="absolute top-1/2 right-4 z-20 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border-none bg-surface/80 p-3 text-lg text-heading shadow-md shadow-accent-dark/10 transition-colors hover:bg-surface"
                    >
                        <FaChevronRight />
                    </button>
                </>
            )}
        </div>
    );
}

export default Carousel;
