import React from 'react';
import { Switch } from 'ui/switch';
import { useAdminProductFormFields } from './AdminProductFormContext';

interface ActiveStatusSwitchProps {
  label?: string;
}

const ActiveStatusSwitch: React.FC<ActiveStatusSwitchProps> = ({ label = "Product" }) => {
  const { formData, handleActiveChange } = useAdminProductFormFields();

  return (
    <div>
      <div className="flex items-center space-x-3">
        <Switch
          id="isActive"
          checked={formData.active}
          onCheckedChange={handleActiveChange}
        />
        <label htmlFor="isActive" className="luxury-subheading text-sm text-luxury-black">
          Active {label}
        </label>
      </div>
      <p className="luxury-body text-luxury-gray/70 text-sm mt-4">
        Inactive {label.toLowerCase()} won't be visible to customers
      </p>
    </div>
  );
};

export default ActiveStatusSwitch;
