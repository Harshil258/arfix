import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { DashboardEndUser } from "@/api/dashboardApi";

interface DashboardUsersTableProps {
  users: DashboardEndUser[];
  isStaff: boolean;
  isAdmin: boolean;
}

export const DashboardUsersTable: React.FC<DashboardUsersTableProps> = ({
  users,
  isStaff,
  isAdmin,
}) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Customers</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Recent accounts with role <span className="font-medium text-foreground">User</span>.
          </p>
        </div>
        {isAdmin ? (
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs" asChild>
            <Link to="/users">
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        ) : (
          <span className="h-8 w-16 shrink-0" aria-hidden />
        )}
      </div>

      {!isStaff ? (
        <div className="rounded-[20px] border border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          The customer list is available to administrators. The total count above still
          reflects every <span className="font-medium text-foreground">User</span> role account.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[20px] border border-border">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead className="bg-muted/60 text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No customer accounts yet.
                  </td>
                </tr>
              ) : (
                users.map((row, i) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "transition-colors duration-150 hover:bg-muted/40",
                      i !== 0 && "border-t border-border",
                    )}
                  >
                    <td className="px-4 py-3.5 font-medium text-foreground">{row.name}</td>
                    <td className="px-4 py-3.5 text-sidebar-foreground/90">{row.email}</td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs text-muted-foreground">
                      {new Date(row.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
