"use client";

import { useSchemaStore } from "@/entities/schema/api/schema-store";
import { FlowEditor } from "@/widgets/flow-editor";
import { useEffect } from "react";

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
