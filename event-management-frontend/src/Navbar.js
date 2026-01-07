import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/", { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  if (!token) {
    return (
      <nav
        style={{
          padding: "12px 24px",
          borderBottom: "1px solid #e5e5e5",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#ffffff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.04)"
        }}
      >
        <div style={{ fontWeight: 700, fontSize: "18px", color: "#2c3e50" }}>
          Event Portal
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link
            to="/"
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              textDecoration: "none",
              color: isActive("/") ? "#ffffff" : "#007bff",
              backgroundColor: isActive("/") ? "#007bff" : "transparent",
              fontWeight: 500
            }}
          >
            Login
          </Link>
          <Link
            to="/register"
            style={{
              padding: "8px 14px",
              borderRadius: "6px",
              textDecoration: "none",
              color: isActive("/register") ? "#ffffff" : "#28a745",
              backgroundColor: isActive("/register") ? "#28a745" : "transparent",
              fontWeight: 500,
              border: "1px solid #28a745"
            }}
          >
            Register
          </Link>
        </div>
      </nav>
    );
  }

  return (
    <nav
      style={{
        padding: "12px 24px",
        borderBottom: "1px solid #e5e5e5",
        marginBottom: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.04)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}
    >
      <div style={{ fontWeight: 700, fontSize: "18px", color: "#2c3e50" }}>
        Event Portal
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {role === "STUDENT" && (
          <>
            <Link
              to="/student-events"
              style={{
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                color: isActive("/student-events") ? "#ffffff" : "#007bff",
                backgroundColor: isActive("/student-events")
                  ? "#007bff"
                  : "transparent",
                fontWeight: 500
              }}
            >
              Events
            </Link>
            <Link
              to="/my"
              style={{
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                color: isActive("/my") ? "#ffffff" : "#17a2b8",
                backgroundColor: isActive("/my") ? "#17a2b8" : "transparent",
                fontWeight: 500
              }}
            >
              My Registrations
            </Link>
          </>
        )}

        {role === "ADMIN" && (
          <>
            <Link
              to="/events"
              style={{
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                color: isActive("/events") ? "#ffffff" : "#007bff",
                backgroundColor: isActive("/events") ? "#007bff" : "transparent",
                fontWeight: 500
              }}
            >
              All Events
            </Link>
            <Link
              to="/admin-events"
              style={{
                textDecoration: "none",
                padding: "8px 12px",
                borderRadius: "6px",
                color: isActive("/admin-events") ? "#ffffff" : "#28a745",
                backgroundColor: isActive("/admin-events")
                  ? "#28a745"
                  : "transparent",
                fontWeight: 500
              }}
            >
              Create Event
            </Link>
          </>
        )}

        <button
          onClick={logout}
          style={{
            marginLeft: "8px",
            padding: "8px 14px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#dc3545",
            color: "white",
            cursor: "pointer",
            fontWeight: 500
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
