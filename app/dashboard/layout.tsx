import { LeftSidebar } from "@/components/dashboard/left-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen w-full">
      <div className="flex">
        <div className="w-[250px] shrink-0">

        <SidebarProvider>
          <LeftSidebar />
        </SidebarProvider>
        </div>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};


export default layout;
