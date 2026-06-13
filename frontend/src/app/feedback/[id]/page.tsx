'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { Navbar } from '../../../components/Navbar';
import {
  Award,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Lightbulb,
  Map,
  XCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Code2
} from 'lucide-react';

interface QuestionFeedback {
  questionText: string;
  category: 'Behavioral' | 'Technical' | 'Coding';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  candidateAnswer?: string;
  candidateCode?: string;
  aiEvaluation?: {
    score: number;
    feedback: string;
    strengths: string[];
    weaknesses: string[];
    suggestedCorrectAnswer: string;
    technicalScore?: number;
    communicationScore?: number;
    problemSolvingScore?: number;
    confidenceScore?: number;
    completenessScore?: number;
    missingConcepts?: string[];
    improvementSuggestions?: string[];
  };
}

interface InterviewReport {
  _id: string;
  role: string;
  experienceLevel: string;
  type: string;
  overallScore: number;
  scores: {
    communication: number;
    technical: number;
    confidence: number;
    problemSolving: number;
  };
  feedbackSummary: string;
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
  roadmap: Array<{ step: string; resources: string[] }>;
  questions: QuestionFeedback[];
  overallRating?: 'Hire' | 'Borderline' | 'No Hire';
  technicalStrength?: string;
  communicationStrength?: string;
  recommendedLearningPath?: string[];
  suggestedResources?: string[];
}

export default function FeedbackPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [report, setReport] = useState<InterviewReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!authLoading && !user) {
      const currentUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
      const redirectQuery = currentUrl ? `?redirect=${encodeURIComponent(currentUrl)}` : '';
      router.push(`/login${redirectQuery}`);
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const data = await api.get<InterviewReport>(`/interviews/${id}`);
        setReport(data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load feedback report.');
      } finally {
        setLoading(false);
      }
    };

    if (user && id) {
      fetchReport();
    }
  }, [user, id]);

  const toggleQuestion = (index: number) => {
    setExpandedQuestion(expandedQuestion === index ? null : index);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center">
        <p className="text-red-400 mb-6">{error || 'Feedback report not found'}</p>
        <button onClick={() => router.push('/dashboard')} className="glass-panel px-6 py-2.5 rounded-xl hover:bg-white/10">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="w-full max-w-[95%] xl:max-w-[98%] mx-auto px-6 py-10">
          {/* Header Summary */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-10">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {report.type} Mock Session
                </span>
                {report.overallRating && (
                  <span className={`px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-lg border ${
                    report.overallRating === 'Hire'
                      ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                      : report.overallRating === 'Borderline'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      : 'bg-red-500/10 text-red-300 border-red-500/20'
                  }`}>
                    Verdict: {report.overallRating}
                  </span>
                )}
              </div>
              <h1 className="font-outfit text-3xl font-extrabold text-white mt-3 mb-1">
                AI Feedback Report: {report.role}
              </h1>
              <p className="text-slate-400 text-sm">
                Targeting {report.experienceLevel} level evaluation. Completed with AI-driven grading.
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="glass-panel px-6 py-3 rounded-xl border-white/10 hover:bg-white/10 text-sm font-semibold text-slate-200 cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-10">
            {/* LEFT: Evaluation Grade & Roadmap */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Grading Summary Box */}
              <div className="glass-panel p-8 rounded-3xl bg-opacity-20 flex flex-col md:flex-row gap-8 items-center">
                {/* Radial Grade Counter */}
                <div className="relative h-36 w-36 flex items-center justify-center flex-shrink-0 bg-indigo-500/5 border border-indigo-500/15 rounded-full shadow-inner">
                  <svg className="absolute h-full w-full transform -rotate-90">
                    <circle cx="72" cy="72" r="62" stroke="var(--circle-bg)" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="72"
                      cy="72"
                      r="62"
                      stroke="#6366f1"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={390}
                      strokeDashoffset={390 - (390 * report.overallScore) / 100}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="text-center">
                    <h2 className="font-outfit text-3xl font-extrabold text-white">{report.overallScore}%</h2>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Overall Score</p>
                  </div>
                </div>

                <div className="flex-grow">
                  <h3 className="font-outfit text-lg font-bold text-white mb-2">Performance Breakdown</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {report.feedbackSummary}
                  </p>

                  {/* Horizontal rating sliders */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Technical Accuracy', score: report.scores.technical, color: 'bg-indigo-500' },
                      { label: 'Communication Flow', score: report.scores.communication, color: 'bg-purple-500' },
                      { label: 'Confidence Delivery', score: report.scores.confidence, color: 'bg-cyan-500' },
                      { label: 'Problem Solving', score: report.scores.problemSolving, color: 'bg-emerald-500' },
                    ].map((metric, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-semibold">{metric.label}</span>
                          <span className="text-white font-bold">{metric.score}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[var(--circle-bg)] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${metric.color}`} style={{ width: `${metric.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technical & Communication strengths summaries */}
              {(report.technicalStrength || report.communicationStrength) && (
                <div className="glass-panel p-8 rounded-3xl bg-opacity-20 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {report.technicalStrength && (
                    <div>
                      <h4 className="font-outfit text-sm font-bold text-white mb-2 uppercase tracking-wide text-indigo-400">Technical Assessment</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{report.technicalStrength}</p>
                    </div>
                  )}
                  {report.communicationStrength && (
                    <div>
                      <h4 className="font-outfit text-sm font-bold text-white mb-2 uppercase tracking-wide text-purple-400">Communication Assessment</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{report.communicationStrength}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Study roadmap */}
              <div className="glass-panel p-8 rounded-3xl bg-opacity-20 flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <Map className="h-5 w-5 text-indigo-400" />
                  <h3 className="font-outfit text-lg font-bold text-white">Study Roadmap</h3>
                </div>

                <div className="flex flex-col gap-5">
                  {report.roadmap && report.roadmap.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 font-bold text-indigo-300 text-xs flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-grow">
                        <h4 className="text-sm font-semibold text-white mb-1.5">{step.step}</h4>
                        <div className="flex flex-wrap gap-2">
                          {step.resources.map((res, i) => (
                            <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--circle-bg)] border border-[var(--card-border)] rounded-lg text-[10px] text-slate-400">
                              <BookOpen className="h-3 w-3 text-slate-500" />
                              {res}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Strengths & Weaknesses checklists */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Strengths */}
              <div className="glass-panel p-6 rounded-2xl bg-opacity-20 border border-emerald-500/10">
                <h3 className="font-outfit text-md font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="h-4.5 w-4.5 text-emerald-400" />
                  Key Strengths
                </h3>
                <ul className="flex flex-col gap-3">
                  {report.strengths.map((str, idx) => (
                    <li key={idx} className="text-xs text-slate-300 leading-relaxed flex gap-2 items-start">
                      <span className="text-emerald-400 font-bold mt-0.5">•</span>
                      {str}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="glass-panel p-6 rounded-2xl bg-opacity-20 border border-red-500/10">
                <h3 className="font-outfit text-md font-bold text-white mb-4 flex items-center gap-2">
                  <XCircle className="h-4.5 w-4.5 text-red-400" />
                  Areas to Improve
                </h3>
                <ul className="flex flex-col gap-3">
                  {report.weaknesses.map((weak, idx) => (
                    <li key={idx} className="text-xs text-slate-300 leading-relaxed flex gap-2 items-start">
                      <span className="text-red-400 font-bold mt-0.5">•</span>
                      {weak}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Concepts */}
              {report.missingConcepts && report.missingConcepts.length > 0 && (
                <div className="glass-panel p-6 rounded-2xl bg-opacity-20 border border-indigo-500/10">
                  <h3 className="font-outfit text-md font-bold text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="h-4.5 w-4.5 text-indigo-400" />
                    Missing Concepts
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {report.missingConcepts.map((concept, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white/3 border border-white/5 rounded-lg text-[10px] font-semibold text-slate-400">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Learning Path */}
              {report.recommendedLearningPath && report.recommendedLearningPath.length > 0 && (
                <div className="glass-panel p-6 rounded-2xl bg-opacity-20 border border-purple-500/10">
                  <h3 className="font-outfit text-md font-bold text-white mb-4 flex items-center gap-2">
                    <BookOpen className="h-4.5 w-4.5 text-purple-400" />
                    Recommended Learning Path
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {report.recommendedLearningPath.map((pathItem, idx) => (
                      <li key={idx} className="text-xs text-slate-300 leading-relaxed flex gap-2 items-start">
                        <span className="text-purple-400 font-bold mt-0.5">•</span>
                        {pathItem}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Resources */}
              {report.suggestedResources && report.suggestedResources.length > 0 && (
                <div className="glass-panel p-6 rounded-2xl bg-opacity-20 border border-cyan-500/10">
                  <h3 className="font-outfit text-md font-bold text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="h-4.5 w-4.5 text-cyan-400" />
                    Suggested Resources
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {report.suggestedResources.map((res, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white/3 border border-white/5 rounded-lg text-[10px] font-semibold text-slate-300">
                        {res}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Question Breakdown List Accordion */}
          <div className="glass-panel p-6 rounded-3xl bg-opacity-20">
            <h3 className="font-outfit text-lg font-bold text-white mb-6">Question & Answer Logs</h3>

            <div className="flex flex-col gap-4">
              {report.questions.map((question, index) => {
                const isExpanded = expandedQuestion === index;
                const isCode = question.category === 'Coding';

                return (
                  <div key={index} className="border border-[var(--card-border)] rounded-2xl overflow-hidden bg-[var(--circle-bg)]">
                    {/* Accordion Trigger Header */}
                    <button
                      onClick={() => toggleQuestion(index)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-black/10 dark:hover:bg-white/3 transition cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/15 font-bold text-indigo-300 text-xs">
                          Q{index + 1}
                        </div>
                        <div>
                          <p className="text-xs text-slate-400 font-semibold">
                            {question.category} • {question.difficulty}
                          </p>
                          <h4 className="text-sm font-semibold text-white line-clamp-1 mt-0.5">
                            {question.questionText}
                          </h4>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-indigo-300">
                          {question.aiEvaluation?.score}%
                        </span>
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                      </div>
                    </button>

                    {/* Expanded Content Panel */}
                    {isExpanded && (
                      <div className="p-6 border-t border-[var(--card-border)] bg-slate-900/10 dark:bg-slate-950/20 flex flex-col gap-6">
                        {/* Multi-Dimension Scores */}
                        {question.aiEvaluation && (
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-white/5 dark:bg-white/2 border border-[var(--card-border)] rounded-2xl">
                            {[
                              { label: 'Technical Accuracy', val: question.aiEvaluation.technicalScore },
                              { label: 'Communication Clarity', val: question.aiEvaluation.communicationScore },
                              { label: 'Problem Solving', val: question.aiEvaluation.problemSolvingScore },
                              { label: 'Confidence Delivery', val: question.aiEvaluation.confidenceScore },
                              { label: 'Completeness', val: question.aiEvaluation.completenessScore },
                            ].map((sub, i) => {
                              const scoreVal = sub.val !== undefined ? sub.val : question.aiEvaluation?.score || 0;
                              return (
                                <div key={i} className="flex flex-col gap-1.5">
                                  <div className="flex justify-between items-center text-[9px] font-semibold text-slate-400">
                                    <span>{sub.label}</span>
                                    <span className="text-indigo-300 font-bold">{scoreVal}%</span>
                                  </div>
                                  <div className="h-1.5 w-full bg-[var(--circle-bg)] rounded-full overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" style={{ width: `${scoreVal}%` }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Question Text */}
                        <div>
                          <h5 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">Full Question</h5>
                          <p className="text-xs text-[var(--foreground)] leading-relaxed">{question.questionText}</p>
                        </div>

                        {/* Candidate response */}
                        <div>
                          <h5 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                            {isCode ? 'Your Submitted Code' : 'Your Answer Transcription'}
                          </h5>
                          {isCode ? (
                            <pre className="p-4 bg-slate-100 dark:bg-slate-950 border border-[var(--card-border)] rounded-xl font-mono text-xs text-slate-700 dark:text-slate-300 leading-relaxed overflow-x-auto">
                              <code>{question.candidateCode}</code>
                            </pre>
                          ) : (
                            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                              "{question.candidateAnswer || 'No response recorded'}"
                            </p>
                          )}
                        </div>

                        {/* AI Evaluation details */}
                        {question.aiEvaluation && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[var(--card-border)] pt-6 mt-2">
                            <div>
                              <h5 className="text-[11px] font-bold uppercase tracking-widest text-indigo-400 mb-2">AI Critique Feedback</h5>
                              <p className="text-xs text-slate-300 leading-relaxed">
                                {question.aiEvaluation.feedback}
                              </p>

                              <div className="mt-4">
                                <h6 className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase">AI Suggested Correct Answer</h6>
                                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                                  {question.aiEvaluation.suggestedCorrectAnswer}
                                </p>
                              </div>
                            </div>

                            <div className="flex flex-col gap-4">
                              <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl">
                                <h6 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                                  <CheckCircle className="h-4 w-4" />
                                  What You Did Well
                                </h6>
                                <ul className="text-xs text-slate-300 flex flex-col gap-1.5 list-disc pl-4">
                                  {question.aiEvaluation.strengths.map((str, idx) => (
                                    <li key={idx}>{str}</li>
                                  ))}
                                </ul>
                              </div>

                              <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                                <h6 className="text-xs font-bold text-red-400 mb-2 flex items-center gap-1.5">
                                  <XCircle className="h-4 w-4" />
                                  Suggested Optimizations
                                </h6>
                                <ul className="text-xs text-slate-300 flex flex-col gap-1.5 list-disc pl-4">
                                  {question.aiEvaluation.weaknesses.map((weak, idx) => (
                                    <li key={idx}>{weak}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
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
