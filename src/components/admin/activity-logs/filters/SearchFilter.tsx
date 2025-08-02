import React from 'react';
import { Search } from 'lucide-react';
import { Input } from 'ui/input';
import { Label } from 'ui/label';
import { useActivityLogsContext } from 'contexts/ActivityLogsContext';

interface SearchFilterProps {
  value: string;
  placeholder?: string;
  label?: string;
  id?: string;
}

export const SearchFilter: React.FC<SearchFilterProps> = ({
  value,
  placeholder = 'Search activities...',
  label = 'Search',
  id = 'search'
}) => {
  const { updateFilter } = useActivityLogsContext();

  return (
    <div className="xl:col-span-2">
      <Label htmlFor={id} className="text-admin-foreground text-xs font-medium">
        {label}
      </Label>
      <div className="relative mt-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-admin-muted-foreground" />
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-10 bg-admin-background border-admin-muted text-admin-foreground"
        />
      </div>
    </div>
  );
};
