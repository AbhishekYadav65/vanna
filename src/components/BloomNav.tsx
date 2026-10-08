import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Flower from './Flower';
import { useStore } from '../store/useStore';
import './BloomNav.css';

interface PetalDef {
  key: string;
  label: string;
  to?: string;
  action?: 'search' | 'bag';
  bg: string;
  fg: string;
  shape: string;
}

const PETALS: PetalDef[] = [
  { key: 'shop', label: 'Shop', to: '/shop', bg: 'var(--hotpink)', fg: 'var(--ink)', shape: '58% 42% 55% 45% / 50% 55% 45% 50%' },
  { key: 'search', label: 'Search', action: 'search', bg: 'var(--butter)', fg: 'var(--ink)', shape: '45% 55% 50% 50% / 55% 45% 55% 45%' },
  { key: 'bag', label: 'Bag', action: 'bag', bg: 'var(--cobalt)', fg: 'var(--milk)', shape: '52% 48% 42% 58% / 48% 52% 48% 52%' },
  { key: 'story', label: 'Story', to: '/story', bg: 'var(--lime)', fg: 'var(--ink)', shape: '50% 50% 58% 42% / 45% 55% 45% 55%' },
  { key: 'about', label: 'About', to: '/about', bg: 'var(--tangerine)', fg: 'var(--ink)', shape: '42% 58% 50% 50% / 55% 45% 55% 45%' },
  { key: 'contact', label: 'Contact', to: '/contact', bg: 'var(--lilac)', fg: 'var(--ink)', shape: '55% 45% 45% 55% / 50% 50% 50% 50%' },
];

function useRadius() {
  const [wide, setWide] = useState(() => (typeof window === 'undefined' ? false : window.matchMedia('(min-width: 720px)').matches));
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 720px)');
    const on = () => setWide(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return wide ? { radius: 176, chip: 80 } : { radius: 132, chip: 64 };
}

/**
 * The navigation stunt: a single bloom at the bottom of the screen.
 * Tap it and the petals fan out as the destinations.
 */
export default function BloomNav() {
  const [open, setOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const { cartCount, cartDispatch, searchDispatch } = useStore();
  const { pathname } = useLocation();
  const { radius, chip } = useRadius();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstPetal = useRef<HTMLElement | null>(null);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    const onBump = () => {
      setBump(true);
      window.setTimeout(() => setBump(false), 650);
    };
    window.addEventListener('vannam:bag-bump', onBump);
    return () => window.removeEventListener('vannam:bag-bump', onBump);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    const t = window.setTimeout(() => firstPetal.current?.focus(), 220);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(t);
    };
  }, [open]);

  const count = PETALS.length;
  const start = 196;
  const end = 344;

  const run = (p: PetalDef) => {
    setOpen(false);
    if (p.action === 'search') searchDispatch({ type: 'OPEN_SEARCH' });
    if (p.action === 'bag') cartDispatch({ type: 'OPEN' });
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            className="bloom-scrim"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
      </AnimatePresence>

      <div className="bloom" style={{ '--chip': `${chip}px` } as React.CSSProperties}>
        <AnimatePresence>
          {open && (
            <ul className="bloom__petals" aria-label="Site menu">
              {PETALS.map((p, i) => {
                const a = ((start + (i * (end - start)) / (count - 1)) * Math.PI) / 180;
                const x = Math.cos(a) * radius;
                const y = Math.sin(a) * radius;
                const content = (
                  <>
                    <span className="bloom__label">{p.label}</span>
                    {p.action === 'bag' && cartCount > 0 && <span className="bloom__chip-count">{cartCount}</span>}
                  </>
                );
                const style = { background: p.bg, color: p.fg, borderRadius: p.shape } as React.CSSProperties;
                return (
                  <motion.li
                    key={p.key}
                    className="bloom__petal"
                    initial={{ x: 0, y: 0, scale: 0.2, opacity: 0, rotate: -120 }}
                    animate={{ x, y, scale: 1, opacity: 1, rotate: 0 }}
                    exit={{ x: 0, y: 0, scale: 0.2, opacity: 0, rotate: 90, transition: { duration: 0.2, delay: (count - i) * 0.015 } }}
                    transition={{ type: 'spring', stiffness: 380, damping: 20, delay: i * 0.04 }}
                  >
                    {p.to ? (
                      <Link
                        to={p.to}
                        style={style}
                        className="bloom__link"
                        ref={i === 0 ? (el) => { firstPetal.current = el; } : undefined}
                        onClick={() => run(p)}
                      >
                        {content}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        style={style}
                        className="bloom__link"
                        ref={i === 0 ? (el) => { firstPetal.current = el; } : undefined}
                        onClick={() => run(p)}
                      >
                        {content}
                      </button>
                    )}
                  </motion.li>
                );
              })}
            </ul>
          )}
        </AnimatePresence>

        <button
          ref={toggleRef}
          type="button"
          data-bag-target
          className={`bloom__toggle ${open ? 'is-open' : ''} ${bump ? 'is-bump' : ''}`}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : `Open menu, ${cartCount} items in bag`}
          onClick={() => setOpen((v) => !v)}
        >
          <Flower size={40} spin={!open} className="bloom__flower" />
          <span className="bloom__toggle-text">{open ? 'Close' : 'Menu'}</span>
          {cartCount > 0 && (
            <motion.span
              className="bloom__count"
              key={cartCount}
              initial={{ scale: 0.4 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 14 }}
            >
              {cartCount}
            </motion.span>
          )}
        </button>
      </div>
    </>
  );
}
