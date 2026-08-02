import React from 'react';

const TrustSection = () => {
  return (
    <section className="trust-section">
      <div className="section-container">
        <div className="trust-grid">
          <div className="trust-item">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>
            </svg>
            <div>
              <h4>100% Certified</h4>
              <p>BIS Hallmarked Gold & IGI Certified Diamonds</p>
            </div>
          </div>
          <div className="trust-item">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <div>
              <h4>Free Shipping</h4>
              <p>Insured shipping on all orders</p>
            </div>
          </div>
          <div className="trust-item">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M23 4l-6 6-3-3-7 7"/><path d="M17 4h6v6"/>
            </svg>
            <div>
              <h4>Lifetime Exchange</h4>
              <p>Exchange your old jewellery anytime</p>
            </div>
          </div>
          <div className="trust-item">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <div>
              <h4>15-Day Returns</h4>
              <p>Hassle-free returns within 15 days</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
