import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User } from 'lucide-react';
import { applelogin, googlelogin } from '../assets/assets';
import { toast } from 'sonner';

export default function LoginModal({ onClose }) {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin 
        ? { email, password }
        : { email, password, name };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Authentication failed');
        return;
      }

      login(data.user, data.token);
      if (onClose) onClose();
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // In a real app, you'd use Google OAuth library
      // For now, this is a placeholder
      toast.info('Google OAuth 2.0', {
        description: 'Google login would be configured with OAuth 2.0'
      });
    } catch (err) {
      setError('Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // In a real app, you'd use Apple OAuth library
      // For now, this is a placeholder
      toast.info('Apple OAuth 2.0', {
        description: 'Apple login would be configured with OAuth 2.0'
      });
    } catch (err) {
      setError('Apple login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed! inset-0! flex! items-center! justify-center! z-50!" onClick={handleBackdropClick} style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
      <div className="bg-[#1a1a1a]! rounded-lg! shadow-xl! w-full! max-w-md! p-8! border! border-[#333]!">
        <h2 className="text-2xl! font-bold! text-white! mb-6! text-center!">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
          <div className="mb-4! p-3! bg-red-900! bg-opacity-30! border! border-red-700! rounded! text-red-300! text-sm!">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4! mb-6!">
          {!isLogin && (
            <div className="relative!">
              <User className="absolute! left-3! top-3! w-5! h-5! text-gray-400!" />
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                className="w-full! pl-10! pr-4! py-2! bg-[#2a2a2a]! border! border-[#444]! rounded! text-white! placeholder-gray-500! focus:outline-none! focus:border-blue-500!"
              />
            </div>
          )}

          <div className="relative!">
            <Mail className="absolute! left-3! top-3! w-5! h-5! text-gray-400!" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full! pl-10! pr-4! py-2! bg-[#2a2a2a]! border! border-[#444]! rounded! text-white! placeholder-gray-500! focus:outline-none! focus:border-blue-500!"
            />
          </div>

          <div className="relative!">
            <Lock className="absolute! left-3! top-3! w-5! h-5! text-gray-400!" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full! pl-10! pr-4! py-2! bg-[#2a2a2a]! border! border-[#444]! rounded! text-white! placeholder-gray-500! focus:outline-none! focus:border-blue-500!"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full! bg-blue-600! hover:bg-blue-700! disabled:bg-gray-600! text-white! font-semibold! py-2! rounded! transition!"
          >
            {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="relative! mb-6!">
          <div className="absolute! inset-0! flex! items-center!">
            <div className="w-full! border-t! border-[#444]!"></div>
          </div>
          <div className="relative! flex! justify-center! text-sm!">
            <span className="px-2! bg-[#1a1a1a]! text-gray-400!">Or continue with</span>
          </div>
        </div>

        <div className="flex! gap-3! mb-6!">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex-1! flex! items-center! justify-center! bg-[#2a2a2a]! hover:bg-[#333]! border! border-[#444]! py-2! rounded! transition! disabled:opacity-50!"
          >
            <img src={googlelogin} alt="Google" className="w-6! h-6!" />
          </button>

          <button
            onClick={handleAppleLogin}
            disabled={loading}
            className="flex-1! flex! items-center! justify-center! bg-[#2a2a2a]! hover:bg-[#333]! border! border-[#444]! py-2! rounded! transition! disabled:opacity-50!"
          >
            <img src={applelogin} alt="Apple" className="w-6! h-6!" />
          </button>
        </div>

        <div className="text-center!">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-blue-400! hover:text-blue-300! text-sm!"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
