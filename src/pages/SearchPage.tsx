import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import productsData from '../data/products';
import { POPULAR_SEARCHES, searchProducts } from '../lib/search';
import './SearchPage.css';

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = (params.get('q') ?? '').trim();
  const [draft, setDraft] = useState(q);

  useEffect(() => { setDraft(q); }, [q]);

  const { results, partial } = useMemo(() => searchProducts(q), [q]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = draft.trim();
    setParams(next ? { q: next } : {});
  };

  return (
    <div className="spage">
      <section className="panel spage__head">
        <div className="spage__inner">
          <h1 className="spage__title">
            {q ? (results.length ? `${results.length} ${results.length === 1 ? 'pouch' : 'pouches'} for “${q}”` : `Nothing for “${q}”`) : 'Search the shop'}
          </h1>
          {partial && q && <p className="spage__note">No pouch matches every word, so these are the closest.</p>}
          <form className="spage__form" onSubmit={submit} role="search">
            <input
              className="spage__input"
              type="search"
              enterKeyHint="search"
              placeholder="Search gingham, cherry, airwrap…"
              aria-label="Search products"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
            />
            <button type="submit" className="btn">Search</button>
          </form>
          <div className="spage__chips">
            {POPULAR_SEARCHES.map((t) => (
              <Link key={t} to={`/search?q=${encodeURIComponent(t)}`} className={`chip ${t.toLowerCase() === q.toLowerCase() ? 'is-active' : ''}`}>{t}</Link>
            ))}
          </div>
        </div>
      </section>

      <section className="spage__results">
        {results.length > 0 ? (
          <div className="spage__grid">
            {results.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="panel panel--milk spage__empty">
            <h2>{q ? 'Try another word' : 'What are you looking for?'}</h2>
            <p>{q ? 'Search by pattern, colour or what it holds: gingham, cherry, Airwrap, makeup.' : 'Type a pattern, a colour or what it should hold.'}</p>
            <Link to="/shop" className="btn">Browse all {productsData.products.length} pouches</Link>
          </div>
        )}
      </section>
    </div>
  );
}
