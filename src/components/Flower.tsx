import './Flower.css';

const COLORS = ['#FF4F9A', '#FFD93D', '#2D3BFF', '#C9F23B', '#FF7A29', '#B69CFF'];

interface FlowerProps {
  size?: number;
  spin?: boolean;
  className?: string;
}

/** The Vannam bloom: six clashing petals. */
export default function Flower({ size = 40, spin = false, className = '' }: FlowerProps) {
  return (
    <svg
      className={`flower ${spin ? 'flower--spin' : ''} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      focusable="false"
    >
      {COLORS.map((c, i) => (
        <ellipse
          key={c}
          cx="50" cy="27" rx="14" ry="23"
          fill={c} stroke="#1E0B36" strokeWidth="3.5"
          transform={`rotate(${i * 60} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="11" fill="#FFF6EA" stroke="#1E0B36" strokeWidth="3.5" />
    </svg>
  );
}
