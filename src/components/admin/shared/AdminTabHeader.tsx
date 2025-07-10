import React from 'react';
import AdminSearchBar from '../AdminSearchBar';
import AdminTabHeaderButton from './AdminTabHeaderButton';

interface AdminTabHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddClick: () => void;
  addLabel: string;
  children?: React.ReactNode; // For icon
  buttonClassName?: string;
}

const AdminTabHeader: React.FC<AdminTabHeaderProps> = ({
  searchQuery,
  onSearchChange,
  onAddClick,
  addLabel,
  children,
  buttonClassName = '',
}) => (
  <div className="flex flex-row md:flex-row gap-4 items-start md:items-center justify-between mb-8">
    <div className="flex-1 max-w-2xl">
      <AdminSearchBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
      />
    </div>
    <AdminTabHeaderButton
      onClick={onAddClick}
      label={addLabel}
      className={buttonClassName}
    >
      {children}
    </AdminTabHeaderButton>
  </div>
);

export default AdminTabHeader;
