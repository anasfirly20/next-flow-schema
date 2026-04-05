import { createChartNode } from "@/entities/chart/model/node-factory";
import { ChartEdge } from "@/entities/chart/model/nodes";
import type { Schema } from "./types";

const loginEdges: ChartEdge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e2-3", source: "2", target: "3", animated: true },
  { id: "e3-4", source: "3", target: "4", animated: true, label: "No" },
  { id: "e3-5", source: "3", target: "5", animated: true, label: "Yes" },
];

export const mockSchemas: Schema[] = [
  {
    id: "schema-1",
    name: "Login flow",
    updatedAt: new Date().toISOString(),
    nodes: [
      createChartNode({
        id: "1",
        type: "oval",
        position: { x: 320, y: 40 },
        label: "Start",
      }),
      createChartNode({
        id: "2",
        type: "parallelogram",
        position: { x: 260, y: 180 },
        label: "Enter email & password",
      }),
      createChartNode({
        id: "3",
        type: "diamond",
        position: { x: 300, y: 360 },
        label: "Credentials valid?",
      }),
      createChartNode({
        id: "4",
        type: "oval",
        position: { x: 120, y: 560 },
        label: "Access denied",
      }),
      createChartNode({
        id: "5",
        type: "oval",
        position: { x: 500, y: 560 },
        label: "Dashboard",
      }),
    ],
    edges: loginEdges,
  },
  {
    id: "schema-2",
    name: "Signup flow",
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    nodes: [
      createChartNode({
        id: "1",
        type: "oval",
        position: { x: 320, y: 40 },
        label: "Start",
      }),
      createChartNode({
        id: "2",
        type: "parallelogram",
        position: { x: 250, y: 180 },
        label: "Fill signup form",
      }),
      createChartNode({
        id: "3",
        type: "diamond",
        position: { x: 300, y: 360 },
        label: "Email unique?",
      }),
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e2-3", source: "2", target: "3", animated: true },
    ],
  },
];
