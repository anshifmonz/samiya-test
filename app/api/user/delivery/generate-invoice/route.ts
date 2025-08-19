import { NextRequest } from 'next/server';
import { SRGenerateInvoice } from 'lib/shiprocket';
import { err, jsonResponse } from 'utils/api/response';

export async function POST(request: NextRequest) {
  try {
    const { localOrderId } = await request.json();
    if (!localOrderId) return jsonResponse(err('Missing required field: localOrderId', 400));

    const result = await SRGenerateInvoice(localOrderId);
    return jsonResponse(result);
  } catch (error: any) {
    return jsonResponse(err('Failed to generate invoice'));
  }
}
