import React from 'react';

const AnnouncementBar = () => {
  return (
    <div className="announcement-bar">
      <div className="announcement-content">
        <span>✨ Free Shipping on orders above ₹15,000</span>
        <span className="announcement-divider">|</span>
        <span>💎 Flat 20% Off on Diamond Making Charges</span>
        <span className="announcement-divider">|</span>
        <span>🎁 Complimentary Gift Wrapping on all orders</span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
