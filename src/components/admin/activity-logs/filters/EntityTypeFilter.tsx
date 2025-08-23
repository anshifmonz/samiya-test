import React, { useMemo } from 'react';
import { useActivityLogsContext } from 'contexts/admin/activity-logs/ActivityLogsContext';
import { SelectFilter } from './SelectFilter';
import { SelectFilterOption } from './types';

interface EntityTypeFilterProps {
  value: string;
}

export const EntityTypeFilter: React.FC<EntityTypeFilterProps> = ({ value }) => {
  const { getUniqueEntityTypes, updateFilter } = useActivityLogsContext();

  const entityTypeOptions: SelectFilterOption[] = useMemo(() => {
    const uniqueEntityTypes = getUniqueEntityTypes();
    return uniqueEntityTypes.map(entityType => ({
      value: entityType,
      label: entityType.charAt(0).toUpperCase() + entityType.slice(1)
    }));
  }, [getUniqueEntityTypes]);

  return (
    <SelectFilter
      value={value}
      onChange={v => updateFilter('entityType', v)}
      options={entityTypeOptions}
      label="Entity Type"
      placeholder="Select entity"
      id="entityType"
      allLabel="All Entities"
    />
  );
};
