import {
  CircleNode,
  CustomNode,
  DiamondNode,
  OvalNode,
  ParallelogramNode,
} from "@/shared/ui";

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
