export interface UserAccount {
  email: string;
  phone: string;
  twoFactorEnabled: boolean;
}

export interface LinkedAccount {
  id: string;
  provider: string;
  email: string | null;
  isConnected: boolean;
  icon: string;
  color: string;
}

export interface SessionInfo {
  activeSessions: number;
  lastPasswordChange: string;
}