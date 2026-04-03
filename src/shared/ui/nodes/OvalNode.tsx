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

type OvalNodeData = Node<{
  label: string;
  onAddClick?: (nodeId: string) => void;
}>;

const selector = (connection: ConnectionState) => connection.inProgress;

export const OvalNode = memo(({ data, selected }: NodeProps<OvalNodeData>) => {
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
      className="relative flex h-20 w-40 items-center justify-center overflow-visible"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <BaseHandle id="target-top" type="target" position={Position.Top} />
      <BaseHandle id="target-right" type="target" position={Position.Right} />
      <BaseHandle id="target-left" type="target" position={Position.Left} />

      <div className="flex h-full w-full items-center justify-center rounded-full border border-node-border bg-node-bg shadow-[0_8px_24px_var(--color-node-shadow)]">
        <input
          value={data.label ?? "Start"}
          onChange={handleChange}
          className="nodrag w-24 bg-transparent text-center text-sm font-medium text-text-primary outline-none placeholder:text-text-muted"
          placeholder="Start"
        />
      </div>

      <AddNodeHandle show={showAddButton} onClick={handleOpenPicker} />
    </div>
  );
});
