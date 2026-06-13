'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { Cpu, ShieldCheck, Zap, Laptop, ArrowRight, UserCircle, Briefcase } from 'lucide-react';

export default function StudioPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState<string>('Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState<'Entry' | 'Mid' | 'Senior'>('Mid');
  const [type, setType] = useState<'HR' | 'Technical' | 'Mixed' | 'Custom' | 'Viva' | 'Company'>('Technical');
  const [companyName, setCompanyName] = useState<string>('TCS');
  const [projectName, setProjectName] = useState<string>('');
  const [vivaLevel, setVivaLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [resumeProjects, setResumeProjects] = useState<any[]>([]);
  const [fetchingResume, setFetchingResume] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      const currentUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
      const redirectQuery = currentUrl ? `?redirect=${encodeURIComponent(currentUrl)}` : '';
      router.push(`/login${redirectQuery}`);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchResumeData = async () => {
      if (user) {
        setFetchingResume(true);
        try {
          const resume = await api.get<any>('/resumes');
          if (resume && resume.projects) {
            setResumeProjects(resume.projects);
            if (resume.projects.length > 0) {
              setProjectName(resume.projects[0].projectName);
            }
          }
        } catch (err) {
          console.warn('Failed to load resume projects:', err);
        } finally {
          setFetchingResume(false);
        }
      }
    };
    fetchResumeData();
  }, [user]);

  const handleStart = async () => {
    if (!role.trim()) {
      setError('Please provide a target role');
      return;
    }

    if (type === 'Viva' && !projectName.trim()) {
      setError('Please select or specify a project name');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const data = await api.post<{ interviewId: string }>('/interviews/start', {
        role: role.trim(),
        experienceLevel,
        type,
        companyName: type === 'Company' ? companyName : undefined,
        projectName: type === 'Viva' ? projectName.trim() : undefined,
        vivaLevel: type === 'Viva' ? vivaLevel : undefined,
      });
      router.push(`/interview/${data.interviewId}`);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to initialize mock interview session.');
    } finally {
      setLoading(false);
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
          <div className="mb-10 text-center">
            <h1 className="font-outfit text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
              AI Interview Studio
            </h1>
            <p className="text-slate-400 text-sm max-w-lg mx-auto">
              Configure your interview parameters. The AI engine will create custom questions matching your selections and extracted profile skills.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300 max-w-xl mx-auto">
              {error}
            </div>
          )}

          <div className="max-w-xl mx-auto glass-panel p-8 rounded-3xl bg-opacity-20 flex flex-col gap-6">
            {/* Target Role input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 text-indigo-400" />
                Target Role / Job Position
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="glass-input text-sm text-white"
                placeholder="E.g., Software Engineer, Product Manager"
                required
              />
            </div>

            {/* Experience Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <UserCircle className="h-4 w-4 text-indigo-400" />
                Experience Target Level
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['Entry', 'Mid', 'Senior'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setExperienceLevel(level)}
                    className={`py-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      experienceLevel === level
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-md shadow-indigo-500/5'
                        : 'border-white/5 bg-white/3 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    {level} Level
                  </button>
                ))}
              </div>
            </div>

            {/* Round Type Selector */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-indigo-400" />
                Interview Round Category
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'Technical', label: 'Technical Core', desc: 'Focuses on coding, architectures & frameworks', icon: Laptop },
                  { id: 'HR', label: 'HR / Behavioral', desc: 'Evaluates team fit, communication & leadership', icon: ShieldCheck },
                  { id: 'Mixed', label: 'Mixed Round', desc: 'Hybrid evaluation of logic, logic-coding & values', icon: Zap },
                  { id: 'Custom', label: 'Custom Session', desc: 'Open parameters tailored directly to resume profile', icon: Cpu },
                  { id: 'Company', label: 'Company Interview', desc: 'Flows matching specific company interview styles', icon: Briefcase },
                  { id: 'Viva', label: 'Project Viva', desc: 'Questions on your resume projects architecture & details', icon: Cpu }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setType(item.id as any)}
                      className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col gap-1 ${
                        type === item.id
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-md shadow-indigo-500/5'
                          : 'border-white/5 bg-white/3 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-semibold text-xs text-white">
                        <Icon className="h-4 w-4 text-indigo-400" />
                        {item.label}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight">{item.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Company selection if Company Interview is selected */}
            {type === 'Company' && (
              <div className="flex flex-col gap-1.5 mt-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-indigo-400" />
                  Select Target Company
                </label>
                <select
                  id="company-selector"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="glass-input text-sm text-white bg-slate-900 border border-white/10 rounded-xl px-4 py-3 cursor-pointer"
                  style={{ colorScheme: 'dark' }}
                >
                  {['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Capgemini', 'HCL', 'Tech Mahindra', 'Amazon'].map(c => (
                    <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Target Project & Viva Level if Project Viva is selected */}
            {type === 'Viva' && (
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-indigo-400" />
                    Select Project
                  </label>
                  {fetchingResume ? (
                    <div className="text-xs text-slate-400 flex items-center gap-2 py-2">
                      <span className="h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      Loading projects from resume...
                    </div>
                  ) : resumeProjects.length > 0 ? (
                    <select
                      id="project-selector"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="glass-input text-sm text-white bg-slate-900 border border-white/10 rounded-xl px-4 py-3 cursor-pointer"
                      style={{ colorScheme: 'dark' }}
                    >
                      {resumeProjects.map(p => (
                        <option key={p.projectName} value={p.projectName} className="bg-slate-900 text-white">{p.projectName}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-[10px] text-yellow-400 leading-tight">
                        No projects found on your resume. You can enter a custom project name below or upload a project-focused resume first in the Resume Intelligence tab.
                      </p>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="glass-input text-sm text-white"
                        placeholder="E.g., FinPilot, Task Manager API"
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-indigo-400" />
                    Viva Complexity Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['Beginner', 'Intermediate', 'Advanced'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setVivaLevel(lvl)}
                        className={`py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                          vivaLevel === lvl
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-md shadow-indigo-500/5'
                            : 'border-white/5 bg-white/3 text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Launch CTA */}
            <button
              onClick={handleStart}
              disabled={loading}
              className="flex items-center justify-center gap-2 mt-4 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-xl transition disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Start Session Studio
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <footer className="border-t border-white/5 py-6 mt-12 bg-black/40 text-center text-slate-500 text-xs">
        <p>© {new Date().getFullYear()} InterviewIQ AI. Master your communications.</p>
      </footer>
    </div>
  );
}
