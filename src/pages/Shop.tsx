import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';
import ProductStrip from '../components/ProductStrip';
import SchoolSearch from '../components/SchoolSearch';
import { popularProducts, productsForSchool, schools } from '../data/shop';

const generalShop = schools.find((school) => school.type === 'general');

function Shop() {
    return (
        <div className="mx-auto flex w-full max-w-[1126px] flex-col px-6 py-16 text-left md:px-10">
            <section className="flex flex-col items-center gap-6">
                <h1 className="text-center text-4xl font-bold text-heading">Find Your School</h1>
                <SchoolSearch className="max-w-2xl" />
            </section>

            {generalShop && (
                <section aria-labelledby="general-heading" className="mt-20">
                    <h2 id="general-heading" className="mb-6 text-2xl font-bold">
                        <Link
                            to={`/shop/${generalShop.slug}`}
                            className="group inline-flex items-center gap-2 text-accent underline underline-offset-4"
                        >
                            {generalShop.name}
                            <FaArrowRight aria-hidden="true" className="text-lg transition-transform group-hover:translate-x-1 motion-reduce:transition-none" />
                        </Link>
                    </h2>
                    <ProductStrip products={productsForSchool(generalShop)} label={`${generalShop.name} products`} />
                </section>
            )}

            <section aria-labelledby="popular-heading" className="mt-16">
                <h2 id="popular-heading" className="mb-6 text-2xl font-bold text-heading">
                    Popular This Week
                </h2>
                <ProductStrip products={popularProducts()} label="popular products" />
            </section>
        </div>
    );
}

export default Shop;
