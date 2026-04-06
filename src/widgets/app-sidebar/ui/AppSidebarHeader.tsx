import { useSchemaStore } from "@/entities/schema/api/schema-store";
import { Input } from "@/shared/ui/Input";
import { SidebarHeader } from "@/shared/ui/Sidebar";
import { GitBranch, Search } from "lucide-react";

export const AppSidebarHeader = () => {
  const searchQuery = useSchemaStore((state) => state.searchQuery);
  const setSearchQuery = useSchemaStore((state) => state.setSearchQuery);

  return (
    <SidebarHeader>
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-node-border/20 bg-accent/10 text-accent">
          <GitBranch className="size-5" />
        </div>

        <h1 className="text-base font-semibold text-text-primary">
          Flow Schema
        </h1>
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
        <Input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search..."
          className="h-10 rounded-xl border-node-border/20 bg-node-bg pl-9 text-text-primary shadow-none placeholder:text-text-muted"
        />
      </div>
    </SidebarHeader>
  );
};
