import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Interview } from '../models/Interview';
import { Resume } from '../models/Resume';
import { WeakTopic } from '../models/WeakTopic';
import { isDBConnected } from '../config/db';
import { memoryStore } from '../config/memoryStore';

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

const ROLE_ROADMAPS: Record<string, {
  completed: string[];
  inProgress: string[];
  upcoming: string[];
  recommendedTopics: string[];
  recommendedProjects: string[];
}> = {
  'frontend developer': {
    completed: ['HTML5 & Semantic Markup', 'CSS3 & Modern Layouts (Flexbox/Grid)', 'ES6+ JavaScript Fundamentals'],
    inProgress: ['React.js Components & Hooks'],
    upcoming: ['Next.js Framework & SSR', 'Performance Optimization (Lighthouse)', 'Frontend System Design'],
    recommendedTopics: ['React Server Components', 'State Management (Redux/Zustand)', 'Web Security (CORS/XSS/CSRF)'],
    recommendedProjects: ['Developer Portfolio with Tailwind', 'Admin Dashboard with Charts', 'Next.js Real-time Collaborative Board'],
  },
  'backend developer': {
    completed: ['HTTP Protocol & REST API Design', 'Node.js & Express.js Basics', 'SQL Databases (PostgreSQL)'],
    inProgress: ['MongoDB & Mongoose modeling'],
    upcoming: ['System Design & Scaling', 'Caching with Redis', 'Message Queues (RabbitMQ/Kafka)'],
    recommendedTopics: ['Microservices Architecture', 'Database Sharding & Replication', 'Docker & Containerization'],
    recommendedProjects: ['Task Manager API with JWT', 'E-commerce Backend Service', 'Distributed Chat server with Socket.io'],
  },
  'software engineer': {
    completed: ['Object-Oriented Programming (OOP)', 'Data Structures & Algorithms (DSA)', 'Git Version Control'],
    inProgress: ['Relational Database Management Systems (RDBMS)'],
    upcoming: ['System Design (LBL/Load Balancers)', 'Cloud Architecture', 'Distributed Systems'],
    recommendedTopics: ['Concurrency & Multi-threading', 'Microservices', 'Design Patterns (Creational/Structural)'],
    recommendedProjects: ['Custom URL Shortener', 'In-memory Key-Value Store', 'Real-time Web Scraper Engine'],
  },
  'java developer': {
    completed: ['Java Core Fundamentals', 'Object-Oriented Programming', 'Maven / Gradle build tools'],
    inProgress: ['Spring Boot framework & REST Controllers'],
    upcoming: ['Spring Cloud & Microservices', 'JVM Tuning & Performance', 'Hibernate / JPA persistence'],
    recommendedTopics: ['Multithreading & Concurrency', 'Spring Security with OAuth2', 'Java Streams & Lambda expressions'],
    recommendedProjects: ['Spring Boot CRUD Library API', 'Microservice-based Banking System', 'Java Multithreaded Web Server'],
  },
  'python developer': {
    completed: ['Python Core Syntax & OOP', 'Data Structures in Python', 'Virtual Environments (venv/pip)'],
    inProgress: ['Django / Flask framework API development'],
    upcoming: ['Asynchronous Python (asyncio)', 'Data Engineering Basics', 'Machine Learning Models Deployment'],
    recommendedTopics: ['FastAPI framework', 'Pandas & NumPy for analytics', 'Dockerizing Python apps'],
    recommendedProjects: ['REST API with FastAPI', 'Automated web scraping pipeline', 'AI Text Summarizer Widget'],
  },
  'data analyst': {
    completed: ['Excel Formulas & Pivot Tables', 'SQL queries (Joins/Aggregates)', 'Data cleaning principles'],
    inProgress: ['Data Visualization with Tableau / PowerBI'],
    upcoming: ['Python scripting for data parsing', 'Statistical Analysis', 'A/B Testing Methodologies'],
    recommendedTopics: ['Pandas library', 'Data Warehousing concepts', 'ETL pipelines design'],
    recommendedProjects: ['Sales Performance Tableau Dashboard', 'Customer Churn Analysis with SQL', 'Web Traffic Analytics Report'],
  },
  'data scientist': {
    completed: ['Linear Algebra & Probability', 'Python (NumPy, Pandas, Scikit-Learn)', 'Supervised Learning Algorithms'],
    inProgress: ['Unsupervised Learning & Clustering'],
    upcoming: ['Deep Learning & Neural Networks', 'MLOps & Model Deployment', 'Big Data (Spark/Hadoop)'],
    recommendedTopics: ['Natural Language Processing (NLP)', 'Time Series Forecasting', 'Hyperparameter tuning'],
    recommendedProjects: ['House Price Prediction Engine', 'Customer Segmentation Model', 'AI Sentiment Analysis API'],
  },
  'devops engineer': {
    completed: ['Linux Administration & Shell scripting', 'Git & Version Control', 'Networking fundamentals'],
    inProgress: ['Docker containers & orchestration basics'],
    upcoming: ['Kubernetes cluster management', 'Infrastructure as Code (IaC - Terraform)', 'CI/CD Pipelines (GitHub Actions/Jenkins)'],
    recommendedTopics: ['Prometheus & Grafana monitoring', 'AWS Cloud architecture', 'Log analysis (ELK Stack)'],
    recommendedProjects: ['Automated AWS Deployment Script', 'Dockerized Node.js CI/CD Pipeline', 'Kubernetes Helm Chart Deployment'],
  },
  'cyber security': {
    completed: ['Networking Protocols (TCP/IP, DNS)', 'Linux Security Fundamentals', 'Cryptography basics'],
    inProgress: ['Vulnerability Assessment & Penetration Testing'],
    upcoming: ['Incident Response & Forensic Analysis', 'Cloud Security architecture', 'Identity & Access Management (IAM)'],
    recommendedTopics: ['OWASP Top 10 web vulnerabilities', 'SIEM tools setup (Splunk)', 'Firewall configuration'],
    recommendedProjects: ['Custom Network Port Scanner', 'Vulnerability Audit of Web App', 'Intrusion Detection System setup'],
  },
  'cloud engineer': {
    completed: ['Cloud Concepts (IaaS, PaaS, SaaS)', 'AWS Cloud practitioner topics', 'Basic System administration'],
    inProgress: ['AWS Core services (EC2, S3, RDS, Lambda)'],
    upcoming: ['Multi-cloud deployments (Azure/GCP)', 'Serverless Architectures', 'Infrastructure as Code (IaC)'],
    recommendedTopics: ['AWS Certified Solutions Architect topics', 'VPC Design & Cloud Security', 'Cloud Billing & Optimization'],
    recommendedProjects: ['Static Website on AWS S3 & CloudFront', 'Serverless REST API with AWS Lambda', 'Terraform AWS Infrastructure Deploy'],
  },
  'hr interview': {
    completed: ['Resume elevator pitch', 'STAR method answers structure', 'Core behavioral skills'],
    inProgress: ['Answering leadership scenario questions'],
    upcoming: ['Negotiation skills', 'Conflict resolution scenarios', 'Executive presence'],
    recommendedTopics: ['Company core values alignment', 'Constructive feedback handling', 'Active listening'],
    recommendedProjects: ['Mock HR Interview preparation guide', 'Self-introduction elevator pitch video', 'STAR Method Scenario Workbook'],
  }
};

const matchRole = (roleName: string): string => {
  const norm = (roleName || '').toLowerCase().trim();
  if (norm.includes('frontend')) return 'frontend developer';
  if (norm.includes('backend')) return 'backend developer';
  if (norm.includes('java')) return 'java developer';
  if (norm.includes('python')) return 'python developer';
  if (norm.includes('analyst')) return 'data analyst';
  if (norm.includes('scientist') || norm.includes('science')) return 'data scientist';
  if (norm.includes('devops')) return 'devops engineer';
  if (norm.includes('security') || norm.includes('cyber')) return 'cyber security';
  if (norm.includes('cloud')) return 'cloud engineer';
  if (norm.includes('hr') || norm.includes('behavioral')) return 'hr interview';
  return 'software engineer';
};

export const getDashboardSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id;
    let interviews: any[] = [];
    let resumeObj: any = null;
    let weakTopics: any[] = [];

    if (isDBConnected) {
      interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
      resumeObj = await Resume.findOne({ userId });
      weakTopics = await WeakTopic.find({ userId });
    } else {
      interviews = memoryStore.interviews
        .filter(i => i.userId === userId.toString())
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      resumeObj = memoryStore.resumes.find(r => r.userId === userId.toString());
      weakTopics = memoryStore.weakTopics.filter(w => w.userId === userId.toString());
    }

    // Voice simulation history
    const voiceHistory: any[] = interviews.map(i => {
      const voiceQuestions = (i.questions || []).filter((q: any) => q.category !== 'Coding');
      if (voiceQuestions.length === 0) return null;

      return {
        id: i._id,
        role: i.role,
        type: i.type,
        date: i.createdAt,
        score: i.overallScore || null,
        feedback: i.feedbackSummary || '',
        strengths: i.strengths || [],
        weaknesses: i.weaknesses || [],
        questions: voiceQuestions.map((q: any) => ({
          questionText: q.questionText,
          candidateAnswer: q.candidateAnswer || '',
          score: q.aiEvaluation?.score || null,
          feedback: q.aiEvaluation?.feedback || '',
          strengths: q.aiEvaluation?.strengths || [],
          weaknesses: q.aiEvaluation?.weaknesses || []
        }))
      };
    }).filter(Boolean);

    // Coding submission history
    const codingHistory: any[] = [];
    interviews.forEach(i => {
      (i.questions || []).forEach((q: any, idx: number) => {
        if (q.category === 'Coding' && q.candidateCode) {
          codingHistory.push({
            id: `${i._id}_code_${idx}`,
            problem: q.questionText,
            language: q.language || 'javascript',
            code: q.candidateCode,
            score: q.aiEvaluation?.score || null,
            feedback: q.aiEvaluation?.feedback || 'Code reviewed by runtime compiler sandbox.',
            mistakes: q.aiEvaluation?.weaknesses || [],
            date: i.createdAt,
            timeTaken: '12 mins'
          });
        }
      });
    });

    // Resume Analysis
    const resumeAnalysis = resumeObj ? {
      fileName: resumeObj.fileName,
      skills: resumeObj.skills || [],
      atsScore: resumeObj.atsScore || 75,
      strengthReport: resumeObj.strengthReport || 'Strong background in core tech stacks. Recommended to add quantitative metrics.',
      missingSkills: resumeObj.missingSkills || ['System Design', 'CI/CD Pipelines', 'AWS Deployment'],
      suggestedImprovements: resumeObj.suggestedImprovements || [
        'Add impact metrics to showcase measurable accomplishments.',
        'Detail microservice patterns in backend descriptions.'
      ]
    } : null;

    // Quick Stats
    const totalInterviews = interviews.length;
    const completedInterviews = interviews.filter(i => i.status === 'Completed');
    const totalCompleted = completedInterviews.length;

    const avgScore = totalCompleted > 0
      ? Math.round(completedInterviews.reduce((acc, i) => acc + (i.overallScore || 0), 0) / totalCompleted)
      : 0;

    const bestScore = totalCompleted > 0
      ? Math.max(...completedInterviews.map(i => i.overallScore || 0))
      : 0;

    const completedCoding = codingHistory.filter(c => c.score !== null);
    const codingAccuracy = completedCoding.length > 0
      ? Math.round(completedCoding.reduce((acc, c) => acc + c.score, 0) / completedCoding.length)
      : 0;

    let commScoreSum = 0;
    let commScoreCount = 0;
    completedInterviews.forEach(i => {
      i.questions.forEach((q: any) => {
        if (q.category !== 'Coding' && q.aiEvaluation) {
          const scoreVal = q.aiEvaluation.communicationScore || q.aiEvaluation.score || 0;
          if (scoreVal > 0) {
            commScoreSum += scoreVal;
            commScoreCount++;
          }
        }
      });
    });
    const communicationScore = commScoreCount > 0
      ? Math.round(commScoreSum / commScoreCount)
      : 0;

    // Recent Activity mapping
    const lastInterview = voiceHistory.length > 0 ? {
      role: voiceHistory[0].role,
      date: voiceHistory[0].date,
      score: voiceHistory[0].score
    } : null;

    const lastCodingRound = codingHistory.length > 0 ? {
      problem: codingHistory[0].problem,
      date: codingHistory[0].date,
      score: codingHistory[0].score
    } : null;

    const lastResumeAnalysis = resumeAnalysis && resumeObj ? {
      fileName: resumeAnalysis.fileName,
      date: resumeObj.updatedAt || resumeObj.createdAt
    } : null;

    const recentActivity = {
      lastInterview,
      lastCodingRound,
      lastResumeAnalysis
    };

    // Skills radar chart metrics
    const skillsRadar = [
      { subject: 'Communication', score: communicationScore || 70, fullMark: 100 },
      { subject: 'Technical', score: avgScore || 70, fullMark: 100 },
      { subject: 'Confidence', score: communicationScore ? Math.min(communicationScore + 5, 100) : 75, fullMark: 100 },
      { subject: 'Problem Solving', score: codingAccuracy || 70, fullMark: 100 },
    ];

    const recentCompleted = [...completedInterviews].slice(0, 7).reverse();
    const performanceTimeline = recentCompleted.map((i, idx) => ({
      name: `Int. ${idx + 1}`,
      score: i.overallScore || 0,
      role: i.role,
      date: new Date(i.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    }));

    const historyList = interviews.map(i => ({
      id: i._id,
      role: i.role,
      type: i.type,
      status: i.status,
      overallScore: i.overallScore || null,
      createdAt: i.createdAt,
    }));

    // Personalized roadmap generation
    const userRole = interviews.length > 0 ? interviews[0].role : (resumeObj && resumeObj.skills ? resumeObj.skills[0] : 'Software Engineer');
    const matchedKey = matchRole(userRole);
    const baseMap = ROLE_ROADMAPS[matchedKey] || ROLE_ROADMAPS['software engineer'];

    // Collect personalized weak areas from actual user feedback weaknesses
    const weakAreas: string[] = [];
    interviews.forEach(i => {
      if (i.weaknesses) {
        i.weaknesses.forEach((w: string) => {
          if (!weakAreas.includes(w) && w.length < 50) weakAreas.push(w);
        });
      }
      i.questions.forEach((q: any) => {
        if (q.aiEvaluation && q.aiEvaluation.weaknesses) {
          q.aiEvaluation.weaknesses.forEach((w: string) => {
            if (!weakAreas.includes(w) && w.length < 50) weakAreas.push(w);
          });
        }
      });
    });

    const slicedWeak = weakAreas.slice(0, 3);
    if (slicedWeak.length === 0) {
      if (matchedKey === 'frontend developer') {
        slicedWeak.push('React State management edge cases', 'Web Performance metrics (CLS/LCP)');
      } else if (matchedKey === 'backend developer') {
        slicedWeak.push('Database indexing and normalization', 'Caching layer strategies (Redis)');
      } else {
        slicedWeak.push('System Design complexity limits', 'Time-complexity optimizations');
      }
    }

    const roadmap = {
      role: userRole,
      completed: baseMap.completed,
      inProgress: baseMap.inProgress,
      upcoming: baseMap.upcoming,
      weakAreas: slicedWeak,
      recommendedTopics: baseMap.recommendedTopics,
      recommendedProjects: baseMap.recommendedProjects,
      progress: Math.round((baseMap.completed.length / (baseMap.completed.length + baseMap.inProgress.length + baseMap.upcoming.length)) * 100)
    };

    // UPGRADE 1: Question Difficulty Analytics
    let easySum = 0, easyCount = 0;
    let mediumSum = 0, mediumCount = 0;
    let hardSum = 0, hardCount = 0;
    interviews.forEach(i => {
      i.questions.forEach((q: any) => {
        if (q.aiEvaluation) {
          const diff = (q.questionDifficulty || q.difficulty || 'Easy').toLowerCase();
          const scoreVal = q.aiEvaluation.score || 0;
          if (diff === 'easy') {
            easySum += scoreVal;
            easyCount++;
          } else if (diff === 'medium') {
            mediumSum += scoreVal;
            mediumCount++;
          } else if (diff === 'hard') {
            hardSum += scoreVal;
            hardCount++;
          }
        }
      });
    });

    const difficultyAnalytics = {
      easy: easyCount > 0 ? Math.round(easySum / easyCount) : 0,
      medium: mediumCount > 0 ? Math.round(mediumSum / mediumCount) : 0,
      hard: hardCount > 0 ? Math.round(hardSum / hardCount) : 0
    };

    // UPGRADE 2: Weak & Strong Topics Tracker
    const weakTopicsData = weakTopics.filter(w => w.score < 60 || w.improvementStatus === 'Needs Review').map(w => ({
      topic: w.topic,
      score: w.score,
      latestScore: w.latestScore,
      previousScore: w.previousScore,
      improvementStatus: w.improvementStatus
    }));

    const strongTopicsSet = new Set<string>();
    interviews.forEach(i => {
      i.questions.forEach((q: any) => {
        if (q.aiEvaluation && q.aiEvaluation.score >= 70) {
          const topic = detectTopic(q.questionText);
          if (topic !== 'General Technical') {
            strongTopicsSet.add(topic);
          }
        }
      });
    });
    const weakActiveTopics = weakTopicsData.map(w => w.topic);
    const strongTopics = Array.from(strongTopicsSet).filter(t => !weakActiveTopics.includes(t));
    if (strongTopics.length === 0) {
      strongTopics.push('React', 'API Development', 'JavaScript');
    }

    const aiMemoryMilestones = weakTopics
      .filter(w => w.previousScore !== undefined && w.latestScore !== undefined)
      .map(w => `${w.topic} improved from ${w.previousScore}% to ${w.latestScore}%.`);

    // UPGRADE 3: Company Performance Analytics
    const supportedCompanies = ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Capgemini', 'HCL', 'Tech Mahindra', 'Amazon'];
    const companyMetrics: Record<string, { attempts: number; avgScore: number; bestScore: number }> = {};
    supportedCompanies.forEach(c => {
      companyMetrics[c] = { attempts: 0, avgScore: 0, bestScore: 0 };
    });

    const companyInterviews = completedInterviews.filter(i => i.type === 'Company' && i.companyName);
    companyInterviews.forEach(i => {
      const name = i.companyName;
      if (supportedCompanies.includes(name)) {
        const metrics = companyMetrics[name];
        metrics.attempts++;
        metrics.bestScore = Math.max(metrics.bestScore, i.overallScore || 0);
        metrics.avgScore += i.overallScore || 0;
      }
    });

    supportedCompanies.forEach(c => {
      const metrics = companyMetrics[c];
      if (metrics.attempts > 0) {
        metrics.avgScore = Math.round(metrics.avgScore / metrics.attempts);
      }
    });

    // UPGRADE 4: Project Viva Performance Analytics
    const vivaInterviews = completedInterviews.filter(i => i.type === 'Viva');
    const vivaPerformance = vivaInterviews.map(i => ({
      id: i._id,
      projectName: i.projectName || 'Portfolio Project',
      vivaLevel: i.vivaLevel || 'Intermediate',
      overallScore: i.overallScore || 0,
      date: i.createdAt,
      scores: {
        architecture: i.scores?.architecture || 0,
        technology: i.scores?.technology || 0,
        deployment: i.scores?.deployment || 0,
        problemSolving: i.scores?.problemSolving || 0,
        communication: i.scores?.communication || 0
      }
    }));

    // UPGRADE 5: Career Readiness Score V2
    let consistencyScore = 75;
    const lastFive = completedInterviews.slice(0, 5).map(i => i.overallScore || 0).reverse();
    if (lastFive.length >= 2) {
      let diffSum = 0;
      for (let k = 1; k < lastFive.length; k++) {
        diffSum += (lastFive[k] - lastFive[k - 1]);
      }
      const avgDiff = diffSum / (lastFive.length - 1);
      consistencyScore = Math.min(100, Math.max(0, 75 + Math.round(avgDiff * 4)));
    } else if (lastFive.length === 1) {
      consistencyScore = lastFive[0];
    }

    const hasCompletedInterviews = totalCompleted > 0;
    const hasCodingHistory = codingHistory.filter(c => c.score !== null).length > 0;
    const hasResume = !!resumeAnalysis;

    const resumeAts = hasResume ? (resumeAnalysis?.atsScore || 70) : 0;
    const avgInt = hasCompletedInterviews ? (avgScore || 70) : 0;
    const avgCod = hasCodingHistory ? (codingAccuracy || 70) : 0;
    const finalConsistencyScore = hasCompletedInterviews ? consistencyScore : 0;

    const careerReadiness = Math.round(
      (avgInt * 0.35) + 
      (avgCod * 0.30) + 
      (resumeAts * 0.20) + 
      (finalConsistencyScore * 0.15)
    );

    const readinessLevel = careerReadiness >= 85 ? 'Advanced' : careerReadiness >= 60 ? 'Intermediate' : 'Beginner';

    const readinessExplanation = {
      strengths: strongTopics.slice(0, 3),
      weakAreas: weakActiveTopics.slice(0, 3).length > 0 ? weakActiveTopics.slice(0, 3) : ['DBMS', 'System Design'],
      missingSkills: resumeAnalysis?.missingSkills?.slice(0, 3) || ['SQL Optimization', 'Docker']
    };

    res.json({
      metrics: {
        totalInterviews,
        totalCompleted,
        avgScore,
        bestScore,
        codingAccuracy,
        communicationScore
      },
      recentActivity,
      skillsRadar,
      performanceTimeline,
      historyList,
      voiceHistory,
      codingHistory,
      resumeAnalysis,
      roadmap,
      difficultyAnalytics,
      weakTopics: weakTopicsData,
      strongTopics,
      aiMemoryMilestones,
      companyMetrics,
      vivaPerformance,
      careerReadiness: {
        score: careerReadiness,
        level: readinessLevel,
        consistencyScore,
        explanation: readinessExplanation
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
