import { Position, type HandleProps } from "@xyflow/react";
import { BaseHandle } from "./BaseHandle";
import { cn } from "@/shared/lib/cn";

const wrapperClassNames: Record<Position, string> = {
  [Position.Top]:
    "flex-col-reverse left-1/2 -translate-x-1/2 -translate-y-full",
  [Position.Bottom]: "flex-col left-1/2 -translate-x-1/2 translate-y-[5px]",
  [Position.Left]:
    "flex-row-reverse top-1/2 -translate-y-1/2 -translate-x-full",
  [Position.Right]: "top-1/2 -translate-y-1/2 translate-x-[10px]",
};

export function ButtonHandle({
  showButton = true,
  position = Position.Bottom,
  children,
  ...props
}: HandleProps & { showButton?: boolean }) {
  const wrapperClassName = wrapperClassNames[position];
  const vertical = position === Position.Top || position === Position.Bottom;

  return (
    <BaseHandle position={position} {...props}>
      {showButton && (
        <div
          className={cn(
            "pointer-events-none absolute flex items-center",
            wrapperClassName
          )}
        >
          <div
            className={cn(
              "bg-node-border",
              vertical ? "h-10 w-px" : "h-px w-10"
            )}
          />
          <div className="nodrag nopan pointer-events-auto">{children}</div>
        </div>
      )}
    </BaseHandle>
  );
}
