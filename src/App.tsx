import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import PasswordGate from './components/PasswordGate';
import Home from './pages/Home';
import Shop from './pages/Shop';
import SchoolShop from './pages/SchoolShop';
import Product from './pages/Product';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Basket from './pages/Basket';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <PasswordGate>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <ScrollToTop />
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:schoolSlug" element={<SchoolShop />} />
            <Route path="/shop/:schoolSlug/:productSlug" element={<Product />} />
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/basket" element={<Basket />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </PasswordGate>
  );
}