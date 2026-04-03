import { memo, useCallback, useState } from "react";
import type { ChangeEvent } from "react";
import {
  type Node,
  type NodeProps,
  Position,
  useConnection,
  useNodeId,
  useReactFlow,
  type ConnectionState,
} from "@xyflow/react";
import { BaseHandle } from "../handles/BaseHandle";
import { AddNodeHandle } from "../handles/AddNodeHandle";

type ParallelogramNodeData = Node<{
  label: string;
  onAddClick?: (nodeId: string) => void;
}>;

const selector = (connection: ConnectionState) => connection.inProgress;

export const ParallelogramNode = memo(
  ({ data, selected }: NodeProps<ParallelogramNodeData>) => {
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

    return (
      <div
        className="relative flex h-20 w-48 items-center justify-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <BaseHandle id="target-top" type="target" position={Position.Top} />
        <BaseHandle
          id="target-right"
          type="target"
          position={Position.Right}
          style={{
            right: 12,
          }}
        />
        <BaseHandle
          id="target-left"
          type="target"
          position={Position.Left}
          style={{
            left: 12,
          }}
        />

        <div className="relative h-full w-full">
          <div
            className="absolute inset-0 bg-node-border shadow-[0_8px_24px_var(--color-node-shadow)]"
            style={{
              clipPath: "polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)",
            }}
          />

          <div
            className="absolute inset-[1.5px] flex items-center justify-center bg-node-bg"
            style={{
              clipPath: "polygon(12% 0%, 100% 0%, 88% 100%, 0% 100%)",
            }}
          >
            <input
              value={data.label ?? "Input / Output"}
              onChange={handleChange}
              className="nodrag w-[72%] bg-transparent text-center text-sm font-medium text-text-primary outline-none placeholder:text-text-muted"
              placeholder="Input / Output"
            />
          </div>
        </div>

        <AddNodeHandle show={showAddButton} onClick={handleOpenPicker} />
      </div>
    );
  }
);
