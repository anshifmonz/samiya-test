import { NextRequest } from 'next/server';
import {GET as handleGET} from './users/get';
import {POST as handlePOST} from './users/register';
import {PATCH as handlePATCH} from './users/edit';
import {DELETE as handleDELETE} from './users/delete';

export const dynamic = 'force-dynamic';

export async function GET() {
  return handleGET()
}

export async function POST(request: NextRequest) {
  return handlePOST(request)
}

export async function PATCH(request: NextRequest) {
  return handlePATCH(request)
}

export async function DELETE(request: NextRequest) {
  return handleDELETE(request)
}
