// components/dashboard/OrdersTable.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";

interface OrderRow {
  id: string;
  customer: string;
  amount: string;
  status: "Paid" | "Pending" | "Refund";
}

const badgeConfig = {
  Paid: {
    className: "bg-emerald-500/10 text-emerald-500",
    dot: "bg-emerald-500",
  },
  Pending: {
    className: "bg-amber-500/10 text-amber-500",
    dot: "bg-amber-500",
  },
  Refund: {
    className: "bg-slate-500/10 text-slate-400",
    dot: "bg-slate-400",
  },
};

interface OrdersTableProps {
  orders: OrderRow[];
}

export const OrdersTable: React.FC<OrdersTableProps> = ({ orders }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Recent orders</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Latest activity across the store.
          </p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
          View all
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-border">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead className="bg-muted/60 text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((row, i) => (
              <tr
                key={row.id}
                className={cn(
                  "transition-colors duration-150 hover:bg-muted/40",
                  i !== 0 && "border-t border-border",
                )}
              >
                <td className="px-4 py-3.5 font-mono text-xs font-semibold text-foreground">
                  {row.id}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                      {row.customer[0]}
                    </div>
                    <span className="text-sm text-foreground">
                      {row.customer}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm font-semibold text-foreground">
                  {row.amount}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
                      badgeConfig[row.status].className,
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        badgeConfig[row.status].dot,
                      )}
                    />
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
