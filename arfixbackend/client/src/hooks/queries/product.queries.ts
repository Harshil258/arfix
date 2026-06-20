import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { setProducts } from "@/store/slices/productSlice";
import { getProduct, getProducts } from "@/api/productApi";
import type {
  ProductItem,
  ProductListParams,
  ProductListResponse,
} from "@/api/productApi";
import { useEffect } from "react";

export const useProductsQuery = (params: ProductListParams) => {
  const dispatch = useAppDispatch();
  const queryKey = [
    "products",
    params.page ?? 1,
    params.limit ?? 10,
    params.search ?? "",
    params.sortBy ?? "createdAt",
    params.order ?? "desc",
  ] as const;

  const query = useQuery<ProductListResponse>({
    queryKey,
    queryFn: () => getProducts(params),
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setProducts(query.data.products));
    }
  }, [query.data, dispatch]);

  return query;
};
export const useProductQuery = (
  productId: string,
  options?: Omit<UseQueryOptions<ProductItem>, "queryKey" | "queryFn">,
) => {
  return useQuery<ProductItem>({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: Boolean(productId),
    ...options,
  });
};
