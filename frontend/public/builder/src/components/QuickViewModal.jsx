import React, { useState, useRef, useCallback } from 'react';
import { useShop } from '../context/ShopContext';

/* ─── Magnifying Lens Constants ────────────────────────────── */
const LENS_SIZE = 160; // Circular magnifying lens diameter in px
const ZOOM_SCALE = 3;   // 3x magnification

const QuickViewModal = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, wishlist, toggleWishlist } = useShop();
  const [pincode, setPincode] = useState('');
  const [pincodeMsg, setPincodeMsg] = useState('');

  /* ── Desktop Magnifying Lens State ── */
  const [isZoomed, setIsZoomed] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const imgRef = useRef(null);

  /* ── Mobile Fullscreen Zoom State ── */
  const [mobileZoomOpen, setMobileZoomOpen] = useState(false);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const lastTouchRef = useRef(null);
  const lastTapRef = useRef(0);

  if (!quickViewProduct) return null;

  const isWishlisted = wishlist.includes(quickViewProduct.id);
  const discountPercent = quickViewProduct.originalPrice
    ? Math.round(((quickViewProduct.originalPrice - quickViewProduct.price) / quickViewProduct.originalPrice) * 100)
    : null;

  const handleCheckPincode = () => {
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      setPincodeMsg('✨ Express Delivery available by tomorrow!');
    } else {
      setPincodeMsg('Please enter a valid 6-digit PIN code.');
    }
  };

  /* ── Desktop: Track mouse position over product image ── */
  const updateLensPos = (e) => {
    if (!imgRef.current) return;
    const rect = imgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLensPos({
      x,
      y,
      width: rect.width,
      height: rect.height,
    });
  };

  const handleMouseMove = useCallback((e) => {
    updateLensPos(e);
  }, []);

  const handleMouseEnter = useCallback((e) => {
    updateLensPos(e);
    setIsZoomed(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsZoomed(false);
  }, []);

  /* ── Mobile: Open fullscreen zoom on tap (pointer: coarse) ── */
  const handleImageTap = useCallback((e) => {
    if (window.matchMedia('(pointer: fine)').matches) return; // desktop only → ignore
    e.preventDefault();
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      // double-tap: reset pan
      setPanPos({ x: 0, y: 0 });
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;
    setMobileZoomOpen(true);
  }, []);

  /* ── Mobile: Touch-pan inside fullscreen overlay ── */
  const handleOverlayTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  }, []);

  const handleOverlayTouchMove = useCallback((e) => {
    if (e.touches.length !== 1 || !lastTouchRef.current) return;
    e.preventDefault();
    const dx = e.touches[0].clientX - lastTouchRef.current.x;
    const dy = e.touches[0].clientY - lastTouchRef.current.y;
    lastTouchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setPanPos((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  /* ── Calculate circular lens position & background offset ── */
  const lensLeft = lensPos.width ? Math.max(0, Math.min(lensPos.width - LENS_SIZE, lensPos.x - LENS_SIZE / 2)) : 0;
  const lensTop = lensPos.height ? Math.max(0, Math.min(lensPos.height - LENS_SIZE, lensPos.y - LENS_SIZE / 2)) : 0;

  const bgX = -(lensPos.x * ZOOM_SCALE - LENS_SIZE / 2);
  const bgY = -(lensPos.y * ZOOM_SCALE - LENS_SIZE / 2);

  const lensStyle = {
    left: `${lensLeft}px`,
    top: `${lensTop}px`,
    width: `${LENS_SIZE}px`,
    height: `${LENS_SIZE}px`,
    backgroundImage: `url(${quickViewProduct.img})`,
    backgroundSize: `${lensPos.width * ZOOM_SCALE}px ${lensPos.height * ZOOM_SCALE}px`,
    backgroundPosition: `${bgX}px ${bgY}px`,
  };

  /* ── Main image container style (normal 1x display) ── */
  const imgSrc = quickViewProduct.img || '/images/product_ring.png';
  const mainImgStyle = {
    backgroundImage: `url(${imgSrc})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#FAF5F0',
  };

  return (
    <>
      {/* ── Main modal ──────────────────────────────────────── */}
      <div
        className="modal-overlay active"
        onClick={(e) =>
          e.target.classList.contains('modal-overlay') && setQuickViewProduct(null)
        }
      >
        <div className="modal-content">
          <button className="modal-close" onClick={() => setQuickViewProduct(null)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <div className="modal-grid">
            {/* ── Image panel ── */}
            <div className="modal-images">
              <div
                ref={imgRef}
                className="modal-main-img modal-zoom-container"
                style={mainImgStyle}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleImageTap}
                role="img"
                aria-label={quickViewProduct.name}
              >

                {/* Professional Circular Magnifying Lens */}
                {quickViewProduct.img && (
                  <div
                    className={`magnifier-lens${isZoomed ? ' active' : ''}`}
                    style={lensStyle}
                    aria-hidden="true"
                  />
                )}

                {/* Desktop hover-to-zoom hint */}
                {quickViewProduct.img && (
                  <div className={`zoom-hint${isZoomed ? ' zoom-hint--hidden' : ''}`}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                    <span>Hover to zoom</span>
                  </div>
                )}

                {/* Mobile tap-to-zoom badge */}
                {quickViewProduct.img && (
                  <div className="zoom-tap-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <span>Tap to zoom</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Details panel ── */}
            <div className="modal-details">
              {quickViewProduct.badge && (
                <span className="modal-tag">{quickViewProduct.badge.toUpperCase()}</span>
              )}
              <h2 className="modal-product-name">{quickViewProduct.name}</h2>
              <div className="modal-pricing">
                <span className="modal-price">₹{quickViewProduct.price.toLocaleString('en-IN')}</span>
                {quickViewProduct.originalPrice && (
                  <span className="modal-original-price">₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}</span>
                )}
                {discountPercent && (
                  <span className="modal-discount">{discountPercent}% OFF</span>
                )}
              </div>
              <p className="modal-desc">
                Exquisitely crafted in 18KT gold with certified diamonds. Designed for timeless elegance and daily elegance.
              </p>
              <div className="modal-meta">
                <div className="meta-row">
                  <span className="meta-label">Metal:</span>
                  <span className="meta-value">18KT Rose Gold / Yellow Gold</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Diamond:</span>
                  <span className="meta-value">0.15 Ct, IJ-SI Certified</span>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Purity:</span>
                  <span className="meta-value">BIS Hallmarked</span>
                </div>
              </div>
              <div className="modal-delivery">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="15" height="13" />
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
                <span>Check Delivery:</span>
                <input
                  type="text"
                  placeholder="Enter Pincode"
                  className="pincode-input"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                />
                <button
                  onClick={handleCheckPincode}
                  style={{
                    padding: '6px 12px',
                    background: 'var(--rose-gold)',
                    color: '#fff',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                  }}
                >
                  Check
                </button>
              </div>
              {pincodeMsg && (
                <p
                  style={{
                    fontSize: '12px',
                    color: pincodeMsg.includes('Express') ? '#2e7d32' : '#d32f2f',
                    marginTop: '4px',
                  }}
                >
                  {pincodeMsg}
                </p>
              )}
              <div className="modal-actions" style={{ marginTop: '20px' }}>
                <button
                  className="add-to-cart-btn"
                  onClick={() => {
                    addToCart(quickViewProduct);
                    setQuickViewProduct(null);
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  Add to Bag
                </button>
                <button
                  className={`add-to-wishlist-btn ${isWishlisted ? 'active' : ''}`}
                  onClick={() => toggleWishlist(quickViewProduct.id)}
                  style={isWishlisted ? { background: '#B76E79', color: '#fff', borderColor: '#B76E79' } : {}}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={isWishlisted ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile fullscreen zoom overlay ─────────────────── */}
      {mobileZoomOpen && quickViewProduct.img && (
        <div
          className="mobile-zoom-overlay"
          onTouchStart={handleOverlayTouchStart}
          onTouchMove={handleOverlayTouchMove}
          onTouchEnd={() => {
            lastTouchRef.current = null;
          }}
        >
          <button
            className="mobile-zoom-close"
            onClick={() => {
              setMobileZoomOpen(false);
              setPanPos({ x: 0, y: 0 });
            }}
            aria-label="Close zoom view"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <p className="mobile-zoom-hint">Double-tap to reset &nbsp;·&nbsp; Drag to pan</p>

          <div
            className="mobile-zoom-img-wrap"
            onDoubleClick={() => setPanPos({ x: 0, y: 0 })}
          >
            <img
              src={quickViewProduct.img}
              alt={quickViewProduct.name}
              className="mobile-zoom-img"
              style={{
                transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${ZOOM_SCALE})`,
              }}
              draggable={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default QuickViewModal;
