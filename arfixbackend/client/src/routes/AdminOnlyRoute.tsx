import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

const AdminOnlyRoute = () => {
  const role = useAppSelector((s) => s.currentUser.user?.role);

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminOnlyRoute;
