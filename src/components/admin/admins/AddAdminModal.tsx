import { UserPlus } from 'lucide-react';
import { useAdminsTab } from 'contexts/admin/AdminsTabContext';

const AddAdminModal: React.FC = () => {
  const {
    showAddDialog,
    addUsername,
    addPassword,
    addError,
    addLoading,
    handleAddAdmin,
    handleCancelAddForm,
    setAddUsername,
    setAddPassword,
  } = useAdminsTab();

  if (!showAddDialog) return null;

  return (
    <div className="fixed inset-0 bg-luxury-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
        <div className="flex items-center space-x-3 p-6 border-b border-luxury-gray/20">
          <div className="flex-shrink-0 h-10 w-10 bg-luxury-gold/10 rounded-full flex items-center justify-center">
            <UserPlus size={20} className="text-luxury-gold" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-luxury-black">Add Admin</h3>
            <p className="text-sm text-luxury-gray">Create a new admin account</p>
          </div>
        </div>
        <form onSubmit={handleAddAdmin} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-luxury-black mb-2">Username</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-lg border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-200"
              value={addUsername}
              onChange={e => setAddUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-luxury-black mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border border-luxury-gray/20 focus:outline-none focus:ring-2 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-all duration-200"
              value={addPassword}
              onChange={e => setAddPassword(e.target.value)}
              required
            />
          </div>
          {addError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{addError}</p>
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg border border-luxury-gray/20 bg-white text-luxury-gray font-medium hover:bg-luxury-gray/5 transition-colors duration-200"
              onClick={handleCancelAddForm}
              disabled={addLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-luxury-gold text-luxury-black font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={addLoading}
            >
              {addLoading ? 'Adding...' : 'Add Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;
