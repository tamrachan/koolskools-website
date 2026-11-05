import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import PasswordGate from './components/PasswordGate';
import Home from './pages/Home';
import Shop from './pages/Shop';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Basket from './pages/Basket';

export default function App() {
  return (
    <PasswordGate>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <NavBar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
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