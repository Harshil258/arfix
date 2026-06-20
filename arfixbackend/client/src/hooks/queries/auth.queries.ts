import { useQuery } from "@tanstack/react-query";
import { fetchCurrentUser } from "@/api/authApi";

export const useAuthMeQuery = () => {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
  });
};
