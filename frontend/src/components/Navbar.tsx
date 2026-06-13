'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Cpu, LayoutDashboard, UserCheck, FileText, LogOut } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-4 z-50 mx-auto w-full max-w-[95%] xl:max-w-[98%] px-4">
      <div className="glass-panel solid-navbar flex items-center justify-between px-6 py-4 rounded-2xl">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30">
            <Cpu className="h-6 w-6 animate-pulse-slow" />
          </div>
          <span className="font-outfit text-xl font-bold tracking-tight text-white">
            InterviewIQ <span className="text-indigo-400">AI</span>
          </span>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              isActive('/dashboard')
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/studio"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              isActive('/studio') || pathname.startsWith('/interview')
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Cpu className="h-4 w-4" />
            AI Interview Studio
          </Link>
          <Link
            href="/resume"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              isActive('/resume')
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <FileText className="h-4 w-4" />
            Resume Intel
          </Link>
          <Link
            href="/profile"
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
              isActive('/profile')
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            Profile
          </Link>
        </div>

        {/* User profile & actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="h-9 w-9 rounded-full border border-indigo-500/30 object-cover" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500/20 font-bold text-indigo-300 border border-indigo-500/30">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-xs text-slate-400">Candidate</p>
              <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
            </div>
          </div>

          <ThemeToggle />

          <button
            onClick={logout}
            className="flex items-center justify-center p-2.5 rounded-xl border border-white/5 bg-white/5 text-slate-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/30 transition cursor-pointer"
            title="Log Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
