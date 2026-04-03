import { cn } from "@/shared/lib";
import { Handle } from "@xyflow/react";
import type { ComponentProps } from "react";

export function BaseHandle({
  className,
  children,
  ...props
}: ComponentProps<typeof Handle>) {
  return (
    <Handle
      {...props}
      className={cn(
        "z-10 size-3 shrink-0 rounded-full border border-node-border bg-node-bg shadow-sm",
        "transition-all duration-200",
        "hover:scale-110 hover:border-accent hover:bg-accent",
        className
      )}
    >
      {children}
    </Handle>
  );
}
