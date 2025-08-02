import React, { useMemo } from 'react';
import { useActivityLogsContext } from 'contexts/ActivityLogsContext';
import { SelectFilter } from './SelectFilter';
import { SelectFilterOption } from './types';

interface AdminFilterProps {
  value: string;
}

export const AdminFilter: React.FC<AdminFilterProps> = ({ value }) => {
  const { getUniqueAdmins, updateFilter } = useActivityLogsContext();

  const adminOptions: SelectFilterOption[] = useMemo(() => {
    const uniqueAdmins = getUniqueAdmins();
    return uniqueAdmins.map(admin => ({
      value: admin.id,
      label: admin.username
    }));
  }, [getUniqueAdmins]);

  return (
    <SelectFilter
      value={value}
      onChange={v => updateFilter('admin', v)}
      options={adminOptions}
      label="Admin"
      placeholder="Select admin"
      id="admin"
      allLabel="All Admins"
    />
  );
};
