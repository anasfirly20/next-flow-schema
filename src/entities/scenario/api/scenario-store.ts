import { useChartStore } from "@/entities/chart";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mockScenarios } from "../model/mock";
import type { Scenario } from "../model/types";

const STORAGE_KEY = "flow-scenarios";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getNextScenarioName(scenarios: Scenario[]) {
  const baseName = "New scenario";
  const existingNames = new Set(scenarios.map((scenario) => scenario.name));

  if (!existingNames.has(baseName)) {
    return baseName;
  }

  let index = 1;

  while (existingNames.has(`${baseName} (${index})`)) {
    index += 1;
  }

  return `${baseName} (${index})`;
}

type ScenarioStore = {
  scenarios: Scenario[];
  activeScenarioId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  searchQuery: string;

  loadScenarios: () => Promise<void>;
  selectScenario: (scenarioId: string) => void;
  createScenario: () => Promise<string | null>;
  saveActiveScenario: () => Promise<void>;
  renameScenario: (scenarioId: string, name: string) => void;
  deleteScenario: (scenarioId: string) => void;
  setSearchQuery: (value: string) => void;
};

export const useScenarioStore = create<ScenarioStore>()(
  persist(
    (set, get) => ({
      scenarios: [],
      activeScenarioId: null,
      isLoading: false,
      isSaving: false,
      error: null,
      searchQuery: "",

      loadScenarios: async () => {
        set({ isLoading: true, error: null });

        try {
          await wait(400);

          const scenarios =
            get().scenarios.length > 0 ? get().scenarios : mockScenarios;

          const activeScenarioId =
            get().activeScenarioId ?? scenarios[0]?.id ?? null;

          set({
            scenarios,
            activeScenarioId,
            isLoading: false,
          });

          const activeScenario =
            scenarios.find((scenario) => scenario.id === activeScenarioId) ??
            scenarios[0] ??
            null;

          if (activeScenario) {
            useChartStore.getState().setChart({
              nodes: activeScenario.nodes,
              edges: activeScenario.edges,
            });
          } else {
            useChartStore.getState().setChart({
              nodes: [],
              edges: [],
            });
          }
        } catch {
          set({
            isLoading: false,
            error: "Failed to load scenarios",
          });
        }
      },

      selectScenario: (scenarioId) => {
        const scenario = get().scenarios.find((item) => item.id === scenarioId);
        if (!scenario) return;

        set({ activeScenarioId: scenarioId });

        useChartStore.getState().setChart({
          nodes: scenario.nodes,
          edges: scenario.edges,
        });
      },

      createScenario: async () => {
        set({ isLoading: true, error: null });

        try {
          // await wait(350);

          const scenarios = get().scenarios;

          const newScenario: Scenario = {
            id: crypto.randomUUID(),
            name: getNextScenarioName(scenarios),
            updatedAt: new Date().toISOString(),
            nodes: [],
            edges: [],
          };

          const nextScenarios = [newScenario, ...scenarios];

          set({
            scenarios: nextScenarios,
            activeScenarioId: newScenario.id,
            isLoading: false,
          });

          useChartStore.getState().setChart({
            nodes: [],
            edges: [],
          });

          return newScenario.id;
        } catch {
          set({
            isLoading: false,
            error: "Failed to create scenario",
          });

          return null;
        }
      },

      saveActiveScenario: async () => {
        const { activeScenarioId, scenarios } = get();
        if (!activeScenarioId) return;

        set({ isSaving: true, error: null });

        try {
          await wait(500);

          const { nodes, edges, markSaved } = useChartStore.getState();
          const now = new Date().toISOString();

          const nextScenarios = scenarios.map((scenario) =>
            scenario.id === activeScenarioId
              ? {
                  ...scenario,
                  nodes,
                  edges,
                  updatedAt: now,
                }
              : scenario
          );

          set({
            scenarios: nextScenarios,
            isSaving: false,
          });

          markSaved();
        } catch {
          set({
            isSaving: false,
            error: "Failed to save scenario",
          });
        }
      },

      renameScenario: (scenarioId, name) => {
        const trimmedName = name.trim();
        if (!trimmedName) return;

        const nextScenarios = get().scenarios.map((scenario) =>
          scenario.id === scenarioId
            ? {
                ...scenario,
                name: trimmedName,
              }
            : scenario
        );

        set({
          scenarios: nextScenarios,
        });
      },

      deleteScenario: (scenarioId) => {
        const { scenarios, activeScenarioId } = get();

        const nextScenarios = scenarios.filter(
          (scenario) => scenario.id !== scenarioId
        );

        const deletedWasActive = activeScenarioId === scenarioId;
        const nextActiveScenario = deletedWasActive
          ? (nextScenarios[0] ?? null)
          : null;

        set({
          scenarios: nextScenarios,
          activeScenarioId: deletedWasActive
            ? (nextActiveScenario?.id ?? null)
            : activeScenarioId,
        });

        if (deletedWasActive) {
          if (nextActiveScenario) {
            useChartStore.getState().setChart({
              nodes: nextActiveScenario.nodes,
              edges: nextActiveScenario.edges,
            });
          } else {
            useChartStore.getState().setChart({
              nodes: [],
              edges: [],
            });
          }
        }
      },

      setSearchQuery: (value) => {
        set({ searchQuery: value });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        scenarios: state.scenarios,
        activeScenarioId: state.activeScenarioId,
      }),
    }
  )
);
