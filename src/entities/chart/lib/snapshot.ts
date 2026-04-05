import { ChartEdge, ChartNode } from "../model/nodes";

function createChartSnapshot(nodes: ChartNode[], edges: ChartEdge[]) {
  return JSON.stringify({
    nodes: [...nodes]
      .map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)),
    edges: [...edges]
      .map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle ?? null,
        targetHandle: edge.targetHandle ?? null,
        label: edge.label ?? null,
        animated: !!edge.animated,
        type: edge.type ?? null,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)),
  });
}

function getDirtyState(
  nodes: ChartNode[],
  edges: ChartEdge[],
  lastSavedSnapshot: string | null
) {
  return createChartSnapshot(nodes, edges) !== lastSavedSnapshot;
}

export { createChartSnapshot, getDirtyState };
