import React from "react";
import { Package, TicketPercent, Users } from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DashboardEmptyStat } from "@/components/dashboard/DashboardEmptyStat";
import { DashboardUsersTable } from "@/components/dashboard/DashboardUsersTable";
import { DashboardSupportTable } from "@/components/dashboard/DashboardSupportTable";
import { useDashboardSummaryQuery } from "@/hooks/queries/dashboard.queries";
import { useAppSelector } from "@/store/hooks";

const currency = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useDashboardSummaryQuery();
  const role = useAppSelector((s) => s.currentUser.user?.role);
  const isStaff = role === "admin" || role === "staff";
  const isAdmin = role === "admin";

  const stats = data?.stats;

  const fmt = (n: number | undefined) => {
    if (isLoading && data === undefined) return "…";
    if (n === undefined) return "—";
    return n.toLocaleString();
  };

  const spendDisplay = () => {
    if (isLoading && data === undefined) return "…";
    if (!stats) return "—";
    return currency(stats.couponSpendTotal);
  };

  return (
    <>
      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive shadow-sm shadow-red-500/10">
          {typeof error === "object" && error !== null && "message" in error
            ? String((error as { message?: unknown }).message)
            : "Unable to load dashboard data."}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Customers (User role)"
          value={fmt(stats?.endUserCount)}
          detail="Accounts with role User only"
          trend="neutral"
          icon={<Users className="h-4 w-4" />}
          accent="bg-sky-500/10 text-sky-500"
          showTrend={false}
        />
        <StatsCard
          title="Active products"
          value={fmt(stats?.productCount)}
          detail="Published, non-deleted catalog items"
          trend="neutral"
          icon={<Package className="h-4 w-4" />}
          accent="bg-violet-500/10 text-violet-500"
          showTrend={false}
        />
        <StatsCard
          title="Coupon spend (issued)"
          value={spendDisplay()}
          detail="Sum of price × quantity across all sessions"
          trend="neutral"
          icon={<TicketPercent className="h-4 w-4" />}
          accent="bg-rose-500/10 text-rose-500"
          showTrend={false}
        />
        <DashboardEmptyStat />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DashboardUsersTable
          users={data?.recentEndUsers ?? []}
          isStaff={isStaff}
          isAdmin={isAdmin}
        />
        <DashboardSupportTable rows={data?.recentSupport ?? []} isStaff={isStaff} />
      </section>
    </>
  );
};

export default Dashboard;
