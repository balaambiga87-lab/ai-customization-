import React from 'react';
import { useShop } from '../context/ShopContext';

const categories = [
  { id: 'rings', name: 'Rings', count: '1,200+ Designs', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="12" cy="14" r="8"/><path d="M9 6l3-4 3 4"/><path d="M8 14a4 4 0 0 1 8 0"/></svg> },
  { id: 'earrings', name: 'Earrings', count: '980+ Designs', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 2C8 2 6 5 6 8c0 4 6 14 6 14s6-10 6-14c0-3-2-6-6-6z"/><circle cx="12" cy="8" r="2"/></svg> },
  { id: 'bracelets', name: 'Bracelets', count: '650+ Designs', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><ellipse cx="12" cy="12" rx="10" ry="4"/><path d="M2 12v2c0 2.2 4.5 4 10 4s10-1.8 10-4v-2"/></svg> },
  { id: 'solitaires', name: 'Solitaires', count: '450+ Designs', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 2L15 8.5L22 9.5L17 14.5L18 21.5L12 18.5L6 21.5L7 14.5L2 9.5L9 8.5L12 2Z"/></svg> },
  { id: 'necklaces', name: 'Necklaces', count: '820+ Designs', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M4 12a8 8 0 0 1 16 0"/><circle cx="12" cy="16" r="3"/><path d="M12 13V5"/></svg> },
  { id: 'pendants', name: 'Mangalsutras', count: '320+ Designs', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M12 3C7 3 3 6.5 3 10c0 5 9 12 9 12s9-7 9-12c0-3.5-4-7-9-7z"/><path d="M12 3v6"/><circle cx="12" cy="12" r="2"/></svg> },
  { id: 'bracelets', name: 'Bangles', count: '540+ Designs', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="3" y="8" width="18" height="8" rx="4"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/><circle cx="12" cy="12" r="1.5"/></svg> },
  { id: 'pendants', name: 'Pendants', count: '720+ Designs', icon: <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M20 12V8l-4-4H8L4 8v4l8 10 8-10z"/><path d="M4 8h16"/></svg> },
];

const CategorySection = () => {
  const { setSelectedCategories } = useShop();

  const handleCategoryClick = (catId) => {
    setSelectedCategories([catId]);
    const el = document.getElementById('collection');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="category-section" id="categorySection">
      <div className="section-container">
        <div className="section-header">
          <h2 className="section-title">Shop By Category</h2>
          <p className="section-subtitle">Find the perfect piece for every occasion</p>
        </div>
        <div className="category-grid">
          {categories.map((cat, idx) => (
            <a
              key={idx}
              href="#collection"
              className="category-card"
              onClick={(e) => {
                e.preventDefault();
                handleCategoryClick(cat.id);
              }}
            >
              <div className="category-icon">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <span className="category-count">{cat.count}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
