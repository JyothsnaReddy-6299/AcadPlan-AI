import { apiRequest } from "../lib/Api";

const STORAGE_PREFIX = "acadplan_copo_matrix";
const MOCK_MATRIX_URL = "/mock-data/copo-matrix.json";
const shouldUseMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";

function normalizeMatrixResponse(payload) {
  if (!payload) return null;

  return {
    course: payload.course ?? null,
    cos: payload.cos ?? payload.coLabels ?? [],
    pos: payload.pos ?? payload.poLabels ?? [],
    options: payload.options ?? ["-", "1", "2", "3"],
    matrix: payload.matrix ?? [],
  };
}

// Fetches a saved matrix for a course. The UI always receives the normalized
// shape above, whether the source is mock JSON, localStorage, or the backend.
export async function fetchMatrix(courseId) {
  if (!shouldUseMockApi) {
    const payload = await apiRequest(`/api/courses/${courseId}/copo-matrix`);
    return normalizeMatrixResponse(payload);
  }

  const saved = localStorage.getItem(`${STORAGE_PREFIX}_${courseId}`);
  if (saved) return normalizeMatrixResponse(JSON.parse(saved));

  const response = await fetch(MOCK_MATRIX_URL);
  if (!response.ok) {
    throw new Error(`Failed to load mock matrix: ${response.status}`);
  }
  return normalizeMatrixResponse(await response.json());
}

// Persists the current matrix draft. Later, your teammate only needs to make
// the backend accept this same JSON shape.
export async function saveMatrixDraft(courseId, matrixData) {
  if (!shouldUseMockApi) {
    return apiRequest(`/api/courses/${courseId}/copo-matrix`, {
      method: "PUT",
      body: matrixData,
    });
  }

  localStorage.setItem(
    `${STORAGE_PREFIX}_${courseId}`,
    JSON.stringify(matrixData)
  );
  return { success: true };
}
