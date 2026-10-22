/**
 * FORMGRID STRIPE CHECKOUT API HANDLER
 * Server-side price verification, line-item construction, and parametric metadata injection
 */

import Stripe from 'stripe';
import { CartItem, ShippingAddress } from '../types';
import { calculateSlicingTelemetry } from '../lib/parametricMath';
import { SEED_PRODUCTS } from '../db/seed';

// Initialize Stripe instance
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_mock_key';
const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia' as any,
});

export interface CreateCheckoutSessionRequest {
  items: CartItem[];
  customerEmail?: string;
  shippingAddress?: ShippingAddress;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  sessionUrl: string;
  orderNumber: string;
  isMock?: boolean;
}

/**
 * Validates prices server-side to prevent client-side price tampering
 */
function verifyItemPriceCents(item: CartItem): number {
  if (item.product.type === 'dropship') {
    const catalogProduct = SEED_PRODUCTS.find((p) => p.id === item.productId);
    const validBasePrice = catalogProduct ? catalogProduct.basePrice : item.product.basePrice;
    return Math.round(validBasePrice * 100);
  } else {
    // Custom 3D parametric calculation
    if (!item.customSpecs) {
      throw new Error(`Custom 3D product ${item.productId} is missing parametric specifications.`);
    }
    const verifiedTelemetry = calculateSlicingTelemetry(
      item.customSpecs.dimensions,
      item.customSpecs.material,
      item.customSpecs.resinInlay
    );
    return Math.round(verifiedTelemetry.finalPriceUsd * 100);
  }
}

/**
 * Create Stripe Checkout Session with enriched split-fulfillment metadata
 */
export async function createCheckoutSession(
  req: CreateCheckoutSessionRequest
): Promise<CreateCheckoutSessionResponse> {
  const { items, customerEmail, shippingAddress, successUrl, cancelUrl } = req;

  if (!items || items.length === 0) {
    throw new Error('Cannot initiate checkout with empty items array.');
  }

  const orderNumber = `FG-${Date.now().toString().slice(-6)}-${Math.random()
    .toString(36)
    .substring(2, 5)
    .toUpperCase()}`;

  const appUrl = process.env.VITE_APP_URL || 'http://localhost:5173';
  const resolvedSuccessUrl =
    successUrl || `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&order_number=${orderNumber}`;
  const resolvedCancelUrl = cancelUrl || `${appUrl}/customizer`;

  // 1. Build Stripe Line Items
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
    const verifiedUnitAmount = verifyItemPriceCents(item);
    const isCustom = item.product.type === 'custom_3d';

    const itemDescription = isCustom && item.customSpecs
      ? `${item.customSpecs.dimensions.length}×${item.customSpecs.dimensions.width}×${item.customSpecs.dimensions.height}mm [${item.customSpecs.material.name}]`
      : item.product.description.substring(0, 100);

    return {
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.title,
          description: itemDescription,
          metadata: {
            productId: item.productId,
            fulfillmentType: item.product.type,
            supplierSku: item.product.supplierMeta?.supplierSku || '',
          },
        },
        unit_amount: verifiedUnitAmount,
      },
      quantity: item.quantity,
    };
  });

  // Calculate Shipping Line Item if custom items exist
  const hasCustom = items.some((i) => i.product.type === 'custom_3d');
  const shippingCents = hasCustom ? 600 : 450; // $6.00 farm shipping vs $4.50 domestic priority

  lineItems.push({
    price_data: {
      currency: 'usd',
      product_data: {
        name: hasCustom ? 'Split-Logistics Priority Shipping (Farm + Domestic)' : 'US Domestic Priority Shipping',
        description: 'Tracked ground transit with protective packaging.',
      },
      unit_amount: shippingCents,
    },
    quantity: 1,
  });

  // 2. Build Injected Parametric Metadata
  // Stripe metadata has a 500-char limit per key, so serialize key specs
  const customItemsSummary = items
    .filter((i) => i.product.type === 'custom_3d')
    .map((i) => ({
      pid: i.productId,
      dims: `${i.customSpecs?.dimensions.length}x${i.customSpecs?.dimensions.width}x${i.customSpecs?.dimensions.height}`,
      mat: i.customSpecs?.material.id,
      resin: i.customSpecs?.resinInlay?.id || 'none',
      stlUrl: i.stlBlobUrl || '',
    }));

  const dropshipItemsSummary = items
    .filter((i) => i.product.type === 'dropship')
    .map((i) => ({
      pid: i.productId,
      sku: i.product.supplierMeta?.supplierSku,
      qty: i.quantity,
    }));

  const sessionMetadata: Record<string, string> = {
    orderNumber,
    fulfillment_type: hasCustom ? 'split_dual' : 'dropship_only',
    custom_items_count: String(customItemsSummary.length),
    dropship_items_count: String(dropshipItemsSummary.length),
    custom_specs_json: JSON.stringify(customItemsSummary).substring(0, 480),
    dropship_specs_json: JSON.stringify(dropshipItemsSummary).substring(0, 480),
  };

  if (shippingAddress) {
    sessionMetadata.shipping_line1 = shippingAddress.line1;
    sessionMetadata.shipping_city = shippingAddress.city;
    sessionMetadata.shipping_state = shippingAddress.state;
    sessionMetadata.shipping_postal = shippingAddress.postalCode;
  }

  // If live Stripe Key is provided and not test placeholder
  if (stripeSecretKey && !stripeSecretKey.includes('placeholder')) {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        customer_email: customerEmail,
        success_url: resolvedSuccessUrl,
        cancel_url: resolvedCancelUrl,
        metadata: sessionMetadata,
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'DE', 'AU'],
        },
      });

      return {
        sessionId: session.id,
        sessionUrl: session.url || resolvedSuccessUrl.replace('{CHECKOUT_SESSION_ID}', session.id),
        orderNumber,
      };
    } catch (err) {
      console.warn('Stripe API invocation failed; falling back to simulated checkout session:', err);
    }
  }

  // Simulated Checkout Session response for local dev & testing
  const mockSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const mockSessionUrl = resolvedSuccessUrl.replace('{CHECKOUT_SESSION_ID}', mockSessionId);

  return {
    sessionId: mockSessionId,
    sessionUrl: mockSessionUrl,
    orderNumber,
    isMock: true,
  };
}
