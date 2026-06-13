import { Request, Response } from 'express';
import { executeCode } from '../services/codeSandbox';
import { env } from '../config/env';
import OpenAI from 'openai';

let openai: OpenAI | null = null;
if (env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
}

export const runCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { language, code, testCases } = req.body;

    if (!language || !code || !testCases || !Array.isArray(testCases)) {
      res.status(400).json({ message: 'Please provide language, code, and testCases' });
      return;
    }

    const execution = await executeCode(language, code, testCases);
    res.json(execution);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const reviewCode = async (req: Request, res: Response): Promise<void> => {
  try {
    const { language, code, questionText } = req.body;

    if (!language || !code) {
      res.status(400).json({ message: 'Please provide language and code' });
      return;
    }

    if (!openai) {
      // Mock code review
      res.json({
        review: `### Simulated AI Code Review (${language})
Your code structure is clean and syntactically correct.
- **Time Complexity:** O(N) where N is the length of the input.
- **Space Complexity:** O(N) due to variables allocated for lookup structures.
- **Optimization Tip:** You could optimize space complexity to O(1) if you utilize a rolling pointer approach instead of allocating additional memory tables.`,
      });
      return;
    }

    const prompt = `You are a Senior Staff Engineer. Critically review this candidate's code submission.
Question Context: "${questionText || 'Generic algorithmic problem'}"
Language: ${language}
Submitted Code:
\`\`\`${language}
${code}
\`\`\`

Provide a comprehensive code review covering:
1. Time & Space Complexity analysis.
2. Logic flaws or potential edge-case failures.
3. Cleanliness, naming conventions, and best practices.
4. An optimized/refactored version if necessary.

Return the review in Markdown format.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
    });

    res.json({
      review: response.choices[0].message?.content || 'No review returned.',
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
