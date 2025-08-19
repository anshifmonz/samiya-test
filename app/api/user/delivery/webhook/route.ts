import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from 'lib/supabase';
import { type ShiprocketWebhookPayload } from 'lib/shiprocket/types';

export const dynamic = 'force-dynamic';

// Basic webhook endpoint for Shiprocket tracking/status updates
export async function POST(request: NextRequest) {
  try {
    const raw = await request.text();
    let payload: ShiprocketWebhookPayload;
    try {
      payload = JSON.parse(raw);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Extract identifiers
    const srOrderId = payload.order_id?.toString();
    const srShipmentId = payload.shipment_id?.toString();
    const awb = payload.awb_code;
    const currentStatus = payload.current_status?.toLowerCase();

    if (!srOrderId && !srShipmentId && !awb) {
      return NextResponse.json({ message: 'Ignored: no identifiers' }, { status: 200 });
    }

    // Find local order by Shiprocket IDs or AWB
    let query = supabaseAdmin
      .from('orders')
      .select('id, shiprocket_order_id, shiprocket_shipment_id, shiprocket_awb_code, status')
      .limit(1);

    if (srOrderId) query = query.eq('shiprocket_order_id', srOrderId);
    else if (srShipmentId) query = query.eq('shiprocket_shipment_id', srShipmentId);
    else if (awb) query = query.eq('shiprocket_awb_code', awb);

    const { data: order, error: findErr } = await query.single();
    if (findErr || !order) {
      return NextResponse.json({ message: 'Order not found for webhook' }, { status: 200 });
    }

    // Map Shiprocket current_status to local order status if meaningful
    const statusMap: Record<string, string> = {
      delivered: 'delivered',
      cancelled: 'cancelled',
      rto_initiated: 'return_initiated',
      rto_delivered: 'returned',
      in_transit: 'shipped',
      shipped: 'shipped',
      picked_up: 'processing'
    };

    const nextStatus = currentStatus && statusMap[currentStatus];

    const update: any = {
      shiprocket_webhook_payload: payload,
      updated_at: new Date().toISOString()
    };

    if (awb && !order.shiprocket_awb_code) update.shiprocket_awb_code = awb;
    if (payload.tracking_url) update.shiprocket_tracking_url = payload.tracking_url;
    if (nextStatus) update.status = nextStatus; // advance status based on SR event

    await supabaseAdmin.from('orders').update(update).eq('id', order.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Shiprocket webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

