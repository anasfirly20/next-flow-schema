"use client";

import { cn } from "@/shared/lib/cn";
import { SearchIcon } from "lucide-react";
import * as React from "react";
import { Input } from "./Input";

export function SearchForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("relative", className)} {...props}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
      <Input
        type="search"
        placeholder="Search the docs..."
        className="h-10 rounded-xl border-node-border/20 bg-node-bg pl-9 text-text-primary shadow-none placeholder:text-text-muted"
      />
    </form>
  );
}
