import { Schema, model, Document } from 'mongoose';

export interface IUserProgress extends Document {
  userId: Schema.Types.ObjectId;
  selectedCareer: string;
  skillLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  completedTopics: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserProgressSchema = new Schema<IUserProgress>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    selectedCareer: {
      type: String,
      default: 'Software Engineer',
    },
    skillLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
      default: 'Beginner',
    },
    completedTopics: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const UserProgress = model<IUserProgress>('UserProgress', UserProgressSchema);
