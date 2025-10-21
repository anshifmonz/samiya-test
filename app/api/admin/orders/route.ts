import { supabaseAdmin } from 'lib/supabase';
import { ok, err, jsonResponse } from 'src/lib/utils/api/response';

const DEFAULT_PAGE_SIZE = 20;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get('query');
  const status = searchParams.get('status');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');
  const sortBy = searchParams.get('sortBy') || 'created_at';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || `${DEFAULT_PAGE_SIZE}`, 10);

  try {
    const { data, error } = await supabaseAdmin.rpc('search_orders', {
      p_query: query,
      p_status: status,
      p_start_date: startDate,
      p_end_date: endDate,
      p_sort_by: sortBy,
      p_sort_order: sortOrder,
      p_page_num: page,
      p_page_size: pageSize
    });

    if (error) return jsonResponse(err('Failed to fetch orders', 500));

    const totalCount = data?.[0]?.total_count || 0;
    return jsonResponse(
      ok({
        data: data?.map(({ total_count, ...rest }) => rest) || [],
        meta: {
          page,
          pageSize,
          total: totalCount,
          totalPages: Math.ceil(totalCount / pageSize)
        }
      })
    );
  } catch (_) {
    return jsonResponse(err());
  }
}
