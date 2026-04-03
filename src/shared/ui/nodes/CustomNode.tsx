import { memo, useCallback } from "react";

import { Position, useNodeId, useReactFlow } from "@xyflow/react";
import { EllipsisVertical, Rocket, Trash } from "lucide-react";
import { Button } from "../Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "../DropDownMenu";
import {
  BaseNode,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
  BaseNodeContent,
} from "./BaseNode";
import { BaseHandle } from "../handles/BaseHandle";

export const CustomNode = memo(() => {
  const id = useNodeId();
  const { setNodes } = useReactFlow();

  const handleDelete = useCallback(() => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== id));
  }, [id, setNodes]);

  return (
    <BaseNode>
      <BaseNodeHeader className="border-b">
        <Rocket className="size-4" />
        <BaseNodeHeaderTitle>Node With Actions</BaseNodeHeaderTitle>

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
            <DropdownMenuItem>Action 1</DropdownMenuItem>
            <DropdownMenuItem>Action 2</DropdownMenuItem>
            <DropdownMenuItem>Action 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          className="nodrag p-1"
          onClick={handleDelete}
          aria-label="Delete Node"
          title="Delete Node"
        >
          <Trash className="size-4" />
        </Button>
      </BaseNodeHeader>
      <BaseNodeContent>
        <BaseHandle id="target-1" type="target" position={Position.Bottom} />
        <p>Add your content here.</p>
      </BaseNodeContent>
    </BaseNode>
  );
});
