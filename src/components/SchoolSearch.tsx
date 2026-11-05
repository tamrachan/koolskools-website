import { useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaMagnifyingGlass } from 'react-icons/fa6';
import { searchSchools, type School } from '../data/shop';

const LISTBOX_ID = 'school-search-results';
const PANEL_BORDER_PX = 4;

function SchoolSearch({ className = 'max-w-lg' }: { className?: string }) {
    const [query, setQuery] = useState('');
    const [focused, setFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [contentHeight, setContentHeight] = useState(0);
    const contentRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const hasQuery = query.trim() !== '';
    const matches = hasQuery ? searchSchools(query) : [];
    const active = matches[activeIndex];
    const open = focused && hasQuery;

    /* The panel animates to its content's measured height, so it grows downwards
       when it opens and resizes smoothly as the matches change */
    useEffect(() => {
        const content = contentRef.current;
        if (!content) return;
        const observer = new ResizeObserver(([entry]) => setContentHeight(entry.borderBoxSize[0].blockSize));
        observer.observe(content);
        return () => observer.disconnect();
    }, []);

    function goToSchool(school: School) {
        setFocused(false);
        navigate(`/shop/${school.slug}`);
    }

    function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const target = active ?? matches[0];
        if (target) goToSchool(target);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
        if (event.key === 'Escape') {
            setFocused(false);
            setActiveIndex(-1);
        } else if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && matches.length) {
            event.preventDefault();
            const step = event.key === 'ArrowDown' ? 1 : -1;
            const nextIndex = (activeIndex + step + matches.length) % matches.length;
            setFocused(true);
            setActiveIndex(nextIndex);
            document.getElementById(`school-option-${matches[nextIndex].id}`)?.scrollIntoView({ block: 'nearest' });
        }
    }

    function handleBlur(event: FocusEvent<HTMLDivElement>) {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
    }

    return (
        <div className={`relative w-full ${className}`} onBlur={handleBlur}>
            <form
                role="search"
                onSubmit={handleSubmit}
                className="flex w-full items-center gap-3 rounded-full border-2 border-border bg-surface py-1.5 pr-2 pl-5 shadow-[0_4px_0_var(--color-border)]"
            >
                <FaMagnifyingGlass className="shrink-0 text-accent" aria-hidden="true" />
                <label htmlFor="school-search" className="sr-only">
                    Find your school
                </label>
                <input
                    id="school-search"
                    type="search"
                    role="combobox"
                    aria-expanded={open}
                    aria-controls={LISTBOX_ID}
                    aria-autocomplete="list"
                    aria-activedescendant={open && active ? `school-option-${active.id}` : undefined}
                    autoComplete="off"
                    value={query}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setActiveIndex(-1);
                        setFocused(true);
                    }}
                    onFocus={() => setFocused(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your school's name"
                    className="min-w-0 flex-1 border-none bg-transparent py-2 text-body outline-none placeholder:text-xs placeholder:text-inactive sm:placeholder:text-sm md:placeholder:text-base"
                />
                <button
                    type="submit"
                    aria-label="Find shop"
                    className="pressable flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-accent-dark bg-accent px-5 py-2 font-semibold text-surface"
                >
                    <span className="hidden sm:inline">Find shop</span>
                    <FaArrowRight aria-hidden="true" />
                </button>
            </form>

            {/* Keep focus in the input so clicking a result doesn't close the panel first */}
            <div
                onMouseDown={(event) => event.preventDefault()}
                aria-hidden={!open}
                style={{ height: open ? contentHeight + PANEL_BORDER_PX : 0 }}
                className={`absolute inset-x-0 top-full z-30 mt-3 overflow-hidden rounded-3xl border-2 border-border bg-surface text-left shadow-[0_4px_0_var(--color-border)] transition-[height,opacity,visibility] duration-300 ease-out motion-reduce:transition-none ${
                    open ? 'visible opacity-100' : 'invisible opacity-0'
                }`}
            >
                <div ref={contentRef} className="p-5">
                    <p className="mb-2 text-sm text-heading" role="status">
                        {hasQuery && matches.length === 0 && 'No schools found'}
                        {matches.length === 1 && '1 match'}
                        {matches.length > 1 && `${matches.length} matches`}
                    </p>
                    <ul id={LISTBOX_ID} role="listbox" aria-label="Schools" className="m-0 flex max-h-52 list-none flex-col gap-1 overflow-y-auto p-0">
                        {matches.map((school, index) => {
                            const isActive = index === activeIndex;
                            return (
                                <li
                                    key={school.id}
                                    id={`school-option-${school.id}`}
                                    role="option"
                                    aria-selected={isActive}
                                    onClick={() => goToSchool(school)}
                                    onMouseEnter={() => setActiveIndex(index)}
                                    onMouseLeave={() => setActiveIndex(-1)}
                                    className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-1.5 transition-colors ${
                                        isActive ? 'bg-accent-subtle' : ''
                                    }`}
                                >
                                    <span className={`min-w-0 flex-1 font-heading text-lg/6 transition-colors ${isActive ? 'text-accent' : 'text-heading'}`}>
                                        {school.name}
                                    </span>
                                    <span className="shrink-0 text-xs text-border max-sm:hidden">
                                        {school.count} {school.count === 1 ? 'product' : 'products'}
                                    </span>
                                    <FaArrowRight
                                        aria-hidden="true"
                                        className={`shrink-0 transition-transform motion-reduce:transition-none ${
                                            isActive ? 'translate-x-1 text-accent' : 'text-heading'
                                        }`}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                    <p className="mt-3 flex flex-wrap justify-end gap-x-3 text-sm text-heading">
                        School not listed?
                        <Link to="/contact" tabIndex={open ? undefined : -1} className="font-bold text-accent underline">
                            Sign up your school
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SchoolSearch;
