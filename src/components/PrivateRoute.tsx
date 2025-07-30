import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  const refresh_token = localStorage.getItem("refresh_token");

  return token && refresh_token ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default PrivateRoute;
