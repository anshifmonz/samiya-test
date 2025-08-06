import { NextRequest } from 'next/server';
import { GET as handleGET } from './get';
import { POST as handlePOST } from './add';
import { DELETE as handleDELETE } from './delete';
import { PUT as handlePUT } from './update';
import { PATCH as handlePATCH } from './select';

export async function GET() {
  return handleGET()
}

export async function POST(request: NextRequest) {
  return handlePOST(request)
}

export async function PUT(request: NextRequest) {
  return handlePUT(request)
}

export async function DELETE(request: NextRequest) {
  return handleDELETE(request)
}

export async function PATCH(request: NextRequest) {
  return handlePATCH(request)
}
