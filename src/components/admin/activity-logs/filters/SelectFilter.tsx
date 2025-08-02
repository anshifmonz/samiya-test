import React from 'react';
import { Label } from 'ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'ui/select';
import { SelectFilterOption } from './types';

interface SelectFilterProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectFilterOption[];
  label: string;
  placeholder?: string;
  id?: string;
  allLabel?: string;
}

export const SelectFilter: React.FC<SelectFilterProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder,
  id,
  allLabel = `All ${label}s`
}) => {
  return (
    <div>
      <Label htmlFor={id} className="text-admin-foreground text-xs font-medium">
        {label}
      </Label>
      <Select
        value={value}
        onValueChange={onChange}
      >
        <SelectTrigger className="mt-1 bg-admin-background border-admin-muted text-luxury-black">
          <SelectValue placeholder={placeholder || `Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent className="bg-luxury-white border-admin-muted">
          <SelectItem value="all" className="hover:bg-[#fcfafa] data-[highlighted]:bg-[#fcfafa] hover:cursor-pointer">
            {allLabel}
          </SelectItem>
          {options.map(option => (
            <SelectItem key={option.value} value={option.value} className="hover:bg-[#fcfafa] data-[highlighted]:bg-[#fcfafa] hover:cursor-pointer">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
