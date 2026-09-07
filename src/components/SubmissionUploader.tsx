import React, { useState, useRef } from 'react';
import { StudentSubmission, PracticalSet } from '../types';
import { parseFilename } from '../utils/fileParser';
import { SAMPLE_STUDENT_SUBMISSIONS } from '../data/defaultSets';
import {
  UploadCloud,
  FileCode,
  Trash2,
  Sparkles,
  Layers,
  GraduationCap,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';

interface SubmissionUploaderProps {
  submissions: StudentSubmission[];
  sets: PracticalSet[];
  onSubmissionsChange: (newSubmissions: StudentSubmission[]) => void;
  onSelectSubmissionToView: (submission: StudentSubmission) => void;
}

export const SubmissionUploader: React.FC<SubmissionUploaderProps> = ({
  submissions,
  sets,
  onSubmissionsChange,
  onSelectSubmissionToView,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterSet, setFilterSet] = useState<string>('all');
  const [showManualPasteModal, setShowManualPasteModal] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [manualFilename, setManualFilename] = useState('Alex Tan_Set 1.cpp');

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newEntries: StudentSubmission[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.name.toLowerCase().endsWith('.cpp') && !file.name.toLowerCase().endsWith('.cc')) {
        continue;
      }

      const content = await file.text();
      const parsed = parseFilename(file.name);

      newEntries.push({
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        filename: file.name,
        content,
        fileSize: file.size,
        classId: parsed.classId,
        setId: parsed.setId,
        studentId: parsed.studentId,
        studentName: parsed.studentName,
        status: 'pending',
      });
    }

    if (newEntries.length > 0) {
      onSubmissionsChange([...submissions, ...newEntries]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleLoadSamples = () => {
    // Avoid duplicates
    const existingNames = new Set(submissions.map((s) => s.filename));
    const samplesToAdd = SAMPLE_STUDENT_SUBMISSIONS.filter((s) => !existingNames.has(s.filename));
    if (samplesToAdd.length > 0) {
      onSubmissionsChange([...submissions, ...samplesToAdd]);
    }
  };

  const handleUpdateSubmissionField = (
    id: string,
    field: 'setId' | 'classId' | 'studentId' | 'studentName',
    value: string
  ) => {
    const updated = submissions.map((sub) => {
      if (sub.id === id) {
        return { ...sub, [field]: value };
      }
      return sub;
    });
    onSubmissionsChange(updated);
  };

  const handleDeleteSubmission = (id: string) => {
    onSubmissionsChange(submissions.filter((s) => s.id !== id));
  };

  const handleClearAll = () => {
    if (confirm('Clear all uploaded student submissions?')) {
      onSubmissionsChange([]);
    }
  };

  const handleSaveManual = () => {
    if (!manualCode.trim()) return;
    const parsed = parseFilename(manualFilename);
    const newEntry: StudentSubmission = {
      id: `sub_${Date.now()}`,
      filename: manualFilename || 'custom_submission.cpp',
      content: manualCode,
      fileSize: manualCode.length,
      classId: parsed.classId,
      setId: parsed.setId,
      studentId: parsed.studentId,
      studentName: parsed.studentName,
      status: 'pending',
    };
    onSubmissionsChange([...submissions, newEntry]);
    setManualCode('');
    setShowManualPasteModal(false);
  };

  // Filtered submissions
  const filteredSubmissions = submissions.filter((sub) => {
    if (filterClass !== 'all' && sub.classId !== filterClass) return false;
    if (filterSet !== 'all' && sub.setId !== filterSet) return false;
    return true;
  });

  return (
    <div id="submission-uploader" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Upload Zone & Actions */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 block mb-1">
              Submission Intake
            </span>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCode className="w-5 h-5 text-indigo-600" />
              Upload Student C++ Answers (.cpp)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Target filename format: <span className="font-mono font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/60">&lt;name&gt;_&lt;set&gt;.cpp</span>. Student name and assigned practical set are auto-detected.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-load-sample-cpp"
              onClick={handleLoadSamples}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/80 hover:bg-indigo-100 rounded-full transition shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Sample &lt;name&gt;_&lt;set&gt; Files
            </button>
            <button
              id="btn-manual-paste"
              onClick={() => setShowManualPasteModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-full transition shadow-2xs"
            >
              <FileCode className="w-3.5 h-3.5" />
              Paste Single Code
            </button>
            {submissions.length > 0 && (
              <button
                id="btn-clear-all"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 rounded-full transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All ({submissions.length})
              </button>
            )}
          </div>
        </div>

        {/* Drag & Drop Area */}
        <div
          id="dropzone-cpp-files"
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-600 bg-indigo-50/60'
              : 'border-slate-300 hover:border-indigo-400 bg-white hover:bg-slate-50/60'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".cpp,.cc,.cxx,.h,.hpp"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-700 hover:underline">
                Click to browse or drop your student &lt;name&gt;_&lt;set&gt;.cpp files here
              </span>
              <p className="text-xs text-slate-500 mt-0.5">
                Examples: <span className="font-mono text-slate-700">Alex Tan_Set 1.cpp</span>, <span className="font-mono text-slate-700">Daniel Lee_Set 2.cpp</span>, <span className="font-mono text-slate-700">Farhan Ahmad_Set 3.cpp</span>, <span className="font-mono text-slate-700">Grace Ong_Set 4.cpp</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submissions List Header & Filters */}
      <div className="px-6 py-3 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-slate-800">
            Uploaded Files ({filteredSubmissions.length} of {submissions.length})
          </span>

          {/* Class Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Class:</span>
            <select
              id="filter-class"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            >
              <option value="all">All Classes (4)</option>
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
              <option value="Class 4">Class 4</option>
            </select>
          </div>

          {/* Set Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Practical Set:</span>
            <select
              id="filter-set"
              value={filterSet}
              onChange={(e) => setFilterSet(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 text-xs focus:outline-hidden focus:ring-1 focus:ring-indigo-600 shadow-2xs"
            >
              <option value="all">All Sets (4)</option>
              <option value="Set 1">Set 1</option>
              <option value="Set 2">Set 2</option>
              <option value="Set 3">Set 3</option>
              <option value="Set 4">Set 4</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            Auto-parsed from filenames
          </span>
        </div>
      </div>

      {/* Submissions Table */}
      {submissions.length === 0 ? (
        <div className="p-12 text-center text-slate-500">
          <FileCode className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-medium text-slate-700">No student .cpp files uploaded yet</p>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Drop your students' source code files above, or click <strong>Load Sample 4-Class Submissions</strong> to test with our verified C++ assignments.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
              <tr>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5 w-32">Assigned Set</th>
                <th className="p-3.5 w-32">Class</th>
                <th className="p-3.5">Filename (&lt;name&gt;_&lt;set&gt;.cpp)</th>
                <th className="p-3.5 w-32">Evaluation</th>
                <th className="p-3.5 w-20 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50/70 transition">
                  <td className="p-3.5">
                    <input
                      type="text"
                      value={sub.studentName}
                      onChange={(e) => handleUpdateSubmissionField(sub.id, 'studentName', e.target.value)}
                      className="w-full px-2.5 py-1 font-semibold border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-600 bg-white shadow-2xs"
                      placeholder="Student Name"
                    />
                  </td>
                  <td className="p-3.5">
                    <select
                      value={sub.setId}
                      onChange={(e) => handleUpdateSubmissionField(sub.id, 'setId', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 font-semibold text-indigo-700 text-xs focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                    >
                      {sets.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.id}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={sub.classId}
                      onChange={(e) => handleUpdateSubmissionField(sub.id, 'classId', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 text-xs focus:ring-1 focus:ring-indigo-600 shadow-2xs"
                    >
                      <option value="Class 1">Class 1</option>
                      <option value="Class 2">Class 2</option>
                      <option value="Class 3">Class 3</option>
                      <option value="Class 4">Class 4</option>
                    </select>
                  </td>
                  <td className="p-3.5">
                    <div className="font-mono text-slate-900 font-medium truncate max-w-xs" title={sub.filename}>
                      {sub.filename}
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {(sub.fileSize / 1024).toFixed(1)} KB
                    </span>
                  </td>
                  <td className="p-3.5">
                    {sub.evaluationResult ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full font-medium text-[11px] border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        {sub.evaluationResult.totalMarks}/{sub.evaluationResult.maxMarks} ({sub.evaluationResult.percentage}%)
                      </span>
                    ) : sub.status === 'evaluating' ? (
                      <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full font-medium text-[11px] border border-amber-200 animate-pulse">
                        Evaluating...
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Ready</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => onSelectSubmissionToView(sub)}
                        title="View C++ Code"
                        className="p-1.5 text-slate-500 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubmission(sub.id)}
                        title="Remove"
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Manual Code Paste Modal */}
      {showManualPasteModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-slate-900 text-sm">Add Single Student C++ Submission</h3>
              <button
                onClick={() => setShowManualPasteModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Virtual Filename (identifies Set & Class):
                </label>
                <input
                  type="text"
                  value={manualFilename}
                  onChange={(e) => setManualFilename(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-600"
                  placeholder="Class1_Set1_B220199_Student.cpp"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">C++ Source Code:</label>
                <textarea
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  rows={10}
                  className="w-full font-mono text-xs p-3 border border-slate-200 rounded-xl bg-slate-900 text-slate-200 focus:ring-2 focus:ring-indigo-600"
                  placeholder="#include <iostream>..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowManualPasteModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveManual}
                  disabled={!manualCode.trim()}
                  className="px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50"
                >
                  Add Submission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
