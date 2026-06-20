import React, { useMemo, useState } from "react";
import { Search, Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { ProductsTable } from "@/components/product/ProductsTable";
import { useDeleteProductMutation } from "@/hooks/mutations/product.mutations";
import { useProductsQuery } from "@/hooks/queries/product.queries";
import { useNavigate } from "react-router-dom";

const Product: React.FC = () => {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [querySearch, setQuerySearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const params = useMemo(
    () => ({
      page,
      limit: 10,
      search: querySearch || undefined,
      sortBy,
      order,
    }),
    [page, querySearch, sortBy, order],
  );

  const { data, isLoading, isFetching, error, refetch } =
    useProductsQuery(params);
  const deleteProductMutation = useDeleteProductMutation();

  const products = data?.products ?? [];
  const pagination = data?.pagination;

  const handleSearch = () => {
    setPage(1);
    setQuerySearch(searchTerm.trim());
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleDelete = (id: string) => {
    deleteProductMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Products
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              Product catalog
            </h1>
            <p className="mt-2 text-sm text-sidebar-foreground/80">
              Manage active products, ratings, and inventory details.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="gap-2"
              onClick={() => refetch()}
            >
              <RefreshCcw className="h-4 w-4" />
              {isFetching ? "Refreshing" : "Refresh"}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={() => navigate("/products/add")}
            >
              <Plus className="h-4 w-4" />
              Add product
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products by name or description..."
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleSearch}>
              Search
            </Button>
            <select
              value={`${sortBy}:${order}`}
              onChange={(event) => {
                const [field, direction] = event.target.value.split(":");
                setSortBy(field);
                setOrder(direction as "asc" | "desc");
              }}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40"
            >
              <option value="createdAt:desc">Newest first</option>
              <option value="createdAt:asc">Oldest first</option>
              <option value="averageRating:desc">Top rated</option>
              <option value="totalReviews:desc">Most reviewed</option>
            </select>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive shadow-sm shadow-red-500/10">
          {typeof error === "object" && error !== null && "message" in error
            ? String((error as { message?: unknown }).message)
            : "Unable to load products. Please try again."}
        </div>
      ) : isLoading ? (
        <ProductSkeleton />
      ) : (
        <ProductsTable
          products={products}
          onDelete={handleDelete}
          deletingId={deleteProductMutation.variables ?? null}
        />
      )}

      {pagination && (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
          <p>
            Showing page {pagination.page} of {pagination.pages} —{" "}
            {pagination.total} products
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.pages}
              onClick={() =>
                setPage((current) => Math.min(pagination.pages, current + 1))
              }
            >
              Next
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Product;
