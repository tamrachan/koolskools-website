import { useState, type SubmitEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight, FaMagnifyingGlass } from 'react-icons/fa6';

function SchoolSearch() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const school = query.trim();
        if (!school) return;
        navigate(`/shop?school=${encodeURIComponent(school)}`); /** Placeholder!! */
    }

    return (
        <form
            role="search"
            onSubmit={handleSubmit}
            className="flex w-full max-w-lg items-center gap-3 rounded-full bg-surface py-1.5 pr-1.5 pl-5 shadow-lg shadow-accent-dark/10 border-2 border-accent-subtle"
        >
            <FaMagnifyingGlass className="shrink-0 text-inactive" aria-hidden="true" />
            <label htmlFor="school-search" className="sr-only">
                Find your school
            </label>
            <input
                id="school-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Type your school's name or town..."
                className="min-w-0 flex-1 border-none bg-transparent py-2 text-body outline-none placeholder:text-inactive"
            />
            <button
                type="submit"
                className="pressable flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-accent-dark bg-accent px-5 py-2 font-semibold text-bg"
            >
                Find shop
                <FaArrowRight aria-hidden="true" />
            </button>
        </form>
    );
}

export default SchoolSearch;
