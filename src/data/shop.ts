import schoolsData from '../../dummy-data/schools.json';
import productsData from '../../dummy-data/products.json';

export type ProductImage = {
    id: number;
    src: string;
    thumbnail: string;
    name: string;
    alt: string;
};

export type School = {
    id: number;
    name: string;
    slug: string;
    type: 'school' | 'general';
    description: string;
    image: ProductImage | null;
    count: number;
};

export type Prices = {
    price: string;
    regular_price: string;
    sale_price: string;
    price_range: { min_amount: string; max_amount: string } | null;
};

export type AttributeTerm = {
    id: number;
    name: string;
    slug: string;
    hex_codes?: string[];
};

export type Attribute = {
    id: number;
    name: string;
    taxonomy: string;
    has_variations: boolean;
    terms: AttributeTerm[];
};

export type Variation = {
    id: number;
    sku: string;
    attributes: { name: string; value: string }[];
    prices: Prices;
    is_in_stock: boolean;
    low_stock_remaining: number | null;
    image_id: number | null;
};

export type Product = {
    id: number;
    school_ids: number[];
    category_ids: number[];
    name: string;
    slug: string;
    type: 'simple' | 'variable';
    sku: string;
    short_description: string;
    description: string;
    on_sale: boolean;
    prices: Prices;
    images: ProductImage[];
    attributes: Attribute[];
    variations: Variation[];
    has_options: boolean;
    is_purchasable: boolean;
    is_in_stock: boolean;
    is_on_backorder: boolean;
    low_stock_remaining: number | null;
};

/** Attribute name -> selected term slug */
export type Selection = Record<string, string>;

export const schools = schoolsData as School[];
export const products = productsData as Product[];

const imageUrls = import.meta.glob<string>('../../dummy-data/images/*.jpg', {
    eager: true,
    query: '?url',
    import: 'default',
});

export function imageUrl(file: string) {
    return imageUrls[`../../dummy-data/images/${file}`];
}

/* The backend has no popularity data, so this is a hand-picked demo selection */
const POPULAR_SLUGS = [
    'oakfield-crested-blazer',
    'plain-white-polo-shirt',
    'st-aldrics-waterproof-coat',
    'fernhill-games-rugby-shirt',
    'blackthorn-pe-hoodie',
    'riverside-zip-up-sweatshirt',
    'plain-green-gingham-pinafore',
    'oakfield-v-neck-jumper',
];

export function popularProducts() {
    return POPULAR_SLUGS.flatMap((slug) => products.filter((product) => product.slug === slug));
}

export function schoolBySlug(slug: string | undefined) {
    return schools.find((school) => school.slug === slug);
}

export function productsForSchool(school: School) {
    return products.filter((product) => product.school_ids.includes(school.id));
}

export function productPath(product: Product, school?: School) {
    const owner = school ?? schools.find((candidate) => candidate.id === product.school_ids[0]);
    return `/shop/${owner?.slug}/${product.slug}`;
}

// Ignore punctuation so "st aldrics" finds "St. Aldric's"
function normalise(text: string) {
    return text.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

export function searchSchools(query: string) {
    const term = normalise(query);
    return schools.filter((school) => normalise(school.name).includes(term));
}

export function findVariation(product: Product, selection: Selection) {
    return product.variations.find((variation) =>
        variation.attributes.every(({ name, value }) => selection[name] === value),
    );
}

export function formatPrice(minorUnits: string) {
    return `£${(Number(minorUnits) / 100).toFixed(2)}`;
}
