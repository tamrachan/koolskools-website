import { useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import ProductCard from './ProductCard';
import type { Product } from '../data/shop';

const ARROW_CLASS =
    'pressable flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-border bg-bg text-sm text-heading [--pressable-lift:2px] [--pressable-shadow:var(--color-border)] max-sm:hidden';

function ProductStrip({ products, label }: { products: Product[]; label: string }) {
    const trackRef = useRef<HTMLUListElement>(null);

    function scroll(direction: 1 | -1) {
        const track = trackRef.current;
        track?.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: 'smooth' });
    }

    return (
        <div className="flex items-center gap-3">
            <button type="button" aria-label={`Previous ${label}`} onClick={() => scroll(-1)} className={ARROW_CLASS}>
                <FaChevronLeft aria-hidden="true" />
            </button>
            <ul
                ref={trackRef}
                aria-label={label}
                className="m-0 flex min-w-0 flex-1 snap-x list-none gap-5 overflow-x-auto scroll-smooth p-0 pb-2 motion-reduce:scroll-auto"
            >
                {products.map((product) => (
                    <li key={product.id} className="w-40 shrink-0 snap-start md:w-48">
                        <ProductCard product={product} />
                    </li>
                ))}
            </ul>
            <button type="button" aria-label={`Next ${label}`} onClick={() => scroll(1)} className={ARROW_CLASS}>
                <FaChevronRight aria-hidden="true" />
            </button>
        </div>
    );
}

export default ProductStrip;
