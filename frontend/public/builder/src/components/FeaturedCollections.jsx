import React from 'react';

const FeaturedCollections = () => {
  return (
    <section className="collections-section" id="collections-section">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Featured Collections</h2>
          <p className="section-subtitle">Handpicked collections curated just for you</p>
        </div>
        
        <div className="collections-grid-editorial">
          {/* Hero Card 1 — SHAYA (Signature) */}
          <div className="collection-card-hero">
            <div className="collection-hero-media">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85"
                alt="Shaya Silver Jewellery"
                className="collection-hero-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/product_ring.png';
                }}
              />
            </div>
            <div className="collection-hero-overlay"></div>
            <div className="collection-hero-content">
              <span className="banner-tag">SIGNATURE</span>
              <h3 className="banner-title">
                <span className="script">Shaya</span>
                <span className="by">by CaratLane</span>
              </h3>
              <p className="banner-desc">Silver jewellery reimagined for the modern woman</p>
              <a href="#collection" className="banner-cta">Discover →</a>
            </div>
          </div>

          {/* Column 2: Stacked Split Cards */}
          <div className="collections-column-stacked">
            {/* Card 2 — SPARKLE (Exclusive) */}
            <div className="collection-card-split split-sparkle">
              <div className="collection-split-text">
                <span className="banner-tag">EXCLUSIVE</span>
                <h3 className="banner-title">
                  <span className="serif-sm">Girl, get your</span>
                  <span className="script">Sparkle</span>
                </h3>
                <a href="#collection" className="banner-cta">Shop Now →</a>
              </div>
              <div className="collection-split-media">
                <img
                  src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=85"
                  alt="Solitaire Diamond Ring"
                  className="collection-split-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/product_ring.png';
                  }}
                />
              </div>
            </div>

            {/* Card 3 — BRIDAL DREAMS (Limited Edition) */}
            <div className="collection-card-split split-bridal">
              <div className="collection-split-text">
                <span className="banner-tag">LIMITED EDITION</span>
                <h3 className="banner-title">
                  <span className="serif-sm">Bridal</span>
                  <span className="script">Dreams</span>
                </h3>
                <a href="#collection" className="banner-cta">Explore →</a>
              </div>
              <div className="collection-split-media">
                <img
                  src="https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=85"
                  alt="Bridal Kundan Necklace"
                  className="collection-split-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/product_ring.png';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
