import { cn } from "../lib/cn";

export function Input({
  className,
  type,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-node-border bg-node-bg px-2.5 py-1 text-sm text-text-primary transition-all outline-none",
        "placeholder:text-text-muted",
        "hover:border-accent",
        "focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/30",
        "disabled:cursor-not-allowed disabled:bg-node-bg/70 disabled:opacity-50",
        "aria-invalid:border-red-400 aria-invalid:ring-2 aria-invalid:ring-red-400/30",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      {...props}
    />
  );
}
