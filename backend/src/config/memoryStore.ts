export interface MemoryUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar: string;
  role: string;
  skills: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryInterview {
  _id: string;
  userId: string;
  role: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
  type: 'HR' | 'Technical' | 'Mixed' | 'Custom' | 'Viva' | 'Company';
  status: 'Pending' | 'In-Progress' | 'Completed';
  questions: any[];
  currentQuestionIndex: number;
  overallScore?: number;
  scores?: {
    communication: number;
    technical: number;
    confidence: number;
    problemSolving: number;
    architecture?: number;
    technology?: number;
    deployment?: number;
  };
  companyName?: string;
  projectName?: string;
  vivaLevel?: 'Beginner' | 'Intermediate' | 'Advanced';
  feedbackSummary?: string;
  strengths?: string[];
  weaknesses?: string[];
  missingConcepts?: string[];
  roadmap?: Array<{ step: string; resources: string[] }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryResume {
  _id: string;
  userId: string;
  fileName: string;
  skills: string[];
  experienceSummary: string;
  extractedText?: string;
  atsScore?: number;
  strengthReport?: string;
  missingSkills?: string[];
  suggestedImprovements?: string[];
  projects?: any[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryUserProgress {
  _id: string;
  userId: string;
  selectedCareer: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  completedTopics: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MemoryWeakTopic {
  _id: string;
  userId: string;
  topic: string;
  score: number;
  interviewDate: Date;
  improvementStatus: 'Needs Review' | 'Improved' | 'Mastered';
  latestScore?: number;
  previousScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

// In-Memory arrays
export const memoryStore = {
  users: [] as MemoryUser[],
  interviews: [] as MemoryInterview[],
  resumes: [] as MemoryResume[],
  userProgress: [] as MemoryUserProgress[],
  weakTopics: [] as MemoryWeakTopic[],
};
