import { Link } from 'react-router-dom';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import GoToButton from '../components/GoToButton';
import { useBasket } from '../context/BasketContext';
import { formatPrice, imageUrl, productPath, products } from '../data/shop';

const QUANTITY_BUTTON_CLASS =
    'flex size-8 cursor-pointer items-center justify-center rounded-full border-2 border-border bg-surface text-xs text-heading';

function Basket() {
    const { lines, setQuantity } = useBasket();

    const items = lines.flatMap((line) => {
        const product = products.find((candidate) => candidate.id === line.productId);
        if (!product) return [];
        const variation = product.variations.find((candidate) => candidate.id === line.variationId);
        if (line.variationId !== null && !variation) return [];
        const unitPrice = (variation?.prices ?? product.prices).price;
        const options = variation?.attributes.flatMap(({ name, value }) => {
            const attribute = product.attributes.find((candidate) => candidate.name === name);
            return attribute?.terms.filter((term) => term.slug === value).map((term) => `${name}: ${term.name}`) ?? [];
        });
        const image = product.images.find((candidate) => candidate.id === variation?.image_id) ?? product.images[0];
        return [{ line, product, unitPrice, options, image }];
    });

    const total = items.reduce((sum, { line, unitPrice }) => sum + line.quantity * Number(unitPrice), 0);

    return (
        <div className="mx-auto flex w-full max-w-[1126px] flex-col items-start gap-6 px-6 py-12 text-left md:px-10">
            <h1 className="text-4xl font-bold text-heading">Basket</h1>

            {items.length === 0 ? (
                <>
                    <p className="text-body">Your basket is currently empty.</p>
                    <GoToButton href="/shop">Go to the shop</GoToButton>
                </>
            ) : (
                <>
                    <ul className="m-0 flex w-full list-none flex-col gap-4 p-0">
                        {items.map(({ line, product, unitPrice, options, image }) => (
                            <li
                                key={`${line.productId}-${line.variationId}`}
                                className="flex flex-wrap items-center gap-4 border-b border-border/30 pb-4"
                            >
                                <img src={imageUrl(image.thumbnail)} alt="" className="size-20 rounded-xl object-cover" />
                                <div className="min-w-48 flex-1">
                                    <Link to={productPath(product)} className="font-semibold text-heading hover:underline">
                                        {product.name}
                                    </Link>
                                    {options && <p className="text-sm text-body">{options.join(', ')}</p>}
                                    <p className="text-sm text-body">{formatPrice(unitPrice)} each</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        aria-label={`Remove one ${product.name}`}
                                        onClick={() => setQuantity(line, line.quantity - 1)}
                                        className={QUANTITY_BUTTON_CLASS}
                                    >
                                        <FaMinus aria-hidden="true" />
                                    </button>
                                    <span aria-label={`Quantity ${line.quantity}`} className="min-w-5 text-center font-semibold text-heading">
                                        {line.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        aria-label={`Add one ${product.name}`}
                                        onClick={() => setQuantity(line, line.quantity + 1)}
                                        className={QUANTITY_BUTTON_CLASS}
                                    >
                                        <FaPlus aria-hidden="true" />
                                    </button>
                                </div>
                                <p className="w-20 text-right font-bold text-heading">
                                    {formatPrice(String(line.quantity * Number(unitPrice)))}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <p className="w-full text-right text-2xl font-bold text-heading">Total {formatPrice(String(total))}</p>
                </>
            )}
        </div>
    );
}

export default Basket;
