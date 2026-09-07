import { EvaluationResult, PracticalSet } from '../types';

export interface GoogleExportResult {
  success: boolean;
  spreadsheetUrl?: string;
  spreadsheetId?: string;
  error?: string;
}

export async function createGoogleSpreadsheet(
  accessToken: string,
  title: string,
  evaluations: EvaluationResult[],
  sets: PracticalSet[]
): Promise<GoogleExportResult> {
  try {
    // 1. Create spreadsheet with master sheet and per-set sheets
    const sheetsToCreate = [
      { properties: { title: 'Master Summary', gridProperties: { frozenRowCount: 1 } } },
      ...sets.map((s) => ({
        properties: { title: `${s.id} Rubrics`, gridProperties: { frozenRowCount: 1 } },
      })),
    ];

    const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: title || 'C++ Practical Evaluation Results',
        },
        sheets: sheetsToCreate,
      }),
    });

    if (!createResponse.ok) {
      const errJson = await createResponse.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `Google Sheets API error (${createResponse.status})`);
    }

    const createdData = await createResponse.json();
    const spreadsheetId = createdData.spreadsheetId;
    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    // 2. Prepare data for Master Summary (<name>_<set>.cpp format)
    const masterHeaders = [
      'Student Name',
      'Practical Set',
      'Class',
      'Submission Filename',
      'Total Marks Awarded',
      'Max Marks',
      'Percentage (%)',
      'Grade',
      'Status',
      'Teacher Feedback Comment',
      'Key Strengths',
      'Areas for Improvement',
    ];

    const masterRows = evaluations.map((ev) => [
      ev.studentName,
      ev.setId,
      ev.classId,
      ev.filename,
      ev.totalMarks,
      ev.maxMarks,
      `${ev.percentage}%`,
      ev.grade,
      ev.status,
      ev.studentComment || '',
      ev.strengths?.join('; ') || '',
      ev.areasForImprovement?.join('; ') || '',
    ]);

    const valueRanges: any[] = [
      {
        range: "'Master Summary'!A1",
        values: [masterHeaders, ...masterRows],
      },
    ];

    // 3. Prepare data for each Set's rubric sheet
    for (const set of sets) {
      const setEvals = evaluations.filter((e) => e.setId === set.id);
      const rubricHeaders = [
        'Student Name',
        'Practical Set',
        'Class',
        'Submission Filename',
        ...set.rubrics.map((r) => `${r.name} (Max: ${r.maxMarks})`),
        `Total Score (/${set.maxMarks})`,
        'Percentage (%)',
        'Grade',
        'Status',
        'Teacher Feedback Comment',
      ];

      const setRows = setEvals.map((ev) => {
        const rubricScores = set.rubrics.map((r) => {
          const matched = ev.rubricBreakdown?.find((rb) => rb.criteriaId === r.id || rb.criteriaName.toLowerCase() === r.name.toLowerCase());
          return matched ? matched.marksAwarded : 0;
        });

        return [
          ev.studentName,
          ev.setId,
          ev.classId,
          ev.filename,
          ...rubricScores,
          ev.totalMarks,
          `${ev.percentage}%`,
          ev.grade,
          ev.status,
          ev.studentComment || '',
        ];
      });

      valueRanges.push({
        range: `'${set.id} Rubrics'!A1`,
        values: [rubricHeaders, ...setRows],
      });
    }

    // 4. Batch update values
    const updateResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: valueRanges,
        }),
      }
    );

    if (!updateResponse.ok) {
      const errJson = await updateResponse.json().catch(() => ({}));
      console.warn('Batch update values warning:', errJson);
    }

    return {
      success: true,
      spreadsheetUrl,
      spreadsheetId,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to export to Google Sheets',
    };
  }
}

// Generate TSV for instant 1-click clipboard paste directly into any Google Sheet
export function generateGoogleSheetsTSV(
  evaluations: EvaluationResult[],
  selectedSetId?: string,
  sets?: PracticalSet[]
): string {
  if (selectedSetId && sets) {
    const set = sets.find((s) => s.id === selectedSetId);
    if (set) {
      const headers = [
        'Student Name',
        'Practical Set',
        'Class',
        'Submission Filename',
        ...set.rubrics.map((r) => `${r.name} (Max ${r.maxMarks})`),
        `Total (/${set.maxMarks})`,
        'Percentage (%)',
        'Grade',
        'Status',
        'Teacher Feedback Comment',
      ];
      const rows = evaluations
        .filter((e) => e.setId === selectedSetId)
        .map((ev) => {
          const rubricScores = set.rubrics.map((r) => {
            const matched = ev.rubricBreakdown?.find(
              (rb) => rb.criteriaId === r.id || rb.criteriaName.toLowerCase() === r.name.toLowerCase()
            );
            return matched ? matched.marksAwarded : 0;
          });
          return [
            ev.studentName,
            ev.setId,
            ev.classId,
            ev.filename,
            ...rubricScores,
            ev.totalMarks,
            `${ev.percentage}%`,
            ev.grade,
            ev.status,
            `"${(ev.studentComment || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
          ].join('\t');
        });
      return [headers.join('\t'), ...rows].join('\n');
    }
  }

  // Master Summary TSV
  const headers = [
    'Student Name',
    'Practical Set',
    'Class',
    'Submission Filename',
    'Total Marks Awarded',
    'Max Marks',
    'Percentage (%)',
    'Grade',
    'Status',
    'Teacher Feedback Comment',
    'Key Strengths',
    'Areas for Improvement',
  ];

  const rows = evaluations.map((ev) => {
    return [
      ev.studentName,
      ev.setId,
      ev.classId,
      ev.filename,
      ev.totalMarks,
      ev.maxMarks,
      `${ev.percentage}%`,
      ev.grade,
      ev.status,
      `"${(ev.studentComment || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(ev.strengths?.join('; ') || '').replace(/"/g, '""')}"`,
      `"${(ev.areasForImprovement?.join('; ') || '').replace(/"/g, '""')}"`,
    ].join('\t');
  });

  return [headers.join('\t'), ...rows].join('\n');
}

// Generate CSV for file download
export function generateCSV(evaluations: EvaluationResult[]): string {
  const headers = [
    'Student Name',
    'Practical Set',
    'Class',
    'Submission Filename',
    'Total Marks Awarded',
    'Max Marks',
    'Percentage (%)',
    'Grade',
    'Status',
    'Teacher Feedback Comment',
    'Key Strengths',
    'Areas for Improvement',
  ];

  const escapeCSV = (val: any) => {
    const str = String(val ?? '').replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = evaluations.map((ev) => [
    escapeCSV(ev.studentName),
    escapeCSV(ev.setId),
    escapeCSV(ev.classId),
    escapeCSV(ev.filename),
    escapeCSV(ev.totalMarks),
    escapeCSV(ev.maxMarks),
    escapeCSV(`${ev.percentage}%`),
    escapeCSV(ev.grade),
    escapeCSV(ev.status),
    escapeCSV(ev.studentComment || ''),
    escapeCSV(ev.strengths?.join('; ') || ''),
    escapeCSV(ev.areasForImprovement?.join('; ') || ''),
  ]);

  return [headers.map(escapeCSV).join(','), ...rows.map((r) => r.join(','))].join('\n');
}
