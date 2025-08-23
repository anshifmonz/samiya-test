import { getRowById } from 'utils/shiprocket/mapStatusIdToAdmin';
import { EventRow } from 'types/admin/order';

export function useDetailsDialog() {
  const previousStatusText = (previous_statuses: string[] | null) => {
    if (!previous_statuses || previous_statuses.length === 0) return 'N/A';
    let text = '';
    previous_statuses.forEach((status, index) => {
      text += getRowById(Number(status))?.status || status;
      if (index < previous_statuses.length - 1) text += ' -> ';
    });
    return text;
  };

  return { previousStatusText };
}
