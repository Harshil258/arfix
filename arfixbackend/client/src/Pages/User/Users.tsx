import React, { useState } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserListSkeleton } from "@/components/user/UserListSkeleton";
import { UsersTable } from "@/components/user/UsersTable";
import { useUsersQuery } from "@/hooks/queries/user.queries";
import { useNavigate } from "react-router-dom";
import type { UserListType } from "@/api/userApi";
import { useAppSelector } from "@/store/hooks";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: unknown }).message);
  }
  return "Unable to load users. Please try again.";
}

const Users: React.FC = () => {
  const navigate = useNavigate();
  const currentRole = useAppSelector((s) => s.currentUser.user?.role);
  const [listType, setListType] = useState<UserListType>("user");

  const { data: users = [], isLoading, isFetching, error, refetch } = useUsersQuery(listType);

  const canManageUsers = currentRole === "admin";

  if (!canManageUsers) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm shadow-black/5 dark:shadow-white/5">
        <p className="text-lg font-semibold text-foreground">Restricted area</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Only administrators can view the user directory.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Users</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
              User directory
            </h1>
            <p className="mt-2 text-sm text-sidebar-foreground/80">
              Switch between end users and internal staff. Your own account is never shown.
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
              onClick={() => navigate("/users/add")}
            >
              <Plus className="h-4 w-4" />
              Add user
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground" htmlFor="list-type">
            List type
          </label>
          <Select value={listType} onValueChange={(value) => setListType(value as UserListType)}>
            <SelectTrigger id="list-type" className="min-w-[200px]">
              <SelectValue placeholder="Select a list type" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="user">Users (customers)</SelectItem>
              <SelectItem value="staff">Staff &amp; admins</SelectItem>
            </SelectContent>
          </Select>
        </div>

      </section>

      {error ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive shadow-sm shadow-red-500/10">
          {getErrorMessage(error)}
        </div>
      ) : isLoading ? (
        <UserListSkeleton />
      ) : (
        <UsersTable users={users} onEdit={(id) => navigate(`/users/edit/${id}`)} />
      )}
    </div>
  );
};

export default Users;
