import { useLayoutEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setUser } from "@/store/slices/currentUserSlice";
import { fetchCurrentUser } from "@/api/authApi";

const UserRoute = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.currentUser.user);

  const profileQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
    enabled: Boolean(token) && !user,
    retry: false,
    staleTime: Infinity,
  });

  useLayoutEffect(() => {
    if (profileQuery.status !== "success" || !profileQuery.data || !token || user) return;
    const u = profileQuery.data;
    dispatch(
      setUser({
        token,
        user: {
          id: String(u.id),
          name: u.name,
          email: u.email,
          role: u.role,
          mobile: u.mobile?.trim() || undefined,
        },
      }),
    );
  }, [profileQuery.status, profileQuery.data, token, user, dispatch]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const awaitingProfile =
    Boolean(token) &&
    !user &&
    (profileQuery.isPending ||
      profileQuery.isFetching ||
      (profileQuery.status === "success" && Boolean(profileQuery.data)));

  if (awaitingProfile) {
    return (
      <Layout>
        <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
          Restoring your session…
        </div>
      </Layout>
    );
  }

  if (!user && profileQuery.isError) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return (
      <Layout>
        <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-muted-foreground shadow-sm shadow-black/5 dark:shadow-white/5">
          Restoring your session…
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default UserRoute;
