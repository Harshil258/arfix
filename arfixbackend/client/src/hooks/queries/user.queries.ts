import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getUser, getUsers, type UserListItem, type UserListType } from "@/api/userApi";

export const useUsersQuery = (listType: UserListType) => {
  return useQuery({
    queryKey: ["users", listType],
    queryFn: () => getUsers(listType),
  });
};

export const useUserQuery = (
  userId: string,
  options?: Omit<UseQueryOptions<UserListItem>, "queryKey" | "queryFn">,
) => {
  return useQuery({
    queryKey: ["users", "detail", userId],
    queryFn: () => getUser(userId),
    enabled: Boolean(userId),
    ...options,
  });
};
