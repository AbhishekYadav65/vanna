import { useRef } from 'react';
import type { CSSProperties, PointerEvent as RPointerEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { getImageUrl } from '../data/products';
import { getCutoutUrl, getGround } from '../data/visuals';
import { useStore } from '../store/useStore';
import { usePressPreview } from '../lib/usePressPreview';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const { addToBag } = useStore();
  const press = usePressPreview(product);
  const ground = getGround(product.slug);
  const ref = useRef<HTMLElement>(null);
  const lifestyle = product.images[1];
  const tilt = ((product.id % 5) - 2) * 1.6;

  const track = (e: RPointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const s = ref.current.style;
    s.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
    s.setProperty('--my', `${(py * 100).toFixed(1)}%`);
    s.setProperty('--rx', `${((0.5 - py) * 9).toFixed(2)}deg`);
    s.setProperty('--ry', `${((px - 0.5) * 11).toFixed(2)}deg`);
  };

  const reset = () => {
    const s = ref.current?.style;
    if (!s) return;
    s.setProperty('--rx', '0deg');
    s.setProperty('--ry', '0deg');
  };

  return (
    <article
      ref={ref}
      className={`pcard ${className}`}
      style={{ '--g': ground.bg, '--gi': ground.ink, '--tilt': `${tilt}deg` } as CSSProperties}
      onPointerEnter={track}
      onPointerMove={track}
      onPointerLeave={reset}
    >
      <Link
        to={`/product/${product.slug}`}
        className="pcard__link"
        aria-label={`${product.name}, ₹${product.price}`}
        onPointerDown={press.onPointerDown}
        onContextMenu={press.onContextMenu}
        onClickCapture={press.onClickCapture}
        onDragStart={press.onDragStart}
      >
        <div className="pcard__tilt">
          <div className="pcard__stage ground">
            <img
              className="pcard__cut"
              src={getCutoutUrl(product.slug)}
              alt={product.images[0].alt}
              loading="lazy"
              decoding="async"
              draggable={false}
            />
            {lifestyle && (
              <img
                className="pcard__life"
                src={getImageUrl(lifestyle.file)}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            )}
            {product.discountPercent > 0 && <span className="pcard__off">-{product.discountPercent}%</span>}
          </div>
          <div className="pcard__meta">
            <h3 className="pcard__name">{product.name}</h3>
            <p className="pcard__price">
              <span>₹{product.price.toLocaleString('en-IN')}</span>
              {product.mrp > product.price && <s>₹{product.mrp.toLocaleString('en-IN')}</s>}
            </p>
          </div>
        </div>
      </Link>
      <button
        type="button"
        className="pcard__add"
        aria-label={`Add ${product.name} to bag`}
        onClick={(e) => addToBag(product, { origin: e.currentTarget })}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
        <span>Add</span>
      </button>
    </article>
  );
}
