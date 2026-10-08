import type { CSSProperties } from 'react';
import './Photo.css';

interface PhotoProps {
  src: string;
  alt: string;
  /** width / height of the frame. Photos are never cropped, they sit on a blurred copy of themselves. */
  ratio?: number;
  className?: string;
  eager?: boolean;
}

/** A fixed-shape frame so photos of any dimensions line up neatly. */
export default function Photo({ src, alt, ratio = 4 / 5, className = '', eager }: PhotoProps) {
  return (
    <figure className={`photo ${className}`} style={{ '--bg': `url("${src}")`, aspectRatio: String(ratio) } as CSSProperties}>
      <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable={false} />
    </figure>
  );
}
