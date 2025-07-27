import { UserPlus } from 'lucide-react';
import { useAdminsTab } from 'contexts/admin/AdminsTabContext';

const EditAdminModal: React.FC = () => {
  const {
    editDialog,
    editUsername,
    editPassword,
    editSuper,
    editError,
    editLoading,
    currentAdmin,
    admins,
    handleEditAdmin,
    handleCancelEditForm,
    setEditUsername,
    setEditPassword,
    setEditSuper,
  } = useAdminsTab();

  if (!editDialog) return null;

  return (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex items-center space-x-3 p-6 border-b border-luxury-gray/20">
          <div className="flex-shrink-0 h-10 w-10 bg-luxury-gold/10 rounded-full flex items-center justify-center">
            <UserPlus size={20} className="text-luxury-gold" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-luxury-black">Edit Admin</h3>
            <p className="text-sm text-luxury-gray">Update admin account settings</p>
          </div>
        </div>
        <form onSubmit={handleEditAdmin} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-luxury-black mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-200"
              value={editUsername}
              onChange={e => setEditUsername(e.target.value)}
              required
              disabled={!currentAdmin?.is_superuser && editDialog?.id !== currentAdmin?.id}
            />
            <p className="text-xs text-luxury-gray mt-1">
              {editDialog?.id === currentAdmin?.id && "You can change your own username and password"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-luxury-black mb-2">Password (leave blank to keep unchanged)</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-200"
              value={editPassword}
              onChange={e => setEditPassword(e.target.value)}
              disabled={!currentAdmin?.is_superuser && editDialog?.id !== currentAdmin?.id}
            />
            <p className="text-xs text-luxury-gray mt-1">
              {editDialog?.id === currentAdmin?.id
                ? "You can change your own username and password"
                : currentAdmin?.is_superuser
                  && "Super admins can change passwords"
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="edit-super"
              checked={editSuper}
              onChange={e => setEditSuper(e.target.checked)}
              disabled={!currentAdmin?.is_superuser || (editDialog?.id === currentAdmin?.id && editSuper && admins.filter(a => a.is_superuser).length === 1)}
              className="h-4 w-4 text-luxury-gold focus:ring-luxury-gold/50 border-luxury-gray/30 rounded"
            />
            <label htmlFor="edit-super" className="text-sm font-medium text-luxury-black">Super Admin</label>
            {!currentAdmin?.is_superuser && (
              <span className="text-xs text-luxury-gray">(Only super admins can change this)</span>
            )}
            {editDialog?.id === currentAdmin?.id && editSuper && admins.filter(a => a.is_superuser).length === 1 && (
              <span className="text-xs text-luxury-gray">(You cannot demote yourself as the only super admin)</span>
            )}
          </div>
          {editError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{editError}</p>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-luxury-gray/20 bg-white text-luxury-gray font-medium hover:bg-luxury-gray/5 transition-colors duration-200"
              onClick={handleCancelEditForm}
              disabled={editLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-luxury-gold text-luxury-black font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={editLoading}
            >
              {editLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminModal;
