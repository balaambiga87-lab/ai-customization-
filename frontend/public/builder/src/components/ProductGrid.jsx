import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import ProductCard from './ProductCard';

const ProductGrid = () => {
  const { filteredProducts, sortBy, setSortBy, visibleCount, setVisibleCount, setMobileFilterOpen } = useShop();
  const [sortOpen, setSortOpen] = useState(false);

  const visibleProducts = filteredProducts.slice(0, visibleCount);

  const sortLabels = {
    featured: 'Featured',
    newest: 'New Arrivals',
    'low-high': 'Price: Low to High',
    'high-low': 'Price: High to Low'
  };

  return (
    <div className="products-area">
      {/* Toolbar */}
      <div className="products-toolbar">
        <span className="results-count">
          Showing <strong>1-{Math.min(visibleCount, filteredProducts.length)}</strong> of <strong>{filteredProducts.length}</strong> results
        </span>

        <button 
          className="mobile-filter-btn" 
          onClick={() => setMobileFilterOpen(true)}
          style={{ display: 'none' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="16" y2="12"/><line x1="4" y1="18" x2="12" y2="18"/></svg>
          Filters
        </button>

        <div className="sort-dropdown" style={{ position: 'relative' }}>
          <button className="sort-btn" onClick={() => setSortOpen(!sortOpen)}>
            Sort By: <strong>{sortLabels[sortBy] || 'Featured'}</strong>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          {sortOpen && (
            <div className="sort-options" style={{ display: 'block', position: 'absolute', right: 0, top: '100%', zIndex: 100 }}>
              {Object.entries(sortLabels).map(([key, label]) => (
                <a
                  key={key}
                  href="#sort"
                  className={`sort-option ${sortBy === key ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    setSortBy(key);
                    setSortOpen(false);
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No products match your current filters
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>Try adjusting or clearing your filters to see more results.</p>
        </div>
      ) : (
        <div className="product-grid" id="productGrid">
          {visibleProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* Load More Button */}
      {visibleCount < filteredProducts.length && (
        <div className="load-more-wrapper">
          <button className="load-more-btn" onClick={() => setVisibleCount(prev => prev + 8)}>
            Load More Products
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
