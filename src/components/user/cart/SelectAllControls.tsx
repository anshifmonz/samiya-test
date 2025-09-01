'use client';

import { Button } from 'ui/button';
import { Checkbox } from 'ui/checkbox';
import { Card, CardContent } from 'ui/card';
import { useCartContext } from 'contexts/user/CartContext';

const SelectAllControls = () => {
  const {
    cartItems,
    selectedItems,
    handleSelectAll,
    handleDeselectAll
  } = useCartContext();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedItems.length === cartItems.length}
              onCheckedChange={checked => {
                if (checked) handleSelectAll();
                else handleDeselectAll();
              }}
            />
          </div>
          <div className="flex sm:gap-2">
            <Button variant="ghost" size="sm" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDeselectAll}>
              Deselect All
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectAllControls;
