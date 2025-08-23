import React, { useMemo } from 'react';
import { useActivityLogsContext } from 'contexts/admin/activity-logs/ActivityLogsContext';
import { SelectFilter } from './SelectFilter';
import { SelectFilterOption } from './types';

interface ActionFilterProps {
  value: string;
}

export const ActionFilter: React.FC<ActionFilterProps> = ({ value }) => {
  const { getUniqueActions, updateFilter } = useActivityLogsContext();

  const actionOptions: SelectFilterOption[] = useMemo(() => {
    const uniqueActions = getUniqueActions();
    return uniqueActions.map(action => ({
      value: action,
      label: action.charAt(0).toUpperCase() + action.slice(1)
    }));
  }, [getUniqueActions]);

  return (
    <SelectFilter
      value={value}
      onChange={v => updateFilter('action', v)}
      options={actionOptions}
      label="Action"
      placeholder="Select action"
      id="action"
      allLabel="All Actions"
    />
  );
};
