import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { DashboardSupportRow } from "@/api/dashboardApi";
import type { SupportStatus } from "@/api/supportApi";

interface DashboardSupportTableProps {
  rows: DashboardSupportRow[];
  isStaff: boolean;
}

const statusLabel: Record<SupportStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const statusClass: Record<SupportStatus, string> = {
  OPEN: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  IN_PROGRESS: "bg-sky-500/10 text-sky-700 dark:text-sky-400",
  RESOLVED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  CLOSED: "bg-muted text-muted-foreground",
};

export const DashboardSupportTable: React.FC<DashboardSupportTableProps> = ({
  rows,
  isStaff,
}) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Support</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Latest messages from the mobile app inbox.
          </p>
        </div>
        {isStaff ? (
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs" asChild>
            <Link to="/support">
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        ) : null}
      </div>

      {!isStaff ? (
        <div className="rounded-[20px] border border-border bg-muted/20 p-6 text-center text-sm text-muted-foreground">
          Support threads are available to staff and administrators. Open the{" "}
          <span className="font-medium text-foreground">Support</span> section when signed in
          with the right role.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[20px] border border-border">
          <table className="min-w-full border-separate border-spacing-0 text-sm">
            <thead className="bg-muted/60 text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Subject</th>
                <th className="px-4 py-3 font-medium">From</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Received</th>
                <th className="px-4 py-3 font-medium text-right">Open</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No support messages yet.
                  </td>
                </tr>
              ) : (
                rows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "transition-colors duration-150 hover:bg-muted/40",
                      i !== 0 && "border-t border-border",
                    )}
                  >
                    <td className="max-w-[180px] truncate px-4 py-3.5 font-medium text-foreground">
                      {row.subject}
                    </td>
                    <td className="px-4 py-3.5 text-sidebar-foreground/90">
                      {row.user?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-[11px] font-medium",
                          statusClass[row.status],
                        )}
                      >
                        {statusLabel[row.status]}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-xs text-muted-foreground">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/support/${row.id}`}>View</Link>
                      </Button>
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
