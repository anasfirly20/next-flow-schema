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

type OvalNodeData = Node<{
  label: string;
  onAddClick?: (nodeId: string) => void;
}>;

const selector = (connection: ConnectionState) => connection.inProgress;

export const OvalNode = memo(({ data, selected }: NodeProps<OvalNodeData>) => {
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
    <BaseNode
      className="relative flex h-20 w-40 items-center justify-center overflow-visible rounded-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <BaseHandle id="target-top" type="target" position={Position.Top} />
      <BaseHandle id="target-right" type="target" position={Position.Right} />
      <BaseHandle id="target-left" type="target" position={Position.Left} />

      <EditableText
        value={data.label}
        fallback="Start"
        onCommit={(value) => updateNodeData({ label: value })}
      >
        <EditableText.Content className="max-w-36 text-xs font-medium text-text-primary" />
      </EditableText>

      <AddNodeHandle show={showAddButton} onClick={handleOpenPicker} />
    </BaseNode>
  );
});
