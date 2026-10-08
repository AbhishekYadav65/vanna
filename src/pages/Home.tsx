import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as RPointerEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import productsData, { CATEGORIES, getCategorySlug, getImageUrl } from '../data/products';
import { CATEGORY_GROUNDS, getCutoutUrl, getGround } from '../data/visuals';
import ArcCarousel from '../components/ArcCarousel';
import ProductCard from '../components/ProductCard';
import Flower from '../components/Flower';
import './Home.css';

const HERO_SLUGS = [
  'dyson-airwrap-pouch-pink-gingham-ruffle',
  'makeup-pouch-cheetah',
  'makeup-pouch-pink-chess',
  'makeup-pouch-green-gingham-floral',
  'makeup-pouch-cherry-cream-ruffle',
  'dyson-airwrap-pouch-navy-quilted',
  'dyson-airwrap-pouch-polka-lace',
];

const ROWS = [
  'pouches with personality',
  'colours that clash on purpose',
  'handmade in coimbatore',
  'quilted, ruffled, zipped',
];

function MarqueeRow({ text, reverse, outline, speed }: { text: string; reverse?: boolean; outline?: boolean; speed: number }) {
  return (
    <div className={`hero__row ${outline ? 'is-outline' : 'is-fill'} ${reverse ? 'is-reverse' : ''}`} style={{ '--dur': `${speed}s` } as CSSProperties}>
      {[0, 1].map((c) => (
        <span key={c} className="hero__row-copy">{text}&nbsp;&nbsp;</span>
      ))}
    </div>
  );
}

function Starburst({ className }: { className: string }) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const r = i % 2 === 0 ? 48 : 34;
    const a = (i * Math.PI) / 8;
    pts.push(`${50 + r * Math.cos(a)},${50 + r * Math.sin(a)}`);
  }
  return (
    <svg className={`hero__sticker ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <polygon points={pts.join(' ')} fill="#FFD93D" stroke="#1E0B36" strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="50" cy="50" r="14" fill="#FF4F9A" stroke="#1E0B36" strokeWidth="3.5" />
    </svg>
  );
}

function Squiggle({ className }: { className: string }) {
  return (
    <svg className={`hero__sticker ${className}`} viewBox="0 0 160 50" aria-hidden="true">
      <path d="M6 30 Q 22 2 38 28 T 70 28 T 102 28 T 134 28 T 154 22" fill="none" stroke="#1E0B36" strokeWidth="12" strokeLinecap="round" />
      <path d="M6 30 Q 22 2 38 28 T 70 28 T 102 28 T 134 28 T 154 22" fill="none" stroke="#C9F23B" strokeWidth="5.5" strokeLinecap="round" />
    </svg>
  );
}

function Asterisk({ className }: { className: string }) {
  return (
    <svg className={`hero__sticker ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      {[0, 60, 120].map((a) => (
        <rect key={a} x="42" y="4" width="16" height="92" rx="8" fill="#FF7A29" stroke="#1E0B36" strokeWidth="3.5" transform={`rotate(${a} 50 50)`} />
      ))}
    </svg>
  );
}

function RingBadge() {
  return (
    <div className="hero__badge" aria-hidden="true">
      <svg viewBox="0 0 160 160" className="hero__badge-ring">
        <defs>
          <path id="ring" d="M80 80 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" />
        </defs>
        <circle cx="80" cy="80" r="76" fill="#FFF6EA" stroke="#1E0B36" strokeWidth="4" />
        <text fontFamily="var(--font-display)" fontWeight="900" fontSize="13.5" fill="#1E0B36">
          <textPath href="#ring">handmade in coimbatore, stitched with love, </textPath>
        </text>
      </svg>
      <Flower size={46} className="hero__badge-flower" />
    </div>
  );
}

export default function Home() {
  const all = productsData.products;
  const heroProducts = useMemo(
    () => HERO_SLUGS.map((s) => all.find((p) => p.slug === s)!).filter(Boolean),
    [all],
  );
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const hero = heroProducts[idx];
  const ground = getGround(hero.slug);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setIdx((i) => (i + 1) % heroProducts.length);
    }, 4800);
    return () => window.clearInterval(id);
  }, [paused, idx, heroProducts.length]);

  const onPointerMove = (e: RPointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || !heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    const s = heroRef.current.style;
    s.setProperty('--rx', `${(-py * 12).toFixed(2)}deg`);
    s.setProperty('--ry', `${(px * 16).toFixed(2)}deg`);
    s.setProperty('--px', px.toFixed(3));
    s.setProperty('--py', py.toFixed(3));
  };

  const cats = CATEGORIES.map((c) => {
    const items = all.filter((p) => getCategorySlug(p.category) === c.slug);
    return { ...c, count: items.length, from: Math.min(...items.map((p) => p.price)) };
  });
  const catHero: Record<string, string> = {
    'hair-tool-pouches': 'dyson-airwrap-pouch-pink-gingham-ruffle',
    'makeup-pouches': 'makeup-pouch-pink-chess',
    'napkin-small-pouches': 'napkin-pouch-pink-hearts',
  };
  const studio = all.filter((p) => !HERO_SLUGS.slice(0, 3).includes(p.slug)).slice(0, 6);
  const storyPhoto = all.find((p) => p.slug === 'dyson-airwrap-pouch-pink-stripe-ruffle')!.images[1];

  return (
    <div className="home">
      {/* ─── Hero: one sharp product in the middle of the noise ─── */}
      <section
        ref={heroRef}
        className="panel hero"
        style={{ '--g': ground.bg, '--gi': ground.ink } as CSSProperties}
        onPointerMove={onPointerMove}
      >
        <div className="hero__chaos" aria-hidden="true">
          <MarqueeRow text={ROWS[0]} outline speed={46} />
          <MarqueeRow text={ROWS[1]} reverse speed={58} />
          <MarqueeRow text={ROWS[2]} outline reverse speed={50} />
          <MarqueeRow text={ROWS[3]} speed={62} />
        </div>

        <div className="hero__stickers" aria-hidden="true">
          <Starburst className="hero__s1" />
          <Squiggle className="hero__s2" />
          <Asterisk className="hero__s3" />
          <span className="hero__tamil">வண்ணம் means colour</span>
          {[...Array(7)].map((_, i) => <i key={i} className={`hero__petal hero__petal--${i + 1}`} />)}
        </div>

        <div className="hero__stage">
          <div className="hero__halo" aria-hidden="true" />
          <div className="hero__tilt">
            <AnimatePresence mode="wait">
              <motion.div
                key={hero.slug}
                className="hero__product"
                initial={{ rotateY: -85, scale: 0.7, opacity: 0, y: 40 }}
                animate={{ rotateY: 0, scale: 1, opacity: 1, y: 0 }}
                exit={{ rotateY: 85, scale: 0.7, opacity: 0, y: -20, transition: { duration: 0.28 } }}
                transition={{ type: 'spring', stiffness: 170, damping: 17 }}
              >
                <Link to={`/product/${hero.slug}`} aria-label={`${hero.name}, ₹${hero.price}`} className="hero__product-link">
                  <img src={getCutoutUrl(hero.slug)} alt={hero.images[0].alt} className="hero__cut" draggable={false} />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
          <Link to={`/product/${hero.slug}`} className="hero__tag" tabIndex={-1} aria-hidden="true">
            <span className="hero__tag-price">₹{hero.price.toLocaleString('en-IN')}</span>
            <span className="hero__tag-name">{hero.name.split(' · ')[1] ?? hero.name}</span>
          </Link>
          <RingBadge />
        </div>

        <div className="hero__copy">
          <h1 className="hero__title">All things cute &amp; functional</h1>
          <p className="hero__sub">Hand-stitched quilted pouches from Coimbatore, in colours that clash on purpose.</p>
          <div className="hero__cta">
            <Link to="/shop" className="btn">Shop the colours</Link>
            <a href="#curve" className="btn btn--milk">Browse the curve</a>
          </div>
        </div>

        <div className="hero__dots" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)}>
          {heroProducts.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              className={`hero__dot ${i === idx ? 'is-on' : ''}`}
              aria-label={`Show ${p.name}`}
              aria-pressed={i === idx}
              onClick={() => setIdx(i)}
            />
          ))}
        </div>
      </section>

      {/* ─── 3D curve ─── */}
      <div id="curve">
        <ArcCarousel products={all} />
      </div>

      {/* ─── Colour trio ─── */}
      <section className="trio" aria-label="Shop by category">
        {cats.map((c) => {
          const g = CATEGORY_GROUNDS[c.slug];
          return (
            <Link
              key={c.slug}
              to={`/shop/${c.slug}`}
              className="panel trio__card ground"
              style={{ '--g': g.bg, '--gi': g.ink } as CSSProperties}
            >
              <h3 className="trio__title">{c.label}</h3>
              <p className="trio__meta">{c.count} {c.count === 1 ? 'pouch' : 'pouches'} from ₹{c.from.toLocaleString('en-IN')}</p>
              <img className="trio__cut" src={getCutoutUrl(catHero[c.slug])} alt="" loading="lazy" decoding="async" />
              <span className="trio__go btn btn--milk">Shop {c.label.toLowerCase()}</span>
            </Link>
          );
        })}
      </section>

      {/* ─── Story ─── */}
      <section className="panel story-tease" style={{ '--g': '#FF7A29', '--gi': '#1E0B36' } as CSSProperties}>
        <div className="story-tease__photo">
          <img src={getImageUrl(storyPhoto.file)} alt="A quilted Vannam pouch styled on a shelf" loading="lazy" />
        </div>
        <div className="story-tease__text">
          <h2>Sewn by hand in Coimbatore, one pouch at a time.</h2>
          <p>Every Vannam pouch blends delightful patterns with protective padding and smart compartments, so your Airwrap barrels, brushes and lipsticks travel safe.</p>
          <Link to="/story" className="btn">Read our story</Link>
        </div>
      </section>

      {/* ─── More from the studio ─── */}
      <section className="panel panel--milk studio">
        <div className="studio__head">
          <h2>More from the studio</h2>
          <Link to="/shop" className="btn">Shop everything</Link>
        </div>
        <div className="studio__grid">
          {studio.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
