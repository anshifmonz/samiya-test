import { supabaseAdmin } from 'lib/supabase';
import { getShiprocketToken } from './shiprocket';
import { apiRequest } from 'utils/apiRequest';
import { ApiResponse, err, ok } from 'utils/api/response';

const SR_BASE = process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in/v1/external';

export interface ShiprocketInvoiceResult {
  contentType: string;
  filename?: string;
  pdfBuffer: Buffer; // PDF binary
}

/**
 * Generate invoice PDF for one or more Shiprocket order IDs.
 */
export async function SRGenerateInvoice(
  srOrderIds: Array<string | number>
): Promise<ApiResponse<ShiprocketInvoiceResult>> {
  if (!srOrderIds || srOrderIds.length === 0) return err('No order IDs provided', 400);

  const token = await getShiprocketToken();
  if (!token) return err();

  const { response } = await apiRequest(`${SR_BASE}/orders/print/invoice`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/pdf'
    },
    body: { ids: srOrderIds },
    retry: true
  });

  const contentType = response?.headers.get('content-type') || 'application/octet-stream';

  if (contentType.includes('application/json')) return err('Failed to generate invoice');

  const arrBuf = await response!.arrayBuffer();
  if (response && !response.ok) return err('Failed to generate invoice');

  const disposition = response?.headers.get('content-disposition') || '';
  const filenameMatch = /filename="?([^";]+)"?/i.exec(disposition || '');
  const filename = filenameMatch?.[1];

  return ok({
    contentType,
    filename,
    pdfBuffer: Buffer.from(arrBuf)
  });
}

/**
 * Convenience: Generate invoice PDF for a local order by looking up its linked Shiprocket order ID.
 */
export async function generateInvoiceForLocalOrder(
  localOrderId: string
): Promise<ApiResponse<ShiprocketInvoiceResult>> {
  try {
    if (!localOrderId) return err('Local order ID is required', 400);

    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .select('id, shiprocket_order_id')
      .eq('id', localOrderId)
      .single();

    if (error) return err();
    if (!order?.shiprocket_order_id) return err('Order not found', 400);
    return await SRGenerateInvoice([order.shiprocket_order_id]);
  } catch (error: any) {
    return err('Unexpected error while generating invoice', 500);
  }
}
