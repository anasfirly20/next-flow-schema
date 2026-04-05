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

import { useScenarioStore } from "@/entities/scenario/api/scenario-store";
import { formatScenarioDate } from "../lib/formatScenarioDate";
import { Button } from "./Button";
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
  const scenarios = useScenarioStore((state) => state.scenarios);
  const activeScenarioId = useScenarioStore((state) => state.activeScenarioId);
  const isLoading = useScenarioStore((state) => state.isLoading);
  const searchQuery = useScenarioStore((state) => state.searchQuery);

  const createScenario = useScenarioStore((state) => state.createScenario);
  const selectScenario = useScenarioStore((state) => state.selectScenario);
  const renameScenario = useScenarioStore((state) => state.renameScenario);
  const deleteScenario = useScenarioStore((state) => state.deleteScenario);
  const setSearchQuery = useScenarioStore((state) => state.setSearchQuery);

  const [editingScenarioId, setEditingScenarioId] = useState<string | null>(
    null
  );
  const [draftName, setDraftName] = useState("");

  const filteredScenarios = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) return scenarios;

    return scenarios.filter((scenario) =>
      scenario.name.toLowerCase().includes(normalizedQuery)
    );
  }, [scenarios, searchQuery]);

  const startRename = useCallback(
    (scenarioId: string, currentName: string) => {
      selectScenario(scenarioId);
      setEditingScenarioId(scenarioId);
      setDraftName(currentName);
    },
    [selectScenario]
  );

  const submitRename = useCallback(() => {
    if (!editingScenarioId) return;

    renameScenario(editingScenarioId, draftName);
    setEditingScenarioId(null);
    setDraftName("");
  }, [draftName, editingScenarioId, renameScenario]);

  const cancelRename = useCallback(() => {
    setEditingScenarioId(null);
    setDraftName("");
  }, []);

  const handleCreateScenario = useCallback(async () => {
    const newScenarioId = await createScenario();
    if (!newScenarioId) return;

    const createdScenario = useScenarioStore
      .getState()
      .scenarios.find((scenario) => scenario.id === newScenarioId);

    if (!createdScenario) return;

    setEditingScenarioId(createdScenario.id);
    setDraftName(createdScenario.name);
  }, [createScenario]);

  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-node-border/20 bg-accent/10 text-accent">
            <GitBranch className="size-5" />
          </div>

          <h1 className="text-base font-semibold text-text-primary">
            Flow Builder
          </h1>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scenarios..."
            className="h-10 rounded-xl border-node-border/20 bg-node-bg pl-9 text-text-primary shadow-none placeholder:text-text-muted"
          />
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleCreateScenario}
                  className="cursor-pointer"
                >
                  <FilePlus2 />
                  <span>Create new scenario</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>Scenarios</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading &&
                Array.from({ length: 3 }).map((_, index) => (
                  <SidebarMenuItem key={`scenario-skeleton-${index}`}>
                    <div className="flex items-start gap-3 rounded-xl bg-bg-secondary/40 px-2 py-2">
                      <Skeleton className="mt-1 size-5 shrink-0 rounded-sm bg-bg-secondary" />

                      <div className="flex min-w-0 flex-1 flex-col gap-2">
                        <Skeleton className="h-4 w-32 rounded-md bg-bg-secondary" />
                        <Skeleton className="h-3 w-24 rounded-md bg-bg-secondary" />
                      </div>
                    </div>
                  </SidebarMenuItem>
                ))}

              {!isLoading && filteredScenarios.length === 0 && (
                <SidebarMenuItem>
                  <div className="px-2 py-1 text-sm text-text-muted">
                    No scenarios found
                  </div>
                </SidebarMenuItem>
              )}

              {!isLoading &&
                filteredScenarios.map((scenario) => {
                  const isActive = scenario.id === activeScenarioId;
                  const isEditing = scenario.id === editingScenarioId;

                  return (
                    <SidebarMenuItem key={scenario.id}>
                      <div className="group/item relative flex items-start gap-2">
                        <SidebarMenuButton
                          isActive={isActive}
                          onClick={() => selectScenario(scenario.id)}
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
                                className="rounded-md border border-node-border/30 bg-transparent px-1 text-sm font-medium text-text-primary outline-none"
                              />
                            ) : (
                              <span className="truncate text-sm font-medium">
                                {scenario.name}
                              </span>
                            )}

                            <span className="text-xs text-text-muted">
                              {formatScenarioDate(scenario.updatedAt)}
                            </span>
                          </div>
                        </SidebarMenuButton>

                        <div className="absolute top-2 right-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                type="button"
                                variant="ghost"
                                aria-label={`Scenario actions for ${scenario.name}`}
                                onClick={(e) => e.stopPropagation()}
                                className={[
                                  "flex size-8 items-center justify-center rounded-lg outline-0 transition-colors",
                                  isActive
                                    ? "text-text-primary hover:bg-bg-secondary"
                                    : "text-text-muted opacity-0 group-hover/item:opacity-100 hover:bg-bg-secondary hover:text-text-primary",
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
                                  startRename(scenario.id, scenario.name)
                                }
                              >
                                <Pencil className="size-4" />
                                <span>Edit name</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                variant="destructive"
                                onSelect={() => deleteScenario(scenario.id)}
                              >
                                <Trash2 className="size-4" />
                                <span>Delete scenario</span>
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
  );
}
