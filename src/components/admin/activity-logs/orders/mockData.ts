import { ApiResponseData } from 'types/admin/order';

export const mockData: ApiResponseData = {
  summary: {
    total_events: 154,
    by_action: {
      normal: 120,
      refund: 14,
      retry: 12,
      return: 6,
      cancelled: 2
    },
    total_actions_needed: 34
  },
  events: [
    {
      id: '1',
      order_id: 'ORD-2024-001',
      status_id: 4001,
      local_status_id: 1,
      previous_statuses: [1, 2, 3],
      manual_attempts: 0,
      event_time: '2024-01-15T10:30:00Z',
      status_text: 'return_in_transit',
      description: 'Customer initiated return for damaged item',
      follow_up_action: 'Return in transit',
      actions: 'Initiate return process'
    },
    {
      id: '2',
      order_id: 'ORD-2024-002',
      status_id: 5001,
      local_status_id: 2,
      previous_statuses: [1, 2],
      manual_attempts: 2,
      event_time: '2024-01-15T09:15:00Z',
      status_text: 'payment_failed',
      description: 'Payment processing failed - card declined',
      follow_up_action: 'Payment retry needed',
      actions: 'Payment retry needed'
    },
    {
      id: '3',
      order_id: 'ORD-2024-003',
      status_id: 6001,
      local_status_id: 3,
      previous_statuses: [1, 2],
      manual_attempts: 1,
      event_time: '2024-01-15T08:45:00Z',
      status_text: 'refund_requested',
      description: 'Customer requested refund for wrong item',
      follow_up_action: 'Refund being processed',
      actions: 'Refund being processed'
    },
    {
      id: '4',
      order_id: 'ORD-2024-004',
      status_id: 2001,
      local_status_id: 4,
      previous_statuses: [1, 2, 3, 4],
      manual_attempts: 0,
      event_time: '2024-01-15T07:20:00Z',
      status_text: 'shipped',
      description: 'Order shipped successfully',
      follow_up_action: 'Package is on the way',
      actions: 'Package is on the way'
    },
    {
      id: '5',
      order_id: 'ORD-2024-005',
      status_id: 7001,
      local_status_id: 5,
      previous_statuses: [1],
      manual_attempts: 0,
      event_time: '2024-01-15T06:10:00Z',
      status_text: 'cancelled',
      description: 'Customer cancelled order before processing',
      follow_up_action: 'Order cancelled',
      actions: 'Order cancelled'
    },
    {
      id: '6',
      order_id: 'ORD-2024-006',
      status_id: 5002,
      local_status_id: 6,
      previous_statuses: [1, 2, 3],
      manual_attempts: 3,
      event_time: '2024-01-15T05:30:00Z',
      status_text: 'delivery_failed',
      description: 'Multiple delivery attempts failed - customer unavailable',
      follow_up_action: 'Delivery retry scheduled',
      actions: 'Delivery retry scheduled'
    }
  ]
};
