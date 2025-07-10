import React from 'react';

interface AdminTabHeaderButtonProps {
  onClick: () => void;
  children?: React.ReactNode; // For icon
  label: string;
  className?: string;
}

const AdminTabHeaderButton: React.FC<AdminTabHeaderButtonProps> = ({
  onClick,
  children,
  label,
  className = '',
}) => (
  <button
    onClick={onClick}
    className={`luxury-btn-primary xs:px-3 px-4 py-3 sm:px-6 sm:py-3 rounded-xl font-medium text-xs sm:text-sm tracking-wider uppercase shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 ${className}`}
  >
    {children}
    <span className="xs:hidden">{label}</span>
  </button>
);

export default AdminTabHeaderButton;
