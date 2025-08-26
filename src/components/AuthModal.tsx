import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, Chrome } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: () => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const { signIn, signUp, signInWithGoogle, loading, error } = useAuth();

  const commonEmailDomains = [
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'outlook.com',
    'icloud.com',
    'protonmail.com',
  ];

  useEffect(() => {
    if (email.includes('@') && !email.includes('.')) {
      const [localPart] = email.split('@');
      const suggestions = commonEmailDomains.map(domain => `${localPart}@${domain}`);
      setEmailSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [email]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLogin) {
      const { error } = await signIn(email, password);
      if (!error) {
        onAuthSuccess?.();
      }
    } else {
      const { error } = await signUp(email, password, username);
      if (!error) {
        onAuthSuccess?.();
      }
    }
  };

  const handleGoogleSignIn = async () => {
    await signInWithGoogle();
    // For OAuth, the redirect will handle the auth state change
    // The modal will close automatically when auth state changes
  };

  const selectSuggestion = (suggestion: string) => {
    setEmail(suggestion);
    setShowSuggestions(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Mysterious glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-indigo-900/20 pointer-events-none"></div>
        
        {/* Header */}
        <div className="relative flex items-center justify-between p-6 border-b border-gray-700/50">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {isLogin ? 'Enter the Dream Realm' : 'Join the Mystery'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {isLogin ? 'Welcome back, dream keeper' : 'Begin your journey into dreams'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <div className="relative p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  required
                />
              </div>
              
              {/* Email Suggestions */}
              {showSuggestions && emailSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600/50 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                  {emailSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700/50 hover:text-white transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Username Field (Sign Up Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password..."
                  className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                isLogin ? 'Enter Dream Realm' : 'Begin Journey'
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-400">
                  or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-3 bg-white/5 hover:bg-white/10 border border-gray-600/50 hover:border-gray-500/50 text-white font-medium rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              {isLogin ? (
                <>
                  New to the realm?{' '}
                  <span className="text-purple-400 hover:text-purple-300">Create an account</span>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <span className="text-purple-400 hover:text-purple-300">Sign in</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}