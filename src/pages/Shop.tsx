import { useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import { Link, useParams } from 'react-router-dom';
import productsData, { CATEGORIES } from '../data/products';
import { CATEGORY_GROUNDS } from '../data/visuals';
import ProductCard from '../components/ProductCard';
import ArcCarousel from '../components/ArcCarousel';
import './Shop.css';

export default function Shop() {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [sort, setSort] = useState('featured');
  const [view, setView] = useState<'grid' | 'curve'>('grid');

  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  const ground = categorySlug && CATEGORY_GROUNDS[categorySlug] ? CATEGORY_GROUNDS[categorySlug] : { bg: '#FFD93D', ink: '#1E0B36' };

  const products = useMemo(() => {
    let list = productsData.products;
    if (category) list = list.filter((p) => p.category === category.name);
    return [...list].sort((a, b) => {
      if (sort === 'price-low') return a.price - b.price;
      if (sort === 'price-high') return b.price - a.price;
      if (sort === 'name-a') return a.name.localeCompare(b.name);
      if (sort === 'name-z') return b.name.localeCompare(a.name);
      return 0;
    });
  }, [category, sort]);

  return (
    <div className="shop">
      <section className="panel shop__head" style={{ '--g': ground.bg, '--gi': ground.ink } as CSSProperties}>
        <div className="shop__head-inner">
          <h1 className="shop__title">{category ? category.name : 'All pouches'}</h1>
          <p className="shop__count">{products.length} {products.length === 1 ? 'pouch' : 'pouches'}, all handmade in Coimbatore</p>

          <nav className="shop__cats" aria-label="Categories">
            <Link to="/shop" className={`chip ${!categorySlug ? 'is-active' : ''}`}>All</Link>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} to={`/shop/${c.slug}`} className={`chip ${categorySlug === c.slug ? 'is-active' : ''}`}>{c.label}</Link>
            ))}
          </nav>

          <div className="shop__tools">
            <div className="shop__views" role="group" aria-label="View">
              <button type="button" className={`chip ${view === 'grid' ? 'is-active' : ''}`} aria-pressed={view === 'grid'} onClick={() => setView('grid')}>Grid</button>
              <button type="button" className={`chip ${view === 'curve' ? 'is-active' : ''}`} aria-pressed={view === 'curve'} onClick={() => setView('curve')}>Curve</button>
            </div>
            <label className="shop__sort">
              <span>Sort by</span>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="name-a">Name: A to Z</option>
                <option value="name-z">Name: Z to A</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      {view === 'curve' ? (
        <ArcCarousel products={products} title={category ? category.label : 'The whole curve'} />
      ) : (
        <section className="shop__grid-wrap" aria-label="Products">
          <div className="shop__grid">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
}
