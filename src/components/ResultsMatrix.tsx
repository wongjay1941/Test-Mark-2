import React, { useState } from 'react';
import { EvaluationResult, PracticalSet, StudentSubmission } from '../types';
import {
  Award,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  Edit2,
  Check,
  Code,
  ThumbsUp,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

interface ResultsMatrixProps {
  evaluations: EvaluationResult[];
  sets: PracticalSet[];
  submissions: StudentSubmission[];
  onUpdateEvaluation: (updated: EvaluationResult) => void;
  onSelectSubmissionToView: (sub: StudentSubmission) => void;
  onOpenExportModal: () => void;
}

export const ResultsMatrix: React.FC<ResultsMatrixProps> = ({
  evaluations,
  sets,
  submissions,
  onUpdateEvaluation,
  onSelectSubmissionToView,
  onOpenExportModal,
}) => {
  const [selectedSet, setSelectedSet] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [expandedFile, setExpandedFile] = useState<string | null>(evaluations[0]?.filename || null);
  const [editingCommentFile, setEditingCommentFile] = useState<string | null>(null);
  const [tempComment, setTempComment] = useState<string>('');

  const filteredEvaluations = evaluations.filter((ev) => {
    if (selectedSet !== 'all' && ev.setId !== selectedSet) return false;
    if (selectedClass !== 'all' && ev.classId !== selectedClass) return false;
    return true;
  });

  // Analytics
  const totalEvaluated = evaluations.length;
  const avgPercentage = totalEvaluated
    ? Math.round(evaluations.reduce((acc, e) => acc + e.percentage, 0) / totalEvaluated)
    : 0;
  const passCount = evaluations.filter((e) => e.percentage >= 50).length;
  const passRate = totalEvaluated ? Math.round((passCount / totalEvaluated) * 100) : 0;
  const distinctionCount = evaluations.filter((e) => e.percentage >= 80).length;

  const handleStartEditComment = (ev: EvaluationResult) => {
    setEditingCommentFile(ev.filename);
    setTempComment(ev.studentComment);
  };

  const handleSaveComment = (ev: EvaluationResult) => {
    onUpdateEvaluation({
      ...ev,
      studentComment: tempComment,
    });
    setEditingCommentFile(null);
  };

  // Set-by-Set performance calculation for the Bento Analytics visualizer
  const setAverages = sets.map((s) => {
    const evalsForSet = evaluations.filter((e) => e.setId === s.id);
    const avg = evalsForSet.length
      ? Math.round(evalsForSet.reduce((acc, e) => acc + e.percentage, 0) / evalsForSet.length)
      : 0;
    return { id: s.id, name: s.name, avg, count: evalsForSet.length };
  });

  return (
    <div id="results-matrix" className="space-y-6">
      {/* Top Bento Stat & Analytics Row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Stat Metric 1 */}
        <div className="col-span-6 sm:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
            Evaluated
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-800">{totalEvaluated}</span>
            <span className="text-xs text-slate-400">students</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Across 4 classes & sets</p>
        </div>

        {/* Stat Metric 2 */}
        <div className="col-span-6 sm:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
            Class Average
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-indigo-600">{avgPercentage}%</span>
            <span className="text-xs text-slate-400">overall</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Mean marks aggregate</p>
        </div>

        {/* Stat Metric 3 */}
        <div className="col-span-6 sm:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
            Pass Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{passRate}%</span>
            <span className="text-xs text-slate-400">≥ 50% threshold</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">{passCount} passed out of {totalEvaluated}</p>
        </div>

        {/* Bento Global Analytics Visualizer Card */}
        <div className="col-span-6 sm:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
              Global Analytics
            </span>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl font-black text-slate-800">{avgPercentage}%</div>
              <div className="text-[10px] leading-tight text-slate-400 uppercase font-semibold">
                Class <br /> Performance
              </div>
            </div>
          </div>

          <div>
            {/* Visualizer Bar Chart */}
            <div className="flex gap-1.5 items-end h-10 w-full pt-1">
              {setAverages.map((sa, idx) => {
                const heightPct = sa.avg > 0 ? Math.max(15, sa.avg) : 10;
                const colors = ['bg-indigo-300', 'bg-indigo-400', 'bg-indigo-600', 'bg-indigo-500'];
                return (
                  <div key={sa.id} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className={`w-full ${colors[idx % colors.length]} rounded-t-sm transition-all duration-500`}
                      style={{ height: `${heightPct}%` }}
                      title={`${sa.id}: ${sa.avg}% average`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-1 text-[8px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Set 1</span>
              <span>Set 2</span>
              <span>Set 3</span>
              <span>Set 4</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Results Table & Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 block mb-1">
              Marking Feed & Matrix
            </span>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              Evaluation Rubrics & Individual Student Feedback
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Detailed marks awarded per rubric criterion alongside the personalized pedagogical comment ready for Google Sheets export.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-export-to-google-sheets"
              onClick={onOpenExportModal}
              disabled={evaluations.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-full shadow-xs transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Spreadsheet
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Filter Set:</span>
              <select
                id="select-matrix-filter-set"
                value={selectedSet}
                onChange={(e) => setSelectedSet(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 text-xs font-medium shadow-2xs"
              >
                <option value="all">All 4 Sets ({evaluations.length})</option>
                {sets.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.id} ({evaluations.filter((e) => e.setId === s.id).length})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-500 font-medium">Filter Class:</span>
              <select
                id="select-matrix-filter-class"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 text-xs font-medium shadow-2xs"
              >
                <option value="all">All 4 Classes</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
              </select>
            </div>
          </div>

          <span className="text-slate-500 font-medium">
            Showing {filteredEvaluations.length} of {evaluations.length} marked submissions
          </span>
        </div>

        {/* Student Cards / Table */}
        {filteredEvaluations.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Award className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-700">No evaluation results yet</p>
            <p className="text-xs text-slate-500 mt-1">
              Upload student .cpp files above and click "Run Marking" to evaluate against the 4 sets.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {filteredEvaluations.map((ev) => {
              const isExpanded = expandedFile === ev.filename;
              const matchedSub = submissions.find(
                (s) => s.filename === ev.filename || (ev.studentId && s.studentId === ev.studentId)
              );

              return (
                <div key={ev.filename} className="p-5 transition hover:bg-slate-50/60">
                  {/* Summary Bar */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex items-start md:items-center gap-3">
                      <button
                        onClick={() =>
                          setExpandedFile(isExpanded ? null : ev.filename)
                        }
                        className="p-1 text-slate-400 hover:text-slate-800 transition"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{ev.studentName}</span>
                          {ev.studentId && (
                            <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                              {ev.studentId}
                            </span>
                          )}
                          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 px-2 py-0.5 rounded-md">
                            {ev.setId}
                          </span>
                          <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                            {ev.classId}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{ev.filename}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end md:self-auto">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-slate-900">
                            {ev.totalMarks} / {ev.maxMarks}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                              ev.percentage >= 80
                                ? 'bg-emerald-100 text-emerald-800'
                                : ev.percentage >= 60
                                ? 'bg-blue-100 text-blue-800'
                                : ev.percentage >= 50
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            Grade {ev.grade} ({ev.percentage}%)
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          Status: <strong className="text-slate-600">{ev.status}</strong>
                        </span>
                      </div>

                      {matchedSub && (
                        <button
                          onClick={() => onSelectSubmissionToView(matchedSub)}
                          title="Inspect C++ Source Code"
                          className="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Code className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Rubric Details & Comments */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                      {/* Rubric Breakdown Grid */}
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                          Rubric Criteria Scores
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {ev.rubricBreakdown?.map((rb, idx) => {
                            const pct = Math.round((rb.marksAwarded / (rb.maxMarks || 1)) * 100);
                            return (
                              <div
                                key={idx}
                                className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex flex-col justify-between"
                              >
                                <div>
                                  <div className="flex items-center justify-between font-semibold text-slate-800 mb-1">
                                    <span className="truncate mr-2" title={rb.criteriaName}>
                                      {rb.criteriaName}
                                    </span>
                                    <span className="font-mono font-bold text-slate-900 whitespace-nowrap">
                                      {rb.marksAwarded} / {rb.maxMarks}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-600 leading-snug">{rb.feedback}</p>
                                </div>
                                <div className="mt-2.5 w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full ${
                                      pct >= 80
                                        ? 'bg-emerald-500'
                                        : pct >= 50
                                        ? 'bg-indigo-500'
                                        : 'bg-red-400'
                                    }`}
                                    style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/70 rounded-xl">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1.5">
                            <ThumbsUp className="w-3.5 h-3.5 text-emerald-700" />
                            Demonstrated Strengths
                          </span>
                          <ul className="space-y-1 text-emerald-800 list-disc list-inside">
                            {ev.strengths?.map((s, idx) => (
                              <li key={idx}>{s}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-3.5 bg-amber-50/70 border border-amber-200/70 rounded-xl">
                          <span className="font-bold text-amber-900 flex items-center gap-1.5 mb-1.5">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                            Areas for Improvement / Deductions
                          </span>
                          <ul className="space-y-1 text-amber-800 list-disc list-inside">
                            {ev.areasForImprovement?.map((w, idx) => (
                              <li key={idx}>{w}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Student Feedback Comment (Bento Feed Style) */}
                      <div className="p-4 border border-indigo-100 rounded-xl bg-indigo-50/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                            AI Evaluator Comment (Google Sheet Export Column)
                          </span>
                          {editingCommentFile !== ev.filename ? (
                            <button
                              onClick={() => handleStartEditComment(ev)}
                              className="inline-flex items-center gap-1 text-[11px] text-indigo-700 hover:text-indigo-900 font-medium"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit Comment
                            </button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setEditingCommentFile(null)}
                                className="text-[11px] text-slate-500 hover:underline"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveComment(ev)}
                                className="inline-flex items-center gap-1 text-[11px] text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1 rounded-full font-medium"
                              >
                                <Check className="w-3 h-3" />
                                Save
                              </button>
                            </div>
                          )}
                        </div>

                        {editingCommentFile === ev.filename ? (
                          <textarea
                            value={tempComment}
                            onChange={(e) => setTempComment(e.target.value)}
                            rows={3}
                            className="w-full text-xs p-3 border border-indigo-200 rounded-xl bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                          />
                        ) : (
                          <p className="text-sm italic text-slate-700 leading-relaxed">
                            "{ev.studentComment}"
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
