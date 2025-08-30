'use client';

import { useState, useEffect, Suspense } from 'react';
import { Input } from 'ui/input';
import { Label } from 'ui/label';
import { Button } from 'ui/button';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui/card';
import { createClient } from 'lib/supabase/client';

const ResetPasswordFormComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const access_token = hashParams.get('access_token');
    const error = searchParams.get('error');

    if (error) {
      setError('Invalid or expired token, redirecting forgot password');
      setTimeout(() => router.push('/signin'), 3000);
    }
    if (access_token) {
      const supabase = createClient();
      supabase.auth.setSession({ access_token, refresh_token: '' });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6 || password.length > 64) {
      setError('Password must be between 6 and 64 characters');
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: password });
    if (error) return setError('Failed to reset password: ' + error.message);
    setSuccess('Password has been reset successfully! Redirecting to sign in...');
    setTimeout(() => {
      setIsLoading(false);
      router.push('/signin');
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-white p-4 pt-24">
      <Card className="w-full max-w-md bg-white border-luxury-gray/20 shadow-xl">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="mx-auto w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center mb-2">
            <Lock className="w-5 h-5 text-luxury-gold" />
          </div>
          <CardTitle className="text-xl font-bold text-luxury-black">Reset Your Password</CardTitle>
          <CardDescription className="text-sm text-luxury-gray">
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm text-luxury-black font-medium">
                New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gray h-4 w-4" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-9 bg-luxury-white border-luxury-gray/30 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-colors"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-luxury-gray"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm-password" className="text-sm text-luxury-black font-medium">
                Confirm New Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gray h-4 w-4" />
                <Input
                  id="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="pl-10 pr-10 h-9 bg-luxury-white border-luxury-gray/30 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-colors"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-luxury-gray"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-green-600 text-sm">{success}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-luxury-gold hover:bg-luxury-gold/90 text-luxury-black font-medium py-2.5 transition-colors duration-200"
              disabled={isLoading}
            >
              {isLoading ? 'Resetting Password...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const ResetPasswordForm: React.FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResetPasswordFormComponent />
  </Suspense>
);

export default ResetPasswordForm;
