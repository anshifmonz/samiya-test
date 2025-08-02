import React, { useMemo } from 'react';
import { useActivityLogsContext } from 'contexts/ActivityLogsContext';
import { SelectFilter } from './SelectFilter';
import { SelectFilterOption } from './types';

interface IpAddressFilterProps {
  value: string;
}

export const IpAddressFilter: React.FC<IpAddressFilterProps> = ({ value }) => {
  const { getUniqueIpAddresses, updateFilter } = useActivityLogsContext();

  const ipOptions: SelectFilterOption[] = useMemo(() => {
    const uniqueIpAddresses = getUniqueIpAddresses();
    return (uniqueIpAddresses || []).map(ip => ({
      value: ip,
      label: ip
    }));
  }, [getUniqueIpAddresses]);

  return (
    <SelectFilter
      value={value}
      onChange={v => updateFilter('ipAddress', v)}
      options={ipOptions}
      label="IP Address"
      placeholder="Select IP"
      id="ipAddress"
      allLabel="All IPs"
    />
  );
};
