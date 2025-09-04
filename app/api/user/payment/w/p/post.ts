import { NextRequest, NextResponse } from 'next/server';
import { processWebhook } from 'lib/api/user/payment';

export async function POST(request: NextRequest) {
  const signature = request.headers.get('x-webhook-signature');
  const timestamp = request.headers.get('x-webhook-timestamp');
  const rawBody = await request.text();

  const status = await processWebhook(signature, timestamp, rawBody);
  return NextResponse.json({}, { status });
}
