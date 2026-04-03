import { memo, useCallback, useState } from "react";
import type { ChangeEvent } from "react";
import {
  type Node,
  type NodeProps,
  type ConnectionState,
  Position,
  useConnection,
  useNodeId,
  useReactFlow,
} from "@xyflow/react";
import { BaseHandle } from "../handles/BaseHandle";
import { AddNodeHandle } from "../handles/AddNodeHandle";

type CircleNodeData = Node<{
  label: string;
  onAddClick?: (nodeId: string) => void;
}>;

const selector = (connection: ConnectionState) => connection.inProgress;

export const CircleNode = memo(
  ({ data, selected, width, height }: NodeProps<CircleNodeData>) => {
    const id = useNodeId();
    const connectionInProgress = useConnection(selector);
    const [isHovered, setIsHovered] = useState(false);

    const { setNodes } = useReactFlow();

    const handleChange = useCallback(
      (evt: ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;

        if (!id) return;

        setNodes((nodes) =>
          nodes.map((node) =>
            node.id === id
              ? {
                  ...node,
                  data: {
                    ...node.data,
                    label: value,
                  },
                }
              : node
          )
        );
      },
      [id, setNodes]
    );

    const handleOpenPicker = useCallback(() => {
      if (!id) return;
      data.onAddClick?.(id);
    }, [id, data]);

    const showAddButton = !connectionInProgress && (isHovered || selected);

    const nodeSize = Math.max(width ?? 96, height ?? 96, 96);

    return (
      <div
        className="relative flex size-24 items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <BaseHandle id="target-top" type="target" position={Position.Top} />
        <BaseHandle id="source-right" type="target" position={Position.Right} />
        <BaseHandle
          id="source-bottom"
          type="source"
          position={Position.Bottom}
        />
        <BaseHandle id="target-left" type="target" position={Position.Left} />

        <div className="flex h-full w-full items-center justify-center rounded-full border border-node-border bg-node-bg shadow-[0_6px_20px_var(--color-node-shadow)]">
          <input
            value={data.label ?? "A"}
            onChange={handleChange}
            className="nodrag w-12 bg-transparent text-center text-sm font-medium text-text-primary outline-none placeholder:text-text-muted"
            placeholder="A"
          />
        </div>

        <AddNodeHandle show={showAddButton} onClick={handleOpenPicker} />
      </div>
    );
  }
);
