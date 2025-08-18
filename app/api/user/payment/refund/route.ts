import { NextRequest } from 'next/server';
import { POST as POSTHandler } from './post';
import { GET as GETHandler } from './get';

export async function POST(request: NextRequest) {
  return POSTHandler(request);
}

export async function GET(request: NextRequest) {
  return GETHandler(request);
}
