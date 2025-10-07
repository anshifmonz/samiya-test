'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Phone } from 'lucide-react';
import { Input } from 'ui/input';
import { Label } from 'ui/label';
import { Button } from 'ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui/card';
import { useSignin } from 'hooks/user/useSignin';
import OtpModal from 'components/user/shared/OtpModal';
import { OtpProvider } from 'contexts/user/shared/OtpContext';

const UserSigninContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const to = searchParams.get('to');

  const handleSuccess = () => router.push(to || '/');

  const { phone, setPhone, isLoading, error, handleSubmit, otpLoading } = useSignin(handleSuccess);

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-white p-4 pt-24">
      <Card className="w-full max-w-md bg-white border-luxury-gray/20 shadow-xl">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="mx-auto w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center mb-2">
            <Phone className="w-5 h-5 text-luxury-gold" />
          </div>
          <CardTitle className="text-xl font-bold text-luxury-black">Welcome Back</CardTitle>
          <CardDescription className="text-sm text-luxury-gray">
            Sign in with your phone number
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-sm text-luxury-black font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gray">
                  +91
                </span>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                  className="pl-12 h-9 bg-luxury-white border-luxury-gray/30 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-colors"
                  required
                  disabled={isLoading || otpLoading}
                  maxLength={10}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black font-medium py-2.5 transition-colors duration-200"
              disabled={isLoading || otpLoading}
            >
              {otpLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <OtpModal />
    </div>
  );
};

const UserSignin: React.FC = () => {
  return (
    <OtpProvider>
      <UserSigninContent />
    </OtpProvider>
  );
};

export default UserSignin;
