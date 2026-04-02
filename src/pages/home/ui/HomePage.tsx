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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  {
    id: "n1",
    data: { label: "Input Node" },
    position: { x: 250, y: 25 },
    style: { backgroundColor: "#6ede87", color: "white" },
  },
  {
    id: "n2",
    // you can also pass a React component as a label
    data: { label: <div>Default Node</div> },
    position: { x: 100, y: 125 },
    style: { backgroundColor: "#ff0072", color: "white" },
  },
  {
    id: "n3",
    data: { label: "Output Node" },
    position: { x: 0, y: 200 },
    style: { backgroundColor: "#6865A5", color: "white" },
  },
];
const initialEdges = [
  {
    id: "n1-n2",
    source: "n1",
    target: "n2",
    type: "step",
    label: "connects with",
  },
  { id: "n2-n3", source: "n2", target: "n3", animated: true },
];

export const HomePage = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [variant, setVariant] = useState("cross");

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <main className="min-h-screen">
      <section className="h-screen w-screen">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
        >
          <Controls />
          <MiniMap nodeStrokeWidth={3} zoomable pannable />
          <Background color="skyblue" variant={variant} />
          <Panel position="top-center">
            <div>variant:</div>
            <button onClick={() => setVariant("dots")}>dots</button>
            <button onClick={() => setVariant("lines")}>lines</button>
            <button onClick={() => setVariant("cross")}>cross</button>
          </Panel>
        </ReactFlow>
      </section>
    </main>
  );
};
