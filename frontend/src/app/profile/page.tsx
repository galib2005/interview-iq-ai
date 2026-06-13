'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { UserCheck, Tag, Lock, CheckCircle, Loader } from 'lucide-react';

export default function ProfilePage() {
  const { user, loading: authLoading, updateUserSkills } = useAuth();
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [updating, setUpdating] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      const currentUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
      const redirectQuery = currentUrl ? `?redirect=${encodeURIComponent(currentUrl)}` : '';
      router.push(`/login${redirectQuery}`);
    } else if (user) {
      setName(user.name);
    }
  }, [user, authLoading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setUpdating(true);

    try {
      const payload: Record<string, any> = { name };
      if (password) {
        payload.password = password;
      }

      await api.put('/auth/profile', payload);
      setSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="mb-10">
            <h1 className="font-outfit text-3xl font-extrabold tracking-tight text-white mb-2">
              Profile Management
            </h1>
            <p className="text-slate-400 text-sm">
              Update your personal details, verify credentials, and synchronize active skills.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 max-w-xl">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 max-w-xl">
              <CheckCircle className="h-4 w-4" />
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Box: Summary Details */}
            <div className="md:col-span-1">
              <div className="glass-panel p-6 rounded-2xl bg-opacity-20 flex flex-col items-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/20 font-bold text-indigo-300 border border-indigo-500/30 text-xl mb-4">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-outfit text-md font-bold text-white mb-1">{user?.name}</h3>
                <p className="text-xs text-slate-400 mb-6">{user?.email}</p>

                <div className="w-full border-t border-white/5 pt-4 text-left flex flex-col gap-2">
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>Account Status</span>
                    <span className="text-emerald-400 font-bold">Active Verified</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-slate-400">
                    <span>Role Type</span>
                    <span className="text-white font-semibold">Candidate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Box: Settings Form */}
            <div className="md:col-span-2">
              <div className="glass-panel p-8 rounded-3xl bg-opacity-20">
                <form onSubmit={handleUpdateProfile} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <UserCheck className="h-4 w-4 text-indigo-400" />
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="glass-input text-sm text-white"
                      placeholder="Your Name"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                      <Lock className="h-4 w-4 text-indigo-400" />
                      Update Password (optional)
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="glass-input text-sm text-white"
                      placeholder="New Password (leave blank to keep current)"
                    />
                  </div>

                  {password && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-300">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="glass-input text-sm text-white"
                        placeholder="Confirm password"
                        required={!!password}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={updating}
                    className="flex items-center justify-center gap-2 mt-2 px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transition disabled:opacity-50 cursor-pointer self-start"
                  >
                    {updating ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/5 py-6 mt-12 bg-black/40 text-center text-slate-500 text-xs">
        <p>© {new Date().getFullYear()} InterviewIQ AI. Master your communications.</p>
      </footer>
    </div>
  );
}
