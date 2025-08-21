import { NextRequest, NextResponse } from 'next/server';
import { processRefundWebhook } from 'lib/user/payment/w/r/post';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-webhook-signature');
  const timestamp = req.headers.get('x-webhook-timestamp');
  const rawBody = await req.text();

  const status = await processRefundWebhook(signature, timestamp, rawBody);
  return NextResponse.json({}, { status });
}
