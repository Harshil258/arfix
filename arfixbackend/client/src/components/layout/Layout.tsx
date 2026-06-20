import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SidebarLayoutProvider, useSidebarLayout } from "@/context/sidebar-layout-context";
import { AppSidebar } from "./AppSidebar";
import Header from "./Header";

interface LayoutShellProps {
  children: React.ReactNode;
}

const LayoutShell: React.FC<LayoutShellProps> = ({ children }) => {
  const location = useLocation();
  const { mobileSidebarOpen, closeMobileSidebar } = useSidebarLayout();

  useEffect(() => {
    closeMobileSidebar();
  }, [location.pathname, closeMobileSidebar]);

  useEffect(() => {
    if (!mobileSidebarOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileSidebarOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto min-h-screen w-full max-w-[1600px] p-4 sm:p-6">
        {mobileSidebarOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px] transition-opacity lg:hidden"
            aria-label="Close sidebar"
            onClick={closeMobileSidebar}
          />
        ) : null}

        <div className="lg:grid lg:min-h-[calc(100vh-3rem)] lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
          <AppSidebar
            onNavigate={closeMobileSidebar}
            className={cn(
              "max-lg:fixed max-lg:left-0 max-lg:top-0 max-lg:z-40 max-lg:h-dvh max-lg:w-[min(100vw-1.5rem,300px)] max-lg:max-w-[300px] max-lg:overflow-y-auto",
              "max-lg:-translate-x-full max-lg:transition-transform max-lg:duration-200 max-lg:ease-out",
              mobileSidebarOpen && "max-lg:translate-x-0",
              "lg:static lg:z-auto lg:h-auto lg:min-h-[calc(100vh-3rem)] lg:w-full lg:max-w-none lg:translate-x-0",
            )}
          />

          <div className="flex min-h-0 min-w-0 flex-col gap-4 lg:min-h-0 lg:gap-6">
            <Header />
            <main className="min-h-0 w-full min-w-0 flex-1 space-y-4 pb-6 sm:space-y-6">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SidebarLayoutProvider>
      <LayoutShell>{children}</LayoutShell>
    </SidebarLayoutProvider>
  );
};

export default Layout;
