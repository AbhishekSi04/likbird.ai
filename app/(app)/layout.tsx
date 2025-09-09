import { ReactNode } from "react";
import { Sidebar } from "@/components/layouts/Sidebar";
import { Header } from "@/components/layouts/Header";
import { ReactQueryProvider } from "@/lib/query-client";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <ReactQueryProvider>
      <div className="flex h-dvh flex-col md:grid md:grid-cols-[auto_1fr] md:grid-rows-[auto_1fr]">
        <div className="fixed inset-0 z-40 hidden md:relative md:block md:row-span-2">
          <Sidebar />
        </div>
        <div className="fixed top-0 z-30 w-full md:static">
          <Header />
        </div>
        <main className="mt-16 flex-1 overflow-auto p-4 md:mt-0">{children}</main>
      </div>
    </ReactQueryProvider>
  );
}
