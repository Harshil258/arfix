import { useQuery } from "@tanstack/react-query";
import {
  getCouponSessions,
  type CouponSessionsListParams,
  type CouponSessionsListResponse,
} from "@/api/couponApi";

export const useCouponSessionsQuery = (params: CouponSessionsListParams) => {
  const queryKey = [
    "couponSessions",
    params.page ?? 1,
    params.limit ?? 10,
    params.sortBy ?? "createdAt",
    params.order ?? "desc",
  ] as const;

  return useQuery<CouponSessionsListResponse>({
    queryKey,
    queryFn: () => getCouponSessions(params),
  });
};
