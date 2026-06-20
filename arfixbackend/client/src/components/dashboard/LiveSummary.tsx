// components/dashboard/LiveSummary.tsx
import React from "react";
import { Server, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

interface LiveMetric {
  label: string;
  detail: string;
  icon: React.ReactNode;
  value: number; // 0–100 for the ring / bar
  accentClass: string;
}

export const LiveSummary: React.FC = () => {
  const metrics: LiveMetric[] = [
    {
      label: "Server load",
      detail: "26% avg over the last hour",
      icon: <Server className="h-4 w-4" />,
      value: 26,
      accentClass: "text-sky-500 bg-sky-500/10",
    },
    {
      label: "New signups",
      detail: "78 new accounts in 24 hrs",
      icon: <UserPlus className="h-4 w-4" />,
      value: 78,
      accentClass: "text-violet-500 bg-violet-500/10",
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="mb-5">
        <p className="text-sm font-semibold text-foreground">Live summary</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Current system health and traffic.
        </p>
      </div>

      <div className="grid gap-3">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="flex items-center gap-4 rounded-2xl border border-border/60 bg-muted/40 p-4"
          >
            <div className={cn("rounded-xl p-2.5", m.accentClass)}>
              {m.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  {m.label}
                </p>
                <span className="text-xs font-bold text-foreground">
                  {m.value}
                  {m.label === "Server load" ? "%" : ""}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{m.detail}</p>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-700",
                    m.label === "Server load" ? "bg-sky-500" : "bg-violet-500",
                  )}
                  style={{
                    width: `${m.label === "Server load" ? m.value : Math.min(m.value, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
