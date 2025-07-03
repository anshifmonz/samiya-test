'use client';

import { Button } from 'components/ui/button';
import { LogOut } from 'lucide-react';
import React from 'react';

function LogoutButton() {
  const [loading, setLoading] = React.useState(false);
  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      if (response.ok) {
        window.location.replace('/admin/login');
      } else {
        setLoading(false);
        alert('Failed to logout');
      }
    } catch (e) {
      setLoading(false);
      alert('Error during logout');
    }
  };
  return (
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
  );
}

export default LogoutButton;
