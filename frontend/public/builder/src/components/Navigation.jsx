import React from 'react';
import { useShop } from '../context/ShopContext';

const Navigation = () => {
  const { setSelectedCategories } = useShop();

  const handleCategorySelect = (cat) => {
    if (cat) {
      setSelectedCategories([cat]);
    }
    const colEl = document.getElementById('collection');
    if (colEl) {
      colEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="main-nav" id="mainNav">
      <div className="nav-container">
        <ul className="nav-links" id="navLinks">
          <li className="nav-item has-mega" onClick={() => handleCategorySelect('rings')}>
            <a href="#collection">Rings</a>
            <div className="mega-menu">
              <div className="mega-grid">
                <div className="mega-col">
                  <h4>Shop By Type</h4>
                  <a href="#collection">Engagement Rings</a>
                  <a href="#collection">Casual Rings</a>
                  <a href="#collection">Cocktail Rings</a>
                  <a href="#collection">Statement Rings</a>
                  <a href="#collection">Stackable Rings</a>
                  <a href="#collection">Band Rings</a>
                </div>
                <div className="mega-col">
                  <h4>Shop By Metal</h4>
                  <a href="#collection">Yellow Gold</a>
                  <a href="#collection">Rose Gold</a>
                  <a href="#collection">White Gold</a>
                  <a href="#collection">Platinum</a>
                </div>
                <div className="mega-col">
                  <h4>Shop By Price</h4>
                  <a href="#collection">Under ₹10,000</a>
                  <a href="#collection">₹10,000 - ₹20,000</a>
                  <a href="#collection">₹20,000 - ₹50,000</a>
                  <a href="#collection">Above ₹50,000</a>
                </div>
                <div className="mega-col mega-featured">
                  <div className="mega-card">
                    <div className="mega-card-img" style={{ background: 'linear-gradient(135deg, #B76E79 0%, #D4A574 100%)' }}></div>
                    <span>New Arrivals</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="nav-item has-mega" onClick={() => handleCategorySelect('earrings')}>
            <a href="#collection">Earrings</a>
            <div className="mega-menu">
              <div className="mega-grid">
                <div className="mega-col">
                  <h4>Shop By Type</h4>
                  <a href="#collection">Studs</a>
                  <a href="#collection">Drops & Danglers</a>
                  <a href="#collection">Hoops & Huggies</a>
                  <a href="#collection">Jhumkas</a>
                  <a href="#collection">Ear Cuffs</a>
                </div>
                <div className="mega-col">
                  <h4>Shop By Occasion</h4>
                  <a href="#collection">Daily Wear</a>
                  <a href="#collection">Office Wear</a>
                  <a href="#collection">Party Wear</a>
                  <a href="#collection">Wedding</a>
                </div>
                <div className="mega-col">
                  <h4>Shop By Price</h4>
                  <a href="#collection">Under ₹10,000</a>
                  <a href="#collection">₹10,000 - ₹20,000</a>
                  <a href="#collection">₹20,000 - ₹50,000</a>
                  <a href="#collection">Above ₹50,000</a>
                </div>
                <div className="mega-col mega-featured">
                  <div className="mega-card">
                    <div className="mega-card-img" style={{ background: 'linear-gradient(135deg, #D4A574 0%, #F7E7CE 100%)' }}></div>
                    <span>Bestsellers</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="nav-item has-mega" onClick={() => handleCategorySelect('bracelets')}>
            <a href="#collection">Bracelets & Bangles</a>
            <div className="mega-menu">
              <div className="mega-grid">
                <div className="mega-col">
                  <h4>Bracelets</h4>
                  <a href="#collection">Chain Bracelets</a>
                  <a href="#collection">Cuff Bracelets</a>
                  <a href="#collection">Tennis Bracelets</a>
                  <a href="#collection">Charm Bracelets</a>
                </div>
                <div className="mega-col">
                  <h4>Bangles</h4>
                  <a href="#collection">Gold Bangles</a>
                  <a href="#collection">Diamond Bangles</a>
                  <a href="#collection">Stackable Bangles</a>
                  <a href="#collection">Kadas</a>
                </div>
                <div className="mega-col">
                  <h4>Shop By Price</h4>
                  <a href="#collection">Under ₹15,000</a>
                  <a href="#collection">₹15,000 - ₹30,000</a>
                  <a href="#collection">₹30,000 - ₹75,000</a>
                  <a href="#collection">Above ₹75,000</a>
                </div>
                <div className="mega-col mega-featured">
                  <div className="mega-card">
                    <div className="mega-card-img" style={{ background: 'linear-gradient(135deg, #722F37 0%, #B76E79 100%)' }}></div>
                    <span>Trending Now</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="nav-item" onClick={() => handleCategorySelect('rings')}><a href="#collection">Solitaires</a></li>
          <li className="nav-item" onClick={() => handleCategorySelect('pendants')}><a href="#collection">Mangalsutras</a></li>
          <li className="nav-item has-mega" onClick={() => handleCategorySelect('necklaces')}>
            <a href="#collection">Necklaces & Pendants</a>
            <div className="mega-menu">
              <div className="mega-grid">
                <div className="mega-col">
                  <h4>Necklaces</h4>
                  <a href="#collection">Chain Necklaces</a>
                  <a href="#collection">Layered Necklaces</a>
                  <a href="#collection">Chokers</a>
                  <a href="#collection">Statement Necklaces</a>
                </div>
                <div className="mega-col">
                  <h4>Pendants</h4>
                  <a href="#collection">Solitaire Pendants</a>
                  <a href="#collection">Initial Pendants</a>
                  <a href="#collection">Religious Pendants</a>
                  <a href="#collection">Fashion Pendants</a>
                </div>
                <div className="mega-col">
                  <h4>Collections</h4>
                  <a href="#collection">Polki</a>
                  <a href="#collection">Shaya</a>
                  <a href="#collection">Bridal</a>
                  <a href="#collection">Everyday Elegance</a>
                </div>
                <div className="mega-col mega-featured">
                  <div className="mega-card">
                    <div className="mega-card-img" style={{ background: 'linear-gradient(135deg, #F7E7CE 0%, #B76E79 100%)' }}></div>
                    <span>Gift Sets</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li className="nav-item"><a href="#collection">Gifting</a></li>
          <li className="nav-item"><a href="#collections-section">Collections</a></li>
          <li className="nav-item"><a href="#collection">More Jewellery</a></li>
          <li className="nav-item trending-link"><a href="#trending">Trending</a></li>
        </ul>
        <a href="#footer" className="nav-services-btn">
          Services
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </a>
      </div>
    </nav>
  );
};

export default Navigation;
