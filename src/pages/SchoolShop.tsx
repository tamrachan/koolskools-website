import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import GoToButton from '../components/GoToButton';
import ProductCard from '../components/ProductCard';
import { productsForSchool, schoolBySlug } from '../data/shop';

function SchoolShop() {
    const { schoolSlug } = useParams();
    const school = schoolBySlug(schoolSlug);

    if (!school) {
        return (
            <div className="mx-auto flex w-full max-w-[1126px] flex-col items-start gap-5 px-6 py-12 text-left md:px-10">
                <h1 className="text-3xl font-bold text-heading">We couldn't find that shop</h1>
                <GoToButton href="/shop">Back to the shop</GoToButton>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-[1126px] px-6 py-12 text-left md:px-10">
            <Breadcrumbs items={[{ label: 'Shop', to: '/shop' }, { label: school.name }]} />
            <h1 className="mt-8 text-4xl font-bold text-heading">{school.name}</h1>
            <p className="mt-3 text-body">{school.description}</p>
            <ul className="m-0 mt-10 grid list-none grid-cols-2 gap-6 p-0 sm:grid-cols-3 lg:grid-cols-4">
                {productsForSchool(school).map((product) => (
                    <li key={product.id}>
                        <ProductCard product={product} school={school} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SchoolShop;
