import { Button } from "@/shared/ui/Button";
import { Position } from "@xyflow/react";
import { Plus } from "lucide-react";
import { ButtonHandle } from "./ButtonHandle";

type AddNodeHandleProps = {
  show: boolean;
  onClick: () => void;
  handleId?: string;
  position?: Position;
};

export function AddNodeHandle({
  show,
  onClick,
  handleId = "add-bottom",
  position = Position.Bottom,
}: AddNodeHandleProps) {
  return (
    <ButtonHandle
      id={handleId}
      type="source"
      position={position}
      showButton={show}
    >
      <Button
        onClick={onClick}
        size="sm"
        variant="default"
        className="nodrag size-7 shrink-0 rounded-full p-0 shadow-md"
      >
        <Plus size={10} />
      </Button>
    </ButtonHandle>
  );
}
