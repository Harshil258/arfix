import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { filterNavItemsForRole } from "@/lib/appNav";

import logo from "@/assets/image/logo/Logo.jpeg";

interface AppSidebarProps {
  /** Called after navigating (closes mobile drawer). No-op on desktop. */
  onNavigate?: () => void;
  className?: string;
}

export function AppSidebar({ onNavigate, className }: AppSidebarProps) {
  const role = useAppSelector((s) => s.currentUser.user?.role);

  const navItems = useMemo(() => filterNavItemsForRole(role), [role]);

  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col gap-6 rounded-xl border border-sidebar-border bg-sidebar p-5 shadow-sm shadow-black/5 dark:shadow-white/5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 lg:justify-start">
        <div className="flex min-w-0 items-center gap-4">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-3xl border border-primary bg-primary/10 text-lg font-bold text-primary shadow-sm">
            <img src={logo} alt="ARFIX" className="h-14 w-14 object-cover" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-sidebar-primary-foreground">ARFIX</p>
            <p className="text-xs text-sidebar-foreground/70">Admin interface</p>
          </div>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="shrink-0 rounded-full lg:hidden"
          onClick={onNavigate}
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => onNavigate?.()}
              className={({ isActive }) =>
                cn(
                  "flex w-full items-center justify-between rounded-3xl px-4 py-3 text-left text-sm font-medium transition",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-sidebar-foreground/90 hover:bg-muted hover:text-foreground",
                )
              }
            >
              <>
                <span className="flex items-center gap-3">
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </span>
              </>
            </NavLink>
          );
        })}
      </nav>

      <footer className="mt-auto border-t border-sidebar-border pt-4 text-xs text-sidebar-foreground/70">
        <p className="mb-1 text-[11px] uppercase tracking-[0.3em]">Panel</p>
        <p>Built for ARFIX analytics and product management.</p>
      </footer>
    </aside>
  );
}
