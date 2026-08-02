import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';

const Header = () => {
  const { wishlist, cart, setIsCartOpen, searchQuery, setSearchQuery } = useShop();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    setSearchFocused(false);
    const collectionEl = document.getElementById('collection');
    if (collectionEl) {
      collectionEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`top-header ${isScrolled ? 'scrolled' : ''}`} id="topHeader">
      <div className="header-container">
        {/* Logo */}
        <a href="#" className="logo" id="logo">
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
            <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M18 6L22 14L30 15.5L24 21.5L25.5 30L18 26L10.5 30L12 21.5L6 15.5L14 14L18 6Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1"/>
          </svg>
          <div className="logo-text">
            <span className="logo-name">CaratLane</span>
            <span className="logo-tagline">Fine Jewellery</span>
          </div>
        </a>

        {/* Search Bar */}
        <div className={`search-wrapper ${searchFocused ? 'active' : ''}`} id="searchWrapper">
          <div className="search-bar">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search for rings, earrings, necklaces..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              autoComplete="off"
            />
            <button className="search-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
              </svg>
            </button>
          </div>
          {/* Search Dropdown */}
          <div className="search-dropdown">
            <div className="search-trending">
              <h4>Trending Searches</h4>
              <div className="trending-tags">
                {['Solitaire Rings', 'Gold Necklace', 'Diamond Earrings', 'Mangalsutra', 'Bracelets'].map((tag, idx) => (
                  <span key={idx} className="tag" onClick={() => handleTagClick(tag)}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          <a href="#collection" className="header-action-btn tooltip-trigger" data-tooltip="Treasure Chest">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 0 0-8 0v2"/><circle cx="12" cy="15" r="2"/>
            </svg>
            <span className="action-label">Offers</span>
            <span className="badge new-badge">NEW</span>
          </a>
          <a href="#footer" className="header-action-btn tooltip-trigger" data-tooltip="Find Stores">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="action-label">Stores</span>
          </a>
          <div className="header-divider"></div>
          <a href="#" className="header-action-btn icon-only tooltip-trigger" data-tooltip="My Account" onClick={(e) => e.preventDefault()}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </a>
          <a href="#collection" className="header-action-btn icon-only tooltip-trigger" data-tooltip="Wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span className="wishlist-count">{wishlist.length}</span>
          </a>
          <button className="header-action-btn icon-only tooltip-trigger" data-tooltip="Shopping Bag" onClick={() => setIsCartOpen(true)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
            <span className="cart-count">{totalCartCount}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
