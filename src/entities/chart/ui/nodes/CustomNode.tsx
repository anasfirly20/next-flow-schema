import { Button } from "@/shared/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/DropDownMenu";
import {
  type Node,
  ConnectionState,
  NodeProps,
  Position,
  useConnection,
  useNodeId,
  useReactFlow,
} from "@xyflow/react";
import { EllipsisVertical, Plus } from "lucide-react";
import { memo, useCallback, useState } from "react";
import { BaseHandle } from "../handles/BaseHandle";
import { ButtonHandle } from "../handles/ButtonHandle";
import {
  BaseNode,
  BaseNodeContent,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "./BaseNode";

type CustomNodeData = Node<{
  label: string;
  onAddClick?: (nodeId: string) => void;
}>;

const selector = (connection: ConnectionState) => connection.inProgress;

export const CustomNode = memo(
  ({ data, selected }: NodeProps<CustomNodeData>) => {
    const connectionInProgress = useConnection(selector);
    const id = useNodeId();
    const { setNodes, setEdges } = useReactFlow();
    const [isHovered, setIsHovered] = useState(false);

    const handleDelete = useCallback(() => {
      if (!id) return;

      setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
      setEdges((prevEdges) =>
        prevEdges.filter((edge) => edge.source !== id && edge.target !== id)
      );
    }, [id, setNodes, setEdges]);

    const handleOpenPicker = useCallback(() => {
      if (!id) return;
      data.onAddClick?.(id);
    }, [id, data]);

    const showAddButton = Boolean(
      !connectionInProgress && (isHovered || selected)
    );

    return (
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <BaseNode>
          <BaseNodeHeader className="border-b">
            <BaseNodeHeaderTitle>{data.label}</BaseNodeHeaderTitle>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="nodrag p-1"
                  aria-label="Node Actions"
                  title="Node Actions"
                >
                  <EllipsisVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuLabel>Node Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete}>
                  Delete Node
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </BaseNodeHeader>

          <BaseNodeContent>
            <BaseHandle id="target-1" type="target" position={Position.Top} />

            <p>Add your content here.</p>

            <ButtonHandle
              id="source-1"
              type="source"
              position={Position.Bottom}
              showButton={showAddButton}
            >
              <Button
                onClick={handleOpenPicker}
                size="sm"
                variant="default"
                className="nodrag h-8 w-8 rounded-full p-0 shadow-md"
              >
                <Plus size={12} />
              </Button>
            </ButtonHandle>
          </BaseNodeContent>
        </BaseNode>
      </div>
    );
  }
);
