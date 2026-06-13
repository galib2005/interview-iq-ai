import { Schema, model, Document } from 'mongoose';

export interface IQuestion {
  questionText: string;
  category: 'Behavioral' | 'Technical' | 'Coding';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  questionDifficulty?: 'Easy' | 'Medium' | 'Hard';
  expectedKeywords?: string[];
  codeTemplate?: string;
  language?: string;
  testCases?: Array<{ input: string; expectedOutput: string }>;
  candidateAnswer?: string;
  candidateCode?: string;
  audioUrl?: string;
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

export interface IInterview extends Document {
  userId: Schema.Types.ObjectId;
  role: string;
  experienceLevel: 'Entry' | 'Mid' | 'Senior';
  type: 'HR' | 'Technical' | 'Mixed' | 'Custom' | 'Viva' | 'Company';
  status: 'Pending' | 'In-Progress' | 'Completed';
  questions: IQuestion[];
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
  overallRating?: 'Hire' | 'Borderline' | 'No Hire';
  technicalStrength?: string;
  communicationStrength?: string;
  recommendedLearningPath?: string[];
  suggestedResources?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<IQuestion>({
  questionText: { type: String, required: true },
  category: { type: String, enum: ['Behavioral', 'Technical', 'Coding'], required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  questionDifficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'] },
  expectedKeywords: [String],
  codeTemplate: String,
  language: String,
  testCases: [
    {
      input: String,
      expectedOutput: String,
    },
  ],
  candidateAnswer: String,
  candidateCode: String,
  audioUrl: String,
  aiEvaluation: {
    score: Number,
    feedback: String,
    strengths: [String],
    weaknesses: [String],
    suggestedCorrectAnswer: String,
    technicalScore: Number,
    communicationScore: Number,
    problemSolvingScore: Number,
    confidenceScore: Number,
    completenessScore: Number,
    missingConcepts: [String],
    improvementSuggestions: [String],
  },
});

const InterviewSchema = new Schema<IInterview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Entry', 'Mid', 'Senior'],
      required: true,
    },
    type: {
      type: String,
      enum: ['HR', 'Technical', 'Mixed', 'Custom', 'Viva', 'Company'],
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In-Progress', 'Completed'],
      default: 'Pending',
    },
    questions: [QuestionSchema],
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    overallScore: Number,
    scores: {
      communication: Number,
      technical: Number,
      confidence: Number,
      problemSolving: Number,
      architecture: Number,
      technology: Number,
      deployment: Number,
    },
    companyName: String,
    projectName: String,
    vivaLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    feedbackSummary: String,
    strengths: [String],
    weaknesses: [String],
    missingConcepts: [String],
    roadmap: [
      {
        step: String,
        resources: [String],
      },
    ],
    overallRating: { type: String, enum: ['Hire', 'Borderline', 'No Hire'] },
    technicalStrength: String,
    communicationStrength: String,
    recommendedLearningPath: [String],
    suggestedResources: [String],
  },
  {
    timestamps: true,
  }
);

export const Interview = model<IInterview>('Interview', InterviewSchema);
