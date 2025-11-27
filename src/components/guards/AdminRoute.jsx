import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../SpinnerLoader";

export default function AdminRoute({ children }) {
    const { user, initialized, isAuthenticated } = useSelector(
        (state) => state.auth
    );
    const location = useLocation();

    // 1) Don't render anything UNTIL auth listener has finished initial load
    if (!initialized) {
        return <Spinner />;
    }

    // 2) No authenticated session -> redirect to signin
    if (!isAuthenticated || !user) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    // 4) Role-based route protection
    if (user.role === "admin" && location.pathname.startsWith("/admin")) {
        return children;
    }

    // All good → allow rendering
    return <Navigate to="/signin" state={{ from: location }} replace />;
}
