import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { WithdrawalItem } from "@/api/withdrawalApi";
import {
  getWithdrawalUser,
  maskAccountNumber,
  withdrawalStatusClass,
  withdrawalStatusLabel,
} from "@/lib/withdrawal";

interface WithdrawalsTableProps {
  withdrawals: WithdrawalItem[];
  isLoading?: boolean;
  actionId: string | null;
  onApprove: (item: WithdrawalItem) => void;
  onReject: (item: WithdrawalItem) => void;
}

const currency = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export const WithdrawalsTable: React.FC<WithdrawalsTableProps> = ({
  withdrawals,
  isLoading,
  actionId,
  onApprove,
  onReject,
}) => {
  if (isLoading) {
    return (
      <div className="h-56 animate-pulse rounded-xl border border-border bg-muted/40" />
    );
  }

  if (withdrawals.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
        No withdrawal requests match your filters.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="mb-5">
        <p className="text-sm font-semibold text-foreground">Requests</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Approve to trigger Razorpay payout and deduct user coins. Reject requires a reason shown to
          the user.
        </p>
      </div>

      <div className="overflow-x-auto overflow-y-hidden rounded-[20px] border border-border">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead className="bg-muted/60 text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Bank</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Requested</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((row, index) => {
              const user = getWithdrawalUser(row.user);
              const isPending = row.status === "pending";
              const busy = actionId === row._id;

              return (
                <tr
                  key={row._id}
                  className={cn(
                    "transition-colors duration-150 hover:bg-muted/40",
                    index !== 0 && "border-t border-border",
                    isPending && "bg-amber-500/5",
                  )}
                >
                  <td className="px-4 py-4">
                    <p className="font-medium text-foreground">{user?.name ?? "—"}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{user?.email ?? ""}</p>
                    {user?.coins != null ? (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {user.coins.toLocaleString()} coins
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-4 font-semibold tabular-nums text-foreground">
                    {currency(row.amount)}
                  </td>
                  <td className="px-4 py-4 text-xs text-sidebar-foreground/90">
                    <p className="font-medium text-foreground">
                      {row.bankDetails.accountHolderName}
                    </p>
                    <p className="mt-0.5">{row.bankDetails.bankName ?? "Bank account"}</p>
                    <p className="mt-0.5 font-mono">
                      {maskAccountNumber(row.bankDetails.accountNumber)}
                    </p>
                    <p className="mt-0.5 font-mono">{row.bankDetails.ifscCode}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[11px] font-medium",
                        withdrawalStatusClass[row.status],
                      )}
                    >
                      {withdrawalStatusLabel[row.status]}
                    </span>
                    {row.status === "rejected" && row.rejectionReason ? (
                      <p
                        className="mt-2 max-w-[200px] text-xs text-rose-600 dark:text-rose-400"
                        title={row.rejectionReason}
                      >
                        {row.rejectionReason}
                      </p>
                    ) : null}
                    {row.razorpayPayoutId ? (
                      <p className="mt-1 truncate font-mono text-[10px] text-muted-foreground">
                        {row.razorpayPayoutId}
                      </p>
                    ) : null}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sidebar-foreground/90">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    {isPending ? (
                      <div className="flex flex-col items-end gap-2 sm:flex-row">
                        <Button
                          type="button"
                          size="sm"
                          className="gap-1.5"
                          disabled={busy}
                          onClick={() => onApprove(row)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {busy ? "Processing…" : "Approve"}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-destructive hover:text-destructive"
                          disabled={busy}
                          onClick={() => onReject(row)}
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="block text-right text-xs text-muted-foreground">—</span>
                    )}
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
