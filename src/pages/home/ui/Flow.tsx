"use client";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  useViewport,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useMemo, useState } from "react";

import {
  NODES,
  NodeTypes,
  useChartStore,
  type ChartEdge,
  type ChartNode,
} from "@/entities/chart";
import { useScenarioStore } from "@/entities/scenario/api/scenario-store";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/Button";
import { NodePicker } from "@/shared/ui/nodes/NodePicker";
import { SidebarTrigger } from "@/shared/ui/Sidebar";
import { Save } from "lucide-react";

type PickerState = {
  open: boolean;
  sourceNodeId: string | null;
  sourceHandleId: string | null;
  mode: "empty" | "connected";
};

export const Flow = () => {
  const { x, y, zoom } = useViewport();

  const nodes = useChartStore((state) => state.nodes);
  const edges = useChartStore((state) => state.edges);
  const setNodes = useChartStore((state) => state.setNodes);
  const setEdges = useChartStore((state) => state.setEdges);
  const addNodeWithEdge = useChartStore((state) => state.addNodeWithEdge);
  const addStandaloneNode = useChartStore((state) => state.addStandaloneNode);
  const saveActiveScenario = useScenarioStore(
    (state) => state.saveActiveScenario
  );
  const isSaving = useScenarioStore((state) => state.isSaving);

  const [pickerState, setPickerState] = useState<PickerState>({
    open: false,
    sourceNodeId: null,
    sourceHandleId: null,
    mode: "connected",
  });

  const handleOpenNodePicker = useCallback(
    (nodeId: string, sourceHandleId: string) => {
      setPickerState({
        open: true,
        sourceNodeId: nodeId,
        sourceHandleId,
        mode: "connected",
      });
    },
    []
  );

  const handleOpenEmptyNodePicker = useCallback(() => {
    setPickerState({
      open: true,
      sourceNodeId: null,
      sourceHandleId: null,
      mode: "empty",
    });
  }, []);

  const handleCloseNodePicker = useCallback(() => {
    setPickerState({
      open: false,
      sourceNodeId: null,
      sourceHandleId: null,
      mode: "connected",
    });
  }, []);

  const chartNodes = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onAddClick: handleOpenNodePicker,
        },
      })),
    [nodes, handleOpenNodePicker]
  );

  const handleAddNodeFromPicker = useCallback(
    (type: NodeTypes) => {
      if (pickerState.mode === "empty") {
        addStandaloneNode({
          type,
          position: { x: 420, y: 180 },
        });

        handleCloseNodePicker();
        return;
      }

      if (!pickerState.sourceNodeId) return;

      addNodeWithEdge({
        sourceNodeId: pickerState.sourceNodeId,
        type,
      });

      handleCloseNodePicker();
    },
    [
      pickerState.mode,
      pickerState.sourceNodeId,
      addStandaloneNode,
      addNodeWithEdge,
      handleCloseNodePicker,
    ]
  );

  const onNodesChange: OnNodesChange<ChartNode> = useCallback(
    (changes) => {
      setNodes((nds) => applyNodeChanges<ChartNode>(changes, nds));
    },
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange<ChartEdge> = useCallback(
    (changes) => {
      setEdges((eds) => applyEdgeChanges<ChartEdge>(changes, eds));
    },
    [setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => {
      setEdges((eds) => addEdge({ ...connection, animated: true }, eds));
    },
    [setEdges]
  );

  const pickerPosition = useMemo(() => {
    if (!pickerState.open || pickerState.mode !== "connected") return null;
    if (!pickerState.sourceNodeId) return null;

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
  }, [
    pickerState.open,
    pickerState.mode,
    pickerState.sourceNodeId,
    nodes,
    x,
    y,
    zoom,
  ]);

  const showEmptyState =
    nodes.length === 0 && !(pickerState.open && pickerState.mode === "empty");

  const showEmptyNodePicker =
    nodes.length === 0 && pickerState.open && pickerState.mode === "empty";

  return (
    <section className="relative h-dvh border-accent">
      <Panel position="top-left">
        <SidebarTrigger />
      </Panel>

      <ReactFlow
        nodes={chartNodes}
        edges={edges}
        nodeTypes={NODES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        onPaneClick={handleCloseNodePicker}
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background
          color="oklch(0.9 0.01 20)"
          variant={BackgroundVariant.Dots}
          size={3}
        />

        {showEmptyState && (
          <Panel position="top-center">
            <div className="mt-24 flex min-w-80 flex-col items-center rounded-2xl border border-node-border/20 bg-white p-6 text-center shadow-lg backdrop-blur-sm">
              <h2 className="text-lg font-semibold text-text-primary">
                This scenario is empty
              </h2>

              <p className="mt-2 text-sm text-text-muted">
                Add the first node to start building the flow.
              </p>

              <Button className="mt-4" onClick={handleOpenEmptyNodePicker}>
                Add first node
              </Button>
            </div>
          </Panel>
        )}

        {showEmptyNodePicker && (
          <Panel position="top-center">
            <div className="mt-24">
              <NodePicker
                inline
                position={null}
                onClose={handleCloseNodePicker}
                onSelect={handleAddNodeFromPicker}
              />
            </div>
          </Panel>
        )}

        <Panel position="bottom-center">
          <Button variant="default" onClick={saveActiveScenario}>
            <Save className={cn("mr-2 size-4")} />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </Panel>
      </ReactFlow>

      {pickerState.open && pickerState.mode === "connected" && (
        <NodePicker
          position={pickerPosition}
          onClose={handleCloseNodePicker}
          onSelect={handleAddNodeFromPicker}
        />
      )}
    </section>
  );
};
