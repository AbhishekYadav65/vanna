import type { CSSProperties } from 'react';
import './Info.css';

export default function Contact() {
  return (
    <div className="info">
      <section className="panel info__hero info__hero--short" style={{ '--g': '#FF4F9A', '--gi': '#1E0B36' } as CSSProperties}>
        <h1 className="info__h1">Say hello.</h1>
        <p className="info__lede">Whether you want a custom order, a question about our fabrics, or just to say hi, we&apos;d love to hear from you.</p>
      </section>

      <div className="info__contact">
        <section className="panel panel--milk info__methods">
          <div className="info__method">
            <h2>Instagram</h2>
            <p>For the fastest reply and to place orders, send us a DM.</p>
            <a className="btn" href="https://www.instagram.com/vannam.ig" target="_blank" rel="noopener noreferrer">@vannam.ig</a>
          </div>
          <div className="info__method">
            <h2>Studio</h2>
            <p>Handcrafted with love in Coimbatore, Tamil Nadu.</p>
            <p><strong>Worldwide shipping available.</strong></p>
          </div>
        </section>

        <section className="panel panel--milk info__formwrap">
          <form className="info__form" onSubmit={(e) => e.preventDefault()}>
            <h2>Send a message</h2>
            <label htmlFor="name">Name<input type="text" id="name" placeholder="Your name" autoComplete="name" /></label>
            <label htmlFor="email">Email<input type="email" id="email" placeholder="Your email" autoComplete="email" /></label>
            <label htmlFor="message">Message<textarea id="message" rows={5} placeholder="How can we help?" /></label>
            <button type="submit" className="btn">Send message</button>
            <p className="info__note">This form is for display only. Please DM us on Instagram to order.</p>
          </form>
        </section>
      </div>
    </div>
  );
}
