import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProtectedRoutes = () => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    // Redirect to login and save the page user wanted to visit
    return (
      <Navigate to="/?mode=login" replace state={{ from: location.pathname }} />
    );
  }

  return <Outlet />;
};

export default ProtectedRoutes;
