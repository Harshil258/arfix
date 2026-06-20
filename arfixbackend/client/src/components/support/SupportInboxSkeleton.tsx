import React from "react";

export const SupportInboxSkeleton: React.FC = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="mb-6 animate-pulse">
        <div className="h-5 w-40 rounded-full bg-muted" />
        <div className="mt-2 h-4 w-72 rounded-full bg-muted/70" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="flex animate-pulse items-center gap-4 rounded-[20px] border border-border/70 bg-muted/40 p-4"
          >
            <div className="h-4 w-16 rounded-full bg-muted" />
            <div className="h-4 flex-1 rounded-full bg-muted" />
            <div className="h-9 w-20 rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
};
