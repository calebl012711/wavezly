/**
 * FORMGRID DUAL FULFILLMENT ROUTER
 * Dispatches confirmed orders concurrently into:
 * 1. 3D Print Farm Pipeline (Slant 3D / PrintPort API)
 * 2. Automated Dropship Pipeline (DSers / AutoDS API)
 */

import { Order, DualFulfillmentPayload } from '../../types';
import { dispatchToPrintFarm, PrintFarmJobResponse } from './printFarmAdapter';
import { dispatchToDropshipSupplier, DropshipOrderResponse } from './dropshipAdapter';

export interface FulfillmentDispatchResult {
  orderId: string;
  orderNumber: string;
  processedAt: string;
  farmJobs: Array<{
    orderItemId: string;
    productTitle: string;
    response: PrintFarmJobResponse;
  }>;
  dropshipOrders: Array<{
    orderItemId: string;
    productTitle: string;
    response: DropshipOrderResponse;
  }>;
  overallStatus: 'all_dispatched' | 'partially_dispatched' | 'failed';
}

/**
 * Route order line items according to their strict fulfillment category
 */
export async function routeOrderFulfillment(
  order: Order
): Promise<FulfillmentDispatchResult> {
  const custom3dItems = order.items.filter((item) => item.fulfillmentType === 'custom_3d');
  const dropshipItems = order.items.filter((item) => item.fulfillmentType === 'dropship');

  const farmJobs: FulfillmentDispatchResult['farmJobs'] = [];
  const dropshipOrders: FulfillmentDispatchResult['dropshipOrders'] = [];

  // 1. Process Custom 3D Farm Queue Jobs
  for (const item of custom3dItems) {
    if (!item.parametricSpecs) {
      console.warn(`Order item ${item.id} is custom_3d but missing parametric specs.`);
      continue;
    }

    const stlUrl =
      item.stlStorageUrl ||
      `https://storage.formgrid.io/formgrid-stl-artifacts/orders/${order.id}/part_${item.id}.stl`;

    const farmResponse = await dispatchToPrintFarm({
      orderId: order.id,
      orderItemId: item.id,
      stlStorageUrl: stlUrl,
      productTitle: item.productTitle,
      specs: item.parametricSpecs,
      quantity: item.quantity,
      channel: 'slant3d',
    });

    item.farmJobId = farmResponse.farmJobId;
    item.fulfillmentStatus = 'farm_queued';

    farmJobs.push({
      orderItemId: item.id,
      productTitle: item.productTitle,
      response: farmResponse,
    });
  }

  // 2. Process Fast-Ship Hardware Dropship Items (DSers / AutoDS)
  if (dropshipItems.length > 0) {
    const dropshipRequestItems = dropshipItems.map((item) => ({
      orderItemId: item.id,
      productTitle: item.productTitle,
      sku: item.dsersOrderId || `SKU-${item.productId}`,
      quantity: item.quantity,
    }));

    const dropshipResponse = await dispatchToDropshipSupplier({
      orderId: order.id,
      orderNumber: order.orderNumber,
      shippingAddress: order.shippingAddress,
      items: dropshipRequestItems,
      channel: 'dsers',
    });

    for (const item of dropshipItems) {
      item.dsersOrderId = dropshipResponse.supplierOrderId;
      item.trackingNumber = dropshipResponse.trackingNumber;
      item.trackingUrl = dropshipResponse.trackingUrl;
      item.fulfillmentStatus = 'supplier_dispatched';

      dropshipOrders.push({
        orderItemId: item.id,
        productTitle: item.productTitle,
        response: dropshipResponse,
      });
    }
  }

  // Update overall order status
  if (custom3dItems.length > 0 && dropshipItems.length > 0) {
    order.status = 'partially_shipped'; // Dual-fulfillment in flight
  } else if (custom3dItems.length > 0) {
    order.status = 'farm_queued';
  } else if (dropshipItems.length > 0) {
    order.status = 'supplier_dispatched';
  }

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    processedAt: new Date().toISOString(),
    farmJobs,
    dropshipOrders,
    overallStatus: 'all_dispatched',
  };
}

/**
 * Direct Dispatcher from DualFulfillmentPayload
 */
export async function dispatchDualPayload(
  payload: DualFulfillmentPayload
): Promise<{ farmJobIds: string[]; supplierOrderIds: string[] }> {
  const farmJobIds: string[] = [];
  const supplierOrderIds: string[] = [];

  // Print Farm items
  for (const job of payload.custom3dJobs) {
    const res = await dispatchToPrintFarm({
      orderId: payload.orderId,
      orderItemId: job.orderItemId,
      stlStorageUrl: job.stlStorageUrl,
      productTitle: job.productTitle,
      specs: job.specs,
      quantity: job.quantity,
      channel: job.channel,
    });
    farmJobIds.push(res.farmJobId);
  }

  // Dropship items
  if (payload.dropshipDispatches.length > 0) {
    const res = await dispatchToDropshipSupplier({
      orderId: payload.orderId,
      orderNumber: payload.orderNumber,
      shippingAddress: payload.shippingAddress,
      items: payload.dropshipDispatches.map((d) => ({
        orderItemId: d.orderItemId,
        productTitle: d.productTitle,
        sku: d.sku,
        aliexpressProductId: d.aliexpressProductId,
        aliexpressVariantId: d.aliexpressVariantId,
        quantity: d.quantity,
      })),
      channel: payload.dropshipDispatches[0].channel,
    });
    supplierOrderIds.push(res.supplierOrderId);
  }

  return { farmJobIds, supplierOrderIds };
}
