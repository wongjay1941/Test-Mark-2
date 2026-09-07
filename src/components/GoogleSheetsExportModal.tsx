import React, { useState } from 'react';
import { EvaluationResult, PracticalSet } from '../types';
import {
  createGoogleSpreadsheet,
  generateGoogleSheetsTSV,
  generateCSV,
} from '../utils/googleSheetsExport';
import {
  X,
  FileSpreadsheet,
  Copy,
  Download,
  Check,
  ExternalLink,
  Printer,
  Sparkles,
  KeyRound,
  Layers,
  AlertCircle,
} from 'lucide-react';

interface GoogleSheetsExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  evaluations: EvaluationResult[];
  sets: PracticalSet[];
}

export const GoogleSheetsExportModal: React.FC<GoogleSheetsExportModalProps> = ({
  isOpen,
  onClose,
  evaluations,
  sets,
}) => {
  const [activeTab, setActiveTab] = useState<'oauth' | 'clipboard' | 'csv' | 'report'>('oauth');
  const [spreadsheetTitle, setSpreadsheetTitle] = useState('C++ Practical Assessment Results - 4 Sets & 4 Classes');
  const [selectedSetToCopy, setSelectedSetToCopy] = useState<string>('master');
  const [copied, setCopied] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportResult, setExportResult] = useState<{ url?: string; error?: string } | null>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState('');

  if (!isOpen) return null;

  const handleCopyTSV = () => {
    const tsvData =
      selectedSetToCopy === 'master'
        ? generateGoogleSheetsTSV(evaluations)
        : generateGoogleSheetsTSV(evaluations, selectedSetToCopy, sets);

    navigator.clipboard.writeText(tsvData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadCSV = () => {
    const csvContent = generateCSV(evaluations);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CPP_Assessment_Evaluation_Results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateGoogleSpreadsheet = async () => {
    if (!googleAccessToken.trim()) {
      alert('Please provide or sign in with your Google OAuth Access Token, or use the 1-Click Clipboard TSV export.');
      return;
    }

    setExportLoading(true);
    setExportResult(null);

    const res = await createGoogleSpreadsheet(
      googleAccessToken.trim(),
      spreadsheetTitle,
      evaluations,
      sets
    );

    setExportLoading(false);
    if (res.success && res.spreadsheetUrl) {
      setExportResult({ url: res.spreadsheetUrl });
    } else {
      setExportResult({ error: res.error || 'Failed to export' });
    }
  };

  const handlePrintReports = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Student Feedback Report Slips</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; color: #222; }
          .card { border: 1px solid #ccc; border-radius: 8px; padding: 20px; margin-bottom: 24px; page-break-inside: avoid; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 12px; }
          .title { font-size: 18px; font-weight: bold; }
          .meta { font-size: 14px; color: #555; }
          .score { font-size: 20px; font-weight: bold; color: #1e3a8a; }
          .table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 12px; font-size: 13px; }
          .table th, .table td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; }
          .table th { background: #f4f4f5; }
          .comment { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 10px; margin-top: 10px; font-style: italic; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <h2>C++ Practical Assessment Evaluation - Student Feedback Slips</h2>
        <p>Classes: Class 1, Class 2, Class 3, Class 4 | Sets: Set 1, Set 2, Set 3, Set 4</p>
        <hr/>
        ${evaluations
          .map(
            (ev) => `
          <div class="card">
            <div class="header">
              <div>
                <div class="title">${ev.studentName}${ev.studentId ? ` (${ev.studentId})` : ''}</div>
                <div class="meta">${ev.classId} | ${ev.setId} | File: ${ev.filename}</div>
              </div>
              <div class="score">
                ${ev.totalMarks} / ${ev.maxMarks} (${ev.percentage}%) - Grade ${ev.grade}
              </div>
            </div>
            <table class="table">
              <thead>
                <tr>
                  <th>Rubric Criterion</th>
                  <th>Awarded Marks</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                ${ev.rubricBreakdown
                  .map(
                    (rb) => `
                  <tr>
                    <td>${rb.criteriaName}</td>
                    <td><strong>${rb.marksAwarded}</strong> / ${rb.maxMarks}</td>
                    <td>${rb.feedback}</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
            <div class="comment">
              <strong>Teacher Comment:</strong> ${ev.studentComment}
            </div>
          </div>
        `
          )
          .join('')}
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200/60 flex items-center justify-center text-emerald-700">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 block">
                Google Sheets Integration
              </span>
              <h3 className="font-bold text-slate-900 text-sm">
                Export Evaluated Rubrics & Comments to Google Spreadsheet
              </h3>
              <p className="text-xs text-slate-500">
                {evaluations.length} marked students ready across 4 sets & 4 classes
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

        {/* Sub-tabs */}
        <div className="px-6 pt-3 border-b border-slate-200 flex gap-6 text-xs bg-slate-50/30">
          <button
            onClick={() => setActiveTab('oauth')}
            className={`pb-3 font-semibold transition border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === 'oauth'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Live Google Sheets API
          </button>
          <button
            onClick={() => setActiveTab('clipboard')}
            className={`pb-3 font-semibold transition border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === 'clipboard'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            1-Click Paste into Google Sheets
          </button>
          <button
            onClick={() => setActiveTab('csv')}
            className={`pb-3 font-semibold transition border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === 'csv'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            Download CSV / Excel
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`pb-3 font-semibold transition border-b-2 -mb-px flex items-center gap-1.5 ${
              activeTab === 'report'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            Student Feedback Slips
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* TAB 1: LIVE GOOGLE SHEETS API */}
          {activeTab === 'oauth' && (
            <div className="space-y-4">
              <div className="bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-xl text-xs text-emerald-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <FileSpreadsheet className="w-4 h-4" />
                  Automated Multi-Tab Google Spreadsheet Generation
                </span>
                <p>
                  Creates a new Google Spreadsheet containing a <strong>Master Summary</strong> sheet plus dedicated rubric sheets for <strong>Set 1, Set 2, Set 3, and Set 4</strong> with all criterion scores and feedback comments.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Spreadsheet Title:
                </label>
                <input
                  type="text"
                  value={spreadsheetTitle}
                  onChange={(e) => setSpreadsheetTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                  Google OAuth Access Token:
                </label>
                <input
                  type="password"
                  value={googleAccessToken}
                  onChange={(e) => setGoogleAccessToken(e.target.value)}
                  placeholder="Paste Google OAuth Bearer Token (or click 1-Click Paste tab if you prefer no token)"
                  className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-600"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Tip: If your Google Account uses SSO or you prefer not generating a token, switch to the <strong>1-Click Paste</strong> tab to paste directly into any sheet in 2 seconds!
                </p>
              </div>

              {exportResult?.url && (
                <div className="p-4 bg-emerald-100 border border-emerald-300 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-emerald-900 block">
                      Spreadsheet Successfully Created!
                    </span>
                    <span className="text-[11px] text-emerald-800">
                      All 4 sets and comments have been populated.
                    </span>
                  </div>
                  <a
                    href={exportResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-full transition"
                  >
                    Open in Google Sheets
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {exportResult?.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Export Notice:</span>
                    <span>{exportResult.error}</span>
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={handleCreateGoogleSpreadsheet}
                  disabled={exportLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-full shadow-xs transition"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  {exportLoading ? 'Creating Spreadsheet...' : 'Create Google Spreadsheet Now'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: CLIPBOARD TSV */}
          {activeTab === 'clipboard' && (
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50/70 border border-indigo-200/70 rounded-xl text-xs text-indigo-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-indigo-900">
                  <Copy className="w-4 h-4" />
                  Fastest Method: 1-Click Copy & Paste into Google Sheets
                </span>
                <p>
                  1. Choose the view below (Master Summary or specific Set rubric).<br />
                  2. Click <strong>"Copy Grid to Clipboard"</strong>.<br />
                  3. Open any Google Spreadsheet (<a href="https://sheets.new" target="_blank" rel="noreferrer" className="underline font-bold text-indigo-700">sheets.new</a>) and press <kbd className="px-1.5 py-0.5 bg-white border border-indigo-200 rounded-md font-mono font-bold">Ctrl+V</kbd> or <kbd className="px-1.5 py-0.5 bg-white border border-indigo-200 rounded-md font-mono font-bold">Cmd+V</kbd>.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Select Data Sheet to Copy:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <button
                    onClick={() => setSelectedSetToCopy('master')}
                    className={`px-3 py-2 text-xs font-medium rounded-xl border transition ${
                      selectedSetToCopy === 'master'
                        ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    Master Summary
                  </button>
                  {sets.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedSetToCopy(s.id)}
                      className={`px-3 py-2 text-xs font-medium rounded-xl border transition ${
                        selectedSetToCopy === s.id
                          ? 'bg-indigo-600 text-white border-indigo-600 font-semibold shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {s.id} Rubrics
                    </button>
                  ))}
                </div>
              </div>

              {/* Data Preview */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="px-3 py-2 bg-slate-100 text-[11px] font-semibold text-slate-700 border-b border-slate-200 flex justify-between">
                  <span>Formatted Tab-Separated Values Preview</span>
                  <span>{evaluations.length} student rows</span>
                </div>
                <textarea
                  readOnly
                  value={
                    selectedSetToCopy === 'master'
                      ? generateGoogleSheetsTSV(evaluations)
                      : generateGoogleSheetsTSV(evaluations, selectedSetToCopy, sets)
                  }
                  rows={8}
                  className="w-full text-[10px] font-mono p-3 bg-slate-50/50 text-slate-800 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <a
                  href="https://sheets.new"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                >
                  Open new blank sheet (sheets.new)
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  id="btn-copy-tsv-now"
                  onClick={handleCopyTSV}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-full shadow-xs transition"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      Copied! Ready to Paste in Google Sheets
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Grid to Clipboard
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CSV DOWNLOAD */}
          {activeTab === 'csv' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1">
                <span className="font-bold text-slate-900 block">Download Standalone Spreadsheet File (.CSV)</span>
                <p>
                  Generates an RFC 4180 compliant CSV file with student IDs, names, classes, sets, rubric scores, and full feedback comments that can be opened in Microsoft Excel, Apple Numbers, or imported into Google Drive.
                </p>
              </div>

              <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">Complete Results Master Dataset</span>
                  <span className="text-[11px] text-slate-500">
                    Includes all 4 practical sets and 4 classes ({evaluations.length} records)
                  </span>
                </div>
                <button
                  onClick={handleDownloadCSV}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition border border-slate-200"
                >
                  <Download className="w-4 h-4" />
                  Download CSV
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: STUDENT FEEDBACK SLIPS */}
          {activeTab === 'report' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs text-amber-950 space-y-1">
                <span className="font-bold text-amber-900 block">Individual Student Feedback Slips</span>
                <p>
                  Print or save individual student report cards showing their assigned set, mark breakdown, areas of excellence, and constructive feedback comment.
                </p>
              </div>

              <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-900 block">
                    Printable Report Cards for All Students
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Generates clean print-ready cards with breakdown table and teacher notes
                  </span>
                </div>
                <button
                  onClick={handlePrintReports}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-full transition border border-slate-200"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save PDF Slips
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-full transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
