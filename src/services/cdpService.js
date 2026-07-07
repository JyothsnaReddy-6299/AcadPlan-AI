import { apiRequest } from "../lib/Api";

const MOCK_CDP_URL = "/mock-data/cdp-plan.json";
const STORAGE_KEY = "acadplan_cdp_draft_v5";
const shouldUseMockApi = import.meta.env.VITE_USE_MOCK_API !== "false";

export async function fetchCdpPlan(courseId = "23CSE201") {
  if (!shouldUseMockApi) {
    return apiRequest(`/api/courses/${courseId}/cdp`);
  }

  const saved = localStorage.getItem(`${STORAGE_KEY}_${courseId}`);
  if (saved) return JSON.parse(saved);

  const response = await fetch(MOCK_CDP_URL);
  if (!response.ok) {
    throw new Error(`Failed to load mock CDP: ${response.status}`);
  }

  return response.json();
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
