// components/dashboard/TopProducts.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ProductRow {
  name: string;
  sold: string;
  growth: string;
  percent: number; // 0–100 for progress bar
}

interface TopProductsProps {
  products: ProductRow[];
}

export const TopProducts: React.FC<TopProductsProps> = ({ products }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Top products</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Best sellers this month.
          </p>
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
      </div>

      <div className="space-y-3">
        {products.map((product, i) => (
          <div
            key={product.name}
            className="rounded-2xl border border-border/60 bg-muted/40 p-4 transition-colors hover:bg-muted/70"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                  #{i + 1}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {product.sold} sold
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                {product.growth}
              </span>
            </div>

            {/* progress bar */}
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${product.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
