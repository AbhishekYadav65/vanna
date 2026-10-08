import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Flower from './Flower';
import './Wordmark.css';

/** A small logo pill, not a navbar. It tucks away while you scroll down. */
export default function Wordmark() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 8) return;
      setHidden(y > last && y > 160);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Link to="/" className={`wordmark ${hidden ? 'is-hidden' : ''}`} aria-label="Vannam, home">
      <Flower size={34} />
      <span className="wordmark__text">Vannam</span>
    </Link>
  );
}
