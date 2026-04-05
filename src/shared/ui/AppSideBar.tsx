import {
  Clock3,
  FilePlus2,
  GitBranch,
  LayoutTemplate,
  Search,
  Shapes,
} from "lucide-react";
import * as React from "react";

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
  SidebarRail,
  SidebarSeparator,
} from "./Sidebar";

const data = {
  scenarios: [
    { title: "Login flow", isActive: true },
    { title: "Signup flow" },
    { title: "Subscription renewal" },
    { title: "Onboarding wizard" },
  ],
  nodes: [
    { title: "Action" },
    { title: "Condition" },
    { title: "Start / End" },
    { title: "Input / Output" },
  ],
  templates: [
    { title: "Auth flow" },
    { title: "Approval process" },
    { title: "Sales pipeline" },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="floating" {...props}>
      <SidebarHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-node-border/20 bg-accent/10 text-accent">
            <GitBranch className="size-5" />
          </div>

          <div className="min-w-0">
            <h1 className="text-base font-semibold text-text-primary">
              Flow Builder
            </h1>
            <p className="mt-0.5 text-xs text-text-secondary">
              Build and manage scenario diagrams
            </p>
          </div>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
          <Input
            type="search"
            placeholder="Search scenarios or nodes..."
            className="h-10 rounded-xl border-node-border/20 bg-node-bg pl-9 text-text-primary shadow-none placeholder:text-text-muted"
          />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
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
              {data.scenarios.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={item.isActive}>
                    <GitBranch />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Nodes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.nodes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <Shapes />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Templates</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.templates.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <LayoutTemplate />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recent</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Clock3 />
                  <span>Updated 5 minutes ago</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
