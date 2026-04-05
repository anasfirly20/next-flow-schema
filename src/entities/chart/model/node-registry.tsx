import type { Edge, Node, XYPosition } from "@xyflow/react";

import { CircleNode } from "@/entities/chart/ui/nodes/CircleNode";
import { CustomNode } from "@/entities/chart/ui/nodes/CustomNode";
import { DiamondNode } from "@/entities/chart/ui/nodes/DiamondNode";
import { OvalNode } from "@/entities/chart/ui/nodes/OvalNode";
import { ParallelogramNode } from "@/entities/chart/ui/nodes/ParallelogramNode";

const NODES = {
  oval: OvalNode,
  diamond: DiamondNode,
  circle: CircleNode,
  parallelogram: ParallelogramNode,
  customNode: CustomNode,
};

type NodeTypes = keyof typeof NODES;

type ChartNodeData = {
  label: string;
};

type ChartNode = Node<ChartNodeData, NodeTypes>;
type ChartEdge = Edge;

type CreateNodeParams = {
  id: string;
  type: NodeTypes;
  position: XYPosition;
  label?: string;
};

export { NODES };
export type { ChartEdge, ChartNode, CreateNodeParams, NodeTypes };
