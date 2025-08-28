'use client';

import { Input } from 'ui/input';
import { Label } from 'ui/label';
import { Button } from 'ui/button';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui/card';
import { useSecurityContext } from 'contexts/user/SecurityContext';

const AccountInformation = () => {
  const {
    userAccount,
    handleEmailChange,
    handlePhoneChange
  } = useSecurityContext();

  return (
    <Card className="bg-profile-card border-profile-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary" />
          Account Information
        </CardTitle>
        <CardDescription>Update your basic account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex items-center gap-2">
              <Input id="email" type="email" value={userAccount.email} readOnly className="bg-muted" />
              <Button variant="outline" size="sm" onClick={handleEmailChange}>
                Change
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="flex items-center gap-2">
              <Input id="phone" type="tel" value={userAccount.phone} readOnly className="bg-muted" />
              <Button variant="outline" size="sm" onClick={handlePhoneChange}>
                Change
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountInformation;
