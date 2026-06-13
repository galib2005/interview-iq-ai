'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';
import { Cpu, Mail, Lock, User as UserIcon, LogIn, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '../../components/ThemeToggle';

function AuthForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, signup, googleLogin, user } = useAuth();
  const { showToast } = useToast();
  
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loadingLocal, setLoadingLocal] = useState<boolean>(false);

  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect') || '/dashboard';
      router.push(redirect);
    }
  }, [user, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoadingLocal(true);

    try {
      if (isLogin) {
        await login(email, password);
        showToast('Successfully logged in!', 'success');
      } else {
        if (!name) {
          setError('Please enter your name');
          setLoadingLocal(false);
          return;
        }
        await signup(name, email, password);
        showToast('Account successfully created!', 'success');
      }
    } catch (err: any) {
      const errMsg = err.message || 'Authentication failed. Please check your credentials.';
      
      if (errMsg.includes('already exists') || errMsg.includes('Account already exists')) {
        const customMsg = 'An account with this email already exists. Please login instead.';
        setError(customMsg);
        showToast(customMsg, 'warning');
        
        // Auto-switch to Login mode after 2.5s
        setTimeout(() => {
          setIsLogin(true);
          setPassword('');
          setError('');
        }, 2500);
      } else if (errMsg.includes('Invalid password')) {
        const customMsg = 'Invalid password. Please try again.';
        setError(customMsg);
        showToast(customMsg, 'error');
      } else if (errMsg.includes('No account found') || errMsg.includes('Please sign up')) {
        const customMsg = 'No account found with this email. Please sign up first.';
        setError(customMsg);
        showToast(customMsg, 'error');
      } else {
        setError(errMsg);
        showToast(errMsg, 'error');
      }
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleForgotPassword = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!email) {
      const msg = 'Please enter your email address to reset password.';
      setError(msg);
      showToast(msg, 'warning');
      return;
    }
    
    setError('');
    setLoadingLocal(true);
    try {
      const data = await api.post<{ success: boolean; message: string }>('/auth/forgot-password', { email });
      showToast(data.message || 'Password reset link sent.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Forgot password request failed.', 'error');
    } finally {
      setLoadingLocal(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoadingLocal(true);
    try {
      // Simulate Google Auth callback
      await googleLogin('demo_candidate@interviewiq.ai', 'Galib Ashraf', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150');
      showToast('Logged in with Google!', 'success');
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed.');
      showToast(err.message || 'Google Sign-In failed.', 'error');
    } finally {
      setLoadingLocal(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background glow elements */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>

      {/* Floating Back Link */}
      <Link href="/" className="absolute top-6 left-6 flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition">
        <ChevronLeft className="h-4 w-4" />
        Back to home
      </Link>

      <div className="w-full max-w-md glass-panel p-8 rounded-3xl bg-opacity-30 relative z-10">
        {/* Header logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 mb-3">
            <Cpu className="h-7 w-7" />
          </div>
          <h2 className="font-outfit text-2xl font-bold text-white">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLogin ? 'Sign in to access your interview simulator' : 'Register to evaluate your skills with AI'}
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-xl text-xs border ${
            error.includes('already exists')
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
              : 'bg-red-500/15 border-red-500/30 text-red-300'
          }`}>
            <p className="font-semibold leading-relaxed">{error}</p>
            {error.includes('already exists') && (
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setPassword('');
                  setError('');
                }}
                className="mt-3 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition text-[11px] cursor-pointer"
              >
                Go to Login
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input glass-input-with-icon text-sm text-white"
                  placeholder="John Doe"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input glass-input-with-icon text-sm text-white"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              {isLogin && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 transition cursor-pointer bg-transparent border-0"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input glass-input-with-icon text-sm text-white"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingLocal}
            className="flex items-center justify-center gap-2 mt-4 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition disabled:opacity-50 cursor-pointer"
          >
            {loadingLocal ? (
              <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <LogIn className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-grow h-px bg-white/5" />
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Or continue with</span>
          <div className="flex-grow h-px bg-white/5" />
        </div>

        {/* Mock Google Login Button */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loadingLocal}
          className="w-full glass-panel flex items-center justify-center gap-3 py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-sm font-semibold text-slate-200 transition cursor-pointer"
        >
          <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.137 4.114-3.415 0-6.19-2.775-6.19-6.19 0-3.415 2.775-6.19 6.19-6.19 1.488 0 2.851.531 3.921 1.411l3.056-3.056C19.043 2.122 15.844 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c5.8 0 10.748-4.148 10.748-11 0-.693-.075-1.352-.2-1.925H12.24Z"
            />
          </svg>
          Google Sign In (Instant Access)
        </button>

        {/* Toggle link */}
        <div className="mt-8 text-center text-sm text-slate-400">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setIsLogin(false);
                  setError('');
                }}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition cursor-pointer"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setIsLogin(true);
                  setError('');
                }}
                className="text-indigo-400 hover:text-indigo-300 font-semibold transition cursor-pointer"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AuthForm />
    </Suspense>
  );
}
