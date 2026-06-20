import React from "react";
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "@/hooks/mutations/user.mutations";
import { UserForm } from "@/components/forms/UserForm";
import type { UserCreateFormValues } from "@/schemas/user.schema";
import { useAppSelector } from "@/store/hooks";
import { toast } from "react-toastify";

const AddUser: React.FC = () => {
  const navigate = useNavigate();
  const mutation = useCreateUserMutation();
  const actorRole = useAppSelector((s) => s.currentUser.user?.role);
  const allowAdminRole = actorRole === "admin";

  const handleSubmit = async (data: UserCreateFormValues) => {
    try {
      await mutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      });
      toast.success("User created successfully.");
      navigate("/users");
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "message" in e
          ? String((e as { message?: unknown }).message)
          : "Unable to create user.";
      toast.error(msg);
    }
  };

  if (actorRole !== "admin") {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
        You do not have permission to create users.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {mutation.isError ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive shadow-sm shadow-red-500/10">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Unable to save user. Please try again."}
        </div>
      ) : null}

      <UserForm
        mode="create"
        title="Create user"
        submitLabel="Create user"
        isSubmitting={mutation.isPending}
        allowAdminRole={allowAdminRole}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/users")}
      />
    </div>
  );
};

export default AddUser;