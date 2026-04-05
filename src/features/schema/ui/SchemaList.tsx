import { useSchemaStore } from "@/entities/schema/api/schema-store";
import { formatSchemaDate } from "@/shared/lib/formatSchemaDate";
import { Button } from "@/shared/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/DropDownMenu";
import { Input } from "@/shared/ui/Input";
import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/ui/Sidebar";
import { Skeleton } from "@/shared/ui/Skeleton";
import { GitBranch, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useMemo } from "react";

type SchemaListProps = {
  onOpenDeleteDialog: (id: string, name: string) => void;
  onStartRename: (schemaId: string, currentName: string) => void;
  onSubmitRename: () => void;
  onCancelRename: () => void;
  editingSchemaId: string | null;
  draftName: string;
  onChangeDraftName: (value: string) => void;
};

export const SchemaList = ({
  onOpenDeleteDialog,
  onStartRename,
  onSubmitRename,
  onCancelRename,
  editingSchemaId,
  draftName,
  onChangeDraftName,
}: SchemaListProps) => {
  const schemas = useSchemaStore((state) => state.schemas);
  const activeSchemaId = useSchemaStore((state) => state.activeSchemaId);
  const isLoading = useSchemaStore((state) => state.isLoading);
  const searchQuery = useSchemaStore((state) => state.searchQuery);

  const selectSchema = useSchemaStore((state) => state.selectSchema);

  const filteredSchemas = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return schemas;

    return schemas.filter((schema) =>
      schema.name.toLowerCase().includes(normalizedQuery)
    );
  }, [schemas, searchQuery]);

  return (
    <SidebarGroupContent>
      <SidebarMenu>
        {isLoading &&
          Array.from({ length: 3 }).map((_, index) => (
            <SidebarMenuItem key={`schema-skeleton-${index}`}>
              <div className="flex items-start gap-3 rounded-xl bg-accent/25 px-2 py-2">
                <Skeleton className="mt-1 size-5 shrink-0 rounded-sm bg-accent/30" />

                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-32 rounded-md bg-accent/30" />
                  <Skeleton className="h-3 w-24 rounded-md bg-accent/30" />
                </div>
              </div>
            </SidebarMenuItem>
          ))}

        {!isLoading && filteredSchemas.length === 0 && (
          <SidebarMenuItem>
            <div className="px-2 py-1 text-sm text-text-muted">
              No schemas found
            </div>
          </SidebarMenuItem>
        )}

        {!isLoading &&
          filteredSchemas.map((schema) => {
            const isActive = schema.id === activeSchemaId;
            const isEditing = schema.id === editingSchemaId;

            return (
              <SidebarMenuItem key={schema.id}>
                <div className="group/item relative flex items-start gap-2">
                  <SidebarMenuButton
                    isActive={isActive}
                    onClick={() => selectSchema(schema.id)}
                    className="h-auto flex-1 items-start pr-10"
                  >
                    <GitBranch className="mt-0.5 shrink-0" />

                    <div className="flex min-w-0 flex-1 flex-col text-left">
                      {isEditing ? (
                        <Input
                          autoFocus
                          value={draftName}
                          onChange={(e) => onChangeDraftName(e.target.value)}
                          onBlur={onSubmitRename}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              onSubmitRename();
                            }

                            if (e.key === "Escape") {
                              onCancelRename();
                            }
                          }}
                          className="rounded-md border border-accent/50 bg-transparent px-1 text-sm font-medium text-text-primary outline-none"
                        />
                      ) : (
                        <span className="truncate text-sm font-medium">
                          {schema.name}
                        </span>
                      )}

                      <span className="text-xs text-text-muted">
                        {formatSchemaDate(schema.updatedAt)}
                      </span>
                    </div>
                  </SidebarMenuButton>

                  <div className="absolute top-2 right-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          aria-label={`Schema actions for ${schema.name}`}
                          onClick={(e) => e.stopPropagation()}
                          className={[
                            "flex size-8 items-center justify-center rounded-lg outline-0 transition-colors hover:bg-accent/15",
                            isActive
                              ? "text-text-primary"
                              : "text-text-muted opacity-0 group-hover/item:opacity-100 hover:text-text-primary",
                          ].join(" ")}
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        sideOffset={6}
                        onClick={(e) => e.stopPropagation()}
                        className="w-48 border-0"
                      >
                        <DropdownMenuItem
                          onSelect={() => onStartRename(schema.id, schema.name)}
                          className="hover:bg-accent/15 focus:bg-accent/15"
                        >
                          <Pencil className="size-4" />
                          <span>Edit name</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          variant="destructive"
                          onSelect={() =>
                            onOpenDeleteDialog(schema.id, schema.name)
                          }
                          className="data-[variant=destructive]:hover:bg-accent/15 data-[variant=destructive]:focus:bg-accent/15"
                        >
                          <Trash2 className="size-4" />
                          <span>Delete schema</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </SidebarMenuItem>
            );
          })}
      </SidebarMenu>
    </SidebarGroupContent>
  );
};
