import { SidebarInset, SidebarProvider } from "@/shared/ui/Sidebar";
import { ReactFlowProvider } from "@xyflow/react";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { AppSidebar } from "@/widgets/app-sidebar";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "React Flow Schema",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="mx-auto max-w-480 bg-canvas">
        <SidebarProvider
          style={
            {
              "--sidebar-width": "19rem",
            } as React.CSSProperties
          }
        >
          <ReactFlowProvider>
            <AppSidebar />
            <SidebarInset>{children}</SidebarInset>
          </ReactFlowProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
