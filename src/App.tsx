/**
 * FORMGRID APPLICATION ROOT
 * Routing orchestration, global error boundaries, split-cart drawer, announcement ticker, and layout wrapping
 */

import React, { useState, useEffect, Suspense } from 'react';
import { AnnouncementBar } from './components/common/AnnouncementBar';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { CustomizerPage } from './pages/CustomizerPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SuccessPage } from './pages/SuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { Product } from './types';
import { useCustomizerStore } from './store/useCustomizerStore';
import { Loader2 } from 'lucide-react';

export type AppRoute = 'home' | 'customizer' | 'checkout' | 'success' | 'tracking';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [activeOrderNumber, setActiveOrderNumber] = useState<string>('FG-849201-B3X');
  const { setProduct } = useCustomizerStore();

  // Listen to browser URL or query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const routeParam = params.get('route');
    const orderNum = params.get('order_number');
    const sessionId = params.get('session_id');

    if (sessionId || orderNum) {
      if (orderNum) setActiveOrderNumber(orderNum);
      setCurrentRoute('success');
    } else if (routeParam === 'customizer') {
      setCurrentRoute('customizer');
    } else if (routeParam === 'tracking') {
      setCurrentRoute('tracking');
    } else if (routeParam === 'checkout') {
      setCurrentRoute('checkout');
    }
  }, []);

  const handleNavigate = (route: AppRoute) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCustomizeProduct = (product: Product) => {
    setProduct(product);
    setCurrentRoute('customizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckoutSuccess = (orderNumber: string) => {
    setActiveOrderNumber(orderNumber);
    setCurrentRoute('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrderFromSuccess = (orderNumber: string) => {
    setActiveOrderNumber(orderNumber);
    setCurrentRoute('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-zinc-100 selection:bg-signal-orange selection:text-black">
      {/* Marketing & System Status Announcement Bar */}
      <AnnouncementBar />

      {/* Global Header */}
      <Header
        currentRoute={
          currentRoute === 'home' || currentRoute === 'customizer' || currentRoute === 'tracking'
            ? currentRoute
            : 'home'
        }
        onNavigate={(r) => handleNavigate(r)}
      />

      {/* Main Viewport Enclave */}
      <main className="flex-1">
        <ErrorBoundary fallbackTitle="Formgrid Viewport Recovery">
          <Suspense
            fallback={
              <div className="min-h-[500px] flex items-center justify-center font-mono text-xs text-zinc-500 space-x-2">
                <Loader2 className="w-4 h-4 text-signal-orange animate-spin" />
                <span>INITIALIZING SYSTEM VIEWPORT...</span>
              </div>
            }
          >
            {currentRoute === 'home' && (
              <HomePage
                onNavigateToCustomizer={() => handleNavigate('customizer')}
                onCustomizeProduct={handleCustomizeProduct}
              />
            )}

            {currentRoute === 'customizer' && <CustomizerPage />}

            {currentRoute === 'checkout' && (
              <CheckoutPage
                onSuccess={handleCheckoutSuccess}
                onCancel={() => handleNavigate('customizer')}
              />
            )}

            {currentRoute === 'success' && (
              <SuccessPage
                orderNumber={activeOrderNumber}
                onContinueShopping={() => handleNavigate('home')}
                onTrackOrder={handleTrackOrderFromSuccess}
              />
            )}

            {currentRoute === 'tracking' && (
              <OrderTrackingPage initialOrderNumber={activeOrderNumber} />
            )}
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Global Slide-Out Split-Cart Drawer */}
      <CartDrawer onCheckout={() => handleNavigate('checkout')} />

      {/* Industrial Footer */}
      <Footer />
    </div>
  );
};
