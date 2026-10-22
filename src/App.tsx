/**
 * FORMGRID APPLICATION ROOT
 * Routing orchestration, global error boundaries, split-cart drawer, announcement ticker,
 * layout wrapping, and dynamic Schema.org JSON-LD / SEO meta injection.
 */

import React, { useState, useEffect, useMemo, Suspense } from 'react';
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
import {
  generateRouteSchema,
  injectOrUpdateSchemaScript,
  updateDocumentMetadata,
  SITE_CONFIG,
} from './lib/seoMetadata';
import { Loader2 } from 'lucide-react';

export type AppRoute = 'home' | 'customizer' | 'checkout' | 'success' | 'tracking';

export const App: React.FC = () => {
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [activeOrderNumber, setActiveOrderNumber] = useState<string>('FG-849201-B3X');
  const { currentProduct, setProduct } = useCustomizerStore();

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
        title: 'FORMGRID | Precision Parametric Desktop Architecture',
        description: SITE_CONFIG.defaultDescription,
        canonicalUrl: origin,
        ogType: 'website',
        ogTitle: 'FORMGRID | Precision Parametric Desktop Architecture',
        ogDescription: SITE_CONFIG.defaultDescription,
        ogImage: SITE_CONFIG.ogImageUrl,
        twitterTitle: 'FORMGRID | Precision Parametric Desktop Architecture',
        twitterDescription: SITE_CONFIG.defaultDescription,
        twitterImage: SITE_CONFIG.ogImageUrl,
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      });
    } else if (currentRoute === 'customizer') {
      const prodTitle = currentProduct ? currentProduct.title : 'Parametric Desktop Hardware';
      const prodDesc = currentProduct
        ? `Configure ${currentProduct.title} to custom sub-millimeter drawer dimensions in real-time 3D WebGL.`
        : 'Configure custom millimeter desktop organizers in real-time 3D WebGL.';
      const prodImage = currentProduct?.images?.[0]
        ? currentProduct.images[0].startsWith('http')
          ? currentProduct.images[0]
          : `${origin}${currentProduct.images[0].startsWith('/') ? '' : '/'}${currentProduct.images[0]}`
        : SITE_CONFIG.ogImageUrl;
      const customizerCanonical = `${origin}/?route=customizer${
        currentProduct ? `&product=${encodeURIComponent(currentProduct.slug)}` : ''
      }`;

      updateDocumentMetadata({
        title: `${prodTitle} // 3D Parametric Studio | FORMGRID`,
        description: prodDesc,
        canonicalUrl: customizerCanonical,
        ogType: 'product',
        ogTitle: `${prodTitle} | Real-Time Parametric Customizer`,
        ogDescription: prodDesc,
        ogImage: prodImage,
        twitterTitle: `${prodTitle} | FORMGRID Studio`,
        twitterDescription: prodDesc,
        twitterImage: prodImage,
        robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      });
    } else if (currentRoute === 'checkout') {
      updateDocumentMetadata({
        title: 'Secure Order Dispatch & Split Logistics | FORMGRID',
        description:
          'Bifurcated domestic hardware fulfillment checkout for 3D printed components and fast-ship accessories.',
        canonicalUrl: `${origin}/?route=checkout`,
        ogType: 'website',
        robots: 'noindex, nofollow',
      });
    } else if (currentRoute === 'tracking') {
      updateDocumentMetadata({
        title: 'Real-Time Order Telemetry & Logistics HUD | FORMGRID',
        description:
          'Track domestic print farm job queues and USPS Priority fast-ship domestic packages.',
        canonicalUrl: `${origin}/?route=tracking`,
        ogType: 'website',
        robots: 'index, follow, max-image-preview:large',
      });
    } else if (currentRoute === 'success') {
      updateDocumentMetadata({
        title: 'Order Confirmed // Farm Queued | FORMGRID',
        description:
          'Your bespoke hardware order has been received and queued into the autonomous Bambu farm print pipeline.',
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
    <div className="min-h-screen flex flex-col bg-background text-zinc-100 selection:bg-signal-orange selection:text-black">
      {/* Schema.org In-DOM JSON-LD Script Tag */}
      <script
        id="formgrid-schema-vdom"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(activeSchemaGraph) }}
      />

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
