import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBasketShopping } from 'react-icons/fa6';
import { FaBars } from 'react-icons/fa6';
import logo from '../assets/logo.png';

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
    <nav className="sticky top-0 z-100 bg-bg">
      <div className="mx-auto flex h-20 w-full max-w-[1126px] items-center justify-between px-10 md:justify-start md:gap-10">
        <NavLink to="/" className="self-start">
          <img src={logo} alt="Koolskools" className="h-26 max-md:h-22 w-auto" />
        </NavLink>

        <ul
          className={`
            m-0 flex list-none gap-4 p-0 max-md:absolute max-md:inset-x-0 max-md:top-20
            max-md:flex-col max-md:border-b-2 max-md:bg-bg
            max-md:px-4 max-md:py-3 ${menuOpen ? 'max-md:flex' : 'max-md:hidden'}
          `}
        >
          {navLinks.map(({ label, to }) => (
            <li key={label}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `block rounded-full px-4 py-2 text-md font-semibold no-underline transition-colors hover:bg-accent hover:text-surface ${
                    isActive ? 'bg-border text-surface' : 'text-heading'
                  }`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:ml-auto">
          <NavLink
            to="/basket"
            aria-label="Basket"
            className={({ isActive }) =>
              `flex items-center rounded-md p-2 text-2xl transition-colors hover:bg-accent hover:text-surface ${
                isActive ? 'bg-accent text-surface' : 'text-heading'
              }`
            }
          >
            <FaBasketShopping />
          </NavLink>

          <button
            className="flex md:hidden cursor-pointer rounded-md p-2 text-2xl transition-colors hover:bg-accent hover:text-surface"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <FaBars className="text-2xl" />
          </button>
        </div>
      </div>
    </nav>
  );
}
