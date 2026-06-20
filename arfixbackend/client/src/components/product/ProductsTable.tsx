import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import type { ProductItem } from "@/api/productApi";
import { cn } from "@/lib/utils";

interface ProductsTableProps {
  products: ProductItem[];
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export const ProductsTable: React.FC<ProductsTableProps> = ({
  products,
  onDelete,
  deletingId,
}) => {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
        No products found. Try changing the search or refreshing the list.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Product inventory</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage product details, ratings, and publication state.
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-border">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead className="bg-muted/60 text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Reviews</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product._id}
                className={cn(
                  "transition-colors duration-150 hover:bg-muted/40",
                  index !== 0 && "border-t border-border",
                )}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="overflow-hidden rounded-2xl bg-muted/50">
                      <img
                        src={product.images?.[0]?.url ?? "https://via.placeholder.com/56"}
                        alt={product.name}
                        className="h-12 w-12 object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {product.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 font-semibold text-foreground">
                  {product.averageRating.toFixed(1)} / 5
                </td>
                <td className="px-4 py-4 text-sm text-sidebar-foreground/90">
                  {product.totalReviews}
                </td>
                <td className="px-4 py-4 text-sm text-sidebar-foreground/90">
                  {product.createdBy?.name || "Unknown"}
                </td>
                <td className="px-4 py-4 text-sm text-sidebar-foreground/90">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(product._id)}
                    className="gap-2"
                    disabled={deletingId === product._id}
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingId === product._id ? "Deleting" : "Delete"}
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