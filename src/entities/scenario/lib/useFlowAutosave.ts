import { useEffect } from "react";

type UseFlowAutosaveParams = {
  activeScenarioId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  save: () => Promise<void>;
  delay?: number;
};

export function useFlowAutosave({
  activeScenarioId,
  isDirty,
  isSaving,
  save,
  delay = 2000,
}: UseFlowAutosaveParams) {
  useEffect(() => {
    if (!activeScenarioId || !isDirty || isSaving) return;

    const timeoutId = window.setTimeout(() => {
      save();
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [activeScenarioId, isDirty, isSaving, save, delay]);
}
