import { Link } from 'react-router-dom';
import { formatPrice, imageUrl, productPath, type Product, type School } from '../data/shop';

function ProductCard({ product, school }: { product: Product; school?: School }) {
    const { price, regular_price, price_range } = product.prices;
    const image = product.images[0];

    return (
        <Link to={productPath(product, school)} className="group flex flex-col gap-2 text-left no-underline">
            <img
                src={imageUrl(image.thumbnail)}
                alt={image.alt}
                loading="lazy"
                className="aspect-square w-full rounded-2xl object-cover transition-opacity group-hover:opacity-85"
            />
            <span className="text-sm/5 font-semibold text-heading group-hover:underline">{product.name}</span>
            <span className="text-sm text-body">
                {price_range && 'From '}
                {formatPrice(price)}
                {product.on_sale && <s className="ml-2 text-inactive">{formatPrice(regular_price)}</s>}
                {!product.is_in_stock && <span className="ml-2 text-error">Out of stock</span>}
            </span>
        </Link>
    );
}

export default ProductCard;
