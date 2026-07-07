import { useCallback, useEffect, useState } from "react";
import {
  fetchCdpPlan,
  generateCdpDocument,
  saveCdpDraft,
} from "../services/cdpService";
import { buildConceptMap } from "../utils/conceptMap";

// Ensures every plan carries a concept map: when the extracted CDP does not
// include one, it is generated automatically from the plan data.
function withConceptMap(plan) {
  if (!plan) return plan;
  if (plan.mermaidChart && plan.mermaidChart.trim()) return plan;
  return { ...plan, mermaidChart: buildConceptMap(plan) };
}

export function useCdpPlan(courseId = "23CSE201") {
  const [plan, setPlan] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");

    fetchCdpPlan(courseId)
      .then((data) => {
        if (!active) return;
        setPlan(withConceptMap(data));
        setStatus("idle");
      })
      .catch(() => active && setStatus("error"));

    return () => {
      active = false;
    };
  }, [courseId]);

  const updatePlan = useCallback((updater) => {
    setPlan((current) =>
      typeof updater === "function" ? updater(current) : updater
    );
  }, []);

  // Rebuilds the concept map from the current plan data, overwriting any
  // existing chart.
  const regenerateConceptMap = useCallback(() => {
    setPlan((current) =>
      current ? { ...current, mermaidChart: buildConceptMap(current) } : current
    );
  }, []);

  const saveDraft = useCallback(async () => {
    if (!plan) return;
    setStatus("saving");
    try {
      await saveCdpDraft(courseId, plan);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1400);
    } catch {
      setStatus("error");
    }
  }, [courseId, plan]);

  const generateDocument = useCallback(async () => {
    if (!plan) return;
    setStatus("generating");
    try {
      await generateCdpDocument(courseId, plan);
      setStatus("generated");
      setTimeout(() => setStatus("idle"), 1400);
    } catch {
      setStatus("error");
    }
  }, [courseId, plan]);

  return {
    plan,
    updatePlan,
    saveDraft,
    generateDocument,
    regenerateConceptMap,
    status,
  };
}
