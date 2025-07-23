import { useState, useEffect } from 'react';
import { apiRequest } from 'lib/utils/apiRequest';
import { useConfirmation } from '@/hooks/useConfirmation';

interface AdminUser {
  id: string;
  username: string;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export const useAdminAdminsTab = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const confirmation = useConfirmation();
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addUsername, setAddUsername] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addError, setAddError] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [editDialog, setEditDialog] = useState<null | AdminUser>(null);
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editSuper, setEditSuper] = useState(false);
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const meRes = await apiRequest('/api/admin/me', {
          showLoadingBar: true,
          loadingBarDelay: 150
        });
        if (!meRes.error && meRes.data) {
          setCurrentAdmin(meRes.data.admin);
        } else {
          setCurrentAdmin(null);
        }

        const adminsRes = await apiRequest('/api/admin', {
          showLoadingBar: true,
          loadingBarDelay: 150
        });
        if (adminsRes.error) {
          setError(adminsRes.error);
          setAdmins([]);
        } else {
          setAdmins(adminsRes.data?.admins || []);
        }
      } catch (e) {
        setError('Failed to fetch data');
        setAdmins([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAdmins = admins;
  const adminsCountText = `${filteredAdmins.length} admin${filteredAdmins.length !== 1 ? 's' : ''}`;

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
        const res = await apiRequest('/api/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: { username: addUsername, password: addPassword },
          showLoadingBar: true, // Admin operations now show loading bar
          loadingBarDelay: 200
        });
      if (res.error) {
        setAddError(res.error || 'Failed to add admin');
        setAddLoading(false);
        return;
      }
      setAddUsername('');
      setAddPassword('');
      setShowAddDialog(false);
      setAdmins((prev) => [...prev, ...(res.data?.admins || [])]);
    } catch (e) {
      setAddError('Failed to add admin');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    const confirmed = await confirmation.confirm({
      title: 'Delete Admin',
      message: `Are you sure you want to permanently delete the admin '${admin.username}'? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'destructive',
    });
    if (!confirmed) return;
    setDeleteLoading(admin.id);
    setError('');
    try {
      const res = await apiRequest(`/api/admin?id=${admin.id}`, {
        method: 'DELETE',
        showLoadingBar: true,
        loadingBarDelay: 200
      });
      if (res.error) {
        setError(res.error || 'Failed to delete admin');
        setDeleteLoading(null);
        return;
      }
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
    } catch (e) {
      setError('Failed to delete admin');
    } finally {
      setDeleteLoading(null);
    }
  };

  const openEditDialog = (admin: AdminUser) => {
    setEditDialog(admin);
    setEditUsername(admin.username);
    setEditPassword('');
    setEditSuper(admin.is_superuser);
    setEditError('');
  };

  const handleEditAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editDialog) return;
    setEditLoading(true);
    setEditError('');
    try {
      const res = await apiRequest('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: {
          id: editDialog.id,
          username: editUsername,
          password: editPassword || undefined,
          is_superuser: editSuper
        },
        showLoadingBar: true,
        loadingBarDelay: 200
      });
      if (res.error) {
        setEditError(res.error || 'Failed to update admin');
        setEditLoading(false);
        return;
      }
      setEditDialog(null);
      setAdmins((prev) => prev.map((a) => a.id === res.data?.admins[0].id ? res.data.admins[0] : a));
    } catch (e) {
      setEditError('Failed to update admin');
    } finally {
      setEditLoading(false);
    }
  };

  const handleShowAddForm = () => {
    setShowAddDialog(true);
    setAddError('');
    setAddUsername('');
    setAddPassword('');
  };

  const handleCancelAddForm = () => {
    setShowAddDialog(false);
    setAddError('');
    setAddUsername('');
    setAddPassword('');
  };

  const handleCancelEditForm = () => {
    setEditDialog(null);
    setEditError('');
    setEditUsername('');
    setEditPassword('');
    setEditSuper(false);
  };

  return {
    // State
    admins,
    currentAdmin,
    loading,
    error,
    mounted,

    // Add dialog state
    showAddDialog,
    addUsername,
    addPassword,
    addError,
    addLoading,

    // Edit dialog state
    editDialog,
    editUsername,
    editPassword,
    editSuper,
    editError,
    editLoading,

    // Delete state
    deleteLoading,

    // Computed values
    filteredAdmins,
    adminsCountText,

    // Event handlers
    handleAddAdmin,
    handleDelete,
    handleEditAdmin,
    openEditDialog,
    handleShowAddForm,
    handleCancelAddForm,
    handleCancelEditForm,

    // Form setters
    setAddUsername,
    setAddPassword,
    setEditUsername,
    setEditPassword,
    setEditSuper,

    // Confirmation dialog
    confirmation,
  };
};
