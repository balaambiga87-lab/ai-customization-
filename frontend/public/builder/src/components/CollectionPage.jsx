import React from 'react';
import FilterSidebar from './FilterSidebar';
import ProductGrid from './ProductGrid';

const CollectionPage = () => {
  return (
    <section className="collection-page" id="collection">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">All Jewellery</h2>
          <p className="section-subtitle">Browse our entire collection of fine jewellery</p>
        </div>
        <div className="collection-layout">
          <FilterSidebar />
          <ProductGrid />
        </div>
      </div>
    </section>
  );
};

export default CollectionPage;
