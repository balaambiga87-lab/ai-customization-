import React, { createContext, useState, useContext, useMemo } from 'react';
import { products } from '../data/products';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([1, 6]); // Default wishlisted for demo
  const [cart, setCart] = useState([
    { product: products[0], qty: 1 }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  // Filters state
  const [selectedCategories, setSelectedCategories] = useState(['rings']);
  const [selectedRingSizes, setSelectedRingSizes] = useState([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState([]);
  const [selectedMetals, setSelectedMetals] = useState([]);
  const [selectedDiscounts, setSelectedDiscounts] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [visibleCount, setVisibleCount] = useState(12);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (message) => {
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000);
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const isWishlisted = prev.includes(productId);
      const updated = isWishlisted ? prev.filter(id => id !== productId) : [...prev, productId];
      showToast(isWishlisted ? 'Removed from Wishlist' : '✨ Added to Wishlist!');
      return updated;
    });
  };

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      let updated;
      if (existing) {
        updated = prev.map(item => item.product.id === product.id ? { ...item, qty: item.qty + qty } : item);
      } else {
        updated = [...prev, { product, qty }];
      }
      return updated;
    });
    showToast(`🛍️ Added "${product.name.slice(0, 20)}..." to Shopping Bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from Shopping Bag');
  };

  const updateCartQty = (productId, delta) => {
    setCart(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQty = item.qty + delta;
        return newQty > 0 ? { ...item, qty: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedRingSizes([]);
    setSelectedPriceRanges([]);
    setSelectedMetals([]);
    setSelectedDiscounts([]);
    setSelectedTypes([]);
    setSearchQuery('');
  };

  // Filtered Products Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
        return false;
      }
      // Ring size filter
      if (selectedRingSizes.length > 0 && !selectedRingSizes.includes(product.ringSize)) {
        return false;
      }
      // Metal filter
      if (selectedMetals.length > 0 && !selectedMetals.includes(product.metal)) {
        return false;
      }
      // Discount filter
      if (selectedDiscounts.length > 0 && !selectedDiscounts.includes(product.discount)) {
        return false;
      }
      // Type filter
      if (selectedTypes.length > 0 && !selectedTypes.includes(product.type)) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCategory = product.category.toLowerCase().includes(query);
        if (!matchesName && !matchesCategory) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'low-high') return a.price - b.price;
      if (sortBy === 'high-low') return b.price - a.price;
      if (sortBy === 'newest') return b.id - a.id;
      return 0;
    });
  }, [products, selectedCategories, selectedRingSizes, selectedMetals, selectedDiscounts, selectedTypes, searchQuery, sortBy]);

  const activeFiltersCount = selectedCategories.length + selectedRingSizes.length + selectedPriceRanges.length + selectedMetals.length + selectedDiscounts.length + selectedTypes.length;

  return (
    <ShopContext.Provider value={{
      products,
      filteredProducts,
      wishlist,
      toggleWishlist,
      cart,
      addToCart,
      removeFromCart,
      updateCartQty,
      isCartOpen,
      setIsCartOpen,
      quickViewProduct,
      setQuickViewProduct,
      selectedCategories,
      setSelectedCategories,
      selectedRingSizes,
      setSelectedRingSizes,
      selectedPriceRanges,
      setSelectedPriceRanges,
      selectedMetals,
      setSelectedMetals,
      selectedDiscounts,
      setSelectedDiscounts,
      selectedTypes,
      setSelectedTypes,
      searchQuery,
      setSearchQuery,
      sortBy,
      setSortBy,
      visibleCount,
      setVisibleCount,
      clearAllFilters,
      activeFiltersCount,
      toast,
      showToast,
      mobileFilterOpen,
      setMobileFilterOpen
    }}>
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
