import React, { useMemo, useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CouponSessionSkeleton } from "@/components/coupon/CouponSessionSkeleton";
import { CouponSessionsTable } from "@/components/coupon/CouponSessionsTable";
import { useCouponSessionsQuery } from "@/hooks/queries/couponSession.queries";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { downloadCouponSessionPdf } from "@/api/couponApi";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: unknown }).message);
  }
  return "Unable to load coupon sessions. Please try again.";
}

const CouponSessions: React.FC = () => {
  const navigate = useNavigate();
  const currentRole = useAppSelector((s) => s.currentUser.user?.role);
  const [page, setPage] = useState(1);
  const [sortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      sortBy,
      order,
    }),
    [page, sortBy, order],
  );

  const { data, isLoading, isFetching, error, refetch } = useCouponSessionsQuery(params);

  const sessions = data?.sessions ?? [];
  const pagination = data?.pagination;

  const canManage = currentRole === "admin" || currentRole === "staff";

  const handleDownload = async (sessionId: string) => {
    setDownloadingId(sessionId);
    try {
      const blob = await downloadCouponSessionPdf(sessionId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `coupons-session-${sessionId}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
      toast.success("Download started.");
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message?: unknown }).message)
          : "Could not download PDF.";
      toast.error(msg);
    } finally {
      setDownloadingId(null);
    }
  };

  if (!canManage) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm shadow-black/5 dark:shadow-white/5">
        <p className="text-lg font-semibold text-foreground">Restricted area</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Only administrators and staff can manage coupon sessions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Coupons</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              Coupon sessions
            </h1>
            <p className="mt-2 text-sm text-sidebar-foreground/80">
              Batches of coupons with QR-ready PDFs. Download any session to print.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => refetch()}
            >
              <RefreshCcw className="h-4 w-4" />
              {isFetching ? "Refreshing" : "Refresh"}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={() => navigate("/coupons/create")}
            >
              <Plus className="h-4 w-4" />
              Create session
            </Button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-1.5 sm:max-w-xs">
          <span className="text-sm font-medium text-muted-foreground">Sort by date</span>
          <Select value={order} onValueChange={(v) => setOrder(v as "asc" | "desc")}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="desc">Newest first</SelectItem>
              <SelectItem value="asc">Oldest first</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive shadow-sm shadow-red-500/10">
          {getErrorMessage(error)}
        </div>
      ) : isLoading ? (
        <CouponSessionSkeleton />
      ) : (
        <CouponSessionsTable
          sessions={sessions}
          downloadingId={downloadingId}
          onDownload={handleDownload}
        />
      )}

      {pagination ? (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
          <p>
            Showing page {pagination.page} of {pagination.pages} — {pagination.total} sessions
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.pages}
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            >
              Next
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
};

export default CouponSessions;
