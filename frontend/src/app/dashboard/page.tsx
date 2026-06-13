'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Navbar } from '../../components/Navbar';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import {
  Award,
  Briefcase,
  BarChart3,
  Cpu,
  Sparkles,
  Plus,
  Play,
  ChevronRight,
  BookOpen,
  LayoutDashboard,
  Mic,
  Code,
  FileText,
  Clock,
  History,
  CheckCircle,
  AlertTriangle,
  Upload,
  Loader,
  RefreshCw,
  FolderGit2,
  Calendar,
  X,
  Tag
} from 'lucide-react';
import Link from 'next/link';

interface Metrics {
  totalInterviews: number;
  totalCompleted: number;
  avgScore: number;
  bestScore: number;
  codingAccuracy: number;
  communicationScore: number;
}

interface RecentActivity {
  lastInterview: { role: string; date: string; score: number } | null;
  lastCodingRound: { problem: string; date: string; score: number } | null;
  lastResumeAnalysis: { fileName: string; date: string } | null;
}

interface RadarData {
  subject: string;
  score: number;
  fullMark: number;
}

interface TimelineData {
  name: string;
  score: number;
  role: string;
  date: string;
}

interface InterviewHistory {
  id: string;
  role: string;
  type: string;
  status: string;
  overallScore: number | null;
  createdAt: string;
}

interface VoiceHistoryItem {
  id: string;
  role: string;
  type: string;
  date: string;
  score: number | null;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  questions: Array<{
    questionText: string;
    candidateAnswer: string;
    score: number | null;
    feedback: string;
    strengths: string[];
    weaknesses: string[];
  }>;
}

interface CodingHistoryItem {
  id: string;
  problem: string;
  language: string;
  code: string;
  score: number | null;
  feedback: string;
  mistakes: string[];
  date: string;
  timeTaken: string;
}

interface ResumeAnalysisData {
  fileName: string;
  skills: string[];
  atsScore: number;
  strengthReport: string;
  missingSkills: string[];
  suggestedImprovements: string[];
}

interface RoadmapData {
  role: string;
  completed: string[];
  inProgress: string[];
  upcoming: string[];
  weakAreas: string[];
  recommendedTopics: string[];
  recommendedProjects: string[];
  progress: number;
}

interface DashboardSummary {
  metrics: Metrics;
  recentActivity: RecentActivity;
  skillsRadar: RadarData[];
  performanceTimeline: TimelineData[];
  historyList: InterviewHistory[];
  voiceHistory: VoiceHistoryItem[];
  codingHistory: CodingHistoryItem[];
  resumeAnalysis: ResumeAnalysisData | null;
  roadmap: RoadmapData;
  difficultyAnalytics?: {
    easy: number;
    medium: number;
    hard: number;
  };
  weakTopics?: Array<{
    topic: string;
    score: number;
    latestScore?: number;
    previousScore?: number;
    improvementStatus: string;
  }>;
  strongTopics?: string[];
  aiMemoryMilestones?: string[];
  companyMetrics?: Record<string, {
    attempts: number;
    avgScore: number;
    bestScore: number;
  }>;
  vivaPerformance?: Array<{
    id: string;
    projectName: string;
    vivaLevel: string;
    overallScore: number;
    date: string;
    scores: {
      architecture: number;
      technology: number;
      deployment: number;
      problemSolving: number;
      communication: number;
    };
  }>;
  careerReadiness?: {
    score: number;
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    consistencyScore: number;
    explanation: {
      strengths: string[];
      weakAreas: string[];
      missingSkills: string[];
    };
  };
}

const CAREER_TRACKS = [
  'Software Engineer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Java Developer',
  'Python Developer',
  'MERN Stack Developer',
  'Data Analyst',
  'Data Scientist',
  'Machine Learning Engineer',
  'AI Engineer',
  'DevOps Engineer',
  'Cloud Engineer',
  'Cyber Security Analyst',
  'Network Engineer',
  'Android Developer',
  'iOS Developer',
  'QA/Test Engineer',
  'Business Analyst',
  'Product Manager',
  'UI/UX Designer',
];

function DashboardContent() {
  const { user, loading: authLoading, updateUserSkills } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'voice' | 'coding' | 'resume' | 'roadmap'>('overview');

  // AI Career Roadmaps state
  const [roadmapDetails, setRoadmapDetails] = useState<any>(null);
  const [roadmapLoading, setRoadmapLoading] = useState<boolean>(false);
  const [selectedTrack, setSelectedTrack] = useState<string>('Software Engineer');
  const [selectedLevel, setSelectedLevel] = useState<string>('Beginner');

  // Resume upload local states inside resume tab
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<string>('');
  const [showUploader, setShowUploader] = useState<boolean>(false);
  const [expandedResumeReport, setExpandedResumeReport] = useState<boolean>(true);

  // Accordion state for history lists
  const [expandedVoiceId, setExpandedVoiceId] = useState<string | null>(null);
  const [expandedCodingId, setExpandedCodingId] = useState<string | null>(null);

  // Read URL search params to lock to tab on mount
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['overview', 'voice', 'coding', 'resume', 'roadmap'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading && !user) {
      const currentUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
      const redirectQuery = currentUrl ? `?redirect=${encodeURIComponent(currentUrl)}` : '';
      router.push(`/login${redirectQuery}`);
    }
  }, [user, authLoading, router]);

  const fetchSummary = async () => {
    try {
      const res = await api.get<DashboardSummary>('/dashboard/summary');
      setData(res);
    } catch (err: any) {
      console.error('Failed to load dashboard summary', err);
      setError('Unable to load analytics summary.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoadmapDetails = async () => {
    setRoadmapLoading(true);
    try {
      const res = await api.get<any>('/roadmaps');
      setRoadmapDetails(res);
    } catch (err) {
      console.error('Failed to load roadmap details', err);
    } finally {
      setRoadmapLoading(false);
    }
  };

  const handleSelectCareer = async (track: string, level: string) => {
    setRoadmapLoading(true);
    try {
      const res = await api.post<any>('/roadmaps/select', {
        careerTrack: track,
        skillLevel: level,
      });
      setRoadmapDetails(res);
      await fetchSummary();
    } catch (err) {
      console.error('Failed to update career roadmap selection', err);
    } finally {
      setRoadmapLoading(false);
    }
  };

  const handleToggleTopic = async (topicName: string) => {
    try {
      const res = await api.post<any>('/roadmaps/toggle-topic', { topicName });
      setRoadmapDetails(res);
    } catch (err) {
      console.error('Failed to toggle topic completion', err);
    }
  };

  useEffect(() => {
    if (roadmapDetails) {
      setSelectedTrack(roadmapDetails.selectedCareer || 'Software Engineer');
      setSelectedLevel(roadmapDetails.skillLevel || 'Beginner');
    }
  }, [roadmapDetails]);

  useEffect(() => {
    if (user && activeTab === 'roadmap') {
      fetchRoadmapDetails();
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (user) {
      fetchSummary();
    }
  }, [user]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are supported');
      return;
    }

    setUploadError('');
    setUploadSuccess('');
    setUploading(true);

    try {
      const res = await api.upload<{ message: string; resume: any }>('/resumes/upload', file);
      updateUserSkills(res.resume.skills);
      setUploadSuccess('Resume analyzed successfully! Real-time stats updated.');
      setShowUploader(false);
      // Re-fetch dashboard values to update state
      await fetchSummary();
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Failed to process resume');
    } finally {
      setUploading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center">
        <p className="text-red-400 mb-4">{error || 'Something went wrong'}</p>
        <button
          onClick={() => window.location.reload()}
          className="glass-panel px-6 py-2 rounded-xl hover:bg-white/10"
        >
          Retry Load
        </button>
      </div>
    );
  }

  const {
    metrics,
    recentActivity,
    skillsRadar,
    performanceTimeline,
    historyList,
    voiceHistory,
    codingHistory,
    resumeAnalysis,
    roadmap
  } = data;

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="w-full max-w-[95%] xl:max-w-[98%] mx-auto px-6 py-10">
          {/* Welcome header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="font-outfit text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
                Welcome back, <span className="text-indigo-400">{user?.name}</span>!
              </h1>
              <p className="text-slate-400 text-sm">
                Review your mock results, evaluate coding submissions, and study your custom AI roadmap.
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/studio"
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold rounded-xl shadow-lg transition"
              >
                <Plus className="h-4 w-4" />
                Setup Mock Interview
              </Link>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-white/5 pb-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'glass-panel text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'voice'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'glass-panel text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mic className="h-4 w-4" />
              Voice Simulation
            </button>
            <button
              onClick={() => setActiveTab('coding')}
              className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'coding'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'glass-panel text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Code className="h-4 w-4" />
              Coding Assessment
            </button>
            <button
              onClick={() => setActiveTab('resume')}
              className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'resume'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'glass-panel text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <FileText className="h-4 w-4" />
              Resume Intelligence
            </button>
            <button
              onClick={() => setActiveTab('roadmap')}
              className={`flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'roadmap'
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                  : 'glass-panel text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Award className="h-4 w-4" />
              AI Roadmaps
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
                <div className="glass-panel p-5 rounded-2xl bg-opacity-20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Total attempts</p>
                  <h3 className="font-outfit text-2xl font-bold text-white">{metrics.totalInterviews}</h3>
                </div>
                <div className="glass-panel p-5 rounded-2xl bg-opacity-20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Completed</p>
                  <h3 className="font-outfit text-2xl font-bold text-emerald-400">{metrics.totalCompleted}</h3>
                </div>
                <div className="glass-panel p-5 rounded-2xl bg-opacity-20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Average Score</p>
                  <h3 className="font-outfit text-2xl font-bold text-indigo-400">
                    {metrics.avgScore > 0 ? `${metrics.avgScore}%` : 'N/A'}
                  </h3>
                </div>
                <div className="glass-panel p-5 rounded-2xl bg-opacity-20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Best Score</p>
                  <h3 className="font-outfit text-2xl font-bold text-purple-400">
                    {metrics.bestScore > 0 ? `${metrics.bestScore}%` : 'N/A'}
                  </h3>
                </div>
                <div className="glass-panel p-5 rounded-2xl bg-opacity-20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Coding Accuracy</p>
                  <h3 className="font-outfit text-2xl font-bold text-cyan-400">
                    {metrics.codingAccuracy > 0 ? `${metrics.codingAccuracy}%` : 'N/A'}
                  </h3>
                </div>
                <div className="glass-panel p-5 rounded-2xl bg-opacity-20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">Communication</p>
                  <h3 className="font-outfit text-2xl font-bold text-amber-400">
                    {metrics.communicationScore > 0 ? `${metrics.communicationScore}%` : 'N/A'}
                  </h3>
                </div>
              </div>

              {/* Recent Activity Logger Card */}
              <div className="glass-panel p-6 rounded-2xl bg-opacity-25 mb-8">
                <h3 className="font-outfit text-sm font-bold text-white mb-4.5 flex items-center gap-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
                  Recent SaaS Activity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Last Voice */}
                  <div className="bg-white/3 border border-white/5 p-4 rounded-xl flex flex-col justify-between min-h-[110px]">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Last Interview</p>
                      <h4 className="text-xs font-semibold text-white mt-1.5">
                        {recentActivity.lastInterview ? recentActivity.lastInterview.role : 'No voice simulations logged'}
                      </h4>
                    </div>
                    {recentActivity.lastInterview && (
                      <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500">
                        <span>{new Date(recentActivity.lastInterview.date).toLocaleDateString()}</span>
                        <span className="font-bold text-emerald-400">{recentActivity.lastInterview.score}% score</span>
                      </div>
                    )}
                  </div>

                  {/* Last Coding */}
                  <div className="bg-white/3 border border-white/5 p-4 rounded-xl flex flex-col justify-between min-h-[110px]">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Last Coding Round</p>
                      <h4 className="text-xs font-semibold text-white mt-1.5 line-clamp-1">
                        {recentActivity.lastCodingRound ? recentActivity.lastCodingRound.problem : 'No coding tests logged'}
                      </h4>
                    </div>
                    {recentActivity.lastCodingRound && (
                      <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500">
                        <span>{new Date(recentActivity.lastCodingRound.date).toLocaleDateString()}</span>
                        <span className="font-bold text-cyan-400">{recentActivity.lastCodingRound.score}% score</span>
                      </div>
                    )}
                  </div>

                  {/* Last Resume */}
                  <div className="bg-white/3 border border-white/5 p-4 rounded-xl flex flex-col justify-between min-h-[110px]">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Last Resume Checked</p>
                      <h4 className="text-xs font-semibold text-white mt-1.5 line-clamp-1">
                        {recentActivity.lastResumeAnalysis ? recentActivity.lastResumeAnalysis.fileName : 'No resumes parsed yet'}
                      </h4>
                    </div>
                    {recentActivity.lastResumeAnalysis && (
                      <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500">
                        <span>{new Date(recentActivity.lastResumeAnalysis.date).toLocaleDateString()}</span>
                        <span className="font-bold text-purple-400">ATS Synced</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* V2 Advanced Dashboard Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {/* 1. Career Readiness Widget */}
                {data.careerReadiness && (
                  <div className="glass-panel p-5.5 rounded-2xl bg-opacity-20 flex flex-col justify-between border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/10 rounded-full blur-2xl" />
                    <div>
                      <h4 className="font-outfit text-sm font-bold text-white mb-3.5 flex items-center gap-1.5">
                        <Award className="h-4.5 w-4.5 text-indigo-400" />
                        Career Readiness Score V2
                      </h4>
                      <div className="flex items-center gap-4.5 mb-4">
                        <div className="relative h-16 w-16 flex items-center justify-center">
                          <svg className="absolute transform -rotate-90 w-full h-full">
                            <circle cx="32" cy="32" r="26" stroke="rgba(255,255,255,0.05)" strokeWidth="5" fill="transparent" />
                            <circle cx="32" cy="32" r="26" stroke="#6366f1" strokeWidth="5" fill="transparent"
                              strokeDasharray={2 * Math.PI * 26}
                              strokeDashoffset={2 * Math.PI * 26 * (1 - data.careerReadiness.score / 100)}
                              className="transition-all duration-500 ease-out" />
                          </svg>
                          <span className="font-outfit text-sm font-black text-white">{data.careerReadiness.score}%</span>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 uppercase tracking-widest">Readiness Level</p>
                          <span className={`inline-block px-2.5 py-0.5 mt-1 text-[9px] font-extrabold rounded-lg ${
                            data.careerReadiness.level === 'Advanced' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20' :
                            data.careerReadiness.level === 'Intermediate' ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' :
                            'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                          }`}>{data.careerReadiness.level}</span>
                          <p className="text-[9px] text-slate-500 mt-1">Consistency Index: {data.careerReadiness.consistencyScore}</p>
                        </div>
                      </div>
                      <div className="space-y-2 border-t border-white/5 pt-3.5 text-[10px]">
                        <div>
                          <span className="text-slate-400">Strengths: </span>
                          <span className="text-slate-200 font-semibold">{data.careerReadiness.explanation.strengths.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Weak Areas: </span>
                          <span className="text-slate-200 font-semibold">{data.careerReadiness.explanation.weakAreas.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Missing Skills: </span>
                          <span className="text-slate-200 font-semibold">{data.careerReadiness.explanation.missingSkills.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. AI Interview Memory Widget */}
                <div className="glass-panel p-5.5 rounded-2xl bg-opacity-20 flex flex-col justify-between border border-white/5">
                  <div>
                    <h4 className="font-outfit text-sm font-bold text-white mb-3.5 flex items-center gap-1.5">
                      <Sparkles className="h-4.5 w-4.5 text-purple-400" />
                      AI Interview Memory
                    </h4>
                    {data.aiMemoryMilestones && data.aiMemoryMilestones.length > 0 ? (
                      <div className="flex flex-col gap-2.5 max-h-[140px] overflow-y-auto pr-1">
                        {data.aiMemoryMilestones.map((milestone, idx) => (
                          <div key={idx} className="p-2.5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl text-[10px] text-indigo-200 leading-normal">
                            {milestone}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-500 text-[10px] italic py-6 text-center my-auto">No topic improvement data recorded yet. Keep practicing to build AI memory details.</p>
                    )}
                  </div>
                </div>

                {/* 3. Difficulty Analytics Widget */}
                {data.difficultyAnalytics && (
                  <div className="glass-panel p-5.5 rounded-2xl bg-opacity-20 flex flex-col justify-between border border-white/5">
                    <div>
                      <h4 className="font-outfit text-sm font-bold text-white mb-3.5 flex items-center gap-1.5">
                        <BarChart3 className="h-4.5 w-4.5 text-indigo-400" />
                        Difficulty Analytics
                      </h4>
                      <div className="space-y-2.5">
                        <div>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-slate-300 font-medium">Easy Question Accuracy</span>
                            <span className="text-emerald-400 font-bold">{data.difficultyAnalytics.easy}%</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                            <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${data.difficultyAnalytics.easy}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-slate-300 font-medium">Medium Question Accuracy</span>
                            <span className="text-indigo-400 font-bold">{data.difficultyAnalytics.medium}%</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                            <div className="bg-indigo-500 h-1 rounded-full" style={{ width: `${data.difficultyAnalytics.medium}%` }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-slate-300 font-medium">Hard Question Accuracy</span>
                            <span className="text-purple-400 font-bold">{data.difficultyAnalytics.hard}%</span>
                          </div>
                          <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                            <div className="bg-purple-500 h-1 rounded-full" style={{ width: `${data.difficultyAnalytics.hard}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Weak & Strong Topics Tracker Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                {/* 4. Weak Topics Widget */}
                <div className="glass-panel p-5 rounded-2xl bg-opacity-20 border border-white/5">
                  <h4 className="font-outfit text-sm font-bold text-white mb-3.5 flex items-center gap-1.5 text-red-400">
                    <AlertTriangle className="h-4.5 w-4.5 text-red-400" />
                    Historically Weak Topics (<span className="text-[10px] font-normal text-slate-400">score &lt; 60%</span>)
                  </h4>
                  {data.weakTopics && data.weakTopics.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {data.weakTopics.map((wt, idx) => (
                        <div key={idx} className="px-2.5 py-1.5 bg-red-500/10 border border-red-500/20 text-[10px] font-semibold rounded-xl text-red-300 flex items-center gap-2">
                          <span className="h-1 w-1 bg-red-400 rounded-full" />
                          <span>{wt.topic}: {wt.score}%</span>
                          {wt.improvementStatus !== 'Needs Review' && (
                            <span className="text-[8px] uppercase px-1 py-0.5 rounded bg-emerald-500/15 text-emerald-400 ml-1.5">{wt.improvementStatus}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-[10px] italic py-2">No weak topics flagged yet! Excellent job.</p>
                  )}
                </div>

                {/* 5. Strong Topics Widget */}
                <div className="glass-panel p-5 rounded-2xl bg-opacity-20 border border-white/5">
                  <h4 className="font-outfit text-sm font-bold text-white mb-3.5 flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-400" />
                    Syllabus Strong Areas (<span className="text-[10px] font-normal text-slate-400">score &ge; 70%</span>)
                  </h4>
                  {data.strongTopics && data.strongTopics.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {data.strongTopics.map((topic, idx) => (
                        <div key={idx} className="px-2.5 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-semibold rounded-xl text-emerald-300 flex items-center gap-2">
                          <span className="h-1 w-1 bg-emerald-400 rounded-full" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-[10px] italic py-2">No strong topics tracked yet. Practice more rounds to build metrics.</p>
                  )}
                </div>
              </div>

              {/* 6. Company Performance Analytics Widget */}
              {data.companyMetrics && (
                <div className="glass-panel p-5 rounded-2xl bg-opacity-20 border border-white/5 mb-8">
                  <h4 className="font-outfit text-sm font-bold text-white mb-3.5 flex items-center gap-1.5">
                    <Briefcase className="h-4.5 w-4.5 text-indigo-400" />
                    Company-wise Mock Performance
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3.5">
                    {Object.entries(data.companyMetrics).map(([company, metrics]) => (
                      <div key={company} className="bg-white/3 border border-white/5 p-3 rounded-xl text-center flex flex-col justify-between min-h-[95px]">
                        <h5 className="text-[10px] font-bold text-white tracking-tight">{company}</h5>
                        <div>
                          <p className="text-[16px] font-extrabold text-indigo-400 leading-tight">
                            {metrics.attempts > 0 ? `${metrics.avgScore}%` : '--'}
                          </p>
                          <p className="text-[7px] text-slate-500 uppercase tracking-wider mt-0.5">Avg Score</p>
                        </div>
                        <div className="flex justify-between items-center text-[8px] text-slate-400 mt-2 border-t border-white/5 pt-1.5">
                          <span>Attempts: {metrics.attempts}</span>
                          <span>Best: {metrics.attempts > 0 ? `${metrics.bestScore}%` : '--'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. Advanced Project Viva Scoring Performance Widget */}
              {data.vivaPerformance && data.vivaPerformance.length > 0 && (
                <div className="glass-panel p-5 rounded-2xl bg-opacity-20 border border-white/5 mb-8">
                  <h4 className="font-outfit text-sm font-bold text-white mb-3.5 flex items-center gap-1.5">
                    <Cpu className="h-4.5 w-4.5 text-indigo-400" />
                    Project Viva Scorecard Reports
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {data.vivaPerformance.map((viva) => (
                      <div key={viva.id} className="bg-white/3 border border-white/5 p-3.5 rounded-xl flex flex-col gap-2.5">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h5 className="text-[11px] font-bold text-white">{viva.projectName}</h5>
                            <p className="text-[8px] text-slate-400 mt-0.5">Viva Level: {viva.vivaLevel} • {new Date(viva.date).toLocaleDateString()}</p>
                          </div>
                          <span className="text-sm font-black text-indigo-400">{viva.overallScore}%</span>
                        </div>
                        <div className="grid grid-cols-5 gap-1.5 border-t border-white/5 pt-2 text-center">
                          <div>
                            <p className="text-[10px] font-bold text-white">{viva.scores.architecture}</p>
                            <p className="text-[6px] text-slate-500 uppercase tracking-tighter">Arch</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-white">{viva.scores.technology}</p>
                            <p className="text-[6px] text-slate-500 uppercase tracking-tighter">Tech</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-white">{viva.scores.deployment}</p>
                            <p className="text-[6px] text-slate-500 uppercase tracking-tighter">Deploy</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-white">{viva.scores.problemSolving}</p>
                            <p className="text-[6px] text-slate-500 uppercase tracking-tighter">Problem</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-white">{viva.scores.communication}</p>
                            <p className="text-[6px] text-slate-500 uppercase tracking-tighter">Comm</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {metrics.totalCompleted === 0 ? (
                <div className="glass-panel p-10 rounded-3xl text-center bg-opacity-10 mb-10 flex flex-col items-center justify-center">
                  <div className="h-16 w-16 bg-indigo-500/15 rounded-2xl border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-6">
                    <BookOpen className="h-8 w-8 animate-float" />
                  </div>
                  <h3 className="font-outfit text-2xl font-bold text-white mb-2">No Interview Reports Yet</h3>
                  <p className="text-slate-400 max-w-md mb-8 text-sm">
                    Begin practicing with AI mock challenges. You can check your resume analytics first to auto-generate specific technical questions!
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setActiveTab('resume')}
                      className="glass-panel px-6 py-3 rounded-xl border-white/10 hover:bg-white/10 text-sm font-semibold text-slate-200"
                    >
                      Check Resume ATS
                    </button>
                    <Link
                      href="/studio"
                      className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-sm font-bold text-white rounded-xl shadow-lg transition"
                    >
                      Start Practice Studio
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  {/* Visual charts */}
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
                    <div className="glass-panel p-6 rounded-2xl bg-opacity-20 flex flex-col justify-between">
                      <div className="mb-4">
                        <h3 className="font-outfit text-lg font-bold text-white">Score Progression</h3>
                        <p className="text-xs text-slate-400">Track your performance grade over historical attempts</p>
                      </div>
                      <div className="h-80 w-full text-slate-300">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={performanceTimeline} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                            <defs>
                              <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="var(--text-secondary)" fontSize={11} tickLine={false} />
                            <YAxis stroke="var(--text-secondary)" fontSize={11} tickLine={false} domain={[0, 100]} />
                            <Tooltip
                              contentStyle={{
                                background: 'var(--card-bg)',
                                borderColor: 'var(--card-border)',
                                borderRadius: '12px',
                                color: 'var(--foreground)',
                                backdropFilter: 'blur(8px)',
                              }}
                            />
                            <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl bg-opacity-20 flex flex-col justify-between">
                      <div className="mb-4">
                        <h3 className="font-outfit text-lg font-bold text-white">Capabilities Mapping</h3>
                        <p className="text-xs text-slate-400">Strength levels split across critical communication & coding metrics</p>
                      </div>
                      <div className="h-80 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="60%" data={skillsRadar}>
                            <PolarGrid stroke="var(--chart-grid)" />
                            <PolarAngleAxis dataKey="subject" stroke="var(--text-secondary)" fontSize={10} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--chart-axis)" tick={false} />
                            <Radar name="Candidate Metrics" dataKey="score" stroke="#a855f7" fill="#a855f7" fillOpacity={0.25} />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* General records table */}
                  <div className="glass-panel p-6 rounded-2xl bg-opacity-20">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-indigo-400" />
                        <h3 className="font-outfit text-lg font-bold text-white">All Attempts</h3>
                      </div>
                    </div>

                    <div className="overflow-x-auto -mx-6 px-6">
                      <table className="w-full text-left text-sm border-collapse min-w-[700px]">
                        <thead>
                          <tr className="border-b border-white/5 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                            <th className="py-3 px-4 whitespace-nowrap">Role / Category</th>
                            <th className="py-3 px-4 whitespace-nowrap">Type</th>
                            <th className="py-3 px-4 whitespace-nowrap">Status</th>
                            <th className="py-3 px-4 whitespace-nowrap">Overall Score</th>
                            <th className="py-3 px-4 whitespace-nowrap">Date</th>
                            <th className="py-3 px-4 text-right whitespace-nowrap">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-slate-200">
                          {historyList.map((item) => (
                            <tr key={item.id} className="hover:bg-white/3 transition">
                              <td className="py-4 px-4 font-semibold text-white whitespace-nowrap">{item.role}</td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                  {item.type}
                                </span>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg ${
                                    item.status === 'Completed'
                                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                  }`}
                                >
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 font-bold whitespace-nowrap">
                                {item.overallScore !== null ? (
                                  <span className={item.overallScore >= 75 ? 'text-emerald-400' : 'text-slate-200'}>
                                    {item.overallScore}%
                                  </span>
                                ) : (
                                  <span className="text-slate-500 font-normal">--</span>
                                )}
                              </td>
                              <td className="py-4 px-4 text-slate-400 text-xs whitespace-nowrap">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-4 px-4 text-right whitespace-nowrap">
                                {item.status === 'Completed' ? (
                                  <Link
                                    href={`/feedback/${item.id}`}
                                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                                  >
                                    Feedback Report
                                    <ChevronRight className="h-4 w-4" />
                                  </Link>
                                ) : (
                                  <Link
                                    href={`/interview/${item.id}`}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition"
                                  >
                                    <Play className="h-3 w-3 fill-white" />
                                    Resume
                                  </Link>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: VOICE SIMULATION HISTORY */}
          {activeTab === 'voice' && (
            <div>
              {voiceHistory.length === 0 ? (
                <div className="glass-panel p-10 rounded-3xl text-center bg-opacity-10 mb-10 flex flex-col items-center justify-center">
                  <Mic className="h-12 w-12 text-slate-500 mb-4 animate-float" />
                  <h3 className="font-outfit text-xl font-bold text-white mb-2">Start Your First Voice Interview</h3>
                  <p className="text-slate-400 max-w-sm mb-6 text-sm leading-relaxed">
                    Test your verbal explanation skills under behavioral or technical rounds. Get feedback on technical correctness and speech confidence.
                  </p>
                  <Link
                    href="/studio"
                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-sm font-bold text-white rounded-xl shadow-lg transition"
                  >
                    Launch Voice Simulation
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-outfit text-lg font-bold text-white">Voice Simulation Attempts</h3>
                    <span className="text-xs text-slate-400 font-medium">{voiceHistory.length} attempts found</span>
                  </div>

                  {voiceHistory.map((item) => {
                    const isExpanded = expandedVoiceId === item.id;
                    return (
                      <div key={item.id} className="glass-panel rounded-2xl bg-opacity-20 overflow-hidden transition">
                        {/* Header bar */}
                        <div
                          onClick={() => setExpandedVoiceId(isExpanded ? null : item.id)}
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/2 select-none"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-outfit text-md font-bold text-white">{item.role}</h4>
                              <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/10">
                                {item.type}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              {new Date(item.date).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Evaluation Score</p>
                              <p className="font-outfit text-xl font-extrabold text-indigo-400">
                                {item.score !== null ? `${item.score}%` : 'In-Progress'}
                              </p>
                            </div>
                            <ChevronRight className={`h-5 w-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </div>
                        </div>

                        {/* Expandable details */}
                        {isExpanded && (
                          <div className="px-5 pb-6 border-t border-white/5 pt-5 bg-black/15">
                            {/* Summary cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                                <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Key Strengths</h5>
                                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                                  {item.strengths && item.strengths.length > 0 ? (
                                    item.strengths.map((str, i) => <li key={i}>{str}</li>)
                                  ) : (
                                    <li>Good initial structures and confidence.</li>
                                  )}
                                </ul>
                              </div>
                              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                                <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">Areas of Growth</h5>
                                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                                  {item.weaknesses && item.weaknesses.length > 0 ? (
                                    item.weaknesses.map((weak, i) => <li key={i}>{weak}</li>)
                                  ) : (
                                    <li>Expand on architectural terminology.</li>
                                  )}
                                </ul>
                              </div>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed mb-6 bg-white/3 p-4 rounded-xl border border-white/5">
                              <strong>AI Summary Feedback:</strong> {item.feedback || 'Completed round evaluation successfully.'}
                            </p>

                            {/* CTA Action Buttons */}
                            <div className="flex flex-wrap gap-3 mb-8">
                              <Link
                                href={`/feedback/${item.id}`}
                                className="px-4.5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-xs font-bold text-white rounded-xl shadow-lg transition"
                              >
                                View Detailed Report
                              </Link>
                              <Link
                                href="/studio"
                                className="px-4.5 py-2.5 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 rounded-xl border border-white/5 transition"
                              >
                                Retake Interview
                              </Link>
                              <Link
                                href="/studio"
                                className="px-4.5 py-2.5 bg-transparent hover:bg-white/3 text-xs font-semibold text-slate-400 hover:text-white transition"
                              >
                                Continue Practice
                              </Link>
                            </div>

                            {/* Spoken questions logs */}
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Question and Response Log</h5>
                            <div className="flex flex-col gap-4">
                              {item.questions.map((q, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-white/2 border border-white/5">
                                  <div className="flex justify-between items-start gap-4 mb-3">
                                    <h6 className="text-xs font-bold text-white">Q{idx + 1}: {q.questionText}</h6>
                                    {q.score !== null && (
                                      <span className="text-xs font-bold text-indigo-400 whitespace-nowrap">{q.score}%</span>
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-400 italic bg-black/20 p-3 rounded-lg border border-white/3 leading-relaxed mb-3">
                                    " {q.candidateAnswer || '[No spoken answer recorded]'} "
                                  </p>
                                  {q.feedback && (
                                    <p className="text-[11px] text-slate-300 leading-relaxed">
                                      <strong>AI Critique:</strong> {q.feedback}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CODING ASSESSMENT HISTORY */}
          {activeTab === 'coding' && (
            <div>
              {codingHistory.length === 0 ? (
                <div className="glass-panel p-10 rounded-3xl text-center bg-opacity-10 mb-10 flex flex-col items-center justify-center">
                  <Code className="h-12 w-12 text-slate-500 mb-4 animate-float" />
                  <h3 className="font-outfit text-xl font-bold text-white mb-2">No Coding Submissions Found</h3>
                  <p className="text-slate-400 max-w-sm mb-6 text-sm leading-relaxed">
                    Test your logic in core languages (Python, JS, C++, Java) in the interactive sandbox compiler.
                  </p>
                  <Link
                    href="/studio"
                    className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-sm font-bold text-white rounded-xl shadow-lg transition"
                  >
                    Start Coding Challenge
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-outfit text-lg font-bold text-white">Coding Assessment History</h3>
                    <span className="text-xs text-slate-400 font-medium">{codingHistory.length} challenges submitted</span>
                  </div>

                  {codingHistory.map((item) => {
                    const isExpanded = expandedCodingId === item.id;
                    return (
                      <div key={item.id} className="glass-panel rounded-2xl bg-opacity-20 overflow-hidden transition">
                        <div
                          onClick={() => setExpandedCodingId(isExpanded ? null : item.id)}
                          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/2 select-none"
                        >
                          <div>
                            <h4 className="font-outfit text-xs font-bold text-white line-clamp-1">{item.problem}</h4>
                            <div className="flex items-center gap-3 mt-1.5 text-[10px] text-slate-400">
                              <span className="uppercase font-semibold text-cyan-400">{item.language}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {item.timeTaken}
                              </span>
                              <span>•</span>
                              <span>{new Date(item.date).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Compile score</p>
                              <p className="font-outfit text-lg font-bold text-cyan-400">
                                {item.score !== null ? `${item.score}%` : 'Reviewed'}
                              </p>
                            </div>
                            <ChevronRight className={`h-5 w-5 text-slate-500 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="px-5 pb-6 border-t border-white/5 pt-5 bg-black/15">
                            {/* Code Submission */}
                            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Your Submitted Solution</h5>
                            <pre className="p-4 bg-slate-950 border border-white/5 rounded-xl text-xs text-slate-300 font-mono overflow-x-auto leading-relaxed mb-6 max-h-60">
                              <code>{item.code}</code>
                            </pre>

                            {/* Review Box */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                              <div className="md:col-span-2 p-4 rounded-xl bg-white/3 border border-white/5">
                                <h5 className="text-xs font-bold text-white mb-2">AI Code Optimization Critique</h5>
                                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{item.feedback}</p>
                              </div>
                              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                                <h5 className="text-xs font-bold text-red-400 mb-2">Identified Mistakes / Gaps</h5>
                                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                                  {item.mistakes && item.mistakes.length > 0 ? (
                                    item.mistakes.map((mis, i) => <li key={i}>{mis}</li>)
                                  ) : (
                                    <li>Code compiles cleanly. Optimize loop pointers.</li>
                                  )}
                                </ul>
                              </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                              <button
                                onClick={() => setExpandedCodingId(null)}
                                className="px-4.5 py-2 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 rounded-lg border border-white/5 transition"
                              >
                                Collapse Submission
                              </button>
                              <Link
                                href="/studio"
                                className="px-4.5 py-2 bg-indigo-500 hover:bg-indigo-600 text-xs font-bold text-white rounded-lg shadow-md transition"
                              >
                                Retry Challenge
                              </Link>
                              <Link
                                href="/studio"
                                className="px-4.5 py-2 bg-transparent hover:bg-white/3 text-xs font-semibold text-slate-400 hover:text-white transition"
                              >
                                New Assessment
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: RESUME INTELLIGENCE ANALYSIS */}
          {activeTab === 'resume' && (
            <div>
              {resumeAnalysis === null ? (
                /* Uploader view */
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <h3 className="font-outfit text-xl font-bold text-white mb-2">Resume Intelligence screening</h3>
                    <p className="text-slate-400 text-xs leading-relaxed max-w-sm mx-auto">
                      Upload your resume PDF to extract relevant skills and automatically customize mock technical interview questions.
                    </p>
                  </div>

                  <div className="glass-panel p-8 rounded-3xl bg-opacity-20 flex flex-col items-center text-center justify-center min-h-[300px] relative">
                    {uploading ? (
                      <div className="flex flex-col items-center justify-center">
                        <Loader className="h-10 w-10 text-indigo-400 animate-spin mb-4" />
                        <p className="text-sm font-semibold text-white">Parsing PDF...</p>
                        <p className="text-xs text-slate-400 mt-1">Extracting skills via AI</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-10 w-10 text-indigo-400 mb-4 animate-float" />
                        <h3 className="font-outfit text-md font-bold text-white mb-1.5">Upload Resume</h3>
                        <p className="text-xs text-slate-400 mb-6">Select a single PDF file (Max 5MB)</p>
                        {uploadError && (
                          <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl">
                            {uploadError}
                          </div>
                        )}

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
              ) : (
                /* Analysis view */
                <div className="flex flex-col gap-6">
                  {uploadSuccess && (
                    <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                      <span>{uploadSuccess}</span>
                      <button onClick={() => setUploadSuccess('')}>
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left details */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                      <div className="glass-panel p-6 rounded-2xl bg-opacity-20 flex flex-col items-center text-center">
                        <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                          <FileText className="h-6 w-6" />
                        </div>
                        <h4 className="font-outfit text-md font-bold text-white line-clamp-1 max-w-[200px]">
                          {resumeAnalysis.fileName}
                        </h4>
                        <p className="text-[10px] text-slate-500 mt-1">Uploaded PDF active profile</p>

                        <div className="my-6 relative flex items-center justify-center">
                          {/* Circular Gauge Score */}
                          <div className="relative h-28 w-28 flex items-center justify-center">
                            <svg className="absolute transform -rotate-90 w-full h-full">
                              <circle
                                cx="56"
                                cy="56"
                                r="45"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="8"
                                fill="transparent"
                              />
                              <circle
                                cx="56"
                                cy="56"
                                r="45"
                                stroke="#6366f1"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 45}
                                strokeDashoffset={2 * Math.PI * 45 * (1 - resumeAnalysis.atsScore / 100)}
                              />
                            </svg>
                            <div className="flex flex-col items-center justify-center">
                              <span className="font-outfit text-2xl font-extrabold text-white">{resumeAnalysis.atsScore}</span>
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">ATS Score</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2.5 w-full">
                          <button
                            onClick={() => setShowUploader(!showUploader)}
                            className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-600 text-xs font-bold text-white rounded-xl shadow-md transition cursor-pointer"
                          >
                            Upload New Resume
                          </button>
                          <button
                            onClick={() => {
                              setShowUploader(true);
                              setUploadError('');
                            }}
                            className="w-full py-2.5 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 rounded-xl border border-white/5 transition cursor-pointer"
                          >
                            Reanalyze Resume
                          </button>
                        </div>
                      </div>

                      {/* Hidden conditional uploader slider */}
                      {showUploader && (
                        <div className="glass-panel p-5 rounded-2xl bg-opacity-25 relative">
                          <button
                            onClick={() => setShowUploader(false)}
                            className="absolute top-4 right-4 text-slate-500 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          <h5 className="text-xs font-bold text-white mb-2">Upload New File</h5>
                          {uploading ? (
                            <div className="flex flex-col items-center justify-center py-6">
                              <Loader className="h-6 w-6 text-indigo-400 animate-spin mb-2" />
                              <p className="text-[10px] text-slate-400">Uploading...</p>
                            </div>
                          ) : (
                            <input
                              type="file"
                              accept=".pdf"
                              onChange={handleFileUpload}
                              className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-500/10 file:text-indigo-300 hover:file:bg-indigo-500/20 cursor-pointer"
                            />
                          )}
                          {uploadError && <p className="text-[10px] text-red-400 mt-2">{uploadError}</p>}
                        </div>
                      )}
                    </div>

                    {/* Right details */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                      <div className="glass-panel p-6 rounded-2xl bg-opacity-20">
                        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                          <h4 className="font-outfit text-sm font-bold text-white">Full Resume Strength Analysis</h4>
                          <button
                            onClick={() => setExpandedResumeReport(!expandedResumeReport)}
                            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                          >
                            {expandedResumeReport ? 'Hide report' : 'View Full Analysis'}
                          </button>
                        </div>

                        {expandedResumeReport && (
                          <div className="flex flex-col gap-5">
                            <div>
                              <h5 className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-1">Strength report summary</h5>
                              <p className="text-xs text-slate-300 leading-relaxed">{resumeAnalysis.strengthReport}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                                <h5 className="text-[10px] font-bold uppercase text-red-400 tracking-wider mb-2.5 flex items-center gap-1">
                                  <AlertTriangle className="h-3.5 w-3.5" />
                                  Missing skills keywords
                                </h5>
                                <div className="flex flex-wrap gap-1.5">
                                  {resumeAnalysis.missingSkills.length > 0 ? (
                                    resumeAnalysis.missingSkills.map((sk) => (
                                      <span key={sk} className="px-2 py-1 rounded bg-red-500/10 text-red-300 text-[10px] font-medium border border-red-500/10">
                                        {sk}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-[10px] text-slate-500 italic">No missing skills detected</span>
                                  )}
                                </div>
                              </div>

                              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                                <h5 className="text-[10px] font-bold uppercase text-amber-400 tracking-wider mb-2 flex items-center gap-1">
                                  <Sparkles className="h-3.5 w-3.5" />
                                  Suggested Improvements
                                </h5>
                                <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                                  {resumeAnalysis.suggestedImprovements.map((imp, i) => (
                                    <li key={i}>{imp}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Active parsed skills */}
                      <div className="glass-panel p-6 rounded-2xl bg-opacity-20">
                        <div className="flex items-center gap-2 mb-4">
                          <Tag className="h-4.5 w-4.5 text-indigo-400" />
                          <h4 className="font-outfit text-sm font-bold text-white">Extracted Skills (Synced)</h4>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {resumeAnalysis.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-slate-300"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: AI ROADMAPS */}
          {activeTab === 'roadmap' && (
            <div>
              {/* Selectors Bar */}
              <div className="glass-panel p-6 rounded-2xl bg-opacity-20 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5">
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-indigo-400 animate-float" />
                  <div>
                    <h3 className="font-outfit text-lg font-bold text-white">AI Career Roadmap Engine</h3>
                    <p className="text-slate-400 text-xs">Generate personalized paths, trace progress, and review target recommendations.</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                  <div className="flex flex-col gap-1.5 min-w-[200px] flex-1 md:flex-none">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Career Track</label>
                    <select
                      value={selectedTrack}
                      onChange={(e) => {
                        setSelectedTrack(e.target.value);
                        handleSelectCareer(e.target.value, selectedLevel);
                      }}
                      className="glass-panel w-full px-4 py-2 text-xs font-semibold text-white bg-slate-900 border border-white/5 rounded-xl outline-none focus:border-indigo-500 transition cursor-pointer"
                    >
                      {CAREER_TRACKS.map((track) => (
                        <option key={track} value={track} className="bg-slate-900 text-white">
                          {track}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5 min-w-[150px] flex-1 md:flex-none">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Skill Level</label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => {
                        setSelectedLevel(e.target.value);
                        handleSelectCareer(selectedTrack, e.target.value);
                      }}
                      className="glass-panel w-full px-4 py-2 text-xs font-semibold text-white bg-slate-900 border border-white/5 rounded-xl outline-none focus:border-indigo-500 transition cursor-pointer"
                    >
                      <option value="Beginner" className="bg-slate-900 text-white">Beginner</option>
                      <option value="Intermediate" className="bg-slate-900 text-white">Intermediate</option>
                      <option value="Advanced" className="bg-slate-900 text-white">Advanced</option>
                    </select>
                  </div>
                </div>
              </div>

              {roadmapLoading && !roadmapDetails ? (
                <div className="flex flex-col items-center justify-center py-20 text-white">
                  <Loader className="h-10 w-10 text-indigo-400 animate-spin mb-4" />
                  <p className="text-sm font-semibold">Generating your roadmap...</p>
                </div>
              ) : roadmapDetails ? (
                <div className="space-y-8">
                  {/* Warning Alerts / Info Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Progress Card (Left Column) */}
                    <div className="lg:col-span-1 glass-panel p-6 rounded-2xl bg-opacity-20 flex flex-col justify-between border border-white/5">
                      <div>
                        <h4 className="font-outfit text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Target Path</h4>
                        <h3 className="font-outfit text-xl font-extrabold text-indigo-400 mb-6">{roadmapDetails.selectedCareer}</h3>
                        
                        {/* Circular Gauge / Percentage Indicator */}
                        <div className="flex flex-col items-center justify-center my-6">
                          <div className="relative h-36 w-36 flex items-center justify-center">
                            <svg className="absolute transform -rotate-90 w-full h-full">
                              <circle
                                cx="72"
                                cy="72"
                                r="55"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="8"
                                fill="transparent"
                              />
                              <circle
                                cx="72"
                                cy="72"
                                r="55"
                                stroke="#6366f1"
                                strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 55}
                                strokeDashoffset={2 * Math.PI * 55 * (1 - roadmapDetails.progressPercent / 100)}
                                className="transition-all duration-500 ease-out"
                              />
                            </svg>
                            <div className="flex flex-col items-center justify-center">
                              <span className="font-outfit text-3xl font-extrabold text-white">{roadmapDetails.progressPercent}%</span>
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="text-xs text-slate-400 mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                        <span>Difficulty Track</span>
                        <span className="px-2 py-0.5 font-bold uppercase rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          {roadmapDetails.skillLevel}
                        </span>
                      </div>
                    </div>

                    {/* AI Revision and Resume Gaps Warnings (Right Columns) */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                      {/* Score-Based AI Revision Card */}
                      {roadmapDetails.revisionTasks && roadmapDetails.revisionTasks.length > 0 ? (
                        <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/15 flex flex-col gap-3 shadow-lg">
                          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                            <AlertTriangle className="h-5 w-5 animate-pulse" />
                            <span>AI Revision Tasks Required</span>
                          </div>
                          <p className="text-slate-400 text-xs">
                            Based on your recent mock interviews, you scored below 60% in these key concept areas. We've compiled target revision modules to patch these weaknesses:
                          </p>
                          <ul className="grid grid-cols-1 gap-2.5 mt-2">
                            {roadmapDetails.revisionTasks.map((task: string, idx: number) => (
                              <li key={idx} className="flex gap-2.5 items-start p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl text-xs text-slate-200">
                                <span className="h-1.5 w-1.5 bg-amber-400 rounded-full mt-1.5 flex-shrink-0" />
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-3.5">
                          <CheckCircle className="h-6 w-6 text-emerald-400" />
                          <div>
                            <h4 className="text-sm font-bold text-white">Baseline Verified</h4>
                            <p className="text-slate-400 text-xs">Excellent! No urgent mock interview failures or weak topics needing immediate review.</p>
                          </div>
                        </div>
                      )}

                      {/* Resume Gap Screening Card */}
                      {roadmapDetails.resumeGaps && roadmapDetails.resumeGaps.length > 0 ? (
                        <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/15 flex flex-col gap-3 shadow-lg">
                          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                            <Sparkles className="h-5 w-5" />
                            <span>Resume Skill Gaps Checked</span>
                          </div>
                          <p className="text-slate-400 text-xs">
                            We cross-referenced your extracted resume profile against the core syllabus of this track and found missing critical keywords:
                          </p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {roadmapDetails.resumeGaps.map((gap: string, idx: number) => (
                              <span key={idx} className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/15 flex items-center gap-1.5">
                                <span className="h-1 w-1 bg-purple-400 rounded-full" />
                                {gap}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-3.5">
                          <CheckCircle className="h-6 w-6 text-emerald-400" />
                          <div>
                            <h4 className="text-sm font-bold text-white">ATS Synced</h4>
                            <p className="text-slate-400 text-xs">No missing skills gaps relative to this career path profile!</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Main Grid: Phase Milestones on Left, Projects & Prep on Right */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Learning Milestones Phases Timeline */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                      <h4 className="font-outfit text-md font-bold text-white flex items-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5 text-indigo-400" />
                        Learning Milestones Timeline
                      </h4>

                      <div className="flex flex-col gap-6 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-px before:bg-white/5">
                        {roadmapDetails.phases.map((phase: any, phaseIdx: number) => (
                          <div key={phaseIdx} className="relative pl-12">
                            {/* Visual Timeline Marker Node */}
                            <div className="absolute left-4.5 top-1.5 h-3.5 w-3.5 rounded-full bg-slate-900 border-2 border-indigo-500 shadow-md ring-4 ring-indigo-500/20" />
                            
                            <div className="glass-panel p-5 rounded-2xl bg-opacity-20 border border-white/5">
                              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                                <h5 className="font-outfit text-sm font-bold text-white">{phase.name}</h5>
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {phase.estimatedTime}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {phase.topics.map((topic: any, topicIdx: number) => (
                                  <button
                                    key={topicIdx}
                                    onClick={() => handleToggleTopic(topic.name)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border text-left text-xs font-medium transition cursor-pointer select-none group w-full ${
                                      topic.completed
                                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                                        : 'glass-panel border-white/5 text-slate-300 hover:border-white/20 hover:bg-white/5'
                                    }`}
                                  >
                                    <div className={`h-4.5 w-4.5 rounded-md flex items-center justify-center border transition ${
                                      topic.completed
                                        ? 'border-emerald-500 bg-emerald-500 text-slate-900'
                                        : 'border-slate-600 group-hover:border-indigo-400'
                                    }`}>
                                      {topic.completed && <CheckCircle className="h-3 w-3 text-slate-900 fill-slate-900" />}
                                    </div>
                                    <span className={topic.completed ? 'line-through decoration-emerald-500/40 text-slate-400' : ''}>
                                      {topic.name}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Right Column: Recommended Projects, Interview Prep, Practice Questions */}
                    <div className="lg:col-span-1 flex flex-col gap-6">
                      {/* Projects Card */}
                      <div className="glass-panel p-6 rounded-2xl bg-opacity-20 border border-white/5">
                        <h4 className="font-outfit text-sm font-bold text-white mb-4.5 flex items-center gap-2">
                          <FolderGit2 className="h-5 w-5 text-indigo-400" />
                          Recommended Build Projects
                        </h4>
                        <div className="flex flex-col gap-3">
                          {roadmapDetails.recommendedProjects && roadmapDetails.recommendedProjects.map((proj: string, idx: number) => (
                            <div key={idx} className="p-4 bg-white/3 border border-white/5 rounded-xl text-xs text-slate-300 flex flex-col justify-between gap-2.5">
                              <p className="font-bold leading-relaxed">{proj}</p>
                              <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Target project specifications</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Prep & Practice Card */}
                      <div className="glass-panel p-6 rounded-2xl bg-opacity-20 border border-white/5 flex flex-col gap-6">
                        <div>
                          <h4 className="font-outfit text-sm font-bold text-white mb-3.5 flex items-center gap-2">
                            <BookOpen className="h-4.5 w-4.5 text-indigo-400" />
                            Interview Preparation Focus
                          </h4>
                          <ul className="space-y-2">
                            {roadmapDetails.interviewPrepTopics && roadmapDetails.interviewPrepTopics.map((item: string, idx: number) => (
                              <li key={idx} className="flex gap-2 items-start text-xs text-slate-300">
                                <span className="h-1.5 w-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="border-t border-white/5 pt-5">
                          <h4 className="font-outfit text-sm font-bold text-white mb-3.5 flex items-center gap-2">
                            <Sparkles className="h-4.5 w-4.5 text-purple-400" />
                            Must-Practice Questions
                          </h4>
                          <ul className="space-y-2">
                            {roadmapDetails.practiceQuestions && roadmapDetails.practiceQuestions.map((item: string, idx: number) => (
                              <li key={idx} className="flex gap-2 items-start text-xs text-slate-300">
                                <span className="h-1.5 w-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0" />
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-white">
                  <p className="text-slate-400 text-xs">Unable to load roadmap information.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-6 mt-12 bg-black/40 text-center text-slate-500 text-xs">
        <p>© {new Date().getFullYear()} InterviewIQ AI. Master your communications.</p>
      </footer>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
