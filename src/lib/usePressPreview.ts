import { useCallback, useEffect, useRef } from 'react';
import type { MouseEvent as RMouseEvent, PointerEvent as RPointerEvent } from 'react';
import type { Product } from '../data/products';
import { useStore } from '../store/useStore';

/**
 * Press and hold a product (phones: ~0.4s, mouse: ~0.65s) to get a big preview
 * over a blurred backdrop. Let go and it closes. A normal tap still opens the product.
 *
 * Release, drag and cancel are tracked on `window`, so the preview can never get
 * stuck open, even when the card is inside something that is being dragged.
 */
export function usePressPreview(product: Product) {
  const { openPreview, closePreview } = useStore();
  const timer = useRef<number | undefined>(undefined);
  const origin = useRef({ x: 0, y: 0 });
  const opened = useRef(false);
  const swallowClick = useRef(false);
  const pointerType = useRef('mouse');
  const detach = useRef<() => void>(() => {});

  const cancelPending = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = undefined;
    if (!opened.current) {
      detach.current();
      detach.current = () => {};
    }
  }, []);

  const stop = useCallback(() => {
    window.clearTimeout(timer.current);
    timer.current = undefined;
    detach.current();
    detach.current = () => {};
    if (opened.current) {
      opened.current = false;
      closePreview();
      swallowClick.current = true;
      window.setTimeout(() => { swallowClick.current = false; }, 500);
    }
  }, [closePreview]);

  useEffect(() => stop, [stop]);

  const onPointerDown = (e: RPointerEvent<HTMLElement>) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    stop();
    pointerType.current = e.pointerType;
    origin.current = { x: e.clientX, y: e.clientY };

    const move = (ev: PointerEvent) => {
      if (opened.current) return;
      if (Math.hypot(ev.clientX - origin.current.x, ev.clientY - origin.current.y) > 10) cancelPending();
    };
    const up = () => stop();
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    detach.current = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };

    timer.current = window.setTimeout(() => {
      timer.current = undefined;
      opened.current = true;
      if ('vibrate' in navigator) navigator.vibrate(12);
      openPreview({ product, x: origin.current.x, y: origin.current.y });
    }, e.pointerType === 'mouse' ? 650 : 380);
  };

  return {
    onPointerDown,
    // stops the long-press "save image / open link" menu on phones, keeps right-click on desktop
    onContextMenu: (e: RMouseEvent<HTMLElement>) => {
      if (pointerType.current !== 'mouse' || opened.current) e.preventDefault();
    },
    onClickCapture: (e: RMouseEvent<HTMLElement>) => {
      if (swallowClick.current) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    onDragStart: (e: React.DragEvent<HTMLElement>) => e.preventDefault(),
  };
}
