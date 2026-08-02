import React from 'react';
import { useShop } from '../context/ShopContext';

const Toast = () => {
  const { toast } = useShop();

  if (!toast.visible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      background: 'var(--text-primary)',
      color: '#fff',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      zIndex: 4000,
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      animation: 'fadeIn 0.3s ease'
    }}>
      {toast.message}
    </div>
  );
};

export default Toast;
