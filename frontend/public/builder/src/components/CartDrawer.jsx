import React from 'react';
import { useShop } from '../context/ShopContext';

const CartDrawer = () => {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateCartQty, showToast } = useShop();

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  const handleCheckout = () => {
    showToast('🎉 Proceeding to Secure Checkout...');
  };

  return (
    <div className="cart-overlay active" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(4px)',
      zIndex: 3000,
      display: 'flex',
      justifyContent: 'flex-end',
      animation: 'fadeIn 0.3s ease'
    }} onClick={(e) => e.target.classList.contains('cart-overlay') && setIsCartOpen(false)}>
      <div className="cart-drawer" style={{
        width: '100%',
        maxWidth: '420px',
        height: '100vh',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 30px rgba(0,0,0,0.15)',
        animation: 'slideInRight 0.3s ease'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--cream)'
        }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', color: 'var(--text-primary)' }}>
            Shopping Bag ({cart.reduce((a, b) => a + b.qty, 0)})
          </h3>
          <button onClick={() => setIsCartOpen(false)} style={{ fontSize: '24px', color: 'var(--text-primary)', cursor: 'pointer' }}>
            ×
          </button>
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" style={{ marginBottom: '12px' }}>
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '18px', color: 'var(--text-primary)' }}>Your bag is empty</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Discover pieces you will treasure forever.</p>
            </div>
          ) : (
            cart.map(({ product, qty }) => (
              <div key={product.id} style={{
                display: 'flex',
                gap: '16px',
                paddingBottom: '16px',
                marginBottom: '16px',
                borderBottom: '1px solid var(--border-light)'
              }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '8px',
                  background: '#FAF5F0',
                  border: '1px solid var(--border-light)',
                  overflow: 'hidden',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={product.img || '/images/product_ring.png'}
                    alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/product_ring.png';
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {product.name}
                  </h4>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--burgundy)', marginBottom: '8px' }}>
                    ₹{(product.price * qty).toLocaleString('en-IN')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                      <button onClick={() => updateCartQty(product.id, -1)} style={{ padding: '2px 8px', fontSize: '14px', fontWeight: 'bold' }}>-</button>
                      <span style={{ padding: '0 8px', fontSize: '13px', fontWeight: '600' }}>{qty}</span>
                      <button onClick={() => updateCartQty(product.id, 1)} style={{ padding: '2px 8px', fontSize: '14px', fontWeight: 'bold' }}>+</button>
                    </div>
                    <button onClick={() => removeFromCart(product.id)} style={{ fontSize: '12px', color: '#d32f2f', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border-light)', background: 'var(--cream)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '14px', color: '#2e7d32' }}>
              <span>Shipping</span>
              <span style={{ fontWeight: '600' }}>FREE</span>
            </div>
            <button onClick={handleCheckout} style={{
              width: '100%',
              padding: '14px',
              background: 'var(--burgundy)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '700',
              letterSpacing: '0.5px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-md)',
              transition: 'background 0.2s'
            }}>
              Proceed to Checkout • ₹{subtotal.toLocaleString('en-IN')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
