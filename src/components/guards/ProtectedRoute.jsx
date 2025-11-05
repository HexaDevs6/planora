import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../SpinnerLoader";

export default function ProtectedRoute({ children }) {
  const { user, initialized } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!initialized) return <Spinner />;

  // لو معندوش session خالص
  if (!user) return <Navigate to="/signin" replace />;

  // 👇 أهم خطوة: لو معندوش role يروح يكمل بياناته
  if (!user.role && location.pathname !== "/register") {
    return <Navigate to="/register" replace />;
  }

  return children;
}