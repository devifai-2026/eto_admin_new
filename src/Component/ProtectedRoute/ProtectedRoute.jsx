import { Navigate } from "react-router-dom";
import loginAPI from "../../apis/Login";

const ProtectedRoute = ({
  children,
  allowedUserTypes = ["admin", "franchise"],
}) => {
  // Check if user is authenticated
  const isAuthenticated = loginAPI.isLoggedIn();

  // Get current user type
  const userType = loginAPI.getUserType();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user type is allowed for this route
  if (!allowedUserTypes.includes(userType)) {
    // If user doesn't have permission, redirect to dashboard or show 403
    if (userType === "admin") {
      return <Navigate to="/" replace />;
    } else {
      return <Navigate to="/all-drivers" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
