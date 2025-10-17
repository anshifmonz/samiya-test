import React from 'react';
import { useAdminsTab } from 'contexts/admin/admins/AdminsContext';

const AdminsStats: React.FC = () => {
  const { adminsCountText } = useAdminsTab();
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <p className="luxury-subheading text-luxury-gold text-sm tracking-wider">
          {adminsCountText}
        </p>
      </div>
    </div>
  );
};

export default AdminsStats;
