import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent as RPointerEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import productsData, { getCategorySlug, getImageUrl } from '../data/products';
import { getCutoutUrl, getGround } from '../data/visuals';
import { useStore } from '../store/useStore';
import ProductCard from '../components/ProductCard';
import Photo from '../components/Photo';
import './ProductPage.css';

type Slide = { kind: 'cut' } | { kind: 'photo'; file: string; alt: string };

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToBag, wishlistDispatch, isWished } = useStore();
  const product = productsData.products.find((p) => p.slug === slug);

  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const stageRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setActive(0); setQty(1); }, [slug]);

  const slides = useMemo<Slide[]>(() => {
    if (!product) return [];
    const photos = product.images.slice(1).map((i) => ({ kind: 'photo' as const, file: i.file, alt: i.alt }));
    return [{ kind: 'cut' }, ...photos, { kind: 'photo', file: product.images[0].file, alt: product.images[0].alt }];
  }, [product]);

  const related = useMemo(() => {
    if (!product) return [];
    const others = productsData.products.filter((p) => p.id !== product.id);
    const same = others.filter((p) => p.category === product.category);
    const rest = others.filter((p) => p.category !== product.category);
    return [...same, ...rest].slice(0, 9);
  }, [product]);

  if (!product) {
    return (
      <section className="panel panel--milk pp-missing">
        <h1>We couldn&apos;t find that pouch</h1>
        <Link to="/shop" className="btn">Back to the shop</Link>
      </section>
    );
  }

  const ground = getGround(product.slug);
  const wished = isWished(product.id);
  const slide = slides[active] ?? slides[0];
  const catSlug = getCategorySlug(product.category);

  const tilt = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    stageRef.current.style.setProperty('--rx', `${(-py * 10).toFixed(2)}deg`);
    stageRef.current.style.setProperty('--ry', `${(px * 14).toFixed(2)}deg`);
  };
  const untilt = () => {
    stageRef.current?.style.setProperty('--rx', '0deg');
    stageRef.current?.style.setProperty('--ry', '0deg');
  };

  const scrollRail = (dir: number) => {
    const el = railRef.current;
    if (el) el.scrollBy({ left: dir * Math.max(260, el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <div className="pp">
      <div className="pp__top">
        {/* ─── Gallery ─── */}
        <section className="panel pp__gallery ground" style={{ '--g': ground.bg, '--gi': ground.ink } as CSSProperties}>
          <nav className="pp__crumbs" aria-label="Breadcrumb">
            <Link to="/shop">Shop</Link>
            <span aria-hidden="true">/</span>
            <Link to={`/shop/${catSlug}`}>{product.category}</Link>
          </nav>

          <div className="pp__stage-wrap" onPointerMove={tilt} onPointerLeave={untilt}>
            <div
              ref={stageRef}
              className="pp__stage"
              style={slide.kind === 'photo' ? ({ '--bg': `url("${getImageUrl(slide.file)}")` } as CSSProperties) : undefined}
              data-kind={slide.kind}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="pp__slide"
                  initial={{ opacity: 0, rotateY: -22, scale: 0.96 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: 22, scale: 0.96, transition: { duration: 0.18 } }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                >
                  {slide.kind === 'cut' ? (
                    <img className="pp__cut" src={getCutoutUrl(product.slug)} alt={product.images[0].alt} draggable={false} />
                  ) : (
                    <img className="pp__photo" src={getImageUrl(slide.file)} alt={slide.alt} draggable={false} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="pp__thumbs" role="tablist" aria-label="Product photos">
            {slides.map((s, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={s.kind === 'cut' ? 'Colour view' : `Photo ${i}`}
                className={`pp__thumb ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                {s.kind === 'cut' ? (
                  <span className="pp__thumb-cut ground" style={{ '--g': ground.bg } as CSSProperties}>
                    <img src={getCutoutUrl(product.slug)} alt="" />
                  </span>
                ) : (
                  <img src={getImageUrl(s.file)} alt="" loading="lazy" />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* ─── Info ─── */}
        <section className="panel panel--milk pp__info">
          <div className="pp__info-inner">
            <h1 className="pp__title">{product.name.split(' · ').map((part, i) => <span key={i} className="pp__title-line">{part}</span>)}</h1>
            <p className="pp__price">
              <span>₹{product.price.toLocaleString('en-IN')}</span>
              {product.mrp > product.price && (
                <>
                  <s>₹{product.mrp.toLocaleString('en-IN')}</s>
                  <b className="pp__off">{product.discountPercent}% off</b>
                </>
              )}
            </p>
            <p className="pp__desc">{product.description}</p>

            <div className="pp__tags">
              {product.tags.map((t) => <span key={t} className="pp__tag">{t}</span>)}
            </div>

            <div className="pp__buy">
              <div className="pp__qty" role="group" aria-label="Quantity">
                <button type="button" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                <span aria-live="polite">{qty}</span>
                <button type="button" aria-label="Increase quantity" onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <button type="button" className="btn pp__add" onClick={(e) => addToBag(product, { quantity: qty, origin: e.currentTarget })}>
                Add to bag
              </button>
              <button
                type="button"
                className={`pp__wish ${wished ? 'is-on' : ''}`}
                aria-pressed={wished}
                aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                onClick={() => wishlistDispatch({ type: 'TOGGLE_WISH', productId: product.id })}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill={wished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" aria-hidden="true">
                  <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.7 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
                </svg>
              </button>
            </div>

            <a href="https://www.instagram.com/vannam.ig" target="_blank" rel="noopener noreferrer" className="btn btn--ghost pp__dm">
              DM to order on Instagram
            </a>

            <div className="pp__facts">
              <div>
                <h2>Highlights</h2>
                <ul>{product.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
              </div>
              <div>
                <h2>Fabric &amp; care</h2>
                <p>{product.fabric}</p>
              </div>
              {Object.keys(product.details).length > 0 && (
                <div>
                  <h2>Details</h2>
                  <ul>
                    {Object.entries(product.details).map(([k, v]) => (
                      <li key={k}><strong>{k.charAt(0).toUpperCase() + k.slice(1)}:</strong> {v}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* ─── Detail shots: one fixed frame shape ─── */}
      <section className="panel pp__shots" aria-label="Detail photos">
        <h2 className="pp__shots-title">Up close</h2>
        <div className="pp__shots-grid">
          {product.images.slice(1).map((img, i) => (
            <motion.div
              key={img.file}
              className="pp__shot"
              initial={{ opacity: 0, rotateX: 16, y: 40 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ type: 'spring', stiffness: 120, damping: 20, delay: i * 0.08 }}
            >
              <Photo src={getImageUrl(img.file)} alt={img.alt} ratio={1} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── More to love ─── */}
      <section className="panel pp__more" style={{ '--g': ground.bg } as CSSProperties} aria-label="More pouches">
        <div className="pp__more-head">
          <h2>You might also love</h2>
          <div className="pp__more-nav">
            <button type="button" aria-label="Scroll left" onClick={() => scrollRail(-1)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
            </button>
            <button type="button" aria-label="Scroll right" onClick={() => scrollRail(1)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
        </div>
        <div className="pp__rail" ref={railRef}>
          {related.map((p) => (
            <div className="pp__rail-item" key={p.id}><ProductCard product={p} /></div>
          ))}
        </div>
      </section>
    </div>
  );
}
