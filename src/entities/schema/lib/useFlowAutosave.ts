import { useEffect } from "react";

type UseFlowAutosaveParams = {
  activeSchemaId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  save: () => Promise<void>;
  delay?: number;
};

export function useFlowAutosave({
  activeSchemaId,
  isDirty,
  isSaving,
  save,
  delay = 2000,
}: UseFlowAutosaveParams) {
  useEffect(() => {
    if (!activeSchemaId || !isDirty || isSaving) return;

    const timeoutId = window.setTimeout(() => {
      save();
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [activeSchemaId, isDirty, isSaving, save, delay]);
}
