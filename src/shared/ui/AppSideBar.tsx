"use client";

import {
  FilePlus2,
  GitBranch,
  MoreHorizontal,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { ComponentProps, useCallback, useMemo, useState } from "react";

import { useSchemaStore } from "@/entities/schema/api/schema-store";
import { formatSchemaDate } from "../lib/formatSchemaDate";
import { Button } from "./Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./DropDownMenu";
import { Input } from "./Input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "./Sidebar";
import { Skeleton } from "./Skeleton";

type AppSidebarProps = ComponentProps<typeof Sidebar>;

export function AppSidebar(props: AppSidebarProps) {
  const schemas = useSchemaStore((state) => state.schemas);
  const activeSchemaId = useSchemaStore((state) => state.activeSchemaId);
  const isLoading = useSchemaStore((state) => state.isLoading);
  const searchQuery = useSchemaStore((state) => state.searchQuery);

  const createSchema = useSchemaStore((state) => state.createSchema);
  const selectSchema = useSchemaStore((state) => state.selectSchema);
  const renameSchema = useSchemaStore((state) => state.renameSchema);
  const deleteSchema = useSchemaStore((state) => state.deleteSchema);
  const setSearchQuery = useSchemaStore((state) => state.setSearchQuery);

  const [editingSchemaId, setEditingSchemaId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [schemaToDelete, setSchemaToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const filteredSchemas = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return schemas;

    return schemas.filter((schema) =>
      schema.name.toLowerCase().includes(normalizedQuery)
    );
  }, [schemas, searchQuery]);

  const startRename = useCallback(
    (schemaId: string, currentName: string) => {
      selectSchema(schemaId);
      setEditingSchemaId(schemaId);
      setDraftName(currentName);
    },
    [selectSchema]
  );

  const submitRename = useCallback(() => {
    if (!editingSchemaId) return;

    renameSchema(editingSchemaId, draftName);
    setEditingSchemaId(null);
    setDraftName("");
  }, [draftName, editingSchemaId, renameSchema]);

  const cancelRename = useCallback(() => {
    setEditingSchemaId(null);
    setDraftName("");
  }, []);

  const handleCreateSchema = useCallback(async () => {
    const newSchemaId = await createSchema();
    if (!newSchemaId) return;

    const createdSchema = useSchemaStore
      .getState()
      .schemas.find((schema) => schema.id === newSchemaId);

    if (!createdSchema) return;

    setEditingSchemaId(createdSchema.id);
    setDraftName(createdSchema.name);
  }, [createSchema]);

  const openDeleteDialog = useCallback((id: string, name: string) => {
    setSchemaToDelete({ id, name });
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setSchemaToDelete(null);
  }, []);

  const confirmDeleteSchema = useCallback(() => {
    if (!schemaToDelete) return;

    deleteSchema(schemaToDelete.id);
    setSchemaToDelete(null);
  }, [deleteSchema, schemaToDelete]);

  return (
    <>
      <Sidebar variant="floating" {...props}>
        <SidebarHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-node-border/20 bg-accent/10 text-accent">
              <GitBranch className="size-5" />
            </div>

            <h1 className="text-base font-semibold text-text-primary">
              Schema Flow
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

        <SidebarContent className="overflow-x-hidden">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreateSchema}
                    className="h-9 w-full rounded-xl px-3 font-medium shadow-sm"
                  >
                    <FilePlus2 className="mr-1 size-4" />
                    Create schema
                  </Button>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarSeparator className="my-2" />

          <SidebarGroup>
            <SidebarGroupLabel>Schemas</SidebarGroupLabel>

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
                                  onChange={(e) => setDraftName(e.target.value)}
                                  onBlur={submitRename}
                                  onClick={(e) => e.stopPropagation()}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      submitRename();
                                    }

                                    if (e.key === "Escape") {
                                      cancelRename();
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
                                  onSelect={() =>
                                    startRename(schema.id, schema.name)
                                  }
                                  className="hover:bg-accent/15 focus:bg-accent/15"
                                >
                                  <Pencil className="size-4" />
                                  <span>Edit name</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  variant="destructive"
                                  onSelect={() =>
                                    openDeleteDialog(schema.id, schema.name)
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
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <Dialog
        open={Boolean(schemaToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            closeDeleteDialog();
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete schema?</DialogTitle>
            <DialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-text-primary">
                {schemaToDelete?.name}
              </span>
              . This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={closeDeleteDialog}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={confirmDeleteSchema}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
