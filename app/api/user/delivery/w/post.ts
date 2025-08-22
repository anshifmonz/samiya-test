import { NextRequest, NextResponse } from 'next/server';
import { processShiprocketWebhook } from 'lib/user/delivery/w/post';

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const status = await processShiprocketWebhook(rawBody);
  return NextResponse.json({}, { status });
}
