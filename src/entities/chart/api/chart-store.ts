import type { EdgeChange, NodeChange, XYPosition } from "@xyflow/react";
import { applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { create } from "zustand";
import { createChartNode } from "../model/node-factory";
import type { ChartEdge, ChartNode, NodeTypes } from "../model/nodes";

type ChartStore = {
  nodes: ChartNode[];
  edges: ChartEdge[];

  setNodes: (
    updater: ChartNode[] | ((nodes: ChartNode[]) => ChartNode[])
  ) => void;
  setEdges: (
    updater: ChartEdge[] | ((edges: ChartEdge[]) => ChartEdge[])
  ) => void;

  setChart: (payload: { nodes: ChartNode[]; edges: ChartEdge[] }) => void;
  resetChart: () => void;

  onNodesChange: (changes: NodeChange<ChartNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<ChartEdge>[]) => void;

  getNextNodeId: () => string;
  createNode: (
    type: NodeTypes,
    position: XYPosition,
    label?: string
  ) => ChartNode;

  addNodeWithEdge: (params: {
    sourceNodeId: string;
    type: NodeTypes;
    label?: string;
  }) => void;

  addStandaloneNode: (params: {
    type: NodeTypes;
    position?: XYPosition;
    label?: string;
  }) => void;
};

export const useChartStore = create<ChartStore>((set, get) => ({
  nodes: [],
  edges: [],

  setNodes: (updater) =>
    set((state) => ({
      nodes: typeof updater === "function" ? updater(state.nodes) : updater,
    })),

  setEdges: (updater) =>
    set((state) => ({
      edges: typeof updater === "function" ? updater(state.edges) : updater,
    })),

  setChart: ({ nodes, edges }) => set({ nodes, edges }),

  resetChart: () => set({ nodes: [], edges: [] }),

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges<ChartNode>(changes, state.nodes),
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges<ChartEdge>(changes, state.edges),
    })),

  getNextNodeId: () => {
    const nodes = get().nodes;
    const numericIds = nodes
      .map((node) => Number(node.id.replace(/^n?/, "")))
      .filter((value) => !Number.isNaN(value));

    const next = numericIds.length ? Math.max(...numericIds) + 1 : 1;
    return `${next}`;
  },

  createNode: (type, position, label) => {
    const id = get().getNextNodeId();

    return createChartNode({
      id,
      type,
      position,
      label,
    });
  },

  addNodeWithEdge: ({ sourceNodeId, type, label }) => {
    const { nodes, edges, createNode } = get();

    const sourceNode = nodes.find((node) => node.id === sourceNodeId);
    if (!sourceNode) return;

    const sourceChildren = edges.filter((edge) => edge.source === sourceNodeId);
    const childCount = sourceChildren.length;

    const spacingX = 220;
    const levelY = 180;

    let offsetX = 0;

    if (childCount === 0) {
      offsetX = 0;
    } else {
      const direction = childCount % 2 === 1 ? -1 : 1;
      const step = Math.ceil(childCount / 2);
      offsetX = direction * step * spacingX;
    }

    const newPosition = {
      x: sourceNode.position.x + offsetX,
      y: sourceNode.position.y + levelY,
    };

    const newNode = createNode(type, newPosition, label);

    set((state) => ({
      nodes: [...state.nodes, newNode],
      edges: [
        ...state.edges,
        {
          id: `e-${sourceNodeId}-${newNode.id}`,
          source: sourceNodeId,
          target: newNode.id,
          animated: true,
        },
      ],
    }));
  },

  addStandaloneNode: ({ type, position, label }) => {
    const newNode = get().createNode(
      type,
      position ?? { x: 300, y: 180 },
      label
    );

    set((state) => ({
      nodes: [...state.nodes, newNode],
    }));
  },
}));
