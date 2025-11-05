import { jsonResponse } from 'utils/api/response';
import { getCategoryProducts } from 'lib/api/public/categories/[id]/get';

export const GET = async (req: Request, { params }: { params: { id: string } }) => {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  const offset = parseInt(searchParams.get('offset') || '0', 10);
  const categoryId = params.id;

  const result = await getCategoryProducts(categoryId, limit, offset);
  return jsonResponse(result);
};
