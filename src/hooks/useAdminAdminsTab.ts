import { useState, useEffect } from 'react';

interface AdminUser {
  id: string;
  username: string;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}

export const useAdminAdminsTab = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
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
        const meRes = await fetch('/api/admin/me');
        if (meRes.ok) {
          const meData = await meRes.json();
          setCurrentAdmin(meData.admin);
        } else {
          setCurrentAdmin(null);
        }

        const adminsRes = await fetch('/api/admin');
        const adminsData = await adminsRes.json();
        if (adminsData.error) {
          setError(adminsData.error);
          setAdmins([]);
        } else {
          setAdmins(adminsData.admins || []);
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
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: addUsername, password: addPassword })
      });
      const data = await res.json();
      if (data.error) {
        setAddError(data.error || 'Failed to add admin');
        setAddLoading(false);
        return;
      }
      setAddUsername('');
      setAddPassword('');
      setShowAddDialog(false);
      setAdmins((prev) => [...prev, ...(data.admins || [])]);
    } catch (e) {
      setAddError('Failed to add admin');
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = async (admin: AdminUser) => {
    if (!window.confirm(`Are you sure you want to delete admin '${admin.username}'?`)) return;
    setDeleteLoading(admin.id);
    setError('');
    try {
      const res = await fetch(`/api/admin?id=${admin.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error || 'Failed to delete admin');
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
      const res = await fetch('/api/admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editDialog.id,
          username: editUsername,
          password: editPassword || undefined,
          is_superuser: editSuper
        })
      });
      const data = await res.json();
      if (data.error) {
        setEditError(data.error || 'Failed to update admin');
        setEditLoading(false);
        return;
      }
      setEditDialog(null);
      setAdmins((prev) => prev.map((a) => a.id === data.admins[0].id ? data.admins[0] : a));
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
  };
};
