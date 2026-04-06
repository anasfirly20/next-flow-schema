import { SidebarProvider } from "@/shared/ui/Sidebar";
import { ReactFlowProvider } from "@xyflow/react";
import type { CSSProperties, ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as CSSProperties
      }
    >
      <ReactFlowProvider>{children}</ReactFlowProvider>
    </SidebarProvider>
  );
};
