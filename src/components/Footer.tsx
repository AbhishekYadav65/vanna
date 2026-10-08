import { Link } from 'react-router-dom';
import Flower from './Flower';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="panel panel--ink footer" role="contentinfo">
      <div className="footer__grid">
        <div className="footer__brand">
          <p className="footer__tag">All things cute &amp; functional. Handcrafted with love in Coimbatore.</p>
          <a href="https://www.instagram.com/vannam.ig" target="_blank" rel="noopener noreferrer" className="btn btn--milk">@vannam.ig on Instagram</a>
        </div>
        <nav className="footer__col" aria-label="Shop">
          <h3>Shop</h3>
          <ul>
            <li><Link to="/shop">All pouches</Link></li>
            <li><Link to="/shop/hair-tool-pouches">Hair tool pouches</Link></li>
            <li><Link to="/shop/makeup-pouches">Makeup pouches</Link></li>
            <li><Link to="/shop/napkin-small-pouches">Napkin pouches</Link></li>
          </ul>
        </nav>
        <nav className="footer__col" aria-label="Brand">
          <h3>Vannam</h3>
          <ul>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/story">Our story</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </div>
      <div className="footer__giant" aria-hidden="true">
        <Flower size={96} spin className="footer__flower" />
        <span>Vannam</span>
      </div>
      <p className="footer__legal">&copy; {new Date().getFullYear()} Vannam. All rights reserved.</p>
    </footer>
  );
}
