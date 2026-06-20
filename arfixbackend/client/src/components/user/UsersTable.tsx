import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { UserListItem } from "@/api/userApi";
import { cn } from "@/lib/utils";

interface UsersTableProps {
  users: UserListItem[];
  onEdit: (id: string) => void;
}

const roleLabel: Record<string, string> = {
  user: "User",
  admin: "Admin",
  staff: "Staff",
};

export const UsersTable: React.FC<UsersTableProps> = ({ users, onEdit }) => {
  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
        No users found for this view. Try switching the list type or refreshing.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm shadow-black/5 dark:shadow-white/5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Directory</p>
          <p className="mt-1 text-xs text-muted-foreground">
            End users and internal staff (your account is never listed here).
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-border">
        <table className="min-w-full border-separate border-spacing-0 text-sm">
          <thead className="bg-muted/60 text-left text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Joined</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user.id}
                className={cn(
                  "transition-colors duration-150 hover:bg-muted/40",
                  index !== 0 && "border-t border-border",
                )}
              >
                <td className="px-4 py-4 font-semibold text-foreground">{user.name}</td>
                <td className="px-4 py-4 text-sidebar-foreground/90">{user.email}</td>
                <td className="px-4 py-4 text-sidebar-foreground/90">
                  {roleLabel[user.role] ?? user.role}
                </td>
                <td className="px-4 py-4 text-sidebar-foreground/90">
                  {user.isActive ? (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Active
                    </span>
                  ) : (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 text-sidebar-foreground/90">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-right">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-2"
                    onClick={() => onEdit(user.id)}
                  >
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
