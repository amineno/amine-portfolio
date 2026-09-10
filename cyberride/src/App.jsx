import React, { useState, useEffect } from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { HeaderNav } from './components/HeaderNav';
import { Sector01Hero } from './components/Sector01Hero';
import { Sector02Arsenal } from './components/Sector02Arsenal';
import { Sector03Specs } from './components/Sector03Specs';
import { Sector04Routes } from './components/Sector04Routes';
import { Sector05Terminal } from './components/Sector05Terminal';
import { CartDrawer } from './components/CartDrawer';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { TermsPolicy } from './components/TermsPolicy';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { RefundPolicy } from './components/RefundPolicy';
import { CookieBanner } from './components/CookieBanner';
import { SEOHead } from './components/SEOHead';
import { OrderTrackingModal } from './components/OrderTrackingModal';

function MainApp() {
  const [activeSector, setActiveSector] = useState('sector-1');
  const { isAdminOpen, setIsAdminOpen, setIsAuthOpen, isTrackingOpen, setIsTrackingOpen } = useCart();

  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);

  useEffect(() => {
    const sectors = ['sector-1', 'sector-2', 'sector-3', 'sector-4', 'sector-5'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSector(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -40% 0px',
        threshold: 0
      }
    );

    sectors.forEach((id) => {
      const elem = document.getElementById(id);
      if (elem) observer.observe(elem);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToArsenal = () => {
    const elem = document.getElementById('sector-2');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Secret Admin Shortcut: Ctrl + Shift + A (or Cmd + Shift + A)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsAdminOpen]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans selection:bg-[#E10600] selection:text-white">
      <SEOHead />

      {/* Fixed Navigation Header */}
      <HeaderNav
        activeSector={activeSector}
        setActiveSector={setActiveSector}
      />

      {/* Main 5 Sectors Page Spreads */}
      <main className="w-full">
        <Sector01Hero onExploreArsenal={scrollToArsenal} />
        <Sector02Arsenal />
        <Sector03Specs />
        <Sector04Routes />
        <Sector05Terminal 
          onOpenAdmin={() => setIsAdminOpen(true)} 
          onOpenTerms={() => setIsTermsOpen(true)}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onOpenRefund={() => setIsRefundOpen(true)}
        />
      </main>

      {/* Modals, Drawers & Compliance Banners */}
      <CartDrawer />
      <ProductQuickViewModal />
      <CheckoutModal />
      <AuthModal />
      <OrderTrackingModal isOpen={isTrackingOpen} onClose={() => setIsTrackingOpen(false)} />
      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      
      <TermsPolicy isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
      <PrivacyPolicy isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />
      <RefundPolicy isOpen={isRefundOpen} onClose={() => setIsRefundOpen(false)} />
      
      <CookieBanner />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <MainApp />
    </CartProvider>
  );
}
