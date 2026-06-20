import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useSupportMessageQuery } from "@/hooks/queries/support.queries";
import { useUpdateSupportMessageMutation } from "@/hooks/mutations/support.mutations";
import { SupportInboxSkeleton } from "@/components/support/SupportInboxSkeleton";
import { useAppSelector } from "@/store/hooks";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SupportStatus } from "@/api/supportApi";
import { toast } from "react-toastify";

const statusOptions: { value: SupportStatus; label: string }[] = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const SupportMessageDetail: React.FC = () => {
  const { messageId } = useParams();
  const navigate = useNavigate();
  const id = messageId ?? "";
  const currentRole = useAppSelector((s) => s.currentUser.user?.role);
  const canAccess = currentRole === "admin" || currentRole === "staff";

  const query = useSupportMessageQuery(id, { enabled: Boolean(messageId) && canAccess });
  const mutation = useUpdateSupportMessageMutation();
  const [status, setStatus] = useState<SupportStatus | "">("");

  const msg = query.data;

  useEffect(() => {
    if (msg?.status) setStatus(msg.status);
  }, [msg?.status]);

  const handleSaveStatus = async () => {
    if (!messageId || !status) return;
    try {
      await mutation.mutateAsync({ id: messageId, status });
      toast.success("Status updated.");
    } catch (e: unknown) {
      const m =
        e && typeof e === "object" && "message" in e
          ? String((e as { message?: unknown }).message)
          : "Update failed.";
      toast.error(m);
    }
  };

  if (!canAccess) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
        You do not have permission to view this message.
      </div>
    );
  }

  if (!messageId) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
        Invalid message.
      </div>
    );
  }

  if (query.isLoading) {
    return <SupportInboxSkeleton />;
  }

  if (query.error || !msg) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" className="gap-2" onClick={() => navigate("/support")}>
          <ArrowLeft className="h-4 w-4" />
          Back to inbox
        </Button>
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive shadow-sm shadow-red-500/10">
          {query.error instanceof Error ? query.error.message : "Unable to load this message."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" className="gap-2 w-fit" onClick={() => navigate("/support")}>
        <ArrowLeft className="h-4 w-4" />
        Back to inbox
      </Button>

      <section className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Support message</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              {msg.subject}
            </h1>
            <p className="mt-2 text-xs text-muted-foreground">
              Received {new Date(msg.createdAt).toLocaleString()}
              {msg.updatedAt !== msg.createdAt
                ? ` · Updated ${new Date(msg.updatedAt).toLocaleString()}`
                : null}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Status
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={status} onValueChange={(v) => setStatus(v as SupportStatus)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {statusOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                disabled={mutation.isPending || !status || status === msg.status}
                onClick={() => void handleSaveStatus()}
              >
                {mutation.isPending ? "Saving…" : "Save status"}
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Message</h2>
            <div className="mt-3 rounded-[20px] border border-border bg-muted/30 p-4 text-sm leading-relaxed text-foreground whitespace-pre-wrap">
              {msg.message}
            </div>
          </div>

          <div className="rounded-[20px] border border-border bg-muted/20 p-4">
            <h2 className="text-sm font-semibold text-foreground">Customer</h2>
            <p className="mt-3 text-sm font-medium">{msg.user?.name ?? "—"}</p>
            <p className="mt-1 text-xs text-muted-foreground break-all">{msg.user?.email ?? ""}</p>
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              User id: {msg.user?.id ?? "—"}
            </p>
            <Separator className="my-4" />
            <p className="text-xs text-muted-foreground">
              Opening this page marks the thread as read for staff. Change status to track workflow
              (e.g. In progress → Resolved).
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SupportMessageDetail;
