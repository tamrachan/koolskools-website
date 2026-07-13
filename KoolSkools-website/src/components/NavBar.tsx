import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="full-bleed sticky top-0 z-100 border-b-2 border-accent-subtle bg-surface">
      <div className="mx-auto flex h-20 w-full max-w-[1126px] items-center justify-between px-10 md:justify-start md:gap-10">
        <NavLink to="/" className="font-quote text-3xl font-bold text-accent">
          Kool<span>skools</span>
        </NavLink>

        <button
          className="flex cursor-pointer flex-col gap-[5px] border-none bg-transparent p-1 max-md:flex md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="block h-0.5 w-6 rounded-md bg-accent transition" />
          <span className="block h-0.5 w-6 rounded-md bg-accent transition" />
          <span className="block h-0.5 w-6 rounded-md bg-accent transition" />
        </button>

        <ul
          className={`
            m-0 flex list-none gap-4 p-0 max-md:absolute max-md:inset-x-0 max-md:top-16
            max-md:flex-col max-md:border-b-2 max-md:border-accent-subtle max-md:bg-bg
            max-md:px-4 max-md:py-3 ${menuOpen ? 'max-md:flex' : 'max-md:hidden'}
          `}
        >
          {navLinks.map(({ label, to }) => (
            <li key={label}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `block rounded-md px-4 py-2 text-md font-semibold no-underline transition-colors hover:bg-accent hover:text-bg ${
                    isActive ? 'bg-accent text-bg' : 'text-heading'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
