import { NextRequest } from 'next/server';
import { getSectionProducts } from 'lib/api/public/collections/get';
import { err, jsonResponse } from 'utils/api/response';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) return jsonResponse(err('Section ID is required', 400));

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    return jsonResponse(await getSectionProducts(id, limit, offset));
  } catch (_) {
    return jsonResponse(err());
  }
}
