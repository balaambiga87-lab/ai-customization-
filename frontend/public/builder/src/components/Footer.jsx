import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useShop();

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email.trim()) {
      showToast('💌 Thank you for subscribing to CaratLane!');
      setEmail('');
    }
  };

  return (
    <footer className="main-footer" id="footer">
      <div className="footer-top">
        <div className="section-container">
          <div className="footer-grid">
            <div className="footer-col footer-brand">
              <a href="#" className="footer-logo">
                <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="16" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M18 6L22 14L30 15.5L24 21.5L25.5 30L18 26L10.5 30L12 21.5L6 15.5L14 14L18 6Z" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1"/>
                </svg>
                <span>CaratLane</span>
              </a>
              <p className="footer-desc">Crafting timeless elegance since 2008. Every piece tells a story of passion, precision, and beauty.</p>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></svg>
                </a>
                <a href="#" className="social-link" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" className="social-link" aria-label="YouTube">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                </a>
                <a href="#" className="social-link" aria-label="Pinterest">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.08 2.46 7.58 5.97 9.12-.08-.72-.15-1.82.03-2.6.17-.7 1.07-4.55 1.07-4.55s-.27-.55-.27-1.37c0-1.28.74-2.24 1.67-2.24.79 0 1.17.59 1.17 1.3 0 .79-.5 1.97-.77 3.07-.22.92.46 1.68 1.37 1.68 1.65 0 2.91-1.74 2.91-4.24 0-2.22-1.59-3.77-3.87-3.77-2.64 0-4.19 1.98-4.19 4.02 0 .8.31 1.65.69 2.11.08.09.09.17.07.26l-.26 1.04c-.04.17-.14.2-.32.12-1.2-.56-1.95-2.31-1.95-3.72 0-3.03 2.2-5.81 6.35-5.81 3.33 0 5.92 2.38 5.92 5.55 0 3.31-2.09 5.98-4.98 5.98-.97 0-1.89-.5-2.2-1.1l-.6 2.28c-.22.84-.81 1.89-1.2 2.53.9.28 1.86.43 2.85.43 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                </a>
              </div>
            </div>
            <div className="footer-col">
              <h4>Jewellery</h4>
              <a href="#collection">Rings</a>
              <a href="#collection">Earrings</a>
              <a href="#collection">Bracelets & Bangles</a>
              <a href="#collection">Necklaces & Pendants</a>
              <a href="#collection">Mangalsutras</a>
              <a href="#collection">Solitaires</a>
            </div>
            <div className="footer-col">
              <h4>Customer Care</h4>
              <a href="#">Order Tracking</a>
              <a href="#">Returns & Exchanges</a>
              <a href="#">Shipping Policy</a>
              <a href="#">FAQs</a>
              <a href="#">Contact Us</a>
              <a href="#">Size Guide</a>
            </div>
            <div className="footer-col">
              <h4>About Us</h4>
              <a href="#">Our Story</a>
              <a href="#">Craftsmanship</a>
              <a href="#">Sustainability</a>
              <a href="#">Careers</a>
              <a href="#">Press</a>
              <a href="#">Blog</a>
            </div>
            <div className="footer-col">
              <h4>Stay Connected</h4>
              <p className="footer-newsletter-text">Subscribe for exclusive offers, new arrivals & styling tips.</p>
              <form className="newsletter-form" onSubmit={handleNewsletter}>
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required
                />
                <button type="submit" className="newsletter-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </form>
              <div className="download-app">
                <span>Download App</span>
                <div className="app-badges">
                  <a href="#" className="app-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                    App Store
                  </a>
                  <a href="#" className="app-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.302 1.33c.576.333.576 1.175 0 1.508l-2.302 1.33-2.53-2.53 2.53-2.638zM5.864 2.658L16.8 8.99l-2.302 2.302L5.864 2.658z"/></svg>
                    Google Play
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="section-container">
          <div className="footer-bottom-content">
            <p>© 2026 CaratLane Fine Jewellery. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
