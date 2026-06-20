// components/dashboard/StatsCard.tsx
import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  detail: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  accent?: string; // tailwind bg class for icon bg
  /** When false, hides the trend badge in the top-right */
  showTrend?: boolean;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  detail,
  trend = "neutral",
  icon,
  accent = "bg-primary/10 text-primary",
  showTrend = true,
}) => {
  const TrendIcon =
    trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up"
      ? "text-emerald-500"
      : trend === "down"
        ? "text-rose-500"
        : "text-muted-foreground";

  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-border bg-card p-5 shadow-sm shadow-black/5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 dark:shadow-white/5">
      {/* subtle glow on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 ring-1 ring-inset ring-primary/20 transition-opacity duration-200 group-hover:opacity-100" />

      <div className="flex items-start justify-between gap-3">
        <div className={cn("rounded-2xl p-2.5", accent)}>{icon}</div>
        {showTrend ? (
          <span
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
              trend === "up"
                ? "bg-emerald-500/10 text-emerald-500"
                : trend === "down"
                  ? "bg-rose-500/10 text-rose-500"
                  : "bg-muted text-muted-foreground",
            )}
          >
            <TrendIcon className="h-3 w-3" />
          </span>
        ) : (
          <span className="h-7 w-7 shrink-0" aria-hidden />
        )}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{title}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </p>
      <p className={cn("mt-2 text-xs font-medium", trendColor)}>{detail}</p>
    </div>
  );
};
