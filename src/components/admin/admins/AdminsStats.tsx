import React from 'react';

interface AdminsStatsProps {
  adminsCountText: string;
}

const AdminsStats: React.FC<AdminsStatsProps> = ({
  adminsCountText,
}) => {
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
