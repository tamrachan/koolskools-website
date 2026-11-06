import { Fragment } from 'react';
import { Link } from 'react-router-dom';

type Crumb = { label: string; to?: string };

function Breadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-x-3 font-heading text-xl text-heading">
            {items.map(({ label, to }, index) => (
                <Fragment key={label}>
                    {index > 0 && <span aria-hidden="true" className="text-2xl/6">›</span>}
                    {to ? (
                        <Link to={to} className="hover:underline">{label}</Link>
                    ) : (
                        <span aria-current="page">{label}</span>
                    )}
                </Fragment>
            ))}
        </nav>
    );
}

export default Breadcrumbs;
