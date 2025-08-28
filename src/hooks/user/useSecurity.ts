'use client';

import { useState } from 'react';
import { toast } from 'hooks/ui/use-toast';
import { UserAccount, LinkedAccount, SessionInfo } from 'types/security';

export const useSecurity = () => {
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

  return {
    userAccount,
    linkedAccounts,
    sessionInfo,
    handleEmailChange,
    handlePhoneChange,
    handlePasswordChange,
    handleTwoFactorToggle,
    handleSetupTwoFactor,
    handleConnectAccount,
    handleDisconnectAccount,
    handleViewSessions,
    handleLogoutAll,
  };
};
