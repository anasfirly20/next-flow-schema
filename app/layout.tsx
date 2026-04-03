import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ReactFlowProvider } from "@xyflow/react";

import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "React Flow Chart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="mx-auto max-w-480">
        <ReactFlowProvider>{children}</ReactFlowProvider>
      </body>
    </html>
  );
}
