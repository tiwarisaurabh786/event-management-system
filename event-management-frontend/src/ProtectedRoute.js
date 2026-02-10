import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
