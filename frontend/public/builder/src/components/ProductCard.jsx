import React from 'react';
import { useShop } from '../context/ShopContext';

const ProductCard = ({ product }) => {
  const { wishlist, toggleWishlist, addToCart, setQuickViewProduct } = useShop();
  const isWishlisted = wishlist.includes(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="product-card">
      <div className="product-img-wrap">
        {product.badge && (
          <span className={`badge-tag ${product.badge}`}>
            {product.badge.toUpperCase()}
          </span>
        )}
        
        <img
          src={product.img || '/images/product_ring.png'}
          alt={product.name}
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

        <button className="quick-view-btn" onClick={() => setQuickViewProduct(product)}>
          Quick View
        </button>

        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={() => toggleWishlist(product.id)}
          style={isWishlisted ? { background: '#B76E79', color: '#fff', borderColor: '#B76E79' } : {}}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill={isWishlisted ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <div className="product-info">
        <h3 className="product-name" onClick={() => setQuickViewProduct(product)} style={{ cursor: 'pointer' }}>
          {product.name}
        </h3>
        <div className="price-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="original-price" style={{ textDecoration: 'line-through', color: '#9B8B7E', fontSize: '13px' }}>
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
          {discountPercent && (
            <span className="discount-tag" style={{ color: '#B76E79', fontSize: '12px', fontWeight: '600' }}>
              ({discountPercent}% OFF)
            </span>
          )}
        </div>
        <button 
          className="add-to-cart-btn" 
          onClick={() => addToCart(product)}
          style={{
            marginTop: '12px',
            width: '100%',
            padding: '10px 16px',
            background: 'var(--text-primary)',
            color: '#fff',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
          Add to Bag
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
