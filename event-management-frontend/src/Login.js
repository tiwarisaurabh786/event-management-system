import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginApi } from "./api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim() || !password.trim()) {
      setMsg("Email and password are required");
      return false;
    }
    return true;
  };

  const login = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      setMsg("");

      const res = await loginApi({ email, password });

      const token = res?.data?.token;
      const role = res?.data?.role;

      if (!token || !role) {
        setMsg("Invalid login response from server");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (role === "ADMIN") {
        navigate("/events", { replace: true });
      } else {
        navigate("/student-events", { replace: true });
      }
    } catch (e) {
      // Prefer backend message if available
      const message =
        e?.response?.data?.message ||
        e?.message ||
        "Login failed. Please try again.";
      setMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "40px auto",
        padding: "24px 24px 28px",
        borderRadius: "12px",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        border: "1px solid #e5e5e5"
      }}
    >
      <h2
        style={{
          margin: "0 0 16px 0",
          textAlign: "center",
          color: "#2c3e50"
        }}
      >
        Login
      </h2>
      <p
        style={{
          margin: "0 0 24px 0",
          textAlign: "center",
          fontSize: "14px",
          color: "#6c757d"
        }}
      >
        Sign in to access your events and registrations.
      </p>

      <form onSubmit={login}>
        <div style={{ marginBottom: "14px" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#495057"
            }}
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ced4da",
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              marginBottom: "6px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#495057"
            }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "8px",
              border: "1px solid #ced4da",
              fontSize: "14px",
              outline: "none"
            }}
          />
        </div>

        {msg && (
          <div
            style={{
              marginBottom: "12px",
              fontSize: "13px",
              color: "#dc3545",
              textAlign: "center"
            }}
          >
            {msg}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
            backgroundColor: loading ? "#6c757d" : "#007bff",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: "15px",
            cursor: loading ? "not-allowed" : "pointer",
            marginBottom: "10px"
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div
        style={{
          marginTop: "4px",
          fontSize: "13px",
          textAlign: "center",
          color: "#6c757d"
        }}
      >
        Don&apos;t have an account?{" "}
        <Link
          to="/register"
          style={{
            color: "#007bff",
            textDecoration: "none",
            fontWeight: 600
          }}
        >
          Register
        </Link>
      </div>
    </div>
  );
}
