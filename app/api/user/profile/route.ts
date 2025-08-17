import { NextRequest } from 'next/server';
import { GET as handleGET } from './get';
import { PATCH as handlePATCH } from './update';

export async function GET(request: NextRequest) {
  return handleGET(request);
}

export async function PATCH(request: NextRequest) {
  return handlePATCH(request);
}
