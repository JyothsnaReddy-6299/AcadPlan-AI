import { useCallback, useEffect, useState } from "react";
import {
  fetchCdpPlan,
  generateCdpDocument,
  saveCdpDraft,
} from "../services/cdpService";

export function useCdpPlan(courseId = "23CSE201") {
  const [plan, setPlan] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");

    fetchCdpPlan(courseId)
      .then((data) => {
        if (!active) return;
        setPlan(data);
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

  return { plan, updatePlan, saveDraft, generateDocument, status };
}
