import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function PublicRoute({ children }) {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return !user ? children : <Navigate to="/user" replace />;
}
