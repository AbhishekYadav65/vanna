import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { getCutoutUrl, getGround } from '../data/visuals';
import './PressPreview.css';

/** Big blurred-backdrop preview shown while a product is pressed and held. */
export default function PressPreview() {
  const { preview } = useStore();
  const p = preview?.product;
  const ground = p ? getGround(p.slug) : null;

  return (
    <AnimatePresence>
      {p && ground && (
        <motion.div
          key="press"
          className="press"
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <motion.div
            className="press__card ground"
            style={{ '--g': ground.bg, '--gi': ground.ink } as React.CSSProperties}
            initial={{ scale: 0.55, y: 50, rotate: -5, opacity: 0 }}
            animate={{ scale: 1, y: 0, rotate: 0, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0, transition: { duration: 0.16 } }}
            transition={{ type: 'spring', stiffness: 330, damping: 22 }}
          >
            <img className="press__cut" src={getCutoutUrl(p.slug)} alt="" draggable={false} />
            <div className="press__meta">
              <h3 className="press__name">{p.name}</h3>
              <p className="press__price">₹{p.price.toLocaleString('en-IN')}</p>
            </div>
          </motion.div>
          <p className="press__hint">Let go to close</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
