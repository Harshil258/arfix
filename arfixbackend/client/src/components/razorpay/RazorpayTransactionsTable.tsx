import React from "react";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RazorpayTransaction } from "@/api/razorpayApi";

interface RazorpayTransactionsTableProps {
  transactions: RazorpayTransaction[];
  isLoading?: boolean;
}

const currency = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(n);

export const RazorpayTransactionsTable: React.FC<RazorpayTransactionsTableProps> = ({
  transactions,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="h-48 animate-pulse rounded-xl border border-border bg-muted/40" />
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
        No Razorpay transactions found for this period.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="mb-5">
        <p className="text-sm font-semibold text-foreground">Account transactions</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Credits and debits from your RazorpayX linked account.
        </p>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-border">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead className="bg-muted/60 text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Balance after</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((row, index) => {
              const isCredit = row.type === "CREDIT";
              return (
                <tr
                  key={row.id}
                  className={cn(
                    "transition-colors duration-150 hover:bg-muted/40",
                    index !== 0 && "border-t border-border",
                  )}
                >
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                        isCredit
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : "bg-rose-500/15 text-rose-700 dark:text-rose-400",
                      )}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="h-3 w-3" />
                      ) : (
                        <ArrowUpRight className="h-3 w-3" />
                      )}
                      {isCredit ? "Credit" : "Debit"}
                    </span>
                  </td>
                  <td
                    className={cn(
                      "px-4 py-4 font-semibold tabular-nums",
                      isCredit ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400",
                    )}
                  >
                    {isCredit ? "+" : "−"}
                    {currency(row.amountInr)}
                  </td>
                  <td className="px-4 py-4 tabular-nums text-sidebar-foreground/90">
                    {row.balanceAfterInr != null ? currency(row.balanceAfterInr) : "—"}
                  </td>
                  <td className="px-4 py-4 text-xs text-muted-foreground">
                    {row.sourceType ? (
                      <>
                        <span className="font-medium text-foreground">{row.sourceType}</span>
                        {row.sourceId ? (
                          <span className="mt-0.5 block truncate font-mono">{row.sourceId}</span>
                        ) : null}
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sidebar-foreground/90">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
