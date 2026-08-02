import React from 'react';
import { ShopProvider } from './context/ShopContext';
import AnnouncementBar from './components/AnnouncementBar';
import Header from './components/Header';
import Navigation from './components/Navigation';
import HeroSlider from './components/HeroSlider';
import LatestDesigns from './components/LatestDesigns';
import CategorySection from './components/CategorySection';
import FeaturedCollections from './components/FeaturedCollections';
import CollectionPage from './components/CollectionPage';
import TrendingSection from './components/TrendingSection';
import TrustSection from './components/TrustSection';
import Footer from './components/Footer';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import BackToTop from './components/BackToTop';

function App() {
  return (
    <ShopProvider>
      <div className="app-container">
        <AnnouncementBar />
        <Header />
        <Navigation />
        <main>
          <HeroSlider />
          <LatestDesigns />
          <CategorySection />
          <FeaturedCollections />
          <CollectionPage />
          <TrendingSection />
          <TrustSection />
        </main>
        <Footer />
        <QuickViewModal />
        <CartDrawer />
        <Toast />
        <BackToTop />
      </div>
    </ShopProvider>
  );
}

export default App;
