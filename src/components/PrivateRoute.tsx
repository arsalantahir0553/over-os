import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  const refresh_token = localStorage.getItem("refresh_token");
  const user_name = localStorage.getItem("user_name");

  return token && refresh_token && user_name ? (
    <Outlet />
  ) : (
    <Navigate to="/signin" replace />
  );
};

export default PrivateRoute;
