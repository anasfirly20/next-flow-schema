import { Position, type HandleProps } from "@xyflow/react";
import { BaseHandle } from "./BaseHandle";
import { cn } from "@/shared/lib/cn";

const wrapperClassNames: Record<Position, string> = {
  [Position.Top]:
    "flex-col-reverse left-1/2 -translate-x-1/2 -translate-y-full",
  [Position.Bottom]: "flex-col left-1/2 -translate-x-1/2 translate-y-[6px]",
  [Position.Left]:
    "flex-row-reverse top-1/2 -translate-y-1/2 -translate-x-full",
  [Position.Right]: "flex-row top-1/2 -translate-y-1/2 translate-x-[6px]",
};

type ButtonHandleProps = HandleProps & {
  showButton?: boolean;
};

export function ButtonHandle({
  showButton = false,
  position = Position.Bottom,
  children,
  className,
  ...props
}: ButtonHandleProps) {
  const wrapperClassName = wrapperClassNames[position];
  const vertical = position === Position.Top || position === Position.Bottom;

  return (
    <BaseHandle position={position} className={className} {...props}>
      <div
        className={cn(
          "pointer-events-none absolute flex items-center transition-all duration-200",
          wrapperClassName,
          showButton
            ? "translate-y-0 opacity-100"
            : "pointer-events-none opacity-0"
        )}
      >
        <div
          className={cn(
            "bg-node-border/70 transition-opacity duration-200",
            vertical ? "h-8 w-px" : "h-px w-8"
          )}
        />
        <div className="nodrag nopan pointer-events-auto">{children}</div>
      </div>
    </BaseHandle>
  );
}
