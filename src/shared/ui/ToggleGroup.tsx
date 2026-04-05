"use client";

import { type VariantProps } from "class-variance-authority";
import { ToggleGroup as ToggleGroupPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "../lib/cn";
import { toggleVariants } from "./Toggle";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }
>({
  size: "default",
  variant: "default",
  spacing: 0,
  orientation: "horizontal",
});

function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  orientation = "horizontal",
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      data-orientation={orientation}
      data-spacing={spacing}
      style={
        {
          gap: `${spacing}px`,
        } as React.CSSProperties
      }
      className={cn(
        "group/toggle-group inline-flex w-fit items-center rounded-xl",
        orientation === "horizontal" ? "flex-row" : "flex-col items-stretch",
        spacing === 0 &&
          variant === "outline" &&
          "overflow-hidden border border-node-border bg-node-bg shadow-sm",
        spacing === 0 && variant === "default" && "bg-accent-soft p-1",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider
        value={{ variant, size, spacing, orientation }}
      >
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  const resolvedVariant = context.variant || variant;
  const resolvedSize = context.size || size;
  const resolvedSpacing = context.spacing ?? 0;
  const resolvedOrientation = context.orientation || "horizontal";

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={resolvedVariant}
      data-size={resolvedSize}
      data-spacing={resolvedSpacing}
      data-orientation={resolvedOrientation}
      className={cn(
        "shrink-0",
        resolvedSpacing === 0 && "rounded-none",
        resolvedSpacing === 0 &&
          resolvedOrientation === "horizontal" &&
          "first:rounded-l-xl last:rounded-r-xl",
        resolvedSpacing === 0 &&
          resolvedOrientation === "vertical" &&
          "first:rounded-t-xl last:rounded-b-xl",
        resolvedSpacing === 0 &&
          resolvedVariant === "outline" &&
          resolvedOrientation === "horizontal" &&
          "border-0 border-l border-node-border first:border-l-0",
        resolvedSpacing === 0 &&
          resolvedVariant === "outline" &&
          resolvedOrientation === "vertical" &&
          "border-0 border-t border-node-border first:border-t-0",
        resolvedSpacing === 0 &&
          resolvedVariant === "default" &&
          "focus-visible:z-10",
        toggleVariants({
          variant: resolvedVariant,
          size: resolvedSize,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}

export { ToggleGroup, ToggleGroupItem };
