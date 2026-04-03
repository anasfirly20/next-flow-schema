import type { ComponentProps } from "react";
import { Handle, type HandleProps } from "@xyflow/react";
import { cn } from "@/shared/lib/cn";

export type BaseHandleProps = HandleProps;

export function BaseHandle({
  className,
  children,
  ...props
}: ComponentProps<typeof Handle>) {
  return (
    <Handle
      {...props}
      className={cn(
        "h-2.75 w-2.75 rounded-full border border-node-border bg-node-bg shadow-sm transition-colors duration-200",
        "hover:border-accent hover:bg-accent",
        className
      )}
    >
      {children}
    </Handle>
  );
}
