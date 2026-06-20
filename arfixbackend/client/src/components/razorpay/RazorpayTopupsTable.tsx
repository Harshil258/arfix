import React from "react";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { RazorpayTopupItem } from "@/api/razorpayApi";

interface RazorpayTopupsTableProps {
  topups: RazorpayTopupItem[];
}

const currency = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(n);

const statusClass: Record<string, string> = {
  created: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  paid: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  expired: "bg-muted text-muted-foreground",
  cancelled: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};

export const RazorpayTopupsTable: React.FC<RazorpayTopupsTableProps> = ({ topups }) => {
  if (topups.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
        No top-up payment links created yet.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="mb-5">
        <p className="text-sm font-semibold text-foreground">Top-up links</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Payment links generated from this admin panel.
        </p>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-border">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead className="bg-muted/60 text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created by</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Link</th>
            </tr>
          </thead>
          <tbody>
            {topups.map((row, index) => (
              <tr
                key={row.id}
                className={cn(
                  "transition-colors duration-150 hover:bg-muted/40",
                  index !== 0 && "border-t border-border",
                )}
              >
                <td className="px-4 py-4 font-semibold tabular-nums text-foreground">
                  {currency(row.amountInr)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-medium capitalize",
                      statusClass[row.status] ?? statusClass.created,
                    )}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sidebar-foreground/90">
                  {row.createdBy?.name ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sidebar-foreground/90">
                  {new Date(row.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right">
                  <Button variant="outline" size="sm" className="gap-2" asChild>
                    <a href={row.shortUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Pay
                    </a>
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
