import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Package,
  Users,
  TicketPercent,
  MessageSquareText,
  Wallet,
  ArrowDownToLine,
} from "lucide-react";
import type { AppUserRole } from "@/api/userApi";

export type AppNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  requireStaff?: boolean;
  requireAdmin?: boolean;
};

export const APP_NAV_ITEMS: AppNavItem[] = [
  { label: "Dashboard", to: "/", icon: LayoutDashboard },
  { label: "Products", to: "/products", icon: Package },
  { label: "Users", to: "/users", icon: Users, requireAdmin: true },
  { label: "Razorpay", to: "/razorpay", icon: Wallet, requireAdmin: true },
  { label: "Withdrawals", to: "/withdrawals", icon: ArrowDownToLine, requireAdmin: true },
  { label: "Coupons", to: "/coupons", icon: TicketPercent, requireStaff: true },
  { label: "Support", to: "/support", icon: MessageSquareText, requireStaff: true },
];

export function filterNavItemsForRole(role: AppUserRole | undefined): AppNavItem[] {
  return APP_NAV_ITEMS.filter((item) => {
    if (item.requireAdmin) return role === "admin";
    if (item.requireStaff) return role === "admin" || role === "staff";
    return true;
  });
}
