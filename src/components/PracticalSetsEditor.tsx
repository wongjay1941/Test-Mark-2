import React, { useState } from 'react';
import { PracticalSet, RubricCriterion } from '../types';
import { BookOpen, Edit3, Plus, Trash2, Check, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface PracticalSetsEditorProps {
  sets: PracticalSet[];
  onUpdateSet: (updatedSet: PracticalSet) => void;
}

export const PracticalSetsEditor: React.FC<PracticalSetsEditorProps> = ({ sets, onUpdateSet }) => {
  const [selectedSetId, setSelectedSetId] = useState<string>(sets[0]?.id || 'Set 1');
  const [activeTab, setActiveTab] = useState<'scheme' | 'question' | 'rubrics'>('scheme');
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [isEditingScheme, setIsEditingScheme] = useState(false);
  const [tempQuestion, setTempQuestion] = useState('');
  const [tempScheme, setTempScheme] = useState('');

  const currentSet = sets.find((s) => s.id === selectedSetId) || sets[0];

  const handleSelectSet = (id: string) => {
    setSelectedSetId(id);
    setIsEditingQuestion(false);
    setIsEditingScheme(false);
  };

  const handleSaveQuestion = () => {
    if (!currentSet) return;
    onUpdateSet({
      ...currentSet,
      questionPaper: tempQuestion,
    });
    setIsEditingQuestion(false);
  };

  const handleSaveScheme = () => {
    if (!currentSet) return;
    onUpdateSet({
      ...currentSet,
      markingScheme: tempScheme,
    });
    setIsEditingScheme(false);
  };

  const handleAddCriterion = () => {
    if (!currentSet) return;
    const newCriterion: RubricCriterion = {
      id: `crit_${Date.now()}`,
      name: 'New Assessment Criterion',
      maxMarks: 10,
      description: 'Describe specific technical requirement and criteria.',
    };
    const updatedRubrics = [...currentSet.rubrics, newCriterion];
    const newMaxMarks = updatedRubrics.reduce((acc, c) => acc + c.maxMarks, 0);
    onUpdateSet({
      ...currentSet,
      rubrics: updatedRubrics,
      maxMarks: newMaxMarks,
    });
  };

  const handleUpdateCriterion = (index: number, updated: Partial<RubricCriterion>) => {
    if (!currentSet) return;
    const updatedRubrics = [...currentSet.rubrics];
    updatedRubrics[index] = { ...updatedRubrics[index], ...updated };
    const newMaxMarks = updatedRubrics.reduce((acc, c) => acc + (c.maxMarks || 0), 0);
    onUpdateSet({
      ...currentSet,
      rubrics: updatedRubrics,
      maxMarks: newMaxMarks,
    });
  };

  const handleDeleteCriterion = (index: number) => {
    if (!currentSet) return;
    const updatedRubrics = currentSet.rubrics.filter((_, i) => i !== index);
    const newMaxMarks = updatedRubrics.reduce((acc, c) => acc + c.maxMarks, 0);
    onUpdateSet({
      ...currentSet,
      rubrics: updatedRubrics,
      maxMarks: newMaxMarks,
    });
  };

  return (
    <div id="practical-sets-editor" className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Top Header */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-indigo-600 block mb-1">
            Curriculum & Marking Configurations
          </span>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">4 Practical Sets & Marking Schemes</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure the question papers, grading rubrics, and marking schemes for all 4 practical sets.
          </p>
        </div>

        {/* Set Selector Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-full border border-slate-200">
          {sets.map((set) => (
            <button
              key={set.id}
              id={`btn-select-${set.id.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => handleSelectSet(set.id)}
              className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all whitespace-nowrap ${
                selectedSetId === set.id
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {set.id}
            </button>
          ))}
        </div>
      </div>

      {/* Set Details Bar */}
      <div className="px-6 py-3.5 bg-slate-100/70 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-900 text-sm">{currentSet.name}</span>
          <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full border border-indigo-200/60 font-semibold">
            {currentSet.topic}
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 font-medium">
          <span>
            Allocated Class: <strong className="text-slate-800">{currentSet.targetClass}</strong>
          </span>
          <span>
            Total Max Marks: <strong className="text-slate-900 font-mono text-sm">{currentSet.maxMarks}</strong>
          </span>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="px-6 pt-3 border-b border-slate-200 flex gap-6 text-xs font-semibold">
        <button
          id="tab-marking-scheme"
          onClick={() => setActiveTab('scheme')}
          className={`pb-3 transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'scheme'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Marking Scheme ({currentSet.id})
        </button>
        <button
          id="tab-rubrics"
          onClick={() => setActiveTab('rubrics')}
          className={`pb-3 transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'rubrics'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <FileText className="w-4 h-4" />
          Rubric Criteria Breakdown ({currentSet.rubrics.length})
        </button>
        <button
          id="tab-question-paper"
          onClick={() => setActiveTab('question')}
          className={`pb-3 transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'question'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-700'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Question Paper & Specifications
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Tab 1: Marking Scheme */}
        {activeTab === 'scheme' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Marking Scheme</span>
                <span className="text-xs text-slate-500">Used by the evaluation engine to assign scores and comments</span>
              </div>
              {!isEditingScheme ? (
                <button
                  id="btn-edit-scheme"
                  onClick={() => {
                    setTempScheme(currentSet.markingScheme);
                    setIsEditingScheme(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-full transition shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Marking Scheme
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingScheme(false)}
                    className="text-xs px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-full transition"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-save-scheme"
                    onClick={handleSaveScheme}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-full transition shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save Scheme
                  </button>
                </div>
              )}
            </div>

            {isEditingScheme ? (
              <textarea
                id="textarea-edit-scheme"
                value={tempScheme}
                onChange={(e) => setTempScheme(e.target.value)}
                rows={12}
                className="w-full font-mono text-xs p-4 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-slate-900 text-slate-200"
                placeholder="Paste or type the marking scheme here..."
              />
            ) : (
              <pre className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto">
                {currentSet.markingScheme}
              </pre>
            )}
          </div>
        )}

        {/* Tab 2: Rubrics Breakdown */}
        {activeTab === 'rubrics' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">
                  These criteria will become the columns in your exported Google Spreadsheet rubric sheet.
                </p>
              </div>
              <button
                id="btn-add-criterion"
                onClick={handleAddCriterion}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-full transition shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Rubric Criterion
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <tr>
                    <th className="p-3.5">Criterion Name</th>
                    <th className="p-3.5 w-32">Max Marks</th>
                    <th className="p-3.5">Description & Standards</th>
                    <th className="p-3.5 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {currentSet.rubrics.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3.5">
                        <input
                          type="text"
                          value={r.name}
                          onChange={(e) => handleUpdateCriterion(idx, { name: e.target.value })}
                          className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                        />
                      </td>
                      <td className="p-3.5">
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={r.maxMarks}
                          onChange={(e) => handleUpdateCriterion(idx, { maxMarks: Number(e.target.value) || 0 })}
                          className="w-20 px-2.5 py-1 border border-slate-200 rounded-lg font-mono font-medium text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                        />
                      </td>
                      <td className="p-3.5">
                        <input
                          type="text"
                          value={r.description}
                          onChange={(e) => handleUpdateCriterion(idx, { description: e.target.value })}
                          className="w-full px-2.5 py-1 border border-slate-200 rounded-lg text-slate-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-600"
                        />
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleDeleteCriterion(idx)}
                          title="Delete criterion"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Total calculated maximum marks for {currentSet.id}:</span>
              <span className="font-mono font-bold text-slate-800 text-sm">{currentSet.maxMarks} Marks</span>
            </div>
          </div>
        )}

        {/* Tab 3: Question Paper */}
        {activeTab === 'question' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Practical Question Paper & Technical Brief
              </span>
              {!isEditingQuestion ? (
                <button
                  id="btn-edit-question"
                  onClick={() => {
                    setTempQuestion(currentSet.questionPaper);
                    setIsEditingQuestion(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-full transition shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Question Paper
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingQuestion(false)}
                    className="text-xs px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 rounded-full transition"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn-save-question"
                    onClick={handleSaveQuestion}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-full transition shadow-2xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Save Question
                  </button>
                </div>
              )}
            </div>

            {isEditingQuestion ? (
              <textarea
                id="textarea-edit-question"
                value={tempQuestion}
                onChange={(e) => setTempQuestion(e.target.value)}
                rows={12}
                className="w-full font-mono text-xs p-4 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-600 bg-slate-900 text-slate-200"
                placeholder="Enter practical question paper text..."
              />
            ) : (
              <pre className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto">
                {currentSet.questionPaper}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
