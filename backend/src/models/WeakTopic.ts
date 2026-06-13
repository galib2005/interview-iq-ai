import { Schema, model, Document } from 'mongoose';

export interface IWeakTopic extends Document {
  userId: Schema.Types.ObjectId;
  topic: string;
  score: number;
  interviewDate: Date;
  improvementStatus: 'Needs Review' | 'Improved' | 'Mastered';
  latestScore?: number;
  previousScore?: number;
  createdAt: Date;
  updatedAt: Date;
}

const WeakTopicSchema = new Schema<IWeakTopic>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
    },
    interviewDate: {
      type: Date,
      default: Date.now,
    },
    improvementStatus: {
      type: String,
      enum: ['Needs Review', 'Improved', 'Mastered'],
      default: 'Needs Review',
    },
    latestScore: Number,
    previousScore: Number,
  },
  {
    timestamps: true,
  }
);

export const WeakTopic = model<IWeakTopic>('WeakTopic', WeakTopicSchema);
