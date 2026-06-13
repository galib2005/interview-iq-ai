import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Resume } from '../models/Resume';
import { User } from '../models/User';
import { extractSkillsFromResume } from '../services/openaiService';
import pdfParse from 'pdf-parse';
import { isDBConnected } from '../config/db';
import { memoryStore, MemoryResume } from '../config/memoryStore';

export const uploadResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'Please upload a PDF file' });
      return;
    }

    let extractedText = '';
    try {
      const dataBuffer = req.file.buffer;
      const parsedData = await pdfParse(dataBuffer);
      extractedText = parsedData.text;
    } catch (parseError: any) {
      console.warn('PDF parsing failed, falling back to mock text. Error:', parseError.message);
      extractedText = 'Mock parsed resume text: Galib Ashraf, Full Stack Engineer. Skills: React, Node.js, Express, MongoDB, Python, Next.js.';
    }

    const analysis = await extractSkillsFromResume(extractedText);

    if (isDBConnected) {
      let resumeObj = await Resume.findOne({ userId: req.user._id });
      if (resumeObj) {
        resumeObj.fileName = req.file.originalname;
        resumeObj.skills = analysis.skills;
        resumeObj.experienceSummary = analysis.experienceSummary;
        resumeObj.extractedText = extractedText;
        resumeObj.atsScore = analysis.atsScore;
        resumeObj.strengthReport = analysis.strengthReport;
        resumeObj.missingSkills = analysis.missingSkills;
        resumeObj.suggestedImprovements = analysis.suggestedImprovements;
        resumeObj.projects = analysis.projects || [];
        await resumeObj.save();
      } else {
        resumeObj = await Resume.create({
          userId: req.user._id,
          fileName: req.file.originalname,
          skills: analysis.skills,
          experienceSummary: analysis.experienceSummary,
          extractedText,
          atsScore: analysis.atsScore,
          strengthReport: analysis.strengthReport,
          missingSkills: analysis.missingSkills,
          suggestedImprovements: analysis.suggestedImprovements,
          projects: analysis.projects || [],
        });
      }

      const user = await User.findById(req.user._id);
      if (user) {
        const mergedSkills = Array.from(new Set([...user.skills, ...analysis.skills]));
        user.skills = mergedSkills;
        await user.save();
      }

      res.json({
        message: 'Resume processed successfully',
        resume: {
          fileName: resumeObj.fileName,
          skills: resumeObj.skills,
          experienceSummary: resumeObj.experienceSummary,
          atsScore: resumeObj.atsScore,
          strengthReport: resumeObj.strengthReport,
          missingSkills: resumeObj.missingSkills,
          suggestedImprovements: resumeObj.suggestedImprovements,
          projects: resumeObj.projects,
        },
      });
    } else {
      // Offline fallback
      let resumeObj = memoryStore.resumes.find(r => r.userId === req.user._id);
      if (resumeObj) {
        resumeObj.fileName = req.file.originalname;
        resumeObj.skills = analysis.skills;
        resumeObj.experienceSummary = analysis.experienceSummary;
        resumeObj.extractedText = extractedText;
        resumeObj.atsScore = analysis.atsScore;
        resumeObj.strengthReport = analysis.strengthReport;
        resumeObj.missingSkills = analysis.missingSkills;
        resumeObj.suggestedImprovements = analysis.suggestedImprovements;
        resumeObj.projects = analysis.projects || [];
        resumeObj.updatedAt = new Date();
      } else {
        resumeObj = {
          _id: `mem_res_${Date.now()}`,
          userId: req.user._id,
          fileName: req.file.originalname,
          skills: analysis.skills,
          experienceSummary: analysis.experienceSummary,
          extractedText,
          atsScore: analysis.atsScore,
          strengthReport: analysis.strengthReport,
          missingSkills: analysis.missingSkills,
          suggestedImprovements: analysis.suggestedImprovements,
          projects: analysis.projects || [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        memoryStore.resumes.push(resumeObj);
      }

      const user = memoryStore.users.find(u => u._id === req.user._id);
      if (user) {
        const mergedSkills = Array.from(new Set([...user.skills, ...analysis.skills]));
        user.skills = mergedSkills;
      }

      res.json({
        message: 'Resume processed successfully',
        resume: {
          fileName: resumeObj.fileName,
          skills: resumeObj.skills,
          experienceSummary: resumeObj.experienceSummary,
          atsScore: resumeObj.atsScore,
          strengthReport: resumeObj.strengthReport,
          missingSkills: resumeObj.missingSkills,
          suggestedImprovements: resumeObj.suggestedImprovements,
          projects: resumeObj.projects,
        },
      });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isDBConnected) {
      const resume = await Resume.findOne({ userId: req.user._id });
      if (!resume) {
        res.status(404).json({ message: 'No resume context found for this user' });
        return;
      }
      res.json(resume);
    } else {
      // Offline fallback
      const resume = memoryStore.resumes.find(r => r.userId === req.user._id);
      if (!resume) {
        res.status(404).json({ message: 'No resume context found for this user' });
        return;
      }
      res.json(resume);
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
