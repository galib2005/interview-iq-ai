'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';
import { Navbar } from '../../../components/Navbar';
import { Mic, MicOff, Volume2, Send, Terminal, Play, Loader, ShieldAlert, Cpu, Code2 } from 'lucide-react';

interface QuestionData {
  text: string;
  category: 'Behavioral' | 'Technical' | 'Coding';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  codeTemplate?: string;
  language?: string;
}

interface InterviewState {
  completed: boolean;
  interviewId: string;
  currentQuestionIndex: number;
  question: QuestionData;
  totalQuestions?: number;
}

interface TestResult {
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
  console?: string[];
}

interface ExecutionResponse {
  success: boolean;
  results: TestResult[];
  error?: string;
}

export default function InterviewPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [session, setSession] = useState<InterviewState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Speech and transcription states
  const [isListening, setIsListening] = useState<boolean>(false);
  const [spokenAnswer, setSpokenAnswer] = useState<string>('');
  const [speechError, setSpeechError] = useState<string>('');

  // Code editor states
  const [code, setCode] = useState<string>('');
  const [lang, setLang] = useState<string>('javascript');
  const [executingCode, setExecutingCode] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [aiCodeReview, setAiCodeReview] = useState<string>('');
  const [fetchingReview, setFetchingReview] = useState<boolean>(false);

  // Web speech recognition reference
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      const currentUrl = typeof window !== 'undefined' ? window.location.pathname + window.location.search : '';
      const redirectQuery = currentUrl ? `?redirect=${encodeURIComponent(currentUrl)}` : '';
      router.push(`/login${redirectQuery}`);
    }
  }, [user, authLoading, router]);

  // Load active question
  const fetchQuestion = async () => {
    try {
      const details = await api.get<any>(`/interviews/${id}`);
      
      if (details.status === 'Completed') {
        router.push(`/feedback/${id}`);
        return;
      }

      const currentIndex = details.currentQuestionIndex;
      const question = details.questions[currentIndex];

      setSession({
        completed: false,
        interviewId: details._id,
        currentQuestionIndex: currentIndex,
        totalQuestions: details.questions.length,
        question: {
          text: question.questionText,
          category: question.category,
          difficulty: question.difficulty,
          codeTemplate: question.codeTemplate,
          language: question.language,
        },
      });

      if (question.category === 'Coding') {
        setCode(question.codeTemplate || '');
        setLang(question.language || 'javascript');
      } else {
        setSpokenAnswer('');
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to load active interview round.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && id) {
      fetchQuestion();
    }
  }, [user, id]);

  // Speech Synthesis: AI Speaks question
  const handleTTS = () => {
    if (!session) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(session.question.text);
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speak automatically on load of question
  useEffect(() => {
    if (session && session.question.category !== 'Coding') {
      const timer = setTimeout(() => {
        handleTTS();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [session?.currentQuestionIndex]);

  // Speech Recognition: Init API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setSpeechError('');
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setSpeechError(`Microphone error: ${event.error}. You can type your answer.`);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          setSpokenAnswer((prev) => prev + finalTranscript);
        };

        recognitionRef.current = recognition;
      } else {
        setSpeechError('Web Speech API is not supported in this browser. Please type your response.');
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setSpeechError('');
      recognitionRef.current.start();
    }
  };

  // Submit response
  const handleSubmitAnswer = async () => {
    if (!session) return;
    setSubmitting(true);
    setError('');

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Mute if AI is speaking
    }

    try {
      const payload: Record<string, any> = {};
      if (session.question.category === 'Coding') {
        payload.candidateAnswer = 'Submitted coding solution.';
        payload.candidateCode = code;
      } else {
        if (!spokenAnswer.trim()) {
          setError('Please provide an answer before submitting');
          setSubmitting(false);
          return;
        }
        payload.candidateAnswer = spokenAnswer;
      }

      const res = await api.post<any>(`/interviews/${id}/answer`, payload);

      if (res.completed) {
        router.push(`/feedback/${id}`);
      } else {
        // Clear editor states
        setTestResults([]);
        setConsoleLogs([]);
        setAiCodeReview('');
        
        // Populate next question
        setSession({
          completed: false,
          interviewId: res.interviewId,
          currentQuestionIndex: res.currentQuestionIndex,
          totalQuestions: session.totalQuestions,
          question: {
            text: res.question.text,
            category: res.question.category,
            difficulty: res.question.difficulty,
            codeTemplate: res.question.codeTemplate,
            language: res.question.language,
          },
        });

        if (res.question.category === 'Coding') {
          setCode(res.question.codeTemplate || '');
          setLang(res.question.language || 'javascript');
        } else {
          setSpokenAnswer('');
        }
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit response.');
    } finally {
      setSubmitting(false);
    }
  };

  // Run Code against test cases
  const handleRunCode = async () => {
    if (!session || !code.trim()) return;
    setExecutingCode(true);
    setTestResults([]);
    setConsoleLogs([]);

    try {
      // Fetch mock interview details to get expected test cases
      const details = await api.get<any>(`/interviews/${id}`);
      const currentQ = details.questions[session.currentQuestionIndex];
      const testCases = currentQ.testCases || [
        { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
      ];

      const res = await api.post<ExecutionResponse>('/coding/execute', {
        language: lang,
        code,
        testCases,
      });

      if (res.success) {
        setTestResults(res.results);
        const logs: string[] = [];
        res.results.forEach((t: TestResult) => {
          if (t.console && t.console.length > 0) {
            logs.push(...t.console);
          }
          if (t.error) {
            logs.push(`Runtime Error: ${t.error}`);
          }
        });
        setConsoleLogs(logs);
      } else {
        setConsoleLogs([res.error || 'Execution failed']);
      }
    } catch (err: any) {
      setConsoleLogs([`Error compiling: ${err.message}`]);
    } finally {
      setExecutingCode(false);
    }
  };

  // Run AI optimization audit review
  const handleAICodeReview = async () => {
    if (!session || !code.trim()) return;
    setFetchingReview(true);
    setAiCodeReview('');

    try {
      const res = await api.post<{ review: string }>('/coding/review', {
        language: lang,
        code,
        questionText: session.question.text,
      });
      setAiCodeReview(res.review);
    } catch (err: any) {
      setAiCodeReview(`AI Review failed: ${err.message}`);
    } finally {
      setFetchingReview(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="h-8 w-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen text-white flex flex-col items-center justify-center">
        <ShieldAlert className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-400 mb-6">{error || 'Session not found'}</p>
        <button onClick={() => router.push('/dashboard')} className="glass-panel px-6 py-2.5 rounded-xl hover:bg-white/10">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isCodingRound = session.question.category === 'Coding';

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="w-full max-w-[95%] xl:max-w-[98%] mx-auto px-6 py-8">
          {/* Question Index Progress Tracker */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-400">
              Question {session.currentQuestionIndex + 1} of {session.totalQuestions}
            </span>
            <div className="flex gap-1 h-1.5 w-40 bg-white/5 rounded-full overflow-hidden">
              {Array.from({ length: session.totalQuestions || 5 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-grow h-full rounded-full transition ${
                    i <= session.currentQuestionIndex ? 'bg-indigo-500' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* LEFT PANEL: Question Details & Description */}
            <div className={`${isCodingRound ? 'lg:col-span-5' : 'lg:col-span-12'} flex flex-col gap-6`}>
              <div className="glass-panel p-8 rounded-3xl bg-opacity-20 flex flex-col justify-between min-h-[300px]">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {session.question.category}
                    </span>
                    <span
                      className={`px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase rounded-lg ${
                        session.question.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : session.question.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                          : 'bg-red-500/10 text-red-300 border border-red-500/20'
                      }`}
                    >
                      {session.question.difficulty}
                    </span>
                  </div>

                  <h2 className="font-outfit text-xl md:text-2xl font-bold text-white mb-6 leading-relaxed">
                    {session.question.text}
                  </h2>
                </div>

                {/* Speech Control Header (Not for coding rounds) */}
                {!isCodingRound && (
                  <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-6">
                    <button
                      onClick={handleTTS}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-white/3 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition cursor-pointer"
                    >
                      <Volume2 className="h-4 w-4 text-indigo-400" />
                      Listen Question
                    </button>
                    <span className="text-[10px] text-slate-400 font-medium">Auto-play activated</span>
                  </div>
                )}
              </div>

              {/* Spoken Speech Recording Panel */}
              {!isCodingRound && (
                <div className="glass-panel p-8 rounded-3xl bg-opacity-20 flex flex-col gap-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-outfit text-md font-bold text-white">Your Spoken Answer</h3>
                    <div className="flex items-center gap-2">
                      {isListening && (
                        <div className="flex gap-1 items-end h-3">
                          <div className="w-0.5 h-2 bg-indigo-400 animate-pulse" />
                          <div className="w-0.5 h-3 bg-indigo-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-0.5 h-1.5 bg-indigo-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                      )}
                      <span className={`text-[10px] uppercase font-semibold tracking-wider ${isListening ? 'text-indigo-400' : 'text-slate-500'}`}>
                        {isListening ? 'Microphone Active' : 'Microphone Idle'}
                      </span>
                    </div>
                  </div>

                  {speechError && (
                    <p className="text-[11px] text-amber-300 bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 rounded-xl">
                      {speechError}
                    </p>
                  )}

                  <div className="relative">
                    <textarea
                      value={spokenAnswer}
                      onChange={(e) => setSpokenAnswer(e.target.value)}
                      className="w-full h-44 glass-input text-sm p-4 leading-relaxed"
                      placeholder="Click the microphone to start speaking, or type your answer here..."
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={toggleListening}
                      className={`flex-grow flex items-center justify-center gap-2 py-4 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                        isListening
                          ? 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20'
                      }`}
                    >
                      {isListening ? (
                        <>
                          <MicOff className="h-5 w-5 animate-pulse" />
                          Stop Recording
                        </>
                      ) : (
                        <>
                          <Mic className="h-5 w-5" />
                          Record Answer
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleSubmitAnswer}
                      disabled={submitting}
                      className="px-8 py-4 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer"
                    >
                      {submitting ? (
                        <Loader className="h-5 w-5 animate-spin" />
                      ) : (
                        <>
                          Submit Response
                          <Send className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT PANEL: Coding Arena */}
            {isCodingRound && (
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* Code Playground */}
                <div className="glass-panel p-6 rounded-3xl bg-opacity-20 flex flex-col">
                  <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-3">
                    <div className="flex items-center gap-2 text-white">
                      <Code2 className="h-5 w-5 text-indigo-400" />
                      <span className="font-outfit text-sm font-bold">Code Sandbox Editor</span>
                    </div>

                    <select
                      value={lang}
                      onChange={(e) => setLang(e.target.value)}
                      className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                    </select>
                  </div>

                  {/* Code editor textarea */}
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-80 font-mono text-xs bg-slate-950 text-slate-200 border border-white/5 rounded-xl p-4 outline-none resize-none leading-relaxed"
                    spellCheck="false"
                  />

                  {/* Execution controls */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleRunCode}
                      disabled={executingCode}
                      className="flex-grow flex items-center justify-center gap-1.5 py-3 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-200 transition cursor-pointer"
                    >
                      {executingCode ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Play className="h-4 w-4 text-emerald-400" />
                          Execute Test Runs
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleAICodeReview}
                      disabled={fetchingReview}
                      className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-indigo-500/20 bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-semibold text-indigo-300 transition cursor-pointer"
                    >
                      {fetchingReview ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Cpu className="h-4 w-4 text-indigo-400" />
                          AI Review
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleSubmitAnswer}
                      disabled={submitting}
                      className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-xs font-bold text-white rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                    >
                      {submitting ? (
                        <Loader className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          Submit Code
                          <Send className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Console Execution Output Console */}
                <div className="glass-panel p-6 rounded-3xl bg-opacity-20">
                  <div className="flex items-center gap-2 text-white mb-4">
                    <Terminal className="h-4.5 w-4.5 text-indigo-400" />
                    <h3 className="font-outfit text-sm font-bold">Execution Output Console</h3>
                  </div>

                  {testResults.length > 0 ? (
                    <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto mb-4">
                      {testResults.map((test, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-xl text-xs border ${
                            test.passed
                              ? 'bg-emerald-500/5 border-emerald-500/20'
                              : 'bg-red-500/5 border-red-500/20'
                          }`}
                        >
                          <div className="flex justify-between items-center font-bold mb-1">
                            <span className={test.passed ? 'text-emerald-400' : 'text-red-400'}>
                              Test Case {index + 1}: {test.passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400">
                            <strong>Input:</strong> {test.input}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            <strong>Expected:</strong> {test.expected} | <strong>Actual:</strong> {test.actual}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}

                  {consoleLogs.length > 0 ? (
                    <div className="p-3 bg-slate-950 border border-white/5 rounded-xl max-h-32 overflow-y-auto font-mono text-[10px] text-slate-300 leading-relaxed">
                      {consoleLogs.map((log, idx) => (
                        <div key={idx}>{log}</div>
                      ))}
                    </div>
                  ) : (
                    testResults.length === 0 && (
                      <p className="text-[11px] text-slate-500 italic text-center py-4">
                        Output logs and compilation test runs appear here after execution.
                      </p>
                    )
                  )}
                </div>

                {/* AI Code Optimization Panel */}
                {aiCodeReview && (
                  <div className="glass-panel p-6 rounded-3xl bg-opacity-20 border border-indigo-500/10">
                    <div className="flex items-center gap-2 text-white mb-4">
                      <Cpu className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
                      <h3 className="font-outfit text-sm font-bold">AI Design Audit Review</h3>
                    </div>
                    <div className="prose prose-invert prose-xs text-xs text-slate-300 max-h-60 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                      {aiCodeReview}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t border-white/5 py-6 mt-12 bg-black/40 text-center text-slate-500 text-xs">
        <p>© {new Date().getFullYear()} InterviewIQ AI. Master your communications.</p>
      </footer>
    </div>
  );
}
