import { CircleNode } from "@/shared/ui/nodes/CircleNode";
import { CustomNode } from "@/shared/ui/nodes/CustomNode";
import { DiamondNode } from "@/shared/ui/nodes/DiamondNode";
import { OvalNode } from "@/shared/ui/nodes/OvalNode";
import { ParallelogramNode } from "@/shared/ui/nodes/ParallelogramNode";

const NODE_TYPES = {
  oval: OvalNode,
  diamond: DiamondNode,
  circle: CircleNode,
  parallelogram: ParallelogramNode,
  customNode: CustomNode,
};

type NodeTypes = keyof typeof NODE_TYPES;

export { NODE_TYPES };
export type { NodeTypes };
