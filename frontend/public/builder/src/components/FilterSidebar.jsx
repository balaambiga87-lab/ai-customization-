import React from 'react';
import { useShop } from '../context/ShopContext';

const FilterSidebar = () => {
  const {
    selectedCategories,
    setSelectedCategories,
    selectedRingSizes,
    setSelectedRingSizes,
    selectedMetals,
    setSelectedMetals,
    selectedDiscounts,
    setSelectedDiscounts,
    selectedTypes,
    setSelectedTypes,
    clearAllFilters,
    activeFiltersCount,
    mobileFilterOpen,
    setMobileFilterOpen
  } = useShop();

  const handleCheckboxChange = (value, currentList, setList) => {
    if (currentList.includes(value)) {
      setList(currentList.filter(item => item !== value));
    } else {
      setList([...currentList, value]);
    }
  };

  return (
    <aside className={`filter-sidebar ${mobileFilterOpen ? 'active' : ''}`} id="filterSidebar">
      <div className="filter-header-bar">
        <div className="filter-title-row">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="16" y2="12"/><line x1="4" y1="18" x2="12" y2="18"/>
          </svg>
          <span>FILTERS</span>
          {activeFiltersCount > 0 && (
            <span className="filter-count">{activeFiltersCount}</span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button className="clear-all-btn" onClick={clearAllFilters}>CLEAR ALL</button>
        )}
        {mobileFilterOpen && (
          <button className="modal-close" style={{ position: 'relative', top: 0, right: 0 }} onClick={() => setMobileFilterOpen(false)}>×</button>
        )}
      </div>

      {/* Active Filter Tags */}
      {activeFiltersCount > 0 && (
        <div className="active-filters">
          {selectedCategories.map(cat => (
            <span key={cat} className="active-filter-tag">
              Category: {cat} 
              <button className="remove-filter" onClick={() => setSelectedCategories(selectedCategories.filter(c => c !== cat))}>×</button>
            </span>
          ))}
          {selectedRingSizes.map(size => (
            <span key={size} className="active-filter-tag">
              Size: {size} 
              <button className="remove-filter" onClick={() => setSelectedRingSizes(selectedRingSizes.filter(s => s !== size))}>×</button>
            </span>
          ))}
          {selectedMetals.map(metal => (
            <span key={metal} className="active-filter-tag">
              Metal: {metal} 
              <button className="remove-filter" onClick={() => setSelectedMetals(selectedMetals.filter(m => m !== metal))}>×</button>
            </span>
          ))}
          {selectedDiscounts.map(disc => (
            <span key={disc} className="active-filter-tag">
              Discount 
              <button className="remove-filter" onClick={() => setSelectedDiscounts(selectedDiscounts.filter(d => d !== disc))}>×</button>
            </span>
          ))}
          {selectedTypes.map(type => (
            <span key={type} className="active-filter-tag">
              Type: {type} 
              <button className="remove-filter" onClick={() => setSelectedTypes(selectedTypes.filter(t => t !== type))}>×</button>
            </span>
          ))}
        </div>
      )}

      {/* Category Filter */}
      <div className="filter-group open">
        <div className="filter-group-title">
          <span>Category</span>
        </div>
        <div className="filter-options">
          {[
            { id: 'rings', label: 'Rings', count: 342 },
            { id: 'earrings', label: 'Earrings', count: 256 },
            { id: 'necklaces', label: 'Necklaces', count: 189 },
            { id: 'bracelets', label: 'Bracelets', count: 145 },
            { id: 'pendants', label: 'Pendants', count: 203 },
          ].map(opt => (
            <label key={opt.id} className="filter-option">
              <input
                type="checkbox"
                checked={selectedCategories.includes(opt.id)}
                onChange={() => handleCheckboxChange(opt.id, selectedCategories, setSelectedCategories)}
              />
              {opt.label} <span className="count">({opt.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Ring Size Filter */}
      <div className="filter-group open">
        <div className="filter-group-title">
          <span>Ring Size</span>
        </div>
        <div className="filter-options">
          {['5', '6', '7', '8', '9', '17', '18'].map(size => (
            <label key={size} className="filter-option">
              <input
                type="checkbox"
                checked={selectedRingSizes.includes(size)}
                onChange={() => handleCheckboxChange(size, selectedRingSizes, setSelectedRingSizes)}
              />
              Size {size}
            </label>
          ))}
        </div>
      </div>

      {/* Metal Filter */}
      <div className="filter-group open">
        <div className="filter-group-title">
          <span>Metal</span>
        </div>
        <div className="filter-options">
          {[
            { id: 'gold', label: 'Yellow Gold' },
            { id: 'rosegold', label: 'Rose Gold' },
            { id: 'whitegold', label: 'White Gold' },
            { id: 'platinum', label: 'Platinum' },
          ].map(metal => (
            <label key={metal.id} className="filter-option">
              <input
                type="checkbox"
                checked={selectedMetals.includes(metal.id)}
                onChange={() => handleCheckboxChange(metal.id, selectedMetals, setSelectedMetals)}
              />
              {metal.label}
            </label>
          ))}
        </div>
      </div>

      {/* Discounts */}
      <div className="filter-group open">
        <div className="filter-group-title">
          <span>Discounts</span>
        </div>
        <div className="filter-options">
          <label className="filter-option">
            <input
              type="checkbox"
              checked={selectedDiscounts.includes('50off')}
              onChange={() => handleCheckboxChange('50off', selectedDiscounts, setSelectedDiscounts)}
            />
            Flat 50% off on Making Charges
          </label>
        </div>
      </div>

      {/* Product Type Filter */}
      <div className="filter-group open">
        <div className="filter-group-title">
          <span>Product Type</span>
        </div>
        <div className="filter-options">
          {[
            { id: 'diamond', label: 'Diamond' },
            { id: 'gemstone', label: 'Gemstone' },
            { id: 'gold', label: 'Gold Only' },
          ].map(type => (
            <label key={type.id} className="filter-option">
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.id)}
                onChange={() => handleCheckboxChange(type.id, selectedTypes, setSelectedTypes)}
              />
              {type.label}
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default FilterSidebar;
