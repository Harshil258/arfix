import React, { useState } from "react";
import {
  Banknote,
  ExternalLink,
  IndianRupee,
  RefreshCcw,
  Wallet,
  PlusCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RazorpayTransactionsTable } from "@/components/razorpay/RazorpayTransactionsTable";
import { RazorpayTopupsTable } from "@/components/razorpay/RazorpayTopupsTable";
import {
  useRazorpayBalanceQuery,
  useRazorpayTopupsQuery,
  useRazorpayTransactionsQuery,
} from "@/hooks/queries/razorpay.queries";
import { useCreateRazorpayTopupMutation } from "@/hooks/mutations/razorpay.mutations";
import {
  razorpayTopupSchema,
  type RazorpayTopupFormValues,
} from "@/schemas/razorpayTopup.schema";

const currency = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(n);

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: unknown }).message);
  }
  return "Something went wrong.";
}

const RazorpayWallet: React.FC = () => {
  const [txnPage, setTxnPage] = useState(1);
  const [topupPage, setTopupPage] = useState(1);
  const [lastPaymentUrl, setLastPaymentUrl] = useState<string | null>(null);

  const balanceQuery = useRazorpayBalanceQuery();
  const transactionsQuery = useRazorpayTransactionsQuery({ page: txnPage, limit: 20 });
  const topupsQuery = useRazorpayTopupsQuery(topupPage);
  const topupMutation = useCreateRazorpayTopupMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RazorpayTopupFormValues>({
    resolver: zodResolver(razorpayTopupSchema) as Resolver<RazorpayTopupFormValues>,
    defaultValues: { amount: 1000, note: "" },
  });

  const balance = balanceQuery.data;
  const transactions = transactionsQuery.data?.transactions ?? [];
  const txnPagination = transactionsQuery.data?.pagination;
  const topups = topupsQuery.data?.topups ?? [];
  const topupsPagination = topupsQuery.data?.pagination;

  const refetchAll = () => {
    void balanceQuery.refetch();
    void transactionsQuery.refetch();
    void topupsQuery.refetch();
  };

  const onTopupSubmit = async (data: RazorpayTopupFormValues) => {
    try {
      const result = await topupMutation.mutateAsync({
        amount: data.amount,
        note: data.note,
      });
      setLastPaymentUrl(result.topup.shortUrl);
      toast.success("Payment link created. Open the link to add funds to Razorpay.");
      reset({ amount: data.amount, note: "" });
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const balanceDisplay = () => {
    if (balanceQuery.isLoading && !balance) return "…";
    if (balanceQuery.error) return "—";
    return currency(balance?.availableBalanceInr ?? balance?.balanceInr ?? 0);
  };

  const totalBalanceDisplay = () => {
    if (balanceQuery.isLoading && !balance) return "…";
    if (balanceQuery.error) return "—";
    return currency(balance?.balanceInr ?? 0);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Payments</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              Razorpay wallet
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-sidebar-foreground/80">
              View live RazorpayX balance, add funds via a secure payment link, and browse account
              transaction history.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="gap-2 self-start sm:self-auto"
            onClick={refetchAll}
            disabled={balanceQuery.isFetching || transactionsQuery.isFetching}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </section>

      {balanceQuery.error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {getErrorMessage(balanceQuery.error)}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatsCard
          title="Available balance"
          value={balanceDisplay()}
          detail="Withdrawable RazorpayX balance"
          trend="neutral"
          icon={<Wallet className="h-4 w-4" />}
          accent="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          showTrend={false}
        />
        <StatsCard
          title="Total balance"
          value={totalBalanceDisplay()}
          detail="Including pending settlements"
          trend="neutral"
          icon={<IndianRupee className="h-4 w-4" />}
          accent="bg-sky-500/10 text-sky-600 dark:text-sky-400"
          showTrend={false}
        />
        <StatsCard
          title="Account"
          value={balance?.accountNumber ?? "—"}
          detail={
            balance?.bankName
              ? `${balance.bankName} · ${balance.accountType ?? "RazorpayX"}`
              : "Linked RazorpayX account"
          }
          trend="neutral"
          icon={<Banknote className="h-4 w-4" />}
          accent="bg-violet-500/10 text-violet-600 dark:text-violet-400"
          showTrend={false}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <form
          onSubmit={handleSubmit(onTopupSubmit)}
          className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5"
        >
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Add balance</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Creates a Razorpay payment link. Complete payment to credit your business account.
              </p>
            </div>
          </div>

          <FieldGroup className="max-w-md space-y-5">
            <Field>
              <FieldLabel htmlFor="amount">Amount (INR)</FieldLabel>
              <Input
                id="amount"
                type="number"
                min={1}
                step="0.01"
                {...register("amount", { valueAsNumber: true })}
              />
              {errors.amount ? (
                <p className="mt-1 text-xs text-destructive">{errors.amount.message}</p>
              ) : null}
            </Field>
            <Field>
              <FieldLabel htmlFor="note">Note (optional)</FieldLabel>
              <Input id="note" placeholder="e.g. Monthly float top-up" {...register("note")} />
              {errors.note ? (
                <p className="mt-1 text-xs text-destructive">{errors.note.message}</p>
              ) : null}
            </Field>
            <Button type="submit" className="gap-2" disabled={topupMutation.isPending}>
              <PlusCircle className="h-4 w-4" />
              {topupMutation.isPending ? "Creating link…" : "Create payment link"}
            </Button>
          </FieldGroup>

          {lastPaymentUrl ? (
            <div className="mt-6 rounded-[20px] border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm font-medium text-foreground">Latest payment link</p>
              <p className="mt-1 break-all text-xs text-muted-foreground">{lastPaymentUrl}</p>
              <Button variant="outline" size="sm" className="mt-3 gap-2" asChild>
                <a href={lastPaymentUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Open payment page
                </a>
              </Button>
            </div>
          ) : null}
        </form>

        <RazorpayTopupsTable topups={topups} />
      </section>

      {topupsPagination && topupsPagination.pages > 1 ? (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={topupPage <= 1}
            onClick={() => setTopupPage((p) => p - 1)}
          >
            Previous top-ups
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {topupPage} of {topupsPagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={topupPage >= topupsPagination.pages}
            onClick={() => setTopupPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}

      <RazorpayTransactionsTable
        transactions={transactions}
        isLoading={transactionsQuery.isLoading}
      />

      {transactionsQuery.error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
          {getErrorMessage(transactionsQuery.error)}
        </div>
      ) : null}

      {txnPagination && (txnPagination.hasMore || txnPage > 1) ? (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={txnPage <= 1}
            onClick={() => setTxnPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">Page {txnPage}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={!txnPagination.hasMore}
            onClick={() => setTxnPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default RazorpayWallet;
