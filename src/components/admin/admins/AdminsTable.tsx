import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { Button } from '../../ui/button';
import { AdminUser } from 'types/admin';

interface AdminsTableProps {
  loading: boolean;
  error: string | null;
  filteredAdmins: AdminUser[];
  currentAdmin: AdminUser | null;
  deleteLoading: string | null;
  onEdit: (admin: AdminUser) => void;
  onDelete: (admin: AdminUser) => void;
  isSuperAdmin: boolean;
}

const AdminsTable: React.FC<AdminsTableProps> = ({
  loading,
  error,
  filteredAdmins,
  currentAdmin,
  deleteLoading,
  onEdit,
  onDelete,
  isSuperAdmin,
}) => {
  if (error) {
    return (
      <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-luxury-gray/20 bg-white/95 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-luxury-gray/20">
          <thead className="bg-luxury-gray/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-luxury-gray uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-luxury-gray uppercase tracking-wider">
                Super Admin
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium text-luxury-gray uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-luxury-gray/10">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center">
                  <div className="flex items-center justify-center space-x-2 text-luxury-gray">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-luxury-gold"></div>
                    <span className="text-sm">Loading admins...</span>
                  </div>
                </td>
              </tr>
            ) : filteredAdmins.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center">
                  <div className="text-luxury-gray">
                    <p className="text-sm font-medium">No admins found</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-luxury-gray/5 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 w-8 bg-luxury-gold/10 rounded-full flex items-center justify-center">
                        <span className="text-luxury-gold font-medium text-sm">
                          {admin.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-luxury-black">{admin.username}</p>
                        <p className="text-xs text-luxury-gray">ID: {admin.id.slice(0, 8)}...</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      admin.is_superuser
                        ? 'bg-luxury-gold/10 text-luxury-gold'
                        : 'bg-luxury-gray/10 text-luxury-gray'
                    }`}>
                      {admin.is_superuser ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      {/* show edit button for own account or if super admin */}
                      {currentAdmin && (currentAdmin.id === admin.id || isSuperAdmin) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(admin)}
                          className="text-luxury-gold hover:text-yellow-500 hover:bg-yellow-50"
                        >
                          <Edit size={16} />
                        </Button>
                      )}
                      {/* only show delete if current admin is super admin and target is not a super admin and not current admin */}
                      {isSuperAdmin && !admin.is_superuser && currentAdmin?.id !== admin.id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(admin)}
                          disabled={deleteLoading === admin.id}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminsTable;
