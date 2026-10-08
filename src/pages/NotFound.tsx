import { Link } from 'react-router-dom';
import Flower from '../components/Flower';
import './Info.css';

export default function NotFound() {
  return (
    <section className="panel info__nf">
      <Flower size={120} spin />
      <h1>404</h1>
      <h2>We lost this thread.</h2>
      <p>The page you&apos;re looking for has come unstitched.</p>
      <Link to="/" className="btn">Back to Vannam</Link>
    </section>
  );
}
