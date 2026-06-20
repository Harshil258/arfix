import { Navigate, Outlet } from "react-router-dom";

const AuthRoutes = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/" />;
  }
  return <Outlet />;
};

export default AuthRoutes;
