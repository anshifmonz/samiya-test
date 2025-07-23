'use client';

import { Button } from 'components/ui/button';
import { LogOut } from 'lucide-react';
import React from 'react';
import { useConfirmation } from '@/hooks/useConfirmation';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { apiRequest } from 'lib/utils/apiRequest';

function LogoutButton() {
  const [loading, setLoading] = React.useState(false);
  const confirmation = useConfirmation();
  const handleLogout = async () => {
    setLoading(true);
    try {
      const { error } = await apiRequest('/api/admin/logout', {
        method: 'POST',
        showLoadingBar: true,
        showErrorToast: false // Handle errors manually
      });
      
      if (!error) {
        window.location.replace('/admin/login');
      } else {
        setLoading(false);
        confirmation.confirm({
          title: 'Logout Failed',
          message: 'The logout attempt was unsuccessful. Please try again.',
          confirmText: 'OK',
          variant: 'destructive'
        });
      }
    } catch (e) {
      setLoading(false);
      confirmation.confirm({
        title: 'Logout Error',
        message: 'An error occurred during logout. Please check your connection and try again.',
        confirmText: 'OK',
        variant: 'destructive'
      });
    }
  };
  return (
    <>
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        className="border-luxury-gray/30 text-luxury-gray hover:bg-luxury-cream hover:border-luxury-gold/50 transition-all duration-300"
        disabled={loading}
      >
        <LogOut className="w-4 h-4 mr-2" />
        {loading ? 'Logging out...' : 'Logout'}
      </Button>
      
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={confirmation.hideConfirmation}
        onConfirm={confirmation.onConfirm || (() => {})}
        title={confirmation.title}
        message={confirmation.message}
        confirmText={confirmation.confirmText}
        cancelText={confirmation.cancelText}
        variant={confirmation.variant}
        isLoading={confirmation.isLoading}
      />
    </>
  );
}

export default LogoutButton;
