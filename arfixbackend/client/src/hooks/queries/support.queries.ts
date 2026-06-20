import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  getSupportMessage,
  getSupportMessages,
  type SupportMessageDetail,
  type SupportMessagesListParams,
  type SupportMessagesListResponse,
} from "@/api/supportApi";

export const useSupportMessagesQuery = (params: SupportMessagesListParams) => {
  const queryKey = [
    "supportMessages",
    params.page ?? 1,
    params.limit ?? 10,
    params.sortBy ?? "createdAt",
    params.order ?? "desc",
    params.status ?? "",
    params.unreadOnly === true ? "unread" : params.unreadOnly === false ? "all" : "",
  ] as const;

  return useQuery<SupportMessagesListResponse>({
    queryKey,
    queryFn: () => getSupportMessages(params),
  });
};

export const useSupportMessageQuery = (
  id: string,
  options?: Omit<UseQueryOptions<SupportMessageDetail>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["supportMessages", "detail", id],
    queryFn: () => getSupportMessage(id),
    enabled: Boolean(id),
    ...options,
  });
};
