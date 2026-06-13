import { Schema, model, Document } from 'mongoose';

export interface IProjectViva {
  projectName: string;
  technologies: string[];
  description: string;
  vivaQuestions: {
    Beginner: string[];
    Intermediate: string[];
    Advanced: string[];
  };
}

export interface IResume extends Document {
  userId: Schema.Types.ObjectId;
  fileName: string;
  skills: string[];
  experienceSummary: string;
  extractedText?: string;
  atsScore?: number;
  strengthReport?: string;
  missingSkills?: string[];
  suggestedImprovements?: string[];
  projects?: IProjectViva[];
  createdAt: Date;
  updatedAt: Date;
}

const ResumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Only one active resume context per candidate for simplicity
    },
    fileName: {
      type: String,
      required: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experienceSummary: {
      type: String,
      default: '',
    },
    extractedText: String,
    atsScore: {
      type: Number,
      default: 70,
    },
    strengthReport: {
      type: String,
      default: '',
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    suggestedImprovements: {
      type: [String],
      default: [],
    },
    projects: {
      type: [
        {
          projectName: { type: String, required: true },
          technologies: { type: [String], default: [] },
          description: { type: String, default: '' },
          vivaQuestions: {
            Beginner: { type: [String], default: [] },
            Intermediate: { type: [String], default: [] },
            Advanced: { type: [String], default: [] },
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Resume = model<IResume>('Resume', ResumeSchema);
