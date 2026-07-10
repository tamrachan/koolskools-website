import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import '../css/NavBar.css';

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
    <nav className="navbar">
      <NavLink to="/" className="navbar-logo">
        Kool<span>Skools</span>
      </NavLink>

      <button
        className="navbar-toggle"
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        <span />
        <span />
        <span />
      </button>

      <ul className={`navbar-links${menuOpen ? ' open' : ''}`}>
        {navLinks.map(({ label, to }) => (
          <li key={label}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}