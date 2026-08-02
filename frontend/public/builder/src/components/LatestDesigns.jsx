import React, { useState } from 'react';
import { latestProducts } from '../data/products';
import { useShop } from '../context/ShopContext';

const LatestDesigns = () => {
  const { wishlist, toggleWishlist, setQuickViewProduct } = useShop();
  const [scrollIndex, setScrollIndex] = useState(0);

  const handlePrev = () => {
    setScrollIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setScrollIndex(prev => Math.min(latestProducts.length - 2, prev + 1));
  };

  return (
    <section className="latest-section" id="latestSection">
      <div className="section-container">
        <div className="latest-grid">
          {/* Left Featured Banner */}
          <div className="latest-featured">
            <div className="latest-featured-img" style={{ backgroundImage: "url('/images/hero_necklace.png')" }}></div>
            <div className="latest-featured-overlay">
              <h2 className="latest-featured-title">
                <span className="script">Latest</span>
                <span className="serif">Designs</span>
              </h2>
              <a href="#collection" className="latest-shop-btn">SHOP NOW ▸</a>
            </div>
          </div>

          {/* Right Product Carousel */}
          <div className="latest-carousel-wrapper">
            <div className="latest-carousel" style={{ transform: `translateX(-${scrollIndex * 260}px)`, transition: 'transform 0.4s ease' }}>
              {latestProducts.map((item) => {
                const isWishlisted = wishlist.includes(item.id);
                return (
                  <div key={item.id} className="latest-product-card">
                    <div className="product-img-wrap">
                      <img
                        src={item.img || '/images/product_ring.png'}
                        alt={item.name}
                        className="product-img"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          objectPosition: 'center',
                          padding: '12px',
                          boxSizing: 'border-box',
                          transition: 'transform 0.5s ease'
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/product_ring.png';
                        }}
                      />
                      <button className="quick-view-btn" onClick={() => setQuickViewProduct(item)}>Quick View</button>
                      <button 
                        className={`wishlist-btn ${isWishlisted ? 'active' : ''}`} 
                        onClick={() => toggleWishlist(item.id)}
                        style={isWishlisted ? { background: '#B76E79', color: '#fff', borderColor: '#B76E79' } : {}}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                      </button>
                    </div>
                    <div className="product-info">
                      <span className="product-price">₹{item.price.toLocaleString('en-IN')}</span>
                      <span className="product-name">{item.name}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="carousel-controls">
              <button className="carousel-arrow carousel-prev" onClick={handlePrev}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button className="carousel-arrow carousel-next" onClick={handleNext}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestDesigns;
