import { IQuestion } from '../models/Interview';

export const promptService = {
  /**
   * Generates the prompt for generating interview questions.
   */
  getQuestionsPrompt: (
    role: string,
    level: 'Entry' | 'Mid' | 'Senior',
    type: 'HR' | 'Technical' | 'Mixed' | 'Custom' | 'Viva' | 'Company',
    skills: string[] = [],
    companyName?: string,
    projectName?: string,
    vivaLevel?: 'Beginner' | 'Intermediate' | 'Advanced',
    weakTopicsList: string[] = [],
    resumeProjects: any[] = []
  ): string => {
    let baseInstructions = `You are a strict, world-class technical interviewer and recruiter.
Your tone must be highly professional, objective, and realistic. Do not include chatbot pleasantries, greetings, or conversational preambles.
Candidate Profile:
- Role: ${role}
- Experience Level: ${level}
- Skills matching candidate resume: ${skills.join(', ')}
`;

    if (weakTopicsList && weakTopicsList.length > 0) {
      baseInstructions += `- Candidate's historically weak topics to adaptively target/evaluate: ${weakTopicsList.join(', ')}\n`;
    }

    let typePrompt = '';

    if (type === 'Viva') {
      typePrompt = `Create exactly 3 project-specific viva questions for the candidate's project: "${projectName}" at the "${vivaLevel || 'Intermediate'}" difficulty tier.
Focus key evaluation points on:
1. Project architecture and structural design
2. Technical stack choices and concrete alternatives/justifications
3. Deployment strategy (CI/CD, containerization, cloud, environments)
4. Application security and data integrity
5. Algorithmic problem-solving within the context of this project

Format each question with difficulty level "${vivaLevel === 'Beginner' ? 'Easy' : vivaLevel === 'Intermediate' ? 'Medium' : 'Hard'}".
Ensure questions challenge the candidate's understanding of their own design choice.`;
    } else if (type === 'Company') {
      const comp = companyName || 'TCS';
      typePrompt = `Create exactly 5 interview questions adapted specifically to the interview style, culture, and criteria of ${comp}.
`;

      if (comp === 'Google') {
        typePrompt += `Google Interview Guidelines:
- Highly rigorous focus on algorithmic complexity, data structures (DSA), system design, scalability, and "Googleyness" (problem-solving under pressure, leadership, and open-mindedness).
- Design 1 question as an Advanced DSA Coding Assessment (Category: 'Coding') placed in Round 5 (Index 4), including code template, language, and test cases.
- Design 1 question testing large-scale system design/scalability (Category: 'Technical', Difficulty: Hard).
- Design 1 question testing core computer science theory (Category: 'Technical', Difficulty: Medium or Hard).
- Design 2 behavioral questions testing cognitive ability and Googleyness (Category: 'Behavioral', Difficulty: Medium).`;
      } else if (comp === 'Microsoft') {
        typePrompt += `Microsoft Interview Guidelines:
- Heavy emphasis on clean code, object-oriented design patterns (OOD/OOP), robust testing, and collaborative engineering practices.
- Design 1 question as a DSA/OOD Coding Assessment (Category: 'Coding') placed in Round 5 (Index 4), with code template, language, and test cases.
- Design 1 question on object-oriented design/architectural design patterns (Category: 'Technical', Difficulty: Medium or Hard).
- Design 2 questions on core computer science foundations and algorithms (Category: 'Technical', Difficulty: Easy or Medium).
- Design 1 question on behavioral teamwork, design tradeoffs, or customer obsession (Category: 'Behavioral', Difficulty: Easy or Medium).`;
      } else if (comp === 'Amazon') {
        typePrompt += `Amazon Interview Guidelines:
- Strict alignment with Amazon's Leadership Principles (e.g. Customer Obsession, Ownership, Bias for Action, Dive Deep).
- Design 1 question as a rigorous DSA Coding Assessment (Category: 'Coding') placed in Round 1 or Round 5 (Category: 'Coding', with codeTemplate, language and testCases matching expectations).
- Design 1 question on high-level system design or database architecture tradeoffs (Category: 'Technical', Difficulty: Hard).
- Design 3 behavioral questions mapping directly to Amazon Leadership Principles (Category: 'Behavioral', Difficulty: Medium or Hard).`;
      } else if (['TCS', 'Infosys', 'Wipro', 'Cognizant', 'Capgemini', 'Accenture', 'HCL', 'Tech Mahindra'].includes(comp)) {
        typePrompt += `Service-based Company (${comp}) Guidelines:
- Focus on basic technical concepts, service execution aptitude, logical reasoning, and client communication.
- Design 1 question as an Aptitude or Logical challenge (Category: 'Technical' or 'Behavioral', Difficulty: Easy or Medium).
- Design 2 technical questions testing fundamental definitions, database basics, or language specific concepts (Category: 'Technical', Difficulty: Easy or Medium).
- Design 2 HR/behavioral questions testing teamwork, flexibility, learning agility, and relocation readiness (Category: 'Behavioral', Difficulty: Easy).`;
      } else {
        typePrompt += `General Company Guidelines:
- Design 1 Aptitude or Logical challenge (Difficulty: Easy).
- Design 2 Technical questions (Difficulty: Medium or Hard).
- Design 2 HR/behavioral questions (Difficulty: Easy).`;
      }

      if (weakTopicsList && weakTopicsList.length > 0) {
        typePrompt += `\nCRITICAL ADAPTATION: Use the candidate's historically weak topics (${weakTopicsList.join(', ')}) to customize at least one of the technical questions. Ensure it assesses whether they have rectified their understanding of that specific topic.`;
      }
    } else {
      typePrompt = `Create exactly 5 interview questions for a candidate interviewing for a ${role} position.
Round Type: ${type}.

ENFORCE DYNAMIC ROUND PROGRESSIONS:
- Round 1 (Index 0): Basic conceptual question (Difficulty: Easy). If resume skills match (e.g. React), create a question matching that technology.
- Round 2 (Index 1): Intermediate concept question (Difficulty: Medium).
- Round 3 (Index 2): Advanced core concepts question (Difficulty: Hard).
- Round 4 (Index 3): Scenario-based or troubleshooting/debugging challenge (Difficulty: Hard).
- Round 5 (Index 4): Coding assessment (only for Technical or Mixed rounds, Category: 'Coding') or an advanced behavioral/leadership challenge (for HR round, Category: 'Behavioral').

CRITICAL RULES:
1. For Software/Web/Frontend/Backend developer roles, if the round is Technical or Mixed, exactly 1 coding question must be placed in Round 5 (Index 4).
2. Choose language templates and test cases matching the candidate's skills (e.g. Python, Java, JavaScript, or C++).
3. Do not duplicate questions. Be extremely realistic. No chatbot pleasantries.`;

      if (weakTopicsList && weakTopicsList.length > 0) {
        typePrompt += `\nCRITICAL ADAPTATION: Adaptively incorporate one question targeting the candidate's historically weak topics: ${weakTopicsList.join(', ')}.`;
      }
    }

    const schemaPrompt = `

Format each question strictly as a JSON object inside a list. The JSON schema must match:
[
  {
    "questionText": "string",
    "category": "Behavioral" | "Technical" | "Coding",
    "difficulty": "Easy" | "Medium" | "Hard",
    "expectedKeywords": ["keyword1", "keyword2"],
    "codeTemplate": "string (only for Coding category, e.g., 'function solve() { }')",
    "language": "string (only for Coding category, e.g. 'javascript', 'python', 'cpp', 'java')",
    "testCases": [{"input": "string", "expectedOutput": "string"}] (only for Coding category)
  }
]

Return ONLY a valid JSON array. Do not wrap the response in markdown blocks or include pre-text or post-text. Ensure it is parseable directly.`;

    return baseInstructions + '\n' + typePrompt + schemaPrompt;
  },

  /**
   * Generates the prompt for evaluating a single candidate response.
   */
  getEvaluationPrompt: (
    questionText: string,
    category: string,
    candidateAnswer: string,
    candidateCode?: string
  ): string => {
    return `You are a strict, senior technical interviewer evaluating a candidate's response.
Provide an objective, detailed evaluation. No customer support pleasantries, praise, or introductory chat.

Question Asked: "${questionText}"
Category: ${category}
Candidate Answer: "${candidateAnswer}"
${candidateCode ? `Candidate Code Submitted:\n${candidateCode}` : ''}

CRITICAL SCORING RUBRICS (Summing to 100 max points):
1. Technical Accuracy (0 to 25 points): Check correctness of technical statements, definitions, and concepts. Shallow answers (e.g. "JWT is used for authentication") or incorrect definitions should score 0-10.
2. Communication & Coding (0 to 20 points): Code syntax correctness, readability, clean variable naming, or verbal clarity and explanation flow.
3. Completeness (0 to 20 points): Did the candidate answer all parts of the question, or did they miss core specifications?
4. Problem Solving (0 to 20 points): Ability to reason, analyze tradeoffs, write test cases, or handle edge cases mentioned in the question.
5. Confidence & Terminology (0 to 15 points): Use of standard professional terminology vs general hand-waving or casual speech.

SCORING GUIDE:
- 0-20: Empty answer, completely incorrect, off-topic, random text, or "I don't know".
- 21-40: Shallow understanding, major concepts missing, poor explanation, or extremely brief responses.
- 41-60: Average answer, showing basic conceptual understanding but missing design details, parameters, or tradeoffs.
- 61-75: Good response, covers most concepts, small syntax bugs or minor definition mistakes.
- 76-89: Strong response, includes clear definitions, proper examples, realistic engineering terminology, and solid details.
- 90-100: Exceptional response, senior industry-level depth, clear discussion of architectural tradeoffs, edge-case mitigation, and scaling impact.

Calculate each score individually according to the rubric. The overall score MUST be the mathematical sum of the five component scores:
overallScore = technicalScore + communicationScore + completenessScore + problemSolvingScore + confidenceScore

Format your response strictly as a JSON object:
{
  "technicalScore": number (0 to 25),
  "communicationScore": number (0 to 20),
  "completenessScore": number (0 to 20),
  "problemSolvingScore": number (0 to 20),
  "confidenceScore": number (0 to 15),
  "overallScore": number (0 to 100),
  "feedback": "strict, objective critique detailing what was missing and why the score was assigned",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "missingConcepts": ["string"],
  "improvementSuggestions": ["string"],
  "suggestedCorrectAnswer": "Ideal industry-level response demonstrating depth, terminology, and concrete metrics"
}
Return ONLY valid JSON.`;
  },

  /**
   * Generates the prompt for compiling the final feedback report.
   */
  getFinalFeedbackPrompt: (
    role: string,
    level: string,
    questions: IQuestion[]
  ): string => {
    const questionsSummary = questions.map((q) => ({
      question: q.questionText,
      category: q.category,
      answer: q.candidateAnswer || q.candidateCode,
      score: q.aiEvaluation?.score,
      feedback: q.aiEvaluation?.feedback,
      technicalScore: q.aiEvaluation?.technicalScore,
      communicationScore: q.aiEvaluation?.communicationScore,
      problemSolvingScore: q.aiEvaluation?.problemSolvingScore,
      completenessScore: q.aiEvaluation?.completenessScore,
      confidenceScore: q.aiEvaluation?.confidenceScore,
    }));

    return `You are a senior career growth advisor compiling a final performance report for a mock interview.
Role: ${role}
Experience Level: ${level}
Completed Interview Questions and Evaluations:
${JSON.stringify(questionsSummary, null, 2)}

STRICT RATING RULES:
Determine the overallRating based on candidate's performance:
- "Hire": Average score >= 75 AND candidate showed technical depth, correct terminology, and structured answers.
- "Borderline": Average score is between 55 and 74.
- "No Hire": Average score < 55.

Generate a comprehensive performance report in JSON format:
{
  "overallScore": number (0 to 100),
  "scores": {
    "communication": number (0 to 100),
    "technical": number (0 to 100),
    "confidence": number (0 to 100),
    "problemSolving": number (0 to 100)
  },
  "feedbackSummary": "Honest assessment paragraph summarizing role fit, communication clarity, and technical competence",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "missingConcepts": ["string"],
  "roadmap": [
    {
      "step": "Detailed step for learning roadmap",
      "resources": ["Specific book, course name, resource link, or documentation"]
    }
  ],
  "overallRating": "Hire" | "Borderline" | "No Hire",
  "technicalStrength": "Detailed critique of core technical concepts demonstrated",
  "communicationStrength": "Detailed critique of communication skills, clarity, and terminologies",
  "recommendedLearningPath": ["Goal 1", "Goal 2"],
  "suggestedResources": ["Book/Resource 1", "Platform/Site 2"]
}
Return ONLY valid JSON.`;
  },

  /**
   * Generates the prompt for resume parsing and ATS matching.
   */
  getResumeParsingPrompt: (resumeText: string): string => {
    return `You are an expert ATS resume checker and recruiter. Analyze this resume text and perform a deep critique.
Resume text:
"${resumeText}"

Perform the following:
1. Extract a clean list of technical and soft skills (max 15 skills).
2. Write a brief 2-3 sentence professional summary of experience.
3. Calculate an ATS match score (0-100) based on industry standards.
4. Generate a concise resume strength report.
5. Identify common industry skills that are missing based on their profile.
6. List 3 key suggested improvements.
7. Extract key projects (up to 3) from the resume and generate exactly 3 viva questions per skill tier (Beginner, Intermediate, Advanced) for each project. Focus on architecture, technology choices, deployment, and security.

Format your response strictly in JSON:
{
  "skills": ["Skill1", "Skill2", ...],
  "experienceSummary": "summary here",
  "atsScore": 85,
  "strengthReport": "strength analysis summary",
  "missingSkills": ["MissingSkill1", ...],
  "suggestedImprovements": ["Improvement1", "Improvement2", "Improvement3"],
  "projects": [
    {
      "projectName": "Project Name",
      "technologies": ["Tech1", "Tech2"],
      "description": "Short description of what the project does",
      "vivaQuestions": {
        "Beginner": ["Question 1", "Question 2", "Question 3"],
        "Intermediate": ["Question 1", "Question 2", "Question 3"],
        "Advanced": ["Question 1", "Question 2", "Question 3"]
      }
    }
  ]
}
Return ONLY valid JSON.`;
  },

  /**
   * Generates the prompt to adjust the next question dynamically.
   */
  getAdjustNextQuestionPrompt: (
    currentQuestionText: string,
    candidateAnswer: string,
    score: number,
    isHardAdjustment: boolean
  ): string => {
    if (isHardAdjustment) {
      return `The candidate gave an excellent response (score ${score}/100) to this interview question:
"${currentQuestionText}"
Candidate Answer: "${candidateAnswer}"

Create a deeper, highly advanced follow-up question on this topic that tests their senior-level expertise. Ask about edge cases, architectural tradeoffs, failure modes, or concurrency limits. Keep the question text short (1-2 sentences). Return ONLY the raw question text. Do not wrap in quotes or JSON.`;
    } else {
      return `The candidate gave a weak response (score ${score}/100) to this interview question:
"${currentQuestionText}"
Candidate Answer: "${candidateAnswer}"

Create a follow-up question that asks them to clarify or elaborate on what was missing from their answer, but keep it in context of their interview. Gently challenge their understanding of the missing details. Keep the follow-up text short (1-2 sentences). Return ONLY the raw question text. Do not wrap in quotes or JSON.`;
    }
  }
};
