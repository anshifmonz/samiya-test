import React from 'react';
import { Switch } from 'ui/switch';

interface ActiveStatusSwitchProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

const ActiveStatusSwitch: React.FC<ActiveStatusSwitchProps> = ({ label, value, onChange }) => {
  return (
    <div>
      <div className="flex items-center space-x-3">
        <Switch
          id="isActive"
          checked={value}
          onCheckedChange={onChange}
        />
        <label htmlFor="isActive" className="luxury-subheading text-sm text-luxury-black">
          Active {label}
        </label>
      </div>
      <p className="luxury-body text-luxury-gray/70 text-sm mt-4">
        Inactive {label} won't be visible to customers
      </p>
    </div>
  );
};

export default ActiveStatusSwitch;
