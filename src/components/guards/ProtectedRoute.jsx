import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../SpinnerLoader";

export default function ProtectedRoute({ children }) {
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

    // 3) If user exists BUT role missing → allow only register page
    if (!user.role) {
        if (location.pathname !== "/register") {
            return (
                <Navigate to="/register" state={{ from: location }} replace />
            );
        }
        return children;
    }

    // 4) Role-based route protection
    if (user.role === "host" && location.pathname.startsWith("/user")) {
        return <Navigate to="/host/overview" replace />;
    }

    if (user.role === "client" && location.pathname.startsWith("/host")) {
        return <Navigate to="/user/overview" replace />;
    }

    // All good → allow rendering
    return children;
}
