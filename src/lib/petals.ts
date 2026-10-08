import { PETAL_COLORS } from '../data/visuals';

let layer: HTMLDivElement | null = null;

function getLayer(): HTMLDivElement {
  if (layer && document.body.contains(layer)) return layer;
  layer = document.createElement('div');
  layer.className = 'petal-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);
  return layer;
}

export function bumpBag() {
  window.dispatchEvent(new CustomEvent('vannam:bag-bump'));
}

/** Petals pop out of `origin`, then flutter into the bloom button. */
export function burstPetals(origin: { x: number; y: number }, count = 18) {
  if (typeof window === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bumpBag();
    return;
  }

  let tx = window.innerWidth / 2;
  let ty = window.innerHeight - 50;
  const target = document.querySelector<HTMLElement>('[data-bag-target]');
  if (target) {
    const r = target.getBoundingClientRect();
    tx = r.left + r.width / 2;
    ty = r.top + r.height / 2;
  }

  const host = getLayer();
  let finished = 0;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('i');
    el.className = 'petal';
    const size = 12 + Math.random() * 14;
    el.style.width = `${size}px`;
    el.style.height = `${size * 1.35}px`;
    el.style.background = PETAL_COLORS[i % PETAL_COLORS.length];
    host.appendChild(el);

    const ang = Math.random() * Math.PI * 2;
    const dist = 55 + Math.random() * 120;
    const bx = origin.x + Math.cos(ang) * dist;
    const by = origin.y + Math.sin(ang) * dist - 36;
    const rot = Math.random() * 720 - 360;
    const dur = 1050 + Math.random() * 550;
    const place = (x: number, y: number, s: number, r: number, o: number) => ({
      transform: `translate(${x}px, ${y}px) translate(-50%, -50%) scale(${s}) rotate(${r}deg)`,
      opacity: o,
    });

    const anim = el.animate(
      [
        { ...place(origin.x, origin.y, 0.2, 0, 0), easing: 'cubic-bezier(.16,.9,.3,1)' },
        { ...place(bx, by, 1, rot * 0.4, 1), offset: 0.3, easing: 'cubic-bezier(.55,.05,.75,.35)' },
        place(tx, ty, 0.25, rot, 0.9),
      ],
      { duration: dur, fill: 'forwards' },
    );
    anim.onfinish = () => {
      el.remove();
      finished += 1;
      if (finished === count) bumpBag();
    };
  }
}

/** Burst from the centre of a DOM element (e.g. the button that was clicked). */
export function burstFromElement(el: Element | null, count?: number) {
  if (!el) return burstPetals({ x: window.innerWidth / 2, y: window.innerHeight / 2 }, count);
  const r = el.getBoundingClientRect();
  burstPetals({ x: r.left + r.width / 2, y: r.top + r.height / 2 }, count);
}
