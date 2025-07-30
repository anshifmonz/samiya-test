import { NextRequest } from 'next/server'
import { GET as handleGET } from './get'
import { POST as handlePOST } from './create'
import { PUT as handlePUT } from './update'
import { PATCH as handlePATCH } from './update'
import { DELETE as handleDELETE } from './delete'

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return handleGET(request)
}

export async function POST(request: NextRequest) {
  return handlePOST(request)
}

export async function PUT(request: NextRequest) {
  return handlePUT(request)
}

export async function PATCH(request: NextRequest) {
  return handlePATCH(request)
}

export async function DELETE(request: NextRequest) {
  return handleDELETE(request)
}
