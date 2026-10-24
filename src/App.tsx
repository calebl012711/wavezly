/**
 * WAVEZLY APPLICATION ROOT
 * Routing orchestration, global error boundaries, split-cart drawer, announcement ticker,
 * layout wrapping, and dynamic Schema.org JSON-LD / SEO meta injection.
 */

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { CustomizerPage } from './pages/CustomizerPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SuccessPage } from './pages/SuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { DeskPlannerModal } from './components/planner/DeskPlannerModal';
import { Product } from './types';
import { useCustomizerStore } from './store/useCustomizerStore';
import {
  generateRouteSchema,
  injectOrUpdateSchemaScript,
  updateDocumentMetadata,
  SITE_CONFIG,
} from './lib/seoMetadata';
import { Loader2 } from 'lucide-react';
import { RoomId } from './lib/storefront';

export type AppRoute = 'home' | 'customizer' | 'checkout' | 'success' | 'tracking';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [activeOrderNumber, setActiveOrderNumber] = useState<string>('FG-849201-B3X');
  const [isDeskPlannerOpen, setIsDeskPlannerOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeRoom, setActiveRoom] = useState<RoomId>('all');
  const { currentProduct, setProduct } = useCustomizerStore();

  // Listen to browser URL or query params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const routeParam = params.get('route');
    const orderNum = params.get('order_number');
    const sessionId = params.get('session_id');
    const plannerParam = params.get('planner');

    if (plannerParam === 'true' || plannerParam === '1') {
      setIsDeskPlannerOpen(true);
    }

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

  // Compute active dynamic Schema.org structured data graph
  const activeSchemaGraph = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : SITE_CONFIG.url;
    return generateRouteSchema(currentRoute, currentProduct, origin);
  }, [currentRoute, currentProduct]);

  // Synchronize document head metadata and Schema.org script on route and product changes
  useEffect(() => {
    const origin = window.location.origin;

    // Inject or update application/ld+json script element in document.head
    injectOrUpdateSchemaScript(activeSchemaGraph);

    // Synchronize OpenGraph, Twitter, canonical, and indexing robots directives
    if (currentRoute === 'home') {
      updateDocumentMetadata({
        title: SITE_CONFIG.defaultTitle,
        description: SITE_CONFIG.defaultDescription,
        canonicalUrl: origin,
        ogType: 'website',
        ogTitle: SITE_CONFIG.defaultTitle,
        ogDescription: SITE_CONFIG.defaultDescription,
        ogImage: SITE_CONFIG.ogImageUrl,
        twitterTitle: SITE_CONFIG.defaultTitle,
        twitterDescription: SITE_CONFIG.defaultDescription,
        twitterImage: SITE_CONFIG.ogImageUrl,
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      });
    } else if (currentRoute === 'customizer') {
      const prodTitle = currentProduct ? currentProduct.title : 'Custom 3D Print';
      const prodDesc = currentProduct
        ? `Customize ${currentProduct.title} to your exact specifications in real-time 3D.`
        : 'Design custom 3D prints, made-to-measure organizers, and gadgets in real-time 3D.';
      const prodImage = currentProduct?.images?.[0]
        ? currentProduct.images[0].startsWith('http')
          ? currentProduct.images[0]
          : `${origin}${currentProduct.images[0].startsWith('/') ? '' : '/'}${currentProduct.images[0]}`
        : SITE_CONFIG.ogImageUrl;
      const customizerCanonical = `${origin}/?route=customizer${
        currentProduct ? `&product=${encodeURIComponent(currentProduct.slug)}` : ''
      }`;

      updateDocumentMetadata({
        title: `${prodTitle} // Custom 3D Studio | Wavezly`,
        description: prodDesc,
        canonicalUrl: customizerCanonical,
        ogType: 'product',
        ogTitle: `${prodTitle} | Real-Time 3D Customizer`,
        ogDescription: prodDesc,
        ogImage: prodImage,
        twitterTitle: `${prodTitle} | Wavezly Studio`,
        twitterDescription: prodDesc,
        twitterImage: prodImage,
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      });
    } else if (currentRoute === 'checkout') {
      updateDocumentMetadata({
        title: 'Secure Checkout | Wavezly',
        description:
          'Fast domestic shipping and custom 3D on-demand crafting with Wavezly 100% Fit Guarantee.',
        canonicalUrl: `${origin}/?route=checkout`,
        ogType: 'website',
        robots: 'noindex, nofollow',
      });
    } else if (currentRoute === 'tracking') {
      updateDocumentMetadata({
        title: 'Real-Time Order Tracking & Delivery Status | Wavezly',
        description:
          'Track your custom workshop craft and USPS Priority fast-ship packages in real time.',
        canonicalUrl: `${origin}/?route=tracking`,
        ogType: 'website',
        robots: 'index, follow, max-image-preview:large',
      });
    } else if (currentRoute === 'success') {
      updateDocumentMetadata({
        title: 'Order Confirmed! Your Custom Order is in Our Workshop | Wavezly',
        description:
          'Your custom order has been received and scheduled for made-to-measure crafting.',
        canonicalUrl: `${origin}/?route=success`,
        ogType: 'website',
        robots: 'noindex, nofollow',
      });
    }
  }, [currentRoute, currentProduct, activeSchemaGraph]);

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
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-brand-dark selection:bg-brand-orange selection:text-white antialiased transition-colors font-sans overflow-x-hidden w-full">
      {/* Schema.org In-DOM JSON-LD Script Tag */}
      <script
        id="wavezly-schema-vdom"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(activeSchemaGraph) }}
      />

      {/* Global Header */}
      <Header
        currentRoute={
          currentRoute === 'home' || currentRoute === 'customizer' || currentRoute === 'tracking'
            ? currentRoute
            : 'home'
        }
        onNavigate={(r) => handleNavigate(r)}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        activeRoom={activeRoom}
        onSelectRoom={setActiveRoom}
      />

      {/* Main Viewport Enclave */}
      <main className="flex-1">
        <ErrorBoundary fallbackTitle="Wavezly Viewport Recovery">
          <Suspense
            fallback={
              <div className="min-h-[500px] flex items-center justify-center font-mono text-xs text-zinc-500 space-x-2">
                <Loader2 className="w-5 h-5 text-brand-orange animate-spin" />
                <span>Loading…</span>
              </div>
            }
          >
            {currentRoute === 'home' && (
              <HomePage
                onNavigateToCustomizer={() => handleNavigate('customizer')}
                onCustomizeProduct={handleCustomizeProduct}
                searchQuery={searchQuery}
                activeRoom={activeRoom}
                onSelectRoom={setActiveRoom}
              />
            )}

            {currentRoute === 'customizer' && (
              <CustomizerPage onNavigateHome={() => handleNavigate('home')} />
            )}

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

      {/* Spatial Workplace Architect: 2D Desk Planner Modal */}
      <DeskPlannerModal
        isOpen={isDeskPlannerOpen}
        onClose={() => setIsDeskPlannerOpen(false)}
      />

      {/* Global Slide-Out Split-Cart Drawer */}
      <CartDrawer onCheckout={() => handleNavigate('checkout')} />

      {/* Industrial Footer */}
      <Footer />
    </div>
  );
};
