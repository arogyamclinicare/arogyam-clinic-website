import { useState } from 'react';
import { Eye, EyeOff, Home, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from './context/AuthContext';

export function AdminLoginPage() {
  const { login, csrfToken } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [securityInfo, setSecurityInfo] = useState({
    remainingAttempts: 5,
    isLocked: false,
    lockoutTime: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Include CSRF token in form submission
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Login successful - user will be redirected automatically
        // Clear any previous security warnings
        setSecurityInfo({
          remainingAttempts: 5,
          isLocked: false,
          lockoutTime: 0
        });
      } else {
        setError(result.error || 'Login failed. Please try again.');
        
        // Extract remaining attempts from error message
        if (result.error?.includes('attempts remaining')) {
          const match = result.error.match(/(\d+) attempts remaining/);
          if (match) {
            setSecurityInfo(prev => ({
              ...prev,
              remainingAttempts: parseInt(match[1])
            }));
          }
        }
        
        // Check if account is locked
        if (result.error?.includes('temporarily locked')) {
          const match = result.error.match(/(\d+) minutes/);
          if (match) {
            setSecurityInfo(prev => ({
              ...prev,
              isLocked: true,
              lockoutTime: parseInt(match[1])
            }));
          }
        }
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Arogyam</h1>
          <h2 className="text-2xl font-semibold text-blue-200 mb-2">Admin Portal</h2>
          <p className="text-gray-300">Secure access to clinic management</p>
        </div>

        {/* Security Status */}
        {securityInfo.isLocked && (
          <div className="mb-6 bg-red-500/20 border border-red-400/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className="text-red-200 font-semibold">Account Temporarily Locked</span>
            </div>
            <p className="text-red-300 text-sm">
              Too many failed login attempts. Please try again in {securityInfo.lockoutTime} minutes.
            </p>
          </div>
        )}

        {!securityInfo.isLocked && securityInfo.remainingAttempts < 5 && (
          <div className="mb-6 bg-yellow-500/20 border border-yellow-400/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <span className="text-yellow-200 font-semibold">Security Warning</span>
            </div>
            <p className="text-yellow-300 text-sm">
              {securityInfo.remainingAttempts} login attempts remaining before account lockout.
            </p>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hidden CSRF Token */}
            <input type="hidden" name="_csrf" value={csrfToken} />
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Admin Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={securityInfo.isLocked}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Enter admin email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={securityInfo.isLocked}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={securityInfo.isLocked}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading || securityInfo.isLocked}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : securityInfo.isLocked ? (
                'Account Locked'
              ) : (
                'Access Admin Panel'
              )}
            </button>
          </form>

          {/* Admin Access Info */}
          <div className="mt-6 p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
            <p className="text-sm text-blue-200 mb-2 font-semibold">🔐 Admin Access Required</p>
            <p className="text-xs text-blue-300 mb-1">Contact your system administrator for login credentials</p>
            <p className="text-xs text-blue-400 mt-2">✅ Secure authentication system active</p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <button
            onClick={() => {
              window.location.href = '/';
              // Ensure scroll to top happens after navigation
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 50);
            }}
            className="inline-flex items-center text-blue-300 hover:text-blue-200 text-sm font-medium transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Main Website
          </button>
        </div>
      </div>
    </div>
  );
}
