import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function CheckAuth() {
  const { isAuthenticated, isInitialized } = useSelector((state) => state.auth);

  if (!isInitialized) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (
    !isAuthenticated &&
    !(
      location.pathname.includes("/login") ||
      location.pathname.includes("/register")
    )
  ) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}

export default CheckAuth;
