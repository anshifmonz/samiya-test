import { NextResponse } from 'next/server';
import { cleanupExpiredReservations } from 'lib/inventory';

export async function GET() {
  const result = await cleanupExpiredReservations();
  return NextResponse.json(result);
}
