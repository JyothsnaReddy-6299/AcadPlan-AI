import { useCallback, useEffect, useState } from "react";
import { fetchMatrix, saveMatrixDraft } from "../services/matrixService";
import {
  COS,
  POS,
  OPTIONS,
  createDefaultMatrix,
} from "../utils/matrixHelpers";

function createDefaultMatrixData() {
  return {
    course: {
      id: "23CSE201",
      title: "Procedural Programming using C",
      academicYear: "2026-2027",
    },
    cos: COS,
    pos: POS,
    options: OPTIONS,
    matrix: createDefaultMatrix(),
  };
}

export function useCoPoMatrix(courseId = "23CSE201") {
  const [matrixData, setMatrixData] = useState(createDefaultMatrixData);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;
    setStatus("loading");

    fetchMatrix(courseId)
      .then((result) => {
        if (!active) return;

        if (result?.matrix?.length) {
          setMatrixData((current) => ({
            ...current,
            ...result,
            course: result.course ?? current.course,
            cos: result.cos?.length ? result.cos : current.cos,
            pos: result.pos?.length ? result.pos : current.pos,
            options: result.options?.length ? result.options : current.options,
          }));
        }

        setStatus("idle");
      })
      .catch(() => active && setStatus("error"));

    return () => {
      active = false;
    };
  }, [courseId]);

  const updateCell = useCallback((coIndex, poIndex, value) => {
    setMatrixData((current) => ({
      ...current,
      matrix: current.matrix.map((row, rowIndex) =>
        rowIndex === coIndex
          ? row.map((cell, cellIndex) =>
              cellIndex === poIndex ? value : cell
            )
          : row
      ),
    }));
  }, []);

  const saveDraft = useCallback(async () => {
    setStatus("saving");
    try {
      await saveMatrixDraft(courseId, matrixData);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("error");
    }
  }, [courseId, matrixData]);

  return { ...matrixData, updateCell, saveDraft, status };
}
