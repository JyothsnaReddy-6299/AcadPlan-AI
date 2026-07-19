import { normalizeCdpPlan } from "../services/cdpService";
// Central place for talking to the backend.
// When the backend is ready, set VITE_API_URL in .env, for example:
// VITE_API_URL=http://localhost:8000
export const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const shouldUseMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";

function buildUrl(endpoint) {
  if (/^https?:\/\//i.test(endpoint)) return endpoint;
  return `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
}

async function parseJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message =
      payload?.message ||
      payload?.error ||
      `Request failed: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  return payload;
}

export async function apiRequest(endpoint, options = {}) {
  const { body, headers, ...rest } = options;
  const isFormData = body instanceof FormData;

  const response = await fetch(buildUrl(endpoint), {
    ...rest,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: isFormData || typeof body === "string" ? body : JSON.stringify(body),
  });

  return parseJsonResponse(response);
}

export async function uploadSyllabus(file) {
  if (shouldUseMockApi) {
    if (file.name.endsWith(".json")) {
      try {
        const text = await file.text();
        const rawJson = JSON.parse(text);
        const json = normalizeCdpPlan(rawJson);
        const courseId = json.courseMetadata?.code || "23CSE201";
        
        // Cache CDP draft
        localStorage.setItem(`acadplan_cdp_draft_v5_${courseId}`, JSON.stringify(json));
        
        // Cache Matrix draft
        if (json.coPoMappings) {
          const matrixData = {
            course: {
              id: courseId,
              title: json.courseMetadata?.name || "Subject",
              academicYear: json.courseMetadata?.academicYear || "2026-2027",
            },
            cos: (json.courseOutcomes || []).map(co => co.id),
            pos: Array.from(new Set((json.coPoMappings || []).flatMap(m => Object.keys(m).filter(k => k !== "co")))),
            options: ["-", "1", "2", "3"],
            matrix: (json.courseOutcomes || []).map((co, coIdx) => {
              const mappingRow = json.coPoMappings.find(m => m.co === co.id) || {};
              const posList = Array.from(new Set((json.coPoMappings || []).flatMap(m => Object.keys(m).filter(k => k !== "co"))));
              return posList.map(po => String(mappingRow[po] ?? "-"));
            })
          };
          localStorage.setItem(`acadplan_copo_matrix_${courseId}`, JSON.stringify(matrixData));
        }

        return {
          status: "success",
          fileName: file.name,
          courseId: courseId,
          nextRoute: `/cdp-review?courseId=${courseId}`,
        };
      } catch (err) {
        console.error("Syllabus JSON Parsing failed:", err);
        throw new Error("Failed to parse uploaded JSON content");
      }
    }

    try {
      const response = await fetch(`/mock-data/cdp-plan.json?t=${Date.now()}`);
      if (response.ok) {
        const rawJson = await response.json();
        const json = normalizeCdpPlan(rawJson);
        const courseId = json.courseMetadata?.code || "23CSE201";
        
        // Clear cached drafts for this course to ensure fresh loading
        localStorage.removeItem(`acadplan_cdp_draft_v5_${courseId}`);
        localStorage.removeItem(`acadplan_copo_matrix_${courseId}`);
        
        return {
          status: "success",
          fileName: file.name,
          courseId: courseId,
          nextRoute: `/cdp-review?courseId=${courseId}`,
        };
      }
    } catch (err) {
      console.error("Failed to parse cdp-plan.json in mock upload:", err);
    }

    return {
      status: "success",
      fileName: file.name,
      courseId: "23CSE201",
      nextRoute: "/cdp-review",
    };
  }

  const formData = new FormData();
  formData.append("file", file);

  return apiRequest("/api/upload-syllabus", {
    method: "POST",
    body: formData,
    // Do not manually set Content-Type for FormData.
    // The browser sets the correct multipart boundary automatically.
  });
}
