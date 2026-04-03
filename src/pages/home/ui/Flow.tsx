"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  useViewport,
  BackgroundVariant,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodeDrag,
  type OnConnectEnd,
  type DefaultEdgeOptions,
  type NodeOrigin,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { DiamondNode } from "@/shared/ui/nodes/DiamondNode";
import { Button } from "@/shared/ui/Button";
import { Circle, Save } from "lucide-react";
import { CustomNode } from "@/shared/ui/nodes/CustomNode";
import { NodePicker } from "@/shared/ui/nodes/NodePicker";
import { CircleNode } from "@/shared/ui/nodes/CircleNode";
import { OvalNode } from "@/shared/ui/nodes/OvalNode";
import { ParallelogramNode } from "@/shared/ui/nodes/ParallelogramNode";

type CustomNodeData = {
  label: string;
  onAddClick?: (nodeId: string) => void;
};

export type NodeKind =
  | "oval"
  | "diamond"
  | "circle"
  | "parallelogram"
  | "customNode";

const nodeTypes = {
  oval: OvalNode,
  diamond: DiamondNode,
  circle: CircleNode,
  parallelogram: ParallelogramNode,
  customNode: CustomNode,
};

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const nodeOrigin: NodeOrigin = [0, 0];

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log("drag event", node.data);
};

let idCounter = 4;
const getId = () => `n${idCounter++}`;

export const Flow = () => {
  const [variant, setVariant] = useState<BackgroundVariant>(
    BackgroundVariant.Dots
  );

  const { screenToFlowPosition } = useReactFlow();
  const { x, y, zoom } = useViewport();

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
    (id: string, type: NodeKind, position: { x: number; y: number }): Node => {
      // Circle node
      if (type === "circle") {
        return {
          id,
          type: "circle",
          position,
          data: { label: "A", onAddClick: handleOpenNodePicker },
        };
      }

      // Diamond node
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

      // Default (custom node)
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

  const initialNodes = useMemo<Node<CustomNodeData>[]>(
    () => [createNode("3", "oval", { x: 100, y: 200 }, "Custom Node")],
    [createNode]
  );

  const [nodes, setNodes, onNodesChange] =
    useNodesState<Node<CustomNodeData>>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

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

  const addStandaloneCustomNode = useCallback(() => {
    const id = getId();

    setNodes((nds) =>
      nds.concat(
        createNode(
          id,
          "customNode",
          {
            x: 250,
            y: 150 + nds.length * 60,
          },
          `Node ${id}`
        )
      )
    );
  }, [createNode, setNodes]);

  const handleAddNodeFromPicker = useCallback(
    (type: NodeKind) => {
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

      const newId = getId();

      const newPosition = {
        x: sourceNode.position.x + offsetX,
        y: sourceNode.position.y + levelY,
      };

      const newNode = createNode(newId, type, newPosition);

      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [
        ...eds,
        {
          id: `e-${pickerState.sourceNodeId}-${newId}`,
          source: pickerState.sourceNodeId,
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

  const onConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.fromNode) return;
      if (connectionState.isValid) return;

      const id = getId();
      const { clientX, clientY } =
        "changedTouches" in event ? event.changedTouches[0] : event;

      const position = screenToFlowPosition({
        x: clientX,
        y: clientY,
      });

      const newNode = createNode(id, "customNode", position);

      setNodes((nds) => nds.concat(newNode));
      setEdges((eds) =>
        eds.concat({
          id: `e-${connectionState.fromNode.id}-${id}`,
          source: connectionState.fromNode.id,
          target: id,
          animated: true,
        })
      );
    },
    [screenToFlowPosition, createNode, setNodes, setEdges]
  );

  return (
    <section className="relative h-screen w-screen border-accent">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        onNodeDrag={onNodeDrag}
        fitView
        fitViewOptions={fitViewOptions}
        nodeOrigin={nodeOrigin}
        defaultEdgeOptions={defaultEdgeOptions}
        onPaneClick={handleCloseNodePicker}
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background color="#E0D9F5" variant={variant} size={3} />

        <Panel position="top-left" className="flex flex-col gap-2">
          <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white p-2 shadow">
            <Button variant="outline" onClick={addStandaloneCustomNode}>
              <Circle className="size-5 shrink-0" />
            </Button>
          </div>
        </Panel>

        {/* <Panel
          position="top-center"
          className="flex flex-col items-center gap-1"
        >
          <p>Variants</p>
          <div className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white p-2 shadow">
            <Button onClick={() => setVariant(BackgroundVariant.Dots)}>
              dots
            </Button>
            <Button onClick={() => setVariant(BackgroundVariant.Lines)}>
              lines
            </Button>
            <Button onClick={() => setVariant(BackgroundVariant.Cross)}>
              cross
            </Button>
          </div>
        </Panel> */}

        <Panel position="bottom-center">
          <Button
            variant="default"
            onClick={() => console.log({ nodes, edges })}
          >
            <Save className="mr-2 size-4" />
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
