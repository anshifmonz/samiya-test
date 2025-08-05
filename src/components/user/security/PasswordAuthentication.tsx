'use client';

import { Badge } from 'ui/badge';
import { Button } from 'ui/button';
import { Switch } from 'ui/switch';
import { Lock } from 'lucide-react';
import { Separator } from 'ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui/card';

interface PasswordAuthenticationProps {
  lastPasswordChange: string;
  twoFactorEnabled: boolean;
  onPasswordChange: () => void;
  onTwoFactorToggle: (enabled: boolean) => void;
  onSetupTwoFactor: () => void;
}

const PasswordAuthentication = ({
  lastPasswordChange,
  twoFactorEnabled,
  onPasswordChange,
  onTwoFactorToggle,
  onSetupTwoFactor
}: PasswordAuthenticationProps) => {
  return (
    <Card className="bg-profile-card border-profile-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          Password & Authentication
        </CardTitle>
        <CardDescription>Keep your account secure with a strong password</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <h4 className="font-medium">Password</h4>
            <p className="text-sm text-muted-foreground">Last changed {lastPasswordChange}</p>
          </div>
          <Button variant="outline" onClick={onPasswordChange}>
            Change Password
          </Button>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h4 className="font-medium flex items-center gap-2">
              Two-Factor Authentication (2FA)
              <Badge variant="secondary" className="text-xs">Recommended</Badge>
            </h4>
            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={onTwoFactorToggle}
            />
            <Button variant="outline" size="sm" onClick={onSetupTwoFactor}>
              Setup
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordAuthentication;
