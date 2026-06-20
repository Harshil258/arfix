import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import type { CouponSessionItem } from "@/api/couponApi";
import { cn } from "@/lib/utils";

interface CouponSessionsTableProps {
  sessions: CouponSessionItem[];
  downloadingId: string | null;
  onDownload: (sessionId: string) => void;
}

export const CouponSessionsTable: React.FC<CouponSessionsTableProps> = ({
  sessions,
  downloadingId,
  onDownload,
}) => {
  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
        No coupon sessions yet. Create a batch to generate printable QR codes.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="mb-5">
        <p className="text-sm font-semibold text-foreground">Coupon sessions</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Each session is a batch of coupons at one price. Download the PDF to print QR codes.
        </p>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-border">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead className="bg-muted/60 text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Session</th>
              <th className="px-4 py-3 font-medium">Quantity</th>
              <th className="px-4 py-3 font-medium">Price / coupon</th>
              <th className="px-4 py-3 font-medium">Created by</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium text-right">Download</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((row, index) => (
              <tr
                key={row.id}
                className={cn(
                  "transition-colors duration-150 hover:bg-muted/40",
                  index !== 0 && "border-t border-border",
                )}
              >
                <td className="max-w-[140px] truncate px-4 py-4 font-mono text-xs text-foreground" title={row.id}>
                  {row.id}
                </td>
                <td className="px-4 py-4 font-semibold text-foreground">{row.quantity}</td>
                <td className="px-4 py-4 text-sidebar-foreground/90">
                  {row.price.toLocaleString(undefined, {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td className="px-4 py-4 text-sidebar-foreground/90">
                  {row.createdBy?.name ?? "—"}
                  {row.createdBy?.email ? (
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {row.createdBy.email}
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-4 text-sidebar-foreground/90">
                  {new Date(row.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-4 text-right">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    disabled={downloadingId === row.id}
                    onClick={() => onDownload(row.id)}
                  >
                    <Download className="h-4 w-4" />
                    {downloadingId === row.id ? "Downloading…" : "PDF"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
