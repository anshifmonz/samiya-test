'use client';

import { useState } from 'react';
import { Button } from 'ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'hooks/ui/use-toast';
import { useRouter } from 'next/navigation';
import LinkedAccounts from './LinkedAccounts';
import SessionManagement from './SessionManagement';
import AccountInformation from './AccountInformation';
import PasswordAuthentication from './PasswordAuthentication';
import { UserAccount, LinkedAccount, SessionInfo } from 'types/security';

const LoginSecurity = () => {
  const router = useRouter();

  const [userAccount, setUserAccount] = useState<UserAccount>({
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    twoFactorEnabled: false
  });

  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([
    {
      id: "google",
      provider: "Google",
      email: "john.doe@gmail.com",
      isConnected: true,
      icon: "G",
      color: "bg-red-500"
    },
    {
      id: "facebook",
      provider: "Facebook",
      email: null,
      isConnected: false,
      icon: "f",
      color: "bg-blue-600"
    }
  ]);

  const [sessionInfo] = useState<SessionInfo>({
    activeSessions: 3,
    lastPasswordChange: "3 months ago"
  });

  const handleEmailChange = () => {
    toast({
      title: "Email change requested",
      description: "Please check your email for verification instructions",
    });
  };

  const handlePhoneChange = () => {
    toast({
      title: "Phone change requested",
      description: "Please verify your new phone number",
    });
  };

  const handlePasswordChange = () => {
    toast({
      title: "Password change",
      description: "Redirecting to password change form",
    });
  };

  const handleTwoFactorToggle = (enabled: boolean) => {
    setUserAccount(prev => ({ ...prev, twoFactorEnabled: enabled }));
    toast({
      title: enabled ? "2FA Enabled" : "2FA Disabled",
      description: enabled
        ? "Two-factor authentication has been enabled for your account"
        : "Two-factor authentication has been disabled",
    });
  };

  const handleSetupTwoFactor = () => {
    toast({
      title: "Setting up 2FA",
      description: "Redirecting to two-factor authentication setup",
    });
  };

  const handleConnectAccount = (accountId: string) => {
    setLinkedAccounts(prev =>
      prev.map(account =>
        account.id === accountId
          ? { ...account, isConnected: true, email: `john.doe@${accountId}.com` }
          : account
      )
    );
    toast({
      title: "Account connected",
      description: `Your ${accountId} account has been connected successfully`,
    });
  };

  const handleDisconnectAccount = (accountId: string) => {
    setLinkedAccounts(prev =>
      prev.map(account =>
        account.id === accountId
          ? { ...account, isConnected: false, email: null }
          : account
      )
    );
    toast({
      title: "Account disconnected",
      description: `Your ${accountId} account has been disconnected`,
    });
  };

  const handleViewSessions = () => {
    toast({
      title: "Session management",
      description: "Redirecting to active sessions page",
    });
  };

  const handleLogoutAll = () => {
    toast({
      title: "Logged out from all devices",
      description: "You have been logged out from all other devices",
    });
  };

  return (
    <div className="min-h-screen bg-profile-bg">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/user/profile")}
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
          <AccountInformation
            account={userAccount}
            onEmailChange={handleEmailChange}
            onPhoneChange={handlePhoneChange}
          />

          <PasswordAuthentication
            lastPasswordChange={sessionInfo.lastPasswordChange}
            twoFactorEnabled={userAccount.twoFactorEnabled}
            onPasswordChange={handlePasswordChange}
            onTwoFactorToggle={handleTwoFactorToggle}
            onSetupTwoFactor={handleSetupTwoFactor}
          />

          <LinkedAccounts
            accounts={linkedAccounts}
            onConnect={handleConnectAccount}
            onDisconnect={handleDisconnectAccount}
          />

          <SessionManagement
            sessionInfo={sessionInfo}
            onViewSessions={handleViewSessions}
            onLogoutAll={handleLogoutAll}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginSecurity;
