import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import productsData, { getImageUrl } from '../data/products';
import Photo from '../components/Photo';
import './Info.css';

const WORDS = ['gingham', 'ruffles', 'lace', 'bows', 'quilting'];

export default function Story() {
  const find = (slug: string) => productsData.products.find((p) => p.slug === slug)!;
  const lead = find('dyson-airwrap-pouch-navy-quilted').images[1];
  const trio = [
    find('makeup-pouch-polka-ruffle'),
    find('makeup-pouch-cherry-cream-ruffle'),
    find('makeup-pouch-green-gingham-floral'),
  ];

  return (
    <div className="info">
      <section className="panel info__hero" style={{ '--g': '#2D3BFF', '--gi': '#FFF6EA' } as CSSProperties}>
        <h1 className="info__h1">The fabric of Vannam</h1>
        <p className="info__lede">Every stitch tells a story of care, colour, and absolute functionality.</p>
      </section>

      <section className="panel panel--milk info__split info__split--flip">
        <div className="info__text">
          <h2>More than just a pouch</h2>
          <p>We saw that women invest heavily in premium tools, like the Dyson Airwrap, but end up storing them in generic, unprotective bags. Vannam was created to bridge the gap between high-end functionality and unabashed cuteness.</p>
          <p>We quilt our cottons for safety. We source smooth YKK zippers so they never snag. We tailor compartments so every barrel, brush, and serum has a home.</p>
        </div>
        <Photo className="info__photo" src={getImageUrl(lead.file)} alt="Navy quilted pouch with a pink zip" ratio={3 / 4} />
      </section>

      <section className="panel info__strip" aria-hidden="true">
        <div className="info__strip-track">
          {[0, 1].map((c) => (
            <span key={c}>{WORDS.map((w) => `${w}, `).join('')}</span>
          ))}
        </div>
      </section>

      <section className="panel panel--milk info__gallery" aria-label="Gallery">
        {trio.map((p) => (
          <Photo key={p.slug} src={getImageUrl(p.images[1].file)} alt={p.name} ratio={4 / 5} />
        ))}
      </section>

      <section className="panel panel--ink info__cta">
        <h2>Explore the collection</h2>
        <Link to="/shop" className="btn btn--milk">Shop all pouches</Link>
      </section>
    </div>
  );
}
