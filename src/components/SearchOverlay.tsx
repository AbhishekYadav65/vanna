import { useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { getImageUrl } from '../data/products';
import { getCutoutUrl, getGround } from '../data/visuals';
import { POPULAR_SEARCHES, searchProducts } from '../lib/search';
import './SearchOverlay.css';

export default function SearchOverlay() {
  const { search, searchDispatch } = useStore();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [cursor, setCursor] = useState(-1);

  const { results, partial } = useMemo(() => searchProducts(search.query), [search.query]);
  const suggestions = results.slice(0, 5);
  const trimmed = search.query.trim();

  useEffect(() => {
    if (search.isOpen) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 120);
      document.body.style.overflow = 'hidden';
      return () => { window.clearTimeout(t); document.body.style.overflow = ''; };
    }
    document.body.style.overflow = '';
  }, [search.isOpen]);

  useEffect(() => { setCursor(-1); }, [search.query]);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape' && search.isOpen) searchDispatch({ type: 'CLOSE_SEARCH' });
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchDispatch({ type: search.isOpen ? 'CLOSE_SEARCH' : 'OPEN_SEARCH' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [search.isOpen, searchDispatch]);

  const close = () => searchDispatch({ type: 'CLOSE_SEARCH' });

  /** Enter: open the highlighted suggestion, or the full results page. */
  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!trimmed) return;
    if (cursor >= 0 && suggestions[cursor]) {
      const slug = suggestions[cursor].slug;
      close();
      navigate(`/product/${slug}`);
      return;
    }
    close();
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, -1));
    }
  };

  return (
    <AnimatePresence>
      {search.isOpen && (
        <motion.div
          className="search"
          role="dialog"
          aria-modal="true"
          aria-label="Search pouches"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className="search__backdrop" onClick={close} />
          <motion.div
            className="search__sheet"
            initial={{ y: -40, opacity: 0, rotate: -1 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          >
            <form className="search__form" onSubmit={submit} role="search">
              <svg className="search__icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" aria-hidden="true">
                <circle cx="11" cy="11" r="7.5" /><path d="M21 21l-4.6-4.6" />
              </svg>
              <input
                ref={inputRef}
                className="search__input"
                type="text"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                spellCheck={false}
                placeholder="Search gingham, cherry, airwrap…"
                aria-label="Search products"
                value={search.query}
                onChange={(e) => searchDispatch({ type: 'SET_QUERY', query: e.target.value })}
                onKeyDown={onKeyDown}
              />
              <button type="submit" className="btn search__go" disabled={!trimmed}>Search</button>
              <button type="button" className="search__close" onClick={close} aria-label="Close search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </form>

            <div className="search__body">
              {!trimmed && (
                <div className="search__popular">
                  <p className="search__label">Try one of these</p>
                  <div className="search__chips">
                    {POPULAR_SEARCHES.map((t) => (
                      <button key={t} type="button" className="chip" onClick={() => searchDispatch({ type: 'SET_QUERY', query: t })}>{t}</button>
                    ))}
                  </div>
                </div>
              )}

              {trimmed && suggestions.length > 0 && (
                <>
                  <p className="search__label" aria-live="polite">
                    {partial ? `No exact match. Closest pouches for “${trimmed}”` : `${results.length} ${results.length === 1 ? 'pouch' : 'pouches'} for “${trimmed}”`}
                  </p>
                  <ul className="search__list" role="listbox" aria-label="Suggestions">
                    {suggestions.map((p, i) => {
                      const g = getGround(p.slug);
                      return (
                        <li key={p.id} role="option" aria-selected={i === cursor}>
                          <Link
                            to={`/product/${p.slug}`}
                            className={`search__item ${i === cursor ? 'is-cursor' : ''}`}
                            onClick={close}
                            onMouseEnter={() => setCursor(i)}
                          >
                            <span className="search__thumb ground" style={{ '--g': g.bg } as React.CSSProperties}>
                              <img src={getCutoutUrl(p.slug)} alt="" loading="lazy" />
                            </span>
                            <span className="search__item-text">
                              <span className="search__item-name">{p.name}</span>
                              <span className="search__item-sub">{p.category}</span>
                            </span>
                            <span className="search__item-price">₹{p.price.toLocaleString('en-IN')}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                  <button type="button" className="btn search__all" onClick={() => submit()}>
                    See all {results.length} {results.length === 1 ? 'result' : 'results'}
                  </button>
                </>
              )}

              {trimmed && suggestions.length === 0 && (
                <div className="search__empty">
                  <img src={getImageUrl('images/makeup-pouch-polka-ruffle__795__895.jpg')} alt="" className="search__empty-img" />
                  <p className="search__empty-title">Nothing matches “{trimmed}”</p>
                  <p className="search__empty-hint">Try a pattern or a colour instead.</p>
                  <div className="search__chips">
                    {POPULAR_SEARCHES.slice(0, 5).map((t) => (
                      <button key={t} type="button" className="chip" onClick={() => searchDispatch({ type: 'SET_QUERY', query: t })}>{t}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
