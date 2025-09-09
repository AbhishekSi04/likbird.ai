import { ReactNode } from "react";
import { Sidebar } from "@/components/layouts/Sidebar";
import { Header } from "@/components/layouts/Header";
import { ReactQueryProvider } from "@/lib/query-client";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <div className="grid h-dvh grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
        <div className="row-span-2"><Sidebar /></div>
        <Header />
        <main className="overflow-auto p-4">{children}</main>
      </div>
    </ReactQueryProvider>
  );
}


