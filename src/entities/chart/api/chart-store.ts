import type { EdgeChange, NodeChange, XYPosition } from "@xyflow/react";
import { applyEdgeChanges, applyNodeChanges } from "@xyflow/react";
import { create } from "zustand";
import { createChartSnapshot, getDirtyState } from "../lib/snapshot";
import { createChartNode } from "../model/node-factory";
import type { ChartEdge, ChartNode, NodeTypes } from "../model/nodes";

type ChartStore = {
  nodes: ChartNode[];
  edges: ChartEdge[];
  lastSavedSnapshot: string | null;
  isDirty: boolean;

  setNodes: (
    updater: ChartNode[] | ((nodes: ChartNode[]) => ChartNode[])
  ) => void;
  setEdges: (
    updater: ChartEdge[] | ((edges: ChartEdge[]) => ChartEdge[])
  ) => void;

  setChart: (payload: { nodes: ChartNode[]; edges: ChartEdge[] }) => void;
  resetChart: () => void;
  markSaved: () => void;

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
  lastSavedSnapshot: null,
  isDirty: false,

  setNodes: (updater) =>
    set((state) => {
      const nextNodes =
        typeof updater === "function" ? updater(state.nodes) : updater;

      return {
        nodes: nextNodes,
        isDirty: getDirtyState(nextNodes, state.edges, state.lastSavedSnapshot),
      };
    }),

  setEdges: (updater) =>
    set((state) => {
      const nextEdges =
        typeof updater === "function" ? updater(state.edges) : updater;

      return {
        edges: nextEdges,
        isDirty: getDirtyState(state.nodes, nextEdges, state.lastSavedSnapshot),
      };
    }),

  setChart: ({ nodes, edges }) => {
    const snapshot = createChartSnapshot(nodes, edges);

    set({
      nodes,
      edges,
      lastSavedSnapshot: snapshot,
      isDirty: false,
    });
  },

  resetChart: () => {
    const snapshot = createChartSnapshot([], []);

    set({
      nodes: [],
      edges: [],
      lastSavedSnapshot: snapshot,
      isDirty: false,
    });
  },

  markSaved: () =>
    set((state) => {
      const snapshot = createChartSnapshot(state.nodes, state.edges);

      return {
        lastSavedSnapshot: snapshot,
        isDirty: false,
      };
    }),

  onNodesChange: (changes) =>
    set((state) => {
      const nextNodes = applyNodeChanges<ChartNode>(changes, state.nodes);

      return {
        nodes: nextNodes,
        isDirty: getDirtyState(nextNodes, state.edges, state.lastSavedSnapshot),
      };
    }),

  onEdgesChange: (changes) =>
    set((state) => {
      const nextEdges = applyEdgeChanges<ChartEdge>(changes, state.edges);

      return {
        edges: nextEdges,
        isDirty: getDirtyState(state.nodes, nextEdges, state.lastSavedSnapshot),
      };
    }),

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
    const { nodes, edges, createNode, lastSavedSnapshot } = get();

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

    const nextNodes = [...nodes, newNode];
    const nextEdges = [
      ...edges,
      {
        id: `e-${sourceNodeId}-${newNode.id}`,
        source: sourceNodeId,
        target: newNode.id,
        animated: true,
      },
    ];

    set({
      nodes: nextNodes,
      edges: nextEdges,
      isDirty: getDirtyState(nextNodes, nextEdges, lastSavedSnapshot),
    });
  },

  addStandaloneNode: ({ type, position, label }) => {
    const { nodes, edges, lastSavedSnapshot } = get();

    const newNode = get().createNode(
      type,
      position ?? { x: 300, y: 180 },
      label
    );

    const nextNodes = [...nodes, newNode];

    set({
      nodes: nextNodes,
      isDirty: getDirtyState(nextNodes, edges, lastSavedSnapshot),
    });
  },
}));
