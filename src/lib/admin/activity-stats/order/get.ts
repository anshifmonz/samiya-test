import { supabaseAdmin } from 'lib/supabase';
import { type ApiResponseData } from 'types/admin/order';
import { type ApiResponse, err, ok } from 'utils/api/response';
import { getRowById } from 'utils/shiprocket/mapStatusIdToAdmin';

export async function getOrderActivityStats(
  status_id: number = 3,
  limit: number = 50,
  offset: number = 0
): Promise<ApiResponse<ApiResponseData>> {
  const { data, error } = await supabaseAdmin.rpc('get_latest_order_events_with_summary', {
    p_local_status_id: status_id,
    p_limit: limit,
    p_offset: offset
  });
  if (error || !data) return err('Failed to fetch order activity stats', 500);

  const summary = data.summary || {};
  const events = (data.events || []).map((ev: any) => {
    const statusId = ev.status_id;
    const { status, description, when_it_arises, follow_up_action, action } =
      getRowById(statusId) || {};
    const previousStatuses = (ev.previous_statuses || []).map((s: number | string) => {
      const { status } = getRowById(Number(s));
      return status || null;
    });

    return {
      id: ev.id,
      order_id: ev.order_id,
      status_id: statusId,
      local_status_id: ev.local_status_id,
      previous_statuses: previousStatuses,
      manual_attempts: ev.manual_attempts,
      event_time: ev.event_time,
      status_text: status || null,
      description: description || null,
      when_arises: when_it_arises || null,
      follow_up_action: follow_up_action || null,
      actions: action || null,
    };
  });

  return ok({ events, summary });
}
