import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import * as React from "react";
import { cn } from "../lib/cn";
import { Spinner } from "./Spinner";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-offset-2 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-70 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: `border-accent bg-accent text-white shadow-lg hover:border-accent-hover hover:bg-accent-hover focus-visible:ring-accent`,
        outline: `border-node-border bg-node-bg text-text-primary hover:border-accent hover:bg-bg-secondary hover:text-text-primary focus-visible:ring-accent`,
        secondary: `border-teal bg-teal hover:border-teal-hover hover:bg-teal-hover focus-visible:ring-teal text-text-primary`,
        ghost: `border-transparent bg-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary focus-visible:ring-accent`,
        destructive: `border-red-300 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 focus-visible:ring-red-300`,
        link: `border-transparent bg-transparent px-0 text-accent-strong underline-offset-4 hover:text-accent-hover hover:underline focus-visible:ring-accent`,
      },

      size: {
        default:
          "h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-md px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-md px-2.5 text-[0.8rem] [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 px-4 text-sm",
        icon: "size-8",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 rounded-md",
        "icon-lg": "size-9",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  isLoading = false,
  children,
  disabled,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={disabled || isLoading}
      className={cn(
        buttonVariants({ variant, size, className }),
        isLoading && "pointer-events-none"
      )}
      {...props}
    >
      {isLoading && <Spinner className="mr-1" />}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
