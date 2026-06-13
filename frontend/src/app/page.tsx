'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Mic, Code, Award, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export default function LandingPage() {
  return (
    <div className="relative min-height-screen flex flex-col justify-between overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-3/4 left-1/3 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-[95%] xl:max-w-[98%] mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30">
            <Cpu className="h-6 w-6 animate-pulse-slow" />
          </div>
          <span className="font-outfit text-xl font-bold tracking-tight text-white">
            InterviewIQ <span className="text-indigo-400">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/login"
            className="glass-panel px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:bg-white/10 transition cursor-pointer"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full max-w-[95%] xl:max-w-[98%] mx-auto px-6 py-12 flex-grow flex flex-col items-center justify-center text-center relative z-10">
        <div className="glass-panel mb-6 px-4 py-1.5 rounded-full bg-white/5 border-white/10 inline-flex items-center gap-2 animate-float">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-medium text-slate-300">Powered by advanced AI & Voice Synthesis</span>
        </div>

        <h1 className="font-outfit text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-white mb-6 max-w-4xl">
          Master Your Next Interview with <span className="text-gradient">Real-Time AI</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed">
          Simulate realistic technical, HR, and coding mock interviews. Get instant voice responses, safe sandbox code compiling, and personalized study roadmaps.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link
            href="/login?mode=signup"
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            Start Preparing Free
            <ChevronRight className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="glass-panel flex items-center justify-center px-8 py-4 rounded-2xl text-slate-200 font-semibold hover:bg-white/15 transition cursor-pointer"
          >
            Explore Dashboard Demo
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full text-left">
          <Link
            href="/dashboard?tab=voice"
            className="glass-panel p-6 rounded-2xl bg-opacity-20 hover:scale-[1.02] hover:bg-indigo-500/5 hover:border-indigo-500/30 block transition-all duration-300 cursor-pointer"
          >
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
              <Mic className="h-6 w-6" />
            </div>
            <h3 className="font-outfit text-lg font-semibold text-white mb-2">Voice Simulation</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Speak answers using your microphone. The AI talks back using Speech Synthesis and evaluates your communication.
            </p>
          </Link>

          <Link
            href="/dashboard?tab=coding"
            className="glass-panel p-6 rounded-2xl bg-opacity-20 hover:scale-[1.02] hover:bg-purple-500/5 hover:border-purple-500/30 block transition-all duration-300 cursor-pointer"
          >
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="font-outfit text-lg font-semibold text-white mb-2">Coding Assessment</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Write solutions in Python, JS, C++, or Java inside an integrated code editor with test execution consoles.
            </p>
          </Link>

          <Link
            href="/dashboard?tab=resume"
            className="glass-panel p-6 rounded-2xl bg-opacity-20 hover:scale-[1.02] hover:bg-cyan-500/5 hover:border-cyan-500/30 block transition-all duration-300 cursor-pointer"
          >
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Cpu className="h-6 w-6" />
            </div>
            <h3 className="font-outfit text-lg font-semibold text-white mb-2">Resume Intelligence</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Upload your resume to extract skills and automatically generate customized, resume-specific interview questions.
            </p>
          </Link>

          <Link
            href="/dashboard?tab=roadmap"
            className="glass-panel p-6 rounded-2xl bg-opacity-20 hover:scale-[1.02] hover:bg-emerald-500/5 hover:border-emerald-500/30 block transition-all duration-300 cursor-pointer"
          >
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Award className="h-6 w-6" />
            </div>
            <h3 className="font-outfit text-lg font-semibold text-white mb-2">Detailed AI Roadmaps</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Receive metrics (technical, confidence, problem solving), strengths, weaknesses, and study guides.
            </p>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-12 bg-black/40 relative z-10">
        <div className="w-full max-w-[95%] xl:max-w-[98%] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} InterviewIQ AI. All rights reserved.
          </p>
          <div className="flex gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
