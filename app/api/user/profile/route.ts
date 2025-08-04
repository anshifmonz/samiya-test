import { NextRequest } from 'next/server';
import { GET as handleGET } from './get';

export async function GET(request: NextRequest) {
  return handleGET(request);
}

