import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useTheme } from "@/context/use-theme.ts";
import {
  Sun,
  Moon,
  User,
  Users,
  LogOut,
  Bell,
  LayoutDashboard,
  Package,
  TicketPercent,
  MessageSquareText,
  UserCircle,
  Menu,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { logout } from "@/store/slices/currentUserSlice";
import { useSidebarLayout } from "@/context/sidebar-layout-context";

interface PageMeta {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  accentClass: string;
}

const pageMeta = new Map<string, PageMeta>([
  [
    "/",
    {
      title: "Dashboard overview",
      subtitle: "View your latest metrics and system health.",
      icon: <LayoutDashboard className="h-5 w-5" />,
      accentClass: "bg-primary/10 text-primary",
    },
  ],
  [
    "/products",
    {
      title: "Product catalog",
      subtitle: "Browse and manage all active products.",
      icon: <Package className="h-5 w-5" />,
      accentClass: "bg-violet-500/10 text-violet-500",
    },
  ],
  [
    "/users",
    {
      title: "User directory",
      subtitle: "Manage customers and internal staff accounts.",
      icon: <Users className="h-5 w-5" />,
      accentClass: "bg-sky-500/10 text-sky-500",
    },
  ],
  [
    "/coupons",
    {
      title: "Coupon sessions",
      subtitle: "Create batches and download printable QR PDFs.",
      icon: <TicketPercent className="h-5 w-5" />,
      accentClass: "bg-rose-500/10 text-rose-500",
    },
  ],
  [
    "/support",
    {
      title: "Support inbox",
      subtitle: "Mobile app support requests: read threads and update status.",
      icon: <MessageSquareText className="h-5 w-5" />,
      accentClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    },
  ],
  [
    "/profile",
    {
      title: "Your profile",
      subtitle: "View your account details, update contact info, and change your password.",
      icon: <UserCircle className="h-5 w-5" />,
      accentClass: "bg-primary/10 text-primary",
    },
  ],
]);

const fallbackMeta: PageMeta = {
  title: "Admin panel",
  subtitle: "Manage your workspace with ease.",
  icon: <LayoutDashboard className="h-5 w-5" />,
  accentClass: "bg-primary/10 text-primary",
};

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={toggleTheme}
      className="gap-2 rounded-full px-3"
      type="button"
    >
      {theme === "dark" ? <Moon className="h-4 w-4 shrink-0" /> : <Sun className="h-4 w-4 shrink-0" />}
      <span className="hidden sm:inline">{theme === "dark" ? "Dark" : "Light"}</span>
    </Button>
  );
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.currentUser.user);
  const { openMobileSidebar } = useSidebarLayout();

  const pathname =
    location.pathname === "/" ? "/" : `/${location.pathname.split("/")[1]}`;

  const meta = pageMeta.get(pathname) ?? fallbackMeta;

  const initials =
    currentUser?.name
      ?.split(/\s+/)
      .filter(Boolean)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="rounded-[32px] border border-border bg-card p-4 shadow-sm shadow-black/5 dark:shadow-white/5 sm:p-6">
      <div className="flex justify-between items-centers gap-4">

        <div className="flex gap-4 sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="shrink-0 rounded-full lg:hidden"
            onClick={openMobileSidebar}
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
            <div
              className={cn(
                "grid h-11 w-11 shrink-0 place-items-center rounded-2xl sm:h-12 sm:w-12",
                meta.accentClass,
              )}
            >
              {meta.icon}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground sm:text-sm">{meta.subtitle}</p>
              <h1 className="mt-0.5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                {meta.title}
              </h1>
            </div>
          </div>
        </div>
        <div className="flex min-w-0 items-center gap-2 sm:gap-3 lg:justify-end">


          {/* <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:hidden">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-2xl border border-primary bg-primary/10 text-sm font-bold text-primary sm:h-10 sm:w-10">
              A
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">ARFIX</p>
              <p className="truncate text-xs text-muted-foreground">Panel</p>
            </div>
          </div> */}

          <span className="min-w-[0.5rem] flex-1 lg:hidden" aria-hidden />

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:ml-0">
            <ThemeToggle />

            <Button variant="secondary" size="icon" className="relative shrink-0 rounded-full" type="button">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="max-w-[200px] gap-2 rounded-full px-2 pr-3" type="button">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarImage src="/avatar.png" alt={currentUser?.name ?? "User"} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden truncate text-sm font-medium sm:inline">
                    {currentUser?.name ?? "Account"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  {currentUser?.email ?? ""}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2" onSelect={() => navigate("/profile")}>
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
