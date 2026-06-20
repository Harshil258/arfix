import React, { useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SupportInboxSkeleton } from "@/components/support/SupportInboxSkeleton";
import { SupportMessagesTable } from "@/components/support/SupportMessagesTable";
import { useSupportMessagesQuery } from "@/hooks/queries/support.queries";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SupportStatus } from "@/api/supportApi";

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: unknown }).message);
  }
  return "Unable to load support messages.";
}

const ALL = "__all__";

const SupportInbox: React.FC = () => {
  const navigate = useNavigate();
  const currentRole = useAppSelector((s) => s.currentUser.user?.role);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>(ALL);
  const [unreadFilter, setUnreadFilter] = useState<string>(ALL);

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      sortBy: "createdAt",
      order: "desc" as const,
      ...(statusFilter !== ALL ? { status: statusFilter as SupportStatus } : {}),
      ...(unreadFilter === "unread" ? { unreadOnly: true } : {}),
      ...(unreadFilter === "read" ? { unreadOnly: false } : {}),
    }),
    [page, statusFilter, unreadFilter],
  );

  const { data, isLoading, isFetching, error, refetch } = useSupportMessagesQuery(params);

  const messages = data?.messages ?? [];
  const pagination = data?.pagination;

  const canAccess = currentRole === "admin" || currentRole === "staff";

  if (!canAccess) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm shadow-black/5 dark:shadow-white/5">
        <p className="text-lg font-semibold text-foreground">Restricted area</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Only administrators and staff can view the support inbox.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Support</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              Support inbox
            </h1>
            <p className="mt-2 text-sm text-sidebar-foreground/80">
              Messages submitted from the mobile app (subject + message) with read tracking and
              status.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            className="gap-2 self-start sm:self-auto"
            onClick={() => refetch()}
          >
            <RefreshCcw className="h-4 w-4" />
            {isFetching ? "Refreshing" : "Refresh"}
          </Button>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-muted-foreground">Status</span>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full min-w-[180px] sm:w-[200px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value={ALL}>All statuses</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-muted-foreground">Read state</span>
            <Select value={unreadFilter} onValueChange={(v) => { setUnreadFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full min-w-[180px] sm:w-[200px]">
                <SelectValue placeholder="All messages" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value={ALL}>All messages</SelectItem>
                <SelectItem value="unread">Unread only</SelectItem>
                <SelectItem value="read">Read only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive shadow-sm shadow-red-500/10">
          {getErrorMessage(error)}
        </div>
      ) : isLoading ? (
        <SupportInboxSkeleton />
      ) : (
        <SupportMessagesTable messages={messages} onOpen={(id) => navigate(`/support/${id}`)} />
      )}

      {pagination ? (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
          <p>
            Showing page {pagination.page} of {pagination.pages} — {pagination.total} messages
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

export default SupportInbox;
