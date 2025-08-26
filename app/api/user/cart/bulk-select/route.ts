import { NextRequest, NextResponse } from 'next/server';
import { getServerUser } from 'utils/getServerSession';
import { bulkUpdateCartSelection } from 'lib/user/cart';
import { err, jsonResponse } from 'utils/api/response';

export async function PATCH(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user) return jsonResponse(err('Unauthorized access', 401));

    const { isSelected } = await request.json();

    const result = await bulkUpdateCartSelection(user.id, isSelected);
    if (result.error) return jsonResponse(result)

    return jsonResponse(result)
  } catch (_) {
    return jsonResponse(err());
  }
}
