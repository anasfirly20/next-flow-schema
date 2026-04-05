"use client";

import { useSchemaStore } from "@/entities/schema/api/schema-store";
import { useEffect } from "react";
import { FlowEditor } from "./FlowEditor";

export const HomePage = () => {
  const loadSchemas = useSchemaStore((state) => state.loadSchemas);

  useEffect(() => {
    loadSchemas();
  }, [loadSchemas]);

  return (
    <main>
      <FlowEditor />
    </main>
  );
};
