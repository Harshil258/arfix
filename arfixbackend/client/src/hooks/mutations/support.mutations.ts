import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateSupportMessage,
  type UpdateSupportMessagePayload,
} from "@/api/supportApi";

export const useUpdateSupportMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: string } & UpdateSupportMessagePayload) =>
      updateSupportMessage(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["supportMessages"] });
      queryClient.invalidateQueries({ queryKey: ["supportMessages", "detail", variables.id] });
    },
  });
};
