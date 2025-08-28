'use client';

import { Button } from 'ui/button';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import LinkedAccounts from './LinkedAccounts';
import SessionManagement from './SessionManagement';
import AccountInformation from './AccountInformation';
import PasswordAuthentication from './PasswordAuthentication';
import { SecurityContextProvider } from 'contexts/user/SecurityContext';

const SecurityContent = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-profile-bg">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/user/profile')}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Button>

          <div>
            <h1 className="text-3xl font-bold text-foreground">Login & Security</h1>
            <p className="text-muted-foreground mt-2">
              Manage your account security and login preferences
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <AccountInformation />
          <PasswordAuthentication />
          <LinkedAccounts />
          <SessionManagement />
        </div>
      </div>
    </div>
  );
};

const Security = () => {
  return (
    <SecurityContextProvider>
      <SecurityContent />
    </SecurityContextProvider>
  );
};

export default Security;
