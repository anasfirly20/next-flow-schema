"use client";

import { useScenarioStore } from "@/entities/scenario/api/scenario-store";
import { useEffect } from "react";
import { Flow } from "./Flow";

export const HomePage = () => {
  const loadScenarios = useScenarioStore((state) => state.loadScenarios);

  useEffect(() => {
    loadScenarios();
  }, [loadScenarios]);

  return (
    <main>
      <Flow />
    </main>
  );
};
