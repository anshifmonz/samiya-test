import { NextRequest } from 'next/server';
import { jsonResponse } from 'utils/api/response';
import { getCollections } from 'lib/api/public/collections/get';

export async function GET(_: NextRequest) {
  const result = await getCollections();
  return jsonResponse(result);
}
