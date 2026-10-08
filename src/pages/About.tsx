import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import productsData, { getImageUrl } from '../data/products';
import { getCutoutUrl } from '../data/visuals';
import Photo from '../components/Photo';
import './Info.css';

const STATS = [
  { big: '100%', small: 'Handmade', g: '#C9F23B', gi: '#1E0B36' },
  { big: 'YKK', small: 'Premium zippers', g: '#FF4F9A', gi: '#1E0B36' },
  { big: 'Soft', small: 'Quilted protection', g: '#2D3BFF', gi: '#FFF6EA' },
];

export default function About() {
  const find = (slug: string) => productsData.products.find((p) => p.slug === slug)!;
  const photo = find('dyson-airwrap-pouch-pink-stripe-ruffle').images[1];

  return (
    <div className="info">
      <section className="panel info__hero" style={{ '--g': '#B69CFF', '--gi': '#1E0B36' } as CSSProperties}>
        <h1 className="info__h1">We believe everyday objects should make you smile.</h1>
        <div className="info__floats" aria-hidden="true">
          <img className="info__float info__float--1" src={getCutoutUrl('makeup-pouch-cheetah')} alt="" />
          <img className="info__float info__float--2" src={getCutoutUrl('makeup-pouch-cherry-cream-ruffle')} alt="" />
          <img className="info__float info__float--3" src={getCutoutUrl('napkin-pouch-pink-hearts')} alt="" />
        </div>
      </section>

      <section className="panel panel--milk info__split">
        <Photo className="info__photo" src={getImageUrl(photo.file)} alt="A quilted pouch styled with flowers" ratio={4 / 5} />
        <div className="info__text">
          <h2>Handcrafted in Coimbatore</h2>
          <p>Vannam was born from a simple desire: to make storage as beautiful as the things we store. We were tired of generic, uninspired bags. We wanted ruffles, gingham, polka dots, and colour.</p>
          <p>Every pouch is handcrafted in our Coimbatore studio. From the selection of premium cottons to the tension of a quilted stitch, we care deeply about the details.</p>
          <p>Vannam (வண்ணம்) is the Tamil word for colour, and it&apos;s why no two of our pouches ever sit on the same shade.</p>
        </div>
      </section>

      <section className="info__stats" aria-label="What goes into every pouch">
        {STATS.map((s) => (
          <div key={s.big} className="panel info__stat" style={{ '--g': s.g, '--gi': s.gi } as CSSProperties}>
            <span className="info__stat-big">{s.big}</span>
            <span className="info__stat-small">{s.small}</span>
          </div>
        ))}
      </section>

      <section className="panel panel--ink info__cta">
        <h2>Discover the collection</h2>
        <Link to="/shop" className="btn btn--milk">Shop Vannam</Link>
      </section>
    </div>
  );
}
