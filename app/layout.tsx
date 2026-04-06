import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { SidebarInset } from "@/shared/ui/Sidebar";
import { AppSidebar } from "@/widgets/app-sidebar";
import "./globals.css";
import { Providers } from "./providers";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Next Flow Schema",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="mx-auto max-w-480 bg-canvas">
        <Providers>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </Providers>
      </body>
    </html>
  );
}
