import { NextRequest } from 'next/server';
import { GET as handleGET } from './get';
import { POST as handlePOST } from './add';
import { PUT as handlePUT } from './update';
import { DELETE as handleDELETE } from './delete';

export async function GET() {
  return handleGET();
}

export async function POST(request: NextRequest) {
  return handlePOST(request);
}

export async function PUT(request: NextRequest) {
  return handlePUT(request);
}

export async function DELETE(request: NextRequest) {
  return handleDELETE(request);
}
