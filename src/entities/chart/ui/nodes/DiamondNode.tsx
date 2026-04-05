import { useUpdateNodeData } from "@/entities/chart/lib/useUpdateNodeData";
import { EditableText } from "@/shared/ui/EditableText";
import {
  type ConnectionState,
  type Node,
  type NodeProps,
  Position,
  useConnection,
  useNodeId,
} from "@xyflow/react";
import { memo, useCallback, useState } from "react";
import { AddNodeHandle } from "../handles/AddNodeHandle";
import { BaseHandle } from "../handles/BaseHandle";
import { BaseNode } from "./BaseNode";

type DiamondNodeData = Node<{
  label: string;
  onAddClick?: (nodeId: string) => void;
}>;

const selector = (connection: ConnectionState) => connection.inProgress;

export const DiamondNode = memo(
  ({ data, selected }: NodeProps<DiamondNodeData>) => {
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
        className="relative flex h-36 w-36 items-center justify-center overflow-visible"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <BaseHandle id="target-top" type="target" position={Position.Top} />
        <BaseHandle id="target-right" type="target" position={Position.Right} />
        <BaseHandle
          id="source-bottom"
          type="source"
          position={Position.Bottom}
        />
        <BaseHandle id="target-left" type="target" position={Position.Left} />

        <BaseNode className="relative z-0 flex size-26 rotate-45 items-center justify-center rounded-sm">
          <div className="-rotate-45 px-2">
            <EditableText
              value={data.label}
              fallback="Condition"
              onCommit={(value) => updateNodeData({ label: value })}
            >
              <EditableText.Content className="max-w-25 text-xs font-medium text-text-primary" />
            </EditableText>
          </div>
        </BaseNode>

        <AddNodeHandle show={showAddButton} onClick={handleOpenPicker} />
      </div>
    );
  }
);
