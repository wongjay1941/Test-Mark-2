export interface RubricCriterion {
  id: string;
  name: string;
  maxMarks: number;
  description: string;
}

export interface PracticalSet {
  id: string; // e.g. 'Set 1', 'Set 2', 'Set 3', 'Set 4'
  name: string;
  topic: string;
  targetClass: string; // e.g. 'Class 1' or 'All'
  maxMarks: number;
  questionPaper: string;
  markingScheme: string;
  rubrics: RubricCriterion[];
}

export interface StudentSubmission {
  id: string;
  filename: string;
  content: string;
  fileSize: number;
  classId: string;
  setId: string;
  studentId: string;
  studentName: string;
  status: 'pending' | 'evaluating' | 'completed' | 'error';
  evaluationResult?: EvaluationResult;
  errorMessage?: string;
}

export interface RubricBreakdownItem {
  criteriaId: string;
  criteriaName: string;
  marksAwarded: number;
  maxMarks: number;
  feedback: string;
}

export interface EvaluationResult {
  studentId: string;
  studentName: string;
  classId: string;
  setId: string;
  filename: string;
  totalMarks: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  status: 'Pass' | 'Fail' | 'Distinction';
  rubricBreakdown: RubricBreakdownItem[];
  strengths: string[];
  areasForImprovement: string[];
  compilationNotes: string;
  studentComment: string;
  evaluatedBy?: string;
  evaluatedAt?: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  color: string;
}

export interface GoogleSheetsExportConfig {
  spreadsheetTitle: string;
  includeSummarySheet: boolean;
  includePerSetSheets: boolean;
  includeCommentColumn: boolean;
}
