import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";

interface RejectWithdrawalDialogProps {
  open: boolean;
  userName?: string;
  amount?: number;
  isLoading?: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export const RejectWithdrawalDialog: React.FC<RejectWithdrawalDialogProps> = ({
  open,
  userName,
  amount,
  isLoading,
  onConfirm,
  onCancel,
}) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = reason.trim();
    if (trimmed.length < 5) return;
    onConfirm(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg shadow-black/20"
      >
        <h2 className="text-xl font-semibold text-foreground">Reject withdrawal</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {userName && amount != null
            ? `Reject ₹${amount.toLocaleString("en-IN")} request from ${userName}. The user will see your reason in the app.`
            : "Provide a reason the user will see in the app."}
        </p>

        <Field className="mt-4">
          <FieldLabel htmlFor="rejectionReason">Rejection reason</FieldLabel>
          <textarea
            id="rejectionReason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            placeholder="e.g. Bank details could not be verified"
            className="mt-1.5 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            required
            minLength={5}
            maxLength={500}
          />
          <p className="mt-1 text-xs text-muted-foreground">Minimum 5 characters.</p>
        </Field>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="destructive"
            disabled={isLoading || reason.trim().length < 5}
            className="min-w-[96px]"
          >
            {isLoading ? "Rejecting…" : "Reject"}
          </Button>
        </div>
      </form>
    </div>
  );
};
