import React from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SupportMessageListItem, SupportStatus } from "@/api/supportApi";

interface SupportMessagesTableProps {
  messages: SupportMessageListItem[];
  onOpen: (id: string) => void;
}

const statusLabel: Record<SupportStatus, string> = {
  OPEN: "Open",
  IN_PROGRESS: "In progress",
  RESOLVED: "Resolved",
  CLOSED: "Closed",
};

const statusClass: Record<SupportStatus, string> = {
  OPEN: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  IN_PROGRESS: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  RESOLVED: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  CLOSED: "bg-muted text-muted-foreground",
};

export const SupportMessagesTable: React.FC<SupportMessagesTableProps> = ({
  messages,
  onOpen,
}) => {
  if (messages.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
        No support messages match your filters.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="mb-5">
        <p className="text-sm font-semibold text-foreground">Inbox</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Messages sent from the mobile app support form appear here.
        </p>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-border">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead className="bg-muted/60 text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Read</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">From</th>
              <th className="px-4 py-3 font-medium">Received</th>
              <th className="px-4 py-3 font-medium text-right">View</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((row, index) => (
              <tr
                key={row.id}
                className={cn(
                  "transition-colors duration-150 hover:bg-muted/40",
                  index !== 0 && "border-t border-border",
                  !row.isReadByStaff && "bg-primary/5",
                )}
              >
                <td className="px-4 py-4">
                  {row.isReadByStaff ? (
                    <span className="text-xs text-muted-foreground">Read</span>
                  ) : (
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      New
                    </span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-medium",
                      statusClass[row.status],
                    )}
                  >
                    {statusLabel[row.status]}
                  </span>
                </td>
                <td className="max-w-[220px] px-4 py-4">
                  <p className="truncate font-medium text-foreground" title={row.subject}>
                    {row.subject}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{row.preview}</p>
                </td>
                <td className="px-4 py-4 text-sidebar-foreground/90">
                  {row.user?.name ?? "—"}
                  {row.user?.email ? (
                    <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                      {row.user.email}
                    </span>
                  ) : null}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sidebar-foreground/90">
                  {new Date(row.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => onOpen(row.id)}
                  >
                    <Eye className="h-4 w-4" />
                    Open
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
