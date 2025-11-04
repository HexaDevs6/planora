import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Spinner from "../SpinnerLoader";

export default function ProtectedRoute({ children }) {
  const { user, initialized } = useSelector((state) => state.auth);

  if (!initialized) {
    return <Spinner />;
    
  }

  return user ? children : <Navigate to="/signin" replace />;
}
