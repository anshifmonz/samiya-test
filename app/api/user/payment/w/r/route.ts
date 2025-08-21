import { NextRequest } from 'next/server';
import { POST as handlePOST } from './post';
import { GET as handleGET } from './get';

export async function GET() {
  return handleGET();
}

export async function POST(request: NextRequest) {
  return handlePOST(request);
}
