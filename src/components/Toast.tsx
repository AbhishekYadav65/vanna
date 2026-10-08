import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import './Toast.css';

/** Small confirmation that sits above the bloom after adding a pouch. */
export default function Toast() {
  const { toast, cartDispatch } = useStore();
  return (
    <div className="toast-wrap" aria-live="polite" role="status">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            className="toast"
            initial={{ y: 30, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 26 }}
          >
            <span className="toast__text">{toast.text}</span>
            <button type="button" className="toast__btn" onClick={() => cartDispatch({ type: 'OPEN' })}>View bag</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
