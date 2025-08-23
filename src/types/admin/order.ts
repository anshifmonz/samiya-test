export type EventRow = {
  id: string;
  order_id: string | null;
  status_id: number | null;
  local_status_id: number | null; // e.g. 1,2,3,4,5
  previous_statuses: number[]; // array like [1, 2, 3, 4, ...90]
  manual_attempts: number;
  event_time: string | null;
  status_text?: string | null;
  description?: string | null;
  when_arises?: string | null;
  follow_up_action?: string | null;
  actions?: string | null;
};

export type Summary = {
  total_events: number;
  by_action: Record<string, number>; // e.g. { normal: 120, refund: 4, retry: 10, return: 8, cancelled: 2 }
  total_actions_needed: number; // sum of actionable items
};

export type ApiResponseData = {
  events: EventRow[];
  summary: Summary;
};
