import React from 'react';
import { StudentSubmission, PracticalSet } from '../types';
import { X, FileCode, CheckCircle, AlertTriangle, Layers, BookOpen } from 'lucide-react';

interface CodeViewerModalProps {
  submission: StudentSubmission | null;
  sets: PracticalSet[];
  onClose: () => void;
}

export const CodeViewerModal: React.FC<CodeViewerModalProps> = ({
  submission,
  sets,
  onClose,
}) => {
  if (!submission) return null;

  const matchedSet = sets.find((s) => s.id === submission.setId);
  const ev = submission.evaluationResult;

  const lines = submission.content.split('\n');

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full h-[85vh] shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">{submission.filename}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60">
                  {submission.setId}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                  {submission.classId}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Student: <strong className="text-slate-800">{submission.studentName}</strong> (ID: {submission.studentId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body: Split view (Code on left, Rubrics/Comments on right if evaluated) */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* C++ Code with Line Numbers */}
          <div className="md:col-span-7 bg-slate-950 text-slate-100 font-mono text-xs overflow-y-auto p-4 flex">
            {/* Line numbers */}
            <div className="select-none text-slate-600 text-right pr-4 border-r border-slate-800 font-mono">
              {lines.map((_, idx) => (
                <div key={idx} className="leading-5">
                  {idx + 1}
                </div>
              ))}
            </div>
            {/* Code lines */}
            <pre className="pl-4 text-slate-200 overflow-x-auto leading-5 w-full whitespace-pre font-mono">
              {submission.content}
            </pre>
          </div>

          {/* Evaluation Details on Right */}
          <div className="md:col-span-5 bg-slate-50/50 p-5 border-l border-slate-200 overflow-y-auto space-y-4 text-xs">
            {ev ? (
              <>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">Evaluation Score</span>
                    <span className="font-mono text-base font-bold text-indigo-600">
                      {ev.totalMarks} / {ev.maxMarks} ({ev.percentage}%)
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-slate-500">
                    <span>Grade Awarded:</span>
                    <span className="font-bold text-emerald-600">{ev.grade} ({ev.status})</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Rubric Breakdown
                  </span>
                  <div className="space-y-2">
                    {ev.rubricBreakdown.map((rb, i) => (
                      <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl">
                        <div className="flex justify-between font-semibold text-slate-800 mb-1">
                          <span>{rb.criteriaName}</span>
                          <span className="font-mono font-bold text-indigo-600">
                            {rb.marksAwarded}/{rb.maxMarks}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed">{rb.feedback}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/70 border border-indigo-200/70 rounded-xl">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 block mb-1">
                    Evaluator Feedback Comment
                  </span>
                  <p className="text-slate-800 italic leading-relaxed">"{ev.studentComment}"</p>
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-slate-500">
                <BookOpen className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                <p className="font-medium text-slate-700">Not Evaluated Yet</p>
                <p className="text-slate-500 text-[11px] mt-1">
                  Click "Run Evaluation for All Submissions" to mark this paper against {matchedSet?.id || 'the allocated set'}.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-100 transition shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
