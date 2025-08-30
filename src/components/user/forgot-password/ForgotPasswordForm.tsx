'use client';

import { useState } from 'react';
import { Button } from 'ui/button';
import { Input } from 'ui/input';
import { Label } from 'ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui/card';
import { Mail } from 'lucide-react';
import { createClient } from 'lib/supabase/client';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/user/reset-password` // where the user will land
    });
    if (error) return setError('An error occured, Please try again.');
    setSuccess('If an account with that email exists, a password reset link has been sent.');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-white p-4 pt-24">
      <Card className="w-full max-w-md bg-white border-luxury-gray/20 shadow-xl">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="mx-auto w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center mb-2">
            <Mail className="w-5 h-5 text-luxury-gold" />
          </div>
          <CardTitle className="text-xl font-bold text-luxury-black">Forgot Password</CardTitle>
          <CardDescription className="text-sm text-luxury-gray">
            Enter your email to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm text-luxury-black font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gray h-4 w-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-10 h-9 bg-luxury-white border-luxury-gray/30 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-colors"
                  required
                  disabled={isLoading}
                />
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
              {isLoading ? 'Sending Link...' : 'Send Reset Link'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordForm;
