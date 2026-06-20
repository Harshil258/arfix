import React from "react";

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="mb-6 animate-pulse">
        <div className="h-5 w-48 rounded-full bg-muted" />
        <div className="mt-2 h-4 w-72 rounded-full bg-muted/70" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="grid gap-4 rounded-[20px] border border-border/70 bg-muted/40 p-4 md:grid-cols-[160px_1fr_120px]">
            <div className="h-14 w-full rounded-2xl bg-muted" />
            <div className="space-y-3">
              <div className="h-3 w-3/4 rounded-full bg-muted" />
              <div className="h-3 w-1/2 rounded-full bg-muted" />
            </div>
            <div className="flex items-center justify-end">
              <div className="h-9 w-24 rounded-full bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};