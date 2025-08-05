'use client';

import { Button } from 'ui/button';
import { Checkbox } from 'ui/checkbox';
import { Card, CardContent } from 'ui/card';

interface SelectAllControlsProps {
  allSelected: boolean;
  onSelectAll: () => void;
  onDeselectAll: () => void;
}

const SelectAllControls = ({ allSelected, onSelectAll, onDeselectAll }: SelectAllControlsProps) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => {
                if (checked) onSelectAll();
                else onDeselectAll();
              }}
            />
            <span className="font-medium">Select All Items</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onSelectAll}>
              Select All
            </Button>
            <Button variant="ghost" size="sm" onClick={onDeselectAll}>
              Deselect All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectAllControls;
