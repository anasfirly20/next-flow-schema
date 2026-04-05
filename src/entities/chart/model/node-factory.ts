import type { ChartNode, CreateNodeParams } from "./nodes";

export function createChartNode({
  id,
  type,
  position,
  label,
}: CreateNodeParams): ChartNode {
  const defaultLabels: Record<CreateNodeParams["type"], string> = {
    customNode: `Node ${id}`,
    circle: "Connector",
    diamond: "Condition",
    oval: "Start",
    parallelogram: "Input / Output",
  };

  return {
    id,
    type,
    position,
    data: {
      label: label ?? defaultLabels[type],
    },
  };
}
