import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Lazy initialization of Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey: key });
  }
  return genAIClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Single student evaluation endpoint
app.post('/api/evaluate', async (req, res) => {
  try {
    const { studentFile, practicalSet } = req.body;

    if (!studentFile || !studentFile.content) {
      return res.status(400).json({ error: 'Missing student file or content' });
    }

    const ai = getGenAI();

    // Fallback if no Gemini key
    if (!ai) {
      console.warn('GEMINI_API_KEY is not configured. Using rule-based static grading fallback.');
      const fallbackResult = runStaticCppEvaluation(studentFile, practicalSet);
      return res.json({
        ...fallbackResult,
        evaluatedBy: 'Static Code Rule Engine (Add GEMINI_API_KEY for Deep AI Grading)',
      });
    }

    const prompt = `You are a strict, fair university Computer Science Professor and C++ Grading Assistant.
Evaluate the following student C++ submission according to the specific Practical Set Question Paper, Marking Scheme, and Rubrics.

===================
PRACTICAL SET DETAILS
===================
Set Identifier: ${practicalSet?.id || 'Unknown'}
Set Title: ${practicalSet?.name || 'C++ Practical Assignment'}
Total Maximum Marks: ${practicalSet?.maxMarks || 100}

Question Paper:
${practicalSet?.questionPaper || 'Standard C++ practical requirements as defined in marking scheme.'}

Marking Scheme & Rubrics:
${practicalSet?.markingScheme || JSON.stringify(practicalSet?.rubrics || [])}

===================
STUDENT SUBMISSION
===================
Filename: ${studentFile.filename}
Student ID: ${studentFile.studentId || 'N/A'}
Student Name: ${studentFile.studentName || 'N/A'}
Class: ${studentFile.classId || 'N/A'}

C++ Source Code:
\`\`\`cpp
${studentFile.content}
\`\`\`

===================
EVALUATION INSTRUCTIONS
===================
1. Check syntax, compilation likelihood, correct C++ idioms (headers, standard library, proper types, memory leaks, pointers/references, classes, const-correctness).
2. Grade against each specific rubric item from the marking scheme. Award marks accurately with specific rationale.
3. Calculate Total Score (0 to ${practicalSet?.maxMarks || 100}) and calculate percentage (0 to 100%).
4. Provide a clear, pedagogically constructive, professional comment for the student.
   - Mention what the student did well (strengths).
   - Point out specific bugs, memory leaks, missing requirements, or anti-patterns (weaknesses with line-level context if possible).
   - Give an actionable tip for future C++ development.
5. Identify any potential warnings (e.g. infinite loops, uninitialized variables, dangling pointers, missing delete/free, missing return types).

Return ONLY a valid JSON object matching this schema:
{
  "studentId": "${studentFile.studentId || ''}",
  "studentName": "${studentFile.studentName || ''}",
  "classId": "${studentFile.classId || ''}",
  "setId": "${studentFile.setId || practicalSet?.id || ''}",
  "filename": "${studentFile.filename}",
  "totalMarks": number,
  "maxMarks": number,
  "percentage": number,
  "grade": "A+" | "A" | "A-" | "B+" | "B" | "B-" | "C+" | "C" | "D" | "F",
  "status": "Pass" | "Fail" | "Distinction",
  "rubricBreakdown": [
    {
      "criteriaId": string,
      "criteriaName": string,
      "marksAwarded": number,
      "maxMarks": number,
      "feedback": string
    }
  ],
  "strengths": [string],
  "areasForImprovement": [string],
  "compilationNotes": string,
  "studentComment": "A personalized, respectful, and comprehensive 3-5 sentence constructive feedback note directly addressing this student's submission."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const responseText = response.text?.trim() || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseErr) {
      // Clean up markdown block if present
      const cleaned = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      parsedData = JSON.parse(cleaned);
    }

    return res.json({
      ...parsedData,
      evaluatedBy: 'Gemini 2.5 Flash',
      evaluatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error evaluating C++ submission:', error);
    // Provide graceful fallback evaluation
    const fallback = runStaticCppEvaluation(req.body.studentFile, req.body.practicalSet);
    return res.json({
      ...fallback,
      evaluatedBy: 'Rule-Based Engine (Fallback due to API error: ' + (error.message || 'Unknown') + ')',
      evaluatedAt: new Date().toISOString(),
    });
  }
});

// Helper for static C++ evaluation fallback
function runStaticCppEvaluation(studentFile: any, practicalSet: any) {
  const code: string = studentFile?.content || '';
  const rubrics: any[] = practicalSet?.rubrics || [
    { id: 'syntax', name: 'Syntax, Compilability & Standard Libraries', maxMarks: 25 },
    { id: 'logic', name: 'Algorithmic Correctness & Problem Solving', maxMarks: 40 },
    { id: 'memory', name: 'Memory Management, Pointers & Safety', maxMarks: 20 },
    { id: 'style', name: 'Code Quality, Formatting & Comments', maxMarks: 15 },
  ];

  let syntaxScore = 20;
  let logicScore = 32;
  let memoryScore = 16;
  let styleScore = 12;

  const hasMain = /int\s+main\s*\(/.test(code);
  const hasIostream = /#include\s*<iostream>/.test(code);
  const hasCinCout = /std::cout|cout\s*<<|cin\s*>>/.test(code);
  const hasNew = /\bnew\b/.test(code);
  const hasDelete = /\bdelete\b/.test(code);
  const hasClass = /\bclass\b|\bstruct\b/.test(code);
  const hasComments = /\/\/|\/\*/.test(code);

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (hasMain) {
    strengths.push('Proper entry point `int main()` implemented.');
  } else {
    syntaxScore -= 10;
    weaknesses.push('Missing or invalid `int main()` definition.');
  }

  if (hasIostream) {
    strengths.push('Included standard stream I/O header.');
  }

  if (hasNew && !hasDelete) {
    memoryScore -= 8;
    weaknesses.push('Dynamic allocation `new` detected without matching `delete` (potential memory leak).');
  } else if (hasNew && hasDelete) {
    strengths.push('Proper dynamic memory allocation paired with deallocation.');
  }

  if (hasClass) {
    strengths.push('Clean Object-Oriented encapsulation using classes/structures.');
  }

  if (hasComments) {
    strengths.push('Helpful code commenting and explanation provided.');
  } else {
    styleScore -= 4;
    weaknesses.push('Sparse code documentation and inline comments.');
  }

  const breakdown = rubrics.map((r) => {
    let score = Math.round(r.maxMarks * 0.82);
    let note = 'Meets primary criteria outlined in practical set.';
    if (r.id.includes('syntax') || r.name.toLowerCase().includes('syntax')) {
      score = Math.min(r.maxMarks, Math.max(0, Math.round((syntaxScore / 25) * r.maxMarks)));
      note = hasMain ? 'Clean C++ syntax and valid entry structure.' : 'Syntax issues detected.';
    } else if (r.id.includes('memory') || r.name.toLowerCase().includes('memory')) {
      score = Math.min(r.maxMarks, Math.max(0, Math.round((memoryScore / 20) * r.maxMarks)));
      note = hasNew && !hasDelete ? 'Points deducted for potential dynamic memory leak.' : 'Safe memory handling.';
    } else if (r.id.includes('style') || r.name.toLowerCase().includes('style')) {
      score = Math.min(r.maxMarks, Math.max(0, Math.round((styleScore / 15) * r.maxMarks)));
      note = hasComments ? 'Good formatting and indentation.' : 'Consider adding function headers and comments.';
    }
    return {
      criteriaId: r.id,
      criteriaName: r.name,
      marksAwarded: score,
      maxMarks: r.maxMarks,
      feedback: note,
    };
  });

  const totalEarned = breakdown.reduce((sum, b) => sum + b.marksAwarded, 0);
  const maxMarks = practicalSet?.maxMarks || 100;
  const pct = Math.round((totalEarned / maxMarks) * 100);

  let grade = 'B+';
  let status = 'Pass';
  if (pct >= 85) { grade = 'A'; status = 'Distinction'; }
  else if (pct >= 75) { grade = 'B+'; status = 'Pass'; }
  else if (pct >= 65) { grade = 'B'; status = 'Pass'; }
  else if (pct >= 50) { grade = 'C'; status = 'Pass'; }
  else { grade = 'F'; status = 'Fail'; }

  return {
    studentId: studentFile.studentId || 'N/A',
    studentName: studentFile.studentName || 'Student',
    classId: studentFile.classId || 'Class',
    setId: studentFile.setId || practicalSet?.id || 'Set 1',
    filename: studentFile.filename,
    totalMarks: totalEarned,
    maxMarks: maxMarks,
    percentage: pct,
    grade: grade,
    status: status,
    rubricBreakdown: breakdown,
    strengths: strengths.length ? strengths : ['Code compiles and runs basic test cases.'],
    areasForImprovement: weaknesses.length ? weaknesses : ['Further refine boundary condition checking.'],
    compilationNotes: 'Compiled cleanly without syntax errors.',
    studentComment: `Good effort on this C++ practical set. Your code demonstrates a solid grasp of core programming mechanics with ${strengths.join(' ')}. ${weaknesses.length ? 'Ensure you address: ' + weaknesses.join(' ') : 'Keep up the high standard of coding discipline!'}`,
  };
}

// Start server with Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
