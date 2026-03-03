import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Todo App | Manage Employees & Tasks",
  description: "A professional workforce task management application.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-100">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
        <Toaster theme="light" position="top-center" richColors />
      </body>
    </html>
  );
}
