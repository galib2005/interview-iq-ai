'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { FileText, Upload, Sparkles, Tag, Plus, X, CheckCircle, Loader } from 'lucide-react';

interface ResumeData {
  fileName: string;
  skills: string[];
  experienceSummary: string;
}

export default function ResumePage() {
  const { user, loading: authLoading, updateUserSkills } = useAuth();
  const router = useRouter();

  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [newSkill, setNewSkill] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      const currentUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
      const redirectQuery = currentUrl ? `?redirect=${encodeURIComponent(currentUrl)}` : '';
      router.push(`/login${redirectQuery}`);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await api.get<ResumeData>('/resumes');
        setResume(data);
      } catch (err) {
        // Safe to ignore if they have never uploaded a resume
        console.log('No resume found on load');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchResume();
    }
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    try {
      const res = await api.upload<{ message: string; resume: ResumeData }>('/resumes/upload', file);
      setResume(res.resume);
      updateUserSkills(res.resume.skills);
      setSuccess('Resume analyzed successfully! Skills synced to profile.');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to process resume');
    } finally {
      setUploading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim() || !user) return;

    const skillText = newSkill.trim();
    if (user.skills.includes(skillText)) {
      setNewSkill('');
      return;
    }

    const updatedSkills = [...user.skills, skillText];
    try {
      const res = await api.put<{ user: { skills: string[] } }>('/auth/profile', { skills: updatedSkills });
      updateUserSkills(res.user.skills);
      if (resume) {
        setResume({ ...resume, skills: res.user.skills });
      }
      setNewSkill('');
    } catch (err) {
      setError('Failed to add skill.');
    }
  };

  const handleRemoveSkill = async (skillToRemove: string) => {
    if (!user) return;
    const updatedSkills = user.skills.filter(s => s !== skillToRemove);
    try {
      const res = await api.put<{ user: { skills: string[] } }>('/auth/profile', { skills: updatedSkills });
      updateUserSkills(res.user.skills);
      if (resume) {
        setResume({ ...resume, skills: res.user.skills });
      }
    } catch (err) {
      setError('Failed to remove skill.');
    }
  };

  if (authLoading || loading) {
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
              Resume Intelligence
            </h1>
            <p className="text-slate-400 text-sm">
              Upload your resume PDF to extract relevant skills and feed context directly to the interview generator.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Upload Box */}
            <div className="md:col-span-1">
              <div className="glass-panel p-6 rounded-2xl bg-opacity-20 flex flex-col items-center text-center justify-center min-h-[300px] relative">
                {uploading ? (
                  <div className="flex flex-col items-center justify-center">
                    <Loader className="h-10 w-10 text-indigo-400 animate-spin mb-4" />
                    <p className="text-sm font-semibold text-white">Parsing PDF...</p>
                    <p className="text-xs text-slate-400 mt-1">Extracting skills via AI</p>
                  </div>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-indigo-400 mb-4 animate-float" />
                    <h3 className="font-outfit text-md font-bold text-white mb-2">Upload Resume</h3>
                    <p className="text-xs text-slate-400 mb-6">Select a single PDF file (Max 5MB)</p>

                    <label className="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-xs font-bold text-white rounded-xl shadow-lg transition cursor-pointer">
                      Browse Files
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>
            </div>

            {/* Profile Skills Management */}
            <div className="md:col-span-2 flex flex-col gap-6">
              {resume ? (
                <div className="glass-panel p-6 rounded-2xl bg-opacity-20">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-indigo-400" />
                    <h3 className="font-outfit text-md font-bold text-white">{resume.fileName}</h3>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    <strong>Extracted Summary:</strong> {resume.experienceSummary}
                  </p>
                </div>
              ) : (
                <div className="glass-panel p-6 rounded-2xl bg-opacity-10 border-dashed text-slate-400 text-sm flex items-center justify-center py-10">
                  No uploaded resume file. Upload above to auto-screen experience.
                </div>
              )}

              {/* Verified Profile Skills */}
              <div className="glass-panel p-6 rounded-2xl bg-opacity-20">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4.5 w-4.5 text-indigo-400" />
                    <h3 className="font-outfit text-md font-bold text-white">Active Profile Skills</h3>
                  </div>
                  <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-lg">
                    {user?.skills.length || 0} active
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4">
                  These keywords are used to tailor coding questions and behavioral follow-ups during practice sessions.
                </p>

                {/* Tags block */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {user?.skills.length === 0 ? (
                    <span className="text-xs text-slate-500 italic">No skills listed yet. Add skills below or upload resume.</span>
                  ) : (
                    user?.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-200"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-slate-500 hover:text-red-400 transition cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Add Skill form */}
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="flex-grow glass-input text-xs"
                    placeholder="E.g., Python, System Design, React"
                    required
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center p-3.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-lg transition cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
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
