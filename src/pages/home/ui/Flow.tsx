"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Panel,
  useReactFlow,
  BackgroundVariant,
  type Node,
  type Edge,
  type FitViewOptions,
  type OnConnect,
  type OnNodesChange,
  type OnEdgesChange,
  type OnNodeDrag,
  type OnConnectEnd,
  type DefaultEdgeOptions,
  type NodeOrigin,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { DiamondNode } from "@/shared/ui/nodes/DiamondNode";
import { TextUpdaterNode } from "@/shared/ui/nodes/TextUpdaterNode";
import { Button } from "@/shared/ui/Button";
import { Circle, Diamond, Save, Square } from "lucide-react";
import { ActionBarNodeDemo } from "@/shared/ui/nodes/ActionBarNodeDemo";
import { DevTools } from "@/shared/ui/Devtools";
import ButtonHandleDemo from "@/shared/ui/handles/ButtonHandleDemo";

const nodeTypes = {
  textUpdater: TextUpdaterNode,
  diamond: DiamondNode,
  actionBarNode: ActionBarNodeDemo,
  buttonHandle: ButtonHandleDemo,
};

const initialNodes: Node[] = [
  // {
  //   id: "0",
  //   type: "textUpdater",
  //   data: { label: "Node" },
  //   position: { x: 0, y: 0 },
  // },
  //   {
  //     id: "1",
  //     type: "default",
  //     data: { label: "Node" },
  //     position: { x: 0, y: 0 },
  //   },
  //   {
  //     id: "2",
  //     type: "actionBarNode",
  //     data: { label: "Node" },
  //     position: { x: 50, y: 100 },
  //   },
  {
    id: "3",
    type: "buttonHandle",
    data: { label: "buttonHandle" },
    position: { x: 100, y: 200 },
  },
];

const initialEdges: Edge[] = [];

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

let id = initialNodes.length + 1;
const getId = () => `n${id++}`;
const nodeOrigin: NodeOrigin = [0, 0];

const defaultEdgeOptions: DefaultEdgeOptions = {
  animated: true,
};

const onNodeDrag: OnNodeDrag = (_, node) => {
  console.log("drag event", node.data);
};

export const Flow = () => {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [variant, setVariant] = useState<BackgroundVariant>(
    BackgroundVariant.Dots
  );
  const { screenToFlowPosition } = useReactFlow();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const onConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: `Node ${id}` },
          origin: [0.0, 0.0],
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectionState.fromNode.id, target: id })
        );
      }
    },
    [screenToFlowPosition]
  );

  return (
    <section className="h-screen w-screen border-accent">
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
      >
        <Controls />
        <MiniMap nodeStrokeWidth={3} zoomable pannable />
        <Background color="#E0D9F5" variant={variant} size={3} />
        <Panel position="top-left" className="flex flex-col gap-2">
          <p>Drag shapes to the canvas</p>
          <div className="flex items-center gap-2 rounded-md border border-gray-300 bg-white p-2 shadow">
            <Button variant="outline" onClick={() => {}}>
              <Circle className="size-5 shrink-0" />
            </Button>
            <Button variant="outline" onClick={() => {}}>
              <Square className="size-5 shrink-0" />
            </Button>
            <Button variant="outline" onClick={() => {}}>
              <Diamond className="size-5 shrink-0" />
            </Button>
          </div>
        </Panel>
        <Panel
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
        </Panel>

        <Panel position="bottom-center">
          <Button variant="default" onClick={() => {}}>
            <Save />
            Save
          </Button>
        </Panel>
        {/* <DevTools position="top-right" /> */}
      </ReactFlow>
    </section>
  );
};
