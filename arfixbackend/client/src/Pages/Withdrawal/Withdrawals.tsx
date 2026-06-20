import React, { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  CheckCircle2,
  Clock,
  RefreshCcw,
  XCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { WithdrawalsTable } from "@/components/withdrawal/WithdrawalsTable";
import { RejectWithdrawalDialog } from "@/components/withdrawal/RejectWithdrawalDialog";
import {
  useWithdrawalCountsQuery,
  useWithdrawalsQuery,
} from "@/hooks/queries/withdrawal.queries";
import {
  useApproveWithdrawalMutation,
  useRejectWithdrawalMutation,
} from "@/hooks/mutations/withdrawal.mutations";
import type { WithdrawalItem, WithdrawalStatus } from "@/api/withdrawalApi";
import { getWithdrawalUser } from "@/lib/withdrawal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL = "__all__";

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: unknown }).message);
  }
  return "Something went wrong.";
}

const Withdrawals: React.FC = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [actionId, setActionId] = useState<string | null>(null);
  const [approveTarget, setApproveTarget] = useState<WithdrawalItem | null>(null);
  const [rejectTarget, setRejectTarget] = useState<WithdrawalItem | null>(null);

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      ...(statusFilter !== ALL ? { status: statusFilter as WithdrawalStatus } : {}),
    }),
    [page, statusFilter],
  );

  const countsQuery = useWithdrawalCountsQuery();
  const listQuery = useWithdrawalsQuery(params);
  const approveMutation = useApproveWithdrawalMutation();
  const rejectMutation = useRejectWithdrawalMutation();

  const withdrawals = listQuery.data?.withdrawals ?? [];
  const pagination = listQuery.data?.pagination;
  const counts = countsQuery.data;

  const refetch = () => {
    void countsQuery.refetch();
    void listQuery.refetch();
  };

  const handleApproveConfirm = async () => {
    if (!approveTarget) return;
    setActionId(approveTarget._id);
    try {
      await approveMutation.mutateAsync(approveTarget._id);
      toast.success("Withdrawal approved. Razorpay payout initiated.");
      setApproveTarget(null);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setActionId(null);
    }
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!rejectTarget) return;
    setActionId(rejectTarget._id);
    try {
      await rejectMutation.mutateAsync({
        withdrawalId: rejectTarget._id,
        rejectionReason: reason,
      });
      toast.success("Withdrawal rejected.");
      setRejectTarget(null);
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setActionId(null);
    }
  };

  const approveUser = approveTarget ? getWithdrawalUser(approveTarget.user) : null;
  const rejectUser = rejectTarget ? getWithdrawalUser(rejectTarget.user) : null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Payouts</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              Withdrawal requests
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-sidebar-foreground/80">
              Review user withdrawal requests, approve to pay via RazorpayX, or reject with a reason
              visible in the app.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 self-start sm:self-auto"
            onClick={refetch}
            disabled={listQuery.isFetching || countsQuery.isFetching}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Pending"
          value={counts?.pending?.toLocaleString() ?? (countsQuery.isLoading ? "…" : "0")}
          detail="Awaiting admin action"
          trend="neutral"
          icon={<Clock className="h-4 w-4" />}
          accent="bg-amber-500/10 text-amber-600 dark:text-amber-400"
          showTrend={false}
        />
        <StatsCard
          title="Approved"
          value={counts?.approved?.toLocaleString() ?? (countsQuery.isLoading ? "…" : "0")}
          detail="Payout initiated"
          trend="neutral"
          icon={<CheckCircle2 className="h-4 w-4" />}
          accent="bg-sky-500/10 text-sky-600 dark:text-sky-400"
          showTrend={false}
        />
        <StatsCard
          title="Completed"
          value={counts?.completed?.toLocaleString() ?? (countsQuery.isLoading ? "…" : "0")}
          detail="Paid to user bank"
          trend="neutral"
          icon={<ArrowDownToLine className="h-4 w-4" />}
          accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          showTrend={false}
        />
        <StatsCard
          title="Rejected"
          value={counts?.rejected?.toLocaleString() ?? (countsQuery.isLoading ? "…" : "0")}
          detail="Declined with reason"
          trend="neutral"
          icon={<XCircle className="h-4 w-4" />}
          accent="bg-rose-500/10 text-rose-600 dark:text-rose-400"
          showTrend={false}
        />
      </section>

      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-muted-foreground">Status</span>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full min-w-[200px] sm:w-[220px]">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value={ALL}>All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {pagination ? (
          <p className="text-sm text-muted-foreground">
            {pagination.totalRecords} total request
            {pagination.totalRecords === 1 ? "" : "s"}
          </p>
        ) : null}
      </section>

      {listQuery.error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {getErrorMessage(listQuery.error)}
        </div>
      ) : null}

      <WithdrawalsTable
        withdrawals={withdrawals}
        isLoading={listQuery.isLoading}
        actionId={actionId}
        onApprove={setApproveTarget}
        onReject={setRejectTarget}
      />

      {pagination && pagination.totalPages > 1 ? (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(approveTarget)}
        title="Approve withdrawal?"
        description={
          approveTarget && approveUser
            ? `Approve ₹${approveTarget.amount.toLocaleString("en-IN")} for ${approveUser.name}? This will deduct ${approveTarget.amount} coins and start a RazorpayX bank payout.`
            : "This will start a RazorpayX payout and deduct coins from the user."
        }
        confirmLabel="Approve & pay"
        confirmVariant="default"
        isLoading={approveMutation.isPending}
        onConfirm={() => void handleApproveConfirm()}
        onCancel={() => setApproveTarget(null)}
      />

      <RejectWithdrawalDialog
        open={Boolean(rejectTarget)}
        userName={rejectUser?.name}
        amount={rejectTarget?.amount}
        isLoading={rejectMutation.isPending}
        onConfirm={(reason) => void handleRejectConfirm(reason)}
        onCancel={() => setRejectTarget(null)}
      />
    </div>
  );
};

export default Withdrawals;
