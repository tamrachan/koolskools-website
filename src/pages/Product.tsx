import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCartShopping, FaChevronDown, FaPlus } from 'react-icons/fa6';
import Breadcrumbs from '../components/Breadcrumbs';
import GoToButton from '../components/GoToButton';
import ProductCard from '../components/ProductCard';
import SizeGuide from '../components/SizeGuide';
import {
    findVariation,
    formatPrice,
    imageUrl,
    products,
    productsForSchool,
    schoolBySlug,
    type Attribute,
    type AttributeTerm,
    type Prices,
    type Product as ProductData,
    type School,
    type Selection,
} from '../data/shop';

const COLOUR_TAXONOMY = 'pa_colour';
const SIZE_GUIDE_TAXONOMIES = ['pa_size', 'pa_shorts-size'];

function initialSelection(product: ProductData): Selection {
    const variation = product.variations.find((candidate) => candidate.is_in_stock) ?? product.variations[0];
    return Object.fromEntries(variation?.attributes.map(({ name, value }) => [name, value]) ?? []);
}

/* Patterned colours show each of their hex codes as a hard-edged split */
function swatchBackground(hexCodes: string[] = []) {
    if (hexCodes.length < 2) return hexCodes[0];
    const stop = 100 / hexCodes.length;
    const stops = hexCodes.map((hex, i) => `${hex} ${i * stop}% ${(i + 1) * stop}%`);
    return `linear-gradient(135deg, ${stops.join(', ')})`;
}

function Price({ prices, showFrom }: { prices: Prices; showFrom: boolean }) {
    const [pounds, pence] = formatPrice(prices.price).slice(1).split('.');
    const onSale = prices.price !== prices.regular_price;

    return (
        <p className="flex flex-wrap items-start gap-x-3 font-bold text-heading">
            {showFrom && <span className="mt-1 text-lg">From</span>}
            <span aria-label={formatPrice(prices.price)} className="flex items-start">
                <span aria-hidden="true" className="mt-1 text-xl">£</span>
                <span aria-hidden="true" className="text-5xl/none">{pounds}</span>
                <span aria-hidden="true" className="mt-1 ml-0.5 text-xl">{pence}</span>
            </span>
            {onSale && (
                <span className="mt-1 text-xl font-normal text-inactive">
                    <span className="sr-only">Was </span>
                    <s>{formatPrice(prices.regular_price)}</s>
                </span>
            )}
        </p>
    );
}

type OptionPickerProps = {
    attribute: Attribute;
    value: string | undefined;
    statusOf: (term: AttributeTerm) => string;
    onChange: (slug: string) => void;
};

function SizePicker({ attribute, value, statusOf, onChange }: OptionPickerProps) {
    const id = `attribute-${attribute.id}`;
    const showGuide = SIZE_GUIDE_TAXONOMIES.includes(attribute.taxonomy);

    return (
        <div>
            <label htmlFor={id} className="mb-2 block font-bold text-heading">{attribute.name}</label>
            <div className="flex flex-wrap items-center gap-4">
                <div className="relative w-fit">
                    <select
                        id={id}
                        value={value}
                        onChange={(event) => onChange(event.target.value)}
                        className="min-w-44 cursor-pointer appearance-none rounded-full border-2 border-heading bg-surface py-2.5 pr-14 pl-5 text-lg text-heading"
                    >
                        {attribute.terms.map((term) => {
                            const status = statusOf(term);
                            return (
                                <option key={term.id} value={term.slug}>
                                    {term.name}{status && ` (${status})`}
                                </option>
                            );
                        })}
                    </select>
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border-2 border-heading bg-bg text-xs text-heading"
                    >
                        <FaChevronDown />
                    </span>
                </div>
                {showGuide && <SizeGuide />}
            </div>
        </div>
    );
}

function ColourPicker({ attribute, value, statusOf, onChange }: OptionPickerProps) {
    const selected = attribute.terms.find((term) => term.slug === value) ?? attribute.terms[0];
    const fixed = !attribute.has_variations;

    return (
        <fieldset className="min-w-0">
            <legend className="mb-2 text-heading">
                <span className="font-bold">{attribute.name}: </span>
                {selected.name}
            </legend>
            <div className="flex flex-wrap items-center gap-2">
                {attribute.terms.map((term) => {
                    const status = statusOf(term);
                    const isSelected = term.slug === selected.slug;
                    return (
                        <label
                            key={term.id}
                            title={status ? `${term.name} (${status})` : term.name}
                            className={`relative flex rounded-full border-4 p-0.5 has-focus-visible:outline-2 has-focus-visible:outline-accent-light ${
                                fixed ? '' : 'cursor-pointer'
                            } ${isSelected ? 'border-accent' : 'border-transparent'} ${status ? 'opacity-40' : ''}`}
                        >
                            <input
                                type="radio"
                                name={`attribute-${attribute.id}`}
                                checked={isSelected}
                                disabled={fixed}
                                onChange={() => onChange(term.slug)}
                                className="sr-only"
                            />
                            <span className="sr-only">{term.name}{status && ` (${status})`}</span>
                            <span
                                aria-hidden="true"
                                style={{ background: swatchBackground(term.hex_codes) }}
                                className="size-9 rounded-full border-2 border-heading"
                            />
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}

function ProductDetails({ product, school }: { product: ProductData; school: School }) {
    const [selection, setSelection] = useState(() => initialSelection(product));
    const [activeImageId, setActiveImageId] = useState(() => {
        const variation = findVariation(product, initialSelection(product));
        return variation?.image_id ?? product.images[0].id;
    });

    const variation = product.has_options ? findVariation(product, selection) : undefined;
    const isAvailable = product.has_options ? Boolean(variation?.is_in_stock) : product.is_in_stock;
    const lowStock = variation ? variation.low_stock_remaining : product.low_stock_remaining;
    const activeImage = product.images.find((image) => image.id === activeImageId) ?? product.images[0];
    const moreProducts = productsForSchool(school).filter((other) => other.id !== product.id).slice(0, 5);

    function selectOption(attribute: Attribute, slug: string) {
        const next = { ...selection, [attribute.name]: slug };
        setSelection(next);
        if (attribute.taxonomy === COLOUR_TAXONOMY) {
            setActiveImageId(findVariation(product, next)?.image_id ?? product.images[0].id);
        }
    }

    /* Why a term can't be bought alongside the other current choices */
    function statusOf(attribute: Attribute, term: AttributeTerm) {
        if (!attribute.has_variations) return '';
        const match = findVariation(product, { ...selection, [attribute.name]: term.slug });
        if (!match) return 'unavailable';
        return match.is_in_stock ? '' : 'out of stock';
    }

    return (
        <div className="mx-auto w-full max-w-[1126px] px-6 py-12 text-left md:px-10">
            <Breadcrumbs
                items={[
                    { label: 'Shop', to: '/shop' },
                    { label: school.name, to: `/shop/${school.slug}` },
                    { label: product.name },
                ]}
            />

            <div className="mt-10 grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                <div className="flex flex-col gap-5">
                    <img
                        src={imageUrl(activeImage.src)}
                        alt={activeImage.alt}
                        className="aspect-square w-full rounded-2xl object-cover"
                    />
                    {product.images.length > 1 && (
                        <div className="flex flex-wrap gap-4">
                            {product.images.map((image) => (
                                <button
                                    key={image.id}
                                    type="button"
                                    aria-label={`Show image: ${image.alt}`}
                                    aria-pressed={image.id === activeImage.id}
                                    onClick={() => setActiveImageId(image.id)}
                                    className={`w-24 cursor-pointer overflow-hidden rounded-2xl border-4 ${
                                        image.id === activeImage.id ? 'border-accent' : 'border-transparent'
                                    }`}
                                >
                                    <img src={imageUrl(image.thumbnail)} alt="" className="aspect-[7/10] w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex min-w-0 flex-col gap-6">
                    <h1 className="border-b-2 border-border pb-5 text-3xl/10 font-bold text-heading">{product.name}</h1>

                    <div>
                        <Price
                            prices={variation?.prices ?? product.prices}
                            showFrom={!variation && Boolean(product.prices.price_range)}
                        />
                        <p role="status" className="mt-2 min-h-6 text-sm font-semibold">
                            {product.has_options && !variation && <span className="text-error">This combination isn't available</span>}
                            {(variation || !product.has_options) && !isAvailable && <span className="text-error">Out of stock</span>}
                            {isAvailable && lowStock !== null && <span className="text-warning">Only {lowStock} left</span>}
                        </p>
                    </div>

                    {product.attributes.map((attribute) => {
                        const Picker = attribute.taxonomy === COLOUR_TAXONOMY ? ColourPicker : SizePicker;
                        return (
                            <Picker
                                key={attribute.id}
                                attribute={attribute}
                                value={selection[attribute.name]}
                                statusOf={(term) => statusOf(attribute, term)}
                                onChange={(slug) => selectOption(attribute, slug)}
                            />
                        );
                    })}

                    <div>
                        <div className="flex flex-wrap gap-4">
                            <button
                                type="button"
                                disabled={!isAvailable}
                                className="pressable flex cursor-pointer items-center gap-3 rounded-full border-2 border-border bg-surface px-6 py-3 text-lg text-heading [--pressable-shadow:var(--color-border)] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <FaPlus aria-hidden="true" />
                                Add to basket
                            </button>
                            <button
                                type="button"
                                disabled={!isAvailable}
                                className="pressable flex cursor-pointer items-center gap-3 rounded-full border-2 border-accent-dark bg-accent px-6 py-3 text-lg font-bold text-surface disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Buy now
                                <FaCartShopping aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-3 text-2xl font-bold text-heading">Description</h2>
                        {/* Trusted local dummy data. Sanitise this when it comes from the real backend. */}
                        <div className="text-lg/7 text-heading" dangerouslySetInnerHTML={{ __html: product.description }} />
                    </div>
                </div>
            </div>

            {moreProducts.length > 0 && (
                <section aria-labelledby="more-heading" className="mt-20">
                    <h2 id="more-heading" className="mb-8 text-4xl font-bold text-heading">
                        {school.type === 'general' ? 'More from the General Shop' : 'More from this school'}
                    </h2>
                    <ul className="m-0 grid list-none grid-cols-2 gap-6 p-0 sm:grid-cols-3 lg:grid-cols-5">
                        {moreProducts.map((other) => (
                            <li key={other.id}>
                                <ProductCard product={other} school={school} />
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}

function Product() {
    const { schoolSlug, productSlug } = useParams();
    const school = schoolBySlug(schoolSlug);
    const product = products.find(
        (candidate) => candidate.slug === productSlug && school && candidate.school_ids.includes(school.id),
    );

    if (!school || !product) {
        return (
            <div className="mx-auto flex w-full max-w-[1126px] flex-col items-start gap-5 px-6 py-12 text-left md:px-10">
                <h1 className="text-3xl font-bold text-heading">We couldn't find that product</h1>
                <GoToButton href="/shop">Back to the shop</GoToButton>
            </div>
        );
    }

    // Keyed so options and images reset when moving between products
    return <ProductDetails key={`${school.id}-${product.id}`} product={product} school={school} />;
}

export default Product;
