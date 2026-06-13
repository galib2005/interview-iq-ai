import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Interview, IQuestion } from '../models/Interview';
import { Resume } from '../models/Resume';
import { WeakTopic } from '../models/WeakTopic';
import { generateInterviewQuestions, evaluateResponse, generateFinalFeedback, adjustNextQuestion } from '../services/openaiService';
import { isDBConnected } from '../config/db';
import { memoryStore, MemoryInterview } from '../config/memoryStore';

const COMMON_TOPICS = ['DBMS', 'SQL', 'React', 'OOP', 'Operating System', 'System Design', 'Docker', 'AWS', 'Redis', 'Node.js', 'JavaScript', 'Python', 'Java', 'Data Structures', 'Algorithms'];

const detectTopic = (questionText: string): string => {
  const text = questionText.toLowerCase();
  for (const topic of COMMON_TOPICS) {
    if (text.includes(topic.toLowerCase())) {
      return topic;
    }
  }
  if (text.includes('database') || text.includes('query') || text.includes('mongodb') || text.includes('postgresql')) return 'DBMS';
  if (text.includes('object-oriented') || text.includes('class') || text.includes('inheritance') || text.includes('polymorphism')) return 'OOP';
  if (text.includes('operating system') || text.includes('virtual memory') || text.includes('thread') || text.includes('process')) return 'Operating System';
  if (text.includes('component') || text.includes('hooks') || text.includes('virtual dom') || text.includes('nextjs')) return 'React';
  if (text.includes('scale') || text.includes('load balance') || text.includes('cache') || text.includes('distributed')) return 'System Design';
  
  return 'General Technical';
};

const handleWeakTopicTracking = async (userId: string, questionText: string, score: number, isDb: boolean) => {
  const topic = detectTopic(questionText);
  if (topic === 'General Technical') return;

  if (isDb) {
    if (score < 60) {
      let existing = await WeakTopic.findOne({ userId, topic });
      if (!existing) {
        await WeakTopic.create({
          userId,
          topic,
          score,
          interviewDate: new Date(),
          improvementStatus: 'Needs Review'
        });
      } else {
        existing.previousScore = existing.score;
        existing.latestScore = score;
        existing.improvementStatus = 'Needs Review';
        existing.interviewDate = new Date();
        await existing.save();
      }
    } else {
      let existing = await WeakTopic.findOne({ userId, topic, improvementStatus: 'Needs Review' });
      if (existing) {
        existing.previousScore = existing.score;
        existing.latestScore = score;
        existing.improvementStatus = score >= 85 ? 'Mastered' : 'Improved';
        existing.interviewDate = new Date();
        await existing.save();
      }
    }
  } else {
    // Offline memoryStore fallback
    if (score < 60) {
      let existing = memoryStore.weakTopics.find(w => w.userId === userId && w.topic === topic);
      if (!existing) {
        memoryStore.weakTopics.push({
          _id: `mem_wt_${Date.now()}`,
          userId,
          topic,
          score,
          interviewDate: new Date(),
          improvementStatus: 'Needs Review',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } else {
        existing.previousScore = existing.score;
        existing.latestScore = score;
        existing.improvementStatus = 'Needs Review';
        existing.interviewDate = new Date();
        existing.updatedAt = new Date();
      }
    } else {
      let existing = memoryStore.weakTopics.find(w => w.userId === userId && w.topic === topic && w.improvementStatus === 'Needs Review');
      if (existing) {
        existing.previousScore = existing.score;
        existing.latestScore = score;
        existing.improvementStatus = score >= 85 ? 'Mastered' : 'Improved';
        existing.interviewDate = new Date();
        existing.updatedAt = new Date();
      }
    }
  }
};

export const startInterview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role, experienceLevel, type, companyName, projectName, vivaLevel } = req.body;

    if (!role || !experienceLevel || !type) {
      res.status(400).json({ message: 'Please provide role, experienceLevel, and type' });
      return;
    }

    const skills = req.user?.skills || [];
    let weakTopicsList: string[] = [];
    let resumeProjects: any[] = [];
    
    if (isDBConnected) {
      const weakTopics = await WeakTopic.find({ userId: req.user._id, score: { $lt: 60 } });
      weakTopicsList = weakTopics.map(w => w.topic);
      
      const resume = await Resume.findOne({ userId: req.user._id });
      resumeProjects = resume?.projects || [];
    } else {
      const weakTopics = memoryStore.weakTopics.filter(w => w.userId === req.user._id && w.score < 60);
      weakTopicsList = weakTopics.map(w => w.topic);
      
      const resume = memoryStore.resumes.find(r => r.userId === req.user._id);
      resumeProjects = resume?.projects || [];
    }

    const generatedQuestions = await generateInterviewQuestions(
      role, 
      experienceLevel, 
      type, 
      skills,
      companyName,
      projectName,
      vivaLevel,
      weakTopicsList,
      resumeProjects
    );

    if (!generatedQuestions || generatedQuestions.length === 0) {
      res.status(500).json({ message: 'Failed to generate interview questions' });
      return;
    }

    if (isDBConnected) {
      const interview = await Interview.create({
        userId: req.user._id,
        role,
        experienceLevel,
        type,
        companyName,
        projectName,
        vivaLevel,
        status: 'In-Progress',
        questions: generatedQuestions,
        currentQuestionIndex: 0,
      });

      const firstQuestion = interview.questions[0];
      res.status(201).json({
        interviewId: interview._id,
        role: interview.role,
        experienceLevel: interview.experienceLevel,
        type: interview.type,
        companyName: interview.companyName,
        projectName: interview.projectName,
        vivaLevel: interview.vivaLevel,
        totalQuestions: interview.questions.length,
        currentQuestionIndex: 0,
        question: {
          text: firstQuestion.questionText,
          category: firstQuestion.category,
          difficulty: firstQuestion.difficulty,
          codeTemplate: firstQuestion.codeTemplate,
          language: firstQuestion.language,
        },
      });
    } else {
      // Offline fallback
      const interview: MemoryInterview = {
        _id: `mem_int_${Date.now()}`,
        userId: req.user._id,
        role,
        experienceLevel,
        type,
        companyName,
        projectName,
        vivaLevel,
        status: 'In-Progress',
        questions: generatedQuestions,
        currentQuestionIndex: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memoryStore.interviews.push(interview);

      const firstQuestion = interview.questions[0];
      res.status(201).json({
        interviewId: interview._id,
        role: interview.role,
        experienceLevel: interview.experienceLevel,
        type: interview.type,
        companyName: interview.companyName,
        projectName: interview.projectName,
        vivaLevel: interview.vivaLevel,
        totalQuestions: interview.questions.length,
        currentQuestionIndex: 0,
        question: {
          text: firstQuestion.questionText,
          category: firstQuestion.category,
          difficulty: firstQuestion.difficulty,
          codeTemplate: firstQuestion.codeTemplate,
          language: firstQuestion.language,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const submitAnswer = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { candidateAnswer, candidateCode } = req.body;

    if (isDBConnected) {
      const interview = await Interview.findById(id);
      if (!interview) {
        res.status(404).json({ message: 'Interview session not found' });
        return;
      }

      if (interview.status !== 'In-Progress') {
        res.status(400).json({ message: 'Interview is not in progress' });
        return;
      }

      const currentIndex = interview.currentQuestionIndex;
      const currentQuestion = interview.questions[currentIndex];

      const evaluation = await evaluateResponse(
        currentQuestion.questionText,
        currentQuestion.category,
        candidateAnswer || '',
        candidateCode
      );

      currentQuestion.candidateAnswer = candidateAnswer || '';
      if (candidateCode) {
        currentQuestion.candidateCode = candidateCode;
      }
      currentQuestion.aiEvaluation = evaluation;

      // Track weak topic
      await handleWeakTopicTracking(req.user._id.toString(), currentQuestion.questionText, evaluation.score, true);

      const nextIndex = currentIndex + 1;
      interview.currentQuestionIndex = nextIndex;

      if (nextIndex >= interview.questions.length) {
        interview.status = 'Completed';

        const finalReport = await generateFinalFeedback(
          interview.role,
          interview.experienceLevel,
          interview.questions
        );

        interview.overallScore = finalReport.overallScore;
        interview.scores = finalReport.scores;
        interview.feedbackSummary = finalReport.feedbackSummary;
        interview.strengths = finalReport.strengths;
        interview.weaknesses = finalReport.weaknesses;
        interview.missingConcepts = finalReport.missingConcepts;
        interview.roadmap = finalReport.roadmap;
        
        // Save advanced report fields
        interview.overallRating = finalReport.overallRating;
        interview.technicalStrength = finalReport.technicalStrength;
        interview.communicationStrength = finalReport.communicationStrength;
        interview.recommendedLearningPath = finalReport.recommendedLearningPath;
        interview.suggestedResources = finalReport.suggestedResources;

        // Advanced Viva scoring
        if (interview.type === 'Viva') {
          const q1 = interview.questions[0]?.aiEvaluation?.score || 50;
          const q2 = interview.questions[1]?.aiEvaluation?.score || 50;
          const q3 = interview.questions[2]?.aiEvaluation?.score || 50;
          const avgComm = Math.round(interview.questions.reduce((acc, q) => acc + (q.aiEvaluation?.communicationScore || 50), 0) / interview.questions.length);
          const avgProb = Math.round(interview.questions.reduce((acc, q) => acc + (q.aiEvaluation?.problemSolvingScore || 50), 0) / interview.questions.length);
          
          interview.scores = {
            communication: avgComm,
            technical: Math.round((q1 + q2 + q3) / 3),
            confidence: Math.round(interview.questions.reduce((acc, q) => acc + (q.aiEvaluation?.confidenceScore || 50), 0) / interview.questions.length),
            problemSolving: avgProb,
            architecture: q1,
            technology: q2,
            deployment: q3
          };
          interview.overallScore = Math.round((q1 + q2 + q3 + avgComm + avgProb) / 5);
        }

        await interview.save();

        res.json({
          completed: true,
          interviewId: interview._id,
          feedback: {
            ...finalReport,
            overallScore: interview.overallScore,
            scores: interview.scores
          },
        });
        return;
      }

      // Dynamic difficulty/follow-up question generation
      let nextQuestion = interview.questions[nextIndex];
      nextQuestion = await adjustNextQuestion(
        currentQuestion.questionText,
        candidateAnswer || '',
        evaluation.score,
        nextQuestion
      );
      interview.questions[nextIndex] = nextQuestion;

      await interview.save();

      res.json({
        completed: false,
        currentQuestionIndex: nextIndex,
        question: {
          text: nextQuestion.questionText,
          category: nextQuestion.category,
          difficulty: nextQuestion.difficulty,
          codeTemplate: nextQuestion.codeTemplate,
          language: nextQuestion.language,
        },
      });
    } else {
      // Offline fallback
      const interview = memoryStore.interviews.find(i => i._id === id);
      if (!interview) {
        res.status(404).json({ message: 'Interview session not found' });
        return;
      }

      if (interview.status !== 'In-Progress') {
        res.status(400).json({ message: 'Interview is not in progress' });
        return;
      }

      const currentIndex = interview.currentQuestionIndex;
      const currentQuestion = interview.questions[currentIndex];

      const evaluation = await evaluateResponse(
        currentQuestion.questionText,
        currentQuestion.category,
        candidateAnswer || '',
        candidateCode
      );

      currentQuestion.candidateAnswer = candidateAnswer || '';
      if (candidateCode) {
        currentQuestion.candidateCode = candidateCode;
      }
      currentQuestion.aiEvaluation = evaluation;

      // Track weak topic (offline)
      await handleWeakTopicTracking(req.user._id.toString(), currentQuestion.questionText, evaluation.score, false);

      const nextIndex = currentIndex + 1;
      interview.currentQuestionIndex = nextIndex;

      if (nextIndex >= interview.questions.length) {
        interview.status = 'Completed';

        const finalReport = await generateFinalFeedback(
          interview.role,
          interview.experienceLevel,
          interview.questions
        );

        interview.overallScore = finalReport.overallScore;
        interview.scores = finalReport.scores;
        interview.feedbackSummary = finalReport.feedbackSummary;
        interview.strengths = finalReport.strengths;
        interview.weaknesses = finalReport.weaknesses;
        interview.missingConcepts = finalReport.missingConcepts;
        interview.roadmap = finalReport.roadmap;
        
        // Save advanced report fields on MemoryStore object
        (interview as any).overallRating = finalReport.overallRating;
        (interview as any).technicalStrength = finalReport.technicalStrength;
        (interview as any).communicationStrength = finalReport.communicationStrength;
        (interview as any).recommendedLearningPath = finalReport.recommendedLearningPath;
        (interview as any).suggestedResources = finalReport.suggestedResources;

        // Advanced Viva scoring (offline)
        if (interview.type === 'Viva') {
          const q1 = interview.questions[0]?.aiEvaluation?.score || 50;
          const q2 = interview.questions[1]?.aiEvaluation?.score || 50;
          const q3 = interview.questions[2]?.aiEvaluation?.score || 50;
          const avgComm = Math.round(interview.questions.reduce((acc, q) => acc + (q.aiEvaluation?.communicationScore || 50), 0) / interview.questions.length);
          const avgProb = Math.round(interview.questions.reduce((acc, q) => acc + (q.aiEvaluation?.problemSolvingScore || 50), 0) / interview.questions.length);
          
          interview.scores = {
            communication: avgComm,
            technical: Math.round((q1 + q2 + q3) / 3),
            confidence: Math.round(interview.questions.reduce((acc, q) => acc + (q.aiEvaluation?.confidenceScore || 50), 0) / interview.questions.length),
            problemSolving: avgProb,
            architecture: q1,
            technology: q2,
            deployment: q3
          };
          interview.overallScore = Math.round((q1 + q2 + q3 + avgComm + avgProb) / 5);
        }

        interview.updatedAt = new Date();

        res.json({
          completed: true,
          interviewId: interview._id,
          feedback: {
            ...finalReport,
            overallScore: interview.overallScore,
            scores: interview.scores
          },
        });
        return;
      }

      // Dynamic difficulty/follow-up question generation for offline
      let nextQuestion = interview.questions[nextIndex];
      nextQuestion = await adjustNextQuestion(
        currentQuestion.questionText,
        candidateAnswer || '',
        evaluation.score,
        nextQuestion
      );
      interview.questions[nextIndex] = nextQuestion;
      interview.updatedAt = new Date();

      res.json({
        completed: false,
        currentQuestionIndex: nextIndex,
        question: {
          text: nextQuestion.questionText,
          category: nextQuestion.category,
          difficulty: nextQuestion.difficulty,
          codeTemplate: nextQuestion.codeTemplate,
          language: nextQuestion.language,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getInterviewDetails = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isDBConnected) {
      const interview = await Interview.findById(id);

      if (!interview) {
        res.status(404).json({ message: 'Interview session not found' });
        return;
      }

      if (interview.userId.toString() !== req.user._id.toString()) {
        res.status(403).json({ message: 'Not authorized to view this interview' });
        return;
      }

      res.json(interview);
    } else {
      // Offline fallback
      const interview = memoryStore.interviews.find(i => i._id === id);

      if (!interview) {
        res.status(404).json({ message: 'Interview session not found' });
        return;
      }

      if (interview.userId.toString() !== req.user._id.toString()) {
        res.status(403).json({ message: 'Not authorized to view this interview' });
        return;
      }

      res.json(interview);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
