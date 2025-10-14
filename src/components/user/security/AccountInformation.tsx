'use client';

import { useEffect } from 'react';
import { Input } from 'ui/input';
import { Label } from 'ui/label';
import { Button } from 'ui/button';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui/card';
import { apiRequest } from 'lib/utils/apiRequest';
import OtpModal from 'components/user/shared/OtpModal';
import { OtpProvider, useOtpContext } from 'contexts/user/shared/OtpContext';
import { useSecurityContext } from 'contexts/user/SecurityContext';

const AccountInformationContent = () => {
  const { profile, setProfile, handleNameChange } = useSecurityContext();
  const { phone, name } = profile;

  const { onVerifyClick, isVerified, verifyToken, loading, error, verifyingPhone } =
    useOtpContext();

  useEffect(() => {
    if (isVerified && verifyToken) {
      const changePhoneNumber = async () => {
        await apiRequest('/api/user/change-phone/', {
          method: 'POST',
          body: { verifyToken },
          showLoadingBar: true,
          successMessage: 'Phone number updated successfully!',
          errorMessage: 'Failed to update phone number.'
        });
      };
      changePhoneNumber();
    }
  }, [isVerified, verifyToken]);

  const isCurrentNumberVerified = isVerified && verifyingPhone === phone;

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
            <Label htmlFor="name">Full name</Label>
            <div className="flex items-center gap-2">
              <Input
                id="name"
                type="text"
                value={name}
                placeholder="Enter full name"
                onChange={e => {
                  const val = e.target.value;
                  setProfile({ ...profile, name: val });
                }}
                className="bg-muted"
              />
              <Button variant="outline" size="sm" onClick={handleNameChange}>
                Change
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative flex items-center gap-2">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 select-none">
                +91
              </span>
              <Input
                id="phone"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength={10}
                minLength={10}
                placeholder="Enter phone number"
                value={phone}
                onChange={e => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                  setProfile({ ...profile, phone: val });
                }}
                className="bg-muted pl-12 w-full"
                readOnly={isCurrentNumberVerified}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onVerifyClick(phone)}
                disabled={phone?.length !== 10 || loading || isCurrentNumberVerified}
              >
                {isCurrentNumberVerified ? 'Verified' : 'Change'}
              </Button>
            </div>
          </div>
        </div>
        <OtpModal />
        {error && <div className="text-destructive text-sm mt-2"></div>}
      </CardContent>
    </Card>
  );
};

const AccountInformation = () => {
  return (
    <OtpProvider>
      <AccountInformationContent />
    </OtpProvider>
  );
};

export default AccountInformation;
