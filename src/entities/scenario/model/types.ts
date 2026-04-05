import { ChartEdge, ChartNode } from "@/entities/chart/model/nodes";

export interface Scenario {
  id: string;
  name: string;
  updatedAt: string;
  nodes: ChartNode[];
  edges: ChartEdge[];
}
