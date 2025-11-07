import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../SpinnerLoader";

export default function ProtectedRoute({ children }) {
  const { user, initialized } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!initialized) return <Spinner />;

  // Not logged in at all
  if (!user) return <Navigate to="/signin" replace />;

  // Logged in but no role yet
  if (!user.role && location.pathname !== "/register") {
    return <Navigate to="/register" replace />;
  }

  // Host trying to access user routes
  if (user.role === "host" && location.pathname.startsWith("/user")) {
    return <Navigate to="/host/overview" replace />;
  }

  // Client trying to access host routes
  if (user.role === "client" && location.pathname.startsWith("/host")) {
    return <Navigate to="/user/overview" replace />;
  }

  // Otherwise, allow access
  return children;
}
