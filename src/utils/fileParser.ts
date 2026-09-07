export interface ParsedFilenameInfo {
  setId: string;
  classId: string;
  studentId: string;
  studentName: string;
}

/**
 * Parses student C++ submission filenames matching the format:
 * "<name>_<set>.cpp"
 *
 * Examples:
 * - "Alex Tan_Set 1.cpp" -> studentName: "Alex Tan", setId: "Set 1", classId: "Class 1"
 * - "Chloe Lim_Set1.cpp" -> studentName: "Chloe Lim", setId: "Set 1", classId: "Class 1"
 * - "Daniel Lee_Set 2.cpp" -> studentName: "Daniel Lee", setId: "Set 2", classId: "Class 2"
 * - "Farhan Ahmad_Set 3.cpp" -> studentName: "Farhan Ahmad", setId: "Set 3", classId: "Class 3"
 * - "Grace Ong_Set 4.cpp" -> studentName: "Grace Ong", setId: "Set 4", classId: "Class 4"
 * - "Alex_Tan_Set1.cpp" -> studentName: "Alex Tan", setId: "Set 1", classId: "Class 1"
 * - "Kenji Sato_2.cpp" -> studentName: "Kenji Sato", setId: "Set 2", classId: "Class 2"
 */
export function parseFilename(filename: string): ParsedFilenameInfo {
  // Strip .cpp, .cc, .cxx extension
  const base = filename.replace(/\.(cpp|cc|cxx)$/i, '').trim();

  let setId = 'Set 1';
  let classId = 'Class 1';
  let studentId = '';
  let studentName = '';

  // Target format: <name>_<set>
  const lastUnderscore = base.lastIndexOf('_');

  if (lastUnderscore !== -1) {
    const rawName = base.substring(0, lastUnderscore).trim();
    const rawSet = base.substring(lastUnderscore + 1).trim();

    // 1. Detect Set from the <set> segment (e.g. "Set 1", "Set1", "set-2", "1", "2", "3", "4", "Set A", etc.)
    const setMatch = rawSet.match(/(?:set[-_\s]*)?([1-4]|[a-d])/i);
    if (setMatch) {
      const val = setMatch[1].toUpperCase();
      if (val === '1' || val === 'A') setId = 'Set 1';
      else if (val === '2' || val === 'B') setId = 'Set 2';
      else if (val === '3' || val === 'C') setId = 'Set 3';
      else if (val === '4' || val === 'D') setId = 'Set 4';
    } else {
      // Fallback: check whole filename for set indicator
      const globalSetMatch = base.match(/set[-_\s]*([1-4]|[a-d])/i);
      if (globalSetMatch) {
        const val = globalSetMatch[1].toUpperCase();
        if (val === '1' || val === 'A') setId = 'Set 1';
        else if (val === '2' || val === 'B') setId = 'Set 2';
        else if (val === '3' || val === 'C') setId = 'Set 3';
        else if (val === '4' || val === 'D') setId = 'Set 4';
      }
    }

    // 2. Format <name>
    let formattedName = rawName.replace(/_+/g, ' ').trim();
    // Split camelCase if no space exists (e.g. AlexTan -> Alex Tan)
    if (!formattedName.includes(' ')) {
      formattedName = formattedName.replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    // Detect if an optional student ID was placed in the name (e.g. "Alex Tan (B220101)")
    const embeddedId = formattedName.match(/\b([A-Za-z]{1,3}\d{4,8}|\d{6,8})\b/);
    if (embeddedId) {
      studentId = embeddedId[1];
      formattedName = formattedName.replace(embeddedId[0], '').replace(/[()]/g, '').trim();
    }

    studentName = formattedName || 'Student';
  } else {
    // If no underscore was found, try finding "Set"
    const setMatch = base.match(/set[-_\s]*([1-4]|[a-d])/i);
    if (setMatch) {
      const val = setMatch[1].toUpperCase();
      if (val === '1' || val === 'A') setId = 'Set 1';
      else if (val === '2' || val === 'B') setId = 'Set 2';
      else if (val === '3' || val === 'C') setId = 'Set 3';
      else if (val === '4' || val === 'D') setId = 'Set 4';

      const beforeSet = base.substring(0, setMatch.index).replace(/[-_]$/, '').trim();
      studentName = beforeSet.replace(/_+/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').trim() || base;
    } else {
      studentName = base.replace(/_+/g, ' ').trim();
    }
  }

  // Link Set to Class (Set 1 -> Class 1, Set 2 -> Class 2, Set 3 -> Class 3, Set 4 -> Class 4)
  classId = setId.replace('Set', 'Class');

  return {
    setId,
    classId,
    studentId: studentId || '',
    studentName: studentName.trim() || 'Student',
  };
}
