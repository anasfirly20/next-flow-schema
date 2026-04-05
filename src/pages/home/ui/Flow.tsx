"use client";

import {
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  type FitViewOptions,
  MiniMap,
  type Node,
  type OnConnect,
  Panel,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
  useViewport,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useMemo, useState } from "react";

import { NODE_TYPES, NodeTypes } from "@/entities/flow-data";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/Button";
import { NodePicker } from "@/shared/ui/nodes/NodePicker";
import { Save } from "lucide-react";

const fitViewOptions: FitViewOptions = {
  padding: 0.8,
};

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    animated: true,
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    animated: true,
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    animated: true,
    label: "No",
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    animated: true,
    label: "Yes",
  },
];

export const Flow = () => {
  const { x, y, zoom } = useViewport();
  const { getNodes } = useReactFlow();
  const getNextNodeId = useCallback(() => {
    const nodes = getNodes();

    const numericIds = nodes
      .map((node) => Number(node.id.replace(/^n?/, "")))
      .filter((value) => !Number.isNaN(value));

    const next = numericIds.length ? Math.max(...numericIds) + 1 : 1;

    return `n${next}`;
  }, [getNodes]);
  const newId = getNextNodeId();

  const [pickerState, setPickerState] = useState<{
    open: boolean;
    sourceNodeId: string | null;
    sourceHandleId: string | null;
  }>({
    open: false,
    sourceNodeId: null,
    sourceHandleId: null,
  });

  const handleOpenNodePicker = useCallback(
    (nodeId: string, sourceHandleId: string) => {
      setPickerState({
        open: true,
        sourceNodeId: nodeId,
        sourceHandleId,
      });
    },
    []
  );

  const handleCloseNodePicker = useCallback(() => {
    setPickerState({
      open: false,
      sourceNodeId: null,
      sourceHandleId: null,
    });
  }, []);

  const createNode = useCallback(
    (id: string, type: NodeTypes, position: { x: number; y: number }): Node => {
      if (type === "circle") {
        return {
          id,
          type: "circle",
          position,
          data: { label: "Connector", onAddClick: handleOpenNodePicker },
        };
      }

      if (type === "diamond") {
        return {
          id,
          type: "diamond",
          position,
          data: { label: "Condition", onAddClick: handleOpenNodePicker },
        };
      }

      if (type === "oval") {
        return {
          id,
          type: "oval",
          position,
          data: {
            label: "Start",
            onAddClick: handleOpenNodePicker,
          },
        };
      }

      if (type === "parallelogram") {
        return {
          id,
          type: "parallelogram",
          position,
          data: {
            label: "Input / Output",
            onAddClick: handleOpenNodePicker,
          },
        };
      }

      return {
        id,
        type: "customNode",
        position,
        data: {
          label: `Node ${id}`,
          onAddClick: handleOpenNodePicker,
        },
      };
    },
    [handleOpenNodePicker]
  );

  const initialNodes = useMemo<Node[]>(
    () => [
      {
        ...createNode("1", "oval", { x: 320, y: 40 }),
        data: {
          ...createNode("1", "oval", { x: 320, y: 40 }).data,
          label: "Start",
        },
      },
      {
        ...createNode("2", "parallelogram", { x: 260, y: 180 }),
        data: {
          ...createNode("2", "parallelogram", { x: 260, y: 180 }).data,
          label: "Enter email & password",
        },
      },
      {
        ...createNode("3", "diamond", { x: 300, y: 360 }),
        data: {
          ...createNode("3", "diamond", { x: 300, y: 360 }).data,
          label: "Credentials valid?",
        },
      },
      {
        ...createNode("4", "oval", { x: 120, y: 560 }),
        data: {
          ...createNode("4", "oval", { x: 120, y: 560 }).data,
          label: "Access denied",
        },
      },
      {
        ...createNode("5", "oval", { x: 500, y: 560 }),
        data: {
          ...createNode("5", "oval", { x: 500, y: 560 }).data,
          label: "Dashboard",
        },
      },
    ],
    [createNode]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges);

  const pickerPosition = useMemo(() => {
    if (!pickerState.open || !pickerState.sourceNodeId) return null;

    const sourceNode = nodes.find(
      (node) => node.id === pickerState.sourceNodeId
    );
    if (!sourceNode) return null;

    const nodeWidth = sourceNode.measured?.width ?? 240;
    const nodeHeight = sourceNode.measured?.height ?? 120;

    const flowX = sourceNode.position.x + nodeWidth / 2;
    const flowY = sourceNode.position.y + nodeHeight + 56;

    return {
      left: flowX * zoom + x,
      top: flowY * zoom + y,
    };
  }, [pickerState.open, pickerState.sourceNodeId, nodes, x, y, zoom]);

  const handleAddNodeFromPicker = useCallback(
    (type: NodeTypes) => {
      if (!pickerState.sourceNodeId) return;

      const sourceNode = nodes.find(
        (node) => node.id === pickerState.sourceNodeId
      );
      if (!sourceNode) return;

      const sourceChildren = edges.filter(
        (edge) => edge.source === pickerState.sourceNodeId
      );

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

      const newNode = createNode(newId, type, newPosition);

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [
        ...eds,
        {
          id: `e-${pickerState.sourceNodeId}-${newId}` || "",
          source: pickerState.sourceNodeId || "",
          target: newId,
          animated: true,
        },
      ]);

      handleCloseNodePicker();
    },
    [
      pickerState.sourceNodeId,
      nodes,
      edges,
      createNode,
      setNodes,
      setEdges,
      handleCloseNodePicker,
    ]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges]
  );

  return (
    <section className="relative h-screen w-screen border-accent">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        fitViewOptions={fitViewOptions}
        onPaneClick={handleCloseNodePicker}
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background color="#E0D9F5" variant={BackgroundVariant.Dots} size={3} />

        <Panel position="bottom-center">
          <Button variant="default">
            <Save className={cn("mr-2 size-4")} />
            Save
          </Button>
        </Panel>
      </ReactFlow>

      <NodePicker
        open={pickerState.open}
        position={pickerPosition}
        onClose={handleCloseNodePicker}
        onSelect={handleAddNodeFromPicker}
      />
    </section>
  );
};
