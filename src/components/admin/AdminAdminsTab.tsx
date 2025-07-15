import React from 'react';
import { createPortal } from 'react-dom';
import { useAdminAdminsTab } from 'hooks/useAdminAdminsTab';
import {
  AdminsHeader,
  AdminsStats,
  AdminsTable,
  AddAdminModal,
  EditAdminModal,
} from './admins';

const AdminAdminsTab: React.FC = () => {
  const {
    admins,
    currentAdmin,
    loading,
    error,
    mounted,

    showAddDialog,
    addUsername,
    addPassword,
    addError,
    addLoading,

    editDialog,
    editUsername,
    editPassword,
    editSuper,
    editError,
    editLoading,

    deleteLoading,

    filteredAdmins,
    adminsCountText,

    handleAddAdmin,
    handleDelete,
    handleEditAdmin,
    openEditDialog,
    handleShowAddForm,
    handleCancelAddForm,
    handleCancelEditForm,

    setAddUsername,
    setAddPassword,
    setEditUsername,
    setEditPassword,
    setEditSuper,
  } = useAdminAdminsTab();

  return (
    <>
      <div>
        <AdminsHeader
          onAddClick={handleShowAddForm}
          currentAdmin={currentAdmin}
        />

        <AdminsStats
          adminsCountText={adminsCountText}
        />

        <AdminsTable
          loading={loading}
          error={error}
          filteredAdmins={filteredAdmins}
          currentAdmin={currentAdmin}
          deleteLoading={deleteLoading}
          onEdit={openEditDialog}
          onDelete={handleDelete}
        />
      </div>

      {mounted && showAddDialog && createPortal(
        <AddAdminModal
          showAddDialog={showAddDialog}
          addUsername={addUsername}
          addPassword={addPassword}
          addError={addError}
          addLoading={addLoading}
          onAddAdmin={handleAddAdmin}
          onCancel={handleCancelAddForm}
          onUsernameChange={setAddUsername}
          onPasswordChange={setAddPassword}
        />,
        document.body
      )}
      {mounted && editDialog && createPortal(
        <EditAdminModal
          editDialog={editDialog}
          editUsername={editUsername}
          editPassword={editPassword}
          editSuper={editSuper}
          editError={editError}
          editLoading={editLoading}
          currentAdmin={currentAdmin}
          admins={admins}
          onEditAdmin={handleEditAdmin}
          onCancel={handleCancelEditForm}
          onUsernameChange={setEditUsername}
          onPasswordChange={setEditPassword}
          onSuperChange={setEditSuper}
        />,
        document.body
      )}
    </>
  );
};

export default AdminAdminsTab;
