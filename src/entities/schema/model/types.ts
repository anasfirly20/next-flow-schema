import { ChartEdge, ChartNode } from "@/entities/chart/model/node-registry";

export interface Schema {
  id: string;
  name: string;
  updatedAt: string;
  nodes: ChartNode[];
  edges: ChartEdge[];
}
