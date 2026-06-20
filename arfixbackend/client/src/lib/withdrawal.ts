import type { WithdrawalItem, WithdrawalStatus, WithdrawalUserRef } from "@/api/withdrawalApi";

export const withdrawalStatusLabel: Record<WithdrawalStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  completed: "Completed",
  failed: "Failed",
};

export const withdrawalStatusClass: Record<WithdrawalStatus, string> = {
  pending: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  approved: "bg-sky-500/15 text-sky-700 dark:text-sky-400",
  rejected: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
  completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  failed: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};

export function getWithdrawalUser(
  user: WithdrawalItem["user"],
): WithdrawalUserRef | null {
  if (!user || typeof user === "string") return null;
  return user;
}

export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;
  return `•••• ${accountNumber.slice(-4)}`;
}
