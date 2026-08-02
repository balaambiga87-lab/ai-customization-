import React from 'react';
import { trendingItems } from '../data/products';

const TrendingSection = () => {
  return (
    <section className="trending-section" id="trending">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Trending Now</h2>
          <p className="section-subtitle">What everyone's loving this season</p>
        </div>
        <div className="trending-grid">
          {trendingItems.map(item => (
            <div key={item.id} className="trending-card">
              <div className="trending-icon" style={{ background: item.bg }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                  <circle cx="12" cy="14" r="8"/><path d="M9 6l3-4 3 4"/>
                </svg>
              </div>
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
              <a href="#collection" className="trending-link">Shop Now →</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
