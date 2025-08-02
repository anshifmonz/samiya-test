import React, { useMemo } from 'react';
import { useActivityLogsContext } from 'contexts/ActivityLogsContext';
import { SelectFilter } from './SelectFilter';
import { SelectFilterOption } from './types';

interface StatusFilterProps {
  value: string;
}

export const StatusFilter: React.FC<StatusFilterProps> = ({ value }) => {
  const { getUniqueStatuses, updateFilter } = useActivityLogsContext();

  const statusOptions: SelectFilterOption[] = useMemo(() => {
    const uniqueStatuses = getUniqueStatuses();
    return uniqueStatuses.map(status => ({
      value: status,
      label: status.charAt(0).toUpperCase() + status.slice(1)
    }));
  }, [getUniqueStatuses]);

  return (
    <SelectFilter
      value={value}
      onChange={v => updateFilter('status', v)}
      options={statusOptions}
      label="Status"
      placeholder="Select status"
      id="status"
      allLabel="All Statuses"
    />
  );
};
