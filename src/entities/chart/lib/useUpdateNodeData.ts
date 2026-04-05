import { useNodeId, useReactFlow } from "@xyflow/react";
import { useCallback } from "react";

export function useUpdateNodeData<T extends Record<string, unknown>>() {
  const id = useNodeId();
  const { setNodes } = useReactFlow();

  const updateNodeData = useCallback(
    (partial: Partial<T>) => {
      if (!id) return;

      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  ...partial,
                },
              }
            : node
        )
      );
    },
    [id, setNodes]
  );

  return updateNodeData;
}
