import { apiRequest } from "../lib/Api";

const MOCK_CDP_URL = "/mock-data/cdp-plan.json";
const STORAGE_KEY = "acadplan_cdp_draft_v5";
const shouldUseMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";

export function normalizeCdpPlan(raw) {
  if (!raw) return null;

  // 1. Course Metadata
  const info = raw.CourseInformation || raw.courseMetadata || {};
  
  // Parse LTPC Credits "3-0-2-4" into object
  let credits = { L: 3, T: 0, P: 2, C: 4 };
  const creditsStr = info.Credits_LTPC || (info.credits ? `${info.credits.L}-${info.credits.T}-${info.credits.P}-${info.credits.C}` : "3-0-2-4");
  const creditsMatch = String(creditsStr).match(/(\d+)-(\d+)-(\d+)-(\d+)/);
  if (creditsMatch) {
    credits = {
      L: Number(creditsMatch[1]),
      T: Number(creditsMatch[2]),
      P: Number(creditsMatch[3]),
      C: Number(creditsMatch[4])
    };
  }

  const courseMetadata = {
    code: (info.CourseCode || info.code || "23MAT206").replace(/\s*\[cite:\s*\d+\]/gi, "").trim(),
    name: (info.CourseName || info.name || "Subject").replace(/\s*\[cite:\s*\d+\]/gi, "").trim(),
    program: (info.Program || info.program || "CSE").replace(/\s*\[cite:\s*\d+\]/gi, "").trim(),
    credits,
    facultyNames: (info.Faculty || info.facultyNames || "Faculty").replace(/\s*\[cite:\s*\d+\]/gi, "").trim(),
    semesterYear: (info.Semester_Year || info.semesterYear || "III/II").replace(/\s*\[cite:\s*\d+\]/gi, "").trim(),
    preRequisites: (info.PreRequisite || info.preRequisites || "NIL").replace(/\s*\[cite:\s*\d+\]/gi, "").trim(),
    courseMentor: (info.CourseMentor || info.courseMentor || "Mentor").replace(/\s*\[cite:\s*\d+\]/gi, "").trim(),
    academicYear: (info.AcademicYear || info.academicYear || "2026-2027").replace(/\s*\[cite:\s*\d+\]/gi, "").trim(),
    courseOverview: (raw.CourseOverview || raw.courseOverview || info.courseOverview || "Course Overview...").replace(/\s*\[cite:\s*\d+\]/gi, "").trim()
  };

  // 2. Course Outcomes
  let courseOutcomes = [];
  const rawOutcomes = raw.CourseOutcomes || raw.courseOutcomes || [];
  if (Array.isArray(rawOutcomes)) {
    courseOutcomes = rawOutcomes.map((item, idx) => {
      if (typeof item === "string") {
        const cleanItem = item.replace(/\s*\[cite:\s*\d+\]/gi, "").trim();
        const match = cleanItem.match(/^(CO\s*\d+)\s*:\s*(.*)$/i);
        if (match) {
          return {
            id: match[1].replace(/\s+/g, "").toUpperCase(),
            description: match[2].trim()
          };
        }
        return {
          id: `CO${idx + 1}`,
          description: cleanItem
        };
      } else if (item && typeof item === "object") {
        return {
          id: (item.id || `CO${idx + 1}`).replace(/\s+/g, "").toUpperCase(),
          description: (item.description || "").replace(/\s*\[cite:\s*\d+\]/gi, "").trim()
        };
      }
      return null;
    }).filter(Boolean);
  }

  // 3. CO-PO Mappings
  let coPoMappings = raw.coPoMappings || [];
  if (coPoMappings.length === 0 && courseOutcomes.length > 0) {
    coPoMappings = courseOutcomes.map(co => ({
      co: co.id,
      po1: "2",
      po2: "1",
      po3: "-",
      po5: "2",
      pso1: "2"
    }));
  }

  // 4. Lecture Plan
  let lecturePlan = raw.lecturePlan || [];
  if (lecturePlan.length === 0 && raw.Syllabus) {
    Object.keys(raw.Syllabus).forEach((unitKey, uidx) => {
      const unitNum = uidx + 1;
      const topicsText = raw.Syllabus[unitKey] || "";
      const topics = topicsText.split(/[.;]/).map(t => t.trim()).filter(Boolean);
      topics.forEach((topic) => {
        const cleanTopic = topic.replace(/\s*\[cite:\s*\d+\]/gi, "").trim();
        if (cleanTopic.length > 3) {
          lecturePlan.push({
            unit: unitNum,
            classPeriod: `${lecturePlan.length + 1}`,
            topic: cleanTopic,
            modeOfTeaching: "Lecture",
            inClassActivity: "Discussion",
            outClassActivity: "Self Study",
            coMapping: [`CO${Math.min(unitNum, courseOutcomes.length)}`],
            reference: ["T1"]
          });
        }
      });
    });
  }

  // 5. Evaluation and Grading
  const evalRaw = raw.EvaluationAndGrading || raw.evaluationAndGrading || {};
  const evaluationAndGrading = {
    Internal: {
      Quiz: (evalRaw.Internal?.Quiz || "15 Marks").replace(/\s*\[cite:\s*\d+\]/gi, "").trim(),
      Assignment: (evalRaw.Internal?.Assignment || "25 Marks").replace(/\s*\[cite:\s*\d+\]/gi, "").trim(),
      ValueAddedProgram_ClassParticipation: (evalRaw.Internal?.ValueAddedProgram_ClassParticipation || evalRaw.Internal?.VAP || "10 Marks").replace(/\s*\[cite:\s*\d+\]/gi, "").trim(),
      MidtermExam: (evalRaw.Internal?.MidtermExam || "20 Marks").replace(/\s*\[cite:\s*\d+\]/gi, "").trim(),
      TotalInternal: (evalRaw.Internal?.TotalInternal || "70 Marks").replace(/\s*\[cite:\s*\d+\]/gi, "").trim()
    },
    External: {
      EndSemester: (evalRaw.External?.EndSemester || "30 Marks").replace(/\s*\[cite:\s*\d+\]/gi, "").trim()
    },
    TotalMarks: (raw.TotalMarks || evalRaw.TotalMarks || "100").replace(/\s*\[cite:\s*\d+\]/gi, "").trim()
  };

  // 6. Attendance Requirements
  const attendanceRaw = raw.AttendanceRequirement || raw.attendanceRequirement || [];
  const attendanceRequirement = Array.isArray(attendanceRaw)
    ? attendanceRaw.map(str => str.replace(/\s*\[cite:\s*\d+\]/gi, "").trim())
    : [];

  return {
    status: "success",
    courseMetadata,
    courseOutcomes,
    coPoMappings,
    lecturePlan,
    evaluationAndGrading,
    attendanceRequirement
  };
}

export async function fetchCdpPlan(courseId = "23CSE201") {
  if (!shouldUseMockApi) {
    return apiRequest(`/api/courses/${courseId}/cdp`).then(normalizeCdpPlan);
  }

  const saved = localStorage.getItem(`${STORAGE_KEY}_${courseId}`);
  if (saved) return normalizeCdpPlan(JSON.parse(saved));

  const response = await fetch(`${MOCK_CDP_URL}?t=${Date.now()}`);
  if (!response.ok) {
    throw new Error(`Failed to load mock CDP: ${response.status}`);
  }

  const rawJson = await response.json();
  return normalizeCdpPlan(rawJson);
}

export async function saveCdpDraft(courseId, plan) {
  if (!shouldUseMockApi) {
    return apiRequest(`/api/courses/${courseId}/cdp/draft`, {
      method: "PUT",
      body: plan,
    });
  }

  localStorage.setItem(`${STORAGE_KEY}_${courseId}`, JSON.stringify(plan));
  return { success: true };
}

export async function generateCdpDocument(courseId, plan) {
  if (!shouldUseMockApi) {
    return apiRequest(`/api/courses/${courseId}/cdp/generate`, {
      method: "POST",
      body: plan,
    });
  }

  return { success: true };
}
