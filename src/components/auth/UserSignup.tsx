'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'ui/button';
import { Input } from 'ui/input';
import { Label } from 'ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from 'ui/card';
import { Lock, Mail, User, UserPlus } from 'lucide-react';
import { apiRequest } from 'utils/apiRequest';

const UserSignup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  useEffect(() => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: apiError } = await apiRequest('/api/auth/signup', {
        method: 'POST',
        body: { name, email, password },
        showLoadingBar: true,
        showErrorToast: false
      });

      if (!apiError || !data.error) {
        setSuccess('Account created successfully! Please check your email to verify your account.');
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(apiError || 'Signup failed');
      }
    } catch (_) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-luxury-white p-4 pt-24">
      <Card className="w-full max-w-md bg-white border-luxury-gray/20 shadow-xl">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="mx-auto w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center mb-2">
            <UserPlus className="w-5 h-5 text-luxury-gold" />
          </div>
          <CardTitle className="text-xl font-bold text-luxury-black">
            Create Account
          </CardTitle>
          <CardDescription className="text-sm text-luxury-gray">
            Join us today and start shopping your favorite items
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-sm text-luxury-black font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gray h-4 w-4" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-9 bg-luxury-white border-luxury-gray/30 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

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
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-9 bg-luxury-white border-luxury-gray/30 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="password" className="text-sm text-luxury-black font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gray h-4 w-4" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-9 bg-luxury-white border-luxury-gray/30 focus:ring-luxury-gold/50 focus:border-luxury-gold/30 transition-colors"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-sm text-luxury-black font-medium">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-gray h-4 w-4" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <p className="text-sm text-luxury-gray">
              Already have an account?{' '}
              <button
                onClick={() => router.push('/signin')}
                className="text-luxury-gold hover:text-luxury-gold/80 font-medium transition-colors"
                disabled={isLoading}
              >
                Sign in here
              </button>
            </p>
            <p className="text-xs text-luxury-gray/60">
              By creating an account, you agree to our terms of service and privacy policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSignup;
