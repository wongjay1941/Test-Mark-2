import React, { useState, useEffect } from 'react';
import {
  DEFAULT_PRACTICAL_SETS,
  SAMPLE_STUDENT_SUBMISSIONS,
} from './data/defaultSets';
import { PracticalSet, StudentSubmission, EvaluationResult } from './types';
import { PracticalSetsEditor } from './components/PracticalSetsEditor';
import { SubmissionUploader } from './components/SubmissionUploader';
import { ResultsMatrix } from './components/ResultsMatrix';
import { GoogleSheetsExportModal } from './components/GoogleSheetsExportModal';
import { CodeViewerModal } from './components/CodeViewerModal';
import {
  BookOpen,
  FileCode,
  Award,
  FileSpreadsheet,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export default function App() {
  const [sets, setSets] = useState<PracticalSet[]>(DEFAULT_PRACTICAL_SETS);
  const [submissions, setSubmissions] = useState<StudentSubmission[]>(SAMPLE_STUDENT_SUBMISSIONS);
  const [evaluations, setEvaluations] = useState<EvaluationResult[]>([]);
  const [activeView, setActiveView] = useState<'upload' | 'schemes' | 'results'>('upload');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationProgress, setEvaluationProgress] = useState({ current: 0, total: 0, currentName: '' });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedSubmissionForCode, setSelectedSubmissionForCode] = useState<StudentSubmission | null>(null);

  // Sync evaluations array from submissions when submissions are updated
  useEffect(() => {
    const existingEvals = submissions
      .filter((s) => s.evaluationResult)
      .map((s) => s.evaluationResult as EvaluationResult);
    setEvaluations(existingEvals);
  }, [submissions]);

  const handleUpdateSet = (updated: PracticalSet) => {
    setSets((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleRunAllEvaluations = async () => {
    const pendingSubs = submissions.filter((s) => !s.evaluationResult || s.status === 'pending');
    if (pendingSubs.length === 0) {
      alert('All uploaded student submissions have already been evaluated! Click "Reset Marks" if you wish to re-grade.');
      return;
    }

    setIsEvaluating(true);
    setEvaluationProgress({ current: 0, total: pendingSubs.length, currentName: '' });

    const updatedSubmissions = [...submissions];

    for (let i = 0; i < pendingSubs.length; i++) {
      const targetSub = pendingSubs[i];
      setEvaluationProgress({
        current: i + 1,
        total: pendingSubs.length,
        currentName: `${targetSub.studentName} (${targetSub.setId})`,
      });

      // Find matched practical set
      const matchedSet = sets.find((s) => s.id === targetSub.setId) || sets[0];

      try {
        const response = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentFile: {
              filename: targetSub.filename,
              content: targetSub.content,
              studentId: targetSub.studentId,
              studentName: targetSub.studentName,
              classId: targetSub.classId,
              setId: targetSub.setId,
            },
            practicalSet: matchedSet,
          }),
        });

        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }

        const evalResult: EvaluationResult = await response.json();

        // Update target submission
        const subIndex = updatedSubmissions.findIndex((s) => s.id === targetSub.id);
        if (subIndex !== -1) {
          updatedSubmissions[subIndex] = {
            ...updatedSubmissions[subIndex],
            status: 'completed',
            evaluationResult: evalResult,
          };
          setSubmissions([...updatedSubmissions]);
        }
      } catch (err: any) {
        console.error(`Error evaluating ${targetSub.filename}:`, err);
        const subIndex = updatedSubmissions.findIndex((s) => s.id === targetSub.id);
        if (subIndex !== -1) {
          updatedSubmissions[subIndex] = {
            ...updatedSubmissions[subIndex],
            status: 'error',
            errorMessage: err.message,
          };
          setSubmissions([...updatedSubmissions]);
        }
      }
    }

    setIsEvaluating(false);
    setActiveView('results');
  };

  const handleReevaluateAll = () => {
    if (confirm('Reset and re-grade all submissions against the current practical sets and rubrics?')) {
      const reset = submissions.map((s) => ({
        ...s,
        status: 'pending' as const,
        evaluationResult: undefined,
      }));
      setSubmissions(reset);
      setEvaluations([]);
    }
  };

  const handleUpdateEvaluation = (updated: EvaluationResult) => {
    setEvaluations((prev) =>
      prev.map((e) => (e.studentId === updated.studentId ? updated : e))
    );
    setSubmissions((prev) =>
      prev.map((s) =>
        s.studentId === updated.studentId ? { ...s, evaluationResult: updated } : s
      )
    );
  };

  const completedCount = submissions.filter((s) => s.evaluationResult).length;
  const inQueueCount = submissions.length - completedCount;
  const progressPercent = submissions.length > 0 ? Math.round((completedCount / submissions.length) * 100) : 0;
  const avgScore = completedCount > 0
    ? Math.round(evaluations.reduce((acc, ev) => acc + ev.percentage, 0) / evaluations.length)
    : 0;

  // Counts per set
  const setCounts = sets.map((s) => ({
    id: s.id,
    name: s.name,
    count: submissions.filter((sub) => sub.setId === s.id).length,
    evaluated: submissions.filter((sub) => sub.setId === s.id && sub.evaluationResult).length,
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Application Header - Bento Aesthetic */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xs">
            <span className="text-white font-bold text-lg tracking-tight">C++</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800">
                AutoMark Engine <span className="text-slate-400 font-normal text-xs sm:text-sm">v2.4</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 font-mono px-2.5 py-0.5 rounded-full border border-slate-200">
                4 Sets • 4 Classes
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Bento-Grid Automated C++ Practical Rubric Evaluation & Spreadsheet Export
            </p>
          </div>
        </div>

        {/* Top Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            id="header-btn-export"
            onClick={() => setIsExportModalOpen(true)}
            disabled={evaluations.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs sm:text-sm font-medium hover:bg-slate-50 text-slate-700 transition-colors shadow-xs disabled:opacity-40"
          >
            <FileSpreadsheet className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export</span> Spreadsheet
            {evaluations.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-emerald-100 text-emerald-700 font-bold rounded-full text-[10px]">
                {evaluations.length}
              </span>
            )}
          </button>

          <button
            id="header-btn-run-eval"
            onClick={handleRunAllEvaluations}
            disabled={isEvaluating || submissions.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-full text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>
              {isEvaluating
                ? `Evaluating (${evaluationProgress.current}/${evaluationProgress.total})...`
                : inQueueCount > 0
                ? `Run Marking (${inQueueCount})`
                : `All Marked (${completedCount})`}
            </span>
          </button>

          <div
            className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-300"
            title="Faculty Grader"
          >
            CS
          </div>
        </div>
      </header>

      {/* Live Evaluation Progress Banner if active */}
      {isEvaluating && (
        <div className="bg-indigo-900 text-white px-6 py-3 shadow-md border-b border-indigo-800">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
              <span>
                Evaluating submission <strong>{evaluationProgress.current}</strong> of{' '}
                <strong>{evaluationProgress.total}</strong>: <em>{evaluationProgress.currentName}</em>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-44 sm:w-64 bg-indigo-950 rounded-full h-2 overflow-hidden border border-indigo-700">
                <div
                  className="bg-emerald-400 h-full transition-all duration-300"
                  style={{
                    width: `${Math.round(
                      (evaluationProgress.current / (evaluationProgress.total || 1)) * 100
                    )}%`,
                  }}
                />
              </div>
              <span className="font-mono text-[11px] text-indigo-200">
                {Math.round((evaluationProgress.current / (evaluationProgress.total || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* BENTO GRID HERO DASHBOARD (3-Column Layout) */}
        <div className="grid grid-cols-12 gap-4">
          {/* Bento Card 1: Input Sources (col-span-12 md:col-span-4) */}
          <div className="col-span-12 md:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                  Input Sources
                </h2>
                <span className="text-[11px] text-slate-500 font-medium">4 Practical Sets</span>
              </div>
              <div className="space-y-2">
                {setCounts.map((sc, idx) => (
                  <div
                    key={sc.id}
                    onClick={() => setActiveView('schemes')}
                    className="p-2.5 bg-slate-50 hover:bg-indigo-50/40 rounded-xl border border-slate-100 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {sc.id}: {sc.name.split(' - ')[0]}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Scheme_{String.fromCharCode(65 + idx)}.cpp • {sc.count} files
                      </div>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      {sc.evaluated}/{sc.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveView('schemes')}
              className="w-full py-2.5 mt-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Review 4 Question Papers & Rubrics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Bento Card 2: Processing Status (col-span-12 md:col-span-5) */}
          <div className="col-span-12 md:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  Processing Status
                </h2>
                <span
                  className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                    progressPercent === 100
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-indigo-50 text-indigo-700'
                  }`}
                >
                  {progressPercent}% Complete
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-2 mt-2">
                <div className="flex items-center gap-3">
                  <div className="text-xs font-mono text-slate-400 w-24">
                    Batch 04/04
                  </div>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="text-xs font-bold text-slate-700">
                    {isEvaluating ? 'Evaluating...' : progressPercent === 100 ? 'Finished' : 'Ready'}
                  </div>
                </div>
              </div>

              {/* 4-Stat Bento Metric Grid */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mt-6">
                <div className="text-center p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="text-lg sm:text-xl font-bold text-slate-800">{submissions.length}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Found</div>
                </div>
                <div className="text-center p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="text-lg sm:text-xl font-bold text-emerald-600">{completedCount}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Marked</div>
                </div>
                <div className="text-center p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="text-lg sm:text-xl font-bold text-amber-500">{inQueueCount}</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">In Queue</div>
                </div>
                <div className="text-center p-2 rounded-xl bg-slate-50/70 border border-slate-100">
                  <div className="text-lg sm:text-xl font-bold text-indigo-600">{avgScore}%</div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider">Avg Score</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
              <span>Automatic C++ Rubric Scoring</span>
              {completedCount > 0 && (
                <button
                  onClick={handleReevaluateAll}
                  className="text-slate-400 hover:text-slate-700 flex items-center gap-1 text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset Marks
                </button>
              )}
            </div>
          </div>

          {/* Bento Card 3: Google Spreadsheet Sync Card (col-span-12 md:col-span-3) */}
          <div className="col-span-12 md:col-span-3 bg-indigo-900 rounded-2xl p-5 shadow-sm text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-300">
                  Google Spreadsheet
                </h2>
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-sm font-semibold truncate text-white">
                  CPP_Results_Final.xlsx
                </div>
              </div>

              <div className="text-xs text-indigo-200/80 space-y-1">
                <div>Tab Layout: Master + 4 Sets</div>
                <div className="text-[11px] text-indigo-300/60">
                  Direct API & 1-Click Clipboard TSV
                </div>
              </div>

              {/* Glowing bar */}
              <div className="mt-4 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)] transition-all"
                  style={{ width: evaluations.length > 0 ? '100%' : '20%' }}
                />
              </div>
            </div>

            <button
              onClick={() => setIsExportModalOpen(true)}
              className="w-full mt-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export All 4 Sets</span>
            </button>
          </div>
        </div>

        {/* BENTO NAVIGATION TABS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
          <nav className="flex flex-wrap gap-1">
            <button
              id="nav-tab-upload"
              onClick={() => setActiveView('upload')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
                activeView === 'upload'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Student Submissions</span>
              <span
                className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                  activeView === 'upload'
                    ? 'bg-indigo-800 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {submissions.length}
              </span>
            </button>

            <button
              id="nav-tab-schemes"
              onClick={() => setActiveView('schemes')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
                activeView === 'schemes'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Practical Sets & Schemes</span>
              <span
                className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                  activeView === 'schemes'
                    ? 'bg-indigo-800 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                4
              </span>
            </button>

            <button
              id="nav-tab-results"
              onClick={() => setActiveView('results')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
                activeView === 'results'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Marking Results & Comments</span>
              <span
                className={`px-2 py-0.2 rounded-full text-[10px] font-bold ${
                  activeView === 'results'
                    ? 'bg-indigo-800 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {evaluations.length}
              </span>
            </button>
          </nav>

          <div className="flex items-center gap-3 px-3 text-xs text-slate-500">
            <span className="hidden sm:inline">
              Marked: <strong className="text-slate-800 font-semibold">{completedCount}</strong> of {submissions.length}
            </span>
          </div>
        </div>

        {/* ACTIVE VIEW SECTIONS */}
        {/* VIEW 1: STUDENT SUBMISSIONS UPLOADER & TABLE */}
        {activeView === 'upload' && (
          <SubmissionUploader
            submissions={submissions}
            sets={sets}
            onSubmissionsChange={setSubmissions}
            onSelectSubmissionToView={(sub) => setSelectedSubmissionForCode(sub)}
          />
        )}

        {/* VIEW 2: PRACTICAL SETS, QUESTION PAPERS & MARKING SCHEMES */}
        {activeView === 'schemes' && (
          <PracticalSetsEditor sets={sets} onUpdateSet={handleUpdateSet} />
        )}

        {/* VIEW 3: RESULTS MATRIX, RUBRICS & STUDENT COMMENTS */}
        {activeView === 'results' && (
          <ResultsMatrix
            evaluations={evaluations}
            sets={sets}
            submissions={submissions}
            onUpdateEvaluation={handleUpdateEvaluation}
            onSelectSubmissionToView={(sub) => setSelectedSubmissionForCode(sub)}
            onOpenExportModal={() => setIsExportModalOpen(true)}
          />
        )}
      </main>

      {/* Code Viewer Modal */}
      <CodeViewerModal
        submission={selectedSubmissionForCode}
        sets={sets}
        onClose={() => setSelectedSubmissionForCode(null)}
      />

      {/* Google Sheets Export Modal */}
      <GoogleSheetsExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        evaluations={evaluations}
        sets={sets}
      />

      {/* Bento-Themed Footer */}
      <footer className="px-4 sm:px-8 py-3 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-2 mt-auto">
        <div className="flex items-center gap-4 text-[11px] text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Engine Online</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>Sync Active</span>
          </div>
        </div>
        <div className="text-[11px] text-slate-400">
          © 2024 Education Systems Inc. • C++ Practical Assessment Evaluation Suite (4 Sets & 4 Classes)
        </div>
      </footer>
    </div>
  );
}

