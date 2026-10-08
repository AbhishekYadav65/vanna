import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getCutoutUrl, getGround } from '../data/visuals';
import Flower from './Flower';
import './CartDrawer.css';

export default function CartDrawer() {
  const { cart, cartDispatch, cartTotal, cartCount } = useStore();
  const close = () => cartDispatch({ type: 'CLOSE' });

  useEffect(() => {
    if (!cart.isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') cartDispatch({ type: 'CLOSE' }); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [cart.isOpen, cartDispatch]);

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          />
          <motion.aside
            className="cart-drawer"
            initial={{ x: '110%', rotate: 2 }}
            animate={{ x: 0, rotate: 0 }}
            exit={{ x: '110%', rotate: 2 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            role="dialog"
            aria-modal="true"
            aria-label="Your bag"
          >
            <div className="cart-drawer__header">
              <h2 className="cart-drawer__title">Your bag <span className="cart-drawer__count">{cartCount}</span></h2>
              <button type="button" className="cart-drawer__close" onClick={close} aria-label="Close bag">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>

            {cart.items.length === 0 ? (
              <div className="cart-drawer__empty">
                <Flower size={72} spin />
                <p className="cart-drawer__empty-title">Your bag is empty</p>
                <Link to="/shop" className="btn" onClick={close}>Pick a pouch</Link>
              </div>
            ) : (
              <>
                <ul className="cart-drawer__items">
                  <AnimatePresence initial={false}>
                    {cart.items.map((item) => {
                      const g = getGround(item.product.slug);
                      return (
                        <motion.li
                          key={item.product.id}
                          className="cart-item"
                          layout
                          initial={{ opacity: 0, x: 24 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -24 }}
                        >
                          <Link to={`/product/${item.product.slug}`} className="cart-item__thumb ground" style={{ '--g': g.bg } as React.CSSProperties} onClick={close}>
                            <img src={getCutoutUrl(item.product.slug)} alt="" loading="lazy" />
                          </Link>
                          <div className="cart-item__info">
                            <Link to={`/product/${item.product.slug}`} className="cart-item__name" onClick={close}>{item.product.name}</Link>
                            <p className="cart-item__price">₹{item.product.price.toLocaleString('en-IN')}</p>
                            <div className="cart-item__controls">
                              <button type="button" className="cart-item__qty-btn" aria-label="Decrease quantity" onClick={() => cartDispatch({ type: 'UPDATE_QTY', productId: item.product.id, quantity: item.quantity - 1 })}>−</button>
                              <span className="cart-item__qty" aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span>
                              <button type="button" className="cart-item__qty-btn" aria-label="Increase quantity" onClick={() => cartDispatch({ type: 'UPDATE_QTY', productId: item.product.id, quantity: item.quantity + 1 })}>+</button>
                              <button type="button" className="cart-item__remove" aria-label={`Remove ${item.product.name}`} onClick={() => cartDispatch({ type: 'REMOVE', productId: item.product.id })}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></svg>
                              </button>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>
                <div className="cart-drawer__footer">
                  <div className="cart-drawer__subtotal"><span>Subtotal</span><strong>₹{cartTotal.toLocaleString('en-IN')}</strong></div>
                  <p className="cart-drawer__note">Shipping is calculated when you order.</p>
                  <a href="https://www.instagram.com/vannam.ig" target="_blank" rel="noopener noreferrer" className="btn">DM to order on Instagram</a>
                  <button type="button" className="btn btn--ghost" disabled>Checkout (coming soon)</button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
