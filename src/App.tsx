import { Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Wordmark from './components/Wordmark';
import BloomNav from './components/BloomNav';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import SearchOverlay from './components/SearchOverlay';
import PressPreview from './components/PressPreview';
import Toast from './components/Toast';
import RouteIris from './components/RouteIris';
import Loader from './components/Loader';

const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const ProductPage = lazy(() => import('./pages/ProductPage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const About = lazy(() => import('./pages/About'));
const Story = lazy(() => import('./pages/Story'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App() {
  const location = useLocation();

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Wordmark />
      <BloomNav />
      <CartDrawer />
      <SearchOverlay />
      <PressPreview />
      <Toast />
      <RouteIris />
      <div className="app">
        <main id="main-content">
          <Suspense fallback={<Loader />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:categorySlug" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/story" element={<Story />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </>
  );
}
