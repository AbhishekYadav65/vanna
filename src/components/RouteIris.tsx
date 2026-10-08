import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './RouteIris.css';

const COLORS = ['#2D3BFF', '#FF4F9A', '#C9F23B', '#FF7A29', '#7B3FF2', '#FFD93D'];

/** Page transition: a colour circle closes in on the bloom button. */
export default function RouteIris() {
  const { pathname } = useLocation();
  const prev = useRef(pathname);
  const ref = useRef<HTMLDivElement>(null);
  const n = useRef(0);

  useEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight - 50;
    const t = document.querySelector<HTMLElement>('[data-bag-target]');
    if (t) {
      const r = t.getBoundingClientRect();
      x = r.left + r.width / 2;
      y = r.top + r.height / 2;
    }
    el.style.background = COLORS[n.current++ % COLORS.length];
    el.style.display = 'block';
    const a = el.animate(
      [
        { clipPath: `circle(150% at ${x}px ${y}px)` },
        { clipPath: `circle(150% at ${x}px ${y}px)`, offset: 0.22 },
        { clipPath: `circle(0% at ${x}px ${y}px)` },
      ],
      { duration: 820, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' },
    );
    a.onfinish = () => { el.style.display = 'none'; };
    return () => a.cancel();
  }, [pathname]);

  return <div ref={ref} className="iris" aria-hidden="true" />;
}
