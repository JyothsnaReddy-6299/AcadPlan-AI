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
