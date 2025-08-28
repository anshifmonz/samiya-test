'use client';

import { useState } from 'react';
import { AddressDisplay, AddressFormData } from 'types/address';
import { apiRequest } from 'utils/apiRequest';
import { moveDefaultAddressFirst } from 'utils/moveDefaultAddressFirst'
import { mapAddressToDisplay, mapDisplayToFormData } from 'utils/addressMapper';

export const useAddress = (initialAddresses: AddressDisplay[]) => {
  const [addresses, setAddresses] = useState<AddressDisplay[]>(initialAddresses);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);

  const toggleAddForm = () => {
    setShowAddForm(prev => !prev);
  };

  const addAddress = async (data: AddressFormData) => {
    try {
      setIsSubmitting(true);
      const { data: response, error } = await apiRequest('/api/user/profile/addresses', {
        method: 'POST',
        body: data,
        showErrorToast: true,
        errorMessage: 'Failed to add address'
      });
      if (error) return false;

      const address = response.data || null;
      if (address) {
        const displayAddress = mapAddressToDisplay(address);
        setAddresses(prev => [...prev, displayAddress]);
        setShowAddForm(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditAddress = async (formData: AddressFormData) => {
    const id = (editAddress as any).id;
    try {
      setIsSubmitting(true);
      const { data: response, error } = await apiRequest(`/api/user/profile/addresses?id=${id}`, {
        method: 'PUT',
        body: formData,
        showErrorToast: true,
        errorMessage: 'Failed to update address'
      });
      if (error) return false
      const address = response.data || null;
      if (address) {
        const displayAddress = mapAddressToDisplay(address);
        setAddresses(prev => prev.map(addr => (addr.id === id ? displayAddress : addr)));
        setModalOpen(false);
        setEditAddress(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const setAsDefault = async (id: string) => {
    await apiRequest(`/api/user/profile/addresses?id=${id}&action=set-default`, {
      method: 'PUT',
      showErrorToast: true,
      errorMessage: 'Failed to set default address'
    });

    setAddresses(prev => {
      const updated = prev.map(addr => ({
        ...addr,
        isDefault: addr.id === id
      }));
      return moveDefaultAddressFirst(updated);
    });
  };

  const deleteAddress = async (id: string) => {
    const addressToDelete = addresses.find(addr => addr.id === id);
    if (!addressToDelete) return;

    await apiRequest(`/api/user/profile/addresses?id=${id}`, {
      method: 'DELETE',
      showErrorToast: false,
      errorMessage: 'Failed to delete address'
    });

    const filteredAddresses = addresses.filter(addr => addr.id !== id);

    if (addressToDelete.isDefault && filteredAddresses.length > 0) {
      await apiRequest(
        `/api/user/profile/addresses?id=${filteredAddresses[0].id}&action=set-default`,
        { method: 'PUT' }
      );
      setAddresses(filteredAddresses.map((addr, index) => ({ ...addr, isDefault: index === 0 })));
    } else {
      setAddresses(filteredAddresses);
    }
  };

  const handleEditOpen = (address: AddressDisplay) => {
    const formData = mapDisplayToFormData(address);
    setEditAddress(formData);
    setModalOpen(true);
  };

  return {
    addresses,
    showAddForm,
    isSubmitting,
    modalOpen,
    editAddress,

    setModalOpen,
    setEditAddress,

    toggleAddForm,
    addAddress,
    setAsDefault,
    deleteAddress,
    setShowAddForm,
    handleEditOpen,
    handleEditAddress
  };
};
