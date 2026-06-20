import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserForm } from "@/components/forms/UserForm";
import { useUserQuery } from "@/hooks/queries/user.queries";
import { useUpdateUserMutation } from "@/hooks/mutations/user.mutations";
import { UserListSkeleton } from "@/components/user/UserListSkeleton";
import type { UserUpdateFormValues } from "@/schemas/user.schema";
import { useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";

const EditUser: React.FC = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const id = userId ?? "";

  const userQuery = useUserQuery(id, { enabled: Boolean(userId) });
  const mutation = useUpdateUserMutation();
  const actorRole = useAppSelector((s) => s.currentUser.user?.role);
  const allowAdminRole = actorRole === "admin";

  const user = userQuery.data;

  const handleSubmit = async (data: UserUpdateFormValues) => {
    try {
      const payload: {
        name: string;
        email: string;
        role: UserUpdateFormValues["role"];
        isActive: boolean;
        password?: string;
      } = {
        name: data.name,
        email: data.email,
        role: data.role,
        isActive: data.isActive,
      };
      const trimmed = data.password?.trim();
      if (trimmed) {
        payload.password = trimmed;
      }
      await mutation.mutateAsync({ id, ...payload });
      toast.success("User updated successfully.");
      navigate("/users");
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message?: unknown }).message)
          : "Unable to update user.";
      toast.error(msg);
    }
  };

  if (!userId) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
        Invalid user selected for editing.
      </div>
    );
  }

  if (actorRole !== "admin") {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
        You do not have permission to edit users.
      </div>
    );
  }

  if (userQuery.isLoading) {
    return <UserListSkeleton />;
  }

  if (userQuery.error || !user) {
    return (
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive shadow-sm shadow-red-500/10">
        {userQuery.error instanceof Error
          ? userQuery.error.message
          : "Unable to load user details."}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {mutation.isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive shadow-sm shadow-red-500/10">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Unable to update user. Please try again."}
        </div>
      ) : null}

      <UserForm
        key={user.id}
        mode="edit"
        title="Edit user"
        submitLabel="Save changes"
        isSubmitting={mutation.isPending}
        allowAdminRole={allowAdminRole}
        initialUser={user}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/users")}
      />
    </div>
  );
};

export default EditUser;