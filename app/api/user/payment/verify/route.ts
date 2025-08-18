import { NextRequest } from 'next/server';
import { GET as handleGET } from './get';
import { POST as handlePOST } from './post';

export async function GET(request: NextRequest) {
  return handleGET(request);
}

export async function POST(request: NextRequest) {
  return handlePOST(request);
}
