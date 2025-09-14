import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, User, Lock, Shield, ArrowLeft, Users } from 'lucide-react';
import { authenticateAdmin, authenticateStaff } from '../lib/secure-auth';

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStaffLogin, setIsStaffLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      let result;
      
      if (isStaffLogin) {
        // Staff authentication
        result = await authenticateStaff(email, password);
        
        if (result.success && result.session) {
          // Store staff session
          localStorage.setItem('staff_session', JSON.stringify(result.session));
          
          // Redirect to staff dashboard
          window.location.href = '/staff';
        } else {
          if (result.rateLimited) {
            setError('Too many failed login attempts. Please try again in 15 minutes.');
          } else {
            setError(result.error || 'Invalid staff credentials');
          }
        }
      } else {
        // Admin authentication
        result = await authenticateAdmin(email, password);

        if (result.success && result.session) {
          // Store admin session
          localStorage.setItem('admin_session', JSON.stringify(result.session));
          
          // Redirect to admin panel
          window.location.href = '/admin';
        } else {
          if (result.rateLimited) {
            setError('Too many failed login attempts. Please try again in 15 minutes.');
          } else {
            setError(result.error || 'Invalid admin credentials');
          }
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="w-full shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              {isStaffLogin ? (
                <Users className="w-6 h-6 text-blue-600" />
              ) : (
                <Shield className="w-6 h-6 text-blue-600" />
              )}
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800">
              {isStaffLogin ? 'Staff Login' : 'Admin Login'}
            </CardTitle>
            <CardDescription>
              {isStaffLogin 
                ? 'Access the Arogyam Healthcare Staff Portal'
                : 'Access the Arogyam Healthcare Administration Panel'
              }
            </CardDescription>
            
            {/* Toggle Switch */}
            <div className="mt-4 flex items-center justify-center space-x-3">
              <span className={`text-sm font-medium ${!isStaffLogin ? 'text-blue-600' : 'text-gray-500'}`}>
                Admin
              </span>
              <button
                onClick={() => {
                  setIsStaffLogin(!isStaffLogin);
                  setError('');
                  setEmail('');
                  setPassword('');
                }}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span
                  className={`${
                    isStaffLogin ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
              <span className={`text-sm font-medium ${isStaffLogin ? 'text-blue-600' : 'text-gray-500'}`}>
                Staff
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{isStaffLogin ? 'Staff Email' : 'Admin Email'}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={isStaffLogin ? 'Enter staff email' : 'Enter admin email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{isStaffLogin ? 'Staff Password' : 'Admin Password'}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder={isStaffLogin ? 'Enter staff password' : 'Enter admin password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  isStaffLogin ? 'Sign In as Staff' : 'Sign In as Admin'
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                onClick={goBack}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Website
              </Button>
            </div>


            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                {isStaffLogin 
                  ? 'Need staff access? Contact the administrator.'
                  : 'Need access? Contact the system administrator.'
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;