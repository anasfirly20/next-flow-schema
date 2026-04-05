"use client";

import { ComponentProps, useCallback, useMemo, useState } from "react";

import { useSchemaStore } from "@/entities/schema/api/schema-store";
import {
  CreateSchemaButton,
  DeleteSchemaDialog,
  SchemaList,
} from "@/features/schema";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/shared/ui/Sidebar";
import { AppSidebarHeader } from "./AppSidebarHeader";

type AppSidebarProps = ComponentProps<typeof Sidebar>;

export const AppSidebar = (props: AppSidebarProps) => {
  const schemas = useSchemaStore((state) => state.schemas);
  const searchQuery = useSchemaStore((state) => state.searchQuery);

  const createSchema = useSchemaStore((state) => state.createSchema);
  const selectSchema = useSchemaStore((state) => state.selectSchema);
  const renameSchema = useSchemaStore((state) => state.renameSchema);
  const deleteSchema = useSchemaStore((state) => state.deleteSchema);

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

  const handleChangeDraftName = useCallback((value: string) => {
    setDraftName(value);
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
        <AppSidebarHeader />
        <SidebarContent className="overflow-x-hidden">
          <CreateSchemaButton onCreateSchema={handleCreateSchema} />
          <SidebarSeparator className="my-2" />
          <SidebarGroup>
            <SidebarGroupLabel>Schemas</SidebarGroupLabel>
            <SchemaList
              onOpenDeleteDialog={openDeleteDialog}
              onStartRename={startRename}
              onSubmitRename={submitRename}
              onCancelRename={cancelRename}
              editingSchemaId={editingSchemaId}
              draftName={draftName}
              onChangeDraftName={handleChangeDraftName}
            />
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <DeleteSchemaDialog
        schemaName={schemaToDelete?.name || ""}
        confirmDeleteSchema={confirmDeleteSchema}
        onCloseDeleteDialog={closeDeleteDialog}
      />
    </>
  );
};
