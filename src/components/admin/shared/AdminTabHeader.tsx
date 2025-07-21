import React from 'react';
import AdminSearchBar from './AdminSearchBar';
import AdminTabHeaderButton from './AdminTabHeaderButton';

interface AdminTabHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
  addLabel: string;
  children?: React.ReactNode; // For icon
  buttonClassName?: string;
  additionalActions?: React.ReactNode;
}

const AdminTabHeader: React.FC<AdminTabHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddClick,
  addLabel,
  children,
  buttonClassName = '',
  additionalActions,
}) => (
  <div className="flex flex-row md:flex-row gap-4 items-start md:items-center justify-between mb-8">
    <div className="flex-1 max-w-2xl">
      <AdminSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
    </div>
    <div className="flex items-center space-x-3">
      {additionalActions}
      <AdminTabHeaderButton
        onClick={onAddClick}
        label={addLabel}
        className={buttonClassName}
      >
        {children}
      </AdminTabHeaderButton>
    </div>
  </div>
);

export default AdminTabHeader;
