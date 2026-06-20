import React from "react";
import { cn } from "@/lib/utils";

/** Fourth dashboard slot — intentionally minimal / empty */
export const DashboardEmptyStat: React.FC = () => {
  return (
    <div
      className={cn(
        "flex min-h-[148px] flex-col justify-center rounded-[28px] border border-dashed border-border/80 bg-muted/10 p-5 text-center shadow-sm shadow-black/5 dark:shadow-white/5",
      )}
    >
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground/80">
        Reserved
      </p>
      <p className="mt-2 text-sm text-muted-foreground">More metrics coming soon.</p>
    </div>
  );
};
