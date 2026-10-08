import { useCallback, useEffect, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent as RMouseEvent, KeyboardEvent as RKeyboardEvent, PointerEvent as RPointerEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../data/products';
import { getCutoutUrl, getGround } from '../data/visuals';
import { useStore } from '../store/useStore';
import { usePressPreview } from '../lib/usePressPreview';
import './ArcCarousel.css';

const VISIBLE = 3.15; // how many cards either side of centre are drawn

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const wrap = (d: number, n: number) => {
  let r = ((d % n) + n) % n;
  if (r > n / 2) r -= n;
  return r;
};

interface ItemProps {
  product: Product;
  index: number;
  active: boolean;
  setRef: (i: number, el: HTMLDivElement | null) => void;
  onItemClick: (e: RMouseEvent<HTMLElement>, i: number) => void;
}

function ArcItem({ product, index, active, setRef, onItemClick }: ItemProps) {
  const press = usePressPreview(product);
  const ground = getGround(product.slug);
  return (
    <div className="arc__item" ref={(el) => setRef(index, el)} style={{ '--g': ground.bg, '--gi': ground.ink } as CSSProperties}>
      <Link
        to={`/product/${product.slug}`}
        className="arc__card"
        aria-label={product.name}
        tabIndex={active ? 0 : -1}
        draggable={false}
        onPointerDown={press.onPointerDown}
        onContextMenu={press.onContextMenu}
        onDragStart={press.onDragStart}
        onClickCapture={(e) => {
          press.onClickCapture(e);
          if (!e.isDefaultPrevented()) onItemClick(e, index);
        }}
      >
        <span className="arc__bg ground" />
        <img className="arc__cut" src={getCutoutUrl(product.slug)} alt="" draggable={false} loading="lazy" decoding="async" />
      </Link>
    </div>
  );
}

interface ArcCarouselProps {
  products: Product[];
  title?: string;
  hint?: string;
}

/**
 * A 3D curved carousel: cards ride a U-shaped arc, tilt toward the viewer and
 * glide on drag, swipe, sideways scroll, arrow keys or the buttons.
 */
export default function ArcCarousel({ products, title = 'Browse the curve', hint = 'Drag, swipe or scroll sideways' }: ArcCarouselProps) {
  const n = products.length;
  const { addToBag } = useStore();
  const rootRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posRef = useRef(0);
  const targetRef = useRef(0);
  const activeRef = useRef(0);
  const rafRef = useRef(0);
  const lastT = useRef(0);
  const visibleRef = useRef(true);
  const hoverRef = useRef(false);
  const lastInteract = useRef(0);
  const blockClick = useRef(false);
  const geo = useRef({ w: 0, h: 0, itemW: 0, itemH: 0, spacing: 0, k: 0, cx: 0, cy: 0 });
  const drag = useRef({ active: false, startX: 0, startPos: 0, lastX: 0, lastT: 0, vel: 0, moved: 0 });
  const [active, setActive] = useState(0);

  const setRef = useCallback((i: number, el: HTMLDivElement | null) => { itemRefs.current[i] = el; }, []);

  const layout = useCallback(() => {
    const g = geo.current;
    if (!g.w) return;
    const pos = posRef.current;
    for (let i = 0; i < n; i++) {
      const el = itemRefs.current[i];
      if (!el) continue;
      const d = wrap(i - pos, n);
      const ad = Math.abs(d);
      if (ad > VISIBLE) {
        el.style.visibility = 'hidden';
        continue;
      }
      el.style.visibility = 'visible';
      const x = g.cx + d * g.spacing - g.itemW / 2;
      const y = g.cy - g.k * d * d - g.itemH / 2;
      const z = -Math.pow(ad, 1.25) * g.itemW * 0.3;
      const rotY = clamp(-d * 17, -46, 46);
      const slope = (Math.atan((-2 * g.k * d) / g.spacing) * 180) / Math.PI;
      const rotZ = clamp(slope * 0.55, -22, 22);
      const focus = Math.max(0, 1 - ad);
      const s = 1 + focus * 0.12 - Math.min(ad, 3) * 0.045;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) rotateZ(${rotZ.toFixed(2)}deg) scale(${s.toFixed(3)})`;
      el.style.zIndex = String(100 - Math.round(ad * 10));
      el.style.setProperty('--shade', Math.min(ad * 0.2, 0.64).toFixed(3));
      el.style.setProperty('--focus', focus.toFixed(3));
      el.style.opacity = ad > VISIBLE - 0.6 ? String(Math.max(0, (VISIBLE - ad) / 0.6).toFixed(3)) : '1';
    }
    const idx = ((Math.round(pos) % n) + n) % n;
    if (idx !== activeRef.current) {
      activeRef.current = idx;
      setActive(idx);
    }
  }, [n]);

  const tick = useCallback((now: number) => {
    rafRef.current = 0;
    const dt = Math.min(0.05, (now - lastT.current) / 1000 || 0.016);
    lastT.current = now;
    if (!drag.current.active) {
      const diff = targetRef.current - posRef.current;
      if (Math.abs(diff) < 0.0008) {
        posRef.current = targetRef.current;
        layout();
        return;
      }
      posRef.current += diff * (1 - Math.exp(-dt * 8));
    }
    layout();
    rafRef.current = requestAnimationFrame(tick);
  }, [layout]);

  const kick = useCallback(() => {
    if (rafRef.current) return;
    lastT.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const go = useCallback((delta: number) => {
    lastInteract.current = performance.now();
    targetRef.current = Math.round(targetRef.current) + delta;
    kick();
  }, [kick]);

  /* measure + responsive geometry */
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const measure = () => {
      const w = vp.clientWidth;
      const itemW = clamp(w * (w < 640 ? 0.54 : w < 1000 ? 0.3 : 0.22), 150, 330);
      const itemH = itemW * 1.25;
      const spacing = itemW * 0.86;
      const k = itemH * (w < 640 ? 0.12 : 0.085);
      const dv = Math.min(2.6, w / 2 / spacing + 0.6); // how far along the arc the screen actually reaches
      const h = Math.round(itemH + k * dv * dv + (w < 640 ? 30 : 56));
      geo.current = { w, h, itemW, itemH, spacing, k, cx: w / 2, cy: h - itemH / 2 - 20 };
      vp.style.height = `${h}px`;
      itemRefs.current.forEach((el) => {
        if (!el) return;
        el.style.width = `${itemW}px`;
        el.style.height = `${itemH}px`;
      });
      layout();
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(vp);
    return () => ro.disconnect();
  }, [layout, n]);

  /* reset when the list changes (e.g. a new category) */
  useEffect(() => {
    posRef.current = 0;
    targetRef.current = 0;
    activeRef.current = 0;
    setActive(0);
    layout();
  }, [products, layout]);

  /* pause drawing when off-screen */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
      if (entry.isIntersecting) kick();
    }, { threshold: 0.05 });
    io.observe(root);
    return () => io.disconnect();
  }, [kick]);

  /* gentle auto-advance until the person touches it */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => {
      if (hoverRef.current || !visibleRef.current || drag.current.active) return;
      if (performance.now() - lastInteract.current < 5000) return;
      targetRef.current = Math.round(targetRef.current) + 1;
      kick();
    }, 3200);
    return () => window.clearInterval(id);
  }, [kick]);

  /* sideways wheel / trackpad: smooth, then snaps */
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    let snap: number | undefined;
    const onWheel = (e: WheelEvent) => {
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
      if (!horizontal) return; // plain vertical scroll keeps scrolling the page
      e.preventDefault();
      const dx = Math.abs(e.deltaX) > 0 ? e.deltaX : e.deltaY;
      lastInteract.current = performance.now();
      targetRef.current += dx / (geo.current.spacing * 1.15);
      kick();
      window.clearTimeout(snap);
      snap = window.setTimeout(() => {
        targetRef.current = Math.round(targetRef.current);
        kick();
      }, 140);
    };
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      vp.removeEventListener('wheel', onWheel);
      window.clearTimeout(snap);
    };
  }, [kick]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  /* drag / swipe */
  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    lastInteract.current = performance.now();
    const d = drag.current;
    d.active = true;
    d.startX = e.clientX;
    d.lastX = e.clientX;
    d.lastT = performance.now();
    d.startPos = posRef.current;
    d.vel = 0;
    d.moved = 0;
    blockClick.current = false;

    const move = (ev: PointerEvent) => {
      const now = performance.now();
      const dx = ev.clientX - d.startX;
      d.moved = Math.max(d.moved, Math.abs(dx));
      if (d.moved > 6) blockClick.current = true;
      const dtSec = Math.max(0.008, (now - d.lastT) / 1000);
      const inst = -(ev.clientX - d.lastX) / geo.current.spacing / dtSec;
      d.vel = d.vel * 0.7 + inst * 0.3;
      d.lastX = ev.clientX;
      d.lastT = now;
      posRef.current = d.startPos - dx / geo.current.spacing;
      targetRef.current = posRef.current;
      kick();
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      d.active = false;
      if (d.moved > 6) {
        const base = posRef.current;
        targetRef.current = clamp(Math.round(base + d.vel * 0.28), Math.round(base) - 3, Math.round(base) + 3);
        window.setTimeout(() => { blockClick.current = false; }, 60);
      }
      lastInteract.current = performance.now();
      kick();
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  const onItemClick = (e: RMouseEvent<HTMLElement>, i: number) => {
    if (blockClick.current) {
      e.preventDefault();
      return;
    }
    const offset = wrap(i - Math.round(targetRef.current), n);
    if (offset !== 0) {
      e.preventDefault(); // side cards slide to the centre first, centre card opens
      go(offset);
    }
  };

  const onKeyDown = (e: RKeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  };

  if (n === 0) return null;
  const current = products[active] ?? products[0];
  const ground = getGround(current.slug);

  return (
    <section
      ref={rootRef}
      className="panel arc"
      style={{ '--glow': ground.bg } as CSSProperties}
      aria-roledescription="carousel"
      aria-label={title}
      onKeyDown={onKeyDown}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') hoverRef.current = true; }}
      onPointerLeave={() => { hoverRef.current = false; }}
    >
      <div className="arc__head">
        <h2 className="arc__title">{title}</h2>
        <p className="arc__hint">{hint}</p>
      </div>

      <div className="arc__viewport" ref={viewportRef} onPointerDown={onPointerDown}>
        <div className="arc__stage">
          {products.map((p, i) => (
            <ArcItem key={p.id} product={p} index={i} active={i === active} setRef={setRef} onItemClick={onItemClick} />
          ))}
        </div>
      </div>

      <div className="arc__dock">
        <button type="button" className="arc__nav" aria-label="Previous pouch" onClick={() => go(-1)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
        </button>
        <div className="arc__info" aria-live="polite">
          <h3 className="arc__name">{current.name}</h3>
          <p className="arc__price">
            <span>₹{current.price.toLocaleString('en-IN')}</span>
            {current.mrp > current.price && <s>₹{current.mrp.toLocaleString('en-IN')}</s>}
          </p>
          <div className="arc__actions">
            <Link to={`/product/${current.slug}`} className="btn btn--milk">View pouch</Link>
            <button type="button" className="btn" onClick={(e) => addToBag(current, { origin: e.currentTarget })}>Add to bag</button>
          </div>
        </div>
        <button type="button" className="arc__nav" aria-label="Next pouch" onClick={() => go(1)}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
    </section>
  );
}
