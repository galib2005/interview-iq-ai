import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { UserProgress } from '../models/UserProgress';
import { Interview } from '../models/Interview';
import { Resume } from '../models/Resume';
import { CAREER_ROADMAPS } from '../config/roadmapsData';
import { isDBConnected } from '../config/db';
import { memoryStore, MemoryUserProgress } from '../config/memoryStore';

// Match career track key exactly
const getCareerKey = (name: string): string => {
  const norm = (name || '').toLowerCase().trim();
  const keys = Object.keys(CAREER_ROADMAPS);
  const matched = keys.find(k => k === norm || norm.includes(k) || k.includes(norm));
  return matched || 'software engineer';
};

export const getRoadmap = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    let progress: any = null;
    let interviews: any[] = [];
    let resumeObj: any = null;

    if (isDBConnected) {
      progress = await UserProgress.findOne({ userId });
      if (!progress) {
        progress = await UserProgress.create({ userId });
      }
      interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
      resumeObj = await Resume.findOne({ userId });
    } else {
      // Offline fallback
      progress = memoryStore.userProgress.find(p => p.userId === userId);
      if (!progress) {
        progress = {
          _id: `mem_prog_${Date.now()}`,
          userId,
          selectedCareer: 'Software Engineer',
          skillLevel: 'Beginner',
          completedTopics: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        memoryStore.userProgress.push(progress);
      }
      interviews = memoryStore.interviews
        .filter(i => i.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      resumeObj = memoryStore.resumes.find(r => r.userId === userId);
    }

    const careerKey = getCareerKey(progress.selectedCareer);
    const baseRoadmap = CAREER_ROADMAPS[careerKey]?.[progress.skillLevel as 'Beginner'] || CAREER_ROADMAPS['software engineer'].Beginner;

    // Compile dynamic revision tasks based on poor interview scores (< 60)
    const revisionTasks: string[] = [];
    const keywordsSeen = new Set<string>();

    interviews.forEach(i => {
      if (i.status === 'Completed' || i.status === 'In-Progress') {
        (i.questions || []).forEach((q: any) => {
          if (q.aiEvaluation && q.aiEvaluation.score !== undefined && q.aiEvaluation.score < 60) {
            const score = q.aiEvaluation.score;
            const text = (q.questionText || '').toLowerCase();

            // Check for specific topics in the failed question
            if (text.includes('sql') || text.includes('database') || text.includes('query')) {
              if (!keywordsSeen.has('sql')) {
                keywordsSeen.add('sql');
                revisionTasks.push(`Review SQL Joins and Query Tuning: Scored ${score}% on recent query test.`);
              }
            }
            if (text.includes('react') || text.includes('hook') || text.includes('context')) {
              if (!keywordsSeen.has('react')) {
                keywordsSeen.add('react');
                revisionTasks.push(`Re-study React hooks lifecycle & state: Scored ${score}% on components.`);
              }
            }
            if (text.includes('docker') || text.includes('container') || text.includes('compose')) {
              if (!keywordsSeen.has('docker')) {
                keywordsSeen.add('docker');
                revisionTasks.push(`Re-run Docker container configs: Scored ${score}% in setup studio.`);
              }
            }
            if (text.includes('java') || text.includes('spring') || text.includes('jvm')) {
              if (!keywordsSeen.has('java')) {
                keywordsSeen.add('java');
                revisionTasks.push(`Review JVM memory structure and Spring controllers: Scored ${score}% in Java assessment.`);
              }
            }
            if (text.includes('python') || text.includes('django') || text.includes('fastapi')) {
              if (!keywordsSeen.has('python')) {
                keywordsSeen.add('python');
                revisionTasks.push(`Review Python async loops and Django ORM: Scored ${score}% on Python code round.`);
              }
            }
            if (text.includes('oop') || text.includes('encapsulation') || text.includes('inheritance')) {
              if (!keywordsSeen.has('oop')) {
                keywordsSeen.add('oop');
                revisionTasks.push(`Re-study Object-Oriented Principles: Scored ${score}% in programming theory.`);
              }
            }
          }
        });
      }
    });

    // Extract resume gaps (missing skills)
    const resumeGaps: string[] = [];
    if (resumeObj && resumeObj.missingSkills && resumeObj.missingSkills.length > 0) {
      resumeObj.missingSkills.slice(0, 3).forEach((sk: string) => {
        resumeGaps.push(`Add to resume: ${sk} (identified as a missing skill gap in your profile)`);
      });
    }

    // Map completion states for topics
    let totalTopics = 0;
    let completedCount = 0;
    const completedSet = new Set(progress.completedTopics || []);

    const phases = baseRoadmap.phases.map(phase => {
      const mappedTopics = phase.topics.map(t => {
        totalTopics++;
        const isCompleted = completedSet.has(t);
        if (isCompleted) {
          completedCount++;
        }
        return { name: t, completed: isCompleted };
      });
      return {
        name: phase.name,
        topics: mappedTopics,
        estimatedTime: phase.estimatedTime,
      };
    });

    const progressPercent = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

    res.json({
      selectedCareer: progress.selectedCareer,
      skillLevel: progress.skillLevel,
      progressPercent,
      phases,
      recommendedProjects: baseRoadmap.recommendedProjects,
      interviewPrepTopics: baseRoadmap.interviewPrepTopics,
      practiceQuestions: baseRoadmap.practiceQuestions,
      revisionTasks,
      resumeGaps,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const selectCareer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { careerTrack, skillLevel } = req.body;

    if (!careerTrack || !skillLevel) {
      res.status(400).json({ message: 'Please provide careerTrack and skillLevel' });
      return;
    }

    if (isDBConnected) {
      let progress = await UserProgress.findOne({ userId });
      if (progress) {
        progress.selectedCareer = careerTrack;
        progress.skillLevel = skillLevel;
        progress.completedTopics = []; // reset topics list when career changes
        await progress.save();
      } else {
        progress = await UserProgress.create({
          userId,
          selectedCareer: careerTrack,
          skillLevel,
          completedTopics: [],
        });
      }
    } else {
      // Offline fallback
      let progress = memoryStore.userProgress.find(p => p.userId === userId);
      if (progress) {
        progress.selectedCareer = careerTrack;
        progress.skillLevel = skillLevel;
        progress.completedTopics = [];
        progress.updatedAt = new Date();
      } else {
        progress = {
          _id: `mem_prog_${Date.now()}`,
          userId,
          selectedCareer: careerTrack,
          skillLevel,
          completedTopics: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        memoryStore.userProgress.push(progress);
      }
    }

    // Call getRoadmap to return the fresh data format
    return getRoadmap(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleTopic = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    const { topicName } = req.body;

    if (!topicName) {
      res.status(400).json({ message: 'Please provide topicName' });
      return;
    }

    if (isDBConnected) {
      const progress = await UserProgress.findOne({ userId });
      if (!progress) {
        res.status(404).json({ message: 'User progress not found' });
        return;
      }

      if (progress.completedTopics.includes(topicName)) {
        progress.completedTopics = progress.completedTopics.filter(t => t !== topicName);
      } else {
        progress.completedTopics.push(topicName);
      }
      await progress.save();
    } else {
      // Offline fallback
      const progress = memoryStore.userProgress.find(p => p.userId === userId);
      if (!progress) {
        res.status(404).json({ message: 'User progress not found' });
        return;
      }

      if (progress.completedTopics.includes(topicName)) {
        progress.completedTopics = progress.completedTopics.filter(t => t !== topicName);
      } else {
        progress.completedTopics.push(topicName);
      }
      progress.updatedAt = new Date();
    }

    return getRoadmap(req, res);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
