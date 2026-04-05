import { useChartStore } from "@/entities/chart";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mockSchemas } from "../model/mock";
import type { Schema } from "../model/types";

const STORAGE_KEY = "flow-schemas";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function getNextSchemaName(schemas: Schema[]) {
  const baseName = "New schema";
  const existingNames = new Set(schemas.map((schema) => schema.name));

  if (!existingNames.has(baseName)) {
    return baseName;
  }

  let index = 1;

  while (existingNames.has(`${baseName} (${index})`)) {
    index += 1;
  }

  return `${baseName} (${index})`;
}

type SchemaStore = {
  schemas: Schema[];
  activeSchemaId: string | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  searchQuery: string;

  loadSchemas: () => Promise<void>;
  selectSchema: (schemaId: string) => void;
  createSchema: () => Promise<string | null>;
  saveActiveSchema: () => Promise<void>;
  renameSchema: (schemaId: string, name: string) => void;
  deleteSchema: (schemaId: string) => void;
  setSearchQuery: (value: string) => void;
};

export const useSchemaStore = create<SchemaStore>()(
  persist(
    (set, get) => ({
      schemas: [],
      activeSchemaId: null,
      isLoading: false,
      isSaving: false,
      error: null,
      searchQuery: "",

      loadSchemas: async () => {
        set({ isLoading: true, error: null });

        try {
          await wait(400);

          const schemas =
            get().schemas.length > 0 ? get().schemas : mockSchemas;

          const activeSchemaId = get().activeSchemaId ?? schemas[0]?.id ?? null;

          set({
            schemas,
            activeSchemaId,
            isLoading: false,
          });

          const activeSchema =
            schemas.find((schema) => schema.id === activeSchemaId) ??
            schemas[0] ??
            null;

          if (activeSchema) {
            useChartStore.getState().setChart({
              nodes: activeSchema.nodes,
              edges: activeSchema.edges,
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
            error: "Failed to load schemas",
          });
        }
      },

      selectSchema: (schemaId) => {
        const schema = get().schemas.find((item) => item.id === schemaId);
        if (!schema) return;

        set({ activeSchemaId: schemaId });

        useChartStore.getState().setChart({
          nodes: schema.nodes,
          edges: schema.edges,
        });
      },

      createSchema: async () => {
        set({ isLoading: true, error: null });

        try {
          // await wait(350);

          const schemas = get().schemas;

          const newSchema: Schema = {
            id: crypto.randomUUID(),
            name: getNextSchemaName(schemas),
            updatedAt: new Date().toISOString(),
            nodes: [],
            edges: [],
          };

          const nextSchemas = [newSchema, ...schemas];

          set({
            schemas: nextSchemas,
            activeSchemaId: newSchema.id,
            isLoading: false,
          });

          useChartStore.getState().setChart({
            nodes: [],
            edges: [],
          });

          return newSchema.id;
        } catch {
          set({
            isLoading: false,
            error: "Failed to create schema",
          });

          return null;
        }
      },

      saveActiveSchema: async () => {
        const { activeSchemaId, schemas } = get();
        if (!activeSchemaId) return;

        set({ isSaving: true, error: null });

        try {
          await wait(500);

          const { nodes, edges, markSaved } = useChartStore.getState();
          const now = new Date().toISOString();

          const nextSchemas = schemas.map((schema) =>
            schema.id === activeSchemaId
              ? {
                  ...schema,
                  nodes,
                  edges,
                  updatedAt: now,
                }
              : schema
          );

          set({
            schemas: nextSchemas,
            isSaving: false,
          });

          markSaved();
        } catch {
          set({
            isSaving: false,
            error: "Failed to save schema",
          });
        }
      },

      renameSchema: (schemaId, name) => {
        const trimmedName = name.trim();
        if (!trimmedName) return;

        const nextSchemas = get().schemas.map((schema) =>
          schema.id === schemaId
            ? {
                ...schema,
                name: trimmedName,
              }
            : schema
        );

        set({
          schemas: nextSchemas,
        });
      },

      deleteSchema: (schemaId) => {
        const { schemas, activeSchemaId } = get();

        const nextSchemas = schemas.filter((schema) => schema.id !== schemaId);

        const deletedWasActive = activeSchemaId === schemaId;
        const nextActiveSchema = deletedWasActive
          ? (nextSchemas[0] ?? null)
          : null;

        set({
          schemas: nextSchemas,
          activeSchemaId: deletedWasActive
            ? (nextActiveSchema?.id ?? null)
            : activeSchemaId,
        });

        if (deletedWasActive) {
          if (nextActiveSchema) {
            useChartStore.getState().setChart({
              nodes: nextActiveSchema.nodes,
              edges: nextActiveSchema.edges,
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
        schemas: state.schemas,
        activeSchemaId: state.activeSchemaId,
      }),
    }
  )
);
