import type { Edge, Node } from "@xyflow/react";

export const getFlowSnapshot = (nodes: Node[], edges: Edge[]) => {
  return JSON.stringify({
    nodes: nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: {
        ...node.data,
        onAddClick: undefined,
      },
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      sourceHandle: edge.sourceHandle ?? null,
      targetHandle: edge.targetHandle ?? null,
      label: edge.label ?? null,
      animated: !!edge.animated,
      type: edge.type ?? null,
    })),
  });
};
