import { Plus } from "lucide-react";
import {
  ConnectionState,
  Position,
  useConnection,
  useNodeId,
  useReactFlow,
} from "@xyflow/react";
import { Button } from "../Button";
import { BaseNode, BaseNodeContent } from "../nodes/BaseNode";
import { ButtonHandle } from "./ButtonHandle";

const onClick = () => {
  window.alert(`Handle button has been clicked!`);
};

const selector = (connection: ConnectionState) => {
  return connection.inProgress;
};

const ButtonHandleDemo = () => {
  const connectionInProgress = useConnection(selector);
  const id = useNodeId();
  const { setNodes } = useReactFlow();

  return (
    <BaseNode>
      <BaseNodeContent className="rounded-md bg-white">
        Node with a handle button
        <ButtonHandle
          type="target"
          position={Position.Bottom}
          showButton={!connectionInProgress}
        >
          <Button
            onClick={onClick}
            size="sm"
            variant="default"
            className="rounded-full"
          >
            <Plus size={10} />
          </Button>
        </ButtonHandle>
      </BaseNodeContent>
    </BaseNode>
  );
};

export default ButtonHandleDemo;
