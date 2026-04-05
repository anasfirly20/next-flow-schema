import { useUpdateNodeData } from "@/shared/hooks/useUpdateNodeData";
import {
  type ConnectionState,
  type Node,
  type NodeProps,
  Position,
  useConnection,
  useNodeId,
} from "@xyflow/react";
import { memo, useCallback, useState } from "react";
import { EditableText } from "../EditableText";
import { AddNodeHandle } from "../handles/AddNodeHandle";
import { BaseHandle } from "../handles/BaseHandle";

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

    const handleOpenPicker = useCallback(() => {
      if (!id) return;
      data.onAddClick?.(id);
    }, [id, data]);

    const updateNodeData = useUpdateNodeData();
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
            <EditableText
              value={data.label}
              fallback="Input / Output"
              onCommit={(value) => updateNodeData({ label: value })}
            >
              <EditableText.Content className="max-w-36 text-xs font-medium text-text-primary" />
            </EditableText>
          </div>
        </div>

        <AddNodeHandle show={showAddButton} onClick={handleOpenPicker} />
      </div>
    );
  }
);
