import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import Spinner from "../SpinnerLoader";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
    const { user, initialized, isAuthenticated } = useSelector(
        (state) => state.auth
    );
    const location = useLocation();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        // Add any additional authentication checks here
        setIsChecking(false);
    }, [user, isAuthenticated]);

    if (!initialized || isChecking) return <Spinner />;

    // Not logged in at all
    if (!isAuthenticated || !user) {
        return <Navigate to='/signin' state={{ from: location }} replace />;
    }

    // Logged in but no role yet
    if (!user.role && location.pathname !== "/register") {
        return <Navigate to='/register' state={{ from: location }} replace />;
    }

    // Host trying to access user routes
    if (user.role === "host" && location.pathname?.startsWith("/user")) {
        return <Navigate to='/host/overview' replace />;
    }

    // Client trying to access host routes
    if (user.role === "client" && location.pathname?.startsWith("/host")) {
        return <Navigate to='/user/overview' replace />;
    }

    // Additional validation
    if (!location.pathname) {
        return <Navigate to='/' replace />;
    }

    return children;
}

