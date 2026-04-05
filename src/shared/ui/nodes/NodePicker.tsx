import type { NodeTypes } from "@/entities/chart";
import { cn } from "@/shared/lib/cn";
import { Circle, Diamond, Slash, X } from "lucide-react";
import { ComponentType } from "react";
import { Button } from "../Button";
import { ToggleGroup, ToggleGroupItem } from "../ToggleGroup";

type NodePickerProps = {
  position: {
    left: number;
    top: number;
  } | null;
  inline?: boolean;
  onClose: () => void;
  onSelect: (type: NodeTypes) => void;
};

const options: {
  value: NodeTypes;
  label: string;
  icon: ComponentType<{ className?: string }>;
}[] = [
  { value: "oval", label: "Start / End", icon: Circle },
  { value: "diamond", label: "Condition", icon: Diamond },
  { value: "circle", label: "Connector", icon: Circle },
  { value: "parallelogram", label: "Input / Output", icon: Slash },
];

export function NodePicker({
  position,
  inline = false,
  onClose,
  onSelect,
}: NodePickerProps) {
  return (
    <div
      className={cn(
        "z-50 w-75 rounded-2xl border bg-toolbar-bg p-3 shadow-lg backdrop-blur-sm",
        "border-node-border/30",
        inline ? "relative" : "absolute"
      )}
      style={
        inline
          ? {
              boxShadow: "0 12px 32px var(--color-node-shadow)",
            }
          : {
              left: position?.left ?? 0,
              top: position?.top ?? 0,
              transform: "translate(-50%, -15%)",
              boxShadow: "0 12px 32px var(--color-node-shadow)",
            }
      }
      onClick={(e) => e.stopPropagation()}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-base font-semibold text-text-primary">
          Choose shape
        </p>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className={cn(
            "size-8 rounded-xl p-0 text-text-secondary transition-all",
            "hover:bg-bg-secondary hover:text-text-primary"
          )}
        >
          <X className="size-4 shrink-0" />
        </Button>
      </div>

      <ToggleGroup
        type="single"
        className="grid grid-cols-2"
        spacing={5}
        onValueChange={(value) => {
          if (!value) return;
          onSelect(value as NodeTypes);
        }}
      >
        {options.map(({ value, label, icon: Icon }) => (
          <ToggleGroupItem
            key={value}
            value={value}
            aria-label={label}
            className={cn(
              "group h-auto cursor-pointer rounded-2xl border border-node-border/35 bg-node-bg p-3",
              "flex flex-col items-center justify-center gap-2",
              "transition-all duration-200",
              "hover:-translate-y-0.5 hover:border-accent hover:bg-bg-secondary",
              "data-[state=on]:border-accent data-[state=on]:bg-bg-secondary"
            )}
          >
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                "border border-accent/25 bg-accent/8",
                "transition-colors duration-200",
                "group-hover:border-accent/40 group-hover:bg-accent/12"
              )}
            >
              <Icon className="size-5 text-accent-strong" />
            </div>

            <span className="text-sm font-medium text-text-primary">
              {label}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
